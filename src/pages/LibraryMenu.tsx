import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/layout/GlassCard';
import { BookOpen, Globe, Hourglass, Landmark, Scroll, FileText, ChevronRight } from 'lucide-react';

interface LibraryMenuProps {
  onNavigate: (page: string, params?: any) => void;
}

const libraryItems = [
  {
    id: 'tattva',
    label: 'तत्त्व ज्ञान',
    sub: 'प्रयोजनभूत ७ तत्त्व',
    icon: BookOpen,
    desc: 'जीव, अजीव, आस्रव, बंध, संवर, निर्जरा एवं मोक्ष तत्त्व का आध्यात्मिक रहस्य।',
    color: 'from-amber-500/20 to-amber-800/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-300',
  },
  {
    id: 'bhugol',
    label: 'जैन भूगोल',
    sub: 'त्रिलोक रचना व मानचित्र',
    icon: Globe,
    desc: 'ऊर्ध्व, मध्य और अधो लोक, जम्बूद्वीप एवं सुमेरु पर्वत की अकृत्रिम संरचना।',
    color: 'from-blue-500/20 to-indigo-800/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-300',
  },
  {
    id: 'itihas',
    label: 'जैन इतिहास',
    sub: '६३ शलाका पुरुष चरित्र',
    icon: Hourglass,
    desc: '२४ तीर्थंकर, १२ चक्रवर्ती, ९ बलभद्र, ९ नारायण एवं ९ प्रतिनारायण का पावन इतिहास।',
    color: 'from-purple-500/20 to-indigo-800/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-300',
  },
  {
    id: 'parva',
    label: 'पर्व व उत्सव',
    sub: 'पवित्र आध्यात्मिक पर्व',
    icon: Landmark,
    desc: 'दशलक्षण महापर्व, अष्टान्हिका, महावीर जयंती, दीपावली एवं क्षमावाणी पर्व।',
    color: 'from-rose-500/20 to-pink-800/10',
    border: 'border-rose-500/30',
    accent: 'text-rose-300',
  },
  {
    id: 'granthas',
    label: 'प्रमुख शास्त्र',
    sub: 'आचार्य कुंदकुंद व उमास्वामी',
    icon: Scroll,
    desc: 'समयसार, प्रवचनसार, तत्त्वार्थ सूत्र, रत्नकरण्ड श्रावकाचार एवं द्रव्यसंग्रह।',
    color: 'from-emerald-500/20 to-teal-800/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-300',
  },
  {
    id: 'agamas',
    label: 'मूल आगम',
    sub: 'द्वादशांग जिनवाणी',
    icon: FileText,
    desc: 'भगवान महावीर की दिव्यध्वनि और गणधरों द्वारा गुंफित मूल आगम साहित्य।',
    color: 'from-teal-500/20 to-cyan-800/10',
    border: 'border-teal-500/30',
    accent: 'text-teal-300',
  },
];

export const LibraryMenu = ({ onNavigate }: LibraryMenuProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto pt-14 md:pt-16 pb-36 px-4 md:px-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 relative rounded-3xl overflow-hidden min-h-[220px] md:h-72 flex items-end p-6 md:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.7)] border border-emerald-500/25 group"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1745895255289-0410ef510cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwaW5kaWFuJTIwbGlicrFyeSUyMHNjcmlwdHVyZXMlMjBib29rc3xlbnwxfHx8fDE3Njg5NjcwNDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
            alt="Library Header"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/70 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs mb-3 backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="uppercase tracking-[0.2em] font-cinzel font-bold">Scripture Library</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-notoserif font-bold text-white mb-2 leading-[1.35] pt-2 pb-1">
            शास्त्र ग्रंथालय
          </h1>
          <p className="text-slate-200/80 max-w-xl font-gotu text-sm md:text-base leading-relaxed">
            जैन दर्शन, इतिहास, करणानुयोग एवं तत्त्वज्ञान का अगाध एवं प्रमाणिक ज्ञानकोश।
          </p>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {libraryItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            onClick={() => onNavigate('category', { id: item.id, source: 'library' })}
            className="h-full"
          >
            <GlassCard
              variant="gilded"
              className="h-full p-4 sm:p-6 md:p-7 flex flex-col justify-between cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 rounded-2xl"
            >
              <div>
                <div className="flex items-start justify-between mb-3 sm:mb-5">
                  <div
                    className={`w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform shadow-inner shrink-0`}
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10 px-2.5 py-0.5 rounded-full font-cinzel whitespace-nowrap bg-white/5">
                    GRANTH • 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl md:text-2xl font-notoserif font-bold text-white group-hover:text-amber-200 transition-colors mb-1 break-words">
                  {item.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-400/90 uppercase tracking-wider font-bold mb-1.5 sm:mb-2.5 font-gotu break-words line-clamp-1">
                  {item.sub}
                </p>
                <p className="text-xs sm:text-sm text-slate-300/80 leading-relaxed font-gotu break-words line-clamp-2 sm:line-clamp-3">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-amber-300/80 font-gotu font-semibold">
                <span className="truncate">विषय सूची देखें</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Footer Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-14 text-center text-xs text-slate-400/90 font-gotu border-t border-white/5 pt-8"
      >
        <p>
          Built by{' '}
          <a
            href="https://thesoftwareco.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors font-medium"
          >
            The Software Co
          </a>{' '}
          and Satyam Jain
        </p>
      </motion.div>
    </div>
  );
};