import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Leaf,
  X,
  Sparkles,
  CheckSquare,
  ShieldCheck,
  HeartHandshake,
  Sun,
  Droplets,
  BookOpen
} from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';

export interface AaharPageProps {
  onBack: () => void;
}
export type DietaryPageProps = AaharPageProps;

type FoodStatus = 'allowed' | 'prohibited' | 'caution';

interface FoodItem {
  name: string;
  englishName: string;
  status: FoodStatus;
  reason: string;
  category: string;
}

const foodDatabase: FoodItem[] = [
  { name: 'आलू', englishName: 'Potato', status: 'prohibited', reason: 'जमीनकंद (Root Vegetable) - अनंतकाय जीव', category: 'Vegetable' },
  { name: 'प्याज', englishName: 'Onion', status: 'prohibited', reason: 'जमीनकंद (Root Vegetable) - तामसिक', category: 'Vegetable' },
  { name: 'लहसुन', englishName: 'Garlic', status: 'prohibited', reason: 'जमीनकंद (Root Vegetable) - तामसिक', category: 'Vegetable' },
  { name: 'अदरक', englishName: 'Ginger', status: 'prohibited', reason: 'साधारण वनस्पति (ताजा) - सुखाकर (सोंठ) भक्ष्य है', category: 'Vegetable' },
  { name: 'गाजर', englishName: 'Carrot', status: 'prohibited', reason: 'जमीनकंद (Root Vegetable)', category: 'Vegetable' },
  { name: 'मूली', englishName: 'Radish', status: 'prohibited', reason: 'जमीनकंद (Root Vegetable)', category: 'Vegetable' },
  { name: 'शहद', englishName: 'Honey', status: 'prohibited', reason: 'मधुमक्खी की उल्टी - अत्यंत हिंसाजनक', category: 'Animal Product' },
  { name: 'अंजीर', englishName: 'Fig', status: 'prohibited', reason: 'उदुम्बर फल - इसमें अनेक सूक्ष्म त्रस जीव होते हैं', category: 'Fruit' },
  { name: 'बैंगन', englishName: 'Eggplant', status: 'prohibited', reason: 'बीज अधिक होने से और कीड़े पड़ने की प्रबल संभावना', category: 'Vegetable' },
  { name: 'मक्खन', englishName: 'Butter', status: 'caution', reason: 'मर्यादा के अंदर भक्ष्य (ताजा बिलोया हुआ, द्विदल रहित)', category: 'Dairy' },
  { name: 'लौकी', englishName: 'Bottle Gourd', status: 'allowed', reason: 'शुद्ध भक्ष्य सब्जी (शोधन उपरांत)', category: 'Vegetable' },
  { name: 'भिंडी', englishName: 'Ladyfinger', status: 'allowed', reason: 'भक्ष्य सब्जी (शोधन व चीरा लगाकर देखना आवश्यक)', category: 'Vegetable' },
  { name: 'टमाटर', englishName: 'Tomato', status: 'allowed', reason: 'भक्ष्य (बीज रहित या प्रासुक शोधित)', category: 'Vegetable' },
  { name: 'दूध', englishName: 'Milk', status: 'allowed', reason: 'अहिंसक एवं मर्यादित - विधिवत उबाला हुआ भक्ष्य', category: 'Dairy' },
  { name: 'दही', englishName: 'Curd', status: 'caution', reason: '२४ घंटे की मर्यादा के भीतर भक्ष्य (द्विदल दोष रहित)', category: 'Dairy' },
  { name: 'फूलगोभी', englishName: 'Cauliflower', status: 'caution', reason: 'सूक्ष्म जीव होने की संभावना - भलीभांति शोधन अनिवार्य', category: 'Vegetable' },
  { name: 'सेब', englishName: 'Apple', status: 'allowed', reason: 'भक्ष्य फल (प्रासुक जल से धोकर व छीलकर)', category: 'Fruit' },
  { name: 'केला', englishName: 'Banana', status: 'allowed', reason: 'भक्ष्य फल (बिना दाग वाला)', category: 'Fruit' },
  { name: 'मशरूम', englishName: 'Mushroom', status: 'prohibited', reason: 'कवक (Fungus) - पूर्णतः अभक्ष्य व अपवित्र', category: 'Vegetable' },
  { name: 'पनीर', englishName: 'Paneer', status: 'caution', reason: 'यदि नींबू/दही से फाड़ा गया हो तो मर्यादा अनुसार भक्ष्य', category: 'Dairy' },
];

