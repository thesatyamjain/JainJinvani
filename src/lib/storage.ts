import { Favorite, ReadingProgress, UserSettings, RecentReadItem, DailyNiyamaState, JapMalaState } from '../types';

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
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                fontSize: parsed.fontSize || 'medium',
                fontFamily: parsed.fontFamily === 'sans' ? 'sans' : 'serif',
                notifications: Boolean(parsed.notifications),
                autoPlay: Boolean(parsed.autoPlay),
                backgroundTheme: (parsed.backgroundTheme === 'cosmic' || parsed.backgroundTheme === 'sanctum' || parsed.backgroundTheme === 'manuscript')
                    ? parsed.backgroundTheme
                    : 'manuscript',
                dockTheme: (parsed.dockTheme === 'classic' || parsed.dockTheme === 'crystal' || parsed.dockTheme === 'gilded' || parsed.dockTheme === 'frosted') ? parsed.dockTheme : 'frosted',
                hapticFeedback: parsed.hapticFeedback !== undefined ? Boolean(parsed.hapticFeedback) : true,
                showTithiTimings: parsed.showTithiTimings !== undefined ? Boolean(parsed.showTithiTimings) : true,
                sunsetReminder: Boolean(parsed.sunsetReminder),
            };
        }
    } catch {}
    return {
        fontSize: 'medium',
        fontFamily: 'serif',
        notifications: false,
        autoPlay: false,
        backgroundTheme: 'manuscript',
        dockTheme: 'frosted',
        hapticFeedback: true,
        showTithiTimings: true,
        sunsetReminder: false,
    };
};

// Data Backup & Restore (Jinvani Export/Import)
export const exportBackupData = (): string => {
    const backup = {
        version: 1,
        appName: 'Jain Jinvani',
        exportedAt: new Date().toISOString(),
        favorites: getFavorites(),
        settings: getSettings(),
        recentReads: getRecentReads(),
        readingProgress: (() => {
            try { return JSON.parse(localStorage.getItem('jain_reading_progress') || '{}'); } catch { return {}; }
        })(),
        niyamState: (() => {
            try { return JSON.parse(localStorage.getItem('jain_daily_niyam_v2') || '{}'); } catch { return {}; }
        })(),
        japMala: (() => {
            try { return JSON.parse(localStorage.getItem('jain_jap_mala_state') || '{}'); } catch { return {}; }
        })()
    };
    return JSON.stringify(backup, null, 2);
};

export const importBackupData = (jsonString: string): { success: boolean; message: string; count?: number } => {
    try {
        const data = JSON.parse(jsonString);
        if (!data || typeof data !== 'object') {
            return { success: false, message: 'अमान्य बैकअप फ़ाइल' };
        }
        let restoredCount = 0;
        if (Array.isArray(data.favorites)) {
            localStorage.setItem('jain_favorites', JSON.stringify(data.favorites));
            restoredCount += data.favorites.length;
        }
        if (data.settings && typeof data.settings === 'object') {
            updateSettings(data.settings);
        }
        if (Array.isArray(data.recentReads)) {
            localStorage.setItem('jain_recent_reads', JSON.stringify(data.recentReads));
        }
        if (data.readingProgress && typeof data.readingProgress === 'object') {
            localStorage.setItem('jain_reading_progress', JSON.stringify(data.readingProgress));
        }
        if (data.niyamState && typeof data.niyamState === 'object') {
            localStorage.setItem('jain_daily_niyam_v2', JSON.stringify(data.niyamState));
        }
        if (data.japMala && typeof data.japMala === 'object') {
            localStorage.setItem('jain_jap_mala_state', JSON.stringify(data.japMala));
        }
        return { success: true, message: 'पसंदीदा, सेटिंग्स व साधना डेटा सफलतापूर्वक रीस्टोर हुआ।', count: restoredCount };
    } catch (e: any) {
        return { success: false, message: 'बैकअप रीस्टोर विफल: ' + (e?.message || 'त्रुटि') };
    }
};

export const updateSettings = (settings: Partial<UserSettings>): void => {
    const current = getSettings();
    const updated: UserSettings = { ...current, ...settings };
    localStorage.setItem('jain_settings', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('jain_settings_updated', { detail: updated }));
    }
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

// Recent Reads (Max 8 items)
export const getRecentReads = (): RecentReadItem[] => {
    try {
        const stored = localStorage.getItem('jain_recent_reads');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const addRecentRead = (item: { id: string; title: string; type?: string }): void => {
    if (!item?.id || !item?.title) return;
    try {
        const list = getRecentReads().filter((r) => r.id !== item.id);
        list.unshift({
            id: item.id,
            title: item.title,
            type: item.type,
            lastRead: Date.now(),
        });
        localStorage.setItem('jain_recent_reads', JSON.stringify(list.slice(0, 8)));
    } catch (e) {
        console.error('Failed to save recent read', e);
    }
};

export const clearRecentReads = (): void => {
    localStorage.removeItem('jain_recent_reads');
};

// Daily Niyamas
const getTodayDateKey = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getDailyNiyamaState = (): DailyNiyamaState => {
    const today = getTodayDateKey();
    try {
        const stored = localStorage.getItem('jain_daily_niyamas');
        if (stored) {
            const data: DailyNiyamaState = JSON.parse(stored);
            if (data.date === today) {
                return data;
            }
            // If new day, check if yesterday was completed to update streak
            const yesterday = new Date(Date.now() - 86400000);
            const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            const streak = data.date === yesterdayKey && data.completedIds.length > 0 ? (data.streak || 0) : 0;
            return {
                date: today,
                completedIds: [],
                streak,
            };
        }
    } catch {}
    return {
        date: today,
        completedIds: [],
        streak: 0,
    };
};

export const toggleNiyamaItem = (niyamaId: string): DailyNiyamaState => {
    const current = getDailyNiyamaState();
    const isCompleted = current.completedIds.includes(niyamaId);
    const newCompleted = isCompleted
        ? current.completedIds.filter((id) => id !== niyamaId)
        : [...current.completedIds, niyamaId];

    const updated: DailyNiyamaState = {
        ...current,
        completedIds: newCompleted,
        streak: newCompleted.length > 0 ? Math.max(1, current.streak || 1) : current.streak,
    };
    try {
        localStorage.setItem('jain_daily_niyamas', JSON.stringify(updated));
    } catch {}
    return updated;
};

// Jap Mala Stats
export const getJapMalaState = (): JapMalaState => {
    const today = getTodayDateKey();
    const defaultState: JapMalaState = {
        todayCount: 0,
        lifetimeCount: 0,
        lastDate: today,
        currentBead: 0,
        selectedMantraId: 'namokar',
        targetCount: 108,
        customTarget: 21,
    };
    try {
        const stored = localStorage.getItem('jain_jap_mala');
        if (stored) {
            const data: JapMalaState = JSON.parse(stored);
            return {
                ...defaultState,
                ...data,
                targetCount: data.targetCount || 108,
                customTarget: data.customTarget || 21,
                todayCount: data.lastDate === today ? data.todayCount : 0,
                lastDate: today,
            };
        }
    } catch {}
    return defaultState;
};

export const saveJapMalaState = (state: JapMalaState): void => {
    try {
        localStorage.setItem('jain_jap_mala', JSON.stringify(state));
    } catch {}
};

// Temple AMOLED Dark Mode
export const getTempleMode = (): boolean => {
    try {
        return localStorage.getItem('jain_temple_mode') === 'true';
    } catch {
        return false;
    }
};

export const setTempleMode = (enabled: boolean): void => {
    try {
        localStorage.setItem('jain_temple_mode', String(enabled));
    } catch {}
};
