import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  BookOpen,
  Sparkles,
  Calendar,
  Timer,
  Feather,
  Crown,
  Scroll,
  Flame,
  History,
  ShieldCheck,
  Heart,
  X,
  MapPin,
  RotateCcw,
  Droplets,
  FileEdit,
} from 'lucide-react';
import { getJainDate, getFestival, useModalBackHandler } from '../lib';
import { getRecentReads } from '../lib/storage';
import { RecentReadItem } from '../types';
import upiQrCode from '../assets/upi_qr_code_satyam5246.png';
import { FeedbackModal } from '../components/features/FeedbackModal';
import { DailyQuoteCard } from '../components/features/DailyQuoteCard';
import { preloadContent } from '../lib/bridge';

interface LandingProps {
  onNavigate: (page: string, params?: any) => void;
}

export interface AnnouncementData {
  text: string;
  badge: string;
  link?: string;
  active: boolean;
  type?: 'permanent' | 'scheduled' | 'time_frame';
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
}

export function isAnnouncementActive(ann: AnnouncementData | null | undefined): boolean {
  if (!ann || !ann.active || !ann.text) return false;
  const now = Date.now();
  if (ann.type === 'scheduled' && ann.startDate) {
    const start = new Date(ann.startDate).getTime();
    if (!isNaN(start) && now < start) return false;
  }
  if (ann.type === 'time_frame') {
    if (ann.startDate) {
      const start = new Date(ann.startDate).getTime();
      if (!isNaN(start) && now < start) return false;
    }
    if (ann.endDate) {
      const end = new Date(ann.endDate).getTime();
      if (!isNaN(end) && now > end) return false;
    }
  }
  return true;
}

