"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  FileText,
  FolderOpen,
  Heart,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

type Bullet = { icon: LucideIcon; label: string; desc: string };

/** Bento tile: an exported Figma tile (public/referenzen/<slug>-<n>.webp) or null
    where the Figma design still shows a "Platzhalter". */
type Tile = string | null;

type Project = {
  client: string;
  lead: string;
  accent: string;
  bullets: Bullet[];
  /** Bild 1–4 in Figma order: row 1 = wide, narrow · row 2 = narrow, wide */
  tiles: [Tile, Tile, Tile, Tile];
};

// Copy and images from Figma "15 · Referenzen" (Referenz-Stapel, 5 cards).
const PROJECTS: Project[] = [
  {
    client: "Priya's Cleaning Service",
    lead: "Ein Reinigungsbetrieb, der",
    accent: "aus einer Software läuft.",
    bullets: [
      { icon: LayoutDashboard, label: "Einsatzplanung auf einen Blick", desc: "Kunden, Objekte und Schichten in einem Dashboard." },
      { icon: FileText, label: "Rechnungen im selben System", desc: "offene Posten und Kundenkonten ohne zweite Liste." },
      { icon: HeartPulse, label: "Alltagshilfe mit Nachweis", desc: "Leistungsnachweise und Pflegegrad für die Abrechnung mit den Kassen." },
    ],
    tiles: ["/referenzen/priya-1.webp", null, null, "/referenzen/priya-4.webp"],
  },
  {
    client: "Fahrschule Abgefahrn",
    lead: "Eine Fahrschule, die aussieht",
    accent: "wie eine Marke.",
    bullets: [
      { icon: Calendar, label: "Theorieplan, den Fahrschüler benutzen", desc: "monatlich aktuell, ohne Nachfragen im Büro." },
      { icon: Send, label: "Anmeldung ohne Umweg", desc: "vom Instagram-Profil bis zum Vertrag in einem Fluss." },
      { icon: Heart, label: "Ein Auftritt, den man weiterempfiehlt", desc: "Farbe, Ton und Bildsprache konsequent durchgezogen." },
    ],
    tiles: ["/referenzen/fahrschule-1.webp", "/referenzen/fahrschule-2.webp", "/referenzen/fahrschule-3.webp", "/referenzen/fahrschule-4.webp"],
  },
  {
    client: "Cleanpany Gebäudeservice",
    lead: "Aus unregelmäßigen Anrufen wurden",
    accent: "planbare Anfragen.",
    bullets: [
      { icon: MapPin, label: "Local SEO für jeden Einsatzort", desc: "gefunden werden, wo der Auftrag tatsächlich entsteht." },
      { icon: Target, label: "Ads auf Anfragen optimiert", desc: "nicht auf Klicks und nicht auf Reichweite." },
      { icon: TrendingUp, label: "5 bis 7 Leads pro Tag", desc: "täglich planbar statt nur zum Monatsanfang." },
    ],
    tiles: ["/referenzen/cleanpany-1.webp", null, null, null],
  },
  {
    client: "Light of Hope",
    lead: "Ein sensibles Thema,",
    accent: "klar und warm erzählt.",
    bullets: [
      { icon: Send, label: "Landingpages, die führen", desc: "vom Meta-Ad bis zur Bewerbung in einem Fluss." },
      { icon: MessageCircle, label: "Bewerbung statt Buchung", desc: "Formular und Kennenlerngespräch vor der Zusage." },
      { icon: ShieldCheck, label: "Ton ohne Heilversprechen", desc: "warm, klar und ohne Guru-Sprache." },
    ],
    tiles: ["/referenzen/hope-1.webp", "/referenzen/hope-2.webp", "/referenzen/hope-3.webp", "/referenzen/hope-4.webp"],
  },
  {
    client: "Nouh-Wehres",
    lead: "Ein Meisterbetrieb, der online",
    accent: "so sauber auftritt wie vor Ort.",
    bullets: [
      { icon: Monitor, label: "Website für alle Gewerke", desc: "Heizung, Bad, Lüftung und Solar mit eigenen Leistungsseiten." },
      { icon: FileText, label: "Landingpages mit Anfrageformular", desc: "in wenigen Schritten zur Wärmepumpe oder zum neuen Bad." },
      { icon: Megaphone, label: "Meta-Kampagnen für Badsanierung", desc: "Anzeigen, die direkt zum Meisterbetrieb führen." },
    ],
    tiles: ["/referenzen/nouh-1.webp", "/referenzen/nouh-2.webp", "/referenzen/nouh-3.webp", "/referenzen/nouh-4.webp"],
  },
];

