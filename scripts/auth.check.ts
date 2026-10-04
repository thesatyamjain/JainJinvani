// Run: node scripts/auth.check.ts   (Node >= 22.6 strips types natively)
import assert from 'node:assert/strict';
import { generateTOTP, issueSession, verifySessionToken, safeEqual, sha256Hex } from '../functions/api/auth.ts';
import { isAllowedOrigin, getCorsHeaders } from '../functions/api/cors.ts';

async function main() {
  // RFC 6238 Appendix B: ASCII secret "12345678901234567890" (base32 below), T=59s -> 94287082 (8 digits)
  const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  assert.equal(await generateTOTP(RFC_SECRET, 59, 8), '94287082');
  assert.equal(await generateTOTP(RFC_SECRET, 1111111109, 8), '07081804');
  assert.equal(await generateTOTP(RFC_SECRET, 59), '287082'); // 6-digit truncation of the same value

  // Sessions: valid, expired, tampered, wrong secret, malformed
  const now = 1_000_000;
  const tok = await issueSession('s3cret', now);
  assert.equal(await verifySessionToken('s3cret', tok, now + 1000), true);
  assert.equal(await verifySessionToken('s3cret', tok, now + 60 * 60 * 1000 + 1), false, 'expired');
  const [exp, sig] = tok.split('.');
  assert.equal(await verifySessionToken('s3cret', `${Number(exp) + 999999}.${sig}`, now), false, 'tampered expiry');
  assert.equal(await verifySessionToken('other', tok, now), false, 'wrong secret');
  assert.equal(await verifySessionToken('s3cret', 'sessionStorage-true', now), false, 'forged flag');
  assert.equal(await verifySessionToken('', tok, now), false, 'unset secret fails closed');

  assert.equal(safeEqual('abc', 'abc'), true);
  assert.equal(safeEqual('abc', 'abd'), false);
  assert.equal(safeEqual('abc', 'abcd'), false);
  assert.equal(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

  assert.equal(isAllowedOrigin('https://jainjinvani.org'), true);
  assert.equal(isAllowedOrigin('https://www.jainjinvani.org'), true);
  assert.equal(isAllowedOrigin('https://preview.jainjinvani.pages.dev'), true);
  assert.equal(isAllowedOrigin('http://localhost:5173'), true);
  assert.equal(isAllowedOrigin('https://evil-attacker.com'), false);
  assert.equal(isAllowedOrigin(null), false);

  const evilReq = new Request('https://api.jainjinvani.org/api/ask', { headers: { Origin: 'https://evil.com' } });
  const goodReq = new Request('https://api.jainjinvani.org/api/ask', { headers: { Origin: 'https://jainjinvani.pages.dev' } });
  assert.equal('Access-Control-Allow-Origin' in getCorsHeaders(evilReq), false);
  assert.equal(getCorsHeaders(goodReq)['Access-Control-Allow-Origin'], 'https://jainjinvani.pages.dev');

  console.log('auth.check: all assertions passed (including CORS)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

