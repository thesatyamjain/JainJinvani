import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ChevronRight, FileText } from 'lucide-react';
import { contentInventory, ContentItem } from '../data/inventory';

// Helper to flatten the inventory
const getAllItems = () => {
  const items: ContentItem[] = [];
  Object.values(contentInventory).forEach((categoryItems) => {
    items.push(...categoryItems);
  });
  return items;
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const SearchOverlay = ({ isOpen, onClose, onNavigate }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const allItems = useMemo(() => getAllItems(), []);
  
  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.id.toLowerCase().includes(lowerQuery)
    );
  }, [query, allItems]);

  const handleItemClick = (item: ContentItem) => {
    onNavigate('viewer', {
      id: item.id,
      title: item.title,
      type: item.category,
      source: 'search'
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
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={(e) => {
             // Close if clicked on the backdrop
             if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-2xl flex flex-col gap-4 max-h-[80vh]"
          >
             {/* Search Input */}
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  autoFocus
                  type="text"
                  placeholder="खोजें... (Search Aartis, Bhajans, etc.)"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/30 outline-none focus:bg-white/15 focus:border-amber-500/50 transition-all font-gotu text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-white/50 w-5 h-5" />
                </button>
             </div>

             {/* Results */}
             <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/5 rounded-2xl border border-white/10 p-2 min-h-[200px]">
                {query.trim() === '' ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2 py-10">
                    <Search className="w-12 h-12 opacity-20" />
                    <p className="font-gotu">Type to search the library...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2 py-10">
                    <p className="font-gotu">No results found for "{query}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 cursor-pointer group transition-colors"
                      >
                         <div className="flex items-center gap-3 min-w-0 flex-1">
                           <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-200 shrink-0">
                              <FileText className="w-5 h-5" />
                           </div>
                           <div className="min-w-0 flex-1">
                             <h4 className="text-white font-rozha group-hover:text-amber-200 transition-colors break-words">{item.title}</h4>
                             <p className="text-xs text-white/40 uppercase tracking-wider break-words">{item.category}</p>
                           </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all shrink-0" />
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
}