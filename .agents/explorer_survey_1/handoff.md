# Handoff Report: ritual_data.js Architecture & 20-teerthankar-puja Survey

**Author**: Explorer 1 (Codebase Architecture & Schema Explorer)  
**Date**: 2026-09-16  
**Target Files**: `E:/JainJinvani/public/modules/ritual_data.js`, `E:/JainJinvani/build/modules/ritual_data.js`  

---

## 1. Observation

### 1.1 File Locations and Identity Comparison
- **File 1**: `E:/JainJinvani/public/modules/ritual_data.js`
- **File 2**: `E:/JainJinvani/build/modules/ritual_data.js`
- **Hash Command Executed**:
  ```powershell
  Get-FileHash E:\JainJinvani\public\modules\ritual_data.js, E:\JainJinvani\build\modules\ritual_data.js
  ```
- **Result**:
  - `public/modules/ritual_data.js`: SHA256 `13821C143749BB257078DDB0DCFAA7F8EB97FED65A93234B25D9228EF2D29395` (4,540 lines, 630,203 bytes)
  - `build/modules/ritual_data.js`: SHA256 `13821C143749BB257078DDB0DCFAA7F8EB97FED65A93234B25D9228EF2D29395` (4,540 lines, 630,203 bytes)
  - Both files are **100% byte-for-byte identical**.

### 1.2 ritual_data.js Top-Level Module Architecture & Schema
- The file wraps all content in a single global browser function call:
  ```javascript
  window.registerContentModule({
      "item-id-1": { ... },
      "item-id-2": { ... }
  });
  ```
- **Total Registered Entities**: 90 items.
- **Categories**:
  - `puja`: 62 items
  - `vidhan`: 28 items
- **Type**: All 90 items declare `"type": "structured"`.
- **Item-Level Schema**:
  ```typescript
  interface RitualItem {
    id: string;          // Unique slug identifier, e.g. "20-teerthankar-puja"
    category: string;    // "puja" | "vidhan"
    title: string;       // Hindi title, e.g. "श्री विद्यमान बीस तीर्थंकर पूजा"
    subtitle: string;    // English/descriptive subtitle
    type: "structured";  // Always "structured"
    verses: VerseItem[]; // Array of verse objects
  }

  interface VerseItem {
    hindi: string;       // Raw HTML string containing title, lines, tags, and mantras
  }
  ```
- **UI Parsing & Rendering Pipeline (`src/pages/ContentViewer.tsx:150-265`)**:
  - The UI renderer reads `verse.hindi` and checks for:
    1. Section Title Headers: `<div class="section-title">...</div>` or `<div class="shloka-title">...</div>`. If extracted, rendered as an ornamental Sparkles section badge.
    2. Explicit Category / Dravya Tags: Lines matching `<b>(जल)</b>`, `<b>(चंदन)</b>`, `<b>(दोहा)</b>`, `<b>(जयमाला)</b>`, or bare `(दोहा)`. Parsed as `{ type: 'tag', text: ... }`.
    3. Mantras: Lines starting with `ॐ / ॐ ह्रीं` or containing `निर्वपामीति स्वाहा / अत्र अवतर अवतर / अत्र तिष्ठ तिष्ठ / संवौषट्! / वषट्!`. Parsed as `{ type: 'mantra', text: ... }` and rendered in distinct golden typography.
    4. Ordinary Verse Lines: Standard poetic lines parsed as `{ type: 'line', text: ... }`.
    5. HTML stripping: `stripHtml` is executed on line contents, and split on `<br>` or newlines.

### 1.3 Exact Location of `20-teerthankar-puja`
- Located at **lines 2 to 61** of both `public/modules/ritual_data.js` and `build/modules/ritual_data.js`.
- Contains exactly **17 verse items** (`verses[0]` through `verses[16]`).

### 1.4 Full Verbatim Content Extraction of `20-teerthankar-puja`

