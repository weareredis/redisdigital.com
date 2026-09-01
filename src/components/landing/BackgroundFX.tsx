import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePointer } from "./pointer";

type P = { x: number; y: number; r: number; s: number; a: number; tw: number };

function ParticleField({ count, boostRef }: { count: number; boostRef: () => number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let parts: P[] = [];

    const seed = () => {
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        s: Math.random() * 0.22 + 0.05,
        a: Math.random() * 0.5 + 0.12,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const b = boostRef();
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.s * b * (dt / 16);
        p.tw += 0.02 * b;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 92, 116, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, boostRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />;
}

const SQUARES = [
  { left: "7%", top: "16%", size: 130, dur: 26, depth: 14 },
  { left: "84%", top: "10%", size: 84, dur: 21, depth: 26 },
  { left: "70%", top: "58%", size: 170, dur: 33, depth: 34 },
  { left: "13%", top: "70%", size: 104, dur: 25, depth: 20 },
  { left: "46%", top: "34%", size: 220, dur: 40, depth: 44 },
];

export function BackgroundFX() {
  const { x, y, nx, ny, boost, reduced, lite } = usePointer();
  const { scrollYProgress } = useScroll();

  // parallax layers at different speeds
  const gridX = useTransform(nx, (v) => v * -34);
  const gridY = useTransform(ny, (v) => v * -24);
  const cloudX = useTransform(nx, (v) => v * 60);
  const cloudY = useTransform(ny, (v) => v * 42);
  const wireX = useTransform(nx, (v) => v * 90);

  const lightX = useTransform(x, (v) => v - 340);
  const lightY = useTransform(y, (v) => v - 340);

  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 0.4, 0.18]);
  const cloudShift = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  // slow background zoom + drift for depth (content stays unscaled)
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, lite ? 1.06 : 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", lite ? "6%" : "10%"]);
  const wireY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const wireScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const boostRef = useRef(() => boost.get());

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 origin-center will-change-transform"
        style={{ scale: bgScale, y: bgY }}
      >
        {/* engineering grid, parallax */}
        <motion.div
          className="absolute -inset-24 grid-overlay animate-grid-drift"
          style={{
            x: gridX,
            y: gridY,
            opacity: gridOpacity,
            maskImage: "radial-gradient(78% 58% at 50% 32%, black, transparent 88%)",
            WebkitMaskImage: "radial-gradient(78% 58% at 50% 32%, black, transparent 88%)",
          }}
        />

        {/* slow-moving gradient clouds (gradient-based, no blur filter = GPU cheap) */}
        <motion.div className="absolute inset-0" style={{ x: cloudX, y: cloudY, translateY: cloudShift }}>
          <motion.div
            className="absolute -left-1/4 -top-1/3 h-[80vh] w-[80vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 70%, transparent), transparent 68%)",
            }}
            animate={reduced ? {} : { opacity: [0.16, 0.3, 0.16] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/3 -right-1/4 h-[72vh] w-[72vw] rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--primary) 60%, transparent), transparent 68%)",
            }}
            animate={reduced ? {} : { opacity: [0.12, 0.24, 0.12] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* cinematic spotlight */}
        <div className="absolute inset-x-0 top-0 h-[85vh] spotlight opacity-50" />

        {/* light ray */}
        {!reduced && (
          <div className="absolute inset-y-0 left-0 w-1/3 animate-beam bg-linear-to-r from-transparent via-primary/10 to-transparent" />
        )}

        {/* interactive light source following the cursor */}
        <motion.div
          className="absolute h-[42rem] w-[42rem] rounded-full opacity-[0.18]"
          style={{
            x: lightX,
            y: lightY,
            background: "radial-gradient(circle, var(--primary), transparent 62%)",
          }}
        />

        {/* rotating geometric wireframes */}
        {!reduced && (
          <motion.div className="absolute inset-0" style={{ x: wireX, y: wireY, scale: wireScale }}>
            <motion.div
              className="absolute left-[8%] top-[42%] size-[26rem] rounded-full border border-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute inset-8 rounded-full border border-border" />
              <span className="absolute inset-24 rotate-45 border border-primary/10" />
            </motion.div>
            <motion.div
              className="absolute right-[6%] top-[18%] size-[18rem] rotate-12 border border-border"
              animate={{ rotate: [12, 372] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute inset-10 border border-primary/10" />
            </motion.div>
          </motion.div>
        )}

        {/* floating outlined squares */}
        {SQUARES.map((s, i) => (
          <FloatingSquare key={i} {...s} reduced={reduced} nx={nx} ny={ny} />
        ))}

        {/* live particle field */}
        {!reduced && <ParticleField count={lite ? 30 : 70} boostRef={boostRef.current} />}

        <div className="absolute inset-0 noise-layer opacity-[0.035]" />
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
    </div>
  );
}

function FloatingSquare({
  left,
  top,
  size,
  dur,
  depth,
  reduced,
  nx,
  ny,
}: (typeof SQUARES)[number] & {
  reduced: boolean;
  nx: ReturnType<typeof usePointer>["nx"];
  ny: ReturnType<typeof usePointer>["ny"];
}) {
  const tx = useTransform(nx, (v) => v * depth);
  const ty = useTransform(ny, (v) => v * depth);
  return (
    <motion.div
      className="absolute rounded-[2rem] border border-border/80"
      style={{ left, top, width: size, height: size, x: tx, y: ty }}
      animate={reduced ? {} : { translateY: [0, -26, 0], rotate: [0, 7, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
