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
  Heart,
  Music,
} from 'lucide-react';
import { contentInventory, ContentItem, subCategoryMap, SubCategoryDef } from '../data/inventory';
import { matchSearchQuery } from '../utils/searchHelper';
import { updateCategorySeo } from '../utils/seoHelper';

interface CategoryListingProps {
  categoryId: string;
  initialSubCategory?: string;
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
  stotra: { title: 'स्तोत्र संग्रह', sub: 'भक्तामर, कल्याणमंदिर, एकीभाव व शांति स्तोत्र' },
  path: { title: 'पाठ व स्तुति', sub: 'दैनिक स्वाध्याय, वैराग्य भावना व विनती' },
  granthas: { title: 'प्रमुख शास्त्र', sub: 'समयसार, तत्त्वार्थ सूत्र व सिद्धांत ग्रंथ' },
  shastra: { title: 'प्रमुख शास्त्र', sub: 'समयसार, तत्त्वार्थ सूत्र व सिद्धांत ग्रंथ' },
  agamas: { title: 'मूल आगम', sub: 'षट्खण्डागम, कषायपाहुड़ व द्वादशांग जिनवाणी' },
  itihas: { title: 'जैन इतिहास', sub: 'तीर्थंकर जीवन चरित्र व महान आचार्य परंपरा' },
  bhugol: { title: 'जैन भूगोल', sub: 'तीन लोक, जम्बूद्वीप व अकृत्रिम चैत्यालय' },
  parva: { title: 'पर्व व उत्सव', sub: 'दशलक्षण, अष्टान्हिका, दीपावली व महापर्व' },
  tattva: { title: 'तत्त्व ज्ञान', sub: 'षट्द्रव्य, नवपदार्थ एवं प्रयोजनभूत ७ तत्त्व' },
  philosophy: { title: 'तत्त्व ज्ञान', sub: 'षट्द्रव्य, नवपदार्थ एवं प्रयोजनभूत ७ तत्त्व' },
  vrat: { title: '१०५ व्रत, पूजा एवं उद्यापन', sub: 'ब्रम्हचारी विनोद सागर शास्त्री • महिलाओं के लिए विशेष नवीन संकलन' },
  '105-vrat': { title: '१०५ व्रत, पूजा एवं उद्यापन', sub: 'ब्रम्हचारी विनोद सागर शास्त्री • महिलाओं के लिए विशेष नवीन संकलन' },
  'vrat-vidhi': { title: '१०५ व्रत, पूजा एवं उद्यापन', sub: 'ब्रम्हचारी विनोद सागर शास्त्री • महिलाओं के लिए विशेष नवीन संकलन' },
  tirthankar: { title: '२४ तीर्थंकर भगवान', sub: 'वर्तमान चौबीसी तीर्थंकर परिचय, कल्याणक एवं जीवन चरित्र' },
};