```javascript
    "20-teerthankar-puja": {
        "id": "20-teerthankar-puja",
        "category": "puja",
        "title": "श्री विद्यमान बीस तीर्थंकर पूजा",
        "subtitle": "Worship of the 20 Existing Tirthankaras of Mahavideh Kshetra",
        "type": "structured",
        "verses": [
            {
                "hindi": "<div class=\"section-title\">॥ स्थापना ॥</div>"
            },
            {
                "hindi": "ढाई द्वीप में पाँच विदेह हैं शाश्वते.<br>तीर्थंकर जहँ बीस सदा ही राजते.<br>भक्ति भाव से करूँ सहज आराधना.<br>निज पद पाऊँ नाथ यही है भावना."
            },
            {
                "hindi": "ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र अवतर अवतर संवौषट्! (इति आहवाननम्)<br>ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र तिष्ठ! तिष्ठ! ठ:! ठ:! (इति स्थापनम्)<br>ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र मम सन्निहितो भव भव वषट्! (इति सन्निधिकरणम्)"
            },
            {
                "hindi": "<div class=\"section-title\">॥ अष्ट द्रव्य पूजा ॥</div>"
            },
            {
                "hindi": "<b>(जल)</b><br>निर्मल सरिता का प्रासुक जल लेकर चरणों में आऊँ.<br>जन्म जरादिक क्षय करने को श्री जिनवर के गुण गाऊँ.<br>सीमंधर युगमंदर आदिक अजितवीर्य को नित ध्याऊँ.<br>विद्यमान बीसों तीर्थंकर की पूजन कर हर्षाऊँ.<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो जन्मजरामृत्युविनाशनाय जलं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(चंदन)</b><br>शीतल चंदन दाह निकंदन लेकर चरणों में आऊँ.<br>भव संताप ताप हरने को श्री जिनवर के गुण गाऊँ.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो संसारतापविनाशनाय चंदनं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(अक्षत)</b><br>स्वच्छ अखंडित उज्जवल तंदुल लेकर चरणों में आऊँ.<br>अनुपम अक्षय पद पाने को श्री जिनवर के गुण गाऊँ.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो अक्षयपदप्राप्तये अक्षतं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(पुष्प)</b><br>काम के बाण विध्वंश को आए हैं।<br>तीर्थ की वंदना आज करके सही, भावना मुक्ति की श्रेष्ठ मेरी रही.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो कामबाणविध्वंसनाय पुष्पं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(नैवेद्य)</b><br>मोह महात्म तुरत नशा आत्मज्ञान की ज्योति जगाए.<br>श्रीमंधर आदिक जिन चरणों में नितना.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो क्षुधारोगविनाशनाय नैवेद्यं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(दीप)</b><br>कर्मप्रकृतियों का ईंधन अब लेकर चरणों में आऊँ.<br>दीप जलाकर ज्ञान का, मैं तिमिर को नाशूं.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो मोहान्धकारविनाशनाय दीपं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(धूप)</b><br>धूप दशांग ले आया, अग्नि में खेऊँ.<br>कर्म कुसंस्कार जले, शिवपद मैं लेऊँ.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो अष्टकर्मदहनाय धूपं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(फल)</b><br>फल चरण चढ़ाऊँ नाथ, फल निर्वाण मिले.<br>अंतर में केवलज्ञान, सूर्य महान खिले.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो मोक्षफलप्राप्तये फलं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<b>(अर्घ्य)</b><br>जब तक अनर्घ्य पद प्राप्त हो न मुझे सत्वर.<br>मैं अर्घ्य चढ़ाऊँ नित्य चरणों में जिनवर.<br>सीमंधर युगमंदर आदिक...||<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो अनर्घ्यपदप्राप्तये अर्घ्यं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "<div class=\"section-title\">॥ जयमाला ॥</div><br><b>(दोहा)</b><br>विद्यमान जिन बीस प्रभु, गुण अनन्त की खान.<br>जिनवर सम निज जानकर, बनूँ शीघ्र भगवान."
            },
            {
                "hindi": "<b>(जयमाला)</b><br>सीमंधर, युगमंदर, बाहु, सुबाहु, सुजात, स्वयंप्रभ देव.<br>ऋषभानन, अनंतवीर्य, सूर्यप्रभ विशाल कीर्ति, सुदेव.<br>श्री बज्रधर, चंद्रानन प्रभु चंद्रबाहु, भुजंगम, ईश.<br>जयति ईश्वर, जयति नेमिप्रभु, वीरसेन, महाभद्र, महीश.<br>पूज्य यशोधर, अतिजवीर्य, जिनबीस जिनेश्वर परम महान.<br>विचरण करते हैं विदेह में शाश्वत तीर्थंकर भगवान.<br>नहीं शक्ति जाने की स्वामी यहीं वंदना करूँ प्रभो.<br>संस्तुति पूजन अर्चन करके शुद्ध भाव उर भरूँ विभो."
            },
            {
                "hindi": "ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो जयमाला-पूर्णार्घ्यं निर्वपामीति स्वाहा."
            },
            {
                "hindi": "इत्याशीर्वादः (पुष्पांजलिं क्षिपेत्)<br></div>"
            }
        ]
    }
```

