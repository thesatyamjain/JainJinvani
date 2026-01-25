import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'motion/react';
import { BookOpen, Search, Flame, Library, Menu, Home } from 'lucide-react';

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
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[calc(100vw-2rem)] md:max-w-none md:w-auto">
      <motion.div
        className="flex h-14 md:h-16 items-end gap-2 md:gap-4 rounded-2xl bg-white/10 px-2 md:px-4 pb-2 md:pb-3 backdrop-blur-md border border-white/20 shadow-2xl mx-auto w-fit max-w-full"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={() => mouseX.set(Infinity)}
      >
        <DockIcon
          mouseX={mouseX}
          icon={<Home className="w-5 h-5 md:w-6 md:h-6 text-white" />}
          label="मुख्य पृष्ठ" // Home
          isActive={activePage === 'landing'}
          onClick={() => onNavigate('landing')}
        />

        <div className="h-8 md:h-10 w-[1px] bg-white/10 self-center" />

        <DockIcon
          mouseX={mouseX}
          icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />}
          label="साधना" // Sadhana
          isActive={activePage === 'sadhana'}
          onClick={() => onNavigate('sadhana')}
        />
        <DockIcon
          mouseX={mouseX}
          icon={<Library className="w-5 h-5 md:w-6 md:h-6 text-white" />}
          label="ग्रंथालय" // Library
          isActive={activePage === 'library'}
          onClick={() => onNavigate('library')}
        />

        <DockIcon
          mouseX={mouseX}
          icon={<Menu className="w-5 h-5 md:w-6 md:h-6 text-white" />}
          label="अधिक" // More
          isActive={activePage === 'more'}
          onClick={() => onNavigate('more')}
        />

        {/* Decorative divider */}
        <div className="h-8 md:h-10 w-[1px] bg-white/20 self-center" />

        <DockIcon
          mouseX={mouseX}
          icon={<Search className="w-5 h-5 md:w-6 md:h-6 text-white" />}
          label="खोजें" // Search
          isActive={false}
          onClick={handleSearchClick}
        />
      </motion.div>
    </div>
  );
};

interface DockIconProps {
  mouseX: MotionValue;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function DockIcon({ mouseX, icon, label, isActive, onClick }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Mobile: smaller scaling (36-56px), Desktop: larger scaling (40-80px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const widthSync = useTransform(
    distance,
    [-150, 0, 150],
    isMobile ? [36, 56, 36] : [40, 80, 40]
  );
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative group">
      {/* Label tooltip - hidden on mobile */}
      <div className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10 shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform font-gotu">
        {label}
        {/* Little triangle arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
      </div>

      <motion.div
        ref={ref}
        style={{ width }}
        onClick={onClick}
        className={`aspect-square rounded-xl md:rounded-2xl flex items-center justify-center cursor-pointer transition-colors duration-200 overflow-hidden ${isActive ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20' : 'bg-white/5 hover:bg-white/10 border border-transparent'
          }`}
      >
        <motion.div className={`w-full h-full flex items-center justify-center ${isActive ? 'text-amber-200' : 'text-white/90'}`}>
          {icon}
        </motion.div>
      </motion.div>

      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
      )}
    </div>
  );
}