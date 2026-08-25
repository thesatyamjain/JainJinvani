import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { Calendar, Sparkles, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { jainFestivals, type JainFestival } from '../data/festivals';
import { useModalBackHandler } from '../lib';

interface FestivalsPageProps {
  onBack: () => void;
}

export const FestivalsPage = ({ onBack }: FestivalsPageProps) => {
  const [selectedFestival, setSelectedFestival] = React.useState<JainFestival | null>(null);

  // Close festival details modal on mobile back navigation
  useModalBackHandler(!!selectedFestival, () => setSelectedFestival(null), 'festival-detail');


  const getFestivalIcon = (type: string) => {
    switch (type) {
      case 'jayanti': return '🙏';
      case 'parva': return '🕉️';
      case 'important': return '✨';
      default: return '🎊';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-20 pb-32 px-6">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs mb-3">
            <Calendar className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Festivals</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-rozha text-white mb-3">
            जैन पर्व
          </h1>
          <p className="text-blue-100/60 font-gotu text-lg">
            पवित्र तिथियां और उत्सव
          </p>
        </motion.div>
      </div>

      {/* Festivals Grid */}
      <div className="grid gap-4">
        {jainFestivals.map((festival, idx) => (
          <motion.div
            key={festival.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard
              className="p-6 hover:bg-white/10 cursor-pointer transition-all group"
              onClick={() => setSelectedFestival(festival)}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{getFestivalIcon(festival.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-rozha text-white break-words">
                      {festival.nameHindi}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-blue-200 capitalize shrink-0">
                      {festival.type}
                    </span>
                  </div>
                  <p className="text-sm text-blue-100/70 font-gotu break-words">
                    {festival.descriptionHindi}
                  </p>
                  <p className="text-xs text-amber-300/70 mt-2 font-gotu">
                    {festival.date}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-200/50 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFestival(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg z-10"
          >
            <GlassCard className="p-8 border-white/20 bg-[#0b162c] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{getFestivalIcon(selectedFestival.type)}</div>
                  <div>
                    <h2 className="text-2xl font-rozha text-white break-words">
                      {selectedFestival.nameHindi}
                    </h2>
                    <p className="text-blue-100/60 font-gotu text-sm">
                      {selectedFestival.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <div className="text-xs text-amber-300 uppercase tracking-wide mb-1 font-gotu">
                    तिथि (Date)
                  </div>
                  <div className="text-white font-gotu text-lg">
                    {selectedFestival.date}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-amber-300 uppercase tracking-wide mb-2 font-gotu">
                    विवरण (Description)
                  </div>
                  <p className="text-blue-100/80 font-gotu leading-relaxed break-words">
                    {selectedFestival.descriptionHindi}
                  </p>
                  <p className="text-blue-100/60 font-gotu text-sm mt-2 italic break-words">
                    {selectedFestival.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-blue-200 text-sm capitalize">
                    <Sparkles className="w-3 h-3" />
                    {selectedFestival.type}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </div>
  );
};
