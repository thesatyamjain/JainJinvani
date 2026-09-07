/**
 * Sitemap Generator for Jain Jinvani
 * Generates public/sitemap.xml with 580+ canonical URLs for Google Search indexing.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://jainjinvani.pages.dev';
const projectRoot = path.resolve(__dirname, '..');
const manifestFile = path.join(projectRoot, 'src', 'data', 'modules', 'contentManifest.ts');
const tirthankarFile = path.join(projectRoot, 'src', 'data', 'tirthankaras.ts');
const sitemapFile = path.join(projectRoot, 'public', 'sitemap.xml');

// Current date in YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];

const CORE_PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'sadhana', priority: '0.9', changefreq: 'daily' },
  { path: 'library', priority: '0.9', changefreq: 'daily' },
  { path: 'panchang', priority: '0.9', changefreq: 'daily' },
  { path: 'festivals', priority: '0.8', changefreq: 'weekly' },
  { path: 'pilgrimage', priority: '0.8', changefreq: 'monthly' },
  { path: 'samayik', priority: '0.8', changefreq: 'weekly' },
  { path: 'jap', priority: '0.8', changefreq: 'weekly' },
  { path: 'niyam', priority: '0.8', changefreq: 'weekly' },
  { path: 'gallery', priority: '0.7', changefreq: 'monthly' },
  { path: 'pathshala', priority: '0.7', changefreq: 'monthly' },
  { path: 'more', priority: '0.6', changefreq: 'monthly' },
];

const CATEGORIES = [
  'puja', 'vidhan', 'stotra', 'arti', 'chalisa', 'bhajan',
  'path', 'shastra', 'agamas', 'itihas', 'bhugol', 'parva',
  'tattva', 'philosophy'
];

function extractContentIds(fileContent) {
  const ids = [];
  const regex = /"([^"]+)":\s*"[^"]+"/g;
  let match;
  while ((match = regex.exec(fileContent)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

function extractTirthankarIds(fileContent) {
  const ids = [];
  // Only extract from TIRTHANKARAS array before getTirthankarById
  const cutoff = fileContent.indexOf('export const getTirthankarById');
  const section = cutoff !== -1 ? fileContent.substring(0, cutoff) : fileContent;
  const regex = /id:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(section)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

function generate() {
  console.log('Generating comprehensive sitemap for Jain Jinvani...');

  // 1. Read Content Manifest
  let contentIds = [];
  if (fs.existsSync(manifestFile)) {
    const raw = fs.readFileSync(manifestFile, 'utf-8');
    contentIds = extractContentIds(raw);
    console.log(`Found ${contentIds.length} content items in manifest.`);
  } else {
    console.warn(`Manifest file not found: ${manifestFile}`);
  }

  // 2. Read Tirthankar Profiles (Exactly 24)
  let tirthankarIds = [];
  if (fs.existsSync(tirthankarFile)) {
    const raw = fs.readFileSync(tirthankarFile, 'utf-8');
    tirthankarIds = extractTirthankarIds(raw);
    console.log(`Found ${tirthankarIds.length} Tirthankaras.`);
  }

  const urls = [];

  // Core Pages
  for (const page of CORE_PAGES) {
    const loc = page.path ? `${BASE_URL}/${page.path}` : `${BASE_URL}/`;
    urls.push({
      loc,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  }

  // Category Pages
  for (const cat of CATEGORIES) {
    urls.push({
      loc: `${BASE_URL}/category?id=${cat}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.85',
    });
  }

  // 24 Tirthankaras
  for (const tId of tirthankarIds) {
    urls.push({
      loc: `${BASE_URL}/tirthankar?id=${tId}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.80',
    });
  }

  // Scripture & Content Items
  for (const cId of contentIds) {
    // High priority for popular Stotras, Mantras, and Shastras
    const isMajor = /bhaktamar|namokar|samaysar|tattvarth|meri-bhavna|alochana|chheh-dhala|kalyanmandir|barah-bhavna|shanti-path/i.test(cId);
    urls.push({
      loc: `${BASE_URL}/viewer?id=${cId}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: isMajor ? '0.90' : '0.75',
    });
  }

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const u of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${u.loc}</loc>\n`;
    xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    xml += `    <priority>${u.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  fs.writeFileSync(sitemapFile, xml, 'utf-8');
  console.log(`Successfully generated public/sitemap.xml with ${urls.length} URLs!`);
}

generate();
