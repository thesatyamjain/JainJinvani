import React, { useEffect, useRef } from 'react';

export const SpaceBackground = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { 
      x: number; 
      y: number; 
      radius: number; 
      baseOpacity: number; 
      phase: number; 
      speed: number 
    }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Reduce density slightly for better performance
      const numStars = Math.floor((canvas.width * canvas.height) / 4000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          baseOpacity: Math.random() * 0.5 + 0.1, // varied base brightness
          phase: Math.random() * Math.PI * 2, // random starting point in cycle
          speed: Math.random() * 0.05 + 0.02, // slow movement
        });
      }
    };

    const draw = () => {
      // Clear with transparency (background handled by CSS)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 0.001; // Current time in seconds

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Smooth sine wave twinkling
        // Oscillates between baseOpacity and baseOpacity + 0.3
        const twinkle = Math.sin(time * 2 + star.phase) * 0.2; 
        const opacity = Math.max(0.1, Math.min(1, star.baseOpacity + twinkle));
        
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Slow, steady movement upwards
        star.y -= star.speed;
        
        // Wrap around top to bottom
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
      });

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
      className="fixed inset-0 z-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#050a14] to-[#0b162c]"
    />
  );
});
