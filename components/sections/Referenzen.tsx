"use client";

import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  FolderOpen,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

type Bullet = { label: string; desc: string };

type Project = {
  lead: string;
  accent: string;
  bullets: Bullet[];
  shot: string;
  alt: string;
  url: string;
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
    url: "crustyslices.de",
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
    url: "fahrschule-abgefahrn.de",
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
    url: "cleanpany.de",
  },
];

function BrowserFrame({ shot, alt, url }: { shot: string; alt: string; url: string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_20px_50px_-25px_rgba(15,14,13,0.35)]">
      {/* chrome bar */}
      <div className="flex items-center gap-3 border-b border-black/[0.05] bg-[#f4f5f7] px-4 py-2.5">
        {/* traffic lights */}
        <div className="flex shrink-0 gap-1.5">
          <span className="size-[11px] rounded-full bg-[#ff5f57]" />
          <span className="size-[11px] rounded-full bg-[#febc2e]" />
          <span className="size-[11px] rounded-full bg-[#28c840]" />
        </div>
        {/* nav arrows */}
        <div className="hidden shrink-0 items-center gap-1 text-black/35 sm:flex">
          <ArrowLeft className="size-3.5" strokeWidth={1.8} />
          <ArrowRight className="size-3.5" strokeWidth={1.8} />
          <RefreshCw className="ml-1 size-3" strokeWidth={1.8} />
        </div>
        {/* url pill */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-black/45 ring-1 ring-black/[0.05]">
          <Search className="size-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{url}</span>
        </div>
        {/* right tab */}
        <div className="hidden shrink-0 text-black/25 sm:block">
          <Plus className="size-3.5" strokeWidth={1.8} />
        </div>
      </div>
      {/* website screenshot */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white sm:aspect-[16/9]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}

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
        scrollTrigger: { trigger: ".ref-head", start: "top 82%", toggleActions: "play none none none" },
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ref-card");
        const stickies = gsap.utils.toArray<HTMLElement>(".ref-sticky");

        cards.forEach((card, i) => {
          // Entrance: fade + scale in as the sticky wrapper approaches its rest position
          gsap.fromTo(
            card,
            { scale: 0.94, autoAlpha: 0, y: 40 },
            {
              scale: 1,
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: stickies[i],
                start: "top 95%",
                end: "top 50%",
                scrub: 1.2,
              },
            },
          );

          // Exit: previous card stays visible while the next one enters,
          // then slowly scales down and fades away underneath
          gsap.to(card, {
            scale: 0.9,
            autoAlpha: 0,
            y: -30,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: i < cards.length - 1 ? stickies[i + 1] : "#referenzen",
              start: i < cards.length - 1 ? "top 55%" : "bottom 80%",
              end: i < cards.length - 1 ? "top 0%" : "bottom 25%",
              scrub: 1.2,
            },
          });
        });
      });

      // Mobile: simple reveal, no stacking dismiss
      mm.add("(max-width: 1023.98px)", () => {
        gsap.utils.toArray<HTMLElement>(".ref-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              ease: "power3.out",
              duration: 0.8,
              scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none none" },
            },
          );
        });
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
            Drei Projekte aus der Zusammenarbeit mit Unternehmen, die du im
            Zweifel selbst anrufen kannst.
          </p>
        </div>

        {/* stacking cards */}
        <div className="mt-12 sm:mt-16" style={{ perspective: "1600px" }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.shot}
              className={`ref-sticky lg:sticky ${
                i < PROJECTS.length - 1 ? "mb-10 lg:mb-[60vh]" : "mb-0"
              }`}
              style={{ top: `${88 + i * 22}px` }}
            >
              <article className="ref-card grid h-auto grid-cols-1 gap-8 overflow-hidden rounded-[26px] border border-line bg-white p-6 shadow-[0_36px_80px_-46px_rgba(15,14,13,0.35)] sm:p-8 lg:h-[clamp(460px,72vh,620px)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 lg:p-10">
                {/* text side */}
                <div className="flex flex-col justify-center">
                  <h3 className="font-display text-[clamp(1.4rem,2.2vw,2rem)] font-bold leading-[1.16] tracking-[-0.02em] text-ink">
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

                {/* browser mockup side */}
                <div className="flex items-center">
                  <BrowserFrame shot={p.shot} alt={p.alt} url={p.url} />
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
