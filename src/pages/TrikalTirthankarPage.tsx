import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  ChevronLeft,
  Search,
  Crown,
  Sparkles,
  Clock,
  Compass,
  MapPin,
  BookOpen,
  ArrowRight,
  Layers,
  Check,
  Copy,
  Info,
  Sun,
  Shield,
  X,
  Scroll,
  Users,
  Award,
  Scale,
  Heart,
  BarChart3,
  Table as TableIcon,
  LayoutGrid,
  Trees,
  TreeDeciduous,
  Flame,
} from 'lucide-react';
import {
  PAST_TIRTHANKARAS,
  FUTURE_TIRTHANKARAS,
  VIDHYAMAN_TIRTHANKARAS,
  FOURTEEN_KULAKARAS,
  KAAL_CHAKRA_ERAS,
  UTSARPINI_ERAS,
  TEN_KALPAVRIKSHAS,
  PRESENT_TIRTHANKARA_ARGHYAS,
  CHAUBISI_STATISTICS,
  TEES_CHAUBISI_VANDANA,
  getPresentTirthankaras,
  PastTirthankar,
  FutureTirthankar,
  VidhyamanTirthankar,
  KulakaraInfo,
  EraType,
} from '../data/trikalTirthankaras';
import { TirthankarInfo } from '../data/tirthankaras';
import { triggerHaptic } from '../utils/pwaManager';

interface TrikalTirthankarPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  initialEra?: EraType;
}

type ViewMode = 'cards' | 'table' | 'stats';
type ArghyaCategory = 'present' | 'past' | 'future' | 'videha' | 'tees';
type CycleSubTab = 'avasarpini' | 'utsarpini' | 'kulakaras' | 'kalpavriksha' | 'tees';

