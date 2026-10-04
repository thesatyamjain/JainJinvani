/**
 * Lightweight sliding/fixed-window rate limiter powered by Cloudflare KV
 */

export async function isRateLimited(
  env: Record<string, any>,
  prefix: string,
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> {
  const kv = env?.JINVANI_KV;
  if (!kv) return false; // If KV is not bound, gracefully allow

  const key = `ratelimit:${prefix}:${identifier}`;
  const current = Number((await kv.get(key)) || 0);

  if (current >= maxRequests) {
    return true;
  }

  await kv.put(key, String(current + 1), { expirationTtl: windowSeconds });
  return false;
}
