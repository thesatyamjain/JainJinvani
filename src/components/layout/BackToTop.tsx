import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface BackToTopProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  activePage?: string;
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  scrollContainerRef,
  activePage,
  threshold = 200,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

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

    // Initial check on mount and whenever activePage/container changes
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="back-to-top-wrapper"
          initial={{ opacity: 0, scale: 0.65, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.65, y: 16 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 flex items-center group ${className}`}
        >
          {/* Tooltip on Desktop */}
          <div className="hidden md:flex flex-col items-end absolute right-full mr-3 px-3 py-1.5 bg-[#091428]/95 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)] translate-x-2 group-hover:translate-x-0">
            <span className="font-gotu text-xs font-semibold text-amber-200">शीर्ष पर जाएं</span>
            <span className="font-cinzel text-[9px] uppercase tracking-widest text-slate-400">Back to Top</span>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#091428]/95" />
          </div>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            aria-label="शीर्ष पर जाएं (Back to Top)"
            title="शीर्ष पर जाएं (Back to Top)"
            className="relative w-12 h-12 md:w-13 md:h-13 rounded-2xl
                       bg-[#071124]/75 hover:bg-[#0c1a36]/85
                       border border-amber-500/35 hover:border-amber-400/80
                       text-amber-300 hover:text-amber-100
                       shadow-[0_12px_32px_rgba(0,0,0,0.75),0_0_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)]
                       hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]
                       backdrop-blur-2xl backdrop-saturate-[190%]
                       flex items-center justify-center
                       cursor-pointer
                       transition-all duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            {/* Ambient hover aura */}
            <div className="absolute inset-0 rounded-2xl bg-radial-gradient from-amber-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Specular Top Rim Reflection */}
            <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent rounded-full pointer-events-none" />

            {/* Icon */}
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 group-hover:-translate-y-1 text-amber-300 group-hover:text-amber-100 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
