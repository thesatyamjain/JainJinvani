import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";

export const JapMalaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  // Exit
  const exitOpacity = interpolate(frame, [125, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mala counter animation (0 to 108)
  const currentCount = Math.floor(
    interpolate(frame, [25, 120], [1, 108], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Bead angle rotation
  const beadAngle = interpolate(frame, [25, 120], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Left Column: Typography & Details */}
      <div
        style={{
          width: 820,
          transform: `translateX(${interpolate(enterSpring, [0, 1], [-80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <HeaderBadge
          icon="📿"
          category="Daily Sadhana"
          text="१०८ डिजिटल जाप माला"
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
          ध्यान व एकाग्रता का <br />
          <span
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            डिजिटल मनका
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
          नवकार महामंत्र, ॐ ह्रीं अर्हं एवं णमो जिणाणं मंत्रों की निर्विघ्न साधना। स्पर्श-आधारित
          मनका, ध्वनि व हैप्टिक कंपन फीडबैक, और प्रतिदिन जाप लक्ष्य निर्धारण।
        </p>

        {/* Feature Highlights Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "पवित्र महामंत्र चयन",
              desc: "नवकार, णमोकार, ॐ ह्रीं अर्हं णमो सिद्धाणं, णमो अरिहंताणं",
            },
            {
              title: "पूर्ण जाप माला ट्रैकिंग",
              desc: "१, ३, ५, ११, २१ अथवा १०८ माला का दैनिक संकल्प व प्रगति",
            },
            {
              title: "पवित्र ध्वनि व कंपन संकेत",
              desc: "प्रत्येक मनके पर सौम्य घंटी एवं १०८ पूर्ण होने पर मंगल शंखनाद",
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
                  transform: `translateX(${interpolate(itemSpring, [0, 1], [-30, 0])}px)`,
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

      {/* Right Column: Visual Interactive Mala Showcase Card */}
      <div
        style={{
          width: 600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${interpolate(enterSpring, [0, 1], [80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <div
          style={{
            position: "relative",
            width: 480,
            height: 580,
            borderRadius: 36,
            background:
              "linear-gradient(160deg, rgba(30, 58, 138, 0.25) 0%, rgba(5, 10, 20, 0.85) 100%)",
            border: "1.5px solid rgba(245, 158, 11, 0.35)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
            backdropFilter: "blur(24px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 32px",
            boxSizing: "border-box",
          }}
        >
          {/* Top Mantra Header */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#f59e0b",
                fontWeight: 600,
              }}
            >
              Selected Mantra
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#ffffff",
                fontFamily: "'Rozha One', serif",
                marginTop: 6,
              }}
            >
              णमोकार महामंत्र
            </div>
          </div>

          {/* Center Circular Beads Ring */}
          <div
            style={{
              position: "relative",
              width: 280,
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer Bead Ring Guide */}
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                border: "2px dashed rgba(245, 158, 11, 0.3)",
              }}
            />

            {/* Individual Beads around circle */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
              const radius = 125;
              const bx = 140 + radius * Math.cos(angle) - 7;
              const by = 140 + radius * Math.sin(angle) - 7;
              const isPassed = (i / 24) * 108 <= currentCount;

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: bx,
                    top: by,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: isPassed ? "#f59e0b" : "rgba(255,255,255,0.15)",
                    border: `1.5px solid ${isPassed ? "#fbbf24" : "rgba(255,255,255,0.3)"}`,
                    boxShadow: isPassed ? "0 0 10px rgba(245, 158, 11, 0.8)" : "none",
                  }}
                />
              );
            })}

            {/* Orbiting Active Bead Indicator */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: `rotate(${beadAngle}deg)`,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 20px #fbbf24, 0 0 40px #f59e0b",
                  border: "2px solid #f59e0b",
                }}
              />
            </div>

            {/* Center Digital Counter Readout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 78,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  fontFamily: "'Cinzel', monospace, sans-serif",
                  letterSpacing: "-0.04em",
                  textShadow: "0 0 30px rgba(245, 158, 11, 0.5)",
                }}
              >
                {currentCount}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#94a3b8",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 6,
                  fontFamily: "'Gotu', sans-serif",
                }}
              >
                लक्ष्य: १०८ मनके
              </div>
            </div>
          </div>

          {/* Bottom Navkar Verse Banner */}
          <div
            style={{
              padding: "10px 20px",
              borderRadius: 16,
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#fef3c7",
              fontSize: 15,
              fontWeight: 500,
              fontFamily: "'Gotu', sans-serif",
              textAlign: "center",
            }}
          >
            ॐ नमो अरिहंताणं • नमो सिद्धाणं
          </div>
        </div>
      </div>
    </div>
  );
};
