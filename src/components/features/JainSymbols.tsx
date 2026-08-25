import React from 'react';

export const SwastikaSymbol = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Center Cross */}
    <path d="M50 16 V84 M16 50 H84" />
    {/* Arms */}
    <path d="M50 16 H84 M84 50 V84 M50 84 H16 M16 50 V16" />
    {/* 4 Dots representing 4 Gatis */}
    <circle cx="34" cy="34" r="4.5" fill={color} stroke="none" />
    <circle cx="66" cy="34" r="4.5" fill={color} stroke="none" />
    <circle cx="66" cy="66" r="4.5" fill={color} stroke="none" />
    <circle cx="34" cy="66" r="4.5" fill={color} stroke="none" />
  </svg>
);

export const AhimsaHandSymbol = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Palm and Fingers */}
    <path d="M32 90 V52 M32 52 L27 38 L32 22 L42 16 L49 12 L56 16 L66 22 L72 38 L72 52 L68 90 Z" />
    <path d="M32 52 L32 38 L35 22" />
    <path d="M43 46 L43 18" />
    <path d="M54 46 L54 18" />
    <path d="M64 52 L64 24" />

    {/* Dharmachakra in Palm */}
    <circle cx="49" cy="64" r="11" strokeWidth="2.5" />
    <circle cx="49" cy="64" r="3" fill={color} stroke="none" />
    <path d="M49 53 V75 M38 64 H60 M41 56 L57 72 M57 56 L41 72" strokeWidth="1.2" />

    {/* Bottom Base Arc */}
    <path d="M42 86 Q49 91 56 86" strokeWidth="2" />
  </svg>
);

export const JainPrateekSymbol = ({ className = "w-10 h-10", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 120 160"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer Universe Outline (Loka Akara) */}
    <path
      d="M 30 145 H 90 Q 105 145 100 115 Q 95 85 105 55 Q 110 30 95 25 L 60 20 L 25 25 Q 10 30 15 55 Q 25 85 20 115 Q 15 145 30 145 Z"
      strokeWidth="2.5"
      opacity="0.5"
    />

    {/* Siddhashila Arc & Dot at Top */}
    <path d="M 40 32 Q 60 22 80 32" strokeWidth="3" />
    <circle cx="60" cy="27" r="3.5" fill={color} stroke="none" />

    {/* 3 Jewels (Ratnatraya Dots) */}
    <circle cx="46" cy="42" r="3.5" fill={color} stroke="none" />
    <circle cx="60" cy="39" r="3.5" fill={color} stroke="none" />
    <circle cx="74" cy="42" r="3.5" fill={color} stroke="none" />

    {/* Swastika in Middle */}
    <g transform="translate(60, 72) scale(0.38) translate(-50, -50)">
      <path d="M50 16 V84 M16 50 H84 M50 16 H84 M84 50 V84 M50 84 H16 M16 50 V16" strokeWidth="8" />
      <circle cx="34" cy="34" r="5" fill={color} stroke="none" />
      <circle cx="66" cy="34" r="5" fill={color} stroke="none" />
      <circle cx="66" cy="66" r="5" fill={color} stroke="none" />
      <circle cx="34" cy="66" r="5" fill={color} stroke="none" />
    </g>

    {/* Ahimsa Hand at Bottom */}
    <g transform="translate(60, 116) scale(0.35) translate(-49, -60)">
      <path d="M32 90 V52 L27 38 L32 22 L42 16 L49 12 L56 16 L66 22 L72 38 L72 52 L68 90 Z" strokeWidth="5" />
      <circle cx="49" cy="60" r="14" strokeWidth="3.5" />
      <circle cx="49" cy="60" r="4" fill={color} stroke="none" />
      <path d="M49 46 V74 M35 60 H63 M39 50 L59 70 M59 50 L39 70" strokeWidth="2" />
    </g>
  </svg>
);

export const LotusSymbol = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    stroke={color}
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Center Petal */}
    <path d="M50 15 C42 35 40 55 50 80 C60 55 58 35 50 15 Z" fill={color} fillOpacity="0.15" />
    {/* Left Petal */}
    <path d="M50 80 C30 75 15 50 25 30 C35 45 42 65 50 80 Z" fill={color} fillOpacity="0.1" />
    {/* Right Petal */}
    <path d="M50 80 C70 75 85 50 75 30 C65 45 58 65 50 80 Z" fill={color} fillOpacity="0.1" />
    {/* Outer Wings */}
    <path d="M50 80 C18 78 8 60 14 48 C24 60 38 72 50 80 Z" />
    <path d="M50 80 C82 78 92 60 86 48 C76 60 62 72 50 80 Z" />
    {/* Base Calyx */}
    <path d="M35 84 Q50 92 65 84" strokeWidth="4" />
  </svg>
);

export const HrimSymbol = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill={color}>
    <text x="50" y="70" textAnchor="middle" fontSize="56" fontFamily="'Rozha One', 'Gotu', serif" fontWeight="bold">ह्रीं</text>
    <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.4" />
  </svg>
);

export const OmSymbol = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill={color}>
    <text x="50" y="72" textAnchor="middle" fontSize="62" fontFamily="'Rozha One', 'Gotu', serif" fontWeight="bold">ॐ</text>
    <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.4" />
  </svg>
);
