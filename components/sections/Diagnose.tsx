"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Users,
  Megaphone,
  Lock,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";

type CaseText = {
  eyebrow: string;
  finding: string;
  title: string;
  body: string;
  tags: string[];
  from: { v: string; l: string };
  to: { v: string; l: string };
};

type Case = CaseText & {
  idx: string;
  icon: LucideIcon;
  tint: string;
  img: string;
};

const CASES: (Omit<Case, keyof CaseText> & { de: CaseText; en: CaseText })[] = [
  {
    idx: "01",
    de: {
      eyebrow: "Koordination",
      finding: "Der häufigste Befund im Erstgespräch",
      title: "Fünf Dienstleister, keiner sieht das Ganze",
      body: "Die Website-Agentur zeigt auf die Marketing-Agentur, die zeigt auf die IT. Am Ende koordinierst du selbst — und bezahlst dafür auch noch.",
      tags: ["Website", "Marketing", "IT"],
      from: { v: "3 Verträge", l: "heute" },
      to: { v: "1 Ansprechpartner", l: "mit TyloTech" },
    },
    en: {
      eyebrow: "Coordination",
      finding: "The most common finding in a first call",
      title: "Five providers, nobody sees the whole",
      body: "The web agency points at the marketing agency, which points at IT. In the end you coordinate it all yourself — and pay for the privilege.",
      tags: ["Website", "Marketing", "IT"],
      from: { v: "3 contracts", l: "today" },
      to: { v: "1 point of contact", l: "with TyloTech" },
    },
    icon: Users,
    tint: "from-[#123141] to-[#08202b]",
    img: "/diagnose/01-dienstleister.webp",
  },
  {
    idx: "02",
    de: {
      eyebrow: "Sichtbarkeit",
      finding: "Was wir im Audit am zweithäufigsten sehen",
      title: "Kampagnen ohne Fundament",
      body: "Budget fließt in Anzeigen, während Website, Tracking und Angebot nicht zusammenspielen. Die Klicks kommen — aber unten passiert nichts.",
      tags: ["Ads", "Tracking", "Conversion"],
      from: { v: "Viele Klicks", l: "wenig Wirkung" },
      to: { v: "Weniger Streuverlust", l: "mehr Anfragen" },
    },
    en: {
      eyebrow: "Visibility",
      finding: "The second thing we see most in audits",
      title: "Campaigns without a foundation",
      body: "Budget pours into ads while the website, tracking and offer don’t work together. The clicks come in — but nothing happens further down.",
      tags: ["Ads", "Tracking", "Conversion"],
      from: { v: "Lots of clicks", l: "little impact" },
      to: { v: "Less wasted spend", l: "more enquiries" },
    },
    icon: Megaphone,
    tint: "from-[#14313f] to-[#091f28]",
    img: "/diagnose/02.jpg",
  },
  {
    idx: "03",
    de: {
      eyebrow: "Technik",
      finding: "Der Grund, warum Projekte einschlafen",
      title: "Systeme, die niemand anfasst",
      body: "Tools wurden eingeführt, aber nie zu Ende gedacht. Keiner weiß, wie sie laufen — also läuft am Ende wieder alles über E-Mail und Bauchgefühl.",
      tags: ["CRM", "Automatisierung", "Prozesse"],
      from: { v: "Insellösungen", l: "ungenutzt" },
      to: { v: "Ein System", l: "das bleibt" },
    },
    en: {
      eyebrow: "Tech",
      finding: "Why projects quietly stall",
      title: "Systems nobody touches",
      body: "Tools were rolled out but never thought through. Nobody knows how they work — so everything ends up running on email and gut feeling again.",
      tags: ["CRM", "Automation", "Processes"],
      from: { v: "Isolated tools", l: "unused" },
      to: { v: "One system", l: "that sticks" },
    },
    icon: Lock,
    tint: "from-[#122f3c] to-[#081d26]",
    img: "/diagnose/03.jpg",
  },
];

/* --- shared bits ------------------------------------------------------ */
function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-[12px] font-medium text-white/75"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function StatRow({ c }: { c: Case }) {
  return (
    <div className="flex items-center gap-4 min-[1280px]:gap-5">
      <div>
        <p className="font-display text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold leading-tight tracking-[-0.02em] text-white/40">
          {c.from.v}
        </p>
        <p className="mt-0.5 text-[12px] text-white/35">{c.from.l}</p>
      </div>
      <ArrowRight className="size-5 shrink-0 text-white/30" />
      <div>
        <p className="font-display text-[clamp(1.1rem,1.5vw,1.4rem)] font-semibold leading-tight tracking-[-0.02em] text-[#d8b682]">
          {c.to.v}
        </p>
        <p className="mt-0.5 text-[12px] text-white/45">{c.to.l}</p>
      </div>
    </div>
  );
}

function MetaLine({ c }: { c: Case }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-[13px]">
      <span className="text-white/45">{c.eyebrow}</span>
      <span className="text-white/25">•</span>
      <span className="font-medium text-[#d8b682]">{c.finding}</span>
    </p>
  );
}

