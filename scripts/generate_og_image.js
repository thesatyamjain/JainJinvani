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
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

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
      font-family: 'Noto Sans Devanagari', -apple-system, sans-serif;
      color: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Ambient background glows */
    .bg-glow-gold {
      position: absolute;
      top: 50%;
      right: 15%;
      transform: translate(50%, -50%);
      width: 580px;
      height: 580px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.08) 45%, transparent 70%);
      filter: blur(40px);
      pointer-events: none;
    }

    .bg-glow-subtle {
      position: absolute;
      top: -10%;
      left: -5%;
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 65%);
      filter: blur(50px);
      pointer-events: none;
    }

    .container {
      width: 1140px;
      height: 570px;
      border-radius: 28px;
      background: radial-gradient(120% 120% at 20% 20%, rgba(18, 24, 38, 0.85) 0%, rgba(8, 11, 19, 0.95) 100%);
      border: 1.5px solid rgba(245, 158, 11, 0.28);
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      display: flex;
      position: relative;
      overflow: hidden;
      padding: 48px 56px;
    }

    /* Inner subtle watermark grid / grain */
    .container::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(245, 158, 11, 0.07) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      opacity: 0.6;
    }

    .left-content {
      flex: 1.35;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      z-index: 2;
      padding-right: 24px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 7px 18px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 9999px;
      font-size: 15px;
      font-weight: 700;
      color: #FCD34D;
      letter-spacing: 0.5px;
      width: fit-content;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #F59E0B;
      box-shadow: 0 0 10px #F59E0B;
    }

    .title-group {
      margin-top: 14px;
    }

    .main-title {
      font-size: 64px;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #FFFFFF 20%, #FDE68A 65%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 24px rgba(245, 158, 11, 0.2);
    }

    .sub-brand {
      font-family: 'Cinzel', serif;
      font-size: 24px;
      font-weight: 700;
      color: rgba(253, 230, 138, 0.8);
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .description {
      font-size: 18.5px;
      line-height: 1.5;
      color: #94A3B8;
      font-weight: 500;
      margin-top: 16px;
      max-width: 600px;
    }

    .tags-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }

    .tag-item {
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #CBD5E1;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: auto;
    }

    .domain-badge {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #FBBF24;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .domain-sub {
      font-size: 14px;
      color: #64748B;
      font-weight: 500;
    }

    .right-content {
      flex: 0.95;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 2;
    }

    .book-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .book-halo {
      position: absolute;
      width: 360px;
      height: 360px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.12) 50%, transparent 75%);
      border-radius: 50%;
      filter: blur(28px);
      z-index: 1;
    }

    .book-image {
      position: relative;
      z-index: 2;
      height: 420px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 20px 35px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 40px rgba(245, 158, 11, 0.3));
    }
  </style>
</head>
<body>
  <div class="bg-glow-gold"></div>
  <div class="bg-glow-subtle"></div>

  <div class="container">
    <div class="left-content">
      <div>
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>॥ णमो जिणाणं ॥ • ४५०+ प्रामाणिक ग्रंथ</span>
        </div>

        <div class="title-group">
          <h1 class="main-title">जैन जिनवाणी</h1>
          <div class="sub-brand">JAIN JINVANI</div>
        </div>

        <p class="description">
          भक्तामर स्तोत्र, तत्त्वार्थ सूत्र, समयसार, पूजा, आरती, चालीसा, स्तुति, २४ तीर्थंकर परिचय एवं नित्य पंचांग का संपूर्ण डिजिटल संकलन।
        </p>

        <div class="tags-row">
          <div class="tag-item">📖 शुद्ध देवनागरी</div>
          <div class="tag-item">🕊️ १००% विज्ञापन-मुक्त</div>
          <div class="tag-item">⚡ ऑफ़लाइन समर्थित</div>
          <div class="tag-item">✨ निःशुल्क जनसेवा</div>
        </div>
      </div>

      <div class="footer-bar">
        <div class="domain-badge">
          🌐 jinvani.pages.dev
        </div>
        <div class="domain-sub">
          Web • PWA • Android APK
        </div>
      </div>
    </div>

    <div class="right-content">
      <div class="book-wrapper">
        <div class="book-halo"></div>
        <img src="${bookDataUri}" alt="जैन जिनवाणी" class="book-image" />
      </div>
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.resolve(__dirname, 'temp_og.html');
const outputPath = path.resolve(__dirname, '..', 'public', 'og-image.png');

// If the image already exists, do not fail on environments without Chrome (e.g. CI/CD)
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

console.log('[og-image] Generating 1200x630 Open Graph preview image...');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

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
