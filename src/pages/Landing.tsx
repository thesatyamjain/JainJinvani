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
} from 'lucide-react';
import { getJainDate, getFestival, useModalBackHandler } from '../lib';
import { getRecentReads } from '../lib/storage';
import { RecentReadItem } from '../types';
import upiQrCode from '../assets/upi_qr_code_satyam5246.png';

interface LandingProps {
  onNavigate: (page: string, params?: any) => void;
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

  // Close modal on mobile back navigation
  useModalBackHandler(showDonateModal, () => setShowDonateModal(false), 'landing-donate-modal');

  useEffect(() => {
    setRecentReads(getRecentReads());
  }, []);

  const isSpecialParva = todayFestival || todayJain.isParvaTithi;

  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen px-4 sm:px-6 md:px-8 pt-6 sm:pt-10 md:pt-14 pb-28 sm:pb-32 md:pb-36 flex flex-col items-center relative overflow-x-hidden">
      {/* Hero Section Container */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center mb-5 sm:mb-8 relative z-10 max-w-3xl flex flex-col items-center"
      >
        {/* Sacred Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-200 text-xs sm:text-sm font-medium mb-3 sm:mb-4 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.18)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-gotu tracking-wide">जिनेन्द्र भगवान की शाश्वत अमृतवाणी</span>
        </motion.div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 leading-[1.25] sm:leading-[1.2] tracking-normal py-1 mb-2.5 sm:mb-4 drop-shadow-[0_4px_28px_rgba(245,158,11,0.25)] select-none inline-block">
          जैन जिनवाणी
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-base md:text-lg text-slate-200/90 max-w-[55ch] mx-auto leading-relaxed font-gotu px-2 mb-5 sm:mb-7">
          जैन दर्शन, ब्रह्मांड विज्ञान, प्राचीन ग्रंथ एवं नित्य साधना का संपूर्ण डिजिटल ज्ञानकोश।
        </p>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-md sm:max-w-lg mb-4 sm:mb-6">
          <button
            onClick={() => onNavigate('sadhana')}
            className="group relative h-12 sm:h-14 px-4 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 overflow-hidden transition-all duration-200 active:scale-[0.97] shadow-[0_4px_24px_rgba(245,158,11,0.3)] flex items-center justify-center font-gotu text-sm sm:text-base cursor-pointer"
          >
            <span className="truncate">नित्य साधना</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>

          <button
            onClick={() => onNavigate('library')}
            className="group h-12 sm:h-14 px-4 sm:px-7 rounded-xl sm:rounded-2xl font-semibold text-amber-100 bg-slate-900/70 hover:bg-slate-800/80 border border-amber-500/30 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-200 active:scale-[0.97] shadow-[0_4px_24px_rgba(0,0,0,0.4)] font-gotu text-sm sm:text-base flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 shrink-0" />
            <span className="truncate">शास्त्र ग्रंथालय</span>
          </button>
        </div>

        {/* Dynamic Today's Parva & Tithi Auspicious Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-xl mb-3.5 sm:mb-4 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl flex items-center justify-between gap-3 shadow-xl ${
            isSpecialParva
              ? 'bg-gradient-to-r from-amber-500/25 via-slate-900/90 to-amber-500/25 border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
              : 'bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-cyan-500/10 border-white/10 hover:border-amber-400/30'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isSpecialParva
                  ? 'bg-amber-500/25 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
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
          <button
            onClick={() => onNavigate('panchang')}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-gotu font-bold hover:bg-amber-300 transition-colors cursor-pointer shadow-md"
          >
            पंचांग
          </button>
        </motion.div>

        {/* Sacred Mahamantra Banner */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900/85 to-amber-500/15 border border-amber-400/25 backdrop-blur-xl max-w-xl w-full mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          <p className="text-xs sm:text-sm font-gotu text-amber-200/95 text-center tracking-wide leading-relaxed">
            णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं
          </p>
        </div>
      </motion.section>

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
              <button
                key={item.id}
                onClick={() =>
                  onNavigate('viewer', {
                    id: item.id,
                    title: item.title,
                    type: item.type,
                    source: 'landing',
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-amber-500/25 hover:border-amber-400/50 backdrop-blur-xl text-left transition-all shrink-0 cursor-pointer group max-w-[220px]"
              >
                <p className="text-xs font-notoserif font-semibold text-white group-hover:text-amber-200 truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-amber-300/80 font-gotu truncate">
                  पुनः स्वाध्याय करें →
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Essential Spiritual & Scripture Cards (Unified 6 Cards Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl relative z-10">
        {/* 1. Samayik */}
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('samayik')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-blue-500/20 shadow-md"
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
          onClick={() => onNavigate('jap')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-rose-500/20 shadow-md"
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
          onClick={() => onNavigate('niyam')}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-emerald-500/20 shadow-md"
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
          onClick={() =>
            onNavigate('viewer', {
              id: 'bhaktamar-stotra',
              title: 'भक्तामर स्तोत्र (संस्कृत व हिन्दी)',
              type: 'stotra',
              source: 'landing',
            })
          }
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-amber-500/20 shadow-md"
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
          onClick={() => onNavigate('category', { id: 'tirthankar', source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-amber-500/20 shadow-md"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Crown className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-amber-200 truncate">
              २४ तीर्थंकर
            </h4>
            <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-gotu truncate">
              जीवन चरित्र व कल्याणक
            </p>
          </div>
        </GlassCard>

        {/* 6. Sacred Scriptures */}
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
          className="p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-emerald-500/20 shadow-md"
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
      </div>

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
          className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/10 active:scale-[0.99] transition-all group rounded-xl sm:rounded-2xl border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-orange-500/15 shadow-lg"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDonateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg z-10"
            >
              <GlassCard className="p-6 sm:p-8 border-white/20 bg-[#0b162c] shadow-2xl relative overflow-hidden rounded-3xl">
                {/* Glow effect inside modal */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400/30 text-amber-300" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">सहयोग</h2>
                  </div>
                  <button
                    onClick={() => setShowDonateModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-blue-50 relative z-10">
                  <div className="text-center space-y-5">
                    <div className="w-52 sm:w-60 mx-auto bg-white rounded-2xl p-3.5 flex flex-col items-center justify-center shadow-[0_12px_36px_rgba(0,0,0,0.6)] border border-amber-400/30">
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
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
