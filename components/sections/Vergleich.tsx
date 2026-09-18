"use client";

import { useRef } from "react";
import { X, Check } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

const ROWS = [
  { c: "Ansprechpartner", a: "Wechselndes Ticket-Team", b: "Ein fester Ansprechpartner mit Namen" },
  { c: "Zuständigkeit", a: "Drei Dienstleister, drei Rechnungen", b: "Marketing, Software und Prozesse im Haus", hl: true },
  { c: "Berichte", a: "PDF am Quartalsende", b: "Echtzeit-Zahlen jederzeit in TyloHQ" },
  { c: "Empfehlungen", a: "Was gerade im Paket steckt", b: "Auch mal: „Das brauchen Sie nicht.“", hl: true },
  { c: "Nach dem Launch", a: "Support-Ticket ziehen und warten", b: "Derselbe Ansprechpartner bleibt" },
  { c: "Konten und Daten", a: "Zugänge bleiben bei der Agentur", b: "Alle Zugänge gehören Ihnen — von Anfang an", hl: true },
];

export default function Vergleich() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".verg-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".verg-head", start: "top 82%" },
      });
      gsap.from(".verg-table", {
        y: 34,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".verg-table", start: "top 84%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="vergleich" ref={root} className="bg-page py-24">
      <Container>
        <SectionHeading
          className="verg-head"
          eyebrow="Unterschied"
          title="Woran Sie merken, dass es anders läuft."
          subtitle="Kein Angriff auf andere Agenturen — sondern die Punkte, an denen Kunden uns immer wieder sagen, dass es bei ihnen vorher anders war."
        />

        <div className="verg-table mt-14 overflow-x-auto no-scrollbar">
          <div className="min-w-[760px] overflow-hidden rounded-[20px] border border-line bg-white">
            {/* header */}
            <div className="flex items-center gap-6 border-b border-line bg-[#f6f5f3] px-7 py-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.9px]">
              <span className="flex-1 text-[#7d7973]" />
              <span className="w-[280px] shrink-0 text-[#7d7973]">Üblich am Markt</span>
              <span className="w-[300px] shrink-0 text-[#94713f]">Bei TyloTech</span>
            </div>
            {ROWS.map((r) => (
              <div
                key={r.c}
                className={`flex items-center gap-6 border-b border-[#eeedea] px-7 py-5 last:border-b-0 ${
                  r.hl ? "bg-[#f6f5f3]" : "bg-white"
                }`}
              >
                <span className="flex-1 text-[16px] font-medium tracking-[-0.1px] text-ink">
                  {r.c}
                </span>
                <span className="flex w-[280px] shrink-0 items-center gap-2.5">
                  <X className="size-[18px] shrink-0 text-[#c1bdb6]" strokeWidth={2} />
                  <span className="text-[14px] leading-[22px] text-[#7d7973]">{r.a}</span>
                </span>
                <span className="flex w-[300px] shrink-0 items-center gap-2.5">
                  <Check className="size-[18px] shrink-0 text-[#94713f]" strokeWidth={2.4} />
                  <span className="text-[14px] leading-[22px] text-ink">{r.b}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
