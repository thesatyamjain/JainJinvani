const fs = require('fs');

const version = process.env.VERSION || 'v1.0.0';
const buildNumber = process.env.BUILD_NUMBER || '1';
const arm64Size = process.env.ARM64_SIZE || 'N/A';
const arm64Hash = process.env.ARM64_HASH || 'N/A';
const uniSize = process.env.UNI_SIZE || 'N/A';
const uniHash = process.env.UNI_HASH || 'N/A';

const body = `## 📱 जिनवाणी (Jain Jinvani) - ${version}

सम्पूर्ण जैन धर्म ग्रंथ, भक्तामर स्तोत्र, णमोकार महामंत्र, जैन पूजा, आरती, स्तुति, चालीसा, तीर्थंकर परिचय एवं पंचांग का 100% ऑफ़लाइन डिजिटल संग्रह।

### 📦 पैकेज विवरण (Package Metadata):
- **Package Name:** \`com.jainjinvani.app\`
- **Minimum Requirements:** Android 6.0 (API 23)+
- **Target SDK:** Android 15 (API 35)
- **Build Number:** \`${buildNumber}\`
- **Signing Scheme:** Verified Release Keystore (v1 + v2 + v3 Signature Scheme)

---

### 🔐 सुरक्षा एवं चेकसम (Verification & Checksums):
| पैकेज (Package) | आर्किटेक्चर (Architecture) | साइज़ (Size) | SHA-256 Checksum |
| :--- | :--- | :--- | :--- |
| \`JainJinvani-${version}-arm64.apk\` | **ARM64-v8a** *(Recommended)* | ${arm64Size} | \`${arm64Hash}\` |
| \`JainJinvani-${version}-universal.apk\` | **Universal** *(All Devices)* | ${uniSize} | \`${uniHash}\` |

> 💡 **टिप:** सभी आधुनिक स्मार्टफ़ोन (99% डिवाइस) के लिए **\`arm64\`** वर्ज़न सबसे हल्का और सबसे तेज़ चलता है। पुराना फ़ोन होने पर ही **\`universal\`** का उपयोग करें।

---

### 📥 इंस्टॉलेशन निर्देश (Installation Guide):
1. नीचे **Assets** में से अपने डिवाइस के अनुसार APK डाउनलोड करें।
2. डाउनलोड पूरी होने पर फ़ाइल खोलें और **Install** दबाएं।
3. यदि Google Play Protect पूछे, तो *"Install without scanning"* या *"Scan app"* चुनें।
4. भविष्य के सभी नए अपडेट सीधे ऐप के भीतर **1-क्लिक इन-ऐप OTA** से अपने आप मिल जाएंगे।
`;

fs.writeFileSync('RELEASE_BODY.md', body);
console.log(`Successfully generated RELEASE_BODY.md for ${version}`);
