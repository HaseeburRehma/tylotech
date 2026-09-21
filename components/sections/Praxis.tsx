"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import BrandIcon from "../icons/BrandIcon";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* Card shell                                                          */
/* ------------------------------------------------------------------ */
function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`praxis-card group relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-white p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-ink">
            {title}
          </h3>
          <p className="mt-1 text-[14px] leading-snug text-ink/50">{subtitle}</p>
        </div>
        <ArrowUpRight className="size-5 shrink-0 text-ink/25 transition-colors group-hover:text-ink/60" />
      </div>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="chan-tile group grid aspect-square cursor-pointer place-items-center rounded-[14px] border border-line bg-page transition-[border-color,box-shadow] duration-200 [&_svg]:transition-transform [&_svg]:duration-200 hover:border-ink/20 hover:shadow-[0_6px_16px_-8px_rgba(15,14,13,0.25)] group-hover:[&_svg]:scale-110 hover:[&_svg]:scale-110">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1 · Channels                                                        */
/* ------------------------------------------------------------------ */
const CHANNELS = [
  "googleads",
  "meta",
  "tiktok",
  "youtube",
  "linkedin",
  "instagram",
  "googleanalytics",
  "google",
];

function ChannelsCard() {
  return (
    <Card title="Alle Kanäle, eine Auswertung" subtitle="statt sechs Dashboards">
      <div className="grid grid-cols-4 gap-2.5">
        {CHANNELS.map((slug) => (
          <Tile key={slug}>
            <BrandIcon slug={slug} size={26} />
          </Tile>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Local ranking                                                   */
/* ------------------------------------------------------------------ */
const RANKS = [
  { kw: "gebäudereinigung düsseldorf", pos: 1, trend: 0.92 },
  { kw: "fahrschule düsseldorf", pos: 3, trend: 0.58 },
  { kw: "pizza lieferservice köln", pos: 2, trend: 0.76 },
  { kw: "rohrreinigung nrw", pos: 1, trend: 0.9 },
];

function LocalCard() {
  return (
    <Card title="Lokal ganz oben" subtitle="dort, wo Ihre Kunden suchen">
      <div>
        <div className="grid grid-cols-[1fr_auto_64px] items-center gap-3 border-b border-line pb-2.5 text-[10px] font-medium uppercase tracking-[0.09em] text-ink/40">
          <span>Suchbegriff</span>
          <span>Pos.</span>
          <span className="text-right">Trend</span>
        </div>
        {RANKS.map((r) => (
          <div
            key={r.kw}
            className="rank-row grid grid-cols-[1fr_auto_64px] items-center gap-3 border-b border-line/70 py-3 text-[13px]"
          >
            <span className="truncate text-ink/80">{r.kw}</span>
            <span className="font-semibold text-ink">{r.pos}</span>
            <span className="flex justify-end">
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                <span
                  className="trend-bar block h-full origin-left rounded-full bg-accent"
                  style={{ width: `${r.trend * 100}%` }}
                />
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Requests +63%                                                   */
/* ------------------------------------------------------------------ */
const BARS = [28, 34, 30, 44, 52, 47, 61, 78, 96];

function RequestsCard() {
  return (
    <Card title="Anfragen statt Klicks" subtitle="das Einzige, was am Ende zählt">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.09em] text-ink/40">
              Anfragen / Monat
            </p>
            <p className="req-num mt-1.5 font-display text-[34px] font-bold leading-none tracking-[-0.03em] text-ink">
              +63 %
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#16a34a]/10 px-2.5 py-1 text-[12px] font-medium text-[#16a34a]">
            <TrendingUp className="size-3.5" /> 6 Monate
          </span>
        </div>
        <div className="mt-auto flex h-[90px] items-end gap-1.5 pt-4">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`req-bar flex-1 origin-bottom rounded-t-[3px] ${
                i >= BARS.length - 3 ? "bg-accent" : "bg-line"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · Content generator                                               */
/* ------------------------------------------------------------------ */
const SNIPPETS = [
  {
    label: "Google Ads",
    text: "Glänzende Büros. Ohne dass Sie daran denken müssen.",
  },
  {
    label: "Meta",
    text: "Sauberkeit, auf die sich 40 Betriebe verlassen.",
  },
  {
    label: "Landingpage",
    text: "Der Betrieb, den Ihre Kunden weiterempfehlen.",
  },
];

function ContentCard() {
  return (
    <Card title="Inhalte in Ihrer Sprache" subtitle="nicht aus der Schablone">
      <div className="content-block flex items-center gap-2 rounded-xl border border-line bg-page px-3 py-2.5">
        <span
          className="type-text flex-1 whitespace-nowrap text-[13px] text-ink/50"
          data-text="Anzeigentext, Ton: sachlich"
        >
          Anzeigentext, Ton: sachlich
        </span>
        <button
          aria-label="Generieren"
          className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-ink"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {SNIPPETS.map((s) => (
          <div
            key={s.label}
            className="content-block rounded-xl border border-line px-3 py-2.5"
          >
            <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-ink/40">
              {s.label}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink/80">{s.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Integrations                                                    */
/* ------------------------------------------------------------------ */
const TOOLS = [
  "wordpress",
  "notion",
  "stripe",
  "hubspot",
  "zapier",
  "mailchimp",
  "shopify",
  "figma",
  "trello",
  "asana",
  "whatsapp",
  "slack",
  "google",
  "meta",
  "instagram",
  "wix",
  "tiktok",
  "googleanalytics",
];

function IntegrationsCard() {
  return (
    <Card
      title="An Ihre Werkzeuge angebunden"
      subtitle="kein Systembruch, kein Doppelpflegen"
    >
      <div className="grid grid-cols-6 gap-2">
        {TOOLS.map((slug) => (
          <div
            key={slug}
            className="tool-tile grid aspect-square cursor-pointer place-items-center rounded-[10px] border border-line bg-page transition-[border-color,box-shadow] duration-200 [&_svg]:transition-transform [&_svg]:duration-200 hover:border-ink/20 hover:shadow-[0_6px_16px_-8px_rgba(15,14,13,0.25)] hover:[&_svg]:scale-110"
          >
            <BrandIcon slug={slug} size={18} />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Reach / dotted dome                                             */
/* ------------------------------------------------------------------ */
const TAGS = [
  "Vertrieb",
  "Marketing",
  "Recruiting",
  "Kundenerlebnis",
  "Reputation",
  "Prozesse",
];

/* Animated rotating half-globe of dots (canvas), with a highlighted meridian
   that swings to the active category. */
function DomeCanvas({ active }: { active: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 520;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      // azimuth of each point, used to highlight the active category slice
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, az: Math.atan2(Math.sin(th) * r, Math.cos(th) * r) };
    });

    let dpr = 1;
    const resize = () => {
      const rc = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rc.width * dpr));
      canvas.height = Math.max(1, Math.round(rc.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let angle = 0;
    let targetHi = (active / TAGS.length) * Math.PI * 2;
    let hi = targetHi;
    let raf = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.96;
      const R = Math.min(w * 0.5, h * 0.98);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      targetHi = (activeRef.current / TAGS.length) * Math.PI * 2;
      // shortest-path ease toward the active meridian
      let diff = targetHi - hi;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      hi += diff * 0.08;

      for (const p of pts) {
        if (p.y < -0.04) continue; // upper hemisphere → dome
        const x1 = p.x * cosA - p.z * sinA;
        const z1 = p.x * sinA + p.z * cosA;
        const sx = cx + x1 * R;
        const sy = cy - p.y * R * 0.92;
        const d = (z1 + 1) / 2; // depth 0..1
        // is this dot near the active meridian (after rotation)?
        let da = (p.az + angle) - hi;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        const near = Math.max(0, 1 - Math.abs(da) / 0.5);
        const size = (0.5 + d * 1.3 + near * 0.9) * dpr;
        const alpha = 0.16 + d * 0.6 + near * 0.35;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        // muted gold → bright gold on the active slice
        const rr = 209 + Math.round(near * 30);
        const gg = 170 + Math.round(near * 40);
        const bb = 113 + Math.round(near * 60);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${Math.min(1, alpha)})`;
        ctx.fill();
      }

      if (!reduce) angle += 0.005;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className="h-[132px] w-full" aria-hidden />;
}

function ReachCard() {
  const [active, setActive] = useState(1);
  return (
    <Card title="Digitalisierung berührt alles" subtitle="nicht nur das Marketing">
      <div className="flex flex-wrap gap-2">
        {TAGS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(i)}
            className={`reach-tag rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
              active === i
                ? "border-accent bg-[rgba(209,170,113,0.14)] text-[#94713f]"
                : "border-line text-ink/60 hover:border-ink/25 hover:text-ink/80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-1">
        <DomeCanvas active={active} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Praxis() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".praxis-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".praxis-head", start: "top 80%" },
      });
      gsap.from(".praxis-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".praxis-grid", start: "top 78%" },
      });

      // Fresh trigger config per tween — sharing one object across several
      // ScrollTriggers lets GSAP mutate it and cross-wire them.
      const st = () => ({ trigger: ".praxis-grid", start: "top 70%" });

      // channel tiles pop in (immediateRender:false + clearProps so a tile is
      // never left frozen at its shrunken start scale)
      gsap.from(".chan-tile", {
        scale: 0.55,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: { each: 0.045, from: "start" },
        immediateRender: false,
        clearProps: "transform",
        scrollTrigger: st(),
      });

      // stat bar chart grows up
      gsap.fromTo(
        ".req-bar",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: st(),
        },
      );

      // local-ranking trend bars grow sideways
      gsap.fromTo(
        ".trend-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: st(),
        },
      );

      // +63 % count-up
      const numEl = root.current?.querySelector<HTMLElement>(".req-num");
      if (numEl) {
        const obj = { n: 0 };
        gsap.to(obj, {
          n: 63,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: st(),
          onUpdate: () => {
            numEl.textContent = `+${Math.round(obj.n)} %`;
          },
        });
      }

      // local-ranking rows slide in before their trend bars fill
      gsap.from(".rank-row", {
        x: -14,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: st(),
      });

      // content card — input + snippets rise in, then the prompt types itself
      gsap.from(".content-block", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: st(),
      });
      const typeEl = root.current?.querySelector<HTMLElement>(".type-text");
      if (typeEl) {
        const full = typeEl.dataset.text ?? typeEl.textContent ?? "";
        const obj = { i: 0 };
        gsap.to(obj, {
          i: full.length,
          duration: 1.1,
          ease: "none",
          delay: 0.35,
          scrollTrigger: st(),
          onStart: () => {
            typeEl.textContent = "";
          },
          onUpdate: () => {
            typeEl.textContent = full.slice(0, Math.round(obj.i));
          },
          onComplete: () => {
            typeEl.textContent = full;
          },
        });
      }

      // integration tiles pop in, wave from top-left
      gsap.from(".tool-tile", {
        scale: 0.5,
        opacity: 0,
        duration: 0.45,
        ease: "back.out(1.7)",
        stagger: { each: 0.028, from: "start", grid: "auto" },
        immediateRender: false,
        clearProps: "transform",
        scrollTrigger: st(),
      });

      // reach tags spring in one after another
      gsap.from(".reach-tag", {
        scale: 0.7,
        y: 10,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.07,
        scrollTrigger: st(),
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section id="praxis" ref={root} className="bg-page py-24">
      <Container>
        <div className="praxis-head max-w-[640px]">
          <p className="eyebrow mb-[18px] flex items-center gap-2.5 text-[#94713f]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            In der Praxis
          </p>
          <h2 className="display-m text-ink">So sieht das bei Ihnen aus.</h2>
          <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#5c5954]">
            Keine Feature-Liste — sondern die Oberflächen und Auswertungen, mit
            denen Sie am Ende tatsächlich arbeiten.
          </p>
        </div>

        <div className="praxis-grid mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ChannelsCard />
          <LocalCard />
          <RequestsCard />
          <ContentCard />
          <IntegrationsCard />
          <ReachCard />
        </div>
      </Container>
    </section>
  );
}
