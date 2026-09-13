import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { TiltCard } from '../components/layout/TiltCard';
import { ChevronLeft, Clock, Flame, Droplet, Sparkles, Sun, Moon, Star, X } from 'lucide-react';
import { useModalBackHandler } from '../lib';


const ritualsData = [
  {
    id: 'dev-darshan',
    icon: <Sun className="w-8 h-8 text-amber-400" />,
    emoji: '🙏',
    title: 'देव दर्शन',
    titleEn: 'Dev Darshan',
    time: 'प्रातःकाल',
    duration: '15-30 मिनट',
    category: 'daily',
    steps: [
      'स्नान करके शुद्ध हो जाएं',
      'मंदिर या घर के पूजा स्थल पर जाएं',
      'णमोकार मंत्र का जाप करें',
      'तीर्थंकर की प्रतिमा के दर्शन करें',
      '"णमो अरिहंताणं" बोलें',
      'सिर झुकाकर वंदना करें'
    ],
    mantra: 'णमो अरिहंताणं, णमो सिद्धाणं, णमो आयरियाणं, णमो उवज्झायाणं, णमो लोए सव्व साहूणं',
    benefits: 'मन की शांति, आध्यात्मिक विकास, दिन की शुभ शुरुआत'
  },
  {
    id: 'pratikraman',
    icon: <Moon className="w-8 h-8 text-blue-400" />,
    emoji: '🌙',
    title: 'प्रतिक्रमण',
    titleEn: 'Pratikraman',
    time: 'सायंकाल',
    duration: '30-60 मिनट',
    category: 'daily',
    steps: [
      'शुद्ध मन से बैठें',
      'दिनभर के पापों का स्मरण करें',
      'प्रायश्चित करें',
      'प्रतिक्रमण सूत्र पढ़ें',
      'सभी जीवों से क्षमा मांगें',
      'मिच्छामि दुक्कडम बोलें'
    ],
    mantra: 'खामेमि सव्वे जीवा, सव्वे जीवा खमंतु मे। मित्ती मे सव्व भूएसु, वेरं मज्झं न केणवि।',
    benefits: 'आत्म-शुद्धि, पाप निवारण, मन की शांति'
  },
  {
    id: 'snatra-puja',
    icon: <Droplet className="w-8 h-8 text-cyan-400" />,
    emoji: '💧',
    title: 'स्नात्र पूजा',
    titleEn: 'Snatra Puja',
    time: 'प्रातः या विशेष अवसर',
    duration: '45-90 मिनट',
    category: 'special',
    steps: [
      'प्रतिमा को पीढ़े पर रखें',
      'जल से स्नान कराएं',
      'दूध से स्नान कराएं',
      'घी से अभिषेक करें',
      'केसर से तिलक लगाएं',
      'फूल और अक्षत चढ़ाएं',
      'धूप-दीप करें',
      'नैवेद्य अर्पित करें',
      'फल चढ़ाएं'
    ],
    mantra: 'ॐ ह्रीं श्री वीतरागाय नमः',
    benefits: 'पुण्य प्राप्ति, भक्ति भावना, आध्यात्मिक उन्नति'
  },
  {
    id: 'chaityavandan',
    icon: <Flame className="w-8 h-8 text-orange-400" />,
    emoji: '🔥',
    title: 'चैत्य वंदन',
    titleEn: 'Chaityavandan',
    time: 'दिन में तीन बार',
    duration: '20-30 मिनट',
    category: 'daily',
    steps: [
      'मंदिर या पूजा स्थल पर जाएं',
      'णमोकार मंत्र से शुरुआत करें',
      'चैत्य वंदन पाठ करें',
      'तीर्थंकरों की स्तुति करें',
      'लोगस्स सूत्र पढ़ें',
      'क्षमापना करें'
    ],
    mantra: 'णमो अरिहंताणं, णमो सिद्धाणं...',
    benefits: 'आत्म-जागृति, पाप नाश, मनोबल वृद्धि'
  },
  {
    id: 'samayik',
    icon: <Star className="w-8 h-8 text-purple-400" />,
    emoji: '⭐',
    title: 'सामायिक',
    titleEn: 'Samayik',
    time: 'किसी भी समय',
    duration: '48 मिनट',
    category: 'daily',
    steps: [
      'शांत स्थान पर बैठें',
      'सामायिक का संकल्प लें',
      '48 मिनट तक ध्यान करें',
      'किसी भी प्रकार की हिंसा न करें',
      'मन को शांत रखें',
      'णमोकार मंत्र का जाप करें',
      'सामायिक का पारण करें'
    ],
    mantra: 'करेमि भंते! सामाइयं सावज्जं जोगं पच्चक्खामि।',
    benefits: 'आत्म-संयम, ध्यान की गहराई, मानसिक शांति'
  },
  {
    id: 'mangal-divo',
    icon: <Flame className="w-8 h-8 text-yellow-400" />,
    emoji: '🪔',
    title: 'मंगल दीवो',
    titleEn: 'Mangal Divo',
    time: 'सायंकाल',
    duration: '10-15 मिनट',
    category: 'daily',
    steps: [
      'मंदिर या घर में दीपक जलाएं',
      'णमोकार मंत्र बोलें',
      'मंगल दीवो गीत गाएं',
      'आरती करें',
      'जय-जयकार करें'
    ],
    mantra: 'मंगलं भगवान वीरो, मंगलं गौतमो गणी...',
    benefits: 'घर में शांति, मंगलकामना, सकारात्मक ऊर्जा'
  }
];

