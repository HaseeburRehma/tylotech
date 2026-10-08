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
import { useLocalePath, useT } from "../i18n/LocaleProvider";

const STEPS = [
  {
    icon: Send,
    step: "Schritt 01",
    title: "Anfrage",
    body: "Du meldest dich, kurz und unkompliziert. Wir schauen, ob wir zueinander passen.",
    en: {
      step: "Step 01",
      title: "Enquiry",
      body: "You get in touch, quick and easy. We see whether we're a good fit.",
    },
  },
  {
    icon: Search,
    step: "Schritt 02",
    title: "Analyse & Planung",
    body: "Wir finden den echten Engpass in deinem Unternehmen und zeigen dir, wo dein größter Hebel liegt.",
    en: {
      step: "Step 02",
      title: "Analysis & planning",
      body: "We find the real bottleneck in your business and show you where your biggest lever is.",
    },
  },
  {
    icon: MessageCircle,
    step: "Schritt 03",
    title: "Erstgespräch",
    body: "Ehrliche Einschätzung, klare Empfehlung. Kein Verkaufsgespräch, sondern ein Plan.",
    en: {
      step: "Step 03",
      title: "Intro call",
      body: "An honest assessment, a clear recommendation. Not a sales pitch, a plan.",
    },
  },
  {
    icon: Rocket,
    step: "Schritt 04",
    title: "Strategie & Start",
    body: "Wir setzen um. Schnell, sichtbar, messbar. Du siehst ab Tag eins, was passiert.",
    en: {
      step: "Step 04",
      title: "Strategy & launch",
      body: "We deliver. Fast, visible, measurable. From day one you see what's happening.",
    },
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
  const t = useT();
  const lp = useLocalePath();

  useGSAP(
    () => {
      gsap.from(".ablauf-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ablauf-head", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".ablauf-step", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 80%" , toggleActions: "play none none none" },
      });
      gsap.from(".ablauf-icon", {
        scale: 0.4,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.9)",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 78%" , toggleActions: "play none none none" },
      });
      gsap.from(".ablauf-cta", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ablauf-cta", start: "top 92%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="ablauf" ref={root} data-nav-dark className="bg-[#001620] py-14 text-white sm:py-24">
      <Container>
        <div className="ablauf-head mx-auto max-w-[680px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 eyebrow text-white/70">
            <Workflow className="size-3.5 text-accent" />
            {t("So arbeiten wir", "How we work")}
          </p>
          <h2 className="mt-5 t-display-s text-white">
            <span className="t-serif tracking-[-0.6px] max-sm:tracking-[-0.5px] text-[#d8b682]">
              {t("Vier Schritte", "Four steps")}
            </span>{" "}
            {t("bis zur Zusammenarbeit.", "to working together.")}
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] t-body-l text-[#b3d6e2]">
            {t(
              <>
                Kein Vertrieb, der dich durch einen Funnel schiebt. Nach dem dritten
                Schritt weißt du genau, was du bekommst.
              </>,
              "No sales team pushing you through a funnel. After step three you know exactly what you're getting.",
            )}
          </p>
        </div>

        <div className="ablauf-grid mx-auto mt-6 grid sm:mt-14 max-w-[1040px] grid-cols-1 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, step, title, body, en }, i) => (
            <div
              key={title}
              className={cn(
                "ablauf-step py-7 sm:py-9",
                i % 2 === 0 ? "md:pr-12" : "md:pl-12",
                CELL_BORDERS[i],
              )}
            >
              <Icon className="ablauf-icon size-6 text-accent" strokeWidth={1.6} />
              <p className="mt-6 font-mono text-[11px] font-medium uppercase leading-[15px] tracking-[1.2px] text-[#7fbacd]">{t(step, en.step)}</p>
              <h3 className="mt-2 t-h3 text-white">
                {t(title, en.title)}
              </h3>
              <p className="mt-2.5 max-w-[420px] t-body-ms text-[#7fbacd]">
                {t(body, en.body)}
              </p>
            </div>
          ))}
        </div>

        <div className="ablauf-cta mt-8 flex sm:mt-14 justify-center">
          <Link
            href={lp("/kontakt")}
            className="group inline-flex h-[58px] items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#ecd3a4] to-[#cfa268] px-[30px] t-button text-ink shadow-[0_16px_40px_-14px_rgba(209,170,113,0.9)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
          >
            {t("Erstgespräch sichern", "Book your intro call")}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
