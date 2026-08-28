import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, CheckCircle, XCircle, AlertTriangle, Leaf, Carrot } from 'lucide-react';
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
  { name: 'शहद', englishName: 'Honey', status: 'prohibited', reason: 'मधुमक्खी की उल्टी - हिंसाजनक', category: 'Animal Product' },
  { name: 'अंजीर', englishName: 'Fig', status: 'prohibited', reason: 'उदुम्बर फल - इसमें अनेक सूक्ष्म जीव होते हैं', category: 'Fruit' },
  { name: 'बैंगन', englishName: 'Eggplant', status: 'prohibited', reason: 'बीज अधिक होने से और कीड़े पड़ने की संभावना', category: 'Vegetable' },
  { name: 'मक्खन', englishName: 'Butter', status: 'caution', reason: 'मर्यादा के अंदर भक्ष्य (ताजा)', category: 'Dairy' },
  { name: 'लौकी', englishName: 'Bottle Gourd', status: 'allowed', reason: 'भक्ष्य सब्जी', category: 'Vegetable' },
  { name: 'भिंडी', englishName: 'Ladyfinger', status: 'allowed', reason: 'भक्ष्य सब्जी (शोधन आवश्यक)', category: 'Vegetable' },
  { name: 'टमाटर', englishName: 'Tomato', status: 'allowed', reason: 'भक्ष्य (बीज रहित या शोधित)', category: 'Vegetable' },
  { name: 'दूध', englishName: 'Milk', status: 'allowed', reason: 'अहिंसक तरीके से प्राप्त - भक्ष्य', category: 'Dairy' },
  { name: 'दही', englishName: 'Curd', status: 'caution', reason: '२४ घंटे की मर्यादा के भीतर भक्ष्य', category: 'Dairy' },
  { name: 'फूलगोभी', englishName: 'Cauliflower', status: 'caution', reason: 'अनंत जीव होने की संभावना - देखकर शोधन करें', category: 'Vegetable' },
  { name: 'सेब', englishName: 'Apple', status: 'allowed', reason: 'भक्ष्य फल', category: 'Fruit' },
  { name: 'केला', englishName: 'Banana', status: 'allowed', reason: 'भक्ष्य फल', category: 'Fruit' },
  { name: 'मशरूम', englishName: 'Mushroom', status: 'prohibited', reason: 'कवक (Fungus) - अनिष्ट कारक', category: 'Vegetable' },
  { name: 'पनीर', englishName: 'Paneer', status: 'caution', reason: 'यदि नींबू से फाड़ा गया है तो भक्ष्य (मर्यादा अनुसार)', category: 'Dairy' },
];

export const DietaryPage = ({ onBack }: DietaryPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'allowed' | 'prohibited'>('all');

  const filteredItems = foodDatabase.filter(item => {
    const matchesSearch = item.name.includes(searchTerm) || item.englishName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'allowed' && (item.status === 'allowed' || item.status === 'caution')) ||
      (filter === 'prohibited' && item.status === 'prohibited');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto pt-24 pb-32 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
          >
            <ArrowLeft className="w-6 h-6 text-blue-100 group-hover:-translate-x-1 transition-transform" />
          </button>

          <div>
            <h1 className="text-3xl font-rozha text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-400 pt-1.5 pb-0.5 leading-[1.35]">
              भक्ष्य-अभक्ष्य विवेक
            </h1>
            <p className="text-blue-100/60 font-gotu text-sm mt-1">
              शुद्ध आहार - शुद्ध विचार
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/50 group-focus-within:text-blue-200 transition-colors" />
            <input
              type="text"
              placeholder="Search (e.g., Aloo, Milk)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all"
            />
          </div>

          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'all' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('allowed')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'allowed' ? 'bg-emerald-500/20 text-emerald-200' : 'text-white/50 hover:text-white'}`}
            >
              Bhakshya
            </button>
            <button
              onClick={() => setFilter('prohibited')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'prohibited' ? 'bg-red-500/20 text-red-200' : 'text-white/50 hover:text-white'}`}
            >
              Abhakshya
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-4 h-full flex flex-col hover:bg-white/10 transition-colors border-white/5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold font-gotu text-white">{item.name}</h3>
                  <span className="text-xs text-white/40 uppercase tracking-wide">{item.englishName}</span>
                </div>
                {item.status === 'allowed' && <CheckCircle className="w-6 h-6 text-emerald-400" />}
                {item.status === 'prohibited' && <XCircle className="w-6 h-6 text-red-400" />}
                {item.status === 'caution' && <AlertTriangle className="w-6 h-6 text-amber-400" />}
              </div>

              <div className="mt-auto">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2
                  ${item.status === 'allowed' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                    item.status === 'prohibited' ? 'bg-red-500/10 text-red-300 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                  {item.status === 'allowed' ? 'Bhakshya (Allowed)' : item.status === 'prohibited' ? 'Abhakshya (Prohibited)' : 'Caution (Vivek)'}
                </div>

                <p className="text-sm text-blue-100/70 leading-relaxed font-gotu">
                  {item.reason}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/30">
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No items found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
        <div className="p-3 bg-amber-500/20 rounded-xl h-fit text-amber-300">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white mb-2">नोट</h4>
          <p className="text-sm text-blue-100/70 leading-relaxed">
            जैन धर्म में भक्ष्य-अभक्ष्य का विवेक केवल स्वास्थ्य के लिए नहीं, बल्कि अहिंसा धर्म के पालन के लिए है।
            अनंतकाय (जिसमें अनंत जीव हों) और चलितरस (सड़ा-गला) भोजन सर्वथा त्याज्य है। रात्रि भोजन का भी त्याग करना चाहिए।
          </p>
        </div>
      </div>
    </div>
  );
};
