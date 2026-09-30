const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.resolve(projectRoot, 'mobile', 'assets', 'data');
const tempDir = path.resolve(projectRoot, 'mobile', 'assets', 'data', '_temp');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

console.log('Exporting all data to:', outputDir);

function bundleAndLoad(entryFile) {
  const tempOutput = path.join(tempDir, path.basename(entryFile, path.extname(entryFile)) + '.bundle.cjs');
  esbuild.buildSync({
    entryPoints: [entryFile],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: tempOutput,
    logLevel: 'error',
  });
  delete require.cache[require.resolve(tempOutput)];
  const mod = require(tempOutput);
  return mod;
}

// 1. Content Manifest
try {
  const manifestMod = bundleAndLoad(path.join(projectRoot, 'src/data/modules/contentManifest.ts'));
  const manifestData = manifestMod.contentManifest || manifestMod.default || {};
  fs.writeFileSync(
    path.join(outputDir, 'content_manifest.json'),
    JSON.stringify(manifestData, null, 2),
    'utf8'
  );
  console.log(`✓ content_manifest.json (${Object.keys(manifestData).length} items)`);
} catch (e) {
  console.error('Error exporting contentManifest:', e);
}

// 2. Modules
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
    const mod = bundleAndLoad(path.join(projectRoot, `src/data/modules/${modName}.ts`));
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
      console.log(`✓ ${modName}.json (${Object.keys(data).length} items)`);
    }
  } catch (e) {
    console.error(`Error exporting ${modName}:`, e.message);
  }
}

// 3. Inventory
try {
  const invMod = bundleAndLoad(path.join(projectRoot, 'src/data/inventory.ts'));
  const invData = {
    contentInventory: invMod.contentInventory || {},
    subCategoryMap: invMod.subCategoryMap || {},
  };
  fs.writeFileSync(
    path.join(outputDir, 'inventory.json'),
    JSON.stringify(invData, null, 2),
    'utf8'
  );
  const totalItems = Object.values(invData.contentInventory).reduce((acc, list) => acc + (list ? list.length : 0), 0);
  console.log(`✓ inventory.json (${totalItems} items across ${Object.keys(invData.contentInventory).length} categories)`);
} catch (e) {
  console.error('Error exporting inventory:', e.message);
}

// 4. Festivals
try {
  const festMod = bundleAndLoad(path.join(projectRoot, 'src/data/festivals.ts'));
  const fData = festMod.jainFestivals || festMod.JAIN_FESTIVALS || [];
  fs.writeFileSync(
    path.join(outputDir, 'festivals.json'),
    JSON.stringify(fData, null, 2),
    'utf8'
  );
  console.log(`✓ festivals.json (${fData.length} festivals)`);
} catch (e) {
  console.error('Error exporting festivals:', e.message);
}

// 5. Tirthankaras
try {
  const tMod = bundleAndLoad(path.join(projectRoot, 'src/data/tirthankaras.ts'));
  const tData = tMod.TIRTHANKARAS || tMod.tirthankaras || [];
  fs.writeFileSync(
    path.join(outputDir, 'tirthankaras.json'),
    JSON.stringify(tData, null, 2),
    'utf8'
  );
  console.log(`✓ tirthankaras.json (${tData.length} tirthankaras)`);
} catch (e) {
  console.error('Error exporting tirthankaras:', e.message);
}

// 6. Trikal Tirthankaras
try {
  const ttMod = bundleAndLoad(path.join(projectRoot, 'src/data/trikalTirthankaras.ts'));
  const ttData = ttMod.TRIKAL_TIRTHANKARAS || ttMod.trikalTirthankaras || ttMod;
  fs.writeFileSync(
    path.join(outputDir, 'trikal_tirthankaras.json'),
    JSON.stringify(ttData, null, 2),
    'utf8'
  );
  console.log(`✓ trikal_tirthankaras.json`);
} catch (e) {
  console.error('Error exporting trikalTirthankaras:', e.message);
}

// Clean up temporary bundles
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}

console.log('--- ALL DATA EXPORTED SUCCESSFULLY FOR FLUTTER APP ---');
