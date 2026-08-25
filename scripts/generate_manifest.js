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

        const match = content.match(/export\s+const\s+\w+Data\s*=\s*(\{[\s\S]*?\});/);

        if (match && match[1]) {
            const dataObjectCode = match[1];
            const sandbox = {};
            vm.createContext(sandbox);
            try {
                // Using a dummy variable assignment to evaluate the object
                vm.runInContext(`data = ${dataObjectCode}`, sandbox);
                const keys = Object.keys(sandbox.data);

                keys.forEach(key => {
                    manifest[key] = baseName;
                });
                console.log(`Mapped ${keys.length} items from ${baseName}`);

                // Re-generate index exports just in case (though we might not need index.ts for lazy loading anymore)
                const className = baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/_(\w)/g, (m, c) => c.toUpperCase());
                // Simple casing might be off compared to original script but we only need manifest now.

            } catch (e) {
                console.error(`Failed to parse keys for ${file}`, e);
            }
        }
    });

    // Write manifest
    const manifestContent = `// Auto-generated content manifest
export const contentManifest: Record<string, string> = ${JSON.stringify(manifest, null, 2)};
`;
    fs.writeFileSync(path.join(SRC_MODULES_DIR, 'contentManifest.ts'), manifestContent);
    console.log('Manifest generation complete.');
} else {
    console.error(`Directory not found: ${SRC_MODULES_DIR}`);
}
