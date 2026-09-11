const fs = require('fs');
const path = require('path');
const { rawItems } = require('./generate_vrat_category.js');

const manifestPath = path.join(__dirname, '../src/data/modules/contentManifest.ts');
let manifestText = fs.readFileSync(manifestPath, 'utf8');

// Find insertion point before '};'
const lastBraceIndex = manifestText.lastIndexOf('};');
if (lastBraceIndex === -1) {
  console.error('Could not find closing brace in contentManifest.ts');
  process.exit(1);
}

let additions = '\n  // 105 Vrats, Vidhis, Pujas & Udyapan (Book by Br. Vinod Sagar Shastri)\n';
rawItems.forEach(item => {
  additions += `  "${item.id}": "vrat",\n`;
});

const newContent = manifestText.substring(0, lastBraceIndex) + additions + manifestText.substring(lastBraceIndex);
fs.writeFileSync(manifestPath, newContent, 'utf8');
console.log(`Updated contentManifest.ts with ${rawItems.length} items.`);
