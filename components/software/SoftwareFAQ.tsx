"use client";

import { useRef, useState } from "react";
import { CircleHelp, Minus, Plus } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Eyebrow, H2, Serif } from "./ui";

export default function SoftwareFAQ() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const [open, setOpen] = useState(0);
  const items = [
    { q: t("Was kostet das am Ende?", "What does it cost in the end?"), a: t("Fester Preis, vorab im Bauplan festgelegt. Keine versteckten Kosten.", "A fixed price, set in advance in the blueprint. No hidden costs.") },
    { q: t("Wie lange dauert es?", "How long does it take?"), a: t("Erste nutzbare Version in 6 Wochen, Rest iterativ.", "First usable version in 6 weeks, the rest in iterations.") },
    { q: t("Was, wenn's nicht funktioniert?", "What if it doesn’t work?"), a: t("Fertig-Garantie: wir bauen, bis alles stimmt.", "Completion guarantee: we keep building until everything’s right.") },
    { q: t("Lohnt sich das für meine Größe?", "Is it worth it for a business my size?"), a: t("Genau das klären wir kostenlos im Bauplan.", "That’s exactly what we work out in the free blueprint.") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".swf-left > *, .swf-hint", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".swf-left") });
      gsap.from(".swf-item", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, scrollTrigger: st(".swf-list") });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="faq" className="scroll-mt-20 bg-[#f6f5f3] py-16 sm:py-[112px]">
      <Container className="max-sm:px-5 grid grid-cols-1 gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-7">
        <div className="swf-left flex flex-col items-start gap-[18px] lg:col-start-1 lg:row-start-1">
          <Eyebrow icon={CircleHelp}>FAQ</Eyebrow>
          <h2 className={H2}>
            {t("Die", "The")} <Serif>{t("echten", "real")}</Serif>
            <span className="text-[#1a1917]"> {t("Fragen.", "questions.")}</span>
          </h2>
        </div>

        <div className="swf-list flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {items.map((item, i) => {
            const on = open === i;
            const panel = `swf-a-${i}`;
            return (
              <div
                key={item.q}
                className={cn(
                  "swf-item rounded-[18px] border border-[#eeedea] bg-white transition-[border-color,box-shadow] duration-200",
                  on ? "shadow-[0_2px_4px_rgba(8,34,44,0.04),0_6px_16px_rgba(8,34,44,0.07)]" : "shadow-[0_1px_2px_rgba(8,34,44,0.06)] hover:border-[#e2e0dc]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                  aria-controls={panel}
                  className={cn("flex w-full items-center gap-6 py-5 pl-6 pr-5 text-left transition-[padding] duration-300 sm:py-[26px] sm:pl-8 sm:pr-6", on && "pb-2.5 sm:pb-4")}
                >
                  <span className="t-h5 flex-1 text-[#1a1917]">{item.q}</span>
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full transition-all duration-200",
                      on
                        ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] text-[#1a1917] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)]"
                        : "border border-[#eeedea] bg-[#f6f5f3] text-[#c79a53]",
                    )}
                  >
                    {on ? <Minus className="size-5" aria-hidden /> : <Plus className="size-5" aria-hidden />}
                  </span>
                </button>
                <div id={panel} role="region" className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
                  <div className="min-h-0">
                    <p className="t-body-m pb-6 pl-6 pr-6 text-[#5c5954] sm:pb-[26px] sm:pl-8 sm:pr-[92px]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="swf-hint flex flex-col items-start gap-3.5 self-start rounded-[16px] border border-[#e2e0dc] bg-white p-6 lg:col-start-1 lg:row-start-2">
          <p className="t-h6 text-[#1a1917]">{t("Noch eine Frage offen?", "Still have a question?")}</p>
          <p className="t-body-s text-[#5c5954]">
            {t("Stell sie einfach in der Bewerbung. Wir melden uns innerhalb von 24 Stunden.", "Just ask it in your application. We’ll get back to you within 24 hours.")}
          </p>
          <ApplyButton label={t("Jetzt bewerben", "Apply now")} variant="outline" className="max-lg:w-full" />
        </div>
      </Container>
    </section>
  );
}
