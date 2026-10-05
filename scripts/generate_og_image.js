const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bookImgPath = path.resolve(__dirname, '..', 'src', 'assets', '52d9a82ed1897797854817247f9d26b0426643b0.png');
const bookBase64 = fs.readFileSync(bookImgPath).toString('base64');
const bookDataUri = `data:image/png;base64,${bookBase64}`;

const BANNER_CONFIGS = [
  {
    fileName: 'og-image.png',
    kalyanakBadge: '॥ णमो अरिहंताणं • णमो सिद्धाणं ॥',
    title: 'जैन जिनवाणी',
    subBrand: 'JAIN JINVANI',
    lead: 'सम्पूर्ण जैन धर्म ग्रंथ, भक्तामर स्तोत्र, तत्त्वार्थ सूत्र, नित्य पूजा, आरती, २४ तीर्थंकर चरित्र एवं पंचांग संग्रह।',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    categoryPills: [
      { icon: 'book', text: '४५०+ मूल ग्रंथ' },
      { icon: 'feather', text: 'शुद्ध देवनागरी' },
      { icon: 'heart', text: '१००% निःशुल्क सेवा' }
    ]
  },
  {
    fileName: 'og-bhaktamar.png',
    kalyanakBadge: 'स्तोत्र शिरोमणि • आचार्य मानतुंग विरचित',
    title: 'श्री भक्तामर स्तोत्र',
    subBrand: 'BHAKTAMAR STOTRA',
    lead: '४८ काव्यों का अलौकिक व चमत्कारी स्तोत्र, संस्कृत मूल, अन्वयार्थ, सरल पद्यानुवाद, ऋद्धि एवं सिद्धि-मंत्र सहित।',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.50)',
    categoryPills: [
      { icon: 'star', text: '४८ पावन काव्य' },
      { icon: 'feather', text: 'संस्कृत मूल व अन्वयार्थ' },
      { icon: 'headphones', text: 'ऑडियो पाठ सहित' }
    ]
  },
  {
    fileName: 'og-panchang.png',
    kalyanakBadge: 'दैनिक जैन पंचांग • वीर निर्वाण संवत् २५५१',
    title: 'जैन पंचांग व पर्व',
    subBrand: 'JAIN PANCHANG & CALENDAR',
    lead: 'दैनिक जैन तिथि, नक्षत्र, अष्टान्हिका, दशलक्षण महापर्व, सूर्योदय, सूर्यास्त एवं नवकारसी-चौविहार समय।',
    accentColor: '#38BDF8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    categoryPills: [
      { icon: 'calendar', text: 'दैनिक तिथि व नक्षत्र' },
      { icon: 'sun', text: 'सूर्योदय व नवकारसी' },
      { icon: 'flame', text: 'जैन महापर्व विवरण' }
    ]
  },
  {
    fileName: 'og-samayik.png',
    kalyanakBadge: 'समता साधना • आत्म-विशुद्धि योग',
    title: 'सामायिक व नियम',
    subBrand: 'SAMAYIK & NIYAMA SADHANA',
    lead: '४८ मिनट समता साधना, इर्यावही पाठ, कायोत्सर्ग, णमोकार ध्यान, दैनिक नियम एवं श्रावक के १२ व्रत।',
    accentColor: '#10B981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    categoryPills: [
      { icon: 'clock', text: '४८ मिनट साधना टाइमर' },
      { icon: 'feather', text: 'इर्यावही व कायोत्सर्ग' },
      { icon: 'check', text: 'दैनिक नियम ट्रैकर' }
    ]
  },
  {
    fileName: 'og-tirthankar.png',
    kalyanakBadge: 'पंचकल्याणक वैभव • जिनेंद्र दर्शन',
    title: '२४ तीर्थंकर चरित्र',
    subBrand: '24 TIRTHANKARA DARSHAN',
    lead: 'भगवान ऋषभदेव से भगवान महावीर स्वामी तक २४ तीर्थंकरों का पावन जीवन चरित्र, लांछन व निर्वाण स्थल।',
    accentColor: '#F59E0B',
    accentGlow: 'rgba(245, 158, 11, 0.48)',
    categoryPills: [
      { icon: 'star', text: '२४ तीर्थंकर दर्शन' },
      { icon: 'sun', text: 'पंचकल्याणक तिथियाँ' },
      { icon: 'shield', text: 'लांछन व निर्वाण क्षेत्र' }
    ]
  },
  {
    fileName: 'og-puja.png',
    kalyanakBadge: 'नित्य देव-शास्त्र-गुरु पूजन • विधान व आरती',
    title: 'जैन पूजा व आरती',
    subBrand: 'JAIN PUJA & AARTI SANGRAH',
    lead: 'देव-शास्त्र-गुरु पूजा, तीर्थंकर पूजन, दशलक्षण पर्व पूजन, मंडल विधान एवं मंगल दीप आरती का संपूर्ण संग्रह।',
    accentColor: '#FB923C',
    accentGlow: 'rgba(251, 146, 60, 0.48)',
    categoryPills: [
      { icon: 'flame', text: 'अष्टद्रव्य पूजा विधि' },
      { icon: 'sparkle', text: 'मंगल दीप आरती' },
      { icon: 'book', text: 'महामंडल विधान' }
    ]
  },
  {
    fileName: 'og-shastra.png',
    kalyanakBadge: 'परमागम व सिद्धांत ग्रंथ • मोक्षमार्ग स्वाध्याय',
    title: 'जैन शास्त्र व आगम',
    subBrand: 'SHASTRA & SWADHYAYA',
    lead: 'परमागम समयसार, तत्त्वार्थ सूत्र, छहढाला, नियमसार, प्रवचनसार एवं मोक्षमार्ग प्रकाशक सरल हिंदी अर्थ सहित।',
    accentColor: '#FBBF24',
    accentGlow: 'rgba(251, 191, 36, 0.45)',
    categoryPills: [
      { icon: 'book', text: 'परमागम समयसार' },
      { icon: 'feather', text: 'तत्त्वार्थ सूत्र (१० अध्याय)' },
      { icon: 'sun', text: 'पं. दौलतराम छहढाला' }
    ]
  },
];

