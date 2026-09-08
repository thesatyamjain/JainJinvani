import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Smartphone,
  Award,
} from 'lucide-react';
import { LotusSymbol } from '../components/features/JainSymbols';
import { getJapMalaState, saveJapMalaState } from '../lib/storage';
import { JapMalaState } from '../types';

interface JapMalaPageProps {
  onBack: () => void;
}

interface MantraDef {
  id: string;
  name: string;
  shortName: string;
  text: string;
  bhavarth: string;
}

const MANTRAS: MantraDef[] = [
  {
    id: 'namokar',
    name: 'णमोकार महामंत्र',
    shortName: 'णमोकार',
    text: 'णमो अरिहंताणं • णमो सिद्धाणं • णमो आयरियाणं • णमो उवज्झायाणं • णमो लोए सव्व साहूणं',
    bhavarth: 'पंच परमेष्ठी (अरिहंत, सिद्ध, आचार्य, उपाध्याय व सर्व साधु) को मेरा त्रिकाल नमस्कार हो।',
  },
  {
    id: 'bhaktamar-riddhi',
    name: 'भक्तामर ऋद्धि मंत्र',
    shortName: 'ऋद्धि मंत्र',
    text: 'ॐ ह्रीं श्रीं क्लीं ब्लूं अर्हं नमः सर्व-शांति-कराय नमः स्वाहा',
    bhavarth: 'समस्त विघ्नों, रोगों और भय का निवारण करने वाला सर्व-कल्याणकारी ऋद्धि मंत्र।',
  },
  {
    id: 'siddha',
    name: 'सिद्ध पद मंत्र',
    shortName: 'सिद्ध मंत्र',
    text: 'ॐ नमः सिद्धेभ्यः • श्री सिद्धपरमेष्ठीभ्यो नमः',
    bhavarth: 'आठों कर्मों से मुक्त अशरीरी, अनंत सुख स्वरूप सिद्ध भगवान को नमस्कार।',
  },
  {
    id: 'shantinath',
    name: 'शांतिनाथ शांति मंत्र',
    shortName: 'शांति मंत्र',
    text: 'ॐ ह्रीं श्रीं क्लीं ऐं श्री शांतिनाथाय नमः सर्व शांतिं कुरु कुरु स्वाहा',
    bhavarth: '१६वें तीर्थंकर भगवान शांतिनाथ से जगत व आत्म-शांति की पावन प्रार्थना।',
  },
  {
    id: 'aparajit',
    name: 'अपराजित मंत्र',
    shortName: 'अपराजित',
    text: 'ॐ ह्रीं णमो अरिहंताणं • सर्व शत्रु पराजयाय स्वाहा',
    bhavarth: 'आंतरिक राग-द्वेष और बाह्य संकटों पर विजय प्राप्त करने वाला अचूक मंत्र।',
  },
];

// Play gentle synthesized temple bell chime using Web Audio API
const playTempleChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playHarmonic = (freq: number, gainVal: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    };

    // Fundamental + harmonics for rich Tibetan/Jain bronze bowl bell sound
    playHarmonic(587.33, 0.35, 2.5); // D5
    playHarmonic(880.0, 0.25, 2.0);  // A5
    playHarmonic(1174.66, 0.15, 1.8); // D6
  } catch (e) {
    console.error('Audio chime error:', e);
  }
};

