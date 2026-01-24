const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const modulesDir = path.join(projectRoot, 'src', 'data', 'sadhana', 'data', 'modules');
const inventoryFile = path.join(projectRoot, 'src', 'data', 'inventory.ts');

// regex to find IDs in JS files: "id": "value" or 'id': 'value'
const dataIdRegex = /["']id["']\s*:\s*["']([^"']+)["']/g;
// regex for inventory: id: 'value' or id: "value" or 'id': "value" etc
const inventoryIdRegex = /id\s*:\s*["']([^"']+)["']/g;

function getAllMatches(regex, content) {
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

async function verify() {
    console.log("Starting Verification...");

    // 1. Read Inventory
    if (!fs.existsSync(inventoryFile)) {
        console.error(`Inventory file not found: ${inventoryFile}`);
        return;
    }
    const inventoryContent = fs.readFileSync(inventoryFile, 'utf-8');
    const inventoryIds = new Set(getAllMatches(inventoryIdRegex, inventoryContent));
    console.log(`Found ${inventoryIds.size} IDs in Inventory.`);

    // 2. Read Data Modules
    if (!fs.existsSync(modulesDir)) {
        console.error(`Modules directory not found: ${modulesDir}`);
        return;
    }

    const files = fs.readdirSync(modulesDir);
    const foundIds = new Map(); // ID -> Filename
    let duplicateIds = [];

    for (const file of files) {
        if (!file.endsWith('.js')) continue;
        const filePath = path.join(modulesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const ids = getAllMatches(dataIdRegex, content);

        for (const id of ids) {
            if (foundIds.has(id)) {
                duplicateIds.push({ id, file1: foundIds.get(id), file2: file });
            } else {
                foundIds.set(id, file);
            }
        }
    }
    console.log(`Found ${foundIds.size} unique IDs in Data Modules.`);

    // 3. Compare
    const missingInModules = [];
    for (const id of inventoryIds) {
        if (!foundIds.has(id)) {
            missingInModules.push(id);
        }
    }

    const missingInInventory = [];
    for (const [id, file] of foundIds) {
        if (!inventoryIds.has(id)) {
            missingInInventory.push({ id, file });
        }
    }

    // 4. Report to File
    const reportPath = path.join(projectRoot, 'verification_report.md');
    let report = `# Content Verification Report\n\n`;
    report += `**Inventory IDs:** ${inventoryIds.size}\n\n`;
    report += `**Data Module IDs:** ${foundIds.size}\n\n`;

    if (duplicateIds.length > 0) {
        report += `## ⚠️ Duplicate IDs in Data Modules\n`;
        duplicateIds.forEach(d => report += `- \`${d.id}\`: ${d.file1} and ${d.file2}\n`);
    } else {
        report += `## ✅ No Duplicate IDs\n`;
    }

    if (missingInModules.length > 0) {
        report += `\n## ❌ Missing in Data Modules (Present in Inventory)\n`;
        report += `These IDs are listed in \`inventory.ts\` but were not found in any data file.\n\n`;
        missingInModules.sort().forEach(id => report += `- ${id}\n`);
    } else {
        report += `\n## ✅ All Inventory IDs found in Data Modules\n`;
    }

    if (missingInInventory.length > 0) {
        report += `\n## 🆕 Extra in Data Modules (Missing in Inventory)\n`;
        report += `These IDs exist in data files but are not listed in \`inventory.ts\`.\n\n`;
        missingInInventory.sort((a, b) => a.id.localeCompare(b.id)).forEach(item => report += `- **${item.id}** (${item.file})\n`);
    } else {
        report += `\n## ✅ All Data Module IDs found in Inventory\n`;
    }

    fs.writeFileSync(reportPath, report);
    console.log(`Report saved to ${reportPath}`);
}

verify();
