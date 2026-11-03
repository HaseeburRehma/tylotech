"use client";

import { useRef } from "react";
import { LayoutGrid, Layers, Smartphone } from "lucide-react";
import Container from "@/components/ui/Container";
import { GoldButton } from "@/components/branche/ui";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { RequestCard } from "./Cases";
import { FORM, Pill } from "./ui";

/* 04 · Methode: dark section, TyloHQ dashboard with live request cards on top. */

const FEATURES = [
  { icon: Layers, title: "Bewährte Methode", text: "Ein Mix aus Online-Marketing, den wir über Jahre in Handwerksbetrieben verfeinert haben. Kein Experiment, kein Baukasten." },
  { icon: LayoutGrid, title: "Eigene Software: TyloHQ", text: "Unsere Software erfasst jede Anfrage, qualifiziert sie und ordnet sie zu. Als App im App Store und bei Google Play. Sie gehört uns, nicht einem Portal." },
  { icon: Smartphone, title: "In Echtzeit in deiner App", text: "Jede Anfrage landet sofort in der App deines Betriebs, mit Status und Zuständigkeit. Nichts geht verloren." },
];

const FLOATING = [
  { r: { title: "Badsanierung, Düsseldorf-Bilk", meta: "vor 4 Minuten", status: "neu" as const }, float: "motion-safe:animate-[bhFloat_4.6s_ease-in-out_1.2s_infinite]" },
  { r: { title: "Notdienst, Flingern", meta: "vor 12 Minuten", status: "neu" as const }, float: "motion-safe:animate-[bhFloat_5.2s_ease-in-out_2s_infinite]" },
  { r: { title: "Heizung, Oberkassel", meta: "heute, 08:40, M. Weber", status: "zugewiesen" as const }, float: "motion-safe:animate-[bhFloat_4.9s_ease-in-out_2.8s_infinite]" },
];

function StoreBadge({ store }: { store: "apple" | "google" }) {
  return (
    <span className="inline-flex h-[52px] items-center gap-2.5 rounded-[12px] border border-white/70 bg-white px-4 text-[#0f0e0d]">
      {store === "apple" ? (
        <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden>
          <path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-3.8zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.9-1.4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-[20px]" aria-hidden>
          <path fill="currentColor" d="M3.6 1.8c-.3.3-.4.7-.4 1.3v17.8c0 .6.1 1 .4 1.3l.1.1L13.6 12v-.2L3.7 1.7l-.1.1zm13.3 13.5-3.3-3.3V11.8l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2h-.1zm.1 0L13.6 12 3.6 22c.4.4 1 .4 1.6.1L17 15.3m0-6.6L5.2 1.9c-.7-.4-1.2-.3-1.6.1l10 10L17 8.7z" />
        </svg>
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3px]">{store === "apple" ? "Laden im" : "Jetzt bei"}</span>
        <span className="mt-0.5 font-display text-[17px] font-medium tracking-[-0.3px]">{store === "apple" ? "App Store" : "Google Play"}</span>
      </span>
    </span>
  );
}

export default function Methode() {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".lpm-head > *", { y: 26, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".lpm-head") });
      gsap.from(".lpm-dash", { y: 60, opacity: 0, scale: 0.97, duration: 1.1, ease: "power3.out", scrollTrigger: st(".lpm-dash", "top 88%") });
      gsap.from(".lpm-float", { x: 50, opacity: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.18, delay: 0.5, scrollTrigger: st(".lpm-dash", "top 75%") });
      gsap.from(".lpm-feature", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".lpm-features") });
      gsap.from(".lpm-end > *", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, scrollTrigger: st(".lpm-end", "top 90%") });
    },
    { scope: root },
  );

  return (
    <section id="methode" ref={root} className="scroll-mt-20 overflow-hidden bg-[#002e3d] py-16 text-white sm:py-24 lg:py-28">
      <Container>
        <div className="lpm-head mx-auto flex max-w-[780px] flex-col items-center gap-5 text-center">
          <Pill icon={LayoutGrid} dark>
            Unsere bewährte Methode + eigene Software
          </Pill>
          <h2 className="t-h2 text-white">
            Kein Marketing von der Stange. <span className="t-serif text-[#d8b682]">Ein eigenes System,</span> das Anfragen erzeugt.
          </h2>
          <p className="t-body-l text-white/75">
            Eine bewährte Methode, ein Mix aus Online-Marketing, plus unsere eigene Software TyloHQ. Sie erfasst jede Anfrage und liefert sie in Echtzeit in die App deines Betriebs. Darum entstehen die Anfragen überhaupt.
          </p>
        </div>

        <div className="lpm-dash relative mx-auto mt-12 max-w-[1180px] sm:mt-14">
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] sm:rounded-[24px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lp/handwerk/dashboard.webp" alt="TyloHQ Dashboard mit neuen Anfragen, Terminen und Reaktionszeit" width={1180} height={498} loading="lazy" className="block h-auto w-full" />
          </div>
          {/* live cards over the dashboard, stacked so they never collide (from lg up; smaller screens show them below) */}
          <div className="absolute right-[-3%] top-[27%] hidden flex-col items-end gap-3.5 lg:flex">
            {FLOATING.map((f) => (
              <div key={f.r.title} className="lpm-float">
                <div className={f.float}>
                  <RequestCard r={f.r} compact className="whitespace-nowrap" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:hidden [&>*]:flex-1">
            {FLOATING.slice(0, 2).map((f) => (
              <div key={f.r.title} className="lpm-float">
                <RequestCard r={f.r} />
              </div>
            ))}
          </div>
        </div>

        <div className="lpm-features mt-12 grid grid-cols-1 gap-8 sm:mt-14 md:grid-cols-3 md:gap-6 lg:gap-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="lpm-feature flex flex-col items-start gap-4">
              <span className="grid size-[46px] place-items-center rounded-[12px] border border-white/15 bg-white/[0.06]">
                <f.icon className="size-[21px] text-[#d8b682]" strokeWidth={1.7} aria-hidden />
              </span>
              <h3 className="t-h5 text-white">{f.title}</h3>
              <p className="t-body-m text-white/70">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="lpm-end mt-12 flex flex-col items-center gap-4 sm:mt-14">
          <p className="eyebrow text-white/80">TyloHQ gibt es als App für iOS und Android</p>
          <div className="flex flex-wrap justify-center gap-3">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>
          <div className="mt-8 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-10">
            <GoldButton href={FORM} className="w-full sm:w-auto">
              Kostenlose Konkurrenz-Analyse sichern
            </GoldButton>
            <a href="#vergleich" className="t-button text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline">
              So arbeitet unser System
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
