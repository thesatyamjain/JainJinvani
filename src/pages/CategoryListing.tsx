import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, Search, Star, ArrowRight } from 'lucide-react';
import { contentInventory, ContentItem } from '../data/inventory';

interface CategoryListingProps {
  categoryId: string;
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
}

// Map category IDs to display titles
const categoryTitles: Record<string, string> = {
  aarti: 'आरती संग्रह',
  bhajan: 'भक्ति भजन',
  chalisa: 'चालीसा संग्रह',
  puja: 'नित्य पूजा',
  vidhan: 'महामंडल विधान',
  stotra: 'प्राचीन स्तोत्र',
  path: 'पाठ और स्तुति',
  granthas: 'जिनवाणी शास्त्र',
  itihas: 'जैन इतिहास',
  bhugol: 'जैन भूगोल',
  parva: 'पर्व और त्यौहार',
  tattva: 'जैन तत्त्व'
};

export const CategoryListing = ({ categoryId, onNavigate, onBack }: CategoryListingProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const items: ContentItem[] = contentInventory[categoryId] || [];
  const title = categoryTitles[categoryId] || 'सूची';

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto pt-10 pb-32 px-6 flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-rozha text-white">{title}</h1>
            <p className="text-blue-100/60 text-sm font-gotu mt-1">{filteredItems.length} रचनाएँ उपलब्ध</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/50" />
          <input
            type="text"
            placeholder="खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-blue-200/30 focus:outline-none focus:bg-white/10 focus:border-amber-500/50 transition-all font-gotu"
          />
        </div>
      </motion.div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => {
                if (categoryId === 'tirthankar' || categoryId === 'itihas') {
                  onNavigate('tirthankar', { id: item.id, source: 'category', previousPage: 'category', previousParams: { id: categoryId, source: 'sadhana' } });
                } else {
                  onNavigate('viewer', {
                    id: item.id,
                    type: categoryId,
                    title: item.title,
                    previousPage: 'category',
                    previousParams: { id: categoryId, source: 'sadhana' }
                  });
                }
              }}
            >
              <GlassCard className="p-6 h-full min-h-[160px] hover:bg-white/15 cursor-pointer group transition-all border-white/10 hover:border-amber-500/30 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-amber-200/50 group-hover:text-amber-200 group-hover:bg-amber-500/20 transition-all duration-300 shrink-0">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-base md:text-lg font-gotu text-white/90 group-hover:text-white transition-colors line-clamp-3 leading-snug break-words px-2 w-full">
                  {item.title}
                </h3>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/40 font-gotu text-lg">कोई परिणाम नहीं मिला</p>
        </div>
      )}
    </div>
  );
};