"use client";

import { useRef } from "react";
import { RotateCw, Users, TrendingUp, Layers } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const LEVERS = [
  {
    icon: RotateCw,
    title: "Effiziente Prozesse & Automatisierung",
    body: "Wir nehmen die Handgriffe aus Ihrem Tag, die niemand machen will. Angebote, Rechnungen, Nachfassen, Reporting — einmal sauber aufgesetzt, läuft es ohne Sie.",
  },
  {
    icon: Users,
    title: "Smartes Recruiting & Teamaufbau",
    body: "Gute Leute finden Sie über Stellenanzeigen allein nicht mehr. Wir bauen einen Prozess, der Bewerbungen bringt — und die Richtigen davon auch hält.",
  },
  {
    icon: TrendingUp,
    title: "Marketing, das verkauft",
    body: "Sichtbarkeit ist kein Selbstzweck. Wir messen Kampagnen an Anfragen und Aufträgen und schalten ab, was nichts bringt — auch wenn die Zahlen schön aussehen.",
  },
];

export default function Wachstum() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hebel-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hebel-head", start: "top 80%" },
      });
      gsap.from(".hebel-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hebel-grid", start: "top 82%" },
      });
      gsap.from(".hebel-icon", {
        scale: 0.5,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.7)",
        stagger: 0.1,
        clearProps: "transform",
        scrollTrigger: { trigger: ".hebel-grid", start: "top 78%" },
      });
      gsap.fromTo(
        ".hebel-accent",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".hebel-grid", start: "top 80%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="hebel" ref={root} className="bg-page py-24">
      <Container>
        <div className="hebel-head max-w-[760px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Layers className="size-3.5 text-accent" />
            Unser Fundament
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Woran wir bei Ihnen{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              zuerst
            </span>{" "}
            drehen.
          </h2>
          <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Nicht alles gleichzeitig. Erst das, was am schnellsten Wirkung zeigt,
            und was danach von allein weiterläuft.
          </p>
        </div>

        <div className="hebel-grid mt-12 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {LEVERS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="hebel-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
              <span className="hebel-accent absolute inset-x-0 top-0 h-[3px] origin-left bg-accent" />

              <span className="hebel-icon grid size-11 place-items-center rounded-xl bg-[rgba(209,170,113,0.14)] text-[#6b6863] transition-colors group-hover:text-[#94713f]">
                <Icon className="size-5" strokeWidth={1.7} />
              </span>

              <h3 className="mt-12 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:mt-14">
                {title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/55">
                {body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
