"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { Accent } from "../branche/ui";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";
import { BrowserBar, CsEyebrow, useCaseReveal } from "./ui";

/* Case-studies overview (no Figma frame): hero in the case-study hero style,
   then one large card per project, alternating sides on desktop. */
export function CasesHero() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-white pb-12 pt-10 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-[88px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-60 left-[32%] h-[760px] w-[1180px] max-w-none"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(209,170,113,0.3) 0%, rgba(209,170,113,0.09) 45%, rgba(209,170,113,0) 100%)" }}
      />
      <Container className="relative flex flex-col items-start gap-6">
        <CsEyebrow icon={Award} className="intro-up">
          Case Studies
        </CsEyebrow>
        <h1 className="t-h1 intro-up max-w-[820px] text-[#1a1917] [animation-delay:80ms]">
          <Accent text={t("Echte Projekte, _echte Zahlen._", "Real projects, _real numbers._")} />
        </h1>
        <p className="t-body-xl intro-up max-w-[680px] text-[#5c5954] [animation-delay:160ms]">
          {t(
            "Wie wir Marken aufbauen, Websites entwickeln und Kampagnen fahren, Schritt für Schritt erzählt: von der Ausgangslage über das Vorgehen bis zu den Ergebnissen.",
            "How we build brands, develop websites and run campaigns, told step by step: from the starting point through the approach to the results.",
          )}
        </p>
      </Container>
    </section>
  );
}

export function CasesList() {
  const root = useRef<HTMLElement>(null);
  const locale = useLocale();
  const lp = useLocalePath();
  const t = useT();
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-white pb-16 sm:pb-24 lg:pb-28">
      <Container className="flex flex-col gap-8 lg:gap-10">
        {CASE_STUDIES.map((c, i) => {
          const href = lp(`/case-studies/${c.slug}`);
          return (
            <article
              key={c.slug}
              data-rv={i === 0 ? undefined : ""}
              className={cn(
                i === 0 && "intro-up [animation-delay:240ms]",
                "group grid grid-cols-1 overflow-hidden rounded-[28px] border border-[#e2e0dc] bg-[#f6f5f3] transition-[box-shadow,border-color] duration-300 hover:border-[#e3c79e] hover:shadow-[0_30px_60px_-36px_rgba(8,34,44,0.4)] lg:grid-cols-[1.15fr_1fr]",
              )}
            >
              <Link href={href} tabIndex={-1} aria-hidden className={cn("block p-4 sm:p-6 lg:p-8", i % 2 === 1 && "lg:order-2")}>
                <div className="overflow-hidden rounded-2xl border border-[#e2e0dc] bg-white shadow-[0_8px_24px_rgba(26,23,20,0.06)]">
                  <BrowserBar domain={c.domain} />
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.hero.slides[0].src}
                      width={c.hero.slides[0].w}
                      height={c.hero.slides[0].h}
                      alt={c.hero.slides[0].alt[locale]}
                      srcSet={`${c.hero.slideSmall} 760w, ${c.hero.slides[0].src} ${c.hero.slides[0].w}w`}
                      sizes="(min-width: 1024px) 680px, (min-width: 640px) calc(100vw - 128px), calc(100vw - 80px)"
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </Link>
              <div className="flex flex-col justify-center gap-6 px-6 pb-8 sm:px-10 sm:pb-10 lg:py-12 lg:pl-6 lg:pr-12">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-[#94713f]">{String(i + 1).padStart(2, "0")}</span>
                  <ul className="flex flex-wrap gap-2">
                    {c.card.tags[locale].map((tag) => (
                      <li key={tag} className="inline-flex h-6 items-center rounded-full bg-white px-2.5 text-[12px] font-medium leading-[17px] text-[#5c5954]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <h2 className="t-h2-s text-[#1a1917]">
                  <Link href={href} className="transition-colors hover:text-[#94713f]">
                    <Accent text={c.hero.title[locale]} />
                  </Link>
                </h2>
                <p className="t-body-m text-[#5c5954]">{c.card.text[locale]}</p>
                <dl className="grid grid-cols-2 gap-4 border-t border-[#e2e0dc] pt-6">
                  {c.card.metrics.map((m) => (
                    <div key={m.label.de} className="flex flex-col gap-1">
                      <dt className="order-2 t-body-s text-[#5c5954]">{m.label[locale]}</dt>
                      <dd className="font-display text-[28px] font-semibold leading-[34px] tracking-[-0.8px] text-[#1a1917] sm:text-[32px] sm:leading-[38px]">{m.value[locale]}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  href={href}
                  className="inline-flex h-12 w-fit items-center gap-2 rounded-full border-[1.5px] border-[#1a1917] bg-white px-[22px] t-button text-[#1a1917] transition-colors duration-200 hover:bg-[#1a1917] hover:text-white"
                >
                  {t("Case Study lesen", "Read the case study")}
                  <ArrowRight className="size-[18px]" strokeWidth={1.8} />
                </Link>
              </div>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
