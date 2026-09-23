"use client";

import { useEffect, useRef } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="fill-accent text-accent"
          style={{ width: size, height: size }}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      style={{ width: size, height: size }}
      className="shrink-0"
      aria-label="Google"
    >
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[rgba(209,170,113,0.16)] text-[13px] font-semibold text-[#94713f]">
      {initials}
    </span>
  );
}

type Client = { kind: "client"; quote: string; name: string; firma: string; initials: string };
type Review = { kind: "google"; text: string; meta: string };
type Summary = { kind: "summary" };
type Card = Summary | Client | Review;

const CARDS: Card[] = [
  { kind: "summary" },
  {
    kind: "client",
    quote: "TyloTech ist das Gegenteil der trägen Servicewüste Deutschland.",
    name: "Enes Seker",
    firma: "Crusty Slices, Köln",
    initials: "ES",
  },
  {
    kind: "google",
    text: "Ich bin persönlich immer sehr skeptisch, aber hier wurde ich positiv überrascht. Er reagiert auf Nachrichten und Anliegen zeitnah.",
    meta: "verifiziert, 5 von 5",
  },
  {
    kind: "client",
    quote:
      "Ich empfehle jedem Unternehmen, das Struktur und Wachstum braucht, sich an TyloTech zu wenden.",
    name: "Fahrschule Abgefahrn",
    firma: "Fahrschule, Düsseldorf",
    initials: "FA",
  },
  {
    kind: "google",
    text: "Endlich eine Agentur, die Ergebnisse liefert statt Ausreden. Klare Kommunikation, schnelle Umsetzung, alles nachvollziehbar.",
    meta: "verifiziert, 5 von 5",
  },
  {
    kind: "client",
    quote:
      "Unser gesamtes Unternehmen haben wir mit TyloTech aufgebaut — täglich 5 bis 7 günstige lokale Anfragen.",
    name: "Cleanpany Gebäudeservice",
    firma: "Gebäudereinigung, NRW",
    initials: "CG",
  },
  {
    kind: "google",
    text: "Top Betreuung von Anfang an. Man merkt, dass hier mitgedacht wird und nicht nur abgerechnet.",
    meta: "verifiziert, 5 von 5",
  },
];

const GAP = 24;

function SummaryCard() {
  return (
    <div className="flex h-full flex-col gap-4 p-7">
      <div className="flex items-center gap-2.5">
        <GoogleG size={22} />
        <span className="text-[14px] font-medium text-ink/60">
          Google-Bewertungen
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-display text-[48px] font-bold leading-none tracking-[-0.03em] text-ink">
          5,0
        </span>
        <span className="flex flex-col gap-1">
          <Stars />
          <span className="text-[12px] text-ink/45">aus 31 Bewertungen</span>
        </span>
      </div>
      <p className="text-[13.5px] leading-[1.55] text-ink/55">
        Wir bitten nach jedem abgeschlossenen Projekt um eine ehrliche Bewertung
        — auch dann, wenn nicht alles glattgelaufen ist.
      </p>
      <a
        href="#"
        className="group mt-auto inline-flex h-11 w-fit items-center gap-2 rounded-full border border-line bg-white px-5 text-[14px] font-medium text-ink shadow-[0_1px_3px_rgba(15,14,13,0.05)] transition-colors hover:border-ink/20 hover:bg-page"
      >
        Alle Bewertungen ansehen
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

function ClientCard({ c }: { c: Client }) {
  return (
    <div className="flex h-full flex-col gap-4 p-7">
      <Quote className="size-6 fill-[#c79a53] text-[#c79a53]" strokeWidth={0} />
      <p className="text-[15.5px] leading-[1.5] tracking-[-0.1px] text-ink">
        {c.quote}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <Avatar initials={c.initials} />
        <span>
          <span className="block text-[14px] font-semibold tracking-[-0.1px] text-ink">
            {c.name}
          </span>
          <span className="block text-[13px] text-ink/50">{c.firma}</span>
        </span>
      </div>
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <div className="flex h-full flex-col gap-3.5 p-7">
      <div className="flex items-center justify-between">
        <Stars />
        <GoogleG size={20} />
      </div>
      <p className="text-[14.5px] leading-[1.6] text-ink/70">{r.text}</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white">
          <GoogleG size={17} />
        </span>
        <span>
          <span className="block text-[14px] font-semibold text-ink">
            Google-Rezension
          </span>
          <span className="block text-[13px] text-ink/50">{r.meta}</span>
        </span>
      </div>
    </div>
  );
}

export default function Stimmen() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useGSAP(
    () => {
      gsap.from(".stimmen-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".stimmen-head", start: "top 82%" },
      });
      gsap.from(".stimmen-track", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stimmen-track", start: "top 88%" },
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = scroller.current;
    if (!el) return;
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.2 },
    );
    if (root.current) io.observe(root.current);

    const id = setInterval(() => {
      if (paused.current || !visible) return;
      const card = el.querySelector<HTMLElement>(".stimmen-card");
      const step = card ? card.offsetWidth + GAP : el.clientWidth;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3600);

    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);

  return (
    <section
      id="stimmen"
      ref={root}
      className="border-t border-line bg-[#f3f5f6] py-20 sm:py-24"
    >
      <Container>
        <div className="stimmen-head max-w-[720px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Star className="size-3.5 fill-accent text-accent" strokeWidth={0} />
            Was Kunden sagen
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Was Kunden{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              über die Zusammenarbeit
            </span>{" "}
            sagen.
          </h2>
          <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Nachlesbar bei Google, wir verlinken die Bewertungen direkt, statt
            sie hier nur abzuschreiben.
          </p>
        </div>

        <div
          ref={scroller}
          onPointerEnter={() => {
            paused.current = true;
          }}
          onPointerLeave={() => {
            paused.current = false;
          }}
          className="stimmen-track no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-6 pb-2 sm:mt-12 md:mx-0 md:px-0"
        >
          {CARDS.map((card, i) => (
            <article
              key={i}
              className="stimmen-card w-[85%] shrink-0 snap-start overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_18px_40px_-28px_rgba(15,14,13,0.22)] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              {card.kind === "summary" ? (
                <SummaryCard />
              ) : card.kind === "client" ? (
                <ClientCard c={card} />
              ) : (
                <ReviewCard r={card} />
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
