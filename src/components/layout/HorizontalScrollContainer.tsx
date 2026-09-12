import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  arrowClassName?: string;
  step?: number;
}

export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  className = '',
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

  return (
    <div className={`relative group/hscroll w-full flex items-center ${className}`}>
      {/* Left Navigation Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-step)}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-xl hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition-all duration-200 cursor-pointer sm:-translate-x-3.5 ${arrowClassName}`}
          title="बाईं ओर स्क्रॉल करें"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}

      {/* Left Edge Fade Mask */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-[#050a14] via-[#050a14]/80 to-transparent pointer-events-none z-10" />
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClickCapture={handleCaptureClick}
        className="w-full flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none no-scrollbar select-none cursor-grab active:cursor-grabbing scroll-smooth"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {children}
      </div>

      {/* Right Edge Fade Mask */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-[#050a14] via-[#050a14]/80 to-transparent pointer-events-none z-10" />
      )}

      {/* Right Navigation Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(step)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-xl hover:bg-amber-500 hover:text-slate-950 active:scale-95 transition-all duration-200 cursor-pointer sm:translate-x-3.5 ${arrowClassName}`}
          title="दाईं ओर स्क्रॉल करें"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  );
};
