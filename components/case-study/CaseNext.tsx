"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

/* Figma "13 · Nächstes Projekt" — the other case studies. */
export default function CaseNext({ current }: { current: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
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
        </div>
      </Container>
    </section>
  );
}
