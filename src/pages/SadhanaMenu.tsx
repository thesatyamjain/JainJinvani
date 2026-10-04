import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { triggerHaptic } from '../utils/pwaManager';
import { getJainDate, getFestival } from '../lib/panchang';
import {
  Flame,
  Music,
  Book,
  Calendar,
  Sparkles,
  Feather,
  Scroll,
  Flower2,
  BookOpen,
  Crown,
  Timer,
  Leaf,
  ChevronRight,
  Droplets,
  Sun,
  ShieldCheck,
} from 'lucide-react';

interface SadhanaMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

export type SadhanaCategoryKey =
  | 'daily-rituals'
  | 'mantra-stotra'
  | 'puja-vidhan'
  | 'conduct-philosophy';

export interface SadhanaItem {
  id: string;
  label: string;
  sub: string;
  description: string;
  icon: any;
  color: string;
  border: string;
  accent: string;
  badge: string;
  category: SadhanaCategoryKey;
}

interface PillarDef {
  key: SadhanaCategoryKey;
  titleHindi: string;
  titleEnglish: string;
  subtitle: string;
  icon: any;
  color: string;
  border: string;
  accent: string;
}

const PILLARS: PillarDef[] = [
  {
    key: 'daily-rituals',
    titleHindi: 'नित्य आवश्यक साधना',
    titleEnglish: 'Daily Core Rituals',
    subtitle: 'प्रतिदिन की जाने वाली अभिषेक, माला, सामायिक एवं पंचांग साधना',
    icon: Droplets,
    color: 'from-amber-500/25 via-yellow-600/15 to-transparent',
    border: 'border-amber-400/40',
    accent: 'text-amber-300',
  },
  {
    key: 'mantra-stotra',
    titleHindi: 'मूल महामंत्र, स्तोत्र व स्वाध्याय',
    titleEnglish: 'Mantras & Stotras',
    subtitle: 'णमोकार महामंत्र, भक्तामर, स्तोत्र, चालीसा एवं दैनिक स्वाध्याय पाठ',
    icon: Feather,
    color: 'from-rose-500/20 via-pink-600/10 to-transparent',
    border: 'border-rose-400/40',
    accent: 'text-rose-300',
  },
  {
    key: 'puja-vidhan',
    titleHindi: 'देव पूजन, आरती व महाविधान',
    titleEnglish: 'Worship & Vidhan',
    subtitle: 'अष्टद्रव्य देव-शास्त्र-गुरु पूजन, मंगल आरती, भजन व १०५ व्रत विधान',
    icon: Flower2,
    color: 'from-emerald-500/20 via-teal-600/10 to-transparent',
    border: 'border-emerald-400/40',
    accent: 'text-emerald-300',
  },
  {
    key: 'conduct-philosophy',
    titleHindi: 'सदाचार, विवेक एवं तीर्थंकर दर्शन',
    titleEnglish: 'Ethics & Tirthankaras',
    subtitle: 'शुद्ध सात्विक अहिंसक आहार विवेक एवं २४ तीर्थंकरों का पावन चरित्र',
    icon: Crown,
    color: 'from-blue-500/20 via-indigo-600/10 to-transparent',
    border: 'border-blue-400/40',
    accent: 'text-blue-300',
  },
];

