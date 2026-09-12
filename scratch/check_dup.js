const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/data/modules');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'contentManifest.ts' && f !== 'index.ts');

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf-8');
  const matches = [...content.matchAll(/"([^"]+)"\s*:\s*\{/g)].map(m => m[1]);
  const seen = new Set();
  const dupes = [];
  for (const id of matches) {
    if (seen.has(id)) dupes.push(id);
    seen.add(id);
  }
  if (dupes.length) console.log(f, 'has duplicate keys:', dupes);
}
console.log('Check complete.');
