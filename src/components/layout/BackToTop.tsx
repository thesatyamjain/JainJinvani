import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 180,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const checkScroll = () => {
      const windowScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const mainEl = document.querySelector('main');
      const mainScroll = mainEl ? mainEl.scrollTop : 0;
      const currentScroll = Math.max(windowScroll, mainScroll);

      setIsVisible(currentScroll > threshold);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    };

    // Attach to window (capture phase) and specifically to <main>
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Initial check
    checkScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, [threshold]);

  const scrollToTop = () => {
    // Smooth scroll for window / html / body
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Smooth scroll for <main> container
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.5, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 15 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={scrollToTop}
          aria-label="शीर्ष पर जाएं (Back to Top)"
          title="शीर्ष पर जाएं (Back to Top)"
          className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50
                     w-11 h-11 md:w-12 md:h-12 rounded-full
                     bg-slate-950/90 hover:bg-slate-900
                     border border-amber-500/40 hover:border-amber-400/80
                     text-amber-300 hover:text-amber-100
                     shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.25)]
                     hover:shadow-[0_12px_35px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.5)]
                     backdrop-blur-2xl
                     flex items-center justify-center
                     cursor-pointer group
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-amber-400/50
                     ${className}`}
        >
          {/* Specular Top Rim Reflection */}
          <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent rounded-full pointer-events-none" />

          {/* Icon */}
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:-translate-y-0.5 text-amber-300 group-hover:text-amber-100" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