const sadhanaItems: SadhanaItem[] = [
  // 1. Daily Core Rituals
  {
    id: 'daily-puja',
    label: 'नित्य अभिषेक व पूजन',
    sub: 'अभिषेक, शान्तिधारा व पूजन',
    description: 'मंदिर जी एवं घर में की जाने वाली क्रमबद्ध अभिषेक, शांतिधारा एवं दैनिक पूजा विधि।',
    icon: Droplets,
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/50',
    accent: 'text-amber-200',
    badge: 'मार्गदर्शित विधि',
    category: 'daily-rituals',
  },
  {
    id: 'jap',
    label: '१०८ जाप माला',
    sub: 'नवकार डिजिटल माला',
    description: '१०८ मनकों की स्पर्श-युक्त डिजिटल माला, नवकार व शांति मंत्र जाप काउंटर।',
    icon: Flame,
    color: 'from-amber-500/20 to-amber-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
    badge: 'डिजिटल माला',
    category: 'daily-rituals',
  },
  {
    id: 'samayik',
    label: 'सामायिक साधना',
    sub: 'समता साधना (४८ मिनट)',
    description: 'राग-द्वेष रहित होकर समता भाव से ४८ मिनट आत्म-चिंतन एवं शुद्ध ध्यान।',
    icon: Timer,
    color: 'from-blue-500/20 to-indigo-700/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-300',
    badge: '४८ मिनट ध्यान',
    category: 'daily-rituals',
  },
  {
    id: 'niyam',
    label: 'दैनिक नियम व व्रत',
    sub: 'श्रावक व्रत व साधना',
    description: 'नित्य देवदर्शन, रात्रि भोजन त्याग एवं श्रावक व्रतों का दैनिक संकल्प ट्रैकर।',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300',
    badge: 'दैनिक संकल्प',
    category: 'daily-rituals',
  },
  {
    id: 'calendar',
    label: 'जैन पंचांग व मुहूर्त',
    sub: 'तिथि, पर्व व नवकारसी समय',
    description: 'दैनिक जैन तिथि, पर्व-त्योहार, सूर्योदय, नवकारसी एवं चौविहार समय।',
    icon: Calendar,
    color: 'from-cyan-500/20 to-blue-700/10',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-300',
    badge: 'दैनिक पंचांग',
    category: 'daily-rituals',
  },

  // 2. Mantras & Stotras
  {
    id: 'namokar',
    label: 'णमोकार महामंत्र',
    sub: 'अनादि मूल मंत्र',
    description: 'पंच परमेष्ठी वंदना, मूल प्राकृत पाठ, महिमा, अर्थ व शुद्ध उच्चारण।',
    icon: Sparkles,
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
    badge: 'मूल महामंत्र',
    category: 'mantra-stotra',
  },
  {
    id: 'stotra',
    label: 'स्तोत्र संग्रह',
    sub: 'भक्तामर व स्तुति पाठ',
    description: 'भक्तामर, कल्याणमंदिर, एकीभाव, विषापहार एवं प्राचीन महास्तोत्र संग्रह।',
    icon: Feather,
    color: 'from-rose-500/20 to-pink-700/10',
    border: 'border-rose-500/30',
    accent: 'text-rose-300',
    badge: 'महास्तोत्र',
    category: 'mantra-stotra',
  },
  {
    id: 'path',
    label: 'पाठ व स्तुति',
    sub: 'स्वाध्याय एवं नियम',
    description: 'मेरी भावना, बारह भावना, समाधिमरण, आलोचना पाठ एवं नित्य स्वाध्याय।',
    icon: Scroll,
    color: 'from-teal-500/20 to-emerald-700/10',
    border: 'border-teal-500/30',
    accent: 'text-teal-300',
    badge: 'नित्य स्वाध्याय',
    category: 'mantra-stotra',
  },
  {
    id: 'chalisa',
    label: 'चालीसा संग्रह',
    sub: '४० पद्य भक्ति',
    description: '२४ तीर्थंकर, पार्श्वनाथ, महावीर स्वामी व पद्मावती चालीसा संग्रह।',
    icon: Book,
    color: 'from-blue-500/20 to-indigo-700/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-300',
    badge: '४० पद्य',
    category: 'mantra-stotra',
  },

  // 3. Worship & Vidhan
  {
    id: 'puja',
    label: 'नित्य पूजा',
    sub: 'अष्टद्रव्य पूजन विधि',
    description: 'देव-शास्त्र-गुरु, पंच परमेष्ठी, चौबीस तीर्थंकर एवं अष्टद्रव्य पूजन।',
    icon: Flower2,
    color: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300',
    badge: 'अष्टद्रव्य',
    category: 'puja-vidhan',
  },
  {
    id: 'aarti',
    label: 'आरती संग्रह',
    sub: 'पंच परमेष्ठी वंदना',
    description: 'मंगल आरती, पंच परमेष्ठी आरती, ॐ जय महावीर प्रभो एवं जिनेंद्र आरतियां।',
    icon: Flame,
    color: 'from-orange-500/20 to-amber-700/10',
    border: 'border-orange-500/30',
    accent: 'text-orange-300',
    badge: 'मंगल दीप',
    category: 'puja-vidhan',
  },
  {
    id: 'bhajan',
    label: 'भक्ति भजन',
    sub: 'आध्यात्मिक रस धारा',
    description: 'वैराग्य, भक्ति, तीर्थ वंदना एवं प्रभु समर्पण के सुमधुर आध्यात्मिक भजन।',
    icon: Music,
    color: 'from-purple-500/20 to-indigo-700/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-300',
    badge: 'भक्ति रस',
    category: 'puja-vidhan',
  },
  {
    id: 'vidhan',
    label: 'महामंडल विधान',
    sub: 'सिद्धचक्र व महाविधान',
    description: 'सिद्धचक्र, कल्पद्रुम, इन्द्रध्वज, सर्वतोभद्र एवं दशलक्षण महाविधान।',
    icon: Sparkles,
    color: 'from-amber-500/20 to-yellow-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
    badge: 'महाविधान',
    category: 'puja-vidhan',
  },
  {
    id: 'vrat',
    label: '१०५ व्रत व उद्यापन',
    sub: 'पूजा, विधि व उद्यापन संग्रह',
    description: 'दशलक्षण, रोहिणी, एकावली, सुगन्धदशमी व्रत विधि, कथा एवं उद्यापन।',
    icon: Sparkles,
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
    badge: '१०५ व्रत',
    category: 'puja-vidhan',
  },

  // 4. Ethics & Tirthankaras
  {
    id: 'dietary',
    label: 'भक्ष्य-अभक्ष्य',
    sub: 'शुद्ध अहिंसक आहार',
    description: 'जमीकंद त्याग, रात्रि भोजन त्याग, अनन्तकाय विवेक एवं सात्विक जैन आहार नियम।',
    icon: Leaf,
    color: 'from-green-500/20 to-emerald-700/10',
    border: 'border-green-500/30',
    accent: 'text-green-300',
    badge: 'अहिंसक आहार',
    category: 'conduct-philosophy',
  },
  {
    id: 'tirthankar',
    label: 'त्रिकाल तीर्थंकर',
    sub: 'तीनों काल की चौबीसी',
    description: 'भूत, वर्तमान व भविष्य तीनों कालों के २४-२४ तीर्थंकर तथा महाविदेह के २० विद्यमान तीर्थंकर।',
    icon: Crown,
    color: 'from-amber-500/20 to-orange-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
    badge: 'त्रिकाल चौबीसी',
    category: 'conduct-philosophy',
  },
];

