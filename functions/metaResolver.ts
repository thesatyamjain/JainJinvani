/**
 * Metadata Resolver for Cloudflare Pages Functions
 * Generates custom titles, descriptions, and OpenGraph data for social bots (WhatsApp, Telegram, Twitter, etc.)
 */

export interface MetaData {
  title: string;
  description: string;
  image?: string;
  url: string;
}

const SITE_NAME = 'जैन जिनवाणी';
const BASE_URL = 'https://jainjinvani.pages.dev';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

function resolveOgImage(identifier: string, category?: string): string {
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

// Pre-mapped prominent scriptures and sadhana items
const KNOWN_ITEMS: Record<string, { title: string; desc: string; category?: string }> = {
  'bhaktamar-stotra': {
    title: 'श्री भक्तामर स्तोत्र (४८ काव्य)',
    desc: 'आचार्य मानतुंग विरचित श्री भक्तामर स्तोत्र, संस्कृत मूल, अन्वयार्थ एवं भावार्थ सहित।',
    category: 'stotra',
  },
  'bhaktamar_stotra': {
    title: 'श्री भक्तामर स्तोत्र (४८ काव्य)',
    desc: 'आचार्य मानतुंग विरचित श्री भक्तामर स्तोत्र, संस्कृत मूल, अन्वयार्थ एवं भावार्थ सहित।',
    category: 'stotra',
  },
  'meri-bhavna': {
    title: 'मेरी भावना (जिसने राग-द्वेष कामादिक...)',
    desc: 'पंडित जुगलकिशोर जी ‘युगल’ विरचित प्रसिद्ध आत्म-कल्याणकारी मेरी भावना पाठ।',
    category: 'path',
  },
  'meri_bhavna': {
    title: 'मेरी भावना',
    desc: 'पंडित जुगलकिशोर जी ‘युगल’ विरचित प्रसिद्ध आत्म-कल्याणकारी मेरी भावना पाठ।',
    category: 'path',
  },
  'samadhi-maran': {
    title: 'समाधिमरण पाठ (ईशोपनिषद्)',
    desc: 'आचार्य पूज्यपाद विरचित समाधि भावना एवं आत्म-शांति पाठ।',
    category: 'path',
  },
  'samayik-path': {
    title: 'सामायिक पाठ',
    desc: '४८ मिनट समता साधना, इर्यावही एवं आत्म-विशुद्धि पाठ।',
    category: 'samayik',
  },
  'alochana-path': {
    title: 'आलोचना पाठ',
    desc: 'दिन-प्रतिदिन के प्रमाद व दोषों की क्षमा याचना हेतु आलोचना पाठ।',
    category: 'path',
  },
  'chhahdhala': {
    title: 'पंडित दौलतराम जी विरचित छहढाला',
    desc: 'चार गति दुःख, सम्यग्दर्शन-ज्ञान-चारित्र एवं मोक्षमार्ग का सार।',
    category: 'shastra',
  },
  'tattvarthasutra': {
    title: 'तत्त्वार्थ सूत्र (आचार्य उमास्वामी)',
    desc: 'मोक्षमार्गस्य नेतारं भेत्तारं कर्मभूभृताम् - संपूर्ण १० अध्याय सूत्र व अर्थ।',
    category: 'shastra',
  },
  'samaysar': {
    title: 'परमागम समयसार (आचार्य कुन्दकुन्द)',
    desc: 'शुद्ध जीवास्तिकाय एवं अध्यात्म का शिरोमणि ग्रंथ।',
    category: 'shastra',
  },
  'barah-bhavna': {
    title: 'बारह भावना (अनित्य, अशरण, संसार...)',
    desc: 'वैराग्य एवं चित्त की निर्मलता हेतु १२ भावनाओं का चिंतन।',
    category: 'path',
  },
  'namokar-mantra': {
    title: 'णमोकार महामंत्र महिमा व ध्यान',
    desc: 'नमो अरिहंताणं, नमो सिद्धाणं, नमो आयरियाणं, नमो उवज्झायाणं, नमो लोए सव्वसाहूणं।',
    category: 'jap',
  },
  'kalyanmandir-stotra': {
    title: 'श्री कल्याणमंदिर स्तोत्र',
    desc: 'आचार्य कुमुदचंद्र (सिद्धसेन दिवाकर) विरचित श्री पार्श्वनाथ स्तोत्र।',
    category: 'stotra',
  },
  'ekibhaav-stotra': {
    title: 'श्री एकीभाव स्तोत्र',
    desc: 'आचार्य वादिराज विरचित आध्यात्मिक भक्ति स्तोत्र।',
    category: 'stotra',
  },
};

const CATEGORY_NAMES: Record<string, { title: string; desc: string }> = {
  puja: { title: 'नित्य पूजा संग्रह', desc: 'देव-शास्त्र-गुरु, तीर्थंकर एवं पर्व पूजन की प्रामाणिक विधि।' },
  vidhan: { title: 'महामंडल विधान संग्रह', desc: 'सिद्धचक्र, भक्तामर, दशलक्षण एवं तीर्थंकर विधान।' },
  stotra: { title: 'स्तोत्र संग्रह', desc: 'भक्तामर, कल्याणमंदिर, एकीभाव एवं शांति स्तोत्र पाठ।' },
  arti: { title: 'आरती संग्रह', desc: 'पंचपरमेष्ठी, २४ तीर्थंकर व जिनवाणी मंगल दीप आरती।' },
  aarti: { title: 'आरती संग्रह', desc: 'पंचपरमेष्ठी, २४ तीर्थंकर व जिनवाणी मंगल दीप आरती।' },
  chalisa: { title: 'चालीसा संग्रह', desc: 'तीर्थंकर, सिद्धक्षेत्र एवं शासन देवी-देवता चालीसा।' },
  bhajan: { title: 'भक्ति भजन', desc: 'आध्यात्मिक रस धारा, प्रभु भक्ति व वैराग्य भजन।' },
  path: { title: 'पाठ व स्तुति', desc: 'मेरी भावना, समाधिमरण, आलोचना व नित्य स्वाध्याय पाठ।' },
  shastra: { title: 'प्रमुख शास्त्र व आगम', desc: 'समयसार, तत्त्वार्थ सूत्र, छहढाला एवं सिद्धांत ग्रंथ।' },
  granthas: { title: 'प्रमुख शास्त्र व आगम', desc: 'समयसार, तत्त्वार्थ सूत्र, छहढाला एवं सिद्धांत ग्रंथ।' },
  panchang: { title: 'जैन पंचांग व पर्व कैलेंडर', desc: 'वीर निर्वाण संवत्, विक्रम संवत्, तिथि व जैन पर्व।' },
  samayik: { title: '४८ मिनट सामायिक साधना', desc: 'शांत वातावरण में समता साधना और आत्म-चिंतन।' },
  jap: { title: '१०८ डिजिटल जाप माला', desc: 'णमोकार महामंत्र एवं नवकार मंत्र जाप माला।' },
  niyam: { title: 'दैनिक नियम व श्रावक व्रत', desc: 'श्रावक के १२ व्रत एवं अष्टमूल गुण ट्रैकर।' },
  pilgrimage: { title: 'तीर्थ क्षेत्र दर्शन गाइड', desc: 'सम्मेद शिखर, गिरनार, पावापुरी आदि सिद्धक्षेत्र विवरण।' },
  philosophy: { title: 'जैन दर्शन व ७ तत्त्व', desc: 'जीव, अजीव, आस्रव, बंध, संवर, निर्जरा, मोक्ष तत्व ज्ञान।' },
};

export function resolveMetadata(url: URL): MetaData {
  const pathname = url.pathname.replace(/^\/+|\/+$/g, '');
  const segments = pathname.split('/');
  const fullUrl = url.toString();

  // 1. Content Viewer route: /viewer/:id or /viewer?id=:id
  if (segments[0] === 'viewer' || url.searchParams.has('id')) {
    const id = segments[1] || url.searchParams.get('id') || '';
    const cleanId = decodeURIComponent(id).toLowerCase().replace(/_/g, '-');

    if (KNOWN_ITEMS[cleanId] || KNOWN_ITEMS[id]) {
      const item = KNOWN_ITEMS[cleanId] || KNOWN_ITEMS[id];
      return {
        title: `${item.title} | ${SITE_NAME}`,
        description: item.desc,
        image: resolveOgImage(cleanId, item.category),
        url: fullUrl,
      };
    }

    // Generic formatting for any of the 450+ content IDs
    const humanTitle = decodeURIComponent(id)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      title: `${humanTitle} | ${SITE_NAME}`,
      description: `जैन जिनवाणी पर ${humanTitle} का सम्पूर्ण पाठ, अन्वयार्थ व भावार्थ पढ़ें।`,
      image: resolveOgImage(cleanId),
      url: fullUrl,
    };
  }

  // 2. Category route: /category/:id or /category?id=:id
  if (segments[0] === 'category') {
    const cat = (segments[1] || url.searchParams.get('id') || '').toLowerCase();
    const catInfo = CATEGORY_NAMES[cat];
    if (catInfo) {
      return {
        title: `${catInfo.title} | ${SITE_NAME}`,
        description: catInfo.desc,
        image: resolveOgImage(cat, cat),
        url: fullUrl,
      };
    }
  }

  // 3. Tirthankar route: /tirthankar/:id or /tirthankar?id=:id
  if (segments[0] === 'tirthankar') {
    const tId = decodeURIComponent(segments[1] || url.searchParams.get('id') || '').replace(/[-_]/g, ' ');
    const name = tId ? tId.charAt(0).toUpperCase() + tId.slice(1) : 'भगवान';
    return {
      title: `भगवान श्री ${name} स्वामी चरित्र | ${SITE_NAME}`,
      description: `तीर्थंकर भगवान श्री ${name} स्वामी का संपूर्ण जीवन चरित्र, लांछन, माता-पिता एवं पाँच कल्याणक।`,
      image: resolveOgImage('tirthankar', 'tirthankar'),
      url: fullUrl,
    };
  }

  // 4. Standalone pages: /sadhana, /library, /panchang, /samayik, /jap, /niyam, /pilgrimage, etc.
  const pageKey = (segments[0] || '').toLowerCase();
  if (CATEGORY_NAMES[pageKey]) {
    const p = CATEGORY_NAMES[pageKey];
    return {
      title: `${p.title} | ${SITE_NAME}`,
      description: p.desc,
      image: resolveOgImage(pageKey, pageKey),
      url: fullUrl,
    };
  }

  // 5. Default Root / Home
  return {
    title: 'जैन जिनवाणी - Jain Jinvani | संपूर्ण जैन संग्रह',
    description: 'सम्पूर्ण जैन धर्म ग्रंथ, भक्तामर स्तोत्र, णमोकार महामंत्र, जैन पूजा, आरती, स्तुति, चालीसा, तीर्थंकर परिचय एवं पंचांग का डिजिटल संग्रह।',
    image: DEFAULT_IMAGE,
    url: fullUrl,
  };
}
