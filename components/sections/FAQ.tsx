"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";

const ITEMS_DE = [
  {
    q: "Seid ihr eine Agentur?",
    a: "Nein. Wir sind eine Unternehmensberatung, die baut: Marketing, Software und Vertrieb aus einer Hand, mit voller Verantwortung fürs Ergebnis.",
  },
  {
    q: "Was heißt „Shared Deals“?",
    a: "Bei passenden Projekten arbeiten wir nicht nur gegen Honorar, sondern beteiligen uns am Erfolg. Wir steigen mit ein, wenn wir an das Potenzial glauben, und tragen das Risiko mit.",
  },
  {
    q: "Für wen lohnt sich das?",
    a: "Für Unternehmen mit einem funktionierenden Angebot, die wachsen wollen, aber kein System dafür haben. Die Größe ist zweitrangig. Was zählt, ist die Bereitschaft, mitzuziehen.",
  },
  {
    q: "Was kostet die Zusammenarbeit?",
    a: "Das hängt vom Umfang ab, und wir nennen die Zahl im Erstgespräch, nicht erst im Angebot. Laufende Betreuung über monatliche Pakete, Projekte über Festpreise. Keine Stundenzettel mit Überraschung am Monatsende.",
  },
  {
    q: "Wie schnell seht ihr Ergebnisse?",
    a: "Bezahlte Kampagnen liefern nach zwei bis drei Wochen belastbare Daten, organisches Wachstum braucht länger. Wir setzen Zwischenziele, damit du jederzeit siehst, wo du stehst.",
  },
];

const ITEMS_EN = [
  {
    q: "Are you an agency?",
    a: "No. We’re a consultancy that builds: marketing, software and sales from a single source, with full responsibility for the result.",
  },
  {
    q: "What does “shared deals” mean?",
    a: "On the right projects, we don’t just work for a fee. We take a share in the success. We buy in when we believe in the potential, and we share the risk.",
  },
  {
    q: "Who is this worth it for?",
    a: "For businesses with an offer that works, that want to grow but have no system for it. Size is secondary. What counts is the willingness to pull your weight.",
  },
  {
    q: "What does working together cost?",
    a: "That depends on the scope, and we give you the number in the intro call, not only in the proposal. Ongoing support runs on monthly packages, projects on fixed prices. No timesheets with a surprise at the end of the month.",
  },
  {
    q: "How quickly will I see results?",
    a: "Paid campaigns deliver reliable data after two to three weeks; organic growth takes longer. We set milestones so you always know where you stand.",
  },
];

/** `tone="branche"` follows the industry-page Figma frames (subtle surface, Accordion Item styling). */
export default function FAQ({ items: itemsProp, tone = "home" }: { items?: { q: string; a: string }[]; tone?: "home" | "branche" }) {
  const locale = useLocale();
  const t = useT();
  const lp = useLocalePath();
  const items = itemsProp ?? (locale === "en" ? ITEMS_EN : ITEMS_DE);
  const br = tone === "branche";
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      gsap.from(".faq-left > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".faq-left", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".faq-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".faq-list", start: "top 85%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="faq"
      ref={root}
      className={br ? "scroll-mt-20 bg-[#f6f5f3] py-14 sm:py-24 lg:py-28" : "border-t border-line bg-[#f3f5f6] py-14 sm:py-24"}
    >
      <Container className={br ? "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14 xl:gap-20" : "grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-14"}>
        <div className="faq-left">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 eyebrow text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <HelpCircle className="size-3.5 text-accent" />
            {t("Häufige Fragen", "Common questions")}
          </p>
          <h2 className="t-h2 mt-5 text-ink">
            {t("Fragen, die uns", "Questions")}{" "}
            <span className="t-serif tracking-[inherit] text-[#a07d45] max-sm:tracking-[-0.5px]">
              {t("fast jeder stellt.", "almost everyone asks.")}
            </span>
          </h2>

          <div className="mt-8 rounded-[18px] border border-line bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,14,13,0.2)]">
            <p className="font-display text-[17px] font-medium leading-[24px] tracking-[-0.3px] text-ink max-sm:font-semibold max-sm:tracking-normal">
              {t("Deine Frage steht nicht dabei?", "Your question isn’t here?")}
            </p>
            <p className="t-body-s mt-2 text-[#5c5954]">
              {t("Ruf einfach an:", "Just give us a call:")}{" "}
              <a href="tel:+4921115847097" className="whitespace-nowrap font-medium text-ink underline-offset-2 hover:underline">
                {t("0211 15847097", "+49 211 15847097")}
              </a>
              {t(
                ". Du sprichst direkt mit jemandem, der antworten kann.",
                ". You’ll speak directly to someone who can actually answer.",
              )}
            </p>
            <Link
              href={lp("/kontakt")}
              className="group mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 t-button text-ink shadow-[0_1px_3px_rgba(15,14,13,0.05)] transition-colors hover:border-ink/20 hover:bg-page"
            >
              {t("Erstgespräch sichern", "Book your intro call")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="faq-list flex flex-col gap-3">
          {items.map((item, i) => {
            const on = open === i;
            return (
              <div
                key={item.q}
                className={`faq-item rounded-[18px] border bg-white transition-[border-color,box-shadow] duration-200 ${
                  br
                    ? on
                      ? "border-[#eeedea] shadow-[0_2px_4px_rgba(8,34,44,0.04),0_6px_16px_rgba(8,34,44,0.07)]"
                      : "border-[#eeedea] shadow-[0_1px_2px_rgba(8,34,44,0.06)] hover:border-[#e2e0dc]"
                    : on
                      ? "border-[#e6d1a4] shadow-[0_20px_44px_-30px_rgba(15,14,13,0.25)]"
                      : "border-line"
                }`}
              >
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  className={br ? `flex w-full items-center gap-6 py-5 pl-6 pr-5 text-left transition-[padding] duration-300 sm:py-[26px] sm:pl-8 sm:pr-6 ${on ? "pb-2.5 sm:pb-4" : ""}` : "flex w-full items-center gap-5 py-6 pl-7 pr-5 text-left"}
                  aria-expanded={on}
                >
                  <span
                    className={
                      br
                        ? "t-h5 flex-1 text-[#1a1917]"
                        : "t-h5 flex-1 text-ink"
                    }
                  >
                    {item.q}
                  </span>
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-200 ${
                      br
                        ? on
                          ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] text-[#1a1917] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)]"
                          : "border border-[#eeedea] bg-[#f6f5f3] text-[#7d7973]"
                        : on
                          ? "bg-gradient-to-b from-[#e2ba7d] to-[#c99f5c] text-white shadow-[0_8px_18px_-6px_rgba(201,159,92,0.75)]"
                          : "bg-[#f2efe9] text-[#94713f]"
                    }`}
                  >
                    {on ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: on ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p
                      className={
                        br
                          ? "t-body-m pb-6 pl-6 pr-6 text-[#5c5954] sm:pb-[26px] sm:pl-8 sm:pr-[92px]"
                          : "t-body-m pb-6 pl-7 pr-[68px] text-[#5c5954]"
                      }
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
