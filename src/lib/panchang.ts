import { JainDate } from '../types';

// Average length of a synodic month (New Moon to New Moon)
const LUNAR_CYCLE = 29.53058867;

// A known New Moon reference date (Jan 21, 2023 20:53 UTC)
const REFERENCE_NEW_MOON = new Date('2023-01-21T20:53:00Z').getTime();

export const TITHI_NAMES = [
  'अमावस्या',
  'प्रतिपदा (एकम)',
  'द्वितीया (दूज)',
  'तृतीया (तीज)',
  'चतुर्थी (चौथ)',
  'पंचमी (पंचम)',
  'षष्ठी (छठ)',
  'सप्तमी (सातम)',
  'अष्टमी (आठम)',
  'नवमी (नौमी)',
  'दशमी (दसम)',
  'एकादशी (ग्यारस)',
  'द्वादशी (बारस)',
  'त्रयोदशी (तेरस)',
  'चतुर्दशी (चौदस)',
  'पूर्णिमा (पूनम)'
];

export const JAIN_MONTHS = [
  'चैत्र',
  'वैशाख',
  'ज्येष्ठ',
  'आषाढ़',
  'श्रावण',
  'भाद्रपद',
  'आश्विन',
  'कार्तिक',
  'मार्गशीर्ष',
  'पौष',
  'माघ',
  'फाल्गुन'
];

export const MONTH_NAMES_HINDI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export const WEEK_DAYS_HINDI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
export const WEEK_DAYS_SHORT = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export interface FestivalInfo {
  name: string;
  category: 'mahapara' | 'parva-tithi' | 'kalyanak' | 'vrata';
  description?: string;
  highlight: boolean;
  rules?: string;
}

export function getMoonPhase(date: Date): number {
  const diffTime = date.getTime() - REFERENCE_NEW_MOON;
  const daysPassed = diffTime / (1000 * 60 * 60 * 24);
  const cycles = daysPassed / LUNAR_CYCLE;
  const currentPhase = cycles - Math.floor(cycles);
  return currentPhase;
}

/**
 * Calculates authentic Jain Date with Veer Nirvana Samvat, Vikram Samvat, Jain Lunar Month, Paksha & Tithi
 */
