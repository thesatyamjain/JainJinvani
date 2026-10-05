const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bookImgPath = path.resolve(__dirname, '..', 'src', 'assets', '52d9a82ed1897797854817247f9d26b0426643b0.png');
const bookBase64 = fs.readFileSync(bookImgPath).toString('base64');
const bookDataUri = `data:image/png;base64,${bookBase64}`;

const BANNER_CONFIGS = [
  {
    fileName: 'og-image.png',
    badge: '॥ णमो जिणाणं ॥ • ४५०+ प्रामाणिक ग्रंथ',
    title: 'जैन जिनवाणी',
    subBrand: 'JAIN JINVANI',
    lead: 'भक्तामर स्तोत्र, तत्त्वार्थ सूत्र, समयसार, पूजा, आरती, चालीसा, २४ तीर्थंकर परिचय व पंचांग।',
    tags: ['📖 शुद्ध देवनागरी', '🕊️ १००% विज्ञापन-मुक्त', '⚡ ऑफ़लाइन समर्थित'],
  },
  {
    fileName: 'og-bhaktamar.png',
    badge: 'स्तोत्र शिरोमणि • आचार्य मानतुंग विरचित',
    title: 'श्री भक्तामर स्तोत्र',
    subBrand: 'BHAKTAMAR STOTRA',
    lead: '४८ काव्यों का अलौकिक व चमत्कारी स्तोत्र, संस्कृत मूल, अन्वयार्थ, पद्यानुवाद व ऋद्धि-मंत्र सहित।',
    tags: ['✨ ४८ पावन काव्य', '📜 संस्कृत मूल व अर्थ', '🎧 ऑडियो सहित'],
  },
  {
    fileName: 'og-panchang.png',
    badge: 'दैनिक जैन पंचांग • वीर निर्वाण संवत्',
    title: 'जैन पंचांग व पर्व',
    subBrand: 'JAIN PANCHANG',
    lead: 'दैनिक तिथि, जैन महापर्व, अष्टान्हिका, दशलक्षण, सूर्योदय, सूर्यास्त एवं नवकारसी समय।',
    tags: ['📅 दैनिक तिथि व नक्षत्र', '🪔 जैन महापर्व कैलेंडर', '⏰ सूर्योदय व चौघड़िया'],
  },
  {
    fileName: 'og-samayik.png',
    badge: 'समता साधना • ४८ मिनट आत्म-विशुद्धि',
    title: 'सामायिक व नियम',
    subBrand: 'SAMAYIK & NIYAMA',
    lead: 'इर्यावही पाठ, कायोत्सर्ग, णमोकार ध्यान, दैनिक नियम व श्रावक के १२ व्रतों का डिजिटल संकलन।',
    tags: ['🧘 ४८ मिनट सामायिक', '⏱️ मेडिटेशन टाइमर', '✅ दैनिक नियम ट्रैकर'],
  },
  {
    fileName: 'og-tirthankar.png',
    badge: 'पंचकल्याणक • तीर्थंकर परिचय',
    title: '२४ तीर्थंकर दर्शन',
    subBrand: '24 TIRTHANKARAS',
    lead: 'भगवान ऋषभदेव से भगवान महावीर स्वामी तक २४ तीर्थंकरों का जीवन चरित्र, लांछन व निर्वाण स्थल।',
    tags: ['🌸 २४ तीर्थंकर चरित्र', '🏛️ सिद्धक्षेत्र दर्शन', '✨ कल्याणक विवरण'],
  },
  {
    fileName: 'og-puja.png',
    badge: 'नित्य देव-शास्त्र-गुरु पूजन • विधान संग्रह',
    title: 'जैन पूजा व आरती',
    subBrand: 'PUJA & AARTI',
    lead: 'देव-शास्त्र-गुरु पूजा, तीर्थंकर पूजन, दशलक्षण पर्व पूजा एवं मंगल दीप आरती का संपूर्ण संग्रह।',
    tags: ['🪔 नित्य अष्टद्रव्य पूजा', '🔔 मंगल दीप आरती', '📜 संपूर्ण विधान पाठ'],
  },
  {
    fileName: 'og-shastra.png',
    badge: 'परमागम व सिद्धांत ग्रंथ • स्वाध्याय',
    title: 'जैन शास्त्र व आगम',
    subBrand: 'JAIN SHASTRA & AGAM',
    lead: 'समयसार, तत्त्वार्थ सूत्र, छहढाला, नियमसार, प्रवचनसार एवं मोक्षमार्ग प्रकाशक अर्थ सहित।',
    tags: ['📚 परमागम समयसार', '🔍 तत्त्वार्थ सूत्र १० अध्याय', '🌿 पंडित दौलतराम छहढाला'],
  },
];

