import { createFileRoute } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Stats } from "@/components/landing/Stats";
import { Notify } from "@/components/landing/Notify";
import { Footer } from "@/components/landing/Footer";
import { PointerProvider } from "@/components/landing/pointer";
import { EasterEggs } from "@/components/landing/EasterEggs";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Redis Digital — Building Digital Products That Drive Growth" },
      {
        name: "description",
        content:
          "We design and build websites, mobile apps, AI solutions, and digital experiences that help businesses grow. Redis Digital — launching soon in Kathmandu.",
      },
      { property: "og:title", content: "Redis Digital — Building Digital Products That Drive Growth" },
      {
        property: "og:description",
        content:
          "We design and build websites, mobile apps, AI solutions, and digital experiences that help businesses grow. Based in Panipokhari, Kathmandu.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Redis Digital",
          slogan: "Building Digital Products That Drive Growth",
          email: "hello@redisdigital.com",
          telephone: "+977-981-3839149",
          sameAs: [
            "https://www.instagram.com/redis.np",
            "https://www.facebook.com/redisnp.archive/",
            "https://www.tiktok.com/@redisnp",
            "https://github.com/weareredis",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Panipokhari, Kathmandu",
            addressCountry: "NP",
          },
          hasMap: "https://maps.app.goo.gl/5aaBp2MfAxmq9Akt9",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <PointerProvider>
      <div id="top" className="relative min-h-dvh overflow-x-hidden">
        <BackgroundFX />
        <EasterEggs />
        <Nav />
        <main>
          <Hero />
          <Services />
          <Stats />
          <Notify />
        </main>
        <Footer />
      </div>
    </PointerProvider>
  );
}
