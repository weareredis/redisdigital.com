import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

type PointerCtx = {
  /** absolute viewport coords, spring-smoothed */
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** normalized -0.5..0.5 */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** easter-egg: background energy 1 = calm, >1 = boosted */
  boost: MotionValue<number>;
  /** easter-egg: hue/intensity of ambient glow */
  glow: MotionValue<number>;
  pulse: (strength?: number) => void;
  reduced: boolean;
  lite: boolean;
};

const Ctx = createContext<PointerCtx | null>(null);

export function usePointer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePointer must be used inside <PointerProvider>");
  return ctx;
}

export function PointerProvider({ children }: { children: ReactNode }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const boost = useMotionValue(1);
  const glow = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 120, damping: 26, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.6 });

  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const [lite, setLite] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px), (pointer: coarse)").matches
      : false,
  );
  const decay = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqLite = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const sync = () => {
      setReduced(mq.matches);
      setLite(mqLite.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    mqLite.addEventListener("change", sync);

    rawX.set(window.innerWidth / 2);
    rawY.set(window.innerHeight * 0.4);

    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      nx.set(e.clientX / window.innerWidth - 0.5);
      ny.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // easter egg: double-click accelerates the background
    const onDbl = () => {
      boost.set(3.2);
      if (decay.current) window.clearInterval(decay.current);
      decay.current = window.setInterval(() => {
        const next = boost.get() - 0.12;
        if (next <= 1) {
          boost.set(1);
          if (decay.current) window.clearInterval(decay.current);
          decay.current = null;
        } else boost.set(next);
      }, 90);
    };
    window.addEventListener("dblclick", onDbl);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("dblclick", onDbl);
      mq.removeEventListener("change", sync);
      mqLite.removeEventListener("change", sync);
      if (decay.current) window.clearInterval(decay.current);
    };
  }, [rawX, rawY, nx, ny, boost]);

  const value = useMemo<PointerCtx>(
    () => ({
      x,
      y,
      nx,
      ny,
      boost,
      glow,
      reduced,
      lite,
      pulse: (strength = 2.2) => boost.set(Math.max(boost.get(), strength)),
    }),
    [x, y, nx, ny, boost, glow, reduced, lite],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
