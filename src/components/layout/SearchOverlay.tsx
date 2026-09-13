import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, FileText, Sparkles, BookOpen, Flame, Compass } from 'lucide-react';
import { contentInventory, ContentItem } from '../../data/inventory';
import { matchSearchQuery } from '../../utils/searchHelper';
import { getRecentReads } from '../../lib/storage';
import { preloadContent } from '../../lib/bridge';
import { TiltCard } from './TiltCard';

// Helper to flatten the inventory
const getAllItems = () => {
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
  'समयसार',
  'तत्त्वार्थ सूत्र',
  'मेरी भावना',
  'सामायिक',
  'आरती',
  'चालीसा',
  'द्रव्यसंग्रह',
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
  tattva: 'तत्त्व ज्ञान',
  bhugol: 'जैन भूगोल',
  itihas: 'जैन इतिहास',
  parva: 'पर्व व उत्सव',
  agamas: 'मूल आगम',
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
  currentActivePage: string;
}

export const SearchOverlay = ({
  isOpen,
  onClose,
  onNavigate,
  currentActivePage,
}: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const allItems = useMemo(() => getAllItems(), []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    return allItems.filter((item) => matchSearchQuery(item, query));
  }, [query, allItems]);

  // Featured / Curated Items when search is empty
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

  const handleItemClick = (item: ContentItem) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-2xl flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: -15, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -15, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-2xl flex flex-col gap-3.5 max-h-[85vh]"
          >
            {/* Search Input Header */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="जिनवाणी में खोजें... (स्तोत्र, पूजा, ग्रंथ, आरती...)"
                className="w-full bg-[#071124]/80 backdrop-blur-2xl backdrop-saturate-[190%] border border-amber-500/30 rounded-2xl py-3.5 sm:py-4 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none focus:border-amber-400/60 focus:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all font-gotu text-sm sm:text-base shadow-2xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.90 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={onClose}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white cursor-pointer"
                title="बंद करें (Esc)"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-1.5 px-1">
              <span className="text-[11px] text-amber-300/80 font-cinzel uppercase tracking-wider mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> लोकप्रिय खोजें:
              </span>
              {popularSuggestions.map((tag) => (
                <motion.button
                  key={tag}
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => setQuery(tag)}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-gotu transition-colors cursor-pointer select-none ${
                    query === tag
                      ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400'
                      : 'bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            {/* Content & Results Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050b17]/80 backdrop-blur-2xl backdrop-saturate-[190%] rounded-2xl border border-amber-500/20 p-3 sm:p-4 shadow-2xl min-h-[300px] max-h-[60vh]">
              {query.trim() === '' ? (
                /* Curated Featured & Recent Reads when search box is empty */
                <div className="space-y-4">
                  {/* Recent Reads in Search */}
                  {getRecentReads().length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-1 pb-1.5 border-b border-white/5 mb-2">
                        <span className="text-xs font-gotu text-amber-300/90 font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          हाल ही में पढ़े गए पाठ
                        </span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {getRecentReads().map((item) => (
                          <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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
                          <div className="flex items-center gap-3 min-w-0 flex-1">
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
              ) : filteredItems.length === 0 ? (
                /* No Results Found State */
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2.5 py-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-amber-400/40" />
                  </div>
                  <p className="font-gotu text-sm text-slate-300">
                    "{query}" के लिए कोई परिणाम नहीं मिला
                  </p>
                  <p className="text-xs text-slate-500 font-gotu max-w-xs">
                    कृपया सही वर्तनी (जैसे: भक्तामर, पूजा, आरती) या ऊपर दिए गए कीवर्ड्स पर टैप करें।
                  </p>
                </div>
              ) : (
                /* Filtered Search Results */
                <div className="flex flex-col gap-1.5">
                  <div className="px-2 py-1 text-[11px] font-cinzel uppercase tracking-widest text-slate-400 flex items-center justify-between border-b border-white/5 mb-1">
                    <span>{filteredItems.length} परिणाम प्राप्त</span>
                    <span className="text-amber-400/70 font-gotu text-[11px]">खोज: "{query}"</span>
                  </div>
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={() => handleItemClick(item)}
                      onMouseEnter={() => preloadContent(item.id)}
                      onTouchStart={() => preloadContent(item.id)}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-amber-500/15 border border-transparent hover:border-amber-500/30 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-rozha text-sm sm:text-base group-hover:text-amber-200 transition-colors truncate">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-cinzel font-semibold">
                              {CATEGORY_NAMES_HI[item.category] || item.category}
                            </span>
                            {item.description && (
                              <span className="text-[11px] text-slate-400 font-gotu truncate max-w-[200px] sm:max-w-[300px]">
                                • {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};