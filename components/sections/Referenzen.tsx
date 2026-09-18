"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

type Metric = { value: string; label: string };
type Case = {
  title: string;
  tags: string[];
  body: string;
  metrics?: Metric[];
};

const CASES: Case[] = [
  {
    title: "Crusty Slices",
    tags: ["Branding", "Web", "Performance"],
    body: "Von der ersten Filiale zur Marke, die man in der Stadt kennt — Auftritt, Bestellstrecke und Kampagnen aus einer Hand.",
  },
  {
    title: "Fahrschule Abgefahrn",
    tags: ["Branding", "Web", "Social"],
    body: "Eine Fahrschule, die aussieht wie eine Marke — inklusive Theorieplan, den Fahrschüler tatsächlich benutzen.",
  },
  {
    title: "Cleanpany Gebäudeservice",
    tags: ["Local SEO", "Ads", "Web"],
    body: "Aus unregelmäßigen Anrufen wurden planbare Anfragen — jeden Tag, nicht nur zum Monatsanfang.",
    metrics: [
      { value: "5–7", label: "Leads pro Tag" },
      { value: "Täglich", label: "statt monatlich" },
    ],
  },
];

export default function Referenzen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".ref-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ref-head", start: "top 82%" },
      });
      gsap.from(".ref-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ref-grid", start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="referenzen" ref={root} className="bg-page py-24">
      <Container>
        <SectionHeading
          className="ref-head"
          eyebrow="Referenzen"
          title="Arbeiten, die weiterlaufen, wenn wir nicht mehr im Raum sind."
          subtitle="Drei Projekte aus der Zusammenarbeit mit Unternehmen, die Sie im Zweifel selbst anrufen können."
        />

        <div className="ref-grid mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <article
              key={c.title}
              className="ref-card group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(15,14,13,0.18)]"
            >
              <div className="relative h-[230px] bg-gradient-to-br from-[#eeedea] to-[#e5e3df]">
                <span className="absolute bottom-[22px] left-6 font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-[#7d7973]">
                  Projektbild
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-7 py-[26px]">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="flex h-6 items-center rounded-full bg-[#eeedea] px-2.5 text-[12px] font-medium text-[#5c5954]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[22px] text-[#5c5954]">{c.body}</p>
                {c.metrics && (
                  <>
                    <div className="mt-auto h-px w-full bg-[#eeedea]" />
                    <div className="flex gap-6">
                      {c.metrics.map((m) => (
                        <div key={m.label} className="flex-1">
                          <p className="font-display text-[22px] font-bold leading-[28px] tracking-[-0.4px] text-[#94713f]">
                            {m.value}
                          </p>
                          <p className="text-[13px] leading-[18px] text-[#7d7973]">
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
