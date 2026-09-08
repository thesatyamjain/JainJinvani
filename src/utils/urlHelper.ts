export const VALID_PAGES = new Set([
  'landing', 'sadhana', 'library', 'category', 'viewer', 'panchang',
  'more', 'admin', 'notfound', 'favorites', 'festivals', 'tirthankar',
  'pilgrimage', 'philosophy', 'rituals', 'pathshala', 'gallery',
  'explore', 'samayik', 'dietary', 'ascetics', 'muni-profiles',
  'jap', 'niyam', 'daily-puja'
]);

export interface ParsedRoute {
  page: string;
  params: Record<string, any> | null;
}

/**
 * Parse browser URL hash into page and structured params.
 * Supports:
 * - Query strings: `#viewer?id=bhaktamar`, `#/viewer?id=bhaktamar`, `#category?id=stotra`
 * - REST-like paths: `#/viewer/bhaktamar`, `#viewer/bhaktamar`, `#/category/stotra`
 * - Standard pages: `#sadhana`, `#library`, `#festivals`
 */
export const parseHash = (hashStr: string): ParsedRoute => {
  if (!hashStr) {
    return { page: 'landing', params: null };
  }

  // Remove leading '#' and optional leading '/'
  const clean = hashStr.replace(/^#\/?/, '').trim();
  if (!clean) {
    return { page: 'landing', params: null };
  }

  // Separate path from query string
  const [pathPart, queryPart] = clean.split('?');
  const pathSegments = pathPart ? pathPart.split('/').filter(Boolean) : [];
  const rawPage = pathSegments[0] || 'landing';

  const params: Record<string, any> = {};

  // Parse query parameters if present
  if (queryPart) {
    try {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
    } catch {
      // Ignore URLSearchParams error on malformed query strings
    }
  }

  // Support REST-like paths as fallback: #/viewer/:id, #/category/:id, #/tirthankar/:id
  if (pathSegments.length > 1 && !params.id) {
    params.id = decodeURIComponent(pathSegments[1]);
  }

  if (VALID_PAGES.has(rawPage)) {
    return {
      page: rawPage,
      params: Object.keys(params).length > 0 ? params : null,
    };
  }

  return { page: 'notfound', params: null };
};

/**
 * Parse current browser URL (path, query string, or hash) into a valid page and parameters.
 * Prioritizes standard path routing (SEO-friendly) with transparent hash fallback.
 */
export const parseLocation = (loc?: { pathname?: string; search?: string; hash?: string } | null): ParsedRoute => {
  if (!loc && typeof window !== 'undefined') {
    loc = window.location;
  }
  if (!loc) {
    return { page: 'landing', params: null };
  }

  // 1. If hash exists and is non-empty, handle hash route for backwards compatibility
  if (loc.hash && loc.hash.replace(/^#\/?/, '').trim()) {
    const fromHash = parseHash(loc.hash);
    if (fromHash.page !== 'notfound') {
      return fromHash;
    }
  }

  // 2. Otherwise parse path & query string (Googlebot and standard navigation)
  const pathname = (loc.pathname || '/').replace(/^\//, '').trim();
  const search = loc.search || '';

  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : [];
  const rawPage = pathSegments[0] || 'landing';

  const params: Record<string, any> = {};

  if (search) {
    try {
      const searchParams = new URLSearchParams(search);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
    } catch {
      // Ignore URLSearchParams error
    }
  }

  // Support REST-like path segments: /viewer/:id, /category/:id, /tirthankar/:id
  if (pathSegments.length > 1 && !params.id) {
    params.id = decodeURIComponent(pathSegments[1]);
  }

  if (rawPage === '' || rawPage === 'index.html' || rawPage === 'landing') {
    return { page: 'landing', params: null };
  }

  if (VALID_PAGES.has(rawPage)) {
    return {
      page: rawPage,
      params: Object.keys(params).length > 0 ? params : null,
    };
  }

  return { page: 'notfound', params: null };
};

/**
 * Build a canonical hash string from page name and params.
 * Filters out transient internal navigation metadata like previousPage / previousParams.
 */
export const buildHash = (page: string, params?: Record<string, any> | null): string => {
  if (!page || page === 'landing') {
    return '#landing';
  }

  if (!params || Object.keys(params).length === 0) {
    return `#${page}`;
  }

  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    // Exclude transient navigation flow state from the public URL
    if (
      key !== 'previousPage' &&
      key !== 'previousParams' &&
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      urlParams.set(key, String(value));
    }
  }

  const queryString = urlParams.toString();
  return queryString ? `#${page}?${queryString}` : `#${page}`;
};

/**
 * Build a clean, SEO-friendly path URL (e.g. /viewer?id=bhaktamar or /category?id=stotra).
 */
export const buildPath = (page: string, params?: Record<string, any> | null): string => {
  if (!page || page === 'landing') {
    return '/';
  }

  if (!params || Object.keys(params).length === 0) {
    return `/${page}`;
  }

  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (
      key !== 'previousPage' &&
      key !== 'previousParams' &&
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      urlParams.set(key, String(value));
    }
  }

  const queryString = urlParams.toString();
  return queryString ? `/${page}?${queryString}` : `/${page}`;
};

/**
 * Generate full absolute canonical share URL for any page and parameters.
 * Produces clean path-based URLs suitable for Google Search indexing and social sharing.
 */
export const getCanonicalShareUrl = (page: string, params?: Record<string, any> | null): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jainjinvani.pages.dev';
  const path = buildPath(page, params);
  return `${origin}${path}`;
};
