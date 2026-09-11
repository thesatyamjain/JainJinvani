const fs = require('fs');

function findDups(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const keyRegex = /^\s*"([^"]+)":/;
  const seen = new Map();
  const dups = [];
  lines.forEach((line, idx) => {
    const match = line.match(keyRegex);
    if (match) {
      const key = match[1];
      if (seen.has(key)) {
        dups.push({ key, firstLine: seen.get(key) + 1, dupLine: idx + 1 });
      } else {
        seen.set(key, idx);
      }
    }
  });
  return dups;
}

console.log('Manifest duplicates:', findDups('./src/data/modules/contentManifest.ts'));
console.log('Ritual duplicates:', findDups('./src/data/modules/ritual.ts'));
