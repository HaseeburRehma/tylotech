"use client";

import { useRef } from "react";
import { Users, Target, Lock } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

const HURDLES = [
  {
    icon: Users,
    title: "Drei Dienstleister, keiner verantwortlich",
    body: "Die Website-Agentur zeigt auf die Marketing-Agentur, die zeigt auf die IT. Am Ende koordinieren Sie — und bezahlen dafür auch noch.",
  },
  {
    icon: Target,
    title: "Kampagnen ohne Fundament",
    body: "Anzeigen bringen Klicks auf eine Seite, die nicht verkauft. Das Budget ist weg, bevor überhaupt jemand angerufen hat.",
  },
  {
    icon: Lock,
    title: "Systeme, die niemand mehr anfasst",
    body: "Software, die nur einer verstanden hat — und der ist längst weg. Jede kleine Änderung wird zum eigenen Projekt.",
  },
];

export default function Warum() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".warum-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".warum-head", start: "top 80%" },
      });
      gsap.from(".warum-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".warum-grid", start: "top 82%" },
      });
      gsap.from(".warum-icon", {
        scale: 0.5,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.7)",
        stagger: 0.1,
        clearProps: "transform",
        scrollTrigger: { trigger: ".warum-grid", start: "top 78%" },
      });
      gsap.fromTo(
        ".warum-accent",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".warum-grid", start: "top 80%" },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="warum" ref={root} className="bg-page pb-24 pt-8">
      <Container>
        <SectionHeading
          className="warum-head"
          eyebrow="Warum es oft nicht vorangeht"
          title="Digitalisierung scheitert selten an der Technik."
          subtitle="Sie scheitert an Zuständigkeiten, an Dienstleistern, die nur ihren Ausschnitt sehen, und an Systemen, die am Ende niemand mehr anfasst. Wir haben das oft genug aufgeräumt, um zu wissen, woran es wirklich liegt."
        />

        <div className="warum-grid mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HURDLES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="warum-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
              {/* gold top accent */}
              <span className="warum-accent absolute inset-x-0 top-0 h-[3px] origin-center bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

              <span className="warum-icon grid size-11 place-items-center rounded-xl border border-line bg-page text-ink/70 transition-colors group-hover:text-ink">
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
