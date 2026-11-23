import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  arrowClassName?: string;
  step?: number;
}

export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  className = '',
  innerClassName = '',
  arrowClassName = '',
  step = 260,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();

    // Wheel listener to enable horizontal scroll via vertical mouse wheel
    const handleWheel = (e: WheelEvent) => {
      // If there is horizontal overflow, scroll horizontally
      if (el.scrollWidth > el.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
          checkScroll();
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    // Initial check with delay for dynamic layout rendering
    const timer = setTimeout(checkScroll, 100);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, children]);

  const scrollBy = (amount: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(checkScroll, 250);
    }
  };

  // Desktop Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCaptureClick = (e: React.MouseEvent) => {
    // If the user was dragging, prevent accidental click on a tab
    if (hasMovedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasMovedRef.current = false;
    }
  };

  const maskStyle: React.CSSProperties = {
    maskImage: canScrollLeft && canScrollRight
      ? 'linear-gradient(to right, transparent 0%, black 28px, black calc(100% - 36px), transparent 100%)'
      : canScrollRight
      ? 'linear-gradient(to right, black calc(100% - 36px), transparent 100%)'
      : canScrollLeft
      ? 'linear-gradient(to right, transparent 0%, black 28px, black 100%)'
      : undefined,
    WebkitMaskImage: canScrollLeft && canScrollRight
      ? 'linear-gradient(to right, transparent 0%, black 28px, black calc(100% - 36px), transparent 100%)'
      : canScrollRight
      ? 'linear-gradient(to right, black calc(100% - 36px), transparent 100%)'
      : canScrollLeft
      ? 'linear-gradient(to right, transparent 0%, black 28px, black 100%)'
      : undefined,
  };

  return (
    <div className={`relative group/hscroll w-full flex items-center ${className}`}>
      {/* Left Navigation Arrow */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollBy(-step)}
            className={`hidden sm:flex hscroll-arrow-btn absolute left-0 sm:-left-3.5 top-0 bottom-0 my-auto z-20 w-8 h-8 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-xl hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer ${arrowClassName}`}
            title="बाईं ओर स्क्रॉल करें"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable Container with Dynamic Feathered Alpha Mask */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleCaptureClick}
        style={{
          touchAction: 'pan-x pan-y',
          ...maskStyle,
        }}
        className={`w-full flex items-center gap-2 overflow-x-auto py-1.5 px-1 scrollbar-none no-scrollbar select-none cursor-grab active:cursor-grabbing scroll-smooth after:content-[''] after:w-4 after:shrink-0 ${innerClassName}`}
      >
        {children}
      </div>

      {/* Right Navigation Arrow */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollBy(step)}
            className={`hidden sm:flex hscroll-arrow-btn absolute right-0 sm:-right-3.5 top-0 bottom-0 my-auto z-20 w-8 h-8 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-xl hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer ${arrowClassName}`}
            title="दाईं ओर स्क्रॉल करें"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
