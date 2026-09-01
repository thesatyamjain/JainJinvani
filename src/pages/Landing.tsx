import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Calendar,
  Timer,
  Feather,
  ChevronRight,
  Compass,
  Crown,
  Globe2,
  Scroll,
} from 'lucide-react';
import { LotusSymbol, JainPrateekSymbol } from '../components/features/JainSymbols';
import { getJainDate } from '../lib';

interface LandingProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Landing = ({ onNavigate }: LandingProps) => {
  const todayJain = getJainDate(new Date());

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 sm:pt-10 md:pt-14 lg:pt-16 pb-36 px-4 sm:px-6 md:px-8 flex flex-col items-center relative overflow-x-hidden">
      {/* Hero Section Container */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center mb-10 sm:mb-14 md:mb-16 relative z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Sacred Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.18)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-gotu tracking-wide">जिनेन्द्र भगवान की शाश्वत अमृतवाणी</span>
        </motion.div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 leading-[1.35] sm:leading-[1.35] tracking-normal pt-3 pb-2 sm:pt-6 sm:pb-4 mb-3 sm:mb-5 drop-shadow-[0_4px_28px_rgba(245,158,11,0.25)] select-none inline-block">
          जैन जिनवाणी
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-[58ch] mx-auto leading-relaxed font-gotu px-3 mb-6 sm:mb-9 pt-1">
          जैन दर्शन, ब्रह्मांड विज्ञान, प्राचीन ग्रंथ एवं नित्य साधना का संपूर्ण डिजिटल ज्ञानकोश।
        </p>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-md sm:max-w-lg mb-6 sm:mb-8">
          <button
            onClick={() => onNavigate('sadhana')}
            className="group relative h-12 sm:h-14 px-4 sm:px-7 rounded-xl sm:rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 overflow-hidden transition-all duration-200 active:scale-[0.97] shadow-[0_4px_24px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 sm:gap-2.5 font-gotu text-sm sm:text-base cursor-pointer"
          >
            <LotusSymbol className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-950/80 shrink-0" />
            <span className="truncate">नित्य साधना</span>
            <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
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

        {/* Sacred Mahamantra Banner */}
        <div className="p-3.5 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900/85 to-amber-500/15 border border-amber-400/25 backdrop-blur-xl max-w-2xl w-full mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          <p className="text-xs sm:text-sm md:text-base font-gotu text-amber-200/95 text-center tracking-wide leading-relaxed">
            णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं
          </p>
        </div>
      </motion.section>

      {/* Quick Spiritual Jumps Row (4 Essential Tools) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4.5 w-full relative z-10 mb-8 sm:mb-12">
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('panchang')}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-amber-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-amber-200 truncate">
              पंचांग
            </h4>
            <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-gotu truncate">
              {todayJain.jainMonth} {todayJain.pakshaLabel} {todayJain.tithiLabel}
            </p>
          </div>
        </GlassCard>

        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('samayik')}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-blue-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
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
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-rose-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 border border-rose-500/30">
            <Feather className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-rose-200 truncate">
              भक्तामर स्तोत्र
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              ४८ काव्य अर्थ सहित
            </p>
          </div>
        </GlassCard>

        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('explore')}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-purple-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-purple-200 truncate">
              अन्वेषण
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              तीर्थ, दर्शन व दीर्घा
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Secondary 3 Pillar Cards (Matching Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4.5 w-full relative z-10 mb-8 sm:mb-12">
        {/* Card 1: 24 Tirthankaras */}
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('category', { id: 'tirthankar', source: 'landing' })}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-amber-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
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

        {/* Card 2: Jain Cosmology */}
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('category', { id: 'bhugol', source: 'landing' })}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-cyan-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/30">
            <Globe2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-notoserif font-bold text-white group-hover:text-cyan-200 truncate">
              जैन भूगोल
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-gotu truncate">
              तीन लोक व जम्बूद्वीप
            </p>
          </div>
        </GlassCard>

        {/* Card 3: Sacred Scriptures */}
        <GlassCard
          variant="subtle"
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
          className="p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:bg-white/10 active:scale-[0.98] transition-all group rounded-xl sm:rounded-2xl border-emerald-500/20"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Scroll className="w-4 h-4 sm:w-5 sm:h-5" />
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

      {/* Footer Attribution */}
      <div className="mt-8 mb-4 text-center text-xs text-slate-400/90 font-gotu border-t border-white/5 pt-6 relative z-10 w-full">
        <p>
          Built by{' '}
          <a
            href="https://thesoftwareco.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors font-medium"
          >
            The Software Co
          </a>{' '}
          and Satyam Jain
        </p>
      </div>
    </div>
  );
};