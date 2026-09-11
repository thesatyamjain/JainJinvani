import { useEffect, useRef } from 'react';
import { triggerHaptic } from '../utils/pwaManager';

interface UseEdgeSwipeBackOptions {
  onBack: () => void;
  enabled?: boolean;
  edgeThreshold?: number;
  swipeDistance?: number;
}

/**
 * Native Edge-Swipe Back Gesture
 * Detects left-to-right swipe originating from the left edge (< 28px)
 * and smoothly triggers back navigation with haptic feedback.
 */
export function useEdgeSwipeBack({
  onBack,
  enabled = true,
  edgeThreshold = 28,
  swipeDistance = 75,
}: UseEdgeSwipeBackOptions) {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isEligibleRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];

      // Only activate if touch begins right at the screen's left edge
      if (touch.clientX <= edgeThreshold) {
        startXRef.current = touch.clientX;
        startYRef.current = touch.clientY;
        isEligibleRef.current = true;
      } else {
        isEligibleRef.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isEligibleRef.current || startXRef.current === null || startYRef.current === null) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - startXRef.current;
      const deltaY = touch.clientY - startYRef.current;

      // Cancel if swipe is predominantly vertical
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2 && deltaX < 30) {
        isEligibleRef.current = false;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isEligibleRef.current || startXRef.current === null || startYRef.current === null) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startXRef.current;
      const deltaY = Math.abs(touch.clientY - startYRef.current);

      if (deltaX >= swipeDistance && deltaX > deltaY * 1.3) {
        triggerHaptic('medium');
        onBack();
      }

      startXRef.current = null;
      startYRef.current = null;
      isEligibleRef.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onBack, edgeThreshold, swipeDistance]);
}
