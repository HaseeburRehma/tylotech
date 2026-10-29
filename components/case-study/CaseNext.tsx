"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Container from "../ui/Container";
import { CASE_STUDIES, plainTitle, type CaseStudy } from "@/lib/caseStudies";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";
import { CsEyebrow, useCaseReveal } from "./ui";
import { AutoSlider } from "./motion";

/* Figma "Case Study Card" — media, tags, title, one-liner. The whole card links. */
export function CaseCard({ c }: { c: CaseStudy }) {
  const locale = useLocale();
  const lp = useLocalePath();
  return (
    <Link
      href={lp(`/case-studies/${c.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e2e0dc] bg-white transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#e3c79e] hover:shadow-[0_22px_44px_-26px_rgba(8,34,44,0.35)]"
    >
      <AutoSlider
        className="h-[200px] bg-[#eeedea] sm:h-[230px]"
        sizes="(min-width: 768px) 50vw, 100vw"
        zoomClassName="group-hover:scale-[1.04]"
        slides={c.card.gallery.map((g) => ({ src: g.src, w: g.w, h: g.h, alt: g.alt[locale], pos: g.pos }))}
      />
      <div className="flex flex-1 flex-col gap-4 px-6 py-6 sm:px-7 sm:py-[26px]">
        <ul className="flex flex-wrap gap-2">
          {c.card.tags[locale].map((tag) => (
            <li key={tag} className="inline-flex h-6 items-center rounded-full bg-[#eeedea] px-2.5 text-[12px] font-medium leading-[17px] text-[#5c5954]">
              {tag}
            </li>
          ))}
        </ul>
        <h3 className="t-h4 font-display font-semibold text-[#1a1917]">{plainTitle(c, locale)}</h3>
        <p className="t-body-s text-[#5c5954]">{c.card.text[locale]}</p>
      </div>
    </Link>
  );
}

/* Figma "13 · Nächstes Projekt" — the other case studies plus a link to all of them. */
export default function CaseNext({ current }: { current: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const lp = useLocalePath();
  const others = CASE_STUDIES.filter((c) => c.slug !== current.slug);
  useCaseReveal(root);

  return (
    <section ref={root} className="bg-white py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-8">
        <div data-rv-group className="flex flex-col items-start gap-[18px]">
          <CsEyebrow icon={ArrowRight}>{t("Weiterlesen", "Keep reading")}</CsEyebrow>
          <h2 className="t-h2 text-[#1a1917]">{t("Weitere Case Studies.", "More case studies.")}</h2>
        </div>
        <div data-rv-group className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {others.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
          <Link
            href={lp("/case-studies")}
            className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[20px] border border-[#e2e0dc] bg-[#f6f5f3] p-7 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#e3c79e] hover:shadow-[0_22px_44px_-26px_rgba(8,34,44,0.35)] sm:p-8"
          >
            <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.28),transparent)]" />
            <span className="relative grid size-12 place-items-center rounded-[13px] bg-white text-[#c79a53] shadow-[0_1px_2px_rgba(8,34,44,0.06)]">
              <LayoutGrid className="size-[22px]" strokeWidth={1.7} aria-hidden />
            </span>
            <span className="relative flex flex-col gap-3">
              <span className="t-h4 font-display font-semibold text-[#1a1917]">{t("Alle Case Studies", "All case studies")}</span>
              <span className="t-body-s text-[#5c5954]">
                {t("Alle Projekte im Überblick, mit Ausgangslage, Vorgehen und Ergebnissen.", "Every project at a glance, with starting point, approach and results.")}
              </span>
              <span className="mt-2 inline-flex items-center gap-2 t-button text-[#1a1917]">
                {t("Zur Übersicht", "See the overview")}
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.8} />
              </span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
