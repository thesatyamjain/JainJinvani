import React, { useEffect, useRef } from 'react';

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

export const SpaceBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
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

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw subtle celestial nebula clouds
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

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        const twinkle = Math.sin(time * star.twinkleSpeed + star.phase) * 0.25;
        const opacity = Math.max(0.08, Math.min(0.95, star.baseOpacity + twinkle));

        if (star.color === 'gold') {
          ctx.fillStyle = `rgba(251, 191, 36, ${opacity})`;
          // Soft golden halo for special stars
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
        ctx.shadowBlur = 0; // reset

        // Upward gentle drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

      // Occasional shooting star (approx every 7-10 seconds)
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

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#030712] via-[#050c1e] to-[#07132c]"
    />
  );
});
