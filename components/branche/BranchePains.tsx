"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Branche, Brand, PainVisual } from "@/lib/branchen";
import { BrandLogo, SectionHead, useInView } from "./ui";

/* ---- visuals (Figma "Bento Visual / …") ----------------------------------- */

const RANKS = [
  { term: "gebäudereinigung düsseldorf", pos: 1, from: 6, trend: 0.95 },
  { term: "fahrschule düsseldorf", pos: 3, from: 11, trend: 0.62 },
  { term: "pizza lieferservice köln", pos: 2, from: 9, trend: 0.78 },
  { term: "rohrreinigung nrw", pos: 1, from: 7, trend: 0.88 },
];

function RankRow({ r, i, on }: { r: (typeof RANKS)[number]; i: number; on: boolean }) {
  const [pos, setPos] = useState(r.from);
  useEffect(() => {
    if (!on) return;
    let p = r.from;
    let id: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      id = setInterval(() => {
        p -= 1;
        setPos(p);
        if (p <= r.pos) clearInterval(id);
      }, 90);
    }, 250 + i * 140);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, [on, r.from, r.pos, i]);
  return (
    <div
      className="group/row -mx-2 flex items-center gap-2.5 rounded-lg border-t border-[#eeedea] px-2 py-[9px] transition-[background-color,translate,opacity] duration-500 hover:bg-[#fbf6ee]"
      style={{ opacity: on ? 1 : 0, translate: on ? "0 0" : "0 14px", transitionDelay: on ? `${i * 120}ms` : "0ms" }}
    >
      <p className="min-w-0 flex-1 truncate text-[13px] leading-[17px] text-[#1a1917]">{r.term}</p>
      <span className={cn("grid h-6 w-[26px] place-items-center rounded-[7px] font-mono text-[12px] font-medium tabular-nums", pos === 1 ? "bg-[#fbf6ee] text-[#94713f]" : "bg-[#f6f5f3] text-[#5c5954]")}>
        {pos}
      </span>
      <span className="relative h-1.5 w-[52px] overflow-hidden rounded-[3px] bg-[#eeedea]">
        <span
          className="absolute inset-y-0 left-0 rounded-[3px] bg-[#d1aa71] transition-[width] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ width: on ? `${r.trend * 100}%` : "0%", transitionDelay: on ? `${300 + i * 140}ms` : "0ms" }}
        />
      </span>
    </div>
  );
}

function Rankings() {
  const [ref, on] = useInView<HTMLDivElement>(0.35);
  return (
    <div ref={ref} className="flex h-full items-center bg-[#f6f5f3] px-5 sm:px-10">
      <div className="w-full rounded-[14px] border border-[#eeedea] bg-white px-5 py-[18px] shadow-[0_10px_30px_-20px_rgba(8,34,44,0.25)]">
        <div className="flex items-center gap-2.5 pb-2.5 font-mono text-[9.5px] font-medium uppercase leading-[13px] tracking-[0.7px] text-[#7d7973]">
          <span className="flex-1">Suchbegriff</span>
          <span className="w-[34px]">Pos.</span>
          <span className="w-[52px]">Trend</span>
        </div>
        {RANKS.map((r, i) => (
          <RankRow key={r.term} r={r} i={i} on={on} />
        ))}
      </div>
    </div>
  );
}

const BARS_UP = [25, 33, 29, 44, 50, 60, 56, 71, 79, 92];
const BARS_DOWN = [92, 84, 79, 70, 66, 55, 49, 42, 36, 30];

