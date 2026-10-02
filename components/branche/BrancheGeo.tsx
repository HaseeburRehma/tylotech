"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { BrandLogo, Eyebrow, Icon } from "./ui";

export default function BrancheGeo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: ".bhg-visual", start: "top 78%", toggleActions: "play none none none" };
      gsap.from(".bhg-text > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: { ...st, trigger: ".bhg-text", start: "top 82%" } });
      const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: "power3.out" } });
      tl.from(".bhg-card", { y: 30, opacity: 0, duration: 0.8 })
        .from(".bhg-q", { x: 30, opacity: 0, duration: 0.6 }, 0.35)
        .from(".bhg-dots", { opacity: 0, duration: 0.3 }, 0.8)
        .from(".bhg-a", { y: 12, opacity: 0, duration: 0.6 }, 1.25)
        .from(".bhg-rec", { y: 14, opacity: 0, scale: 0.97, duration: 0.6 }, 1.45)
        .from(".bhg-google", { y: 18, opacity: 0, duration: 0.6 }, 1.7);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav-dark className="bg-[#001620] py-20 sm:py-24 lg:py-[120px]">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,564px)] lg:gap-[88px]">
        <div className="bhg-text flex flex-col items-start gap-6">
          <Eyebrow icon="sparkles" dark>
            Unfairer Vorsprung
          </Eyebrow>
          <h2 className="font-display text-[clamp(2.1rem,4.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white">
            Auch{" "}
            <span className="font-[family-name:var(--font-instrument)] text-[1.06em] font-normal italic tracking-[-0.02em] text-[#d8b682]">die KI</span>{" "}
            empfiehlt dich.
          </h2>
          <p className="max-w-[628px] text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.01em] text-[#cbc8c2]">
            Immer öfter fragen Kunden direkt eine KI wie ChatGPT oder Perplexity um Rat. Wer dort nicht auftaucht, existiert für diese Kunden nicht.
          </p>
          <p className="text-[clamp(16px,1.4vw,18px)] leading-[1.6] tracking-[-0.01em] text-white">Genau das haben wir für Rohr Cleaner erreicht: heute Platz 1.</p>
        </div>

        <div className="bhg-visual relative pb-12 lg:pb-[36px] lg:pl-6">
          <div className="bhg-card flex flex-col gap-5 rounded-[24px] border border-[#43413d] bg-[#002230] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.35)] sm:p-7">
            <p className="flex items-center gap-2.5 font-display text-[14px] font-medium tracking-[-0.02em] text-[#cbc8c2]">
              <Icon name="sparkles" className="size-[18px] text-[#d8b682]" />
              KI-Suche
            </p>
            <div className="bhg-q flex justify-end">
              <p className="max-w-[352px] rounded-[16px] bg-[#01475c] px-4 py-3 text-[15px] leading-[24px] tracking-[-0.01em] text-white sm:text-[16px] sm:leading-[26px]">
                Welche Rohrreinigung in Düsseldorf ist empfehlenswert?
              </p>
            </div>
            <p className="bhg-a text-[15px] leading-[26px] tracking-[-0.01em] text-[#cbc8c2] sm:text-[16px]">
              Für Rohrreinigung in Düsseldorf wird <span className="text-[#d8b682]">Rohr Cleaner</span> empfohlen.
            </p>
            <div className="bhg-rec flex items-center gap-3.5 rounded-[16px] border border-[#d1aa71] bg-[#46351e] px-4 py-3.5">
              <span className="grid shrink-0 place-items-center rounded-[10px] bg-white px-2 py-1.5">
                <span
                  className="block h-10 w-12 bg-[#a6a29b]"
                  style={{ WebkitMaskImage: "url(/partners/rohrcleaner.png)", maskImage: "url(/partners/rohrcleaner.png)", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }}
                />
              </span>
              <span className="flex-1 font-display text-[16px] font-medium tracking-[-0.02em] text-white">Rohr Cleaner</span>
              <span className="rounded-full bg-[#46351e] px-2.5 py-1 text-[12px] font-medium text-[#d8b682]">Platz 1</span>
            </div>
            <span className="bhg-dots flex gap-[5px]">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-[7px] animate-[bhgDot_1.2s_ease-in-out_infinite] rounded-full bg-[#d8b682]" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
          </div>
          <div className="bhg-google absolute bottom-0 left-0 flex items-center gap-3 rounded-[14px] border border-[#43413d] bg-[#002e3d] py-3 pl-3.5 pr-[18px] shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
            <BrandLogo brand="google" size={24} />
            <span className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#d8b682] sm:text-[12px]">Google Suche</span>
              <span className="whitespace-nowrap font-display text-[14px] font-medium tracking-[-0.02em] text-white">Rohr Cleaner: Platz 1 bei Google</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
