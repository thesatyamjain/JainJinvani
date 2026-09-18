import React, { useState, useEffect, useMemo } from 'react';
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
  X,
  Sliders,
  Target,
  Check,
} from 'lucide-react';
import { LotusSymbol } from '../components/features/JainSymbols';
import { getJapMalaState, saveJapMalaState } from '../lib/storage';
import { JapMalaState } from '../types';
import { useModalBackHandler } from '../lib';
import { requestScreenWakeLock, releaseScreenWakeLock } from '../utils/pwaManager';

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

// Gentle realistic wooden/sandalwood bead click sound on tap using Web Audio API
const playBeadClickSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Natural wood/sandalwood resonant bead transient
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(840, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
};

// Physical Geometry along circular silk thread
const BEAD_RADIUS = 120;
const BEAD_CENTER = 140;

interface TargetPreset {
  count: number;
  label: string;
  tag: string;
}

const TARGET_PRESETS: TargetPreset[] = [
  { count: 7, label: '७', tag: 'जाप' },
  { count: 27, label: '२७', tag: 'सुमरनी' },
  { count: 108, label: '१०८', tag: 'माला' },
];

export const JapMalaPage = ({ onBack }: JapMalaPageProps) => {
  const [stats, setStats] = useState<JapMalaState>(getJapMalaState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputValue, setCustomInputValue] = useState(String(stats.customTarget || 21));
  const [tapEffect, setTapEffect] = useState(false);

  // Close modals on mobile back navigation and hide floating navigation
  useModalBackHandler(showCelebration, () => setShowCelebration(false), 'jap-celebration');
  useModalBackHandler(showCustomModal, () => setShowCustomModal(false), 'jap-custom-modal');

  const targetCount = stats.targetCount || 108;
  const isCustomTarget = !TARGET_PRESETS.some((p) => p.count === targetCount);

  // Number of visual beads placed along the silk cord circle (max 108)
  const visualBeadCount = Math.min(targetCount, 108);

  const beadCoordinates = useMemo(() => {
    return Array.from({ length: visualBeadCount }, (_, i) => {
      // Start from top (-90 deg / 12 o'clock) and proceed clockwise
      const angle = (2 * Math.PI * i) / visualBeadCount - Math.PI / 2;
      return {
        index: i + 1,
        cx: Number((BEAD_CENTER + BEAD_RADIUS * Math.cos(angle)).toFixed(2)),
        cy: Number((BEAD_CENTER + BEAD_RADIUS * Math.sin(angle)).toFixed(2)),
        isQuadrant:
          visualBeadCount === 108
            ? (i + 1) === 27 || (i + 1) === 54 || (i + 1) === 81
            : visualBeadCount === 27
            ? (i + 1) === 9 || (i + 1) === 18
            : false,
        isMeru: (i + 1) === visualBeadCount,
      };
    });
  }, [visualBeadCount]);

  const getBeadRadius = (isMeru: boolean, isQuad: boolean) => {
    if (visualBeadCount <= 7) {
      return isMeru ? 8.5 : 7.0;
    }
    if (visualBeadCount <= 27) {
      return isMeru ? 6.2 : isQuad ? 5.2 : 4.4;
    }
    if (visualBeadCount <= 54) {
      return isMeru ? 5.5 : isQuad ? 4.5 : 3.4;
    }
    return isMeru ? 5.2 : isQuad ? 4.0 : 2.8;
  };

  const activeMantra =
    MANTRAS.find((m) => m.id === stats.selectedMantraId) || MANTRAS[0];

  useEffect(() => {
    saveJapMalaState(stats);
  }, [stats]);

  // Screen Wake Lock: Keep display awake during Mala chanting
  useEffect(() => {
    requestScreenWakeLock();
    return () => {
      releaseScreenWakeLock();
    };
  }, []);

  const handleTap = () => {
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 120);

    const nextBead = stats.currentBead + 1;

    // Haptic feedback for each bead
    if (vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      if (nextBead === targetCount) {
        navigator.vibrate([60, 80, 150]);
      } else {
        navigator.vibrate(18);
      }
    }

    if (nextBead >= targetCount) {
      // Target Complete!
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
      if (soundEnabled) {
        playBeadClickSound();
      }
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

  const handleTargetSelect = (count: number) => {
    if (stats.targetCount === count) return;
    setStats((prev) => ({
      ...prev,
      targetCount: count,
      currentBead: prev.currentBead >= count ? 0 : prev.currentBead,
    }));
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(customInputValue, 10);
    if (isNaN(val) || val <= 0) return;
    const safeVal = Math.min(Math.max(1, val), 100000);
    setStats((prev) => ({
      ...prev,
      targetCount: safeVal,
      customTarget: safeVal,
      currentBead: prev.currentBead >= safeVal ? 0 : prev.currentBead,
    }));
    setShowCustomModal(false);
  };

  // Circular SVG progress math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (stats.currentBead / targetCount) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto pt-6 sm:pt-10 page-bottom-clearance px-4 sm:px-6 flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between gap-4 mb-6 relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={onBack}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-colors backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-amber-200" />
        </motion.button>

        <div className="text-center flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-[11px] font-gotu mb-1">
            <Sparkles className="w-3 h-3" />
            <span>अनादि मूल मंत्र साधना</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-notoserif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-300 truncate">
            {targetCount === 108
              ? '१०८ डिजिटल जाप माला'
              : targetCount === 27
              ? '२७ सुमरनी जाप माला'
              : targetCount === 7
              ? '७ जाप संकल्प'
              : `${targetCount} जाप माला`}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.90 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'ध्वनि चालू' : 'ध्वनि बंद'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.90 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              vibrationEnabled
                ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
            title={vibrationEnabled ? 'कंपन चालू' : 'कंपन बंद'}
          >
            <Smartphone className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Mantra Selector Pills */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {MANTRAS.map((mantra) => {
          const isActive = mantra.id === stats.selectedMantraId;
          return (
            <motion.button
              key={mantra.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => handleMantraSelect(mantra.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap transition-colors border cursor-pointer shrink-0 select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/15 text-amber-200 border-amber-400/40 shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_12px_rgba(245,158,11,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] font-bold'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {mantra.name}
            </motion.button>
          );
        })}
      </div>

      {/* Jap Target Options (7, 27, 108, कस्टम) */}
      <div className="w-full max-w-md mb-5">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-gotu text-amber-300/90 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            जाप लक्ष्य (संकल्प संख्या):
          </span>
          <span className="text-[11px] font-mono text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            लक्ष्य: {targetCount} जाप
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-xl shadow-inner">
          {TARGET_PRESETS.map((preset) => {
            const isActive = targetCount === preset.count;
            return (
              <motion.button
                key={preset.count}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                onClick={() => handleTargetSelect(preset.count)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/15 border-amber-400/50 text-amber-200 shadow-[0_2px_10px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] font-bold'
                    : 'bg-white/[0.03] border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-sm sm:text-base font-bold font-mono leading-tight">
                  {preset.label}
                </span>
                <span
                  className={`text-[10px] font-gotu tracking-tight leading-none mt-0.5 ${
                    isActive ? 'text-amber-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {preset.tag}
                </span>
              </motion.button>
            );
          })}

          {/* Custom Target Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            onClick={() => {
              setCustomInputValue(String(isCustomTarget ? targetCount : stats.customTarget || 21));
              setShowCustomModal(true);
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer border ${
              isCustomTarget
                ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/15 border-amber-400/50 text-amber-200 shadow-[0_2px_10px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] font-bold'
                : 'bg-white/[0.03] border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
            }`}
          >
            <span className="text-sm sm:text-base font-bold font-mono leading-tight truncate max-w-full px-1">
              {isCustomTarget ? targetCount : 'कस्टम'}
            </span>
            <span
              className={`text-[10px] font-gotu tracking-tight leading-none mt-0.5 ${
                isCustomTarget ? 'text-amber-300 font-semibold' : 'text-slate-400'
              }`}
            >
              {isCustomTarget ? 'बदलें ✎' : 'अन्य संख्या'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Stats Counter Card */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full mb-6 max-w-md">
        <GlassCard
          tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'amber' }}
          variant="subtle"
          className="p-3 text-center rounded-xl border-amber-500/20"
        >
          <p className="text-[10px] text-amber-300/80 font-gotu">वर्तमान मणका</p>
          <p className="text-lg sm:text-xl font-bold font-mono text-amber-200">
            {stats.currentBead} <span className="text-xs text-slate-400">/ {targetCount}</span>
          </p>
        </GlassCard>
        <GlassCard
          tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'gold' }}
          variant="subtle"
          className="p-3 text-center rounded-xl border-emerald-500/20"
        >
          <p className="text-[10px] text-emerald-300/80 font-gotu">
            {targetCount === 108 ? 'आज की मालाएं' : 'आज पूर्ण चक्र'}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
            {stats.todayCount}
          </p>
        </GlassCard>
        <GlassCard
          tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'subtle' }}
          variant="subtle"
          className="p-3 text-center rounded-xl border-purple-500/20"
        >
          <p className="text-[10px] text-purple-300/80 font-gotu">
            {targetCount === 108 ? 'कुल पूर्ण मालाएं' : 'कुल पूर्ण चक्र'}
          </p>
          <p className="text-lg sm:text-xl font-bold font-mono text-purple-300">
            {stats.lifetimeCount}
          </p>
        </GlassCard>
      </div>

      {/* Central Interactive Jap Mala Wheel */}
      <div className="relative flex flex-col items-center justify-center my-2 sm:my-4">
        {/* Outer Glowing Ring with SVG Progress & Physical 108 Spherical Beads */}
        <motion.div
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          onClick={handleTap}
          className="relative w-72 h-72 sm:w-84 sm:h-84 rounded-full flex flex-col items-center justify-center cursor-pointer select-none group"
          style={{ touchAction: 'manipulation' }}
        >
          {/* Subtle Ambient Diya Radiance */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.12)_0%,_rgba(217,119,6,0.03)_50%,_transparent_75%)] pointer-events-none" />

          {/* Circular SVG with Physical Spherical 108 Beads */}
          <svg className="w-full h-full transform" viewBox="0 0 280 280">
            <defs>
              {/* Spherical bead gradient: Uncounted Sandalwood */}
              <radialGradient id="beadWood" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#854d0e" />
                <stop offset="45%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </radialGradient>
              {/* Spherical bead gradient: Counted Radiant Gold */}
              <radialGradient id="beadGold" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#92400e" />
              </radialGradient>
              {/* Active Current Bead Luminous Highlight */}
              <radialGradient id="beadActive" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#fef08a" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </radialGradient>
              {/* Sacred Quadrant Spacer Bead (Mani / Carnelian) */}
              <radialGradient id="beadSpacer" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="45%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </radialGradient>
            </defs>

            {/* Sacred Silk Thread Cord */}
            <circle
              cx={BEAD_CENTER}
              cy={BEAD_CENTER}
              r={BEAD_RADIUS}
              className="stroke-amber-900/40"
              strokeWidth="1.5"
              fill="transparent"
            />

            {/* Glowing Golden Silk Progress Track behind beads */}
            <circle
              cx={BEAD_CENTER}
              cy={BEAD_CENTER}
              r={BEAD_RADIUS}
              className="stroke-amber-400/40 transition-all duration-200"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform="rotate(-90 140 140)"
            />

            {/* Dynamic Spherical Beads */}
            {beadCoordinates.map((bead) => {
              let isCounted = false;
              let isCurrent = false;

              if (targetCount <= 108) {
                isCounted = stats.currentBead >= bead.index;
                isCurrent = stats.currentBead === bead.index;
              } else {
                const threshold = Math.round((bead.index * targetCount) / visualBeadCount);
                const prevThreshold = Math.round(((bead.index - 1) * targetCount) / visualBeadCount);
                isCounted = stats.currentBead >= threshold;
                isCurrent = stats.currentBead > prevThreshold && stats.currentBead <= threshold;
              }

              const isMeru = bead.isMeru;
              const isQuad = bead.isQuadrant;

              const fill = isCounted
                ? isCurrent
                  ? 'url(#beadActive)'
                  : 'url(#beadGold)'
                : isQuad
                ? 'url(#beadSpacer)'
                : 'url(#beadWood)';
              const r = getBeadRadius(isMeru, isQuad);

              return (
                <g key={bead.index}>
                  {/* Contact shadow under bead */}
                  <circle
                    cx={bead.cx + 0.5}
                    cy={bead.cy + 0.8}
                    r={r}
                    fill="rgba(0,0,0,0.6)"
                  />
                  {/* The Physical Spherical Bead */}
                  <circle
                    cx={bead.cx}
                    cy={bead.cy}
                    r={r}
                    fill={fill}
                    className="transition-all duration-150"
                  />
                  {/* Current Active Bead Glow Halo */}
                  {isCurrent && (
                    <circle
                      cx={bead.cx}
                      cy={bead.cy}
                      r={r + (visualBeadCount <= 27 ? 4 : 3)}
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.75)"
                      strokeWidth={visualBeadCount <= 27 ? 1.6 : 1.2}
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Sacred Sumeru Mani (Head Bead with Golden Tassel) at Top (140, 20) */}
            <g transform="translate(140, 15)">
              {/* Tassel loop & ring */}
              <circle cx="0" cy="0" r="3.5" fill="none" stroke="#f59e0b" strokeWidth="1" />
              {/* Golden Tassel threads */}
              <path
                d="M -2.5,4 L 0,11 L 2.5,4 Z"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="0.5"
              />
            </g>
          </svg>

          {/* Inner Interactive Touch Pad (Concentric Engraved Bell-Metal Medallion) */}
          <div className="absolute inset-6 sm:inset-7 rounded-full bg-gradient-to-b from-[#141c2e]/95 via-[#0b111e]/95 to-[#060a14]/98 border border-amber-500/35 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center shadow-[0_16px_44px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(254,240,138,0.25),inset_0_0_20px_rgba(245,158,11,0.06)] group-hover:border-amber-400/50 transition-all">
            {/* Concentric etched decorative rings for authentic medallion feel */}
            <div className="absolute inset-2 sm:inset-2.5 rounded-full border border-amber-500/20 border-dashed pointer-events-none" />
            <div className="absolute inset-4 rounded-full border border-amber-500/10 pointer-events-none" />

            <LotusSymbol className="w-8 h-8 text-amber-400/80 mb-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
            <span className="text-4xl sm:text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {stats.currentBead}
            </span>
            <span className="text-[11px] font-gotu text-amber-300/80 uppercase tracking-widest mt-1">
              / {targetCount} जाप
            </span>
            <span className="text-[10px] text-slate-300/90 font-gotu mt-1 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-400/20">
              टैप कर गिनें
            </span>
          </div>
        </motion.div>
      </div>

      {/* Active Mantra Banner & Meaning */}
      <GlassCard
        variant="gilded"
        className="w-full p-4 sm:p-5 text-center mb-4 rounded-2xl border-amber-500/30"
      >
        <p className="text-base sm:text-lg font-notoserif font-bold text-amber-100 leading-relaxed">
          {activeMantra.text}
        </p>
        <p className="text-xs sm:text-sm font-gotu text-slate-300/90 mt-2 max-w-xl mx-auto leading-relaxed">
          {activeMantra.bhavarth}
        </p>
      </GlassCard>

      {/* Reset Current Count Button */}
      {stats.currentBead > 0 && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={handleResetCurrent}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-amber-200 hover:border-amber-400/40 text-xs font-gotu transition-colors cursor-pointer select-none"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>इस जाप को पुनः प्रारम्भ से गिनें</span>
        </motion.button>
      )}

      {/* Custom Target Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900/95 border border-amber-400/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_36px_rgba(245,158,11,0.15)] relative"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCustomModal(false)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 z-10"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Sliders className="w-6 h-6" />
              </div>

              <h3 className="text-lg sm:text-xl font-notoserif font-bold text-amber-100 mb-1">
                कस्टम जाप संकल्प
              </h3>
              <p className="text-xs font-gotu text-slate-300 mb-4">
                अपनी सुविधानुसार कोई भी जाप संख्या निर्धारित करें:
              </p>

              {/* Quick select chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
                {[9, 21, 51, 216, 1008].map((presetVal) => (
                  <button
                    key={presetVal}
                    type="button"
                    onClick={() => setCustomInputValue(String(presetVal))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                      customInputValue === String(presetVal)
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/30'
                    }`}
                  >
                    {presetVal}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    autoFocus
                    className="w-full py-3 px-4 rounded-xl bg-slate-950/80 border-2 border-amber-500/40 text-center font-mono text-2xl font-bold text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 shadow-inner"
                    placeholder="संख्या लिखें (उदा. 21)"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-gotu text-slate-400 pointer-events-none">
                    जाप
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-gotu border border-white/10 transition-colors cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-gotu font-bold shadow-[0_2px_12px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
                  >
                    स्वीकार करें
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Completion Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900/95 border border-amber-400/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-md w-full max-h-[min(90vh,620px)] flex flex-col text-center shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_36px_rgba(245,158,11,0.15)] relative overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCelebration(false)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 z-10"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 py-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-amber-300 shadow-[0_4px_16px_rgba(0,0,0,0.4),0_0_16px_rgba(245,158,11,0.2)]">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <h3 className="text-xl sm:text-2xl font-notoserif font-bold text-amber-200 mb-2 leading-snug">
                  {targetCount === 108 ? 'माला पूर्ण हुई!' : 'जाप संकल्प पूर्ण हुआ!'}
                </h3>
                <p className="text-xs sm:text-sm font-gotu text-slate-200 leading-relaxed mb-5">
                  {targetCount} बार <span className="text-amber-300 font-semibold">{activeMantra.name}</span> का
                  पावन जाप सफलतापूर्वक पूर्ण हुआ।
                </p>

                <div className="grid grid-cols-2 gap-3 mb-2 bg-slate-950/60 p-3 rounded-2xl border border-white/5">
                  <div>
                    <p className="text-[11px] text-slate-400 font-gotu">
                      {targetCount === 108 ? 'आज की कुल मालाएं' : 'आज के पूर्ण चक्र'}
                    </p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-amber-300">{stats.todayCount}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-gotu">
                      {targetCount === 108 ? 'जीवनपर्यंत मालाएं' : 'जीवनपर्यंत चक्र'}
                    </p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-purple-300">
                      {stats.lifetimeCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setShowCelebration(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-gotu font-bold text-sm shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer select-none"
                >
                  अगला जाप प्रारम्भ करें
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
