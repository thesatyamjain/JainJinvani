import React, { useEffect, useRef, useState } from 'react';
import { getSettings, type UserSettings } from '../../lib';

interface IncenseParticle {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  phase: number;
  swaySpeed: number;
  speedY: number;
  swayAmplitude: number;
  color: 'gold' | 'amber' | 'warmWhite';
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  phase: number;
  twinkleSpeed: number;
  speed: number;
  color: 'gold' | 'blue' | 'white';
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
}

interface SpaceBackgroundProps {
  theme?: 'sanctum' | 'cosmic';
}

export const SpaceBackground = React.memo(({ theme: propTheme }: SpaceBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTheme, setCurrentTheme] = useState<'sanctum' | 'cosmic'>(() => {
    return propTheme || getSettings().backgroundTheme || 'sanctum';
  });

  // Sync if prop changes
  useEffect(() => {
    if (propTheme) {
      setCurrentTheme(propTheme);
    }
  }, [propTheme]);

  // Listen to live settings changes dispatched by updateSettings
  useEffect(() => {
    const handleSettingsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserSettings>;
      if (customEvent.detail?.backgroundTheme) {
        setCurrentTheme(customEvent.detail.backgroundTheme);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'jain_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.backgroundTheme) {
            setCurrentTheme(parsed.backgroundTheme);
          }
        } catch {}
      }
    };

    window.addEventListener('jain_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('jain_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Main Canvas Rendering Loop (switches cleanly between sanctum and cosmic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // --- Sanctum Theme State ---
    let incenseParticles: IncenseParticle[] = [];
    const initSanctumParticles = () => {
      incenseParticles = [];
      const isMobile = canvas.width < 768;
      const numParticles = isMobile ? 14 : Math.min(40, Math.max(20, Math.floor((canvas.width * canvas.height) / 16000)));
      for (let i = 0; i < numParticles; i++) {
        const rand = Math.random();
        const color: 'gold' | 'amber' | 'warmWhite' =
          rand > 0.6 ? 'gold' : rand > 0.25 ? 'amber' : 'warmWhite';

        incenseParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.6 + 0.8,
          baseOpacity: Math.random() * 0.45 + 0.2,
          phase: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.7 + 0.4,
          speedY: Math.random() * 0.35 + 0.15,
          swayAmplitude: Math.random() * 0.8 + 0.3,
          color,
        });
      }
    };

    // --- Cosmic Space Theme State ---
    let stars: Star[] = [];
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 80,
      speed: 12,
      opacity: 0,
      angle: Math.PI / 4,
      active: false,
    };
    let lastShootingStarTime = Date.now();

    const initCosmicStars = () => {
      stars = [];
      const isMobile = canvas.width < 768;
      const numStars = isMobile ? 22 : Math.min(80, Math.max(35, Math.floor((canvas.width * canvas.height) / 8000)));
      for (let i = 0; i < numStars; i++) {
        const rand = Math.random();
        const color: 'gold' | 'blue' | 'white' =
          rand > 0.85 ? 'gold' : rand > 0.7 ? 'blue' : 'white';

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: color === 'gold' ? Math.random() * 1.6 + 0.8 : Math.random() * 1.2 + 0.4,
          baseOpacity: Math.random() * 0.5 + 0.25,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 1.8 + 1.2,
          speed: Math.random() * 0.04 + 0.015,
          color,
        });
      }
    };

    const triggerShootingStar = () => {
      shootingStar = {
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        length: Math.random() * 70 + 60,
        speed: Math.random() * 8 + 10,
        opacity: 0.85,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        active: true,
      };
    };

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // On mobile browsers, scrolling collapses the address bar by ~56px, which fires window 'resize'.
      // Resetting canvas.width/height clears the canvas bitmap and re-initializes all particles,
      // causing noticeable background flickering/flashing during scroll.
      // We only resize if the width changes (orientation flip) or if the height change is significant (> 120px).
      const widthChanged = Math.abs(newWidth - lastWidth) > 5;
      const heightChanged = Math.abs(newHeight - lastHeight) > 120;

      // Guard: only skip if canvas was already initialized once (lastWidth > 0 && lastHeight > 0)
      if (lastWidth > 0 && lastHeight > 0 && !widthChanged && !heightChanged) {
        return;
      }

      lastWidth = newWidth;
      lastHeight = newHeight;

      canvas.width = newWidth;
      canvas.height = newHeight;
      if (currentTheme === 'sanctum') {
        initSanctumParticles();
      } else {
        initCosmicStars();
      }
    };

    // Sanctum Incense Embers (Particle dots only, no heavy full-screen radial gradient per frame)
    const drawSanctum = (time: number) => {
      incenseParticles.forEach((p) => {
        ctx.beginPath();
        const currentX = p.x + Math.sin(time * p.swaySpeed + p.phase) * p.swayAmplitude * 12;
        ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);

        const flicker = Math.sin(time * 1.5 + p.phase) * 0.08;
        const opacity = Math.max(0.05, Math.min(0.75, p.baseOpacity + flicker));

        if (p.color === 'gold') {
          ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
        } else if (p.color === 'amber') {
          ctx.fillStyle = `rgba(245, 158, 11, ${opacity * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(254, 243, 199, ${opacity * 0.8})`;
        }

        ctx.fill();

        p.y -= p.speedY;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
    };

    // Cosmic Stars + Shooting Stars (Particle dots only, nebula clouds handled by CSS layer)
    const drawCosmic = (time: number) => {
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;
        const opacity = Math.max(0.08, Math.min(0.95, star.baseOpacity + twinkle));

        if (star.color === 'gold') {
          ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
        } else if (star.color === 'blue') {
          ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${opacity})`;
        }

        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      // Shooting star
      const now = Date.now();
      if (!shootingStar.active && now - lastShootingStarTime > 8000 + Math.random() * 5000) {
        triggerShootingStar();
        lastShootingStarTime = now;
      }

      if (shootingStar.active) {
        ctx.save();
        ctx.strokeStyle = `rgba(251, 191, 36, ${shootingStar.opacity})`;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';

        const headX = shootingStar.x;
        const headY = shootingStar.y;
        const tailX = headX - Math.cos(shootingStar.angle) * shootingStar.length;
        const tailY = headY - Math.sin(shootingStar.angle) * shootingStar.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        starGrad.addColorStop(0.7, `rgba(245, 158, 11, ${shootingStar.opacity * 0.6})`);
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);

        ctx.strokeStyle = starGrad;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStar.active = false;
        }
        ctx.restore();
      }
    };

    let isScrolling = false;
    let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      isScrolling = true;
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      scrollDebounceTimer = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    const isMobileDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);

    // On mobile devices, 30 FPS for floating ambient particles is visually smooth and cuts GPU cycles by 50%
    const minFrameInterval = isMobileDevice ? 1000 / 30 : 1000 / 60;
    let lastRenderTime = 0;

    const draw = (timestamp: number) => {
      // Pause drawing if page is hidden to save battery & GPU
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // During active touch/scroll gestures, pause canvas updates completely to give 100% GPU budget to 60-120fps scrolling
      if (!isScrolling) {
        const elapsed = timestamp - lastRenderTime;
        if (elapsed >= minFrameInterval) {
          lastRenderTime = timestamp - (elapsed % minFrameInterval);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const time = Date.now() * 0.001;

          if (currentTheme === 'sanctum') {
            drawSanctum(time);
          } else {
            drawCosmic(time);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    animationFrameId = requestAnimationFrame(draw);

    window.addEventListener('resize', resizeCanvas);
    // Listen on document with capture to detect scrolling inside any child container (e.g. main)
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    document.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('touchmove', handleScroll);
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  return (
    <>
      {/* Hardware-Accelerated CSS Ambient Layer (Zero Canvas Re-draw Overhead) */}
      {currentTheme === 'sanctum' ? (
        <>
          <div
            className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-700"
            style={{
              background:
                'radial-gradient(circle 650px at 50% 0%, rgba(255, 248, 235, 0.14) 0%, rgba(251, 191, 36, 0.08) 18%, rgba(245, 158, 11, 0.04) 35%, rgba(217, 119, 6, 0.015) 60%, transparent 80%)',
              transform: 'translateZ(0)',
            }}
          />
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 500px at 50% 100%, rgba(180, 83, 9, 0.02) 0%, transparent 60%)',
              transform: 'translateZ(0)',
            }}
          />
          <div className="fixed inset-0 z-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/60" />
        </>
      ) : (
        <>
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 500px at 80% 20%, rgba(245, 158, 11, 0.035) 0%, rgba(180, 83, 9, 0.015) 50%, transparent 75%)',
              transform: 'translateZ(0)',
            }}
          />
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle 550px at 20% 70%, rgba(30, 58, 138, 0.04) 0%, transparent 65%)',
              transform: 'translateZ(0)',
            }}
          />
        </>
      )}

      {/* Canvas Layer for Floating Embers & Twinkling Stars */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-0 w-full h-full pointer-events-none transition-colors duration-700 ${
          currentTheme === 'sanctum'
            ? 'bg-gradient-to-b from-[#05070d] via-[#070b14] to-[#04060a]'
            : 'bg-gradient-to-b from-[#030712] via-[#050c1e] to-[#07132c]'
        }`}
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      />
    </>
  );
});
