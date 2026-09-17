# Handoff Report — Explorer 3: Code-Canon Gap Analyzer & Node Validator

## Executive Summary
This investigation analyzed the '20-teerthankar-puja' module (lines 2–61) in both `E:/JainJinvani/public/modules/ritual_data.js` and `E:/JainJinvani/build/modules/ritual_data.js` against the canonical acceptance criteria in `E:\JainJinvani\.agents\ORIGINAL_REQUEST.md`. The investigation revealed **11 direct violations and corruptions**, including a syntax-breaking unclosed `</div>` tag, truncated refrains (`...||`) in 7 of 8 dravyas, corrupted poetry with nonsensical words ("नितना", "विध्वंश"), grammatical plural/singular mismatch in Sthapana mantras, ASCII colon substitutions for visargas (`:` instead of `ः`), inaccurate Akshat declension (`अक्षतं` vs canonical `अक्षतान्`), and typographical corruptions in Jaimala (`अतिजवीर्य` for `अजितवीर्य`, `यशोधर` for `देवयश`). Furthermore, a zero-dependency, safe Node.js validation test methodology was developed and verified.

---

## 1. Observation

### 1.1 Target Locations & File Consistency
- **Source Files**:
  - `E:/JainJinvani/public/modules/ritual_data.js` (Lines 2–61)
  - `E:/JainJinvani/build/modules/ritual_data.js` (Lines 2–61)
- **File Metrics**: Both files are 630,203 bytes, 4,540 lines, with SHA-256 parity.
- **Top-Level Wrapper**: `window.registerContentModule({ "20-teerthankar-puja": { ... } });` containing 90 content modules total.

### 1.2 Verse-by-Verse Audit & Direct Quotes

#### Verse Index 0 (Line 10): Section Title
```html
<div class="section-title">॥ स्थापना ॥</div>
```
- *Status*: Valid.

#### Verse Index 1 (Line 13): Sthapana Poetry
```html
ढाई द्वीप में पाँच विदेह हैं शाश्वते.<br>तीर्थंकर जहँ बीस सदा ही राजते.<br>भक्ति भाव से करूँ सहज आराधना.<br>निज पद पाऊँ नाथ यही है भावना.
```
- *Observation*: Modern amateur composition. Western periods `.` used instead of standard danda `।`.

#### Verse Index 2 (Line 16): Sthapana Mantras
```html
ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र अवतर अवतर संवौषट्! (इति आहवाननम्)<br>
ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र तिष्ठ! तिष्ठ! ठ:! ठ:! (इति स्थापनम्)<br>
ॐ ह्रीं श्री विद्यमान विंशति तीर्थंकरा:! अत्र मम सन्निहितो भव भव वषट्! (इति सन्निधिकरणम्)
```
- *Grammatical & Orthographical Observations*:
  1. ASCII colons `:` used instead of Sanskrit visarga `ः` in `तीर्थंकरा:!` and `ठ:! ठ:!`.
  2. Number mismatch: 20 Tirthankaras are plural (विंशतितीर्थंकराः / विंशतितीर्थंकरेभ्यः).
     - Current: `अवतर अवतर` (singular imperative). Plural is `अवतरावतर` or canonical `आगच्छत आगच्छत`.
     - Current: `तिष्ठ! तिष्ठ!` (singular imperative). Plural is `तिष्ठत तिष्ठत`.
     - Current: `सन्निहितो भव भव` (masculine singular nominative + singular imperative). Plural is `सन्निहिता भवत भवत`.
  3. Label Typo 1: `(इति आहवाननम्)` misspells the conjunct `ह्व` as `ह-वा-न-न-म्`. Correct is `आह्वाननं` / `आह्वाननम्`.
  4. Label Typo 2: `(इति सन्निधिकरणम्)` uses short `धि` instead of long `धी` (`सन्निधीकरणं`).

#### Verse Index 3 (Line 19): Section Title
```html
<div class="section-title">॥ अष्ट द्रव्य पूजा ॥</div>
```
- *Status*: Valid.

#### Verse Index 4 (Line 22): Jal Puja
```html
<b>(जल)</b><br>निर्मल सरिता का प्रासुक जल लेकर चरणों में आऊँ.<br>जन्म जरादिक क्षय करने को श्री जिनवर के गुण गाऊँ.<br>सीमंधर युगमंदर आदिक अजितवीर्य को नित ध्याऊँ.<br>विद्यमान बीसों तीर्थंकर की पूजन कर हर्षाऊँ.<br>ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो जन्मजरामृत्युविनाशनाय जलं निर्वपामीति स्वाहा.
```
- *Observation*: Only stanza where full refrain is written. Mantra ends in period `.`.

