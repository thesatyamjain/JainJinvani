import React from "react";
import { Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animations
  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const titleSpring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 16, stiffness: 95 },
  });

  const taglineSpring = spring({
    frame: frame - 38,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const pillsSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  // Scene exit fade
  const exitOpacity = interpolate(frame, [125, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Halo rotation & pulse
  const haloRotate = interpolate(frame, [0, 150], [0, 180]);
  const haloScale = interpolate(Math.sin(frame / 15), [-1, 1], [0.95, 1.08]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        opacity: exitOpacity,
      }}
    >
      {/* Sacred Temple Bell chime audio */}
      <Audio src={staticFile("audio/temple_bell.mp3")} startFrom={0} volume={0.8} />

      {/* Top Launch Pill */}
      <div style={{ marginBottom: 36 }}>
        <HeaderBadge
          icon="✨"
          category="Official Launch"
          text="जिनेन्द्र भगवान की शाश्वत अमृतवाणी"
          delay={10}
        />
      </div>

      {/* Central Radiant Emblem Container */}
      <div
        style={{
          position: "relative",
          width: 220,
          height: 220,
          marginBottom: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Divine Rotating Aura Ring */}
        <div
          style={{
            position: "absolute",
            inset: -35,
            borderRadius: "50%",
            background:
              "conic-gradient(from 0deg, rgba(245, 158, 11, 0.5) 0%, transparent 40%, rgba(251, 191, 36, 0.7) 70%, transparent 100%)",
            transform: `rotate(${haloRotate}deg) scale(${haloScale})`,
            filter: "blur(18px)",
          }}
        />

        {/* Concentric Golden Halo circles */}
        <div
          style={{
            position: "absolute",
            inset: -12,
            borderRadius: "50%",
            border: "1.5px dashed rgba(245, 158, 11, 0.4)",
            transform: `rotate(-${haloRotate * 0.5}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: -24,
            borderRadius: "50%",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        />

        {/* Glass pedestal for Logo */}
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(5,10,20,0.85) 90%)",
            border: "2px solid rgba(245, 158, 11, 0.5)",
            boxShadow: "0 0 50px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(245, 158, 11, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(16px)",
            transform: `scale(${Math.max(0, logoScale)})`,
          }}
        >
          <Img
            src={staticFile("logo.webp")}
            style={{
              width: 140,
              height: 140,
              objectFit: "contain",
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
            }}
          />
        </div>
      </div>

      {/* Main Title: Rozha One / Serif Display */}
      <div
        style={{
          transform: `scale(${Math.max(0, titleSpring)}) translateY(${interpolate(
            titleSpring,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: Math.max(0, Math.min(1, titleSpring)),
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            fontFamily: "'Rozha One', 'Cinzel', serif",
            background: "linear-gradient(135deg, #ffffff 0%, #fef3c7 40%, #fbbf24 75%, #d97706 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 10px 30px rgba(245, 158, 11, 0.4))",
          }}
        >
          जैन जिनवाणी
        </h1>
      </div>

      {/* English subtitle */}
      <div
        style={{
          transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
          opacity: Math.max(0, Math.min(1, taglineSpring)),
          marginTop: 14,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#cbd5e1",
            fontFamily: "'Gotu', sans-serif",
          }}
        >
          Authentic Digital Encyclopedia & Daily Sadhana Companion
        </p>
      </div>

      {/* Feature Pills Footer */}
      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 48,
          transform: `translateY(${interpolate(pillsSpring, [0, 1], [30, 0])}px)`,
          opacity: Math.max(0, Math.min(1, pillsSpring)),
        }}
      >
        {[
          { icon: "📖", text: "शाश्वत आगम व सिद्धांत" },
          { icon: "📿", text: "१०८ डिजिटल जाप माला" },
          { icon: "⏱️", text: "४८ मिनट सामायिक टाइमर" },
          { icon: "📜", text: "६४ महामंडल विधान" },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 100,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(12px)",
              color: "#e2e8f0",
              fontSize: 16,
              fontWeight: 500,
              fontFamily: "'Gotu', sans-serif",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
