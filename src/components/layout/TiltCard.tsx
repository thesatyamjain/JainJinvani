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
  ...props
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if device supports fine hover and user has not requested reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapability = () => {
      setCanTilt(hoverQuery.matches && !motionQuery.matches && !disabled);
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

  // Spring-smoothed scale on hover
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

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt) return;
    setIsHovered(true);
    scaleValue.set(scale);
    if (glare) glareOpacityTarget.set(glareMaxOpacity);
    onPointerEnter?.(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Relative mouse position normalized from -0.5 (left/top) to +0.5 (right/bottom)
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);

    onPointerMove?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsHovered(false);
    // Smoothly settle back to level resting state
    x.set(0);
    y.set(0);
    scaleValue.set(1);
    glareOpacityTarget.set(0);
    onPointerLeave?.(e);
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
      {...props}
    >
      <motion.div
        style={{
          rotateX: canTilt ? rotateX : 0,
          rotateY: canTilt ? rotateY : 0,
          scale: canTilt ? springScale : 1,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'w-full h-full relative transition-shadow duration-300 will-change-transform',
          isHovered && canTilt ? 'shadow-[0_20px_45px_rgba(0,0,0,0.6)]' : '',
          contentClassName
        )}
      >
        {children}

        {/* Dynamic Specular Holographic Glare Sheen */}
        {glare && canTilt && (
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
