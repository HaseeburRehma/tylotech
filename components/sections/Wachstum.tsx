"use client";

import { useRef } from "react";
import { RotateCw, Users, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
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
    },
    { scope: root },
  );

  return (
    <section id="hebel" ref={root} className="bg-page py-24">
      <Container>
        <SectionHeading
          className="hebel-head"
          eyebrow="Drei Hebel"
          title="Woran wir bei Ihnen zuerst drehen."
          subtitle="Nicht alles gleichzeitig. Erst das, was am schnellsten Wirkung zeigt — und was danach von allein weiterläuft."
        />

        <div className="hebel-grid mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LEVERS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="hebel-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
              <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

              <span className="grid size-11 place-items-center rounded-xl border border-line bg-page text-ink/70 transition-colors group-hover:text-ink">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>

              <h3 className="mt-14 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink">
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
