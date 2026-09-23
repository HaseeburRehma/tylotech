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

type Case = {
  idx: string;
  eyebrow: string;
  finding: string;
  title: string;
  body: string;
  tags: string[];
  from: { v: string; l: string };
  to: { v: string; l: string };
  icon: LucideIcon;
  tint: string;
};

const CASES: Case[] = [
  {
    idx: "01",
    eyebrow: "Koordination",
    finding: "Der häufigste Befund im Erstgespräch",
    title: "Drei Dienstleister, keiner verantwortlich",
    body: "Die Website-Agentur zeigt auf die Marketing-Agentur, die zeigt auf die IT. Am Ende koordinieren Sie selbst — und bezahlen dafür auch noch.",
    tags: ["Website", "Marketing", "IT"],
    from: { v: "3 Verträge", l: "heute" },
    to: { v: "1 Ansprechpartner", l: "mit TyloTech" },
    icon: Users,
    tint: "from-[#123141] to-[#08202b]",
  },
  {
    idx: "02",
    eyebrow: "Sichtbarkeit",
    finding: "Was wir im Audit am zweithäufigsten sehen",
    title: "Kampagnen ohne Fundament",
    body: "Budget fließt in Anzeigen, während Website, Tracking und Angebot nicht zusammenspielen. Die Klicks kommen — aber unten passiert nichts.",
    tags: ["Ads", "Tracking", "Conversion"],
    from: { v: "Viele Klicks", l: "wenig Wirkung" },
    to: { v: "Weniger Streuverlust", l: "mehr Anfragen" },
    icon: Megaphone,
    tint: "from-[#14313f] to-[#091f28]",
  },
  {
    idx: "03",
    eyebrow: "Technik",
    finding: "Der Grund, warum Projekte einschlafen",
    title: "Systeme, die niemand anfasst",
    body: "Tools wurden eingeführt, aber nie zu Ende gedacht. Keiner weiß, wie sie laufen — also läuft am Ende wieder alles über E-Mail und Bauchgefühl.",
    tags: ["CRM", "Automatisierung", "Prozesse"],
    from: { v: "Insellösungen", l: "ungenutzt" },
    to: { v: "Ein System", l: "das bleibt" },
    icon: Lock,
    tint: "from-[#122f3c] to-[#081d26]",
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

  useGSAP(
    () => {
      gsap.from(".dg-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".dg-head", start: "top 82%" },
      });
      gsap.from(".dg-stage", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".dg-stage", start: "top 84%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="woran"
      ref={root}
      className="bg-[#001620] py-20 text-white sm:py-24"
    >
      <Container>
        <div className="dg-head max-w-[900px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            <AlertCircle className="size-3.5 text-accent" />
            Woran es wirklich liegt
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Digitalisierung scheitert{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#d8b682]">
              selten an der Technik
            </span>
            .
          </h2>
          <p className="mt-5 max-w-[820px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-white/60">
            Sie scheitert an Zuständigkeiten, an Dienstleistern, die nur ihren
            Ausschnitt sehen, und an Systemen, die am Ende niemand mehr anfasst.
            Wir haben das oft genug aufgeräumt, um zu wissen, woran es wirklich
            liegt.
          </p>
        </div>

        {/* ---------- Desktop: horizontal expanding accordion ---------- */}
        <div className="dg-stage mt-12 hidden gap-3 lg:flex lg:h-[440px] min-[1280px]:h-[468px]">
          {CASES.map((c, i) => {
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
                    <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_20%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
                    <Icon
                      className="absolute -bottom-6 -right-4 size-56 text-white/[0.05]"
                      strokeWidth={1}
                    />
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
          {CASES.map((c, i) => {
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
                        <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_20%_10%,rgba(255,255,255,0.08),transparent_60%)]" />
                        <Icon
                          className="absolute -bottom-4 -right-2 size-40 text-white/[0.05]"
                          strokeWidth={1}
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
