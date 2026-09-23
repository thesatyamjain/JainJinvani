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

export interface DigambaraFestivalDef {
  id: string;
  jainMonth: string;
  paksha: 'Shukla' | 'Krishna';
  tithi: number;
  name: string;
  category: 'mahapara' | 'parva-tithi' | 'kalyanak' | 'vrata';
  description: string;
  rules?: string;
  highlight: boolean;
}

/**
 * Authentic, Comprehensive Digambara Jain Annual Festivals and Kalyanaks Database
 */
export const DIGAMBARA_FESTIVALS: DigambaraFestivalDef[] = [
  // चैत्र मास (Chaitra)
  {
    id: 'chaitra-k-9',
    jainMonth: 'चैत्र',
    paksha: 'Krishna',
    tithi: 9,
    name: 'भगवान ऋषभदेव (आदिनाथ) जन्म व तप कल्याणक',
    category: 'mahapara',
    description: 'प्रथम तीर्थंकर भगवान आदिनाथ का अयोध्या में जन्म व जैनेश्वरी दिगम्बर दीक्षा कल्याणक महोत्सव',
    rules: 'विशेष जिनालय पूजा, अभिषेक व उपवास',
    highlight: true,
  },
  {
    id: 'chaitra-k-11',
    jainMonth: 'चैत्र',
    paksha: 'Krishna',
    tithi: 11,
    name: 'भगवान शीतलनाथ मोक्ष कल्याणक',
    category: 'kalyanak',
    description: '१०वें तीर्थंकर भगवान शीतलनाथ का सम्मेद शिखरजी से मोक्ष गमन',
    highlight: true,
  },
  {
    id: 'chaitra-s-1',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 1,
    name: 'नववर्षारंभ • चैत्र सिद्धचक्र महामंडल विधान प्रारंभ',
    category: 'vrata',
    description: 'वसंतकालीन सिद्धचक्र महामंडल विधान प्रारंभ व नवपद आराधना काल',
    rules: 'एकासन अथवा आयंबिल, नवपद पूजन',
    highlight: true,
  },
  {
    id: 'chaitra-s-3',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 3,
    name: 'भगवान अभिनंदननाथ मोक्ष कल्याणक',
    category: 'kalyanak',
    description: 'चतुर्थ तीर्थंकर भगवान अभिनंदननाथ का सम्मेद शिखरजी से निर्वाण',
    highlight: true,
  },
  {
    id: 'chaitra-s-5',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 5,
    name: 'भगवान अजितनाथ मोक्ष कल्याणक',
    category: 'kalyanak',
    description: 'द्वितीय तीर्थंकर भगवान अजितनाथ का सम्मेद शिखरजी से निर्वाण',
    highlight: true,
  },
  {
    id: 'chaitra-s-8',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 8,
    name: 'चैत्र अष्टान्हिका महापर्व प्रारंभ (अष्टमी)',
    category: 'mahapara',
    description: 'नंदीश्वर द्वीप अष्टान्हिका महापूजा प्रारंभ • प्रोषधोपवास',
    rules: 'कंदमूल व हरी सब्जी का त्याग, एकासन अथवा उपवास',
    highlight: true,
  },
  {
    id: 'chaitra-s-9',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 9,
    name: 'श्री राम नवमी (बलभद्र भगवान राम जन्मोत्सव)',
    category: 'mahapara',
    description: 'जैन पद्मपुराण अनुसार आठवें बलभद्र मर्यादा पुरुषोत्तम भगवान राम का पावन जन्मोत्सव',
    highlight: true,
  },
  {
    id: 'chaitra-s-10',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान सुमतिनाथ जन्म व तप कल्याणक',
    category: 'kalyanak',
    description: 'पंचम तीर्थंकर भगवान सुमतिनाथ का साकेत (अयोध्या) में जन्म व दीक्षा',
    highlight: true,
  },
  {
    id: 'chaitra-s-11',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 11,
    name: 'भगवान कुंथुनाथ जन्म-तप कल्याणक • कामदा एकादशी',
    category: 'kalyanak',
    description: '१७वें तीर्थंकर भगवान कुंथुनाथ का हस्तिनापुर में जन्म व तप कल्याणक',
    highlight: true,
  },
  {
    id: 'chaitra-s-13',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 13,
    name: 'भगवान महावीर स्वामी जन्म कल्याणक (महावीर जयंती)',
    category: 'mahapara',
    description: '२४वें तीर्थंकर भगवान महावीर स्वामी का कुंडलपुर में जन्म महोत्सव • विश्व अहिंसा दिवस',
    rules: 'अहिंसा संकल्प, प्रभातफेरी, जिनालय अभिषेक व पूजन',
    highlight: true,
  },
  {
    id: 'chaitra-s-15',
    jainMonth: 'चैत्र',
    paksha: 'Shukla',
    tithi: 15,
    name: 'चैत्री पूर्णिमा • अष्टान्हिका व सिद्धचक्र पूर्णाहुति',
    category: 'mahapara',
    description: 'भगवान बाहुबली महामस्तकाभिषेक स्मरण, चैत्र अष्टान्हिका व सिद्धचक्र विधान पूर्णता',
    rules: 'विशेष शांतिधारा व महाआरती',
    highlight: true,
  },

  // वैशाख मास (Vaishakha)
  {
    id: 'vaishakha-k-1',
    jainMonth: 'वैशाख',
    paksha: 'Krishna',
    tithi: 1,
    name: 'भगवान महावीर प्रथम समवशरण रचना दिवस',
    category: 'kalyanak',
    description: 'केवलज्ञान उपरांत देवों द्वारा भगवान महावीर के दिव्य समवशरण की रचना',
    highlight: true,
  },
  {
    id: 'vaishakha-k-12',
    jainMonth: 'वैशाख',
    paksha: 'Krishna',
    tithi: 12,
    name: 'भगवान शांतिनाथ गर्भ कल्याणक',
    category: 'kalyanak',
    description: '१६वें तीर्थंकर शांतिनाथ का हस्तिनापुर में गर्भ अवतरण',
    highlight: true,
  },
  {
    id: 'vaishakha-s-3',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 3,
    name: 'अक्षय तृतीया (इक्षुरस दान तीर्थ प्रवर्तन दिवस)',
    category: 'mahapara',
    description: 'हस्तिनापुर में राजा श्रेयांस द्वारा भगवान आदिनाथ का प्रथम पारणा • दान तीर्थ की पावन शुरुआत',
    rules: 'आहार दान, मुनि सेवा, सात्विक विचार',
    highlight: true,
  },
  {
    id: 'vaishakha-s-6',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 6,
    name: 'भगवान सुमतिनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'पंचम तीर्थंकर भगवान सुमतिनाथ को केवलज्ञान की प्राप्ति',
    highlight: true,
  },
  {
    id: 'vaishakha-s-10',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान महावीर केवलज्ञान कल्याणक',
    category: 'mahapara',
    description: 'ऋजुकूला नदी तट पर जंभिक ग्राम में भगवान महावीर को लोकालोक-प्रकाशी केवलज्ञान प्रगट हुआ',
    rules: 'ज्ञान पूजन, स्वाध्याय व विशेष ध्यान',
    highlight: true,
  },
  {
    id: 'vaishakha-s-12',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 12,
    name: 'भगवान अनन्तनाथ जन्म कल्याणक',
    category: 'kalyanak',
    description: '१४वें तीर्थंकर भगवान अनन्तनाथ का अयोध्या में जन्म',
    highlight: true,
  },
  {
    id: 'vaishakha-s-14',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 14,
    name: 'भगवान पुष्पदंत केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: '९वें तीर्थंकर भगवान पुष्पदंत (सुविधिनाथ) को केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'vaishakha-s-15',
    jainMonth: 'वैशाख',
    paksha: 'Shukla',
    tithi: 15,
    name: 'वैशाख पूर्णिमा (पर्व तिथि)',
    category: 'parva-tithi',
    description: 'शुक्ल पूर्णिमा - आत्म-शांति, जिन पूजा व विशेष स्वाध्याय',
    highlight: true,
  },

  // ज्येष्ठ मास (Jyeshtha)
  {
    id: 'jyeshtha-k-2',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Krishna',
    tithi: 2,
    name: 'भगवान शांतिनाथ जन्म व दीक्षा कल्याणक',
    category: 'kalyanak',
    description: '१६वें तीर्थंकर चक्रवर्ती कामदेव भगवान शांतिनाथ का हस्तिनापुर में जन्म व तप',
    highlight: true,
  },
  {
    id: 'jyeshtha-k-14',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Krishna',
    tithi: 14,
    name: 'भगवान शांतिनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'भगवान शांतिनाथ को हस्तिनापुर में केवलज्ञान की प्राप्ति',
    highlight: true,
  },
  {
    id: 'jyeshtha-s-3',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 3,
    name: 'भगवान मल्लिनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: '१९वें तीर्थंकर भगवान मल्लिनाथ को केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'jyeshtha-s-5',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 5,
    name: 'श्रुत पंचमी महापर्व (जिनवाणी प्राकट्य दिवस)',
    category: 'mahapara',
    description: 'आचार्य पुष्पदंत एवं भूतबलि द्वारा षट्खण्डागम मूल आगम लिपिबद्ध हुआ • जिनवाणी शोभायात्रा व सरस्वती पूजन',
    rules: 'शास्त्र स्वाध्याय, जिनवाणी पूजन, ज्ञान उपकरणों की शुद्धि',
    highlight: true,
  },
  {
    id: 'jyeshtha-s-10',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 10,
    name: 'गंगा दशहरा (जैन तीर्थ गंगा स्मरण)',
    category: 'vrata',
    description: 'पवित्र तीर्थों का स्मरण व जलकायिक जीवों की रक्षा का संकल्प',
    highlight: false,
  },
  {
    id: 'jyeshtha-s-11',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 11,
    name: 'निर्जला एकादशी (सर्वोत्कृष्ट तप)',
    category: 'vrata',
    description: 'ग्रीष्म काल में निर्जल उपवास द्वारा इंद्रिय दमन व आत्म-शोधन',
    rules: 'अन्न-जल त्याग, सामायिक',
    highlight: true,
  },
  {
    id: 'jyeshtha-s-12',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 12,
    name: 'भगवान पद्मप्रभु मोक्ष कल्याणक',
    category: 'kalyanak',
    description: 'छठे तीर्थंकर भगवान पद्मप्रभु का सम्मेद शिखरजी से निर्वाण',
    highlight: true,
  },
  {
    id: 'jyeshtha-s-15',
    jainMonth: 'ज्येष्ठ',
    paksha: 'Shukla',
    tithi: 15,
    name: 'ज्येष्ठ पूर्णिमा • संत शिरोमणि आचार्य वंदना दिवस',
    category: 'mahapara',
    description: 'दिगम्बर जैन आचार्य परंपरा वंदना एवं ज्येष्ठ पूर्णिमा पर्व',
    highlight: true,
  },

  // आषाढ़ मास (Ashadha)
  {
    id: 'ashadha-k-2',
    jainMonth: 'आषाढ़',
    paksha: 'Krishna',
    tithi: 2,
    name: 'भगवान वासुपूज्य जन्म व तप कल्याणक',
    category: 'kalyanak',
    description: '१२वें तीर्थंकर वासुपूज्य का चंपापुरी में जन्म व बाल-ब्रह्मचर्य दीक्षा',
    highlight: true,
  },
  {
    id: 'ashadha-s-7',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 7,
    name: 'भगवान पद्मप्रभु केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'भगवान पद्मप्रभु को केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'ashadha-s-8',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 8,
    name: 'भगवान नेमिनाथ मोक्ष कल्याणक • आषाढ़ अष्टान्हिका महापर्व प्रारंभ',
    category: 'mahapara',
    description: '२२वें तीर्थंकर भगवान नेमिनाथ का ऊर्जयंत (गिरनार) सिद्धक्षेत्र से निर्वाण • नंदीश्वर द्वीप अष्टान्हिका महापूजा प्रारंभ',
    rules: 'गिरनार वंदना, निर्वाण लाडू अर्पण, एकासन/उपवास, कंदमूल त्याग',
    highlight: true,
  },
  {
    id: 'ashadha-s-10',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान मल्लिनाथ जन्म व तप कल्याणक',
    category: 'kalyanak',
    description: '१९वें तीर्थंकर भगवान मल्लिनाथ का मिथिला नगरी में जन्म व दीक्षा',
    highlight: true,
  },
  {
    id: 'ashadha-s-11',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 11,
    name: 'देवशयनी एकादशी (चातुर्मास पूर्वाभास)',
    category: 'vrata',
    description: 'वर्षावास पूर्व इंद्रिय संयम व व्रत',
    highlight: true,
  },
  {
    id: 'ashadha-s-14',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 14,
    name: 'चातुर्मास स्थापना दिवस (वर्षावास प्रारंभ)',
    category: 'mahapara',
    description: 'दिगम्बर साधु-साध्वियों का वर्षावास संकल्प • जीव रक्षा हेतु चातुर्मास प्रारंभ',
    rules: 'अहिंसा व्रत, रात्रि भोजन त्याग, सामायिक',
    highlight: true,
  },
  {
    id: 'ashadha-s-15',
    jainMonth: 'आषाढ़',
    paksha: 'Shukla',
    tithi: 15,
    name: 'वीर शासन जयंती • गुरु पूर्णिमा • अष्टान्हिका पूर्णाहुति',
    category: 'mahapara',
    description: 'विपुलाचल पर्वत पर भगवान महावीर की प्रथम ओंकारमयी दिव्यध्वनि प्रगट हुई • गुरु पूर्णिमा महोत्सव',
    rules: 'गुरु वंदना, शास्त्र भेंट, महापूजन',
    highlight: true,
  },

  // श्रावण मास (Shravana)
  {
    id: 'shravana-k-1',
    jainMonth: 'श्रावण',
    paksha: 'Krishna',
    tithi: 1,
    name: 'वीर शासन जयंती महोत्सव (दिव्यध्वनि दिवस)',
    category: 'mahapara',
    description: 'भगवान महावीर की प्रथम देशना का जन-जन में विस्तार महोत्सव',
    highlight: true,
  },
  {
    id: 'shravana-k-7',
    jainMonth: 'श्रावण',
    paksha: 'Krishna',
    tithi: 7,
    name: 'भगवान नेमिनाथ जन्म कल्याणक',
    category: 'kalyanak',
    description: '२२वें तीर्थंकर भगवान नेमिनाथ का शौर्यपुर में जन्म',
    highlight: true,
  },
  {
    id: 'shravana-k-15',
    jainMonth: 'श्रावण',
    paksha: 'Krishna',
    tithi: 15,
    name: 'हरियाली अमावस्या (जीव रक्षा व पर्यावरण दिवस)',
    category: 'parva-tithi',
    description: 'वनस्पति व सूक्ष्म जीवों की रक्षा का संकल्प दिवस',
    highlight: true,
  },
  {
    id: 'shravana-s-6',
    jainMonth: 'श्रावण',
    paksha: 'Shukla',
    tithi: 6,
    name: 'भगवान सुपार्श्वनाथ मोक्ष कल्याणक',
    category: 'kalyanak',
    description: '७वें तीर्थंकर सुपार्श्वनाथ का सम्मेद शिखरजी से निर्वाण',
    highlight: true,
  },
  {
    id: 'shravana-s-7',
    jainMonth: 'श्रावण',
    paksha: 'Shukla',
    tithi: 7,
    name: 'मोक्ष सप्तमी (भगवान पार्श्वनाथ मोक्ष कल्याणक)',
    category: 'mahapara',
    description: '२३वें तीर्थंकर भगवान पार्श्वनाथ का सम्मेद शिखरजी (स्वर्णभद्र कूट) से मोक्ष • निर्वाण लाडू अर्पण',
    rules: 'जिनालय में निर्वाण लाडू अर्पण, उपवास',
    highlight: true,
  },
  {
    id: 'shravana-s-10',
    jainMonth: 'श्रावण',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान शीतलनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'भगवान शीतलनाथ को केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'shravana-s-11',
    jainMonth: 'श्रावण',
    paksha: 'Shukla',
    tithi: 11,
    name: 'पवित्रा एकादशी (संयम एकादशी)',
    category: 'vrata',
    description: 'इंद्रिय संयम व स्वाध्याय',
    highlight: false,
  },
  {
    id: 'shravana-s-15',
    jainMonth: 'श्रावण',
    paksha: 'Shukla',
    tithi: 15,
    name: 'जैन रक्षाबंधन महापर्व (वात्सल्य पर्व)',
    category: 'mahapara',
    description: 'मुनि विष्णुकुमार द्वारा बलि के उपद्रव से अकंपनाचार्य सहित ७०० मुनिराजों की रक्षा • वात्सल्य दिवस',
    rules: 'साधर्मी वात्सल्य, मुनि सेवा, रक्षा सूत्र बंधन',
    highlight: true,
  },

  // भाद्रपद मास (Bhadrapada) - सर्वोपरि महापर्व मास
  {
    id: 'bhadrapada-k-1',
    jainMonth: 'भाद्रपद',
    paksha: 'Krishna',
    tithi: 1,
    name: 'सोलहकारण महापर्व प्रारंभ (भाद्रपद कृ. १ से आश्विन कृ. १)',
    category: 'mahapara',
    description: 'तीर्थंकर प्रकृति बंध के कारणभूत १६ पावन भावनाओं (दर्शनविशुद्धि आदि) का ३२ दिवसीय महापर्व प्रारंभ',
    rules: 'दैनिक १६ कारण पूजा, एकासन अथवा उपवास, स्वाध्याय',
    highlight: true,
  },
  {
    id: 'bhadrapada-k-8',
    jainMonth: 'भाद्रपद',
    paksha: 'Krishna',
    tithi: 8,
    name: 'सोलहकारण महापर्व अष्टमी (पर्व तिथि)',
    category: 'parva-tithi',
    description: 'सोलहकारण आराधना के अंतर्गत विशेष प्रोषधोपवास एवं दर्शनविशुद्धि ध्यान',
    rules: 'एकासन/उपवास, हरी सब्जी का त्याग',
    highlight: true,
  },
  {
    id: 'bhadrapada-k-11',
    jainMonth: 'भाद्रपद',
    paksha: 'Krishna',
    tithi: 11,
    name: 'भगवान अनंतनाथ मोक्ष कल्याणक',
    category: 'kalyanak',
    description: '१४वें तीर्थंकर अनंतनाथ का सम्मेद शिखरजी से निर्वाण',
    highlight: true,
  },
  {
    id: 'bhadrapada-k-14',
    jainMonth: 'भाद्रपद',
    paksha: 'Krishna',
    tithi: 14,
    name: 'सोलहकारण महापर्व चतुर्दशी (पर्व तिथि)',
    category: 'parva-tithi',
    description: 'आत्म-शोधन, पूर्ण ब्रह्मचर्य व सोलहकारण महापूजा',
    rules: 'उपवास/एकासन, सामायिक',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-3',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 3,
    name: 'रोट तीज पर्व (रोट व्रत)',
    category: 'vrata',
    description: 'मोटी रोटी (रोट) एवं खीर का नैवेद्य, तप-त्याग एवं सात्विक आहार',
    rules: 'रोट पूजन, एकासन',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-4',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 4,
    name: 'दशलक्षण पूर्व शुद्धि दिवस • अंतरंग शुद्धि संकल्प',
    category: 'vrata',
    description: 'पर्वाधिराज दशलक्षण महापर्व आगमन पूर्व अंतरंग कषाय शमन एवं आत्म-साधना संकल्प दिवस',
    rules: 'आरंभ-परिग्रह संकोच, सामायिक',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-5',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 5,
    name: 'दशलक्षण महापर्व प्रारंभ • उत्तम क्षमा धर्म',
    category: 'mahapara',
    description: 'क्रोध का अभाव, सर्व जीवों से क्षमा भाव • १० उत्तम धर्मों की साधना प्रारंभ',
    rules: 'उत्तम क्षमा धारण, कंदमूल-हरी सब्जी त्याग, एकासन अथवा उपवास',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-6',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 6,
    name: 'दशलक्षण: उत्तम मार्दव धर्म',
    category: 'mahapara',
    description: 'मान, अहंकार और कुल-मद का त्याग • परम विनम्रता व कोमलता',
    rules: 'अहंकार शमन, विनय गुण धारण',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-7',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 7,
    name: 'दशलक्षण: उत्तम आर्जव धर्म',
    category: 'mahapara',
    description: 'मन-वचन-काय में एकरूपता • मायाचार, छल-कपट का त्याग',
    rules: 'निष्कपट व्यवहार, सरलता',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-8',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 8,
    name: 'दशलक्षण: उत्तम शौच धर्म • अष्टमी महा-उपवास',
    category: 'mahapara',
    description: 'लोभ कषाय का त्याग, मन की शुचिता • दशलक्षण की पावन अष्टमी',
    rules: 'निर्जल अथवा सजल उपवास, अखंड स्वाध्याय',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-9',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 9,
    name: 'दशलक्षण: उत्तम सत्य धर्म',
    category: 'mahapara',
    description: 'असत्य का त्याग • हित, मित और प्रिय वचनों का परिपालन',
    rules: 'मौन साधना अथवा सत्य भाषण',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-10',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 10,
    name: 'सुगंध दशमी (धूप दशमी) • उत्तम संयम धर्म',
    category: 'mahapara',
    description: 'समस्त जिनालयों में धूप खेवन, कर्म-दहन प्रार्थना • इंद्रिय व मन संयम',
    rules: 'जिनालयों में धूप अर्पण, इंद्रिय दमन',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-11',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 11,
    name: 'दशलक्षण: उत्तम तप धर्म',
    category: 'mahapara',
    description: 'इच्छाओं का निरोध • १२ प्रकार के बाह्य व आभ्यंतर तप की आराधना',
    rules: 'अनशन, अवमौदर्य, कायक्लेश तप',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-12',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 12,
    name: 'दशलक्षण: उत्तम त्याग धर्म',
    category: 'mahapara',
    description: 'सत्पात्र को चतुर्विध दान (आहार, औषधि, ज्ञान, अभय) व परिग्रह त्याग',
    rules: 'सत्पात्र दान, आसक्ति त्याग',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-13',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 13,
    name: 'दशलक्षण: उत्तम आकिंचन्य धर्म',
    category: 'mahapara',
    description: 'ममत्व का सर्वथा त्याग • "आत्मा के अतिरिक्त मेरा कुछ नहीं"',
    rules: 'परिग्रह त्याग, आत्म-लीनता',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-14',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 14,
    name: 'अनंत चतुर्दशी महापर्व • उत्तम ब्रह्मचर्य • वासुपूज्य मोक्ष',
    category: 'mahapara',
    description: 'दशलक्षण महापर्व पूर्णाहुति • १२वें तीर्थंकर वासुपूज्य मोक्ष कल्याणक (चंपापुर) • अनंत व्रत उद्यापन',
    rules: 'पूर्ण ब्रह्मचर्य, उपवास, अनंत सूत्र पूजन',
    highlight: true,
  },
  {
    id: 'bhadrapada-s-15',
    jainMonth: 'भाद्रपद',
    paksha: 'Shukla',
    tithi: 15,
    name: 'भाद्रपद पूर्णिमा • रत्नत्रय व्रत प्रारंभ',
    category: 'mahapara',
    description: 'सम्यग्दर्शन-ज्ञान-चारित्र (रत्नत्रय) व्रत प्रारंभ व शांति पाठ',
    highlight: true,
  },

  // आश्विन मास (Ashwin)
  {
    id: 'ashwin-k-1',
    jainMonth: 'आश्विन',
    paksha: 'Krishna',
    tithi: 1,
    name: 'विश्व-क्षमावाणी महापर्व (पड़वा ढोक / संवत्सरी)',
    category: 'mahapara',
    description: 'दिगम्बर जैन परंपरा अनुसार क्षमापना दिवस • "खामेमि सव्व जीवे, सव्वे जीवा खमंतु मे"',
    rules: 'सर्व जीवों से क्षमा याचना व क्षमादान, मिच्छामि दुक्कडं',
    highlight: true,
  },
  {
    id: 'ashwin-k-2',
    jainMonth: 'आश्विन',
    paksha: 'Krishna',
    tithi: 2,
    name: 'रत्नत्रय व्रत पूर्णाहुति',
    category: 'vrata',
    description: 'रत्नत्रय व्रत उद्यापन व पारणा दिवस',
    highlight: false,
  },
  {
    id: 'ashwin-k-10',
    jainMonth: 'आश्विन',
    paksha: 'Krishna',
    tithi: 10,
    name: 'भगवान चंद्रप्रभु मोक्ष कल्याणक',
    category: 'kalyanak',
    description: '८वें तीर्थंकर चंद्रप्रभु का सम्मेद शिखरजी से मोक्ष',
    highlight: true,
  },
  {
    id: 'ashwin-s-1',
    jainMonth: 'आश्विन',
    paksha: 'Shukla',
    tithi: 1,
    name: 'आश्विन सिद्धचक्र महामंडल विधान प्रारंभ',
    category: 'vrata',
    description: 'शरदकालीन सिद्धचक्र महामंडल विधान व नवपद ओली प्रारंभ',
    highlight: true,
  },
  {
    id: 'ashwin-s-8',
    jainMonth: 'आश्विन',
    paksha: 'Shukla',
    tithi: 8,
    name: 'आश्विन शुक्ल अष्टमी • नवपद आराधना',
    category: 'parva-tithi',
    description: 'पर्व तिथि उपवास व स्वाध्याय',
    highlight: true,
  },
  {
    id: 'ashwin-s-10',
    jainMonth: 'आश्विन',
    paksha: 'Shukla',
    tithi: 10,
    name: 'विजयादशमी (भगवान राम रावण विजय • क्षमा दिवस)',
    category: 'mahapara',
    description: 'जैन रामायण अनुसार बुराई पर अच्छाई की विजय, अहिंसा व शस्त्र त्याग दिवस',
    highlight: true,
  },
  {
    id: 'ashwin-s-15',
    jainMonth: 'आश्विन',
    paksha: 'Shukla',
    tithi: 15,
    name: 'शरद पूर्णिमा • अमृतमयी ध्यान रात्रि',
    category: 'mahapara',
    description: 'भगवान शांतिनाथ निर्वाण पूर्व साधना • शीतल चंद्र किरणों में आत्म-ध्यान',
    rules: 'रात्रि ध्यान, स्वाध्याय, सात्विक आहार',
    highlight: true,
  },

  // कार्तिक मास (Kartika)
  {
    id: 'kartika-k-10',
    jainMonth: 'कार्तिक',
    paksha: 'Krishna',
    tithi: 10,
    name: 'भगवान महावीर दीक्षा व तप कल्याणक (दिगम्बर दीक्षा दिवस)',
    category: 'mahapara',
    description: '२४वें तीर्थंकर भगवान महावीर स्वामी का ज्ञातृखंड वन में पाणिपात्र दिगम्बर मुनि दीक्षा अंगीकार दिवस',
    rules: 'विशेष वैराग्य चिंतन, सामयिक, उपवास',
    highlight: true,
  },
  {
    id: 'kartika-k-11',
    jainMonth: 'कार्तिक',
    paksha: 'Krishna',
    tithi: 11,
    name: 'भगवान संभवनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'तृतीय तीर्थंकर संभवनाथ को केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'kartika-k-13',
    jainMonth: 'कार्तिक',
    paksha: 'Krishna',
    tithi: 13,
    name: 'धन्य तेरस (धनतेरस) • समवशरण विसर्जन दिवस',
    category: 'mahapara',
    description: 'पावापुरी में भगवान महावीर के समवशरण का विसर्जन • तृतीय शुक्लध्यान में प्रवेश',
    rules: 'धन के स्थान पर ज्ञान-वैभव की आराधना',
    highlight: true,
  },
  {
    id: 'kartika-k-14',
    jainMonth: 'कार्तिक',
    paksha: 'Krishna',
    tithi: 14,
    name: 'रूप चौदस • केवलज्ञान योग निरोध दिवस',
    category: 'mahapara',
    description: 'भगवान महावीर का सूक्ष्म क्रिया प्रतिपाति शुक्लध्यान • अयोगिकेवली अवस्था',
    rules: 'आत्म-विशुद्धि, उपवास',
    highlight: true,
  },
  {
    id: 'kartika-k-15',
    jainMonth: 'कार्तिक',
    paksha: 'Krishna',
    tithi: 15,
    name: 'जैन दीपावली • भगवान महावीर निर्वाण कल्याणक',
    category: 'mahapara',
    description: 'पावापुरी के जलमंदिर से भगवान महावीर का मोक्ष गमन • प्रातः निर्वाण लाडू अर्पण, संध्या को दीप प्रज्वलन',
    rules: 'प्रातः ५ बजे जिनालय में निर्वाण लाडू अर्पण, दीप प्रज्वलन',
    highlight: true,
  },
  {
    id: 'kartika-s-1',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 1,
    name: 'वीर निर्वाण संवत् नववर्षारंभ • गौतम केवलज्ञान दिवस',
    category: 'mahapara',
    description: 'नवीन जैन वर्ष प्रारंभ • प्रथम गणधर गौतम स्वामी को केवलज्ञान की प्राप्ति • बही-खाता पूजन',
    rules: 'नववर्ष मंगल भावना, गौतम गणधर वंदना',
    highlight: true,
  },
  {
    id: 'kartika-s-2',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 2,
    name: 'भाई दूज (भ्रातृ द्वितीया - वात्सल्य दिवस)',
    category: 'mahapara',
    description: 'भगवान महावीर के निर्वाण उपरांत बहन सुदर्शना द्वारा भाई नंदीवर्धन को संबल देने की पावन स्मृति',
    highlight: true,
  },
  {
    id: 'kartika-s-5',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 5,
    name: 'ज्ञान पंचमी (सौभाग्य पंचमी - शास्त्र पूजन)',
    category: 'mahapara',
    description: 'शास्त्र-स्वाध्याय, आगम ग्रंथों व ज्ञान के उपकरणों की पूजा • ज्ञानाराधना दिवस',
    rules: 'सरस्वती पूजन, जिनवाणी वंदना',
    highlight: true,
  },
  {
    id: 'kartika-s-8',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 8,
    name: 'कार्तिक अष्टान्हिका महापर्व प्रारंभ',
    category: 'mahapara',
    description: 'नंदीश्वर द्वीप अष्टान्हिका महापूजा प्रारंभ • सिद्धचक्र विधान',
    rules: 'एकासन/उपवास, हरी सब्जी त्याग',
    highlight: true,
  },
  {
    id: 'kartika-s-11',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 11,
    name: 'देव-उठनी एकादशी',
    category: 'vrata',
    description: 'इंद्रिय संयम व स्वाध्याय',
    highlight: false,
  },
  {
    id: 'kartika-s-15',
    jainMonth: 'कार्तिक',
    paksha: 'Shukla',
    tithi: 15,
    name: 'कार्तिक पूर्णिमा • अष्टान्हिका पूर्णाहुति • चातुर्मास निष्ठापन',
    category: 'mahapara',
    description: 'दिगम्बर मुनिराजों का चातुर्मास (वर्षावास) पूर्ण • भव्य रथयात्रा व धर्म प्रभावना महोत्सव',
    rules: 'रथयात्रा दर्शन, मुनि वंदना',
    highlight: true,
  },

  // मार्गशीर्ष मास (Margashirsha)
  {
    id: 'margashirsha-k-10',
    jainMonth: 'मार्गशीर्ष',
    paksha: 'Krishna',
    tithi: 10,
    name: 'भगवान मल्लिनाथ केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: '१९वें तीर्थंकर भगवान मल्लिनाथ को केवलज्ञान',
    highlight: true,
  },
  {
    id: 'margashirsha-s-5',
    jainMonth: 'मार्गशीर्ष',
    paksha: 'Shukla',
    tithi: 5,
    name: 'भगवान पद्मप्रभु जन्म व तप कल्याणक',
    category: 'kalyanak',
    description: 'छठे तीर्थंकर पद्मप्रभु का कौशाम्बी में जन्म व दीक्षा',
    highlight: true,
  },
  {
    id: 'margashirsha-s-10',
    jainMonth: 'मार्गशीर्ष',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान सुमतिनाथ जन्म व दीक्षा कल्याणक',
    category: 'kalyanak',
    description: 'पंचम तीर्थंकर सुमतिनाथ का जन्म व तप',
    highlight: true,
  },
  {
    id: 'margashirsha-s-11',
    jainMonth: 'मार्गशीर्ष',
    paksha: 'Shukla',
    tithi: 11,
    name: 'मौन एकादशी (मौन ग्यारस - १५० कल्याणक आराधना)',
    category: 'mahapara',
    description: 'भूत, भविष्य व वर्तमान के १५० तीर्थंकर कल्याणकों की आराधना • पूर्ण मौन व्रत',
    rules: 'अखंड मौन, ध्यान, जप-तप',
    highlight: true,
  },

  // पौष मास (Pausha)
  {
    id: 'pausha-k-10',
    jainMonth: 'पौष',
    paksha: 'Krishna',
    tithi: 10,
    name: 'भगवान पार्श्वनाथ जन्म कल्याणक',
    category: 'mahapara',
    description: '२३वें तीर्थंकर भगवान पार्श्वनाथ का वाराणसी (काशी) में पावन जन्म कल्याणक महोत्सव',
    rules: 'विशेष पार्श्वनाथ विधान व पूजा',
    highlight: true,
  },
  {
    id: 'pausha-k-11',
    jainMonth: 'पौष',
    paksha: 'Krishna',
    tithi: 11,
    name: 'भगवान पार्श्वनाथ तप कल्याणक (सफला एकादशी)',
    category: 'mahapara',
    description: 'भगवान पार्श्वनाथ की जैनेश्वरी दिगम्बर दीक्षा अंगीकार दिवस',
    highlight: true,
  },
  {
    id: 'pausha-s-7',
    jainMonth: 'पौष',
    paksha: 'Shukla',
    tithi: 7,
    name: 'भगवान संभवनाथ जन्म कल्याणक',
    category: 'kalyanak',
    description: 'तृतीय तीर्थंकर संभवनाथ का श्रावस्ती में जन्म',
    highlight: true,
  },
  {
    id: 'pausha-s-10',
    jainMonth: 'पौष',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान चंद्रप्रभु जन्म व दीक्षा कल्याणक',
    category: 'kalyanak',
    description: '८वें तीर्थंकर चंद्रप्रभु का चंद्रपुरी में जन्म व तप',
    highlight: true,
  },
  {
    id: 'pausha-s-11',
    jainMonth: 'पौष',
    paksha: 'Shukla',
    tithi: 11,
    name: 'पुत्रदा एकादशी (संयम एकादशी)',
    category: 'vrata',
    description: 'इंद्रिय संयम व स्वाध्याय',
    highlight: false,
  },

  // माघ मास (Magha)
  {
    id: 'magha-k-11',
    jainMonth: 'माघ',
    paksha: 'Krishna',
    tithi: 11,
    name: 'भगवान ऋषभदेव केवलज्ञान कल्याणक',
    category: 'kalyanak',
    description: 'प्रथम तीर्थंकर ऋषभदेव को पुरिमताल के वटवृक्ष तले केवलज्ञान प्राप्ति',
    highlight: true,
  },
  {
    id: 'magha-k-14',
    jainMonth: 'माघ',
    paksha: 'Krishna',
    tithi: 14,
    name: 'भगवान ऋषभदेव (आदिनाथ) मोक्ष कल्याणक',
    category: 'mahapara',
    description: 'अष्टापद (कैलाश पर्वत) से प्रथम तीर्थंकर का निर्वाण • निर्वाण लाडू अर्पण दिवस',
    rules: 'प्रातः कैलाश कूट पूजन, निर्वाण लाडू अर्पण',
    highlight: true,
  },
  {
    id: 'magha-k-15',
    jainMonth: 'माघ',
    paksha: 'Krishna',
    tithi: 15,
    name: 'मौनी अमावस्या (जैन मौन ध्यान दिवस)',
    category: 'vrata',
    description: 'मौन, सामायिक व आत्म-निरीक्षण दिवस',
    rules: 'मौन व्रत, स्वाध्याय',
    highlight: true,
  },
  {
    id: 'magha-s-5',
    jainMonth: 'माघ',
    paksha: 'Shukla',
    tithi: 5,
    name: 'बसंत पंचमी (श्रुत-ज्ञान आराधना दिवस)',
    category: 'mahapara',
    description: 'द्वादशांग जिनवाणी माता विशेष पूजन, सरस्वती वंदना • पीत वस्त्र/अक्षत से ज्ञान आराधना',
    rules: 'जिनवाणी पूजन, ज्ञान उपकरणों की सेवा',
    highlight: true,
  },
  {
    id: 'magha-s-7',
    jainMonth: 'माघ',
    paksha: 'Shukla',
    tithi: 7,
    name: 'भगवान विमलनाथ जन्म कल्याणक',
    category: 'kalyanak',
    description: '१३वें तीर्थंकर विमलनाथ का काम्पिल्य नगर में जन्म',
    highlight: true,
  },
  {
    id: 'magha-s-10',
    jainMonth: 'माघ',
    paksha: 'Shukla',
    tithi: 10,
    name: 'भगवान अजितनाथ जन्म व दीक्षा कल्याणक',
    category: 'kalyanak',
    description: 'द्वितीय तीर्थंकर अजितनाथ का जन्म व दीक्षा',
    highlight: true,
  },
  {
    id: 'magha-s-11',
    jainMonth: 'माघ',
    paksha: 'Shukla',
    tithi: 11,
    name: 'जया एकादशी (संयम दिवस)',
    category: 'vrata',
    description: 'इंद्रिय विजय व स्वाध्याय',
    highlight: false,
  },

  // फाल्गुन मास (Phalguna)
  {
    id: 'phalguna-k-12',
    jainMonth: 'फाल्गुन',
    paksha: 'Krishna',
    tithi: 12,
    name: 'भगवान शीतलनाथ जन्म कल्याणक',
    category: 'kalyanak',
    description: '१०वें तीर्थंकर शीतलनाथ का भद्दिलपुर में जन्म',
    highlight: true,
  },
  {
    id: 'phalguna-k-14',
    jainMonth: 'फाल्गुन',
    paksha: 'Krishna',
    tithi: 14,
    name: 'महाशिवरात्रि (जिनेंद्र शिवरात्रि - सिद्ध आराधना)',
    category: 'mahapara',
    description: 'जैन आगम अनुसार "शिव" अर्थात् मोक्ष • अष्ट कर्म मुक्त सिद्ध परमात्मा की आराधना',
    rules: 'सिद्ध चक्र ध्यान, उपवास, रात्रि जागरण',
    highlight: true,
  },
  {
    id: 'phalguna-s-8',
    jainMonth: 'फाल्गुन',
    paksha: 'Shukla',
    tithi: 8,
    name: 'फाल्गुन अष्टान्हिका महापर्व प्रारंभ',
    category: 'mahapara',
    description: 'नंदीश्वर द्वीप अष्टान्हिका महापूजा प्रारंभ • सिद्धचक्र महामंडल विधान',
    rules: 'एकासन/उपवास, हरी सब्जी का त्याग',
    highlight: true,
  },
  {
    id: 'phalguna-s-11',
    jainMonth: 'फाल्गुन',
    paksha: 'Shukla',
    tithi: 11,
    name: 'आमलकी एकादशी',
    category: 'vrata',
    description: 'उपवास व स्वाध्याय',
    highlight: false,
  },
  {
    id: 'phalguna-s-14',
    jainMonth: 'फाल्गुन',
    paksha: 'Shukla',
    tithi: 14,
    name: 'भगवान पुष्पदंत मोक्ष कल्याणक',
    category: 'kalyanak',
    description: '९वें तीर्थंकर पुष्पदंत (सुविधिनाथ) का सम्मेद शिखरजी से मोक्ष',
    highlight: true,
  },
  {
    id: 'phalguna-s-15',
    jainMonth: 'फाल्गुन',
    paksha: 'Shukla',
    tithi: 15,
    name: 'फाल्गुनी पूर्णिमा • अष्टान्हिका पूर्णाहुति • काम-दहन पर्व',
    category: 'mahapara',
    description: 'अष्टान्हिका महापर्व पूर्णता • काम-विकारों का दहन, संयम का उत्सव',
    rules: 'अष्टान्हिका पूर्णता पूजा, विशेष सामायिक',
    highlight: true,
  },
];

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
  const pakshaLabel = paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण';

  // 1. Check exact match in Digambara Jain festival database
  const match = DIGAMBARA_FESTIVALS.find(
    (f) => f.jainMonth === jainMonth && f.paksha === paksha && f.tithi === tithiIndex
  );

  if (match) {
    return {
      name: match.name,
      category: match.category,
      description: match.description,
      highlight: match.highlight,
      rules: match.rules,
    };
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
