import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Sparkles,
  Flame,
  Award,
  BookOpen,
  Heart,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { getDailyNiyamaState, toggleNiyamaItem } from '../lib/storage';
import { DailyNiyamaState, NiyamaItem } from '../types';

interface NiyamaPageProps {
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

const NIYAMAS: (NiyamaItem & { icon: any; color: string })[] = [
  {
    id: 'darshan',
    title: 'नित्य जिनेंद्र देवदर्शन',
    description: 'प्रातः काल जिनालय जाकर वीतराग प्रभु के दर्शन, स्तुति व अष्टद्रव्य पूजन।',
    category: 'daily',
    icon: Sun,
    color: 'text-amber-400',
  },
  {
    id: 'ratri-bhojan',
    title: 'रात्रि भोजन त्याग',
    description: 'सूर्यास्त के पश्चात् अन्न, फल व जल का सर्वथा परित्याग (अहिंसा व्रत)।',
    category: 'dietary',
    icon: Moon,
    color: 'text-indigo-400',
  },
  {
    id: 'samayik',
    title: '४८ मिनट सामायिक साधना',
    description: 'राग-द्वेष रहित होकर समता भाव से आत्म-चिंतन एवं ध्यान।',
    category: 'sadhana',
    icon: ShieldCheck,
    color: 'text-blue-400',
  },
  {
    id: 'swadhyay',
    title: 'नित्य जिनवाणी स्वाध्याय',
    description: 'समयसार, तत्त्वार्थ सूत्र अथवा आचार्यों द्वारा रचित ग्रंथों का वाचन व मनन।',
    category: 'daily',
    icon: BookOpen,
    color: 'text-emerald-400',
  },
  {
    id: 'jap',
    title: 'णमोकार महामंत्र जाप',
    description: 'प्रतिदिन एकाग्र चित्त से न्यूनतम ३ माला (३२४ बार) मंत्र जाप।',
    category: 'sadhana',
    icon: Flame,
    color: 'text-rose-400',
  },
  {
    id: 'prasook-jal',
    title: 'शुद्ध प्रासुक (छना हुआ) जल',
    description: 'जीव-रक्षा हेतु दोहरे वस्त्र से मर्यादित एवं प्रासुक किए गए जल का सेवन।',
    category: 'dietary',
    icon: Sparkles,
    color: 'text-cyan-400',
  },
  {
    id: 'vrat',
    title: 'नवकारसी / एकासन / उपवास',
    description: 'इंद्रिय दमन एवं संयम वृद्धि हेतु रस-परित्याग अथवा उपवास साधना।',
    category: 'vow',
    icon: Award,
    color: 'text-purple-400',
  },
  {
    id: 'daya',
    title: 'सर्व जीव दया व क्षमा भावना',
    description: 'समस्त प्राणियों के प्रति मैत्री भाव एवं किसी भी जीव को कष्ट न पहुँचाना।',
    category: 'vow',
    icon: Heart,
    color: 'text-pink-400',
  },
];

export const NiyamaPage = ({ onBack, onNavigate }: NiyamaPageProps) => {
  const [state, setState] = useState<DailyNiyamaState>(getDailyNiyamaState());
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const completedCount = state.completedIds.length;
  const totalCount = NIYAMAS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (id: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    const updated = toggleNiyamaItem(id);
    setState(updated);

    if (updated.completedIds.length === totalCount) {
      setShowAllCompleted(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 sm:pt-10 pb-36 px-4 sm:px-6 flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between gap-4 mb-6 relative z-10">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-amber-200" />
        </button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-[11px] font-gotu mb-1">
            <Sparkles className="w-3 h-3" />
            <span>श्रावक धर्म एवं व्रत साधना</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-300 truncate">
            दैनिक नियम व व्रत ट्रैकर
          </h1>
        </div>

        <div className="w-11 h-11" />
      </div>

      {/* Streak & Today's Progress Card */}
      <GlassCard
        variant="gilded"
        className="p-5 sm:p-6 w-full max-w-2xl rounded-2xl sm:rounded-3xl mb-6 border-amber-500/30 relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-300 font-gotu font-semibold">साधना निरंतरता (Streak)</p>
              <h3 className="text-lg sm:text-xl font-bold font-notoserif text-white">
                {state.streak} दिन की निरंतर साधना
              </h3>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400 font-gotu">आज की प्रगति</p>
            <p className="text-lg sm:text-xl font-bold font-mono text-amber-300">
              {completedCount} <span className="text-xs text-slate-400">/ {totalCount}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </GlassCard>

      {/* Checklist of Niyamas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mb-8">
        {NIYAMAS.map((item) => {
          const isDone = state.completedIds.includes(item.id);
          const Icon = item.icon;

          return (
            <GlassCard
              key={item.id}
              variant={isDone ? 'gilded' : 'subtle'}
              onClick={() => handleToggle(item.id)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer rounded-2xl transition-all duration-200 active:scale-[0.98] border ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {/* Checkbox Icon */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  <h4
                    className={`text-sm sm:text-base font-notoserif font-bold transition-colors ${
                      isDone ? 'text-emerald-200 line-through decoration-emerald-400/50' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                  {item.description}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Shravak Dharma Guidance Card */}
      <GlassCard
        variant="subtle"
        className="p-5 sm:p-6 w-full max-w-2xl rounded-2xl border-amber-500/20 text-center"
      >
        <h4 className="text-sm sm:text-base font-notoserif font-bold text-amber-200 mb-2">
          आचार्य समंतभद्र कृत 'रत्नकरण्ड श्रावकाचार'
        </h4>
        <p className="text-xs sm:text-sm text-slate-300/85 font-gotu leading-relaxed mb-4">
          "सम्यग्दर्शन-शुद्धः संसारी भवति भव्य-जन-पूज्यः।" — सम्यग्दर्शन, सम्यग्ज्ञान एवं सम्यक् चारित्र
          ही मोक्ष का सच्चा मार्ग है। नित्य छोटे-छोटे नियमों का पालन आत्मा को निर्मल बनाता है।
        </p>

        {onNavigate && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('jap')}
              className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-gotu hover:bg-amber-500/25 transition-all cursor-pointer"
            >
              १०८ जाप माला प्रारम्भ करें
            </button>
            <button
              onClick={() => onNavigate('samayik')}
              className="px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-gotu hover:bg-blue-500/25 transition-all cursor-pointer"
            >
              सामायिक साधना
            </button>
          </div>
        )}
      </GlassCard>

      {/* All Completed Modal */}
      <AnimatePresence>
        {showAllCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-900 border border-emerald-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto mb-4 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-notoserif font-bold text-emerald-200 mb-2">
                अनुमोदना! समस्त नियम पूर्ण
              </h3>
              <p className="text-sm font-gotu text-slate-200 leading-relaxed mb-6">
                आज के सभी ८ पावन श्रावक नियमों का पालन पूर्ण हुआ। आपकी इस धर्म साधना की बारंबार
                अनुमोदना!
              </p>

              <button
                onClick={() => setShowAllCompleted(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-gotu font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                जय जिनेन्द्र
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
