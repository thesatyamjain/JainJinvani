import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ChevronLeft, Clock, Flame, Droplet, Sparkles, Sun, Moon, Star } from 'lucide-react';
import { useModalBackHandler } from '../lib';


interface RitualsPageProps {
  onBack: () => void;
}

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

export const RitualsPage = ({ onBack }: RitualsPageProps) => {
  const [selectedRitual, setSelectedRitual] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  // Close ritual detail modal on mobile back navigation
  useModalBackHandler(!!selectedRitual, () => setSelectedRitual(null), 'ritual-detail');


  const filteredRituals = filter === 'all'
    ? ritualsData
    : ritualsData.filter(r => r.category === filter);

  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-24 sm:pb-28 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group mb-6 cursor-pointer shadow-md"
          title="वापस जाएं"
        >
          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
        </button>

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
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'all'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            सभी
          </button>
          <button
            onClick={() => setFilter('daily')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'daily'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            दैनिक
          </button>
          <button
            onClick={() => setFilter('special')}
            className={`px-4 py-2 rounded-lg font-gotu text-sm transition-all ${filter === 'special'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-blue-100 hover:bg-white/10'
              }`}
          >
            विशेष
          </button>
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
      {selectedRitual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedRitual(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl z-10 my-8"
          >
            <GlassCard className="p-8 border-white/20 bg-[#0b162c] shadow-2xl">
              <button
                onClick={() => setSelectedRitual(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{selectedRitual.emoji}</div>
                <div>
                  <h2 className="text-3xl font-notoserif font-bold text-white">
                    {selectedRitual.title}
                  </h2>
                  <p className="text-blue-100/60 font-gotu">{selectedRitual.titleEn}</p>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {selectedRitual.time}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                  {selectedRitual.duration}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-amber-300 uppercase mb-3 font-gotu">विधि</div>
                  <ol className="space-y-2">
                    {selectedRitual.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-blue-100/80 font-gotu">
                        <span className="text-amber-400 font-bold mt-0.5">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/20">
                  <div className="text-sm text-amber-300 uppercase mb-2 font-gotu flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    मंत्र
                  </div>
                  <p className="text-white font-tiro text-lg leading-relaxed">
                    {selectedRitual.mantra}
                  </p>
                </div>

                <div>
                  <div className="text-sm text-amber-300 uppercase mb-2 font-gotu">लाभ</div>
                  <p className="text-blue-100/80 font-gotu">
                    {selectedRitual.benefits}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};
