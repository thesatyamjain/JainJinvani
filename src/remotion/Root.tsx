import React from "react";
import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";
import { LaunchVideoProps } from "./types";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={1080}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: "जैन जिनवाणी",
          tagline: "जिनेन्द्र भगवान की शाश्वत अमृतवाणी",
          websiteUrl: "https://jainjinvani.org",
        } satisfies LaunchVideoProps}
      />
    </>
  );
};
