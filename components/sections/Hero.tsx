"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star, ArrowRight, Megaphone } from "lucide-react";
import Container from "../ui/Container";
import HeroVideoCard from "./HeroVideoCard";
import { gsap, useGSAP } from "@/lib/gsap";

const YT_ID = "vSIs3xcjzG4";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 },
      });
      tl.from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          ".hero-line",
          { yPercent: 118, opacity: 0, stagger: 0.09, duration: 0.9 },
          "-=0.3",
        )
        .from(".hero-copy", { y: 18, opacity: 0 }, "-=0.55")
        .from(".hero-cta", { y: 16, opacity: 0, stagger: 0.1 }, "-=0.5")
        .from(".hero-proof", { y: 14, opacity: 0 }, "-=0.45")
        .from(
          ".hero-media",
          { y: 30, opacity: 0, scale: 0.96, duration: 1 },
          "-=0.95",
        );
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate overflow-hidden bg-page"
    >
      {/* soft warm backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_88%_-8%,rgba(209,170,113,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_0%_115%,rgba(209,170,113,0.07),transparent_60%)]" />
      </div>

      <Container className="grid grid-cols-1 items-center gap-10 pb-16 pt-12 sm:pb-20 sm:pt-16 min-[1180px]:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] min-[1180px]:gap-14 min-[1180px]:pb-28 min-[1180px]:pt-[72px]">
        {/* Left — copy */}
        <div className="hero-content flex max-w-[600px] flex-col gap-6 sm:gap-7">
          <p className="hero-eyebrow inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-60 backdrop-blur-sm">
            <Megaphone className="size-3.5 text-accent" />
            Marketing und Digitalisierung
          </p>

          <h1 className="font-display text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line block">Wir bauen, was Ihr</span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line block">
                Unternehmen{" "}
                <span className="font-[family-name:var(--font-instrument)] font-normal italic text-accent">
                  wirklich
                </span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line block">nach vorne bringt.</span>
            </span>
          </h1>

          <p className="hero-copy max-w-[520px] text-[clamp(15px,1.6vw,19px)] leading-[1.6] text-ink-60">
            Marketing, Software, Digitalisierung und Unternehmensaufbau aus
            einer Hand. Klar, direkt, ohne Kompromisse.
          </p>

          {/* CTAs — kept on a single row at every breakpoint */}
          <div className="flex flex-row items-stretch gap-2.5 sm:gap-3.5">
            <Link
              href="#kontakt"
              className="hero-cta group inline-flex h-[clamp(46px,12.4vw,58px)] items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-gradient-to-b from-[#ecd3a4] to-[#cfa268] px-[clamp(14px,3.6vw,30px)] text-[clamp(12px,3.3vw,16px)] font-medium text-ink shadow-[0_12px_28px_-12px_rgba(209,170,113,0.95)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
            >
              Jetzt anfragen
              <ArrowRight className="size-[clamp(15px,4vw,20px)] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#audit"
              className="hero-cta inline-flex h-[clamp(46px,12.4vw,58px)] items-center justify-center whitespace-nowrap rounded-[14px] border border-line bg-white px-[clamp(14px,3.6vw,30px)] text-[clamp(12px,3.3vw,16px)] font-medium text-ink shadow-[0_8px_20px_-14px_rgba(15,14,13,0.45)] transition-colors duration-200 hover:border-ink/25 hover:bg-page"
            >
              Kostenloses Audit buchen
            </Link>
          </div>

          {/* Proof */}
          <div className="hero-proof">
            <div className="h-px w-full max-w-[520px] bg-line" />
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-60 sm:text-[14px]">
              <span className="flex items-center gap-2.5">
                <span className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-[16px] fill-accent text-accent"
                      strokeWidth={0}
                    />
                  ))}
                </span>
                <span className="text-[15px] font-semibold text-ink">5,0</span>
                <span>aus 31 Google-Bewertungen</span>
              </span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>100+ Partnerunternehmen</span>
            </div>
          </div>
        </div>

        {/* Right — video */}
        <div className="w-full max-w-[560px] min-[1180px]:max-w-none">
          <HeroVideoCard videoId={YT_ID} label="Imagefilm" />
        </div>
      </Container>
    </section>
  );
}
