import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface Particle {
  id: number;
  x: number;
  yInit: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 35 }) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 97) % 1920,
      yInit: (i * 131) % 1080,
      size: 2 + ((i * 3) % 4),
      speed: 0.35 + ((i % 5) * 0.15),
      opacity: 0.2 + ((i % 6) * 0.12),
      delay: (i * 17) % 60,
    }));
  }, [count]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {particles.map((p) => {
        const adjustedFrame = Math.max(0, frame - p.delay);
        const yOffset = (adjustedFrame * p.speed * 2) % 1200;
        const currentY = (p.yInit - yOffset + 1200) % 1200;
        const floatX = Math.sin((frame + p.id * 10) / 25) * 12;

        const pulseOpacity = interpolate(
          Math.sin((frame + p.id * 20) / 15),
          [-1, 1],
          [p.opacity * 0.6, p.opacity * 1.3]
        );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x + floatX,
              top: currentY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.id % 2 === 0 ? "#f59e0b" : "#fbbf24",
              opacity: pulseOpacity,
              boxShadow: `0 0 ${p.size * 3}px rgba(245, 158, 11, 0.8)`,
            }}
          />
        );
      })}
    </div>
  );
};