const navadhaBhaktiSteps = [
  {
    step: 1,
    title: 'पड़गाहन (प्रतिग्रहण)',
    desc: 'मुनिराज को आते देखकर "हे स्वामी! नमोऽस्तु, नमोऽस्तु, नमोऽस्तु! अत्र तिष्ठ तिष्ठ" कहकर आदरपूर्वक रुकने की प्रार्थना करना और तीन प्रदक्षिणा देना।',
    icon: Sparkles
  },
  {
    step: 2,
    title: 'उच्चासन प्रदान',
    desc: 'मुनिराज को चौके में शुद्ध, प्रासुक, काष्ठ अथवा प्रासुक आसन पर ससम्मान विराजमान करना।',
    icon: ShieldCheck
  },
  {
    step: 3,
    title: 'पाद प्रक्षालन',
    desc: 'मुनिराज के दोनों चरण-कमलों को प्रासुक एवं शुद्ध जल से धोना तथा उस चरणोदक को विनयपूर्वक मस्तक पर धारण करना।',
    icon: Droplets
  },
  {
    step: 4,
    title: 'पूजन व अर्चन',
    desc: 'मुनिराज के वीतरागी गुणों का अष्टद्रव्य (जल, चंदन, अक्षत, पुष्प, नैवेद्य, दीप, धूप, फल) से भावपूर्वक पूजन करना।',
    icon: BookOpen
  },
  {
    step: 5,
    title: 'नमस्कार (प्रणाम)',
    desc: 'मुनिराज को मन, वचन, काय से साष्टांग अथवा पंचांग नमोऽस्तु/नमस्कार करना।',
    icon: HeartHandshake
  },
  {
    step: 6,
    title: 'मन शुद्धि',
    desc: '"हे भगवन! मेरा मन शुद्ध है" - मन में किसी प्रकार का राग, द्वेष, कलह, लोभ या संक्लेश नहीं है।',
    icon: Sparkles
  },
  {
    step: 7,
    title: 'वचन शुद्धि',
    desc: '"हे भगवन! मेरे वचन शुद्ध हैं" - असत्य, कठोर, अप्रिय अथवा अनर्गल वचनों का सर्वथा त्याग है।',
    icon: ShieldCheck
  },
  {
    step: 8,
    title: 'काय शुद्धि',
    desc: '"हे भगवन! मेरी काया शुद्ध है" - स्नान, प्रासुक धुले वस्त्र एवं बाह्य-अंतरंग पवित्रता विद्यमान है।',
    icon: Sun
  },
  {
    step: 9,
    title: 'आहार-जल शुद्धि',
    desc: '"हे भगवन! आहार एवं जल शुद्ध, प्रासुक और आगम की मर्यादा अनुसार तैयार है" - ४६ दोष एवं ३२ अंतरायों से रहित।',
    icon: Leaf
  }
];

const shuddhiRules = [
  {
    title: 'द्रव्य शुद्धि',
    desc: 'अहिंसक, मर्यादित, शुद्ध प्रासुक खाद्य सामग्री। जमीकंद, अभक्ष्य, द्विदल आदि दोषों से पूर्णतः मुक्त।'
  },
  {
    title: 'क्षेत्र शुद्धि',
    desc: 'चौका स्थान जीवों से रहित, शुद्ध, स्वच्छ एवं प्रासुक होना चाहिए। भूमि को देख-शोधकर बुहारा गया हो।'
  },
  {
    title: 'काल शुद्धि',
    desc: 'मुनि आहार केवल दिन के समय, सूर्योदय के उपरांत और सूर्यास्त से पूर्व पर्याप्त प्रकाश में ही होता है।'
  },
  {
    title: 'भाव शुद्धि',
    desc: 'दान देने वाले श्रावक के परिणाम अत्यंत विशुद्ध, श्रद्धावान, निरहंकारी और वात्सल्यमय होने चाहिए।'
  }
];

