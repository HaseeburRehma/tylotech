"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Megaphone,
  FileText,
  BarChart3,
  Users,
  Settings,
  Activity,
  Sparkles,
  FolderCheck,
} from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---- dashboard mock ---------------------------------------------- */

const NAV = [
  { icon: LayoutGrid, label: "Übersicht", active: true },
  { icon: Megaphone, label: "Kampagnen" },
  { icon: FileText, label: "Inhalte" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Einstellungen" },
];

const STATS = [
  { k: "Ad-Spend", to: 12.4, dec: 1, pre: "+", suf: " %", s: "gegenüber Vormonat" },
  { k: "Leads", to: 18400, dec: 0, pre: "", suf: " €", s: "Pipeline-Wert" },
  { k: "ROAS", to: 4.7, dec: 1, pre: "", suf: "×", s: "über alle Kanäle" },
];

function fmtKpi(n: number, s: (typeof STATS)[number]) {
  const num = n.toLocaleString("de-DE", {
    minimumFractionDigits: s.dec,
    maximumFractionDigits: s.dec,
  });
  return `${s.pre}${num}${s.suf}`;
}

const DATA = [30, 34, 31, 42, 46, 41, 54, 58, 62, 71, 76, 90];
const PREV = [24, 27, 29, 33, 36, 34, 41, 43, 47, 50, 53, 61];
const CW = 680;
const CH = 190;

function buildPaths() {
  const max = 100;
  const x = (i: number) => Math.round((i / (DATA.length - 1)) * CW * 10) / 10;
  const y = (v: number) => Math.round((CH - (v / max) * CH) * 10) / 10;
  const toLine = (arr: number[]) =>
    arr.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  const line = toLine(DATA);
  return {
    line,
    area: `${line} L${CW},${CH} L0,${CH} Z`,
    prev: toLine(PREV),
  };
}

function Dashboard() {
  const { line, area, prev } = buildPaths();
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const clip = useRef<SVGRectElement>(null);
  const kpis = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      const st = { trigger: root.current, start: "top 80%" };

      // chart area + dashed line wipe in left→right
      if (clip.current) {
        gsap.fromTo(
          clip.current,
          { attr: { width: 0 } },
          { attr: { width: CW }, duration: 1.7, ease: "power2.out", scrollTrigger: st },
        );
      }
      // gold line draws
      if (path.current) {
        const len = path.current.getTotalLength();
        gsap.fromTo(
          path.current,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.7, ease: "power2.out", scrollTrigger: st },
        );
      }
      // KPI count-ups
      STATS.forEach((s, i) => {
        const el = kpis.current[i];
        if (!el) return;
        const o = { n: 0 };
        gsap.to(o, {
          n: s.to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: st,
          onUpdate: () => {
            el.textContent = fmtKpi(o.n, s);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="tylohq-card overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_40px_80px_-40px_rgba(15,14,13,0.25)]"
    >
      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-[190px] shrink-0 flex-col border-r border-line bg-page/40 p-4 md:flex">
          <div className="mb-6 flex items-center gap-2 px-1">
            <span className="grid size-6 place-items-center rounded-md bg-accent text-[11px] font-bold text-ink">
              T
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.02em] text-ink">
              TyloHQ
            </span>
          </div>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((n) => (
              <span
                key={n.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${
                  n.active
                    ? "bg-ink/[0.06] font-medium text-ink"
                    : "text-ink/55"
                }`}
              >
                <n.icon className="size-4" strokeWidth={1.7} />
                {n.label}
              </span>
            ))}
          </nav>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1 p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
                Übersicht
              </h4>
              <p className="text-[12px] text-ink/45">
                Zahlen aus den letzten 30 Tagen
              </p>
            </div>
            <span className="rounded-lg border border-line px-3 py-1.5 text-[12px] text-ink/60">
              30 Tage ▾
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {STATS.map((s, i) => (
              <div key={s.k} className="rounded-xl border border-line p-3.5">
                <p className="text-[9px] font-medium uppercase tracking-[0.09em] text-ink/40">
                  {s.k}
                </p>
                <p
                  ref={(el) => {
                    kpis.current[i] = el;
                  }}
                  className="mt-1.5 font-display text-[22px] font-bold leading-none tracking-[-0.02em] text-ink"
                >
                  {fmtKpi(s.to, s)}
                </p>
                <p className="mt-1.5 text-[11px] text-ink/45">{s.s}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-ink/80">
                Anfragen über alle Kanäle
              </p>
              <div className="flex items-center gap-3 text-[11px] text-ink/50">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-accent" /> Anfragen
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-line" /> Vormonat
                </span>
              </div>
            </div>
            <svg
              viewBox={`0 0 ${CW} ${CH}`}
              className="h-[150px] w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="hqfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d1aa71" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#d1aa71" stopOpacity="0" />
                </linearGradient>
                <clipPath id="hqclip">
                  <rect ref={clip} x="0" y="0" width={CW} height={CH} />
                </clipPath>
              </defs>
              <g clipPath="url(#hqclip)">
                <path d={area} fill="url(#hqfill)" />
                <path
                  d={prev}
                  fill="none"
                  stroke="#d8d4cd"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
              </g>
              <path
                ref={path}
                d={line}
                fill="none"
                stroke="#d1aa71"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- feature points ---------------------------------------------- */

const FEATURES = [
  {
    icon: Activity,
    title: "Echtzeit-KPIs statt Monatsbericht",
    body: "Meta, Google und SEO laufen in einer Ansicht zusammen. Sie sehen am Dienstag, was am Montag passiert ist — nicht drei Wochen später.",
  },
  {
    icon: Sparkles,
    title: "Inhalte und Anzeigentexte in Sekunden",
    body: "Markengerechte Texte für Anzeigen, Landingpages und SEO — auf Basis Ihrer eigenen Tonalität, nicht aus der Schablone.",
  },
  {
    icon: FolderCheck,
    title: "Ein Ort für Freigaben und Absprachen",
    body: "Feedback, Freigaben und Dateien liegen beim Projekt. Kein Suchen in E-Mail-Verläufen, kein „welche Version war das noch?“.",
  },
];

export default function TyloHQ() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hq-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hq-head", start: "top 82%" },
      });
      gsap.from(".tylohq-card", {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tylohq-card", start: "top 85%" },
      });
      gsap.from(".hq-feature", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".hq-features", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="tylohq" ref={root} className="bg-page py-24">
      <Container>
        <div className="hq-head mx-auto max-w-[680px] text-center">
          <p className="eyebrow mb-4 flex items-center justify-center gap-2 text-ink/55">
            <span className="size-1.5 rounded-full bg-accent" />
            TyloHQ
          </p>
          <h2 className="display-m text-balance text-ink">
            Ihr Projekt läuft nicht mehr über{" "}
            <span className="whitespace-nowrap">E-Mail.</span>
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed text-ink/60">
            TyloHQ ist die Plattform, auf der wir mit Ihnen arbeiten:
            Echtzeit-Zahlen aus Meta, Google und SEO, Inhalte und Freigaben an
            einem Ort — und ein Team, das Sie erreichen, ohne zu suchen.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-[980px]">
          <Dashboard />
        </div>

        <div className="hq-features mx-auto mt-16 grid max-w-[980px] grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="hq-feature">
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-white text-ink/70">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/55">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="hq-features mt-12 flex items-center justify-center gap-6">
          <Button href="#kontakt" variant="dark" withArrow>
            TyloHQ ansehen
          </Button>
          <Link
            href="#login"
            className="text-[15px] font-medium tracking-[-0.01em] text-ink/70 transition-colors hover:text-ink"
          >
            Kunden-Login
          </Link>
        </div>
      </Container>
    </section>
  );
}
