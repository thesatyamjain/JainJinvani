import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TiltCard, type TiltOptions } from './TiltCard';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function splitGridClasses(className?: string) {
  if (!className) return { outer: '', inner: '' };
  const tokens = className.split(/\s+/).filter(Boolean);
  const outerTokens: string[] = [];
  const innerTokens: string[] = [];
  for (const token of tokens) {
    if (/^(sm:|md:|lg:|xl:)?(col-span-|row-span-)/.test(token)) {
      outerTokens.push(token);
    } else {
      innerTokens.push(token);
    }
  }
  return { outer: outerTokens.join(' '), inner: innerTokens.join(' ') };
}

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gilded' | 'cosmic' | 'sacred' | 'subtle';
  intensity?: 'low' | 'medium' | 'high';
  sheen?: boolean;
  tilt?: boolean | TiltOptions;
}

export const GlassCard = ({
  children,
  className,
  variant = 'default',
  intensity = 'high',
  sheen = true,
  tilt = false,
  ...props
}: GlassCardProps) => {
  const variantClasses = {
    default:
      'bg-[#0c101a]/70 backdrop-blur-2xl backdrop-saturate-[170%] border border-white/10 shadow-[0_12px_36px_rgba(6,4,2,0.6),inset_0_1px_1px_rgba(255,255,255,0.14)] hover:border-white/20 hover:bg-[#0f1422]/80',
    gilded:
      'bg-gradient-to-br from-[#121620]/80 via-[#0c101a]/85 to-[#07090f]/90 backdrop-blur-2xl backdrop-saturate-[180%] border border-amber-500/25 shadow-[0_14px_40px_rgba(8,5,2,0.7),0_0_24px_rgba(245,158,11,0.06),inset_0_1px_1px_rgba(254,240,138,0.22),inset_0_-1px_1px_rgba(0,0,0,0.5)] hover:border-amber-400/50 hover:shadow-[0_18px_48px_rgba(8,5,2,0.85),0_0_35px_rgba(245,158,11,0.16),inset_0_1px_1px_rgba(254,240,138,0.35)]',
    cosmic:
      'bg-gradient-to-br from-[#0f1524]/60 via-[#0a0f1c]/75 to-[#050812]/85 backdrop-blur-2xl border border-amber-500/20 shadow-[0_12px_36px_rgba(6,4,2,0.6),inset_0_1px_1px_rgba(254,240,138,0.12)] hover:border-amber-400/35',
    sacred:
      'bg-gradient-to-b from-[#181d28]/85 via-[#0e121c]/90 to-[#080b12]/95 backdrop-blur-3xl backdrop-saturate-[190%] border border-amber-400/40 shadow-[0_18px_50px_rgba(8,5,2,0.85),0_0_32px_rgba(251,191,36,0.12),inset_0_1px_1px_rgba(254,240,138,0.3)]',
    subtle:
      'bg-white/[0.035] backdrop-blur-xl border border-amber-500/15 shadow-[0_10px_32px_rgba(6,4,2,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-amber-500/30 hover:bg-white/[0.06]',
  };

  const intensityModifier = {
    low: 'backdrop-blur-md',
    medium: 'backdrop-blur-xl',
    high: 'backdrop-blur-2xl',
  };

  const isGilded = variant === 'gilded' || variant === 'sacred';

  const cardContent = (
    <>
      {/* Specular Top Light Reflection */}
      {sheen && (
        <div
          className={cn(
            'absolute inset-x-3 top-0 h-[1.5px] rounded-full pointer-events-none transition-opacity duration-300',
            isGilded
              ? 'bg-gradient-to-r from-transparent via-amber-200/70 to-transparent opacity-80 group-hover:opacity-100'
              : 'bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60 group-hover:opacity-100'
          )}
        />
      )}

      {/* Subtle Ambient Radial Highlight on Hover */}
      <div className="absolute -inset-px rounded-2xl bg-radial-gradient from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {children}
    </>
  );

  const cardClasses = (innerClasses?: string) =>
    cn(
      'rounded-2xl transition-[background-color,border-color,box-shadow] duration-300 relative overflow-hidden',
      variantClasses[variant],
      intensity !== 'high' && intensityModifier[intensity],
      innerClasses
    );

  const cardBody = (innerClasses?: string) => {
    // If card is interactive (has onClick) and tilt is not active, apply Framer Motion tactile spring
    if (props.onClick && !tilt) {
      return (
        <motion.div
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cardClasses(innerClasses)}
          {...(props as any)}
        >
          {cardContent}
        </motion.div>
      );
    }

    return (
      <div
        className={cardClasses(innerClasses)}
        {...(tilt ? {} : props)}
      >
        {cardContent}
      </div>
    );
  };

  if (tilt) {
    // On touch/mobile devices, skip 3D tilt calculations to preserve 60/120 FPS scrolling performance
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      return cardBody(className);
    }

    const tiltOptions = typeof tilt === 'object' ? tilt : {};
    const resolvedGlareColor = tiltOptions.glareColor || (isGilded ? 'amber' : 'white');
    const { outer, inner } = splitGridClasses(className);

    return (
      <TiltCard
        className={cn(outer, className?.includes('h-full') ? 'h-full' : '')}
        glareColor={resolvedGlareColor}
        contentClassName={className?.includes('h-full') ? 'h-full' : ''}
        {...tiltOptions}
        {...props}
      >
        {cardBody(cn(inner, 'w-full h-full'))}
      </TiltCard>
    );
  }

  return cardBody(className);
};

export { TiltCard, type TiltOptions, type TiltCardProps } from './TiltCard';

