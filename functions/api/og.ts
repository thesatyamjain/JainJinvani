/**
 * Cloudflare Pages Function: Dynamic OpenGraph Image API
 * Endpoint: /api/og?title=...&subtitle=...&badge=...&cat=...
 * Generates dynamic 1200x630 vector SVG rendered as an image
 */

export async function onRequestGet(context: {
  request: Request;
  env: Record<string, any>;
}): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);

  const title = (url.searchParams.get('title') || 'जैन जिनवाणी').slice(0, 50);
  const subtitle = (url.searchParams.get('subtitle') || 'JAIN JINVANI').slice(0, 45);
  const badge = (url.searchParams.get('badge') || '॥ णमो अरिहंताणं • णमो सिद्धाणं ॥').slice(0, 60);
  const desc = (url.searchParams.get('desc') || 'सम्पूर्ण जैन धर्म ग्रंथ, पूजा, आरती, स्तोत्र व दर्शन।').slice(0, 120);
  const cat = (url.searchParams.get('cat') || 'stotra').toLowerCase();

  // Dynamic theme colors by category
  let accentColor = '#F59E0B'; // Gold default
  let accentGlow = 'rgba(245, 158, 11, 0.45)';
  let pill1 = '४५०+ मूल ग्रंथ';
  let pill2 = 'शुद्ध देवनागरी';
  let pill3 = '१००% निःशुल्क';

  if (cat.includes('panchang')) {
    accentColor = '#38BDF8'; // Sky cyan
    accentGlow = 'rgba(56, 189, 248, 0.45)';
    pill1 = 'दैनिक तिथि व नक्षत्र';
    pill2 = 'सूर्योदय व नवकारसी';
    pill3 = 'महापर्व कैलेंडर';
  } else if (cat.includes('samayik') || cat.includes('niyam') || cat.includes('jap')) {
    accentColor = '#10B981'; // Emerald
    accentGlow = 'rgba(16, 185, 129, 0.45)';
    pill1 = '४८ मिनट साधना टाइमर';
    pill2 = 'इर्यावही पाठ';
    pill3 = 'दैनिक नियम ट्रैकर';
  } else if (cat.includes('puja') || cat.includes('arti') || cat.includes('vidhan')) {
    accentColor = '#FB923C'; // Saffron
    accentGlow = 'rgba(251, 146, 60, 0.48)';
    pill1 = 'अष्टद्रव्य पूजा विधि';
    pill2 = 'मंगल दीप आरती';
    pill3 = 'महामंडल विधान';
  } else if (cat.includes('tirthankar') || cat.includes('pilgrimage')) {
    accentColor = '#F59E0B';
    accentGlow = 'rgba(245, 158, 11, 0.48)';
    pill1 = '२४ तीर्थंकर दर्शन';
    pill2 = 'पंचकल्याणक तिथियाँ';
    pill3 = 'लांछन व निर्वाण स्थल';
  } else if (cat.includes('shastra') || cat.includes('granth')) {
    accentColor = '#FBBF24';
    accentGlow = 'rgba(251, 191, 36, 0.45)';
    pill1 = 'परमागम समयसार';
    pill2 = 'तत्त्वार्थ सूत्र';
    pill3 = 'पं. दौलतराम छहढाला';
  }

  // XML escape utility
  const esc = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="bgGrad" cx="80%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#141a2c" />
      <stop offset="55%" stop-color="#0a0e1a" />
      <stop offset="100%" stop-color="#05060A" />
    </radialGradient>
    <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#d97706" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="topGlow" cx="20%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="${accentColor}" />
    </linearGradient>
    <filter id="goldDrop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${accentColor}" flood-opacity="0.3" />
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bgGrad)" />
  <rect width="1200" height="630" fill="url(#topGlow)" />
  <circle cx="950" cy="315" r="320" fill="url(#haloGrad)" />

  <!-- Sacred Grid Dots -->
  <g opacity="0.12" fill="${accentColor}">
    ${Array.from({ length: 15 }).map((_, r) =>
      Array.from({ length: 30 }).map((_, c) =>
        `<circle cx="${c * 42 + 20}" cy="${r * 42 + 20}" r="1.5" />`
      ).join('')
    ).join('')}
  </g>

  <!-- Architectural Frame -->
  <rect x="22" y="22" width="1156" height="586" rx="20" fill="none" stroke="${accentColor}" stroke-opacity="0.25" stroke-width="1.5" />
  
  <!-- Corner Filigrees -->
  <path d="M 16 48 L 16 24 A 8 8 0 0 1 24 16 L 48 16" fill="none" stroke="${accentColor}" stroke-width="3" />
  <path d="M 1152 16 L 1176 16 A 8 8 0 0 1 1184 24 L 1184 48" fill="none" stroke="${accentColor}" stroke-width="3" />
  <path d="M 16 582 L 16 606 A 8 8 0 0 0 24 614 L 48 614" fill="none" stroke="${accentColor}" stroke-width="3" />
  <path d="M 1152 614 L 1176 614 A 8 8 0 0 0 1184 606 L 1184 582" fill="none" stroke="${accentColor}" stroke-width="3" />

  <!-- Top Badge -->
  <g transform="translate(68, 64)">
    <rect width="380" height="40" rx="20" fill="#141a2c" fill-opacity="0.8" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="1.2" />
    <circle cx="22" cy="20" r="4.5" fill="${accentColor}" />
    <text x="38" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="700" fill="#FDE68A">
      ${esc(badge)}
    </text>
  </g>

  <!-- Main Title -->
  <text x="68" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="70" font-weight="900" fill="url(#textGrad)" filter="url(#goldDrop)">
    ${esc(title)}
  </text>

  <!-- Subtitle -->
  <text x="70" y="240" font-family="'Cinzel', Georgia, serif" font-size="22" font-weight="800" fill="#FDE68A" letter-spacing="4" fill-opacity="0.9">
    ${esc(subtitle.toUpperCase())}
  </text>

  <!-- Description -->
  <text x="70" y="295" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="22" font-weight="500" fill="#CBD5E1">
    ${esc(desc)}
  </text>

  <!-- Feature Pills -->
  <g transform="translate(70, 360)">
    <g transform="translate(0, 0)">
      <rect width="180" height="42" rx="12" fill="#121828" fill-opacity="0.85" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1" />
      <text x="24" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="600" fill="#E2E8F0">${esc(pill1)}</text>
    </g>
    <g transform="translate(196, 0)">
      <rect width="180" height="42" rx="12" fill="#121828" fill-opacity="0.85" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1" />
      <text x="24" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="600" fill="#E2E8F0">${esc(pill2)}</text>
    </g>
    <g transform="translate(392, 0)">
      <rect width="180" height="42" rx="12" fill="#121828" fill-opacity="0.85" stroke="#FFFFFF" stroke-opacity="0.12" stroke-width="1" />
      <text x="24" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="600" fill="#E2E8F0">${esc(pill3)}</text>
    </g>
  </g>

  <!-- Footer Row -->
  <line x1="68" y1="520" x2="650" y2="520" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1" />
  <g transform="translate(70, 542)">
    <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="800" fill="#FBBF24">🌐 jinvani.pages.dev</text>
    <text x="220" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="15.5" font-weight="600" fill="#94A3B8">• संपूर्ण जैन धर्म संकलन</text>
  </g>

  <!-- Right Side Jinwani Sacred Graphic -->
  <g transform="translate(740, 75)">
    <!-- Book 3D Cover Background -->
    <rect x="50" y="20" width="310" height="440" rx="14" fill="#C51E28" stroke="#880E16" stroke-width="3" />
    <!-- Spine fold shadow -->
    <rect x="50" y="20" width="28" height="440" rx="14" fill="#880E16" fill-opacity="0.35" />
    <!-- Book Pages Edge -->
    <path d="M 360 40 L 385 45 L 385 435 L 360 450 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
    <path d="M 50 460 L 360 460 L 385 435 L 75 435 Z" fill="#A4161F" />
    
    <!-- Sacred Jin Symbol in Center -->
    <g transform="translate(145, 95)" stroke="#FDE68A" stroke-width="4" fill="none" stroke-linejoin="round">
      <!-- Symbolic Loka contour -->
      <path d="M 60 20 L 85 60 L 105 130 L 15 130 L 35 60 Z" />
      <circle cx="60" cy="40" r="5" fill="#FDE68A" />
      <!-- Swastika in upper heart -->
      <g transform="translate(42, 68)" stroke="#FDE68A" stroke-width="3.5" fill="none">
        <path d="M 18 0 L 18 36 M 0 18 L 36 18 M 18 0 L 36 0 M 36 18 L 36 36 M 18 36 L 0 36 M 0 18 L 0 0" />
      </g>
      <!-- Abhaya Mudra Hand -->
      <g transform="translate(30, 135)" stroke="#FDE68A" stroke-width="3.5" fill="none">
        <rect x="15" y="20" width="30" height="40" rx="6" />
        <line x1="20" y1="20" x2="20" y2="0" />
        <line x1="27" y1="20" x2="27" y2="-5" />
        <line x1="34" y1="20" x2="34" y2="-5" />
        <line x1="41" y1="20" x2="41" y2="3" />
        <!-- Chakra in palm -->
        <circle cx="30" cy="40" r="10" stroke-width="2.5" />
        <circle cx="30" cy="40" r="3" fill="#FDE68A" />
      </g>
    </g>
    <!-- Scripture Motto -->
    <text x="205" y="360" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans Devanagari', sans-serif" font-size="16" font-weight="700" fill="#FDE68A" letter-spacing="1">
      परस्परोपग्रहो जीवानाम्
    </text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}
