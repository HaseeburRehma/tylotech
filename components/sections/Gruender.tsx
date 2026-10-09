"use client";

import { useRef } from "react";
import { UserRound, Quote } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";

export default function Gruender() {
  const root = useRef<HTMLDivElement>(null);
  const t = useT();

  useGSAP(
    () => {
      gsap.from(".gr-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".gr-card", start: "top 85%" , toggleActions: "play none none none" },
      });
      gsap.from(".gr-photo", {
        y: 30,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".gr-card", start: "top 85%" , toggleActions: "play none none none" },
      });
      gsap.from(".gr-body > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".gr-body", start: "top 88%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="gruender" ref={root} className="bg-[#f6f5f3] py-16 lg:py-[120px]">
      <Container>
        {/* Figma "Brief": 64/72 padding, 72 gap on desktop; stacked on mobile */}
        <div className="gr-card flex flex-col items-center gap-8 overflow-hidden rounded-[24px] border border-[#eeedea] bg-white px-6 pb-8 pt-7 shadow-[0_2px_4px_rgba(8,34,44,0.04),0_6px_16px_rgba(8,34,44,0.07)] lg:flex-row lg:gap-[72px] lg:rounded-[32px] lg:py-16 lg:pl-16 lg:pr-[72px] lg:shadow-[0_51px_49px_rgba(8,34,44,0.03),0_23px_36px_rgba(8,34,44,0.05),0_7px_20px_rgba(8,34,44,0.06)]">
          {/* portrait: photo with a gold frame on two tilted dark cards (Figma "Porträt", 420×520 / mobile 302×330) */}
          <div className="gr-photo relative h-[330px] w-[302px] shrink-0 lg:h-[520px] lg:w-[420px]">
            <span
              aria-hidden
              className="absolute left-[21.6px] top-[36.2px] h-[300px] w-[250px] rotate-6 rounded-[20px] bg-[#0f0e0d] opacity-[0.22] lg:left-[14px] lg:top-[54.2px] lg:h-[470px] lg:w-[360px] lg:rotate-[7deg] lg:rounded-[26px]"
            />
            <span
              aria-hidden
              className="absolute left-[18px] top-[24.3px] h-[300px] w-[250px] rotate-3 rounded-[20px] bg-[#0f0e0d] opacity-45 lg:left-[15.3px] lg:top-[36.55px] lg:h-[470px] lg:w-[360px] lg:rotate-[3.5deg] lg:rounded-[26px]"
            />
            <div className="absolute left-[10px] top-[14px] h-[310px] w-[258px] overflow-hidden rounded-[20px] border-[1.5px] border-[#d1aa71] bg-[#0f0e0d] shadow-[0_51px_49px_rgba(8,34,44,0.03),0_23px_36px_rgba(8,34,44,0.05),0_7px_20px_rgba(8,34,44,0.06)] lg:left-[14px] lg:top-[20px] lg:h-[480px] lg:w-[370px] lg:rounded-[26px] lg:shadow-[0_80px_90px_rgba(8,34,44,0.04),0_40px_60px_rgba(8,34,44,0.06),0_12px_32px_rgba(8,34,44,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                decoding="async"
                src="/team/ilias-el-aradi-gruender.webp"
                width={760}
                height={1571}
                alt={t("Ilias El Aradi, Gründer von TyloTech", "Ilias El Aradi, founder of TyloTech")}
                className="absolute inset-0 h-full w-full object-cover object-[center_34%] lg:object-[center_38.5%]"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-[rgba(3,21,28,0)] via-[rgba(3,21,28,0.35)] to-[rgba(3,21,28,0.85)]"
              />
            </div>
          </div>

          {/* letter */}
          <div className="gr-body flex w-full min-w-0 flex-1 flex-col items-start gap-[18px] lg:gap-6">
            <p className="inline-flex w-fit items-center gap-[7px] rounded-full border border-[rgba(8,34,44,0.08)] bg-white/70 py-[7px] pl-2.5 pr-3.5 eyebrow text-[#5c5954] shadow-[0_8px_12px_rgba(8,34,44,0.08)] backdrop-blur-[8px]">
              <UserRound className="size-3.5 text-accent" />
              {t("Der Gründer", "The founder")}
            </p>

            <h2 className="t-h2 text-[#1a1917]">
              {t("Warum es", "Why")}{" "}
              <span className="t-serif tracking-[-0.6px] max-sm:tracking-normal text-[#94713f]">TyloTech</span>{" "}
              {t("gibt.", "exists.")}
            </h2>

            {/* key sentence */}
            <div className="flex w-full items-start gap-3 rounded-[16px] border border-[#d1aa71] bg-[#fbf6ee] py-4 pl-4 pr-[18px] lg:items-center lg:gap-4 lg:rounded-[18px] lg:py-5 lg:pl-[22px] lg:pr-[26px]">
              <Quote aria-hidden className="mt-1 size-[18px] shrink-0 fill-[#c79a53] text-[#c79a53] lg:mt-0 lg:size-[22px]" strokeWidth={0} />
              <p className="font-[family-name:var(--font-instrument)] text-[clamp(18px,calc(18px+3*(100vw-390px)/1050),21px)] font-normal italic leading-[clamp(26px,calc(26px+4*(100vw-390px)/1050),30px)] tracking-[clamp(-0.18px,calc(-0.16px-0.02*(100vw-390px)/1050),-0.16px)] text-[#1a1917]">
                {t(
                  <>
                    „Ich habe jeden dieser Prozesse selbst durchlaufen: Marketing, Code, Vertrieb, Aufbau. Deshalb
                    sehen wir, was andere übersehen. Und deshalb bauen wir mit, statt nur zu beraten.“
                  </>,
                  <>
                    “I’ve been through every one of these processes myself: marketing, code, sales, building a
                    company. That’s why we see what others miss. And that’s why we build with you instead of just
                    advising.”
                  </>,
                )}
              </p>
            </div>

            {/* signature */}
            <div className="flex w-full flex-col items-start gap-3 pt-2 lg:pt-4">
              <span aria-hidden className="block h-px w-16 bg-[#d1aa71] lg:w-[72px]" />
              <p className="font-display text-[clamp(20px,calc(20px+2*(100vw-390px)/1050),22px)] font-medium leading-[clamp(26px,calc(26px+2*(100vw-390px)/1050),28px)] tracking-[-0.4px] text-[#1a1917]">
                Ilias El Aradi
              </p>
              <p className="eyebrow text-[#7d7973]">
                {t("Gründer von TyloTech · Dein Wachstumspartner", "Founder of TyloTech · Your growth partner")}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
