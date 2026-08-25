import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public/modules');
const SRC_DIR = path.resolve(__dirname, '../src/data/modules');

// Ensure target dir exists
if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
}

const files = fs.readdirSync(PUBLIC_DIR);

console.log(`Found ${files.length} files in ${PUBLIC_DIR}`);

const indexExports = [];

files.forEach(file => {
    if (!file.endsWith('.js')) return;

    const content = fs.readFileSync(path.join(PUBLIC_DIR, file), 'utf-8');

    // Regex 1: const content = { ... }; (IIFE style)
    let match = content.match(/const\s+content\s*=\s*(\{[\s\S]*?\});\s*if/);

    // Regex 2: window.registerContentModule({ ... }); (Direct style)
    if (!match) {
        match = content.match(/window\.registerContentModule\s*\(\s*(\{[\s\S]*?\})\s*\)/);
    }

    if (match && match[1]) {
        const dataObject = match[1];
        const baseName = path.basename(file, '.js').replace(/_data$/, '').replace(/-/g, '_'); // arti_data.js -> arti
        const className = baseName.charAt(0).toUpperCase() + baseName.slice(1); // arti -> Arti

        const tsContent = `// Auto-generated from ${file}
export const ${className}Data = ${dataObject};
`;

        fs.writeFileSync(path.join(SRC_DIR, `${baseName}.ts`), tsContent);
        indexExports.push(`export { ${className}Data } from './${baseName}';`);
        console.log(`Migrated ${file} -> ${baseName}.ts`);
    } else {
        console.error(`Failed to parse ${file}`);
    }
});

// Create index.ts
fs.writeFileSync(path.join(SRC_DIR, 'index.ts'), indexExports.join('\n'));
console.log('Migration complete.');
