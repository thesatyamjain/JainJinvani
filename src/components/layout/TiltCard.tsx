import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
  glareColor?: 'amber' | 'gold' | 'white' | 'subtle';
  glareMaxOpacity?: number;
  stiffness?: number;
  damping?: number;
  disabled?: boolean;
}

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement>, TiltOptions {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const TiltCard = ({
  children,
  className,
  contentClassName,
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  glareColor = 'amber',
  glareMaxOpacity = 0.2,
  stiffness = 280,
  damping = 22,
  disabled = false,
  onPointerMove,
  onPointerLeave,
  onPointerEnter,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canHoverTilt, setCanHoverTilt] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Track touch gesture state for mobile scroll safety
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isTouchScrolling = useRef(false);

  // Check device capabilities (desktop mouse hover vs mobile touch & reduced motion)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapability = () => {
      setCanHoverTilt(hoverQuery.matches && !disabled);
      setIsReducedMotion(motionQuery.matches);
    };

    updateCapability();

    hoverQuery.addEventListener('change', updateCapability);
    motionQuery.addEventListener('change', updateCapability);

    return () => {
      hoverQuery.removeEventListener('change', updateCapability);
      motionQuery.removeEventListener('change', updateCapability);
    };
  }, [disabled]);

  // Motion values: normalized relative cursor positions [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for authentic physical dampening on motion & exit
  const springX = useSpring(x, { stiffness, damping, mass: 0.5 });
  const springY = useSpring(y, { stiffness, damping, mass: 0.5 });

  // Map spring coordinates to 3D rotation angles
  // Moving mouse up (negative y) tilts top backwards (positive rotateX)
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Spring-smoothed scale
  const scaleValue = useMotionValue(1);
  const springScale = useSpring(scaleValue, { stiffness: 300, damping: 24 });

  // Glare position in percentages [0% to 100%]
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glarePercentX = useTransform(glareX, (val) => `${val}%`);
  const glarePercentY = useTransform(glareY, (val) => `${val}%`);

  // Glare opacity spring
  const glareOpacityTarget = useMotionValue(0);
  const springGlareOpacity = useSpring(glareOpacityTarget, { stiffness: 250, damping: 25 });

  const resetRestState = () => {
    x.set(0);
    y.set(0);
    scaleValue.set(1);
    glareOpacityTarget.set(0);
    setIsHovered(false);
  };

  // --- Desktop Mouse / Fine Pointer Handlers ---
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || isReducedMotion || e.pointerType === 'touch') return;
    if (canHoverTilt) {
      setIsHovered(true);
      scaleValue.set(scale);
      if (glare) glareOpacityTarget.set(glareMaxOpacity);
    }
    onPointerEnter?.(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || isReducedMotion || !cardRef.current) return;

    if (e.pointerType === 'touch') {
      // If finger moved beyond 8px, user is scrolling: cancel touch tilt immediately
      if (isTouchScrolling.current) return;
      if (touchStartPos.current) {
        const dx = e.clientX - touchStartPos.current.x;
        const dy = e.clientY - touchStartPos.current.y;
        if (Math.hypot(dx, dy) > 8) {
          isTouchScrolling.current = true;
          resetRestState();
          return;
        }
      }
      return;
    }

    // Fine pointer / mouse move
    if (!canHoverTilt) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    onPointerMove?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') {
      resetRestState();
    }
    onPointerLeave?.(e);
  };

  // --- Mobile Touch / Press Handlers (Tactile Physical Press + Sheen) ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || isReducedMotion) {
      onPointerDown?.(e);
      return;
    }

    if (e.pointerType === 'touch') {
      touchStartPos.current = { x: e.clientX, y: e.clientY };
      isTouchScrolling.current = false;

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
          const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

          // Micro-tilt towards finger & tactile physical press depth
          x.set(normalizedX * 0.35);
          y.set(normalizedY * 0.35);
          scaleValue.set(0.985);
          if (glare) glareOpacityTarget.set(glareMaxOpacity * 0.7);
        }
      }
    }

    onPointerDown?.(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStartPos.current = null;
    isTouchScrolling.current = false;
    if (e.pointerType === 'touch') {
      resetRestState();
    }
    onPointerUp?.(e);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    touchStartPos.current = null;
    isTouchScrolling.current = false;
    resetRestState();
    onPointerCancel?.(e);
  };

  // Glare gradients matching Jain Jinvani aesthetics
  const glareGradients = {
    amber: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.12) 40%, transparent 75%)',
    gold: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(254, 240, 138, 0.4) 0%, rgba(217, 119, 6, 0.15) 45%, transparent 80%)',
    white: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)',
    subtle: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 35%, transparent 70%)',
  };

  return (
    <div
      ref={cardRef}
      style={{ perspective: `${perspective}px` }}
      className={cn('relative transform-gpu', className)}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      {...props}
    >
      <motion.div
        style={{
          rotateX: isReducedMotion ? 0 : rotateX,
          rotateY: isReducedMotion ? 0 : rotateY,
          scale: isReducedMotion ? 1 : springScale,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'w-full h-full relative transition-shadow duration-300 will-change-transform',
          isHovered ? 'shadow-[0_20px_45px_rgba(0,0,0,0.6)]' : '',
          contentClassName
        )}
      >
        {children}

        {/* Dynamic Specular Holographic Glare Sheen */}
        {glare && !isReducedMotion && (
          <motion.div
            aria-hidden="true"
            style={{
              opacity: springGlareOpacity,
              backgroundImage: glareGradients[glareColor],
              ['--glare-x' as any]: glarePercentX,
              ['--glare-y' as any]: glarePercentY,
            }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-30 mix-blend-overlay transition-opacity duration-200"
          />
        )}
      </motion.div>
    </div>
  );
};
