"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Activity,
  Sparkles,
  FolderCheck,
  KeyRound,
} from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---- feature points ---------------------------------------------- */

const FEATURES = [
  {
    icon: Activity,
    title: "Echtzeit-KPIs statt Monatsbericht",
    body: "Meta, Google und SEO laufen in einer Ansicht zusammen. Du siehst am Dienstag, was am Montag passiert ist — nicht drei Wochen später.",
  },
  {
    icon: Sparkles,
    title: "Inhalte und Anzeigentexte in Sekunden",
    body: "Markengerechte Texte für Anzeigen, Landingpages und SEO — auf Basis deiner eigenen Tonalität, nicht aus der Schablone.",
  },
  {
    icon: FolderCheck,
    title: "Ein Ort für Freigaben und Absprachen",
    body: `Feedback, Freigaben und Dateien liegen beim Projekt. Kein Suchen in E-Mail-Verläufen, kein "welche Version war das noch?".`,
  },
];

export default function TyloHQ() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hq-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hq-head", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".tylohq-card", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tylohq-card", start: "top 85%" , toggleActions: "play none none none" },
      });
      gsap.from(".hq-feature", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".hq-features", start: "top 85%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="tylohq"
      ref={root}
      className="border-t border-line bg-[#f3f5f6] py-20 text-ink sm:py-24"
    >
      <Container>
        <div className="hq-head mx-auto max-w-[680px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <KeyRound className="size-3.5 text-accent" />
            Ergebnisse, keine Erzählungen
          </p>
          <h2 className="mt-5 text-balance font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Dein Projekt läuft — und du siehst es{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              in Echtzeit
            </span>
            .
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            TyloHQ ist die Plattform, auf der wir mit dir arbeiten:
            Echtzeit-Zahlen aus Meta, Google und SEO, Inhalte und Freigaben an
            einem Ort — und ein Team, das du erreichst, ohne zu suchen.
          </p>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1040px]">
          {/* soft accent glow behind card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-6 -z-0 mx-auto h-40 max-w-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(209,170,113,0.18),transparent_70%)] blur-2xl"
          />
          <div className="tylohq-card relative overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_50px_100px_-45px_rgba(15,14,13,0.32)] ring-1 ring-black/[0.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tylohq/dashboard.png"
              alt="TyloHQ Dashboard — Echtzeit-KPIs, Werbebudget und Leads auf einen Blick"
              className="block w-full"
            />
          </div>
        </div>

        <div className="hq-features mx-auto mt-16 grid max-w-[1040px] grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="hq-feature group">
              <span className="grid size-11 place-items-center rounded-xl border border-line bg-white text-[#94713f] shadow-[0_1px_3px_rgba(15,14,13,0.04)] transition-colors group-hover:border-[#d1aa71]/40 group-hover:text-[#7a5a2a]">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#5c5954]">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="hq-features mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button href="#kontakt" variant="dark" withArrow>
            TyloHQ ansehen
          </Button>
          <Link
            href="#login"
            className="text-[15px] font-medium tracking-[-0.01em] text-ink/60 transition-colors hover:text-ink"
          >
            Kunden-Login
          </Link>
        </div>
      </Container>
    </section>
  );
}