export const TrikalTirthankarPage: React.FC<TrikalTirthankarPageProps> = ({
  onBack,
  onNavigate,
  initialEra = 'present',
}) => {
  // Design Read: An illuminated celestial Jain manuscript aesthetic featuring radiating gilded badges, tabbed era navigation, instant dual-script search (Hindi/English), table view, and deep spiritual resonance.

  const [activeEra, setActiveEra] = useState<EraType>(initialEra);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedMantra, setCopiedMantra] = useState<string | null>(null);
  const [copiedArghya, setCopiedArghya] = useState<string | null>(null);
  const [activeArghyaTab, setActiveArghyaTab] = useState<ArghyaCategory>('present');
  const [activeCycleSubTab, setActiveCycleSubTab] = useState<CycleSubTab>('avasarpini');

  // Detailed Modal State
  const [selectedItem, setSelectedItem] = useState<
    | { type: 'present'; data: TirthankarInfo }
    | { type: 'past'; data: PastTirthankar }
    | { type: 'future'; data: FutureTirthankar }
    | { type: 'videha'; data: VidhyamanTirthankar }
    | null
  >(null);

  const presentTirthankaras = useMemo(() => getPresentTirthankaras(), []);

  // Filtered lists based on search query
  const filteredPresent = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return presentTirthankaras;
    return presentTirthankaras.filter(
      (t) =>
        t.nameHindi.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q) ||
        t.father.toLowerCase().includes(q) ||
        t.mother.toLowerCase().includes(q) ||
        t.birthPlace.toLowerCase().includes(q) ||
        t.nirvanaPlace.toLowerCase().includes(q) ||
        t.dynasty.toLowerCase().includes(q) ||
        t.kevalgyanTree.toLowerCase().includes(q) ||
        t.yakshaYakshini.toLowerCase().includes(q) ||
        t.number.toString() === q
    );
  }, [presentTirthankaras, searchQuery]);

  const filteredPast = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PAST_TIRTHANKARAS;
    return PAST_TIRTHANKARAS.filter(
      (t) =>
        t.nameHindi.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q) ||
        t.father.toLowerCase().includes(q) ||
        t.mother.toLowerCase().includes(q) ||
        t.birthPlace.toLowerCase().includes(q) ||
        t.nirvanaPlace.toLowerCase().includes(q) ||
        t.number.toString() === q
    );
  }, [searchQuery]);

  const filteredFuture = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FUTURE_TIRTHANKARAS;
    return FUTURE_TIRTHANKARAS.filter(
      (t) =>
        t.nameHindi.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.previousSoul.toLowerCase().includes(q) ||
        t.previousSoulDetails.toLowerCase().includes(q) ||
        t.futureFather.toLowerCase().includes(q) ||
        t.futureMother.toLowerCase().includes(q) ||
        t.futureBirthPlace.toLowerCase().includes(q) ||
        t.futureNirvanaPlace.toLowerCase().includes(q) ||
        t.number.toString() === q
    );
  }, [searchQuery]);

  const filteredVideha = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return VIDHYAMAN_TIRTHANKARAS;
    return VIDHYAMAN_TIRTHANKARAS.filter(
      (t) =>
        t.nameHindi.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.continent.toLowerCase().includes(q) ||
        t.father.toLowerCase().includes(q) ||
        t.mother.toLowerCase().includes(q) ||
        t.number.toString() === q
    );
  }, [searchQuery]);

  const filteredKulakaras = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FOURTEEN_KULAKARAS;
    return FOURTEEN_KULAKARAS.filter(
      (k) =>
        k.nameHindi.toLowerCase().includes(q) ||
        k.nameEn.toLowerCase().includes(q) ||
        k.parent.toLowerCase().includes(q) ||
        k.contribution.toLowerCase().includes(q) ||
        k.policy.toLowerCase().includes(q) ||
        k.number.toString() === q
    );
  }, [searchQuery]);

  const copyToClipboard = (text: string, id: string, isArghya: boolean = false) => {
    try {
      navigator.clipboard.writeText(text);
      triggerHaptic('success');
      if (isArghya) {
        setCopiedArghya(id);
        setTimeout(() => setCopiedArghya(null), 2500);
      } else {
        setCopiedMantra(id);
        setTimeout(() => setCopiedMantra(null), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleOpenPresentProfile = (id: string) => {
    triggerHaptic('light');
    onNavigate('tirthankar', {
      id,
      source: 'trikal-tirthankar',
      previousPage: 'trikal-tirthankar',
      previousParams: { initialEra: activeEra },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto pt-4 md:pt-8 page-bottom-clearance px-4 sm:px-6">
      {/* Page Header (Matching CategoryListing, TirthPage, and TirthankarProfile) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={() => {
              triggerHaptic('light');
              onBack();
            }}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-colors backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </motion.button>
          <div className="py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-gotu font-medium bg-amber-500/15 border border-amber-400/30 text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                त्रिकाल तीर्थंकर दर्शन
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-notoserif font-bold text-white pt-1 pb-1 leading-[1.3] drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]">
              त्रिकाल २४ तीर्थंकर परिचय
            </h1>
            <p className="text-slate-300/80 text-xs md:text-sm font-gotu mt-0.5">
              भूत, वर्तमान, भविष्य एवं विदेह क्षेत्र तीर्थंकर • कालचक्र ज्ञान • ९३ अर्घ्यावली
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Cards / Table / Stats) - Only for Tirthankara eras */}
        {activeEra !== 'cycle' && activeEra !== 'arghya' && (
          <div className="flex items-center bg-slate-900/90 border border-white/15 rounded-2xl p-1 shrink-0 shadow-inner self-start md:self-auto">
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => {
                triggerHaptic('light');
                setViewMode('cards');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-gotu font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="कार्ड दर्शन"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>कार्ड</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => {
                triggerHaptic('light');
                setViewMode('table');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-gotu font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="सम्पूर्ण सारणी / चार्ट"
            >
              <TableIcon className="w-4 h-4" />
              <span>सारणी</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => {
                triggerHaptic('light');
                setViewMode('stats');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-gotu font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'stats'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="सांख्यिकी व तथ्य"
            >
              <BarChart3 className="w-4 h-4" />
              <span>तथ्य</span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Era Navigation Tabs */}
      <div className="w-full flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'present', label: 'वर्तमान चौबीसी (२४)', icon: Crown },
          { id: 'past', label: 'भूतकाल चौबीसी (२४)', icon: Clock },
          { id: 'future', label: 'भविष्यत् चौबीसी (२४)', icon: Sun },
          { id: 'videha', label: 'विद्यमान २० तीर्थंकर', icon: Compass },
          { id: 'cycle', label: 'कालचक्र व कुलकर', icon: Layers },
          { id: 'arghya', label: 'अर्घ्यावली संग्रह (९३)', icon: Scroll },
        ].map((tab) => {
          const isActive = activeEra === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                triggerHaptic('light');
                setActiveEra(tab.id as EraType);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-gotu whitespace-nowrap transition-all border cursor-pointer shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Search Bar (for list tabs) */}
      {activeEra !== 'cycle' && activeEra !== 'arghya' && viewMode !== 'stats' && (
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeEra === 'present'
                  ? 'वर्तमान तीर्थंकर, माता-पिता, लांछन, वंश या कल्याणक भूमि खोजें...'
                  : activeEra === 'future'
                  ? 'भावी तीर्थंकर अथवा पूर्व भव (श्रेणिक, कृष्ण, बलभद्र, सुलसा आदि) खोजें...'
                  : activeEra === 'videha'
                  ? 'विद्यमान तीर्थंकर अथवा देश (सीमंधर, सुसीमा, जम्बूद्वीप आदि) खोजें...'
                  : 'भूतकाल तीर्थंकर नाम, माता-पिता या लांछन खोजें...'
              }
              className="w-full bg-slate-900/80 border border-white/15 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:bg-slate-900 focus:border-amber-400/60 transition-all font-gotu shadow-inner"
            />
            {searchQuery && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                aria-label="खोज साफ़ करें"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </div>

            {/* Quick Filter Info Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-gotu text-slate-400 px-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>
                  {activeEra === 'present' &&
                    `वर्तमान अवसर्पिणी काल के २४ तीर्थंकर (प्रदर्शित: ${filteredPresent.length})`}
                  {activeEra === 'past' &&
                    `अतीत अवसर्पिणी काल के २४ तीर्थंकर (प्रदर्शित: ${filteredPast.length})`}
                  {activeEra === 'future' &&
                    `आगामी उत्सर्पिणी काल के २४ तीर्थंकर (प्रदर्शित: ${filteredFuture.length})`}
                  {activeEra === 'videha' &&
                    `महाविदेह क्षेत्र में साक्षात् विराजमान २० तीर्थंकर (प्रदर्शित: ${filteredVideha.length})`}
                </span>
              </div>
              <div className="text-[11px] text-amber-300/80">
                पूर्ण शास्त्रीय डेटा • किसी भी तीर्थंकर पर क्लिक करके सम्पूर्ण चरित्र व अर्घ्य पढ़ें
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATS VIEW (If viewMode === 'stats' on Tirthankara eras) */}
        {/* ========================================================================= */}
        {viewMode === 'stats' && activeEra !== 'cycle' && activeEra !== 'arghya' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-notoserif font-bold text-amber-200">
                    चौबीस तीर्थंकर तत्त्व व सांख्यिकी दिग्दर्शन
                  </h2>
                  <p className="text-xs text-slate-300 font-gotu">
                    निर्वाण भूमियां, वर्ण व्यवस्था, वंश परंपरा एवं ६३ शलाका पुरुषों का संपूर्ण विश्लेषण
                  </p>
                </div>
              </div>
            </div>

            {/* Nirvana Places Distribution */}
            <div>
              <h3 className="text-base font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>निर्वाण भूमियों का वर्गीकरण (५ महातीर्थ)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHAUBISI_STATISTICS.nirvanaPlaces.map((np, idx) => (
                  <GlassCard key={idx} variant="subtle" className="p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-notoserif font-bold text-amber-300">{np.place}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-gotu font-bold">
                        {np.count} तीर्थंकर
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-gotu mb-2">{np.description}</p>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300 leading-relaxed">
                      {np.tirthankaras}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Colors Distribution */}
            <div>
              <h3 className="text-base font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>शरीर वर्ण (रंग) के अनुसार विभाजन</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHAUBISI_STATISTICS.colors.map((c, idx) => (
                  <GlassCard key={idx} variant="subtle" className="p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-notoserif font-bold text-white">{c.color}</h4>
                      <span className="text-xs font-gotu font-bold text-amber-300">
                        {c.count} तीर्थंकर ({c.percentage})
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300 leading-relaxed">
                      {c.tirthankaras}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Dynasties */}
            <div>
              <h3 className="text-base font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>वंश परंपरा (राजकुल)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHAUBISI_STATISTICS.dynasties.map((d, idx) => (
                  <GlassCard key={idx} variant="subtle" className="p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-notoserif font-bold text-amber-300">{d.name}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-xs font-gotu font-bold">
                        {d.count} तीर्थंकर
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-gotu mb-2">{d.description}</p>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300">
                      {d.tirthankaras}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* 63 Shalaaka Purush */}
            <div>
              <h3 className="text-base font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>६३ शलाका पुरुष (उत्कृष्ट महापुरुष)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CHAUBISI_STATISTICS.shalaakaPurush.map((sp, idx) => (
                  <GlassCard key={idx} variant="subtle" className="p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-notoserif font-bold text-amber-300">{sp.title}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-gotu font-bold">
                        संख्या: {sp.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-gotu leading-relaxed">{sp.description}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MASTER TABLE VIEW (If viewMode === 'table' on Tirthankara eras) */}
        {/* ========================================================================= */}
        {viewMode === 'table' && activeEra !== 'cycle' && activeEra !== 'arghya' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-gotu text-slate-300">
                संपूर्ण तुलनात्मक तालिका • क्षैतिज स्क्रॉल करके सभी स्तंभ देखें
              </span>
              <span className="text-xs font-gotu text-amber-300 font-semibold">
                कुल {activeEra === 'present' ? filteredPresent.length : activeEra === 'past' ? filteredPast.length : activeEra === 'future' ? filteredFuture.length : activeEra === 'videha' ? filteredVideha.length : 14} प्रविष्टियां
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs font-gotu whitespace-nowrap">
                <thead className="bg-white/10 text-amber-300 uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-3.5 text-center">क्र.</th>
                    <th className="py-3 px-3.5">तीर्थंकर नाम</th>
                    <th className="py-3 px-3.5">लांछन</th>
                    <th className="py-3 px-3.5">वर्ण</th>
                    {activeEra === 'future' ? (
                      <>
                        <th className="py-3 px-3.5">पूर्व / वर्तमान भव</th>
                        <th className="py-3 px-3.5">भावी पिता</th>
                        <th className="py-3 px-3.5">भावी माता</th>
                        <th className="py-3 px-3.5">जन्म भूमि</th>
                        <th className="py-3 px-3.5">निर्वाण भूमि</th>
                      </>
                    ) : activeEra === 'videha' ? (
                      <>
                        <th className="py-3 px-3.5">द्वीप / देश</th>
                        <th className="py-3 px-3.5">नगरी</th>
                        <th className="py-3 px-3.5">दिशा</th>
                        <th className="py-3 px-3.5">पिता</th>
                        <th className="py-3 px-3.5">माता</th>
                        <th className="py-3 px-3.5">अवगाहना</th>
                        <th className="py-3 px-3.5">आयु</th>
                      </>
                    ) : (
                      <>
                        <th className="py-3 px-3.5">पिता</th>
                        <th className="py-3 px-3.5">माता</th>
                        <th className="py-3 px-3.5">जन्म नगरी</th>
                        <th className="py-3 px-3.5">निर्वाण भूमि</th>
                        <th className="py-3 px-3.5">आयु मर्यादा</th>
                        {activeEra === 'present' && (
                          <>
                            <th className="py-3 px-3.5">वंश</th>
                            <th className="py-3 px-3.5">केवलज्ञान वृक्ष</th>
                            <th className="py-3 px-3.5">यक्ष / यक्षी</th>
                          </>
                        )}
                      </>
                    )}
                    <th className="py-3 px-3.5 text-center">कार्य</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {activeEra === 'present' &&
                    filteredPresent.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedItem({ type: 'present', data: t })}
                        className="hover:bg-amber-500/10 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-amber-400">{t.number}</td>
                        <td className="py-3 px-3.5 font-notoserif font-bold text-white">{t.nameHindi}</td>
                        <td className="py-3 px-3.5 text-amber-200">{t.symbol}</td>
                        <td className="py-3 px-3.5">{t.color}</td>
                        <td className="py-3 px-3.5">{t.father}</td>
                        <td className="py-3 px-3.5">{t.mother}</td>
                        <td className="py-3 px-3.5">{t.birthPlace}</td>
                        <td className="py-3 px-3.5 text-amber-300">{t.nirvanaPlace}</td>
                        <td className="py-3 px-3.5">{t.age}</td>
                        <td className="py-3 px-3.5">{t.dynasty}</td>
                        <td className="py-3 px-3.5">{t.kevalgyanTree}</td>
                        <td className="py-3 px-3.5">{t.yakshaYakshini}</td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem({ type: 'present', data: t });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px]"
                          >
                            विवरण
                          </button>
                        </td>
                      </tr>
                    ))}

                  {activeEra === 'past' &&
                    filteredPast.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedItem({ type: 'past', data: t })}
                        className="hover:bg-blue-500/10 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-blue-400">{t.number}</td>
                        <td className="py-3 px-3.5 font-notoserif font-bold text-white">{t.nameHindi}</td>
                        <td className="py-3 px-3.5 text-blue-200">{t.symbol}</td>
                        <td className="py-3 px-3.5">{t.color}</td>
                        <td className="py-3 px-3.5">{t.father}</td>
                        <td className="py-3 px-3.5">{t.mother}</td>
                        <td className="py-3 px-3.5">{t.birthPlace}</td>
                        <td className="py-3 px-3.5 text-blue-300">{t.nirvanaPlace}</td>
                        <td className="py-3 px-3.5">{t.age}</td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem({ type: 'past', data: t });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[11px]"
                          >
                            विवरण
                          </button>
                        </td>
                      </tr>
                    ))}

                  {activeEra === 'future' &&
                    filteredFuture.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedItem({ type: 'future', data: t })}
                        className="hover:bg-emerald-500/10 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-emerald-400">{t.number}</td>
                        <td className="py-3 px-3.5 font-notoserif font-bold text-white">{t.nameHindi}</td>
                        <td className="py-3 px-3.5 text-emerald-200">{t.symbol || '—'}</td>
                        <td className="py-3 px-3.5">{t.color}</td>
                        <td className="py-3 px-3.5 font-semibold text-emerald-300">{t.previousSoul}</td>
                        <td className="py-3 px-3.5">{t.futureFather}</td>
                        <td className="py-3 px-3.5">{t.futureMother}</td>
                        <td className="py-3 px-3.5">{t.futureBirthPlace}</td>
                        <td className="py-3 px-3.5 text-emerald-300">{t.futureNirvanaPlace}</td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem({ type: 'future', data: t });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px]"
                          >
                            विवरण
                          </button>
                        </td>
                      </tr>
                    ))}

                  {activeEra === 'videha' &&
                    filteredVideha.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedItem({ type: 'videha', data: t })}
                        className="hover:bg-purple-500/10 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3.5 text-center font-bold text-purple-400">{t.number}</td>
                        <td className="py-3 px-3.5 font-notoserif font-bold text-white">{t.nameHindi}</td>
                        <td className="py-3 px-3.5 text-purple-200">{t.symbol}</td>
                        <td className="py-3 px-3.5">{t.color}</td>
                        <td className="py-3 px-3.5 text-purple-300">
                          {t.continent} • {t.country}
                        </td>
                        <td className="py-3 px-3.5">{t.city}</td>
                        <td className="py-3 px-3.5">{t.direction}</td>
                        <td className="py-3 px-3.5">{t.father}</td>
                        <td className="py-3 px-3.5">{t.mother}</td>
                        <td className="py-3 px-3.5">{t.height}</td>
                        <td className="py-3 px-3.5">{t.age}</td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem({ type: 'videha', data: t });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px]"
                          >
                            विवरण
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CARDS VIEW (If viewMode === 'cards' on Tirthankara eras) */}
        {/* ========================================================================= */}
        {viewMode === 'cards' && activeEra !== 'cycle' && activeEra !== 'arghya' && (
          <>
            {/* 1. वर्तमान चौबीसी (Present 24 Tirthankaras) */}
            {activeEra === 'present' && (
              <div>
                <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-notoserif font-bold text-amber-200">
                      वर्तमान चौबीसी (अवसर्पिणी चतुर्थ काल के २४ तीर्थंकर)
                    </h2>
                    <p className="text-xs text-slate-300/90 font-gotu mt-0.5 leading-relaxed">
                      भगवान आदिनाथ (ऋषभदेव) से लेकर भगवान महावीर स्वामी तक। किसी भी तीर्थंकर कार्ड पर
                      क्लिक करके उनके माता-पिता, पंचकल्याणक भूमियां, अष्टद्रव्य मंत्र, विस्तृत चरित्र एवं
                      संपूर्ण अर्घावली का अध्ययन करें।
                    </p>
                  </div>
                </div>

                {filteredPresent.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-gotu">
                    कोई तीर्थंकर नहीं मिले। कृपया अन्य शब्द खोजें।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {filteredPresent.map((t) => (
                      <GlassCard
                        key={t.id}
                        variant="gilded"
                        tilt
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedItem({ type: 'present', data: t });
                        }}
                        className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer group hover:border-amber-400/60 transition-all duration-200 rounded-2xl border-white/10"
                      >
                        <div>
                          {/* Top Bar: Number & Symbol */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-notoserif font-bold text-xs flex items-center justify-center shadow-inner">
                                {t.number}
                              </span>
                              <span className="text-[11px] font-gotu px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                                लांछन: <strong className="text-amber-300">{t.symbol}</strong>
                              </span>
                            </div>
                            <span className="text-xs font-gotu px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-400/20">
                              {t.color}
                            </span>
                          </div>

                          {/* Name & Subtitle */}
                          <h3 className="text-base sm:text-lg font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                            {t.nameHindi}
                          </h3>
                          <p className="text-xs text-amber-400/80 font-gotu mt-0.5">
                            {t.subtitleHindi}
                          </p>

                          {/* Parents Info */}
                          <div className="mt-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>
                                <strong className="text-slate-400">पिता:</strong> {t.father}
                              </span>
                              <span>
                                <strong className="text-slate-400">माता:</strong> {t.mother}
                              </span>
                            </div>
                          </div>

                          {/* Key Facts */}
                          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] font-gotu text-slate-300/85">
                            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">जन्म नगरी</span>
                              <span className="font-medium text-slate-200 truncate block">
                                {t.birthPlace}
                              </span>
                            </div>
                            <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">निर्वाण भूमि</span>
                              <span className="font-medium text-amber-300 truncate block">
                                {t.nirvanaPlace}
                              </span>
                            </div>
                          </div>

                          {/* Tree & Yaksh */}
                          <div className="mt-2 p-2 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] font-gotu text-slate-300 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[10px]">केवलज्ञान वृक्ष:</span>
                              <span className="text-amber-200 font-medium">{t.kevalgyanTree}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[10px]">यक्ष व यक्षी:</span>
                              <span className="text-slate-200 truncate max-w-[180px]">{t.yakshaYakshini}</span>
                            </div>
                          </div>

                          {/* Bio Text (NO CLAMPING) */}
                          <p className="text-xs text-slate-300/85 font-gotu mt-2.5 leading-relaxed">
                            {t.bioHindi}
                          </p>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-gotu text-amber-300 group-hover:text-amber-200">
                          <span>सम्पूर्ण विवरण व अर्घ्य</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. भूतकाल चौबीसी (Past 24 Tirthankaras) */}
            {activeEra === 'past' && (
              <div>
                <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-transparent border border-blue-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 border border-blue-500/30">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-notoserif font-bold text-blue-200">
                      भूतकाल चौबीसी (अतीत अवसर्पिणी काल के २४ तीर्थंकर)
                    </h2>
                    <p className="text-xs text-slate-300/90 font-gotu mt-0.5 leading-relaxed">
                      भरत क्षेत्र में पिछले काल चक्र के २४ तीर्थंकर भगवान, जिनका प्रारंभ श्री
                      निर्वाणनाथ से होकर श्री शांतनाथ भगवान पर संपन्न हुआ था। कार्ड पर क्लिक करके संपूर्ण
                      माता-पिता, भूमियां, विस्तृत जीवन चरित्र एवं अर्घ्य पढ़ें।
                    </p>
                  </div>
                </div>

                {filteredPast.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-gotu">
                    कोई तीर्थंकर नहीं मिले।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {filteredPast.map((t) => (
                      <GlassCard
                        key={t.id}
                        variant="subtle"
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedItem({ type: 'past', data: t });
                        }}
                        className="p-4 sm:p-5 flex flex-col justify-between group hover:border-blue-400/50 transition-all rounded-2xl border-white/10 cursor-pointer"
                      >
                        <div>
                          {/* Top Bar: Number & Symbol */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 font-notoserif font-bold text-xs flex items-center justify-center shadow-inner">
                                {t.number}
                              </span>
                              <span className="text-[11px] font-gotu px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                अतीत तीर्थंकर
                              </span>
                            </div>
                            <span className="text-xs font-gotu text-slate-300">
                              लांछन: <strong className="text-blue-300">{t.symbol}</strong>
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="text-base sm:text-lg font-notoserif font-bold text-white group-hover:text-blue-200 transition-colors">
                            {t.nameHindi}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-gotu italic mt-0.5">
                            {t.nameEn}
                          </p>

                          {/* Parents */}
                          <div className="mt-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300">
                            <div className="flex items-center justify-between">
                              <span>
                                <strong className="text-slate-400">पिता:</strong> {t.father}
                              </span>
                              <span>
                                <strong className="text-slate-400">माता:</strong> {t.mother}
                              </span>
                            </div>
                          </div>

                          {/* Places & Age */}
                          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] font-gotu text-slate-300">
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">जन्म नगरी</span>
                              <span className="truncate block font-medium">{t.birthPlace}</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">निर्वाण भूमि</span>
                              <span className="truncate block font-medium text-blue-300">
                                {t.nirvanaPlace}
                              </span>
                            </div>
                          </div>

                          {/* Age and Symbol Meaning */}
                          <div className="mt-2 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[10px]">आयु मर्यादा:</span>
                              <span className="text-blue-200 font-medium">{t.age}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[10px]">प्रतीक भाव:</span>
                              <span className="text-slate-200">{t.symbolMeaning}</span>
                            </div>
                          </div>

                          {/* Description (NO CLAMPING) */}
                          <p className="text-xs text-slate-300/85 font-gotu mt-2.5 leading-relaxed">
                            {t.detailedBio}
                          </p>
                        </div>

                        {/* Salutation & View Details */}
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-gotu text-blue-300 truncate">
                              {t.salutation}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(t.salutation, t.id);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                              title="मंत्र कॉपी करें"
                              aria-label="मंत्र कॉपी करें"
                            >
                              {copiedMantra === t.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs font-gotu text-blue-300/90 group-hover:text-blue-200">
                            <span>विस्तृत विवरण व अर्घ्य</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. भविष्यत् चौबीसी (Future 24 Tirthankaras) */}
            {activeEra === 'future' && (
              <div>
                <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-notoserif font-bold text-emerald-200">
                      भविष्यत् काल चौबीसी (आगामी उत्सर्पिणी काल के २४ तीर्थंकर)
                    </h2>
                    <p className="text-xs text-slate-300/90 font-gotu mt-0.5 leading-relaxed">
                      आगामी उत्सर्पिणी काल में होने वाले २४ तीर्थंकर। प्रथम तीर्थंकर श्री महापद्मनाथ
                      (राजा श्रेणिक का जीव) से लेकर अंतिम तीर्थंकर श्री अनंतवीर्यनाथ भगवान तक। यहाँ उनके
                      वर्तमान/पूर्व भव एवं आगामी माता-पिता व कल्याणक भूमियों का संपूर्ण शास्त्रीय विवरण
                      दिया गया है।
                    </p>
                  </div>
                </div>

                {filteredFuture.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-gotu">
                    कोई तीर्थंकर नहीं मिले।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {filteredFuture.map((t) => (
                      <GlassCard
                        key={t.id}
                        variant="subtle"
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedItem({ type: 'future', data: t });
                        }}
                        className="p-4 sm:p-5 flex flex-col justify-between group hover:border-emerald-400/50 transition-all rounded-2xl border-white/10 cursor-pointer"
                      >
                        <div>
                          {/* Top Bar: Number & Tag */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-notoserif font-bold text-xs flex items-center justify-center shadow-inner">
                                {t.number}
                              </span>
                              <span className="text-[11px] font-gotu px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                भावी तीर्थंकर
                              </span>
                            </div>
                            {t.symbol && (
                              <span className="text-xs font-gotu text-slate-300">
                                लांछन: <strong className="text-emerald-300">{t.symbol}</strong>
                              </span>
                            )}
                          </div>

                          {/* Future Name */}
                          <h3 className="text-base sm:text-lg font-notoserif font-bold text-white group-hover:text-emerald-200 transition-colors">
                            {t.nameHindi}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-gotu italic mt-0.5">
                            {t.nameEn}
                          </p>

                          {/* Previous Soul / Incarnation Card */}
                          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                            <div className="flex items-center gap-1.5 text-xs font-gotu font-bold text-emerald-300 mb-1">
                              <Shield className="w-3.5 h-3.5 text-emerald-400" />
                              <span>पूर्व भव: {t.previousSoul}</span>
                            </div>
                            <p className="text-[11px] text-slate-300/90 font-gotu leading-relaxed">
                              {t.previousSoulDetails}
                            </p>
                          </div>

                          {/* Future Parents & Places */}
                          <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] font-gotu text-slate-300">
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">भावी माता-पिता</span>
                              <span className="truncate block font-medium">
                                {t.futureFather} • {t.futureMother}
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">जन्म व मोक्ष</span>
                              <span className="truncate block font-medium text-emerald-300">
                                {t.futureBirthPlace} • {t.futureNirvanaPlace}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300/80 font-gotu mt-2.5 leading-relaxed">
                            {t.detailedBio}
                          </p>
                        </div>

                        {/* Salutation & View Details */}
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-gotu text-emerald-300 truncate">
                              {t.salutation}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(t.salutation, t.id);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                              title="मंत्र कॉपी करें"
                              aria-label="मंत्र कॉपी करें"
                            >
                              {copiedMantra === t.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs font-gotu text-emerald-300/90 group-hover:text-emerald-200">
                            <span>विस्तृत विवरण व अर्घ्य</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. विद्यमान २० तीर्थंकर (Videha Kshetra) */}
            {activeEra === 'videha' && (
              <div>
                <div className="mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-transparent border border-purple-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-notoserif font-bold text-purple-200">
                      विद्यमान २० तीर्थंकर (महाविदेह क्षेत्र में साक्षात् विहरमान)
                    </h2>
                    <p className="text-xs text-slate-300/90 font-gotu mt-0.5 leading-relaxed">
                      ढाई द्वीप के महाविदेह क्षेत्रों (जम्बूद्वीप, धातकीखंड, पुष्करार्ध) में सदैव चतुर्थ
                      काल जैसी स्थिति रहती है। यहाँ २० तीर्थंकर सदैव साक्षात् विराजमान रहते हैं। प्रथम
                      तीर्थंकर भगवान सीमंधर स्वामी हैं। कार्ड पर क्लिक करके देश, नगर, माता-पिता, अवगाहना व
                      अर्घ्य पढ़ें।
                    </p>
                  </div>
                </div>

                {filteredVideha.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 font-gotu">
                    कोई तीर्थंकर नहीं मिले।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                    {filteredVideha.map((t) => (
                      <GlassCard
                        key={t.id}
                        variant="subtle"
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedItem({ type: 'videha', data: t });
                        }}
                        className="p-4 sm:p-5 flex flex-col justify-between group hover:border-purple-400/50 transition-all rounded-2xl border-white/10 cursor-pointer"
                      >
                        <div>
                          {/* Top Bar: Number & Continent */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-notoserif font-bold text-xs flex items-center justify-center shadow-inner">
                                {t.number}
                              </span>
                              <span className="text-[11px] font-gotu px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                {t.direction}
                              </span>
                            </div>
                            <span className="text-xs font-gotu text-purple-300 truncate max-w-[150px]">
                              {t.continent}
                            </span>
                          </div>

                          {/* Name */}
                          <h3 className="text-base sm:text-lg font-notoserif font-bold text-white group-hover:text-purple-200 transition-colors">
                            {t.nameHindi}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-gotu italic mt-0.5">
                            {t.nameEn}
                          </p>

                          {/* Location Details */}
                          <div className="mt-2.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-gotu text-slate-300">
                            <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-0.5">
                              <MapPin className="w-3 h-3 text-purple-400" />
                              <span>विराजमान देश व नगरी</span>
                            </div>
                            <span className="text-purple-200 font-medium">
                              {t.country} • नगरी: {t.city}
                            </span>
                          </div>

                          {/* Parents & Physical Stats */}
                          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] font-gotu text-slate-300">
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">माता-पिता</span>
                              <span className="truncate block font-medium">
                                {t.father} • {t.mother}
                              </span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-slate-400 text-[10px] block">अवगाहना व आयु</span>
                              <span className="truncate block font-medium text-purple-300">
                                {t.height} • {t.age}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300/85 font-gotu mt-2.5 leading-relaxed">
                            {t.detailedBio}
                          </p>
                        </div>

                        {/* Salutation & View Details */}
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-gotu text-purple-300 truncate">
                              {t.salutation}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(t.salutation, t.id);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
                              title="मंत्र कॉपी करें"
                              aria-label="मंत्र कॉपी करें"
                            >
                              {copiedMantra === t.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs font-gotu text-purple-300/90 group-hover:text-purple-200">
                            <span>विस्तृत विवरण व अर्घ्य</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* 5. कालचक्र, १४ कुलकर, १० कल्पवृक्ष एवं तीस चौबीसी */}
        {/* ========================================================================= */}
        {activeEra === 'cycle' && (
          <div className="space-y-6">
            {/* Introductory Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-stone-900 to-slate-900 border border-amber-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40 shadow-inner">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-notoserif font-bold text-amber-200">
                    जैन कालचक्र, कल्पवृक्ष व कुलकर परंपरा
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-gotu">
                    अवसर्पिणी (ह्रास काल) व उत्सर्पिणी (विकास काल) — २० कोड़ा-कोड़ी सागरोपम का अनादि चक्र
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
                जैन दर्शन के अनुसार समय अनादि और अनंत है। समय का एक कल्पकाल दो भागों में विभक्त होता
                है: <strong>अवसर्पिणी</strong> (जिसमें आयु, शक्ति, काया और सुखों का ह्रास होता है)
                तथा <strong>उत्सर्पिणी</strong> (जिसमें निरंतर उत्थान और विकास होता है)। प्रत्येक में
                ६-६ काल होते हैं, कुल १२ काल मिलकर २० कोड़ा-कोड़ी सागरोपम का एक कल्पकाल बनाते हैं।
              </p>

              {/* Sub-tabs for Cycle Navigation */}
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCycleSubTab('avasarpini');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeCycleSubTab === 'avasarpini'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  अवसर्पिणी (६ काल)
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCycleSubTab('utsarpini');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeCycleSubTab === 'utsarpini'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  उत्सर्पिणी (६ काल)
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCycleSubTab('kulakaras');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeCycleSubTab === 'kulakaras'
                      ? 'bg-indigo-500 text-white font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  १४ कुलकर (मनु)
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCycleSubTab('kalpavriksha');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeCycleSubTab === 'kalpavriksha'
                      ? 'bg-emerald-500 text-white font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  १० कल्पवृक्ष विवरण
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCycleSubTab('tees');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeCycleSubTab === 'tees'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  तीस चौबीसी (७२०)
                </button>
              </div>
            </div>

            {/* Avasarpini (६ काल) */}
            {activeCycleSubTab === 'avasarpini' && (
              <div>
                <h3 className="text-base sm:text-lg font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>अवसर्पिणी काल के ६ भेद (ह्रास काल — १० कोड़ा-कोड़ी सागरोपम)</span>
                </h3>

                <div className="space-y-3">
                  {KAAL_CHAKRA_ERAS.map((era) => (
                    <GlassCard
                      key={era.number}
                      variant={era.tirthankarOccurence ? 'gilded' : 'subtle'}
                      className={`p-4 sm:p-5 rounded-2xl border ${
                        era.number === 5
                          ? 'border-amber-400/50 bg-amber-500/5'
                          : era.tirthankarOccurence
                          ? 'border-amber-500/30'
                          : 'border-white/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-notoserif font-bold text-white">
                            {era.nameHindi}
                          </span>
                          {era.number === 5 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-gotu font-bold border border-amber-400/40 animate-pulse">
                              वर्तमान काल
                            </span>
                          )}
                          {era.tirthankarOccurence && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-gotu font-bold border border-emerald-400/30">
                              तीर्थंकर अवतरण काल
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-gotu text-slate-400">{era.duration}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed mb-3">
                        {era.characteristics}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-gotu text-slate-300 pt-2 border-t border-white/5">
                        <div>
                          <span className="text-slate-400 block text-[10px]">शरीर की ऊँचाई</span>
                          <span className="text-white font-medium">{era.bodyHeight}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">आयु मर्यादा</span>
                          <span className="text-white font-medium">{era.lifespan}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">धर्म स्थिति</span>
                          <span className="text-amber-300 font-medium truncate block">
                            {era.dharmaState}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">आहार व जीवनशैली</span>
                          <span className="text-slate-200 font-medium truncate block">
                            {era.foodAndLifestyle}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Utsarpini (६ काल) */}
            {activeCycleSubTab === 'utsarpini' && (
              <div>
                <h3 className="text-base sm:text-lg font-notoserif font-bold text-white mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-emerald-400" />
                  <span>उत्सर्पिणी काल के ६ भेद (विकास काल — १० कोड़ा-कोड़ी सागरोपम)</span>
                </h3>

                <div className="space-y-3">
                  {UTSARPINI_ERAS.map((era) => (
                    <GlassCard
                      key={era.number}
                      variant={era.tirthankarOccurence ? 'gilded' : 'subtle'}
                      className={`p-4 sm:p-5 rounded-2xl border ${
                        era.tirthankarOccurence ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-notoserif font-bold text-white">
                            {era.nameHindi}
                          </span>
                          {era.tirthankarOccurence && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-gotu font-bold border border-emerald-400/30">
                              भावी २४ तीर्थंकर अवतरण
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-gotu text-slate-400">{era.duration}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed mb-3">
                        {era.characteristics}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-gotu text-slate-300 pt-2 border-t border-white/5">
                        <div>
                          <span className="text-slate-400 block text-[10px]">शरीर की ऊँचाई</span>
                          <span className="text-white font-medium">{era.bodyHeight}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">आयु मर्यादा</span>
                          <span className="text-white font-medium">{era.lifespan}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">धर्म स्थिति</span>
                          <span className="text-emerald-300 font-medium truncate block">
                            {era.dharmaState}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">आहार व जीवनशैली</span>
                          <span className="text-slate-200 font-medium truncate block">
                            {era.foodAndLifestyle}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* 10 Kalpavrikshas Section */}
            {activeCycleSubTab === 'kalpavriksha' && (
              <div>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-slate-900 border border-emerald-500/30 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
                      <Trees className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-notoserif font-bold text-emerald-200">
                        भोगभूमि के दस कल्पवृक्ष (दिव्य वृक्ष)
                      </h3>
                      <p className="text-xs text-slate-300 font-gotu">
                        सुषमा-सुषमा, सुषमा और सुषमा-दुःषमा काल में स्वतः समस्त सुख प्रदान करने वाले १० वृक्ष
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                    भोगभूमि में मनुष्यों को आजीविका हेतु कोई श्रम, कृषि या व्यापार नहीं करना पड़ता था।
                    १० प्रकार के कल्पवृक्ष संकल्प मात्र से उत्तम पेय, आभूषण, संगीत वाद्य, वस्त्र, प्रासाद
                    और भोजन प्रदान करते थे।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEN_KALPAVRIKSHAS.map((kv) => (
                    <GlassCard
                      key={kv.number}
                      variant="subtle"
                      className="p-4 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-notoserif font-bold text-xs flex items-center justify-center">
                            {kv.number}
                          </span>
                          <h4 className="text-sm font-notoserif font-bold text-white">
                            {kv.nameHindi}
                          </h4>
                        </div>
                        <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                          {kv.boon}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                        {kv.description}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* 14 Kulakaras Section */}
            {activeCycleSubTab === 'kulakaras' && (
              <div>
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-stone-900 to-slate-900 border border-indigo-500/30 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-notoserif font-bold text-indigo-200">
                        चौदह कुलकर (१४ मनु) परंपरा
                      </h3>
                      <p className="text-xs text-slate-300 font-gotu">
                        भोगभूमि से कर्मभूमि के संक्रमण काल में व्यवस्थापक महापुरुष
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                    तृतीय काल (सुषमा-दुःषमा) के अंतिम भाग में जब कल्पवृक्षों का लोप होने लगा और आकाश में
                    सूर्य, चंद्रमा व नक्षत्र दिखाई दिए, तब भयभीत और असहाय प्रजा को व्यवस्था, संयम और
                    जीवन जीने की कला सिखाने वाले १४ कुलकर हुए। इन्होंने क्रमशः 'हाकार', 'माकार' और
                    'धिक्कार' रूपी तीन दण्डनीतियों की स्थापना की।
                  </p>

                  {/* 3 Penal System Badges */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-gotu">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-amber-300 font-bold block mb-0.5">१. 'हा' दण्डनीति</span>
                      <span className="text-slate-300 text-[11px]">
                        प्रथम ५ कुलकरों के समय: 'हा! तुमने ऐसा क्यों किया' कहने मात्र से लज्जित होकर सुधार।
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-emerald-300 font-bold block mb-0.5">२. 'मा' दण्डनीति</span>
                      <span className="text-slate-300 text-[11px]">
                        मध्य के ५ कुलकरों के समय: 'मा' (अर्थात् ऐसा अनुचित कार्य मत करो) का निषेध।
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-rose-300 font-bold block mb-0.5">३. 'धिक' दण्डनीति</span>
                      <span className="text-slate-300 text-[11px]">
                        अंतिम ४ कुलकरों के समय: 'धिक' (तुम्हें धिक्कार है) कहकर अपराध का निवारण।
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kulakaras Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredKulakaras.map((k) => (
                    <GlassCard
                      key={k.number}
                      variant="subtle"
                      className="p-4 rounded-2xl border border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-notoserif font-bold text-xs flex items-center justify-center">
                              {k.number}
                            </span>
                            <h4 className="text-sm font-notoserif font-bold text-white">
                              {k.nameHindi}
                            </h4>
                          </div>
                          <span className="text-[10px] font-gotu px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                            {k.policy}
                          </span>
                        </div>

                        <div className="text-[11px] font-gotu text-slate-400 mb-2 flex items-center gap-3">
                          <span>
                            <strong>पूर्वज:</strong> {k.parent}
                          </span>
                          <span>•</span>
                          <span>{k.era}</span>
                        </div>

                        <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                          {k.contribution}
                        </p>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}

            {/* Tees Chaubisi Section */}
            {activeCycleSubTab === 'tees' && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-stone-900 to-black border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-gotu font-bold mb-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>तीस चौबीसी (७२० तीर्थंकर) महादर्शन</span>
                </div>

                <h4 className="text-base sm:text-lg font-notoserif font-bold text-white mb-2">
                  {TEES_CHAUBISI_VANDANA.title}
                </h4>
                <p className="text-xs text-slate-300 font-gotu mb-4">
                  {TEES_CHAUBISI_VANDANA.subtitle}
                </p>

                {/* Shloka Box */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/25 text-center font-notoserif text-amber-100 text-sm sm:text-base leading-loose mb-4">
                  {TEES_CHAUBISI_VANDANA.shloka.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>

                {/* Table Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {TEES_CHAUBISI_VANDANA.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-gotu"
                    >
                      <div className="font-bold text-amber-300 text-sm mb-1">{item.area}</div>
                      <div className="text-slate-300 flex justify-between">
                        <span>अतीत: {item.past}</span>
                        <span>वर्तमान: {item.present}</span>
                        <span>भविष्य: {item.future}</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-white/10 text-right font-bold text-white">
                        कुल = {item.total} तीर्थंकर
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 font-gotu italic text-center mb-4">
                  {TEES_CHAUBISI_VANDANA.videhaContinual}
                </p>

                {/* Maharghya Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-400/30 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-400 font-gotu block uppercase tracking-wider">
                      तीस चौबीसी महार्घ्य मंत्र
                    </span>
                    <div className="text-xs sm:text-sm font-notoserif font-bold text-amber-200 mt-0.5">
                      {TEES_CHAUBISI_VANDANA.maharghya}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(TEES_CHAUBISI_VANDANA.maharghya, 'tees-maharghya')
                    }
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition-colors shrink-0"
                    title="महार्घ्य कॉपी करें"
                  >
                    {copiedMantra === 'tees-maharghya' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. संपूर्ण अर्घ्यावली संग्रह (Arghyavali Collection) */}
        {/* ========================================================================= */}
        {activeEra === 'arghya' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-orange-500/10 border border-rose-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
                  <Scroll className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-notoserif font-bold text-rose-200">
                    त्रिकाल तीर्थंकर संपूर्ण अर्घ्यावली संग्रह (९३ अर्घ्य)
                  </h2>
                  <p className="text-xs text-slate-300 font-gotu">
                    वर्तमान, भूत, भविष्यत, विदेह एवं तीस चौबीसी के संपूर्ण पावन अर्घ्य मंत्र व छंद
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                यहाँ प्रत्येक तीर्थंकर भगवान का अर्घ्य समर्पण पाठ छंद एवं बीज मंत्र सहित दिया गया है।
                नित्य पूजन, स्वाध्याय व विधान में इनका पाठ आत्म-कल्याणकारी है।
              </p>

              {/* Sub-tabs for Arghya Categories */}
              <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveArghyaTab('present');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeArghyaTab === 'present'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  वर्तमान चौबीसी २४ अर्घ्य
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveArghyaTab('past');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeArghyaTab === 'past'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  भूतकाल २४ अर्घ्य
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveArghyaTab('future');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeArghyaTab === 'future'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  भविष्यत् २४ अर्घ्य
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveArghyaTab('videha');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeArghyaTab === 'videha'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  विद्यमान २० अर्घ्य
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveArghyaTab('tees');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold transition-all ${
                    activeArghyaTab === 'tees'
                      ? 'bg-rose-500 text-white font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  तीस चौबीसी (७२०) महार्घ्य
                </button>
              </div>
            </div>

            {/* List of Arghyas based on active tab */}
            {activeArghyaTab === 'present' && (
              <div className="space-y-3.5">
                {PRESENT_TIRTHANKARA_ARGHYAS.map((t) => (
                  <GlassCard
                    key={t.number}
                    variant="subtle"
                    className="p-4 sm:p-5 rounded-2xl border border-amber-500/25 hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-notoserif font-bold text-xs flex items-center justify-center">
                          {t.number}
                        </span>
                        <h4 className="text-sm sm:text-base font-notoserif font-bold text-white">
                          {t.nameHindi} का अर्घ्य
                        </h4>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.arghya, `arghya-pres-${t.number}`, true)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-gotu text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedArghya === `arghya-pres-${t.number}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हुआ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>अर्घ्य कॉपी</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-notoserif text-sm sm:text-base text-amber-100/90 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-amber-500/40">
                      {t.arghya}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeArghyaTab === 'past' && (
              <div className="space-y-3.5">
                {PAST_TIRTHANKARAS.map((t) => (
                  <GlassCard
                    key={t.id}
                    variant="subtle"
                    className="p-4 sm:p-5 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-notoserif font-bold text-xs flex items-center justify-center">
                          {t.number}
                        </span>
                        <h4 className="text-sm sm:text-base font-notoserif font-bold text-white">
                          {t.nameHindi} का अर्घ्य
                        </h4>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.arghya, `arghya-${t.id}`, true)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-gotu text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedArghya === `arghya-${t.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हुआ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>अर्घ्य कॉपी</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-notoserif text-sm sm:text-base text-blue-100/90 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-blue-500/40">
                      {t.arghya}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeArghyaTab === 'future' && (
              <div className="space-y-3.5">
                {FUTURE_TIRTHANKARAS.map((t) => (
                  <GlassCard
                    key={t.id}
                    variant="subtle"
                    className="p-4 sm:p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-notoserif font-bold text-xs flex items-center justify-center">
                          {t.number}
                        </span>
                        <h4 className="text-sm sm:text-base font-notoserif font-bold text-white">
                          भावी तीर्थंकर {t.nameHindi} का अर्घ्य
                        </h4>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.arghya, `arghya-${t.id}`, true)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-gotu text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedArghya === `arghya-${t.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हुआ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>अर्घ्य कॉपी</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-notoserif text-sm sm:text-base text-emerald-100/90 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-emerald-500/40">
                      {t.arghya}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeArghyaTab === 'videha' && (
              <div className="space-y-3.5">
                {VIDHYAMAN_TIRTHANKARAS.map((t) => (
                  <GlassCard
                    key={t.id}
                    variant="subtle"
                    className="p-4 sm:p-5 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-notoserif font-bold text-xs flex items-center justify-center">
                          {t.number}
                        </span>
                        <h4 className="text-sm sm:text-base font-notoserif font-bold text-white">
                          विद्यमान {t.nameHindi} का अर्घ्य
                        </h4>
                      </div>
                      <button
                        onClick={() => copyToClipboard(t.arghya, `arghya-${t.id}`, true)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-gotu text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedArghya === `arghya-${t.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">कॉपी हुआ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>अर्घ्य कॉपी</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-notoserif text-sm sm:text-base text-purple-100/90 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-purple-500/40">
                      {t.arghya}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {activeArghyaTab === 'tees' && (
              <div className="space-y-4">
                <GlassCard
                  variant="gilded"
                  className="p-5 sm:p-6 rounded-2xl border border-amber-500/40"
                >
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-base sm:text-lg font-notoserif font-bold text-amber-200">
                        तीस चौबीसी (७२० तीर्थंकर) महापूजा अर्घ्य
                      </h4>
                      <p className="text-xs text-slate-300 font-gotu">
                        पंच भरत एवं पंच ऐरावत के समस्त त्रिकाल तीर्थंकरों को सामूहिक अर्घ्य
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${TEES_CHAUBISI_VANDANA.shloka}\n\n${TEES_CHAUBISI_VANDANA.maharghya}`,
                          'tees-full-arghya',
                          true
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-gotu text-amber-300 border border-amber-400/30 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedArghya === 'tees-full-arghya' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">कॉपी हुआ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>संपूर्ण अर्घ्य कॉपी</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/20 font-notoserif text-sm sm:text-base text-amber-100 leading-loose text-center mb-4">
                    {TEES_CHAUBISI_VANDANA.shloka.split('\n').map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-notoserif font-bold text-amber-300 text-center">
                    {TEES_CHAUBISI_VANDANA.maharghya}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        )}

      {/* Interactive Detail Modal for any Tirthankar */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl z-10 my-auto"
            >
              <GlassCard className="p-4 sm:p-6 border-white/20 bg-[#0c121e] shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl max-h-[min(90vh,750px)] flex flex-col">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer z-10"
                  aria-label="बंद करें"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0 pt-1 space-y-4">
                  {/* Modal Header */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-gotu font-semibold mb-2 bg-amber-500/15 border border-amber-400/30 text-amber-300">
                      {selectedItem.type === 'past' && 'भूतकाल तीर्थंकर'}
                      {selectedItem.type === 'future' && 'भविष्यत् काल तीर्थंकर'}
                      {selectedItem.type === 'videha' && 'विद्यमान तीर्थंकर (महाविदेह)'}
                      {selectedItem.type === 'present' && 'वर्तमान तीर्थंकर'}
                      <span>• क्रमांक {selectedItem.data.number}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white">
                      {selectedItem.data.nameHindi}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-gotu italic mt-0.5">
                      {selectedItem.data.nameEn}
                    </p>
                  </div>

                  {/* Badges Row */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-gotu">
                    {'symbol' in selectedItem.data && selectedItem.data.symbol && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        लांछन: <strong className="text-amber-300">{selectedItem.data.symbol}</strong>
                      </span>
                    )}
                    {'color' in selectedItem.data && selectedItem.data.color && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        वर्ण: <strong className="text-amber-300">{selectedItem.data.color}</strong>
                      </span>
                    )}
                    {'age' in selectedItem.data && selectedItem.data.age && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        आयु: <strong className="text-amber-300">{selectedItem.data.age}</strong>
                      </span>
                    )}
                    {'dynasty' in selectedItem.data && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        वंश: <strong className="text-amber-300">{(selectedItem.data as any).dynasty}</strong>
                      </span>
                    )}
                    {'height' in selectedItem.data && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                        अवगाहना:{' '}
                        <strong className="text-amber-300">{selectedItem.data.height}</strong>
                      </span>
                    )}
                  </div>

                  {/* Future Tirthankar Previous Soul Box */}
                  {selectedItem.type === 'future' && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-1.5 text-xs font-gotu font-bold text-emerald-300 mb-1">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>वर्तमान / पूर्व भव: {selectedItem.data.previousSoul}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-gotu leading-relaxed">
                        {selectedItem.data.previousSoulDetails}
                      </p>
                    </div>
                  )}

                  {/* Present Tirthankar Panchakalyanak Dates Box */}
                  {selectedItem.type === 'present' && 'kalyanak' in selectedItem.data && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      <div className="text-xs font-gotu font-bold text-amber-300 mb-2 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>पावन पंचकल्याणक तिथियां</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px] font-gotu text-slate-300">
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <span className="text-amber-400/80 block text-[10px]">१. गर्भ</span>
                          <span className="font-medium text-white">{selectedItem.data.kalyanak.garbha}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <span className="text-amber-400/80 block text-[10px]">२. जन्म</span>
                          <span className="font-medium text-white">{selectedItem.data.kalyanak.janma}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <span className="text-amber-400/80 block text-[10px]">३. तप (दीक्षा)</span>
                          <span className="font-medium text-white">{selectedItem.data.kalyanak.tap}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <span className="text-amber-400/80 block text-[10px]">४. केवलज्ञान</span>
                          <span className="font-medium text-white">{selectedItem.data.kalyanak.gyan}</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5 col-span-2 sm:col-span-1">
                          <span className="text-amber-400/80 block text-[10px]">५. मोक्ष</span>
                          <span className="font-medium text-amber-300">{selectedItem.data.kalyanak.moksha}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Parents and Geography Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-gotu">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400 text-[11px] mb-1 font-semibold">
                        पूज्य माता-पिता
                      </div>
                      <div className="text-slate-200">
                        {selectedItem.type === 'future' ? (
                          <>
                            <div>
                              <strong>भावी पिता:</strong> {selectedItem.data.futureFather}
                            </div>
                            <div>
                              <strong>भावी माता:</strong> {selectedItem.data.futureMother}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <strong>पिता:</strong> {(selectedItem.data as any).father}
                            </div>
                            <div>
                              <strong>माता:</strong> {(selectedItem.data as any).mother}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-slate-400 text-[11px] mb-1 font-semibold">
                        {selectedItem.type === 'videha' ? 'विराजमान क्षेत्र' : 'कल्याणक भूमियां'}
                      </div>
                      <div className="text-slate-200">
                        {selectedItem.type === 'future' && (
                          <>
                            <div>
                              <strong>जन्म भूमि:</strong> {selectedItem.data.futureBirthPlace}
                            </div>
                            <div>
                              <strong>मोक्ष भूमि:</strong> {selectedItem.data.futureNirvanaPlace}
                            </div>
                          </>
                        )}
                        {selectedItem.type === 'videha' && (
                          <>
                            <div>
                              <strong>द्वीप व देश:</strong> {selectedItem.data.continent} •{' '}
                              {selectedItem.data.country}
                            </div>
                            <div>
                              <strong>नगरी व दिशा:</strong> {selectedItem.data.city} •{' '}
                              {selectedItem.data.direction}
                            </div>
                          </>
                        )}
                        {(selectedItem.type === 'past' || selectedItem.type === 'present') && (
                          <>
                            <div>
                              <strong>जन्म नगरी:</strong> {(selectedItem.data as any).birthPlace}
                            </div>
                            <div>
                              <strong>निर्वाण भूमि:</strong>{' '}
                              {(selectedItem.data as any).nirvanaPlace}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bodhi Tree & Yaksh-Yakshini for Present */}
                  {selectedItem.type === 'present' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-gotu">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-slate-400 text-[10px] block">केवलज्ञान (बोधि) वृक्ष:</span>
                        <span className="font-semibold text-amber-200">{selectedItem.data.kevalgyanTree}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-slate-400 text-[10px] block">शासन देव (यक्ष व यक्षी):</span>
                        <span className="font-semibold text-slate-200">{selectedItem.data.yakshaYakshini}</span>
                      </div>
                    </div>
                  )}

                  {/* Detailed Biography */}
                  {('detailedBio' in selectedItem.data || 'bioHindi' in selectedItem.data || 'description' in selectedItem.data) && (
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-1.5 text-xs font-gotu font-bold text-amber-300 mb-1.5">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>विस्तृत शास्त्रीय परिचय व चरित्र</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-gotu leading-relaxed">
                        {selectedItem.type === 'present'
                          ? selectedItem.data.bioHindi
                          : 'detailedBio' in selectedItem.data && selectedItem.data.detailedBio
                          ? selectedItem.data.detailedBio
                          : (selectedItem.data as any).description}
                      </p>
                    </div>
                  )}

                  {/* Full Individual Arghya */}
                  {('arghya' in selectedItem.data || selectedItem.type === 'present') && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-400/30">
                      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-1.5 text-xs font-gotu font-bold text-amber-300">
                          <Scroll className="w-4 h-4 text-amber-400" />
                          <span>सम्पूर्ण अर्घ्य समर्पण पाठ</span>
                        </div>
                        <button
                          onClick={() => {
                            const arghyaText =
                              selectedItem.type === 'present'
                                ? PRESENT_TIRTHANKARA_ARGHYAS.find((a) => a.number === selectedItem.data.number)?.arghya || ''
                                : (selectedItem.data as any).arghya || '';
                            copyToClipboard(arghyaText, 'modal-arghya', true);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-gotu flex items-center gap-1 transition-colors"
                        >
                          {copiedArghya === 'modal-arghya' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>कॉपी हुआ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>अर्घ्य कॉपी</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="font-notoserif text-xs sm:text-sm text-amber-100/95 leading-relaxed whitespace-pre-line pl-2 border-l-2 border-amber-400/50">
                        {selectedItem.type === 'present'
                          ? PRESENT_TIRTHANKARA_ARGHYAS.find((a) => a.number === selectedItem.data.number)?.arghya
                          : (selectedItem.data as any).arghya}
                      </div>
                    </div>
                  )}

                  {/* Salutation Mantra */}
                  {('salutation' in selectedItem.data || 'mantra' in selectedItem.data) && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-gotu block">
                          वंदना / नमस्कार मंत्र
                        </span>
                        <div className="text-xs sm:text-sm font-notoserif font-bold text-amber-300 truncate">
                          {'salutation' in selectedItem.data ? selectedItem.data.salutation : (selectedItem.data as any).mantra}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const m = 'salutation' in selectedItem.data ? selectedItem.data.salutation : (selectedItem.data as any).mantra;
                          copyToClipboard(m, 'modal-salutation');
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-colors shrink-0"
                        title="मंत्र कॉपी करें"
                      >
                        {copiedMantra === 'modal-salutation' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Present Tirthankar: Full profile link */}
                  {selectedItem.type === 'present' && (
                    <button
                      onClick={() => {
                        const id = selectedItem.data.id;
                        setSelectedItem(null);
                        handleOpenPresentProfile(id);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-gotu font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
                    >
                      <span>विस्तृत पंचकल्याणक, चालीसा व आरती पृष्ठ पर जाएं</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple Calendar Icon helper to avoid missing import
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Clock className={className} />
);

export default TrikalTirthankarPage;
