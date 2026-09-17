# Project: Jain Jinvani — Ritual Data Verification & Correction

## Architecture
- **Data Stores**:
  - `E:/JainJinvani/public/modules/ritual_data.js` (runtime browser bundle)
  - `E:/JainJinvani/build/modules/ritual_data.js` (build artifact / mirrored module)
  - Data registered into global `window.registerContentModule` containing 90 items.
- **Consumer**: `src/pages/ContentViewer.tsx` rendering structured rituals, parsing section headers (`<div class="section-title">`), tag lines (`<b>(...)</b>`), and mantras (`ॐ ... स्वाहा`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Sthapana Anatomy & Mantras | Complete Sthapana with Pithika doha, and grammatically pure plural Sanskrit mantras with correct visargas and seed syllables (आगच्छत संवौषट्, तिष्ठत ठः ठः, सन्निहिता भवत वषट्) | M1 | ORIGINAL_REQUEST.md R1.1 |
| 2 | Canonical Ashtadravya Order & Metrics | 8 Dravyas (Jal to Phal) plus Mahā-arghya in strict canonical sequence, restoring corrupted meter/lines in Pushpa, Naivedya, Deep, Dhoop | M1 | ORIGINAL_REQUEST.md R1.2 |
| 3 | Complete Refrain (पूर्ण टेक) Expansion | Unabridged 2-line refrain written out in full on every single dravya without truncation or ellipses | M1 | ORIGINAL_REQUEST.md R1.3 |
| 4 | Sanskrit Mantra Grammar & Punctuation | Accurate declension (अक्षतान् in accusative plural, accurate dative endings, sandhi avagrahas, halants, visargas, purna viram danda) | M1 | ORIGINAL_REQUEST.md R1.4 |
| 5 | Complete Jaimala with All 20 Tirthankaras | Opening doha, metrically accurate stanzas with correct names (युगमंधर, वज्रधर, देवयश, अजितवीर्य), Purnarghya mantra, and Ityasheervadah | M1 | ORIGINAL_REQUEST.md R1.5 |
| 6 | Schema & HTML Tag Hygiene | Clean balanced HTML tags, removal of rogue unclosed `</div>` in Verse 16, valid JS syntax in window.registerContentModule | M1 | ORIGINAL_REQUEST.md R3 |
| 7 | Dual-File Parity Synchronization | Byte-for-byte synchronization between public/modules/ritual_data.js and build/modules/ritual_data.js | M1 | ORIGINAL_REQUEST.md R3 |
| 8 | Automated Node.js Syntax & Lint Verification | Zero-dependency Node.js validation test scripts verifying syntax, balance, and refrain expansion | M1 | ORIGINAL_REQUEST.md R2 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | 20-Teerthankar-Puja Review & Correction | Review, correct, synchronize, and verify '20-teerthankar-puja' across public/ and build/ modules | Survey Phase | IN_PROGRESS |

## Interface Contracts
### ritual_data.js ↔ ContentViewer.tsx
- Structure: `{ id: '20-teerthankar-puja', category: 'puja', title: '...', subtitle: '...', type: 'structured', verses: [{ hindi: string }] }`
- Section Titles: `<div class="section-title">...</div>` (must be balanced)
- Tags: `<b>(...)</b>` (e.g. `<b>(दोहा)</b>`, `<b>(१. जल)</b>`, `<b>(जयमाला)</b>`)
- Mantras: single lines starting with `ॐ` and ending with `स्वाहा।`

## Code Layout
- `public/modules/ritual_data.js`: lines 2–61 owned by Worker for M1.
- `build/modules/ritual_data.js`: lines 2–61 mirrored identically.