#### Verse Index 5–12 (Lines 25, 28, 31, 34, 37, 40, 43, 46): Chandan to Arghya
- **Refrain Truncation**: In every single verse from 5 through 12, the refrain is abbreviated to:
  `सीमंधर युगमंदर आदिक...||`
  The full two-line refrain (`सीमंधर युगमंदर आदिक अजितवीर्य को नित ध्याऊँ।<br>विद्यमान बीसों तीर्थंकर की पूजन कर हर्षाऊँ।`) is completely omitted across 7 dravyas.

- **Corrupted Stanzas in Detail**:
  - **Verse 7 (Pushpa, Line 31)**:
    `काम के बाण विध्वंश को आए हैं।<br>तीर्थ की वंदना आज करके सही, भावना मुक्ति की श्रेष्ठ मेरी रही.`
    *Observation*: "काम के बाण विध्वंश को आए हैं।" has broken meter, spelling error ("विध्वंश" with तालव्य 'श' instead of दन्त्य 'स' in विध्वंस), and disjointed grammar.
  - **Verse 8 (Naivedya, Line 34)**:
    `मोह महात्म तुरत नशा आत्मज्ञान की ज्योति जगाए.<br>श्रीमंधर आदिक जिन चरणों में नितना.`
    *Observation*: "श्रीमंधर आदिक जिन चरणों में नितना." contains a corrupted fragment ("नितना" is meaningless truncated text). Line 1 references "आत्मज्ञान की ज्योति जगाए", which belongs to Deep, completely confusing the Naivedya theme (destroying hunger/क्षुधारोग).
  - **Verse 9 (Deep, Line 37)**:
    `कर्मप्रकृतियों का ईंधन अब लेकर चरणों में आऊँ.<br>दीप जलाकर ज्ञान का, मैं तिमिर को नाशूं.`
    *Observation*: "कर्मप्रकृतियों का ईंधन" belongs conceptually to Dhoop (incense fuel consuming karmas), not lamp.
  - **Verse 6 (Akshat Mantra, Line 28)**:
    `ॐ ह्रीं श्री विद्यमानविंशतितीर्थंकरेभ्यो अक्षयपदप्राप्तये अक्षतं निर्वपामीति स्वाहा.`
    *Observation*: Uses singular neuter `अक्षतं` instead of canonical Digambar plural accusative masculine `अक्षतान्` (`अक्षतान् निर्वपामीति स्वाहा`), explicitly highlighted in R1.
  - **Verse 10 (Dhoop Mantra, Line 40) & Verse 12 (Arghya Mantra, Line 46)**:
    Missing Sanskrit sandhi avagrahas: `विंशतितीर्थंकरेभ्यो अष्टकर्मदहनाय` and `विंशतितीर्थंकरेभ्यो अनर्घ्यपदप्राप्तये` should be `विंशतितीर्थंकरेभ्योऽष्टकर्मदहनाय` and `विंशतितीर्थंकरेभ्योऽनर्घ्यपदप्राप्तये`.

#### Verse Index 13–16 (Lines 49–59): Jaimala & Ending
- **Verse 14 (Jaimala Body, Line 52)**:
  `<b>(जयमाला)</b><br>सीमंधर, युगमंदर, बाहु, सुबाहु, सुजात, स्वयंप्रभ देव.<br>ऋषभानन, अनंतवीर्य, सूर्यप्रभ विशाल कीर्ति, सुदेव.<br>श्री बज्रधर, चंद्रानन प्रभु चंद्रबाहु, भुजंगम, ईश.<br>जयति ईश्वर, जयति नेमिप्रभु, वीरसेन, महाभद्र, महीश.<br>पूज्य यशोधर, अतिजवीर्य, जिनबीस जिनेश्वर परम महान.<br>विचरण करते हैं विदेह में शाश्वत तीर्थंकर भगवान.<br>नहीं शक्ति जाने की स्वामी यहीं वंदना करूँ प्रभो.<br>संस्तुति पूजन अर्चन करके शुद्ध भाव उर भरूँ विभो.`
  *Observations*:
  1. Typo: `अतिजवीर्य` is an outright typo for `अजितवीर्य` (Ajitveerya).
  2. Factual Name Error: `यशोधर` is used instead of the canonical 19th Tirthankara `देवयश` (Devayash).
  3. Spelling: `बज्रधर` instead of `वज्रधर`.
  4. Padding words: `सुदेव`, `ईश`, `महीश` are rhyming filler words with no canonical basis.

