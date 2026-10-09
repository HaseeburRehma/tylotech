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
  "border-b md:border-r border-[#43413d]",
  "border-b border-[#43413d]",
  "border-b md:border-b-0 md:border-r border-[#43413d]",
  "border-[#43413d]",
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
    <section id="ablauf" ref={root} data-nav-dark className="bg-[#001620] py-14 text-white sm:py-24 lg:pb-[160px] lg:pt-[120px]">
      <Container>
        <div className="ablauf-head mx-auto max-w-[680px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-[7px] rounded-full border border-white/[0.18] bg-white/10 py-[7px] pl-2.5 pr-3.5 eyebrow text-[#cbc8c2] backdrop-blur-[12px]">
            <Workflow className="size-3.5 text-accent" />
            {t("So arbeiten wir", "How we work")}
          </p>
          <h2 className="mt-6 t-display-s text-white">
            <span className="t-serif tracking-[-0.6px] max-sm:tracking-[-0.5px] text-[#d8b682]">
              {t("Vier Schritte", "Four steps")}
            </span>{" "}
            {t("bis zur Zusammenarbeit.", "to working together.")}
          </h2>
          <p className="mx-auto mt-6 max-w-[600px] t-body-l text-[#cbc8c2]">
            {t(
              <>
                Kein Vertrieb, der dich durch einen Funnel schiebt. Nach dem dritten
                Schritt weißt du genau, was du bekommst.
              </>,
              "No sales team pushing you through a funnel. After step three you know exactly what you're getting.",
            )}
          </p>
        </div>

        <div className="ablauf-grid mx-auto mt-8 grid max-w-[1280px] grid-cols-1 sm:mt-16 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, step, title, body, en }, i) => (
            <div
              key={title}
              className={cn(
                "ablauf-step py-7 sm:pb-[52px] sm:pt-12",
                i % 2 === 0 ? "md:pr-12" : "md:pl-12",
                CELL_BORDERS[i],
              )}
            >
              <Icon className="ablauf-icon size-[30px] text-[#d8b682]" strokeWidth={1.5} />
              <p className="mt-[18px] font-mono text-[11px] font-medium uppercase leading-[15px] tracking-[1.2px] text-[#d8b682]">{t(step, en.step)}</p>
              <h3 className="mt-[18px] t-h3 text-white">
                {t(title, en.title)}
              </h3>
              <p className="mt-[18px] max-w-[460px] t-body-ms text-[#cbc8c2]">
                {t(body, en.body)}
              </p>
            </div>
          ))}
        </div>

        <div className="ablauf-cta mt-8 flex justify-center sm:mt-16">
          <Link
            href={lp("/kontakt")}
            style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #efdcbc 0%, #d8b681 45%, #b4894d 100%)" }}
            className="group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-full px-7 t-button text-[#0f0e0d] shadow-[inset_0_-1.5px_1.5px_rgba(109,83,48,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),0_10px_14px_rgba(168,127,69,0.2),0_4px_7px_rgba(168,127,69,0.32)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
          >
            {t("Erstgespräch sichern", "Book your intro call")}
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
