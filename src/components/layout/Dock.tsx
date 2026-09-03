import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Library, Menu, Home, ChevronLeft, Bookmark, Share2, Play, Pause } from 'lucide-react';

interface DockProps {
  activePage: string;
  onNavigate: (page: string, params?: any) => void;
  onSearchClick: () => void;
  onBack?: () => void;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const Dock = ({
  activePage,
  onNavigate,
  onSearchClick,
  onBack,
  scrollContainerRef,
}: DockProps) => {
  const mouseX = useMotionValue(Infinity);
  const [isDockHidden, setIsDockHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollY = useRef(0);

  // Dynamic reader state when viewing content
  const [readerState, setReaderState] = useState<{
    fontSize: number;
    isAutoScrolling: boolean;
    isFav: boolean;
    scrollSpeed: number;
    title: string;
  }>({
    fontSize: 18,
    isAutoScrolling: false,
    isFav: false,
    scrollSpeed: 1,
    title: '',
  });

  const isReaderMode = activePage === 'viewer' || activePage === 'content';

  // Reset magnification when page changes or search is clicked
  useEffect(() => {
    mouseX.set(Infinity);
  }, [activePage, mouseX]);

  // Listen for reader state updates from ContentViewer
  useEffect(() => {
    if (!isReaderMode) return;

    const handleReaderState = (e: any) => {
      if (e.detail) {
        setReaderState((prev) => ({
          ...prev,
          ...e.detail,
        }));
      }
    };

    window.addEventListener('jinvani:reader-state', handleReaderState);
    window.dispatchEvent(new CustomEvent('jinvani:request-reader-state'));

    return () => {
      window.removeEventListener('jinvani:reader-state', handleReaderState);
    };
  }, [isReaderMode]);

  // Smart Auto-Hide on Scroll Down, Reveal on Scroll Up
  useEffect(() => {
    const getContainer = (): HTMLElement | null => {
      if (scrollContainerRef && scrollContainerRef.current) {
        return scrollContainerRef.current;
      }
      return document.querySelector('main') || document.documentElement;
    };

    const container = getContainer();
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = container.scrollTop;
          const diff = currentY - lastScrollY.current;

          // Never auto-hide when auto-scroll is actively running so user can pause with 1 tap
          if (readerState.isAutoScrolling) {
            setIsDockHidden(false);
          } else if (diff > 20 && currentY > 120) {
            // Scrolling down past threshold -> hide dock
            setIsDockHidden(true);
          } else if (diff < -8 || currentY < 70) {
            // Scrolling up or at page top -> reveal dock
            setIsDockHidden(false);
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [scrollContainerRef, activePage, readerState.isAutoScrolling]);

  const handleSearchClick = () => {
    mouseX.set(Infinity);
    onSearchClick();
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('landing');
    }
  };

  const [isFontExpanded, setIsFontExpanded] = useState(false);
  const [readerDockPage, setReaderDockPage] = useState<'reader' | 'home'>('reader');
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const fontCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetFontCollapseTimer = useCallback(() => {
    if (fontCollapseTimerRef.current) clearTimeout(fontCollapseTimerRef.current);
    fontCollapseTimerRef.current = setTimeout(() => {
      setIsFontExpanded(false);
    }, 3500);
  }, []);

  // ALWAYS reset reader page to 'reader' and collapse font controls whenever activePage changes
  useEffect(() => {
    setIsFontExpanded(false);
    setReaderDockPage('reader');
  }, [activePage]);

  const handleDockTouchStart = (e: React.TouchEvent) => {
    mouseX.set(Infinity);
    if (!isReaderMode) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleDockTouchEnd = (e: React.TouchEvent) => {
    if (!isReaderMode || touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is intentional (> 35px) and greater than vertical drift
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        setReaderDockPage('home');
      } else {
        setReaderDockPage('reader');
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Click outside to collapse font controls
  useEffect(() => {
    if (!isFontExpanded) return;
    resetFontCollapseTimer();

    const handleClickOutside = (e: MouseEvent) => {
      const fontControlsEl = document.getElementById('dock-font-controls');
      if (fontControlsEl && !fontControlsEl.contains(e.target as Node)) {
        setIsFontExpanded(false);
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      if (fontCollapseTimerRef.current) clearTimeout(fontCollapseTimerRef.current);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isFontExpanded, resetFontCollapseTimer]);

  const handleAdjustFontSize = (delta: number) => {
    resetFontCollapseTimer();
    window.dispatchEvent(
      new CustomEvent('jinvani:reader-font-size', {
        detail: { delta },
      })
    );
  };

  const handleToggleAutoScroll = () => {
    window.dispatchEvent(new CustomEvent('jinvani:reader-toggle-autoscroll'));
  };

  const handleToggleFavorite = () => {
    window.dispatchEvent(new CustomEvent('jinvani:reader-toggle-favorite'));
  };

  const handleShareClick = () => {
    window.dispatchEvent(new CustomEvent('jinvani:reader-share'));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-[calc(100vw-1.5rem)] md:max-w-none md:w-auto touch-none select-none pointer-events-none"
    >
      <motion.div
        layout
        animate={{
          y: isDockHidden && !isHovered && !readerState.isAutoScrolling && !isFontExpanded ? 85 : 0,
          opacity: isDockHidden && !isHovered && !readerState.isAutoScrolling && !isFontExpanded ? 0 : 1,
          scale: isDockHidden && !isHovered && !readerState.isAutoScrolling && !isFontExpanded ? 0.94 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 28,
        }}
        className={`flex items-center gap-1.5 md:gap-3 rounded-2xl md:rounded-3xl bg-[#071124]/85 px-3 md:px-5 backdrop-blur-2xl backdrop-saturate-[190%] border border-amber-500/25 shadow-[0_16px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(245,158,11,0.15),inset_0_1px_1px_rgba(255,255,255,0.2)] mx-auto w-fit max-w-full relative touch-none overscroll-contain select-none pointer-events-auto transition-all ${
          isReaderMode ? 'h-[62px] md:h-[68px] pt-1.5 pb-3.5' : 'h-15 md:h-16 py-2'
        }`}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={handleDockTouchStart}
        onTouchEnd={handleDockTouchEnd}
      >
        {/* Subtle Ambient Golden Rim Light */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        <AnimatePresence mode="wait">
          {isReaderMode ? (
            readerDockPage === 'reader' ? (
              /* ============================================================ */
              /* 📖 DYNAMIC READER MODE: Page 1 - Quick Reader Tools          */
              /* ============================================================ */
              <motion.div
                key="reader-dock-page-reader"
                layout
                initial={{ opacity: 0, x: -10, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-1.5 md:gap-2.5"
              >
                {/* 1. Back Button */}
                <DockIcon
                  mouseX={mouseX}
                  icon={
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-amber-200 transition-colors" />
                  }
                  label="वापस"
                  subLabel="Back"
                  isActive={false}
                  onClick={handleBackClick}
                />

                <div className="h-7 md:h-8 w-[1px] bg-white/10 self-center mx-0.5" />

                {/* 2. Expanding Font Sizing Control (Aa -> [A- 18 A+ ✓]) */}
                <div id="dock-font-controls" className="relative flex items-center">
                  <AnimatePresence mode="wait">
                    {isFontExpanded ? (
                      <motion.div
                        key="font-expanded-controls"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="flex items-center bg-slate-900/90 border border-amber-400/40 rounded-xl md:rounded-2xl p-0.5 sm:p-1 backdrop-blur-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustFontSize(-2);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl active:scale-95 transition-all"
                          title="अक्षर छोटा करें (A-)"
                        >
                          A-
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFontExpanded(false);
                          }}
                          className="px-1.5 py-0.5 rounded text-[11px] sm:text-xs text-amber-300 hover:bg-amber-400/20 font-mono font-semibold select-none cursor-pointer transition-colors"
                          title="क्लिक करके बंद करें (Aa)"
                        >
                          {readerState.fontSize}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustFontSize(2);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl active:scale-95 transition-all"
                          title="अक्षर बड़ा करें (A+)"
                        >
                          A+
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFontExpanded(false);
                          }}
                          className="w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center text-amber-400/80 hover:text-amber-200 hover:bg-amber-500/20 rounded-lg text-xs ml-0.5 border-l border-white/10 pl-1 transition-all"
                          title="संपन्न (Aa पर वापस लौटें)"
                        >
                          ✓
                        </button>
                      </motion.div>
                    ) : (
                      <DockIcon
                        key="font-collapsed-icon"
                        mouseX={mouseX}
                        icon={
                          <div className="flex flex-col items-center justify-center font-notoserif font-bold text-sm leading-none select-none">
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-amber-200 text-sm md:text-base">A</span>
                              <span className="text-amber-400 text-[10px] md:text-xs">a</span>
                            </div>
                            <span className="text-[8px] font-mono text-slate-400 font-normal mt-0.5">
                              {readerState.fontSize}px
                            </span>
                          </div>
                        }
                        label="अक्षर आकार"
                        subLabel={`Size ${readerState.fontSize}px`}
                        isActive={false}
                        onClick={() => setIsFontExpanded(true)}
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Auto-Scroll Hands-Free Toggle */}
                <DockIcon
                  mouseX={mouseX}
                  icon={
                    readerState.isAutoScrolling ? (
                      <div className="relative flex items-center justify-center">
                        <span className="absolute -inset-1 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                        <Pause className="w-5 h-5 md:w-5.5 md:h-5.5 text-amber-300 fill-current" />
                      </div>
                    ) : (
                      <Play className="w-5 h-5 md:w-5.5 md:h-5.5 text-slate-300 fill-white/10 group-hover:text-amber-200 group-hover:fill-amber-400/20 transition-colors ml-0.5" />
                    )
                  }
                  label={readerState.isAutoScrolling ? "स्क्रॉल रोकें" : "स्वतः स्क्रॉल"}
                  subLabel={readerState.isAutoScrolling ? "Pause Scroll" : "Auto Scroll"}
                  isActive={readerState.isAutoScrolling}
                  onClick={handleToggleAutoScroll}
                />

                {/* 4. Bookmark / Favorite */}
                <DockIcon
                  mouseX={mouseX}
                  icon={
                    <Bookmark
                      className={`w-4.5 h-4.5 md:w-5 md:h-5 transition-colors ${
                        readerState.isFav ? 'text-rose-400 fill-current' : 'text-slate-300 group-hover:text-amber-200'
                      }`}
                    />
                  }
                  label={readerState.isFav ? "संग्रहित" : "पसंदीदा"}
                  subLabel={readerState.isFav ? "Saved" : "Favorite"}
                  isActive={readerState.isFav}
                  onClick={handleToggleFavorite}
                />

                {/* 5. Share Button */}
                <DockIcon
                  mouseX={mouseX}
                  icon={
                    <Share2 className="w-4.5 h-4.5 md:w-5 md:h-5 text-slate-300 group-hover:text-amber-200 transition-colors" />
                  }
                  label="साझा करें"
                  subLabel="Share"
                  isActive={false}
                  onClick={handleShareClick}
                />
              </motion.div>
            ) : (
              /* ============================================================ */
              /* 🧭 READER MODE: Page 2 - Home Navigation Tabs                */
              /* ============================================================ */
              <motion.div
                key="reader-dock-page-home"
                layout
                initial={{ opacity: 0, x: 10, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="flex items-center gap-1.5 md:gap-2.5"
              >
                <DockIcon
                  mouseX={mouseX}
                  icon={<Home className="w-5 h-5 md:w-5.5 md:h-5.5" />}
                  label="मुख्य पृष्ठ"
                  subLabel="Home"
                  isActive={false}
                  onClick={() => onNavigate('landing')}
                />

                <DockIcon
                  mouseX={mouseX}
                  icon={<BookOpen className="w-5 h-5 md:w-5.5 md:h-5.5" />}
                  label="साधना"
                  subLabel="Sadhana"
                  isActive={false}
                  onClick={() => onNavigate('sadhana')}
                />

                <DockIcon
                  mouseX={mouseX}
                  icon={<Library className="w-5 h-5 md:w-5.5 md:h-5.5" />}
                  label="ग्रंथालय"
                  subLabel="Library"
                  isActive={false}
                  onClick={() => onNavigate('library')}
                />

                <DockIcon
                  mouseX={mouseX}
                  icon={<Menu className="w-5 h-5 md:w-5.5 md:h-5.5" />}
                  label="अधिक"
                  subLabel="More"
                  isActive={false}
                  onClick={() => onNavigate('more')}
                />

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
            )
          ) : (
            /* ============================================================ */
            /* 🧭 STANDARD GLOBAL NAVIGATION MODE                          */
            /* ============================================================ */
            <motion.div
              key="standard-dock-group"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 md:gap-3"
            >
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
          )}
        </AnimatePresence>

        {/* 2-Page Pagination Dots INSIDE Dock when in Reader Mode */}
        {isReaderMode && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto select-none py-0.5 px-3 cursor-pointer">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReaderDockPage('reader');
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                readerDockPage === 'reader'
                  ? 'bg-amber-400 w-5 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                  : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
              title="स्वाध्याय टूल्स (Reader)"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReaderDockPage('home');
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                readerDockPage === 'home'
                  ? 'bg-amber-400 w-5 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                  : 'bg-white/30 w-2 hover:bg-white/60'
              }`}
              title="होम नेविगेशन (Home)"
            />
          </div>
        )}
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