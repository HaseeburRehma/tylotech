"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import MosaicBackdrop from "../MosaicBackdrop";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS = [
  { value: 100, decimals: 0, suffix: "+", label: "Partnerunternehmen, die mit uns arbeiten" },
  { value: 5, decimals: 1, suffix: "", label: "Durchschnitt aus 31 Google-Bewertungen" },
  { value: 6, decimals: 0, suffix: "", label: "Leistungsbereiche unter einem Dach" },
];

const TAGS = ["Made in Germany", "DSGVO-konform", "Sitz in Düsseldorf"];

function fmt(n: number, decimals: number) {
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function Zahlen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".zahlen-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".zahlen-head", start: "top 82%" },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".zahlen-card");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".zahlen-grid", start: "top 82%" },
      });

      // Trust tags spring in after the stat cards land
      gsap.from(".zahlen-tag", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".zahlen-tags", start: "top 90%" },
      });

      // Count-up
      cards.forEach((card, i) => {
        const el = card.querySelector<HTMLElement>(".zahlen-num");
        if (!el) return;
        const { value, decimals, suffix } = STATS[i];
        const obj = { n: 0 };
        gsap.to(obj, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".zahlen-grid", start: "top 78%" },
          onUpdate: () => {
            el.textContent = fmt(obj.n, decimals) + suffix;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="zahlen"
      ref={root}
      className="relative overflow-hidden bg-[#001620] py-24 text-white"
    >
      <MosaicBackdrop />

      <Container className="relative">
        <div className="zahlen-head mx-auto max-w-[620px] text-center">
          <p className="eyebrow mb-[18px] flex items-center justify-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            In Zahlen
          </p>
          <h2 className="display-m text-white">Was nachprüfbar ist.</h2>
          <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#b3d6e2]">
            Hier steht nur, was Sie selbst überprüfen können — auf Google, bei
            unseren Partnern oder in einem Gespräch.
          </p>
        </div>

        <div className="zahlen-grid mx-auto mt-14 grid max-w-[1040px] grid-cols-1 gap-5 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="zahlen-card rounded-[20px] border border-[#0a4a5f] bg-[#04283a]/60 px-8 py-9"
            >
              <p className="zahlen-num font-display text-[clamp(2.75rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-white">
                {fmt(0, s.decimals) + s.suffix}
              </p>
              <p className="mt-4 text-[15px] leading-snug text-[#7fbacd]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="zahlen-tags mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[14px] text-white/70">
          {TAGS.map((t) => (
            <span key={t} className="zahlen-tag flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" />
              {t}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
