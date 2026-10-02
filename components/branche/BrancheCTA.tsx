"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Branche } from "@/lib/branchen";

/* Figma "10 · CTA" — dark teal panel with a cool and a warm glow, per-industry eyebrow. */
export default function BrancheCTA({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: ".bhc-panel", start: "top 85%", toggleActions: "play none none none" };
      gsap.from(".bhc-panel", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
      gsap.from(".bhc-in > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.15, scrollTrigger: st });
      gsap.to(".bhc-glow", { opacity: 0.55, scale: 1.08, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  return (
    <section id="kontakt" ref={root} className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-[100px]">
      <Container>
        <div
          className="bhc-panel relative overflow-hidden rounded-[28px] border border-[rgba(209,170,113,0.28)] px-6 py-14 shadow-[0_28px_70px_rgba(4,22,29,0.3)] sm:rounded-[36px] sm:px-12 sm:py-[76px] lg:px-20"
          style={{
            backgroundImage:
              "radial-gradient(58% 46% at 14% 18%, rgba(29,115,145,0.28), rgba(29,115,145,0.05) 60%, transparent), linear-gradient(151deg, #0a4157 12%, #012e3e 43%, #00151e 80%)",
          }}
        >
          {/* warm glow, gently breathing */}
          <div
            aria-hidden
            className="bhc-glow pointer-events-none absolute left-[59%] top-[64%] h-[75%] w-[95%] -translate-x-1/2 -translate-y-1/2 opacity-90"
            style={{ background: "radial-gradient(closest-side, rgba(209,170,113,0.42), rgba(209,170,113,0.1) 50%, transparent)" }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.14)]" />

          <div className="bhc-in relative mx-auto flex max-w-[860px] flex-col items-center gap-[26px] text-center">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/[0.22] bg-white/[0.12] py-2 pl-2.5 pr-4 text-[13px] font-medium leading-[18px] tracking-[-0.2px] text-white/[0.92] backdrop-blur-md sm:text-[14px]">
              <Calendar className="size-[15px] shrink-0 text-[#d8b682]" strokeWidth={1.8} />
              <span className="min-w-0">{b.ctaEyebrow}</span>
            </p>
            <h2 className="font-display text-[clamp(2.1rem,4.6vw,3.375rem)] font-semibold leading-[1.11] tracking-[-0.033em] text-white">
              Bereit, dein Wachstum{" "}
              <span className="font-[family-name:var(--font-instrument)] text-[1.07em] font-normal italic tracking-[-0.01em]">planbar</span> zu machen?
            </h2>
            <p className="max-w-[720px] text-[clamp(16px,1.5vw,18px)] leading-[1.56] tracking-[-0.01em] text-white/[0.94]">
              Kein Verkaufsgespräch. Eine ehrliche Einschätzung, wo dein größter Hebel liegt — und ob wir zueinander passen.
            </p>
            <Link
              href={`/kontakt?branche=${b.slug}`}
              className="group relative inline-flex items-center gap-3.5 rounded-full py-2 pl-2 pr-[30px] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate] duration-200 hover:-translate-y-0.5 hover:brightness-105"
              style={{ backgroundImage: "linear-gradient(90deg, #efdcbc 0%, #d8b681 45%, #b4894d 100%)" }}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#17485b,#04161d)] text-white">
                <ArrowRight className="size-[19px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
              </span>
              <span className="whitespace-nowrap text-[18px] font-medium leading-6 tracking-[-0.3px] text-[#04161d]">
                <span className="font-[family-name:var(--font-instrument)] text-[19px] font-normal italic">Erstgespräch</span> sichern
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
