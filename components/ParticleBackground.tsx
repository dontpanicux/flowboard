'use client';

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

const COLORS = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"];
const COUNT = 120;

function makeParticle(w: number, h: number, randomY = true): Particle {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + Math.random() * 80,
    size: Math.random() * 2.5 + 1.2,
    speedY: -(Math.random() * 0.35 + 0.1),
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.18 + 0.1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function tick() {
      const { width, height } = canvas!;
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -12) particles[i] = makeParticle(width, height, false);
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.opacity;
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    }

    resize();
    particles = Array.from({ length: COUNT }, () =>
      makeParticle(canvas.width, canvas.height)
    );

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
