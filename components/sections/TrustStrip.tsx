"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import PartnerLogo from "../PartnerLogo";
import { PARTNERS } from "@/lib/partners";
import { gsap, useGSAP } from "@/lib/gsap";

export default function TrustStrip() {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current) return;
      const loop = gsap.to(track.current, {
        xPercent: -50,
        ease: "none",
        duration: 32,
        repeat: -1,
      });
      const el = track.current;
      const enter = () => gsap.to(loop, { timeScale: 0.3, duration: 0.4 });
      const leave = () => gsap.to(loop, { timeScale: 1, duration: 0.4 });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: track },
  );

  return (
    <section
      id="partner"
      className="border-b border-line bg-page py-14"
    >
      <Container>
        <p className="mb-10 text-center text-[15px] tracking-[-0.01em] text-ink/55">
          Vertraut von über 100 Unternehmen — vom Handwerksbetrieb bis zur
          Mehrfachgründung
        </p>
      </Container>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-page to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-page to-transparent" />

        <div ref={track} className="flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-[72px] pr-[72px]"
              aria-hidden={copy === 1}
            >
              {PARTNERS.map((p) => (
                <PartnerLogo
                  key={p.name}
                  partner={p}
                  tint="#7d7973"
                  className="opacity-80 transition-opacity hover:opacity-100"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