// Subcategory icon resolver
const getSubCategoryIcon = (subId: string) => {
  switch (subId) {
    case 'mangal-deepak':
      return <Flame className="w-4 h-4" />;
    case 'tirthankar-aarti':
      return <Crown className="w-4 h-4" />;
    case 'jinvani-guru':
      return <BookOpen className="w-4 h-4" />;
    case 'tirthankar-bhajan':
      return <Crown className="w-4 h-4" />;
    case 'guru-tirth-bhajan':
      return <Users className="w-4 h-4" />;
    case 'adhyatma-vairagya':
      return <Feather className="w-4 h-4" />;
    case 'prarthana-samarpan':
      return <Heart className="w-4 h-4" />;
    case 'vrat-vidhi':
      return <ListOrdered className="w-4 h-4" />;
    case 'vrat-soochi':
      return <BookOpen className="w-4 h-4" />;
    case 'vrat-puja':
      return <Flower2 className="w-4 h-4" />;
    case 'vrat-katha':
      return <Feather className="w-4 h-4" />;
    case 'samskar-vidhi':
      return <Crown className="w-4 h-4" />;
    case 'shravak-dharma':
      return <Flame className="w-4 h-4" />;
    case 'daily-flow':
    case 'daily-swadhyay':
      return <ListOrdered className="w-4 h-4" />;
    case 'vairagya-bhavana':
    case 'bhakti-stuti':
    case 'adhyatma-stotra':
      return <Feather className="w-4 h-4" />;
    case 'atma-sadhana':
    case 'tattva-guna':
    case 'pradhan-stotra':
    case 'ashtak-stotra':
    case 'siddha-tirth':
    case 'karnanuyoga':
      return <Sparkles className="w-4 h-4" />;
    case 'jinendra-stuti':
    case 'vishesh-chalisa':
    case 'atishay-kshetra':
      return <Flower2 className="w-4 h-4" />;
    case 'tirth-vandana':
    case 'tirthankar':
    case 'tirthankar-vidhan':
    case 'tirthankar-chalisa':
    case 'prathamanuyoga':
      return <Crown className="w-4 h-4" />;
    case 'parva-vrat':
    case 'mahamandal-vidhan':
    case 'daslakshan-vidhan':
      return <Calendar className="w-4 h-4" />;
    case 'guru-acharya':
    case 'guru-devi':
      return <Users className="w-4 h-4" />;
    case 'shanti-raksha':
    case 'charananuyoga':
      return <Flame className="w-4 h-4" />;
    case 'dravyanuyoga':
      return <Feather className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

interface SubCategoryStyle {
  color: string;
  border: string;
  accent: string;
}

const getSubCategoryStyle = (subId: string): SubCategoryStyle => {
  switch (subId) {
    case 'tirthankar':
    case 'tirthankar-vidhan':
    case 'tirthankar-chalisa':
    case 'tirthankar-aarti':
    case 'tirthankar-bhajan':
    case 'prathamanuyoga':
    case 'samskar-vidhi':
      return {
        color: 'from-amber-500/20 to-yellow-700/10',
        border: 'border-amber-500/30',
        accent: 'text-amber-300',
      };
    case 'daily-flow':
    case 'daily-swadhyay':
    case 'vrat-vidhi':
    case 'vrat-soochi':
      return {
        color: 'from-orange-500/20 to-amber-700/10',
        border: 'border-orange-500/30',
        accent: 'text-orange-300',
      };
    case 'shravak-dharma':
    case 'shanti-raksha':
    case 'charananuyoga':
    case 'mangal-deepak':
      return {
        color: 'from-emerald-500/20 to-teal-700/10',
        border: 'border-emerald-500/30',
        accent: 'text-emerald-300',
      };
    case 'mahamandal-vidhan':
    case 'daslakshan-vidhan':
    case 'parva-vrat':
    case 'pradhan-stotra':
    case 'siddha-tirth':
    case 'karnanuyoga':
      return {
        color: 'from-amber-400/20 to-amber-600/10',
        border: 'border-amber-400/35',
        accent: 'text-amber-200',
      };
    case 'vairagya-bhavana':
    case 'adhyatma-stotra':
    case 'adhyatma-vairagya':
    case 'dravyanuyoga':
    case 'vrat-katha':
      return {
        color: 'from-cyan-500/20 to-blue-700/10',
        border: 'border-cyan-500/30',
        accent: 'text-cyan-300',
      };
    case 'guru-acharya':
    case 'guru-devi':
    case 'jinvani-guru':
    case 'guru-tirth-bhajan':
      return {
        color: 'from-purple-500/20 to-indigo-700/10',
        border: 'border-purple-500/30',
        accent: 'text-purple-300',
      };
    case 'jinendra-stuti':
    case 'bhakti-stuti':
    case 'ashtak-stotra':
    case 'atishay-kshetra':
    case 'vrat-puja':
    case 'prarthana-samarpan':
      return {
        color: 'from-rose-500/20 to-amber-700/10',
        border: 'border-rose-500/30',
        accent: 'text-rose-300',
      };
    default:
      return {
        color: 'from-amber-500/20 to-amber-700/10',
        border: 'border-amber-500/30',
        accent: 'text-amber-300',
      };
  }
};

const CategoryDivider = ({
  icon,
  title,
  subtitle,
  count,
  accent,
  color,
  border,
  onSelectSubcategory,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  count: number;
  accent: string;
  color: string;
  border: string;
  onSelectSubcategory?: () => void;
}) => (
  <div className="pt-6 pb-3 md:pt-9 md:pb-4">
    <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${color} border ${border} flex items-center justify-center ${accent} shadow-sm shrink-0`}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-notoserif font-bold text-amber-200 tracking-tight leading-snug">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-300/75 font-gotu mt-0.5 line-clamp-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300/90 text-[11px] font-gotu backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>
            {count} {count === 1 ? 'रचना' : 'रचनाएँ'}
          </span>
        </div>
        {onSelectSubcategory && (
          <button
            onClick={onSelectSubcategory}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-gotu text-slate-400 hover:text-amber-200 transition-colors px-2 py-0.5 rounded-lg hover:bg-white/5 cursor-pointer"
            title="केवल यह अनुभाग देखें"
          >
            <span>विस्तार</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>

    {/* Auspicious Mangal Filigree Divider Rule */}
    <div className="relative flex items-center gap-2 pt-1">
      <div className="h-[1.5px] w-10 sm:w-16 bg-gradient-to-r from-amber-400/90 to-amber-500/40" />
      <span className="text-amber-400/90 text-xs select-none">❖</span>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-amber-500/35 via-amber-400/15 to-transparent" />
    </div>
  </div>
);

export const CategoryListing = ({
  categoryId,
  initialSubCategory,
  onNavigate,
  onBack,
}: CategoryListingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubCategory, setActiveSubCategory] = useState<string>(initialSubCategory || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  React.useEffect(() => {
    if (initialSubCategory) {
      setActiveSubCategory(initialSubCategory);
    } else {
      setActiveSubCategory('all');
    }
    const catTitle = categoryTitles[categoryId]?.title;
    updateCategorySeo(categoryId, catTitle);
  }, [initialSubCategory, categoryId]);

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

  const renderItemCard = (item: ContentItem, idx: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15, delay: Math.min(0.08, idx * 0.01) }}
      onClick={() => handleItemClick(item)}
      className="h-full"
    >
      <GlassCard
        variant="gilded"
        tilt
        className="p-3.5 sm:p-5 md:p-6 h-full min-h-[135px] sm:min-h-[145px] flex flex-col justify-between cursor-pointer group transition-all duration-300 relative overflow-hidden rounded-2xl border border-white/10 hover:border-amber-400/50 shadow-md"
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
            ) : (
              <span />
            )}

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
          <span className="truncate">
            {categoryId === 'puja'
              ? 'पूजन करें'
              : categoryId === 'vidhan'
              ? 'विधान अनुष्ठान'
              : categoryId === 'aarti'
              ? 'आरती करें'
              : categoryId === 'bhajan'
              ? 'भजन गायन'
              : 'स्वाध्याय'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </GlassCard>
    </motion.div>
  );

  const renderTimelineItem = (item: ContentItem, idx: number) => (
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
        tilt={{ maxTilt: 6, scale: 1.01 }}
        className="p-5 sm:p-6 sm:pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl transition-all duration-300 border border-white/10 hover:border-amber-400/50 shadow-md group"
      >
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
  );

  return (
    <div className="w-full max-w-6xl mx-auto pt-12 md:pt-16 page-bottom-clearance px-4 md:px-6 flex flex-col h-full overflow-x-hidden">
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

      {/* Book Details Hero Card for 105 Vrats Book */}
      {(categoryId === 'vrat' || categoryId === '105-vrat' || categoryId === 'vrat-vidhi') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard
            variant="gilded"
            className="p-5 md:p-7 bg-gradient-to-br from-amber-500/15 via-slate-900/85 to-amber-950/25 border-amber-400/30 relative overflow-hidden shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-semibold font-gotu">
                    पुस्तक का विवरण (Book Details)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-gotu">
                    महिलाओं के लिए विशेष
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-gotu">
                    नवीन संकलन • नया संस्करण
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-notoserif font-bold text-white tracking-tight leading-snug">
                  १०५ व्रतों की पूजा, विधि, उद्यापन
                </h2>
                <p className="text-slate-300 text-xs md:text-sm font-gotu leading-relaxed max-w-3xl">
                  नवीन संकलन एवं सरल विधि के साथ • संकलन/विधानाचार्य: <strong className="text-amber-200 font-medium">ब्रम्हचारी विनोद सागर शास्त्री</strong>
                </p>
              </div>

              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2.5 shrink-0">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                  <span className="block text-lg font-bold text-amber-300 font-mono">174</span>
                  <span className="text-[11px] text-slate-400 font-gotu">कुल विषय</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                  <span className="block text-lg font-bold text-amber-300 font-mono">6</span>
                  <span className="text-[11px] text-slate-400 font-gotu">अनुभाग</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                  <span className="block text-lg font-bold text-amber-300 font-mono">105</span>
                  <span className="text-[11px] text-slate-400 font-gotu">व्रत समुच्चय</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

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
          searchQuery.trim() ? (
            /* ========================================================================= */
            /* Search Results View */
            /* ========================================================================= */
            <motion.div
              key="search-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <div className="pt-2 pb-4">
                <div className="flex items-center justify-between text-xs font-gotu text-slate-400">
                  <span>
                    खोज परिणाम: &ldquo;{searchQuery}&rdquo; ({filteredItems.length}{' '}
                    {filteredItems.length === 1 ? 'रचना' : 'रचनाएँ'})
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    खोज साफ़ करें
                  </button>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-amber-500/30 via-white/10 to-transparent mt-2" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4.5">
                {filteredItems.map((item, idx) => renderItemCard(item, idx))}
              </div>
            </motion.div>
          ) : activeSubCategory === 'all' && subCategories.length > 0 ? (
            /* ========================================================================= */
            /* Sectioned View with Category Dividers for "All" View */
            /* ========================================================================= */
            <motion.div
              key="sectioned-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 md:space-y-8"
            >
              {subCategories
                .filter((sub) => sub.id !== 'all')
                .map((sub) => {
                  const subItems = items.filter((item) => item.subCategory === sub.id);
                  if (subItems.length === 0) return null;

                  const style = getSubCategoryStyle(sub.id);
                  const isThisDailyFlowTimeline =
                    categoryId === 'puja' && sub.id === 'daily-flow' && viewMode === 'timeline';

                  return (
                    <div key={sub.id} className="space-y-3">
                      {/* Ornamental Category Divider */}
                      <CategoryDivider
                        icon={getSubCategoryIcon(sub.id)}
                        title={sub.label}
                        subtitle={sub.description}
                        count={subItems.length}
                        accent={style.accent}
                        color={style.color}
                        border={style.border}
                        onSelectSubcategory={() => {
                          setActiveSubCategory(sub.id);
                          if (sub.id !== 'daily-flow' && viewMode === 'timeline') {
                            setViewMode('grid');
                          }
                        }}
                      />

                      {/* Content: Timeline or Responsive 2-Col Mobile Grid */}
                      {isThisDailyFlowTimeline ? (
                        <div className="relative space-y-4 md:space-y-5">
                          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400/60 via-amber-500/30 to-amber-600/10 hidden sm:block" />
                          {subItems.map((item, idx) => renderTimelineItem(item, idx))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4.5">
                          {subItems.map((item, idx) => renderItemCard(item, idx))}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Fallback for items with unassigned or unknown subcategory */}
              {(() => {
                const knownSubIds = new Set(subCategories.map((s) => s.id));
                const miscItems = items.filter(
                  (item) => !item.subCategory || !knownSubIds.has(item.subCategory)
                );
                if (miscItems.length === 0) return null;

                const style = getSubCategoryStyle('default');
                return (
                  <div className="space-y-3">
                    <CategoryDivider
                      icon={<BookOpen className="w-4 h-4" />}
                      title="विविध एवं अन्य संग्रह"
                      subtitle="अतिरिक्त प्रामाणिक रचनाएँ"
                      count={miscItems.length}
                      accent={style.accent}
                      color={style.color}
                      border={style.border}
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4.5">
                      {miscItems.map((item, idx) => renderItemCard(item, idx))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          ) : viewMode === 'timeline' && isDailyFlow ? (
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
              {filteredItems.map((item, idx) => renderTimelineItem(item, idx))}
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* Standard Grid View for Single Subcategory or Simple Category */
            /* ========================================================================= */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4.5"
            >
              {filteredItems.map((item, idx) => renderItemCard(item, idx))}
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

export default CategoryListing;