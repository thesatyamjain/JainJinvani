import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { AutoScrollIcon } from '../components/layout/Dock';
import {
  ArrowLeft,
  Sparkles,
  Droplets,
  Flower2,
  Flame,
  BookOpen,
} from 'lucide-react';

interface DailyPujaFlowProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

type RitualStage = 'all' | 'abhishek' | 'puja';

export const DailyPujaFlow = ({ onBack, onNavigate }: DailyPujaFlowProps) => {
  const [activeStage, setActiveStage] = useState<RitualStage>('all');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed] = useState<number>(1.2);

  const scrollRafRef = useRef<number | null>(null);

  // Section Refs for Quick Jumping
  const abhishekRef = useRef<HTMLDivElement>(null);
  const shantidharaRef = useRef<HTMLDivElement>(null);
  const gandhodakRef = useRef<HTMLDivElement>(null);
  const pithikaRef = useRef<HTMLDivElement>(null);
  const pratigyaRef = useRef<HTMLDivElement>(null);
  const swastiRef = useRef<HTMLDivElement>(null);
  const parmarshiRef = useRef<HTMLDivElement>(null);
  const devPujaRef = useRef<HTMLDivElement>(null);
  const arghyavaliRef = useRef<HTMLDivElement>(null);
  const aartiRef = useRef<HTMLDivElement>(null);

  // Smooth Auto-scroll Engine
  useEffect(() => {
    if (!isAutoScrolling) {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const step = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      const pixelsToScroll = scrollSpeed * 28 * delta;
      const mainEl = document.querySelector('main');
      if (mainEl && mainEl.scrollHeight > mainEl.clientHeight) {
        mainEl.scrollBy({ top: pixelsToScroll, behavior: 'instant' });
        if (mainEl.scrollTop + mainEl.clientHeight >= mainEl.scrollHeight - 10) {
          setIsAutoScrolling(false);
          return;
        }
      } else {
        window.scrollBy({ top: pixelsToScroll, behavior: 'instant' });
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
          setIsAutoScrolling(false);
          return;
        }
      }

      scrollRafRef.current = requestAnimationFrame(step);
    };

    scrollRafRef.current = requestAnimationFrame(step);

    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-14 md:pt-16 page-bottom-clearance px-3.5 sm:px-6">
      {/* Top Floating Control Bar (Font size, Auto-scroll, Quick jump) */}
      <div className="sticky top-14 z-30 mb-6 py-2 px-3 sm:px-4 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
        <motion.button
          whileTap={{ scale: 0.90 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-gotu text-amber-300 hover:text-amber-200 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">वापस</span>
        </motion.button>

        {/* Quick Stepper Jump Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px] sm:text-xs font-gotu">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(abhishekRef)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            अभिषेक
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(shantidharaRef)}
            className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            शांतिधारा
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(gandhodakRef)}
            className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            गंधोदक
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(pithikaRef)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            पूजा पीठिका
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(pratigyaRef)}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            प्रतिज्ञा पाठ
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(swastiRef)}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            स्वस्ति पाठ
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(parmarshiRef)}
            className="px-2.5 py-1 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            परमर्षि पाठ
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(devPujaRef)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            पूजन
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(arghyavaliRef)}
            className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            अर्घ्य
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => scrollToSection(aartiRef)}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 whitespace-nowrap cursor-pointer transition-colors"
          >
            आरती
          </motion.button>
        </div>

        {/* Reader Tools (Font & Scroll) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setFontSize((f) => Math.max(14, f - 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            title="फ़ॉन्ट छोटा करें"
          >
            A-
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setFontSize((f) => Math.min(28, f + 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            title="फ़ॉन्ट बड़ा करें"
          >
            A+
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-gotu font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isAutoScrolling
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
            }`}
            title="ऑटो-स्क्रॉल (हाथ व्यस्त होने पर स्वतः स्क्रॉल)"
          >
            <AutoScrollIcon isScrolling={isAutoScrolling} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">{isAutoScrolling ? 'रोकें' : 'स्क्रॉल'}</span>
          </motion.button>
        </div>
      </div>

      {/* Main Title Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-[#030712] relative overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.7)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs mb-2.5 font-gotu">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>दैनिक नित्य मंदिर एवं स्वाध्याय आराधना</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-notoserif font-bold text-white mb-2 leading-tight">
            नित्य अभिषेक एवं देव-शास्त्र-गुरु पूजन
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/90 font-gotu leading-relaxed max-w-2xl">
            प्रतिदिन मंदिर जी एवं गृह चैत्यालय में की जाने वाली संपूर्ण साधना: मंगलाचरण, अभिषेक पाठ, वृहद् शांतिधारा, गंधोदक, देव-शास्त्र-गुरु पूजा, अर्घ्यावली एवं मंगल आरती — बिना बार-बार पेज बदले एक ही अखंड प्रवाह में।
          </p>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-2 mt-5 p-1 rounded-2xl bg-black/40 border border-white/10 max-w-lg">
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => setActiveStage('all')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold cursor-pointer text-center transition-colors ${
                activeStage === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              संपूर्ण नित्य क्रम
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => setActiveStage('abhishek')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold cursor-pointer text-center transition-colors ${
                activeStage === 'abhishek'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              अभिषेक व शांतिधारा
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => setActiveStage('puja')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold cursor-pointer text-center transition-colors ${
                activeStage === 'puja'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              देव-शास्त्र-गुरु पूजन
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 1. अभिषेक मंगलाचरण एवं चार कलश अभिषेक पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'abhishek') && (
        <div ref={abhishekRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-cinzel">
                Stage 1 • Nitya Abhishek
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                १. श्री जिनेन्द्र अभिषेक विधि एवं कलश मंत्र
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            {/* पवित्रता व संकल्प */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 font-gotu">
              <div className="text-xs font-bold text-amber-300 mb-1">॥ पवित्रता मंत्र ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="text-amber-100 font-notoserif leading-relaxed">
                अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा।<br />
                यः स्मरेत्परमात्मानं स बाह्याभ्यंतरः शुचिः॥
              </p>
              <p className="text-xs text-slate-400 mt-2">
                (अर्थ: आत्मा को पवित्र करने वाले परमात्मा का स्मरण करते ही समस्त बाह्य व आभ्यंतर अपवित्रता नष्ट होकर शुद्धि होती है।)
              </p>
            </div>

            {/* मंगलाचरण */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-gotu mb-2">
                ॥ अभिषेक मंगलाचरणम् ॥
              </div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-white leading-relaxed space-y-3">
                <p>
                  श्रीमत्-परम-गम्भीर-स्याद्वादामोघ-शासनम्।<br />
                  जीयात् त्रैलोक्य-नाथस्य शासनं जिन-शासनम्॥१॥
                </p>
                <p>
                  श्रीमज्जिनेन्द्र-वदनारविन्द-निर्गतामृत-धारया।<br />
                  संस्नापयामि परमेश्वर-पाद-पद्मं सर्व-विघ्न-विनाशाय॥२॥
                </p>
              </div>
            </div>

            {/* चार कलश अभिषेक पाठ (माघनन्दिकृत) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">॥ प्रथम कलशः (क्षीरोदक धाराभिषेक) ॥</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  क्षीरोदक-समं तोयं कनक-कलश-संस्थितम्।<br />
                  गृहीत्वा स्नापयेद् देवं जन्म-मृत्यु-निवारकम्॥
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्रीं क्लीं ऐं अर्हं श्री जिनेन्द्राय नमः। प्रथम-क्षीरोदक-धाराभिषेकं करोमि स्वाहा॥
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">॥ द्वितीय कलशः (गन्धोदक धाराभिषेक) ॥</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  चन्दनागरु-कर्पूर-मिश्रितं गन्ध-वारिणा।<br />
                  अभिषिञ्चामि देवेशं संसार-ताप-शान्तये॥
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्रीं क्लीं ऐं अर्हं श्री जिनेन्द्राय नमः। द्वितीय-गन्धोदक-धाराभिषेकं करोमि स्वाहा॥
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">॥ तृतीय कलशः (सर्वौषधि धाराभिषेक) ॥</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  सर्वौषधि-समायुक्तं पावनं तीर्थ-वारिणा।<br />
                  स्नापयामि जगन्नाथं सर्व-व्याधि-प्रणाशनम्॥
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्रीं क्लीं ऐं अर्हं श्री जिनेन्द्राय नमः। तृतीय-सर्वौषधि-धाराभिषेकं करोमि स्वाहा॥
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">॥ चतुर्थ कलशः (महाभिषेक व सर्वशांति मंत्र) ॥</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  कनक-कलश-सहस्रैः स्नापितस्य जिनेशस्य।<br />
                  पादोदकं पवित्रं सर्व-पाप-प्रणाशनम्॥
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्रीं क्लीं ऐं अर्हं श्री वृषभादि-महावीर-पर्यन्त-चतुर्विंशति-तीर्थंकरेभ्यो नमः। सर्व शान्तिं तुष्टिं पुष्टिं च कुरु कुरु स्वाहा॥
                </div>
              </div>
            </div>

            {/* अभिषेक प्रतिज्ञा व मंत्र */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-gotu">
                ॥ अभिषेक प्रतिज्ञा व संकल्प ॥
              </div>
              <p style={{ fontSize: `${fontSize - 1}px` }} className="font-gotu text-slate-300 leading-relaxed">
                अद्येह जम्बूद्वीपे भरतक्षेत्रे आर्यखण्डे जिनेन्द्रदेवस्य पावन-चरण-कमले आत्म-विशुद्धये कर्म-क्षयार्थं च अभिषेक-कर्म करोम्यहम्।
              </p>
            </div>

            {/* कलश मंत्र */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-gotu">
                ॥ मुख्य कलश अभिषेक महामंत्र ॥
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-sm sm:text-base font-bold text-center leading-relaxed">
                ॐ ह्रीं श्रीं क्लीं ऐं अर्हं वं मं हं सं तं पं झं झ्वीं क्ष्वीं हं सः।<br />
                श्री जिनेन्द्राय नमः अभिषेकं करोमि स्वाहा॥
              </div>
            </div>

            {/* प्रासुक जल समर्पण */}
            <div className="pt-2 border-t border-white/10 text-xs text-slate-400 font-gotu">
              <p>
                💡 दोनों हाथों में कलश लेकर जिनेन्द्र प्रभु की प्रतिमा के मस्तक पर धार बांधते हुए <strong>"ॐ ह्रीं अर्हं नमः"</strong> का निरंतर उच्चारण करें।
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. वृहद् शांतिधारा पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'abhishek') && (
        <div ref={shantidharaRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 font-cinzel">
                Stage 2 • Shantidhara
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                २. वृहद् शांतिधारा पाठ (सकल वांग्मय शांति मंत्र)
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="sacred"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            <div className="text-xs text-blue-300/90 font-gotu bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
              💡 झारी से अखंड जलधारा जिनेन्द्र प्रभु के मस्तक पर अर्पित करते हुए एकाग्र चित्त से इस परम मांगलिक शांतिधारा का पाठ करें।
            </div>

            <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-4">
              <p className="font-bold text-amber-300">
                ॐ नमोऽर्हते भगवते श्रीमते प्रक्षीणदोषकल्मषाय दिव्यतेजोमूर्तये नमः श्रीशांतिनाथाय शांतिकराय सर्वविघ्नप्रणाशनाय सर्वदुष्टारिष्टनिवारणाय सर्वराजभय-चोरभय-अग्निशमन-सर्पदंश-ग्रहपीड़ा-व्याधिविध्वंसनाय सर्वोपद्रवविनाशनाय।
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 font-mono text-sm sm:text-base font-bold">
                ॐ ह्रीं श्रीं क्लीं ऐं अर्हं नमः। सकल शांतिं कुरु कुरु स्वाहा॥
              </div>

              <p className="text-slate-200">
                तुष्टिं कुरु कुरु स्वाहा। पुष्टिं कुरु कुरु स्वाहा। समृद्धिं कुरु कुरु स्वाहा। शांतिं कुरु कुरु स्वाहा।<br />
                कल्याणं कुरु कुरु स्वाहा। आरोग्यं कुरु कुरु स्वाहा। सुखं कुरु कुरु स्वाहा।
              </p>

              <p className="text-slate-200">
                सर्वजन-मनोरथ-पूरणाय, सर्वधर्माभिवृद्धिकराय, देश-राष्ट्र-नगर-ग्राम-सर्वप्राणिनां शांतिं कुरु कुरु स्वाहा।
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-gotu text-amber-100 italic">
                उपसर्गाः क्षयं यान्ति, छिद्यन्ते सर्वविघ्नयः।<br />
                मनः प्रसन्नतामेति, पूज्यमाने जिनेश्वरे॥
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. गंधोदक ग्रहण विधि व मंत्र */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'abhishek') && (
        <div ref={gandhodakRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-cinzel">
                Stage 3 • Gandhodak Dhaaran
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ३. गंधोदक ग्रहण विधि एवं महिमा
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-4"
          >
            <p className="text-xs sm:text-sm text-slate-300 font-gotu">
              अनामिका व मध्यमा उंगली से थोड़ा सा गंधोदक लेकर मस्तक, दोनों नेत्र, कंठ और हृदय पर धारण करें:
            </p>

            <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-400/30 text-center">
              <div className="text-xs font-bold text-teal-300 font-gotu mb-1">॥ गंधोदक धारण श्लोक ॥</div>
              <p style={{ fontSize: `${fontSize + 1}px` }} className="font-notoserif text-white font-bold leading-relaxed">
                निर्मलं निर्मली-कर्तृ पावनं पापनाशनम्।<br />
                जिनेन्द्र-पाद-संभूतं गन्धोदकं शिरसा वहामि॥
              </p>
              <p className="text-xs text-teal-200/80 font-gotu mt-2">
                (यह निर्मल, आत्मा को निर्मल करने वाला, अति पवित्र और समस्त अष्टकर्मों का नाशक है।)
              </p>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. पूजा पीठिका एवं सामान्य अर्घ्यावली (विद्यापूजाञ्जलि) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={pithikaRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-cinzel">
                Stage 4 • Puja Pithika & Samanya Arghyavali
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ४. पूजा पीठिका एवं सामान्य अर्घ्यावली
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            {/* मंगलाचरण (कविवर नाथूराम जी) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-2">॥ मंगलाचरण (कविवर नाथूराम जी) ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed mb-2">
                मंगल सरस्वती मात का, मंगल जिनवर धर्म।<br />
                मंगलमय मंगलकरो, हरो असाता कर्म॥२६॥<br />
                या विधि मंगल से सदा जग में मंगल होत।<br />
                मंगल 'नाथूराम' यह भव सागर दृढ़ पोत॥२७॥
              </p>
              <div className="text-xs text-amber-300 font-gotu italic">॥ पुष्पांजलिं क्षिपेत् ॥</div>
            </div>

            {/* अर्हत्-पूजा-प्रतिज्ञा एवं कायोत्सर्ग */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-amber-400 font-gotu">॥ अर्हत्-पूजा-प्रतिज्ञा एवं कायोत्सर्ग ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed font-semibold">
                अथ अर्हत्-पूजा-प्रतिज्ञायां पूर्वाचार्यानुक्रमेण सकलकर्मक्षयार्थं भावपूजावंदनास्तव-समेतं पञ्चमहागुरुभक्ति-कायोत्सर्गं करोम्यहम्।
              </p>
              <p className="text-xs text-amber-300 font-gotu">
                (पूजा की प्रतिज्ञा करते हुए नौ बार णमोकार मंत्र का विधिपूर्वक ध्यान करें)
              </p>
            </div>

            {/* पूजा पीठिका */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-400 font-gotu">॥ पूजा पीठिका ॥</div>
              <p style={{ fontSize: `${fontSize + 1}px` }} className="font-notoserif text-white font-bold leading-relaxed">
                ॐ जय जय जय नमोऽस्तु नमोऽस्तु नमोऽस्तु<br />
                णमो अरिहंताणं, णमो सिद्धाणं, णमो आइरियाणं।<br />
                णमो उवज्झायाणं, णमो लोए सव्वसाहूणं॥
              </p>
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं अनादिमूलमंत्रेभ्यो नमः पुष्पाञ्जलिं क्षिपेत्।
              </div>
            </div>

            {/* चत्तारि मंगल पाठ */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-400 font-gotu">॥ चत्तारि मंगल पाठ ॥</div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-2">
                <p>
                  चत्तारि मंगलं, अरिहंता मंगलं, सिद्धा मंगलं, साहू मंगलं, केवलि पण्णत्तो धम्मो मंगलं।
                </p>
                <p>
                  चत्तारि लोगुत्तमा, अरिहंता लोगुत्तमा, सिद्धा लोगुत्तमा, साहू लोगुत्तमा, केवलिपण्णत्तो धम्मो लोगुत्तमो।
                </p>
                <p>
                  चत्तारि सरणं पव्वज्जामि, अरहंते सरणं पव्वज्जामि, सिद्धे सरणं पव्वज्जामि, साहू सरणं पव्वज्जामि, केवलि पण्णत्तं धम्मं सरणं पव्वज्जामि।
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                ॐ नमोऽर्हते स्वाहा पुष्पाञ्जलिं क्षिपेत्।
              </div>
            </div>

            {/* पवित्रकरण एवं मंगलाष्टक (श्लोक १ से ७, अर्थ सहित) */}
            <div className="space-y-4 pt-2">
              <div className="text-sm font-bold text-amber-300 font-gotu">॥ पवित्रकरण एवं मंगलाष्टक (अर्थ सहित) ॥</div>

              {/* १ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">१. पाप प्रमुक्ति श्लोक</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  अपवित्रः पवित्रो वा, सुस्थितो दुःस्थितोऽपि वा।<br />
                  ध्यायतेत्पंच-नमस्कारं, सर्वपापैः प्रमुच्यते॥१॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> जो मनुष्य पवित्र या अपवित्र यहाँ तक कि सुस्थित या दुःस्थित भी पाँच नमस्कार मन्त्र का ध्यान करता है वह सब पापों से छूट जाता है॥१॥
                </p>
              </div>

              {/* २ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">२. बाह्याभ्यंतर शुद्धि श्लोक</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  अपवित्रः पवित्रो वा, सर्वावस्थां गतोऽपि वा।<br />
                  यः स्मरेत्परमात्मानं, स बाह्याभ्यंतरे शुचिः॥२॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> जो मनुष्य पवित्र या अपवित्र सब अवस्थाओं में स्थित होकर परमात्मा का स्मरण करता है वह भीतर और बाहर सर्वत्र पवित्र है॥२॥
                </p>
              </div>

              {/* ३ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">३. अपराजित मन्त्र महिमा</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  अपराजित मंत्रोऽयं, सर्व-विघ्न-विनाशनः।<br />
                  मङ्गलेषु च सर्वेषु, प्रथमं मङ्गलं मतः॥३॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> यह पंच नमस्कार मन्त्र अजेय है, सब विघ्नों का विनाश करनेवाला है और सब मंगलों में पहला मंगल है॥३॥
                </p>
              </div>

              {/* ४ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">४. प्राकृत मंगलाष्टक पद</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  एसो पंच - णमोयारो, सव्व-पावप्पणासणो।<br />
                  मंगलाणं च सव्वेसिं, पढमं होई मंगलं॥४॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> यह पंच नमस्कार मन्त्र सब पापों का नाश करनेवाला और सब मंगलों में पहला मंगल है॥४॥
                </p>
              </div>

              {/* ५ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">५. अर्हम् बीजाक्षर वंदना</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  अर्ह-मित्यक्षरं ब्रह्म, - वाचकं परमेष्ठिनः।<br />
                  सिद्धचक्रस्य सद्बीजं, सर्वतः प्रणमाम्यहम्॥५॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> 'अर्हम्' ये अक्षर परब्रह्म परमेष्ठी के वाचक हैं और सिद्ध समूह के सुन्दर बीजाक्षर हैं। मैं इनको मन, वचन, काय से नमस्कार करता हूँ॥५॥
                </p>
              </div>

              {/* ६ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-amber-400 font-gotu">६. सिद्धचक्र नमस्कार</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  कर्माष्टक-विनिर्मुक्तं, मोक्ष-लक्ष्मी-निकेतनं।<br />
                  सम्यक्त्वादि-गुणोपेतं, सिद्धचक्रं नमाम्यहम्॥६॥
                </p>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> आठों कर्मों से रहित, मुक्तिरूपी लक्ष्मी के मन्दिर और सम्यक्त्वादि आठ गुणों से युक्त सिद्ध-समूह को मैं नमस्कार करता हूँ॥६॥
                </p>
              </div>

              {/* ७ */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-amber-400 font-gotu">७. विघ्न-विनाशक श्लोक</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  विघ्नौघाः प्रलयं यान्ति, शाकिनी-भूत-पन्नगाः।<br />
                  विषं निर्विषतां याति, स्तूयमाने जिनेश्वरे॥७॥
                </p>
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs font-bold">
                  ॥ पुष्पाञ्जलिं क्षिपेत् ॥
                </div>
                <p className="text-xs text-slate-300 font-gotu pt-1 border-t border-white/10">
                  <span className="text-amber-300 font-semibold">अर्थ:</span> भगवान् जिनेन्द्र की स्तुति करने पर विघ्नसमूह नष्ट हो जाते हैं, शाकिनी, भूत और पन्नगों का भय नहीं रहता तथा विष निर्विष हो जाता है॥७॥
                </p>
              </div>
            </div>

            {/* सामान्य अर्घ्यावली */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="text-sm font-bold text-amber-300 font-gotu">॥ सामान्य अर्घ्यावली ॥</div>

              {/* १. पंचकल्याणक अर्घ्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">१. पंचकल्याणक अर्घ्य</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  उदक-चन्दन-तन्दुल-पुष्पकैश्च, चरू-सुदीप-सुधूप-फलार्घ्यकैः।<br />
                  धवल-मङ्गल-गान-रवाकुले, जिनगृहे कल्याणमहं यजे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं भगवतो गर्भजन्मतपज्ञाननिर्वाणपञ्चकल्याणकेभ्यो अर्घ्यं निर्वपामीति स्वाहा।
                </div>
              </div>

              {/* २. पंचपरमेष्ठी अर्घ्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">२. पंचपरमेष्ठी का अर्घ्य</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  उदक-चन्दन-तन्दुल-पुष्पकैश्च, चरू-सुदीप-सुधूप-फलार्घ्यकैः।<br />
                  धवल-मङ्गल-गान-रवाकुले, जिनगृहे जिननाथमहं यजे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री अर्हत्-सिद्धाचार्योपाध्याय-सर्वसाधु पंचपरमेष्ठीभ्योऽर्घ्यं निर्वपामीति स्वाहा।
                </div>
              </div>

              {/* ३. जिनसहस्रनाम अर्घ्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">३. जिनसहस्रनाम अर्घ्य</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  उदक-चन्दन-तन्दुल-पुष्पकैश्च, चरू-सुदीप-सुधूप-फलार्घ्यकैः।<br />
                  धवल-मङ्गल-गान रवाकुले, जिनगृहे जिननाम यजामहे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री भगवज्जिन अष्टोत्तरसहस्रनामेभ्योऽर्घ्यं निर्वपामीति स्वाहा।
                </div>
              </div>

              {/* ४. जिनवाणी का अर्घ्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">४. जिनवाणी का अर्घ्य</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  उदक-चन्दन-तन्दुल-पुष्पकैश्च, चरू-सुदीप-सुधूप-फलार्घ्यकैः।<br />
                  धवल-मङ्गल-गान-रवाकुले, जिनगृहे जिनसूत्रमहं यजे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं सम्यग्दर्शनज्ञानचारित्राणि तत्त्वार्थसूत्रदशाध्याय अर्घ्य निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ५. गुरु अर्घ्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">५. गुरु अर्घ्य</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  उदक-चन्दन-तन्दुल-पुष्पकैश्च, चरू-सुदीप-सुधूप-फलार्घ्यकैः।<br />
                  धवल-मङ्गल-गान-रवाकुले, जिनगृहे सूरिन्द्र यजामहे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं आचार्य श्री विद्यासागरजी एवं तीन कम नव कोटि मुनिवरेभ्योऽर्घ्यं निर्वपामीति स्वाहा॥
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. पूजा प्रतिज्ञा पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={pratigyaRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 font-cinzel">
                Stage 5 • Puja Pratigya Path
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ५. पूजा प्रतिज्ञा पाठ
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-4">
              <p>
                श्रीमज्जिनेंद्र-मभिवन्द्य-जगत्-त्रयेशम्, स्याद्वाद-नायक-मनन्त चतुष्टयार्हम्।<br />
                श्रीमूल-संघ-सुदृशां सुकृतैक-हेतुर्, जैनेन्द्रयज्ञ-विधि-रेष मयाभ्यधायि॥१॥
              </p>
              <p>
                स्वस्ति त्रिलोक-गुरवे जिन-पुङ्गवाय, स्वस्ति स्वभाव-महिमोदय-सुस्थिताय।<br />
                स्वस्ति प्रकाश-सहजोजित-दृङ्मयाय, स्वस्ति प्रसन्न-ललिताद्भुत-वैभवाय॥२॥
              </p>
              <p>
                स्वस्-त्युच्छलद्-विमलबोधसुधा-प्लवाय, स्वस्ति स्वभाव-परभाव-विभास-काय।<br />
                स्वस्ति त्रिलोक-विततैक-चिदुद्गमाय, स्वस्ति त्रिकाल-सकलायत-विस्तृताय॥३॥
              </p>
              <p>
                द्रव्यस्य शुद्धि-मधि-गम्य यथानुरूपं, भावस्य शुद्धि-मधिका-मधि-गन्तुकामः।<br />
                आलम्बनानि विविधान्यवलम्ब्य वलान्, भूतार्थ-यज्ञ-पुरुषस्य करोमि यज्ञम्॥४॥
              </p>
              <p>
                अर्हन् पुराण-पुरुषोत्तम-पावनानि, वस्तून्य-नून-मखिलान्यय-मेक एव।<br />
                अस्मिन्-ज्वलद्विमल-केवल-बोध वह्नौ, पुण्यं समग्र मह मेक-मना जुहोमि॥५॥
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 text-center text-indigo-200 font-mono text-xs sm:text-sm font-bold">
              ॐ विधिद्यज्ञप्रतिज्ञानाय जिनप्रतिमाग्रे पुष्पाञ्जलिं क्षिपेत्।
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. स्वस्ति मंगलपाठ (२४ तीर्थंकर) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={swastiRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-cinzel">
                Stage 6 • Swasti Mangal Path
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ६. स्वस्ति मंगलपाठ (२४ तीर्थंकर)
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-5"
          >
            <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>श्रीवृषभो नः स्वस्ति, स्वस्ति श्रीअजितः।</div>
              <div>श्रीसंभवः स्वस्ति, स्वस्ति श्रीअभिनन्दनः।</div>
              <div>श्रीसुमतिः स्वस्ति, स्वस्ति श्रीपद्मप्रभः।</div>
              <div>श्रीसुपार्श्वः स्वस्ति, स्वस्ति श्रीचंद्रप्रभः।</div>
              <div>श्रीपुष्पदन्तः स्वस्ति, स्वस्ति श्रीशीतलः।</div>
              <div>श्रीश्रेयान् स्वस्ति, स्वस्ति श्रीवासुपूज्यः।</div>
              <div>श्रीविमलः स्वस्ति, स्वस्ति श्रीअनन्त:।</div>
              <div>श्रीधर्मः स्वस्ति, स्वस्ति श्रीशान्तिः।</div>
              <div>श्रीकुन्थुः स्वस्ति, स्वस्ति श्रीअरनाथः।</div>
              <div>श्रीमल्लिः स्वस्ति, स्वस्ति श्रीमुनिसुव्रतः।</div>
              <div>श्रीनमिः स्वस्ति, स्वस्ति श्रीनेमिनाथः।</div>
              <div>श्रीपार्श्वः स्वस्ति, स्वस्ति श्रीवर्द्धमानः॥</div>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-center text-cyan-200 font-mono text-xs sm:text-sm font-bold">
              ॥ इति चतुर्विंशति तीर्थंकर स्वस्ति मंगलपाठ पुष्पाञ्जलिं क्षिपेत् ॥
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. परमर्षि स्वस्ति मंगल पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={parmarshiRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400 font-cinzel">
                Stage 7 • Parmarshi Swasti Mangal Path
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ७. परमर्षि स्वस्ति मंगल पाठ
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            <div className="text-xs text-slate-400 font-gotu italic">(प्रत्येक श्लोक के बाद पुष्प क्षेपण करें)</div>
            <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-3.5">
              <p>
                नित्या-प्रकंपद-भुत-केवलौघाः, स्फुरन्मनः पर्यय-शुद्धबोधाः।<br />
                दिव्यावधिज्ञान-बलप्रबोधाः, स्वस्ति क्रियासुः परमर्षयो नः॥१॥
              </p>
              <p>
                कोष्ठस्थ-धान्योप-ममेक बीजं, संभिन्न-संश्रोत्-पदानुसारि।<br />
                चतुर्विधं बुद्धि-बलं दधानाः, स्वस्ति क्रियासुः परमर्षयो नः॥२॥
              </p>
              <p>
                संस्पर्शनं संश्रवणं च दूरा-, दास्वादन-घ्राण-विलोकलानि।<br />
                दिव्यान्-मतिज्ञान-बलाद्वहन्तः, स्वस्ति क्रियासुः परमर्षयो नः॥३॥
              </p>
              <p>
                प्रज्ञा-प्रधानाः श्रमणाः समृद्धाः, प्रत्येक-बुद्धाः दशसर्वपूर्वैः।<br />
                प्रवादिनोऽष्टाङ्ग-निमित्त-विज्ञाः, स्वस्ति क्रियासुः परमर्षयो नः॥४॥
              </p>
              <p>
                जङ्घानल-श्रेणि-फलाम्बु-तन्तु,-प्रसून-बीजाङ्कुर-चार-णाद्धाः।<br />
                नमोऽङ्गण-स्वैर-विहारिणश्च, स्वस्ति क्रियासुः परमर्षयो नः॥५॥
              </p>
              <p>
                आणिम्नि दक्षाः कुशला महिम्नि, लघिम्नि शक्ताः कृतिनो गरिम्णि।<br />
                मनो-वपु-र्वाग्बलिनश्च नित्यं, स्वस्ति क्रियासुः परमर्षयो नः॥६॥
              </p>
              <p>
                सकाम-रूपित्व-वशित्व-मैश्यं, प्राकाम्य-मन्तर्द्धि-मथाप्ति-माप्ताः।<br />
                तथाऽप्रतीघातगुणप्रधानाः, स्वस्ति क्रियासुः परमर्षयो नः॥७॥
              </p>
              <p>
                दीप्तं च तप्तं च तथामहोग्रं, घोरं तपो घोरपराक्रमस्थाः।<br />
                ब्रह्मापरं घोर-गुणाश्चरन्तः, स्वस्ति क्रियासुः परमर्षयो नः॥८॥
              </p>
              <p>
                आमर्ष-सर्वौषधयस्तथाशी-, र्विषाविषा दृष्टिविषाविषाश्च।<br />
                सखिल्ल-विड्जल्ल-मलौषधीशाः, स्वस्ति क्रियासुः परमर्षयो नः॥९॥
              </p>
              <p>
                क्षीरं स्रवन्तोऽत्र-घृतं स्रवन्तो, मधु-स्रवन्तोऽप्यमृतं स्रवन्तः।<br />
                अक्षीण-संवास-महानसाश्च, स्वस्ति क्रियासुः परमर्षयो नः॥१०॥
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-violet-500/15 border border-violet-400/30 text-center space-y-1.5">
              <div className="text-violet-200 font-mono text-xs sm:text-sm font-bold">
                ॥ इति परमर्षि स्वस्ति मङ्गलविधानं परिपुष्पाञ्जलिं क्षिपेत् ॥
              </div>
              <div className="text-xs text-violet-300 font-gotu">
                (यहाँ पर नौ बार णमोकार मंत्र जपना चाहिये)
              </div>
              <div className="text-violet-100 font-mono text-xs">
                ॐ ह्रीं चतुःषष्टि-ऋद्धि-प्राप्तेभ्यः श्रीपरमर्षिभ्यो नमः स्वस्ति भवतु (पुष्पांजलिं क्षिपेत्)।
              </div>
            </div>

            {/* शांति धारा की परंपरा एवं विशेषार्थ */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-xs font-bold text-amber-400 font-gotu">॥ शांति धारा की परंपरा ॥</div>
              <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
                वृषभनाथ से पुष्पदन्त तीर्थंकर पर्यंत धर्म की परंपरा अनवरत रूप से चलती रही, मगर पुष्पदन्त भगवान् के तीर्थ में पावपल्य का अभाव रहा, इसके पश्चात् शीतलनाथ भगवान तक धर्म चलता रहा, फिर उनके तीर्थ में अद्र्धपल्य पर्यंत धर्म का अभाव रहा। श्रेयांसनाथ भगवान् के तीर्थ में पौन पल्य का अभाव रहा। वासुपूज्य भगवान् के तीर्थ में एकपल्य का अभाव रहा। विमलनाथ भगवान् के तीर्थ में पौन पल्य का अभाव रहा। फिर इसके पश्चात् अनन्तनाथ भगवान के तीर्थ में अद्र्धपल्य का अभाव रहा। धर्मनाथ भगवान् के तीर्थ में पाव पल्य का अभाव रहा। इस प्रकार से पुष्पदन्त भगवान् से लेकर धर्मनाथ भगवान् पर्यंत धर्म का बीच बीच में अभाव रहा। मगर शांतिनाथ भगवान् से लेकर महावीर स्वामीपर्यंत अखण्ड सतत् रूप से धर्म की परंपरा चलती रही। इसी वजह से शान्तिधारा करने का प्रचलन हो गया। ऐसा अनुमानतः माना जाता है।
              </p>
              <div className="pt-2 border-t border-white/10 text-xs text-amber-200/90 font-gotu">
                <span className="font-bold text-amber-300">विशेषार्थ:</span> पुष्पदन्त भगवान् के तीर्थ में धर्म का विच्छेद हो जाने से इस भरत क्षेत्र की भूमि में जिनमार्ग के ज्ञाता, भव्य जीव का अभाव हो गया था। जिससे दिगम्बर दीक्षा लेने वाला कोई नहीं था।
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. देव-शास्त्र-गुरु पूजन (नित्य अष्टद्रव्य पूजन) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={devPujaRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-cinzel">
                Stage 8 • Nitya Ashta Dravya Puja
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ८. श्री देव-शास्त्र-गुरु पूजन (पं. जुगल किशोर जी)
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            {/* स्थापना */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-2">॥ स्थापना ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed mb-3">
                संसार-दावानल-दाह-नीरं, सम्मोह-विध्वंसन-चण्ड-वातम्।<br />
                ज्ञानामृतं प्राप्य जिनेन्द्र-रूपं, पूजामहं देवगुरोः करोमि॥
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm font-mono font-bold text-amber-300">
                <div>ॐ ह्रीं श्री देवशास्त्रगुरुसमूह! अत्र अवतर अवतर संवौषट्! (आह्वाननम्)</div>
                <div>ॐ ह्रीं श्री देवशास्त्रगुरुसमूह! अत्र तिष्ठ तिष्ठ ठः ठः! (स्थापनम्)</div>
                <div>ॐ ह्रीं श्री देवशास्त्रगुरुसमूह! अत्र मम सन्निहितो भव भव वषट्! (सन्निधिकरणम्)</div>
              </div>
            </div>

            {/* अष्ट द्रव्य अर्घ्य सूची */}
            <div className="space-y-5">
              {/* १. जल */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-blue-400 font-gotu mb-1">१. जल (जन्म जरा मृत्यु विनाशनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  तीर्थोदकैः शुचिमनोहरहेमकुम्भैः, संक्षालितं त्रिभुवनेन्द्र-किरीट-कोटिम्।<br />
                  पादद्वयं परमपावनमर्हतां च, संस्नापये भवभय-प्रशमप्रहेतोः॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-blue-500/15 text-blue-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो जन्म-जरा-मृत्यु-विनाशनाय जलं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* २. चन्दन */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-400 font-gotu mb-1">२. चन्दन (भवताप विनाशनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  चन्दनं चन्दनसमं सुविशुद्ध-गन्धं, कर्पूर-कुंकुम-विमिश्रित-कांति-युक्तम्।<br />
                  पादद्वये जिनपतेः प्रणतोऽर्पयामि, संसार-ताप-परिताप-विनाशनाय॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो भवताप-विनाशनाय चन्दनं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ३. अक्षत */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-slate-300 font-gotu mb-1">३. अक्षत (अक्षयपद प्राप्तये)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  अक्षतं क्षतविवर्जितमर्हतोऽग्रे, मुक्ताफलोपम-विशुद्ध-मनोज्ञ-रूपम्।<br />
                  पुञ्जीकरोमि गुण-रत्न-महोदधीनां, संप्राप्तये पदमखण्डितमक्षयं च॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-slate-400/15 text-slate-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो अक्षयपद-प्राप्तये अक्षतान् निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ४. पुष्प */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-pink-400 font-gotu mb-1">४. पुष्प (कामबाण विध्वंसनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  मन्दार-सुन्दर-सुगन्ध-विचित्र-पुष्पैः, कामारि-काम-मद-मर्दन-हेतुभूतैः।<br />
                  पूजां करोमि विजितेन्द्रिय-संयतानां, कामव्यथा-शमन-शान्ति-सुखप्रहेतोः॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-pink-500/15 text-pink-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो कामबाण-विध्वंसनाय पुष्पं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ५. नैवेद्य */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-yellow-400 font-gotu mb-1">५. नैवेद्य (क्षुधारोग विनाशनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  नैवेद्यमन्न-विविधं घृत-दुग्ध-युक्तं, स्वादु-प्रियं मधुर-भोज्य-मनोहरं च।<br />
                  अर्हत्पदे समुपहृत्य विशुद्ध-भावात्, क्षुद्रोग-दुःख-दमनं पदमाप्नुवन्ति॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-yellow-500/15 text-yellow-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो क्षुधारोग-विनाशनाय नैवेद्यं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ६. दीप */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-amber-300 font-gotu mb-1">६. दीप (मोहान्धकार विनाशनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  दीपं तमःप्रमथनं ज्वलितं सुवर्णैः, कर्पूर-वर्ति-परिपूरित-रत्न-भाण्डे।<br />
                  देवेन्द्र-पूजित-पदे जिनपुंगवानां, मोहान्धकार-दलनं प्रविधित्सुरेव॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो मोहान्धकार-विनाशनाय दीपं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ७. धूप */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-purple-400 font-gotu mb-1">७. धूप (अष्टकर्म दहनाय)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  धूपं दशांग-सहितं सुकृताग्निकुण्डे, प्रक्षाल्य कर्म-दहनं प्रवरं सुगन्धम्।<br />
                  श्रीसर्वज्ञ-चरणाम्बुज-सन्निधाने, भक्त्या जुहोमि भव-बन्धन-मुक्तयेऽहम्॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-purple-500/15 text-purple-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो अष्टकर्म-दहनाय धूपं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ८. फल */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-green-400 font-gotu mb-1">८. फल (मोक्षफल प्राप्तये)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  दिव्यानि रम्य-फलानि सुगन्धीनि, स्वादूनि पक्व-ललितानि मनोहराणि।<br />
                  पूजां विधामि जगदीश्वर-पाद-पद्मे, निर्वाण-सौख्य-फल-सम्पद-हेतुभूते॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-green-500/15 text-green-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो मोक्षफल-प्राप्तये फलं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ९. महार्घ्य */}
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40">
                <div className="text-xs font-bold text-amber-300 font-gotu mb-1">९. महार्घ्य (अनर्घपद प्राप्तये)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  जल-फल-वसु-द्रव्यं पावनं हेम-पात्रे, समरस-गुण-युक्तं भक्ति-भावेन पूर्णम्।<br />
                  त्रिभुवन-हित-कर्त्रे देव-शास्त्रे गुरुभ्यः, सविनयमुपहृत्य प्राप्नुयां मोक्ष-लक्ष्मीम्॥
                </p>
                <div className="mt-2.5 p-2.5 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs sm:text-sm font-bold shadow-md">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो अनर्घपद-प्राप्तये महार्घ्यं निर्वपामीति स्वाहा॥
                </div>
              </div>
            </div>

            {/* जयमाला */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <div className="text-sm font-bold text-amber-300 font-gotu">॥ देव-शास्त्र-गुरु जयमाला ॥</div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-3">
                <p>
                  धन्य जिनेश्वर देव आप हो, त्रिभुवन के सिरताज।<br />
                  भव-समुद्र में डूबत प्राणी, तारे पल में आज॥१॥
                </p>
                <p>
                  द्वादशांग जिनवाणी माता, दिव्य ज्ञान की खान।<br />
                  स्याद्वादमय सुधा बहावे, सुख पावे मतिमान॥२॥
                </p>
                <p>
                  पंच महाव्रत धारक मुनिवर, निर्मोही निष्काम।<br />
                  परम दिगम्बर आतमध्यानी, उनको कोटि प्रणाम॥३॥
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो जयमाला-पूर्णार्घ्यं निर्वपामीति स्वाहा॥
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. नित्य अर्घ्यावली (पंचपरमेष्ठी व २४ तीर्थंकर) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={arghyavaliRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 font-cinzel">
                Stage 9 • Nitya Arghyavali
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ९. नित्य नियम अर्घ्यावली
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-5"
          >
            {/* पंचपरमेष्ठी अर्घ्य */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-1">॥ पंचपरमेष्ठी अर्घ्य ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                अरिहंत सिद्ध आचार्य पाठक साधु हैं परमेष्ठि ये।<br />
                भव-सिन्धु तारण-करण-समरथ वंदना करि नित्य ये॥
              </p>
              <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं श्री पंचपरमेष्ठिभ्यो अनर्घपदप्राप्तये अर्घ्यं निर्वपामीति स्वाहा॥
              </div>
            </div>

            {/* चौबीस तीर्थंकर अर्घ्य */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-1">॥ चौबीस तीर्थंकर अर्घ्य ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                ऋषभ अजित संभव अभिनन्दन सुमति पद्म सुपार्श्व जिनेश।<br />
                चन्द्रप्रभ सुविधि शीतल श्रेयांस वासुपूज्य विमल परेश॥<br />
                अनन्त धर्म शान्ति कुन्थु अर मल्ल मुनिसुव्रत नमि नेम।<br />
                पार्श्व वर्धमान जिनवर को पूजूं धरि अति निर्मल प्रेम॥
              </p>
              <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 text-amber-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं श्री वृषभादि-महावीर-पर्यन्त-चतुर्विंशति-तीर्थंकरेभ्यो अर्घ्यं निर्वपामीति स्वाहा॥
              </div>
            </div>

            {/* श्री शांतिनाथ अर्घ्य */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold text-blue-300 font-gotu mb-1">॥ षोडश तीर्थंकर श्री शांतिनाथ अर्घ्य ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                शांतिकराय शांत रूपाय जगत्प्रदीपाय नमो जिनाय।<br />
                सकल दुरित हरणाय श्री शांतिनाथाय अर्घ्यं समर्पयामि॥
              </p>
              <div className="mt-2.5 p-2 rounded-xl bg-blue-500/15 text-blue-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं श्री शांतिनाथ जिनेंद्राय सर्वशांतिकराय अर्घ्यं निर्वपामीति स्वाहा॥
              </div>
            </div>

            {/* श्री महावीर अर्घ्य */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold text-emerald-300 font-gotu mb-1">॥ चरम तीर्थंकर श्री महावीर अर्घ्य ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                सिद्धारथ-नृप-नन्दनाय कुण्डलपुर-मण्डनाय विदेह-नाथाय।<br />
                अहिंसा-धर्म-प्रचारकाय सन्मति-वीर-प्रभवे अर्घ्यं समर्पयामि॥
              </p>
              <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/15 text-emerald-200 font-mono text-xs sm:text-sm font-bold">
                ॐ ह्रीं श्री महावीर जिनेंद्राय अनर्घपदप्राप्तये अर्घ्यं निर्वपामीति स्वाहा॥
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. आरती, जिनवाणी स्तुति एवं विसर्जन पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={aartiRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-cinzel">
                Stage 10 • Aarti & Visarjan
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                १०. मंगल आरती, जिनवाणी स्तुति एवं क्षमा-प्रार्थना
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            {/* पंचपरमेष्ठी आरती */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-rose-300 font-gotu">॥ श्री पंचपरमेष्ठी आरती ॥</div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-2">
                <p>
                  ॐ जय महावीर प्रभो, स्वामी जय महावीर प्रभो।<br />
                  कुण्डलपुर अवतारी, त्रिशलानन्द विभो॥ ॐ जय...
                </p>
                <p>
                  सिद्धारथ घर जन्मे, वैभव था भारी।<br />
                  बालब्रह्मचारी प्रभु, जग-हित-अवतारी॥ ॐ जय...
                </p>
                <p>
                  आतम-ज्ञान जगाया, जग को सन्मार्ग दिया।<br />
                  जीवों पर करुणा कर, पावन धर्म किया॥ ॐ जय...
                </p>
              </div>
            </div>

            {/* जिनवाणी स्तुति */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-300 font-gotu">॥ जिनवाणी स्तुति (जा वाणी के ज्ञान तें) ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                जा वाणी के ज्ञान तें, सूझै लोकालोक।<br />
                सो वाणी मस्तक धरौं, सदा देत हूँ ढोक॥<br />
                हे जिनवाणी भारती, तोहि जपूँ दिन-रैन।<br />
                जो तेरी शरणा गहें, सो पावै सुख-चैन॥
              </p>
            </div>

            {/* क्षमा-प्रार्थना एवं विसर्जन */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-3">
              <div className="text-xs font-bold text-amber-300 font-gotu">॥ विसर्जन पाठ एवं क्षमा-प्रार्थना ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                आह्वानं नैव जानामि, नैव जानामि पूजनम्।<br />
                विसर्जनं न जानामि, क्षमस्व परमेश्वर॥<br />
                मंत्रहीनं क्रियाहीनं, भक्तिहीनं जिनेश्वर।<br />
                यत्पूजितं मया देव! परिपूर्णं तदस्तु मे॥
              </p>
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-mono text-xs sm:text-sm font-bold text-center">
                ॐ ह्रीं श्री जिनेन्द्र-देव-शास्त्र-गुरुभ्यो नमो नमः। क्षमा-प्रार्थनां समर्पयामि स्वाहा॥
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
