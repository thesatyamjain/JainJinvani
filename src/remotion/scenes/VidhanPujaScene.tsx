import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";

export const VidhanPujaScene: React.FC = () => {
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

  const cardFloat = interpolate(Math.sin(frame / 20), [-1, 1], [-8, 8]);
  const cardRotate = interpolate(Math.cos(frame / 24), [-1, 1], [-2.5, 2.5]);

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
      {/* Left Column: Typography */}
      <div
        style={{
          width: 820,
          transform: `translateX(${interpolate(enterSpring, [0, 1], [-80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <HeaderBadge
          icon="🌸"
          category="Sacred Rituals"
          text="६४ महामंडल विधान व नित्य पूजन"
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
          भक्ति, विधान व <br />
          <span
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            अष्टद्रव्य पूजन संग्रह
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
          श्री सिद्धचक्र, भक्तामर, कल्याणमंदिर एवं दशलक्षण महापर्व मण्डल विधान। मंदिर जी एवं गृह
          चैत्यालय हेतु अष्टद्रव्य पूजन (जल, चन्दन, अक्षत, पुष्प, नैवेद्य, दीप, धूप, फल, अर्घ्य) का
          क्रमबद्ध प्रवाह।
        </p>

        {/* Highlights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "६४ प्रमुख महामंडल विधान",
              desc: "सिद्धचक्र, भक्तामर, कल्पतरु, शांति विधान, इन्द्रध्वज व २४ तीर्थंकर विधान",
            },
            {
              title: "नित्य अष्टद्रव्य पूजन प्रवाह",
              desc: "देव-शास्त्र-गुरु, पंचपरमेष्ठी, नवदेवता व तीर्थंकर अर्घ्य समर्पण विधि",
            },
            {
              title: "श्री भक्तामर स्तोत्र संपूर्ण संकलन",
              desc: "४८ संस्कृत काव्य, प्रामाणिक अन्वयार्थ, हिन्दी पद्यानुवाद व ऑडियो संकीर्तन",
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

      {/* Right Column: Visual Artwork Showcase */}
      <div
        style={{
          width: 620,
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
            width: 580,
            borderRadius: 32,
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.85), 0 0 50px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid rgba(245, 158, 11, 0.4)",
            transform: `perspective(1000px) rotateY(${cardRotate}deg) translateY(${cardFloat}px)`,
            backdropFilter: "blur(20px)",
            backgroundColor: "#050a14",
          }}
        >
          <Img
            src={staticFile("og-puja.png")}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          {/* Floating Sacred Mantra Banner */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              right: 24,
              padding: "16px 24px",
              borderRadius: 20,
              background: "rgba(5, 10, 20, 0.85)",
              border: "1.5px solid rgba(245, 158, 11, 0.5)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fef3c7",
                  fontFamily: "'Rozha One', serif",
                }}
              >
                जल चन्दन अक्षत कुसुम...
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                अष्टद्रव्य पूजन • देव शास्त्र गुरु अर्घ्य
              </div>
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 9999,
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#f59e0b",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              नित्य पूजन
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