- **Verse 16 (Line 58): Rogue Closing Tag**:
  `इत्याशीर्वादः (पुष्पांजलिं क्षिपेत्)<br></div>`
  *Automated Tool Run*:
  ```bash
  node -e "const fs = require('fs'); const code = fs.readFileSync('public/modules/ritual_data.js', 'utf8'); let data; require('vm').runInNewContext(code, { window: { registerContentModule: (d) => { data = d; } } }); const p = data['20-teerthankar-puja']; let o = 0, c = 0; p.verses.forEach(v => { o += (v.hindi.match(/<div/g)||[]).length; c += (v.hindi.match(/<\/div>/g)||[]).length; }); console.log('Open:', o, 'Close:', c);"
  ```
  *Result*: `Open: 3 Close: 4`.
  Verse 16 contains a dangling `</div>` tag that breaks HTML balance.

---

## 2. Logic Chain

1. **Premise 1 (Acceptance Criteria Alignment)**: `ORIGINAL_REQUEST.md` mandates:
   - Sthapana completeness with accurate mantras.
   - All 8 dravyas present in canonical order with zero omitted or truncated refrains.
   - Grammatically pure Sanskrit mantras (visargas, halants, plural vibhakti).
   - Complete Jaimala with purnarghya.
   - Balanced and valid HTML markup.
2. **Inference from HTML Audit**:
   - Verse 16 possesses an unclosed `</div>` (3 opening `<div>` tags across Verses 0, 3, 13 vs 4 closing `</div>` tags in Verses 0, 3, 13, 16).
   - This invalidates DOM structure upon rendering, violating AC6.
3. **Inference from Refrain Audit**:
   - In 7 of 8 dravyas, the refrain is abbreviated to `सीमंधर युगमंदर आदिक...||`.
   - Users and devotees reciting the puja cannot read the complete refrain, directly violating AC3.
4. **Inference from Sanskrit Grammar & Orthography Audit**:
   - In Sthapana, 20 Tirthankaras are addressed with singular verbs (`अवतर`, `तिष्ठ`, `भव`) instead of plural (`आगच्छत/अवतरावतर`, `तिष्ठत`, `भवत`), ASCII colons are substituted for Sanskrit visargas, and `आहवाननम्`/`सन्निधिकरणम्` are misspelled.
   - In Akshat, non-count sacred rice grains require plural accusative `अक्षतान्` (as explicitly noted in R1), not singular `अक्षतं`.
   - In Dhoop and Arghya, sandhi avagrahas (`ऽ`) are absent.
   - These directly violate AC4.
5. **Inference from Textual Integrity & Jaimala Audit**:
   - Pushpa and Naivedya stanzas contain mutilated text ("विध्वंश", "नितना"), misplaced concepts, and broken meter.
   - Jaimala contains the obvious typo `अतिजवीर्य` and wrong name `यशोधर` instead of `देवयश`.
   - This violates AC1 and AC5.
6. **Inference on Canon Selection**:
   - In `CHAT_HISTORY.md` (line 1285), the user explicitly requested `विद्यमान श्री बीस तीर्थंकर पूजन (कवि द्यानतराय)`.
   - In `ORIGINAL_REQUEST.md`, Pandit Dhyanatray Ji's composition is referenced as the primary standard Digambar canonical work.
   - The current text in `ritual_data.js` is a poorly transliterated modern composition.

---

## 3. Caveats

1. **Scope Boundary**: As a read-only Explorer, no source code or content files were modified during this investigation.
2. **Alternative Canon Retention**: If the project maintainer specifically wishes to retain the modern hindi rhymed composition alongside or instead of Pandit Dhyanatray Ji's classical puja, all identified defects in the modern text (Pushpa, Naivedya, Deep, Sthapana mantras, Tek expansion, Jaimala typos) can be fully restored to a clean, poetic state.
3. **Dual File Requirement**: Any future edit to `public/modules/ritual_data.js` must be synchronized verbatim to `build/modules/ritual_data.js`.

---

## 4. Conclusion & Recommended Correction Strategy

### Recommended Two-Pronged Correction Strategy:

#### Option A (Recommended — 100% Authentic Canon of Pandit Dhyanatray Ji)
Replace the corrupted entry with the classical, authoritative Digambar composition by Pandit Dhyanatray Ji as found in standard *Jinendra Archana* / *Digambar Jinendra Pooja Sangrah*:
1. **Sthapana**:
   - Doha: `द्वीप अढ़ाई मेरु पन, सब तीर्थंकर बीस। तिन सबकी पूजा करूँ, मन-वच-तन धरि शीस ॥`
   - Mantras:
     `ॐ ह्रीं श्रीविद्यमान-विंशतितीर्थंकरेभ्योऽत्र आगच्छत आगच्छत संवौषट् (आह्वाननं)।`
     `ॐ ह्रीं श्रीविद्यमान-विंशतितीर्थंकरेभ्योऽत्र तिष्ठत तिष्ठत ठः ठः (स्थापनं)।`
     `ॐ ह्रीं श्रीविद्यमान-विंशतितीर्थंकरेभ्योऽत्र मम सन्निहिता भवत भवत वषट् (सन्निधीकरणं)।`
