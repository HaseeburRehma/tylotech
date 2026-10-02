"use client";

import { useRef } from "react";
import { RotateCw, Users, TrendingUp, Wrench } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const SERVICES = [
  {
    icon: RotateCw,
    title: "All-in-One Marketing",
    body: "Sichtbarkeit, Ads, Content, Funnels, Websites — die ganze Bandbreite, aufeinander abgestimmt statt aus fünf Händen. Ein Plan, ein Look, ein Ergebnis.",
  },
  {
    icon: Users,
    title: "Leadgenerierung",
    body: "Wir bauen Systeme, die planbar Anfragen bringen — über Google, Social und KI-Suche. Kein Zufall, kein Empfehlungsglück, sondern eine Maschine, die läuft.",
  },
  {
    icon: TrendingUp,
    title: "Shared Deals",
    body: "Bei den Unternehmen, an die wir glauben, steigen wir mit ein. Wir bauen mit, tragen das Risiko mit und wachsen mit dir — Skin in the Game statt nur Honorar.",
  },
];

const EXTRAS = ["Eigene Software & Apps", "Struktur & Hiring", "Automatisierung"];

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
        scrollTrigger: { trigger: ".warum-head", start: "top 80%" , toggleActions: "play none none none" },
      });
      gsap.from(".warum-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "transform,opacity,translate,rotate,scale",
        scrollTrigger: { trigger: ".warum-grid", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".warum-icon", {
        scale: 0.5,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.7)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".warum-grid", start: "top 78%" , toggleActions: "play none none none" },
      });
      gsap.fromTo(
        ".warum-accent",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".warum-grid", start: "top 80%" , toggleActions: "play none none none" },
        },
      );
      gsap.from(".warum-extra", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".warum-extras", start: "top 90%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="warum" ref={root} className="bg-page pb-24 pt-8">
      <Container>
        <div className="warum-head max-w-[760px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Wrench className="size-3.5 text-accent" />
            Der Werkzeugkasten
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Woran wir bei dir{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              zuerst
            </span>{" "}
            drehen.
          </h2>
          <p className="mt-4 max-w-[600px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Kanäle sind für uns keine Produkte, sondern Werkzeuge. Wir kommen
            rein, finden den echten Engpass — und setzen genau das ein, was dein
            Unternehmen gerade weiterbringt.
          </p>
        </div>

        <div className="warum-grid mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="warum-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
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

        <div className="warum-extras mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent/40 bg-[rgba(209,170,113,0.1)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#94713f]">
            Ergänzend
          </span>
          {EXTRAS.map((e) => (
            <span
              key={e}
              className="warum-extra rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink/60"
            >
              {e}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
