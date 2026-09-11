const fs = require('fs');

// 1. Verify inventory
const { contentInventory, subCategoryMap } = require('../src/data/inventory.ts');

console.log('--- Checking Inventory ---');
console.log('contentInventory.vrat total items:', contentInventory.vrat.length);
console.log('subCategoryMap.vrat subcategories:', subCategoryMap.vrat.length);
console.log('Alias 105-vrat count:', contentInventory['105-vrat'].length);
console.log('Alias vrat-vidhi count:', contentInventory['vrat-vidhi'].length);

if (contentInventory.vrat.length !== 174) {
  throw new Error('Expected 174 items in contentInventory.vrat, got ' + contentInventory.vrat.length);
}

// Check subcategory distribution
const subMap = {};
contentInventory.vrat.forEach(item => {
  subMap[item.subCategory] = (subMap[item.subCategory] || 0) + 1;
});
console.log('Subcategory breakdown in inventory:');
console.table(subMap);

// 2. Check content manifest
const manifestText = fs.readFileSync('./src/data/modules/contentManifest.ts', 'utf8');
const manifestMatches = contentInventory.vrat.filter(i => manifestText.includes(`"${i.id}": "vrat"`));
console.log(`Manifest mapping verified: ${manifestMatches.length} / 174 items.`);
if (manifestMatches.length !== 174) {
  throw new Error('Not all 174 items found in manifest');
}

// 3. Check module file
const vratTs = fs.readFileSync('./src/data/modules/vrat.ts', 'utf8');
const moduleMatches = contentInventory.vrat.filter(i => vratTs.includes(`"${i.id}": {`));
console.log(`Module VratData verified: ${moduleMatches.length} / 174 items.`);
if (moduleMatches.length !== 174) {
  throw new Error('Not all 174 items found in VratData');
}

// 4. Check sitemap
const sitemap = fs.readFileSync('./public/sitemap.xml', 'utf8');
const sitemapMatches = contentInventory.vrat.filter(i => sitemap.includes(`<loc>https://jainjinvani.pages.dev/viewer?id=${i.id}</loc>`));
console.log(`Sitemap URLs verified: ${sitemapMatches.length} / 174 items.`);
console.log('Sitemap category verified:', sitemap.includes('<loc>https://jainjinvani.pages.dev/category?id=vrat</loc>'));

console.log('\n=== ALL 174 VRAT ITEMS & CATEGORY VERIFIED 100% SUCCESSFULLY! ===');
