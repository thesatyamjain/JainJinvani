import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { HorizontalScrollContainer } from '../components/layout/HorizontalScrollContainer';
import { Calendar, Sparkles, ChevronRight, X, ChevronLeft, Flame, Shield, BookOpen, Clock, Heart } from 'lucide-react';
import { jainFestivals, type JainFestival } from '../data/festivals';
import { useModalBackHandler } from '../lib';

export interface ParvaPageProps {
  onBack: () => void;
}
export type FestivalsPageProps = ParvaPageProps;

interface FastRule {
  id: string;
  nameHindi: string;
  nameEn: string;
  type: string;
  description: string;
  rules: string[];
  spiritualBenefit: string;
}

const fastRulesData: FastRule[] = [
  {
    id: 'upavas',
    nameHindi: 'उपवास (Upavas / Fasting)',
    nameEn: 'Complete Fast',
    type: 'सर्वोच्च तप',
    description: 'उप + वास = आत्मा के समीप निवास करना। समस्त चार प्रकार के आहार (अशन, पान, खादिम, स्वादिम) का सर्वथा त्याग कर आत्म-चिंतन में लीन होना।',
    rules: [
      'सूर्यास्त के उपरांत एवं अगले दिन सूर्योदय तक रात्रि में किसी भी प्रकार का जल ग्रहण नहीं किया जाता।',
      'यदि सजल उपवास हो तो केवल दिन के समय एक या दो बार उबला हुआ प्रासुक (छना व गर्म) जल ग्रहण किया जा सकता है।',
      'सच्चे उपवास में मन, वचन और काया के समस्त सावद्य (पापकारी) व्यापार बंद कर सामायिक व स्वाध्याय किया जाता है।',
      'क्रोध, मान, माया, लोभ और प्रमाद का सर्वथा त्याग रखा जाता है।'
    ],
    spiritualBenefit: 'इंद्रिय और कषायों का पूर्ण दमन होता है तथा संचित कर्मों की तीव्र निर्जरा होती है।'
  },
  {
    id: 'ekasana',
    nameHindi: 'एकासन (Ekasan)',
    nameEn: 'One Meal a Day',
    type: 'रस व आहार संयम',
    description: 'दिन में सूर्य के प्रकाश में केवल एक ही स्थान पर एक ही आसन पर बैठकर सात्विक शुद्ध भोजन करना।',
    rules: [
      'भोजन करते समय एक बार बैठ जाने के बाद जब तक भोजन समाप्त न हो, आसन नहीं छोड़ा जाता।',
      'भोजन पूर्ण सात्विक, मर्यादित एवं छने हुए जल से बना होना चाहिए।',
      'सूर्यास्त से पूर्व ही भोजन संपन्न कर लिया जाता है। रात्रि में अन्न-जल का सर्वथा त्याग रहता है।',
      'भोजन के उपरांत दिन में केवल आवश्यकतानुसार प्रासुक जल ही ग्रहण किया जाता है।'
    ],
    spiritualBenefit: 'रसना (जिह्वा) इन्द्रिय की लोलुपता पर विजय और उदर शुद्धि।'
  },
  {
    id: 'biyasana',
    nameHindi: 'बियासन (Biyasan)',
    nameEn: 'Two Meals a Day',
    type: 'प्रारंभिक संयम',
    description: 'दिन के समय सूर्योदय के बाद और सूर्यास्त से पूर्व केवल दो बार सात्विक भोजन ग्रहण करना।',
    rules: [
      'दोनों समय का भोजन मर्यादित, शुद्ध और सात्विक होना चाहिए।',
      'मध्यवर्ती समय में कोई ठोस आहार ग्रहण नहीं किया जाता।',
      'रात्रि में अन्न-जल का त्याग अनिवार्य है।'
    ],
    spiritualBenefit: 'नियमित चर्या और अनावश्यक खाने की आदत से मुक्ति।'
  },
  {
    id: 'ayambil',
    nameHindi: 'आयंबिल (Ayambil / नीरस भोजन)',
    nameEn: 'Taste-Free Diet',
    type: 'रस परित्याग तप',
    description: 'जिह्वा के स्वाद पर विजय पाने हेतु छह प्रकार के रसों (दूध, दही, घी, तेल, शक्कर, नमक) का त्याग कर केवल रूखा-सूखा अन्न ग्रहण करना।',
    rules: [
      'विकृति के छहों पदार्थों: दूध, दही, घी, तेल, गुड़/शक्कर और तले हुए पदार्थों का सर्वथा त्याग।',
      'भोजन में केवल उबले हुए गेहूं, चावल, मूंग, चना आदि रूखे अनाज ही ग्रहण किए जाते हैं।',
      'दिन में केवल एक बार एकासन मुद्रा में ही ग्रहण किया जाता है।'
    ],
    spiritualBenefit: 'ब्रह्मचर्य की रक्षा, शरीर में आलस्य व प्रमाद का नाश एवं कषायों की मंदता।'
  },
  {
    id: 'parva-rules',
    nameHindi: 'अष्टमी व चतुर्दशी पर्व नियम',
    nameEn: 'Ashtami & Chaturdashi Observance',
    type: 'पाक्षिक पर्व व्रत',
    description: 'प्रत्येक मास के कृष्ण एवं शुक्ल पक्ष की अष्टमी व चतुर्दशी को जैन धर्म में पर्व दिवस माना जाता है।',
    rules: [
      'पर्व के दिन हरी वनस्पति, जमीकंद एवं ताजे फल-सब्जियों का त्याग किया जाता है (केवल सूखे मेवे व दाल-अनाज का सेवन)।',
      'आरंभ-समारंभ (खाना पकाने में अधिक अग्नि जलाना, वाहन चलाना, व्यापारिक भागदौड़) को सीमित किया जाता है।',
      'मंदिर में अभिषेक, शांतिधारा, पूजन, सामायिक एवं स्वाध्याय में अधिक से अधिक समय व्यतीत किया जाता है।'
    ],
    spiritualBenefit: 'गृहस्थ जीवन में रहकर भी पाक्षिक रूप से मुनिधर्म का आंशिक अभ्यास होना।'
  },
  {
    id: 'dashlakshan-rules',
    nameHindi: 'दशलक्षण महापर्व नियम (पर्युषण)',
    nameEn: 'Ten Virtues Observance Rules',
    type: 'वार्षिक महापर्व',
    description: 'भाद्रपद मास में आत्म-शुद्धि का दशलक्षण महापर्व मनाया जाता है, जिसमें उत्तम क्षमा से लेकर उत्तम ब्रह्मचर्य तक १० धर्मों की आराधना होती है।',
    rules: [
      'दस दिनों तक ब्रह्मचर्य का अनिवार्य पालन।',
      'रात्रि भोजन का पूर्ण त्याग एवं हरी शाक-भाजी का त्याग।',
      'दसों दिन यथाशक्ति उपवास, एकासन अथवा आयंबिल व्रत का अनुष्ठान।',
      'अंतिम दिन अनंत चतुर्दशी एवं क्षमावाणी पर्व पर समस्त जीवों से "मिच्छामि दुक्कडं" (उत्तम क्षमा) की याचना।'
    ],
    spiritualBenefit: 'क्रोध, मान, माया, लोभ का उपशमन कर सम्यग्दर्शन की उज्ज्वलता प्राप्त करना।'
  }
];

