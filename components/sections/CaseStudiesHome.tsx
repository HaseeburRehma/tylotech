"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import Container from "../ui/Container";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { Accent } from "../branche/ui";
import { CaseCard } from "../case-study/CaseNext";
import { CsEyebrow, useCaseReveal } from "../case-study/ui";
import { useLocalePath, useT } from "../i18n/LocaleProvider";

/* Home: all case studies as a swipeable row of cards, with a link to the overview. */
export default function CaseStudiesHome() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const t = useT();
  const lp = useLocalePath();
  useCaseReveal(root);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  const arrow =
    "size-12 items-center justify-center rounded-full border border-[#e2e0dc] bg-white text-[#1a1917] transition-colors duration-200 hover:border-[#1a1917]";

  return (
    <section id="case-studies" ref={root} className="overflow-x-clip border-t border-line bg-white py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div data-rv-group className="flex max-w-[760px] flex-col items-start gap-5">
            <CsEyebrow icon={Award}>Case Studies</CsEyebrow>
            <h2 className="t-h2 text-[#1a1917]">
              <Accent text={t("Echte Projekte, _echte Zahlen._", "Real projects, _real numbers._")} />
            </h2>
            <p className="t-body-l max-w-[600px] text-[#5c5954]">
              {t(
                "Von der Ausgangslage über das Vorgehen bis zu den Ergebnissen: so sehen unsere Projekte von innen aus.",
                "From the starting point through the approach to the results: this is what our projects look like from the inside.",
              )}
            </p>
          </div>
          <div data-rv className="flex items-center gap-3">
            <button type="button" onClick={() => step(-1)} className={`${arrow} hidden md:inline-flex`} aria-label={t("Zurück", "Previous")}>
              <ArrowLeft className="size-[18px]" strokeWidth={1.8} aria-hidden />
            </button>
            <button type="button" onClick={() => step(1)} className={`${arrow} hidden md:inline-flex`} aria-label={t("Weiter", "Next")}>
              <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden />
            </button>
            <Link
              href={lp("/case-studies")}
              className="group inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-full border-[1.5px] border-ink bg-white px-[22px] t-button text-ink transition-colors duration-200 hover:bg-ink hover:text-white md:ml-2"
            >
              {t("Alle Case Studies", "All case studies")}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.8} aria-hidden />
            </Link>
          </div>
        </div>

        <ul
          ref={track}
          data-rv-group
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-2 [scrollbar-width:none] md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {CASE_STUDIES.map((c) => (
            <li key={c.slug} className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]">
              <CaseCard c={c} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