2. **Ashtadravya**:
   - Canonical verses starting with Jal: `क्षीरोदधि-सम शुचि नीर, कंचन-भृंग भरी...`
   - Fully written refrain for every dravya:
     `सीमंधर जुगमंधर आदि जिनेस, नमों बीसों ही तीरथंकर गुनगेह ।`
   - Grammatically pure mantras with `अक्षतान्`, `ऽष्टकर्मदहनाय`, `ऽनर्घ्यपदप्राप्तये`.
3. **Jaimala**:
   - Doha: `सीमंधर मुख-चन्द छवि, निरखत नयन अनन्द । जुगमंधर युग-अन्ध हर, प्रणमौं पद-अरविन्द ॥`
   - Complete Chaupai naming all 20 Tirthankaras in order.
   - Purnarghya: `ॐ ह्रीं श्रीविद्यमान-विंशतितीर्थंकरेभ्यो जयमाला-पूर्णार्घ्यं निर्वपामीति स्वाहा ।`
   - Ashirvad: `इत्याशीर्वादः (पुष्पांजलिं क्षिपेत्)` with clean balanced tags (no dangling `</div>`).

#### Option B (Restoration of Modern Rhymed Composition)
If preserving the modern rhymed version is desired:
1. Fix Sthapana mantras to plural Sanskrit with visargas (`ः`) and correct labels (`आह्वाननं`, `सन्निधीकरणं`).
2. Fix Pushpa, Naivedya, and Deep stanzas (repair "विध्वंस", restore Naivedya lines eliminating "नितना", separate Deep and Dhoop themes).
3. Expand full refrain across all 8 dravyas:
   `सीमंधर युगमंदर आदिक अजितवीर्य को नित ध्याऊँ।<br>विद्यमान बीसों तीर्थंकर की पूजन कर हर्षाऊँ।`
4. Use `अक्षतान् निर्वपामीति स्वाहा ।` in Akshat mantra.
5. Fix Jaimala typos: change `अतिजवीर्य` to `अजितवीर्य`, change `यशोधर` to `देवयश`, change `बज्रधर` to `वज्रधर`.
6. Remove the stray `</div>` from Verse 16.

---

## 5. Verification Method

### 5.1 Node.js Syntax & Module Validation Command
Because `ritual_data.js` executes `window.registerContentModule`, run:
```bash
node -e "['./public/modules/ritual_data.js', './build/modules/ritual_data.js'].forEach(f => { global.window = { registerContentModule: (d) => { if (!d['20-teerthankar-puja']) throw new Error('Missing 20-teerthankar-puja in ' + f); console.log('PASS: Loaded', f, 'verses:', d['20-teerthankar-puja'].verses.length); } }; delete require.cache[require.resolve(f)]; require(f); });"
```

### 5.2 Node.js Automated Canon & HTML Hygiene Linter
Run the following script to programmatically verify zero HTML mismatches, zero truncated refrains, and zero known typos:
```bash
node -e "const fs = require('fs'); ['public/modules/ritual_data.js', 'build/modules/ritual_data.js'].forEach(file => { const code = fs.readFileSync(file, 'utf8'); let data; require('vm').runInNewContext(code, { window: { registerContentModule: (d) => { data = d; } } }); const p = data['20-teerthankar-puja']; let oDiv = 0, cDiv = 0, oB = 0, cB = 0; const errs = []; p.verses.forEach((v, i) => { const t = v.hindi || ''; oDiv += (t.match(/<div(\s|>)/g) || []).length; cDiv += (t.match(/<\/div>/g) || []).length; oB += (t.match(/<b(\s|>)/g) || []).length; cB += (t.match(/<\/b>/g) || []).length; if (t.includes('...||')) errs.push('V' + i + ': truncated refrain'); if (t.includes('ठ:!')) errs.push('V' + i + ': colon visarga'); if (t.includes('अतिजवीर्य')) errs.push('V' + i + ': typo अतिजवीर्य'); if (t.includes('नितना')) errs.push('V' + i + ': corrupted text नितना'); }); if (oDiv !== cDiv) errs.push('Div mismatch: open=' + oDiv + ' close=' + cDiv); if (oB !== cB) errs.push('B mismatch: open=' + oB + ' close=' + cB); if (errs.length > 0) { console.error('FAIL ' + file + ':', errs); process.exit(1); } else { console.log('ALL CHECKS PASSED for ' + file); } });"
```

### 5.3 Invalidation Conditions
This analysis is invalidated if:
1. The target key `"20-teerthankar-puja"` is renamed in `ritual_data.js`.
2. The schema changes away from the `verses: [{ hindi: "..." }]` structure.
