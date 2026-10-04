import { useState, useRef, useEffect, useCallback } from 'react';

export function useAutoScroll(initialSpeed: number = 1) {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(initialSpeed);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAutoScrolling) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const container = document.querySelector('main') || document.documentElement;
    let lastTime = performance.now();

    const scrollStep = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (container) {
        // ~35px/second at speed 1, smooth fluid reading rate
        const pixelsToScroll = (35 * scrollSpeed * delta) / 1000;
        container.scrollTop += pixelsToScroll;

        // Check if reached bottom
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 8) {
          setIsAutoScrolling(false);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(scrollStep);
    };

    rafRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isAutoScrolling, scrollSpeed]);

  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrolling((prev) => !prev);
  }, []);

  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
  }, []);

  return {
    isAutoScrolling,
    setIsAutoScrolling,
    scrollSpeed,
    setScrollSpeed,
    toggleAutoScroll,
    stopAutoScroll,
  };
}
