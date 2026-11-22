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
  Smartphone,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { isWebsite } from '../utils/platform';
import { triggerHaptic, isStandaloneMode } from '../utils/pwaManager';
import { getJainDate, getFestival, useModalBackHandler } from '../lib';
import { getRecentReads } from '../lib/storage';
import { RecentReadItem } from '../types';
import upiQrCode from '../assets/upi_qr_code_satyam5246.png';
import appLogo from '../assets/logo.webp';
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

function isAnnouncementActive(ann: AnnouncementData | null | undefined): boolean {
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
  const [upiCopied, setUpiCopied] = useState(false);
  const [isInstallDismissed, setIsInstallDismissed] = useState(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('jinvani_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInstallDismissed(true);
    try {
      sessionStorage.setItem('jinvani_install_banner_dismissed', 'true');
    } catch {}
  };

  const handleCopyUpi = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText('satyam5246@upi');
      setUpiCopied(true);
      triggerHaptic('medium');
      setTimeout(() => setUpiCopied(false), 2200);
    } catch {
      // Fallback
    }
  };
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
        className="w-full text-left mb-6 sm:mb-8 relative z-10 max-w-4xl flex flex-col items-start"
      >
        {/* Sacred Temple Diya & Golden Radiance */}
        <div className="absolute -top-10 sm:-top-16 left-0 w-[280px] sm:w-[420px] h-[140px] sm:h-[180px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-amber-400/08 to-transparent blur-2xl pointer-events-none -z-10" />
        <div className="absolute -top-16 sm:-top-24 left-1/4 w-[420px] sm:w-[640px] h-[220px] sm:h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/08 via-amber-700/03 to-transparent blur-[70px] pointer-events-none -z-10" />

        {/* Global Admin Broadcast Announcement Banner */}
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full mb-4 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0d1527]/95 to-amber-500/15 border border-amber-400/35 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.12)] backdrop-blur-xl flex items-center justify-between gap-3 text-left relative overflow-hidden"
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

        {/* Platform-Aware App Promotion Banner (Header) */}
        {isWebsite() && !isStandaloneMode() && !isInstallDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full mb-3.5 sm:mb-4.5 relative z-10"
          >
            <GlassCard
              variant="subtle"
              onClick={() => {
                triggerHaptic('medium');
                window.dispatchEvent(new CustomEvent('jinvani:open-install-prompt'));
              }}
              className="app-install-header-card p-2.5 sm:p-3 rounded-2xl border-amber-500/25 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2.5 sm:gap-4 min-w-0">
                {/* Left: App Logo Emblem & Info */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src={appLogo}
                      alt="Jain Jinvani"
                      className="w-full h-full object-contain rounded-lg"
                      loading="eager"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="app-install-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-white truncate leading-snug">
                      फ़ोन में जिनवाणी ऐप इंस्टॉल करें
                    </h3>
                    <p className="app-install-subtitle text-[11px] sm:text-xs text-stone-600 dark:text-slate-300 font-gotu mt-0.5 truncate font-medium">
                      १००% ऑफ़लाइन • बिना विज्ञापन • द्रुत गति
                    </p>
                  </div>
                </div>

                {/* Right: Compact Action Pill + Dismiss Button */}
                <div className="shrink-0 flex items-center gap-1 sm:gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('medium');
                      window.dispatchEvent(new CustomEvent('jinvani:open-install-prompt'));
                    }}
                    className="app-install-btn px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-gotu font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm select-none"
                  >
                    <Download className="w-3.5 h-3.5 shrink-0" />
                    <span>इंस्टॉल करें</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={handleDismissInstall}
                    className="app-install-dismiss p-1 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="हटाएँ"
                    aria-label="बैनर हटाएँ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Header Title Row: "जैन जिनवाणी" (left) + "चारों अनुयोग..." (right side) */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-5 sm:mb-6">
          <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl font-notoserif font-bold text-[#1C1917] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-amber-50 dark:via-amber-100 dark:to-amber-300 leading-tight tracking-tight dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] select-none shrink-0">
            जैन जिनवाणी
          </h1>
          <div className="hero-subtitle-container sm:border-l sm:border-amber-600/40 dark:sm:border-amber-400/30 sm:pl-4 max-w-xl">
            <p className="hero-subtitle text-xs sm:text-sm text-[#292524] dark:text-slate-100 leading-relaxed font-gotu font-medium">
              चारों अनुयोग, प्राचीन शास्त्र, नित्य साधना, प्रतिक्रमण, मुनि चर्या एवं तीर्थ क्षेत्रों का संपूर्ण दिगम्बर डिजिटल ज्ञानकोश।
            </p>
          </div>
        </div>

        {/* Big Card of Panchang */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.006 }}
          transition={{ duration: 0.35 }}
          onClick={() => onNavigate('panchang')}
          className={`panchang-hero-card w-full p-4 sm:p-5 md:p-6 rounded-2xl border backdrop-blur-xl mb-5 sm:mb-6 cursor-pointer group text-left relative overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(254,240,138,0.2)] ${
            isSpecialParva
              ? 'bg-gradient-to-br from-amber-500/20 via-[#131b2e]/95 to-[#0b101d]/95 border-amber-400/40 shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(245,158,11,0.12)]'
              : 'bg-gradient-to-br from-[#1c160b]/95 via-[#131b2e]/90 to-[#0e1422]/95 border-amber-400/35'
          }`}
        >
          {/* Subtle Golden Ambient Glow in card corner */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar: Title + Samvat Info + View Button */}
          <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-amber-400/15 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isSpecialParva
                    ? 'bg-amber-500/25 text-amber-900 dark:text-amber-300 border-amber-500/40 shadow-[0_2px_8px_rgba(245,158,11,0.25)]'
                    : 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500/35'
                }`}
              >
                {isSpecialParva ? <Flame className="w-5 h-5 text-amber-900 dark:text-amber-300" /> : <Calendar className="w-5 h-5 text-amber-900 dark:text-amber-300" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-gotu font-bold text-amber-950 dark:text-amber-300 tracking-wide">
                    आज का दिगम्बर पंचांग
                  </span>
                  {isSpecialParva && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-300 text-[10px] font-gotu font-semibold border border-amber-400/30">
                      पावन पर्व
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-700 dark:text-slate-200 font-gotu font-medium truncate block">
                  वीर निर्वाण संवत् {todayJain.vnsYear} • विक्रम संवत् {todayJain.vikramYear}
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('panchang');
              }}
              className="panchang-view-btn shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-gotu font-bold transition-colors cursor-pointer shadow-md select-none"
            >
              संपूर्ण पंचांग देखें →
            </motion.button>
          </div>

          {/* Main Tithi / Festival Display */}
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-notoserif font-bold text-[#1C1917] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-100 dark:via-amber-200 dark:to-amber-300 leading-snug">
              {todayFestival
                ? `आज पावन पर्व: ${todayFestival.name}`
                : `${todayJain.jainMonth} ${todayJain.pakshaLabel} ${todayJain.tithiLabel}`}
            </h2>
            <p className="text-xs sm:text-sm text-[#292524] dark:text-slate-100 font-gotu mt-1 leading-relaxed font-medium">
              {todayFestival?.description
                ? todayFestival.description
                : `तिथि: ${todayJain.jainMonth} ${todayJain.pakshaLabel} ${todayJain.tithiLabel} • नित्य देवदर्शन, सामायिक व स्वाध्याय साधना`}
            </p>
          </div>

          {/* Structured Detail Grid (Month, Paksha, Tithi, Sadhana) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-400/25">
              <span className="text-[10px] text-stone-700 dark:text-amber-200 font-gotu font-semibold block">जैन मास</span>
              <span className="text-xs sm:text-sm font-gotu font-bold text-stone-950 dark:text-amber-100 truncate block">
                {todayJain.jainMonth}
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-400/25">
              <span className="text-[10px] text-stone-700 dark:text-amber-200 font-gotu font-semibold block">पक्ष</span>
              <span className="text-xs sm:text-sm font-gotu font-bold text-stone-950 dark:text-amber-100 truncate block">
                {todayJain.pakshaLabel} पक्ष
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-400/25">
              <span className="text-[10px] text-stone-700 dark:text-amber-200 font-gotu font-semibold block">तिथि</span>
              <span className="text-xs sm:text-sm font-gotu font-bold text-stone-950 dark:text-amber-100 truncate block">
                {todayJain.tithiLabel}
              </span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-400/25">
              <span className="text-[10px] text-stone-700 dark:text-amber-200 font-gotu font-semibold block">साधना</span>
              <span className="text-xs sm:text-sm font-gotu font-bold text-stone-950 dark:text-amber-100 truncate block">
                देवदर्शन व स्वाध्याय
              </span>
            </div>
          </div>
        </motion.div>

        {/* Primary Action CTA Buttons (2 Columns Grid) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-3.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onNavigate('sadhana')}
            className="primary-cta-sadhana neu-btn-kumkum group relative h-12 sm:h-13 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 overflow-hidden shadow-[0_4px_18px_rgba(245,158,11,0.22),0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] flex items-center justify-center font-gotu text-xs sm:text-base cursor-pointer select-none w-full"
          >
            <span className="truncate">नित्य साधना</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => onNavigate('library')}
            className="primary-cta-library neu-btn-paper group h-12 sm:h-13 px-4 sm:px-8 rounded-xl sm:rounded-2xl font-semibold text-amber-100 bg-[#0c101c]/80 hover:bg-[#121828]/90 border border-amber-500/35 hover:border-amber-400/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-gotu text-xs sm:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer select-none w-full"
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0" />
            <span className="truncate">शास्त्र ग्रंथालय</span>
          </motion.button>
        </div>

        {/* Quick Access Tags (Center Aligned) */}
        <div className="flex items-center justify-center flex-wrap gap-2 w-full">
          <button
            onClick={() => onNavigate('panchang')}
            className="quick-access-tag px-3.5 py-1.5 rounded-full text-xs font-gotu bg-white/5 hover:bg-amber-400/20 border border-white/15 hover:border-amber-400/40 text-slate-100 dark:text-amber-100 hover:text-amber-200 font-medium transition-colors cursor-pointer select-none shadow-xs"
          >
            पंचांग
          </button>
          <button
            onClick={() => onNavigate('pratikraman')}
            className="quick-access-tag px-3.5 py-1.5 rounded-full text-xs font-gotu bg-white/5 hover:bg-amber-400/20 border border-white/15 hover:border-amber-400/40 text-slate-100 dark:text-amber-100 hover:text-amber-200 font-medium transition-colors cursor-pointer select-none shadow-xs"
          >
            प्रतिक्रमण
          </button>
          <button
            onClick={() => onNavigate('bhakti')}
            className="quick-access-tag px-3.5 py-1.5 rounded-full text-xs font-gotu bg-white/5 hover:bg-amber-400/20 border border-white/15 hover:border-amber-400/40 text-slate-100 dark:text-amber-100 hover:text-amber-200 font-medium transition-colors cursor-pointer select-none shadow-xs"
          >
            भक्ति-भजन
          </button>
          <button
            onClick={() => onNavigate('daily-puja')}
            className="quick-access-tag px-3.5 py-1.5 rounded-full text-xs font-gotu bg-white/5 hover:bg-amber-400/20 border border-white/15 hover:border-amber-400/40 text-slate-100 dark:text-amber-100 hover:text-amber-200 font-medium transition-colors cursor-pointer select-none shadow-xs"
          >
            अभिषेक व पूजन
          </button>
        </div>
      </motion.section>

      {/* Daily Spiritual Quote from Samayasara, Chhahdhala & Tattvartha Sutra */}
      <DailyQuoteCard />

      {/* Recent Reads Section (Shown when user has read items) */}
      {recentReads.length > 0 && (
        <div className="w-full max-w-4xl relative z-10 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 px-1">
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs sm:text-sm font-notoserif font-bold text-slate-900 dark:text-amber-200">
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
                className="recent-read-btn px-3.5 py-2 rounded-xl bg-amber-500/10 dark:bg-slate-900/80 hover:bg-amber-500/20 dark:hover:bg-slate-800/90 border border-amber-500/25 hover:border-amber-400/50 backdrop-blur-xl text-left transition-colors shrink-0 cursor-pointer group max-w-[220px]"
              >
                <p className="text-xs font-notoserif font-bold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-200 truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-gotu font-semibold truncate">
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
          variant="subtle"
          tilt={{ maxTilt: 6, scale: 1.015, glareColor: 'amber' }}
          onClick={() => onNavigate('daily-puja')}
          className="featured-abhishek-card p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer group rounded-xl sm:rounded-2xl border-amber-500/35 dark:border-amber-400/30 shadow-md col-span-2 md:col-span-4"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="portal-card-title text-xs sm:text-sm md:text-base font-notoserif font-bold text-stone-900 dark:text-stone-100 truncate">
                नित्य अभिषेक एवं पूजन पाठ
              </h4>
              <span className="abhishek-badge px-2 py-0.5 rounded-full text-[10px] font-gotu font-bold">
                दैनिक अनुष्ठान
              </span>
            </div>
            <p className="portal-card-sub text-[10px] sm:text-xs text-stone-800 dark:text-stone-200 font-gotu truncate font-semibold">
              अभिषेक, वृहद् शान्तिधारा, गंधोदक, देव-शास्त्र-गुरु पूजन व आरती — संपूर्ण क्रम एक साथ
            </p>
          </div>
        </GlassCard>

        {/* 1. Samayik */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('samayik')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-blue-500/30 dark:border-blue-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/35">
            <Timer className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-700 dark:group-hover:text-blue-200 truncate">
              सामायिक
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
              ४८ मिनट समता साधना
            </p>
          </div>
        </GlassCard>

        {/* 2. Jap Mala */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('jap')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-rose-500/30 dark:border-rose-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/35">
            <Flame className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-700 dark:group-hover:text-rose-200 truncate">
              १०८ जाप माला
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
              नवकार मंत्र डिजिटल माला
            </p>
          </div>
        </GlassCard>

        {/* 3. Daily Niyama */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('niyam')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-emerald-500/30 dark:border-emerald-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/35">
            <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 truncate">
              दैनिक नियम
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
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
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-amber-500/30 dark:border-amber-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/35">
            <Feather className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-200 truncate">
              भक्तामर स्तोत्र
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
              ४८ काव्य अर्थ सहित
            </p>
          </div>
        </GlassCard>

        {/* 5. 24 Tirthankaras */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('trikal-tirthankar', { source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-amber-500/30 dark:border-amber-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/35">
            <Crown className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-200 truncate">
              त्रिकाल तीर्थंकर
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
              भूत, वर्तमान, भविष्य चौबीसी
            </p>
          </div>
        </GlassCard>

        {/* 6. Sacred Scriptures */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-emerald-500/30 dark:border-emerald-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/35">
            <Scroll className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 truncate">
              जिनवाणी शास्त्र
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
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
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-cyan-500/30 dark:border-cyan-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/35">
            <RotateCcw className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-200 truncate">
              प्रतिक्रमण
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
              दैवसिक व पाक्षिक आलोचना
            </p>
          </div>
        </GlassCard>

        {/* 8. Tirth Yatra Guide */}
        <GlassCard
          variant="subtle"
          tilt
          onClick={() => onNavigate('pilgrimage')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 group rounded-xl sm:rounded-2xl border-purple-500/30 dark:border-purple-400/30 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/35">
            <MapPin className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="portal-card-title text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 group-hover:text-purple-700 dark:group-hover:text-purple-200 truncate">
              तीर्थ क्षेत्र
            </h4>
            <p className="portal-card-sub text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
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
        className="w-full max-w-4xl mt-4 sm:mt-6 relative z-10"
      >
        <GlassCard
          variant="subtle"
          sheen
          tilt={{ maxTilt: 4, scale: 1.008, glareColor: 'gold', glareMaxOpacity: 0.16 }}
          className="community-contribution-card p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-amber-500/30 shadow-md relative overflow-hidden"
        >
          {/* Subtle gold traditional corner markers */}
          <div className="absolute top-2 left-2.5 text-[10px] text-amber-500/50 pointer-events-none select-none">❖</div>
          <div className="absolute top-2 right-2.5 text-[10px] text-amber-500/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-2 left-2.5 text-[10px] text-amber-500/50 pointer-events-none select-none">❖</div>
          <div className="absolute bottom-2 right-2.5 text-[10px] text-amber-500/50 pointer-events-none select-none">❖</div>

          {/* Top Pill / Badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="community-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-gotu">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              डिजिटल जिनवाणी महा-संकलन • सहभागिता आमंत्रण
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
            <div className="min-w-0 flex-1 pr-0 md:pr-4">
              <h3 className="text-base sm:text-lg md:text-xl font-notoserif font-bold text-stone-900 dark:text-stone-100 mb-1.5 leading-snug">
                विश्व का सबसे वृहद डिजिटल जिनवाणी संग्रह
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-gotu font-medium leading-relaxed max-w-[65ch]">
                हम अब तक का सबसे विशाल एवं प्रामाणिक डिजिटल जिनवाणी महाकोश तैयार कर रहे हैं। वर्तमान में वेबसाइट निर्माण व संवर्धन के चरण में है, अतः आगम व टंकण में अज्ञानतावश त्रुटियाँ संभव हैं। यदि आपको कोई अशुद्धि दिखे या आप कोई नया पाठ, स्तोत्र अथवा ग्रंथ जोड़ना चाहते हैं, तो फॉर्म द्वारा या सीधे ईमेल <a href="mailto:thesoftwarecompany@zohomail.in" className="text-red-800 dark:text-amber-300 font-mono font-bold hover:underline">thesoftwarecompany@zohomail.in</a> पर सूचित करें।
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => setShowFeedbackModal(true)}
                className="community-feedback-btn w-full md:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white font-gotu font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(153,27,27,0.35)] hover:shadow-[0_6px_25px_rgba(153,27,27,0.5)] cursor-pointer select-none"
              >
                <FileEdit className="w-4 h-4 text-white shrink-0" />
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
        className="w-full max-w-4xl mt-3.5 sm:mt-4 relative z-10"
      >
        <GlassCard
          variant="subtle"
          tilt={{ maxTilt: 4, scale: 1.01, glareColor: 'gold', glareMaxOpacity: 0.18 }}
          onClick={() => {
            triggerHaptic('light');
            setShowDonateModal(true);
          }}
          className="sahyog-card p-3.5 sm:p-4 flex items-center justify-between gap-3 group rounded-xl sm:rounded-2xl border-amber-500/35 dark:border-amber-400/30 shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 group-hover:scale-110 transition-transform">
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-amber-400/30 text-amber-600 dark:text-amber-300" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-notoserif font-bold text-stone-900 dark:text-stone-100 truncate">
                जिनवाणी सेवा में सहयोग
              </h4>
              <p className="text-[10px] sm:text-[11px] text-stone-800 dark:text-stone-200 font-gotu font-semibold truncate">
                धर्म प्रभावना व ऐप संवर्धन हेतु स्वेच्छा से योगदान करें
              </p>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('light');
              setShowDonateModal(true);
            }}
            className="sahyog-action-btn px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-[11px] font-gotu shadow-sm border border-red-600/50 shrink-0 transition-all cursor-pointer"
          >
            सहयोग करें →
          </motion.button>
        </GlassCard>
      </motion.div>

      {/* Sahyog Donate Modal - Mounted to body via portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {showDonateModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
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
                  <GlassCard className="donate-modal-card p-4 sm:p-7 border-amber-500/35 bg-[#0b162c] shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl max-h-[min(90vh,680px)] flex flex-col">
                    {/* Glow effect inside modal */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="flex justify-between items-center mb-4 border-b border-white/10 dark:border-white/10 pb-3 relative z-10 shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/30 text-amber-300" />
                        </div>
                        <h2 className="donate-modal-title text-xl sm:text-2xl font-notoserif font-bold text-white">
                          जिनवाणी सेवा में सहयोग
                        </h2>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowDonateModal(false)}
                        className="donate-modal-close p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/10"
                        title="बंद करें"
                        aria-label="बंद करें"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="donate-modal-body relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                      <div className="text-center space-y-4 sm:space-y-5">
                        <div className="w-48 sm:w-56 mx-auto bg-white rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-amber-400/30">
                          <img
                            src={upiQrCode}
                            alt="UPI QR Code - Satyam Jain"
                            loading="lazy"
                            decoding="async"
                            width={224}
                            height={224}
                            className="w-full aspect-square object-contain rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="mt-2.5 w-full px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                            title="UPI ID कॉपी करें"
                          >
                            {upiCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-emerald-700 font-bold">कॉपी हो गया!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                                <span className="text-stone-900">satyam5246@upi</span>
                              </>
                            )}
                          </button>
                          <a
                            href="upi://pay?pa=satyam5246@upi&pn=Jain%20Jinvani&cu=INR"
                            className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs font-gotu flex items-center justify-center gap-1.5 shadow-sm border border-red-600/50 transition-all cursor-pointer select-none"
                          >
                            <span>UPI ऐप से सीधे सहयोग करें</span>
                          </a>
                        </div>
                        <p className="donate-modal-desc font-gotu text-xs sm:text-sm leading-relaxed max-w-sm mx-auto font-medium text-slate-200">
                          इस धर्म प्रभावना व जिनवाणी डिजिटलीकरण के पावन कार्य में सहयोग हेतु किसी भी UPI ऐप (GPay, PhonePe, Paytm आदि) से स्कैन करें या UPI ID कॉपी करें।
                        </p>
                        <div className="donate-modal-footer pt-2 border-t border-white/10 text-[11px] font-gotu text-amber-200 font-medium">
                          संपर्क व पावती:{' '}
                          <a
                            href="mailto:thesoftwarecompany@zohomail.in"
                            className="font-mono text-amber-300 hover:underline"
                          >
                            thesoftwarecompany@zohomail.in
                          </a>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Google Form Community Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  );
};