### 1.5 Sibling Entry Discovery: `vidyman-vimshati-tirthankar-pujan`
- At lines **2092 to 2169** of `ritual_data.js`, there is a second puja dedicated to the 20 Tirthankaras:
  - `id`: `"vidyman-vimshati-tirthankar-pujan"`
  - `title`: `"श्री विद्यमान विंशति तीर्थंकर पूजन"`
  - Authorship: Pandit Dyanat Rai Ji (कवि द्यानतराय कृत प्राचीन पूजन).
  - Sthapana Doha: `"दीप अढ़ाई मेरु पन, अरु तीर्थंकर बीस। / तिन सबकी पूजा करूँ, मन-वच-तन धरि शीस॥"`
  - Jal Verse: `"इन्द्र फणीन्द्र नरेन्द्र वंद्य, पद निर्मल धारी..."`
- In `src/data/inventory.ts`:
  - Line 1136 registers `20-teerthankar-puja` (Description: "महाविदेह क्षेत्र के विद्यमान बीस तीर्थंकर पूजा", Badge: "२० तीर्थंकर").
  - Line 1137 registers `vidyman-vimshati-tirthankar-pujan` (Description: "विद्यमान विंशति तीर्थंकर अष्टद्रव्य पूजन", Badge: "विंशति जिन").

---

## 2. Logic Chain

### 2.1 Schema Compliance
1. Every entry in `ritual_data.js` adheres to `{ id, category, title, subtitle, type: 'structured', verses: [{ hindi: string }] }`.
2. The UI renderer relies on HTML substrings embedded inside `hindi`:
   - `<div class="section-title">` for section breaks.
   - `<b>(...)</b>` for dravya / meter tags.
   - `<br>` for line separation.
3. Therefore, schema hygiene directly impacts UI rendering. Any malformed or dangling HTML tag risks document distortion or CMS parser errors.

### 2.2 Critical Defects Observed in `20-teerthankar-puja`
Tracing directly from the extracted text against the requirements of `ORIGINAL_REQUEST.md`:

1. **Syntax / HTML Hygiene Error (R3)**:
   - In `verses[16]` (line 58): `"hindi": "इत्याशीर्वादः (पुष्पांजलिं क्षिपेत्)<br></div>"`
   - There is an unmatched closing tag `</div>` with no opening `<div>` in that verse or parent element.

2. **Sanskrit / Prakrit Mantra Orthography Errors (R1.4)**:
   - In `verses[2]` (Sthapana):
     - `तीर्थंकरा:!` uses ASCII colon `:` instead of Sanskrit visarga `ः` (`तीर्थंकराः!`).
     - `ठ:! ठ:!` uses ASCII colon `:` instead of Sanskrit visarga `ः` (`ठः! ठः!` or `ठः ठः`).
     - `(इति आहवाननम्)` has an incorrect spelling; canonical Sanskrit is `(इति आह्वाननम्)`.
   - In Arghya Mantras (`verses[4..12, 15]`):
     - Every mantra ends with an ASCII period `.` (`स्वाहा.`) rather than canonical purna viram danda (`स्वाहा।` or `स्वाहा॥`).
     - `विद्यमानविंशतितीर्थंकरेभ्यो` vs `विद्यमान-विंशति-तीर्थंकरेभ्यः` / `विद्यमानविंशतितीर्थंकरेभ्यः` (visarga vs o-kar sandhi before sonants/unvoiced stops).

3. **Truncated Tek / Refrain (R1.3 & Acceptance Criteria)**:
   - `verses[4]` (Jal) gives the complete 2-line refrain:
     `सीमंधर युगमंदर आदिक अजितवीर्य को नित ध्याऊँ.`  
     `विद्यमान बीसों तीर्थंकर की पूजन कर हर्षाऊँ.`
   - In `verses[5]` (Chandan), `verses[6]` (Akshat), `verses[7]` (Pushpa), `verses[8]` (Naivedya), `verses[9]` (Deep), `verses[10]` (Dhoop), `verses[11]` (Phal), and `verses[12]` (Arghya), the refrain is truncated to:
     `सीमंधर युगमंदर आदिक...||`
   - This directly violates requirement R1.3: *"पूर्ण टेक (Refrain): हर द्रव्य के बाद गायी जाने वाली स्थायी पंक्ति (जैसे 'सीमंधर युगमंदर आदिक...' या जो भी टेक हो) पूरी तरह लिखी हो ताकि उच्चारण में भ्रम न हो।"*

