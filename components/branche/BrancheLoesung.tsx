"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Branche, Kanal } from "@/lib/branchen";
import { BrandLogo, Eyebrow, GoldButton, Icon } from "./ui";

/* Figma "System-Fluss" frame: 600×420, channels left, hub centre, results right */
const KANAL_Y = [31, 135, 239, 343];
const ERGEBNIS_Y = [47.5, 177.5, 307.5];
const HUB = { x: 248, y: 158, size: 104 };

function KanalIcon({ k, size = 22 }: { k: Kanal; size?: number }) {
  if (k.brand) return <BrandLogo brand={k.brand} size={size} dark />;
  return <Icon name={k.icon ?? "sparkles"} className="shrink-0 text-white" strokeWidth={1.7} />;
}

function Flow({ b }: { b: Branche }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / 600)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cy = HUB.y + HUB.size / 2; // 210
  const inPaths = KANAL_Y.map((y) => {
    const y0 = y + 23;
    return `M178 ${y0} C 216 ${y0}, 212 ${cy}, ${HUB.x} ${cy}`;
  });
  const outPaths = ERGEBNIS_Y.map((y) => {
    const y1 = y + 32.5;
    return `M${HUB.x + HUB.size} ${cy} C 380 ${cy}, 376 ${y1}, 404 ${y1}`;
  });

  return (
    <div ref={box} className="w-full max-w-[600px]" style={{ height: 420 * scale }}>
      <div className="bhl-flow relative origin-top-left" style={{ width: 600, height: 420, transform: `scale(${scale})` }}>
        <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full" aria-hidden>
          {[...inPaths, ...outPaths].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#d1aa71" strokeOpacity={0.55} strokeWidth={1.4} />
          ))}
          {[...inPaths, ...outPaths].map((d, i) => (
            <path
              key={`p${i}`}
              className="aw-flow"
              d={d}
              fill="none"
              stroke="#f0d6a8"
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.16 0.84"
              strokeDashoffset={1}
              style={{ animationDelay: `${(i % 4) * 0.35 + (i >= 4 ? 0.9 : 0)}s` }}
            />
          ))}
        </svg>

        {/* hub */}
        <div
          className="bhl-hub absolute grid place-items-center rounded-full border border-[#d1aa71] bg-[#002e3d] shadow-[0_6px_24px_rgba(209,170,113,0.4)]"
          style={{ left: HUB.x, top: HUB.y, width: HUB.size, height: HUB.size }}
        >
          <span className="absolute inset-0 animate-[bhlPulse_2.8s_ease-out_infinite] rounded-full border border-[#d1aa71]/60" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/tylotech-mark.svg" alt="TyloTech" className="h-[46px] w-[37px]" />
        </div>

        {b.loesung.kanaele.map((k, i) => (
          <div
            key={k.label}
            className="bhl-kanal absolute flex h-[46px] w-[178px] items-center gap-2.5 rounded-[14px] border border-[#43413d] bg-[#002230] px-3.5 transition-colors duration-300 hover:border-[#d1aa71]"
            style={{ left: 0, top: KANAL_Y[i] }}
          >
            <KanalIcon k={k} />
            <span className="whitespace-nowrap font-display text-[14px] font-medium leading-[18px] tracking-[-0.02em] text-white">{k.label}</span>
          </div>
        ))}

        {b.loesung.ergebnisse.map((e, i) => (
          <div
            key={i}
            className="bhl-ergebnis absolute flex w-[196px] flex-col gap-[5px] rounded-[14px] border border-[#43413d] bg-[#002e3d] px-4 py-[13px] shadow-[0_16px_44px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-[#d1aa71]"
            style={{ left: 404, top: ERGEBNIS_Y[i] }}
          >
            <span className="whitespace-nowrap font-mono text-[12px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#d8b682]">{e.label}</span>
            <span className="whitespace-nowrap font-display text-[14px] font-medium leading-[18px] tracking-[-0.02em] text-white">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* stacked version for phones */
function FlowStacked({ b }: { b: Branche }) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="grid w-full grid-cols-2 gap-2.5">
        {b.loesung.kanaele.map((k) => (
          <div key={k.label} className="bhl-kanal flex min-h-[46px] items-center gap-2 rounded-[14px] border border-[#43413d] bg-[#002230] px-3 py-2">
            <KanalIcon k={k} size={20} />
            <span className="font-display text-[12.5px] font-medium leading-[15px] tracking-[-0.02em] text-white">{k.label}</span>
          </div>
        ))}
      </div>
      <ArrowDown className="size-4 text-[#d1aa71]" />
      <div className="bhl-hub relative grid size-[84px] place-items-center rounded-full border border-[#d1aa71] bg-[#002e3d] shadow-[0_6px_24px_rgba(209,170,113,0.4)]">
        <span className="absolute inset-0 animate-[bhlPulse_2.8s_ease-out_infinite] rounded-full border border-[#d1aa71]/60" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/tylotech-mark.svg" alt="TyloTech" className="h-[37px] w-[30px]" />
      </div>
      <ArrowDown className="size-4 text-[#d1aa71]" />
      <div className="flex w-full flex-col gap-2.5">
        {b.loesung.ergebnisse.map((e, i) => (
          <div key={i} className="bhl-ergebnis flex flex-col gap-[5px] rounded-[14px] border border-[#43413d] bg-[#002e3d] px-4 py-3 shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.4px] text-[#d8b682]">{e.label}</span>
            <span className="font-display text-[14px] font-medium tracking-[-0.02em] text-white">{e.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BrancheLoesung({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = (trigger: string, start = "top 80%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".bhl-panel", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: st(".bhl-panel", "top 85%") });
      gsap.from(".bhl-text > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.09, scrollTrigger: st(".bhl-panel") });
      gsap.from(".bhl-kanal", { x: -24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".bhl-panel") });
      gsap.from(".bhl-hub", { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.35, scrollTrigger: st(".bhl-panel") });
      gsap.from(".bhl-ergebnis", { x: 24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.12, delay: 0.6, scrollTrigger: st(".bhl-panel") });
      gsap.from(".bhl-pillar", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: st(".bhl-pillars", "top 88%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white py-20 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-5">
        <div
          className="bhl-panel relative flex flex-col items-center gap-12 overflow-hidden rounded-[28px] border border-[rgba(209,170,113,0.28)] px-6 py-10 sm:rounded-[36px] sm:px-10 sm:py-14 lg:flex-row lg:gap-14 lg:py-16 lg:pl-16 lg:pr-14"
          style={{
            backgroundImage:
              "radial-gradient(58% 45% at 14% 18%, rgba(29,115,145,0.28), rgba(29,115,145,0.05) 60%, transparent), radial-gradient(47% 37% at 59% 64%, rgba(209,170,113,0.42), rgba(209,170,113,0.1) 50%, transparent), linear-gradient(149deg, #0a4157 12%, #012e3e 43%, #00151e 80%)",
          }}
        >
          <div className="bhl-text flex w-full min-w-0 flex-col items-start gap-6 lg:flex-1">
            <Eyebrow icon="layers" dark>
              Unsere Lösung
            </Eyebrow>
            <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white">
              Ein System,
              <br />
              <span className="font-[family-name:var(--font-instrument)] text-[1.06em] font-normal italic tracking-[-0.02em] text-[#d8b682]">
                ein Ansprechpartner.
              </span>
            </h2>
            <p className="max-w-[502px] text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.01em] text-[#cbc8c2]">{b.loesung.text}</p>
            <GoldButton href="#kontakt" size="md">
              {b.hero.cta}
            </GoldButton>
          </div>
          <div className="hidden w-full justify-center sm:flex lg:w-auto lg:shrink-0">
            <Flow b={b} />
          </div>
          <div className="w-full sm:hidden">
            <FlowStacked b={b} />
          </div>
        </div>

        <div className="bhl-pillars grid grid-cols-1 gap-5 md:grid-cols-3">
          {b.loesung.pillars.map((p) => (
            <article
              key={p.title}
              className="bhl-pillar group overflow-hidden rounded-[20px] border border-[#e2e0dc] bg-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-26px_rgba(8,34,44,0.3)]"
            >
              <div className="h-1 w-full origin-left bg-[#d1aa71] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex flex-col gap-[18px] p-7 sm:p-8">
                <span className="grid size-[50px] place-items-center rounded-[13px] bg-[#fbf6ee] text-[#c79a53]">
                  <Icon name={p.icon} className="size-[23px]" />
                </span>
                <h3 className="font-display text-[22px] font-semibold leading-[1.25] tracking-[-0.025em] text-[#1a1917] sm:text-[24px]">{p.title}</h3>
                <p className="text-[16px] leading-[26px] tracking-[-0.01em] text-[#5c5954]">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
