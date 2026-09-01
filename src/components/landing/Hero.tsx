import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { ProgressBlock } from "./ProgressBlock";
import { MagneticButton } from "./MagneticButton";
import { ParticleLogo } from "./ParticleLogo";
import { usePointer } from "./pointer";

const HEADLINE_A = ["Building", "Digital", "Products"];
const HEADLINE_B = ["That", "Drive", "Growth."];

const wordDesktop = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const wordLite = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const { nx, ny, reduced, lite, pulse } = usePointer();
  const soft = reduced || lite;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const [ready, setReady] = useState(soft);
  const [ripples, setRipples] = useState<number[]>([]);
  const [logoHot, setLogoHot] = useState(false);

  const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.88]);
  const contentOpacity = useTransform(scrollYProgress, [0, soft ? 0.55 : 0.32], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, soft ? -20 : -60]);

  const tiltX = useTransform(nx, (v) => (soft ? 0 : v * 14));
  const tiltY = useTransform(ny, (v) => (soft ? 0 : v * 10));
  const textX = useTransform(nx, (v) => (soft ? 0 : v * 6));

  const word = soft ? wordLite : wordDesktop;

  useEffect(() => {
    if (soft) {
      setReady(true);
      return;
    }
    const t = window.setTimeout(() => setReady(true), 1800);
    return () => window.clearTimeout(t);
  }, [soft]);

  const ripple = () => {
    const id = Date.now();
    setRipples((r) => [...r, id]);
    pulse(2.6);
    window.setTimeout(() => setRipples((r) => r.filter((v) => v !== id)), 1600);
  };

  return (
    <>
      {/* cinematic curtain — desktop only (blur/GPU heavy on mobile) */}
      {!soft && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      <section
        ref={heroRef}
        className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-36 text-center sm:pb-16 sm:pt-40"
      >
        <motion.div
          style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
          className="flex w-full flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: soft ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: soft ? 0.5 : 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid place-items-center"
            style={{ x: tiltX, y: tiltY }}
          >
            <motion.span
              aria-hidden
              className="absolute size-48 rounded-full blur-[60px] sm:size-80 sm:blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklab, var(--primary) 55%, transparent), transparent 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: logoHot ? 0.9 : soft ? 0.5 : [0.45, 0.8, 0.45] }}
              transition={
                soft || logoHot
                  ? { duration: 0.5 }
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
            />

            {!reduced &&
              (soft ? [0, 1] : [0, 1, 2]).map((i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute rounded-full border border-primary/25"
                  style={{
                    width: (soft ? 150 : 170) + i * (soft ? 48 : 62),
                    height: (soft ? 150 : 170) + i * (soft ? 48 : 62),
                  }}
                  animate={{
                    rotate: i % 2 ? -360 : 360,
                    opacity: soft ? [0.3, 0.55, 0.3] : [0.25, 0.6, 0.25],
                  }}
                  transition={{
                    rotate: {
                      duration: (soft ? 36 : 28) + i * (soft ? 18 : 14),
                      repeat: Infinity,
                      ease: "linear",
                    },
                    opacity: {
                      duration: (soft ? 6 : 5) + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <span
                    className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                    style={{ boxShadow: "0 0 12px 2px var(--primary)" }}
                  />
                </motion.span>
              ))}

            {!reduced &&
              Array.from({ length: soft ? 4 : 8 }, (_, i) => (
                <motion.span
                  key={`o${i}`}
                  aria-hidden
                  className="absolute rounded-full"
                  style={{
                    width: (soft ? 190 : 220) + (i % 3) * (soft ? 28 : 40),
                    height: (soft ? 190 : 220) + (i % 3) * (soft ? 28 : 40),
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: (soft ? 22 : 16) + i * (soft ? 4 : 3),
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.4,
                  }}
                >
                  <span
                    className="absolute left-1/2 top-0 size-1 rounded-full bg-primary/90"
                    style={{
                      boxShadow:
                        "0 0 10px 2px color-mix(in oklab, var(--primary) 80%, transparent)",
                    }}
                  />
                </motion.span>
              ))}

            {ripples.map((id) => (
              <motion.span
                key={id}
                aria-hidden
                className="absolute size-40 rounded-full border border-primary/60"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}

            <button
              type="button"
              onClick={ripple}
              onPointerEnter={() => setLogoHot(true)}
              onPointerLeave={() => setLogoHot(false)}
              aria-label="Redis Digital"
              className="relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
            >
              <motion.span
                className="block"
                animate={{ scale: [1, soft ? 1.02 : 1.035, 1] }}
                transition={{ duration: soft ? 6.5 : 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ParticleLogo size={116} reduced={soft} />
              </motion.span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mt-12 flex items-center gap-3"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
              <span className="relative size-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Coming soon
            </span>
          </motion.div>

          <motion.h1
            style={{ x: textX }}
            className="relative mt-8 font-display text-[clamp(2.75rem,9vw,6rem)] font-extrabold leading-[1.08] tracking-[-0.045em]"
          >
            <span className="block">
              {HEADLINE_A.map((w, i) => (
                <motion.span
                  key={w}
                  initial={word.hidden}
                  animate={ready ? word.show : word.hidden}
                  transition={{ duration: soft ? 0.45 : 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-[0.25em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="mt-1 block sm:mt-2">
              {HEADLINE_B.map((w, i) => (
                <motion.span
                  key={w}
                  initial={word.hidden}
                  animate={ready ? word.show : word.hidden}
                  transition={{
                    duration: soft ? 0.45 : 0.9,
                    delay: 0.12 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mr-[0.25em] inline-block"
                >
                  <span className="text-gradient-red">{w}</span>
                </motion.span>
              ))}
            </span>
            {ready && !reduced && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 -skew-x-12"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 42%, color-mix(in oklab, white 30%, transparent) 50%, transparent 58%)",
                  mixBlendMode: "overlay",
                }}
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.6, delay: soft ? 0.35 : 0.7, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: soft ? 0.15 : 0.35 }}
            className="mt-8 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            We design and build websites, mobile apps, AI solutions, and digital experiences that help
            businesses grow.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: soft ? 0.2 : 0.5 }}
            className="mt-6"
          >
            <a
              href="https://maps.app.goo.gl/5aaBp2MfAxmq9Akt9"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-primary"
            >
              <MapPin className="size-3.5 text-primary" aria-hidden />
              Panipokhari, Kathmandu
            </a>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: soft ? 0.25 : 0.6 }}
            className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <MagneticButton href="#notify" className="w-full sm:w-auto">
              Notify Me
            </MagneticButton>
            <MagneticButton
              href="mailto:hello@redisdigital.com"
              variant="ghost"
              className="w-full sm:w-auto"
            >
              Contact Us
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: soft ? 0.3 : 0.75 }}
            className="mt-12 w-full max-w-2xl sm:mt-20"
          >
            <ProgressBlock />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
