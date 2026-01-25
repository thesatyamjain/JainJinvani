import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Heart, Calendar, Sparkles, ArrowLeft } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-0 top-0 md:top-2 p-2 md:p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group z-10"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-blue-100 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}
        <h1 className="text-4xl md:text-6xl font-rozha text-white mb-3 pt-2 md:pt-0">
          मेरा संग्रह
        </h1>
        <p className="text-blue-100/60 font-gotu">
          Your Favorites & Spiritual Dashboard
        </p>
      </motion.div>

      {/* Daily Thought */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <GlassCard className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-gotu text-sm uppercase tracking-wide">आज का विचार</span>
            </div>
            <p className="text-2xl md:text-3xl font-rozha text-white mb-3 leading-relaxed">
              {dailyThought.textHindi}
            </p>
            <p className="text-lg text-blue-100/70 font-gotu italic mb-2">
              "{dailyThought.text}"
            </p>
            <p className="text-sm text-amber-300/80 font-gotu">
              — {dailyThought.author}
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Favorites Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-rose-400" />
            <h2 className="text-2xl font-rozha text-white">पसंदीदा</h2>
          </div>

          <div className="space-y-3">
            {favorites.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <Heart className="w-12 h-12 text-blue-200/30 mx-auto mb-3" />
                <p className="text-blue-100/50 font-gotu">
                  कोई पसंदीदा नहीं है
                </p>
                <p className="text-sm text-blue-100/30 font-gotu mt-1">
                  Content को पसंद करने के लिए ♥ दबाएं
                </p>
              </GlassCard>
            ) : (
              favorites.slice(0, 5).map((fav, idx) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <GlassCard
                    className="p-4 hover:bg-white/10 cursor-pointer transition-all group"
                    onClick={() => onNavigate('viewer', {
                      id: fav.id,
                      title: fav.title,
                      type: fav.type,
                      previousPage: 'favorites',
                      // We don't strictly need previousParams if returning to a static page like favorites
                    })}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-gotu font-medium group-hover:text-amber-300 transition-colors break-words">
                          {fav.title}
                        </h3>
                        <p className="text-xs text-blue-100/50 mt-1 capitalize">
                          {fav.type}
                        </p>
                      </div>
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}

            {favorites.length > 5 && (
              <button className="w-full text-center text-sm text-amber-300 hover:text-amber-200 font-gotu py-2">
                और देखें ({favorites.length - 5}+)
              </button>
            )}
          </div>
        </motion.div>

        {/* Upcoming Festivals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-rozha text-white">आगामी पर्व</h2>
          </div>

          <div className="space-y-3">
            {upcomingFestivals.map((festival: any, idx) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <GlassCard className="p-4 border-blue-400/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-gotu font-medium break-words">
                        {festival.nameHindi}
                      </h3>
                      <p className="text-sm text-blue-100/70 mt-1 break-words">
                        {festival.descriptionHindi}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-amber-400">
                        {festival.daysUntil}
                      </div>
                      <div className="text-xs text-blue-100/50">दिन</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('festivals')}
            className="w-full mt-4 text-center text-sm text-amber-300 hover:text-amber-200 font-gotu py-2 border border-amber-400/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            सभी पर्व देखें
          </button>
        </motion.div>
      </div>
    </div>
  );
};
