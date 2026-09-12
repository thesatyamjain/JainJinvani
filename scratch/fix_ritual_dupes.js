const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/modules/ritual.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const targetStart = '\n"daslakshan-dharma-puja": {"id":"daslakshan-dharma-puja"';
const targetEnd = '\n"brihat-shantidhara": {';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  content = content.slice(0, startIndex) + content.slice(endIndex);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully removed duplicate keys from ritual.ts');
} else {
  console.error('Could not find target boundaries:', { startIndex, endIndex });
}
