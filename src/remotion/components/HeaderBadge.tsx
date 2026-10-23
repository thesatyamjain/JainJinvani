import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface HeaderBadgeProps {
  icon?: string;
  text: string;
  category?: string;
  delay?: number;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  icon = "✦",
  text,
  category,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 20px",
        borderRadius: 9999,
        background: "rgba(245, 158, 11, 0.08)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 24px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transform: `scale(${Math.max(0, scale)})`,
        opacity: Math.max(0, Math.min(1, opacity)),
      }}
    >
      <span
        style={{
          color: "#f59e0b",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {icon}
      </span>
      {category && (
        <span
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          {category} •
        </span>
      )}
      <span
        style={{
          fontSize: 15,
          letterSpacing: "0.08em",
          color: "#fef3c7",
          fontWeight: 600,
          fontFamily: "'Gotu', 'Noto Sans Devanagari', sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
};
