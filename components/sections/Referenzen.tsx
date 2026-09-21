"use client";

import { useRef } from "react";
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
    <div className="relative h-[230px] overflow-hidden bg-[#e5e3df]">
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
    <section id="referenzen" ref={root} className="bg-page py-24">
      <Container>
        <SectionHeading
          className="ref-head"
          eyebrow="Referenzen"
          title="Arbeiten, die weiterlaufen, wenn wir nicht mehr im Raum sind."
          subtitle="Drei Projekte aus der Zusammenarbeit mit Unternehmen, die Sie im Zweifel selbst anrufen können."
        />

        <div className="ref-grid mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <article
              key={c.title}
              className="ref-card group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(15,14,13,0.22)]"
            >
              <Media media={c.media} />
              <div className="flex flex-1 flex-col gap-4 px-7 py-[26px]">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="ref-tag flex h-6 items-center rounded-full bg-[#eeedea] px-2.5 text-[12px] font-medium text-[#5c5954]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-[22px] text-[#5c5954]">{c.body}</p>
                {c.metrics && (
                  <>
                    <div className="mt-auto h-px w-full bg-[#eeedea]" />
                    <div className="flex gap-6">
                      {c.metrics.map((m) => (
                        <div key={m.label} className="flex-1">
                          <p className="font-display text-[22px] font-bold leading-[28px] tracking-[-0.4px] text-[#94713f]">
                            {m.value}
                          </p>
                          <p className="text-[13px] leading-[18px] text-[#7d7973]">
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