function getIconSvg(iconName, color = '#F59E0B') {
  switch (iconName) {
    case 'book':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    case 'feather':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>`;
    case 'heart':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    case 'star':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    case 'headphones':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>`;
    case 'calendar':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
    case 'sun':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    case 'flame':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>`;
    case 'clock':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    case 'check':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    case 'shield':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    case 'sparkle':
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
    default:
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`;
  }
}

function buildHtml(config) {
  const pillsHtml = config.categoryPills.map(p => `
    <div class="meta-pill">
      ${getIconSvg(p.icon, config.accentColor)}
      <span>${p.text}</span>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Noto+Sans+Devanagari:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #05060A;
      font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #F8FAFC;
      display: flex;
      position: relative;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      font-feature-settings: "kern" 1, "liga" 1, "clig" 1, "calt" 1, "pres" 1, "abvs" 1, "blws" 1, "psts" 1, "haln" 1;
    }

    /* Ambient atmospheric depth across the canvas */
    .ambient-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 82% 48%, rgba(20, 26, 44, 0.95) 0%, rgba(10, 14, 26, 0.98) 55%, #05060A 100%);
      pointer-events: none;
    }

    /* Luminous sacred radiance centered on the scripture */
    .sacred-glow-epicenter {
      position: absolute;
      top: 50%;
      right: 220px;
      transform: translate(50%, -50%);
      width: 720px;
      height: 720px;
      background: radial-gradient(circle, ${config.accentGlow} 0%, rgba(245, 158, 11, 0.16) 35%, transparent 70%);
      filter: blur(55px);
      pointer-events: none;
    }

    .top-left-accent-glow {
      position: absolute;
      top: -80px;
      left: -80px;
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 65%);
      filter: blur(60px);
      pointer-events: none;
    }

    /* Sacred geometrical watermarked grid */
    .mandala-grid {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(rgba(245, 158, 11, 0.10) 1.5px, transparent 1.5px),
        linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      background-size: 32px 32px, 96px 96px, 96px 96px;
      pointer-events: none;
      opacity: 0.85;
    }

    /* Architectural golden border lines */
    .inner-gilded-frame {
      position: absolute;
      inset: 22px;
      border: 1px solid rgba(245, 158, 11, 0.22);
      border-radius: 20px;
      pointer-events: none;
      box-shadow: 
        inset 0 0 60px rgba(0, 0, 0, 0.85),
        0 0 30px rgba(0, 0, 0, 0.5);
    }

    /* Corner filigree accents */
    .corner-mark {
      position: absolute;
      width: 32px;
      height: 32px;
      border-color: ${config.accentColor};
      border-style: solid;
      pointer-events: none;
      opacity: 0.85;
    }
    .c-tl { top: 16px; left: 16px; border-width: 2.5px 0 0 2.5px; border-top-left-radius: 8px; }
    .c-tr { top: 16px; right: 16px; border-width: 2.5px 2.5px 0 0; border-top-right-radius: 8px; }
    .c-bl { bottom: 16px; left: 16px; border-width: 0 0 2.5px 2.5px; border-bottom-left-radius: 8px; }
    .c-br { bottom: 16px; right: 16px; border-width: 0 2.5px 2.5px 0; border-bottom-right-radius: 8px; }

    /* Canvas layout container */
    .canvas-layout {
      position: relative;
      z-index: 10;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 60px 72px;
    }

    /* Left textual column */
    .content-column {
      flex: 1.35;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 36px;
    }

    .top-meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 8px 22px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(20, 26, 44, 0.5) 100%);
      border: 1px solid rgba(245, 158, 11, 0.38);
      border-radius: 9999px;
      font-size: 16.5px;
      font-weight: 700;
      color: #FDE68A;
      letter-spacing: 0.6px;
      width: fit-content;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .meta-ruby-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: ${config.accentColor};
      box-shadow: 0 0 8px ${config.accentColor};
    }

    .title-group {
      margin-top: 18px;
    }

    .title-deva {
      font-size: 76px;
      font-weight: 900;
      line-height: 1.25;
      letter-spacing: 0px;
      padding-top: 0.15em;
      padding-bottom: 0.05em;
      background: linear-gradient(140deg, #FFFFFF 15%, #FEF08A 55%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 25px rgba(245, 158, 11, 0.25));
    }

    .sub-brand {
      font-family: 'Cinzel', serif;
      font-size: 23px;
      font-weight: 800;
      color: rgba(253, 230, 138, 0.85);
      letter-spacing: 5px;
      margin-top: 8px;
    }

    .lead-description {
      font-size: 21px;
      line-height: 1.5;
      color: #CBD5E1;
      font-weight: 500;
      margin-top: 18px;
      max-width: 600px;
    }

    .pills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
    }

    .meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 18px;
      background: rgba(18, 24, 40, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      font-size: 15.5px;
      font-weight: 600;
      color: #E2E8F0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    }

    /* Bottom footer credentials */
    .footer-credentials {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 22px;
      border-top: 1px solid rgba(245, 158, 11, 0.18);
      margin-top: auto;
    }

    .domain-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #FBBF24;
      letter-spacing: 0.3px;
    }

    .trust-tagline {
      font-size: 15px;
      color: #94A3B8;
      font-weight: 600;
      letter-spacing: 0.4px;
    }

    /* Right artwork stage */
    .artwork-stage {
      flex: 0.95;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .book-halo-backdrop {
      position: absolute;
      width: 440px;
      height: 440px;
      background: radial-gradient(circle, ${config.accentGlow} 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%);
      border-radius: 50%;
      filter: blur(36px);
      z-index: 1;
    }

    /* The sacred scripture book graphic */
    .scripture-book {
      position: relative;
      z-index: 2;
      height: 480px;
      width: auto;
      object-fit: contain;
      filter: 
        drop-shadow(0 25px 40px rgba(0, 0, 0, 0.95)) 
        drop-shadow(0 0 35px ${config.accentGlow});
      transform: perspective(1000px) rotateY(-4deg) rotateZ(1deg);
    }
  </style>
</head>
<body>
  <div class="ambient-bg"></div>
  <div class="sacred-glow-epicenter"></div>
  <div class="top-left-accent-glow"></div>
  <div class="mandala-grid"></div>

  <div class="inner-gilded-frame"></div>
  <div class="corner-mark c-tl"></div>
  <div class="corner-mark c-tr"></div>
  <div class="corner-mark c-bl"></div>
  <div class="corner-mark c-br"></div>

  <div class="canvas-layout">
    <div class="content-column">
      <div>
        <div class="top-meta-badge">
          <span class="meta-ruby-dot"></span>
          <span>${config.kalyanakBadge}</span>
        </div>

        <div class="title-group">
          <h1 class="title-deva">${config.title}</h1>
          <div class="sub-brand">${config.subBrand}</div>
        </div>

        <p class="lead-description">
          ${config.lead}
        </p>

        <div class="pills-container">
          ${pillsHtml}
        </div>
      </div>

      <div class="footer-credentials">
        <div class="domain-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>jinvani.pages.dev</span>
        </div>
        <div class="trust-tagline">
          • शुद्ध दिगंबर-श्वेतांबर जिनवाणी संकलन
        </div>
      </div>
    </div>

    <div class="artwork-stage">
      <div class="book-halo-backdrop"></div>
      <img src="${bookDataUri}" alt="${config.title}" class="scripture-book" />
    </div>
  </div>
</body>
</html>`;
}

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

const chromePath = chromeCandidates.find(p => fs.existsSync(p));

if (!chromePath) {
  console.log('[og-image] Chrome not detected. Using pre-generated assets.');
  process.exit(0);
}

const tempHtmlPath = path.resolve(__dirname, 'temp_og.html');
const publicDir = path.resolve(__dirname, '..', 'public');
const buildDir = path.resolve(__dirname, '..', 'build');

for (const config of BANNER_CONFIGS) {
  const outputPath = path.resolve(publicDir, config.fileName);
  console.log(`[og-image] Generating ${config.fileName} (${config.title})...`);

  fs.writeFileSync(tempHtmlPath, buildHtml(config), 'utf8');

  try {
    const cmd = `"${chromePath}" --headless=new --screenshot="${outputPath}" --window-size=1200,630 --hide-scrollbars --default-background-color=00000000 "file://${tempHtmlPath.replace(/\\/g, '/')}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`[og-image] Success! Created ${outputPath} (1200x630)`);

    if (fs.existsSync(buildDir)) {
      fs.copyFileSync(outputPath, path.resolve(buildDir, config.fileName));
    }
  } catch (err) {
    console.warn(`[og-image] Warning creating ${config.fileName}: ${err.message}`);
  }
}

if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

console.log('[og-image] All custom page & category OG preview banners regenerated with pristine typography!');
