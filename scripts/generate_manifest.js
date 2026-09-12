import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note: We are now migrating from the PUBLIC_DIR.
// IMPORTANT: If you already deleted public/modules, you might need to restore them or parse the src/data/modules files instead.
// However, the previous step deleted public/modules.
// CRITICAL: Checks if public/modules exists. If not, we scan src/data/modules to rebuild the manifest.
// Since the user deleted public/modules in the previous step, we must scan the *generated* typescript files in src/data/modules.

const SRC_MODULES_DIR = path.resolve(__dirname, '../src/data/modules');

// Check if we need to scan source files instead of public
const SCAN_SRC = true; // We are in a state where public is gone.

console.log(`Scanning modules in ${SRC_MODULES_DIR}...`);

const manifest = {};
const indexExports = [];

if (fs.existsSync(SRC_MODULES_DIR)) {
    const files = fs.readdirSync(SRC_MODULES_DIR);

    files.forEach(file => {
        // Skip index.ts and contentManifest.ts
        if (file === 'index.ts' || file === 'contentManifest.ts' || !file.endsWith('.ts')) return;

        const baseName = path.basename(file, '.ts');
        const content = fs.readFileSync(path.join(SRC_MODULES_DIR, file), 'utf-8');

        // Pattern to find: export const XData = { ... };
        // We can try to regex extract the object or just use vm on the assignments.
        // The previous script generated: export const ArtiData = { ... };

        // We'll perform a simple regex to extract the keys from the object literal string.
        // It's safer to extract the JS object part and parse it.

        const match = content.match(/export\s+const\s+\w+Data(?::\s*Record<[^>]+>)?\s*=\s*(\{[\s\S]*\});?\s*$/);

        if (match && match[1]) {
            const dataObjectCode = match[1];
            const sandbox = {};
            vm.createContext(sandbox);
            try {
                vm.runInContext(`data = ${dataObjectCode}`, sandbox);
                const items = sandbox.data;
                const keys = Object.keys(items);

                keys.forEach(key => {
                    // If conflict, prefer matching category
                    if (manifest[key]) {
                        const itemCat = items[key]?.category;
                        if (itemCat === baseName) {
                            manifest[key] = baseName;
                        }
                    } else {
                        manifest[key] = baseName;
                    }
                });
                console.log(`Mapped ${keys.length} items from ${baseName}`);
            } catch (e) {
                console.error(`Failed to parse keys for ${file}`, e);
            }
        } else {
            console.warn(`Could not match export in ${file}`);
        }
    });

    // Sort manifest keys alphabetically for deterministic output
    const sortedManifest = {};
    Object.keys(manifest).sort().forEach(k => {
        sortedManifest[k] = manifest[k];
    });

    // Write manifest
    const manifestContent = `// Auto-generated manifest mapping content IDs to their chunk modules
export const contentManifest: Record<string, string> = ${JSON.stringify(sortedManifest, null, 2)};
`;
    fs.writeFileSync(path.join(SRC_MODULES_DIR, 'contentManifest.ts'), manifestContent);
    console.log(`Manifest generation complete. Total items: ${Object.keys(sortedManifest).length}`);
} else {
    console.error(`Directory not found: ${SRC_MODULES_DIR}`);
}
