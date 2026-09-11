const { rawItems } = require('./generate_vrat_category.js');
const fs = require('fs');
const inv = fs.readFileSync('./src/data/inventory.ts', 'utf8');

const existingIds = [];
const regex = /"id":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(inv)) !== null) {
  existingIds.push(m[1]);
}

const clashInv = rawItems.filter(r => existingIds.includes(r.id));
console.log('Clashes with inventory.ts:', clashInv.map(c => c.id));

const manifestText = fs.readFileSync('./src/data/modules/contentManifest.ts', 'utf8');
const manifestIds = [];
const mRegex = /'([^']+)':\s*'[^']+'/g;
while ((m = mRegex.exec(manifestText)) !== null) {
  manifestIds.push(m[1]);
}
const clashManifest = rawItems.filter(r => manifestIds.includes(r.id));
console.log('Clashes with contentManifest.ts:', clashManifest.map(c => c.id));
