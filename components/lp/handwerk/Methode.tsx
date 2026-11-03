"use client";

import { useRef } from "react";
import { Hand, LayoutGrid, Layers, MousePointerClick, Smartphone } from "lucide-react";
import Container from "@/components/ui/Container";
import { GoldButton } from "@/components/branche/ui";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { RequestCard } from "./Cases";
import { HQDashboard, HQPhone } from "./HQDemo";
import { FORM, Pill, SnapSlider } from "./ui";

/* 04 · Methode: dark section, interactive TyloHQ dashboard (phone app below lg) with live request cards on top. */

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

/* Official-style store badges: black, white type, Apple logo, Google Play in its colours. */
function StoreBadge({ store }: { store: "apple" | "google" }) {
  const apple = store === "apple";
  return (
    <span
      role="img"
      aria-label={apple ? "Laden im App Store" : "Jetzt bei Google Play"}
      className="inline-flex h-[50px] items-center gap-2 rounded-[11px] border border-[#a6a6a6] bg-black pl-3 pr-4 text-white sm:h-[54px] sm:gap-2.5 sm:rounded-[12px] sm:pl-3.5 sm:pr-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      {apple ? (
        <svg viewBox="0 0 384 512" className="h-[26px] w-[22px]" aria-hidden>
          <path fill="#fff" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 512 512" className="size-[24px]" aria-hidden>
          <path fill="#00d7fe" d="M48.4 18.3C40.6 26.5 36 39.2 36 55.7v400.6c0 16.5 4.6 29.2 12.4 37.4l1.9 1.8L274.7 271v-5.3L50.3 16.5z" />
          <path fill="#ffce00" d="m349.5 345.9-74.8-74.8v-5.3l74.8-74.8 1.7 1 88.6 50.3c25.3 14.4 25.3 37.9 0 52.3l-88.6 50.3z" />
          <path fill="#ff3a44" d="M351.2 344.9 274.7 268.4 48.4 494.7c8.4 8.9 22.2 10 37.8 1.2z" />
          <path fill="#00f076" d="M351.2 192.1 86.2 41.4C70.6 32.6 56.8 33.7 48.4 42.6l226.3 225.9z" />
        </svg>
      )}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium tracking-[0.2px]">{apple ? "Laden im" : "JETZT BEI"}</span>
        <span className="mt-[3px] text-[17px] font-semibold tracking-[-0.4px] sm:text-[19px]">{apple ? "App Store" : "Google Play"}</span>
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
          {/* laptop and up: the interactive dashboard with live cards on top */}
          <div className="hidden lg:block">
            <div className="rounded-[24px] border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
              <HQDashboard />
            </div>
            <div className="pointer-events-none absolute right-[-3%] top-[27%] flex flex-col items-end gap-3.5">
              {FLOATING.map((f) => (
                <div key={f.r.title} className="lpm-float">
                  <div className={f.float}>
                    <RequestCard r={f.r} compact className="whitespace-nowrap" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.6px] text-white/60">
              <MousePointerClick className="size-3.5 text-[#d8b682]" strokeWidth={1.8} aria-hidden />
              Interaktive Demo: klick dich durch TyloHQ
            </p>
          </div>
          {/* phones and tablets: the TyloHQ app */}
          <div className="lg:hidden">
            <HQPhone />
            <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.6px] text-white/60">
              <Hand className="size-3.5 text-[#d8b682]" strokeWidth={1.8} aria-hidden />
              Tipp auf Anfragen und Tabs
            </p>
          </div>
        </div>

        <div className="lpm-features mt-12 sm:mt-14 [&_button>span]:bg-white/30 [&_button[aria-current=true]>span]:bg-[#d8b682]">
          <SnapSlider label="So funktioniert unser System" className="lg:grid-cols-3 lg:gap-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="lpm-feature flex h-full flex-col items-start gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0">
                <span className="grid size-[46px] place-items-center rounded-[12px] border border-white/15 bg-white/[0.06]">
                  <f.icon className="size-[21px] text-[#d8b682]" strokeWidth={1.7} aria-hidden />
                </span>
                <h3 className="t-h5 text-white">{f.title}</h3>
                <p className="t-body-m text-white/70">{f.text}</p>
              </div>
            ))}
          </SnapSlider>
        </div>

        <div className="lpm-end mt-12 flex flex-col items-center gap-4 sm:mt-14">
          <p className="eyebrow text-white/80">TyloHQ gibt es als App für iOS und Android</p>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
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
