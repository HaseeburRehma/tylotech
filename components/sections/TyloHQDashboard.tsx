"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Gauge, LayoutDashboard, MousePointerClick, Sparkles, Users } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";

/* The interactive demo (~1,400 lines, ~400 elements) sits far down the page:
   its code loads and mounts only once the section comes near the viewport.
   Until then a placeholder of the exact same size holds its place. */
const HQApp = dynamic(() => import("../tylohq/HQApp"), { ssr: false, loading: () => <HQAppPlaceholder /> });

function HQAppPlaceholder() {
  return (
    <div className="@container" aria-hidden>
      <div className="h-[560px] rounded-[16px] border border-[#e2e0dc] bg-[#f6f5f3] shadow-[0_50px_100px_-50px_rgba(8,34,44,0.45),0_20px_40px_-30px_rgba(8,34,44,0.25)] @[760px]:h-[498px]" />
    </div>
  );
}
import { TYLOHQ_URL } from "@/lib/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLocalePath, useT } from "../i18n/LocaleProvider";

const FEATURES = [
  {
    icon: Gauge,
    title: "Echtzeit-KPIs statt Monatsbericht",
    body: "Meta, Google und SEO laufen in einer Ansicht zusammen. Du siehst am Dienstag, was am Montag passiert ist, nicht drei Wochen später.",
    en: {
      title: "Real-time KPIs, not a monthly report",
      body: "Meta, Google and SEO come together in one view. On Tuesday you see what happened on Monday, not three weeks later.",
    },
  },
  {
    icon: Sparkles,
    title: "Inhalte und Anzeigentexte in Sekunden",
    body: "Markengerechte Texte für Anzeigen, Landingpages und SEO, auf Basis deiner eigenen Tonalität, nicht aus der Schablone.",
    en: {
      title: "Content and ad copy in seconds",
      body: "On-brand copy for ads, landing pages and SEO, built on your own tone of voice, not a template.",
    },
  },
  {
    icon: Users,
    title: "Ein Ort für Freigaben und Absprachen",
    body: "Feedback, Freigaben und Dateien liegen beim Projekt. Kein Suchen in E-Mail-Verläufen, kein „welche Version war aktuell?“.",
    en: {
      title: "One place for approvals and decisions",
      body: "Feedback, approvals and files live with the project. No digging through email threads, no “which version is the latest?”.",
    },
  },
];

export default function TyloHQDashboard() {
  const root = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  const appSlot = useRef<HTMLDivElement>(null);
  const [nearApp, setNearApp] = useState(false);
  useEffect(() => {
    const el = appSlot.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNearApp(true);
        io.disconnect();
      }
    }, { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const t = useT();
  const lp = useLocalePath();

  useGSAP(
    () => {
      gsap.from(".hqd-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hqd-head", start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.from(".hqd-app", {
        y: 60,
        opacity: 0,
        scale: 0.97,
        duration: 1.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".hqd-app", start: "top 88%", toggleActions: "play none none none" },
      });
      ScrollTrigger.create({
        trigger: ".hqd-app",
        start: "top 70%",
        end: "max",
        once: true,
        onToggle: (self) => self.isActive && setLive(true),
      });
      gsap.from(".hqd-feature", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hqd-features", start: "top 85%", toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section id="tylohq-app" ref={root} className="overflow-hidden border-t border-line bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container>
        <div className="hqd-head mx-auto flex max-w-[800px] flex-col items-center text-center">
          <p className="mb-[18px] inline-flex w-fit items-center gap-[7px] rounded-full border border-[rgba(8,34,44,0.08)] bg-white/70 py-[7px] pl-2.5 pr-3.5 eyebrow text-[#5c5954] shadow-[0_8px_24px_rgba(8,34,44,0.08)] backdrop-blur-md">
            <LayoutDashboard className="size-3.5 text-[#c79a53]" strokeWidth={1.8} />
            {t("Ergebnisse, keine Erzählungen", "Results, not stories")}
          </p>
          <h2 className="t-h2 text-[#1a1917]">
            {t("Dein Projekt läuft und du siehst es", "Your project is running and you see it")}{" "}
            <span className="t-serif text-[1em] tracking-[-1.3px] max-sm:tracking-[-1px] text-[#b08547]">
              {t("in Echtzeit", "in real time")}
            </span>
            .
          </h2>
          <p className="mt-[18px] t-body-l text-[#5c5954]">
            {t(
              <>
                Kein Ratespiel, kein monatliches PDF. In TyloTech HQ siehst du jederzeit, wo dein Projekt steht: Leads,
                Kosten pro Lead, Conversions, Traffic. Transparenz ist bei uns kein Extra: sie ist die Grundlage.
              </>,
              "No guesswork, no monthly PDF. In TyloTech HQ you can see where your project stands at any time: leads, cost per lead, conversions, traffic. Transparency isn't an extra for us: it's the foundation.",
            )}
          </p>
        </div>

        <div ref={appSlot} className="hqd-app relative mx-auto mt-10 max-w-[1180px] sm:mt-14">
          {nearApp ? <HQApp live={live} /> : <HQAppPlaceholder />}
          <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.6px] text-[#7d7973]">
            <MousePointerClick className="size-3.5 text-[#c79a53]" strokeWidth={1.8} />
            {t("Live-Demo · klick dich durch die Bereiche", "Live demo · click through the sections")}
          </p>
        </div>

        <div className="hqd-features mx-auto mt-14 grid max-w-[1280px] grid-cols-1 gap-10 sm:mt-16 md:grid-cols-3 md:gap-6 lg:gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="hqd-feature group">
                <span className="grid size-[46px] place-items-center rounded-[13px] border border-[#e2e0dc] bg-white text-[#94713f] shadow-[0_1px_2px_rgba(8,34,44,0.04)] transition-[border-color,background-color] duration-300 group-hover:border-[#e3c79e] group-hover:bg-[#fbf6ee]">
                  <Icon className="size-[21px]" strokeWidth={1.6} />
                </span>
                <h3 className="mt-[14px] t-h5 text-[#1a1917]">
                  {t(f.title, f.en.title)}
                </h3>
                <p className="mt-3.5 t-body-ms text-[#5c5954]">{t(f.body, f.en.body)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3">
          <Button href={lp("/kontakt")} variant="dark" withArrow>
            {t("TyloHQ-Zugang anfragen", "Request TyloHQ access")}
          </Button>
          <a
            href={TYLOHQ_URL}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 rounded-[10px] border border-[#e2e0dc] bg-white/60 px-7 py-4 t-button text-[#1a1917] transition-colors hover:bg-white"
          >
            {t("Kunden-Login", "Client login")}
            <ArrowUpRight className="size-[18px] text-[#7d7973] transition-[color,translate] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-[#94713f]" strokeWidth={1.9} />
          </a>
        </div>
      </Container>
    </section>
  );
}
