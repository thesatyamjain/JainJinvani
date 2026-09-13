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
        for (const exp of Object.values(modData)) {
            if (exp && typeof exp === 'object' && (exp as any)[id]) {
                return (exp as any)[id];
            }
        }
    }

    try {
        const mod = await import(`../data/modules/${moduleName}.ts`);
        MODULE_CACHE[moduleName] = mod;

        // Extract the data object from the module
        for (const exp of Object.values(mod)) {
            if (exp && typeof exp === 'object' && (exp as any)[id]) {
                return (exp as any)[id];
            }
        }
    } catch (error) {
        console.error(`Failed to load module ${moduleName} for content ${id}`, error);
        return null;
    }
    return null;
};

export { };
