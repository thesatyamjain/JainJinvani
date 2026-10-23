import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface BackgroundGlowProps {
  glowColor?: string;
  secondaryGlow?: string;
}

export const BackgroundGlow: React.FC<BackgroundGlowProps> = ({
  glowColor = "#f59e0b",
  secondaryGlow = "#1e3a8a",
}) => {
  const frame = useCurrentFrame();

  const pulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.85, 1.15]);
  const rotateOrb = interpolate(frame, [0, 1080], [0, 360]);
  const shiftX = interpolate(Math.sin(frame / 45), [-1, 1], [-40, 40]);
  const shiftY = interpolate(Math.cos(frame / 35), [-1, 1], [-30, 30]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#050a14",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Subtle sacred geometric background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(245, 158, 11, 0.08) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 16px 16px",
          backgroundPosition: "0 0, 8px 8px",
          opacity: 0.6,
        }}
      />

      {/* Main central divine aura */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 900,
          height: 900,
          transform: `translate(-50%, -50%) translate(${shiftX}px, ${shiftY}px) scale(${pulse})`,
          background: `radial-gradient(circle, ${glowColor}1f 0%, ${secondaryGlow}15 45%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top right ambient corner glow */}
      <div
        style={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 650,
          height: 650,
          background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom left blue nebula */}
      <div
        style={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${secondaryGlow}28 0%, transparent 70%)`,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Subtle rotating sacred aura beam */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1400,
          height: 1400,
          transform: `translate(-50%, -50%) rotate(${rotateOrb}deg)`,
          background:
            "conic-gradient(from 0deg at 50% 50%, rgba(245,158,11,0.03) 0deg, transparent 60deg, rgba(30,58,138,0.03) 120deg, transparent 180deg, rgba(245,158,11,0.03) 240deg, transparent 300deg, rgba(245,158,11,0.03) 360deg)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
