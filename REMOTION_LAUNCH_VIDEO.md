# 🎬 जैन जिनवाणी • Remotion Launch Video

An authentic, cinematic, 1080p Full HD launch video composition for **जैन जिनवाणी (Jain Jinvani)** built with [Remotion](https://www.remotion.dev/).

---

## 📐 Video Architecture

- **Resolution**: 1920 × 1080 (Full HD, 16:9 Widescreen)
- **Frame Rate**: 30 FPS
- **Total Duration**: 1080 Frames (36.0 Seconds)
- **Audio Sync**: Sacred Temple Bell chime (`public/audio/temple_bell.mp3`)
- **Visual Design**: Cosmic Void (`#050a14`), Divine Amber (`#f59e0b`), Nebula Blue (`#1e3a8a`), and Rozha One serif typography.

---

## 🎞️ Scene Breakdown

| Scene | Duration | Frames | Title | Highlights |
|---|---|---|---|---|
| **Scene 1** | 5.0s | 0 – 150 | **Divine Awakening (आमुख)** | Rotating golden aura halo, official logo emblem, temple bell sound, and Devanagari title reveal. |
| **Scene 2** | 5.0s | 150 – 300 | **108 Digital Jap Mala (जाप माला)** | Interactive rosary ring counting 1 to 108 with orbiting radiant bead, Navkar Mahamantra, and haptic indicators. |
| **Scene 3** | 5.0s | 300 – 450 | **48-Min Samayik (सामायिक साधना)** | Circular SVG countdown timer ring, serene equanimity ambiance, and Iryavahi Sutra excerpt. |
| **Scene 4** | 5.0s | 450 – 600 | **Sacred Scriptures (आगम ग्रंथालय)** | Tattvartha Sutra, Samayasara, Chhahdhala, 3D scripture presentation, and *"परस्परोपग्रहो जीवानाम्"* quote banner. |
| **Scene 5** | 5.0s | 600 – 750 | **24 Tirthankar & Panchang (पंचांग)** | Dual-card parallax depth featuring 24 Tirthankar Kalyanaks and Jain Panchang tithi/parva calculations. |
| **Scene 6** | 5.0s | 750 – 900 | **64 Vidhans & Daily Puja (पूजन प्रवाह)** | Asthadravya puja flow, Siddhachakra/Bhaktamar Mahamandal Vidhans, and sacred offerings. |
| **Scene 7** | 6.0s | 900 – 1080 | **Grand Launch Finale (लोकार्पण)** | Synchronized 3D Desktop & Mobile mockups, offline PWA badges, and `jainjinvani.org` CTA. |

---

## 🚀 How to Run & Preview

### 1. In-App Interactive Player
Open the web application and navigate to:
- `http://localhost:5173/#/launch-video`
- Or via the navigation bar: **अधिक (More)** ➔ **लॉन्च वीडियो**

The in-app player includes:
- Live 60 FPS Canvas rendering using `@remotion/player`
- Interactive chapter seek bar to jump directly to any of the 7 scenes
- Video specs and technical details

### 2. Remotion Studio (Browser GUI)
To open the real-time timeline editor:
```bash
npm run video:preview
```

### 3. Render High-Quality MP4 Video
To render the final MP4 video file:
```bash
npm run video:render
```
*Output file: `out/launch-video.mp4`*