/* --- component -------------------------------------------------------- */
export default function Diagnose() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const t = useT();
  const cases: Case[] = CASES.map(({ de, en, ...base }) => ({ ...base, ...t(de, en) }));

  useGSAP(
    () => {
      gsap.from(".dg-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".dg-head", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".dg-stage", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".dg-stage", start: "top 84%" , toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="woran"
      ref={root}
      data-nav-dark
      className="bg-[#001620] py-14 text-white sm:py-24"
    >
      <Container>
        <div className="dg-head max-w-[900px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            <AlertCircle className="size-3.5 text-accent" />
            {t("Der Denkfehler", "The misconception")}
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            {t("Digitalisierung scheitert", "Digitalisation doesn’t fail")}{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#d8b682]">
              {t("nicht an der Technik", "because of the tech")}
            </span>
            .
          </h2>
          <p className="mt-5 max-w-[820px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-white/60">
            {t(
              "Sie scheitert daran, dass fünf Dienstleister nebeneinander arbeiten und keiner das Ganze sieht. Einer macht Ads, einer die Website, einer die Software — und niemand trägt das Ergebnis. Wir machen es anders: ein Team, ein Plan, eine Verantwortung.",
              "It fails because five providers work side by side and nobody sees the whole. One runs the ads, one the website, one the software — and no one owns the result. We do it differently: one team, one plan, one owner.",
            )}
          </p>
        </div>

        {/* ---------- Desktop: horizontal expanding accordion ---------- */}
        <div className="dg-stage mt-12 hidden gap-3 lg:flex lg:h-[440px] min-[1280px]:h-[468px]">
          {cases.map((c, i) => {
            const on = active === i;
            const Icon = c.icon;
            return (
              <div
                key={c.idx}
                role="button"
                tabIndex={0}
                aria-expanded={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ flexGrow: on ? 1 : 0, flexBasis: on ? "0%" : "134px" }}
                className="group relative h-full cursor-pointer overflow-hidden rounded-[20px] border border-[#0a3a4d] bg-gradient-to-b from-[#08222d] to-[#061821] outline-none transition-[flex-grow,flex-basis,border-color] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:border-accent/60"
              >
                {/* expanded content (media + text) */}
                <div
                  className={`absolute inset-0 flex transition-opacity duration-300 ${
                    on ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
                  }`}
                >
                  <div
                    className={`relative h-full w-[42%] shrink-0 overflow-hidden bg-gradient-to-br ${c.tint}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async"
                      src={c.img}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#08222d]/60" />
                    <span className="absolute left-6 top-5 font-mono text-[12px] tracking-[0.2em] text-white/40">
                      {c.idx}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-7 min-[1280px]:p-9">
                    <h3 className="font-display text-[clamp(1.35rem,2vw,1.9rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
                      {c.title}
                    </h3>
                    <div className="mt-3">
                      <MetaLine c={c} />
                    </div>
                    <p className="mt-4 max-w-[440px] text-[14px] leading-[1.6] text-white/65">
                      {c.body}
                    </p>
                    <div className="mt-5">
                      <Tags tags={c.tags} />
                    </div>
                    <div className="mt-auto pt-6">
                      <div className="h-px w-full bg-white/10" />
                      <div className="mt-5">
                        <StatRow c={c} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* collapsed rail */}
                <div
                  className={`absolute inset-0 flex flex-col justify-between p-5 transition-opacity duration-300 ${
                    on ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="font-mono text-[12px] tracking-[0.2em] text-white/35">
                    {c.idx}
                  </span>
                  <span className="flex flex-1 items-center justify-center">
                    <span
                      style={{ writingMode: "vertical-rl" }}
                      className="rotate-180 whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] text-white/80"
                    >
                      {c.title}
                    </span>
                  </span>
                  <span className="grid size-11 place-items-center rounded-[12px] border border-[#d8b682]/30 bg-[#d8b682]/10 text-[#d8b682]">
                    <Icon className="size-5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Mobile: vertical stacked accordion ---------- */}
        <div className="dg-stage mt-10 flex flex-col gap-3 lg:hidden">
          {cases.map((c, i) => {
            const on = active === i;
            const Icon = c.icon;
            return (
              <div
                key={c.idx}
                className={`overflow-hidden rounded-[18px] border bg-gradient-to-b from-[#08222d] to-[#061821] transition-colors duration-300 ${
                  on ? "border-[#d8b682]/40" : "border-[#0a3a4d]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setActive(i)}
                  className="flex w-full items-center gap-3.5 p-4 text-left"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-[#d8b682]/30 bg-[#d8b682]/10 text-[#d8b682]">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] tracking-[0.18em] text-white/35">
                      {c.idx}
                    </span>
                    <span className="mt-0.5 block text-[15px] font-medium leading-snug tracking-[-0.01em] text-white">
                      {c.title}
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-white/40 transition-transform duration-300 ${
                      on ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5">
                      <div
                        className={`relative mb-4 aspect-[16/9] overflow-hidden rounded-[14px] bg-gradient-to-br ${c.tint}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img loading="lazy" decoding="async"
                          src={c.img}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <MetaLine c={c} />
                      <p className="mt-3 text-[14px] leading-[1.6] text-white/65">
                        {c.body}
                      </p>
                      <div className="mt-4">
                        <Tags tags={c.tags} />
                      </div>
                      <div className="mt-5 h-px w-full bg-white/10" />
                      <div className="mt-4">
                        <StatRow c={c} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
