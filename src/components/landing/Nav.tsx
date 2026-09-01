import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Logo } from "./Logo";

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 160);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: hidden ? -120 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6"
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled
            ? "border border-border bg-black/50 backdrop-blur-xl shadow-[0_20px_60px_-40px_black]"
            : "border border-transparent"
        }`}
      >
        <a
          href="https://redisdigital.com"
          className="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Logo size={32} className="rounded-full" />
          <span className="font-display text-sm font-extrabold tracking-tight">Redis Digital</span>
        </a>

        <a
          href="mailto:hello@redisdigital.com"
          className="inline-flex min-h-10 items-center rounded-full border border-border bg-white/[0.03] px-5 text-sm font-medium backdrop-blur-md transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Contact
        </a>
      </nav>
    </motion.header>
  );
}
