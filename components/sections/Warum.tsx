"use client";

import { useId, useRef, useState } from "react";
import { RotateCw, Users, TrendingUp, Wrench, AppWindow, Network, Workflow, ChevronDown } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { trackSpotlight } from "@/lib/spotlight";

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
  {
    icon: AppWindow,
    de: {
      title: "Eigene Software & Apps",
      body: "Wenn Standard-Tools nicht passen, bauen wir dir eigene Software: Kundenportale, interne Tools und Apps, maßgeschneidert auf deine Abläufe.",
    },
    en: {
      title: "Custom software & apps",
      body: "When off-the-shelf tools don’t fit, we build your own software: customer portals, internal tools and apps, tailored to the way you work.",
    },
  },
  {
    icon: Network,
    de: {
      title: "Struktur & Hiring",
      body: "Klare Rollen, saubere Abläufe und ein Recruiting, das die richtigen Leute bringt. Damit dein Team mit dem Wachstum mithält.",
    },
    en: {
      title: "Structure & hiring",
      body: "Clear roles, clean processes and recruiting that brings in the right people, so your team keeps pace with your growth.",
    },
  },
  {
    icon: Workflow,
    de: {
      title: "Automatisierung",
      body: "Angebote, Rechnungen, Nachfassen: Wiederkehrende Aufgaben laufen automatisch. Du gewinnst Zeit für das, was nur du kannst.",
    },
    en: {
      title: "Automation",
      body: "Quotes, invoices, follow-ups: recurring tasks run on their own, and you get time back for what only you can do.",
    },
  },
];

export default function Warum() {
  const root = useRef<HTMLDivElement>(null);
  const t = useT();
  const panelId = useId();
  // which "Ergänzend" chip is open (null = panel closed)
  const [extra, setExtra] = useState<number | null>(null);

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
              onPointerMove={trackSpotlight}
              className="warum-card pillar-card group relative overflow-hidden rounded-[20px] border border-line bg-white p-7"
            >
              <span className="warum-accent absolute inset-x-0 top-0 h-[3px] origin-center bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

              <span className="warum-icon pillar-icon grid size-11 place-items-center rounded-xl border border-line bg-page text-ink/70">
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
          {EXTRAS.map((e, i) => {
            const on = extra === i;
            return (
              <button
                key={e.de.title}
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setExtra(on ? null : i)}
                className={cn(
                  "warum-extra group/chip inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 t-body-s transition-[background-color,border-color,color,box-shadow,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  on
                    ? "border-[#d1aa71] bg-[#fbf6ee] text-[#7a5c30] shadow-[0_8px_18px_-12px_rgba(148,113,63,0.6)]"
                    : "border-line bg-white text-ink/60 hover:border-[#d1aa71]/60 hover:text-ink",
                )}
              >
                {t(e.de.title, e.en.title)}
                <ChevronDown
                  aria-hidden
                  className={cn("size-3.5 transition-transform duration-300", on ? "rotate-180 text-[#94713f]" : "text-ink/35 group-hover/chip:text-[#94713f]")}
                  strokeWidth={2}
                />
              </button>
            );
          })}
        </div>

        {/* "Ergänzend": three more cards, opened from the chips above */}
        <div id={panelId} className="extras-panel data-[open=true]:-mb-10" data-open={extra !== null} aria-hidden={extra === null}>
          {/* side/bottom room so the cards' lift and shadow aren't clipped */}
          <div className="-mx-4 px-4">
            <div className="grid grid-cols-1 gap-4 pb-10 pt-5 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2">
              {EXTRAS.map(({ icon: Icon, de, en }, i) => {
                const { title, body } = t(de, en);
                const on = extra === i;
                return (
                  <article
                    key={de.title}
                    style={{ "--i": i } as React.CSSProperties}
                    onPointerMove={trackSpotlight}
                    onClick={() => setExtra(i)}
                    className={cn(
                      "pillar-card group relative cursor-pointer overflow-hidden rounded-[20px] border p-7",
                      on ? "border-[#d1aa71] bg-[#fffdf9] shadow-[0_22px_48px_-30px_rgba(148,113,63,0.5)]" : "border-line bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-500",
                        on ? "opacity-100" : "opacity-50",
                      )}
                    />
                    <span
                      className={cn(
                        "pillar-icon grid size-11 place-items-center rounded-xl border",
                        on ? "border-[#d1aa71]/60 bg-[#fbf6ee] text-[#94713f]" : "border-line bg-page text-ink/70",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="t-h4 mt-6 text-ink sm:mt-10">{title}</h3>
                    <p className="t-body-m mt-3 text-ink/55">{body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
