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
}

export const GlassCard = ({
  children,
  className,
  variant = 'default',
  intensity = 'medium',
  ...props
}: GlassCardProps) => {
  const variantClasses = {
    default:
      'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/20',
    gilded:
      'bg-gradient-to-br from-slate-900/80 via-[#0a1222]/85 to-[#050b17]/90 backdrop-blur-xl border border-amber-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.06),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-amber-500/45 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7),0_0_35px_rgba(245,158,11,0.15)]',
    cosmic:
      'bg-gradient-to-br from-[#0c1830]/75 via-[#070e1c]/85 to-[#030712]/95 backdrop-blur-2xl border border-blue-500/20 shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-blue-400/35',
    sacred:
      'bg-gradient-to-b from-[#111f38]/90 to-[#060c18]/95 backdrop-blur-2xl border border-amber-400/35 shadow-[0_16px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(251,191,36,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]',
    subtle:
      'bg-white/[0.03] backdrop-blur-md border border-white/5 shadow-lg',
  };

  const intensityModifier = {
    low: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    high: 'backdrop-blur-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 relative overflow-hidden',
        variantClasses[variant],
        intensityModifier[intensity],
        className
      )}
      {...props}
    >
      {/* Specular Top Light Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-70" />
      {children}
    </div>
  );
};
