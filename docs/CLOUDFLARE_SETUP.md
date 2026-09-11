# ☁️ Cloudflare Complete Setup Guide for जैन जिनवाणी (Jain Jinvani)

यह गाइड Cloudflare के उन सभी अतिरिक्त फीचर्स को सेट अप करने की सरल विधि बताता है जिन्हें इस प्रोजेक्ट में इंटीग्रेट किया गया है।

---

## 📑 विषय-सूची (Table of Contents)
1. [⚡ HTTP Cache & Security Headers (`public/_headers`)](#1--http-cache--security-headers)
2. [💬 WhatsApp & Social Share Dynamic Previews (`functions/_middleware.ts`)](#2--whatsapp--social-share-dynamic-previews)
3. [🎵 Cloudflare R2: Audio & Media Hosting (Zero Egress Fees)](#3--cloudflare-r2-audio--media-hosting)
4. [📝 Serverless Typo Reporting API (`functions/api/feedback.ts`)](#4--serverless-typo-reporting-api)
5. [📊 Cloudflare Web Analytics (1-क्लिक चालू करें)](#5--cloudflare-web-analytics)
6. [🌐 Custom Domain & DNS Setup](#6--custom-domain--dns-setup)
7. [🛕 100% ऑफ़लाइन मंदिर मोड (PWA Service Worker)](#7--100-ऑफ़लाइन-मंदिर-मोड)
8. [🤖 Cloudflare Workers AI: "आगम AI जिज्ञासा" बाइंडिंग](#8--cloudflare-workers-ai-आगम-ai-जिज्ञासा)
9. [🚀 Cloudflare Dashboard Speed Boost (HTTP/3, Early Hints, Brotli)](#9--cloudflare-dashboard-speed-boost)

---

## 1. ⚡ HTTP Cache & Security Headers

### क्या किया गया है:
प्रोजेक्ट में `public/_headers` फाइल जोड़ दी गई है। जब आप `npm run build` करेंगे और Cloudflare Pages पर डिप्लॉय करेंगे, तो Cloudflare अपने Edge सर्वर पर इसे लागू कर देगा:
* `/index.html`: `no-cache` (यूज़र को हमेशा नई रिलीज़ तुरंत दिखेगी)।
* `/modules/*`: `max-age=2592000` (डेटा फाइल्स 30 दिनों तक Cloudflare Edge पर सुपरफास्ट कैश रहेंगी)।
* `/assets/*`: `max-age=31536000, immutable` (फ़िंगरप्रिंटेड फाइल्स 1 साल तक कैश)।
* **सुरक्षा हेडर्स**: XSS, MIME-sniffing और Clickjacking से सुरक्षा।

**आपको क्या करना है:** कुछ नहीं! यह फाइल कोडबेस में शामिल है और डिप्लॉयमेंट के साथ स्वतः सक्रिय हो जाएगी।

---

## 2. 💬 WhatsApp & Social Share Dynamic Previews

### क्या किया गया है:
`functions/_middleware.ts` और `functions/metaResolver.ts` तैयार किए गए हैं।
* जब कोई यूज़र WhatsApp, Telegram, Facebook, Twitter आदि पर किसी स्तोत्र या रचना का लिंक शेयर करता है (उदा. `https://jainjinvani.pages.dev/viewer/bhaktamar_stotra`), तो सोशल मीडिया बॉट्स को Cloudflare Edge से सीधे उस रचना का सही शीर्षक, अन्वयार्थ और विवरण युक्त रिच कार्ड (OpenGraph Preview) प्राप्त होगा।
* सामान्य ब्राउज़र विज़िटर्स बिना किसी लैटेंसी के सीधे तेज़ SPA लोड करेंगे।

---

## 3. 🎵 Cloudflare R2: Audio & Media Hosting

Cloudflare R2 पर 10 GB स्टोरेज और **Zero Egress (बैंडविड्थ) फीस** बिल्कुल मुफ़्त है।

### R2 बकेट कैसे बनाएं:
1. **Cloudflare Dashboard** में लॉगिन करें।
2. बायीं ओर के मेन्यू से **R2** पर क्लिक करें।
3. **Create bucket** पर क्लिक करें:
   - Bucket Name: `jinvani-media` (या अपनी पसंद का नाम)
   - Location: `Automatic` (या `APAC`)
   - **Create Bucket** दबाएं।
4. बकेट के अंदर **Settings** टैब में जाएं:
   - **Public Access** सेक्शन में जाएं।
   - **Custom Domains** जोड़ें (जैसे `media.jainjinvani.org`) **अथवा** **R2.dev subdomain** को Enable (Allow Access) करें।
   - आपको एक पब्लिक URL मिल जाएगा (उदा. `https://pub-abcdef123456.r2.dev` या `https://media.jainjinvani.org`)।

### ऑडियो फाइल्स अपलोड करें:
बकेट में `audio/` फ़ोल्डर बनाकर ये फाइल्स अपलोड करें:
- `Namokar_Mantra.mp3` (नवकार महामंत्र धुन)
- `temple_bell.mp3` (सामायिक पूर्णता घंटिका)
- `Bhaktamar_Stotra.mp3` (भक्तामर पाठ)
- `Panch_Parmeshthi_Aarti.mp3` (मंगल आरती)

### ऐप को R2 से कैसे कनेक्ट करें:
1. Cloudflare Pages डैशबोर्ड में अपने प्रोजेक्ट (`Jain Jinvani`) पर जाएं।
2. **Settings** > **Environment variables** > **Production** में जाएं।
3. वेरिएबल जोड़ें:
   - **Variable name**: `VITE_R2_MEDIA_URL`
   - **Value**: आपका R2 पब्लिक URL (उदा. `https://pub-abcdef123456.r2.dev`)
4. प्रोजेक्ट को दोबारा डिप्लॉय (Redeploy) करें।
*(नोट: जब तक आप R2 URL नहीं डालते, तब तक ऐप स्वतः सुरक्षित फॉलबैक लिंक्स से ऑडियो चलाती रहेगी।)*

---

## 4. 📝 Serverless Typo Reporting API

### क्या किया गया है:
`functions/api/feedback.ts` के माध्यम से एक सर्वरलेस एंडपॉइंट बनाया गया है।
* यूज़र जब Content Viewer में **"सुझाव / वर्तनी सुधार"** भेजेंगे, तो यह पहले सीधे Cloudflare Edge पर सत्यापित होगा और फिर Google Sheets में सिंक होगा।
* **Telegram पर नोटिफिकेशन पाना (वैकल्पिक):**
  अगर आप चाहते हैं कि किसी श्रद्धालु द्वारा अशुद्धि रिपोर्ट करते ही आपके Telegram ग्रुप/बॉट पर मैसेज आ जाए:
  1. Cloudflare Pages > **Settings** > **Environment variables** में जाएं।
  2. जोड़ें:
     - `TELEGRAM_BOT_TOKEN`: आपका बॉट टोकन (BotFather से प्राप्त)
     - `TELEGRAM_CHAT_ID`: आपका ग्रुप या पर्सनल चैट आईडी

---

## 5. 📊 Cloudflare Web Analytics

यह Google Analytics से अधिक तेज़, हल्का और 100% प्राइवेसी-फ्रेंडली है:
1. Cloudflare Dashboard में अपने Pages प्रोजेक्ट (`Jain Jinvani`) पर क्लिक करें।
2. ऊपर **Analytics** टैब पर जाएं।
3. **Web Analytics** विकल्प को **Enable** करें।
4. बस हो गया! अब आपको बिना किसी कुकी के रियल-टाइम विज़िटर्स, लोकप्रिय पेज और ट्रैफिक के देश दिखने लगेंगे।

---

## 6. 🌐 Custom Domain & DNS Setup

यदि आपके पास अपना डोमेन है (जैसे `jainjinvani.org` या `jinvani.in`):
1. Cloudflare Pages प्रोजेक्ट में **Custom domains** टैब पर जाएं।
2. **Set up a custom domain** पर क्लिक करें और अपना डोमेन लिखें।
3. Cloudflare स्वतः DNS रिकॉर्ड्स (CNAME) और मुफ़्त SSL/TLS 1.3 प्रमाणपत्र कॉन्फ़िगर कर देगा।

---

## 7. 🛕 100% ऑफ़लाइन मंदिर मोड

### क्या किया गया है:
`public/sw.js` और `src/utils/templeMode.ts` को अपग्रेड किया गया है।
* सेटिंग्स में **"मंदिर मोड (100% ऑफ़लाइन)"** का कार्ड जोड़ा गया है।
* एक क्लिक में सभी ४५०+ शास्त्र रचनाएँ और नवकार मंत्र ऑडियो ब्राउज़र की स्थायी कैश स्टोरेज (`CacheStorage`) में सुरक्षित हो जाते हैं।
* सम्मेद शिखर जी, गिरनार जी वंदना अथवा प्राचीन मंदिर के तहखाने में बिना इंटरनेट के ऐप पूर्णतः कार्य करती है।

---

## 8. 🤖 Cloudflare Workers AI: "आगम AI जिज्ञासा"

### क्या किया गया है:
`functions/api/ask.ts` और `AagamAiModal.tsx` जोड़े गए हैं।
यह Cloudflare के Edge पर **Llama-3 AI** का उपयोग करके जैन दर्शन के प्रामाणिक उत्तर देता है।

### Cloudflare Pages में Workers AI बाइंडिंग कैसे चालू करें:
1. **Cloudflare Dashboard** > **Workers & Pages** में अपने प्रोजेक्ट पर जाएं।
2. **Settings** > **Functions** टैब पर क्लिक करें।
3. नीचे स्क्रॉल करके **Workers AI bindings** सेक्शन में जाएं।
4. **Add binding** पर क्लिक करें:
   - **Variable name**: `AI` (कैपिटल में ठीक यही नाम रखें)
5. प्रोजेक्ट को **Save & Redeploy** करें।
*(नोट: जब तक आप बाइंडिंग चालू नहीं करते, तब तक भी ऐप में एक प्रामाणिक जैन आगम नॉलेज बेस इनबिल्ट है जो मुख्य प्रश्नों के उत्तर तुरंत देता है।)*

---

## 9. 🚀 Cloudflare Dashboard Speed Boost

डैशबोर्ड में ये 4 टॉगल ऑन करके आप साइट की स्पीड को दोगुना कर सकते हैं:
1. **HTTP/3 (QUIC):** **Speed** > **Optimization** > **Protocol Optimization** में जाकर इसे ON करें (कमज़ोर मोबाइल नेटवर्क पर 0ms कनेक्शन रीस्यूम)।
2. **103 Early Hints:** **Speed** > **Optimization** > **Content Optimization** में जाकर इसे ON करें (HTML आने से पहले ही फ़ॉन्ट्स और CSS प्रीलोड)।
3. **Brotli:** स्वचालित रूप से सक्रिय रहता है (डेटा फाइल्स 25% छोटी)।
4. **Always Online™:** **Caching** > **Configuration** में Always Online चालू रखें ताकि सर्वर अपडेट के समय भी साइट कभी डाउन न दिखे।

