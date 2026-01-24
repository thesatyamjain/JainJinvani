// Bridge to access window.JINVANI_CONTENT from TypeScript
declare global {
    interface Window {
        JINVANI_CONTENT: Record<string, any>;
        registerContentModule: (moduleData: any) => void;
        searchJinvaniContent: (query: string) => any[];
    }
}

export const getJinvaniContent = () => {
    return window.JINVANI_CONTENT || {};
};

export const getAllContentIds = () => {
    return Object.keys(window.JINVANI_CONTENT || {});
};

export const getContentById = (id: string) => {
    return window.JINVANI_CONTENT?.[id];
};

export { };