export function getJainDate(date: Date): JainDate {
  const noonDate = new Date(date);
  noonDate.setHours(12, 0, 0, 0);

  const phase = getMoonPhase(noonDate);
  const lunarDay = phase * 30;

  let paksha: 'Shukla' | 'Krishna';
  let tithiIndex: number;

  if (phase < 0.5) {
    paksha = 'Shukla';
    tithiIndex = Math.floor(lunarDay) + 1;
  } else {
    paksha = 'Krishna';
    tithiIndex = Math.floor(lunarDay - 15) + 1;
  }

  const pakshaLabel = paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण';

  let tithiLabel = '';
  if (tithiIndex >= 15) {
    tithiIndex = 15;
    tithiLabel = paksha === 'Shukla' ? 'पूर्णिमा' : 'अमावस्या';
  } else {
    tithiLabel = TITHI_NAMES[tithiIndex];
  }

  // Calculate approximate Jain Lunar Month based on solar month and lunar phase
  // Chaitra usually starts late March / April
  const solarMonth = date.getMonth(); // 0 = Jan, 11 = Dec
  const solarDay = date.getDate();
  const year = date.getFullYear();

  // Mapping solar dates to Jain Maas
  let jainMonthIndex = 0;
  if (solarMonth === 0) jainMonthIndex = solarDay < 15 ? 9 : 10; // Pausha / Magha
  else if (solarMonth === 1) jainMonthIndex = solarDay < 14 ? 10 : 11; // Magha / Phalguna
  else if (solarMonth === 2) jainMonthIndex = solarDay < 15 ? 11 : 0; // Phalguna / Chaitra
  else if (solarMonth === 3) jainMonthIndex = solarDay < 14 ? 0 : 1; // Chaitra / Vaishakha
  else if (solarMonth === 4) jainMonthIndex = solarDay < 15 ? 1 : 2; // Vaishakha / Jyeshtha
  else if (solarMonth === 5) jainMonthIndex = solarDay < 15 ? 2 : 3; // Jyeshtha / Ashadha
  else if (solarMonth === 6) jainMonthIndex = solarDay < 16 ? 3 : 4; // Ashadha / Shravana
  else if (solarMonth === 7) jainMonthIndex = solarDay < 17 ? 4 : 5; // Shravana / Bhadrapada
  else if (solarMonth === 8) jainMonthIndex = solarDay < 17 ? 5 : 6; // Bhadrapada / Ashwin
  else if (solarMonth === 9) jainMonthIndex = solarDay < 18 ? 6 : 7; // Ashwin / Kartika
  else if (solarMonth === 10) jainMonthIndex = solarDay < 17 ? 7 : 8; // Kartika / Margashirsha
  else jainMonthIndex = solarDay < 16 ? 8 : 9; // Margashirsha / Pausha

  const jainMonth = JAIN_MONTHS[jainMonthIndex];

  // Veer Nirvana Samvat (VNS): Starts from 527 BCE
  // Changes on Kartik Shukla Pratipada (around late Oct / Nov)
  const isAfterDiwali = (solarMonth === 10 && solarDay >= 15) || solarMonth === 11;
  const vnsYear = year + (isAfterDiwali ? 528 : 527);
  const vikramYear = year + (solarMonth >= 3 ? 57 : 56);

  // Parva Tithi Check: Ashtami, Chaturdashi, Purnima, Amavasya are sacred Jain Parva Days
  const isAshtami = tithiIndex === 8;
  const isChaturdashi = tithiIndex === 14;
  const isPurnima = tithiIndex === 15 && paksha === 'Shukla';
  const isAmavasya = tithiIndex === 15 && paksha === 'Krishna';
  const isParvaTithi = isAshtami || isChaturdashi || isPurnima || isAmavasya;

  let parvaCategory: 'ashtami' | 'chaturdashi' | 'purnima' | 'amavasya' | 'general' | undefined;
  if (isAshtami) parvaCategory = 'ashtami';
  else if (isChaturdashi) parvaCategory = 'chaturdashi';
  else if (isPurnima) parvaCategory = 'purnima';
  else if (isAmavasya) parvaCategory = 'amavasya';
  else if (isParvaTithi) parvaCategory = 'general';

  return {
    tithi: tithiIndex,
    paksha,
    pakshaLabel,
    tithiLabel,
    phase,
    jainMonth,
    vnsYear,
    vikramYear,
    isParvaTithi,
    parvaCategory
  };
}

/**
 * Authentic Jain Festivals, Kalyanaks and Parva rules database
 */
