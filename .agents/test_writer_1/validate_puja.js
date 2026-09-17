/**
 * Automated Test Script: validate_puja.js
 * Validates '20-teerthankar-puja' in public/modules/ritual_data.js and build/modules/ritual_data.js
 * Based on requirements in ORIGINAL_REQUEST.md and verification methodology in explorer_survey_3/handoff.md.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Determine repository root
let repoRoot = path.resolve(__dirname, '../..');
if (!fs.existsSync(path.join(repoRoot, 'public', 'modules', 'ritual_data.js'))) {
    repoRoot = process.cwd();
}

const targetFiles = [
    path.join(repoRoot, 'public', 'modules', 'ritual_data.js'),
    path.join(repoRoot, 'build', 'modules', 'ritual_data.js')
];

const PUJA_KEY = '20-teerthankar-puja';

const REQUIRED_DRAVYAS = [
    { name: 'जल (Jal)', key: 'जल' },
    { name: 'चंदन (Chandan)', key: 'चंदन' },
    { name: 'अक्षत (Akshat)', key: 'अक्षत' },
    { name: 'पुष्प (Pushpa)', key: 'पुष्प' },
    { name: 'नैवेद्य (Naivedya)', key: 'नैवेद्य' },
    { name: 'दीप (Deep)', key: 'दीप' },
    { name: 'धूप (Dhoop)', key: 'धूप' },
    { name: 'फल (Phal)', key: 'फल' },
    { name: 'अर्घ्य (Arghya)', key: 'अर्घ्य' }
];

let globalFailures = 0;
let totalChecks = 0;

function runCheck(description, testFn) {
    totalChecks++;
    try {
        const result = testFn();
        if (result === true || result === undefined) {
            console.log(`  [PASS] ${description}`);
            return true;
        } else {
            console.error(`  [FAIL] ${description}: ${result}`);
            globalFailures++;
            return false;
        }
    } catch (err) {
        console.error(`  [FAIL] ${description}: Exception - ${err.message}`);
        globalFailures++;
        return false;
    }
}

console.log('================================================================');
console.log(' AUTOMATED VALIDATION SUITE: 20-teerthankar-puja');
console.log('================================================================\n');

const loadedModules = {};

// 1. File existence and syntax execution
targetFiles.forEach((filePath) => {
    const relPath = path.relative(repoRoot, filePath);
    console.log(`--- Checking File: ${relPath} ---`);

    runCheck(`File exists at ${relPath}`, () => {
        if (!fs.existsSync(filePath)) {
            return `File not found at ${filePath}`;
        }
    });

    let fileContent = '';
    runCheck(`File read and non-empty`, () => {
        fileContent = fs.readFileSync(filePath, 'utf8');
        if (!fileContent || fileContent.trim().length === 0) {
            return `File is empty`;
        }
    });

    let moduleData = null;
    runCheck(`Execute in sandbox with window.registerContentModule`, () => {
        const sandbox = {
            window: {
                registerContentModule: (data) => {
                    moduleData = data;
                }
            },
            console: console
        };
        const context = vm.createContext(sandbox);
        vm.runInContext(fileContent, context, { filename: relPath });

        if (!moduleData || typeof moduleData !== 'object') {
            return `window.registerContentModule was not invoked or did not supply an object`;
        }
    });

    runCheck(`Key '${PUJA_KEY}' exists in registered modules`, () => {
        if (!moduleData || !moduleData[PUJA_KEY]) {
            return `Module '${PUJA_KEY}' not found in registered modules`;
        }
    });

    if (!moduleData || !moduleData[PUJA_KEY]) {
        console.error(`Skipping further checks for ${relPath} due to missing module.\n`);
        return;
    }

    const puja = moduleData[PUJA_KEY];
    loadedModules[relPath] = puja;

    runCheck(`Metadata completeness (id, category, title, verses)`, () => {
        if (!puja.id || puja.id !== PUJA_KEY) return `Invalid id: ${puja.id}`;
        if (!puja.category) return `Missing category`;
        if (!puja.title) return `Missing title`;
        if (!Array.isArray(puja.verses) || puja.verses.length === 0) return `Verses must be a non-empty array`;
    });

    const verses = puja.verses || [];
    console.log(`  Loaded ${verses.length} verses from ${relPath}`);

    // 2. HTML Markup Balance & Hygiene
    runCheck(`HTML Tag Balance across verses (div, b)`, () => {
        let openDiv = 0, closeDiv = 0;
        let openB = 0, closeB = 0;
        verses.forEach((v, idx) => {
            const text = v.hindi || '';
            openDiv += (text.match(/<div(\s|>)/g) || []).length;
            closeDiv += (text.match(/<\/div>/g) || []).length;
            openB += (text.match(/<b(\s|>)/g) || []).length;
            closeB += (text.match(/<\/b>/g) || []).length;
        });

        const issues = [];
        if (openDiv !== closeDiv) issues.push(`div mismatch (open=${openDiv}, close=${closeDiv})`);
        if (openB !== closeB) issues.push(`b mismatch (open=${openB}, close=${closeB})`);

        if (issues.length > 0) return issues.join('; ');
    });

    runCheck(`No rogue or dangling closing tags in stanzas`, () => {
        const issues = [];
        verses.forEach((v, idx) => {
            const text = v.hindi || '';
            const oD = (text.match(/<div(\s|>)/g) || []).length;
            const cD = (text.match(/<\/div>/g) || []).length;
            if (cD > oD && oD === 0) {
                issues.push(`Verse index ${idx} has dangling </div> without opening tag`);
            }
        });
        if (issues.length > 0) return issues.join('; ');
    });

    // 3. Complete Refrain Check (No truncation like ...||)
    runCheck(`Refrain completeness (no truncated '...||' or '...|')`, () => {
        const truncated = [];
        verses.forEach((v, idx) => {
            const text = v.hindi || '';
            if (text.includes('...||') || text.includes('...|') || text.includes('…||')) {
                truncated.push(`Verse ${idx}`);
            }
        });
        if (truncated.length > 0) {
            return `Truncated refrains found in: ${truncated.join(', ')}`;
        }
    });

    // 4. Sanskrit Mantras & Orthography (Visarga vs Colon, Typographical Typos)
    runCheck(`No ASCII colon ':' substitution for Sanskrit visarga 'ः'`, () => {
        const colonErrors = [];
        verses.forEach((v, idx) => {
            const text = v.hindi || '';
            if (/[\u0900-\u097F]+:/.test(text)) {
                colonErrors.push(`Verse ${idx} contains Devanagari followed by ASCII colon`);
            }
        });
        if (colonErrors.length > 0) {
            return `Colon substitution found: ${colonErrors.join(', ')}`;
        }
    });

    runCheck(`Sthapana mantras correctness and label spelling`, () => {
        const sthapanaText = verses.map(v => v.hindi || '').join(' ');
        const errors = [];
        if (sthapanaText.includes('आहवाननम्')) {
            errors.push("Misspelling 'आहवाननम्' found (should be आह्वाननं/आह्वाननम्)");
        }
        if (sthapanaText.includes('सन्निधिकरणम्') && !sthapanaText.includes('सन्निधीकरणम्')) {
            errors.push("Short vowel typo 'सन्निधिकरणम्' found (should be सन्निधीकरणम्)");
        }
        if (errors.length > 0) return errors.join('; ');
    });

    runCheck(`Sthapana plural verb agreement for 20 Tirthankaras`, () => {
        const sthapanaText = verses.map(v => v.hindi || '').join(' ');
        const errors = [];
        if (/अत्र\s+अवतर\s+अवतर/.test(sthapanaText)) {
            errors.push("Singular imperative 'अवतर अवतर' used for 20 Tirthankaras (requires plural 'आगच्छत आगच्छत' or 'अवतरावतर')");
        }
        if (/अत्र\s+तिष्ठ!?\s*तिष्ठ!?/.test(sthapanaText) && !sthapanaText.includes('तिष्ठत')) {
            errors.push("Singular imperative 'तिष्ठ' used for 20 Tirthankaras (requires plural 'तिष्ठत तिष्ठत')");
        }
        if (/सन्निहितो\s+भव\s+भव/.test(sthapanaText)) {
            errors.push("Singular masculine nominative 'सन्निहितो भव भव' used for 20 Tirthankaras (requires plural 'सन्निहिता भवत भवत')");
        }
        if (errors.length > 0) return errors.join('; ');
    });

    runCheck(`Akshat mantra canonical declension (अक्षतान् vs अक्षतं)`, () => {
        const akshatVerse = verses.find(v => (v.hindi || '').includes('अक्षत'));
        if (akshatVerse) {
            const text = akshatVerse.hindi;
            if (text.includes('अक्षतं निर्वपामीति')) {
                return "Singular 'अक्षतं' found in Akshat mantra instead of canonical plural accusative 'अक्षतान्'";
            }
        }
    });

    // 5. Corrupted Text & Known Factual/Lexical Errors
    runCheck(`No corrupted or nonsensical lexical tokens (नितना, विध्वंश, अतिजवीर्य, यशोधर)`, () => {
        const corruptions = [];
        verses.forEach((v, idx) => {
            const text = v.hindi || '';
            if (text.includes('नितना')) corruptions.push(`Verse ${idx}: contains meaningless fragment 'नितना'`);
            if (text.includes('विध्वंश')) corruptions.push(`Verse ${idx}: spelling 'विध्वंश' (should be विध्वंस)`);
            if (text.includes('अतिजवीर्य')) corruptions.push(`Verse ${idx}: typo 'अतिजवीर्य' (should be canonical 'अजितवीर्य')`);
            if (text.includes('यशोधर') && text.includes('जिनबीस')) corruptions.push(`Verse ${idx}: factual error 'यशोधर' (should be 19th Tirthankara 'देवयश')`);
        });
        if (corruptions.length > 0) return corruptions.join('; ');
    });

    // 6. Anatomy Verification (Sthapana, 8 Dravyas, Jaimala, Purnarghya)
    runCheck(`Sthapana section present with Ahvanan, Sthapan, Sannidhikaran`, () => {
        const fullText = verses.map(v => v.hindi || '').join(' ');
        const missing = [];
        if (!fullText.includes('स्थापना')) missing.push('स्थापना');
        if (!fullText.includes('आह्वान') && !fullText.includes('आहवान')) missing.push('आह्वानन');
        if (!fullText.includes('स्थापन')) missing.push('स्थापन');
        if (!fullText.includes('सन्निधि') && !fullText.includes('सन्निधी')) missing.push('सन्निधिकरण');
        if (missing.length > 0) return `Missing sthapana components: ${missing.join(', ')}`;
    });

    runCheck(`All 8 Dravyas present in canonical order`, () => {
        const fullText = verses.map(v => v.hindi || '').join(' ');
        const missing = [];
        REQUIRED_DRAVYAS.forEach(d => {
            if (!fullText.includes(d.key)) {
                missing.push(d.name);
            }
        });
        if (missing.length > 0) return `Missing dravyas: ${missing.join(', ')}`;
    });

    runCheck(`Jaimala section present with Purnarghya and Ashirvad`, () => {
        const fullText = verses.map(v => v.hindi || '').join(' ');
        const missing = [];
        if (!fullText.includes('जयमाला')) missing.push('जयमाला');
        if (!fullText.includes('पूर्णार्घ्यं') && !fullText.includes('पूर्णार्घ्य')) missing.push('पूर्णार्घ्य');
        if (!fullText.includes('इत्याशीर्वाद') && !fullText.includes('पुष्पांजलिं')) missing.push('इत्याशीर्वादः / पुष्पांजलिं क्षिपेत्');
        if (missing.length > 0) return `Missing Jaimala components: ${missing.join(', ')}`;
    });

    console.log('');
});

// 7. Parity between public and build
console.log('--- Checking Parity Between public and build ---');
runCheck(`public/modules/ritual_data.js and build/modules/ritual_data.js are in parity for '${PUJA_KEY}'`, () => {
    const pubKey = 'public/modules/ritual_data.js';
    const bldKey = 'build/modules/ritual_data.js';
    const pubPuja = loadedModules[pubKey] || loadedModules[path.normalize(pubKey)];
    const bldPuja = loadedModules[bldKey] || loadedModules[path.normalize(bldKey)];

    if (!pubPuja || !bldPuja) {
        return `One or both modules failed to load`;
    }

    const pubJson = JSON.stringify(pubPuja);
    const bldJson = JSON.stringify(bldPuja);

    if (pubJson !== bldJson) {
        return `Mismatch between public and build module representations`;
    }
});

console.log('\n================================================================');
console.log(` SUMMARY: ${totalChecks - globalFailures}/${totalChecks} Checks Passed. (${globalFailures} Failures Detected)`);
console.log('================================================================\n');

if (globalFailures > 0) {
    console.error(`VALIDATION FAILED: Found ${globalFailures} defect(s) in '20-teerthankar-puja'.`);
    process.exit(1);
} else {
    console.log(`VALIDATION SUCCESS: '20-teerthankar-puja' is authentic, hygienic, and valid.`);
    process.exit(0);
}
