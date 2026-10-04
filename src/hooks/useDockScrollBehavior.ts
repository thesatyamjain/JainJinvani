import { useState, useRef, useEffect, useCallback } from 'react';

interface UseDockScrollBehaviorOptions {
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  activePage: string;
  isAutoScrolling?: boolean;
}

export function useDockScrollBehavior({
  scrollContainerRef,
  activePage,
  isAutoScrolling = false,
}: UseDockScrollBehaviorOptions) {
  const [isDockHidden, setIsDockHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const lastScrollY = useRef(0);
  const lastProgressRef = useRef(0);
  const showBackToTopRef = useRef(false);
  const isScrollingToTopRef = useRef(false);
  const isDockHiddenRef = useRef(false);

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
          if (isAutoScrolling || isAtBottom) {
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
  }, [scrollContainerRef, activePage, isAutoScrolling]);

  const handleScrollToTop = useCallback(() => {
    isScrollingToTopRef.current = true;
    showBackToTopRef.current = false;
    setShowBackToTop(false);
    lastProgressRef.current = 0;
    setScrollProgress(0);

    const container =
      scrollContainerRef?.current ??
      (document.querySelector('main') as HTMLElement) ??
      document.documentElement;
    container.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo(0, 0);
  }, [scrollContainerRef]);

  const revealDock = useCallback(() => {
    isDockHiddenRef.current = false;
    setIsDockHidden(false);
  }, []);

  return {
    isDockHidden,
    setIsDockHidden,
    revealDock,
    scrollProgress,
    showBackToTop,
    handleScrollToTop,
  };
}
