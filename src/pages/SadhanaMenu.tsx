import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import {
  Flame,
  Music,
  Book,
  Calendar,
  Sparkles,
  Feather,
  Scroll,
  Flower2,
  BookOpen,
  Crown,
  Timer,
  Leaf,
  ChevronRight,
} from 'lucide-react';

interface SadhanaMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

const sadhanaItems = [
  {
    id: 'samayik',
    label: 'सामायिक',
    sub: 'समता साधना',
    icon: Timer,
    color: 'from-amber-500/20 to-amber-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
  },
  {
    id: 'stotra',
    label: 'स्तोत्र संग्रह',
    sub: 'भक्तामर व स्तुति पाठ',
    icon: Feather,
    color: 'from-rose-500/20 to-pink-700/10',
    border: 'border-rose-500/30',
    accent: 'text-rose-300',
  },
  {
    id: 'puja',
    label: 'नित्य पूजा',
    sub: 'अष्टद्रव्य पूजन विधि',
    icon: Flower2,
    color: 'from-emerald-500/20 to-teal-700/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300',
  },
  {
    id: 'aarti',
    label: 'आरती संग्रह',
    sub: 'पंच परमेष्ठी वंदना',
    icon: Flame,
    color: 'from-orange-500/20 to-amber-700/10',
    border: 'border-orange-500/30',
    accent: 'text-orange-300',
  },
  {
    id: 'chalisa',
    label: 'चालीसा',
    sub: '४० पद्य भक्ति',
    icon: Book,
    color: 'from-blue-500/20 to-indigo-700/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-300',
  },
  {
    id: 'bhajan',
    label: 'भक्ति भजन',
    sub: 'आध्यात्मिक रस धारा',
    icon: Music,
    color: 'from-purple-500/20 to-indigo-700/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-300',
  },
  {
    id: 'path',
    label: 'पाठ व स्तुति',
    sub: 'स्वाध्याय एवं नियम',
    icon: Scroll,
    color: 'from-teal-500/20 to-emerald-700/10',
    border: 'border-teal-500/30',
    accent: 'text-teal-300',
  },
  {
    id: 'vidhan',
    label: 'विधान',
    sub: 'महामंडल विधान',
    icon: Sparkles,
    color: 'from-amber-500/20 to-yellow-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
  },
  {
    id: 'dietary',
    label: 'भक्ष्य-अभक्ष्य',
    sub: 'शुद्ध अहिंसक आहार',
    icon: Leaf,
    color: 'from-green-500/20 to-emerald-700/10',
    border: 'border-green-500/30',
    accent: 'text-green-300',
  },
  {
    id: 'tirthankar',
    label: '२४ तीर्थंकर',
    sub: 'जीवन चरित्र व कल्याणक',
    icon: Crown,
    color: 'from-amber-500/20 to-orange-700/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
  },
  {
    id: 'calendar',
    label: 'जैन पंचांग',
    sub: 'तिथि, पर्व व मुहूर्त',
    icon: Calendar,
    color: 'from-cyan-500/20 to-blue-700/10',
    border: 'border-cyan-500/30',
    accent: 'text-cyan-300',
  },
  {
    id: 'namokar',
    label: 'णमोकार महामंत्र',
    sub: 'अनादि मूल मंत्र',
    icon: Sparkles,
    color: 'from-amber-500/25 to-yellow-600/15',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
  },
];

export const SadhanaMenu = ({ onNavigate }: SadhanaMenuProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-14 md:pt-16 pb-36 px-4 md:px-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 relative rounded-3xl overflow-hidden min-h-[220px] md:h-72 flex items-end p-6 md:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] border border-amber-500/25 group"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1659263240327-20af29178b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWluJTIwcHVqYSUyMGFhcnRpJTIwZGl5YSUyMGxhbXB8ZW58MXx8fHwxNzY4OTY3MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
            alt="Sadhana Header"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs mb-3 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="uppercase tracking-[0.2em] font-cinzel font-bold">Daily Sadhana</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-notoserif font-bold text-white mb-2 leading-tight">
            साधना एवं नित्य नियम
          </h1>
          <p className="text-slate-200/80 max-w-xl font-gotu text-sm md:text-base leading-relaxed">
            दैनिक स्वाध्याय, सामायिक, अष्टद्रव्य पूजन, स्तोत्र पाठ एवं आत्म-शुद्धि का पावन संग्रह।
          </p>
        </div>
      </motion.div>

      {/* Grid of Sadhana Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-5">
        {sadhanaItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04, duration: 0.4 }}
            onClick={() => {
              if (item.id === 'calendar') {
                onNavigate('panchang');
              } else if (item.id === 'samayik') {
                onNavigate('samayik');
              } else if (item.id === 'dietary') {
                onNavigate('dietary');
              } else {
                onNavigate('category', { id: item.id, source: 'sadhana' });
              }
            }}
          >
            <GlassCard
              variant="gilded"
              className="p-5 md:p-6 h-full min-h-[170px] flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform shadow-inner shrink-0`}
                >
                  <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="mt-4">
                <h3 className="text-lg md:text-xl font-rozha text-white group-hover:text-amber-200 transition-colors mb-1 break-words">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-300/70 font-gotu break-words line-clamp-1">
                  {item.sub}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};