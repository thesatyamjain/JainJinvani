import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ArrowLeft, MapPin, Lightbulb, Flame, BookOpen, Image, Users } from 'lucide-react';

interface ExploreMenuProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

const exploreCategories = [
  {
    id: 'pilgrimage',
    icon: <MapPin className="w-8 h-8" />,
    emoji: '🗺️',
    title: 'तीर्थ यात्रा',
    titleEn: 'Pilgrimage Sites',
    description: 'पवित्र जैन तीर्थ स्थलों की जानकारी',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-400/30',
    page: 'pilgrimage'
  },
  {
    id: 'philosophy',
    icon: <Lightbulb className="w-8 h-8" />,
    emoji: '💡',
    title: 'जैन दर्शन',
    titleEn: 'Jain Philosophy',
    description: 'आध्यात्मिक सिद्धांत और जीवन मूल्य',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-400/30',
    page: 'philosophy'
  },
  {
    id: 'rituals',
    icon: <Flame className="w-8 h-8" />,
    emoji: '🔥',
    title: 'धार्मिक अनुष्ठान',
    titleEn: 'Rituals & Practices',
    description: 'दैनिक पूजा विधि और संस्कार',
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-400/30',
    page: 'rituals'
  },
  {
    id: 'pathshala',
    icon: <BookOpen className="w-8 h-8" />,
    emoji: '📚',
    title: 'बाल पाठशाला',
    titleEn: 'Children Learning',
    description: 'बच्चों के लिए जैन शिक्षा',
    color: 'from-green-500/20 to-teal-500/20',
    borderColor: 'border-green-400/30',
    page: 'pathshala'
  },
  {
    id: 'gallery',
    icon: <Image className="w-8 h-8" />,
    emoji: '🖼️',
    title: 'चित्र दीर्घा',
    titleEn: 'Photo Gallery',
    description: 'जैन धर्म की दृश्य यात्रा',
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-400/30',
    page: 'gallery'
  },
  {
    id: 'ascetics',
    icon: <Users className="w-8 h-8" />,
    emoji: '🧘‍♂️',
    title: 'गुरु परंपरा',
    titleEn: 'Jain Ascetics',
    description: 'जैन साधु और मुनि चर्या',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-400/30',
    page: 'ascetics'
  }
];

export const ExploreMenu = ({ onBack, onNavigate }: ExploreMenuProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-gotu">वापस जाएं</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            अन्वेषण करें
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            Explore Jain Knowledge
          </p>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {exploreCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              className={`p-4 md:p-6 hover:bg-white/10 transition-all group h-full relative overflow-hidden ${category.comingSoon ? 'opacity-75' : 'cursor-pointer'
                }`}
              onClick={() => {
                if (category.page) {
                  onNavigate(category.page);
                }
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} blur-[60px] opacity-50 pointer-events-none`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <div className={`w-10 h-10 md:w-14 md:h-14 p-2 md:p-3 rounded-xl bg-gradient-to-br ${category.color} border ${category.borderColor} flex items-center justify-center`}>
                    {React.cloneElement(category.icon as React.ReactElement, { className: "w-5 h-5 md:w-8 md:h-8" })}
                  </div>
                  <div className="text-2xl md:text-4xl">{category.emoji}</div>
                </div>

                <h3 className="text-base md:text-xl font-rozha text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {category.title}
                </h3>
                <p className="text-xs md:text-sm text-blue-100/60 font-gotu mb-2 md:mb-3">{category.titleEn}</p>
                <p className="text-xs md:text-sm text-blue-100/70 font-gotu break-words line-clamp-2 md:line-clamp-none">
                  {category.description}
                </p>

                {category.comingSoon && (
                  <div className="mt-4">
                    <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] md:text-xs font-gotu">
                      जल्द आ रहा है
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12"
      >
        <GlassCard className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-400/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-1">24</div>
              <div className="text-xs text-blue-100/60 font-gotu">तीर्थंकर</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">6+</div>
              <div className="text-xs text-blue-100/60 font-gotu">तीर्थ स्थल</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-1">8</div>
              <div className="text-xs text-blue-100/60 font-gotu">दार्शनिक सिद्धांत</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">6+</div>
              <div className="text-xs text-blue-100/60 font-gotu">अनुष्ठान</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};