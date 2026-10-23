import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BackgroundGlow } from "./components/BackgroundGlow";
import { FloatingParticles } from "./components/FloatingParticles";
import { IntroScene } from "./scenes/IntroScene";
import { JapMalaScene } from "./scenes/JapMalaScene";
import { SamayikScene } from "./scenes/SamayikScene";
import { ShastraScene } from "./scenes/ShastraScene";
import { PanchangTirthankarScene } from "./scenes/PanchangTirthankarScene";
import { VidhanPujaScene } from "./scenes/VidhanPujaScene";
import { OutroScene } from "./scenes/OutroScene";
import { LaunchVideoProps } from "./types";

export const LaunchVideo: React.FC<LaunchVideoProps> = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050a14",
        fontFamily: "'Gotu', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Persistent Cinematic Background & Divine Starlight Atmosphere */}
      <BackgroundGlow glowColor="#f59e0b" secondaryGlow="#1e3a8a" />
      <FloatingParticles count={40} />

      {/* Scene 1: Divine Genesis & Title Reveal */}
      <Sequence from={0} durationInFrames={150}>
        <IntroScene />
      </Sequence>

      {/* Scene 2: Daily Sadhana - 108 Digital Jap Mala */}
      <Sequence from={150} durationInFrames={150}>
        <JapMalaScene />
      </Sequence>

      {/* Scene 3: Equanimity Meditation - 48-Minute Samayik */}
      <Sequence from={300} durationInFrames={150}>
        <SamayikScene />
      </Sequence>

      {/* Scene 4: Eternal Agamas & Scripture Library */}
      <Sequence from={450} durationInFrames={150}>
        <ShastraScene />
      </Sequence>

      {/* Scene 5: 24 Tirthankar Darshan & Jain Panchang */}
      <Sequence from={600} durationInFrames={150}>
        <PanchangTirthankarScene />
      </Sequence>

      {/* Scene 6: 64 Mahamandal Vidhans & Daily Puja Flow */}
      <Sequence from={750} durationInFrames={150}>
        <VidhanPujaScene />
      </Sequence>

      {/* Scene 7: Grand Finale & Launch Announcement */}
      <Sequence from={900} durationInFrames={180}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
