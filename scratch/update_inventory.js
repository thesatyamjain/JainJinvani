const fs = require('fs');
const path = require('path');
const { rawItems } = require('./generate_vrat_category.js');

const invPath = path.join(__dirname, '../src/data/inventory.ts');
let invText = fs.readFileSync(invPath, 'utf8');

// 1. Insert into subCategoryMap
const subCategoryVrat = `  "vrat": [
    {
      "id": "all",
      "label": "सभी विषय (174)"
    },
    {
      "id": "vrat-vidhi",
      "label": "प्रमुख व्रत विधियाँ",
      "description": "अनंतचतुर्दशी, निर्दोषसप्तमी, रत्नत्रय, षोडशकारण, मेरु पंक्ति आदि विशिष्ट व्रत नियम व अनुष्ठान विधि"
    },
    {
      "id": "vrat-soochi",
      "label": "१०५ व्रत समुच्चय",
      "description": "१०५ व्रतों की संपूर्ण प्रामाणिक नामावली, स्वरूप, संकल्प एवं आराधना क्रम"
    },
    {
      "id": "vrat-puja",
      "label": "व्रत पूजा व विधान",
      "description": "संकट हरण चौथ, षट्खण्डागम, तेरहद्वीप, भक्तामर, सहस्रनाम आदि व्रत पूजन व विधान"
    },
    {
      "id": "vrat-katha",
      "label": "व्रत कथाएँ",
      "description": "संकट हरण चौथ, जिनगुण संपत्ति, चंदनषष्ठी एवं अक्षय फल दशमी की पावन कथाएँ"
    },
    {
      "id": "samskar-vidhi",
      "label": "व्रत ग्रहण व संस्कार विधि",
      "description": "व्रत ग्रहण विधि, उद्यापन विधि, नवजात जिनदर्शन, नाम संस्कार व फलश्रुति"
    },
    {
      "id": "shravak-dharma",
      "label": "श्रावक धर्म व नियम",
      "description": "प्रतिक्रमण, श्रावक लक्षण, अष्टमूलगुण, २२ अभक्ष्य एवं १७ दैनिक नियम"
    }
  ],
`;

// Find where subCategoryMap ends: before `export const contentInventory`
const exportIndex = invText.indexOf('export const contentInventory:');
if (exportIndex === -1) {
  console.error('Could not find export const contentInventory');
  process.exit(1);
}

// Find the last `};` before exportIndex
const subCatEndIndex = invText.lastIndexOf('};', exportIndex);
invText = invText.substring(0, subCatEndIndex) + subCategoryVrat + invText.substring(subCatEndIndex);

// 2. Build contentInventory.vrat array
const vratInventoryItems = rawItems.map(item => {
  return {
    id: item.id,
    title: item.title,
    category: "vrat",
    subCategory: item.subCategory,
    badge: item.badge,
    author: "ब्रम्हचारी विनोद सागर शास्त्री",
    description: item.desc
  };
});

const vratInventoryStr = `  vrat: ${JSON.stringify(vratInventoryItems, null, 2)},\n`;

// Find where contentInventory ends: `\n};\n\n// Aliases for navigation categories`
const aliasAnchor = '// Aliases for navigation categories';
const aliasIndex = invText.indexOf(aliasAnchor);
if (aliasIndex === -1) {
  console.error('Could not find aliasAnchor');
  process.exit(1);
}

const contentInvEndIndex = invText.lastIndexOf('};', aliasIndex);
invText = invText.substring(0, contentInvEndIndex) + vratInventoryStr + invText.substring(contentInvEndIndex);

// 3. Add aliases
const aliases = `(contentInventory as any)['105-vrat'] = contentInventory.vrat;\n(contentInventory as any)['vrat-vidhi'] = contentInventory.vrat;\n`;
invText = invText.trimEnd() + '\n' + aliases;

fs.writeFileSync(invPath, invText, 'utf8');
console.log(`Successfully updated inventory.ts with ${rawItems.length} vrat items and aliases.`);
