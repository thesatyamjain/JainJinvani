import { Favorite, ReadingProgress, UserSettings } from '../types';

// LocalStorage utility functions for Jain Jinvani

// Favorites
export const getFavorites = (): Favorite[] => {
    try {
        const stored = localStorage.getItem('jain_favorites');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const addFavorite = (item: Omit<Favorite, 'timestamp'>): void => {
    const favorites = getFavorites();
    const newFavorite: Favorite = {
        ...item,
        timestamp: Date.now()
    };
    favorites.unshift(newFavorite);
    localStorage.setItem('jain_favorites', JSON.stringify(favorites));
};

export const removeFavorite = (id: string): void => {
    const favorites = getFavorites().filter(f => f.id !== id);
    localStorage.setItem('jain_favorites', JSON.stringify(favorites));
};

export const isFavorite = (id: string): boolean => {
    return getFavorites().some(f => f.id === id);
};

// Reading Progress
export const getReadingProgress = (id: string): number => {
    try {
        const stored = localStorage.getItem('jain_reading_progress');
        const progress: Record<string, ReadingProgress> = stored ? JSON.parse(stored) : {};
        return progress[id]?.progress || 0;
    } catch {
        return 0;
    }
};

export const setReadingProgress = (id: string, progress: number): void => {
    try {
        const stored = localStorage.getItem('jain_reading_progress');
        const allProgress: Record<string, ReadingProgress> = stored ? JSON.parse(stored) : {};
        allProgress[id] = {
            id,
            progress,
            lastRead: Date.now()
        };
        localStorage.setItem('jain_reading_progress', JSON.stringify(allProgress));
    } catch (e) {
        console.error('Failed to save reading progress', e);
    }
};

// Settings
export const getSettings = (): UserSettings => {
    try {
        const stored = localStorage.getItem('jain_settings');
        return stored ? JSON.parse(stored) : {
            fontSize: 'medium',
            notifications: false,
            autoPlay: false
        };
    } catch {
        return {
            fontSize: 'medium',
            notifications: false,
            autoPlay: false
        };
    }
};

export const updateSettings = (settings: Partial<UserSettings>): void => {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('jain_settings', JSON.stringify(updated));
};

// Daily Thought - Track last shown date
export const shouldShowDailyThought = (): boolean => {
    try {
        const lastShown = localStorage.getItem('jain_daily_thought_date');
        const today = new Date().toDateString();
        return lastShown !== today;
    } catch {
        return true;
    }
};

export const markDailyThoughtShown = (): void => {
    const today = new Date().toDateString();
    localStorage.setItem('jain_daily_thought_date', today);
};
