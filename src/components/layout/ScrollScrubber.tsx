import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIsModalOpen } from '../../lib';

interface ScrollScrubberProps {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export const ScrollScrubber: React.FC<ScrollScrubberProps> = ({ scrollContainerRef }) => {
  const isModalOpen = useIsModalOpen();
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(32);
  const [scrollRatio, setScrollRatio] = useState(0);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const getContainer = useCallback((): HTMLElement | null => {
    if (scrollContainerRef && scrollContainerRef.current) {
      return scrollContainerRef.current;
    }
    return document.querySelector('main');
  }, [scrollContainerRef]);

  // Update thumb position based on container scroll
  const updateThumbPosition = useCallback(() => {
    const container = getContainer();
    if (!container || !trackRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 20) {
      setIsVisible(false);
      return;
    }

    const trackHeight = trackRef.current.clientHeight || window.innerHeight;
    const computedThumbHeight = Math.max(
      28,
      Math.min(trackHeight * 0.3, (clientHeight / scrollHeight) * trackHeight)
    );
    setThumbHeight(computedThumbHeight);

    const availableTrack = trackHeight - computedThumbHeight;
    const currentRatio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    setScrollRatio(currentRatio);
    setThumbTop(currentRatio * availableTrack);

    setIsVisible(true);

    if (!isDraggingRef.current) {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        if (!isDraggingRef.current) {
          setIsVisible(false);
        }
      }, 900);
    }
  }, [getContainer]);

  useEffect(() => {
    const container = getContainer();
    if (!container) return;

    const handleScroll = () => {
      if (!isDraggingRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateThumbPosition);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateThumbPosition);

    updateThumbPosition();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateThumbPosition);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [getContainer, updateThumbPosition]);

  // Instant Dragging calculation with zero lag
  const handleScrollFromY = useCallback(
    (clientY: number) => {
      const container = getContainer();
      if (!container || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const trackTop = trackRect.top;
      const trackHeight = trackRect.height;
      const availableTrack = trackHeight - thumbHeight;

      if (availableTrack <= 0) return;

      const relativeY = clientY - trackTop - thumbHeight / 2;
      const clampedY = Math.max(0, Math.min(availableTrack, relativeY));
      const ratio = clampedY / availableTrack;

      const { scrollHeight, clientHeight } = container;
      const targetScrollTop = ratio * (scrollHeight - clientHeight);

      // Instant scroll without animation queue
      container.scrollTop = targetScrollTop;
      setThumbTop(clampedY);
      setScrollRatio(ratio);
    },
    [getContainer, thumbHeight]
  );

  // Touch Handlers with 0ms touch delay and touch-action: none
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    if (e.touches.length > 0) {
      handleScrollFromY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    if (e.touches.length > 0) {
      handleScrollFromY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    isDraggingRef.current = false;
    setIsDragging(false);

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 900);
  };

  // Mouse Handlers for Desktop Click & Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    setIsVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    handleScrollFromY(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current) {
        moveEvent.preventDefault();
        handleScrollFromY(moveEvent.clientY);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const percent = Math.round(scrollRatio * 100);

  return (
    <div
      ref={trackRef}
      data-scroll-scrubber="true"
      style={{ touchAction: 'none' }}
      className={`fixed right-0 top-14 bottom-24 z-40 w-7 select-none transition-opacity duration-150 ${
        (isVisible || isDragging) && !isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Interactive Touch Grab Area Rail */}
      <div
        className="w-full h-full cursor-pointer relative flex justify-end"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Draggable Thumb Indicator - NO CSS transition on position so it tracks finger with 0ms latency */}
        <div
          style={{
            top: `${thumbTop}px`,
            height: `${thumbHeight}px`,
            transition: isDragging ? 'none' : 'opacity 150ms ease-out',
          }}
          className={`absolute right-1 rounded-full ${
            isDragging
              ? 'w-1.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.9)]'
              : 'w-1 bg-amber-400/70 hover:bg-amber-400/90 shadow-[0_0_4px_rgba(245,158,11,0.3)]'
          }`}
        />

        {/* Dragging Percentage / Position Pill Tooltip */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, x: 4, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 4, scale: 0.9 }}
              transition={{ duration: 0.1 }}
              style={{
                top: `${Math.max(10, Math.min(window.innerHeight - 180, thumbTop + thumbHeight / 2 - 12))}px`,
              }}
              className="absolute right-5 px-2 py-0.5 rounded-lg bg-slate-950/90 border border-amber-400/40 text-amber-200 text-[10px] font-mono font-bold shadow-md backdrop-blur-md pointer-events-none"
            >
              <span>{percent}%</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
