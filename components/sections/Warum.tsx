"use client";

import { useRef } from "react";
import { RotateCw, Users, TrendingUp, Wrench } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";

const SERVICES = [
  {
    icon: RotateCw,
    de: {
      title: "All-in-One Marketing",
      body: "Sichtbarkeit, Ads, Content, Funnels, Websites: die ganze Bandbreite, aufeinander abgestimmt statt aus fünf Händen. Ein Plan, ein Look, ein Ergebnis.",
    },
    en: {
      title: "All-in-One Marketing",
      body: "Visibility, ads, content, funnels, websites: the full range, working as one instead of coming from five different hands. One plan, one look, one result.",
    },
  },
  {
    icon: Users,
    de: {
      title: "Leadgenerierung",
      body: "Wir bauen Systeme, die planbar Anfragen bringen, über Google, Social und KI-Suche. Kein Zufall, kein Empfehlungsglück, sondern eine Maschine, die läuft.",
    },
    en: {
      title: "Lead generation",
      body: "We build systems that bring in enquiries predictably, via Google, social and AI search. No luck, no hoping for referrals, just a machine that runs.",
    },
  },
  {
    icon: TrendingUp,
    de: {
      title: "Shared Deals",
      body: "Bei den Unternehmen, an die wir glauben, steigen wir mit ein. Wir bauen mit, tragen das Risiko mit und wachsen mit dir. Skin in the Game statt nur Honorar.",
    },
    en: {
      title: "Shared Deals",
      body: "In businesses we believe in, we take a stake. We build with you, share the risk and grow with you. Skin in the game, not just fees.",
    },
  },
];

const EXTRAS = [
  { de: "Eigene Software & Apps", en: "Custom software & apps" },
  { de: "Struktur & Hiring", en: "Structure & hiring" },
  { de: "Automatisierung", en: "Automation" },
];

export default function Warum() {
  const root = useRef<HTMLDivElement>(null);
  const t = useT();

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
    <section id="warum" ref={root} className="bg-page pb-14 pt-8 sm:pb-24">
      <Container>
        <div className="warum-head max-w-[760px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 eyebrow text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Wrench className="size-3.5 text-accent" />
            {t("Der Werkzeugkasten", "The toolbox")}
          </p>
          <h2 className="t-h2 mt-5 text-ink">
            {t(
              <>
                Woran wir bei dir{" "}
                <span className="t-serif text-[#a07d45]">
                  zuerst
                </span>{" "}
                drehen.
              </>,
              <>
                The levers we pull{" "}
                <span className="t-serif text-[#a07d45]">
                  first
                </span>
                .
              </>,
            )}
          </h2>
          <p className="mt-4 max-w-[600px] t-body-l text-[#5c5954]">
            {t(
              "Kanäle sind für uns keine Produkte, sondern Werkzeuge. Wir kommen rein, finden den echten Engpass und setzen genau das ein, was dein Unternehmen gerade weiterbringt.",
              "To us, channels aren’t products, they’re tools. We come in, find the real bottleneck, and use exactly what moves your business forward right now.",
            )}
          </p>
        </div>

        <div className="warum-grid mt-8 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2">
          {SERVICES.map(({ icon: Icon, de, en }) => {
            const { title, body } = t(de, en);
            return (
            <article
              key={de.title}
              className="warum-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
              <span className="warum-accent absolute inset-x-0 top-0 h-[3px] origin-center bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

              <span className="warum-icon grid size-11 place-items-center rounded-xl border border-line bg-page text-ink/70 transition-colors group-hover:text-ink">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>

              <h3 className="t-h4 mt-6 text-ink sm:mt-14">
                {title}
              </h3>
              <p className="t-body-m mt-3 text-ink/55">
                {body}
              </p>
            </article>
            );
          })}
        </div>

        <div className="warum-extras mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent/40 bg-[rgba(209,170,113,0.1)] px-3 py-1 eyebrow text-[#94713f]">
            {t("Ergänzend", "Plus")}
          </span>
          {EXTRAS.map((e) => (
            <span
              key={e.de}
              className="warum-extra rounded-full border border-line bg-white px-3.5 py-1.5 t-body-s text-ink/60"
            >
              {t(e.de, e.en)}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
