"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Gauge, LayoutDashboard, MousePointerClick, Sparkles, Users } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import HQApp from "../tylohq/HQApp";
import { TYLOHQ_URL } from "@/lib/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const FEATURES = [
  {
    icon: Gauge,
    title: "Echtzeit-KPIs statt Monatsbericht",
    body: "Meta, Google und SEO laufen in einer Ansicht zusammen. Du siehst am Dienstag, was am Montag passiert ist, nicht drei Wochen später.",
  },
  {
    icon: Sparkles,
    title: "Inhalte und Anzeigentexte in Sekunden",
    body: "Markengerechte Texte für Anzeigen, Landingpages und SEO, auf Basis deiner eigenen Tonalität, nicht aus der Schablone.",
  },
  {
    icon: Users,
    title: "Ein Ort für Freigaben und Absprachen",
    body: "Feedback, Freigaben und Dateien liegen beim Projekt. Kein Suchen in E-Mail-Verläufen, kein „welche Version war aktuell?“.",
  },
];

export default function TyloHQDashboard() {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useGSAP(
    () => {
      gsap.from(".hqd-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hqd-head", start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.from(".hqd-app", {
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 1.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".hqd-app", start: "top 88%", toggleActions: "play none none none" },
      });
      ScrollTrigger.create({
        trigger: ".hqd-app",
        start: "top 70%",
        end: "max",
        once: true,
        onToggle: (self) => self.isActive && setLive(true),
      });
      gsap.from(".hqd-feature", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hqd-features", start: "top 85%", toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="tylohq-app" ref={root} className="overflow-hidden border-t border-line bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container>
        <div className="hqd-head mx-auto flex max-w-[800px] flex-col items-center text-center">
          <p className="mb-[18px] inline-flex w-fit items-center gap-[7px] rounded-full border border-[rgba(8,34,44,0.08)] bg-white/70 py-[7px] pl-2.5 pr-3.5 font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#5c5954] shadow-[0_8px_24px_rgba(8,34,44,0.08)] backdrop-blur-md sm:text-[12px]">
            <LayoutDashboard className="size-3.5 text-[#c79a53]" strokeWidth={1.8} />
            Ergebnisse, keine Erzählungen
          </p>
          <h2 className="font-display text-[clamp(2rem,3.4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-1.3px] text-[#1a1917]">
            Dein Projekt läuft und du siehst es{" "}
            <span className="font-[family-name:var(--font-instrument)] text-[1.05em] font-normal italic tracking-[-0.5px] text-[#b08547]">
              in Echtzeit
            </span>
            .
          </h2>
          <p className="mt-[18px] text-[clamp(16px,1.4vw,18px)] leading-[28px] tracking-[-0.18px] text-[#5c5954]">
            Kein Ratespiel, kein monatliches PDF. In TyloTech HQ siehst du jederzeit, wo dein Projekt steht: Leads,
            Kosten pro Lead, Conversions, Traffic. Transparenz ist bei uns kein Extra: sie ist die Grundlage.
          </p>
        </div>

        <div className="hqd-app relative mx-auto mt-10 max-w-[1180px] sm:mt-14">
          <HQApp live={live} />
          <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.6px] text-[#7d7973]">
            <MousePointerClick className="size-3.5 text-[#c79a53]" strokeWidth={1.8} />
            Live-Demo · klick dich durch die Bereiche
          </p>
        </div>

        <div className="hqd-features mx-auto mt-14 grid max-w-[1280px] grid-cols-1 gap-10 sm:mt-16 md:grid-cols-3 md:gap-6 lg:gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="hqd-feature group">
                <span className="grid size-[46px] place-items-center rounded-[13px] border border-[#e2e0dc] bg-white text-[#94713f] shadow-[0_1px_2px_rgba(8,34,44,0.04)] transition-[border-color,background-color] duration-300 group-hover:border-[#e3c79e] group-hover:bg-[#fbf6ee]">
                  <Icon className="size-[21px]" strokeWidth={1.6} />
                </span>
                <h3 className="mt-[14px] font-display text-[19px] font-medium leading-[26px] tracking-[-0.4px] text-[#1a1917] sm:text-[20px]">
                  {f.title}
                </h3>
                <p className="mt-3.5 text-[15px] leading-[26px] tracking-[-0.1px] text-[#5c5954] sm:text-[16px]">{f.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
          <Button href="/kontakt" variant="dark" withArrow>
            TyloHQ-Zugang anfragen
          </Button>
          <a
            href={TYLOHQ_URL}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 rounded-[10px] border border-[#e2e0dc] bg-white/60 px-7 py-4 text-[16px] font-medium leading-5 tracking-[-0.01em] text-[#1a1917] transition-colors hover:bg-white"
          >
            Kunden-Login
            <ArrowUpRight className="size-[18px] text-[#7d7973] transition-[color,translate] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-[#94713f]" strokeWidth={1.9} />
          </a>
        </div>
      </Container>
    </section>
  );
}
