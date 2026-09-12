import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ArrowLeft,
  Sparkles,
  Droplets,
  Flower2,
  Flame,
  Play,
  Pause,
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
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-gotu text-amber-300 hover:text-amber-200 transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">वापस</span>
        </button>

        {/* Quick Stepper Jump Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px] sm:text-xs font-gotu">
          <button
            onClick={() => scrollToSection(abhishekRef)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 whitespace-nowrap cursor-pointer transition-all"
          >
            अभिषेक
          </button>
          <button
            onClick={() => scrollToSection(shantidharaRef)}
            className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-200 whitespace-nowrap cursor-pointer transition-all"
          >
            शांतिधारा
          </button>
          <button
            onClick={() => scrollToSection(gandhodakRef)}
            className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-200 whitespace-nowrap cursor-pointer transition-all"
          >
            गंधोदक
          </button>
          <button
            onClick={() => scrollToSection(devPujaRef)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 whitespace-nowrap cursor-pointer transition-all"
          >
            पूजन
          </button>
          <button
            onClick={() => scrollToSection(arghyavaliRef)}
            className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 whitespace-nowrap cursor-pointer transition-all"
          >
            अर्घ्य
          </button>
          <button
            onClick={() => scrollToSection(aartiRef)}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 whitespace-nowrap cursor-pointer transition-all"
          >
            आरती
          </button>
        </div>

        {/* Reader Tools (Font & Scroll) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => setFontSize((f) => Math.max(14, f - 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold"
            title="फ़ॉन्ट छोटा करें"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((f) => Math.min(28, f + 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold"
            title="फ़ॉन्ट बड़ा करें"
          >
            A+
          </button>
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-2 py-1 rounded-lg border text-xs font-gotu font-bold flex items-center gap-1 transition-all ${
              isAutoScrolling
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
            }`}
            title="ऑटो-स्क्रॉल (हाथ व्यस्त होने पर स्वतः स्क्रॉल)"
          >
            {isAutoScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isAutoScrolling ? 'रोकें' : 'स्क्रॉल'}</span>
          </button>
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
            <button
              onClick={() => setActiveStage('all')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold transition-all cursor-pointer text-center ${
                activeStage === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              संपूर्ण नित्य क्रम
            </button>
            <button
              onClick={() => setActiveStage('abhishek')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold transition-all cursor-pointer text-center ${
                activeStage === 'abhishek'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              अभिषेक व शांतिधारा
            </button>
            <button
              onClick={() => setActiveStage('puja')}
              className={`py-2 px-2 rounded-xl text-xs font-gotu font-bold transition-all cursor-pointer text-center ${
                activeStage === 'puja'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              देव-शास्त्र-गुरु पूजन
            </button>
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
      {/* 4. देव-शास्त्र-गुरु पूजन (नित्य अष्टद्रव्य पूजन) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={devPujaRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-cinzel">
                Stage 4 • Nitya Ashta Dravya Puja
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ४. श्री देव-शास्त्र-गुरु पूजन (पं. जुगल किशोर जी)
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
                  धूपं घृतं वर-सुगन्धि-दशाङ्ग-युक्तं, प्रज्वाल्य पावकमहो शिखिनो मुखेऽस्मिन्।<br />
                  अष्टप्रकार-दुरितौघ-विनाशनाय, पूजां करोमि परमात्म-पदे जिनेन्द्रे॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-purple-500/15 text-purple-200 font-mono text-xs sm:text-sm font-bold">
                  ॐ ह्रीं श्री देवशास्त्रगुरुभ्यो अष्टकर्म-दहनाय धूपं निर्वपामीति स्वाहा॥
                </div>
              </div>

              {/* ८. फल */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-xs font-bold text-emerald-400 font-gotu mb-1">८. फल (मोक्षफल प्राप्तये)</div>
                <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                  जातीफलाम्र-कदली-फल-नारिकेलैः, पूगादि-सुन्दर-फलोत्तम-जात-पुञ्जैः।<br />
                  पूजां करोमि फल-सम्पद-हेतुभूतां, मोक्षाख्य-शाश्वत-सुखस्य फलस्य हेतोः॥
                </p>
                <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/15 text-emerald-200 font-mono text-xs sm:text-sm font-bold">
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
      {/* 5. नित्य अर्घ्यावली (पंचपरमेष्ठी व २४ तीर्थंकर) */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={arghyavaliRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 font-cinzel">
                Stage 5 • Nitya Arghyavali
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ५. नित्य नियम अर्घ्यावली
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
      {/* 6. आरती, जिनवाणी स्तुति एवं विसर्जन पाठ */}
      {/* ========================================================================= */}
      {(activeStage === 'all' || activeStage === 'puja') && (
        <div ref={aartiRef} className="mb-12 scroll-mt-28">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 font-cinzel">
                Stage 6 • Aarti & Visarjan
              </span>
              <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                ६. मंगल आरती, जिनवाणी स्तुति एवं क्षमा-प्रार्थना
              </h2>
            </div>
          </div>

          <GlassCard
            tilt={{ maxTilt: 5, glareMaxOpacity: 0.12, glareColor: 'gold' }}
            variant="gilded"
            className="p-5 sm:p-7 rounded-3xl space-y-6"
          >
            {/* पंचपरमेष्ठी आरती */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-2">॥ पंचपरमेष्ठी मंगल आरती ॥</div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-2.5">
                <p>
                  पंच परमेष्ठी की आरती कीजै, भव-जलनिधि पार उतर मन रीझै॥टेक॥<br />
                  पहिली आरती श्री अरिहंता, केवलज्ञान-दिवाकर संता॥<br />
                  दूजी आरती सिद्धन केरी, अष्टकर्म-मल नाशन हेरी॥<br />
                  तीजी आरती सूरिवरा की, आचार-धरम के धीरा की॥<br />
                  चौथी आरती पाठक ज्ञानी, द्वादशांग के ज्ञाता ध्यानी॥<br />
                  पांचवीं आरती साधु मुनीशा, निशदिन आतम-रस के ईशा॥
                </p>
              </div>
            </div>

            {/* जिनवाणी स्तुति */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/25">
              <div className="text-xs font-bold text-amber-300 font-gotu mb-2">॥ जिनवाणी स्तुति ॥</div>
              <div style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed space-y-2.5">
                <p>
                  मिथ्यातम नाशवे को ज्ञान के प्रकाशवे को,<br />
                  आपा पर भासवे को भानु सी बखानी है।<br />
                  छहों द्रव्य जानवे को बंध विधि भानवे को,<br />
                  जीव के जितावे को न जीवे को न सानी है॥
                </p>
                <p className="pt-2 font-bold text-amber-200">
                  जा वाणी के ज्ञान ते सूझे लोकालोक।<br />
                  सो वाणी मस्तक धरूँ सदा देत हूँ ढोक॥
                </p>
              </div>
            </div>

            {/* विसर्जन पाठ एवं क्षमा याचना */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 font-gotu text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2">
              <div className="text-xs font-bold text-slate-200 font-gotu mb-1">॥ विसर्जन पाठ एवं क्षमा-प्रार्थना ॥</div>
              <p style={{ fontSize: `${fontSize}px` }} className="font-notoserif text-slate-100 leading-relaxed">
                आह्वानं नैव जानामि नैव जानामि पूजनम्।<br />
                विसर्जनं न जानामि क्षमस्व परमेश्वर॥<br />
                यदक्षरपदभ्रष्टं मात्राहीनं च यद्भवेत्।<br />
                तत्सर्वं क्षम्यतां देव जिनेन्द्र परमेश्वर॥
              </p>
              <div className="mt-3 p-3 rounded-xl bg-amber-500/15 text-amber-200 text-center font-notoserif font-bold text-sm sm:text-base">
                खामेमि सव्वे जीवा, सव्वे जीवा खमंतु मे।<br />
                मित्ती मे सव्व भूएसु, वेरं मज्झं न केणवि॥
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Quick Navigation Footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <h4 className="text-sm font-notoserif font-bold text-white">दैनिक स्वाध्याय पूर्ण हुआ?</h4>
          <p className="text-xs text-slate-400 font-gotu">अब आप १०८ जाप माला या सामायिक साधना प्रारंभ कर सकते हैं।</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('jap')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-gotu text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
          >
            १०८ जाप माला
          </button>
          <button
            onClick={() => onNavigate('samayik')}
            className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-gotu text-xs font-bold border border-blue-500/30 transition-all cursor-pointer"
          >
            सामायिक
          </button>
        </div>
      </div>
    </div>
  );
};
