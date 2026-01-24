import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Timer } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { HrimSymbol, SwastikaSymbol } from '../components/JainSymbols';

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
    audioRef.current = new Audio('https://ia800302.us.archive.org/10/items/NamokarMantra/Namokar%20Mantra.mp3'); // Public domain/archive link
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
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
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
    <div className="w-full max-w-4xl mx-auto pt-24 pb-32 px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
        >
          <ArrowLeft className="w-6 h-6 text-blue-100 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <h1 className="text-3xl font-rozha text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-300">
          सामायिक साधना
        </h1>
        
        <div className="w-12" /> {/* Spacer */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Timer Section */}
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <SwastikaSymbol className="absolute top-4 left-4 w-24 h-24 text-amber-500" />
            <SwastikaSymbol className="absolute bottom-4 right-4 w-24 h-24 text-amber-500" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Circular Progress */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  className="stroke-white/5"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  className="stroke-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <HrimSymbol className="w-16 h-16 text-amber-200/20 mb-2 absolute" />
                <span className="text-6xl font-mono font-bold text-white tracking-wider relative z-10">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-amber-200/60 font-gotu mt-2">शेष समय</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                title="Reset"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button
                onClick={toggleTimer}
                className={`p-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50' 
                    : 'bg-white text-slate-900'
                }`}
              >
                {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className={`p-4 rounded-full transition-all ${
                  isAudioPlaying 
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50' 
                    : 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white'
                }`}
                title="Toggle Mantra"
              >
                {isAudioPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Info & Vows Section */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 flex-1">
            <h3 className="text-xl font-rozha text-amber-200 mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5" />
              सामायिक प्रतिज्ञा
            </h3>
            <div className="space-y-4 text-blue-100/80 font-gotu leading-relaxed h-[300px] overflow-y-auto custom-scrollbar pr-2">
              <p>
                <strong>करेमि भंते सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि, दुविहं, तिविहेण, मणेणं, वायाए, काएणं, न करेमि, न कारवेमि, तस्स भंते पडिक्कमामि, निंदामि, गरिहामि, अप्पाणं वोसिरामि।</strong>
              </p>
              <div className="h-px bg-white/10 my-4" />
              <p className="text-sm">
                हे भगवन! मैं समभाव (सामायिक) को स्वीकार करता हूँ। जब तक मैं इस नियम में स्थित हूँ, तब तक मैं पाप सहित (सावद्य) मन, वचन और काया के योग का त्याग करता हूँ।
              </p>
              <p className="text-sm">
                मैं न स्वयं पाप करूँगा, न दूसरों से कराऊँगा। हे भगवन! मैं अपने पापों का प्रतिक्रमण करता हूँ, निंदा करता हूँ, गर्हा करता हूँ और अपनी आत्मा का त्याग (पाप कर्मों से) करता हूँ।
              </p>
              <div className="h-px bg-white/10 my-4" />
              <h4 className="text-amber-100 font-bold mb-2">सामायिक के अतिचार (३२ दोष)</h4>
              <p className="text-sm">
                मन के १०, वचन के १० और काया के १२ दोषों से बचना चाहिए। मन की चंचलता, दुर्वचन बोलना, और आसनादि की अस्थिरता से बचें।
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-amber-500/10 border-amber-500/20">
            <h3 className="text-lg font-bold text-amber-200 mb-2 font-gotu">साधना का महत्व</h3>
            <p className="text-sm text-amber-100/70 leading-relaxed">
              सामायिक समता भाव की साधना है। ४८ मिनट तक राग-द्वेष से रहित होकर आत्म-चिंतन करना ही सच्ची सामायिक है। इससे कर्मों की निर्जरा होती है।
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
