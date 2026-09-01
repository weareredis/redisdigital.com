import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePointer } from "./pointer";

const STATS = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "Clients Worldwide" },
  { value: 8, suffix: "", label: "Core Services" },
  { value: 99, suffix: "%", label: "Client Satisfaction" },
];

function Counter({ to, suffix, run, delay }: { to: number; suffix: string; run: boolean; delay: number }) {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start = 0;
    const begin = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (now < begin) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (!start) start = now;
      const p = Math.min((now - start) / 1800, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, delay]);

  return (
    <motion.span
      className="relative font-display text-[clamp(2.5rem,6vw,3.75rem)] font-extrabold leading-none tracking-[-0.04em] text-gradient-red tabular-nums"
      animate={done ? { filter: [
        "drop-shadow(0 0 26px color-mix(in oklab, var(--primary) 35%, transparent))",
        "drop-shadow(0 0 60px color-mix(in oklab, var(--primary) 85%, transparent))",
        "drop-shadow(0 0 26px color-mix(in oklab, var(--primary) 35%, transparent))",
      ] } : {}}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { reduced } = usePointer();

  return (
    <section className="mx-auto max-w-5xl px-6 pb-32 sm:pb-40">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
        className="glass-panel hairline-top grid grid-cols-2 gap-y-14 rounded-[2rem] px-8 py-16 sm:px-14 lg:grid-cols-4 lg:gap-y-0"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.15 + i * 0.12 }}
            className={`relative text-center ${
              i % 2 === 1 ? "border-l border-border" : ""
            } ${i > 0 ? "lg:border-l lg:border-border" : "lg:border-l-0"}`}
          >
            {/* expanding rings behind each number */}
            {!reduced &&
              [0, 1].map((r) => (
                <motion.span
                  key={r}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-6 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={inView ? { scale: [0.4, 2.2], opacity: [0.5, 0] } : {}}
                  transition={{
                    duration: 2.6,
                    delay: 0.3 + i * 0.12 + r * 0.5,
                    repeat: Infinity,
                    repeatDelay: 3.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            <Counter to={s.value} suffix={s.suffix} run={inView} delay={0.15 + i * 0.12} />
            <p className="mt-4 text-[13px] tracking-wide text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
