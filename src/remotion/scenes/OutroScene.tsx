import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";
import { PhoneMockup } from "../components/PhoneMockup";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const desktopSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const phoneSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.96, 1.04]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 120px",
        zIndex: 5,
        boxSizing: "border-box",
      }}
    >
      {/* Top Launch Title & Badge */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transform: `translateY(${interpolate(enterSpring, [0, 1], [-40, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <HeaderBadge
          icon="🚀"
          category="Now Live Worldwide"
          text="जैन जिनवाणी डिजिटल ज्ञानकोश"
          delay={5}
        />

        <h2
          style={{
            margin: "20px 0 10px 0",
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontFamily: "'Rozha One', serif",
            color: "#ffffff",
            textShadow: "0 8px 30px rgba(0,0,0,0.8)",
          }}
        >
          अनुभव करें{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fef3c7 40%, #fbbf24 75%, #d97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            जिनेन्द्र वाणी का शाश्वत अमृत
          </span>
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 22,
            color: "#94a3b8",
            fontFamily: "'Gotu', sans-serif",
          }}
        >
          वेबसाइट, मोबाइल एवं टैबलेट पर किसी भी समय, कहीं भी उपलब्ध — पूर्णतः ऑफ़लाइन समर्थित
        </p>
      </div>

      {/* Center Device Stage: Desktop Display + Overlapping Mobile Frame */}
      <div
        style={{
          position: "relative",
          width: 1100,
          height: 480,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Desktop Browser Mockup (Behind) */}
        <div
          style={{
            position: "absolute",
            width: 820,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.9), 0 0 60px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            transform: `perspective(1200px) rotateX(4deg) translateY(-20px) scale(${desktopSpring})`,
            opacity: Math.max(0, Math.min(1, desktopSpring)),
            backgroundColor: "#050a14",
            zIndex: 1,
          }}
        >
          {/* Browser header bar */}
          <div
            style={{
              height: 38,
              background: "rgba(255, 255, 255, 0.08)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 8,
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
            <div
              style={{
                marginLeft: 16,
                padding: "3px 20px",
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.06)",
                fontSize: 12,
                color: "#94a3b8",
                fontFamily: "monospace",
              }}
            >
              https://jainjinvani.org
            </div>
          </div>
          <Img
            src={staticFile("screenshots/desktop-preview.png")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Mobile Phone Mockup (In front on the right) */}
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: -30,
            zIndex: 3,
            transform: `scale(${phoneSpring})`,
            opacity: Math.max(0, Math.min(1, phoneSpring)),
          }}
        >
          <PhoneMockup
            imageSrc="screenshots/mobile-preview.png"
            width={260}
            height={520}
            tiltAngle={-4}
          />
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          transform: `scale(${pulse})`,
        }}
      >
        <div
          style={{
            padding: "16px 42px",
            borderRadius: 9999,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            boxShadow: "0 10px 40px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            color: "#050a14",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.05em",
            fontFamily: "'Gotu', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>🌐</span>
          <span>jainjinvani.org</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {["⚡ PWA इंस्टॉल करें", "🛡️ १००% विज्ञापन-रहित", "🌸 निःशुल्क धर्म सेवा"].map(
            (tag, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 22px",
                  borderRadius: 9999,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(12px)",
                  color: "#e2e8f0",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Gotu', sans-serif",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
