/**
 * Cloudflare Pages Function — Admin authentication
 * Endpoint: POST /api/auth
 *
 * All admin secrets live in Cloudflare env (Pages > Settings > Variables, type "Secret"):
 *   ADMIN_PASSWORD_HASH    (required) sha256 hex of the admin password
 *   ADMIN_SESSION_SECRET   (required) long random string used to sign session tokens
 *   ADMIN_TOTP_SECRET      (optional) base32 TOTP secret; when set, 2FA is mandatory
 *   ADMIN_RECOVERY_HASHES  (optional) comma-separated sha256 hex of one-time recovery codes
 * Optional binding: JINVANI_KV — enables per-IP lockout after 5 failed attempts.
 *
 * Request bodies:
 *   { password }              -> { ok, token } | { ok:false, needOtp:true }
 *   { password, otp }         -> { ok, token }            (otp may be a recovery code)
 *   { otp } + Bearer <token>  -> { ok }                   (dashboard "test OTP")
 */

import { getCorsHeaders, handleOptionsResponse } from './cors.ts';

const SESSION_TTL_MS = 60 * 60 * 1000;
const MAX_FAILS = 5;
const LOCKOUT_SEC = 300;

const json = (body: unknown, status = 200, cors: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export async function onRequestOptions(context: { request: Request; env: Record<string, any> }): Promise<Response> {
  return handleOptionsResponse(context.request, context.env, 'POST, OPTIONS');
}

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');

export const sha256Hex = async (s: string) => toHex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

// Constant-time string compare (avoids leaking match length via timing).
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacHex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}

// --- TOTP (RFC 6238, SHA-1, 30s, 6 digits) ---
function base32ToBytes(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  for (const c of base32.toUpperCase().replace(/[^A-Z2-7]/g, '')) bits += alphabet.indexOf(c).toString(2).padStart(5, '0');
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  return bytes;
}

export async function generateTOTP(secretBase32: string, epochSeconds: number, digits = 6): Promise<string> {
  const key = await crypto.subtle.importKey('raw', base32ToBytes(secretBase32), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const step = Math.floor(epochSeconds / 30);
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(step / 0x100000000));
  view.setUint32(4, step >>> 0);
  const h = new Uint8Array(await crypto.subtle.sign('HMAC', key, buf));
  const o = h[h.length - 1] & 0x0f;
  const bin = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

async function verifyOtp(env: Record<string, any>, input: string): Promise<boolean> {
  const code = input.replace(/\s+/g, '').toUpperCase();
  if (/^\d{6}$/.test(code) && env.ADMIN_TOTP_SECRET) {
    const now = Math.floor(Date.now() / 1000);
    for (const drift of [0, -30, 30]) {
      if (safeEqual(await generateTOTP(env.ADMIN_TOTP_SECRET, now + drift), code)) return true;
    }
  }
  // ponytail: recovery codes are not burned after use (no state store); rotate ADMIN_RECOVERY_HASHES after using one.
  const recovery = String(env.ADMIN_RECOVERY_HASHES || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (recovery.length) {
    const h = await sha256Hex(code);
    if (recovery.some((r) => safeEqual(r, h))) return true;
  }
  return false;
}

// --- Session tokens: "<expiryMs>.<hmac>" ---
export async function issueSession(secret: string, now = Date.now()): Promise<string> {
  const exp = String(now + SESSION_TTL_MS);
  return `${exp}.${await hmacHex(secret, exp)}`;
}

export async function verifySessionToken(secret: string, token: string, now = Date.now()): Promise<boolean> {
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !secret || Number(exp) < now) return false;
  return safeEqual(sig, await hmacHex(secret, exp));
}

/** Use from any privileged endpoint: `if (!(await verifySession(request, env))) return 401`. */
export async function verifySession(request: Request, env: Record<string, any>): Promise<boolean> {
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  return !!token && verifySessionToken(env.ADMIN_SESSION_SECRET, token);
}

export async function onRequestPost(context: { request: Request; env: Record<string, any> }): Promise<Response> {
  const { request, env } = context;
  const cors = getCorsHeaders(request, env, 'POST, OPTIONS');

  if (!env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) {
    return json({ ok: false, error: 'एडमिन प्रमाणीकरण सर्वर पर कॉन्फ़िगर नहीं है (ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET)।' }, 503, cors);
  }

  let body: { password?: string; otp?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'अमान्य अनुरोध।' }, 400, cors);
  }

  // Dashboard OTP test: requires an existing valid session, never issues a new one.
  if (!body.password && body.otp) {
    if (!(await verifySession(request, env))) return json({ ok: false, error: 'सत्र समाप्त।' }, 401, cors);
    return json({ ok: await verifyOtp(env, body.otp) }, 200, cors);
  }

  const kv = env.JINVANI_KV;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const failKey = `auth_fail:${ip}`;
  const fails = kv ? Number((await kv.get(failKey)) || 0) : 0;
  if (fails >= MAX_FAILS) {
    return json({ ok: false, error: 'अत्यधिक गलत प्रयास। 5 मिनट बाद पुनः प्रयास करें।' }, 429, cors);
  }
  const fail = async (error: string) => {
    if (kv) await kv.put(failKey, String(fails + 1), { expirationTtl: LOCKOUT_SEC });
    return json({ ok: false, error }, 401, cors);
  };

  const password = String(body.password || '').trim();
  if (!password || !safeEqual(await sha256Hex(password), String(env.ADMIN_PASSWORD_HASH).trim().toLowerCase())) {
    return fail('अमान्य क्रेडेंशियल।');
  }

  const totpRequired = Boolean(env.ADMIN_TOTP_SECRET);
  if (totpRequired) {
    if (!body.otp) return json({ ok: false, needOtp: true }, 200, cors);
    if (!(await verifyOtp(env, body.otp))) return fail('अमान्य OTP / रिकवरी कोड।');
  }

  if (kv && fails) await kv.delete(failKey);
  return json({ ok: true, token: await issueSession(env.ADMIN_SESSION_SECRET), totp: totpRequired }, 200, cors);
}
