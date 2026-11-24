import { useState, useRef, useEffect, useCallback } from 'react';

export interface AutoScrollOptions {
  initialSpeed?: number;
  fontSize?: number;
}

export function useAutoScroll(options: number | AutoScrollOptions = 1) {
  const initialSpeed = typeof options === 'number' ? options : (options.initialSpeed ?? 1);
  const fontSize = typeof options === 'object' ? (options.fontSize ?? 18) : 18;

  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(initialSpeed);
  const rafRef = useRef<number | null>(null);
  const isTouchPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoScrolling) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      isTouchPausedRef.current = false;
      return;
    }

    const container = document.querySelector('main') || document.documentElement;
    let lastTime = performance.now();

    // Zero-friction touch interruption: pause when user touches/wheels, resume 1.5s after inactivity
    const handleUserInteraction = () => {
      isTouchPausedRef.current = true;
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isTouchPausedRef.current = false;
        lastTime = performance.now();
      }, 1500);
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });

    const scrollStep = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (container && !isTouchPausedRef.current) {
        // Base: 15px/second at 1x & 18px font (devotional recitation ~20-25s per verse)
        // Scaled by fontSize so larger fonts take the exact same seconds-per-verse
        const fontScale = Math.max(0.7, Math.min(1.8, fontSize / 18));
        const pixelsToScroll = (15 * scrollSpeed * fontScale * delta) / 1000;
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
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
    };
  }, [isAutoScrolling, scrollSpeed, fontSize]);

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
