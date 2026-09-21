"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

type Metric = { value: string; label: string };
type Media =
  | { kind: "full"; src: string; bg: string }
  | { kind: "logo"; bg: string; logo: string; logoW: string };

type Case = {
  title: string;
  tags: string[];
  body: string;
  media: Media;
  metrics?: Metric[];
};

const CASES: Case[] = [
  {
    title: "Crusty Slices",
    tags: ["Branding", "Web", "Performance"],
    body: "Von der ersten Filiale zur Marke, die man in der Stadt kennt — Auftritt, Bestellstrecke und Kampagnen aus einer Hand.",
    media: { kind: "full", src: "/referenzen/crusty.gif", bg: "#c9a2ab" },
  },
  {
    title: "Fahrschule Abgefahrn",
    tags: ["Branding", "Web", "Social"],
    body: "Eine Fahrschule, die aussieht wie eine Marke — inklusive Theorieplan, den Fahrschüler tatsächlich benutzen.",
    media: {
      kind: "logo",
      bg: "/referenzen/fahrschule-bg.png",
      logo: "/referenzen/fahrschule-logo.svg",
      logoW: "58%",
    },
  },
  {
    title: "Light of Hope",
    tags: ["Branding", "Web", "Kampagne"],
    body: "Eine Marke mit Haltung — vom Logo bis zur Website, die Spender und Partner vom ersten Moment an überzeugt.",
    media: {
      kind: "logo",
      bg: "/referenzen/hope-bg.png",
      logo: "/referenzen/hope-logo.png",
      logoW: "54%",
    },
    metrics: [
      { value: "100%", label: "eigene Zugänge" },
      { value: "1 Team", label: "ein Ansprechpartner" },
    ],
  },
];

function Media({ media }: { media: Media }) {
  return (
    <div className="relative h-[230px] overflow-hidden bg-[#031a26]">
      {media.kind === "full" ? (
        <>
          <span
            className="absolute inset-0"
            style={{ background: media.bg }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
          />
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.bg}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.logo}
            alt=""
            style={{ width: media.logoW }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-[transform,filter] duration-[500ms] ease-out group-hover:scale-[1.08] group-hover:brightness-110"
          />
        </>
      )}
      {/* subtle sheen that lightens on hover */}
      <span className="pointer-events-none absolute inset-0 bg-[#001620]/10 transition-opacity duration-500 group-hover:opacity-0" />
    </div>
  );
}

export default function Referenzen() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const slide = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".ref-card");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

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
      gsap.from(".ref-tag", {
        y: 8,
        opacity: 0,
        scale: 0.85,
        duration: 0.4,
        ease: "back.out(1.6)",
        stagger: 0.05,
        clearProps: "transform",
        scrollTrigger: { trigger: ".ref-grid", start: "top 78%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="referenzen" ref={root} className="bg-[#001620] py-24 text-white">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            dark
            className="ref-head"
            eyebrow="Referenzen"
            title="Arbeiten, die weiterlaufen, wenn wir nicht mehr im Raum sind."
            subtitle="Drei Projekte aus der Zusammenarbeit mit Unternehmen, die Sie im Zweifel selbst anrufen können."
          />
          <div className="hidden shrink-0 gap-2.5 lg:flex">
            <button
              type="button"
              aria-label="Zurück"
              onClick={() => slide(-1)}
              className="grid size-11 place-items-center rounded-full border border-[#0a4a5f] text-white/80 transition-colors hover:border-accent hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Weiter"
              onClick={() => slide(1)}
              className="grid size-11 place-items-center rounded-full border border-[#0a4a5f] text-white/80 transition-colors hover:border-accent hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="ref-grid no-scrollbar -mx-6 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0"
        >
          {CASES.map((c) => (
            <article
              key={c.title}
              className="ref-card group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] border border-[#0a4a5f] bg-[#04283a]/60 transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(15,14,13,0.22)] sm:w-[400px] lg:w-[440px]"
            >
              <Media media={c.media} />
              <div className="flex flex-1 flex-col gap-4 px-7 py-[26px]">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="ref-tag flex h-6 items-center rounded-full bg-white/[0.06] px-2.5 text-[12px] font-medium text-[#b3d6e2]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-white">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[22px] text-[#b3d6e2]">{c.body}</p>
                {c.metrics && (
                  <>
                    <div className="mt-auto h-px w-full bg-white/10" />
                    <div className="flex gap-6">
                      {c.metrics.map((m) => (
                        <div key={m.label} className="flex-1">
                          <p className="font-display text-[22px] font-bold leading-[28px] tracking-[-0.4px] text-[#d8b682]">
                            {m.value}
                          </p>
                          <p className="text-[13px] leading-[18px] text-[#7fbacd]">
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
