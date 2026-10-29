"use client";

import { useRef } from "react";
import { Lightbulb, Megaphone, Monitor, Smartphone } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import type { CaseStudy } from "@/lib/caseStudies";
import { Accent } from "../branche/ui";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { BrowserFrame, CsEyebrow, CsHead, InstagramIcon, NumberedCard, PhoneFrame, useCaseReveal } from "./ui";

/* Figma "08 · Website" — feature row, one wide page, two pages side by side. */
export function CaseWebsite({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  const w = c.website;
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <CsHead icon={Monitor} eyebrow={t("Lösung", "Solution")} title={t("Die _Website._", "The _website._")} sub={w.intro[locale]} />

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[440fr_776fr] lg:gap-16">
          <div data-rv className="flex flex-col gap-4">
            <h3 className="t-h3 text-[#1a1917]">{w.feature.title[locale]}</h3>
            <p className="t-body-m text-[#5c5954]">{w.feature.text[locale]}</p>
          </div>
          <div data-rv>
            <BrowserFrame domain={c.domain} shot={w.feature.shot} ratio={776 / 463} sizes="(min-width: 1024px) 776px, 100vw" parallax />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div data-rv>
            <BrowserFrame domain={c.domain} shot={w.wide.shot} ratio={1280 / (w.wide.height - 37)} parallax />
          </div>
          <div data-rv className="grid grid-cols-1 gap-3 md:grid-cols-[480px_1fr] md:gap-16">
            <h3 className="t-h4 font-display font-semibold text-[#1a1917]">{w.wide.title[locale]}</h3>
            <p className="t-body-m text-[#5c5954]">{w.wide.text[locale]}</p>
          </div>
        </div>

        <div data-rv-group className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6">
          {w.pair.map((p) => (
            <figure key={p.shot.src} className="flex flex-col gap-3.5">
              <BrowserFrame domain={c.domain} shot={p.shot} ratio={628 / 363} sizes="(min-width: 768px) 628px, 100vw" />
              <figcaption className="font-display text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#5c5954]">{p.caption[locale]}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Figma "09 · Mobile & Stories" — either three phones next to the copy, or a
   row of story mockups under it. Phones/stories scroll sideways on small screens. */
export function CaseMobile({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const m = c.mobile;
  useCaseReveal(root, () => {
    gsap.from(".cs-device", { y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, clearProps: "opacity", scrollTrigger: { trigger: ".cs-devices", start: "top 85%", toggleActions: "play none none none" } });
    if (window.innerWidth >= 1024) {
      gsap.utils.toArray<HTMLElement>(".cs-device").forEach((d, i) => {
        gsap.to(d, { y: i % 2 ? -36 : 24, ease: "none", scrollTrigger: { trigger: ".cs-devices", start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  });

  const text = (
    <div data-rv-group className="flex flex-col items-start gap-5">
      <CsEyebrow dark icon={m.kind === "devices" ? Smartphone : InstagramIcon}>
        {m.eyebrow[locale]}
      </CsEyebrow>
      <h2 className="t-h2 text-white">
        <Accent text={m.title[locale]} dark />
      </h2>
      <p className="t-body-l text-[#cbc8c2]">{m.text[locale]}</p>
    </div>
  );

  const scroller = "cs-devices no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:overflow-visible lg:px-0";

  return (
    <section ref={root} data-nav-dark className="overflow-hidden bg-[#001620] py-16 sm:py-24 lg:py-28">
      <Container>
        {m.kind === "devices" ? (
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[420px_1fr] lg:gap-16">
            <div className="max-w-[560px]">{text}</div>
            <div className={cn(scroller, "items-center lg:gap-[3.4%]")}>
              {m.phones.map((src, i) => (
                <PhoneFrame
                  key={src}
                  src={src}
                  alt=""
                  className={cn("cs-device snap-center", i === 1 ? "w-[250px] lg:w-[37.6%]" : "w-[200px] lg:w-[27.8%]")}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 lg:gap-14">
            <div className="max-w-[560px]">{text}</div>
            <div className={cn(scroller, "items-start lg:justify-center lg:gap-[50px] lg:pb-[120px]")}>
              {m.items.map((it, i) =>
                it.type === "phone" ? (
                  <PhoneFrame key={it.src} src={it.src} alt={it.alt[locale]} className={cn("cs-device w-[240px] snap-center lg:w-[282px]", i % 2 === 1 && "lg:translate-y-[120px]")} />
                ) : (
                  <div key={it.src} className={cn("cs-device relative aspect-[282/579] w-[240px] shrink-0 snap-center overflow-hidden rounded-[18px] bg-black shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] lg:w-[282px]", i % 2 === 1 && "lg:translate-y-[120px]")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt={it.alt[locale]} width={564} height={1158} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

/* Figma "10 · Social Media" — six posts, 3 × 2. */
export function CaseSocial({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={InstagramIcon} eyebrow="Social Media" title={c.social.title[locale]} sub={c.social.intro[locale]} />
        <ul data-rv-group className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
          {c.social.posts.map((p) => (
            <li key={p.src} className="group relative aspect-[413/516] overflow-hidden rounded-2xl border border-[#eeedea] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt[locale]}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 768px) 413px, 50vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* Figma "11 · Offline" — the big outdoor shot, optionally two more print pieces. */
export function CaseOffline({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  const o = c.offline;
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-white py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={Megaphone} eyebrow={t("Print & Außenwerbung", "Print & outdoor")} title={o.title[locale]} sub={o.intro[locale]} />
        <div data-rv className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)] sm:aspect-[1280/720] sm:rounded-[24px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={o.main.src} alt={o.main.alt[locale]} loading="lazy" decoding="async" sizes="(min-width: 1440px) 1280px, 100vw" data-parallax="4" className="absolute inset-0 h-full w-full scale-110 object-cover" />
        </div>
        {o.extra && (
          <div data-rv-group className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {o.extra.map((x) => (
              <div key={x.src} className="relative aspect-[628/480] overflow-hidden rounded-[20px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.src} alt={x.alt[locale]} loading="lazy" decoding="async" sizes="(min-width: 640px) 628px, 100vw" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/* Figma "12 · Learnings" — rendered only when the case has real learnings. */
export function CaseLearnings({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  useCaseReveal(root);
  if (!c.learnings) return null;

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={Lightbulb} eyebrow="Learnings" title={t("Was wir _mitnehmen._", "What we _take away._")} sub={c.learnings.intro[locale]} />
        <div data-rv-group className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {c.learnings.items.map((card, i) => (
            <NumberedCard key={i} card={card} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
