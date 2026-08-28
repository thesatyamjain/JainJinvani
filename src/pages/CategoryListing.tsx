import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { HorizontalScrollContainer } from '../components/layout/HorizontalScrollContainer';
import {
  ChevronLeft,
  Search,
  ChevronRight,
  Sparkles,
  LayoutGrid,
  ListOrdered,
  X,
  Flame,
  Flower2,
  Crown,
  Calendar,
  Users,
  BookOpen,
  Feather,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { contentInventory, ContentItem, subCategoryMap, SubCategoryDef } from '../data/inventory';
import { matchSearchQuery } from '../utils/searchHelper';

interface CategoryListingProps {
  categoryId: string;
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
}

// Map category IDs to display titles
const categoryTitles: Record<string, { title: string; sub: string }> = {
  aarti: { title: 'आरती संग्रह', sub: 'दीपक वंदना एवं पंच परमेष्ठी आरती स्तुति' },
  bhajan: { title: 'भक्ति भजन', sub: 'आध्यात्मिक रस धारा एवं प्रभु गुणगान' },
  chalisa: { title: 'चालीसा संग्रह', sub: '४० पद्य स्तुति एवं भक्ति पाठ' },
  puja: { title: 'नित्य पूजा', sub: 'अष्टद्रव्य पूजन विधि, नित्य नियम एवं पर्व पूजाएँ' },
  vidhan: { title: 'महामंडल विधान', sub: 'सिद्धचक्र, भक्तामर, कल्याणमंदिर, २४ तीर्थंकर व सर्व महाविधान' },
  stotra: { title: 'प्राचीन स्तोत्र', sub: 'भक्तामर, कल्याणमंदिर, एकीभाव व शांति स्तोत्र' },
  path: { title: 'पाठ और स्तुति', sub: 'दैनिक स्वाध्याय, वैराग्य भावना व विनती' },
  granthas: { title: 'जिनवाणी शास्त्र', sub: 'समयसार, तत्त्वार्थ सूत्र व सिद्धांत ग्रंथ' },
  shastra: { title: 'जिनवाणी शास्त्र', sub: 'समयसार, तत्त्वार्थ सूत्र व सिद्धांत ग्रंथ' },
  agamas: { title: 'मूल आगम ग्रंथ', sub: 'षट्खण्डागम, कषायपाहुड़ व द्वादशांग जिनवाणी' },
  itihas: { title: 'जैन इतिहास', sub: 'तीर्थंकर जीवन चरित्र व महान आचार्य परंपरा' },
  bhugol: { title: 'जैन भूगोल', sub: 'तीन लोक, जम्बूद्वीप व अकृत्रिम चैत्यालय' },
  parva: { title: 'पर्व और त्यौहार', sub: 'दशलक्षण, अष्टान्हिका, दीपावली व महापर्व' },
  tattva: { title: 'जैन तत्त्वज्ञान', sub: 'षट्द्रव्य, नवपदार्थ एवं प्रयोजनभूत ७ तत्त्व' },
  philosophy: { title: 'जैन तत्त्वज्ञान', sub: 'षट्द्रव्य, नवपदार्थ एवं प्रयोजनभूत ७ तत्त्व' },
};

// Subcategory icon resolver
const getSubCategoryIcon = (subId: string) => {
  switch (subId) {
    case 'daily-flow':
      return <ListOrdered className="w-4 h-4" />;
    case 'tirthankar':
    case 'tirthankar-vidhan':
    case 'tirthankar-chalisa':
    case 'prathamanuyoga':
      return <Crown className="w-4 h-4" />;
    case 'parva-vrat':
    case 'mahamandal-vidhan':
      return <Calendar className="w-4 h-4" />;
    case 'guru-acharya':
      return <Users className="w-4 h-4" />;
    case 'tattva-guna':
    case 'pradhan-stotra':
    case 'karnanuyoga':
      return <Sparkles className="w-4 h-4" />;
    case 'shanti-raksha':
    case 'charananuyoga':
      return <Flame className="w-4 h-4" />;
    case 'bhakti-stuti':
    case 'dravyanuyoga':
      return <Feather className="w-4 h-4" />;
    case 'vishesh-chalisa':
      return <Flower2 className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export const CategoryListing = ({ categoryId, onNavigate, onBack }: CategoryListingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const items: ContentItem[] = contentInventory[categoryId] || [];
  const meta = categoryTitles[categoryId] || { title: 'रचना सूची', sub: 'जिनवाणी संग्रह' };
  const subCategories: SubCategoryDef[] = subCategoryMap[categoryId] || [];

  // Filter items by search query and active subcategory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Subcategory match
      const matchesSubCategory =
        activeSubCategory === 'all' || item.subCategory === activeSubCategory;

      // Search match
      const query = searchQuery.trim();
      if (!query) return matchesSubCategory;

      const matchesSearch = matchSearchQuery(item, query);

      return matchesSubCategory && matchesSearch;
    });
  }, [items, activeSubCategory, searchQuery]);

  // Compute counts per subcategory
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach((item) => {
      if (item.subCategory) {
        counts[item.subCategory] = (counts[item.subCategory] || 0) + 1;
      }
    });
    return counts;
  }, [items]);

  const activeSubCategoryInfo = subCategories.find((s) => s.id === activeSubCategory);

  const handleItemClick = (item: ContentItem) => {
    if (categoryId === 'tirthankar') {
      onNavigate('tirthankar', {
        id: item.id,
        source: 'category',
        previousPage: 'category',
        previousParams: { id: categoryId, source: 'sadhana' },
      });
    } else {
      onNavigate('viewer', {
        id: item.id,
        type: categoryId,
        title: item.title,
        previousPage: 'category',
        previousParams: { id: categoryId, source: 'sadhana' },
      });
    }
  };

  const isDailyFlow = categoryId === 'puja' && (activeSubCategory === 'daily-flow' || viewMode === 'timeline');

  return (
    <div className="w-full max-w-6xl mx-auto pt-12 md:pt-16 pb-36 px-4 md:px-6 flex flex-col h-full overflow-x-hidden">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/40 transition-all backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </button>
          <div className="py-1">
            <h1 className="text-3xl md:text-4xl font-notoserif font-bold text-white pt-2 pb-1.5 leading-[1.35] drop-shadow-[0_2px_15px_rgba(245,158,11,0.2)]">
              {meta.title}
            </h1>
            <p className="text-slate-300/80 text-xs md:text-sm font-gotu mt-0.5">
              {meta.sub} • {filteredItems.length} {filteredItems.length === 1 ? 'रचना' : 'रचनाएँ'}
            </p>
          </div>
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="रचना, कवि, या विषय खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/15 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:bg-slate-900 focus:border-amber-400/60 transition-all font-gotu shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Timeline / Grid View Toggle for Puja */}
          {categoryId === 'puja' && (
            <div className="flex items-center bg-slate-900/90 border border-white/15 rounded-2xl p-1 shrink-0 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ग्रिड दृश्य (Grid View)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setViewMode('timeline');
                  setActiveSubCategory('daily-flow');
                }}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="नित्य क्रम दृश्य (Timeline View)"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subcategory Filter Tabs (if available) */}
      {subCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7"
        >
          <HorizontalScrollContainer>
            {subCategories.map((sub) => {
              const count = subCategoryCounts[sub.id] || 0;
              const isActive = activeSubCategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setActiveSubCategory(sub.id);
                    if (sub.id !== 'daily-flow' && viewMode === 'timeline') {
                      setViewMode('grid');
                    }
                  }}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 text-amber-200 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-semibold'
                      : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                  }`}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'}>
                    {getSubCategoryIcon(sub.id)}
                  </span>
                  <span>{sub.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? 'bg-amber-400/30 text-amber-100'
                        : 'bg-white/5 text-slate-400 group-hover:bg-white/10'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </HorizontalScrollContainer>

          {/* Active Subcategory Context Banner */}
          {activeSubCategoryInfo?.description && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/20 backdrop-blur-md flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-xs sm:text-sm text-amber-200/90 font-gotu">
                  {activeSubCategoryInfo.description}
                </p>
              </div>

              {activeSubCategory === 'daily-flow' && items.length > 0 && (
                <button
                  onClick={() => handleItemClick(filteredItems[0] || items[0])}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-gotu font-bold text-xs hover:bg-amber-300 transition-colors shadow-md cursor-pointer"
                >
                  <span>प्रारम्भ से पूजन करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {filteredItems.length > 0 ? (
          viewMode === 'timeline' && isDailyFlow ? (
            /* ========================================================================= */
            /* Guided Timeline Stepper View for Daily Puja Flow */
            /* ========================================================================= */
            <motion.div
              key="timeline-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="relative space-y-4 md:space-y-5"
            >
              {/* Stepper Guide Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400/60 via-amber-500/30 to-amber-600/10 hidden sm:block" />

              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(0.08, idx * 0.01) }}
                  onClick={() => handleItemClick(item)}
                  className="relative group cursor-pointer"
                >
                  <GlassCard
                    variant="gilded"
                    className="p-5 sm:p-6 sm:pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 border border-white/10 hover:border-amber-400/50 shadow-md group"
                  >
                    {/* Stepper Number Badge (Mobile & Desktop) */}
                    <div className="sm:absolute sm:left-4 sm:top-1/2 sm:-translate-y-1/2 w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)] group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      {item.order || idx + 1 < 10 ? `0${item.order || idx + 1}` : item.order || idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {item.badge && (
                          <span className="text-[11px] font-gotu px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/25 text-amber-300 font-medium">
                            {item.badge}
                          </span>
                        )}
                        {item.author && (
                          <span className="text-[11px] font-gotu px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                            {item.author}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg md:text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-xs sm:text-sm text-slate-300/80 font-gotu mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-gotu text-amber-300/90 group-hover:text-amber-200 transition-colors">
                        पूजन करें
                      </span>
                      <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:translate-x-1 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* Standard Grid View for All Items & Categories */
            /* ========================================================================= */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4.5"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: Math.min(0.08, idx * 0.01) }}
                  onClick={() => handleItemClick(item)}
                  className="h-full"
                >
                  <GlassCard
                    variant="gilded"
                    className="p-3.5 sm:p-5 md:p-6 h-full min-h-[135px] sm:min-h-[145px] flex flex-col justify-between cursor-pointer group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/50 shadow-md"
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-1.5 mb-2 sm:mb-2.5">
                        {item.badge ? (
                          <span className="text-[9px] sm:text-[10px] font-gotu px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 font-medium truncate max-w-[110px] sm:max-w-[170px]">
                            {item.badge}
                          </span>
                        ) : item.author ? (
                          <span className="text-[9px] sm:text-[10px] font-gotu px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 truncate max-w-[110px] sm:max-w-[170px]">
                            {item.author}
                          </span>
                        ) : <span />}

                        <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-amber-300/80 shrink-0">
                          #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base md:text-lg font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug break-words">
                        {item.title}
                      </h3>

                      {/* Short Description */}
                      {item.description && (
                        <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-400 font-gotu line-clamp-2 mt-1 sm:mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 group-hover:text-amber-300 font-gotu transition-colors border-t border-white/5 pt-2 sm:pt-2.5">
                      <span className="truncate">{categoryId === 'puja' ? 'पूजन करें' : 'स्वाध्याय'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )
        ) : (
          /* ========================================================================= */
          /* Empty State */
          /* ========================================================================= */
          <motion.div
            key="empty-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-notoserif font-bold text-white mb-1.5">कोई परिणाम नहीं मिला</h3>
            <p className="text-slate-400 font-gotu text-sm max-w-sm">
              "{searchQuery}" के लिए कोई रचना उपलब्ध नहीं है। कृपया दूसरा शब्द खोजें।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveSubCategory('all');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-gotu transition-colors cursor-pointer"
            >
              सभी रचनाएँ देखें
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};