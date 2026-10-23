import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeaderBadge } from "../components/HeaderBadge";

export const PanchangTirthankarScene: React.FC = () => {
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

  const card1Spring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const card2Spring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15, stiffness: 85 },
  });

  const float1 = interpolate(Math.sin(frame / 22), [-1, 1], [-6, 6]);
  const float2 = interpolate(Math.cos(frame / 26), [-1, 1], [-8, 8]);

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
      {/* Left Column: Two overlapping graphic showcase cards */}
      <div
        style={{
          width: 620,
          position: "relative",
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Card 1: Panchang (Behind) */}
        <div
          style={{
            position: "absolute",
            width: 440,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(30, 58, 138, 0.4)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            transform: `perspective(1000px) rotateY(-10deg) rotateZ(-3deg) translate(-50px, ${float1}px) scale(${card1Spring})`,
            opacity: Math.max(0, Math.min(1, card1Spring)),
            backgroundColor: "#050a14",
            zIndex: 1,
          }}
        >
          <Img
            src={staticFile("og-panchang.png")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Card 2: 24 Tirthankar (In Front) */}
        <div
          style={{
            position: "absolute",
            width: 460,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.9), 0 0 50px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            border: "2px solid rgba(245, 158, 11, 0.45)",
            transform: `perspective(1000px) rotateY(6deg) rotateZ(2deg) translate(50px, ${float2}px) scale(${card2Spring})`,
            opacity: Math.max(0, Math.min(1, card2Spring)),
            backgroundColor: "#050a14",
            zIndex: 2,
          }}
        >
          <Img
            src={staticFile("og-tirthankar.png")}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* Right Column: Typography */}
      <div
        style={{
          width: 820,
          transform: `translateX(${interpolate(enterSpring, [0, 1], [80, 0])}px)`,
          opacity: Math.max(0, Math.min(1, enterSpring)),
        }}
      >
        <HeaderBadge
          icon="👑"
          category="Heritage & Almanac"
          text="२४ तीर्थंकर एवं जैन पंचांग"
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
          तीर्थंकर दर्शन व <br />
          <span
            style={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 60%, #d97706 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            नित्य पंचांग निर्णय
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
          भगवान आदिनाथ से भगवान महावीर स्वामी तक २४ तीर्थंकरों के पाँचों कल्याणक, लांछन व पावन
          निर्वाण स्थल। सटीक जैन पंचांग अनुसार अष्टमी, चतुर्दशी, दशलक्षण पर्व व दैनिक व्रत
          मार्गदर्शन।
        </p>

        {/* Highlight points */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              title: "२४ तीर्थंकर संपूर्ण जीवन चरित्र",
              desc: "गर्भ, जन्म, तप/दीक्षा, केवलज्ञान व मोक्ष कल्याणक तिथियाँ एवं निर्वाण क्षेत्र",
            },
            {
              title: "सटीक जैन पंचांग व सूर्योदय गणना",
              desc: "दैनिक तिथि, करण, नक्षत्र, चंद्रोदय, नवकारशी व चौविहार समय",
            },
            {
              title: "व्रत, पर्व व नियम रिमाइंडर्स",
              desc: "अष्टमी-चतुर्दशी उपवास, रोहिणी व्रत, दशलक्षण महापर्व व अष्टाह्निका पर्व",
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
