"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Eye,
  FileText,
  FolderOpen,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Monitor,
  PiggyBank,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLocale, useT } from "../i18n/LocaleProvider";

type Bullet = { icon: LucideIcon; label: string; desc: string };

/** Bento tile: an exported Figma tile (public/referenzen/<slug>-<n>.webp) or null
    where the Figma design still shows a "Platzhalter". */
type Tile = string | null;

type Project = {
  client: string;
  lead: string;
  accent: string;
  /** "Das Ergebnis" line under the title */
  result?: string;
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
    tiles: ["/referenzen/priya-1.webp", "/referenzen/priya-2.webp", "/referenzen/priya-3.webp", "/referenzen/priya-4.webp"],
  },
  {
    client: "Fahrschule Abgefahrn",
    lead: "Die Fahrschule, die ganz Düsseldorf",
    accent: "zuerst sieht.",
    result: "#1 bei Google — SEO & KI-Suche. Plus eine Social-Media-Präsenz, die die ganze Stadt erreicht.",
    bullets: [
      { icon: Trophy, label: "Platz 1, wo es zählt", desc: "Bei „Fahrschule Düsseldorf“ ganz oben — in der Google- und in der KI-Suche. Wer sucht, findet zuerst sie." },
      { icon: Megaphone, label: "Social-Media-Macht", desc: "Ein Auftritt, der nicht nach Fahrschule aussieht, sondern nach Marke — mit Reichweite, die kein Wettbewerber hat." },
      { icon: Send, label: "Vom Profil zum Vertrag in einem Fluss", desc: "Anmeldung ohne Umweg, vom ersten Klick bis zur Unterschrift." },
    ],
    tiles: ["/referenzen/fahrschule-1.webp", "/referenzen/fahrschule-2.webp", "/referenzen/fahrschule-3.webp", "/referenzen/fahrschule-4.webp"],
  },
  {
    client: "Rohr Cleaner",
    lead: "5 Anfragen am Tag.",
    accent: "Null Euro Werbung.",
    result: "#1 bei Google & in der KI-Suche — täglich ~5 Anfragen, komplett ohne Werbebudget.",
    bullets: [
      { icon: MapPin, label: "Gefunden, wo der Auftrag entsteht", desc: "Platz 1 bei Google und in der KI-Suche — ganz oben, ohne für jeden Klick zu zahlen." },
      { icon: Eye, label: "94.034 Impressionen in 90 Tagen", desc: "Sichtbarkeit, die rund um die Uhr Kunden bringt." },
      { icon: PiggyBank, label: "5 Anfragen pro Tag, 0 € Werbebudget", desc: "Planbare Aufträge aus reiner Sichtbarkeit — der Unterschied zwischen hoffen und wissen." },
    ],
    tiles: ["/referenzen/rohr-1.webp", "/referenzen/rohr-2.webp", "/referenzen/rohr-3.webp", "/referenzen/rohr-4.webp"],
  },
  {
    client: "Light of Hope",
    lead: "Ein sensibles Thema —",
    accent: "und tausend erreichte Menschen.",
    result: "1.000+ Leads generiert. Heute täglich 5 neue Anfragen durch Performance-Marketing.",
    bullets: [
      { icon: Users, label: "Über 1.000 Menschen erreicht", desc: "Anfragen von Menschen, die Hilfe gesucht — und gefunden haben." },
      { icon: TrendingUp, label: "Täglich 5 Anfragen durch Performance-Marketing", desc: "Planbare Reichweite bei einem Thema, bei dem Vertrauen alles ist." },
      { icon: ShieldCheck, label: "Ton ohne Heilversprechen", desc: "Warm, klar, auf Augenhöhe — kein Marketing-Lärm, wo Fingerspitzengefühl zählt." },
    ],
    tiles: ["/referenzen/hope-1.webp", "/referenzen/hope-2.webp", "/referenzen/hope-3.webp", "/referenzen/hope-4.webp"],
  },
  {
    client: "Nouh-Wehres",
    lead: "Aus einem Meisterbetrieb wurde",
    accent: "eine Anfragen-Maschine.",
    result: "Täglich 3–5 qualifizierte Anfragen — planbar, jeden Tag.",
    bullets: [
      { icon: Monitor, label: "Website für alle Gewerke", desc: "Heizung, Bad, Lüftung, Solar — jede Leistung mit eigener Seite, die Anfragen bringt." },
      { icon: Inbox, label: "Jeden Tag neue Aufträge im Postfach", desc: "3 bis 5 Anfragen täglich — statt auf Empfehlungen zu hoffen." },
      { icon: Target, label: "Kampagnen, die zum Betrieb führen", desc: "Keine Klicks um der Klicks willen — direkte Anfragen von Menschen, die kaufen wollen." },
    ],
    tiles: ["/referenzen/nouh-1.webp", "/referenzen/nouh-2.webp", "/referenzen/nouh-3.webp", "/referenzen/nouh-4.webp"],
  },
];

