/**
 * Jinvani Data Loader
 * Aggregates content from all modules into a single global object.
 */

window.JINVANI_CONTENT = {};

// Helper to merge modules
window.registerContentModule = function (moduleData) {
    Object.assign(window.JINVANI_CONTENT, moduleData);
    console.log("Jinvani Module Loaded. Total items:", Object.keys(window.JINVANI_CONTENT).length);
};

// Search Helper
window.searchJinvaniContent = function (query) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    Object.values(window.JINVANI_CONTENT).forEach(item => {
        if (item.title.toLowerCase().includes(lowerQuery) ||
            item.content.toLowerCase().includes(lowerQuery)) {
            results.push(item);
        }
    });
    return results;
};
