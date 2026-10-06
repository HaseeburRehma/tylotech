"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Branche } from "@/lib/branchen";
import { useT } from "../i18n/LocaleProvider";
import { Accent, BrandLogo, Eyebrow, GlassButton, GoldButton } from "./ui";

export default function BrancheHero({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);
  const h = b.hero;
  const t = useT();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".bhh-copy > *", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08 })
        .from(".bhh-offset", { x: 30, y: 30, opacity: 0, duration: 0.9 }, 0.15)
        .from(".bhh-photo", { y: 40, opacity: 0, scale: 0.96, duration: 1 }, 0.2)
        .from(".bhh-card", { y: 18, opacity: 0, scale: 0.94, duration: 0.6, stagger: 0.15 }, 0.65)
        .from(".bhh-chip", { y: 14, opacity: 0, duration: 0.6 }, 0.95);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-white">
      {/* warm light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-[32%] h-[760px] w-[1180px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.22),rgba(209,170,113,0.06)_60%,transparent)]"
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 pb-14 pt-8 sm:gap-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)] xl:gap-16 xl:pt-[88px]">
        <div className="bhh-copy flex min-w-0 flex-col items-start gap-6 sm:gap-7">
          <Eyebrow icon={h.icon}>{h.eyebrow}</Eyebrow>
          <h1 className="font-display text-[clamp(2.3rem,4.6vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-[#1a1917]">
            <Accent text={h.title} />
          </h1>
          <p className="max-w-[716px] text-[clamp(17px,1.5vw,20px)] leading-[1.5] tracking-[-0.01em] text-[#5c5954]">{h.sub}</p>
          <div className="flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
            <GoldButton href="#kontakt">{h.cta}</GoldButton>
            <GlassButton href="#case">{t("Ergebnisse ansehen", "See the results")}</GlassButton>
          </div>
          <div className="h-px w-full max-w-[716px] bg-[#eeedea]" />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] leading-[22px] tracking-[-0.1px] text-[#7d7973]">
            <span>{t("100+ Projekte", "100+ projects")}</span>
            <span className="h-4 w-px bg-[#e2e0dc]" />
            <span className="flex items-center gap-3">
              <span className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-[17px] fill-[#d1aa71] text-[#d1aa71]" strokeWidth={0} />
                ))}
              </span>
              <span className="font-display text-[16px] font-medium tracking-[-0.02em] text-[#1a1917]">{t("5,0", "5.0")}</span>
              <span>{t("Bewertung", "rating")}</span>
            </span>
            <span className="hidden h-4 w-px bg-[#e2e0dc] sm:block" />
            <span>{t("vom Handwerk bis zum Mittelstand", "from trades to mid-sized companies")}</span>
          </div>
        </div>

        {/* visual — positions are Figma's 500×560 frame, in % so it scales.
          The float runs on CSS `translate`, so it never fights GSAP's transform. */}
        <div className="relative mx-auto aspect-[500/560] w-full max-w-[500px]">
          <div className="bhh-offset absolute left-[17.6%] top-[7.1%] h-[91.1%] w-[80%] rounded-[28px] bg-[#fbf6ee]" />
          <div className="bhh-photo absolute left-[12%] top-[2.1%] h-[91.1%] w-[80%] overflow-hidden rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.image} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          </div>
          <LeadCard className="left-0 top-[15%] motion-safe:animate-[bhFloat_4.2s_ease-in-out_1.3s_infinite]" {...h.cards[0]} />
          <LeadCard className="right-0 top-[70.7%] motion-safe:animate-[bhFloat_4.8s_ease-in-out_2.4s_infinite]" {...h.cards[1]} />
          <div className="bhh-chip absolute left-[7.2%] top-[87.9%] motion-safe:animate-[bhFloatSm_5.4s_ease-in-out_1.9s_infinite] flex items-center gap-2.5 rounded-full bg-[#0f0e0d] py-2 pl-2 pr-[18px] shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05)]">
            <span className="grid size-7 place-items-center rounded-full bg-[#d1aa71] font-display text-[14px] font-medium text-[#0f0e0d]">1</span>
            <span className="whitespace-nowrap font-display text-[13px] font-medium tracking-[-0.02em] text-white sm:text-[14px]">{h.chip}</span>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LeadCard({ brand, label, value, className }: { brand: Parameters<typeof BrandLogo>[0]["brand"]; label: string; value: string; className: string }) {
  return (
    <div
      className={`bhh-card absolute flex items-center gap-3 rounded-[16px] border border-[#eeedea] bg-white py-3 pl-3.5 pr-[18px] shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] ${className}`}
    >
      <BrandLogo brand={brand} size={28} />
      <span className="flex flex-col gap-1">
        <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#94713f] sm:text-[12px]">{label}</span>
        <span className="whitespace-nowrap font-display text-[14px] font-medium leading-5 tracking-[-0.02em] text-[#1a1917] sm:text-[16px]">{value}</span>
      </span>
    </div>
  );
}
