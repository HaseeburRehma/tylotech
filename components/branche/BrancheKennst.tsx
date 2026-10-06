"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Branche } from "@/lib/branchen";
import { Accent, Icon, SectionHead } from "./ui";
import { useT } from "../i18n/LocaleProvider";

export default function BrancheKennst({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);
  const k = b.kennst;
  const t = useT();

  useGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".bh-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".bh-head") });
      gsap.from(".bhk-card", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, clearProps: "transform,opacity", scrollTrigger: st(".bhk-grid") });
      gsap.from(".bhk-grund", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st(".bhk-grund", "top 85%") });
      gsap.from(".bhk-grund-img img", { scale: 1.12, duration: 1.4, ease: "power2.out", scrollTrigger: st(".bhk-grund", "top 85%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <SectionHead center icon="circle-alert" eyebrow={t("Das Problem", "The problem")} title={t("„Kennst du das?“", "“Sound familiar?”")} sub={k.intro} />

        <div className="bhk-grid grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {k.points.map((p, i) => (
            <article
              key={i}
              className="bhk-card group flex flex-col gap-6 rounded-[20px] border border-[#eeedea] bg-white px-7 pb-8 pt-7 shadow-[0_1px_2px_rgba(8,34,44,0.06)] transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#e3c79e] hover:shadow-[0_18px_36px_-22px_rgba(8,34,44,0.3)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-[13px] bg-[#fbf6ee] text-[#c79a53] transition-colors duration-300 group-hover:bg-[#f5e9d4]">
                  <Icon name={p.icon} className="size-[22px]" />
                </span>
                <span className="font-mono text-[13px] leading-4 text-[#7d7973]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="font-display text-[17px] font-medium leading-6 tracking-[-0.02em] text-[#1a1917]">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="bhk-grund flex flex-col overflow-hidden rounded-[24px] border border-[#eeedea] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] md:min-h-[260px] md:flex-row">
          <div className="flex flex-1 items-center p-7 sm:p-10 lg:p-14">
            <p className="font-display text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-[1.3] tracking-[-0.025em] text-[#1a1917]">
              <Accent text={k.grund} />
            </p>
          </div>
          <div className="bhk-grund-img relative aspect-[480/258] shrink-0 overflow-hidden md:aspect-auto md:w-[42%] lg:w-[480px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={k.grundImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </Container>
    </section>
  );
}
