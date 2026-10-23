import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Player, PlayerRef } from "@remotion/player";
import { ChevronLeft, Play, Pause, RotateCcw, Sparkles, Film, Download, Check } from "lucide-react";
import { GlassCard } from "../components/layout/GlassCard";
import { LaunchVideo } from "../remotion/LaunchVideo";

interface LaunchVideoPageProps {
  onBack: () => void;
}

const CHAPTERS = [
  { frame: 0, time: "0:00", title: "आमुख (Intro)", icon: "✨" },
  { frame: 150, time: "0:05", title: "१०८ जाप माला", icon: "📿" },
  { frame: 300, time: "0:10", title: "४८ मिनट सामायिक", icon: "⏱️" },
  { frame: 450, time: "0:15", title: "आगम ग्रंथालय", icon: "📚" },
  { frame: 600, time: "0:20", title: "तीर्थंकर व पंचांग", icon: "👑" },
  { frame: 750, time: "0:25", title: "६४ विधान व पूजन", icon: "🌸" },
  { frame: 900, time: "0:30", title: "भव्य लोकार्पण", icon: "🚀" },
];

export const LaunchVideoPage: React.FC<LaunchVideoPageProps> = ({ onBack }) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const seekTo = (frame: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(frame);
    playerRef.current.play();
    setIsPlaying(true);
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText("npx remotion render src/remotion/Root.tsx LaunchVideo out/launch-video.mp4");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 page-bottom-clearance px-4 md:px-6 flex flex-col text-slate-100">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 text-white"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Remotion Cinematic
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-rozha text-white">
              जैन जिनवाणी • आधिकारिक लॉन्च वीडियो
            </h1>
          </div>
        </div>

        <button
          onClick={copyCliCommand}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors text-sm font-gotu"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          <span>{copied ? "कमांड कॉपी हो गई!" : "MP4 रेंडर कमांड"}</span>
        </button>
      </motion.div>

      {/* Main Video Player Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full rounded-3xl overflow-hidden border border-amber-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.2)] bg-[#050a14]"
      >
        <div className="w-full aspect-video">
          <Player
            ref={playerRef}
            component={LaunchVideo}
            durationInFrames={1080}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
      </motion.div>

      {/* Scene Navigation Chapters */}
      <div className="mt-6">
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
          <Film className="w-4 h-4 text-amber-400" />
          <span>वीडियो दृश्य व समय (Scenes & Chapters)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => seekTo(ch.frame)}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 transition-all text-left group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                <span>{ch.time}</span>
                <span className="text-base group-hover:scale-110 transition-transform">{ch.icon}</span>
              </div>
              <div className="text-xs font-gotu font-semibold text-slate-200 group-hover:text-amber-300 line-clamp-1">
                {ch.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details & Specs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              वीडियो तकनीकी विवरण
            </div>
            <div className="text-lg font-bold text-white mb-2">1080p Full HD • 30 FPS</div>
            <p className="text-xs text-slate-400 leading-relaxed font-gotu">
              १९२०x१०८० रेसोल्यूशन, १०८० फ्रेम्स, ३६ सेकंड्स। शुद्ध देवनागरी टाइपोग्राफी, स्प्रिंग
              ट्रांजिशंस, और sacred temple bell ऑडियो।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>इंजन: Remotion v4</span>
            <span className="text-amber-400 font-semibold">स्मूथ स्प्रिंग मोशन</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              प्रदर्शित प्रमुख सुविधाएँ
            </div>
            <div className="text-lg font-bold text-white mb-2">७ विशेष दृश्य क्रम</div>
            <p className="text-xs text-slate-400 leading-relaxed font-gotu">
              आमुख, १०८ जाप माला, ४८ मिनट सामायिक टाइमर, आगम ग्रंथालय, २४ तीर्थंकर चरित्र, ६४
              महामंडल विधान व लोकार्पण आह्वान।
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>अध्याय: ७ दृश्य</span>
            <span className="text-emerald-400 font-semibold">१००% ऑथेंटिक</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              ऑफलाइन वीडियो एक्सपोर्ट
            </div>
            <div className="text-lg font-bold text-white mb-2">CLI MP4 Rendering</div>
            <p className="text-xs text-slate-400 leading-relaxed font-gotu mb-3">
              टर्मिनल से सीधे MP4 एक्सपोर्ट करने हेतु कमांड:
            </p>
            <code className="text-[11px] block p-2 rounded-lg bg-black/50 text-amber-300 font-mono overflow-x-auto border border-white/10">
              npm run video:render
            </code>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>आउटपुट: out/launch-video.mp4</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
