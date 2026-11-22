import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Timer, Sparkles, BookOpen, Heart, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';
import { HrimSymbol, SwastikaSymbol } from '../components/features/JainSymbols';
import { getMediaUrl } from '../config/media';
import { setupMediaSession, updateMediaPlaybackState, clearMediaSession, triggerHaptic } from '../utils/pwaManager';

interface SamayikPageProps {
  onBack: () => void;
}

export const SamayikPage = ({ onBack }: SamayikPageProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(48 * 60); // 48 minutes in seconds
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'sankalpa' | 'iryavahi' | 'parana'>('sankalpa');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(getMediaUrl('NAMOKAR_MANTRA'));
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      clearMediaSession();
    };
  }, []);

  useEffect(() => {
    if (isAudioPlaying && audioRef.current) {
      audioRef.current.play().catch((e) => console.error('Audio play failed', e));
      setupMediaSession({
        title: 'णमोकार महामंत्र धुन',
        artist: 'जैन जिनवाणी • सामायिक साधना',
        album: 'आत्म-शुद्धि एवं समता साधना',
        onPlay: () => setIsAudioPlaying(true),
        onPause: () => setIsAudioPlaying(false),
      });
      updateMediaPlaybackState('playing');
    } else if (audioRef.current) {
      audioRef.current.pause();
      updateMediaPlaybackState('paused');
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
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 page-bottom-clearance px-4 md:px-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6 sm:mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-amber-500/25 border border-white/20 hover:border-amber-400/50 transition-colors flex items-center justify-center group cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-100 group-hover:text-amber-200" />
        </motion.button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-gotu mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>४८ मिनट समता साधना</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-notoserif font-extrabold text-white pt-1 pb-0.5 leading-[1.3] drop-shadow-md">
            सामायिक समता साधना
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-gotu mt-0.5 font-medium">
            राग-द्वेष त्याग, कायोत्सर्ग एवं शुद्ध आत्म-चिंतन
          </p>
        </div>

        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full">
        {/* Timer Section */}
        <div className="lg:col-span-6">
          <GlassCard
            variant="gilded"
            className="p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden h-full border-amber-500/35 bg-gradient-to-b from-slate-900/95 via-amber-950/20 to-black/90 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-2xl sm:rounded-3xl"
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
              <HrimSymbol className="w-80 h-80 text-amber-400" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Circular Progress Gauge */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    className="text-amber-500/20"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    className="text-amber-400 transition-all duration-1000 ease-linear drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]"
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="samayik-timer-text text-5xl sm:text-6xl font-notoserif font-black text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                    {formatTime(timeLeft)}
                  </span>
                  <span
                    className={`samayik-status-pill text-xs font-gotu font-bold uppercase tracking-wider mt-2.5 px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 animate-pulse'
                        : 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {isActive ? 'साधना प्रगति पर' : 'विश्राम अवस्था'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 sm:gap-5">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={resetTimer}
                  className="samayik-control-btn w-13 h-13 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 hover:border-amber-400/40 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                  title="पुनः सेट करें (Reset 48 min)"
                >
                  <RotateCcw className="w-5 h-5 text-slate-200" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={toggleTimer}
                  className={`samayik-play-btn px-8 py-4 rounded-2xl font-gotu text-base flex items-center gap-2.5 shadow-xl cursor-pointer select-none transition-all ${
                    isActive
                      ? 'bg-amber-500/25 text-amber-100 border-2 border-amber-400 shadow-[0_4px_24px_rgba(245,158,11,0.35)] font-bold'
                      : 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 border border-amber-300 shadow-[0_4px_28px_rgba(245,158,11,0.45)] font-black'
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
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.90 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className={`samayik-control-btn w-13 h-13 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer shadow-md ${
                    isAudioPlaying
                      ? 'bg-amber-500/25 border-2 border-amber-400 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                      : 'bg-slate-900/90 border border-white/20 text-slate-300 hover:text-white hover:border-amber-400/40'
                  }`}
                  title="णमोकार महामंत्र धुन"
                >
                  {isAudioPlaying ? <Volume2 className="w-5 h-5 text-amber-300" /> : <VolumeX className="w-5 h-5 text-slate-300" />}
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Info, Vows & Reflections Section */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-6 flex-1 border-amber-500/30 rounded-2xl sm:rounded-3xl"
          >
            {/* Step Tabs Navigation */}
            <div className="samayik-tabs-container grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 p-1 rounded-xl bg-slate-950/70 border border-white/10">
              <button
                onClick={() => setActiveTab('sankalpa')}
                className={`samayik-tab-btn py-2 px-2 rounded-lg text-xs font-gotu font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'sankalpa'
                    ? 'samayik-tab-active bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                १. संकल्प पाठ
              </button>
              <button
                onClick={() => setActiveTab('iryavahi')}
                className={`samayik-tab-btn py-2 px-2 rounded-lg text-xs font-gotu font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'iryavahi'
                    ? 'samayik-tab-active bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                २. ईर्यावही सूत्र
              </button>
              <button
                onClick={() => setActiveTab('parana')}
                className={`samayik-tab-btn py-2 px-2 rounded-lg text-xs font-gotu font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'parana'
                    ? 'samayik-tab-active bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                ३. पारणा व क्षमा
              </button>
            </div>

            {/* Tab 1: संकल्प पाठ */}
            {activeTab === 'sankalpa' && (
              <div className="space-y-4 text-slate-200 font-gotu leading-relaxed max-h-[340px] overflow-y-auto custom-scrollbar pr-2 text-sm">
                <div className="flex items-center gap-2 text-amber-200 font-bold border-b border-white/10 pb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>सामायिक प्रतिज्ञा (प्रारंभिक संकल्प)</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-100 font-medium leading-relaxed font-notoserif text-sm sm:text-base">
                  करेमि भंते सामाइयं, सावज्जं जोगं पच्चक्खामि, जाव नियमं पज्जुवासामि, दुविहं, तिविहेण,
                  मणेणं, वायाए, काएणं, न करेमि, न कारवेमि, तस्स भंते पडिक्कमामि, निंदामि, गरिहामि,
                  अप्पाणं वोसिरामि।
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-gotu">
                  <strong className="text-amber-300">अर्थ:</strong> हे पूज्य भगवन! मैं समभाव रूप सामायिक स्वीकार करता हूँ। जब तक
                  मैं इस सामायिक नियम में स्थित हूँ, तब तक मैं मन, वचन और काया से सर्व पापकारी प्रवृत्तियों (सावद्य योगों)
                  का त्याग करता हूँ।
                </p>

                <div className="h-px bg-white/10 my-2" />

                <h4 className="text-amber-200 font-bold text-xs uppercase tracking-wider font-cinzel">
                  सामायिक के ३२ दोषों का परित्याग
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  <strong>मन के १० दोष:</strong> क्रोध, मान, माया, लोभ, भय, शोक आदि से रहित होना।<br />
                  <strong>वचन के १० दोष:</strong> कठोर, असत्य, पर-निंदा, बकवाद आदि से मौन रहना।<br />
                  <strong>काया के १२ दोष:</strong> अंग मरोड़ना, चंचलता, आलस्य त्यागकर स्थिर पद्मासन अथवा सुखासन में बैठना।
                </p>
              </div>
            )}

            {/* Tab 2: ईर्यावही सूत्र */}
            {activeTab === 'iryavahi' && (
              <div className="space-y-4 text-slate-200 font-gotu leading-relaxed max-h-[340px] overflow-y-auto custom-scrollbar pr-2 text-sm">
                <div className="flex items-center gap-2 text-amber-200 font-bold border-b border-white/10 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>ईर्यावही सूत्र (गमनागमन दोष विशुद्धि)</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-100 font-medium leading-relaxed font-notoserif text-sm sm:text-base">
                  इच्छामि पडिक्कमिउं इरियावहियाए, विराहणाए, गमणागमणे।<br />
                  पाणाक्कवणे, बीयाक्कवणे, हरियाक्कवणे, ओसा-उत्तिंग-पणग-दगमट्टी-मक्कड़ा-संताणा-संक्रमणे।<br />
                  जे मे जीवा विराहिया—एगिंदिया, बेइंदिया, तेइंदिया, चउरिंदिया, पंचिंदिया, अभिहया, वत्तिया, लेसिया, संघाइया, संघट्टिया, परियाविया, किलामिया, ठाणाओ ठाणं संकामिया, जीवियाओ ववरोविया, तस्स मिच्छा मि दुक्कडं॥
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-gotu">
                  <strong className="text-amber-300">अर्थ:</strong> हे पूज्य भगवन्! मार्ग में आते-जाते समय गमनागमन में मेरे द्वारा यदि पृथ्वीकाय, जलकाय, अग्निकाय, वायुकाय, वनस्पतिकाय एवं त्रस जीवों की कोई भी विराधना हुई हो, पैर के नीचे दबने से उन्हें पीड़ा पहुँची हो—मेरा वह सब दुष्कृत्य मिथ्या (निष्फल) होवे।
                </p>

                <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-100 text-xs font-gotu">
                  💡 <strong>तस्स उत्तरी व कायोत्सर्ग:</strong> दोषों की शुद्धि और आत्म-विशुद्धि हेतु नौ बार णमोकार मंत्र का मौन कायोत्सर्ग ध्यान करें।
                </div>
              </div>
            )}

            {/* Tab 3: पारणा व क्षमापना */}
            {activeTab === 'parana' && (
              <div className="space-y-4 text-slate-200 font-gotu leading-relaxed max-h-[340px] overflow-y-auto custom-scrollbar pr-2 text-sm">
                <div className="flex items-center gap-2 text-amber-200 font-bold border-b border-white/10 pb-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>सामायिक पारणा (समापन संकल्प एवं क्षमापना)</span>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-100 font-medium leading-relaxed font-notoserif text-sm sm:text-base">
                  सामायिक-व्रतं पूर्णं, कायोत्सर्ग-समन्वितम्।<br />
                  सर्व-दोष-विशुद्ध्यर्थं, जिन-धर्म-परायणः॥<br />
                  खामेमि सव्वे जीवा, सव्वे जीवा खमंतु मे।<br />
                  मित्ती मे सव्व-भूएसु, वेरं मज्झं न केणवि॥
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-gotu">
                  <strong className="text-amber-300">समापन चिंतन:</strong> मेरी ४८ मिनट की यह समता सामायिक साधना पूर्ण हुई। मन, वचन और काय से संसार के समस्त प्राणियों से बारंबार क्षमा याचना—सब जीव मुझे क्षमा करें, मेरी सबके प्रति मैत्री है, किसी से भी वैर नहीं है। मिच्छामि दुक्कडम्!
                </p>

                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-100 text-xs font-gotu leading-relaxed">
                  🌸 <strong>आत्म-चिंतन:</strong> "मैं शुद्ध, बुद्ध, एक, ज्ञानानंद स्वभावी अविनाशी आत्मा हूँ। देह भिन्न है, आत्मा भिन्न है।"
                </div>
              </div>
            )}
          </GlassCard>

          {/* Spiritual Fruit Card */}
          <GlassCard
            tilt={{ maxTilt: 6, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="sacred"
            className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-amber-500/20 border-amber-400/30"
          >
            <div className="flex items-center gap-2 text-amber-200 font-bold font-gotu text-sm mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>सामायिक का आध्यात्मिक फल</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-gotu leading-relaxed">
              "सामायिक में जीव सर्व सावद्य योगों का त्याग कर मुनि तुल्य हो जाता है।" — आचार्य समंतभद्र।
              ४८ मिनट की यह समता साधना असंख्य कर्मों की निर्जरा करती है।
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
