# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-10-04

### Added
- **Automated Semantic Versioning:** GitHub Actions release workflow now automatically calculates and increments the next semantic patch version upon triggering.
- **Categorized Release Notes:** Added `.github/release.yml` for automated grouping of changes into Features, Fixes, Design, and Performance.

### Changed
- **Unified App Name:** Aligned launcher display name to **"जिनवाणी"** across Web App, PWA manifest (`short_name`), iOS Safari meta, and Android APK manifest (`android:label`).
- **Balanced Adaptive Icon:** Optimized Android adaptive launcher icon foreground scale factor from 0.68 to 0.50 (and legacy icon to 0.72) ensuring comfortable safe-zone padding and preventing border clipping.

### Fixed
- **Android Desugaring:** Enabled Java 8+ Core Library Desugaring (`desugar_jdk_libs:2.1.4`) and MultiDex in `build.gradle.kts` to resolve build failures with the `ota_update` dependency.

---

## [1.0.1] - 2026-10-01

### Added
- **In-App OTA Auto-Updater:** Seamless update service checking GitHub Releases silently on app launch with progress dialog and 1-click install.
- **Multi-ABI APK Artifacts:** Added split APK builds producing lightweight dedicated `arm64-v8a` (~35MB) and `universal` fallback APKs.
- **AudioPlayer Accessibility:** Added explicit `aria-label` attributes to icon-only playback buttons for improved screen reader support.

### Changed
- **Release Automation:** Streamlined GitHub Actions pipeline with automated asset renaming and release publication.

### Fixed
- **Mobile Card Taps:** Fixed touch event propagation bug in `GlassCard.tsx` where touch event handlers were inadvertently stripped on touch screens.
- **WebView Startup Hang:** Resolved white/blank loading screen by implementing a dedicated local HTTP asset server, network security config, and 3.5s safety watchdog timer.
- **R8 ProGuard Minification:** Disabled aggressive minification on webview bridge and added required `-dontwarn` rules for third-party Flutter plugins.

### Performance
- **Asset Size Optimization:** Stripped redundant duplicate asset copies from the mobile asset tree, reducing bundle footprint by over 50MB.
- **CI Build Speed:** Configured Gradle caching and skipped redundant web re-builds in CI, reducing build times by ~60%.

---

## [1.0.0] - 2026-09-30

### Added
- **Offline Mobile Shell:** Flutter-powered native Android application hosting the offline-first Jain Jinvani experience.
- **Local Asset Server:** Embedded lightweight HTTP server delivering local HTML, CSS, JavaScript, and media directly from device storage.
- **Native Android Polish:** Implemented double-back-to-exit toast confirmation, edge-to-edge transparent system navigation, and dark boot theme.
- **Adaptive App Icons:** High-resolution vector-derived app icons and adaptive icons for modern Android and iOS devices.

---

## [0.1.0] - 2026-01-25

### Added
- **Initial Release:** Complete Jain Jinvani digital scripture collection.
- **Digital Library:** Categorized Jain texts, stotras (Bhaktamar, Namokar), pujas, aratis, chalisas, and prathana.
- **Sadhana & Panchang:** Daily spiritual practice routines, Tirthankara histories, and Jain festival calendar.
- **Cosmic Dark Theme:** Specially designed reading interface for sustained reading comfort.

[1.0.2]: https://github.com/thesatyamjain/jainjinvani/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/thesatyamjain/jainjinvani/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/thesatyamjain/jainjinvani/releases/tag/v1.0.0
[0.1.0]: https://github.com/thesatyamjain/jainjinvani/releases/tag/v0.1.0
