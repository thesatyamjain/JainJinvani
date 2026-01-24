import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, Globe, Hourglass, Landmark, Scroll, FileText } from 'lucide-react';

interface LibraryMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

const libraryItems = [
  { id: 'tattva', label: 'तत्त्व', sub: 'प्रयोजनभूत तत्त्व', icon: BookOpen, desc: 'जीव, अजीव और सात तत्त्वों का वर्णन' },
  { id: 'bhugol', label: 'भूगोल', sub: 'तीन लोक रचना', icon: Globe, desc: 'ऊर्ध्व, मध्य और अधो लोक का मानचित्र' },
  { id: 'itihas', label: 'इतिहास', sub: 'महापुरुष चरित्र', icon: Hourglass, desc: '२४ तीर्थंकर और शलाका पुरुषों का जीवन' },
  { id: 'parva', label: 'पर्व', sub: 'जैन त्यौहार', icon: Landmark, desc: 'दशलक्षण, अष्टान्हिका और अन्य पर्व' },
  { id: 'granthas', label: 'ग्रंथ', sub: 'प्रमुख शास्त्र', icon: Scroll, desc: 'समयसार, रत्नकरण्ड श्रावकाचार आदि' },
  { id: 'agamas', label: 'आगम', sub: 'द्वादशांग वाणी', icon: FileText, desc: 'मूल आगम ग्रंथों का परिचय' },
];

export const LibraryMenu = ({ onNavigate }: LibraryMenuProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-16 pb-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 relative rounded-3xl overflow-hidden h-72 flex items-end p-10 shadow-2xl border border-white/10 group"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1745895255289-0410ef510cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaW5kaWFuJTIwbGlicrFyeSUyMHNjcmlwdHVyZXMlMjBib29rc3xlbnwxfHx8fDE3Njg5NjcwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Library Header"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/60 to-transparent" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs mb-3">
            <BookOpen className="w-3 h-3" />
            <span className="uppercase tracking-widest text-sm font-bold font-cinzel">Library</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-rozha text-white mb-2">ग्रंथालय</h1>
          <p className="text-blue-100/80 mt-2 max-w-xl font-gotu text-lg">
            जैन दर्शन, इतिहास और करणानुयोग का विशाल सागर।
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onNavigate('category', { id: item.id, source: 'library' })}
          >
            <GlassCard className="h-full p-6 hover:bg-white/15 cursor-pointer group transition-all border-white/10 hover:border-emerald-500/30 flex flex-col hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform shadow-inner shrink-0">
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 border border-white/10 px-3 py-1.5 rounded-full font-cinzel whitespace-nowrap">
                  LIB • {idx + 1}
                </span>
              </div>
              
              <h3 className="text-2xl font-rozha text-white mb-2 group-hover:text-emerald-200 transition-colors break-words">
                {item.label}
              </h3>
              <p className="text-xs text-emerald-400/80 uppercase tracking-wider font-bold mb-4 font-gotu break-words">
                {item.sub}
              </p>
              <p className="text-base text-blue-100/60 leading-relaxed mt-auto font-gotu break-words">
                {item.desc}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};