// Figma "Elevation XL" (three stacked drop shadows in petrol).
const CARD_SHADOW =
  "0 12px 32px rgba(8,34,44,0.10), 0 40px 60px rgba(8,34,44,0.06), 0 80px 90px rgba(8,34,44,0.04)";

function BentoTile({ src, wide, client, n }: { src: Tile; wide: boolean; client: string; n: number }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[12px] border border-[#eeedea] bg-[#eeedea] lg:rounded-[16px]">
      {src ? (
        <Image
          src={src}
          alt={`${client}, Einblick ${n}`}
          fill
          sizes={wide ? "(min-width: 1280px) 400px, (min-width: 1024px) 34vw, 55vw" : "(min-width: 1280px) 268px, (min-width: 1024px) 23vw, 37vw"}
          className="object-cover"
        />
      ) : (
        // Figma still shows a grey "Platzhalter" here: keep the grey tile, with a
        // fine dot grid and the client name so it reads as intentional.
        <div
          className="flex h-full items-end p-3 lg:p-4"
          style={{
            backgroundImage: "radial-gradient(rgba(26,25,23,0.10) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          <span className="hidden font-mono text-[9px] sm:inline font-medium uppercase tracking-[0.14em] text-[#8f8a82] lg:text-[10px]">
            {client}
          </span>
        </div>
      )}
    </div>
  );
}

function Bento({ p }: { p: Project }) {
  const [t1, t2, t3, t4] = p.tiles;
  // Each Figma row is 680×182 (400 + 12 + 268): fixed aspect keeps the
  // proportions at every width.
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <div className="grid aspect-[680/182] grid-cols-[400fr_268fr] gap-2 lg:gap-3">
        <BentoTile src={t1} wide client={p.client} n={1} />
        <BentoTile src={t2} wide={false} client={p.client} n={2} />
      </div>
      <div className="grid aspect-[680/182] grid-cols-[268fr_400fr] gap-2 lg:gap-3">
        <BentoTile src={t3} wide={false} client={p.client} n={3} />
        <BentoTile src={t4} wide client={p.client} n={4} />
      </div>
    </div>
  );
}

// Small horizontal offsets keep the stack readable as a deck (Figma staggers
// the cards 10px each).
const OFFSETS = [0, 10, -8, 6, -4];

export default function Referenzen() {
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

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

      const mm = gsap.matchMedia();

      // Pinned stacked deck — same choreography on desktop and mobile.
      mm.add(
        { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023.98px)" },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };
          const cards = gsap.utils.toArray<HTMLElement>(".ref-card");
          if (!pinRef.current || cards.length === 0) return;

          // - Card 0 starts in place, later cards are hidden.
          // - Each transition: the incoming card rises from the bottom of the
          //   viewport, fully opaque, and settles on top.
          // - Every card already on the deck recedes one depth step (smaller,
          //   lifted, dimmer). Depth 1 peeks above the new card; 2+ fade out.
          const DEPTH_SCALE = 0.06;
          const DEPTH_LIFT = 34;
          const depthAlpha = (d: number) => (d === 0 ? 1 : d === 1 ? 0.55 : d === 2 ? 0.2 : 0);

          cards.forEach((card, i) => {
            gsap.set(card, {
              x: isDesktop ? (OFFSETS[i] ?? 0) : 0,
              scale: 1,
              y: 0,
              autoAlpha: i === 0 ? 1 : 0,
            });
          });

          // REST: card alone on top · TRANS: next card rises. Each unit maps to
          // SCROLL_PER_UNIT viewports of scroll (5 cards ≈ 4.4 screens).
          const REST = 0.7;
          const TRANS = 1.6;
          const SCROLL_PER_UNIT = 0.45;
          const totalDuration = REST + (cards.length - 1) * (TRANS + REST);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * totalDuration * SCROLL_PER_UNIT,
              pin: true,
              anticipatePin: 1,
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          });

          for (let i = 1; i < cards.length; i++) {
            const at = REST + (i - 1) * (REST + TRANS);

            for (let j = 0; j < i; j++) {
              const depth = i - j;
              tl.to(
                cards[j],
                {
                  scale: 1 - DEPTH_SCALE * depth,
                  y: -DEPTH_LIFT * depth,
                  autoAlpha: depthAlpha(depth),
                  duration: TRANS,
                  ease: "power2.out",
                },
                at,
              );
            }

            tl.set(cards[i], { autoAlpha: 1 }, at);
            tl.fromTo(
              cards[i],
              { y: () => window.innerHeight },
              { y: 0, duration: TRANS, ease: "power3.inOut", immediateRender: false },
              at,
            );
          }

          tl.to({}, { duration: REST }, totalDuration - REST);
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="referenzen" ref={root} className="overflow-hidden bg-white py-20 sm:py-24 lg:py-0">
      <Container>
        <div className="ref-head max-w-[720px] lg:pt-24">
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
            Fünf Projekte aus der Zusammenarbeit mit Unternehmen, die du im Zweifel selbst anrufen kannst.
          </p>
        </div>
      </Container>

      {/* Pinned deck: a fixed-height stage centred in the viewport, all cards
          absolutely stacked in it. */}
      <div ref={pinRef} className="mt-6 sm:mt-10 lg:mt-0">
        <div className="flex h-[100svh] items-center justify-center">
          <Container className="w-full">
            <div className="relative mx-auto h-[min(540px,82svh)] max-w-[1200px] lg:h-[min(440px,78vh)] ">
              {PROJECTS.map((p, i) => (
                <article
                  key={p.client}
                  aria-label={p.client}
                  className="ref-card absolute inset-0 flex flex-col gap-5 overflow-hidden rounded-[22px] border border-[#eeedea] p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:rounded-[28px] lg:pb-[31px] lg:pl-[47px] lg:pr-[31px] lg:pt-[31px]"
                  style={{
                    zIndex: 10 + i * 10,
                    background: "linear-gradient(90deg, #ffffff 0%, #f4f7f8 100%)",
                    boxShadow: CARD_SHADOW,
                  }}
                >
                  <div className="flex flex-col gap-4 lg:mt-3 lg:w-[400px] lg:min-w-0 lg:shrink lg:gap-[26px]">
                    <h3 className="font-display text-[clamp(1.3rem,4.6vw,1.6rem)] font-semibold leading-[1.22] tracking-[-0.03em] text-[#1a1917] lg:text-[clamp(1.5rem,2.3vw,29px)] lg:leading-[36px] lg:tracking-[-0.8px]">
                      {p.lead}{" "}
                      <span className="font-[family-name:var(--font-instrument)] text-[1.07em] font-normal italic tracking-[-0.5px]">
                        {p.accent}
                      </span>
                    </h3>
                    <ul className="flex flex-col gap-3 lg:gap-5">
                      {p.bullets.map((b) => (
                        <li key={b.label} className="flex items-start gap-3">
                          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[#d1aa71] bg-[#fbf6ee]">
                            <b.icon className="size-3.5 text-[#b98f53]" strokeWidth={2} aria-hidden />
                          </span>
                          <p className="text-[13px] leading-[1.5] tracking-[-0.1px] text-[#5c5954] lg:text-[14px] lg:leading-[22px]">
                            <span className="font-semibold text-[#1a1917]">{b.label}:</span> {b.desc}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto w-full lg:mt-0 lg:w-[min(680px,60%)] lg:shrink-0">
                    <Bento p={p} />
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
