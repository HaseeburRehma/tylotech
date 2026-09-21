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
      // Only the layout that's visible at this breakpoint is animated; trigger
      // off the section root since the hidden layout has no measurable box.
      gsap.utils.toArray<HTMLElement>(".verg-table").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="vergleich" ref={root} className="bg-[#001620] py-24 text-white">
      <Container>
        <SectionHeading
          dark
          className="verg-head"
          eyebrow="Unterschied"
          title="Woran Sie merken, dass es anders läuft."
          subtitle="Kein Angriff auf andere Agenturen — sondern die Punkte, an denen Kunden uns immer wieder sagen, dass es bei ihnen vorher anders war."
        />

        {/* Table — md and up */}
        <div className="verg-table mt-14 hidden overflow-x-auto no-scrollbar md:block">
          <div className="min-w-[760px] overflow-hidden rounded-[20px] border border-[#0a4a5f] bg-[#04283a]/60">
            {/* header */}
            <div className="flex items-center gap-6 border-b border-[#0a4a5f] bg-white/[0.04] px-7 py-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.9px]">
              <span className="flex-1 text-[#7fbacd]" />
              <span className="w-[280px] shrink-0 text-[#7fbacd]">Üblich am Markt</span>
              <span className="w-[300px] shrink-0 text-[#d8b682]">Bei TyloTech</span>
            </div>
            {ROWS.map((r) => (
              <div
                key={r.c}
                className={`flex items-center gap-6 border-b border-white/10 px-7 py-5 last:border-b-0 ${
                  r.hl ? "bg-white/[0.03]" : "bg-transparent"
                }`}
              >
                <span className="flex-1 text-[16px] font-medium tracking-[-0.1px] text-white">
                  {r.c}
                </span>
                <span className="flex w-[280px] shrink-0 items-center gap-2.5">
                  <X className="size-[18px] shrink-0 text-white/30" strokeWidth={2} />
                  <span className="text-[14px] leading-[22px] text-[#7fbacd]">{r.a}</span>
                </span>
                <span className="flex w-[300px] shrink-0 items-center gap-2.5">
                  <Check className="size-[18px] shrink-0 text-[#d8b682]" strokeWidth={2.4} />
                  <span className="text-[14px] leading-[22px] text-white">{r.b}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked cards — mobile */}
        <div className="verg-table mt-12 flex flex-col gap-3.5 md:hidden">
          {ROWS.map((r) => (
            <div
              key={r.c}
              className="overflow-hidden rounded-[18px] border border-[#0a4a5f] bg-[#04283a]/60"
            >
              <p className="border-b border-white/10 bg-white/[0.04] px-5 py-3 text-[15px] font-medium tracking-[-0.1px] text-white">
                {r.c}
              </p>
              <div className="flex items-start gap-2.5 px-5 py-3.5">
                <X className="mt-0.5 size-[17px] shrink-0 text-white/30" strokeWidth={2} />
                <span className="flex-1">
                  <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.9px] text-[#5f8ea0]">
                    Üblich am Markt
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-[21px] text-[#7fbacd]">
                    {r.a}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2.5 border-t border-white/10 bg-[rgba(209,170,113,0.1)] px-5 py-3.5">
                <Check className="mt-0.5 size-[17px] shrink-0 text-[#d8b682]" strokeWidth={2.4} />
                <span className="flex-1">
                  <span className="block font-mono text-[10px] font-medium uppercase tracking-[0.9px] text-[#d8b682]">
                    Bei TyloTech
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-[21px] text-white">
                    {r.b}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