function buildHtml(config) {
  const tagsHtml = config.tags.map(t => `<div class="feature-tag">${t}</div>`).join('');

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
      background: radial-gradient(100% 100% at 75% 50%, #111726 0%, #05060A 70%, #020305 100%);
      font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #F8FAFC;
      display: flex;
      position: relative;
    }

    .glow-gold-hero {
      position: absolute;
      top: 50%;
      right: 18%;
      transform: translate(50%, -50%);
      width: 650px;
      height: 650px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.12) 40%, transparent 70%);
      filter: blur(50px);
      pointer-events: none;
    }

    .glow-corner {
      position: absolute;
      top: -100px;
      left: -100px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.14) 0%, transparent 65%);
      filter: blur(60px);
      pointer-events: none;
    }

    .canvas-grid {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(245, 158, 11, 0.08) 1.2px, transparent 1.2px);
      background-size: 28px 28px;
      pointer-events: none;
      opacity: 0.7;
    }

    .outer-frame {
      position: absolute;
      inset: 18px;
      border: 1.5px solid rgba(245, 158, 11, 0.28);
      border-radius: 24px;
      pointer-events: none;
      box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
    }

    .corner-accent {
      position: absolute;
      width: 24px;
      height: 24px;
      border-color: #F59E0B;
      border-style: solid;
      pointer-events: none;
    }
    .c-tl { top: 14px; left: 14px; border-width: 3px 0 0 3px; border-top-left-radius: 8px; }
    .c-tr { top: 14px; right: 14px; border-width: 3px 3px 0 0; border-top-right-radius: 8px; }
    .c-bl { bottom: 14px; left: 14px; border-width: 0 0 3px 3px; border-bottom-left-radius: 8px; }
    .c-br { bottom: 14px; right: 14px; border-width: 0 3px 3px 0; border-bottom-right-radius: 8px; }

    .main-wrapper {
      position: relative;
      z-index: 2;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 56px 64px;
    }

    .left-section {
      flex: 1.25;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-right: 20px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 20px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.45);
      border-radius: 9999px;
      font-size: 17px;
      font-weight: 700;
      color: #FCD34D;
      letter-spacing: 0.5px;
      width: fit-content;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.12);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #F59E0B;
      box-shadow: 0 0 10px #F59E0B;
    }

    .heading-block {
      margin-top: 18px;
    }

    .title-primary {
      font-size: 80px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #FFFFFF 15%, #FEF08A 55%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 6px 20px rgba(245, 158, 11, 0.25));
    }

    .title-secondary {
      font-family: 'Cinzel', serif;
      font-size: 25px;
      font-weight: 800;
      color: rgba(253, 230, 138, 0.9);
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .lead-text {
      font-size: 22px;
      line-height: 1.45;
      color: #E2E8F0;
      font-weight: 600;
      margin-top: 18px;
      max-width: 620px;
    }

    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 22px;
    }

    .feature-tag {
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 12px;
      font-size: 16.5px;
      font-weight: 700;
      color: #E2E8F0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .footer-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 20px;
      border-top: 1px solid rgba(245, 158, 11, 0.2);
      margin-top: auto;
    }

    .domain-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 21px;
      font-weight: 800;
      color: #FBBF24;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: 0.3px;
    }

    .domain-tagline {
      font-size: 16.5px;
      color: #94A3B8;
      font-weight: 600;
    }

    .right-section {
      flex: 0.95;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .book-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .book-halo-ring {
      position: absolute;
      width: 440px;
      height: 440px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.40) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 75%);
      border-radius: 50%;
      filter: blur(32px);
      z-index: 1;
    }

    .hero-book-img {
      position: relative;
      z-index: 2;
      height: 485px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 25px 45px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 50px rgba(245, 158, 11, 0.35));
    }
  </style>
</head>
<body>
  <div class="glow-gold-hero"></div>
  <div class="glow-corner"></div>
  <div class="canvas-grid"></div>

  <div class="outer-frame"></div>
  <div class="corner-accent c-tl"></div>
  <div class="corner-accent c-tr"></div>
  <div class="corner-accent c-bl"></div>
  <div class="corner-accent c-br"></div>

  <div class="main-wrapper">
    <div class="left-section">
      <div>
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>${config.badge}</span>
        </div>

        <div class="heading-block">
          <h1 class="title-primary">${config.title}</h1>
          <div class="title-secondary">${config.subBrand}</div>
        </div>

        <p class="lead-text">
          ${config.lead}
        </p>

        <div class="badges-row">
          ${tagsHtml}
        </div>
      </div>

      <div class="footer-row">
        <div class="domain-text">
          🌐 jinvani.pages.dev
        </div>
        <div class="domain-tagline">
          • १००% निःशुल्क धार्मिक सेवा
        </div>
      </div>
    </div>

    <div class="right-section">
      <div class="book-container">
        <div class="book-halo-ring"></div>
        <img src="${bookDataUri}" alt="${config.title}" class="hero-book-img" />
      </div>
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

    // Copy to build directory if it exists
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

console.log('[og-image] All custom page & category OG preview banners generated successfully!');
