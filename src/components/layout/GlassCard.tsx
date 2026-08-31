import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gilded' | 'cosmic' | 'sacred' | 'subtle';
  intensity?: 'low' | 'medium' | 'high';
  sheen?: boolean;
}

export const GlassCard = ({
  children,
  className,
  variant = 'default',
  intensity = 'high',
  sheen = true,
  ...props
}: GlassCardProps) => {
  const variantClasses = {
    default:
      'bg-slate-900/50 backdrop-blur-2xl backdrop-saturate-[180%] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-white/20 hover:bg-slate-900/60',
    gilded:
      'bg-gradient-to-br from-slate-900/60 via-[#0a1426]/70 to-[#050b17]/80 backdrop-blur-2xl backdrop-saturate-[190%] border border-amber-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_25px_rgba(245,158,11,0.06),inset_0_1px_1px_rgba(255,255,255,0.18)] hover:border-amber-400/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.75),0_0_35px_rgba(245,158,11,0.15),inset_0_1px_1px_rgba(255,255,255,0.28)]',
    cosmic:
      'bg-gradient-to-br from-[#0c1830]/55 via-[#070e1c]/70 to-[#030712]/85 backdrop-blur-2xl backdrop-saturate-[180%] border border-blue-500/20 shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:border-blue-400/35',
    sacred:
      'bg-gradient-to-b from-[#111f38]/75 via-[#0a1428]/85 to-[#060c18]/90 backdrop-blur-3xl backdrop-saturate-[200%] border border-amber-400/35 shadow-[0_16px_50px_rgba(0,0,0,0.75),0_0_30px_rgba(251,191,36,0.12),inset_0_1px_1px_rgba(255,255,255,0.25)]',
    subtle:
      'bg-white/[0.04] backdrop-blur-xl backdrop-saturate-[160%] border border-white/8 shadow-[0_8px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-white/15',
  };

  const intensityModifier = {
    low: 'backdrop-blur-md',
    medium: 'backdrop-blur-xl',
    high: 'backdrop-blur-2xl',
  };

  const isGilded = variant === 'gilded' || variant === 'sacred';

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        variantClasses[variant],
        intensity !== 'high' && intensityModifier[intensity],
        className
      )}
      {...props}
    >
      {/* Specular Top Light Reflection */}
      {sheen && (
        <div
          className={cn(
            'absolute inset-x-2 top-0 h-[1px] rounded-full pointer-events-none transition-opacity duration-300',
            isGilded
              ? 'bg-gradient-to-r from-transparent via-amber-300/50 to-transparent opacity-80 group-hover:opacity-100'
              : 'bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 group-hover:opacity-100'
          )}
        />
      )}

      {/* Subtle Ambient Radial Highlight on Hover */}
      <div className="absolute -inset-px rounded-2xl bg-radial-gradient from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {children}
    </div>
  );
};
