const fs = require('fs');
const path = require('path');

// Configuration
const SEARCH_DATA_PATH = path.join(__dirname, '../../search-data.json');
const MODULES_DIR = path.join(__dirname, 'modules');

// Mock window to load modules
const window = {
    JINVANI_CONTENT: {},
    registerContentModule: function (data) {
        Object.assign(this.JINVANI_CONTENT, data);
    }
};
global.window = window;

// Category Metadata Map
const CATEGORY_MAP = {
    'stotra': { en: 'Stotra', hi: 'स्तोत्र', icon: '📿' },
    'puja': { en: 'Puja', hi: 'पूजा', icon: '🪔' },
    'parv-puja': { en: 'Parva Puja', hi: 'पर्व पूजा', icon: '✨' },
    'vidhan': { en: 'Vidhan', hi: 'विधान', icon: '📚' },
    'shastra': { en: 'Shastra', hi: 'शास्त्र', icon: '📜' },
    'itihas': { en: 'History', hi: 'इतिहास', icon: '🏛️' }, // content.js uses 'itihas'
    'history': { en: 'History', hi: 'इतिहास', icon: '🏛️' },
    'tattva': { en: 'Philosophy', hi: 'तत्व ज्ञान', icon: '🧠' }, // content.js uses 'tattva'
    'philosophy': { en: 'Philosophy', hi: 'तत्व ज्ञान', icon: '🧠' },
    'bhugol': { en: 'Cosmology', hi: 'जैन भूगोल', icon: '🌍' }, // content.js uses 'bhugol'
    'cosmology': { en: 'Cosmology', hi: 'जैन भूगोल', icon: '🌍' },
    'bhajan': { en: 'Bhajan', hi: 'भजन', icon: '🎵' },
    'path': { en: 'Path', hi: 'पाठ', icon: '📖' },
    'kids': { en: 'Kids', hi: 'बाल पाठशाळा', icon: '👶' },
    'parva': { en: 'Parva', hi: 'पर्व', icon: '🎉' },
    'arti': { en: 'Arti', hi: 'आरती', icon: '🔥' },
    'chalisa': { en: 'Chalisa', hi: 'चालीसा', icon: '📜' },
    'calendar': { en: 'Calendar', hi: 'पंचांग / कैलेंडर', icon: '📅' }
};

// Helper to strip HTML
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Helper to generate keywords
function generateKeywords(title, subtitle, category) {
    const text = `${title} ${subtitle || ''} ${category}`;
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2);
}

// Main function
function generateIndex() {
    console.log('Loading modules...');

    // Read all module files
    if (fs.existsSync(MODULES_DIR)) {
        const files = fs.readdirSync(MODULES_DIR);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                const filePath = path.join(MODULES_DIR, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                // Execute the file content in the context of our mock window
                // Note: simplified eval for this specific trusted content format
                try {
                    eval(fileContent);
                    console.log(`Loaded ${file}`);
                } catch (e) {
                    console.error(`Error loading ${file}:`, e.message);
                }
            }
        });
    }

    const newItems = [];
    const contentData = window.JINVANI_CONTENT;

    console.log(`Processing ${Object.keys(contentData).length} content items...`);

    Object.values(contentData).forEach(item => {
        const catMeta = CATEGORY_MAP[item.category] || { en: item.category, hi: item.category, icon: '📄' };

        newItems.push({
            title: item.title,
            titleEn: item.subtitle || item.title,
            url: `sadhana/viewer.html?id=${item.id}`,
            category: catMeta.en,
            categoryHi: catMeta.hi,
            icon: catMeta.icon,
            keywords: generateKeywords(item.title, item.subtitle, item.category),
            content: stripHtml(item.content)
        });
    });

    // Read existing search-data.json to preserve static pages or use default defaults
    let staticItems = [
        {
            "title": "Jain Granthalaya (Library)",
            "titleEn": "Jain Library",
            "url": "library/index.html",
            "category": "Library",
            "categoryHi": "ग्रन्थालय",
            "icon": "📚",
            "keywords": ["library", "granthalaya", "books", "shastra", "scriptures", "history", "philosophy"],
            "content": "Jain Granthalaya - A digital library of Jain scriptures, philosophy, and history."
        },
        {
            "title": "स्तोत्र संग्रह (Stotra Collection)",
            "titleEn": "Stotra Collection",
            "url": "sadhana/stotra.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "📿",
            "keywords": ["stotra", "hymns", "prayers", "devotion"],
            "content": "Collection of Jain Stotras like Bhaktamar, Tattvartha Sutra, etc."
        },
        {
            "title": "पूजा संग्रह (Puja Collection)",
            "titleEn": "Puja Collection",
            "url": "sadhana/puja.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "🪔",
            "keywords": ["puja", "worship", "rituals", "ashtadravya"],
            "content": "Collection of Jain Pujas for daily worship and special occasions."
        },
        {
            "title": "विधान संग्रह (Vidhan Collection)",
            "titleEn": "Vidhan Collection",
            "url": "sadhana/vidhan.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "📚",
            "keywords": ["vidhan", "rituals", "grand worship", "mandal"],
            "content": "Collection of major Jain Vidhans like Das Lakshan, Sidhha Chakra, etc."
        },
        {
            "title": "चालीसा संग्रह (Chalisa Collection)",
            "titleEn": "Chalisa Collection",
            "url": "sadhana/chalisa.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "📜",
            "keywords": ["chalisa", "40 verses", "hymns", "prayers"],
            "content": "Collection of Jain Chalisas dedicated to Tirthankaras and deities."
        },
        {
            "title": "आरती संग्रह (Arti Collection)",
            "titleEn": "Arti Collection",
            "url": "sadhana/arti.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "🔥",
            "keywords": ["arti", "aarti", "lamp", "worship", "devotion"],
            "content": "Collection of Jain Artis for daily worship."
        },
        {
            "title": "भजन संग्रह (Bhajan Collection)",
            "titleEn": "Bhajan Collection",
            "url": "sadhana/bhajan.html",
            "category": "Sadhana",
            "categoryHi": "साधना",
            "icon": "🎵",
            "keywords": ["bhajan", "songs", "devotional", "music"],
            "content": "Collection of Jain Bhajans and devotional songs."
        },
        {
            "title": "शास्त्र स्वाध्याय (Scriptures)",
            "titleEn": "Scriptures",
            "url": "library/shastra.html",
            "category": "Library",
            "categoryHi": "ग्रन्थालय",
            "icon": "📜",
            "keywords": ["shastra", "scriptures", "books", "reading"],
            "content": "Study major Jain Shastras and scriptures."
        }
    ];

    if (fs.existsSync(SEARCH_DATA_PATH)) {
        try {
            // Try to rescue manual entries if possible, but fallback to staticItems if failed
            const raw = fs.readFileSync(SEARCH_DATA_PATH, 'utf8');
            // If we just wrote it, it might not have static items.
            // But we want to prefer the staticItems list above for now as safe default.
            // We can proceed with just staticItems + newItems
        } catch (e) {
            console.error('Error reading existing search data:', e.message);
        }
    }

    // Combine
    const finalData = {
        generated: new Date().toISOString(),
        version: "1.0",
        items: [...staticItems, ...newItems]
    };

    // Write back
    fs.writeFileSync(SEARCH_DATA_PATH, JSON.stringify(finalData, null, 2));
    console.log(`Successfully generated search-data.json with ${finalData.items.length} total items.`);
}

generateIndex();
