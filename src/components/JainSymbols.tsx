import React from 'react';

export const SwastikaSymbol = ({ className = "", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className}
    fill="none" 
    stroke={color} 
    strokeWidth="8" 
    strokeLinecap="round"
  >
    {/* Center Cross */}
    <path d="M50 20 V80 M20 50 H80" />
    {/* Arms */}
    <path d="M50 20 H80 M80 50 V80 M50 80 H20 M20 50 V20" />
    {/* Dots */}
    <circle cx="35" cy="35" r="4" fill={color} stroke="none" />
    <circle cx="65" cy="35" r="4" fill={color} stroke="none" />
    <circle cx="65" cy="65" r="4" fill={color} stroke="none" />
    <circle cx="35" cy="65" r="4" fill={color} stroke="none" />
  </svg>
);

export const AhimsaHandSymbol = ({ className = "", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className}
    fill="none" 
    stroke={color} 
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Hand Outline */}
    <path d="M35 90 V55 M35 55 L30 40 L35 25 L45 20 L50 15 L55 20 L65 25 L70 40 L70 55 L65 90 Z" />
    <path d="M35 55 L35 40 L38 25" /> 
    <path d="M45 50 L45 20" />
    <path d="M55 50 L55 20" />
    <path d="M65 55 L65 25" />
    
    {/* Wheel (Chakra) in palm */}
    <circle cx="50" cy="65" r="10" strokeWidth="3" />
    <path d="M50 55 V75 M40 65 H60 M43 58 L57 72 M57 58 L43 72" strokeWidth="1.5" />
    
    {/* Text 'Ahimsa' usually goes here, represented by a small curve */}
    <path d="M45 85 Q50 90 55 85" strokeWidth="2" />
  </svg>
);

export const HrimSymbol = ({ className = "", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill={color}
  >
    {/* Stylized representation of Hrim (using text for accuracy) */}
    <text x="50" y="70" textAnchor="middle" fontSize="60" fontFamily="serif" fontWeight="bold">ह्रीं</text>
    {/* Decorative circle */}
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);

export const OmSymbol = ({ className = "", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill={color}
  >
    <text x="50" y="70" textAnchor="middle" fontSize="60" fontFamily="serif" fontWeight="bold">ॐ</text>
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);