export const AaharPage = ({ onBack }: AaharPageProps) => {
  const [activeMainTab, setActiveMainTab] = useState<'shuddhi' | 'muniCharya'>('shuddhi');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'allowed' | 'prohibited' | 'caution'>('all');

  const filteredItems = foodDatabase.filter((item) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.englishName.toLowerCase().includes(query) ||
      item.reason.toLowerCase().includes(query);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'allowed' && item.status === 'allowed') ||
      (filter === 'prohibited' && item.status === 'prohibited') ||
      (filter === 'caution' && item.status === 'caution');

    return matchesSearch && matchesFilter;
  });

  const countAll = foodDatabase.length;
  const countAllowed = foodDatabase.filter((f) => f.status === 'allowed').length;
  const countProhibited = foodDatabase.filter((f) => f.status === 'prohibited').length;
  const countCaution = foodDatabase.filter((f) => f.status === 'caution').length;

  return (
    <div className="w-full max-w-6xl mx-auto pt-16 md:pt-20 page-bottom-clearance px-4 md:px-6 flex flex-col h-full overflow-x-hidden">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-white/15 flex items-center justify-center hover:bg-amber-500/25 hover:border-amber-400/50 transition-colors backdrop-blur-xl shrink-0 group cursor-pointer shadow-md"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-amber-200" />
          </motion.button>
          <div className="py-1">
            <h1 className="text-3xl md:text-4xl font-notoserif font-bold text-white pt-1 pb-1 leading-[1.35] drop-shadow-[0_2px_15px_rgba(245,158,11,0.25)]">
              आहार शुद्धि व मुनि चर्या
            </h1>
            <p className="text-slate-200 text-xs md:text-sm font-gotu mt-0.5 font-medium">
              भक्ष्य-अभक्ष्य विवेक, मुनि आहार विधि एवं नवधा भक्ति विधान
            </p>
          </div>
        </div>

        {/* Tab Switcher: Dietary Items vs Muni Aahar Charya */}
        <div className="flex bg-slate-900/80 rounded-full p-1 border border-white/15 shadow-sm">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveMainTab('shuddhi')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-gotu font-bold transition-all cursor-pointer ${
              activeMainTab === 'shuddhi'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🥗 भक्ष्य-अभक्ष्य विवेक
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveMainTab('muniCharya')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-gotu font-bold transition-all cursor-pointer ${
              activeMainTab === 'muniCharya'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🙏 मुनि आहार व नवधा भक्ति
          </motion.button>
        </div>
      </motion.div>

      {/* Main Tab 1: Food Items Database */}
      {activeMainTab === 'shuddhi' ? (
        <>
          {/* Search & Filter Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search Input Box */}
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300" />
              <input
                type="text"
                placeholder="सामग्री खोजें... (जैसे आलू, दूध, सोंठ)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/20 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:bg-slate-900 focus:border-amber-400/60 transition-all font-gotu shadow-inner"
              />
              {searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
                  title="खोज साफ़ करें"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>

            {/* Filter Tabs Chips */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                  filter === 'all'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-sm font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <span>सभी</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-amber-300 font-bold ml-1">
                  {countAll}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter('allowed')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                  filter === 'allowed'
                    ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50 shadow-sm font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-emerald-500/30 hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>भक्ष्य</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold ml-1">
                  {countAllowed}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter('prohibited')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                  filter === 'prohibited'
                    ? 'bg-rose-500/25 text-rose-200 border-rose-400/50 shadow-sm font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-rose-500/30 hover:bg-slate-800'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>अभक्ष्य</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold ml-1">
                  {countProhibited}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setFilter('caution')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all border cursor-pointer shrink-0 ${
                  filter === 'caution'
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-sm font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-amber-500/30 hover:bg-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>मर्यादित</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold ml-1">
                  {countCaution}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Grid of Food Items */}
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key="food-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
              >
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: Math.min(0.08, idx * 0.015) }}
                    className="h-full"
                  >
                    <GlassCard
                      variant="gilded"
                      tilt={{ maxTilt: 8, scale: 1.02 }}
                      className="p-5 md:p-6 h-full flex flex-col justify-between bg-slate-900/85 hover:bg-slate-850 group transition-all duration-300 rounded-2xl border border-white/15 hover:border-amber-400/50 shadow-lg"
                    >
                      <div>
                        {/* Item Top Row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-xs text-amber-300/90 font-cinzel font-semibold tracking-wider uppercase">
                              {item.englishName}
                            </span>
                          </div>

                          <div className="shrink-0 pt-0.5">
                            {item.status === 'allowed' && (
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-sm">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            )}
                            {item.status === 'prohibited' && (
                              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shadow-sm">
                                <XCircle className="w-5 h-5" />
                              </div>
                            )}
                            {item.status === 'caution' && (
                              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-gotu font-bold tracking-wide border shadow-sm ${
                              item.status === 'allowed'
                                ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                                : item.status === 'prohibited'
                                ? 'bg-rose-500/20 text-rose-200 border-rose-400/40'
                                : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                            }`}
                          >
                            {item.status === 'allowed'
                              ? '✓ भक्ष्य (ग्रहण योग्य)'
                              : item.status === 'prohibited'
                              ? '✗ अभक्ष्य (त्याज्य)'
                              : '⚠ विवेक (मर्यादा अनुसार)'}
                          </span>
                        </div>

                        {/* Reason / Explanation */}
                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-gotu">
                          {item.reason}
                        </p>
                      </div>

                      {/* Card Footer Category */}
                      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-gotu">
                        <span className="text-amber-300 font-medium">श्रेणी: {item.category}</span>
                        <span className="font-mono text-xs text-slate-400 font-bold">#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Empty Search State */
              <motion.div
                key="empty-dietary"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                  <Leaf className="w-8 h-8 text-amber-300/60" />
                </div>
                <h3 className="text-xl font-notoserif font-bold text-white mb-1.5">कोई सामग्री नहीं मिली</h3>
                <p className="text-slate-300 font-gotu text-sm max-w-sm">
                  "{searchTerm}" के लिए कोई परिणाम नहीं मिला। कृपया कोई अन्य शब्द खोजें।
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500/25 border border-amber-400/50 hover:bg-amber-500/35 text-amber-200 text-xs font-gotu font-bold transition-colors cursor-pointer"
                >
                  सभी सामग्री देखें
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Main Tab 2: Muni Aahar Charya & Navadha Bhakti */
        <div className="space-y-8">
          {/* Navadha Bhakti Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-2xl font-rozha text-white">नवधा भक्ति विधान (९ चरण)</h2>
            </div>
            <p className="text-sm text-slate-200 font-gotu mb-6">
              श्रावक द्वारा मुनिराज को आहार अर्पण करते समय इन ९ भक्तियों का विधिपूर्वक पालन किया जाता है:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {navadhaBhaktiSteps.map((step) => (
                <GlassCard
                  key={step.step}
                  variant="gilded"
                  tilt={{ maxTilt: 6 }}
                  className="p-5 bg-slate-900/85 border border-white/15 hover:border-amber-400/50 rounded-2xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold font-mono">
                        {step.step}
                      </div>
                      <span className="text-[11px] font-gotu font-semibold px-2 py-0.5 rounded-full bg-white/10 text-amber-200 border border-white/15">
                        चरण #{step.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-rozha text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Muni Aahar Charya Essential Rules */}
          <GlassCard variant="sacred" className="p-6 sm:p-8 bg-slate-900/90 border border-amber-500/35 rounded-3xl shadow-xl">
            <h3 className="text-xl sm:text-2xl font-rozha text-amber-200 mb-4 flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-300" />
              <span>दिगम्बर मुनि आहार चर्या के मुख्य नियम</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white text-base font-gotu mb-1 text-amber-300">१. स्थिति भोजन</h4>
                <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  मुनिराज बैठकर नहीं, बल्कि दोनों पैरों को बराबर रखकर सीधे खड़े होकर पाणिपात्र (अंजलि) में आहार लेते हैं।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white text-base font-gotu mb-1 text-amber-300">२. एकभुक्ति (दिन में एक बार)</h4>
                <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  २४ घंटे में केवल एक बार दिन के पर्याप्त प्रकाश में आहार-जल ग्रहण करते हैं। रात्रि भोजन का सर्वथा त्याग होता है।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white text-base font-gotu mb-1 text-amber-300">३. रस परित्याग व मौन</h4>
                <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  स्वाद के लिए नहीं, केवल देह यात्रा और संयम पालन हेतु आहार लेते हैं। आहार लेते समय पूर्ण मौन धारण रखते हैं।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="font-bold text-white text-base font-gotu mb-1 text-amber-300">४. ४६ दोष एवं ३२ अंतराय त्याग</h4>
                <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed">
                  उद्गम, उत्पाद, एषणा आदि ४६ दोषों तथा बाल, कीड़ा, रुधिर, अश्रु आदि ३२ अंतरायों को टालकर निर्दोष आहार ग्रहण करते हैं।
                </p>
              </div>
            </div>
          </GlassCard>

          {/* 4 Shuddhi Principles */}
          <div>
            <h3 className="text-xl font-rozha text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>चतुर्विध शुद्धि (आहार अर्पण की ४ आधारशिलाएं)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {shuddhiRules.map((rule, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-white/15">
                  <div className="text-amber-300 font-bold text-lg font-rozha mb-2">{rule.title}</div>
                  <p className="text-xs text-slate-200 font-gotu leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sacred Note Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <GlassCard variant="sacred" className="p-6 md:p-8 flex items-start gap-4 rounded-2xl border border-amber-500/35 bg-slate-900/90 shadow-xl">
          <div className="p-3 bg-amber-500/25 rounded-2xl text-amber-300 shrink-0 border border-amber-400/40 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-notoserif font-bold text-amber-200 mb-1.5">
              आहार शुद्धि व अहिंसा सिद्धांत
            </h4>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-gotu">
              जैन दर्शन में भक्ष्य-अभक्ष्य का विवेक केवल शारीरिक स्वास्थ्य के लिए नहीं, बल्कि अहिंसा धर्म के पालन और आत्म-विशुद्धि के लिए है।
              अनंतकाय (जिसमें एक शरीर में अनंत जीव हों जैसे आलू, प्याज, लहसुन आदि जमीकंद) और चलितरस (मर्यादा रहित) भोजन सर्वथा त्याज्य है।
              श्रावक को रात्रि भोजन का भी यथाशक्ति त्याग कर शुद्ध प्रासुक भोजन ग्रहण करना चाहिए।
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export const DietaryPage = AaharPage;
