import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIsModalOpen } from '../../lib';

interface BackToTopProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  activePage?: string;
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  scrollContainerRef,
  activePage,
  threshold = 180,
  className = '',
}) => {
  const isModalOpen = useIsModalOpen();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const getContainer = useCallback((): HTMLElement | null => {
    if (scrollContainerRef && scrollContainerRef.current) {
      return scrollContainerRef.current;
    }
    return document.querySelector('main') || document.documentElement || document.body;
  }, [scrollContainerRef]);

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const container = getContainer();
      const containerScroll = container ? container.scrollTop : 0;
      const windowScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const currentScroll = Math.max(containerScroll, windowScroll);

      const scrollHeight = container ? container.scrollHeight : document.documentElement.scrollHeight;
      const clientHeight = container ? container.clientHeight : window.innerHeight;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));

      setScrollProgress(progress);
      setIsVisible(currentScroll > threshold);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    const container = getContainer();
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    checkScroll();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', handleScroll);
    };
  }, [getContainer, threshold, activePage]);

  const scrollToTop = () => {
    const container = getContainer();
    if (container) {
      try {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } catch {
        container.scrollTop = 0;
      }
    }

    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch {
      window.scrollTo(0, 0);
    }

    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  // SVG circular progress calculation
  const size = 48;
  const strokeWidth = 2.5;
  const center = size / 2;
  const radius = center - strokeWidth - 1;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {isVisible && !isModalOpen && (
        <motion.div
          key="back-to-top-wrapper"
          data-back-to-top="true"
          initial={{ opacity: 0, scale: 0.75, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: 16 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          className={`fixed bottom-24 md:bottom-8 left-4 md:left-auto md:right-7 z-40 flex items-center group select-none ${className}`}
        >
          {/* Tooltip on Desktop */}
          <div className="hidden md:flex flex-col items-end absolute right-full mr-3.5 px-3 py-1.5 bg-[#071124]/95 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)] translate-x-2 group-hover:translate-x-0">
            <span className="font-gotu text-xs font-semibold text-amber-200">शीर्ष पर जाएं</span>
            <span className="font-cinzel text-[9px] uppercase tracking-widest text-slate-400">
              {Math.round(scrollProgress * 100)}% Completed
            </span>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#071124]/95" />
          </div>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            aria-label="शीर्ष पर जाएं (Back to Top)"
            title="शीर्ष पर जाएं (Back to Top)"
            className="relative w-12 h-12 md:w-13 md:h-13 rounded-2xl
                       bg-[#071124]/85 hover:bg-[#0c1a36]/95
                       border border-amber-500/35 hover:border-amber-400/80
                       text-amber-300 hover:text-amber-100
                       shadow-[0_12px_32px_rgba(0,0,0,0.75),0_0_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]
                       hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]
                       backdrop-blur-2xl backdrop-saturate-[190%]
                       flex items-center justify-center
                       cursor-pointer
                       transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {/* SVG Circular Progress Track around button */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
              viewBox={`0 0 ${size} ${size}`}
            >
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-amber-500/15"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-amber-400 transition-all duration-150 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Specular Top Rim Highlight */}
            <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent rounded-full pointer-events-none" />

            {/* Refined Artisanal Vector Arrow Glyph */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 md:w-5.5 md:h-5.5 text-amber-300 group-hover:text-amber-100 transition-all duration-300 group-hover:-translate-y-0.5 drop-shadow-[0_1px_4px_rgba(245,158,11,0.4)]"
            >
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
