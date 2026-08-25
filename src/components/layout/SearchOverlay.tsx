import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, FileText, Sparkles, BookOpen } from 'lucide-react';
import { contentInventory, ContentItem } from '../../data/inventory';

// Helper to flatten the inventory
const getAllItems = () => {
  const items: ContentItem[] = [];
  Object.values(contentInventory).forEach((categoryItems) => {
    items.push(...categoryItems);
  });
  return items;
};

const popularSuggestions = [
  'भक्तामर स्तोत्र',
  'णमोकार महामंत्र',
  'समयसार',
  'तत्त्वार्थ सूत्र',
  'आरती',
  'चालीसा',
  'मेरी भावना',
  'सामायिक',
];

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

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.id.toLowerCase().includes(lowerQuery) ||
        (item.category && item.category.toLowerCase().includes(lowerQuery))
    );
  }, [query, allItems]);

  const handleItemClick = (item: ContentItem) => {
    onNavigate('viewer', {
      id: item.id,
      title: item.title,
      type: item.category,
      source: 'search',
      previousPage: currentActivePage,
      previousParams:
        item.category === 'tirthankar' ? { id: 'tirthankar', source: 'sadhana' } : undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-2xl flex items-start justify-center pt-16 sm:pt-24 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            className="w-full max-w-2xl flex flex-col gap-4 max-h-[82vh]"
          >
            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-amber-400 w-5 h-5" />
              <input
                autoFocus
                type="text"
                placeholder="जिनवाणी में खोजें... (स्तोत्र, पूजा, ग्रंथ, आरती...)"
                className="w-full bg-[#071124]/95 border border-amber-500/30 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-500 outline-none focus:border-amber-400/60 focus:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all font-gotu text-base md:text-lg shadow-2xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions Strip if empty */}
            {query.trim() === '' && (
              <div className="flex flex-wrap items-center gap-1.5 px-2">
                <span className="text-[11px] text-amber-300/70 font-cinzel uppercase tracking-wider mr-1">
                  लोकप्रिय खोजें:
                </span>
                {popularSuggestions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-200 border border-white/10 hover:border-amber-500/30 px-3 py-1 rounded-full font-gotu transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050b17]/90 rounded-2xl border border-amber-500/20 p-2 min-h-[220px] shadow-2xl">
              {query.trim() === '' ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 py-12">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Search className="w-6 h-6 text-amber-400/40" />
                  </div>
                  <p className="font-gotu text-sm text-slate-400">
                    खोजने के लिए ऊपर नाम या विषय लिखें...
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-12">
                  <p className="font-gotu text-base">"{query}" के लिए कोई परिणाम नहीं मिला</p>
                  <p className="text-xs text-slate-500 font-gotu">
                    कृपया दूसरा शब्द या श्रेणी आज़माएँ।
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="px-3 py-1 text-[11px] font-cinzel uppercase tracking-widest text-slate-400">
                    {filteredItems.length} परिणाम प्राप्त
                  </div>
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-500/10 border border-transparent hover:border-amber-500/25 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-white font-rozha text-base group-hover:text-amber-200 transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-amber-400/75 uppercase tracking-wider font-cinzel font-bold">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
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