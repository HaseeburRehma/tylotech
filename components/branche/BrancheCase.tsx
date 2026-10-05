"use client";

import { useRef } from "react";
import { CircleCheck, X } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Branche } from "@/lib/branchen";
import { Accent, Eyebrow } from "./ui";

/* Figma shows dashed "PLATZHALTER" notes where numbers will go once a case is
 * live (in-card note + "next case" teaser below). Shown as designed; set to
 * false to hide the in-card notes once real figures are in. */
const SHOW_PLACEHOLDERS = true;

/* Figma-style dashed outline (6/5 dashes, 1.5px) — a CSS dashed border is too faint and fine */
const dashed = (color: string, r: number) => ({
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='${r}' ry='${r}' stroke='%23${color}' stroke-width='3' stroke-dasharray='6%2c 5' stroke-linecap='round'/%3e%3c/svg%3e")`,
});

export default function BrancheCase({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);
  const c = b.case;

  useGSAP(
    () => {
      const st = { trigger: ".bhc-card", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".bhc-card", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
      gsap.from(".bhc-content > *", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.15, scrollTrigger: st });
      if (root.current?.querySelector(".bhc-extra"))
        gsap.from(".bhc-extra", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".bhc-extra", start: "top 92%", toggleActions: "play none none none" } });
      gsap.from(".bhc-visual", { y: 30, opacity: 0, scale: 0.96, duration: 1, ease: "power3.out", delay: 0.2, scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section id="case" ref={root} className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-6">
        <div className="bhc-card flex flex-col items-center gap-10 overflow-hidden rounded-[28px] border border-[#eeedea] bg-white p-6 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:rounded-[32px] sm:p-10 lg:flex-row lg:gap-16 lg:p-16">
          <div className="bhc-content flex w-full min-w-0 flex-1 flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <Eyebrow icon="award">Case / Beweis</Eyebrow>
              {c.logo === "rohrcleaner" && (
                <span
                  aria-label="Rohr Cleaner"
                  role="img"
                  className="block h-10 w-12 bg-[#7d7973]"
                  style={{ WebkitMaskImage: "url(/partners/rohrcleaner.png)", maskImage: "url(/partners/rohrcleaner.png)", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }}
                />
              )}
            </div>
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1a1917]">
              <Accent text={c.title} />
            </h2>
            {c.text && <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.01em] text-[#5c5954]">{c.text}</p>}

            {c.before && (
              <div className="flex w-full flex-col gap-3.5">
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#7d7973]">Ausgangssituation</p>
                <ul className="flex flex-col gap-3">
                  {c.before.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[17px] leading-[28px] tracking-[-0.01em] text-[#5c5954] sm:text-[18px]">
                      <X className="mt-[3px] size-[22px] shrink-0 text-[#b4502f]" strokeWidth={1.8} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.before && c.after && <div className="h-px w-full bg-[#e2e0dc]" />}
            {c.after && (
              <div className="flex w-full flex-col gap-3.5">
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#94713f]">Ergebnis mit TyloTech</p>
                <ul className="flex flex-col gap-3">
                  {c.after.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[17px] leading-[28px] tracking-[-0.01em] text-[#1a1917] sm:text-[18px]">
                      <CircleCheck className="mt-[3px] size-[22px] shrink-0 fill-[#c08f4b] text-white" strokeWidth={2} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {SHOW_PLACEHOLDERS && (
              <div className="flex w-full flex-col gap-1.5 rounded-[18px] bg-[#fbf6ee] px-[22px] py-[18px]" style={dashed("D1AA71", 18)}>
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#94713f]">Platzhalter</p>
                <p className="text-[16px] leading-[26px] text-[#5c5954]">{c.placeholder}</p>
              </div>
            )}
          </div>

          <div
            className={cn(
              "bhc-visual group relative aspect-square w-full max-w-[520px] shrink-0 overflow-hidden rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)] lg:w-[min(520px,45%)]",
              c.image ? "bg-[#eeedea]" : "bg-[#fbf6ee]",
            )}
          >
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]", c.imageFit === "top" && "object-top")}
              />
            ) : (
              c.tyloLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="absolute left-1/2 top-1/2 w-[35%] -translate-x-1/2 -translate-y-1/2" />
              )
            )}
            {c.image && c.tyloLogo && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(3,21,28,0)_0%,rgba(3,21,28,0.55)_100%)]" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[16px] border border-white/60 bg-white/90 py-3 pl-3.5 pr-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:bottom-6 sm:left-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="h-6 w-auto sm:h-7" />
                  <span className="h-6 w-px bg-[#e2e0dc]" />
                  <span className="font-mono text-[10.5px] font-medium uppercase leading-[13px] tracking-[0.4px] text-[#94713f] sm:text-[11px]">
                    Eigene
                    <br />
                    Marke
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {c.extraPlaceholder && (
          <div className="bhc-extra flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-[20px] px-5 py-4 sm:px-7 sm:py-5" style={dashed("CBC8C2", 20)}>
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#7d7973]">Platzhalter</p>
            <p className="text-[16px] text-[#5c5954]">{c.extraPlaceholder}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
