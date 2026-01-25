import { contentManifest } from '../data/modules/contentManifest';

// Cache for loaded modules
const MODULE_CACHE: Record<string, any> = {};

export const getJinvaniContent = () => {
    // This synchronous method is deprecated for full content but kept for compatibility
    return MODULE_CACHE;
};

export const getAllContentIds = () => {
    return Object.keys(contentManifest);
};

export const getContentById = (id: string) => {
    // Legacy sync access - will return undefined if not yet loaded
    // Try to find in cache first
    for (const modName of Object.values(MODULE_CACHE)) {
        if (modName[id]) return modName[id];
    }
    return undefined;
};

export const getContentByIdAsync = async (id: string) => {
    const moduleName = contentManifest[id];
    if (!moduleName) {
        console.error(`Content ID ${id} not found in manifest.`);
        return null;
    }

    // Check cache first
    if (MODULE_CACHE[moduleName]) {
        const modData = MODULE_CACHE[moduleName];
        // The module exports { XData: { ... } } or just the data?
        // Our migration script created: export const ArtiData = { ... }
        // We need to access the export. Dynamic import returns a Module Namespace Object.
        // Let's assume the first export is our data.
        const values = Object.values(modData);
        if (values.length > 0) {
            const dataMap = values[0] as Record<string, any>;
            return dataMap[id];
        }
    }

    try {
        const mod = await import(`../data/modules/${moduleName}.ts`);
        MODULE_CACHE[moduleName] = mod;

        // Extract the data object from the module
        const values = Object.values(mod);
        if (values.length > 0) {
            const dataMap = values[0] as Record<string, any>;
            return dataMap[id];
        }
    } catch (error) {
        console.error(`Failed to load module ${moduleName} for content ${id}`, error);
        return null;
    }
    return null;
};

export { };
