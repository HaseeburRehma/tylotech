"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const ITEMS = [
  {
    q: "Seid ihr eine Agentur?",
    a: "Nein. Wir sind eine Unternehmensberatung, die baut — Marketing, Software und Vertrieb aus einer Hand, mit voller Verantwortung fürs Ergebnis.",
  },
  {
    q: "Was heißt „Shared Deals“?",
    a: "Bei passenden Projekten arbeiten wir nicht nur gegen Honorar, sondern beteiligen uns am Erfolg. Wir steigen mit ein, wenn wir an das Potenzial glauben — und tragen das Risiko mit.",
  },
  {
    q: "Für wen lohnt sich das?",
    a: "Für Unternehmen mit einem funktionierenden Angebot, die wachsen wollen, aber kein System dafür haben. Die Größe ist zweitrangig — die Bereitschaft, mitzuziehen, zählt.",
  },
  {
    q: "Was kostet die Zusammenarbeit?",
    a: "Das hängt vom Umfang ab, und wir nennen die Zahl im Erstgespräch, nicht erst im Angebot. Laufende Betreuung über monatliche Pakete, Projekte über Festpreise — keine Stundenzettel mit Überraschung am Monatsende.",
  },
  {
    q: "Wie schnell seht ihr Ergebnisse?",
    a: "Bezahlte Kampagnen liefern nach zwei bis drei Wochen belastbare Daten, organisches Wachstum braucht länger. Wir setzen Zwischenziele, damit du jederzeit siehst, wo du stehst.",
  },
];

/** `tone="branche"` follows the industry-page Figma frames (subtle surface, Accordion Item styling). */
export default function FAQ({ items = ITEMS, tone = "home" }: { items?: { q: string; a: string }[]; tone?: "home" | "branche" }) {
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
      className={br ? "scroll-mt-20 bg-[#f6f5f3] py-20 sm:py-24 lg:py-28" : "border-t border-line bg-[#f3f5f6] py-20 sm:py-24"}
    >
      <Container className={br ? "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-14 xl:gap-20" : "grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-14"}>
        <div className="faq-left">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <HelpCircle className="size-3.5 text-accent" />
            Häufige Fragen
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Fragen, die uns{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              fast jeder stellt.
            </span>
          </h2>

          <div className="mt-8 rounded-[18px] border border-line bg-white p-6 shadow-[0_18px_40px_-30px_rgba(15,14,13,0.2)]">
            <p className="text-[16px] font-semibold text-ink">
              Deine Frage steht nicht dabei?
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-[#5c5954]">
              Ruf einfach an:{" "}
              <a href="tel:+4921115847097" className="whitespace-nowrap font-medium text-ink underline-offset-2 hover:underline">
                0211 15847097
              </a>
              . Du sprichst direkt mit jemandem, der
              antworten kann.
            </p>
            <Link
              href="/kontakt"
              className="group mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[14px] font-medium text-ink shadow-[0_1px_3px_rgba(15,14,13,0.05)] transition-colors hover:border-ink/20 hover:bg-page"
            >
              Erstgespräch sichern
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
                  className={br ? "flex w-full items-center gap-6 py-5 pl-6 pr-5 text-left sm:py-[26px] sm:pl-8 sm:pr-6" : "flex w-full items-center gap-5 py-6 pl-7 pr-5 text-left"}
                  aria-expanded={on}
                >
                  <span
                    className={
                      br
                        ? "flex-1 font-display text-[clamp(17px,1.5vw,20px)] font-medium leading-[1.3] tracking-[-0.02em] text-[#1a1917]"
                        : "flex-1 font-display text-[clamp(16px,1.4vw,19px)] font-semibold leading-snug tracking-[-0.01em] text-ink"
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
                          ? "-mt-2.5 pb-6 pl-6 pr-6 text-[16px] leading-[26px] tracking-[-0.16px] text-[#5c5954] sm:pb-[26px] sm:pl-8 sm:pr-[92px]"
                          : "pb-6 pl-7 pr-[68px] text-[15px] leading-[1.65] text-[#5c5954]"
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
