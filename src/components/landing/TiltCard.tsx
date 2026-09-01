import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePointer } from "./pointer";

/**
 * 3D perspective card that tilts toward the cursor and carries a
 * cursor-following glow border + moving glass reflection.
 * On touch / lite devices, hover tilt is off — use press feedback instead.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, lite } = usePointer();

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const lift = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const near = useSpring(useMotionValue(0), { stiffness: 120, damping: 26 });

  const glow = useMotionTemplate`radial-gradient(220px 180px at ${mx}% ${my}%, color-mix(in oklab, var(--primary) 34%, transparent), transparent 72%)`;
  const sheen = useMotionTemplate`linear-gradient(115deg, transparent 30%, color-mix(in oklab, white ${near}%, transparent) 48%, transparent 62%)`;

  const active = !reduced && !lite;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (!active) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        mx.set(px * 100);
        my.set(py * 100);
        rx.set((0.5 - py) * intensity);
        ry.set((px - 0.5) * intensity);
      }}
      onPointerEnter={() => {
        if (!active) return;
        lift.set(-10);
        near.set(9);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        lift.set(0);
        near.set(0);
      }}
      whileTap={
        reduced
          ? undefined
          : lite
            ? { scale: 0.98, y: 2 }
            : { scale: 0.985 }
      }
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        rotateX: active ? rx : 0,
        rotateY: active ? ry : 0,
        y: active ? lift : 0,
        transformPerspective: active ? 900 : undefined,
        transformStyle: active ? "preserve-3d" : undefined,
      }}
      className={cn("group relative", className)}
    >
      {/* cursor-following glow border — desktop hover only */}
      {active && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glow, maskImage: "linear-gradient(black, black)" }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ backgroundImage: sheen }}
          />
        </>
      )}
      <div
        className="relative h-full"
        style={active ? { transform: "translateZ(24px)" } : undefined}
      >
        {children}
      </div>
    </motion.div>
  );
}
