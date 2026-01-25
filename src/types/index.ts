export interface Favorite {
    id: string;
    title: string;
    type: string;
    timestamp: number;
}

export interface ReadingProgress {
    id: string;
    progress: number; // percentage
    lastRead: number; // timestamp
}

export interface UserSettings {
    fontSize: 'small' | 'medium' | 'large' | 'xl';
    notifications: boolean;
    autoPlay: boolean;
}

export interface JainDate {
    tithi: number; // 1-15
    paksha: 'Shukla' | 'Krishna';
    pakshaLabel: string; // 'शुक्ल' | 'कृष्ण'
    tithiLabel: string; // 'प्रतिपदा', 'द्वितीया', etc.
    phase: number; // 0-1 (0=New, 0.5=Full, 1=New)
}
