import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_MODULES_DIR = path.resolve(__dirname, '../src/data/modules');

const manifestContent = fs.readFileSync(path.join(SRC_MODULES_DIR, 'contentManifest.ts'), 'utf-8');
const manifestIds = [];
const regex = /"([^"]+)":\s*"([^"]+)"/g;
const manifestMap = {};
let match;
while ((match = regex.exec(manifestContent)) !== null) {
  manifestIds.push(match[1]);
  manifestMap[match[1]] = match[2];
}

const files = fs.readdirSync(SRC_MODULES_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'contentManifest.ts');

const allItems = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(SRC_MODULES_DIR, file), 'utf-8');
  const m = content.match(/export\s+const\s+\w+Data(?::\s*Record<[^>]+>)?\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (m && m[1]) {
    const sandbox = {};
    vm.createContext(sandbox);
    try {
      vm.runInContext(`data = ${m[1]}`, sandbox);
      Object.assign(allItems, sandbox.data);
    } catch (e) {
      console.error(`Error in ${file}:`, e.message);
    }
  }
}

const missing = manifestIds.filter(id => !allItems[id]);
console.log('Manifest total:', manifestIds.length);
console.log('Loaded total:', Object.keys(allItems).length);
console.log('Missing items count:', missing.length);
if (missing.length > 0) {
  console.log('Missing items:', missing.map(id => `${id} (module: ${manifestMap[id]})`));
}
