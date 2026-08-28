'use client';
import { Effect, Fiber } from 'effect';
import type React from 'react';
import { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  opacity?: number;
  speed?: number;
  fontSize?: number;
  color?: string;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = (
  { opacity = 0.15, speed = 50, fontSize = 14, color = '#00ff00' }
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cssWidth = 0;
    let cssHeight = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      cssWidth = rect.width || canvas.clientWidth || window.innerWidth;
      cssHeight = rect.height || canvas.clientHeight || window.innerHeight;

      canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.max(1, Math.floor(cssWidth / fontSize));
      const next: number[] = [];
      for (let i = 0;i < columns;i++) {
        next[i] = drops[i] ?? (Math.random() * cssHeight) / fontSize;
      }
      drops = next;
    };

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');

    resize();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px 'Terminess', 'Courier New', monospace`;
      ctx.textAlign = 'left';

      for (let i = 0;i < drops.length;i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)] ?? '';
        const currentDrop = drops[i] ?? 0;
        const x = i * fontSize;
        const y = currentDrop * fontSize;

        ctx.fillStyle = color;
        ctx.fillText(char, x, y);

        ctx.shadowColor = color;
        ctx.shadowBlur = 3;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        if (y > cssHeight && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = currentDrop + 1;
        }
      }
    };

    const fiber = Effect.runFork(Effect.async<never, never, never>((resume) => {
      let animFrameId: number | null = null;
      let lastFrameAt = 0;

      const animate = (timestamp: number) => {
        if (timestamp - lastFrameAt >= speed) {
          draw();
          lastFrameAt = timestamp;
        }
        animFrameId = requestAnimationFrame(animate);
      };

      animFrameId = requestAnimationFrame(animate);
      window.addEventListener('resize', resize);

      return Effect.sync(() => {
        if (animFrameId !== null) cancelAnimationFrame(animFrameId);
        window.removeEventListener('resize', resize);
      });
    }));

    return () => {
      Effect.runFork(Fiber.interrupt(fiber));
    };
  }, [speed, fontSize, color]);

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 pointer-events-none'
      style={{ opacity, zIndex: -1, width: '100%', height: '100%' }} />
  );
};

export default MatrixBackground;