type ProjectText = {
  lead: string;
  accent: string;
  result?: string;
  /** same order as the German bullets (icons come from there) */
  bullets: { label: string; desc: string }[];
};

/** English copy per client; merged over PROJECTS on the English site. */
const PROJECTS_EN: Record<string, ProjectText> = {
  "Priya's Cleaning Service": {
    lead: "A cleaning company that",
    accent: "runs on one piece of software.",
    bullets: [
      { label: "Scheduling at a glance", desc: "clients, sites and shifts in one dashboard." },
      { label: "Invoices in the same system", desc: "open items and client accounts without a second list." },
      { label: "Home help with proof", desc: "service records and care grades for billing the health insurers." },
    ],
  },
  "Fahrschule Abgefahrn": {
    lead: "The driving school all of Düsseldorf",
    accent: "sees first.",
    result: "#1 on Google — SEO & AI search. Plus a social media presence that reaches the whole city.",
    bullets: [
      { label: "No. 1 where it counts", desc: "Right at the top for “Fahrschule Düsseldorf” — in Google and in AI search. Whoever searches finds them first." },
      { label: "Social media muscle", desc: "A presence that looks less like a driving school and more like a brand — with reach no competitor can match." },
      { label: "From profile to contract in one flow", desc: "Sign-up without detours, from the first click to the signature." },
    ],
  },
  "Rohr Cleaner": {
    lead: "5 enquiries a day.",
    accent: "Zero euros on ads.",
    result: "#1 on Google & in AI search — ~5 enquiries every day, without any ad budget.",
    bullets: [
      { label: "Found where the job begins", desc: "No. 1 on Google and in AI search — right at the top, without paying for every click." },
      { label: "94,034 impressions in 90 days", desc: "Visibility that brings in customers around the clock." },
      { label: "5 enquiries a day, €0 ad budget", desc: "Predictable jobs from visibility alone — the difference between hoping and knowing." },
    ],
  },
  "Light of Hope": {
    lead: "A sensitive subject —",
    accent: "and a thousand people reached.",
    result: "1,000+ leads generated. Now 5 new enquiries every day through performance marketing.",
    bullets: [
      { label: "Over 1,000 people reached", desc: "Enquiries from people who were looking for help — and found it." },
      { label: "5 enquiries a day through performance marketing", desc: "Predictable reach on a subject where trust is everything." },
      { label: "A tone without miracle promises", desc: "Warm, clear, on equal terms — no marketing noise where sensitivity matters." },
    ],
  },
  "Nouh-Wehres": {
    lead: "A master craftsman’s business turned into",
    accent: "an enquiry machine.",
    result: "3–5 qualified enquiries a day — predictable, every single day.",
    bullets: [
      { label: "One website for every trade", desc: "Heating, bathrooms, ventilation, solar — every service with its own page that brings in enquiries." },
      { label: "New jobs in the inbox every day", desc: "3 to 5 enquiries a day — instead of hoping for referrals." },
      { label: "Campaigns that lead to the business", desc: "No clicks for clicks’ sake — direct enquiries from people who want to buy." },
    ],
  },
};

function localize(p: Project): Project {
  const en = PROJECTS_EN[p.client];
  if (!en) return p;
  return {
    ...p,
    lead: en.lead,
    accent: en.accent,
    result: en.result,
    bullets: p.bullets.map((b, i) => ({ ...b, ...en.bullets[i] })),
  };
}

// Figma "Elevation XL" (three stacked drop shadows in petrol).
const CARD_SHADOW =
  "0 12px 32px rgba(8,34,44,0.10), 0 40px 60px rgba(8,34,44,0.06), 0 80px 90px rgba(8,34,44,0.04)";

