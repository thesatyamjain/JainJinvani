# Dispatch Log

## 2026-09-16T12:46:25Z
From: parent (5f778e14-7f35-46d3-a777-de03efdc9cc7)
Task:
Systematically review, verify, and correct all Jain Puja data in e:/JainJinvani/public/modules/ritual_data.js (and synchronize with build/modules/ritual_data.js) strictly one puja at a time, ensuring 100% authentic, canonical, and error-free text.

Initial Focus:
Start with the first puja '20-teerthankar-puja' (श्री विद्यमान बीस तीर्थंकर पूजा).

Requirements to strictly fulfill:
1. R1. Authentic Canon & Complete Anatomy (संपूर्ण अंग एवं प्रामाणिक पाठ):
   - Sthapana: Ahvanan, Sthapan, Sannidhikaran with complete mantras.
   - Ashtadravya Puja: Jal, Chandan, Akshat, Pushpa, Naivedya, Deep, Dhoop, Phal, Arghya (in strict canonical order).
   - Complete Tek (Refrain): Every dravya must have the full refrain written out without truncation so there is zero pronunciation ambiguity.
   - Jaimala: Opening doha/soratha, chaupai/stanzas, purnarghya mantra ('जयमाला-पूर्णार्घ्यं निर्वपामीति स्वाहा'), and ityasheervadah ('पुष्पांजलिं क्षिपेत्').
   - Sanskrit/Prakrit mantra purity: 100% accurate halants (्), visargas (:), and grammatical case endings (vibhakti, e.g., 'अक्षतान् निर्वपामीति स्वाहा', 'अक्षयपदप्राप्तये', 'संसारतापविनाशनाय').
2. R2. One-Puja-At-A-Time Execution Protocol:
   - Audit, review, correct, and verify each puja individually.
   - Validate with Node.js syntax checks and authentic canonical Jain puja texts.
3. R3. Clean Markup & Schema Hygiene:
   - Ensure all HTML tags (<div>, <b>, <br>) are balanced and valid.
   - Preserve JSON structure in window.registerContentModule.
   - Sync changes between public/modules/ritual_data.js and build/modules/ritual_data.js.
4. Acceptance Criteria:
   - Complete Sthapana with Ahvanan, Sthapan, and Sannidhikaran mantras.
   - All 8 dravyas present in canonical order.
   - No missing or truncated refrain/tek lines across stanzas.
   - 100% grammatically correct Sanskrit arghya mantras with accurate halants/visargas.
   - Complete Jaimala with starting doha/soratha, chaupai/stanzas, and purnarghya.
   - Node.js syntax check (node -e) succeeds on ritual_data.js.
