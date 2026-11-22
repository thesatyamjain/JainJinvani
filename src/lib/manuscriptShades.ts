import type { ManuscriptShade } from '../types';

export interface ManuscriptShadeOption {
  id: ManuscriptShade;
  nameHi: string;
  nameEn: string;
  tag: string;
  bgHex: string;
  cardHex: string;
  sunkenHex: string;
  borderRgba: string;
  shadowDark: string;
  shadowLight: string;
  ink: string;
  accent: string;
  description: string;
}

export const MANUSCRIPT_SHADES: ManuscriptShadeOption[] = [
  {
    id: 'tadpatra',
    nameHi: 'ताड़पत्र',
    nameEn: 'Tadpatra',
    tag: 'मानक स्वर्णिम',
    bgHex: '#F4EFE3',
    cardHex: '#F9F5EC',
    sunkenHex: '#ECE5D5',
    borderRgba: 'rgba(184, 134, 11, 0.28)',
    shadowDark: 'rgba(184, 165, 138, 0.42)',
    shadowLight: 'rgba(255, 255, 255, 0.95)',
    ink: '#1C1917',
    accent: '#B8860B',
    description: 'पारम्परिक स्वर्णिम बादामी ताड़पत्र पृष्ठ (शास्त्रीय प्रामाणिक स्वरूप)।',
  },
  {
    id: 'bhojpatra',
    nameHi: 'भोजपत्र',
    nameEn: 'Bhojpatra',
    tag: 'कोमल श्वेत-स्वर्ण',
    bgHex: '#FAF6EE',
    cardHex: '#FFFDF9',
    sunkenHex: '#F1ECE2',
    borderRgba: 'rgba(168, 140, 93, 0.25)',
    shadowDark: 'rgba(195, 180, 155, 0.35)',
    shadowLight: 'rgba(255, 255, 255, 1)',
    ink: '#1C1917',
    accent: '#A88C5D',
    description: 'हिमालयी भूर्जपत्र की कोमल शीतल श्वेत-स्वर्ण आभा (अत्यधिक सुपाठ्य व सौम्य)।',
  },
  {
    id: 'swarna',
    nameHi: 'स्वर्ण पत्र',
    nameEn: 'Swarna Patra',
    tag: 'गहन स्वर्णिम',
    bgHex: '#F3E8CB',
    cardHex: '#F8EFD8',
    sunkenHex: '#E7D9B6',
    borderRgba: 'rgba(190, 130, 20, 0.35)',
    shadowDark: 'rgba(175, 142, 85, 0.46)',
    shadowLight: 'rgba(255, 253, 240, 0.95)',
    ink: '#1A140B',
    accent: '#C27803',
    description: 'मंदिर के स्वर्णमयी ग्रन्थ, कुंकुम व स्वर्ण-मुहर की दिव्य कांति।',
  },
  {
    id: 'puratan',
    nameHi: 'पुरातन पत्र',
    nameEn: 'Puratan',
    tag: 'प्राचीन सेपिया',
    bgHex: '#EAE0CE',
    cardHex: '#F1E8D9',
    sunkenHex: '#DDD1BD',
    borderRgba: 'rgba(150, 105, 45, 0.32)',
    shadowDark: 'rgba(155, 130, 100, 0.48)',
    shadowLight: 'rgba(255, 252, 245, 0.90)',
    ink: '#1F1A14',
    accent: '#9A6B32',
    description: 'ज्ञान भण्डार के प्राचीन हस्तलिखित ग्रन्थों का गहरा सेपिया पृष्ठ।',
  },
  {
    id: 'tamrapatra',
    nameHi: 'ताम्रपत्र',
    nameEn: 'Tamrapatra',
    tag: 'ताम्र-धरा',
    bgHex: '#EFE4D6',
    cardHex: '#F6ECE1',
    sunkenHex: '#E2D3C1',
    borderRgba: 'rgba(175, 105, 75, 0.30)',
    shadowDark: 'rgba(175, 135, 115, 0.44)',
    shadowLight: 'rgba(255, 250, 245, 0.95)',
    ink: '#231713',
    accent: '#B45309',
    description: 'प्राचीन तीर्थ शिलालेख, ताम्रमुद्रा व पावन पाषाण का सौम्य गेरुआ भाव।',
  },
  {
    id: 'khadi',
    nameHi: 'खद्दर पत्र',
    nameEn: 'Khadi Paper',
    tag: 'हस्तनिर्मित सन',
    bgHex: '#ECE7DE',
    cardHex: '#F4F0E8',
    sunkenHex: '#E0D9CD',
    borderRgba: 'rgba(155, 135, 110, 0.28)',
    shadowDark: 'rgba(165, 155, 140, 0.40)',
    shadowLight: 'rgba(255, 255, 255, 0.95)',
    ink: '#1C1917',
    accent: '#8D7B68',
    description: 'सन व कपास रेशों से निर्मित प्राकृतिक हस्त-कागज़ (नेत्रों को शांतिप्रद)।',
  },
];

export const getManuscriptShade = (shadeId?: string): ManuscriptShadeOption => {
  return MANUSCRIPT_SHADES.find((s) => s.id === shadeId) || MANUSCRIPT_SHADES[0];
};
