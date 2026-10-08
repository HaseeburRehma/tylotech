"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import PartnerLogo from "../PartnerLogo";
import { PARTNERS } from "@/lib/partners";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";

/** `tone="branche"`: industry-page Figma frame (white, 56/72 padding, own caption) */
export default function TrustStrip({ tone = "home" }: { tone?: "home" | "branche" }) {
  const br = tone === "branche";
  const track = useRef<HTMLDivElement>(null);
  const t = useT();

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
      className={br ? "border-b border-line bg-white pb-12 pt-10 sm:pb-[72px] sm:pt-14" : "border-b border-line bg-page py-10 sm:py-14"}
    >
      <Container>
        <p className={`${br ? "mb-8" : "mb-10"} text-center t-body-s text-ink/55`}>
          {br
            ? t("Vertraut von über 100 Unternehmen, vom Handwerk bis zum Mittelstand", "Trusted by 100+ businesses, from trades to established SMEs")
            : t("Vertraut von über 100 Unternehmen, vom Handwerksbetrieb bis zur Mehrfachgründung", "Trusted by 100+ businesses, from local trades to serial founders")}
        </p>
      </Container>

      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r ${br ? "from-white" : "from-page"} to-transparent`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l ${br ? "from-white" : "from-page"} to-transparent`} />

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