const CategoryDivider = ({
  icon: Icon,
  titleHindi,
  titleEnglish,
  subtitle,
  count,
  accent,
  color,
  border,
}: {
  icon: any;
  titleHindi: string;
  titleEnglish: string;
  subtitle: string;
  count: number;
  accent: string;
  color: string;
  border: string;
}) => (
  <div className="pt-4 pb-2 sm:pt-6 sm:pb-3 md:pt-10 md:pb-4.5">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 sm:mb-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} border ${border} flex items-center justify-center ${accent} shadow-sm shrink-0`}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-lg md:text-xl font-notoserif font-bold text-amber-200 tracking-tight leading-snug">
              {titleHindi}
            </h2>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-cinzel text-slate-400/80 font-semibold hidden sm:inline-block">
              {titleEnglish}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-300/75 font-gotu mt-0.5 line-clamp-1 sm:line-clamp-none">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300/90 text-[10px] sm:text-[11px] font-gotu backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>{count} साधन</span>
      </div>
    </div>

    {/* Auspicious Mangal Filigree Divider Rule */}
    <div className="relative flex items-center gap-2 pt-0.5 sm:pt-1">
      <div className="h-[1.5px] w-8 sm:w-16 bg-gradient-to-r from-amber-400/90 to-amber-500/40" />
      <span className="text-amber-400/90 text-xs select-none">❖</span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/35 via-amber-400/15 to-transparent" />
    </div>
  </div>
);


export const SadhanaMenu = ({ onNavigate }: SadhanaMenuProps) => {
  // Live Jain Panchang & Festival Details
  const todayDate = useMemo(() => new Date(), []);
  const jainDate = useMemo(() => getJainDate(todayDate), [todayDate]);
  const festival = useMemo(() => {
    return getFestival(
      jainDate.tithiLabel,
      jainDate.paksha,
      todayDate.getMonth(),
      jainDate.tithi,
      jainDate.jainMonth
    );
  }, [jainDate, todayDate]);

  const handleItemClick = (item: SadhanaItem) => {
    triggerHaptic('light');

    if (item.id === 'daily-puja') {
      onNavigate('daily-puja');
    } else if (item.id === 'jap') {
      onNavigate('jap');
    } else if (item.id === 'niyam') {
      onNavigate('niyam');
    } else if (item.id === 'calendar') {
      onNavigate('panchang');
    } else if (item.id === 'samayik') {
      onNavigate('samayik');
    } else if (item.id === 'dietary') {
      onNavigate('dietary');
    } else if (item.id === 'tirthankar') {
      onNavigate('trikal-tirthankar', { source: 'sadhana' });
    } else if (item.id === 'namokar') {
      onNavigate('viewer', {
        id: 'namokar-mantra',
        title: 'णमोकार महामंत्र',
        type: 'stotra',
        source: 'sadhana',
        previousPage: 'sadhana',
      });
    } else {
      onNavigate('category', { id: item.id, source: 'sadhana' });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 sm:pt-12 md:pt-16 page-bottom-clearance px-3.5 sm:px-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3.5 sm:mb-5 md:mb-6 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-0 sm:min-h-[160px] md:h-72 flex items-end p-3.5 sm:p-6 md:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.7)] border border-amber-500/25 group"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1659263240327-20af29178b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWluJTIwcHVqYSUyMGFhcnRpJTIwZGl5YSUyMGxhbXB8ZW58MXx8fHwxNzY4OTY3MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-55"
            alt="Sadhana Header"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/75 to-transparent" />
        </div>

        <div className="relative z-10 w-full">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-[10px] sm:text-xs backdrop-blur-md">
              <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] font-cinzel font-bold">Daily Sadhana</span>
            </div>

            {/* Live Tithi Badge */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900/80 border border-white/15 text-slate-200 text-[10px] sm:text-xs backdrop-blur-md font-gotu">
              <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span>
                {jainDate.jainMonth} {jainDate.pakshaLabel} {jainDate.tithiLabel}
              </span>
              <span className="text-amber-400/70 hidden sm:inline">•</span>
              <span className="text-amber-300/90 hidden sm:inline">वीर संवत् {jainDate.vnsYear}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-notoserif font-bold text-white mb-1 sm:mb-2 leading-tight tracking-tight">
            साधना एवं नित्य नियम
          </h1>
          <p className="hidden sm:block text-slate-200/85 max-w-xl font-gotu text-xs sm:text-sm md:text-base leading-relaxed mb-2 sm:mb-4">
            दैनिक स्वाध्याय, सामायिक, अष्टद्रव्य पूजन, स्तोत्र पाठ एवं आत्म-शुद्धि का पावन दिग्दर्शन।
          </p>

          {/* Special Parva Alert if active */}
          {(festival || jainDate.isParvaTithi) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px] sm:text-sm font-gotu backdrop-blur-md shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
              <span className="line-clamp-1 sm:line-clamp-none">
                {festival?.name || 'पर्व तिथि (अष्टमी / चतुर्दशी / पूनम)'} • आज विशेष स्वाध्याय, सामायिक एवं संयम का पावन दिवस है।
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Pillar Sections */}
      <div className="space-y-4 md:space-y-6">
        {PILLARS.map((pillar) => {
          const itemsInPillar = sadhanaItems.filter((item) => item.category === pillar.key);
          if (itemsInPillar.length === 0) return null;

          return (
            <div key={pillar.key} className="space-y-3">
              {/* Category Divider */}
              <CategoryDivider
                icon={pillar.icon}
                titleHindi={pillar.titleHindi}
                titleEnglish={pillar.titleEnglish}
                subtitle={pillar.subtitle}
                count={itemsInPillar.length}
                accent={pillar.accent}
                color={pillar.color}
                border={pillar.border}
              />

              {/* Cards Grid - Strict 2-col on Mobile */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4.5">
                {itemsInPillar.map((item, idx) => {
                  const isOddLast = idx === itemsInPillar.length - 1 && itemsInPillar.length % 2 === 1;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ delay: idx * 0.03, duration: 0.25 }}
                      onClick={() => handleItemClick(item)}
                      className={`h-full cursor-pointer ${isOddLast ? 'col-span-2 md:col-span-1' : ''}`}
                    >
                      <GlassCard
                        variant="gilded"
                        tilt
                        className="p-3.5 sm:p-4 md:p-5 h-full min-h-[145px] sm:min-h-[160px] flex flex-col justify-between cursor-pointer group transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform shadow-inner shrink-0`}
                          >
                            <item.icon className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-gotu px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/12 border border-amber-400/30 text-amber-200 group-hover:bg-amber-500/25 group-hover:border-amber-400/50 group-hover:text-amber-100 transition-all shadow-sm shrink-0">
                            <span className="truncate">{item.badge}</span>
                            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400/70 group-hover:text-amber-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </span>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-sm sm:text-base md:text-lg font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
                            {item.label}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-300/70 font-gotu line-clamp-1 mt-0.5">
                            {item.sub}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu line-clamp-2 mt-1 hidden sm:block">
                            {item.description}
                          </p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SadhanaMenu;