/**
 * SEO & Structured Data Management Utility for Jain Jinvani
 * Enables dynamic <title>, <meta>, OpenGraph, and Schema.org JSON-LD tags for Google Search.
 */

const SITE_NAME = 'जैन जिनवाणी';
const BASE_URL = 'https://jainjinvani.pages.dev';
const DEFAULT_TITLE = 'जैन जिनवाणी - Jain Jinvani | संपूर्ण जैन संग्रह';
const DEFAULT_DESC = 'सम्पूर्ण जैन धर्म ग्रंथ, भक्तामर स्तोत्र, णमोकार महामंत्र, जैन पूजा, आरती, स्तुति, चालीसा, तीर्थंकर परिचय एवं पंचांग का डिजिटल संग्रह।';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export function resolveOgImage(identifier: string, category?: string): string {
  const id = (identifier || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  // 1. Bhaktamar Stotra / Stotras
  if (id.includes('bhaktamar') || id.includes('kalyanmandir') || cat === 'stotra') {
    return `${BASE_URL}/og-bhaktamar.png`;
  }

  // 2. Panchang & Parva
  if (id === 'panchang' || cat === 'panchang' || id.includes('festival') || id.includes('calendar')) {
    return `${BASE_URL}/og-panchang.png`;
  }

  // 3. Samayik, Sadhana, Jap, Niyam
  if (
    ['samayik', 'niyam', 'jap', 'sadhana', 'pratikraman'].includes(id) ||
    ['samayik', 'niyam', 'jap', 'sadhana'].includes(cat) ||
    id.includes('samayik')
  ) {
    return `${BASE_URL}/og-samayik.png`;
  }

  // 4. Tirthankars, Pilgrimage & Tirth Kshetras
  if (
    id.startsWith('tirthankar') ||
    ['tirthankar', 'pilgrimage', 'tirth'].includes(cat) ||
    ['pilgrimage', 'gallery'].includes(id)
  ) {
    return `${BASE_URL}/og-tirthankar.png`;
  }

  // 5. Puja, Aarti, Vidhan, Chalisa
  if (
    ['puja', 'arti', 'aarti', 'vidhan', 'chalisa'].includes(cat) ||
    ['puja', 'arti', 'aarti', 'vidhan', 'chalisa'].includes(id) ||
    id.includes('puja') ||
    id.includes('arti') ||
    id.includes('aarti')
  ) {
    return `${BASE_URL}/og-puja.png`;
  }

  // 6. Shastra, Granthas, Philosophy
  if (
    ['shastra', 'granthas', 'philosophy'].includes(cat) ||
    ['shastra', 'granthas', 'library', 'philosophy'].includes(id) ||
    ['samaysar', 'tattvarthasutra', 'chhahdhala', 'dravyasangraha', 'gommatsar'].includes(id)
  ) {
    return `${BASE_URL}/og-shastra.png`;
  }

  // Default fallback
  return DEFAULT_IMAGE;
}

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  if (typeof document === 'undefined') return;

  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;

  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(id: string, data: Record<string, any>) {
  if (typeof document === 'undefined') return;

  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

/**
 * Update SEO metadata for specific scripture / stotra / puja content
 */
export function updateContentSeo(item: {
  id?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  description?: string;
}) {
  if (typeof document === 'undefined') return;

  const itemTitle = item.title || 'स्वाध्याय';
  const pageTitle = `${itemTitle} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}/viewer?id=${encodeURIComponent(item.id || '')}`;
  const ogImage = resolveOgImage(item.id || '', item.category);

  const description = item.description || (
    item.subtitle
      ? `${itemTitle} (${item.subtitle}) - संपूर्ण पाठ, पद्यानुवाद एवं सरल भावार्थ जैन जिनवाणी पर पढ़ें।`
      : `${itemTitle} - प्रामाणिक जैन पाठ, हिंदी अनुवाद एवं भावार्थ।`
  );

  document.title = pageTitle;
  setMetaTag('name', 'description', description);
  setCanonicalUrl(canonicalUrl);

  // Open Graph
  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:image:secure_url', ogImage);
  setMetaTag('property', 'og:type', 'article');

  // Twitter
  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:url', canonicalUrl);
  setMetaTag('name', 'twitter:image', ogImage);

  // Schema.org Article / CreativeWork
  setJsonLd('jinvani-seo-schema', {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    'headline': itemTitle,
    'description': description,
    'image': ogImage,
    'inLanguage': 'hi',
    'genre': item.category ? `Jain ${item.category}` : 'Jainism Literature',
    'author': {
      '@type': 'Person',
      'name': item.author || 'परंपरागत जैन आचार्य',
    },
    'publisher': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': BASE_URL,
      'email': 'thesoftwarecompany@zohomail.in',
      'logo': {
        '@type': 'ImageObject',
        'url': DEFAULT_IMAGE,
      },
    },
  });
}

/**
 * Update SEO metadata for a Tirthankar profile
 */
export function updateTirthankarSeo(tirthankar: {
  id: string;
  nameHindi: string;
  titleHindi?: string;
  symbol?: string;
  mantra?: string;
}) {
  if (typeof document === 'undefined') return;

  const pageTitle = `भगवान ${tirthankar.nameHindi} स्वामी परिचय | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}/tirthankar?id=${encodeURIComponent(tirthankar.id)}`;
  const description = `२४ तीर्थंकरों में भगवान ${tirthankar.nameHindi} का जीवन चरित्र, पंचकल्याणक, चिह्न (${tirthankar.symbol || ''}) एवं मूल मंत्र (${tirthankar.mantra || ''})।`;
  const ogImage = resolveOgImage('tirthankar', 'tirthankar');

  document.title = pageTitle;
  setMetaTag('name', 'description', description);
  setCanonicalUrl(canonicalUrl);

  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:image:secure_url', ogImage);

  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);

  setJsonLd('jinvani-seo-schema', {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    'name': `भगवान ${tirthankar.nameHindi} स्वामी`,
    'description': description,
    'image': ogImage,
    'url': canonicalUrl,
    'inLanguage': 'hi',
  });
}

