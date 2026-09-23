"use client";

import { useRef } from "react";
import {
  BarChart3,
  MapPin,
  ShieldCheck,
  Building2,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const STATS = [
  { value: 100, decimals: 0, suffix: "+", label: "Partnerunternehmen, die mit uns arbeiten" },
  { value: 5, decimals: 1, suffix: "", label: "Durchschnitt aus 31 Google-Bewertungen" },
  { value: 6, decimals: 0, suffix: "", label: "Leistungsbereiche unter einem Dach" },
];

const TAGS: { t: string; icon: LucideIcon }[] = [
  { t: "Made in Germany", icon: MapPin },
  { t: "DSGVO-konform", icon: ShieldCheck },
  { t: "Sitz in Düsseldorf", icon: Building2 },
];

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
        clearProps: "transform",
        scrollTrigger: { trigger: ".zahlen-grid", start: "top 82%" },
      });

      gsap.from(".zahlen-tag", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.1,
        clearProps: "transform",
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
      className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-20 sm:py-24"
    >
      {/* faint warm glow, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_92%_-10%,rgba(209,170,113,0.10),transparent_60%)]"
      />

      <Container className="relative">
        <div className="zahlen-head mx-auto max-w-[640px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <BarChart3 className="size-3.5 text-accent" />
            Zahlen, die bleiben
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Was{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              nachprüfbar
            </span>{" "}
            ist.
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Hier steht nur, was Sie selbst überprüfen können, auf Google, bei
            unseren Partnern oder in einem Gespräch.
          </p>
        </div>

        <div className="zahlen-grid mx-auto mt-12 grid max-w-[1040px] grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="zahlen-card rounded-[20px] border border-line bg-white px-7 py-8 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(15,14,13,0.28)] sm:px-8 sm:py-9"
            >
              <p className="zahlen-num font-display text-[clamp(2.6rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-ink">
                {fmt(0, s.decimals) + s.suffix}
              </p>
              <p className="mt-4 text-[15px] leading-snug text-[#5c5954]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="zahlen-tags mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[14px] text-[#5c5954] sm:mt-10">
          {TAGS.map(({ t, icon: Icon }) => (
            <span key={t} className="zahlen-tag flex items-center gap-2">
              <Icon className="size-[17px] text-accent" strokeWidth={2} />
              {t}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
