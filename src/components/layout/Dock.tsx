import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import { BookOpen, Search, Library, Menu, Home } from 'lucide-react';

interface DockProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onSearchClick: () => void;
}

export const Dock = ({ activePage, onNavigate, onSearchClick }: DockProps) => {
  const mouseX = useMotionValue(Infinity);

  // Reset magnification when page changes or search is clicked
  React.useEffect(() => {
    mouseX.set(Infinity);
  }, [activePage, mouseX]);

  const handleSearchClick = () => {
    mouseX.set(Infinity);
    onSearchClick();
  };

  return (
    <div className="fixed bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[calc(100vw-1.5rem)] md:max-w-none md:w-auto">
      <motion.div
        className="flex h-15 md:h-16 items-center gap-1.5 md:gap-3 rounded-2xl md:rounded-3xl bg-[#071124]/75 px-3 md:px-5 py-2 backdrop-blur-2xl backdrop-saturate-[190%] border border-amber-500/25 shadow-[0_16px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(245,158,11,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)] mx-auto w-fit max-w-full relative"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={() => mouseX.set(Infinity)}
      >
        {/* Subtle Ambient Rim Light */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        <DockIcon
          mouseX={mouseX}
          icon={<Home className="w-5 h-5 md:w-5.5 md:h-5.5" />}
          label="मुख्य पृष्ठ"
          subLabel="Home"
          isActive={activePage === 'landing'}
          onClick={() => onNavigate('landing')}
        />

        <div className="h-7 md:h-8 w-[1px] bg-white/10 self-center mx-0.5" />

        <DockIcon
          mouseX={mouseX}
          icon={<BookOpen className="w-5 h-5 md:w-5.5 md:h-5.5" />}
          label="साधना"
          subLabel="Sadhana"
          isActive={activePage === 'sadhana'}
          onClick={() => onNavigate('sadhana')}
        />

        <DockIcon
          mouseX={mouseX}
          icon={<Library className="w-5 h-5 md:w-5.5 md:h-5.5" />}
          label="ग्रंथालय"
          subLabel="Library"
          isActive={activePage === 'library'}
          onClick={() => onNavigate('library')}
        />

        <DockIcon
          mouseX={mouseX}
          icon={<Menu className="w-5 h-5 md:w-5.5 md:h-5.5" />}
          label="अधिक"
          subLabel="More"
          isActive={activePage === 'more' || activePage === 'explore' || activePage === 'favorites'}
          onClick={() => onNavigate('more')}
        />

        <div className="h-7 md:h-8 w-[1px] bg-amber-500/20 self-center mx-0.5" />

        <DockIcon
          mouseX={mouseX}
          icon={<Search className="w-5 h-5 md:w-5.5 md:h-5.5" />}
          label="खोजें"
          subLabel="Search"
          isActive={false}
          onClick={handleSearchClick}
          isSearch
        />
      </motion.div>
    </div>
  );
};

interface DockIconProps {
  mouseX: MotionValue;
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  isActive: boolean;
  onClick: () => void;
  isSearch?: boolean;
}

function DockIcon({ mouseX, icon, label, subLabel, isActive, onClick, isSearch }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const widthSync = useTransform(
    distance,
    [-140, 0, 140],
    isMobile ? [40, 48, 40] : [44, 58, 44]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 180, damping: 14 });

  return (
    <div className="relative group flex flex-col items-center">
      {/* Label Tooltip with Sacred Styling */}
      <div className="hidden md:flex flex-col items-center absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#091428]/95 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)] translate-y-2 group-hover:translate-y-0">
        <span className="font-gotu text-xs font-semibold text-amber-200 pt-0.5 pb-0.5">{label}</span>
        {subLabel && (
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-slate-400">
            {subLabel}
          </span>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#091428]/95" />
      </div>

      <motion.div
        ref={ref}
        style={{ width }}
        onClick={onClick}
        className={`aspect-square rounded-xl md:rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
          isActive
            ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/15 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]'
            : isSearch
            ? 'bg-white/5 hover:bg-amber-500/15 border border-white/5 hover:border-amber-500/30'
            : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15'
        }`}
      >
        <div
          className={`flex items-center justify-center transition-colors duration-200 ${
            isActive ? 'text-amber-200' : 'text-slate-300 group-hover:text-white'
          }`}
        >
          {icon}
        </div>
      </motion.div>
    </div>
  );
}