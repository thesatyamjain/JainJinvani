const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const assetsDir = process.argv[2] || '.';
const version = process.env.VERSION || 'v1.0.0';
const buildNumber = process.env.BUILD_NUMBER || '1';

function getFileInfo(fileName) {
  const filePath = path.join(assetsDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';
  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  return { fileName, size: sizeMB, hash };
}

const files = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

const arm64Apk = files.find(f => f.endsWith('-arm64.apk'));
const uniApk = files.find(f => f.endsWith('-universal.apk'));
const aab = files.find(f => f.endsWith('.aab'));
const web = files.find(f => f.endsWith('-web-bundle.zip'));
const ios = files.find(f => f.endsWith('.ipa'));

let tableRows = [];

if (arm64Apk) {
  const info = getFileInfo(arm64Apk);
  if (info) tableRows.push(`| \`${arm64Apk}\` | **Android APK (ARM64-v8a)** *(Recommended)* | ${info.size} | \`${info.hash}\` |`);
}
if (uniApk) {
  const info = getFileInfo(uniApk);
  if (info) tableRows.push(`| \`${uniApk}\` | **Android APK (Universal)** *(All Devices)* | ${info.size} | \`${info.hash}\` |`);
}
if (aab) {
  const info = getFileInfo(aab);
  if (info) tableRows.push(`| \`${aab}\` | **Google Play Bundle (AAB)** *(Store Release)* | ${info.size} | \`${info.hash}\` |`);
}
if (web) {
  const info = getFileInfo(web);
  if (info) tableRows.push(`| \`${web}\` | **Web Bundle (PWA)** *(Offline / Self-Hosted)* | ${info.size} | \`${info.hash}\` |`);
}
if (ios) {
  const info = getFileInfo(ios);
  if (info) tableRows.push(`| \`${ios}\` | **iOS Package (IPA)** *(Unsigned)* | ${info.size} | \`${info.hash}\` |`);
}

const tableContent = tableRows.length > 0
  ? `| पैकेज (Package) | प्रकार / आर्किटेक्चर (Type) | साइज़ (Size) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
${tableRows.join('\n')}`
  : `| पैकेज (Package) | प्रकार / आर्किटेक्चर (Type) | साइज़ (Size) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| \`JainJinvani-${version}-arm64.apk\` | **Android APK (ARM64-v8a)** *(Recommended)* | ~35 MB | \`See SHA256SUMS.txt\` |
| \`JainJinvani-${version}-universal.apk\` | **Android APK (Universal)** *(All Devices)* | ~65 MB | \`See SHA256SUMS.txt\` |`;

const body = `## 📱 जिनवाणी (Jain Jinvani) - ${version}

सम्पूर्ण जैन धर्म ग्रंथ, भक्तामर स्तोत्र, णमोकार महामंत्र, जैन पूजा, आरती, स्तुति, चालीसा, तीर्थंकर परिचय एवं पंचांग का 100% ऑफ़लाइन डिजिटल संग्रह।

### 📦 पैकेज विवरण (Package Metadata):
- **Package Name:** \`com.jainjinvani.app\`
- **Minimum Android Requirements:** Android 6.0 (API 23)+
- **Target SDK:** Android 15 (API 35)
- **Build Number:** \`${buildNumber}\`
- **Signing Scheme:** Verified Release Keystore (v1 + v2 + v3 Signature Scheme)

---

### 🔐 सुरक्षा एवं चेकसम (Verification & Checksums):
${tableContent}

> 💡 **टिप:**
> - स्मार्टफ़ोन पर सीधा ऐप इंस्टॉल करने के लिए **\`arm64\` APK** सबसे हल्का और तेज़ है।
> - पुराना फ़ोन होने पर **\`universal\` APK** का उपयोग करें।
> - Google Play Store पर प्रकाशित करने के लिए **\`playstore.aab\`** फ़ाइल का उपयोग करें।
> - अपने सर्वर पर ऑफ़लाइन वेब ऐप चलाने के लिए **\`web-bundle.zip\`** डाउनलोड करें।

---

### 📥 इंस्टॉलेशन निर्देश (Installation Guide):
1. नीचे **Assets** में से अपने डिवाइस के अनुसार फ़ाइल डाउनलोड करें।
2. डाउनलोड पूरी होने पर फ़ाइल खोलें और **Install** दबाएं।
3. यदि Google Play Protect पूछे, तो *"Install without scanning"* या *"Scan app"* चुनें।
4. भविष्य के सभी नए अपडेट सीधे ऐप के भीतर **1-क्लिक इन-ऐप OTA** से अपने आप मिल जाएंगे।
`;

fs.writeFileSync('RELEASE_BODY.md', body);
console.log(`Successfully generated RELEASE_BODY.md for ${version}`);