export const JapMalaPage = ({ onBack }: JapMalaPageProps) => {
  const [stats, setStats] = useState<JapMalaState>(getJapMalaState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [tapEffect, setTapEffect] = useState(false);

  const activeMantra =
    MANTRAS.find((m) => m.id === stats.selectedMantraId) || MANTRAS[0];

  useEffect(() => {
    saveJapMalaState(stats);
  }, [stats]);

  const handleTap = () => {
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 120);

    const nextBead = stats.currentBead + 1;

    // Haptic feedback for each bead
    if (vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      if (nextBead === 108) {
        navigator.vibrate([60, 80, 150]);
      } else {
        navigator.vibrate(18);
      }
    }

    if (nextBead >= 108) {
      // Mala Complete!
      if (soundEnabled) {
        playTempleChime();
      }
      const updated: JapMalaState = {
        ...stats,
        currentBead: 0,
        todayCount: stats.todayCount + 1,
        lifetimeCount: stats.lifetimeCount + 1,
      };
      setStats(updated);
      setShowCelebration(true);
    } else {
      setStats((prev) => ({
        ...prev,
        currentBead: nextBead,
      }));
    }
  };

  const handleResetCurrent = () => {
    setStats((prev) => ({
      ...prev,
      currentBead: 0,
    }));
  };

  const handleMantraSelect = (id: string) => {
    setStats((prev) => ({
      ...prev,
      selectedMantraId: id,
    }));
  };

  // Circular SVG progress math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (stats.currentBead / 108) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 sm:pt-10 pb-24 sm:pb-28 px-4 sm:px-6 flex flex-col items-center select-none">
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
            <span>अनादि मूल मंत्र साधना</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-300 truncate">
            १०८ डिजिटल जाप माला
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'ध्वनि चालू' : 'ध्वनि बंद'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              vibrationEnabled
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={vibrationEnabled ? 'कंपन चालू' : 'कंपन बंद'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mantra Selector Pills */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {MANTRAS.map((mantra) => {
          const isActive = mantra.id === stats.selectedMantraId;
          return (
            <button
              key={mantra.id}
              onClick={() => handleMantraSelect(mantra.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 text-amber-200 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-bold'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {mantra.name}
            </button>
          );
        })}
      </div>

      {/* Stats Counter Card */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full mb-6 max-w-md">
        <GlassCard variant="subtle" className="p-3 text-center rounded-xl border-amber-500/20">
          <p className="text-[10px] text-amber-300/80 font-gotu">वर्तमान मणका</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-200">
            {stats.currentBead} <span className="text-xs text-slate-400">/ १०८</span>
          </p>
        </GlassCard>
        <GlassCard variant="subtle" className="p-3 text-center rounded-xl border-emerald-500/20">
          <p className="text-[10px] text-emerald-300/80 font-gotu">आज की मालाएं</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
            {stats.todayCount}
          </p>
        </GlassCard>
        <GlassCard variant="subtle" className="p-3 text-center rounded-xl border-purple-500/20">
          <p className="text-[10px] text-purple-300/80 font-gotu">कुल पूर्ण मालाएं</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-purple-300">
            {stats.lifetimeCount}
          </p>
        </GlassCard>
      </div>

      {/* Central Interactive Jap Mala Wheel */}
      <div className="relative flex flex-col items-center justify-center my-2 sm:my-4">
        {/* Outer Glowing Ring with SVG Progress */}
        <div
          onClick={handleTap}
          className={`relative w-72 h-72 sm:w-84 sm:h-84 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 duration-100 ${
            tapEffect ? 'scale-[0.97]' : 'scale-100'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-900/20 blur-2xl pointer-events-none" />

          {/* Circular SVG */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-slate-800/80"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-amber-400 transition-all duration-200"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))',
              }}
            />
          </svg>

          {/* Inner Interactive Touch Pad */}
          <div className="absolute inset-5 rounded-full bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-slate-900/95 border border-amber-500/30 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center shadow-[inset_0_2px_20px_rgba(245,158,11,0.15)]">
            <LotusSymbol className="w-8 h-8 text-amber-400/70 mb-1" />
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400">
              {stats.currentBead}
            </span>
            <span className="text-[11px] text-amber-300/80 font-gotu mt-0.5">
              स्पर्श करें • जाप आगे बढ़ाएं
            </span>
          </div>
        </div>
      </div>

      {/* Active Mantra Display Box */}
      <GlassCard
        variant="gilded"
        className="p-4 sm:p-5 w-full max-w-xl text-center rounded-2xl my-5 border-amber-500/25"
      >
        <p className="text-sm sm:text-base md:text-lg font-notoserif font-bold text-amber-200/95 leading-relaxed mb-2">
          {activeMantra.text}
        </p>
        <p className="text-xs sm:text-sm text-slate-300/80 font-gotu leading-relaxed">
          {activeMantra.bhavarth}
        </p>
      </GlassCard>

      {/* Reset Current Count Button */}
      {stats.currentBead > 0 && (
        <button
          onClick={handleResetCurrent}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-amber-200 hover:border-amber-400/40 text-xs font-gotu transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>इस माला को पुनः प्रारम्भ से गिनें</span>
        </button>
      )}

      {/* Mala Completion Modal */}
      <AnimatePresence>
        {showCelebration && (
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
              className="bg-slate-900 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <Award className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-notoserif font-bold text-amber-200 mb-2">
                माला पूर्ण हुई!
              </h3>
              <p className="text-sm font-gotu text-slate-200 leading-relaxed mb-6">
                १०८ बार <span className="text-amber-300 font-semibold">{activeMantra.name}</span> का
                पावन जाप सफलतापूर्वक पूर्ण हुआ।
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[11px] text-slate-400 font-gotu">आज की कुल मालाएं</p>
                  <p className="text-xl font-bold font-mono text-amber-300">{stats.todayCount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-gotu">जीवनपर्यंत मालाएं</p>
                  <p className="text-xl font-bold font-mono text-purple-300">
                    {stats.lifetimeCount}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-gotu font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                अगली माला प्रारम्भ करें
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
