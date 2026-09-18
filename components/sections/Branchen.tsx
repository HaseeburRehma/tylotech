"use client";

import { useRef } from "react";
import { Hammer, Sparkles, Utensils, GraduationCap, Users, House } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

const INDUSTRIES = [
  { icon: Hammer, title: "Handwerk & Sanierung", body: "Sanierung, Rohrreinigung, Elektro — Betriebe, die Aufträge brauchen, keine Klicks." },
  { icon: Sparkles, title: "Gebäudeservice & Reinigung", body: "Von der Unterhaltsreinigung bis zur Glasreinigung: planbare Anfragen statt Zufall." },
  { icon: Utensils, title: "Gastronomie & Lieferdienste", body: "Filialen, Bestellstrecken und Kampagnen, die den Laden auch unter der Woche füllen." },
  { icon: GraduationCap, title: "Fahrschulen & Bildung", body: "Anmeldungen, Theoriepläne und ein Auftritt, den Fahrschüler weiterempfehlen." },
  { icon: Users, title: "Personal & Recruiting", body: "Stellen, die tatsächlich besetzt werden — mit Abläufen, die auch ohne Sie laufen." },
  { icon: House, title: "Immobilien & Verwaltung", body: "Objekte, Anfragen und Interessenten sauber sortiert statt verstreut im Posteingang." },
];

export default function Branchen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".branchen-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".branchen-head", start: "top 82%" },
      });
      gsap.from(".branchen-cell", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".branchen-grid", start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="branchen" ref={root} className="bg-page py-24">
      <Container>
        <SectionHeading
          className="branchen-head"
          eyebrow="Branchen"
          title="Wo wir uns auskennen."
          subtitle="Wir arbeiten nicht für jeden. In diesen sechs Bereichen kennen wir die Abläufe so gut, dass wir vom ersten Tag an mitreden können."
        />

        <div className="branchen-grid mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="branchen-cell group flex flex-col gap-[22px] bg-white px-8 pb-[34px] pt-8 transition-colors hover:bg-[#fcfbfa]"
            >
              <span className="grid size-[72px] place-items-center rounded-[18px] bg-gradient-to-br from-[#35768a] to-[#0d3646] text-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <Icon className="size-8" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink">
                  {title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[22px] text-[#5c5954]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
