"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Send,
  Search,
  MessageCircle,
  Rocket,
  Workflow,
  ArrowRight,
} from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    icon: Send,
    step: "Schritt 01",
    title: "Anfrage",
    body: "Du meldest dich — kurz, unkompliziert. Wir schauen, ob wir zueinander passen.",
  },
  {
    icon: Search,
    step: "Schritt 02",
    title: "Analyse & Planung",
    body: "Wir finden den echten Engpass in deinem Unternehmen und zeigen dir, wo dein größter Hebel liegt.",
  },
  {
    icon: MessageCircle,
    step: "Schritt 03",
    title: "Erstgespräch",
    body: "Ehrliche Einschätzung, klare Empfehlung — kein Verkaufsgespräch, sondern ein Plan.",
  },
  {
    icon: Rocket,
    step: "Schritt 04",
    title: "Strategie & Start",
    body: "Wir setzen um. Schnell, sichtbar, messbar. Du siehst ab Tag eins, was passiert.",
  },
];

const CELL_BORDERS = [
  "border-b md:border-r border-[#0a4a5f]",
  "border-b border-[#0a4a5f]",
  "border-b md:border-b-0 md:border-r border-[#0a4a5f]",
  "border-[#0a4a5f]",
];

export default function Ablauf() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".ablauf-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ablauf-head", start: "top 82%" , toggleActions: "restart none restart none" },
      });
      gsap.from(".ablauf-step", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 80%" , toggleActions: "restart none restart none" },
      });
      gsap.from(".ablauf-icon", {
        scale: 0.4,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.9)",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 78%" , toggleActions: "restart none restart none" },
      });
      gsap.from(".ablauf-cta", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ablauf-cta", start: "top 92%" , toggleActions: "restart none restart none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="ablauf" ref={root} data-nav-dark className="bg-[#001620] text-white py-24">
      <Container>
        <div className="ablauf-head mx-auto max-w-[680px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            <Workflow className="size-3.5 text-accent" />
            So arbeiten wir
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#d8b682]">
              Vier Schritte
            </span>{" "}
            bis zur Zusammenarbeit.
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#b3d6e2]">
            Kein Vertrieb, der dich durch einen Funnel schiebt. Nach dem dritten
            Schritt weißt du genau, was du bekommst.
          </p>
        </div>

        <div className="ablauf-grid mx-auto mt-14 grid max-w-[1040px] grid-cols-1 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, step, title, body }, i) => (
            <div
              key={title}
              className={cn(
                "ablauf-step py-9",
                i % 2 === 0 ? "md:pr-12" : "md:pl-12",
                CELL_BORDERS[i],
              )}
            >
              <Icon className="ablauf-icon size-6 text-accent" strokeWidth={1.6} />
              <p className="eyebrow mt-6 text-[#7fbacd]">{step}</p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.015em] text-white">
                {title}
              </h3>
              <p className="mt-2.5 max-w-[420px] text-[15px] leading-relaxed text-[#7fbacd]">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="ablauf-cta mt-14 flex justify-center">
          <Link
            href="#termin"
            className="group inline-flex h-[58px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#ecd3a4] to-[#cfa268] px-[30px] text-[16px] font-medium text-ink shadow-[0_16px_40px_-14px_rgba(209,170,113,0.9)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
          >
            Erstgespräch sichern
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
