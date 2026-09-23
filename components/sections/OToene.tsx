"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Plus, Quote, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const YT = "vSIs3xcjzG4";

type Voice = {
  cat: string;
  quote: string;
  name: string;
  firma: string;
  brand: string;
  img: string;
  vid: string;
  tint: string;
};

const VOICES: Voice[] = [
  {
    cat: "Gastronomie",
    quote: "„TyloTech ist das Gegenteil der trägen Servicewüste Deutschland.“",
    name: "Enes Seker",
    firma: "Crusty Slices · Köln",
    brand: "Crusty Slices",
    img: "/otoene/01.jpg",
    vid: YT,
    tint: "from-[#b98a5a] to-[#2a1d13]",
  },
  {
    cat: "Fahrschule",
    quote: "Eine Fahrschule, die aussieht wie eine Marke.",
    name: "Fahrschule Abgefahrn",
    firma: "Fahrschule · Düsseldorf",
    brand: "Abgefahrn",
    img: "/otoene/02.jpg",
    vid: YT,
    tint: "from-[#5a6a72] to-[#161d21]",
  },
  {
    cat: "Gebäudeservice",
    quote: "Aus unregelmäßigen Anrufen wurden planbare Anfragen.",
    name: "Cleanpany Gebäudeservice",
    firma: "Gebäudereinigung · NRW",
    brand: "Cleanpany",
    img: "/otoene/03.jpg",
    vid: YT,
    tint: "from-[#4a5a78] to-[#141a28]",
  },
  {
    cat: "Bildung",
    quote: "Anmeldungen, die von ganz allein reinkommen.",
    name: "Light of Hope",
    firma: "Bildung · Nordrhein-Westfalen",
    brand: "Light of Hope",
    img: "/otoene/04.jpg",
    vid: YT,
    tint: "from-[#6f6a52] to-[#20211a]",
  },
  {
    cat: "Handwerk",
    quote: "Der Kalender ist voll — das Postfach bleibt ruhig.",
    name: "Sanierprofi Rhein-Ruhr",
    firma: "Handwerk · Essen",
    brand: "Sanierprofi",
    img: "/otoene/05.jpg",
    vid: YT,
    tint: "from-[#7a5a48] to-[#241914]",
  },
];

const GAP = 20;

function Card({
  v,
  playing,
  onPlay,
}: {
  v: Voice;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <article className="oton-card relative aspect-[300/430] w-[80%] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube.com/embed/${v.vid}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={v.name}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`${v.name} abspielen`}
          className="group absolute inset-0 size-full text-left"
        >
          {/* thumbnail */}
          <span className={`absolute inset-0 bg-gradient-to-br ${v.tint}`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={v.img}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

          {/* top row */}
          <span className="absolute inset-x-4 top-4 flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md">
              <Plus className="size-4 text-white" />
            </span>
            <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
              {v.cat}
            </span>
          </span>

          {/* quote */}
          <span className="absolute inset-x-5 top-[68px] block max-w-[240px] font-[family-name:var(--font-instrument)] text-[clamp(16px,1.5vw,19px)] italic leading-[1.35] text-white">
            {v.quote}
          </span>

          {/* play */}
          <span className="absolute left-1/2 top-1/2 grid size-[54px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <Play className="size-6 translate-x-0.5 fill-white text-white" strokeWidth={0} />
          </span>

          {/* footer */}
          <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
                {v.name}
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-white/60">
                {v.firma}
              </span>
            </span>
            <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-white/70 backdrop-blur">
              {v.brand}
            </span>
          </span>
        </button>
      )}
    </article>
  );
}

export default function OToene() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const [playing, setPlaying] = useState<number | null>(null);

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
      gsap.from(".oton-panel", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".oton-panel", start: "top 86%" },
      });
    },
    { scope: root },
  );

  // Auto-advance the slider (scrolls only the strip). Pauses on hover, while a
  // video plays, and off-screen; honors reduced motion.
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
      if (paused.current || !visible || playing !== null) return;
      const card = el.querySelector<HTMLElement>(".oton-card");
      const step = card ? card.offsetWidth + GAP : el.clientWidth;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3800);

    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [playing]);

  return (
    <section id="otoene" ref={root} className="bg-[#001620] py-20 text-white sm:py-24">
      <Container>
        <div className="oton-head max-w-[720px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            <Quote className="size-3.5 fill-accent text-accent" strokeWidth={0} />
            O-Töne unserer Kunden
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
            Hören Sie es{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#d8b682]">
              von den Kunden selbst
            </span>
            .
          </h2>
          <p className="mt-4 max-w-[640px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#b3d6e2]">
            Kein Skript, kein Schönreden. Unternehmerinnen und Unternehmer, mit
            denen wir arbeiten, erzählen selbst, was sich verändert hat.
          </p>
        </div>

        {/* framed slider panel */}
        <div className="oton-panel mt-10 rounded-[28px] border border-[#0a3a4d] bg-[#03202c]/40 p-4 sm:mt-12 sm:p-6">
          <div
            ref={scroller}
            onPointerEnter={() => {
              paused.current = true;
            }}
            onPointerLeave={() => {
              paused.current = false;
            }}
            className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-1"
          >
            {VOICES.map((v, i) => (
              <Card
                key={v.name}
                v={v}
                playing={playing === i}
                onPlay={() => setPlaying(i)}
              />
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <Link
              href="#stimmen"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-6 text-[15px] font-medium text-white transition-colors hover:bg-white/[0.12]"
            >
              Alle Kundenstimmen ansehen
              <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
