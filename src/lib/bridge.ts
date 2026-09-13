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

const extractItemFromModule = (mod: any, id: string) => {
    if (!mod || typeof mod !== 'object') return undefined;
    for (const exp of Object.values(mod)) {
        if (exp && typeof exp === 'object' && (exp as any)[id]) {
            return (exp as any)[id];
        }
    }
    return undefined;
};

export const getContentById = (id: string) => {
    // Synchronous memory cache lookup
    const moduleName = contentManifest[id];
    if (moduleName && MODULE_CACHE[moduleName]) {
        const item = extractItemFromModule(MODULE_CACHE[moduleName], id);
        if (item) return item;
    }
    for (const mod of Object.values(MODULE_CACHE)) {
        const item = extractItemFromModule(mod, id);
        if (item) return item;
    }
    return undefined;
};

export const getContentByIdAsync = async (id: string) => {
    // Return immediately if already cached
    const cached = getContentById(id);
    if (cached) return cached;

    const moduleName = contentManifest[id];
    if (!moduleName) {
        console.error(`Content ID ${id} not found in manifest.`);
        return null;
    }

    try {
        const mod = await import(`../data/modules/${moduleName}.ts`);
        MODULE_CACHE[moduleName] = mod;
        return extractItemFromModule(mod, id) || null;
    } catch (error) {
        console.error(`Failed to load module ${moduleName} for content ${id}`, error);
        return null;
    }
};

// Smart on-demand preloader: loads chunk in background on hover/touch for 0ms transition
export const preloadContent = (id?: string) => {
    if (!id) return;
    const moduleName = contentManifest[id];
    if (!moduleName || MODULE_CACHE[moduleName]) return;
    import(`../data/modules/${moduleName}.ts`).then((mod) => {
        MODULE_CACHE[moduleName] = mod;
    }).catch(() => {});
};

export const preloadModule = (moduleName: string) => {
    if (!moduleName || MODULE_CACHE[moduleName]) return;
    import(`../data/modules/${moduleName}.ts`).then((mod) => {
        MODULE_CACHE[moduleName] = mod;
    }).catch(() => {});
};

export { };
