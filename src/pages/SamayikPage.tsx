import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { HrimSymbol, SwastikaSymbol } from '../components/features/JainSymbols';

interface SamayikPageProps {
  onBack: () => void;
}

export const SamayikPage = ({ onBack }: SamayikPageProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(48 * 60); // 48 minutes in seconds
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(
      'https://ia800302.us.archive.org/10/items/NamokarMantra/Namokar%20Mantra.mp3'
    );
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isAudioPlaying && audioRef.current) {
      audioRef.current.play().catch((e) => console.error('Audio play failed', e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsAudioPlaying(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(48 * 60);
    setIsAudioPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((48 * 60 - timeLeft) / (48 * 60)) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 pb-36 px-4 md:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </button>

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-rozha text-white pt-1.5 pb-0.5 leading-[1.35]">सामायिक समता साधना</h1>
          <p className="text-xs md:text-sm text-slate-400 font-gotu mt-0.5">
            ४८ मिनट राग-द्वेष त्याग व आत्म-चिंतन
          </p>
        </div>

        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
        {/* Timer Section */}
        <div className="lg:col-span-6">
          <GlassCard
            variant="gilded"
            className="p-8 md:p-10 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden h-full"
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
              <HrimSymbol className="w-80 h-80 text-amber-400" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Circular Progress Gauge */}
              <div className="relative w-60 h-60 sm:w-68 sm:h-68 mb-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    className="stroke-white/10"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="44%"
                    className="stroke-amber-400"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 115}
                    strokeDashoffset={2 * Math.PI * 115 * (1 - progress / 100)}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 1s linear',
                      filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.6))',
                    }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-cinzel font-bold mt-2 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                    {isActive ? 'साधना जारी...' : 'अवधि शेष'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-5">
                <button
                  onClick={resetTimer}
                  className="w-13 h-13 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                  title="पुनः सेट करें (Reset)"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleTimer}
                  className={`px-8 py-4 rounded-2xl font-bold font-gotu text-base transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2.5 shadow-xl ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                      : 'bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>विराम दें</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>प्रारंभ करें</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className={`w-13 h-13 rounded-2xl border transition-all flex items-center justify-center ${
                    isAudioPlaying
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="णमोकार महामंत्र ध्वनि"
                >
                  {isAudioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Info & Vows Section */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <GlassCard variant="gilded" className="p-6 sm:p-7 flex-1">
            <h3 className="text-xl font-rozha text-amber-200 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <Timer className="w-5 h-5 text-amber-400" />
              <span>सामायिक प्रतिज्ञा (संकल्प पाठ)</span>
            </h3>
            <div className="space-y-4 text-slate-200 font-gotu leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-2 text-sm">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-100 font-medium">
                करेमि भंते सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि, दुविहं, तिविहेण,
                मणेणं, वायाए, काएणं, न करेमि, न कारवेमि, तस्स भंते पडिक्कमामि, निंदामि, गरिहामि,
                अप्पाणं वोसिरामि।
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>अर्थ:</strong> हे पूज्य भगवन! मैं समभाव रूप सामायिक स्वीकार करता हूँ। जब तक
                मैं इस सामायिक नियम में स्थित हूँ, तब तक मैं मन, वचन और काया से पापकारी प्रवृत्तियों
                का त्याग करता हूँ।
              </p>

              <div className="h-px bg-white/10 my-3" />

              <h4 className="text-amber-200 font-bold text-xs uppercase tracking-wider font-cinzel">
                सामायिक के ३२ दोषों का त्याग
              </h4>
              <p className="text-xs text-slate-400">
                मन के १० दोष (क्रोध, मान, चंचलता आदि), वचन के १० दोष (कठोर वचन, निंदा आदि) तथा काया
                के १२ दोषों (अस्थिर बैठना, अंग-मरोड़ना आदि) से बचकर शांत चित्त से आत्मा का ध्यान
                करें।
              </p>
            </div>
          </GlassCard>

          <GlassCard
            variant="sacred"
            className="p-5 bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-amber-500/15"
          >
            <div className="flex items-center gap-2 text-amber-300 font-bold font-gotu text-sm mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>सामायिक का आध्यात्मिक फल</span>
            </div>
            <p className="text-xs text-slate-300 font-gotu leading-relaxed">
              "सामायिक में जीव सर्व सावद्य योगों का त्याग कर मुनि तुल्य हो जाता है।" — आचार्य समंतभद्र।
              ४८ मिनट की यह समता साधना असंख्य कर्मों की निर्जरा करती है।
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