export interface PujaPageProps {
  onBack: () => void;
}
export type RitualsPageProps = PujaPageProps;

export const PujaPage = ({ onBack }: PujaPageProps) => {
  const [selectedRitual, setSelectedRitual] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  // Close ritual detail modal on mobile back navigation
  useModalBackHandler(!!selectedRitual, () => setSelectedRitual(null), 'ritual-detail');


  const filteredRituals = filter === 'all'
    ? ritualsData
    : ritualsData.filter(r => r.category === filter);

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 page-bottom-clearance px-6">
      {/* Header */}
      <div className="mb-8">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-colors flex items-center justify-center group mb-6 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs mb-3">
            <Flame className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Rituals</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            धार्मिक अनुष्ठान
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            दैनिक पूजा विधि और संस्कार
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-3 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-colors cursor-pointer ${filter === 'all'
                ? 'bg-amber-500 text-black font-bold shadow-[0_2px_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-blue-100 hover:bg-white/10 border border-white/10'
              }`}
          >
            सभी
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter('daily')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-colors cursor-pointer ${filter === 'daily'
                ? 'bg-amber-500 text-black font-bold shadow-[0_2px_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-blue-100 hover:bg-white/10 border border-white/10'
              }`}
          >
            दैनिक
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilter('special')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-colors cursor-pointer ${filter === 'special'
                ? 'bg-amber-500 text-black font-bold shadow-[0_2px_10px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 text-blue-100 hover:bg-white/10 border border-white/10'
              }`}
          >
            विशेष
          </motion.button>
        </div>
      </div>

      {/* Rituals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRituals.map((ritual, idx) => (
          <motion.div
            key={ritual.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              tilt={{ maxTilt: 9, glareMaxOpacity: 0.15, glareColor: 'amber' }}
              className="p-6 hover:bg-white/10 cursor-pointer transition-all group h-full"
              onClick={() => setSelectedRitual(ritual)}
            >
              <div className="flex items-center gap-3 mb-4">
                {ritual.icon}
                <div className="text-3xl">{ritual.emoji}</div>
              </div>

              <h3 className="text-xl font-rozha text-white mb-1 group-hover:text-amber-300 transition-colors">
                {ritual.title}
              </h3>
              <p className="text-sm text-blue-100/60 font-gotu mb-3">{ritual.titleEn}</p>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-amber-300">
                  <Clock className="w-4 h-4" />
                  <span className="font-gotu">{ritual.time}</span>
                </div>
                <div className="text-xs text-blue-100/50 font-gotu">
                  समय: {ritual.duration}
                </div>
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-blue-200 text-xs capitalize">
                {ritual.category === 'daily' ? 'दैनिक' : 'विशेष'}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRitual && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRitual(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl max-h-[min(90vh,700px)] flex flex-col z-10 bg-slate-900/95 border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Pinned Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 flex items-start justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-gotu border border-amber-400/30 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{selectedRitual.time}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-gotu border border-blue-400/30">
                      समय: {selectedRitual.duration}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-gotu border border-white/10">
                      {selectedRitual.category === 'daily' ? 'दैनिक चर्या' : 'विशेष पर्व'}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-notoserif font-bold text-white leading-snug break-words">
                    {selectedRitual.title}
                  </h2>
                  <p className="text-xs text-blue-100/60 font-gotu mt-0.5">{selectedRitual.titleEn}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedRitual(null)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="बंद करें"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4 min-h-0">
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 font-gotu">
                    विधि एवं क्रिया क्रम
                  </div>
                  <ol className="space-y-2">
                    {selectedRitual.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-blue-100/90 font-gotu bg-white/5 p-2.5 sm:p-3 rounded-xl border border-white/5">
                        <span className="text-amber-400 font-bold mt-0.5 shrink-0">{idx + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <TiltCard
                  maxTilt={5}
                  glareMaxOpacity={0.12}
                  glareColor="amber"
                  className="rounded-xl"
                >
                  <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/25 h-full">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 font-gotu flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>पावन मंत्र / सूत्र</span>
                    </div>
                    <p className="text-white font-tiro text-base sm:text-lg leading-relaxed">
                      {selectedRitual.mantra}
                    </p>
                  </div>
                </TiltCard>

                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 font-gotu">
                    साधना फल एवं लाभ
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/80 font-gotu leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                    {selectedRitual.benefits}
                  </p>
                </div>
              </div>

              {/* Pinned Action Footer */}
              <div className="p-3.5 sm:p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedRitual(null)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-gotu font-bold text-sm hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  साधना सम्पन्न करें
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const RitualsPage = PujaPage;
