import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
};

export function MagneticButton({ href, children, className, variant = "primary" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setOffset({
          x: (e.clientX - (r.left + r.width / 2)) * 0.28,
          y: (e.clientY - (r.top + r.height / 2)) * 0.35,
        });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex min-h-13 items-center justify-center overflow-hidden rounded-full px-9 text-sm font-semibold tracking-tight transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        variant === "primary"
          ? "bg-gradient-red text-primary-foreground shadow-[0_18px_50px_-20px_var(--primary)] hover:glow-primary"
          : "border border-border bg-white/[0.02] text-foreground backdrop-blur-md hover:border-primary/50 hover:bg-primary/10",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
    </motion.a>
  );
}
