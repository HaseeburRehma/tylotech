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

/* ------------------------------------------------------------------ */
/* 1 · Channels — two auto-scrolling logo marquees                     */
/* ------------------------------------------------------------------ */
const ROW_TOP = ["googleads", "meta", "tiktok", "youtube"];
const ROW_BOTTOM = ["linkedin", "instagram", "googleanalytics", "google"];

function MarqueeTile({ slug }: { slug: string }) {
  return (
    <div className="grid size-[clamp(58px,17vw,74px)] shrink-0 cursor-pointer place-items-center rounded-[14px] border border-line bg-page transition-[box-shadow,background-color,transform] duration-200 ease-out [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_26px_-10px_rgba(209,170,113,0.55),inset_0_0_0_1.5px_rgba(209,170,113,0.6)] hover:[&_svg]:scale-[1.16] active:translate-y-0 active:scale-95">
      <BrandIcon slug={slug} size={26} />
    </div>
  );
}

function IconMarquee({ slugs, dir }: { slugs: string[]; dir: "ltr" | "rtl" }) {
  // one copy (list ×2) is wide enough to span the card; the track duplicates
  // it so translating by 50% loops seamlessly.
  const copy = [...slugs, ...slugs];
  const track = [...copy, ...copy];
  const anim =
    dir === "ltr"
      ? "animate-[marqueeRight_24s_linear_infinite]"
      : "animate-[marqueeLeft_24s_linear_infinite]";
  return (
    <div
      aria-hidden
      className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)]"
    >
      <div
        className={`flex w-max gap-3 ${anim} group-hover:[animation-play-state:paused] motion-reduce:animate-none`}
      >
        {track.map((slug, i) => (
          <MarqueeTile key={i} slug={slug} />
        ))}
      </div>
    </div>
  );
}

