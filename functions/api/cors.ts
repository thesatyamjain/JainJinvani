/**
 * CORS helper for Cloudflare Pages Functions
 * Restricts cross-origin requests to trusted origins only.
 */

export function isAllowedOrigin(origin: string | null, env?: Record<string, any>): boolean {
  if (!origin) return false;

  if (env?.ALLOWED_ORIGINS) {
    const allowed = String(env.ALLOWED_ORIGINS)
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.includes(origin.toLowerCase())) return true;
  }

  try {
    const parsed = new URL(origin);
    const host = parsed.hostname.toLowerCase();

    // Production domains
    if (host === 'jainjinvani.org' || host === 'www.jainjinvani.org') return true;

    // Cloudflare Pages deployments (production and preview branches)
    if (host === 'pages.dev' || host.endsWith('.pages.dev')) return true;

    // Local development
    if (host === 'localhost' || host === '127.0.0.1') return true;
  } catch {
    return false;
  }

  return false;
}

export function getCorsHeaders(
  request: Request,
  env?: Record<string, any>,
  methods: string = 'GET, POST, OPTIONS'
): Record<string, string> {
  const origin = request.headers.get('Origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  if (isAllowedOrigin(origin, env)) {
    headers['Access-Control-Allow-Origin'] = origin!;
  }

  return headers;
}

export function handleOptionsResponse(
  request: Request,
  env?: Record<string, any>,
  methods: string = 'GET, POST, OPTIONS'
): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env, methods),
  });
}