export const Landing = ({ onNavigate }: LandingProps) => {
  const today = new Date();
  const todayJain = getJainDate(today);
  const todayFestival = getFestival(
    todayJain.tithiLabel,
    todayJain.paksha,
    today.getMonth(),
    todayJain.tithi,
    todayJain.jainMonth
  );
  const [recentReads, setRecentReads] = useState<RecentReadItem[]>([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('jinvani_announcement_dismissed') === 'true') {
        return null;
      }
      const stored = localStorage.getItem('jinvani_admin_announcement');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isAnnouncementActive(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  // Close modal on mobile back navigation
  useModalBackHandler(showDonateModal, () => setShowDonateModal(false), 'landing-donate-modal');

  useEffect(() => {
    setRecentReads(getRecentReads());

    // 1. Check & fetch global live announcement from static JSON / Edge API
    const fetchGlobalAnnouncement = async () => {
      try {
        const res = await fetch(`/announcement.json?t=${Date.now()}`);
        if (res.ok) {
          const data: AnnouncementData = await res.json();
          if (isAnnouncementActive(data)) {
            if (sessionStorage.getItem('jinvani_announcement_dismissed') !== 'true') {
              setAnnouncement(data);
            }
            try {
              localStorage.setItem('jinvani_admin_announcement', JSON.stringify(data));
            } catch {}
          } else {
            // Expired or inactive
            setAnnouncement(null);
            try {
              localStorage.removeItem('jinvani_admin_announcement');
            } catch {}
          }
        }
      } catch {
        // Offline or network error: fallback to stored announcement
        try {
          const stored = localStorage.getItem('jinvani_admin_announcement');
          if (stored) {
            const parsed = JSON.parse(stored);
            setAnnouncement(isAnnouncementActive(parsed) ? parsed : null);
          }
        } catch {}
      }
    };

    fetchGlobalAnnouncement();

    // 2. Listen for local admin updates
    const handleAnnouncementUpdate = () => {
      try {
        const stored = localStorage.getItem('jinvani_admin_announcement');
        if (stored) {
          const parsed = JSON.parse(stored);
          setAnnouncement(isAnnouncementActive(parsed) ? parsed : null);
        } else {
          setAnnouncement(null);
        }
      } catch {
        setAnnouncement(null);
      }
    };

    window.addEventListener('jinvani_announcement_updated', handleAnnouncementUpdate);
    return () => window.removeEventListener('jinvani_announcement_updated', handleAnnouncementUpdate);
  }, []);

  const isSpecialParva = todayFestival || todayJain.isParvaTithi;

  return (
    <div className="w-full max-w-5xl mx-auto min-h-full px-4 sm:px-6 md:px-8 pt-6 sm:pt-10 md:pt-14 page-bottom-clearance flex flex-col items-center relative overflow-x-hidden">
      {/* Hero Section Container */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center mb-5 sm:mb-8 relative z-10 max-w-3xl flex flex-col items-center"
      >
        {/* Sacred Temple Diya & Golden Radiance (Multi-stage physical falloff) */}
        <div className="absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 w-[260px] sm:w-[380px] h-[140px] sm:h-[180px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-amber-400/08 to-transparent blur-2xl pointer-events-none -z-10" />
        <div className="absolute -top-16 sm:-top-24 left-1/2 -translate-x-1/2 w-[420px] sm:w-[640px] h-[220px] sm:h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/08 via-amber-700/03 to-transparent blur-[70px] pointer-events-none -z-10" />

        {/* Global Admin Broadcast Announcement Banner */}
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-xl mb-4 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0d1527]/95 to-amber-500/15 border border-amber-400/35 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.12)] backdrop-blur-xl flex items-center justify-between gap-3 text-left relative overflow-hidden"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/35 flex items-center justify-center text-amber-300 shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {announcement.badge || 'विशेष सूचना'}
                </span>
                <p className="text-xs sm:text-sm text-slate-100 font-gotu mt-1 font-medium leading-snug">
                  {announcement.text}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {announcement.link && announcement.link !== 'none' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => onNavigate(announcement.link!)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/40 text-amber-200 text-xs font-gotu font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  देखें →
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setAnnouncement(null);
                  try {
                    sessionStorage.setItem('jinvani_announcement_dismissed', 'true');
                  } catch {}
                }}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="हटाएं"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Sacred Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/12 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-medium mb-3 sm:mb-4 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.35),0_0_16px_rgba(245,158,11,0.10),inset_0_1px_0_rgba(255,255,255,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-gotu tracking-wide font-semibold">दिगम्बर जैन महा-पोर्टल • जिनेन्द्र अमृतवाणी</span>
        </motion.div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 leading-[1.25] sm:leading-[1.2] tracking-normal py-1 mb-2.5 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] drop-shadow-[0_0_28px_rgba(245,158,11,0.18)] select-none inline-block">
          जैन जिनवाणी
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base md:text-lg text-slate-200/90 max-w-[55ch] mx-auto leading-relaxed font-gotu px-2 mb-5 sm:mb-7">
          चारों अनुयोग, प्राचीन शास्त्र, नित्य साधना, प्रतिक्रमण, मुनि चर्या एवं तीर्थ क्षेत्रों का संपूर्ण दिगम्बर डिजिटल ज्ञानकोश।
        </p>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-md sm:max-w-lg mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onNavigate('sadhana')}
            className="group relative h-12 sm:h-14 px-4 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 overflow-hidden shadow-[0_4px_18px_rgba(245,158,11,0.22),0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] flex items-center justify-center font-gotu text-sm sm:text-base cursor-pointer select-none"
          >
            <span className="truncate">नित्य साधना</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onNavigate('library')}
            className="group h-12 sm:h-14 px-4 sm:px-7 rounded-xl sm:rounded-2xl font-semibold text-amber-100 bg-[#0c101c]/80 hover:bg-[#121828]/90 border border-amber-500/35 hover:border-amber-400/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-gotu text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer select-none"
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0" />
            <span className="truncate">शास्त्र ग्रंथालय</span>
          </motion.button>
        </div>

        {/* Dynamic Today's Parva & Tithi Auspicious Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-xl mb-3.5 sm:mb-4 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl flex items-center justify-between gap-3 shadow-xl ${
            isSpecialParva
              ? 'bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-500/20 border-amber-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_24px_rgba(245,158,11,0.14)]'
              : 'bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-cyan-500/10 border-white/10 hover:border-amber-400/30'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isSpecialParva
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/35 shadow-[0_2px_8px_rgba(0,0,0,0.4),0_0_12px_rgba(245,158,11,0.16)]'
                  : 'bg-white/5 text-amber-300 border-white/10'
              }`}
            >
              {isSpecialParva ? <Flame className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs sm:text-sm font-notoserif font-bold text-amber-200 truncate">
                {todayFestival
                  ? `आज पावन पर्व: ${todayFestival.name}`
                  : `आज की तिथि: ${todayJain.jainMonth} ${todayJain.pakshaLabel} ${todayJain.tithiLabel}`}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-300 font-gotu truncate">
                {todayFestival?.description
                  ? todayFestival.description
                  : `वीर निर्वाण संवत् ${todayJain.vnsYear} • नित्य देवदर्शन, सामायिक व स्वाध्याय साधना`}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onNavigate('panchang')}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-gotu font-bold hover:bg-amber-300 transition-colors cursor-pointer shadow-md select-none"
          >
            पंचांग
          </motion.button>
        </motion.div>

        {/* Sacred Mahamantra Inscription Plaque (स्वर्ण-शिला पट्टिका) */}
        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#17130b]/95 via-[#231a0e]/95 to-[#17130b]/95 border border-amber-400/35 backdrop-blur-xl max-w-xl w-full mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(254,240,138,0.25),inset_0_-1px_1px_rgba(0,0,0,0.6)]">
          {/* Corner traditional markers */}
          <div className="absolute top-1.5 left-2 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute top-1.5 right-2 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-1.5 left-2 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-1.5 right-2 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>

          {/* Desktop & Tablet: Full Single Line */}
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm font-gotu text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-center tracking-wide font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] px-3 whitespace-nowrap">
              णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं
            </p>
          </div>

          {/* Mobile Screens: 2 balanced lines ensuring sacred padas never split across lines */}
          <div className="block sm:hidden text-xs font-gotu text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-center tracking-normal font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] px-1.5 space-y-1.5">
            <div className="flex items-center justify-center flex-wrap gap-x-2">
              <span className="whitespace-nowrap">णमो अरिहंताणं</span>
              <span className="text-amber-400/60 select-none text-[10px]">•</span>
              <span className="whitespace-nowrap">णमो सिद्धाणं</span>
              <span className="text-amber-400/60 select-none text-[10px]">•</span>
              <span className="whitespace-nowrap">णमो आयरियाणं</span>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-x-2">
              <span className="whitespace-nowrap">णमो उवज्झायाणं</span>
              <span className="text-amber-400/60 select-none text-[10px]">•</span>
              <span className="whitespace-nowrap">णमो लोए सव्व साहूणं</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Daily Spiritual Quote from Samayasara, Chhahdhala & Tattvartha Sutra */}
      <DailyQuoteCard />

      {/* Recent Reads Section (Shown when user has read items) */}
      {recentReads.length > 0 && (
        <div className="w-full max-w-xl relative z-10 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 px-1">
            <History className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-notoserif font-bold text-amber-200">
              हाल ही में पढ़े गए पाठ
            </h3>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
            {recentReads.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() =>
                  onNavigate('viewer', {
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    source: 'landing',
                  })
                }
                onMouseEnter={() => preloadContent(item.id)}
                onTouchStart={() => preloadContent(item.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/25 hover:border-amber-400/50 backdrop-blur-xl text-left transition-colors shrink-0 cursor-pointer group max-w-[220px]"
              >
                <p className="text-xs font-notoserif font-semibold text-white group-hover:text-amber-200 truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-amber-300/80 font-gotu truncate">
                  पुनः स्वाध्याय करें →
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Essential Spiritual & Scripture Cards (Digambar Super Portal 8 Cards Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-4xl relative z-10">
        {/* Featured: Daily Abhishek & Puja Full Flow */}
        <GlassCard
          variant="gilded"
          tilt={{ maxTilt: 8, scale: 1.015, glareColor: 'amber' }}
          onClick={() => onNavigate('daily-puja')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-amber-500/10 group rounded-xl sm:rounded-2xl border-amber-400/40 shadow-md bg-gradient-to-br from-amber-500/15 via-slate-900/60 to-yellow-600/10 col-span-2 md:col-span-4"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/35 shadow-[0_2px_8px_rgba(0,0,0,0.35),0_0_12px_rgba(245,158,11,0.15)]">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm md:text-base font-notoserif font-bold text-amber-200 group-hover:text-amber-100 truncate">
                नित्य अभिषेक एवं पूजन पाठ
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-gotu border border-amber-400/30">
                दैनिक अनुष्ठान
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300/80 font-gotu truncate">
              अभिषेक, वृहद् शान्तिधारा, गंधोदक, देव-शास्त्र-गुरु पूजन व आरती — संपूर्ण क्रम एक साथ
            </p>
          </div>
        </GlassCard>

        {/* 1. Samayik */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('samayik')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-blue-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Timer className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-blue-200 truncate">
              सामायिक
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              ४८ मिनट समता साधना
            </p>
          </div>
        </GlassCard>

        {/* 2. Jap Mala */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('jap')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-rose-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
            <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-rose-200 truncate">
              १०८ जाप माला
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              नवकार मंत्र डिजिटल माला
            </p>
          </div>
        </GlassCard>

        {/* 3. Daily Niyama */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('niyam')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-emerald-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-emerald-200 truncate">
              दैनिक नियम
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              श्रावक व्रत व साधना ट्रैकर
            </p>
          </div>
        </GlassCard>

        {/* 4. Bhaktamar Stotra */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() =>
            onNavigate('viewer', {
              id: 'bhaktamar-stotra',
              title: 'भक्तामर स्तोत्र (संस्कृत व हिन्दी)',
              type: 'stotra',
              source: 'landing',
            })
          }
          onMouseEnter={() => preloadContent('bhaktamar-stotra')}
          onTouchStart={() => preloadContent('bhaktamar-stotra')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-amber-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Feather className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-amber-200 truncate">
              भक्तामर स्तोत्र
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              ४८ काव्य अर्थ सहित
            </p>
          </div>
        </GlassCard>

        {/* 5. 24 Tirthankaras */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('trikal-tirthankar', { source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-amber-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Crown className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-amber-200 truncate">
              त्रिकाल तीर्थंकर
            </h4>
            <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-gotu truncate">
              भूत, वर्तमान, भविष्य चौबीसी
            </p>
          </div>
        </GlassCard>

        {/* 6. Sacred Scriptures */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-emerald-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Scroll className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-emerald-200 truncate">
              जिनवाणी शास्त्र
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              प्राचीन मूल आगम व ग्रंथ
            </p>
          </div>
        </GlassCard>

        {/* 7. Pratikramana & Alochana */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() =>
            onNavigate('viewer', {
              id: 'daivasika-pratikramana',
              title: 'श्रावक दैवसिक प्रतिक्रमण',
              type: 'path',
              source: 'landing',
            })
          }
          onMouseEnter={() => preloadContent('daivasika-pratikramana')}
          onTouchStart={() => preloadContent('daivasika-pratikramana')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-cyan-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <RotateCcw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-cyan-200 truncate">
              प्रतिक्रमण
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              दैवसिक व पाक्षिक आलोचना
            </p>
          </div>
        </GlassCard>

        {/* 8. Tirth Yatra Guide */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('pilgrimage')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-purple-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
            <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-purple-200 truncate">
              तीर्थ क्षेत्र
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              २२+ सिद्ध व अतिशय क्षेत्र
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Community Contribution & Error Reporting Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full max-w-3xl mt-4 sm:mt-6 relative z-10"
      >
        <GlassCard
          variant="gilded"
          sheen
          tilt={{ maxTilt: 6, scale: 1.008, glareColor: 'gold', glareMaxOpacity: 0.16 }}
          className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-amber-400/40 bg-gradient-to-br from-[#1b1710]/95 via-[#131929]/90 to-[#0c101a]/95 hover:border-amber-400/60 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(245,158,11,0.12)] relative overflow-hidden"
        >
          {/* Subtle gold traditional corner markers */}
          <div className="absolute top-2 left-2.5 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute top-2 right-2.5 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-2 left-2.5 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-2 right-2.5 text-[10px] text-amber-400/50 pointer-events-none select-none">❖</div>

          {/* Top Pill / Badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-[11px] sm:text-xs font-semibold font-gotu shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_10px_rgba(245,158,11,0.12)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              डिजिटल जिनवाणी महा-संकलन • सहभागिता आमंत्रण
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
            <div className="min-w-0 flex-1 pr-0 md:pr-4">
              <h3 className="text-base sm:text-lg md:text-xl font-notoserif font-bold text-white mb-1.5 leading-snug">
                विश्व का सबसे वृहद डिजिटल जिनवाणी संग्रह
              </h3>
              <p className="text-xs sm:text-sm text-slate-200/90 font-gotu leading-relaxed max-w-[65ch]">
                हम अब तक का सबसे विशाल एवं प्रामाणिक डिजिटल जिनवाणी महाकोश तैयार कर रहे हैं। वर्तमान में वेबसाइट निर्माण व संवर्धन के चरण में है, अतः आगम व टंकण में अज्ञानतावश त्रुटियाँ संभव हैं। यदि आपको कोई अशुद्धि दिखे या आप कोई नया पाठ, स्तोत्र अथवा ग्रंथ जोड़ना चाहते हैं, तो फॉर्म द्वारा या सीधे ईमेल <a href="mailto:thesoftwarecompany@zohomail.in" className="text-amber-300 font-mono font-bold hover:text-amber-200 underline">thesoftwarecompany@zohomail.in</a> पर सूचित करें।
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setShowFeedbackModal(true)}
                className="w-full md:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-gotu font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)] cursor-pointer select-none"
              >
                <FileEdit className="w-4 h-4 text-slate-950 shrink-0" />
                <span>सुधार या सुझाव बताएं</span>
                <span className="text-xs">→</span>
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Featured Sahyog Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        onClick={() => setShowDonateModal(true)}
        className="w-full max-w-3xl mt-3.5 sm:mt-4 relative z-10 cursor-pointer"
      >
        <GlassCard
          variant="sacred"
          tilt={{ maxTilt: 6, scale: 1.01, glareColor: 'gold', glareMaxOpacity: 0.18 }}
          className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/10 group rounded-xl sm:rounded-2xl border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-orange-500/15 shadow-lg"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 group-hover:scale-110 transition-transform">
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-amber-400/30 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-amber-200 truncate">
                जिनवाणी सेवा में सहयोग
              </h4>
              <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-gotu truncate">
                धर्म प्रभावना व ऐप संवर्धन हेतु स्वेच्छा से योगदान करें
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-gotu font-semibold shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            सहयोग करें →
          </div>
        </GlassCard>
      </motion.div>

      {/* Sahyog Donate Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonateModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg z-10 my-auto"
            >
              <GlassCard className="p-4 sm:p-7 border-white/20 bg-[#0b162c] shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl max-h-[min(90vh,680px)] flex flex-col">
                {/* Glow effect inside modal */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 relative z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/30 text-amber-300" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">सहयोग</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDonateModal(false)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="text-blue-50 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                  <div className="text-center space-y-4 sm:space-y-5">
                    <div className="w-48 sm:w-56 mx-auto bg-white rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-amber-400/30">
                      <img
                        src={upiQrCode}
                        alt="UPI QR Code - Satyam Jain"
                        className="w-full aspect-square object-contain rounded-xl"
                      />
                      <div className="mt-2.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-slate-800 text-xs font-mono font-bold select-all">
                        satyam5246@upi
                      </div>
                    </div>
                    <p className="text-blue-100/85 font-gotu text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                      इस धर्म प्रभावना व जिनवाणी डिजिटलीकरण के पावन कार्य में सहयोग हेतु किसी भी UPI ऐप (GPay, PhonePe, Paytm आदि) से स्कैन करें।
                    </p>
                    <div className="pt-2 border-t border-white/10 text-[11px] font-gotu text-amber-200/80">
                      संपर्क व पावती: <a href="mailto:thesoftwarecompany@zohomail.in" className="font-mono text-amber-300 hover:underline">thesoftwarecompany@zohomail.in</a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google Form Community Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};
