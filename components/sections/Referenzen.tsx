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
    shot: "/referenzen/priya-pf.jpg",
    alt: "Priya Dashboard",
    url: "priya.de",
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
    shot: "/referenzen/rohrcleaner-pf.jpg",
    alt: "Rohrcleaner Website",
    url: "rohrcleaner.de",
  },
];

// Resting tilt + subtle horizontal offset per card
const TILTS = [
  { rotate: -1.4, offsetX: 0 },
  { rotate: 1.2, offsetX: 18 },
  { rotate: -0.9, offsetX: -12 },
];

function BrowserFrame({
  shot,
  alt,
  url,
}: {
  shot: string;
  alt: string;
  url: string;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-[0_30px_60px_-25px_rgba(15,14,13,0.4)]">
      <div className="flex items-center gap-3 border-b border-black/[0.05] bg-[#f4f5f7] px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5">
          <span className="size-[11px] rounded-full bg-[#ff5f57]" />
          <span className="size-[11px] rounded-full bg-[#febc2e]" />
          <span className="size-[11px] rounded-full bg-[#28c840]" />
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-black/35 sm:flex">
          <ArrowLeft className="size-3.5" strokeWidth={1.8} />
          <ArrowRight className="size-3.5" strokeWidth={1.8} />
          <RefreshCw className="ml-1 size-3" strokeWidth={1.8} />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-black/45 ring-1 ring-black/[0.05]">
          <Search className="size-3 shrink-0" strokeWidth={2} />
          <span className="truncate">{url}</span>
        </div>
        <div className="hidden shrink-0 text-black/25 sm:block">
          <Plus className="size-3.5" strokeWidth={1.8} />
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden bg-white">
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

      // Desktop: pinned deck with rest periods between transitions
      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".ref-card");
        if (!pinRef.current || cards.length === 0) return;

        // Initial: card 0 in its resting tilt at rest position, others hidden well below
        cards.forEach((card, i) => {
          const tilt = TILTS[i] ?? TILTS[0];
          gsap.set(card, {
            rotate: tilt.rotate,
            x: tilt.offsetX,
            autoAlpha: i === 0 ? 1 : 0,
            scale: i === 0 ? 1 : 0.9,
            y: i === 0 ? 0 : 320, // incoming cards start well below the frame for a clear slide-up
          });
        });

        // Timeline layout (time units):
        //   0.0 - 0.6  card 0 alone (REST)
        //   0.6 - 2.0  card 0 → card 1 transition (TRANS)
        //   2.0 - 2.6  card 1 alone (REST)
        //   2.6 - 4.0  card 1 → card 2 transition (TRANS)
        //   4.0 - 4.6  card 2 alone (REST)
        const REST = 0.6;
        const TRANS = 1.4;
        const totalDuration = REST + (cards.length - 1) * (TRANS + REST);
        // Pin distance: each stage gets roughly 1 viewport of scroll runway
        const pinViewports = totalDuration;

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * pinViewports,
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < cards.length; i++) {
          // Transition begins after the previous card's REST phase.
          const at = REST + (i - 1) * (REST + TRANS);

          // Previous card stays in place — scales down and fades out.
          // No y motion, so it "sinks" beneath the incoming card.
          tl.to(
            cards[i - 1],
            {
              autoAlpha: 0,
              scale: 0.84,
              duration: TRANS,
              ease: "power2.inOut",
            },
            at,
          );

          // Current card slides up from y:320 to y:0 (dramatic slide-up),
          // grows from scale 0.9 to 1, and fades from 0 to 1.
          // The higher z-index puts it visibly on top of the fading card.
          tl.to(
            cards[i],
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: TRANS,
              ease: "power3.out",
            },
            at,
          );
        }

        // Guarantee the timeline extends through the final rest phase
        tl.to({}, { duration: REST }, totalDuration - REST);
      });

      // Mobile: simple reveal, one card after another, no pin
      mm.add("(max-width: 1023.98px)", () => {
        gsap.utils.toArray<HTMLElement>(".ref-card").forEach((card, i) => {
          const tilt = TILTS[i] ?? TILTS[0];
          gsap.set(card, { rotate: tilt.rotate });
          gsap.from(card, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="referenzen"
      ref={root}
      className="overflow-hidden bg-[#f3f5f6] py-20 sm:py-24 lg:py-0"
    >
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
            Drei Projekte aus der Zusammenarbeit mit Unternehmen, die du im
            Zweifel selbst anrufen kannst.
          </p>
        </div>
      </Container>

      {/* Pinned deck */}
      <div ref={pinRef} className="mt-14 sm:mt-20 lg:mt-0">
        <div className="lg:flex lg:h-screen lg:items-center lg:justify-center">
          <Container className="w-full">
            <div className="relative flex flex-col gap-8 sm:gap-6 lg:mx-auto lg:h-[min(560px,72vh)] lg:max-w-[1120px] lg:block">
              {PROJECTS.map((p, i) => (
                <article
                  key={p.shot}
                  className="ref-card mx-auto w-full max-w-[1080px] rounded-[28px] border border-line bg-white p-6 shadow-[0_40px_90px_-45px_rgba(15,14,13,0.35)] sm:p-8 lg:absolute lg:inset-0 lg:mx-auto lg:p-10"
                  style={{ zIndex: 10 + i * 10 }}
                >
                  <div className="grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)] lg:gap-10">
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

                    <div className="relative lg:-my-4 lg:-mr-16 xl:-mr-24">
                      <div className="relative aspect-[16/10]">
                        <BrowserFrame shot={p.shot} alt={p.alt} url={p.url} />
                      </div>
                    </div>
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