/**
 * Update SEO metadata for Category Listing pages
 */
export function updateCategorySeo(categoryId: string, categoryTitle?: string) {
  if (typeof document === 'undefined') return;

  const catName = categoryTitle || categoryId;
  const pageTitle = `${catName} संग्रह | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}/category?id=${encodeURIComponent(categoryId)}`;
  const description = `जैन धर्म के समस्त ${catName} का प्रामाणिक, क्रमबद्ध एवं डिजिटल संग्रह अर्थ सहित।`;
  const ogImage = resolveOgImage(categoryId, categoryId);

  document.title = pageTitle;
  setMetaTag('name', 'description', description);
  setCanonicalUrl(canonicalUrl);

  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:image:secure_url', ogImage);

  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', ogImage);
}

/**
 * Reset SEO metadata to site default (Homepage / Generic pages)
 */
export function resetSeoToDefault(pageName?: string) {
  if (typeof document === 'undefined') return;

  const titles: Record<string, string> = {
    sadhana: `दैनिक साधना एवं नित्य नियम | ${SITE_NAME}`,
    library: `जैन ग्रंथालय एवं शास्त्र संग्रह | ${SITE_NAME}`,
    panchang: `जैन पंचांग, पर्व व व्रत तिथियाँ | ${SITE_NAME}`,
    festivals: `जैन महापर्व एवं उत्सव परिचय | ${SITE_NAME}`,
    pilgrimage: `पवित्र जैन तीर्थ वंदना एवं सिद्धक्षेत्र | ${SITE_NAME}`,
    jap: `जाप माला एवं णमोकार महामंत्र साधना | ${SITE_NAME}`,
    samayik: `सामायिक साधना एवं प्रतिक्रमण | ${SITE_NAME}`,
    niyam: `दैनिक संयम एवं नियम प्रतिज्ञा | ${SITE_NAME}`,
    gallery: `जैन चित्रशाला एवं तीर्थंकर दर्शन | ${SITE_NAME}`,
    pathshala: `जैन संस्कार पाठशाला एवं बाल स्वाध्याय | ${SITE_NAME}`,
  };

  const pageTitle = (pageName && titles[pageName]) ? titles[pageName] : DEFAULT_TITLE;
  const canonicalUrl = pageName && pageName !== 'landing' ? `${BASE_URL}/${pageName}` : BASE_URL;
  const ogImage = pageName ? resolveOgImage(pageName, pageName) : DEFAULT_IMAGE;

  document.title = pageTitle;
  setMetaTag('name', 'description', DEFAULT_DESC);
  setCanonicalUrl(canonicalUrl);

  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', DEFAULT_DESC);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:image:secure_url', ogImage);

  setMetaTag('name', 'twitter:title', pageTitle);
  setMetaTag('name', 'twitter:description', DEFAULT_DESC);
  setMetaTag('name', 'twitter:image', ogImage);

  setJsonLd('jinvani-seo-schema', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': BASE_URL,
    'description': DEFAULT_DESC,
    'image': ogImage,
    'inLanguage': 'hi',
  });
}
