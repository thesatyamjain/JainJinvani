import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard = ({ children, className, intensity = 'medium', ...props }: GlassCardProps) => {
  const intensityClasses = {
    low: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    high: 'bg-white/20 backdrop-blur-lg border-white/30',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-xl transition-all duration-300',
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
