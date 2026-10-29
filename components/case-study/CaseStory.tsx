"use client";

import { useRef } from "react";
import { Check, CircleAlert, Lightbulb, Palette, Search, Workflow } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/caseStudies";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { BRAND_FONTS } from "./brandFonts";
import { CsHead, NumberedCard, useCaseReveal } from "./ui";

/* Figma "03 · Überblick" — situation on the left, the brief as a checklist. */
export function CaseOverview({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={Lightbulb} eyebrow={t("Überblick", "Overview")} title={t("Worum es _ging._", "What it was _about._")} />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-20">
          <div data-rv className="flex flex-col gap-4">
            <p className="eyebrow text-[#7d7973]">{t("Ausgangslage", "Starting point")}</p>
            <p className="t-body-l text-[#1a1917]">{c.overview.situation[locale]}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p data-rv className="eyebrow text-[#7d7973]">{t("Aufgabe", "The brief")}</p>
            <ul data-rv-group className="flex flex-col gap-3.5">
              {c.overview.tasks[locale].map((task) => (
                <li key={task} className="flex items-start gap-3">
                  <span className="mt-[3px] grid size-5 shrink-0 place-items-center rounded-full bg-[#c79a53] text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="t-body-m text-[#5c5954]">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Figma "04 · Herausforderung" */
export function CaseChallenges({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-white py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={CircleAlert} eyebrow={t("Herausforderung", "Challenge")} title={t("Die _Herausforderung._", "The _challenge._")} sub={c.challenges.intro[locale]} />
        <div data-rv-group className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.challenges.items.map((card, i) => (
            <NumberedCard key={i} card={card} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Figma "05 · Erkenntnisse" — rendered only when the case has real findings. */
export function CaseInsights({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  useCaseReveal(root);
  if (!c.insights) return null;

  return (
    <section ref={root} data-nav-dark className="bg-[#001620] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead dark icon={Search} eyebrow="Research" title={t("Was wir _herausgefunden_ haben.", "What we _found out._")} sub={c.insights.intro[locale]} />
        <div data-rv-group className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.insights.items.map((card, i) => (
            <NumberedCard key={i} card={card} index={i} dark />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Figma "06 · Ansatz" — four process steps; the connector lines draw in. */
export function CaseApproach({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  useCaseReveal(root, () => {
    gsap.from(".cs-connector", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power2.out", stagger: 0.15, scrollTrigger: { trigger: ".cs-steps", start: "top 82%", toggleActions: "play none none none" } });
  });

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={Workflow} eyebrow={t("Vorgehen", "Approach")} title={t("So sind wir _vorgegangen._", "How we _went about it._")} sub={c.approach.intro[locale]} />
        <ol data-rv-group className="cs-steps grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {c.approach.steps.map((s, i) => (
            <li key={i} className="flex flex-col gap-5">
              <div className="flex items-center gap-3.5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-[#cbc8c2] bg-white font-mono text-[14px] font-medium leading-[18px] tracking-[0.4px] text-[#94713f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="cs-connector h-px flex-1 bg-[#e2e0dc]" />
              </div>
              <h3 className="t-h5 font-display font-medium text-[#1a1917]">{s.title[locale]}</h3>
              <p className="t-body-s text-[#5c5954]">{s.text[locale]}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* Figma "07 · Marke & Design" — logo, type specimen and the palette. */
export function CaseBrand({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  const b = c.brand;
  useCaseReveal(root, () => {
    gsap.from(".cs-swatch", { y: 24, scale: 0.94, opacity: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.06, clearProps: "transform,opacity", scrollTrigger: { trigger: ".cs-swatches", start: "top 88%", toggleActions: "play none none none" } });
  });

  return (
    <section ref={root} className="bg-white py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={Palette} eyebrow={t("Design-Richtung", "Design direction")} title={t("Marke und _Design-Richtung._", "Brand and _design direction._")} sub={b.intro[locale]} />
        <div data-rv-group className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="grid h-[154px] place-items-center overflow-hidden rounded-[20px] border border-[#eeedea] bg-[#0f0e0d] p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.logo.src} alt={c.client} width={b.logo.w} height={b.logo.h} loading="lazy" className="h-auto w-[240px] max-w-full sm:w-[280px]" />
          </div>
          <div className="flex h-[154px] flex-col justify-center gap-3.5 overflow-hidden rounded-[20px] border border-[#eeedea] bg-[#f6f5f3] px-7 sm:px-10">
            <p className={cn("whitespace-nowrap text-[34px] leading-none text-[#1a1917] sm:text-[44px]", BRAND_FONTS[b.type.font], b.type.font === "tomorrow" && "font-bold")}>
              {b.type.sample}
            </p>
            <p className="eyebrow text-[#7d7973]">{b.type.label}</p>
          </div>
        </div>
        <ul className="cs-swatches grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6 sm:gap-5">
          {b.colors.map((col) => (
            <li key={col.hex} className="cs-swatch flex flex-col gap-2.5">
              <span className="h-[72px] rounded-[14px] border border-[#eeedea] sm:h-[96px]" style={{ backgroundColor: col.hex }} />
              <span className="flex flex-col gap-0.5 text-[13px] leading-4">
                <span className="font-display font-medium tracking-[-0.24px] text-[#1a1917]">{col.name[locale]}</span>
                <span className="font-mono text-[#7d7973]">{col.hex}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
