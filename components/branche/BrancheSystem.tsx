"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Branche } from "@/lib/branchen";
import { SectionHead } from "./ui";

export default function BrancheSystem({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".bh-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".bh-head") });
      gsap.from(".bhs-step", { y: 28, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity", scrollTrigger: st(".bhs-grid") });
      gsap.from(".bhs-line", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.25, scrollTrigger: st(".bhs-grid") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="border-t border-[#eeedea] bg-page py-20 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <SectionHead icon="workflow" eyebrow="Unser System" title="Sechs Bausteine, die _ineinandergreifen_." />
        <div className="bhs-grid grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {b.steps.map((s, i) => (
            <article
              key={s.title}
              className="bhs-step group flex flex-col gap-5 rounded-[20px] border border-[#eeedea] bg-[#f6f5f3] px-7 pb-8 pt-7 transition-[background-color,border-color,translate,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#e3c79e] hover:bg-white hover:shadow-[0_18px_36px_-24px_rgba(8,34,44,0.3)]"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#cbc8c2] bg-white font-mono text-[14px] font-medium tracking-[0.4px] text-[#94713f] transition-colors duration-300 group-hover:border-[#d1aa71] group-hover:bg-[#fbf6ee]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="bhs-line h-px flex-1 bg-[#e2e0dc]" />
              </div>
              <h3 className="font-display text-[19px] font-medium leading-[26px] tracking-[-0.02em] text-[#1a1917] sm:text-[20px]">{s.title}</h3>
              <p className="text-[14px] leading-[22px] tracking-[-0.1px] text-[#5c5954]">{s.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
