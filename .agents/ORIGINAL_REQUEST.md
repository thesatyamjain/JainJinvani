# Original User Request

## 2026-09-16T12:44:24Z

Systematically review, verify, and correct all Jain Puja data in e:/JainJinvani/public/modules/ritual_data.js (and synchronize with build/modules/ritual_data.js) strictly one puja at a time, ensuring 100% authentic, canonical, and error-free text.

Working directory: e:/JainJinvani
Integrity mode: development
Initial Focus: Start with the first puja '20-teerthankar-puja' (श्री विद्यमान बीस तीर्थंकर पूजा).

## Requirements

### R1. Authentic Canon & Complete Anatomy (संपूर्ण अंग एवं प्रामाणिक पाठ)
For each targeted Puja:
- Verify and supply all essential components:
  1. पीठिका / स्थापना: आह्वानन, स्थापन, सन्निधिकरण (मंत्र सहित)।
  2. अष्टद्रव्य पूजा: जल, चंदन, अक्षत, पुष्प, नैवेद्य, दीप, धूप, फल, अर्घ्य (यथाक्रम)।
  3. पूर्ण टेक (Refrain): हर द्रव्य के बाद गायी जाने वाली स्थायी पंक्ति (जैसे 'सीमंधर युगमंदर आदिक...' या जो भी टेक हो) पूरी तरह लिखी हो ताकि उच्चारण में भ्रम न हो।
  4. जयमाला: जयमाला दोहा/सोरठा, जयमाला छंद/चौपाई, पूर्णार्घ्य मंत्र (जयमाला-पूर्णार्घ्यं निर्वपामीति स्वाहा), एवं इत्याशीर्वादः (पुष्पांजलिं क्षिपेत्)।
- संस्कृत/प्राकृत मंत्र शुद्धि: विसर्ग (:), हलंत (्), और सही विभक्ति (जैसे 'अक्षतान् निर्वपामीति स्वाहा', 'अक्षयपदप्राप्तये', 'संसारतापविनाशनाय') की शत-प्रतिशत शुद्धता।

### R2. One-Puja-At-A-Time Execution Protocol
- Each puja must be audited, reviewed, corrected, and verified individually before moving to the next.
- Validate with Node.js syntax checks and canonical Jain puja texts.

### R3. Clean Markup & Schema Hygiene
- Ensure all HTML tags (<div>, <b>, <br>) are balanced and valid.
- Preserve JSON structure in window.registerContentModule.
- Sync changes between public/modules/ritual_data.js and build/modules/ritual_data.js.

## Acceptance Criteria
- Complete Sthapana with Ahvanan, Sthapan, and Sannidhikaran mantras.
- All 8 dravyas present in canonical order (Jal, Chandan, Akshat, Pushpa, Naivedya, Deep, Dhoop, Phal, Arghya).
- No missing or truncated refrain/tek lines across stanzas.
- 100% grammatically correct Sanskrit arghya mantras with accurate halants/visargas.
- Complete Jaimala with starting doha/soratha, chaupai/stanzas, and purnarghya.
- node -e syntax check succeeds on ritual_data.js.