4. **Corrupted / Garbled Stanzas (R1.1)**:
   - In `verses[7]` (Pushpa):
     `काम के बाण विध्वंश को आए हैं।`  
     `तीर्थ की वंदना आज करके सही, भावना मुक्ति की श्रेष्ठ मेरी रही.`
     - The rhyme, meter, and structure fail to match the uniform pattern of the other dravyas (`[सामग्री विशेषण] लेकर चरणों में आऊँ / [फल विशेषण] श्री जिनवर के गुण गाऊँ`).
   - In `verses[8]` (Naivedya):
     `मोह महात्म तुरत नशा आत्मज्ञान की ज्योति जगाए.`  
     `श्रीमंधर आदिक जिन चरणों में नितना.`
     - `"नितना."` is an incomplete/truncated fragment mid-word.
     - `"मोह महात्म"` is an orthographic corruption of `"मोहमहातम"` (मोह महातम).
   - In `verses[9]` (Deep):
     - Rhyme inconsistency: `नाशूं` instead of the established stanza rhyming scheme in `-आऊँ`.

5. **Spelling and Name Corruptions in Jaimala (`verses[14]`)**:
   - Line 1: `युगमंदर` -> should be `युगमंधर`.
   - Line 3: `श्री बज्रधर` -> should be `श्री वज्रधर`.
   - Line 5: `पूज्य यशोधर, अतिजवीर्य` -> `अतिजवीर्य` is a glaring typo for `अजितवीर्य` (20th Tirthankara).
   - Danda punctuation: verses end in English periods `.` instead of traditional `।` or `॥`.

---

## 3. Caveats

1. **Read-Only Constraint**: As per dispatch instructions, Explorer 1 did not modify any source code. Fix proposals are documented here for the subsequent correction subagent.
2. **Authorship Tradition**:
   - `vidyman-vimshati-tirthankar-pujan` (line 2092) is the classical 17th/18th century Bhasha puja by Pandit Dyanat Rai Ji.
   - `20-teerthankar-puja` (line 2) is a popular contemporary Hindi Bhasha / Shrimad Rajchandra / Digambara community puja composed in modern accessible Hindi meter.
   - Both pujas are independent entries in `inventory.ts` (lines 1136 and 1137) and serve different devotional preferences; `20-teerthankar-puja` should not be overwritten with Dyanat Rai Ji's text, but rather corrected to its own authentic canonical verse and refrain structure.

---

## 4. Conclusion

1. `public/modules/ritual_data.js` and `build/modules/ritual_data.js` are currently identical in size, lines, and SHA256 checksum.
2. The exact target entry `id: '20-teerthankar-puja'` spans lines 2 to 61 (17 verse objects).
3. The data model uses standard JSON wrapped in `window.registerContentModule`, where each puja has `id`, `category`, `title`, `subtitle`, `type: "structured"`, and an array of `{ "hindi": string }` verse objects.
4. `20-teerthankar-puja` contains 7 distinct defects across HTML syntax, Sanskrit mantra orthography, truncated refrains, corrupted verse lines, and misspelled Tirthankara names.
5. All necessary information to execute the surgical correction and synchronization has been compiled.

---

## 5. Verification Method

To independently verify all findings in this report:

1. **Verify File Identity**:
   ```powershell
   Get-FileHash E:\JainJinvani\public\modules\ritual_data.js, E:\JainJinvani\build\modules\ritual_data.js
   ```
   *Expected*: Identical SHA256 hashes for both files.

2. **Verify JavaScript Syntax & Schema Structure**:
   ```powershell
   node -e "
   global.window = { registerContentModule: (obj) => {
       const p = obj['20-teerthankar-puja'];
       console.log('ID:', p.id);
       console.log('Verses count:', p.verses.length);
       console.log('Last verse:', p.verses[p.verses.length - 1]);
   }};
   require('./public/modules/ritual_data.js');
   "
   ```
   *Expected*: Outputs `ID: 20-teerthankar-puja`, `Verses count: 17`, and displays the trailing `</div>` in the last verse.

3. **Verify Refrain Truncation**:
   ```powershell
   node -e "
   global.window = { registerContentModule: (obj) => {
       const p = obj['20-teerthankar-puja'];
       p.verses.forEach((v, i) => {
           if (v.hindi.includes('सीमंधर युगमंदर')) console.log('Verse ' + i + ':', v.hindi);
       });
   }};
   require('./public/modules/ritual_data.js');
   "
   ```
   *Expected*: Shows Verse 4 with 2 full lines and Verses 5 through 12 truncated with `...||`.

4. **Verify Sibling Entry Distinction**:
   ```powershell
   node -e "
   global.window = { registerContentModule: (obj) => {
       console.log('20-teerthankar-puja title:', obj['20-teerthankar-puja'].title);
       console.log('vidyman-vimshati title:', obj['vidyman-vimshati-tirthankar-pujan'].title);
   }};
   require('./public/modules/ritual_data.js');
   "
   ```