export const ParvaPage = ({ onBack }: ParvaPageProps) => {
  const [activeTab, setActiveTab] = useState<'festivals' | 'rules'>('festivals');
  const [selectedFestival, setSelectedFestival] = useState<JainFestival | null>(null);
  const [selectedRule, setSelectedRule] = useState<FastRule | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useModalBackHandler(!!selectedFestival, () => setSelectedFestival(null), 'festival-detail');
  useModalBackHandler(!!selectedRule, () => setSelectedRule(null), 'fast-rule-detail');

  const getFestivalIcon = (type: string) => {
    switch (type) {
      case 'jayanti': return '🙏';
      case 'parva': return '🕉️';
      case 'important': return '✨';
      default: return '🎊';
    }
  };

  const filteredFestivals = jainFestivals.filter((f) => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  return (
    <div className="w-full max-w-5xl mx-auto pt-6 sm:pt-12 md:pt-16 page-bottom-clearance px-3.5 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/15 hover:border-amber-500/40 transition-colors flex items-center justify-center group cursor-pointer shadow-md"
            title="वापस जाएं"
          >
            <ChevronLeft className="w-6 h-6 text-slate-200 group-hover:text-amber-200" />
          </motion.button>

          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold font-gotu">
            जैन उत्सव व व्रत विधि
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs mb-3 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-blue-300" />
            <span className="uppercase tracking-widest text-xs font-bold font-cinzel">Jain Festivals & Fasting Rules</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-rozha text-white mb-2 pt-1 pb-1 leading-tight drop-shadow-md">
            जैन पर्व एवं व्रत विधान
          </h1>
          <p className="text-slate-200 font-gotu text-sm sm:text-base font-medium leading-relaxed">
            पवित्र जैन तिथियां, वार्षिक महापर्व, कल्याणक जयंतियां एवं आगमोक्त उपवास नियम
          </p>
        </motion.div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="w-full flex items-center justify-center gap-2.5 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveTab('festivals')}
          className={`px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-gotu font-bold transition-all border cursor-pointer flex items-center gap-2 shadow-sm ${
            activeTab === 'festivals'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900/80 text-slate-200 border-white/15 hover:border-white/30 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>पर्व एवं उत्सव सूची ({jainFestivals.length})</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveTab('rules')}
          className={`px-4 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-gotu font-bold transition-all border cursor-pointer flex items-center gap-2 shadow-sm ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900/80 text-slate-200 border-white/15 hover:border-white/30 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>उपवास एवं व्रत नियम ({fastRulesData.length})</span>
        </motion.button>
      </div>

      {/* Sub-Filters for Festivals */}
      {activeTab === 'festivals' && (
        <HorizontalScrollContainer className="mb-6" innerClassName="justify-center">
          {[
            { id: 'all', label: 'सभी पर्व' },
            { id: 'parva', label: 'महापर्व' },
            { id: 'jayanti', label: 'जयंतियां' },
            { id: 'important', label: 'महत्वपूर्ण दिवस' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-gotu font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                filterType === tab.id
                  ? 'bg-amber-500/25 text-amber-200 border-amber-400/50 shadow-sm'
                  : 'bg-slate-900/70 text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </HorizontalScrollContainer>
      )}

      {/* Content: Festivals Grid */}
      {activeTab === 'festivals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFestivals.map((festival, idx) => (
            <motion.div
              key={festival.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <GlassCard
                tilt={{ maxTilt: 8, scale: 1.015, glareColor: 'amber' }}
                className="p-5 hover:border-amber-400/60 cursor-pointer transition-all group border-white/15 bg-slate-900/70 rounded-2xl shadow-md h-full flex flex-col justify-between"
                onClick={() => setSelectedFestival(festival)}
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                      {getFestivalIcon(festival.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                          {festival.nameHindi}
                        </h3>
                        <span className="text-[10px] sm:text-[11px] font-bold font-gotu px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 capitalize shrink-0">
                          {festival.type}
                        </span>
                      </div>
                      <p className="text-xs text-amber-300 font-gotu font-semibold">
                        {festival.name}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed line-clamp-2 mt-2">
                    {festival.descriptionHindi}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-gotu font-bold">
                  <span className="flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 text-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>तिथि: {festival.date}</span>
                  </span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>विवरण पढ़ें</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content: Fasting Rules Grid */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fastRulesData.map((rule, idx) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="h-full"
            >
              <GlassCard
                tilt={{ maxTilt: 8, scale: 1.015, glareColor: 'amber' }}
                className="p-5 hover:border-amber-400/60 cursor-pointer transition-all group border-white/15 bg-slate-900/70 rounded-2xl shadow-md h-full flex flex-col justify-between"
                onClick={() => setSelectedRule(rule)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] sm:text-[11px] font-bold font-gotu px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 shadow-sm">
                      {rule.type}
                    </span>
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white mb-1 group-hover:text-amber-200 transition-colors">
                    {rule.nameHindi}
                  </h3>
                  <p className="text-xs text-amber-300 font-gotu font-semibold mb-2">
                    {rule.nameEn}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 font-gotu leading-relaxed line-clamp-3">
                    {rule.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 group-hover:text-amber-200 font-gotu font-bold">
                  <span>पूर्ण नियम व फल</span>
                  <span className="text-amber-400">विस्तार से देखें →</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Festival Detail Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFestival(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg z-10 my-auto"
            >
              <GlassCard className="p-4 sm:p-7 border-amber-500/40 bg-slate-950/95 shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl max-h-[min(90vh,680px)] flex flex-col">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3 relative z-10 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-3xl sm:text-4xl shrink-0">{getFestivalIcon(selectedFestival.type)}</div>
                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white truncate">
                        {selectedFestival.nameHindi}
                      </h2>
                      <p className="text-amber-300 font-gotu text-xs sm:text-sm font-semibold truncate">
                        {selectedFestival.name}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedFestival(null)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/15"
                    title="बंद करें"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                  <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                    <div className="text-xs text-amber-300 uppercase tracking-wide mb-1 font-gotu font-bold">
                      पावन तिथि (Holy Tithi / Date)
                    </div>
                    <div className="text-white font-gotu font-bold text-base sm:text-lg">
                      {selectedFestival.date}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-amber-300 uppercase tracking-wide mb-2 font-gotu font-bold">
                      पर्व महात्म्य एवं विवरण
                    </div>
                    <p className="text-slate-100 font-gotu leading-relaxed break-words text-sm sm:text-base bg-white/5 p-4 rounded-xl border border-white/10">
                      {selectedFestival.descriptionHindi}
                    </p>
                    <p className="text-slate-300 font-gotu text-xs sm:text-sm mt-2.5 italic break-words px-1">
                      {selectedFestival.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs sm:text-sm font-bold border border-amber-400/30 capitalize">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>प्रकार: {selectedFestival.type}</span>
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFestival(null)}
                      className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-gotu text-xs font-semibold border border-white/15 cursor-pointer"
                    >
                      बंद करें
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fast Rule Detail Modal */}
      <AnimatePresence>
        {selectedRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRule(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg z-10 my-auto"
            >
              <GlassCard className="p-4 sm:p-7 border-amber-500/40 bg-slate-950/95 shadow-2xl relative overflow-hidden rounded-2xl sm:rounded-3xl max-h-[min(90vh,680px)] flex flex-col">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3 relative z-10 shrink-0">
                  <div className="min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/30 inline-block mb-1">
                      {selectedRule.type}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-notoserif font-bold text-white truncate">
                      {selectedRule.nameHindi}
                    </h2>
                    <p className="text-amber-300 font-gotu text-xs sm:text-sm font-semibold truncate">
                      {selectedRule.nameEn}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRule(null)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/15"
                    title="बंद करें"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-4 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                  <div>
                    <div className="text-xs text-amber-300 uppercase tracking-wide mb-1 font-gotu font-bold">
                      व्रत का अर्थ व परिचय
                    </div>
                    <p className="text-slate-100 font-gotu leading-relaxed text-xs sm:text-sm bg-white/5 p-3.5 rounded-xl border border-white/10">
                      {selectedRule.description}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs text-amber-300 uppercase tracking-wide mb-2 font-gotu font-bold flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>आगमोक्त पालन नियम (Fasting Rules)</span>
                    </div>
                    <ul className="space-y-2 bg-white/5 p-3.5 rounded-xl border border-white/10">
                      {selectedRule.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-100 font-gotu text-xs sm:text-sm leading-relaxed">
                          <span className="text-amber-400 mt-0.5 font-bold">✦</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs text-amber-300 uppercase tracking-wide mb-1 font-gotu font-bold flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>आध्यात्मिक लाभ व फल</span>
                    </div>
                    <p className="text-slate-100 font-gotu leading-relaxed text-xs sm:text-sm bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/25 font-medium">
                      {selectedRule.spiritualBenefit}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedRule(null)}
                      className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-gotu text-xs font-semibold border border-white/15 cursor-pointer"
                    >
                      बंद करें
                    </motion.button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FestivalsPage = ParvaPage;
