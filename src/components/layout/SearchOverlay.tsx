import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  ChevronRight,
  FileText,
  Sparkles,
  BookOpen,
  Flame,
  Clock,
  Mic,
  MicOff,
  RotateCcw,
  CornerDownLeft,
  User,
  Layers,
} from 'lucide-react';
import { contentInventory, ContentItem } from '../../data/inventory';
import {
  searchAndRankItems,
  matchSearchQuery,
  getHighlightedSegments,
} from '../../utils/searchHelper';
import { getRecentReads } from '../../lib/storage';
import { preloadContent } from '../../lib/bridge';
import { TiltCard } from './TiltCard';
import { useDebounce } from '../../hooks/useDebounce';

// Helper to flatten the inventory
const getAllItems = (): ContentItem[] => {
  const items: ContentItem[] = [];
  Object.values(contentInventory).forEach((categoryItems) => {
    items.push(...categoryItems);
  });
  return items;
};

const popularSuggestions = [
  'अभिषेक व शांतिधारा',
  'भक्तामर स्तोत्र',
  'णमोकार महामंत्र',
  'दशलक्षण',
  'सिद्धपूजा',
  'शांति-विधान',
  'समयसार',
  'तत्त्वार्थ सूत्र',
  'मेरी भावना',
  'सामायिक',
  'आरती',
  'चालीसा',
  'द्रव्यसंग्रह',
  'छहढाला',
];

const SEARCH_CATEGORIES = [
  { id: 'all', label: 'सभी' },
  { id: 'stotra', label: 'स्तोत्र' },
  { id: 'puja', label: 'पूजा' },
  { id: 'chalisa', label: 'चालीसा' },
  { id: 'aarti', label: 'आरती' },
  { id: 'granthas', label: 'शास्त्र' },
  { id: 'vidhan', label: 'विधान' },
  { id: 'bhajan', label: 'भजन' },
  { id: 'path', label: 'पाठ' },
  { id: 'tirthankar', label: 'तीर्थंकर' },
];

const CATEGORY_NAMES_HI: Record<string, string> = {
  stotra: 'स्तोत्र संग्रह',
  puja: 'नित्य पूजा',
  vidhan: 'महामंडल विधान',
  aarti: 'आरती संग्रह',
  chalisa: 'चालीसा संग्रह',
  bhajan: 'भक्ति भजन',
  path: 'पाठ व स्तुति',
  granthas: 'प्रमुख शास्त्र',
  shastra: 'प्रमुख शास्त्र',
  tattva: 'तत्त्व ज्ञान',
  bhugol: 'जैन भूगोल',
  itihas: 'जैन इतिहास',
  parva: 'पर्व व उत्सव',
  agamas: 'मूल आगम',
  tirthankar: '२४ तीर्थंकर',
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
  currentActivePage: string;
}

const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
  const segments = useMemo(() => getHighlightedSegments(text, query), [text, query]);
  return (
    <span>
      {segments.map((seg, i) =>
        seg.isMatch ? (
          <span key={i} className="text-amber-300 font-bold bg-amber-500/25 px-0.5 rounded">
            {seg.text}
          </span>
        ) : (
          seg.text
        )
      )}
    </span>
  );
};

