import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePointer } from "./pointer";

const TARGET = 88;

export function ProgressBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [pct, setPct] = useState(0);
  const { reduced } = usePointer();

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1900, 1);
      setPct(Math.round(TARGET * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  return (
    <div ref={ref} className="glass-panel hairline-top overflow-hidden rounded-3xl p-8 text-left sm:p-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
            Launch Progress
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Final preparations are underway.</p>
        </div>
        <motion.span
          className="font-display text-4xl font-extrabold tracking-tight text-gradient-red tabular-nums"
          animate={pct === TARGET && !reduced ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          {pct}%
        </motion.span>
      </div>

      <div
        className="relative mt-8 h-3 w-full overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={TARGET}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Website launch progress"
      >
        {/* track ticks */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 11px, oklch(1 0 0 / 12%) 11px 12px)",
          }}
        />
        <motion.div
          className="relative h-full rounded-full bg-gradient-red animate-gradient-pan"
          initial={{ width: "0%" }}
          animate={inView ? { width: `${TARGET}%` } : { width: "0%" }}
          transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span aria-hidden className="absolute inset-0 rounded-full shimmer-line opacity-45" />

          {/* particles travelling along the bar */}
          {!reduced &&
            [0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-white/90"
                style={{ boxShadow: "0 0 8px 2px oklch(1 0 0 / 70%)" }}
                animate={{ left: ["-2%", "100%"], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.6,
                  delay: i * 0.75,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

          <motion.span
            aria-hidden
            className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white"
            style={{ boxShadow: "0 0 18px 3px color-mix(in oklab, var(--primary) 90%, transparent)" }}
            animate={reduced ? {} : { scale: [1, 1.35, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
        <span>Design</span>
        <span>Build</span>
        <span className="text-primary">Launch</span>
      </div>
    </div>
  );
}
