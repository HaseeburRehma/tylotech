"use client";

import { useRef, useState } from "react";
import { Play, Quote } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

const VOICES = [
  {
    name: "Enes Seker",
    firma: "Crusty Slices · Multi-Unternehmer",
    initials: "ES",
    quote:
      "TyloTech ist das Gegenteil der trägen Servicewüste Deutschland — Innovation, Tempo und Next-Level-Denken machen sie für mich zur absoluten Nummer 1!",
    person: "Enes Seker · Crusty Slices · Multi-Unternehmer",
  },
  {
    name: "Fahrschule Abgefahrn",
    firma: "Fahrschule · Düsseldorf",
    initials: "FA",
    quote:
      "Ich empfehle jedem Unternehmen, das Struktur und Wachstum benötigt, sich an TyloTech zu wenden!",
    person: "Hashtag Fahrschule Abgefahrn · Düsseldorf",
  },
  {
    name: "Cleanpany Gebäudeservice",
    firma: "Gebäudereinigung · NRW",
    initials: "CG",
    quote:
      "Unser gesamtes Unternehmen haben wir mit Hilfe von TyloTech aufgebaut — durch das Marketing generieren wir täglich 5–7 sehr günstige lokale Anfragen!",
    person: "Cleanpany Gebäudeservice · Gebäudereinigung",
  },
];

export default function OToene() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const v = VOICES[active];

  useGSAP(
    () => {
      gsap.from(".oton-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".oton-head", start: "top 82%" },
      });
      gsap.from(".oton-body", {
        y: 34,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".oton-body", start: "top 84%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="otoene" ref={root} className="bg-[#001620] py-24 text-white">
      <Container>
        <SectionHeading
          dark
          className="oton-head"
          eyebrow="O-Töne"
          title="Hören Sie es von den Kunden selbst."
          subtitle="Kein Skript, kein Schönreden — Unternehmerinnen und Unternehmer, mit denen wir arbeiten, erzählen selbst, was sich verändert hat."
        />

        <div className="oton-body mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.55fr_1fr]">
          {/* Video */}
          <div className="relative aspect-[760/490] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0c2e3c] to-[#001620]">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_70%_20%,rgba(127,186,205,0.18),transparent_60%)]" />
            <button
              className="group absolute inset-0 grid place-items-center"
              aria-label="Video abspielen"
            >
              <span className="grid size-[72px] place-items-center rounded-full bg-accent text-[#001620] shadow-xl transition-transform group-hover:scale-110">
                <Play className="size-8 translate-x-0.5 fill-current" />
              </span>
            </button>
            <div className="absolute bottom-6 left-6">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-[#d8b682]">
                O-Ton · {v.firma.split(" · ")[0]}
              </p>
              <p className="mt-1 font-display text-[22px] font-semibold text-white">
                {v.name}
              </p>
            </div>
          </div>

          {/* Quote + selector */}
          <div>
            <Quote className="size-[30px] fill-accent text-accent" strokeWidth={0} />
            <p
              key={active}
              className="mt-[18px] font-display text-[32px] font-semibold leading-[38px] tracking-[-0.8px] text-white"
            >
              {v.quote}
            </p>
            <p className="mt-[18px] text-[14px] font-medium text-[#7fbacd]">
              {v.person}
            </p>

            <div className="my-6 h-px w-full bg-white/10" />

            <div className="flex flex-col gap-2.5">
              {VOICES.map((voice, i) => {
                const on = i === active;
                return (
                  <button
                    key={voice.name}
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-3.5 rounded-[16px] px-3.5 py-3 text-left transition-colors ${
                      on
                        ? "border-[1.5px] border-accent bg-[rgba(209,170,113,0.12)]"
                        : "border border-[#0a4a5f] bg-[#04283a]/60 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full border text-[14px] font-medium ${
                        on
                          ? "border-accent bg-[rgba(209,170,113,0.14)] text-[#d8b682]"
                          : "border-[#0a4a5f] bg-white/[0.06] text-[#7fbacd]"
                      }`}
                    >
                      {voice.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[16px] font-medium tracking-[-0.1px] text-white">
                        {voice.name}
                      </span>
                      <span className="block truncate text-[13px] text-[#7fbacd]">
                        {voice.firma}
                      </span>
                    </span>
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full ${
                        on ? "bg-accent text-[#001620]" : "bg-white/[0.06] text-white/50"
                      }`}
                    >
                      <Play className="size-4 translate-x-px fill-current" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
