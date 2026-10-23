import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

interface PhoneMockupProps {
  imageSrc: string;
  delay?: number;
  tiltAngle?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  imageSrc,
  delay = 0,
  tiltAngle = -6,
  width = 380,
  height = 760,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const floatY = interpolate(Math.sin((frame + delay * 5) / 25), [-1, 1], [-8, 8]);
  const currentTilt = interpolate(Math.cos((frame + delay * 5) / 30), [-1, 1], [tiltAngle - 1.5, tiltAngle + 1.5]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `perspective(1000px) rotateY(${currentTilt}deg) rotateX(4deg) translateY(${floatY}px) scale(${entrance})`,
        opacity: Math.max(0, Math.min(1, entrance)),
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Outer ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
          borderRadius: 60,
          zIndex: -1,
        }}
      />

      {/* Titanium / Glass Phone chassis */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 48,
          padding: 12,
          background: "linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.15)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Island / Speaker notch */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 24,
            borderRadius: 20,
            backgroundColor: "#050a14",
            zIndex: 10,
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        />

        {/* Display Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 38,
            overflow: "hidden",
            backgroundColor: "#050a14",
            position: "relative",
          }}
        >
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />

          {/* Glass specular glare overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