function Kpi({ label, value, falling }: { label: string; value: string; falling?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>(0.35);
  const bars = falling ? BARS_DOWN : BARS_UP;
  const [hover, setHover] = useState<number | null>(null);
  const T = falling ? TrendingDown : TrendingUp;
  return (
    <div ref={ref} className="flex h-full items-stretch bg-[#f6f5f3] px-5 py-6 sm:px-10">
      <div className="flex w-full flex-col gap-4 rounded-[14px] border border-[#eeedea] bg-white px-[22px] py-5 shadow-[0_10px_30px_-20px_rgba(8,34,44,0.25)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9.5px] font-medium uppercase leading-[13px] tracking-[0.8px] text-[#7d7973]">{label}</p>
            <p className="mt-0.5 font-display text-[30px] font-semibold leading-[34px] tracking-[-0.8px] text-[#1a1917]">{value}</p>
          </div>
          <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full bg-[#e7f4ed] px-2 text-[11px] font-medium text-[#0e5836]">
            <T className="size-3" strokeWidth={2.2} />
            30 Tage
          </span>
        </div>
        <div className="flex min-h-0 flex-1 items-end gap-2" onMouseLeave={() => setHover(null)}>
          {bars.map((h, i) => {
            const accent = i >= bars.length - 2;
            return (
              <span key={i} className="relative flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)}>
                <span
                  className={cn(
                    "block w-full rounded-[4px] transition-[height,background-color] ease-[cubic-bezier(.22,1,.36,1)]",
                    accent ? (hover === i ? "bg-[#b98c4f]" : "bg-[#d1aa71]") : hover === i ? "bg-[#d9d6d0]" : "bg-[#eeedea]",
                  )}
                  style={{ height: on ? `${h}%` : "0%", transitionDuration: "700ms, 200ms", transitionDelay: on ? `${i * 55}ms, 0ms` : "0ms" }}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CHANNELS: { brand: Brand; name: string }[] = [
  { brand: "google-ads", name: "Google Ads" },
  { brand: "meta", name: "Meta" },
  { brand: "tiktok", name: "TikTok" },
  { brand: "youtube", name: "YouTube" },
  { brand: "linkedin", name: "LinkedIn" },
  { brand: "instagram", name: "Instagram" },
  { brand: "google-analytics", name: "Google Analytics" },
  { brand: "google", name: "Google" },
];

function Channels() {
  const [ref, on] = useInView<HTMLDivElement>(0.35);
  const [hl, setHl] = useState(1);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (!on || hover !== null) return;
    const id = setInterval(() => setHl((h) => (h + 1) % CHANNELS.length), 1600);
    return () => clearInterval(id);
  }, [on, hover]);
  const active = hover ?? hl;
  return (
    <div ref={ref} className="flex h-full items-center justify-center bg-[#f6f5f3] px-5">
      <div className="grid w-full max-w-[340px] grid-cols-4 gap-3" onMouseLeave={() => setHover(null)}>
        {CHANNELS.map((c, i) => (
          <span
            key={c.name}
            title={c.name}
            onMouseEnter={() => setHover(i)}
            className={cn(
              "grid aspect-square place-items-center rounded-[14px] border transition-[background-color,border-color,box-shadow,scale,opacity] duration-300",
              active === i ? "scale-[1.05] border-[1.5px] border-[#d1aa71] bg-[#fbf6ee] shadow-[0_10px_24px_-14px_rgba(148,113,63,0.6)]" : "border-[#eeedea] bg-white",
            )}
            style={{ opacity: on ? 1 : 0, transitionDelay: on ? `${i * 50}ms` : "0ms" }}
          >
            <BrandLogo brand={c.brand} size={28} />
          </span>
        ))}
      </div>
    </div>
  );
}

function Visual({ v }: { v: PainVisual }) {
  if (v.kind === "image")
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={v.src} alt="" loading="lazy" className="bhp-img absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
    );
  if (v.kind === "rankings") return <Rankings />;
  if (v.kind === "kpi") return <Kpi label={v.label} value={v.value} falling={v.falling} />;
  return <Channels />;
}

/* ---- section --------------------------------------------------------------- */

export default function BranchePains({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = (trigger: string | HTMLElement, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".bh-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".bh-head") });
      gsap.utils.toArray<HTMLElement>(".bhp-card").forEach((card) => {
        gsap.from(card, { y: 44, opacity: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: st(card, "top 88%") });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-page py-20 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <SectionHead icon="target" eyebrow="Schmerz und Lösung" title="So _lösen_ wir es." />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {b.pains.map((p, i) => (
            <article
              key={i}
              className="bhp-card group flex flex-col overflow-hidden rounded-[24px] border border-[#eeedea] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-30px_rgba(8,34,44,0.35)]"
            >
              <div className="relative h-[240px] shrink-0 overflow-hidden sm:h-[300px]">
                <Visual v={p.visual} />
              </div>
              <div className="flex flex-col gap-3.5 px-6 pb-9 pt-7 sm:px-8 sm:pt-8">
                <p className="font-mono text-[12px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#7d7973]">Schmerz</p>
                <h3 className="font-display text-[clamp(1.3rem,2vw,1.5rem)] font-semibold leading-[1.25] tracking-[-0.025em] text-[#1a1917]">{p.title}</h3>
                <div className="h-px w-full bg-[#eeedea]" />
                <p className="font-mono text-[12px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#94713f]">So lösen wir es</p>
                <p className="text-[16px] leading-[26px] tracking-[-0.01em] text-[#5c5954]">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
