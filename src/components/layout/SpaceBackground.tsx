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
      const numParticles = Math.min(65, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < numParticles; i++) {
        const rand = Math.random();
        const color: 'gold' | 'amber' | 'warmWhite' =
          rand > 0.6 ? 'gold' : rand > 0.25 ? 'amber' : 'warmWhite';

        incenseParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.6 + 0.6,
          baseOpacity: Math.random() * 0.35 + 0.15,
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
      const numStars = Math.min(220, Math.floor((canvas.width * canvas.height) / 4500));
      for (let i = 0; i < numStars; i++) {
        const rand = Math.random();
        const color: 'gold' | 'blue' | 'white' =
          rand > 0.85 ? 'gold' : rand > 0.7 ? 'blue' : 'white';

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: color === 'gold' ? Math.random() * 1.8 + 0.8 : Math.random() * 1.4 + 0.4,
          baseOpacity: Math.random() * 0.5 + 0.2,
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

    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    let lastHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // On mobile browsers, scrolling collapses the address bar by ~56px, which fires window 'resize'.
      // Resetting canvas.width/height clears the canvas bitmap and re-initializes all particles,
      // causing noticeable background flickering/flashing during scroll.
      // We only resize if the width changes (orientation flip) or if the height change is significant (> 120px).
      const widthChanged = Math.abs(newWidth - lastWidth) > 5;
      const heightChanged = Math.abs(newHeight - lastHeight) > 120;

      if (!widthChanged && !heightChanged && canvas.width > 0 && canvas.height > 0) {
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

    // Draw Sanctum (Temple Diya + Incense Embers)
    const drawSanctum = (time: number) => {
      // 1. Akhand Diya Sacred Radiance
      const pulse = Math.sin(time * 0.7) * 0.015;
      const diyaGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.02,
        20,
        canvas.width * 0.5,
        canvas.height * 0.02,
        Math.max(canvas.width * 0.65, 500)
      );
      diyaGlow.addColorStop(0, `rgba(245, 158, 11, ${0.11 + pulse})`);
      diyaGlow.addColorStop(0.35, `rgba(217, 119, 6, ${0.05 + pulse * 0.5})`);
      diyaGlow.addColorStop(0.7, 'rgba(120, 53, 15, 0.02)');
      diyaGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = diyaGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Secondary subtle sanctum floor warmth
      const floorGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.95,
        30,
        canvas.width * 0.5,
        canvas.height * 0.95,
        canvas.width * 0.5
      );
      floorGlow.addColorStop(0, 'rgba(180, 83, 9, 0.025)');
      floorGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = floorGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Floating sacred incense particles
      incenseParticles.forEach((p) => {
        ctx.beginPath();
        const currentX = p.x + Math.sin(time * p.swaySpeed + p.phase) * p.swayAmplitude * 12;
        ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);

        const flicker = Math.sin(time * 1.5 + p.phase) * 0.08;
        const opacity = Math.max(0.05, Math.min(0.75, p.baseOpacity + flicker));

        if (p.color === 'gold') {
          ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        } else if (p.color === 'amber') {
          ctx.fillStyle = `rgba(245, 158, 11, ${opacity * 0.9})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(217, 119, 6, 0.3)';
        } else {
          ctx.fillStyle = `rgba(254, 243, 199, ${opacity * 0.8})`;
          ctx.shadowBlur = 2;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.2)';
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        p.y -= p.speedY;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
      });
    };

    // Draw Cosmic (Original Stars + Nebula + Shooting Stars)
    const drawCosmic = (time: number) => {
      // 1. Celestial nebula clouds
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.2,
        20,
        canvas.width * 0.8,
        canvas.height * 0.2,
        canvas.width * 0.45
      );
      grad1.addColorStop(0, 'rgba(245, 158, 11, 0.035)');
      grad1.addColorStop(0.5, 'rgba(180, 83, 9, 0.015)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.7,
        30,
        canvas.width * 0.2,
        canvas.height * 0.7,
        canvas.width * 0.5
      );
      grad2.addColorStop(0, 'rgba(30, 58, 138, 0.04)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;
        const opacity = Math.max(0.08, Math.min(0.95, star.baseOpacity + twinkle));

        if (star.color === 'gold') {
          ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
          if (star.radius > 1.2) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
          }
        } else if (star.color === 'blue') {
          ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${opacity})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      // 3. Shooting star
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

    const draw = () => {
      // Pause clearRect and redraws during active scrolling so the canvas remains a static,
      // pre-rendered GPU texture. This completely eliminates backdrop-filter buffer desync flicker.
      if (!isScrolling) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = Date.now() * 0.001;

        if (currentTheme === 'sanctum') {
          drawSanctum(time);
        } else {
          drawCosmic(time);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('touchmove', handleScroll);
      if (scrollDebounceTimer) clearTimeout(scrollDebounceTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  return (
    <>
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 z-0 w-full h-full pointer-events-none transition-colors duration-700 ${
          currentTheme === 'sanctum'
            ? 'bg-gradient-to-b from-[#05070d] via-[#070b14] to-[#04060a]'
            : 'bg-gradient-to-b from-[#030712] via-[#050c1e] to-[#07132c]'
        }`}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Tactile Stone & Palm-leaf Manuscript Micro-Grain Texture (Sanctum Mode Only) */}
      {currentTheme === 'sanctum' && (
        <>
          <div
            className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="fixed inset-0 z-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-black/60" />
        </>
      )}
    </>
  );
});
