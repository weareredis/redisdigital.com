import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  c: string;
  r: number;
};

/**
 * Assembles the logo out of hundreds of glowing particles sampled from the
 * real logo bitmap, then cross-fades to the crisp image.
 */
export function ParticleLogo({
  size = 132,
  src = "/redis-logo.png",
  reduced = false,
  onDone,
}: {
  size?: number;
  src?: string;
  reduced?: boolean;
  onDone?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settled, setSettled] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setSettled(true);
      onDone?.();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;
      const off = document.createElement("canvas");
      const S = 84;
      off.width = S;
      off.height = S;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, S, S);
      const data = octx.getImageData(0, 0, S, S).data;

      const parts: Particle[] = [];
      const step = 2;
      const scale = size / S;
      for (let y = 0; y < S; y += step) {
        for (let x = 0; x < S; x += step) {
          const i = (y * S + x) * 4;
          const a = data[i + 3];
          if (a < 40) continue;
          const angle = Math.random() * Math.PI * 2;
          const dist = size * (0.9 + Math.random() * 1.4);
          parts.push({
            tx: x * scale,
            ty: y * scale,
            x: size / 2 + Math.cos(angle) * dist,
            y: size / 2 + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
            c: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${(a / 255) * 0.95})`,
            r: step * scale * 0.62,
          });
        }
      }

      const start = performance.now();
      const tick = (now: number) => {
        const t = now - start;
        ctx.clearRect(0, 0, size, size);
        let moving = 0;
        for (const p of parts) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx = (p.vx + dx * 0.05) * 0.8;
          p.vy = (p.vy + dy * 0.05) * 0.8;
          p.x += p.vx;
          p.y += p.vy;
          if (Math.abs(dx) + Math.abs(dy) > 1.2) moving++;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.fill();
        }
        ctx.globalCompositeOperation = "lighter";
        ctx.globalCompositeOperation = "source-over";

        if (moving > parts.length * 0.02 && t < 2600) {
          raf = requestAnimationFrame(tick);
        } else {
          setSettled(true);
          onDone?.();
        }
      };
      raf = requestAnimationFrame(tick);
    };

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [size, src, reduced, onDone]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700"
        style={{ width: size, height: size, opacity: settled ? 0 : 1 }}
      />
      <img
        src={src}
        alt="Redis Digital logo"
        width={size}
        height={size}
        className="relative rounded-full transition-opacity duration-700"
        style={{ width: size, height: size, opacity: settled ? 1 : 0 }}
      />
    </div>
  );
}
