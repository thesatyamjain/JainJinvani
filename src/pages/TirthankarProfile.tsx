import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { 
  ArrowLeft, 
  MapPin, 
  Book, 
  Sparkles, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Copy, 
  Check, 
  Flame, 
  ScrollText, 
  Sun, 
  Trees, 
  Calendar,
  RotateCcw,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { addFavorite, removeFavorite, isFavorite } from '../lib';
import { 
  getTirthankarById, 
  TIRTHANKARAS, 
  TirthankarInfo,
  getDravyaMantrasForTirthankar,
  DravyaItem
} from '../data/tirthankaras';

interface TirthankarProfileProps {
  tirthankarId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const TirthankarProfile: React.FC<TirthankarProfileProps> = ({
  tirthankarId,
  onBack,
  onNavigate
}) => {
  const [currentId, setCurrentId] = useState<string>(tirthankarId || 'adinath');
  const tirthankar: TirthankarInfo = getTirthankarById(currentId);
  const [favorite, setFavorite] = useState(isFavorite(`tirthankar-${tirthankar.id}`));
  const [copiedMantra, setCopiedMantra] = useState(false);
  const [copiedDravyaId, setCopiedDravyaId] = useState<string | null>(null);
  const [copiedAllDravya, setCopiedAllDravya] = useState(false);
  const [chantCount, setChantCount] = useState(0);
  const [activeDravyaTab, setActiveDravyaTab] = useState<number>(0);
  const [offeredDravyas, setOfferedDravyas] = useState<Record<string, boolean>>({});
  const [viewAllDravyas, setViewAllDravyas] = useState(false);

  const dravyaList: DravyaItem[] = getDravyaMantrasForTirthankar(tirthankar);

  // Sync state when current tirthankar changes
  React.useEffect(() => {
    setFavorite(isFavorite(`tirthankar-${tirthankar.id}`));
    setChantCount(0);
    setOfferedDravyas({});
    setActiveDravyaTab(0);
  }, [tirthankar.id]);

  // Sync if prop changes externally
  React.useEffect(() => {
    if (tirthankarId) {
      setCurrentId(tirthankarId);
    }
  }, [tirthankarId]);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(`tirthankar-${tirthankar.id}`);
      setFavorite(false);
    } else {
      addFavorite({
        id: `tirthankar-${tirthankar.id}`,
        title: tirthankar.nameHindi,
        type: 'tirthankar'
      });
      setFavorite(true);
    }
  };

  const handleCopyMantra = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tirthankar.mantra);
      setCopiedMantra(true);
      setTimeout(() => setCopiedMantra(false), 2000);
    }
  };

  const handleCopyDravya = (item: DravyaItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.mantra);
      setCopiedDravyaId(item.id);
      setTimeout(() => setCopiedDravyaId(null), 2000);
    }
  };

  const handleCopyAllDravyas = () => {
    if (navigator.clipboard) {
      const allText = dravyaList
        .map(d => `${d.nameHindi} (${d.purpose})\n${d.mantra}`)
        .join('\n\n');
      navigator.clipboard.writeText(`${tirthankar.titleHindi} - अष्टद्रव्य अर्पण मंत्र:\n\n${allText}`);
      setCopiedAllDravya(true);
      setTimeout(() => setCopiedAllDravya(false), 2500);
    }
  };

  const handleOfferDravya = (id: string) => {
    setOfferedDravyas(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tirthankar.nameHindi,
          text: `${tirthankar.titleHindi}\nचिह्न: ${tirthankar.symbol}\nमूल मंत्र: ${tirthankar.mantra}\n- जैन जिनवाणी`,
          url: window.location.href,
        });
      } catch (err) {
        // Share cancelled or not supported
      }
    } else {
      handleCopyMantra();
    }
  };

  const goToPrevious = () => {
    const prevNum = tirthankar.number === 1 ? 24 : tirthankar.number - 1;
    setCurrentId(TIRTHANKARAS[prevNum - 1].id);
  };

  const goToNext = () => {
    const nextNum = tirthankar.number === 24 ? 1 : tirthankar.number + 1;
    setCurrentId(TIRTHANKARAS[nextNum - 1].id);
  };

  const prevTirthankar = TIRTHANKARAS[tirthankar.number === 1 ? 23 : tirthankar.number - 2];
  const nextTirthankar = TIRTHANKARAS[tirthankar.number === 24 ? 0 : tirthankar.number];
  const activeDravya = dravyaList[activeDravyaTab] || dravyaList[0];
  const totalOffered = Object.values(offeredDravyas).filter(Boolean).length;

  return (
    <div className="w-full max-w-6xl mx-auto pt-4 md:pt-8 pb-32 px-4 sm:px-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-200 hover:text-white transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-gotu text-sm">वापस</span>
        </button>

        {/* Tirthankar Counter Badge & Actions */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            तीर्थंकर {tirthankar.number} / २४
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`p-2.5 rounded-xl border transition-all ${
              favorite
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            title="पसंदीदा में जोड़ें"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            title="शेयर करें"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Animated Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tirthankar.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 md:space-y-8"
        >
          {/* Hero Header Card */}
          <GlassCard
            variant="gilded"
            className="p-6 md:p-10 relative overflow-hidden text-center border-amber-500/30 shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Sacred Emblem */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center text-5xl sm:text-6xl shadow-inner animate-float">
                {tirthankar.symbolEmoji}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                #{tirthankar.number}
              </div>
            </div>

            {/* Holy Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-notoserif font-bold text-white mb-2 tracking-normal leading-normal">
              {tirthankar.nameHindi}
            </h1>
            <p className="text-amber-300/80 font-gotu text-base sm:text-lg mb-2">
              {tirthankar.subtitleHindi}
            </p>
            <p className="text-white/60 text-xs sm:text-sm font-gotu mb-6">
              {tirthankar.dynasty} • लांछन: {tirthankar.symbol}
            </p>

            {/* Quick Spiritual Action Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  const dravyaElem = document.getElementById('dravya-section');
                  dravyaElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-gotu font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>द्रव्य अर्पण मंत्र</span>
              </button>
              {tirthankar.chalisaId && (
                <button
                  onClick={() => onNavigate('viewer', { id: tirthankar.chalisaId, type: 'chalisa', title: `${tirthankar.nameHindi} चालीसा` })}
                  className="px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-gotu flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <ScrollText className="w-4 h-4 text-amber-400" />
                  <span>चालीसा पढ़ें</span>
                </button>
              )}
              {tirthankar.artiId && (
                <button
                  onClick={() => onNavigate('viewer', { id: tirthankar.artiId, type: 'aarti', title: `${tirthankar.nameHindi} आरती` })}
                  className="px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-gotu flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>आरती करें</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('viewer', { id: tirthankar.pujaId || 'chaubis-tirthankar-puja', type: 'puja', title: `${tirthankar.nameHindi} पूजन` })}
                className="px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-gotu flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>पूजन विधान</span>
              </button>
            </div>
          </GlassCard>

          {/* Section: Ashtadravya Arpan Mantras (द्रव्य चढ़ाने के मंत्र) */}
          <div id="dravya-section">
            <GlassCard
              variant="gilded"
              className="p-6 md:p-8 bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent border-amber-500/40 shadow-xl"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-amber-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪔</span>
                    <h2 className="text-xl md:text-2xl font-notoserif font-bold text-amber-200">
                      अष्टद्रव्य अर्पण मंत्र (द्रव्य चढ़ाने के विधि-मंत्र)
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-300/70 font-gotu mt-1">
                    {tirthankar.nameHindi} के पूजन-अभिषेक में ८ द्रव्य एवं पूर्णार्घ्य समर्पित करने के प्रामाणिक मंत्र
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setViewAllDravyas(!viewAllDravyas)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-gotu transition-all"
                  >
                    {viewAllDravyas ? 'टैब दृश्य' : 'सभी ९ मंत्र देखें'}
                  </button>
                  <button
                    onClick={handleCopyAllDravyas}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-gotu transition-all"
                  >
                    {copiedAllDravya ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAllDravya ? 'सभी कॉपी हुए' : 'सभी मंत्र कॉपी करें'}</span>
                  </button>
                </div>
              </div>

              {!viewAllDravyas ? (
                /* Tabbed View */
                <div>
                  {/* Horizontal Scrollable Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                    {dravyaList.map((item, idx) => {
                      const isOffered = !!offeredDravyas[item.id];
                      const isSelected = activeDravyaTab === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveDravyaTab(idx)}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                              : isOffered
                              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/80'
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.nameHindi.split(' ')[1]}</span>
                          {isOffered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Dravya Focused Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDravya.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 md:p-8 rounded-2xl bg-black/40 border border-amber-500/30 relative overflow-hidden"
                    >
                      {/* Top Dravya Purpose Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shadow-inner">
                            {activeDravya.emoji}
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-notoserif font-bold text-white">
                              {activeDravya.nameHindi}
                            </h3>
                            <div className="text-xs text-amber-300 font-gotu">
                              प्रयोजन: {activeDravya.purpose} ({activeDravya.purposeEn})
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopyDravya(activeDravya)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-xs font-gotu transition-all"
                        >
                          {copiedDravyaId === activeDravya.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedDravyaId === activeDravya.id ? 'कॉपी हो गया' : 'मंत्र कॉपी करें'}</span>
                        </button>
                      </div>

                      {/* Gilded Sacred Sanskrit Mantra Box */}
                      <div className="p-5 md:p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 mb-4 text-center">
                        <p className="text-white font-notoserif font-bold text-lg sm:text-xl md:text-2xl leading-relaxed text-amber-100">
                          {activeDravya.mantra}
                        </p>
                      </div>

                      {/* Spiritual Meaning */}
                      <p className="text-white/70 text-xs sm:text-sm font-gotu mb-6 text-center italic">
                        {activeDravya.subtext}
                      </p>

                      {/* Action Offering Button */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-white/50 font-gotu">
                          अष्टद्रव्य अर्पण प्रगति: <span className="text-amber-300 font-bold">{totalOffered} / ९ द्रव्य</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => handleOfferDravya(activeDravya.id)}
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold font-gotu text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                              offeredDravyas[activeDravya.id]
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                            }`}
                          >
                            <span>{offeredDravyas[activeDravya.id] ? '✓ द्रव्य अर्पित किया गया' : `${activeDravya.emoji} द्रव्य अर्पित करें (स्वाहा)`}</span>
                          </button>
                          {activeDravyaTab < dravyaList.length - 1 && (
                            <button
                              onClick={() => setActiveDravyaTab(prev => prev + 1)}
                              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-gotu transition-all"
                            >
                              अगला द्रव्य →
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                /* All 9 Mantras List View */
                <div className="space-y-4">
                  {dravyaList.map((item) => {
                    const isOffered = !!offeredDravyas[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`p-4 md:p-5 rounded-xl border transition-all ${
                          isOffered
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-black/30 border-white/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 font-notoserif font-bold text-white text-base">
                            <span>{item.emoji}</span>
                            <span>{item.nameHindi}</span>
                            <span className="text-xs font-gotu font-normal text-amber-300/80">({item.purpose})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyDravya(item)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                              title="कॉपी करें"
                            >
                              {copiedDravyaId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOfferDravya(item.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-gotu font-medium transition-all ${
                                isOffered
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                              }`}
                            >
                              {isOffered ? '✓ अर्पित' : 'अर्पित करें'}
                            </button>
                          </div>
                        </div>
                        <p className="text-amber-100 font-notoserif font-semibold text-base sm:text-lg leading-relaxed pl-7">
                          {item.mantra}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>

          {/* 4-Grid Structured Canonical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Card 1: Sacred Attributes */}
            <GlassCard className="p-6 md:p-8 border-t-4 border-t-amber-500/50">
              <h2 className="text-lg md:text-xl font-notoserif font-bold text-amber-200 mb-5 flex items-center gap-2.5">
                <Book className="w-5 h-5 text-amber-400" />
                लांछन एवं स्वरूप
              </h2>
              <div className="space-y-3.5 text-sm md:text-base font-gotu">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">लांछन (चिह्न)</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span>{tirthankar.symbolEmoji}</span>
                    <span>{tirthankar.symbol}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">शरीर का वर्ण (रंग)</span>
                  <span className="text-amber-200 font-semibold">{tirthankar.color}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">केवलज्ञान वृक्ष</span>
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    <span>{tirthankar.kevalgyanTree}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">आयु प्रमाण</span>
                  <span className="text-white font-medium">{tirthankar.age}</span>
                </div>
              </div>
            </GlassCard>

            {/* Card 2: Family & Lineage */}
            <GlassCard className="p-6 md:p-8 border-t-4 border-t-blue-500/50">
              <h2 className="text-lg md:text-xl font-notoserif font-bold text-blue-200 mb-5 flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-blue-400" />
                पारिवारिक एवं तीर्थ विवरण
              </h2>
              <div className="space-y-3.5 text-sm md:text-base font-gotu">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">पिता</span>
                  <span className="text-white font-semibold">{tirthankar.father}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">माता</span>
                  <span className="text-white font-semibold">{tirthankar.mother}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">जन्मभूमि</span>
                  <span className="text-amber-200 font-medium">{tirthankar.birthPlace}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">मोक्ष / निर्वाण स्थली</span>
                  <span className="text-emerald-300 font-medium">{tirthankar.nirvanaPlace}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-white/60">यक्ष / यक्षिणी</span>
                  <span className="text-white/90 font-medium text-xs sm:text-sm">{tirthankar.yakshaYakshini}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Card 3: Panchakalyanak Dates */}
          <GlassCard className="p-6 md:p-8 border-t-4 border-t-emerald-500/50">
            <h2 className="text-lg md:text-xl font-notoserif font-bold text-emerald-200 mb-5 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-400" />
              पंचकल्याणक पावन तिथियाँ
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-gotu">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-amber-300 font-bold mb-1">गर्भ कल्याणक</div>
                <div className="text-xs sm:text-sm text-white font-medium">{tirthankar.kalyanak.garbha}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-amber-300 font-bold mb-1">जन्म कल्याणक</div>
                <div className="text-xs sm:text-sm text-white font-medium">{tirthankar.kalyanak.janma}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-amber-300 font-bold mb-1">तप / दीक्षा</div>
                <div className="text-xs sm:text-sm text-white font-medium">{tirthankar.kalyanak.tap}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="text-xs text-amber-300 font-bold mb-1">केवलज्ञान</div>
                <div className="text-xs sm:text-sm text-white font-medium">{tirthankar.kalyanak.gyan}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 col-span-2 sm:col-span-1">
                <div className="text-xs text-emerald-300 font-bold mb-1">मोक्ष कल्याणक</div>
                <div className="text-xs sm:text-sm text-white font-semibold">{tirthankar.kalyanak.moksha}</div>
              </div>
            </div>
          </GlassCard>

          {/* Card 4: Detailed Biography */}
          <GlassCard className="p-6 md:p-10">
            <h2 className="text-xl md:text-2xl font-notoserif font-bold text-amber-200 mb-4 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-400" />
              जीवन परिचय एवं संदेश
            </h2>
            <p className="text-white/90 font-gotu leading-loose text-base md:text-lg text-justify">
              {tirthankar.bioHindi}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 text-white/50 text-xs sm:text-sm font-gotu italic">
              {tirthankar.bioEn}
            </div>
          </GlassCard>

          {/* Card 5: Sacred Mantra & Interactive Chanting Counter */}
          <div id="mantra-section">
            <GlassCard
              variant="gilded"
              className="p-6 md:p-8 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-notoserif font-bold text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  मूल बीज मंत्र
                </h2>
                <button
                  onClick={handleCopyMantra}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-gotu transition-all"
                >
                  {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMantra ? 'कॉपी हो गया' : 'मंत्र कॉपी करें'}</span>
                </button>
              </div>

              {/* Glowing Sacred Mantra Box */}
              <div className="p-5 md:p-6 rounded-2xl bg-black/40 border border-amber-500/30 text-center relative overflow-hidden shadow-inner mb-6">
                <p className="text-white font-notoserif font-bold text-xl sm:text-2xl md:text-3xl tracking-wide leading-relaxed text-amber-100">
                  {tirthankar.mantra}
                </p>
              </div>

              {/* Interactive Chanting Tap Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-center sm:text-left">
                  <div className="text-xs text-white/50 font-gotu">मंत्र जाप माला काउंटर</div>
                  <div className="text-2xl font-bold font-notoserif text-amber-300">
                    {chantCount} <span className="text-xs font-gotu font-normal text-white/60">/ १०८ बार</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setChantCount(prev => prev + 1)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-gotu text-sm shadow-lg hover:shadow-amber-500/25 transition-all active:scale-95"
                  >
                    🕉️ जाप गिनें (+१)
                  </button>
                  {chantCount > 0 && (
                    <button
                      onClick={() => setChantCount(0)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
                      title="रीसेट करें"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Bottom Previous / Next Switcher */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 border-t border-white/10">
            <button
              onClick={goToPrevious}
              className="p-3.5 md:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-amber-300 group-hover:-translate-x-1 transition-all shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] text-white/40 font-gotu">पिछला तीर्थंकर</div>
                <div className="text-xs sm:text-sm font-gotu text-white font-medium truncate group-hover:text-amber-200">
                  {prevTirthankar.number}. {prevTirthankar.nameHindi}
                </div>
              </div>
            </button>

            <button
              onClick={goToNext}
              className="p-3.5 md:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-right transition-all group flex items-center justify-end gap-3"
            >
              <div className="overflow-hidden">
                <div className="text-[11px] text-white/40 font-gotu">अगला तीर्थंकर</div>
                <div className="text-xs sm:text-sm font-gotu text-white font-medium truncate group-hover:text-amber-200">
                  {nextTirthankar.number}. {nextTirthankar.nameHindi}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
