import { motion } from "framer-motion";
import {
  Bot,
  Cloud,
  Globe,
  LayoutDashboard,
  Megaphone,
  PenTool,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { TiltCard } from "./TiltCard";
import { usePointer } from "./pointer";

const SERVICES = [
  {
    icon: Globe,
    title: "Website Development",
    desc: "High-performance websites designed to convert visitors into customers.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform mobile apps built for performance and growth.",
  },
  {
    icon: LayoutDashboard,
    title: "UI/UX Design",
    desc: "Intuitive interfaces that users enjoy and businesses benefit from.",
  },
  {
    icon: Sparkles,
    title: "Branding",
    desc: "Memorable brand identities that inspire trust and recognition.",
  },
  {
    icon: PenTool,
    title: "Graphic Design",
    desc: "Compelling visuals that strengthen your brand identity.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "SEO, social media, paid advertising, and analytics that drive measurable growth.",
  },
  {
    icon: Bot,
    title: "AI Solutions",
    desc: "AI automation, chatbots, AI agents, and custom intelligent solutions.",
  },
  {
    icon: Cloud,
    title: "Cloud & Hosting",
    desc: "Secure cloud deployment, DevOps, hosting, and ongoing maintenance.",
  },
];

export function Services() {
  const { lite } = usePointer();

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <motion.div
            initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">What We Do</p>
        <div>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Full-Spectrum Digital Services
          </h2>
        </div>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Everything an ambitious brand needs to launch, scale, and stay ahead.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            className="h-full"
            initial={
              lite
                ? { opacity: 0, y: 20 }
                : { opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 30, filter: "blur(10px)" }
            }
            whileInView={
              lite ? { opacity: 1, y: 0 } : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
            }
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              type: "spring",
              stiffness: lite ? 120 : 70,
              damping: 18,
              delay: (i % 4) * 0.05,
            }}
          >
            <TiltCard className="h-full rounded-3xl">
              <article className="group/card relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl border border-border bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_40px_90px_-45px_var(--primary)] active:border-primary/40 active:shadow-[0_40px_90px_-45px_var(--primary)]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-active/card:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)",
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-active/card:opacity-100"
                />
                <motion.span
                  className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition-shadow duration-500 group-hover/card:glow-primary group-active/card:glow-primary"
                  whileHover={lite ? undefined : { rotate: 8, scale: 1.06 }}
                  whileTap={{ rotate: 6, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                >
                  <s.icon className="size-5" aria-hidden />
                </motion.span>
                <h3 className="relative mt-7 min-h-[2.6em] font-display text-[17px] font-bold leading-snug tracking-tight">
                  {s.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </article>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