function ChannelsCard() {
  return (
    <Card title="Alle Kanäle, eine Auswertung" subtitle="statt sechs Dashboards">
      <div className="flex flex-col gap-3">
        <IconMarquee slugs={ROW_TOP} dir="ltr" />
        <IconMarquee slugs={ROW_BOTTOM} dir="rtl" />
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
            className="content-block group/snip relative cursor-pointer overflow-hidden rounded-xl border border-line px-3 py-2.5 transition-[box-shadow,background-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[rgba(209,170,113,0.06)] hover:shadow-[0_10px_22px_-12px_rgba(209,170,113,0.6),inset_0_0_0_1.5px_rgba(209,170,113,0.45)]"
          >
            {/* accent bar that grows on hover */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover/snip:scale-y-100" />
            <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-ink/40 transition-colors duration-200 group-hover/snip:text-[#94713f]">
              {s.label}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink/80 transition-colors duration-200 group-hover/snip:text-ink">
              {s.text}
            </p>
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
            className="tool-tile group grid aspect-square cursor-pointer place-items-center rounded-[10px] border border-line bg-page transition-[box-shadow,background-color,transform] duration-200 ease-out [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_22px_-9px_rgba(209,170,113,0.55),inset_0_0_0_1.5px_rgba(209,170,113,0.6)] hover:[&_svg]:scale-[1.18] active:translate-y-0 active:scale-95"
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

/* Animated rotating half-globe of dots (canvas): a highlighted meridian sweeps
   to the active category, a glowing marker rides the rim, and a click sends a
   bright ripple washing up the dome. */
function DomeCanvas({
  active,
  pulse,
}: {
  active: number;
  pulse: { current: number };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const N = 900;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      // az = atan2(z, x) = th (mod 2π) — used to pick out the active slice
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r, az: th % (Math.PI * 2) };
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
    let hi = (active / TAGS.length) * Math.PI * 2;
    let raf = 0;
    const PULSE_MS = 850;

    // project a sphere point (own frame) to screen — shared by dots + arcs
    const project = (
      x: number,
      y: number,
      z: number,
      cosA: number,
      sinA: number,
      cx: number,
      cy: number,
      R: number,
    ) => {
      const x1 = x * cosA - z * sinA;
      const z1 = x * sinA + z * cosA;
      const sx = cx + x1 * R;
      // slight z-lift bends the flat rim into a shallow ellipse (fake tilt)
      const sy = cy - y * R * 0.94 + z1 * R * 0.06;
      return { sx, sy, z1 };
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h * 0.97;
      const R = Math.min(w * 0.47, h * 0.95);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const targetHi = (activeRef.current / TAGS.length) * Math.PI * 2;
      let diff = targetHi - hi;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      hi += diff * 0.1;

      const since = performance.now() - pulse.current;
      const pulsing = since >= 0 && since < PULSE_MS;
      const pp = pulsing ? since / PULSE_MS : 1; // 0 → 1 ripple front (by height)

      // faint grounding rim ellipse
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const th = (i / 64) * Math.PI * 2;
        const { sx, sy } = project(
          Math.cos(th),
          0.02,
          Math.sin(th),
          cosA,
          sinA,
          cx,
          cy,
          R,
        );
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = "rgba(209,170,113,0.16)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // dots
      for (const p of pts) {
        if (p.y < -0.06) continue; // upper hemisphere → dome
        const { sx, sy, z1 } = project(p.x, p.y, p.z, cosA, sinA, cx, cy, R);
        const d = (z1 + 1) / 2; // depth 0 (back) → 1 (front)

        let da = p.az + angle - hi;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        const near = Math.max(0, 1 - Math.abs(da) / 0.42);

        // ripple: a bright band travelling up the dome by height on click
        let ring = 0;
        if (pulsing) {
          ring = Math.max(0, 1 - Math.abs(p.y - pp) * 3.2) * (1 - pp * 0.85);
        }

        const size = (0.5 + d * 1.35 + near * 1.0 + ring * 1.4) * dpr;
        const alpha = Math.min(1, 0.14 + d * 0.55 + near * 0.42 + ring * 0.55);
        const lift = Math.min(1, near + ring); // colour warmth
        const rr = 205 + Math.round(lift * 35);
        const gg = 168 + Math.round(lift * 45);
        const bb = 112 + Math.round(lift * 70);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
        ctx.fill();
      }

      // bright active meridian: pole → front rim at screen-azimuth `hi`
      const alphaAz = hi - angle; // own-frame azimuth so (az + angle) = hi
      const marker = project(
        Math.cos(0.07) * Math.cos(alphaAz),
        Math.sin(0.07),
        Math.cos(0.07) * Math.sin(alphaAz),
        cosA,
        sinA,
        cx,
        cy,
        R,
      );
      const front = (marker.z1 + 1) / 2; // 0 behind → 1 in front
      const arcA = 0.25 + 0.7 * front;
      ctx.beginPath();
      for (let i = 0; i <= 28; i++) {
        const psi = (i / 28) * (Math.PI / 2) * 0.99;
        const { sx, sy } = project(
          Math.cos(psi) * Math.cos(alphaAz),
          Math.sin(psi),
          Math.cos(psi) * Math.sin(alphaAz),
          cosA,
          sinA,
          cx,
          cy,
          R,
        );
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `rgba(214,182,130,${arcA})`;
      ctx.lineWidth = 1.5 * dpr;
      ctx.lineCap = "round";
      ctx.stroke();

      // glowing marker at the rim end of the active meridian
      const pulseBoost = pulsing ? 1 - pp : 0;
      const mr = (3.4 + pulseBoost * 3) * dpr;
      const grad = ctx.createRadialGradient(
        marker.sx,
        marker.sy,
        0,
        marker.sx,
        marker.sy,
        mr * 3,
      );
      grad.addColorStop(0, `rgba(224,190,132,${0.55 * arcA + pulseBoost * 0.4})`);
      grad.addColorStop(1, "rgba(224,190,132,0)");
      ctx.beginPath();
      ctx.arc(marker.sx, marker.sy, mr * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(marker.sx, marker.sy, mr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,198,140,${arcA})`;
      ctx.fill();

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

  return <canvas ref={ref} className="h-[140px] w-full" aria-hidden />;
}

function ReachCard() {
  const [active, setActive] = useState(1);
  const pulse = useRef(0);

  const pick = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    setActive(i);
    pulse.current = performance.now(); // fire the dome ripple
    // springy pop on the clicked tag
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.84 },
      { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.5)", clearProps: "transform" },
    );
  };

  return (
    <Card title="Digitalisierung berührt alles" subtitle="nicht nur das Marketing">
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={(e) => pick(i, e)}
              className={`reach-tag rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors duration-200 ${
                active === i
                  ? "border-accent bg-[rgba(209,170,113,0.14)] text-[#94713f] shadow-[0_4px_14px_-6px_rgba(209,170,113,0.7)]"
                  : "border-line text-ink/60 hover:border-accent/40 hover:bg-[rgba(209,170,113,0.05)] hover:text-ink/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {/* dome sits flush at the bottom edge of the card */}
        <div className="-mx-6 -mb-6 mt-auto">
          <DomeCanvas active={active} pulse={pulse} />
        </div>
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
        clearProps: "transform",
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