export function getFestival(
  tithiLabel: string,
  paksha: 'Shukla' | 'Krishna',
  solarMonth: number,
  tithiIndex: number,
  jainMonth: string
): FestivalInfo | null {
  // 1. MAJOR SPECIFIC JAIN FESTIVALS & KALYANAKS

  // Bhadrapada (दशलक्षण महापर्व / पर्युषण पर्व)
  if (jainMonth === 'भाद्रपद') {
    if (paksha === 'Shukla') {
      if (tithiIndex === 3) return { name: 'रोट तीज पर्व', category: 'vrata', description: 'रोट पूजन व त्याग', highlight: true };
      if (tithiIndex === 5) return { name: 'दशलक्षण प्रारंभ: उत्तम क्षमा धर्म', category: 'mahapara', description: 'क्रोध त्याग व सर्व जीवों से क्षमा भाव', highlight: true };
      if (tithiIndex === 6) return { name: 'दशलक्षण: उत्तम मार्दव धर्म', category: 'mahapara', description: 'मान-अहंकार का त्याग व विनम्रता', highlight: true };
      if (tithiIndex === 7) return { name: 'दशलक्षण: उत्तम आर्जव धर्म', category: 'mahapara', description: 'मायाचार त्याग व सरलता', highlight: true };
      if (tithiIndex === 8) return { name: 'दशलक्षण: उत्तम शौच धर्म (अष्टमी)', category: 'mahapara', description: 'लोभ त्याग व पवित्रता • महा-उपवास दिवस', highlight: true };
      if (tithiIndex === 9) return { name: 'दशलक्षण: उत्तम सत्य धर्म', category: 'mahapara', description: 'असत्य त्याग व हित-मित-प्रिय वचन', highlight: true };
      if (tithiIndex === 10) return { name: 'सुगंध दशमी • उत्तम संयम धर्म', category: 'mahapara', description: 'धूप खेवन, जिनालय वंदना व इंद्रिय विजय', highlight: true };
      if (tithiIndex === 11) return { name: 'दशलक्षण: उत्तम तप धर्म', category: 'mahapara', description: 'इच्छा निरोध व आत्म-तपस्या', highlight: true };
      if (tithiIndex === 12) return { name: 'दशलक्षण: उत्तम त्याग धर्म', category: 'mahapara', description: 'दान व परिग्रह त्याग भावना', highlight: true };
      if (tithiIndex === 13) return { name: 'दशलक्षण: उत्तम आकिंचन्य धर्म', category: 'mahapara', description: 'ममत्व त्याग व आत्म-लीनता', highlight: true };
      if (tithiIndex === 14) return { name: 'अनंत चतुर्दशी • उत्तम ब्रह्मचर्य', category: 'mahapara', description: 'महापर्व पूर्णाहुति • वासुपूज्य भगवान मोक्ष', highlight: true };
    }
  }

  // Ashwin (क्षमावाणी महापर्व / संवत्सरी)
  if (jainMonth === 'आश्विन' && paksha === 'Krishna' && tithiIndex === 1) {
    return { name: 'विश्व-क्षमावाणी महापर्व (मिच्छामि दुक्कडं)', category: 'mahapara', description: 'खामेमि सव्व जीवे, सव्वे जीवा खमंतु मे', highlight: true };
  }

  // Chaitra (भगवान ऋषभदेव व महावीर जन्म कल्याणक)
  if (jainMonth === 'चैत्र') {
    if (paksha === 'Krishna' && tithiIndex === 9) {
      return { name: 'भगवान ऋषभदेव जन्म व तप कल्याणक', category: 'kalyanak', description: 'प्रथम तीर्थंकर आदिनाथ जन्म कल्याणक', highlight: true };
    }
    if (paksha === 'Shukla' && tithiIndex === 13) {
      return { name: 'भगवान महावीर स्वामी जन्म कल्याणक (महावीर जयंती)', category: 'mahapara', description: '२४वें तीर्थंकर भगवान महावीर जयंती महोत्सव', highlight: true };
    }
  }

  // Vaishakha (अक्षय तृतीया)
  if (jainMonth === 'वैशाख' && paksha === 'Shukla') {
    if (tithiIndex === 3) {
      return { name: 'अक्षय तृतीया (इक्षुरस दान तीर्थ पर्व)', category: 'mahapara', description: 'भगवान ऋषभदेव का प्रथम आहार पारणा दिवस', highlight: true };
    }
    if (tithiIndex === 10) {
      return { name: 'भगवान महावीर केवलज्ञान कल्याणक', category: 'kalyanak', description: 'ऋजुकूला नदी तट पर केवलज्ञान की प्राप्ति', highlight: true };
    }
  }

  // Jyeshtha (श्रुत पंचमी)
  if (jainMonth === 'ज्येष्ठ' && paksha === 'Shukla' && tithiIndex === 5) {
    return { name: 'श्रुत पंचमी (जिनवाणी प्राकट्य महापर्व)', category: 'mahapara', description: 'षट्खण्डागम आदि मूल आगम लिपिबद्ध पूजन दिवस', highlight: true };
  }

  // Ashadha (चातुर्मास व अष्टान्हिका)
  if (jainMonth === 'आषाढ़' && paksha === 'Shukla') {
    if (tithiIndex === 8) return { name: 'आषाढ़ अष्टान्हिका महापर्व प्रारंभ', category: 'mahapara', description: 'नंदीश्वर द्वीप अकृत्रिम चैत्यालय भक्ति', highlight: true };
    if (tithiIndex === 14) return { name: 'चातुर्मास स्थापना दिवस', category: 'parva-tithi', description: 'जैन साधु-साध्वियों का वर्षावास संकल्प', highlight: true };
    if (tithiIndex === 15) return { name: 'वीर शासन जयंती / गुरु पूर्णिमा', category: 'mahapara', description: 'भगवान महावीर की प्रथम दिव्यध्वनि प्रगट दिवस', highlight: true };
  }

  // Shravana (मोक्ष सप्तमी व रक्षाबंधन)
  if (jainMonth === 'श्रावण' && paksha === 'Shukla') {
    if (tithiIndex === 7) return { name: 'मोक्ष सप्तमी (भगवान पार्श्वनाथ मोक्ष)', category: 'kalyanak', description: 'सम्मेद शिखरजी से २३वें तीर्थंकर का निर्वाण', highlight: true };
    if (tithiIndex === 15) return { name: 'रक्षाबंधन (मुनि अकंपनाचार्य रक्षा दिवस)', category: 'mahapara', description: 'विष्णुकुमार मुनिराज द्वारा ७०० मुनियों की रक्षा', highlight: true };
  }

  // Kartika (दीपावली - महावीर निर्वाण, वीर संवत् नववर्ष, ज्ञान पंचमी)
  if (jainMonth === 'कार्तिक') {
    if (paksha === 'Krishna') {
      if (tithiIndex === 13) return { name: 'धनतेरस (समवशरण विसर्जन दिवस)', category: 'parva-tithi', description: 'भगवान महावीर का अंतिम योग निरोध', highlight: true };
      if (tithiIndex === 14) return { name: 'रूप चौदस (केवलज्ञान योग निरोध)', category: 'parva-tithi', description: 'मुक्ति पूर्व आत्म-विशुद्धि', highlight: true };
      if (tithiIndex === 15) return { name: 'दीपावली • भगवान महावीर निर्वाण कल्याणक', category: 'mahapara', description: 'पावापुरी से भगवान महावीर का मोक्ष गमन • लाडू अर्पण', highlight: true };
    } else {
      if (tithiIndex === 1) return { name: 'वीर निर्वाण संवत् नववर्ष • गौतम केवलज्ञान', category: 'mahapara', description: 'नवीन जैन वर्षारंभ व गौतम गणधर केवलज्ञान दिवस', highlight: true };
      if (tithiIndex === 5) return { name: 'ज्ञान पंचमी (सौभाग्य पंचमी)', category: 'vrata', description: 'शास्त्र स्वाध्याय, सरस्वती पूजन व ज्ञानाराधना', highlight: true };
      if (tithiIndex >= 8 && tithiIndex <= 15) {
        if (tithiIndex === 8) return { name: 'कार्तिक अष्टान्हिका प्रारंभ (अष्टमी)', category: 'mahapara', description: 'नंदीश्वर द्वीप विधान व आराधना', highlight: true };
        if (tithiIndex === 15) return { name: 'कार्तिक पूर्णिमा • अष्टान्हिका पूर्णाहुति', category: 'mahapara', description: 'चातुर्मास निष्ठापन व रथयात्रा', highlight: true };
      }
    }
  }

  // Margashirsha (मौन एकादशी)
  if (jainMonth === 'मार्गशीर्ष' && paksha === 'Shukla' && tithiIndex === 11) {
    return { name: 'मौन एकादशी (१५० कल्याणक आराधना)', category: 'mahapara', description: 'मौन व्रत, जप-तप व सर्व पाप क्षालन', highlight: true };
  }

  // Pausha (भगवान पार्श्वनाथ जन्म-तप कल्याणक)
  if (jainMonth === 'पौष' && paksha === 'Krishna' && tithiIndex === 10) {
    return { name: 'भगवान पार्श्वनाथ जन्म व तप कल्याणक', category: 'kalyanak', description: 'वाराणसी में २३वें तीर्थंकर का अवतरण', highlight: true };
  }

  // Magha (भगवान ऋषभदेव मोक्ष कल्याणक)
  if (jainMonth === 'माघ') {
    if (paksha === 'Krishna' && tithiIndex === 14) {
      return { name: 'भगवान ऋषभदेव मोक्ष कल्याणक', category: 'kalyanak', description: 'अष्टापद (कैलाश पर्वत) से प्रथम तीर्थंकर का निर्वाण', highlight: true };
    }
    if (paksha === 'Shukla' && tithiIndex === 5) {
      return { name: 'बसंत पंचमी (श्रुत-ज्ञान आराधना)', category: 'vrata', description: 'द्वादशांग जिनवाणी माता विशेष पूजन', highlight: false };
    }
  }

  // Phalguna (अष्टान्हिका)
  if (jainMonth === 'फाल्गुन' && paksha === 'Shukla' && tithiIndex >= 8 && tithiIndex <= 15) {
    if (tithiIndex === 8) return { name: 'फाल्गुन अष्टान्हिका प्रारंभ (अष्टमी)', category: 'mahapara', description: 'नंदीश्वर द्वीप अष्टान्हिका महापर्व', highlight: true };
    if (tithiIndex === 15) return { name: 'फाल्गुनी पूर्णिमा', category: 'parva-tithi', description: 'अष्टान्हिका महापर्व पूर्णाहुति', highlight: true };
  }

  // 2. REGULAR SACRED JAIN PARVA TITHIS (EVERY MONTH)
  if (tithiIndex === 8) {
    return {
      name: `${pakshaLabel} अष्टमी (पर्व तिथि)`,
      category: 'parva-tithi',
      description: 'एकासन / उपवास, स्वाध्याय व ब्रह्मचर्य पालन दिवस',
      highlight: true,
      rules: 'कंदमूल व हरी सब्जी का त्याग, एकासन अथवा उपवास'
    };
  }

  if (tithiIndex === 14) {
    return {
      name: `${pakshaLabel} चतुर्दशी (पर्व तिथि)`,
      category: 'parva-tithi',
      description: 'पाप क्षालन, स्वाध्याय, उपवास व आत्म-साधना दिवस',
      highlight: true,
      rules: 'पूर्ण ब्रह्मचर्य, आरम्भ-परिग्रह त्याग, सामायिक'
    };
  }

  if (tithiIndex === 15) {
    if (paksha === 'Shukla') {
      return {
        name: `${jainMonth} पूर्णिमा (पूनम)`,
        category: 'parva-tithi',
        description: 'शुक्ल पूर्णिमा - आत्म-शांति, पूजा व विशेष स्वाध्याय',
        highlight: true,
        rules: 'सूर्योदय से पूर्व जिनालय वंदना, सात्विक विचार'
      };
    } else {
      return {
        name: `${jainMonth} अमावस्या (अमावस)`,
        category: 'parva-tithi',
        description: 'कृष्ण अमावस्या - वैराग्य व आत्म-चिंतन दिवस',
        highlight: true,
        rules: 'स्वाध्याय व आत्म-निरीक्षण'
      };
    }
  }

  if (tithiIndex === 11) {
    return {
      name: `${pakshaLabel} एकादशी`,
      category: 'vrata',
      description: 'इंद्रिय संयम व व्रत दिवस',
      highlight: false
    };
  }

  return null;
}