export const SearchOverlay = ({
  isOpen,
  onClose,
  onNavigate,
  currentActivePage,
}: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  // ⚡ BOLT OPTIMIZATION: Debounce search input to prevent expensive filtering on every keystroke
  const debouncedQuery = useDebounce(query, 250);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => getAllItems(), []);

  // Recent Search History in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('jinvani_recent_searches');
        return saved ? JSON.parse(saved) : [];
      } catch {}
    }
    return [];
  });

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('jinvani_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('jinvani_recent_searches');
    } catch {}
  };

  // Voice Search setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) setSpeechSupported(true);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const toggleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setQuery(transcript.trim());
          saveRecentSearch(transcript.trim());
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        setIsListening(false);
      }
    } else {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Reset selected item index on query or category change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // ⚡ BOLT OPTIMIZATION: Category counts now depend on debouncedQuery to prevent main thread blocking
  // Category counts
  const categoryCounts = useMemo(() => {
    if (!debouncedQuery.trim()) return {};
    const counts: Record<string, number> = { all: 0 };
    allItems.forEach((item) => {
      if (matchSearchQuery(item, debouncedQuery)) {
        counts.all = (counts.all || 0) + 1;
        const cat = item.category === 'shastra' ? 'granthas' : item.category;
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [debouncedQuery, allItems]);

  // ⚡ BOLT OPTIMIZATION: Heavy filtering now depends on debouncedQuery to improve typing responsiveness
  // Filtered & Ranked Items
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const catFilter =
      activeCategory === 'all'
        ? undefined
        : activeCategory === 'granthas'
        ? 'granthas'
        : activeCategory;

    // Normalizing category match for granthas / shastra
    const pool =
      activeCategory === 'granthas'
        ? allItems.filter((i) => i.category === 'granthas' || i.category === 'shastra')
        : catFilter
        ? allItems.filter((i) => i.category === catFilter)
        : allItems;

    return searchAndRankItems(pool, debouncedQuery);
  }, [debouncedQuery, allItems, activeCategory]);

  // Auto scroll highlighted item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Handle item navigation
  const handleItemClick = (item: ContentItem) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }

    if (item.category === 'tirthankar') {
      onNavigate('tirthankar', {
        id: item.id,
        source: 'search',
        previousPage: currentActivePage,
        previousParams: { id: 'tirthankar', source: 'sadhana' },
      });
    } else {
      onNavigate('viewer', {
        id: item.id,
        title: item.title,
        type: item.category,
        source: 'search',
        previousPage: currentActivePage,
      });
    }
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filteredItems.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (filteredItems.length > 0 && selectedIndex >= 0 && selectedIndex < filteredItems.length) {
          e.preventDefault();
          handleItemClick(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Featured items when query is empty
  const featuredItems = useMemo(() => {
    const featuredIds = [
      'namokar-mantra',
      'bhaktamar-hindi-arth',
      'samaysar',
      'tattvartha-sutra',
      'meri-bhavna',
      'samayik-path',
      'jain-aarti',
      'mahavir-chalisa',
      'dravyasangrah',
      'kalyan-mandir-stotra',
    ];
    return allItems.filter((i) => featuredIds.includes(i.id)).slice(0, 8);
  }, [allItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl flex flex-col gap-2.5 z-10 max-h-[88vh]"
          >
            {/* Search Input Box */}
            <div className="relative">
              <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isListening
                    ? 'कृपया स्पष्ट बोलें, आपकी आवाज़ पहचानी जा रही है...'
                    : 'जिनवाणी में खोजें... (उदा. भक्तामर, पूजा, आरती, समयसार)'
                }
                className={`w-full bg-[#071124]/95 backdrop-blur-2xl border rounded-2xl py-3 sm:py-3.5 pl-11 sm:pl-12 pr-24 sm:pr-28 text-white placeholder:text-slate-400 outline-none transition-all font-gotu text-sm sm:text-base shadow-2xl ${
                  isListening
                    ? 'border-rose-400 ring-2 ring-rose-400/30 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                    : 'border-amber-500/35 focus:border-amber-400 focus:shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                }`}
              />

              {/* Action Buttons inside Input */}
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Voice Dictation Button */}
                {speechSupported && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoiceSearch}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer select-none ${
                      isListening
                        ? 'bg-rose-500/25 border border-rose-400 text-rose-300 animate-pulse'
                        : 'bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-200 border border-white/10'
                    }`}
                    title={isListening ? 'बोलना बंद करें' : 'हिंदी में बोलकर खोजें'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-rose-300 animate-bounce" />
                    ) : (
                      <Mic className="w-4 h-4 text-amber-400" />
                    )}
                  </motion.button>
                )}

                {/* Quick Clear Button */}
                {query && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white cursor-pointer select-none"
                    title="साफ़ करें"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}

                {/* Close Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-rose-200 cursor-pointer select-none ml-0.5"
                  title="बंद करें (Esc)"
                >
                  <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded mr-1">
                    ESC
                  </span>
                  <X className="w-4 h-4 sm:hidden" />
                </motion.button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-1 py-0.5">
              {SEARCH_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const count = debouncedQuery.trim() ? categoryCounts[cat.id] || 0 : null;

                // Hide category chips with 0 results when searching (except 'all')
                if (debouncedQuery.trim() && count === 0 && cat.id !== 'all') {
                  return null;
                }

                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-gotu whitespace-nowrap transition-all cursor-pointer select-none flex items-center gap-1 shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400 shadow-[0_2px_10px_rgba(245,158,11,0.35)]'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-200 border border-white/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {count !== null && count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Content & Results Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050b17]/90 backdrop-blur-2xl rounded-2xl border border-amber-500/20 p-3 sm:p-4 shadow-2xl min-h-[300px] max-h-[62vh] flex flex-col">
              {debouncedQuery.trim() === '' ? (
                /* Empty Query State: Recents, Popular Queries, and Curated Essentials */
                <div className="space-y-4 flex-1">
                  {/* Recent Searches (इतिहास) */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 pb-1 border-b border-white/5">
                        <span className="text-xs font-gotu text-amber-300/90 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          हाल की खोजें (Search History)
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-[10px] text-slate-400 hover:text-rose-300 font-gotu cursor-pointer transition-colors"
                        >
                          इतिहास साफ़ करें
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {recentSearches.map((term) => (
                          <motion.button
                            key={term}
                            type="button"
                            whileTap={{ scale: 0.93 }}
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setQuery(term)}
                            className="text-xs px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 font-gotu flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                          >
                            <RotateCcw className="w-3 h-3 text-slate-500" />
                            <span>{term}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Suggestions */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-white/5">
                      <span className="text-xs font-gotu text-amber-300/90 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        लोकप्रिय खोजें:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {popularSuggestions.map((tag) => (
                        <motion.button
                          key={tag}
                          type="button"
                          whileTap={{ scale: 0.93 }}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setQuery(tag)}
                          className="text-xs px-2.5 py-1 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-500/30 font-gotu transition-colors cursor-pointer select-none"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Reads (हाल ही में पढ़े गए पाठ) */}
                  {getRecentReads().length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 pb-1 border-b border-white/5">
                        <span className="text-xs font-gotu text-amber-300/90 font-semibold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          हाल ही में पढ़े गए पाठ
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {getRecentReads().map((item) => (
                          <motion.button
                            key={item.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleItemClick({
                                id: item.id,
                                title: item.title,
                                category: item.type || 'stotra',
                              } as ContentItem)
                            }
                            onMouseEnter={() => preloadContent(item.id)}
                            onTouchStart={() => preloadContent(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/25 text-left shrink-0 transition-colors cursor-pointer group max-w-[200px]"
                          >
                            <p className="text-xs font-notoserif font-semibold text-white group-hover:text-amber-200 truncate">
                              {item.title}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Curated Daily Essentials */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-white/5">
                      <span className="text-xs font-gotu text-amber-300/90 font-semibold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        प्रमुख व नित्य स्वाध्याय पाठ
                      </span>
                      <span className="text-[10px] text-slate-500 font-cinzel uppercase">
                        अनुशंसित
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {featuredItems.map((item) => (
                        <TiltCard
                          key={item.id}
                          maxTilt={6}
                          glareMaxOpacity={0.12}
                          glareColor="amber"
                          className="rounded-xl h-full"
                        >
                          <motion.div
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={() => preloadContent(item.id)}
                            onTouchStart={() => preloadContent(item.id)}
                            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-amber-500/15 border border-white/5 hover:border-amber-400/40 cursor-pointer group transition-colors duration-200 h-full"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-white font-rozha text-sm sm:text-base group-hover:text-amber-200 transition-colors truncate">
                                  {item.title}
                                </h4>
                                <span className="text-[10px] text-amber-400/70 uppercase tracking-wider font-cinzel">
                                  {CATEGORY_NAMES_HI[item.category] || item.category}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
                          </motion.div>
                        </TiltCard>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                /* No Results Found State with Helpful Suggestions */
                <div className="flex flex-col items-center justify-center my-auto text-slate-400 gap-3 py-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shadow-inner">
                    <Search className="w-6 h-6 text-amber-400/60" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <p className="font-gotu text-sm text-slate-200 font-semibold">
                      "{debouncedQuery}" के लिए कोई पाठ नहीं मिला
                    </p>
                    <p className="text-xs text-slate-400 font-gotu leading-relaxed">
                      शायद वर्तनी में अंतर हो। आप माइक बटन दबाकर बोल सकते हैं अथवा नीचे दिए गए लोकप्रिय पाठों में से चुनें:
                    </p>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md pt-1">
                    {popularSuggestions.slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setQuery(tag)}
                        className="text-xs px-2.5 py-1 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 font-gotu transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Filtered & Ranked Results List */
                <div className="flex flex-col gap-1.5">
                  {/* Results Count & Keyboard Guide Header */}
                  <div className="px-2 py-1 text-[11px] font-gotu text-slate-400 flex items-center justify-between border-b border-white/5 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-semibold">
                        {filteredItems.length} परिणाम प्राप्त
                      </span>
                      {activeCategory !== 'all' && (
                        <span className="text-[10px] text-slate-500">
                          (फ़िल्टर: {SEARCH_CATEGORIES.find((c) => c.id === activeCategory)?.label})
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500">
                      <span>↑↓ नेविगेट</span>
                      <span>•</span>
                      <span>↵ खोलें</span>
                    </div>
                  </div>

                  {/* Result Rows */}
                  {filteredItems.map((item, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <motion.div
                        key={item.id}
                        ref={isSelected ? activeItemRef : undefined}
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={() => {
                          setSelectedIndex(index);
                          preloadContent(item.id);
                        }}
                        onTouchStart={() => preloadContent(item.id)}
                        className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border cursor-pointer group transition-all select-none ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_16px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                            : 'bg-white/[0.02] hover:bg-amber-500/10 border-white/5 hover:border-amber-400/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${
                              isSelected
                                ? 'bg-amber-500/30 text-amber-200 border-amber-400/50 scale-105'
                                : 'bg-amber-500/15 border-amber-500/25 text-amber-300 group-hover:scale-105'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4
                              className={`font-rozha text-sm sm:text-base transition-colors truncate ${
                                isSelected ? 'text-amber-200' : 'text-white group-hover:text-amber-200'
                              }`}
                            >
                              <HighlightMatch text={item.title} query={debouncedQuery} />
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-amber-400/90 font-cinzel font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                                {CATEGORY_NAMES_HI[item.category] || item.category}
                              </span>

                              {item.author && (
                                <span className="text-[11px] text-amber-200/80 font-gotu flex items-center gap-1 truncate">
                                  <User className="w-2.5 h-2.5 text-amber-400" />
                                  <HighlightMatch text={item.author} query={debouncedQuery} />
                                </span>
                              )}

                              {item.description && (
                                <span className="text-[11px] text-slate-400 font-gotu truncate max-w-[200px] sm:max-w-[320px]">
                                  • <HighlightMatch text={item.description} query={debouncedQuery} />
                                </span>
                              )}
                            </div>

                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {item.tags.slice(0, 3).map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[9px] font-gotu px-1.5 py-0.2 rounded-md bg-amber-500/10 border border-amber-400/20 text-amber-300/80"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {isSelected && (
                            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-amber-300 font-mono bg-amber-500/20 border border-amber-400/30 px-1.5 py-0.5 rounded-lg">
                              <CornerDownLeft className="w-2.5 h-2.5" />
                              ↵
                            </span>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 transition-all ${
                              isSelected
                                ? 'text-amber-300 translate-x-1'
                                : 'text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1'
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};