import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Search, CheckCircle, XCircle, AlertTriangle, Leaf, X } from 'lucide-react';
import { GlassCard } from '../components/layout/GlassCard';

interface DietaryPageProps {
  onBack: () => void;
}

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
  { name: 'अंजीर', englishName: 'Fig', status: 'prohibited', reason: 'उदुम्बर फल - इसमें अनेक सूक्ष्म जीव होते हैं', category: 'Fruit' },
  { name: 'बैंगन', englishName: 'Eggplant', status: 'prohibited', reason: 'बीज अधिक होने से और कीड़े पड़ने की संभावना', category: 'Vegetable' },
  { name: 'मक्खन', englishName: 'Butter', status: 'caution', reason: 'मर्यादा के अंदर भक्ष्य (ताजा निकाला हुआ)', category: 'Dairy' },
  { name: 'लौकी', englishName: 'Bottle Gourd', status: 'allowed', reason: 'भक्ष्य सब्जी', category: 'Vegetable' },
  { name: 'भिंडी', englishName: 'Ladyfinger', status: 'allowed', reason: 'भक्ष्य सब्जी (शोधन आवश्यक)', category: 'Vegetable' },
  { name: 'टमाटर', englishName: 'Tomato', status: 'allowed', reason: 'भक्ष्य (बीज रहित या शोधित)', category: 'Vegetable' },
  { name: 'दूध', englishName: 'Milk', status: 'allowed', reason: 'अहिंसक एवं मर्यादित - भक्ष्य', category: 'Dairy' },
  { name: 'दही', englishName: 'Curd', status: 'caution', reason: '२४ घंटे की मर्यादा के भीतर भक्ष्य', category: 'Dairy' },
  { name: 'फूलगोभी', englishName: 'Cauliflower', status: 'caution', reason: 'सूक्ष्म जीव होने की संभावना - शोधन आवश्यक', category: 'Vegetable' },
  { name: 'सेब', englishName: 'Apple', status: 'allowed', reason: 'भक्ष्य फल', category: 'Fruit' },
  { name: 'केला', englishName: 'Banana', status: 'allowed', reason: 'भक्ष्य फल', category: 'Fruit' },
  { name: 'मशरूम', englishName: 'Mushroom', status: 'prohibited', reason: 'कवक (Fungus) - पूर्णतः अभक्ष्य', category: 'Vegetable' },
  { name: 'पनीर', englishName: 'Paneer', status: 'caution', reason: 'यदि नींबू/दही से फाड़ा गया हो तो मर्यादा अनुसार भक्ष्य', category: 'Dairy' },
];

export const DietaryPage = ({ onBack }: DietaryPageProps) => {
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
    <div className="w-full max-w-6xl mx-auto pt-12 md:pt-16 pb-24 sm:pb-28 px-4 md:px-6 flex flex-col h-full overflow-x-hidden">
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
              भक्ष्य-अभक्ष्य विवेक
            </h1>
            <p className="text-slate-300/80 text-xs md:text-sm font-gotu mt-0.5">
              शुद्ध अहिंसक आहार एवं यम-नियम • {filteredItems.length} सामग्री
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="सामग्री खोजें... (जैसे आलू, दूध, सोंठ)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/80 border border-white/15 rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:bg-slate-900 focus:border-amber-400/60 transition-all font-gotu shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                title="खोज साफ़ करें"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-2 mb-7 overflow-x-auto custom-scrollbar pb-1"
      >
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer shrink-0 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/20 text-amber-200 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-semibold'
              : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
          }`}
        >
          <span>सभी सामग्री</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-amber-300/90 ml-1">
            {countAll}
          </span>
        </button>

        <button
          onClick={() => setFilter('allowed')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer shrink-0 ${
            filter === 'allowed'
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] font-semibold'
              : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-emerald-500/30 hover:bg-slate-800/60'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>भक्ष्य (ग्रहण योग्य)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 ml-1">
            {countAllowed}
          </span>
        </button>

        <button
          onClick={() => setFilter('prohibited')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer shrink-0 ${
            filter === 'prohibited'
              ? 'bg-rose-500/20 text-rose-200 border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.2)] font-semibold'
              : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-rose-500/30 hover:bg-slate-800/60'
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>अभक्ष्य (सर्वथा त्याज्य)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-300 ml-1">
            {countProhibited}
          </span>
        </button>

        <button
          onClick={() => setFilter('caution')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-gotu text-xs md:text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer shrink-0 ${
            filter === 'caution'
              ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] font-semibold'
              : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-amber-500/30 hover:bg-slate-800/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>विवेक (मर्यादित)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 ml-1">
            {countCaution}
          </span>
        </button>
      </motion.div>

      {/* Grid of Food Items */}
      <AnimatePresence mode="wait">
        {filteredItems.length > 0 ? (
          <motion.div
            key="food-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
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
                  className="p-5 md:p-6 h-full flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-white/10 hover:border-amber-400/40 shadow-md"
                >
                  <div>
                    {/* Item Top Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-cinzel tracking-wider uppercase">
                          {item.englishName}
                        </span>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        {item.status === 'allowed' && (
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                        )}
                        {item.status === 'prohibited' && (
                          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-300">
                            <XCircle className="w-5 h-5" />
                          </div>
                        )}
                        {item.status === 'caution' && (
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-gotu font-semibold tracking-wide border ${
                          item.status === 'allowed'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : item.status === 'prohibited'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.status === 'allowed'
                          ? 'भक्ष्य (ग्रहण योग्य)'
                          : item.status === 'prohibited'
                          ? 'अभक्ष्य (त्याज्य)'
                          : 'विवेक (मर्यादा अनुसार)'}
                      </span>
                    </div>

                    {/* Reason / Explanation */}
                    <p className="text-xs md:text-sm text-slate-300/85 leading-relaxed font-gotu">
                      {item.reason}
                    </p>
                  </div>

                  {/* Card Footer Category */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-gotu">
                    <span className="text-amber-300/80">श्रेणी: {item.category}</span>
                    <span className="font-mono text-[10px] text-slate-500">#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
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
              <Leaf className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-notoserif font-bold text-white mb-1.5">कोई सामग्री नहीं मिली</h3>
            <p className="text-slate-400 font-gotu text-sm max-w-sm">
              "{searchTerm}" के लिए कोई परिणाम नहीं मिला। कृपया कोई अन्य शब्द खोजें।
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-gotu transition-colors cursor-pointer"
            >
              सभी सामग्री देखें
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Note Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <GlassCard variant="sacred" className="p-6 md:p-8 flex items-start gap-4 rounded-2xl border border-amber-500/25">
          <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-300 shrink-0 border border-amber-400/30 shadow-inner">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-notoserif font-bold text-white mb-1.5 text-amber-200">
              आहार शुद्धि व अहिंसा सिद्धांत
            </h4>
            <p className="text-xs md:text-sm text-slate-300/85 leading-relaxed font-gotu">
              जैन दर्शन में भक्ष्य-अभक्ष्य का विवेक केवल स्वास्थ्य के लिए नहीं, बल्कि अहिंसा धर्म के पालन और आत्म-विशुद्धि के लिए है।
              अनंतकाय (जिसमें एक शरीर में अनंत जीव हों जैसे आलू, प्याज, लहसुन आदि जमीकंद) और चलितरस (मर्यादा रहित) भोजन सर्वथा त्याज्य है।
              श्रावक को रात्रि भोजन का भी यथाशक्ति त्याग करना चाहिए।
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
