import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { Flame, Music, Book, Calendar, Sparkles, Feather, Scroll, Flower2, BookOpen, Crown, Timer, Leaf } from 'lucide-react';

interface SadhanaMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

const sadhanaItems = [
  { id: 'samayik', label: 'सामायिक', sub: 'समता साधना', icon: Timer },
  { id: 'dietary', label: 'भक्ष्य-अभक्ष्य', sub: 'शुद्ध आहार', icon: Leaf },
  { id: 'stotra', label: 'स्तोत्र', sub: 'भक्ति पाठ', icon: Feather },
  { id: 'puja', label: 'पूजा', sub: 'अष्टद्रव्य पूजन', icon: Flower2 },
  { id: 'chalisa', label: 'चालीसा', sub: '४० पद्य', icon: Book },
  { id: 'aarti', label: 'आरती', sub: 'दीपक वंदना', icon: Flame },
  { id: 'bhajan', label: 'भजन', sub: 'भक्ति संगीत', icon: Music },
  { id: 'path', label: 'पाठ', sub: 'स्वाध्याय पाठ', icon: Scroll },
  { id: 'vidhan', label: 'विधान', sub: 'महामंडल विधान', icon: Sparkles },
  { id: 'tirthankar', label: 'तीर्थंकर', sub: '२४ तीर्थंकर', icon: Crown },
  { id: 'namokar', label: 'नमोकार', sub: 'महामंत्र', icon: Sparkles },
  { id: 'calendar', label: 'पंचांग', sub: 'जैन कैलेंडर', icon: Calendar },
];

export const SadhanaMenu = ({ onNavigate }: SadhanaMenuProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-16 pb-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative rounded-3xl overflow-hidden h-72 flex items-end p-10 shadow-2xl border border-white/10 group"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1659263240327-20af29178b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWluJTIwcHVqYSUyMGFhcnRpJTIwZGl5YSUyMGxhbXB8ZW58MXx8fHwxNzY4OTY3MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="Sadhana Header"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-amber-300 mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Sadhana</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-rozha text-white mb-2">साधना</h1>
          <p className="text-blue-100/80 mt-2 max-w-xl font-gotu text-lg">
            नित्य नियम, पूजा और भक्ति का संग्रह।
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sadhanaItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              if (item.id === 'calendar') {
                onNavigate('panchang');
              } else if (item.id === 'samayik') {
                onNavigate('samayik');
              } else if (item.id === 'dietary') {
                onNavigate('dietary');
              } else {
                // Navigate to the list view for this category
                onNavigate('category', { id: item.id, source: 'sadhana' });
              }
            }}
          >
            <GlassCard className="p-6 h-full min-h-[160px] flex flex-col items-center justify-center text-center gap-4 hover:bg-white/15 cursor-pointer group transition-all border-white/10 hover:border-amber-500/30 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center text-amber-200 group-hover:scale-110 transition-transform shadow-inner border border-amber-500/20 shrink-0">
                <item.icon className="w-7 h-7" />
              </div>
              <div className="w-full px-2">
                <h3 className="text-xl font-rozha text-white group-hover:text-amber-200 transition-colors mb-1 break-words">
                  {item.label}
                </h3>
                <p className="text-xs text-blue-100/50 uppercase tracking-widest font-gotu font-bold break-words">
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