import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePointer } from "./pointer";

/** Press "R" — a quiet Redis Digital signature sweeps across the screen. */
export function EasterEggs() {
  const [show, setShow] = useState(false);
  const { pulse } = usePointer();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && ["INPUT", "TEXTAREA"].includes(el.tagName)) return;
      if (e.key.toLowerCase() !== "r" || e.metaKey || e.ctrlKey) return;
      setShow(true);
      pulse(2.4);
      window.setTimeout(() => setShow(false), 2200);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pulse]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="font-display text-[clamp(3rem,16vw,12rem)] font-extrabold tracking-[-0.06em] text-gradient-red"
            initial={{ scale: 0.85, filter: "blur(24px)", opacity: 0 }}
            animate={{ scale: 1, filter: "blur(0px)", opacity: 0.16 }}
            exit={{ scale: 1.08, filter: "blur(20px)", opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            REDIS
          </motion.span>
          <motion.span
            className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
