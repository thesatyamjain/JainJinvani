import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Library, Menu, Home, ChevronLeft, Bookmark, Share2, Volume2 } from 'lucide-react';
import { useIsModalOpen, getSettings, type UserSettings } from '../../lib';
import { triggerHaptic } from '../../utils/pwaManager';

// Custom Auto-Scroll Scripture Flow Duotone Icon (Idle: text guide lines + downward flow stream; Active: serene ambient breathing aura + pause bars + flow chevrons)
export const AutoScrollIcon: React.FC<{
  isScrolling?: boolean;
  className?: string;
}> = ({ isScrolling = false, className = 'w-5 h-5' }) => {
  if (isScrolling) {
    return (
      <div className="relative flex items-center justify-center">
        {/* Soft serene ambient amber aura breathing calmly (no jarring ping) */}
        <span className="absolute -inset-1 rounded-full bg-amber-400/25 animate-pulse pointer-events-none" />
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          aria-hidden="true"
        >
          {/* Bold, prominent, high-contrast pause bars with 5px clean negative space */}
          <rect x="5.5" y="4" width="4" height="16" rx="1.5" />
          <rect x="14.5" y="4" width="4" height="16" rx="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Flanking Shloka/Scripture Guide Lines (Duotone secondary layer) */}
      <g opacity="0.45" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <line x1="3" y1="6" x2="8" y2="6" />
        <line x1="16" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="7" y2="12" />
        <line x1="17" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="8" y2="18" />
        <line x1="16" y1="18" x2="21" y2="18" />
      </g>

      {/* Downward Auto-Scroll Flow Arrow & Trailing Momentum Chevron */}
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M12 3.5V16M8.5 12.5L12 16.5L15.5 12.5"
          strokeWidth="2.2"
          className="transition-transform duration-200 group-hover:translate-y-0.5"
        />
        <path
          d="M9 19.5L12 21.5L15 19.5"
          strokeWidth="1.8"
          opacity="0.65"
          className="transition-transform duration-200 group-hover:translate-y-0.5"
        />
      </g>
    </svg>
  );
};

// FontAwesome Duotone Solid text-size Icon (https://fontawesome.com/icons/duotone/solid/text-size)
export const TextSizeDuotoneIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 360 280"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Duotone Primary: Large T */}
    <path d="M 21.0 0.5 L 178.5 0.0 L 191.5 6.0 L 199.0 17.5 L 200.0 62.5 L 197.0 70.5 L 186.5 79.0 L 173.5 79.0 L 165.0 73.5 L 160.0 62.5 L 159.5 40.0 L 120.0 40.5 L 120.0 239.5 L 146.5 241.0 L 157.0 249.5 L 160.0 257.5 L 159.0 266.5 L 157.0 270.5 L 146.5 279.0 L 57.5 280.0 L 46.5 275.0 L 41.0 266.5 L 41.0 253.5 L 46.5 245.0 L 57.5 240.0 L 80.0 239.5 L 80.0 40.5 L 40.5 40.0 L 40.0 62.5 L 37.0 70.5 L 30.5 77.0 L 22.5 80.0 L 9.5 77.0 L 3.0 70.5 L 0.0 62.5 L 0.0 21.5 L 6.0 8.5 L 11.5 4.0 L 20.5 1.0 Z" />
    {/* Duotone Secondary: Small T (55% opacity) */}
    <path
      d="M 180.0 120.5 L 339.5 120.0 L 347.5 123.0 L 355.0 129.5 L 360.0 140.5 L 360.0 184.5 L 356.0 192.5 L 347.5 199.0 L 335.5 200.0 L 324.0 192.5 L 320.0 184.5 L 319.5 160.0 L 280.0 160.5 L 280.0 239.5 L 304.5 240.0 L 316.0 247.5 L 320.0 255.5 L 320.0 264.5 L 312.5 276.0 L 304.5 280.0 L 215.5 280.0 L 204.0 272.5 L 200.0 264.5 L 200.0 255.5 L 207.5 244.0 L 215.5 240.0 L 240.0 239.5 L 240.0 160.5 L 200.5 160.0 L 200.0 184.5 L 196.0 192.5 L 184.5 200.0 L 175.5 200.0 L 170.5 198.0 L 164.0 192.5 L 160.0 184.5 L 160.0 140.5 L 165.0 129.5 L 172.5 123.0 L 179.5 121.0 Z"
      opacity="0.55"
    />
  </svg>
);

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
  const isModalOpen = useIsModalOpen();
  const mouseX = useMotionValue(Infinity);
  const [isDockHidden, setIsDockHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const lastScrollY = useRef(0);
  const lastProgressRef = useRef(0);
  const showBackToTopRef = useRef(false);
  const isScrollingToTopRef = useRef(false);
  const isDockHiddenRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const fontCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isFontExpanded, setIsFontExpanded] = useState(false);
  const [readerDockPage, setReaderDockPage] = useState<'reader' | 'home'>('reader');
  const [dockTheme, setDockTheme] = useState<'frosted' | 'crystal' | 'gilded' | 'classic'>(() => {
    return getSettings().dockTheme || 'frosted';
  });

  // Dynamic reader state when viewing content
  const [readerState, setReaderState] = useState<{
    fontSize: number;
    isAutoScrolling: boolean;
    isFav: boolean;
    scrollSpeed: number;
    title: string;
    hasAudio?: boolean;
    isAudioActive?: boolean;
  }>({
    fontSize: 18,
    isAutoScrolling: false,
    isFav: false,
    scrollSpeed: 1,
    title: '',
    hasAudio: false,
    isAudioActive: false,
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

  // Listen for live dockTheme updates from Settings
  useEffect(() => {
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserSettings>;
      if (customEvent.detail?.dockTheme) {
        setDockTheme(customEvent.detail.dockTheme);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'jain_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.dockTheme) {
            setDockTheme(parsed.dockTheme);
          }
        } catch {}
      }
    };

    window.addEventListener('jain_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('jain_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Smart Auto-Hide on Scroll Down, Reveal on Scroll Up (Stabilized against touch micro-jitter)
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
    let accumulatedDiff = 0;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = container.scrollTop;
          const diff = currentY - lastScrollY.current;

          const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 30;

          // If programmatic scroll to top was initiated, wait until near top before re-evaluating BTT
          if (isScrollingToTopRef.current) {
            if (currentY <= 40) {
              isScrollingToTopRef.current = false;
            }
          } else {
            // Scroll progress for back-to-top ring - only update when visible and changed significantly
            const shouldShowBTT = currentY > 180;
            if (shouldShowBTT !== showBackToTopRef.current) {
              showBackToTopRef.current = shouldShowBTT;
              setShowBackToTop(shouldShowBTT);
            }
          }

          if (showBackToTopRef.current) {
            const maxScroll = container.scrollHeight - container.clientHeight;
            const progress = maxScroll > 0 ? Math.min(currentY / maxScroll, 1) : 0;
            if (Math.abs(progress - lastProgressRef.current) >= 0.015) {
              lastProgressRef.current = progress;
              setScrollProgress(progress);
            }
          } else if (lastProgressRef.current !== 0) {
            lastProgressRef.current = 0;
            setScrollProgress(0);
          }

          // Direction switch resets accumulator
          if ((diff > 0 && accumulatedDiff < 0) || (diff < 0 && accumulatedDiff > 0)) {
            accumulatedDiff = 0;
          }
          accumulatedDiff += diff;

          // Never auto-hide when auto-scroll is actively running or when user reaches bottom of page
          if (readerState.isAutoScrolling || isAtBottom) {
            if (isDockHiddenRef.current) {
              isDockHiddenRef.current = false;
              setIsDockHidden(false);
            }
            accumulatedDiff = 0;
          } else if (accumulatedDiff > 50 && currentY > 110) {
            // Intentional continuous scroll down past 110px -> smooth hide dock
            if (!isDockHiddenRef.current) {
              isDockHiddenRef.current = true;
              setIsDockHidden(true);
            }
          } else if (accumulatedDiff < -28 || currentY <= 35) {
            // Intentional continuous scroll up or near top -> smooth reveal dock
            if (isDockHiddenRef.current) {
              isDockHiddenRef.current = false;
              setIsDockHidden(false);
            }
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

  const handleScrollToTop = () => {
    isScrollingToTopRef.current = true;
    showBackToTopRef.current = false;
    setShowBackToTop(false);
    lastProgressRef.current = 0;
    setScrollProgress(0);

    const container = scrollContainerRef?.current
      ?? document.querySelector('main') as HTMLElement
      ?? document.documentElement;
    container.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo(0, 0);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('landing');
    }
  };

  const resetFontCollapseTimer = useCallback(() => {
    if (fontCollapseTimerRef.current) clearTimeout(fontCollapseTimerRef.current);
    fontCollapseTimerRef.current = setTimeout(() => {
      setIsFontExpanded(false);
    }, 3500);
  }, []);

  // ALWAYS reset reader page to 'reader', reveal dock, and collapse font controls whenever activePage changes
  useEffect(() => {
    setIsFontExpanded(false);
    setReaderDockPage('reader');
    isDockHiddenRef.current = false;
    setIsDockHidden(false);
    showBackToTopRef.current = false;
    setShowBackToTop(false);
    isScrollingToTopRef.current = false;
    lastProgressRef.current = 0;
    setScrollProgress(0);
    lastScrollY.current = 0;
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
    triggerHaptic('light');
    resetFontCollapseTimer();
    window.dispatchEvent(
      new CustomEvent('jinvani:reader-font-size', {
        detail: { delta },
      })
    );
  };

  const handleToggleAutoScroll = () => {
    triggerHaptic('medium');
    window.dispatchEvent(new CustomEvent('jinvani:reader-toggle-autoscroll'));
  };

  const handleToggleAudio = () => {
    triggerHaptic('light');
    window.dispatchEvent(new CustomEvent('jinvani:toggle-audio'));
  };

  const handleToggleFavorite = () => {
    triggerHaptic('success');
    window.dispatchEvent(new CustomEvent('jinvani:reader-toggle-favorite'));
  };

  const handleShareClick = () => {
    triggerHaptic('light');
    window.dispatchEvent(new CustomEvent('jinvani:reader-share'));
  };

  const renderBackToTopIcon = () => (
    <DockIcon
      mouseX={mouseX}
      icon={
        <div className="relative flex items-center justify-center w-5 h-5 md:w-5.5 md:h-5.5">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(251,191,36,0.18)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="14"
              fill="none"
              stroke="rgba(251,191,36,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - scrollProgress)}`}
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
          </svg>
          <svg className="relative w-3 h-3 md:w-3.5 md:h-3.5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </div>
      }
      label="शीर्ष पर जाएं"
      subLabel={`${Math.round(scrollProgress * 100)}% read`}
      isActive={false}
      isSpecial
      onClick={handleScrollToTop}
    />
  );

  const renderBackToTopSection = (key: string, isVisible = showBackToTop) => (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key={key}
          layout
          initial={{ opacity: 0, width: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            width: 'auto',
            scale: 1,
            transition: {
              width: { type: 'spring', stiffness: 500, damping: 32 },
              opacity: { duration: 0.14 },
              scale: { duration: 0.14 },
            },
          }}
          exit={{
            opacity: 0,
            width: 0,
            scale: 0.8,
            transition: {
              opacity: { duration: 0.1, ease: 'easeOut' },
              scale: { duration: 0.1, ease: 'easeOut' },
              width: { duration: 0.18, ease: [0.32, 0.72, 0, 1] },
            },
          }}
          className="flex items-end gap-1.5 sm:gap-2 md:gap-2.5 overflow-hidden origin-right shrink-0"
        >
          <div className="h-7 md:h-9 w-[1px] bg-gradient-to-b from-transparent via-amber-400/30 to-transparent self-end mb-2.5 md:mb-3 shrink-0" />
          <div className="shrink-0">
            {renderBackToTopIcon()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderNavItems = () => (
    <>
      <DockIcon
        mouseX={mouseX}
        icon={<Home className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        label="मुख्य पृष्ठ"
        subLabel="Home"
        isActive={activePage === 'landing'}
        onClick={() => {
          triggerHaptic('light');
          onNavigate('landing');
        }}
      />

      <div className="h-7 md:h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent self-end mb-2.5 md:mb-3 shrink-0" />

      <DockIcon
        mouseX={mouseX}
        icon={<BookOpen className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        label="साधना"
        subLabel="Sadhana"
        isActive={activePage === 'sadhana'}
        onClick={() => {
          triggerHaptic('light');
          onNavigate('sadhana');
        }}
      />

      <DockIcon
        mouseX={mouseX}
        icon={<Library className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        label="ग्रंथालय"
        subLabel="Library"
        isActive={activePage === 'library'}
        onClick={() => {
          triggerHaptic('light');
          onNavigate('library');
        }}
      />

      <DockIcon
        mouseX={mouseX}
        icon={<Menu className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        label="अधिक"
        subLabel="More"
        isActive={activePage === 'more' || activePage === 'explore' || activePage === 'favorites'}
        onClick={() => {
          triggerHaptic('light');
          onNavigate('more');
        }}
      />

      <div className="h-7 md:h-8 w-[1px] bg-gradient-to-b from-transparent via-amber-400/30 to-transparent self-end mb-2.5 md:mb-3 shrink-0" />

      <DockIcon
        mouseX={mouseX}
        icon={<Search className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        label="खोजें"
        subLabel="Search"
        isActive={false}
        onClick={() => {
          triggerHaptic('light');
          handleSearchClick();
        }}
        isSearch
      />
    </>
  );

  const isHidden = (isDockHidden || isModalOpen) && !isHovered && !readerState.isAutoScrolling && !isFontExpanded;

  return (
    <div
      data-floating-dock="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] md:bottom-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none touch-none transition-[opacity,visibility] duration-200 ${
        isModalOpen ? 'opacity-0 pointer-events-none invisible' : ''
      }`}
    >
      <motion.div
        animate={{
          y: isHidden ? 130 : 0,
          opacity: isModalOpen ? 0 : 1,
        }}
        transition={{
          y: isHidden
            ? { duration: 0.28, ease: [0.32, 0.72, 0, 1] }
            : { type: 'spring', stiffness: 260, damping: 24, mass: 0.75 },
          opacity: {
            duration: 0.18,
            ease: 'easeInOut',
          },
        }}
        style={{
          willChange: 'transform',
          pointerEvents: isHidden ? 'none' : 'auto',
        }}
        className={`flex items-end rounded-2xl md:rounded-[26px] ${
          dockTheme === 'classic'
            ? 'classic-dock'
            : dockTheme === 'crystal'
            ? 'crystal-glass-dock'
            : dockTheme === 'gilded'
            ? 'gilded-glass-dock'
            : 'frosted-glass-dock'
        } px-2.5 sm:px-3.5 md:px-4 w-max max-w-[calc(100vw-1rem)] relative touch-none overscroll-contain select-none transition-[background-color,border-color,box-shadow] duration-300 ${
          isReaderMode ? 'min-h-[66px] md:min-h-[76px] pt-2.5 md:pt-3.5 pb-3.5 md:pb-4' : 'min-h-[58px] md:min-h-[68px] pt-2 md:pt-3 pb-2 md:pb-2.5'
        }`}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onTouchStart={handleDockTouchStart}
        onTouchEnd={handleDockTouchEnd}
      >
        {/* Subtle Ambient Specular Glass Rim Lights */}
        <div
          className={`absolute ${dockTheme === 'classic' ? 'inset-x-5' : 'inset-x-6'} top-0 h-[1px] bg-gradient-to-r from-transparent ${
            dockTheme === 'crystal'
              ? 'via-white/70'
              : dockTheme === 'gilded'
              ? 'via-amber-300/60'
              : dockTheme === 'classic'
              ? 'via-white/40'
              : 'via-white/30'
          } to-transparent pointer-events-none transition-all duration-300`}
        />
        <div
          className={`absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent ${
            dockTheme === 'crystal'
              ? 'via-white/30'
              : dockTheme === 'gilded'
              ? 'via-amber-400/30'
              : dockTheme === 'classic'
              ? 'via-amber-400/25'
              : 'via-white/15'
          } to-transparent pointer-events-none transition-all duration-300`}
        />

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
                transition={{
                  layout: { type: 'spring', stiffness: 450, damping: 32 },
                  duration: 0.16,
                }}
                className="flex items-end gap-1.5 sm:gap-2 md:gap-2.5"
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

                <div className="h-7 md:h-8 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent self-end mb-2.5 md:mb-3 shrink-0" />

                {/* 2. Expanding Font Sizing Control (Aa -> [A- 18 A+ ✓]) */}
                <div id="dock-font-controls" className="relative flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {isFontExpanded ? (
                      <motion.div
                        key="font-expanded-controls"
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="flex items-center bg-[#071224]/80 border border-amber-400/40 rounded-xl md:rounded-2xl px-1 py-0.5 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.4),0_0_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.25)] mb-2.5 h-[39px] sm:h-[42px] md:h-[46px]"
                      >
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustFontSize(-2);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title="अक्षर छोटा करें (A-)"
                        >
                          A-
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFontExpanded(false);
                          }}
                          className="px-2 py-0.5 rounded text-xs text-amber-300 hover:bg-amber-400/20 font-mono font-semibold select-none cursor-pointer transition-colors"
                          title="क्लिक करके बंद करें"
                        >
                          {readerState.fontSize}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdjustFontSize(2);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          title="अक्षर बड़ा करें (A+)"
                        >
                          A+
                        </motion.button>
                        <div className="h-4 w-[1px] bg-white/15 mx-1" />
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFontExpanded(false);
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 rounded-lg text-xs cursor-pointer transition-colors"
                          title="संपन्न"
                        >
                          ✓
                        </motion.button>
                      </motion.div>
                    ) : (
                      <DockIcon
                        key="font-collapsed-icon"
                        mouseX={mouseX}
                        icon={
                          <TextSizeDuotoneIcon className="w-5 h-5 md:w-5.5 md:h-5.5 text-slate-300 group-hover:text-amber-200 transition-colors" />
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
                    <AutoScrollIcon
                      isScrolling={readerState.isAutoScrolling}
                      className={`w-5 h-5 md:w-5.5 md:h-5.5 transition-colors ${
                        readerState.isAutoScrolling
                          ? 'text-amber-300'
                          : 'text-slate-300 group-hover:text-amber-200'
                      }`}
                    />
                  }
                  label={readerState.isAutoScrolling ? "स्क्रॉल रोकें" : "स्वतः स्क्रॉल"}
                  subLabel={readerState.isAutoScrolling ? "Pause Scroll" : "Auto Scroll"}
                  isActive={readerState.isAutoScrolling}
                  onClick={handleToggleAutoScroll}
                />

                {/* 3b. Audio Read-Along Toggle (when scripture has audio track) */}
                {readerState.hasAudio && (
                  <DockIcon
                    mouseX={mouseX}
                    icon={
                      readerState.isAudioActive ? (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute -inset-1 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                          <Volume2 className="w-5 h-5 md:w-5.5 md:h-5.5 text-amber-300" />
                        </div>
                      ) : (
                        <Volume2 className="w-5 h-5 md:w-5.5 md:h-5.5 text-slate-300 group-hover:text-amber-200 transition-colors" />
                      )
                    }
                    label={readerState.isAudioActive ? "ऑडियो सक्रिय" : "ऑडियो पाठ"}
                    subLabel={readerState.isAudioActive ? "Audio Active" : "Audio Track"}
                    isActive={!!readerState.isAudioActive}
                    onClick={handleToggleAudio}
                  />
                )}

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

                {/* 6. Back To Top in Reader Mode Tools */}
                {renderBackToTopSection('reader-btt-section', showBackToTop && !isFontExpanded)}
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
                transition={{
                  layout: { type: 'spring', stiffness: 450, damping: 32 },
                  duration: 0.16,
                }}
                className="flex items-end gap-1.5 sm:gap-2 md:gap-2.5"
              >
                {renderNavItems()}

                {renderBackToTopSection('reader-home-btt-section')}
              </motion.div>
            )
          ) : (
            /* ============================================================ */
            /* 🧭 STANDARD GLOBAL NAVIGATION MODE                          */
            /* ============================================================ */
            <motion.div
              key="standard-dock-group"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                layout: { type: 'spring', stiffness: 450, damping: 32 },
                duration: 0.16,
              }}
              className="flex items-end gap-1.5 sm:gap-2 md:gap-2.5"
            >
              {renderNavItems()}

              {renderBackToTopSection('standard-btt-section')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2-Page Pagination Dots INSIDE Dock when in Reader Mode */}
        {isReaderMode && (
          <div className={`absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto select-none py-0.5 px-3 cursor-pointer transition-opacity duration-200 ${
            isFontExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={(e) => {
                e.stopPropagation();
                setReaderDockPage('reader');
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                readerDockPage === 'reader'
                  ? 'bg-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.95),0_0_2px_#ffffff]'
                  : 'bg-white/30 hover:bg-white/60 scale-100'
              }`}
              title="स्वाध्याय टूल्स (Reader)"
            />
            <motion.button
              whileTap={{ scale: 0.75 }}
              onClick={(e) => {
                e.stopPropagation();
                setReaderDockPage('home');
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                readerDockPage === 'home'
                  ? 'bg-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.95),0_0_2px_#ffffff]'
                  : 'bg-white/30 hover:bg-white/60 scale-100'
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
  isSpecial?: boolean;
}

function DockIcon({ mouseX, icon, label, subLabel, isActive, onClick, isSearch, isSpecial }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isBouncing, setIsBouncing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1024));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isSmallMobile = windowWidth < 380;
  const isMobile = windowWidth < 768;

  // Distance from cursor to icon center on X axis
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // macOS Continuous Cosine-wave Fisheye Magnification
  const widthSync = useTransform(distance, (dist) => {
    if (isSmallMobile) return 36;
    if (isMobile) return 39;
    const absDist = Math.abs(dist);
    const radius = 145; // Magnification wave radius in px
    const baseWidth = 46; // macOS base icon tile size
    const maxWidth = 70; // macOS magnified tile size
    if (absDist >= radius) return baseWidth;
    // Cosine wave: cos(d/r * pi/2)^2 gives an ultra-smooth bell curve with zero jerk at edges
    const factor = Math.cos((absDist / radius) * (Math.PI / 2));
    return baseWidth + (maxWidth - baseWidth) * factor * factor;
  });

  // Fluid spring physics for instant, organic responsiveness
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 18 });

  // Scale inner icon glyph proportionally
  const iconScaleSync = useTransform(width, [46, 70], [1, 1.35]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 220, damping: 18 });

  // macOS Launch Bounce Physics on click
  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 520);
    onClick();
  };

  return (
    <div className="relative group flex flex-col items-center select-none">
      {/* Dynamic macOS Tooltip floating above the magnifying icon */}
      <div className="hidden md:flex flex-col items-center absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#081225]/95 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap backdrop-blur-2xl border border-amber-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.7)] translate-y-1.5 group-hover:translate-y-0 z-50">
        <span className="font-gotu text-xs font-semibold text-amber-200 pt-0.5 pb-0.5 leading-snug">{label}</span>
        {subLabel && (
          <span className="font-cinzel text-[9px] uppercase tracking-widest text-slate-400">
            {subLabel}
          </span>
        )}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#081225]/95" />
      </div>

      {/* macOS Baseline-anchored Icon Tile */}
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        animate={
          isBouncing
            ? {
                y: [0, -14, 0, -6, 0],
                transition: { duration: 0.5, times: [0, 0.28, 0.58, 0.8, 1], ease: 'easeInOut' },
              }
            : { y: 0 }
        }
        whileTap={{ scale: 0.90 }}
        whileHover={{ scale: 1.04 }}
        onClick={handleClick}
        className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer relative origin-bottom transition-colors duration-200 select-none ${
          isActive
            ? 'bg-gradient-to-b from-amber-500/25 via-amber-600/15 to-amber-700/10 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
            : isSpecial
            ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/35 hover:border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : isSearch
            ? 'dock-tile-standard bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/35 shadow-[0_4px_12px_rgba(0,0,0,0.25)]'
            : 'dock-tile-standard bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.25)]'
        }`}
      >
        <motion.div
          style={{ scale: iconScale }}
          className={`flex items-center justify-center transition-colors duration-200 ${
            isActive ? 'text-amber-200' : 'text-slate-300 group-hover:text-white'
          }`}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* macOS Active App Glowing Dot Indicator */}
      <div className="h-1.5 flex items-center justify-center mt-1 select-none pointer-events-none">
        {isActive && (
          <motion.div
            layoutId="macos-dock-active-dot"
            className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1),0_0_2px_#ffffff]"
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          />
        )}
      </div>
    </div>
  );
}