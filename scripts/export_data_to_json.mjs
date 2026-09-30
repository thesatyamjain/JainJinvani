import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.resolve(projectRoot, 'mobile', 'assets', 'data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Exporting data to:', outputDir);

async function runExport() {
  // 1. Export content manifest
  try {
    const manifestMod = await import('../src/data/modules/contentManifest.ts');
    fs.writeFileSync(
      path.join(outputDir, 'content_manifest.json'),
      JSON.stringify(manifestMod.contentManifest, null, 2),
      'utf8'
    );
    console.log('✓ content_manifest.json exported (' + Object.keys(manifestMod.contentManifest).length + ' entries)');
  } catch (e) {
    console.error('Failed to export contentManifest:', e);
  }

  // 2. Export modules
  const moduleNames = [
    'arti',
    'bhajan',
    'chalisa',
    'parva',
    'path',
    'shastra',
    'vidhi',
    'balsanskar',
    'bhugol',
    'itihas',
    'tattva',
    'vrat',
    'stotra',
    'puja',
  ];

  for (const modName of moduleNames) {
    try {
      const mod = await import(`../src/data/modules/${modName}.ts`);
      // Find the main exported object (e.g. ArtiData, PujaData)
      let data = null;
      for (const [key, val] of Object.entries(mod)) {
        if (typeof val === 'object' && val !== null) {
          data = val;
          break;
        }
      }
      if (data) {
        fs.writeFileSync(
          path.join(outputDir, `${modName}.json`),
          JSON.stringify(data, null, 2),
          'utf8'
        );
        console.log(`✓ ${modName}.json exported (${Object.keys(data).length} entries)`);
      } else {
        console.warn(`! No data object found in ${modName}.ts`);
      }
    } catch (e) {
      console.error(`Failed to export ${modName}:`, e.message);
    }
  }

  // 3. Export inventory
  try {
    const invMod = await import('../src/data/inventory.ts');
    const invData = {
      contentInventory: invMod.contentInventory || invMod.CONTENT_INVENTORY || [],
      subCategoryMap: invMod.subCategoryMap || {},
      categoryMetadata: invMod.categoryMetadata || {},
    };
    fs.writeFileSync(
      path.join(outputDir, 'inventory.json'),
      JSON.stringify(invData, null, 2),
      'utf8'
    );
    console.log('✓ inventory.json exported');
  } catch (e) {
    console.error('Failed to export inventory:', e.message);
  }

  // 4. Export festivals
  try {
    const festMod = await import('../src/data/festivals.ts');
    let fData = festMod.JAIN_FESTIVALS || festMod.festivals || festMod.FESTIVALS || festMod.default || [];
    fs.writeFileSync(
      path.join(outputDir, 'festivals.json'),
      JSON.stringify(fData, null, 2),
      'utf8'
    );
    console.log('✓ festivals.json exported');
  } catch (e) {
    console.error('Failed to export festivals:', e.message);
  }

  // 5. Export tirthankaras
  try {
    const tMod = await import('../src/data/tirthankaras.ts');
    let tData = tMod.TIRTHANKARAS || tMod.tirthankaras || [];
    fs.writeFileSync(
      path.join(outputDir, 'tirthankaras.json'),
      JSON.stringify(tData, null, 2),
      'utf8'
    );
    console.log('✓ tirthankaras.json exported');
  } catch (e) {
    console.error('Failed to export tirthankaras:', e.message);
  }

  // 6. Export trikal tirthankaras
  try {
    const ttMod = await import('../src/data/trikalTirthankaras.ts');
    let ttData = ttMod.TRIKAL_TIRTHANKARAS || ttMod.trikalTirthankaras || ttMod;
    fs.writeFileSync(
      path.join(outputDir, 'trikal_tirthankaras.json'),
      JSON.stringify(ttData, null, 2),
      'utf8'
    );
    console.log('✓ trikal_tirthankaras.json exported');
  } catch (e) {
    console.error('Failed to export trikalTirthankaras:', e.message);
  }

  console.log('All data exported successfully!');
}

runExport();
