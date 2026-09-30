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
  index: string;
  tag: string;
  lead: string;
  accent: string;
  summary: string;
  bullets: Bullet[];
  shot: string;
  alt: string;
  url: string;
  screenCount: string;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    tag: "Gastronomie · Marke & Bestellstrecke",
    lead: "Von der ersten Filiale zur",
    accent: "Marke, die man kennt.",
    summary:
      "Auftritt, Bestellstrecke und lokale Kampagnen für Crusty Slices — von der ersten Filiale bis zur wachsenden Marke, die man im Ort kennt.",
    bullets: [
      { label: "Auftritt und Bestellstrecke", desc: "Eine Seite, die den Slice verkauft, statt ihn nur zu zeigen." },
      { label: "Kampagnen mit Standortbezug", desc: "Anzeigen, die den Laden auch unter der Woche füllen." },
      { label: "Wiederkehrbar offline", desc: "Speisekarte, Verpackung und Social aus einem Baukasten." },
    ],
    shot: "/referenzen/crusty-pf.jpg",
    alt: "Crusty Slices Website",
    url: "crustyslices.de",
    screenCount: "3 Bausteine",
  },
  {
    index: "02",
    tag: "Bildung · Marke & Anmeldung",
    lead: "Eine Fahrschule, die aussieht",
    accent: "wie eine Marke.",
    summary:
      "Neuer Auftritt für Fahrschule Abgefahrn — mit Theorieplan, Anmeldestrecke und einer Bildsprache, die auch offline zieht.",
    bullets: [
      { label: "Theorieplan, den Fahrschüler benutzen", desc: "monatlich aktuell, ohne Nachfragen im Büro." },
      { label: "Anmeldung ohne Umweg", desc: "vom Instagram-Profil bis zum Vertrag in einem Fluss." },
      { label: "Ein Auftritt, den man weiterempfiehlt", desc: "Farbe, Ton und Bildsprache konsequent durchgezogen." },
    ],
    shot: "/referenzen/fahrschule-pf.jpg",
    alt: "Fahrschule Abgefahrn Website",
    url: "fahrschule-abgefahrn.de",
    screenCount: "3 Bausteine",
  },
  {
    index: "03",
    tag: "Gebäudeservice · Leads & Local SEO",
    lead: "Aus unregelmäßigen Anrufen wurden",
    accent: "planbare Anfragen.",
    summary:
      "Local SEO und Performance-Marketing für Cleanpany — aus unregelmäßigen Anrufen wurden 5–7 planbare Anfragen am Tag.",
    bullets: [
      { label: "Local SEO für jeden Einsatzort", desc: "gefunden werden, wo der Auftrag tatsächlich entsteht." },
      { label: "Ads auf Anfragen optimiert", desc: "nicht auf Klicks und nicht auf Reichweite." },
      { label: "5 bis 7 Leads am Tag", desc: "täglich planbar statt nur nach Wochenanfang." },
    ],
    shot: "/referenzen/cleanpany-pf.jpg",
    alt: "Cleanpany Gebäudeservice Website",
    url: "cleanpany.de",
    screenCount: "3 Bausteine",
  },
];

function BrowserFrame({
  shot,
  alt,
  url,
  variant,
}: {
  shot: string;
  alt: string;
  url: string;
  variant: "hero" | "detail-a" | "detail-b";
}) {
  const focus =
    variant === "hero"
      ? "object-[center_top]"
      : variant === "detail-a"
        ? "object-[center_center]"
        : "object-[center_bottom]";
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[18px] border border-black/[0.06] bg-white shadow-[0_28px_60px_-30px_rgba(15,14,13,0.35)]">
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-black/[0.05] bg-[#f4f5f7] px-3 py-2">
        <div className="flex shrink-0 gap-1">
          <span className="size-[9px] rounded-full bg-[#ff5f57]" />
          <span className="size-[9px] rounded-full bg-[#febc2e]" />
          <span className="size-[9px] rounded-full bg-[#28c840]" />
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-black/30 sm:flex">
          <ArrowLeft className="size-3" strokeWidth={1.8} />
          <ArrowRight className="size-3" strokeWidth={1.8} />
          <RefreshCw className="ml-0.5 size-[10px]" strokeWidth={1.8} />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] text-black/45 ring-1 ring-black/[0.05]">
          <Search className="size-[10px] shrink-0" strokeWidth={2} />
          <span className="truncate">{url}</span>
        </div>
        <div className="hidden shrink-0 text-black/25 sm:block">
          <Plus className="size-3" strokeWidth={1.8} />
        </div>
      </div>
      {/* screen */}
      <div className="relative flex-1 overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover ${focus}`}
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
        scrollTrigger: {
          trigger: ".ref-head",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      gsap.utils.toArray<HTMLElement>(".ref-project").forEach((el) => {
        const heads = el.querySelectorAll(".ref-proj-head > *");
        const frames = el.querySelectorAll(".ref-frame");

        gsap.from(heads, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(frames, {
          y: 40,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="referenzen"
      ref={root}
      className="bg-[#f3f5f6] py-20 sm:py-24 lg:py-28"
    >
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

        {/* Projects — each is a portfolio "chapter" */}
        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-28 lg:mt-24 lg:space-y-36">
          {PROJECTS.map((p) => (
            <article key={p.shot} className="ref-project">
              {/* header row: index + title left, description right */}
              <div className="ref-proj-head grid gap-6 border-b border-line pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-14 lg:pb-10">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink/40">
                    {p.tag}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.7rem,2.8vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.02em] text-ink">
                    {p.lead}{" "}
                    <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                      {p.accent}
                    </span>
                  </h3>
                  <p className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink/40">
                    {p.index} · {p.screenCount}
                  </p>
                </div>
                <div>
                  <p className="text-[clamp(15px,1.4vw,17px)] leading-[1.6] text-[#5c5954]">
                    {p.summary}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {p.bullets.map((b) => (
                      <li key={b.label} className="flex gap-3">
                        <CircleCheck
                          className="mt-0.5 size-[18px] shrink-0 text-[#c79a53]"
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
              </div>

              {/* frame row — tall portrait cards */}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-14 lg:grid-cols-3">
                {(["hero", "detail-a", "detail-b"] as const).map((variant, fi) => (
                  <div
                    key={variant}
                    className={`ref-frame group relative ${
                      fi === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    <div className="aspect-[3/4.2] w-full">
                      <BrowserFrame
                        shot={p.shot}
                        alt={p.alt}
                        url={p.url}
                        variant={variant}
                      />
                    </div>
                    <p className="mt-4 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-ink/45">
                      {fi === 0
                        ? `${p.index}.01  ·  Startseite`
                        : fi === 1
                          ? `${p.index}.02  ·  Angebot`
                          : `${p.index}.03  ·  Kontakt`}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
