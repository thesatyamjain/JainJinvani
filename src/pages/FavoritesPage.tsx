import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Heart, Calendar, Sparkles, ChevronLeft, ChevronRight, Bookmark, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite, type Favorite, preloadContent } from '../lib';
import { getUpcomingFestivals } from '../data/festivals';
import { getDailyThought } from '../data/festivals';

interface FavoritesPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

export const FavoritesPage = ({ onNavigate, onBack }: FavoritesPageProps) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => getFavorites());
  const upcomingFestivals = getUpcomingFestivals(3);
  const dailyThought = getDailyThought();

  const handleRemoveFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFavorite(id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-14 md:pt-16 page-bottom-clearance px-4 md:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 relative"
      >
        {onBack ? (
          <motion.button
            whileTap={{ scale: 0.90 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 transition-colors flex items-center justify-center group shrink-0 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-amber-200" />
          </motion.button>
        ) : (
          <div className="w-12" />
        )}

        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-rozha text-white pt-1.5 pb-0.5 leading-[1.35] drop-shadow-sm">मेरा संग्रह</h1>
          <p className="text-xs md:text-sm text-slate-200 font-gotu font-medium mt-0.5">
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
        <GlassCard variant="sacred" tilt={{ maxTilt: 6, scale: 1.01, glareColor: 'gold' }} className="p-6 md:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs mb-3 font-gotu font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>आज का पावन विचार</span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-rozha text-amber-100 mb-2 leading-relaxed">
              {dailyThought.textHindi}
            </p>
            <p className="text-sm md:text-base text-slate-200 font-gotu italic mb-2">
              "{dailyThought.text}"
            </p>
            <p className="text-xs font-gotu font-semibold text-amber-300 tracking-wide">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-rozha text-white">सहेजी गई रचनाएँ</h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              {favorites.length}
            </span>
          </div>

          <div className="space-y-3">
            {favorites.length === 0 ? (
              <GlassCard variant="gilded" className="p-8 text-center">
                <Heart className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-200 font-gotu text-sm font-semibold">अभी कोई रचना सहेजी नहीं गई है</p>
                <p className="text-xs text-slate-300 font-gotu mt-1.5">
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
                    tilt
                    className="p-4 hover:bg-white/10 cursor-pointer transition-all group flex items-center justify-between gap-3"
                    onMouseEnter={() => preloadContent(fav.id)}
                    onTouchStart={() => preloadContent(fav.id)}
                    onClick={() =>
                      onNavigate('viewer', {
                        id: fav.id,
                        title: fav.title,
                        type: fav.type,
                        previousPage: 'favorites',
                      })
                    }
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <h3 className="text-white font-rozha text-base group-hover:text-amber-200 transition-colors truncate">
                        {fav.title}
                      </h3>
                      <span className="inline-block mt-1 text-[11px] text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-cinzel font-bold">
                        {fav.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.88 }}
                        onClick={(e) => handleRemoveFavorite(e, fav.id)}
                        className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-400/30 hover:border-rose-300 text-rose-300 transition-colors cursor-pointer group/btn"
                        title="संग्रह से हटाएं"
                        aria-label="संग्रह से हटाएं"
                      >
                        <Trash2 className="w-4 h-4 text-rose-300 group-hover/btn:text-rose-200" />
                      </motion.button>
                    </div>
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
                <GlassCard variant="cosmic" tilt className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-rozha text-base">{festival.nameHindi}</h3>
                    <p className="text-xs text-slate-200 font-gotu mt-1 line-clamp-1">
                      {festival.descriptionHindi}
                    </p>
                  </div>
                  <div className="text-right shrink-0 bg-amber-500/20 border border-amber-400/35 px-3 py-1.5 rounded-xl">
                    <div className="text-lg font-bold text-amber-300 font-mono leading-none">
                      {festival.daysUntil}
                    </div>
                    <div className="text-[10px] text-slate-200 uppercase font-gotu font-medium mt-0.5">दिन शेष</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={() => onNavigate('festivals')}
              className="w-full mt-3 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 hover:text-white font-gotu text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>सभी पर्व एवं तिथियाँ देखें</span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
