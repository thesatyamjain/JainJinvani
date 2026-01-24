// Simple lunar phase calculation utilities for Jain Panchang approximation

// Average length of a synodic month (New Moon to New Moon)
const LUNAR_CYCLE = 29.53058867;

// A known New Moon reference date (Jan 21, 2023 20:53 UTC)
// Using a stable reference point ensures decent accuracy for current dates
const REFERENCE_NEW_MOON = new Date('2023-01-21T20:53:00Z').getTime();

export interface JainDate {
  tithi: number; // 1-15
  paksha: 'Shukla' | 'Krishna';
  pakshaLabel: string; // 'शुक्ल' | 'कृष्ण'
  tithiLabel: string; // 'प्रतिपदा', 'द्वितीया', etc.
  phase: number; // 0-1 (0=New, 0.5=Full, 1=New)
}

const TITHI_NAMES = [
  'अमावस्या', // 0/30 (Shown as 30 usually, but handled specially)
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा' // 15
];

export function getMoonPhase(date: Date): number {
  const diffTime = date.getTime() - REFERENCE_NEW_MOON;
  const daysPassed = diffTime / (1000 * 60 * 60 * 24);
  const cycles = daysPassed / LUNAR_CYCLE;
  const currentPhase = cycles - Math.floor(cycles);
  return currentPhase;
}

export function getJainDate(date: Date): JainDate {
  // Calculate phase centered at noon to avoid boundary jitters
  const noonDate = new Date(date);
  noonDate.setHours(12, 0, 0, 0);
  
  let phase = getMoonPhase(noonDate);
  
  // Tithi calculation: 360 degrees / 30 tithis = 12 degrees per tithi
  // Phase 0-1 maps to 0-30 tithis
  // However, traditionally:
  // 0.0 - 0.5 = Shukla Paksha (Waxing) -> Tithi 1-15
  // 0.5 - 1.0 = Krishna Paksha (Waning) -> Tithi 1-15 (starts after Purnima)
  
  // Tithi index from 0 to 29.xxx
  const lunarDay = phase * 30;
  
  let paksha: 'Shukla' | 'Krishna';
  let tithiIndex: number; // 1-15
  
  // Determine Paksha and Tithi
  if (phase < 0.5) {
    // Shukla Paksha (0 to 14.99)
    paksha = 'Shukla';
    // 0-1 -> Pratham (1), 14-15 -> Purnima (15)
    tithiIndex = Math.floor(lunarDay) + 1; 
  } else {
    // Krishna Paksha (15 to 29.99)
    paksha = 'Krishna';
    // 15-16 -> Pratham (1), 29-30 -> Amavasya (15/30)
    tithiIndex = Math.floor(lunarDay - 15) + 1;
  }
  
  // Handle labels
  let pakshaLabel = paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण';
  
  // Correction for exact Purnima/Amavasya boundaries
  // If tithiIndex is 15 in Shukla -> Purnima
  // If tithiIndex is 15 in Krishna -> Amavasya
  
  let tithiLabel = '';
  if (tithiIndex >= 15) {
      tithiIndex = 15; // Cap at 15
      tithiLabel = paksha === 'Shukla' ? 'पूर्णिमा' : 'अमावस्या';
  } else {
      tithiLabel = TITHI_NAMES[tithiIndex];
  }

  return {
    tithi: tithiIndex,
    paksha,
    pakshaLabel,
    tithiLabel,
    phase
  };
}

export function getFestival(tithiLabel: string, paksha: 'Shukla' | 'Krishna', month: number): { name: string, highlight: boolean } | null {
    // Basic mapping of major Jain festivals based on Tithi
    // Note: Accurate festivals depend on specific Months (Kartik, etc.) which map loosely to Gregorian
    
    // Generic Tithi Festivals
    if (tithiLabel === 'अष्टमी') return { name: 'अष्टमी व्रत', highlight: true };
    if (tithiLabel === 'चतुर्दशी') return { name: 'चौदस व्रत', highlight: true };
    if (tithiLabel === 'एकादशी') return { name: 'एकादशी', highlight: false };
    
    // Purnima/Amavasya
    if (tithiLabel === 'पूर्णिमा') return { name: 'पूर्णिमा उपवास', highlight: true };
    if (tithiLabel === 'अमावस्या') return { name: 'अमावस्या', highlight: true };

    // Specific Date approximation (Very rough without complex lunisolar conversion)
    // E.g. Mahavir Jayanti is Chaitra Shukla 13 (Usually April)
    // Paryushan usually in Aug/Sept (Bhadrapad)
    
    return null;
}

export const MONTH_NAMES_HINDI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export const WEEK_DAYS_HINDI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
