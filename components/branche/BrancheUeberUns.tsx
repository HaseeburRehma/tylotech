"use client";

import { useRef } from "react";
import { Quote } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "./ui";

/* Figma "08 · Über uns" — a letter card: stacked portrait left, founder quote right.
   Portrait positions are % of Figma's 420×520 frame so it scales on smaller screens. */
export default function BrancheUeberUns() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: ".bhu-card", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".bhu-card", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
      gsap.from(".bhu-photo", { y: 30, opacity: 0, scale: 0.96, duration: 0.9, ease: "power3.out", delay: 0.15, scrollTrigger: st });
      // the two cards behind fan out from under the photo
      gsap.from(".bhu-back", {
        rotation: (_: number, el: HTMLElement) => Number(el.dataset.tilt),
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.35,
        stagger: 0.12,
        clearProps: "transform",
        scrollTrigger: st,
      });
      gsap.from(".bhu-text > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.09, delay: 0.2, scrollTrigger: st });
      gsap.from(".bhu-line", { scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power3.out", delay: 0.8, scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section id="gruender" ref={root} className="scroll-mt-20 bg-[#f6f5f3] py-14 sm:py-24 lg:py-[120px]">
      <Container>
        <div className="bhu-card flex flex-col items-center gap-10 overflow-hidden rounded-[24px] border border-[#eeedea] bg-white px-5 py-8 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:rounded-[32px] sm:p-12 lg:flex-row lg:gap-[72px] lg:py-16 lg:pl-16 lg:pr-[72px]">
          {/* portrait */}
          <div className="group relative aspect-[420/520] w-full max-w-[340px] shrink-0 sm:max-w-[420px] lg:w-[380px] xl:w-[420px]">
            {/* outer wrapper is animated by GSAP (fan-out), inner card holds the resting tilt + hover */}
            <div className="bhu-back absolute left-[3.33%] top-[10.42%] h-[90.38%] w-[85.71%]" data-tilt="-7">
              <div className="h-full w-full rotate-[7deg] rounded-[26px] bg-[#0f0e0d] opacity-[0.22] transition-[rotate] duration-500 ease-out group-hover:rotate-[9deg]" />
            </div>
            <div className="bhu-back absolute left-[3.65%] top-[7.03%] h-[90.38%] w-[85.71%]" data-tilt="-3.5">
              <div className="h-full w-full rotate-[3.5deg] rounded-[26px] bg-[#0f0e0d] opacity-[0.45] transition-[rotate] duration-500 ease-out group-hover:rotate-[5deg]" />
            </div>
            <div className="bhu-photo absolute left-[3.33%] top-[3.85%] h-[92.31%] w-[88.1%] overflow-hidden rounded-[26px] border-[1.5px] border-[#d1aa71] shadow-[0_12px_32px_rgba(8,34,44,0.1),0_40px_60px_rgba(8,34,44,0.06),0_80px_90px_rgba(8,34,44,0.04)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/branchen/gruender.webp"
                alt="Ilias El Aradi, Gründer von TyloTech"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(3,21,28,0)_0%,rgba(3,21,28,0.35)_50%,rgba(3,21,28,0.85)_100%)]" />
            </div>
          </div>

          {/* letter */}
          <div className="bhu-text flex w-full min-w-0 flex-col items-start gap-6 lg:flex-1">
            <Eyebrow icon="user">Der Gründer</Eyebrow>
            <h2 className="font-display text-[clamp(2rem,3.4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1a1917]">
              Warum es{" "}
              <span className="font-[family-name:var(--font-instrument)] text-[1.05em] font-normal italic tracking-[-0.015em] text-[#94713f]">TyloTech</span>{" "}
              gibt.
            </h2>
            <blockquote className="flex w-full items-start gap-4 sm:items-center rounded-[18px] border border-[#d1aa71] bg-[#fbf6ee] py-5 pl-[22px] pr-[26px]">
              <Quote className="mt-1 size-[22px] shrink-0 sm:mt-0 fill-[#c79a53] text-[#c79a53]" strokeWidth={0} aria-hidden />
              <p className="font-[family-name:var(--font-instrument)] text-[clamp(18px,1.6vw,21px)] italic leading-[1.43] tracking-[-0.18px] text-[#1a1917]">
                „Ich habe jeden dieser Prozesse selbst durchlaufen — Marketing, Code, Vertrieb, Aufbau. Deshalb sehen wir, was andere übersehen. Und
                deshalb bauen wir mit, statt nur zu beraten.“
              </p>
            </blockquote>
            <div className="flex flex-col gap-3 pt-4">
              <span className="bhu-line block h-px w-[72px] bg-[#d1aa71]" />
              <p className="font-display text-[22px] font-medium leading-[28px] tracking-[-0.4px] text-[#1a1917]">Ilias El Aradi</p>
              <p className="font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#7d7973] sm:text-[12px]">
                Gründer von TyloTech · Dein Wachstumspartner
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
