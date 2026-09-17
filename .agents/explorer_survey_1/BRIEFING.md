# BRIEFING — 2026-09-16T18:18:00+05:30

## Mission
Investigate ritual_data.js schema and the full details of 20-teerthankar-puja in public/ and build/.

## 🔒 My Identity
- Archetype: explorer
- Roles: Codebase Architecture & Schema Explorer
- Working directory: E:\JainJinvani\.agents\explorer_survey_1
- Original parent: 0e2fd15a-23a9-4d64-87a2-8a794360d301
- Milestone: Ritual Data Schema & 20-teerthankar-puja Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do NOT modify any code or source files
- Files for content delivery, Messages for coordination

## Current Parent
- Conversation ID: 0e2fd15a-23a9-4d64-87a2-8a794360d301
- Updated: 2026-09-16T18:27:30+05:30

## Investigation State
- **Explored paths**:
  - E:\JainJinvani\.agents\ORIGINAL_REQUEST.md
  - E:\JainJinvani\public\modules\ritual_data.js (lines 1 to 100, 2090 to 2169)
  - E:\JainJinvani\build\modules\ritual_data.js
  - E:\JainJinvani\src\pages\ContentViewer.tsx (lines 150 to 325)
  - E:\JainJinvani\src\data\inventory.ts
- **Key findings**:
  - `public/modules/ritual_data.js` and `build/modules/ritual_data.js` are byte-for-byte identical (SHA256 `13821C143749BB257078DDB0DCFAA7F8EB97FED65A93234B25D9228EF2D29395`, 4540 lines, 630203 bytes).
  - Schema: Passed to `window.registerContentModule`. 90 items (62 pujas, 28 vidhans). All items have properties: `id`, `category`, `title`, `subtitle`, `type` ('structured'), and `verses` (Array of objects, each containing `{ hindi: string }`).
  - `ContentViewer.tsx` parses verses: recognizes `<div class="section-title">`, `<div class="shloka-title">`, lines delimited by `<br>` or newlines, detects tag markers `<b>(जल)</b>`, detects mantras (`ॐ`, `स्वाहा`), and strips HTML.
  - `id: '20-teerthankar-puja'` occupies lines 2-61 (17 verse objects, indices 0-16).
  - Crucial distinction: `20-teerthankar-puja` is modern Hindi Bhasha puja ("ढाई द्वीप में पाँच विदेह हैं शाश्वते..."), whereas `vidyman-vimshati-tirthankar-pujan` (lines 2092-2169) is the classic composition by Pandit Dyanat Rai Ji ("दीप अढ़ाई मेरु पन, अरु तीर्थंकर बीस...").
  - Canon and syntax issues in `20-teerthankar-puja`:
    1. Dangling unmatched `</div>` in verse 16.
    2. ASCII colons `:` used instead of Sanskrit visargas `ः` in sthapana mantras (`तीर्थंकरा:!`, `ठ:! ठ:!`).
    3. Typo in sthapana: `(इति आहवाननम्)` instead of `(इति आह्वाननम्)`.
    4. Truncated refrains across verses 5-12 (`सीमंधर युगमंदर आदिक...||` instead of full refrain).
    5. Garbled/mangled Pushpa verse 7 ("काम के बाण विध्वंश को आए हैं।") and Naivedya verse 8 ("श्रीमंधर आदिक जिन चरणों में नितना.").
    6. Jaimala typos: `अतिजवीर्य` instead of `अजितवीर्य`, `श्री बज्रधर` instead of `श्री वज्रधर`, `युगमंदर` instead of `युगमंधर`.
    7. Punctuation: English periods `.` throughout verses and mantras instead of purna viram `।` / `॥`.
- **Unexplored areas**: None for this subagent's objective.

## Key Decisions Made
- Analyzed complete data structure and render pipeline in ContentViewer.tsx.
- Compared public vs build files.
- Completed full extraction of 20-teerthankar-puja verses.
- Writing comprehensive survey report to handoff.md.

## Artifact Index
- E:\JainJinvani\.agents\explorer_survey_1\DISPATCH.md — record of incoming dispatch messages
- E:\JainJinvani\.agents\explorer_survey_1\BRIEFING.md — persistent working memory
- E:\JainJinvani\.agents\explorer_survey_1\progress.md — liveness heartbeat and execution log
- E:\JainJinvani\.agents\explorer_survey_1\handoff.md — final survey report