function BentoTile({ src, wide, client, n }: { src: Tile; wide: boolean; client: string; n: number }) {
  const t = useT();
  return (
    <div className="relative h-full overflow-hidden rounded-[12px] border border-[#eeedea] bg-[#eeedea] lg:rounded-[16px]">
      {src ? (
        <Image
          src={src}
          alt={t(`${client}, Einblick ${n}`, `${client}, snapshot ${n}`)}
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
  const locale = useLocale();
  const t = useT();
  const projects = locale === "en" ? PROJECTS.map(localize) : PROJECTS;

  // Below lg the cards stack with CSS sticky. A card taller than the space
  // under the nav sticks later (negative offset), so its bottom is seen
  // before the next card slides over it.
  useEffect(() => {
    const cards = Array.from(root.current?.querySelectorAll<HTMLElement>(".ref-card") ?? []);
    const NAV = 76;
    const update = () => {
      cards.forEach((c, i) => {
        const room = window.innerHeight - c.offsetHeight - 12;
        c.style.setProperty("--ref-top", `${Math.min(NAV + i * 10, room)}px`);
      });
    };
    update();
    const ro = new ResizeObserver(update);
    cards.forEach((c) => ro.observe(c));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

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

      // Pinned stacked deck on desktop. Below lg the cards keep their natural
      // height and stack with CSS sticky instead (no fixed stage, no gaps).
      mm.add(
        "(min-width: 1024px)",
        () => {
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
              x: OFFSETS[i] ?? 0,
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
    <section id="referenzen" ref={root} className="overflow-x-clip bg-white py-14 sm:py-24 lg:overflow-hidden lg:py-0">
      <Container>
        <div className="ref-head max-w-[720px] lg:pt-24">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <FolderOpen className="size-3.5 text-accent" />
            {t("Ausgewählte Projekte", "Selected projects")}
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            {t("Arbeiten, die", "Work that")}{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              {t("weiterlaufen", "keeps running")}
            </span>
            {t(", wenn wir nicht mehr im Raum sind.", " long after we’ve left the room.")}
          </h2>
          <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            {t(
              "Fünf Projekte aus der Zusammenarbeit mit Unternehmen, die du im Zweifel selbst anrufen kannst.",
              "Five projects with businesses you can simply call yourself if you have any doubts.",
            )}
          </p>
        </div>
      </Container>

      {/* Pinned deck: a fixed-height stage centred in the viewport, all cards
          absolutely stacked in it. */}
      <div ref={pinRef} className="mt-8 sm:mt-10 lg:mt-0">
        <div className="lg:flex lg:h-[100svh] lg:items-center lg:justify-center">
          <Container className="w-full">
            <div className="relative mx-auto flex max-w-[1200px] flex-col gap-5 lg:block lg:h-[min(510px,84vh)]">
              {projects.map((p, i) => (
                <article
                  key={p.client}
                  aria-label={p.client}
                  className="ref-card sticky top-[var(--ref-top,76px)] flex flex-col gap-5 overflow-hidden lg:absolute lg:inset-0 rounded-[22px] border border-[#eeedea] p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:rounded-[28px] lg:pb-[31px] lg:pl-[47px] lg:pr-[31px] lg:pt-[31px]"
                  style={{
                    zIndex: 10 + i * 10,
                    background: "linear-gradient(90deg, #ffffff 0%, #f4f7f8 100%)",
                    boxShadow: CARD_SHADOW,
                  }}
                >
                  <div className="ref-text flex flex-col gap-4 lg:mt-3 lg:min-w-0 lg:flex-1 lg:gap-[18px] xl:w-[400px] xl:flex-none">
                    <h3 className="font-display text-[clamp(1.3rem,4.6vw,1.6rem)] font-semibold leading-[1.22] tracking-[-0.03em] text-[#1a1917] lg:text-[clamp(1.5rem,2.3vw,29px)] lg:leading-[36px] lg:tracking-[-0.8px]">
                      {p.lead}{" "}
                      <span className="font-[family-name:var(--font-instrument)] text-[1.07em] font-normal italic tracking-[-0.5px]">
                        {p.accent}
                      </span>
                    </h3>
                    {p.result && (
                      <p className="ref-result rounded-[12px] border border-[#efe2cb] bg-[#fbf6ee] px-3.5 py-2.5 text-[13px] font-medium leading-[1.45] text-[#1a1917] lg:text-[14px]">
                        <span className="mb-0.5 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[#94713f]">{t("Das Ergebnis", "The result")}</span>
                        {p.result}
                      </p>
                    )}
                    <ul className="flex flex-col gap-3 lg:gap-3.5">
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

                  <div className="mt-auto w-full lg:mt-0 lg:w-[50%] lg:shrink-0 xl:w-[min(680px,60%)]">
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