/**
 * Jain Daily Muhurat & Time Calculations (Navkarshi, Porsi, Chauvihar, etc.)
 */
export interface JainTimings {
  sunrise: string;
  navkarshi: string; // Sunrise + 48 min
  porsi: string; // Sunrise + 3 hours
  sadhPorsi: string; // Sunrise + 4.5 hours
  purimaddh: string; // Mid-day
  chauvihar: string; // Sunset - 48 min
  sunset: string;
}

export function getJainTimings(date: Date): JainTimings {
  // Approximate sunrise & sunset times for Indian subcontinent
  const month = date.getMonth();
  let sunriseH = 6;
  let sunriseM = 5;
  let sunsetH = 18;
  let sunsetM = 35;

  if (month >= 3 && month <= 8) {
    // Summer months
    sunriseH = 5;
    sunriseM = 45;
    sunsetH = 19;
    sunsetM = 0;
  } else if (month >= 10 || month <= 1) {
    // Winter months
    sunriseH = 6;
    sunriseM = 45;
    sunsetH = 17;
    sunsetM = 50;
  }

  const formatHM = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const dispH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const hh = dispH < 10 ? `०${dispH}` : `${dispH}`;
    const mm = m < 10 ? `०${m}` : `${m}`;
    return `${hh}:${mm} ${period}`;
  };

  // Navkarshi: + 48 minutes
  let navM = sunriseM + 48;
  let navH = sunriseH;
  if (navM >= 60) {
    navH += Math.floor(navM / 60);
    navM %= 60;
  }

  // Porsi: + 3 hours
  const porsiH = sunriseH + 3;
  const porsiM = sunriseM;

  // Sadh Porsi: + 4 hours 30 mins
  let sadhM = sunriseM + 30;
  let sadhH = sunriseH + 4;
  if (sadhM >= 60) {
    sadhH += 1;
    sadhM %= 60;
  }

  // Purimaddh: + 6 hours (mid-day)
  const puriH = sunriseH + 6;
  const puriM = sunriseM;

  // Chauvihar: Sunset - 48 minutes
  let chauM = sunsetM - 48;
  let chauH = sunsetH;
  if (chauM < 0) {
    chauH -= 1;
    chauM += 60;
  }

  return {
    sunrise: formatHM(sunriseH, sunriseM),
    navkarshi: formatHM(navH, navM),
    porsi: formatHM(porsiH, porsiM),
    sadhPorsi: formatHM(sadhH, sadhM),
    purimaddh: formatHM(puriH, puriM),
    chauvihar: formatHM(chauH, chauM),
    sunset: formatHM(sunsetH, sunsetM),
  };
}

