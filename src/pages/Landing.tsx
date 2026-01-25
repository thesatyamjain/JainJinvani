import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { ArrowRight, Star, Moon, Sun, BookOpen, Compass } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Landing = ({ onNavigate }: LandingProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-20 pb-32 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 text-sm font-medium mb-6 backdrop-blur-sm">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-gotu tracking-wide">जिनेन्द्र भगवान की शाश्वत वाणी</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-rozha text-transparent bg-clip-text bg-gradient-to-b from-amber-50 via-white to-white/60 leading-normal pb-4 mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          जैन जिनवाणी
        </h1>

        <p className="text-xl md:text-2xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed font-tiro">
          जैन दर्शन, ब्रह्मांड विज्ञान और कालातीत उपदेशों का एक व्यापक डिजिटल विश्वकोश।
          <br />
          <span className="text-sm opacity-60 font-cinzel mt-4 block tracking-widest uppercase">
            An immersive encyclopedia of Jain philosophy
          </span>
        </p>

        <div className="mt-12 flex gap-4 justify-center">
          <button
            onClick={() => onNavigate('sadhana')}
            className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-2 font-gotu">
              साधना <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => onNavigate('library')}
            className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 transition-colors font-gotu tracking-wide"
          >
            ग्रंथालय
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <GlassCard
          className="p-8 group hover:bg-white/15 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] duration-300"
          onClick={() => onNavigate('category', { id: 'tirthankar', source: 'landing' })}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0">
            <Sun className="w-7 h-7" />
          </div>
          <h3 className="text-3xl font-rozha text-white mb-3 break-words">२४ तीर्थंकर</h3>
          <p className="text-blue-100/70 leading-relaxed font-gotu text-lg break-words">
            इस अवसर्पिणी काल के २४ तीर्थंकरों का जीवन चरित्र और उनके कल्याणक।
          </p>
        </GlassCard>

        <GlassCard
          className="p-8 group hover:bg-white/15 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] duration-300"
          onClick={() => onNavigate('category', { id: 'bhugol', source: 'landing' })}
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
            <Moon className="w-7 h-7" />
          </div>
          <h3 className="text-3xl font-rozha text-white mb-3 break-words">जैन भूगोल</h3>
          <p className="text-blue-100/70 leading-relaxed font-gotu text-lg break-words">
            तीन लोक (ऊर्ध्व, मध्य, अधो) की अकृत्रिम रचना और भूगोल को जानें।
          </p>
        </GlassCard>

        <GlassCard
          className="p-8 group hover:bg-white/15 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)] duration-300"
          onClick={() => onNavigate('category', { id: 'granthas', source: 'landing' })}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-3xl font-rozha text-white mb-3 break-words">जिनवाणी शास्त्र</h3>
          <p className="text-blue-100/70 leading-relaxed font-gotu text-lg break-words">
            षट्खंडागम, समयसार, तत्त्वार्थ सूत्र और अन्य प्राचीन ग्रंथों का स्वाध्याय।
          </p>
        </GlassCard>
      </div>
    </div>
  );
};