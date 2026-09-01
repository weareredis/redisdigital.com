import { Facebook, Github, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/redis.np" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/redisnp.archive/" },
  { icon: TikTokIcon, label: "TikTok", href: "https://www.tiktok.com/@redisnp" },
  { icon: Github, label: "GitHub", href: "https://github.com/weareredis" },
];

export function Footer() {
  return (
    <footer className="relative">
      <div
        aria-hidden
        className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-border to-transparent"
      />
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="flex flex-col items-center gap-12 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <a
              href="https://redisdigital.com"
              className="flex items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <Logo size={32} className="rounded-full" />
              <span className="font-display text-base font-extrabold tracking-tight">
                Redis Digital
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Helping ambitious businesses build, launch, and grow digitally.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Get in touch
            </p>
            <a
              href="https://maps.app.goo.gl/5aaBp2MfAxmq9Akt9"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
              Panipokhari, Kathmandu, Nepal
            </a>
            <a
              href="mailto:hello@redisdigital.com"
              className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
            >
              <Mail className="size-4 shrink-0 text-primary" aria-hidden />
              hello@redisdigital.com
            </a>
            <a
              href="tel:+9779813839149"
              className="inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
            >
              <Phone className="size-4 shrink-0 text-primary" aria-hidden />
              +977 981-3839149
            </a>
          </div>

          <ul className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-2xl border border-border bg-white/[0.02] text-muted-foreground backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  <s.icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden
          className="mt-16 h-px bg-linear-to-r from-transparent via-border to-transparent"
        />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 Redis Digital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
