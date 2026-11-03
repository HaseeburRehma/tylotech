"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import PartnerLogo from "@/components/PartnerLogo";
import { GoldButton } from "@/components/branche/ui";
import { PARTNERS } from "@/lib/partners";
import { gsap, reducedMotion, useGSAP } from "@/lib/gsap";
import AnalyseForm from "./AnalyseForm";
import { FORM, Pill, Stars } from "./ui";

/* 01 · Hero: copy + trust left, analysis form right, endless trades slider below. */

const TRADES = [
  { label: "Sanitär-, Heizungs- & SHK-Betriebe", src: "/branchen/handwerk/tile-1.webp" },
  { label: "Elektrobetriebe", src: "/branchen/handwerk/tile-2.webp" },
  { label: "Dachdecker", src: "/branchen/handwerk/tile-3.webp" },
  { label: "Maler & Bodenleger", src: "/branchen/handwerk/tile-4.webp" },
  { label: "Solar- & Energietechnik", src: "/branchen/handwerk/tile-7.webp" },
  { label: "GaLaBau", src: "/branchen/handwerk/tile-5.webp" },
  { label: "Rohrreinigung & Schlüsseldienst", src: "/branchen/handwerk/tile-6.webp" },
];

const LOGOS = ["Rohrcleaner", "Nouh-Wehres", "Lightvolt Elektrotechnik", "Sanierungslotse"]
  .map((n) => PARTNERS.find((p) => p.name === n))
  .filter((p): p is (typeof PARTNERS)[number] => !!p);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".lph-form", { y: 36, opacity: 0, scale: 0.98, duration: 1, ease: "power3.out", delay: 0.25 });
      gsap.from(".lph-tile", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay: 0.5 });

      // endless trades slider: two copies, slides half its width, slows on hover
      if (!track.current) return;
      const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration: 45, repeat: -1 });
      const el = track.current;
      const slow = () => gsap.to(loop, { timeScale: 0.15, duration: 0.5 });
      const fast = () => gsap.to(loop, { timeScale: 1, duration: 0.5 });
      el.addEventListener("mouseenter", slow);
      el.addEventListener("mouseleave", fast);
      el.addEventListener("touchstart", slow, { passive: true });
      el.addEventListener("touchend", fast);
      return () => {
        el.removeEventListener("mouseenter", slow);
        el.removeEventListener("mouseleave", fast);
        el.removeEventListener("touchstart", slow);
        el.removeEventListener("touchend", fast);
      };
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 left-[32%] h-[760px] w-[1180px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.2),rgba(209,170,113,0.05)_60%,transparent)]"
      />
      <Container className="relative grid grid-cols-1 items-start gap-10 pb-12 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,640px)_minmax(0,568px)] lg:justify-between lg:gap-12 lg:pt-[88px]">
        <div className="intro-stagger flex min-w-0 flex-col items-start gap-6 sm:gap-7">
          <Pill icon={MapPin}>Eigenes System für Handwerksbetriebe in NRW</Pill>
          <h1 className="t-h1 [--lh-d:57] [--ls-d:-1.7] text-[#1a1917]">
            Mehr Aufträge für dein Handwerk,
            <br />
            <span className="t-serif text-[#94713f] md:tracking-[-0.02em]">durch unser eigenes System.</span>
          </h1>
          <p className="t-body-xl text-[#5c5954]">
            Keine gekauften Leads, keine geteilten Nummern. Wir haben eine bewährte Methode und eine eigene Software gebaut, die dir laufend Anfragen aus deiner Stadt in deine eigene App liefert. Und wir nehmen nur einen Betrieb pro Gewerk und Stadt.
          </p>
          <GoldButton href={FORM} className="w-full sm:w-auto">
            Kostenlose Konkurrenz-Analyse sichern
          </GoldButton>
          <div className="h-px w-full bg-[#eeedea]" />
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <Stars />
              <span className="t-label-l text-[#1a1917]">5,0</span>
              <span className="t-body-s text-[#5c5954]">aus 31 Google-Bewertungen</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="font-mono text-[12px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#7d7973]">Partnerbetriebe</span>
              {LOGOS.map((p) => (
                <PartnerLogo key={p.name} partner={p} tint="#8f8a82" scale={20 / p.h} />
              ))}
            </div>
          </div>
        </div>

        <div
          id="analyse"
          className="lph-form scroll-mt-24 rounded-[24px] border border-[#eeedea] bg-white p-6 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:p-8"
        >
          <p className="flex items-center gap-2 eyebrow text-[#94713f]">
            <span aria-hidden className="size-2 rounded-full bg-[#1e7a52] shadow-[0_0_0_3px_rgba(30,122,82,0.15)] motion-safe:animate-pulse" />
            Kostenlose Konkurrenz-Analyse
          </p>
          <h2 className="mt-3 font-display text-[clamp(21px,calc(21px_+_3_*_(100vw_-_390px)_/_1050),24px)] font-semibold leading-[1.25] tracking-[-0.7px] text-[#1a1917]">
            Wer gewinnt gerade <span className="t-serif text-[#94713f]">die Aufträge</span> in deiner Stadt?
          </h2>
          <p className="t-body-s mt-2.5 text-[#5c5954]">
            Wir prüfen deine Stadt und zeigen dir, welche Betriebe aktuell vorne liegen. Antwort innerhalb von 24 Stunden.
          </p>
          <div className="my-6 h-px bg-[#eeedea]" />
          <AnalyseForm />
        </div>
      </Container>

      {/* trades slider, edge to edge on the right like Figma (the fifth tile is cut off) */}
      <div className="relative pb-14 sm:pb-20 lg:pb-[72px]" aria-label="Gewerke, für die unser System läuft">
        <div className="overflow-hidden">
          <div ref={track} className="flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                {TRADES.map((t) => (
                  <figure
                    key={t.label}
                    className="lph-tile group relative h-[170px] w-[250px] shrink-0 overflow-hidden rounded-[18px] sm:h-[200px] sm:w-[300px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.src} alt="" loading={copy ? "lazy" : "eager"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,13,0)_40%,rgba(15,14,13,0.72)_100%)]" />
                    <figcaption className="absolute inset-x-[22px] bottom-5 font-display text-[17px] font-medium leading-[24px] tracking-[-0.3px] text-white">{t.label}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
