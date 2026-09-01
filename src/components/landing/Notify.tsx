import { motion } from "framer-motion";
import { useState } from "react";
import { Mail } from "lucide-react";
import { usePointer } from "./pointer";

export function Notify() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);
  const { reduced } = usePointer();

  return (
    <section id="notify" className="mx-auto max-w-4xl px-6 pb-32 sm:pb-40">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 60, damping: 18 }}
        className="relative overflow-hidden rounded-[2.25rem] p-px"
      >
        {/* moving gradient border */}
        <motion.span
          aria-hidden
          className="absolute inset-[-140%]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--primary) 85%, transparent) 60deg, transparent 140deg, transparent 220deg, color-mix(in oklab, var(--primary-glow) 70%, transparent) 290deg, transparent 340deg)",
          }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          animate={reduced ? {} : { y: [0, -7, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-[2.2rem] bg-black/75 px-8 py-16 text-center backdrop-blur-2xl sm:px-16 sm:py-20"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70 spotlight"
          />

          <h2 className="relative font-display text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-tight tracking-[-0.04em]">
            Ready for What&apos;s Next?
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Enter your email and we&apos;ll notify you as soon as Redis Digital officially launches.
          </p>

          <form
            className="relative mx-auto mt-10 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="notify-email" className="sr-only">
              Email address
            </label>
            <motion.div
              className="relative flex-1 rounded-full"
              animate={{
                boxShadow: focused
                  ? "0 0 0 1px color-mix(in oklab, var(--primary) 60%, transparent), 0 0 40px -8px var(--primary)"
                  : "0 0 0 0px transparent",
              }}
              transition={{ duration: 0.35 }}
            >
              <Mail
                className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="you@company.com"
                className="min-h-13 w-full rounded-full border border-input bg-white/[0.03] pl-12 pr-5 text-sm text-foreground backdrop-blur-md transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:outline-none"
              />
            </motion.div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="group relative min-h-13 overflow-hidden rounded-full bg-gradient-red px-8 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_-20px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={reduced ? {} : { boxShadow: [
                  "0 0 0 0 color-mix(in oklab, var(--primary) 60%, transparent)",
                  "0 0 0 14px transparent",
                ] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative z-10">Notify Me</span>
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
            </motion.button>
          </form>

          <p aria-live="polite" className="relative mt-5 min-h-5 text-sm text-primary">
            {sent ? "Thanks — you're on the list." : ""}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
