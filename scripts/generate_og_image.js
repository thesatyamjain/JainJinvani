const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const bookImgPath = path.resolve(__dirname, '..', 'src', 'assets', '52d9a82ed1897797854817247f9d26b0426643b0.png');
const bookBase64 = fs.readFileSync(bookImgPath).toString('base64');
const bookDataUri = `data:image/png;base64,${bookBase64}`;

const htmlContent = `<!DOCTYPE html>
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

    /* Ambient background lighting */
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

    /* Fine subtle dot watermark across canvas */
    .canvas-grid {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(245, 158, 11, 0.08) 1.2px, transparent 1.2px);
      background-size: 28px 28px;
      pointer-events: none;
      opacity: 0.7;
    }

    /* Outer luxury border */
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

    /* Content Layout */
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
      font-size: 82px;
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
      font-size: 26px;
      font-weight: 800;
      color: rgba(253, 230, 138, 0.9);
      letter-spacing: 5px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .lead-text {
      font-size: 23px;
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
          <span>॥ णमो जिणाणं ॥ • ४५०+ प्रामाणिक ग्रंथ</span>
        </div>

        <div class="heading-block">
          <h1 class="title-primary">जैन जिनवाणी</h1>
          <div class="title-secondary">JAIN JINVANI</div>
        </div>

        <p class="lead-text">
          भक्तामर स्तोत्र, तत्त्वार्थ सूत्र, समयसार, पूजा, आरती, चालीसा, २४ तीर्थंकर परिचय व पंचांग।
        </p>

        <div class="badges-row">
          <div class="feature-tag">📖 शुद्ध देवनागरी</div>
          <div class="feature-tag">🕊️ १००% विज्ञापन-मुक्त</div>
          <div class="feature-tag">⚡ ऑफ़लाइन समर्थित</div>
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
        <img src="${bookDataUri}" alt="जैन जिनवाणी ग्रंथ" class="hero-book-img" />
      </div>
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.resolve(__dirname, 'temp_og.html');
const outputPath = path.resolve(__dirname, '..', 'public', 'og-image.png');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

const chromeCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

const chromePath = chromeCandidates.find(p => fs.existsSync(p));

if (!chromePath) {
  if (fs.existsSync(outputPath)) {
    console.log('[og-image] Chrome not detected, but public/og-image.png already exists. Skipping regeneration.');
    process.exit(0);
  } else {
    console.warn('[og-image] Warning: Chrome not detected to generate og-image.png.');
    process.exit(0);
  }
}

console.log('[og-image] Generating 1200x630 Open Graph preview image (Full-bleed Bold Edition)...');

try {
  const cmd = `"${chromePath}" --headless=new --screenshot="${outputPath}" --window-size=1200,630 --hide-scrollbars --default-background-color=00000000 "file://${tempHtmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`[og-image] Success! Created ${outputPath} (1200x630)`);
} catch (err) {
  if (fs.existsSync(outputPath)) {
    console.warn('[og-image] Chrome rendering encountered a warning, but og-image.png exists.');
  } else {
    console.error('[og-image] Error rendering image with Chrome:', err.message);
  }
} finally {
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
