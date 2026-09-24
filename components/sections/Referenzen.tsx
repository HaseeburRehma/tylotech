"use client";

import { useRef } from "react";
import { CircleCheck, FolderOpen } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

type Bullet = { label: string; desc: string };

type Project = {
  lead: string;
  accent: string;
  bullets: Bullet[];
  shot: string;
  alt: string;
};

const PROJECTS: Project[] = [
  {
    lead: "Von der ersten Filiale zur",
    accent: "Marke, die man kennt.",
    bullets: [
      { label: "Auftritt und Bestellstrecke", desc: "Eine Seite, die den Slice verkauft, statt ihn nur zu zeigen." },
      { label: "Kampagnen mit Standortbezug", desc: "Anzeigen, die den Laden auch unter der Woche füllen." },
      { label: "Wiederkehrbar offline", desc: "Speisekarte, Verpackung und Social aus einem Baukasten." },
    ],
    shot: "/referenzen/crusty-pf.jpg",
    alt: "Crusty Slices Website",
  },
  {
    lead: "Eine Fahrschule, die aussieht",
    accent: "wie eine Marke.",
    bullets: [
      { label: "Theorieplan, den Fahrschüler benutzen", desc: "monatlich aktuell, ohne Nachfragen im Büro." },
      { label: "Anmeldung ohne Umweg", desc: "vom Instagram-Profil bis zum Vertrag in einem Fluss." },
      { label: "Ein Auftritt, den man weiterempfiehlt", desc: "Farbe, Ton und Bildsprache konsequent durchgezogen." },
    ],
    shot: "/referenzen/fahrschule-pf.jpg",
    alt: "Fahrschule Abgefahrn Website",
  },
  {
    lead: "Aus unregelmäßigen Anrufen wurden",
    accent: "planbare Anfragen.",
    bullets: [
      { label: "Local SEO für jeden Einsatzort", desc: "gefunden werden, wo der Auftrag tatsächlich entsteht." },
      { label: "Ads auf Anfragen optimiert", desc: "nicht auf Klicks und nicht auf Reichweite." },
      { label: "5 bis 7 Leads am Tag", desc: "täglich planbar statt nur nach Wochenanfang." },
    ],
    shot: "/referenzen/cleanpany-pf.jpg",
    alt: "Cleanpany Gebäudeservice Website",
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
      // Each card scales up as it rises into the stack.
      gsap.utils.toArray<HTMLElement>(".ref-card").forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.94, autoAlpha: 0.55 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 62%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="referenzen" ref={root} className="bg-[#f3f5f6] py-20 sm:py-24">
      <Container>
        <div className="ref-head max-w-[720px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <FolderOpen className="size-3.5 text-accent" />
            Ausgewählte Projekte
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Arbeiten, die{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              weiterlaufen
            </span>
            , wenn wir nicht mehr im Raum sind.
          </h2>
          <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Drei Projekte aus der Zusammenarbeit mit Unternehmen, die Sie im
            Zweifel selbst anrufen können.
          </p>
        </div>

        {/* stacking cards */}
        <div className="mt-10 sm:mt-14">
          {PROJECTS.map((p, i) => (
            <div
              key={p.shot}
              className="ref-sticky mb-6 lg:sticky lg:mb-10"
              style={{ top: `${96 + i * 22}px` }}
            >
              <article className="ref-card grid h-auto overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_36px_80px_-46px_rgba(15,14,13,0.35)] lg:h-[clamp(440px,70vh,600px)] lg:grid-cols-[1fr_1.05fr]">
                {/* text */}
                <div className="order-2 flex flex-col justify-center p-7 sm:p-10 lg:order-1 lg:p-12">
                  <h3 className="font-display text-[clamp(1.45rem,2.3vw,2.1rem)] font-bold leading-[1.16] tracking-[-0.02em] text-ink">
                    {p.lead}{" "}
                    <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                      {p.accent}
                    </span>
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {p.bullets.map((b) => (
                      <li key={b.label} className="flex gap-3">
                        <CircleCheck
                          className="mt-0.5 size-[19px] shrink-0 text-[#c79a53]"
                          strokeWidth={2}
                        />
                        <p className="text-[14px] leading-[1.55] text-[#5c5954]">
                          <span className="font-semibold text-ink">
                            {b.label}:
                          </span>{" "}
                          {b.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* image — fills the side edge-to-edge, no frame, no partition */}
                <div className="relative order-1 aspect-[3/2] overflow-hidden lg:order-2 lg:aspect-auto lg:h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.shot}
                    alt={p.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