/**
 * Authentic Jain Pachchakkhan Verses
 */
export const PACHCHAKKHAN_LIST = [
  {
    id: 'navkarshi',
    title: 'नवकारसी पच्चक्खाण',
    tag: 'सूर्योदय + ४८ मिनट',
    formula: 'उग्गए सूरे णमुक्कार-सहिअं पच्चक्खामि, चउव्विहंपि आहारं - असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं, सहसागारेणं, महत्तरागारेणं, सव्वसमाहि-वत्तियागारेणं वोसिरिरबोसिरे।'
  },
  {
    id: 'porsi',
    title: 'पोरसी पच्चक्खाण',
    tag: 'सूर्योदय + ३ घंटे (१ प्रहर)',
    formula: 'उग्गए सूरे पोरिसिं पच्चक्खामि, चउव्विहंपि आहारं - असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं सहसागारेणं वोसिरे।'
  },
  {
    id: 'ekasana',
    title: 'एकासन पच्चक्खाण',
    tag: 'दिन में एक बार भोजन',
    formula: 'एगासणं पच्चक्खामि, तिविहंपि आहारं - असणं, खाइमं, साइमं, अन्नत्थणाभोगेणं सहसागारेणं सागारिआगारेणं वोसिरे।'
  },
  {
    id: 'chauvihar',
    title: 'चौविहार पच्चक्खाण (रात्रि भोजन त्याग)',
    tag: 'सूर्यास्त पूर्व से सूर्योदय तक',
    formula: 'दिवस-चरिमं पच्चक्खामि, चउव्विहंपि आहारं - असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं सहसागारेणं सव्वसमाहि-वत्तियागारेणं वोसिरिरबोसिरे।'
  },
  {
    id: 'upavas',
    title: 'उपवास पच्चक्खाण',
    tag: '२४ घंटे अन्न-जल त्याग (अथवा जल सहित)',
    formula: 'अभत्तट्ठे पच्चक्खामि, चउव्विहंपि आहारं - असणं, पाणं, खाइमं, साइमं, अन्नत्थणाभोगेणं सहसागारेणं वोसिरे।'
  }
];
