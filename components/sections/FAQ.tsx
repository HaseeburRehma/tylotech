"use client";

import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { gsap, useGSAP } from "@/lib/gsap";

const ITEMS = [
  {
    q: "Wie lange dauert es, bis erste Ergebnisse sichtbar werden?",
    a: "Das hängt vom Kanal ab. Bezahlte Kampagnen liefern nach zwei bis drei Wochen belastbare Daten, SEO und organisches Wachstum brauchen drei bis sechs Monate. Wir legen im Strategiegespräch Zwischenziele fest, damit Sie jederzeit sehen, wo Sie stehen — statt auf einen Bericht am Quartalsende zu warten.",
  },
  {
    q: "Was kostet die Zusammenarbeit?",
    a: "Das hängt vom Umfang ab, und wir nennen die Zahl im Erstgespräch — nicht erst im Angebot. Laufende Betreuung läuft über monatliche Pakete, Projekte über Festpreise. Was wir nicht machen: Stundenzettel, bei denen am Monatsende eine Überraschung steht.",
  },
  {
    q: "Arbeiten Sie auch mit kleinen Unternehmen?",
    a: "Ja. Ein großer Teil unserer Partner sind Handwerksbetriebe, Dienstleister und inhabergeführte Unternehmen. Entscheidend ist nicht die Größe, sondern ob Sie wirklich etwas verändern wollen.",
  },
  {
    q: "Bekommen wir Zugriff auf unsere Konten und Daten?",
    a: "Ja, ohne Diskussion. Werbekonten, Analytics, Domain und Quellcode gehören Ihnen — von Anfang an und auch dann, wenn die Zusammenarbeit endet. Wir halten nichts als Pfand.",
  },
  {
    q: "Wer arbeitet konkret an unserem Projekt?",
    a: "Ein festes Team mit einem Ansprechpartner, den Sie namentlich kennen. Keine wechselnden Junior-Kräfte, kein Ticket-System, keine anonyme Support-Adresse.",
  },
  {
    q: "Können wir klein anfangen?",
    a: "Können Sie. Viele starten mit einer Website oder einem Audit und entscheiden danach, ob mehr Sinn ergibt. Wir drängen niemanden in eine Jahresbindung.",
  },
  {
    q: "Was ist TyloHQ und müssen wir das nutzen?",
    a: "TyloHQ ist unsere Plattform für Zahlen, Freigaben und Kommunikation. Sie können sie nutzen, müssen aber nicht — wer lieber telefoniert, telefoniert.",
  },
  {
    q: "Wie steht es um Datenschutz und DSGVO?",
    a: "Verarbeitung DSGVO-konform, Hosting in Deutschland. Auftragsverarbeitungsvertrag bekommen Sie vor Projektstart, nicht auf Nachfrage.",
  },
];

export default function FAQ() {
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
        scrollTrigger: { trigger: ".faq-left", start: "top 82%" },
      });
      gsap.from(".faq-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".faq-list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="faq" ref={root} className="bg-[#001620] py-24 text-white">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[400px_1fr]">
        <div className="faq-left">
          <p className="eyebrow mb-[18px] flex items-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Häufige Fragen
          </p>
          <h2 className="display-m text-white">Fragen, die uns fast jeder stellt.</h2>

          <div className="mt-8 rounded-[18px] border border-[#0a4a5f] bg-[#04283a]/60 p-6">
            <p className="text-[16px] font-medium text-white">
              Ihre Frage steht nicht dabei?
            </p>
            <p className="mt-2 text-[14px] leading-[22px] text-[#b3d6e2]">
              Rufen Sie einfach an — 0211 15847697. Sie sprechen direkt mit
              jemandem, der antworten kann.
            </p>
            <Button href="#termin" variant="dark" withArrow className="mt-5">
              Erstgespräch buchen
            </Button>
          </div>
        </div>

        <div className="faq-list flex flex-col gap-3">
          {ITEMS.map((item, i) => {
            const on = open === i;
            return (
              <div
                key={item.q}
                className={`faq-item rounded-[18px] border bg-[#04283a]/60 transition-[border-color,box-shadow] duration-200 ${
                  on
                    ? "border-[#0e6883] shadow-[0_2px_5px_-1px_rgba(15,14,13,0.05)]"
                    : "border-[#0a4a5f]"
                }`}
              >
                <button
                  onClick={() => setOpen(on ? -1 : i)}
                  className="flex w-full items-center gap-6 py-[26px] pl-8 pr-6 text-left"
                  aria-expanded={on}
                >
                  <span className="flex-1 font-display text-[20px] font-semibold leading-[26px] tracking-[-0.2px] text-white">
                    {item.q}
                  </span>
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                      on ? "bg-[#002e3d] text-white" : "bg-white/[0.06] text-white"
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
                    <p className="pb-[26px] pl-8 pr-[68px] text-[16px] leading-[26px] text-[#b3d6e2]">
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
