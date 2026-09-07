// Verification test for SEO path routing and sitemap
const fs = require('fs');
const path = require('path');

const VALID_PAGES = new Set([
  'landing', 'sadhana', 'library', 'category', 'viewer', 'panchang',
  'more', 'admin', 'notfound', 'favorites', 'festivals', 'tirthankar',
  'pilgrimage', 'philosophy', 'rituals', 'pathshala', 'gallery',
  'explore', 'samayik', 'dietary', 'ascetics', 'muni-profiles',
  'jap', 'niyam'
]);

const parseLocation = (loc) => {
  if (!loc) return { page: 'landing', params: null };

  if (loc.hash && loc.hash.replace(/^#\/?/, '').trim()) {
    const clean = loc.hash.replace(/^#\/?/, '').trim();
    const [pathPart, queryPart] = clean.split('?');
    const pathSegments = pathPart ? pathPart.split('/').filter(Boolean) : [];
    const rawPage = pathSegments[0] || 'landing';
    const params = {};

    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((val, key) => { params[key] = val; });
    }
    if (pathSegments.length > 1 && !params.id) {
      params.id = decodeURIComponent(pathSegments[1]);
    }
    if (VALID_PAGES.has(rawPage)) {
      return { page: rawPage, params: Object.keys(params).length > 0 ? params : null };
    }
  }

  const pathname = (loc.pathname || '/').replace(/^\//, '').trim();
  const search = loc.search || '';
  const pathSegments = pathname ? pathname.split('/').filter(Boolean) : [];
  const rawPage = pathSegments[0] || 'landing';
  const params = {};

  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((val, key) => { params[key] = val; });
  }

  if (pathSegments.length > 1 && !params.id) {
    params.id = decodeURIComponent(pathSegments[1]);
  }

  if (rawPage === '' || rawPage === 'index.html' || rawPage === 'landing') {
    return { page: 'landing', params: null };
  }

  if (VALID_PAGES.has(rawPage)) {
    return { page: rawPage, params: Object.keys(params).length > 0 ? params : null };
  }

  return { page: 'notfound', params: null };
};

const buildPath = (page, params) => {
  if (!page || page === 'landing') return '/';
  if (!params || Object.keys(params).length === 0) return `/${page}`;

  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key !== 'previousPage' && key !== 'previousParams' && value !== undefined && value !== null && value !== '') {
      urlParams.set(key, String(value));
    }
  }
  const queryString = urlParams.toString();
  return queryString ? `/${page}?${queryString}` : `/${page}`;
};

// Tests
const tests = [
  {
    name: 'Direct path with query /viewer?id=bhaktamar',
    loc: { pathname: '/viewer', search: '?id=bhaktamar', hash: '' },
    expected: { page: 'viewer', params: { id: 'bhaktamar' } },
  },
  {
    name: 'Direct path segment /viewer/bhaktamar',
    loc: { pathname: '/viewer/bhaktamar', search: '', hash: '' },
    expected: { page: 'viewer', params: { id: 'bhaktamar' } },
  },
  {
    name: 'Category path /category?id=stotra',
    loc: { pathname: '/category', search: '?id=stotra', hash: '' },
    expected: { page: 'category', params: { id: 'stotra' } },
  },
  {
    name: 'Tirthankar path /tirthankar?id=mahavir-swami',
    loc: { pathname: '/tirthankar', search: '?id=mahavir-swami', hash: '' },
    expected: { page: 'tirthankar', params: { id: 'mahavir-swami' } },
  },
  {
    name: 'Root path /',
    loc: { pathname: '/', search: '', hash: '' },
    expected: { page: 'landing', params: null },
  },
  {
    name: 'Hash backwards compatibility /#viewer?id=samaysar',
    loc: { pathname: '/', search: '', hash: '#viewer?id=samaysar' },
    expected: { page: 'viewer', params: { id: 'samaysar' } },
  },
];

let failed = 0;
for (const t of tests) {
  const result = parseLocation(t.loc);
  const matched = JSON.stringify(result) === JSON.stringify(t.expected);
  if (!matched) {
    console.error(`FAIL: ${t.name}\n  Expected: ${JSON.stringify(t.expected)}\n  Got: ${JSON.stringify(result)}`);
    failed++;
  } else {
    console.log(`PASS: ${t.name}`);
  }
}

// Check sitemap.xml exists and has > 500 URLs
const sitemapPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('FAIL: sitemap.xml does not exist');
  failed++;
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const urlCount = (sitemapContent.match(/<url>/g) || []).length;
  if (urlCount < 500) {
    console.error(`FAIL: sitemap only has ${urlCount} URLs, expected > 500`);
    failed++;
  } else {
    console.log(`PASS: sitemap.xml contains ${urlCount} URLs (>= 500)`);
  }
}

if (failed === 0) {
  console.log('\nAll SEO routing and sitemap checks passed!');
} else {
  process.exit(1);
}
