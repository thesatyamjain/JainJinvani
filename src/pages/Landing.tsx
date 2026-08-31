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
    <div className="w-full max-w-6xl mx-auto pt-3 sm:pt-6 md:pt-8 pb-36 px-3.5 sm:px-6 flex flex-col items-center relative overflow-x-hidden">
      {/* Hero Section Container */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center mb-6 sm:mb-10 relative z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Sacred Pill Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-200 text-[11px] sm:text-xs font-medium mb-3 sm:mb-4 backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.15)]"
        >
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="font-gotu tracking-wide">जिनेन्द्र भगवान की शाश्वत अमृतवाणी</span>
        </motion.div>

        {/* Grand Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-amber-100 to-amber-300 leading-[1.25] sm:leading-[1.25] tracking-normal pt-1 pb-1 sm:pt-2 sm:pb-2 mb-2 sm:mb-3 drop-shadow-[0_2px_20px_rgba(245,158,11,0.22)] select-none">
          जैन जिनवाणी
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-slate-200/90 max-w-[55ch] mx-auto leading-relaxed font-gotu px-2 mb-5 sm:mb-7">
          जैन दर्शन, ब्रह्मांड विज्ञान, प्राचीन ग्रंथ एवं नित्य साधना का संपूर्ण डिजिटल ज्ञानकोश।
        </p>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full max-w-sm sm:max-w-md mb-4 sm:mb-6">
          <button
            onClick={() => onNavigate('sadhana')}
            className="group relative h-11 sm:h-13 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 overflow-hidden transition-all duration-200 active:scale-[0.97] shadow-[0_4px_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5 sm:gap-2 font-gotu text-xs sm:text-sm md:text-base cursor-pointer"
          >
            <LotusSymbol className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950/80 shrink-0" />
            <span className="truncate">नित्य साधना</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>

          <button
            onClick={() => onNavigate('library')}
            className="group h-11 sm:h-13 px-3 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-amber-100 bg-slate-900/70 hover:bg-slate-800/80 border border-amber-500/30 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-200 active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.4)] font-gotu text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="truncate">शास्त्र ग्रंथालय</span>
          </button>
        </div>

        {/* Sacred Mahamantra Banner */}
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-amber-500/10 border border-amber-400/20 backdrop-blur-xl max-w-xl w-full mx-auto shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
          <p className="text-[11px] sm:text-xs md:text-sm font-gotu text-amber-200/90 text-center tracking-wide leading-snug">
            णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं
          </p>
        </div>
      </motion.section>

      {/* Quick Spiritual Jumps Row (4 Essential Tools) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full relative z-10 mb-6 sm:mb-8">
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
          onClick={() => onNavigate('category', { id: 'stotra', source: 'landing' })}
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

      {/* Primary 3 Pillars Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 w-full relative z-10 mb-8 sm:mb-10">
        {/* Card 1: 24 Tirthankaras */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          onClick={() => onNavigate('category', { id: 'tirthankar', source: 'landing' })}
          className="h-full"
        >
          <GlassCard
            variant="gilded"
            className="p-5 sm:p-6 md:p-7 h-full flex flex-col justify-between cursor-pointer group hover:-translate-y-1 active:scale-[0.99] duration-200 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Crown className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 rounded-full font-bold">
                  २४ जिनेंद्र
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors mb-1.5">
                २४ तीर्थंकर
              </h3>
              <p className="text-slate-300/85 leading-relaxed font-gotu text-xs sm:text-sm">
                भगवान ऋषभदेव से लेकर भगवान महावीर स्वामी तक के २४ तीर्थंकरों का पावन जीवन चरित्र व कल्याणक।
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300/90 font-gotu font-semibold">
              <span>दर्शन एवं स्तुति</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 2: Jain Cosmology */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          onClick={() => onNavigate('category', { id: 'bhugol', source: 'landing' })}
          className="h-full"
        >
          <GlassCard
            variant="cosmic"
            className="p-5 sm:p-6 md:p-7 h-full flex flex-col justify-between cursor-pointer group hover:-translate-y-1 active:scale-[0.99] duration-200 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300">
                  <Globe2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-blue-300 bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 rounded-full font-bold">
                  त्रिलोक रचना
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-notoserif font-bold text-white group-hover:text-blue-200 transition-colors mb-1.5">
                जैन भूगोल
              </h3>
              <p className="text-slate-300/85 leading-relaxed font-gotu text-xs sm:text-sm">
                तीन लोक (ऊर्ध्व, मध्य, अधो लोक), जम्बूद्वीप, नंदीश्वर द्वीप और अकृत्रिम चैत्यालयों का विस्तृत विवरण।
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-300/90 font-gotu font-semibold">
              <span>मानचित्र व भूगोल</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 3: Sacred Scriptures */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
          className="h-full"
        >
          <GlassCard
            variant="gilded"
            className="p-5 sm:p-6 md:p-7 h-full flex flex-col justify-between cursor-pointer group hover:-translate-y-1 active:scale-[0.99] duration-200 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <Scroll className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full font-bold">
                  द्वादशांग वाणी
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-notoserif font-bold text-white group-hover:text-emerald-200 transition-colors mb-1.5">
                जिनवाणी शास्त्र
              </h3>
              <p className="text-slate-300/85 leading-relaxed font-gotu text-xs sm:text-sm">
                समयसार, तत्त्वार्थ सूत्र, षट्खंडागम, द्रव्यसंग्रह एवं आचार्यों द्वारा रचित ग्रंथों का स्वाध्याय।
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-300/90 font-gotu font-semibold">
              <span>मूल शास्त्र स्वाध्याय</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </GlassCard>
        </motion.div>
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