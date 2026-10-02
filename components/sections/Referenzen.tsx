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
    shot: "/referenzen/priya-pf.webp",
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
    shot: "/referenzen/fahrschule-pf.webp",
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
    shot: "/referenzen/rohrcleaner-pf.webp",
    alt: "Rohrcleaner Website",
    url: "rohrcleaner.de",
  },
];

// Whole cards stay horizontal — only the browser mockup inside each card
// is tilted at -7° per the Figma design. Small horizontal offsets keep
// the stack readable as a tossed deck rather than a perfect column.
const TILTS = [
  { rotate: 0, offsetX: 0 },
  { rotate: 0, offsetX: 12 },
  { rotate: 0, offsetX: -8 },
];


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

        // Stacked-deck behaviour:
        // - Card 0 starts in place. Later cards are hidden.
        // - On each transition the incoming card enters fully opaque from the
        //   bottom of the viewport and slides up to rest on top (higher z).
        // - Every card already on the deck recedes one "depth" step at the same
        //   time: smaller, lifted, dimmer. Depth 1 stays faintly visible as a
        //   peeking edge above the new card; depth 2+ fades out completely.
        const DEPTH_SCALE = 0.14; // scale lost per depth step
        const DEPTH_LIFT = 70; // px lifted per depth step (peeks above the next card)
        const depthAlpha = (d: number) => (d === 0 ? 1 : d === 1 ? 0.3 : 0);

        cards.forEach((card, i) => {
          const tilt = TILTS[i] ?? TILTS[0];
          gsap.set(card, {
            rotate: tilt.rotate,
            x: isDesktop ? tilt.offsetX : 0,
            scale: 1,
            y: 0,
            autoAlpha: i === 0 ? 1 : 0,
          });
        });

        // Timeline layout (time units):
        //   0.0 - 0.9  card 0 alone (REST)
        //   0.9 - 2.9  card 1 rises from the bottom, card 0 recedes (TRANS)
        //   2.9 - 3.8  card 1 on top, card 0 peeking (REST)
        //   3.8 - 5.8  card 2 rises, card 1 recedes, card 0 fades out (TRANS)
        //   5.8 - 6.7  card 2 on top, card 1 peeking (REST)
        // Each unit maps to half a viewport of scroll, so the whole deck is
        // ~3.35 screens: a card change takes ~1 screen, each rest ~0.45.
        const REST = 0.9;
        const TRANS = 2.0;
        const SCROLL_PER_UNIT = 0.5;
        const totalDuration = REST + (cards.length - 1) * (TRANS + REST);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () =>
              "+=" + window.innerHeight * totalDuration * SCROLL_PER_UNIT,
            pin: true,
            anticipatePin: 1,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < cards.length; i++) {
          const at = REST + (i - 1) * (REST + TRANS);

          // Every card already on the deck steps one level further back.
          for (let j = 0; j < i; j++) {
            const depth = i - j;
            tl.to(
              cards[j],
              {
                scale: 1 - DEPTH_SCALE * depth,
                y: -DEPTH_LIFT * depth,
                autoAlpha: depthAlpha(depth),
                duration: TRANS,
                // Front-loaded so the recede is clearly visible while the
                // incoming card is still low in the viewport.
                ease: "power2.out",
              },
              at,
            );
          }

          // Incoming card: becomes visible at the start of its transition,
          // fully opaque ("clear"), and travels up from the bottom of the
          // viewport — not from just under the current card.
          tl.set(cards[i], { autoAlpha: 1 }, at);
          tl.fromTo(
            cards[i],
            { y: () => window.innerHeight },
            {
              y: 0,
              duration: TRANS,
              // Eases in from the bottom, glides, and settles softly on top.
              ease: "power3.inOut",
              immediateRender: false,
            },
            at,
          );
        }

        // Guarantee the timeline extends through the final rest phase
        tl.to({}, { duration: REST }, totalDuration - REST);
        },
      );
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

      {/* Pinned deck — pinned on every screen size. The stage is a fixed-height
          box centred in the viewport; all cards are absolutely stacked in it. */}
      <div ref={pinRef} className="mt-6 sm:mt-10 lg:mt-0">
        <div className="flex h-[100svh] items-center justify-center">
          <Container className="w-full">
            <div className="relative mx-auto h-[min(620px,80svh)] max-w-[1120px] lg:h-[min(560px,72vh)]">
              {PROJECTS.map((p, i) => (
                <article
                  key={p.shot}
                  className="ref-card absolute inset-0 mx-auto w-full max-w-[1080px] overflow-hidden rounded-[24px] border border-line bg-white p-5 shadow-[0_40px_90px_-45px_rgba(15,14,13,0.35)] sm:p-8 lg:rounded-[28px] lg:p-10"
                  style={{ zIndex: 10 + i * 10 }}
                >
                  {/* Desktop mockup: the Figma 730×870 browser frame (aspect
                      0.84), placed 46% across the card, ~63% of the card wide,
                      6% from the top, pivoted at its top-left so the chrome stays
                      in view. It tilts 7° clockwise (Figma's -7° is CCW-positive,
                      so CSS needs +7deg). Only the card clips it — right and
                      bottom bleed off, while the slanted left edge stays fully
                      visible against the white card. */}
                  <div className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[28px] lg:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.shot}
                      alt={p.alt}
                      className="absolute left-[46%] top-[6%] h-auto w-[63%] max-w-none origin-top-left rotate-[7deg] rounded-[14px]"
                      style={{
                        boxShadow:
                          "-8px 18px 46px 0 rgba(8, 34, 44, 0.18), -2px 60px 90px 0 rgba(8, 34, 44, 0.10)",
                      }}
                    />
                  </div>

                  {/* Mobile mockup band (Figma mobile frame): the bottom ~46% of
                      the card. Same tilted mockup, width-driven here because the
                      band is wide and short; chrome top-left stays in view and
                      the rest bleeds off the right/bottom edges. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] overflow-hidden md:h-[63%] rounded-b-[24px] lg:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.shot}
                      alt={p.alt}
                      className="absolute left-[5%] top-[10%] h-auto w-[92%] max-w-none origin-top-left rotate-[7deg] rounded-[12px]"
                      style={{
                        boxShadow:
                          "-6px 14px 34px 0 rgba(8, 34, 44, 0.18), -2px 40px 60px 0 rgba(8, 34, 44, 0.10)",
                      }}
                    />
                  </div>

                  {/* Text column — top of the card on mobile, left 45% on desktop
                      so it never collides with either mockup band. */}
                  <div className="relative z-10 flex flex-col lg:h-full lg:max-w-[35%] lg:justify-center xl:max-w-[38%]">
                    <h3 className="font-display text-[clamp(1.3rem,2.2vw,2rem)] font-bold leading-[1.16] tracking-[-0.02em] text-ink">
                      {p.lead}{" "}
                      <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                        {p.accent}
                      </span>
                    </h3>
                    <ul className="mt-4 space-y-2.5 lg:mt-6 lg:space-y-4">
                      {p.bullets.map((b) => (
                        <li key={b.label} className="flex gap-2.5 lg:gap-3">
                          <CircleCheck
                            className="mt-0.5 size-[17px] shrink-0 text-[#c79a53] lg:size-[19px]"
                            strokeWidth={2}
                          />
                          <p className="text-[13px] leading-[1.5] text-[#5c5954] lg:text-[14px] lg:leading-[1.55]">
                            <span className="font-semibold text-ink">
                              {b.label}:
                            </span>{" "}
                            {b.desc}
                          </p>
                        </li>
                      ))}
                    </ul>
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
