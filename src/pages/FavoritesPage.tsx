import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Heart, Calendar, Sparkles, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { getFavorites, type Favorite } from '../lib';
import { getUpcomingFestivals } from '../data/festivals';
import { getDailyThought } from '../data/festivals';

interface FavoritesPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export const FavoritesPage = ({ onNavigate, onBack }: FavoritesPageProps) => {
  const favorites = getFavorites();
  const upcomingFestivals = getUpcomingFestivals(3);
  const dailyThought = getDailyThought();

  return (
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 pb-24 sm:pb-28 px-4 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 relative"
      >
        {onBack ? (
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-center group shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </button>
        ) : (
          <div className="w-12" />
        )}

        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-rozha text-white pt-1.5 pb-0.5 leading-[1.35]">मेरा संग्रह</h1>
          <p className="text-xs md:text-sm text-slate-400 font-gotu mt-0.5">
            पसंदीदा रचनाएँ एवं आध्यात्मिक डैशबोर्ड
          </p>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Daily Thought Highlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <GlassCard variant="sacred" className="p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs mb-3 font-gotu font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>आज का पावन विचार</span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-rozha text-white mb-2 leading-relaxed">
              {dailyThought.textHindi}
            </p>
            <p className="text-sm md:text-base text-slate-300 font-gotu italic mb-2">
              "{dailyThought.text}"
            </p>
            <p className="text-xs font-gotu text-amber-300/80 tracking-wide">
              — {dailyThought.author}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-rozha text-white">सहेजी गई रचनाएँ</h2>
          </div>

          <div className="space-y-3">
            {favorites.length === 0 ? (
              <GlassCard variant="gilded" className="p-8 text-center">
                <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-300 font-gotu text-sm">अभी कोई रचना सहेजी नहीं गई है</p>
                <p className="text-xs text-slate-500 font-gotu mt-1">
                  स्वाध्याय करते समय बुकमार्क बटन दबाकर संग्रह में जोड़ें।
                </p>
              </GlassCard>
            ) : (
              favorites.map((fav, idx) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.04 }}
                >
                  <GlassCard
                    variant="gilded"
                    className="p-4 hover:bg-white/10 cursor-pointer transition-all group flex items-center justify-between"
                    onClick={() =>
                      onNavigate('viewer', {
                        id: fav.id,
                        title: fav.title,
                        type: fav.type,
                        previousPage: 'favorites',
                      })
                    }
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <h3 className="text-white font-rozha text-base group-hover:text-amber-200 transition-colors truncate">
                        {fav.title}
                      </h3>
                      <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-cinzel font-bold">
                        {fav.type}
                      </span>
                    </div>
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Upcoming Festivals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-rozha text-white">आगामी पर्व व उत्सव</h2>
          </div>

          <div className="space-y-3">
            {upcomingFestivals.map((festival: any, idx) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.04 }}
              >
                <GlassCard variant="cosmic" className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-rozha text-base">{festival.nameHindi}</h3>
                    <p className="text-xs text-slate-400 font-gotu mt-0.5 line-clamp-1">
                      {festival.descriptionHindi}
                    </p>
                  </div>
                  <div className="text-right shrink-0 bg-amber-500/15 border border-amber-500/25 px-3 py-1.5 rounded-xl">
                    <div className="text-lg font-bold text-amber-300 font-mono leading-none">
                      {festival.daysUntil}
                    </div>
                    <div className="text-[9px] text-slate-400 uppercase font-gotu">दिन शेष</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            <button
              onClick={() => onNavigate('festivals')}
              className="w-full mt-3 py-3 rounded-2xl border border-amber-500/30 text-amber-200 hover:bg-amber-500/10 font-gotu text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>सभी पर्व एवं तिथियाँ देखें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
