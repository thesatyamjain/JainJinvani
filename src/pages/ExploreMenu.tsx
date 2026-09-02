import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ArrowLeft, MapPin, Lightbulb, Flame, BookOpen, Image, Users, Compass, ChevronRight } from 'lucide-react';

interface ExploreMenuProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

const exploreCategories = [
  {
    id: 'pilgrimage',
    icon: MapPin,
    title: 'तीर्थ यात्रा',
    sub: 'प्राचीन एवं सिद्ध तीर्थ क्षेत्र',
    description: 'पवित्र जैन तीर्थ, पर्वत व कल्याणक भूमियों की विस्तृत जानकारी व दर्शन।',
    color: 'from-cyan-500/20 to-blue-700/10',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-300',
    page: 'pilgrimage'
  },
  {
    id: 'philosophy',
    icon: Lightbulb,
    title: 'जैन दर्शन',
    sub: 'तत्त्वज्ञान एवं कर्म सिद्धांत',
    description: 'स्याद्वाद, अनेकांत, नवतत्त्व व जीवन को सही दिशा देने वाले आध्यात्मिक सिद्धांत।',
    color: 'from-purple-500/20 to-indigo-700/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-300',
    page: 'philosophy'
  },
  {
    id: 'rituals',
    icon: Flame,
    title: 'धार्मिक अनुष्ठान',
    sub: 'दैनिक पूजा विधि व संस्कार',
    description: 'अष्टद्रव्य पूजन विधान, संस्कार, प्रतिष्ठा व दैनिक मांगलिक क्रियाएं।',
    color: 'from-amber-500/20 to-orange-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
    page: 'rituals'
  },
  {
    id: 'pathshala',
    icon: BookOpen,
    title: 'बाल पाठशाला',
    sub: 'बाल संस्कार एवं जैन शिक्षा',
    description: 'बच्चों व नए स्वाध्यायियों के लिए सरल कहानियों व प्रश्नों द्वारा धर्म शिक्षा।',
    color: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300',
    page: 'pathshala'
  },
  {
    id: 'gallery',
    icon: Image,
    title: 'चित्र दीर्घा',
    sub: 'पवित्र दृश्य व मंदिर धरोहर',
    description: 'जैन तीर्थंकर प्रतिमाओं, प्राचीन मंदिरों व कलाकृतियों का नयनाभिराम संग्रह।',
    color: 'from-rose-500/20 to-pink-700/10',
    border: 'border-rose-500/30',
    accent: 'text-rose-300',
    page: 'gallery'
  },
  {
    id: 'ascetics',
    icon: Users,
    title: 'गुरु परंपरा',
    sub: 'दिगंबर मुनि व आचार्य संघ',
    description: 'पूज्य आचार्य, मुनिराज, आर्यिका माताजी एवं त्यागी वृंद का जीवन व चर्या।',
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
    page: 'ascetics'
  }
];

export const ExploreMenu = ({ onBack, onNavigate }: ExploreMenuProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-14 md:pt-16 pb-36 px-4 md:px-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-amber-300/80 hover:text-amber-200 transition-colors mb-5 group font-gotu text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>मुख्य मेनू पर वापस जाएं</span>
      </motion.button>

      {/* Header Banner - Frosted Glass */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-10 relative rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[210px] md:h-64 flex items-end p-6 md:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-[#071124]/80 backdrop-blur-3xl backdrop-saturate-[190%] group"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/15 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs mb-3 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-indigo-300" />
            <span className="font-gotu font-medium">जैन संस्कृति एवं ज्ञानकोश</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-notoserif font-bold text-white mb-2 leading-[1.25] pt-1 pb-1">
            अन्वेषण
          </h1>
          <p className="text-slate-200/85 max-w-xl font-gotu text-sm md:text-base leading-relaxed">
            तीर्थ यात्रा, जैन दर्शन, चित्र दीर्घा, बाल संस्कार एवं गुरु परंपरा का पावन ज्ञानकोश।
          </p>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6">
        {exploreCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            onClick={() => {
              if (category.page) {
                onNavigate(category.page);
              }
            }}
            className="h-full"
          >
            <GlassCard
              variant="gilded"
              className="h-full p-4 sm:p-6 md:p-7 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 rounded-2xl"
            >
              <div>
                <div className="flex items-start justify-between mb-3 sm:mb-5">
                  <div
                    className={`w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.color} border ${category.border} flex items-center justify-center ${category.accent} group-hover:scale-110 transition-transform shadow-inner shrink-0`}
                  >
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-gotu px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 group-hover:border-amber-400/40 group-hover:text-amber-200 transition-colors">
                    अन्वेषण
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors mb-1">
                  {category.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-200/80 font-gotu mb-2">
                  {category.sub}
                </p>
                <p className="text-xs text-slate-300/70 font-gotu leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-gotu text-amber-300/80 group-hover:text-amber-200 transition-colors">
                <span className="truncate">विवरण देखें</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-8 md:mt-10"
      >
        <GlassCard variant="sacred" className="p-5 sm:p-7 rounded-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-bold font-notoserif text-amber-300 mb-0.5">२४</div>
              <div className="text-xs text-slate-300 font-gotu">तीर्थंकर भगवान</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-bold font-notoserif text-cyan-300 mb-0.5">५०+</div>
              <div className="text-xs text-slate-300 font-gotu">पवित्र तीर्थ स्थल</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-bold font-notoserif text-emerald-300 mb-0.5">८</div>
              <div className="text-xs text-slate-300 font-gotu">दार्शनिक सिद्धांत</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl font-bold font-notoserif text-purple-300 mb-0.5">१२+</div>
              <div className="text-xs text-slate-300 font-gotu">धार्मिक अनुष्ठान</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Footer Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-14 text-center text-xs text-slate-400/90 font-gotu border-t border-white/5 pt-8"
      >
        <p>
          निर्माता:{' '}
          <a
            href="https://thesoftwareco.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            The Software Co
          </a>{' '}
          एवं <span className="text-amber-400 font-medium">सत्यम जैन</span>
        </p>
      </motion.div>
    </div>
  );
};
