"use client";

import { useRef } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import HeroVideo from "./HeroVideo";
import { gsap, useGSAP } from "@/lib/gsap";

const YT_ID = "vSIs3xcjzG4";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.9 },
      });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.7 })
        .from(
          ".hero-line",
          { yPercent: 110, opacity: 0, stagger: 0.09, duration: 1 },
          "-=0.35",
        )
        .from(".hero-copy", { y: 20, opacity: 0 }, "-=0.6")
        .from(".hero-cta", { y: 18, opacity: 0, stagger: 0.1 }, "-=0.55")
        .from(".hero-proof", { y: 16, opacity: 0 }, "-=0.5");

      // Scroll parallax — content drifts up & fades, media eases down + scales.
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (!reduce) {
        gsap.to(".hero-content", {
          yPercent: -14,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-media", {
          yPercent: 12,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative isolate overflow-hidden">
      {/* Background video */}
      <HeroVideo videoId={YT_ID} />

      <Container className="flex min-h-[clamp(600px,48.5vw,720px)] flex-col items-start justify-start pb-[104px] pt-[80px]">
        <div className="hero-content flex w-[566px] max-w-full flex-col gap-[26px]">
          <p className="hero-eyebrow eyebrow flex items-center gap-2.5 text-white">
            <span className="size-[7px] rounded-[2px] bg-[#fbfaf9]" />
            Marketing × Digitalisierung
          </p>

          <h1 className="display-l text-inverse">
            <span className="block overflow-hidden">
              <span className="hero-line block">Wir bauen, was Ihr</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">Unternehmen nach</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">vorne bringt.</span>
            </span>
          </h1>

          <p className="hero-copy body-xl text-white/90">
            Marketing, Software, Digitalisierung und Unternehmensaufbau aus einer
            Hand. Klar, direkt, ohne Kompromisse.
          </p>

          <div className="flex flex-wrap items-start gap-3.5">
            <Link
              href="#kontakt"
              className="hero-cta group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-[14px] bg-white px-[30px] text-[16px] font-medium tracking-[-0.1px] text-ink transition-colors hover:bg-white/90"
            >
              Jetzt anfragen
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#audit"
              className="hero-cta inline-flex h-[58px] items-center justify-center rounded-[14px] border border-white/55 px-[30px] text-[16px] font-medium tracking-[-0.1px] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Kostenloses Audit buchen
            </Link>
          </div>

          <div className="hero-proof mt-1">
            <div className="h-px w-full bg-white/15" />
            <div className="mt-[26px] flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-white/85">
              <span className="flex items-center gap-3">
                <span className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-[17px] fill-accent text-accent"
                      strokeWidth={0}
                    />
                  ))}
                </span>
                <span className="text-[16px] font-medium text-inverse">5,0</span>
                <span>aus 31 Google-Bewertungen</span>
              </span>
              <span className="h-5 w-px bg-white/20" />
              <span>100+ Partnerunternehmen</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
