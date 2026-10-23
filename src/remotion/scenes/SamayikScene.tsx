import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";

export const SamayikScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const exitOpacity = interpolate(frame, [125, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated countdown seconds calculation
  const progressRatio = interpolate(frame, [15, 125], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const remainingMinutes = 47;
  const remainingSeconds = Math.max(
    0,
    Math.floor(
      interpolate(frame, [15, 125], [59, 12], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  const dashOffset = 2 * Math.PI * 110 * (1 - progressRatio);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 120px",
        zIndex: 5,
        opacity: exitOpacity,
      }}
    >
      {/* Left Column: Visual Samayik Card / Timer Mockup */}
      <div
        style={{
          width: 580,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${interpolate(enterSpring, [0, 1], [-80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <div
          style={{
            position: "relative",
            width: 480,
            borderRadius: 36,
            background:
              "linear-gradient(160deg, rgba(30, 58, 138, 0.3) 0%, rgba(5, 10, 20, 0.9) 100%)",
            border: "1.5px solid rgba(245, 158, 11, 0.3)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
            backdropFilter: "blur(24px)",
            padding: "36px 32px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#f59e0b",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Equanimity Meditation
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "'Rozha One', serif",
              marginBottom: 28,
            }}
          >
            सामायिक साधना (२ घड़ी)
          </div>

          {/* Glowing Circular Timer */}
          <div
            style={{
              position: "relative",
              width: 260,
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="260" height="260" style={{ transform: "rotate(-90deg)" }}>
              {/* Background Track */}
              <circle
                cx="130"
                cy="130"
                r="110"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="none"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="130"
                cy="130"
                r="110"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))",
                }}
              />
            </svg>

            {/* Center Time Display */}
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#ffffff",
                  fontFamily: "'Cinzel', monospace, sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 0 20px rgba(245, 158, 11, 0.4)",
                }}
              >
                {remainingMinutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#fbbf24",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  marginTop: 4,
                  fontFamily: "'Gotu', sans-serif",
                }}
              >
                ४८ मिनट शेष
              </div>
            </div>
          </div>

          {/* Iryavahi Sutra Preview Glass Box */}
          <div
            style={{
              marginTop: 28,
              width: "100%",
              padding: "16px 20px",
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.5,
                color: "#e2e8f0",
                fontFamily: "'Gotu', sans-serif",
                fontWeight: 600,
              }}
            >
              "इच्छाकारेण संदिसह भगवन्! इच्छं इच्छामि खमासमणो..."
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
              इर्यावही व सामायिक दंडक पाठ
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Typography & Explanations */}
      <div
        style={{
          width: 820,
          transform: `translateX(${interpolate(enterSpring, [0, 1], [80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <HeaderBadge
          icon="⏱️"
          category="Equanimity Practice"
          text="४८ मिनट सामायिक साधना"
          delay={5}
        />

        <h2
          style={{
            margin: "24px 0 16px 0",
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontFamily: "'Rozha One', serif",
            color: "#ffffff",
            textShadow: "0 8px 30px rgba(0,0,0,0.7)",
          }}
        >
          समभाव और आत्म-चिंतन का <br />
          <span
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            पावन काल
          </span>
        </h2>

        <p
          style={{
            margin: "0 0 32px 0",
            fontSize: 22,
            lineHeight: 1.6,
            color: "#94a3b8",
            maxWidth: 720,
            fontFamily: "'Gotu', sans-serif",
          }}
        >
          राग और द्वेष से विरत होकर आत्मा में विश्राम। शास्त्र-सम्मत दो घड़ी (४८ मिनट) की सामायिक
          साधना हेतु विशेष ध्यान-टाइमर, शुद्ध पाठ एवं समय समाप्ति पर सौम्य मंगल शंख व घंटिका।
        </p>

        {/* Highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "इर्यावही पाठ व सामायिक सूत्र",
              desc: "साधना प्रारंभ करने से पूर्व कायोत्सर्ग एवं ईर्यासमिति दोष निवारण पाठ",
            },
            {
              title: "शांत वातावरण व विघ्न-रहित साधना",
              desc: "स्क्रीन ऑन लॉक, मूक साधना मोड और एकाग्र ध्यान वातावरण",
            },
            {
              title: "समय समाप्ति पर मंगल घंटिका",
              desc: "सामायिक पूर्ण होने पर सौम्य घंटी एवं पारणा पाठ का मार्गदर्शन",
            },
          ].map((item, idx) => {
            const itemSpring = spring({
              frame: frame - 25 - idx * 8,
              fps,
              config: { damping: 15 },
            });
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "14px 20px",
                  borderRadius: 18,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  transform: `translateX(${interpolate(itemSpring, [0, 1], [30, 0])}px)`,
                  opacity: Math.max(0, Math.min(1, itemSpring)),
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#f8fafc",
                      fontFamily: "'Gotu', sans-serif",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 15, color: "#64748b", marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
