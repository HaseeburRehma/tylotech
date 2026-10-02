"use client";

import { useRef } from "react";
import { CircleCheck, X } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Branche } from "@/lib/branchen";
import { Accent, Eyebrow } from "./ui";

/* Figma shows dashed "PLATZHALTER" notes where numbers will go once a case is
 * live. They are internal to-dos, so they stay hidden on the live site; flip
 * this to true to show them (e.g. for a review build). */
const SHOW_PLACEHOLDERS = false;

export default function BrancheCase({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);
  const c = b.case;

  useGSAP(
    () => {
      const st = { trigger: ".bhc-card", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".bhc-card", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
      gsap.from(".bhc-content > *", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.15, scrollTrigger: st });
      gsap.from(".bhc-visual", { y: 30, opacity: 0, scale: 0.96, duration: 1, ease: "power3.out", delay: 0.2, scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section id="case" ref={root} className="scroll-mt-20 bg-page py-20 sm:py-24 lg:py-28">
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
              <div className="flex w-full flex-col gap-1.5 rounded-[18px] border border-dashed border-[#d1aa71] bg-[#fbf6ee] px-[22px] py-[18px]">
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#94713f]">Platzhalter</p>
                <p className="text-[16px] leading-[26px] text-[#5c5954]">{c.placeholder}</p>
              </div>
            )}
          </div>

          <div
            className={cn(
              "bhc-visual relative aspect-square w-full max-w-[520px] shrink-0 overflow-hidden rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)] lg:w-[min(520px,42%)]",
              c.tyloLogo ? "bg-[#fbf6ee]" : "bg-[#eeedea]",
            )}
          >
            {c.tyloLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/brand/tylotech-logo.svg" alt="TyloTech" className="absolute left-1/2 top-1/2 w-[35%] -translate-x-1/2 -translate-y-1/2" />
            ) : (
              c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.image} alt="" loading="lazy" className={cn("absolute inset-0 h-full w-full object-cover", c.imageFit === "top" && "object-top")} />
              )
            )}
          </div>
        </div>

        {SHOW_PLACEHOLDERS && c.extraPlaceholder && (
          <div className="flex flex-wrap items-center gap-4 rounded-[20px] border border-dashed border-[#cbc8c2] px-7 py-5">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.4px] text-[#7d7973]">Platzhalter</p>
            <p className="text-[16px] text-[#5c5954]">{c.extraPlaceholder}</p>
          </div>
        )}
      </Container>
    </section>
  );
}
