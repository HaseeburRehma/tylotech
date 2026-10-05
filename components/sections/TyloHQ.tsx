"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LayoutDashboard, TrendingDown, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

type Range = 7 | 30 | 90;
const RANGES: Range[] = [7, 30, 90];

type Series = { value: number; prefix?: string; suffix?: string; bars: number[]; labels: string[] };

const LABELS: Record<Range, string[]> = {
  7: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So", "Mo", "Di", "Mi"],
  30: ["KW 1", "KW 1", "KW 2", "KW 2", "KW 2", "KW 3", "KW 3", "KW 4", "KW 4", "KW 4"],
  90: ["Jul", "Jul", "Jul", "Aug", "Aug", "Aug", "Sep", "Sep", "Sep", "Sep"],
};

/* Bar heights are the Figma pixel values (panel visual = 92 px tall at max). */
const TRAFFIC: Record<Range, Series> = {
  7: { value: 12, prefix: "+", suffix: " %", bars: [40, 46, 38, 52, 49, 58, 54, 62, 70, 76], labels: LABELS[7] },
  30: { value: 42, prefix: "+", suffix: " %", bars: [25, 33, 29, 44, 50, 60, 56, 71, 79, 92], labels: LABELS[30] },
  90: { value: 118, prefix: "+", suffix: " %", bars: [14, 20, 26, 31, 40, 47, 58, 66, 80, 92], labels: LABELS[90] },
};
const ANFRAGEN: Record<Range, Series> = {
  7: { value: 132, bars: [58, 66, 61, 70, 64, 74, 69, 77, 82, 88], labels: LABELS[7] },
  30: { value: 568, bars: [62, 68, 64, 71, 69, 75, 78, 81, 85, 90], labels: LABELS[30] },
  90: { value: 1664, bars: [60, 63, 66, 68, 71, 74, 77, 80, 85, 90], labels: LABELS[90] },
};
const CPL: Record<Range, Series> = {
  7: { value: 16, suffix: " €", bars: [62, 58, 60, 54, 52, 48, 46, 44, 38, 34], labels: LABELS[7] },
  30: { value: 18, suffix: " €", bars: [92, 84, 79, 70, 66, 55, 49, 42, 36, 30], labels: LABELS[30] },
  90: { value: 23, suffix: " €", bars: [92, 88, 80, 74, 66, 60, 52, 46, 40, 34], labels: LABELS[90] },
};

const CHANNELS = [
  { name: "Google Ads", src: "/icons/brands/google-ads.svg", note: "Suche & Performance Max" },
  { name: "Meta", src: "/icons/brands/meta.svg", note: "Facebook & Instagram Ads" },
  { name: "TikTok", src: "/icons/brands/tiktok.svg", note: "Reichweite & Recruiting" },
  { name: "YouTube", src: "/icons/brands/youtube.svg", note: "Video-Kampagnen" },
  { name: "LinkedIn", src: "/icons/brands/linkedin.svg", note: "B2B-Leads" },
  { name: "Instagram", src: "/icons/brands/instagram.svg", note: "Content & Reels" },
  { name: "Google Analytics", src: "/icons/brands/google-analytics.svg", note: "Tracking & Attribution" },
  { name: "Google", src: "/icons/brands/google.svg", note: "SEO & Unternehmensprofil" },
];

const RANKINGS = [
  { term: "gebäudereinigung düsseldorf", pos: 1, from: 6, trend: 0.95 },
  { term: "fahrschule düsseldorf", pos: 1, from: 11, trend: 0.92 },
  { term: "Wärmepumpen Spezialist", pos: 2, from: 9, trend: 0.78 },
  { term: "Badsanierung Berlin", pos: 1, from: 7, trend: 0.88 },
];

/* Figma "Skin in the Game" pairs: Du / Wir heights in px */
const SKIN = [
  [38, 16],
  [52, 22],
  [64, 27],
  [82, 35],
  [104, 44],
  [128, 54],
  [150, 64],
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** Counts from the previous value to `target` whenever target changes (and only once `active`). */
function useCountUp(target: number, active: boolean, duration = 900) {
  const [val, setVal] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      const e = 1 - Math.pow(1 - p, 3);
      const v = a + (target - a) * e;
      setVal(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, active, duration]);
  return Math.round(val);
}

function OpenButton() {
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f6f5f3] text-ink/70 transition-all duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-white"
    >
      <ArrowUpRight className="size-[15px]" strokeWidth={1.8} />
    </span>
  );
}

function Tile({
  title,
  desc,
  children,
  className,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "hq-tile group relative flex flex-col overflow-hidden rounded-[20px] border border-[#e2e0dc] bg-white transition-[translate,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#d6d2cb] hover:shadow-[0_22px_44px_-24px_rgba(8,34,44,0.28)]",
        className,
      )}
    >
      <header className="flex items-start gap-4 pb-2 pl-6 pr-5 pt-6 sm:pl-7 sm:pt-[26px]">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[19px] font-medium leading-[26px] tracking-[-0.4px] text-[#1a1917] sm:text-[20px]">
            {title}
          </h3>
          <p className="mt-[3px] text-[14px] leading-[22px] tracking-[-0.1px] text-[#7d7973]">{desc}</p>
        </div>
        <OpenButton />
      </header>
      <div className="flex h-[300px] flex-col justify-center">{children}</div>
    </article>
  );
}

/* ---- KPI tile with growing bars -------------------------------------------- */

function BarsTile({
  title,
  desc,
  label,
  series,
  shown,
  falling = false,
}: {
  title: string;
  desc: string;
  label: string;
  series: Series;
  shown: boolean;
  falling?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const num = useCountUp(series.value, shown);
  const max = 92;
  const Icon = falling ? TrendingDown : TrendingUp;

  return (
    <Tile title={title} desc={desc}>
      <div className="flex h-full flex-col gap-4 rounded-[14px] border border-[#eeedea] bg-white px-[22px] py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9.5px] font-medium uppercase leading-[13px] tracking-[0.8px] text-[#7d7973]">
              {label}
            </p>
            <p className="mt-0.5 font-display text-[30px] font-semibold leading-[34px] tracking-[-0.8px] text-[#1a1917] tabular-nums">
              {series.prefix}
              {num.toLocaleString("de-DE")}
              {series.suffix}
            </p>
          </div>
          <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full bg-[#e7f4ed] px-2 text-[11px] font-medium text-[#0e5836]">
            <Icon className="size-3" strokeWidth={2.2} />
            {series.labels === LABELS[7] ? "7 Tage" : series.labels === LABELS[90] ? "90 Tage" : "30 Tage"}
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 items-end gap-2" onMouseLeave={() => setHover(null)}>
          {series.bars.map((h, i) => {
            const accent = i >= series.bars.length - 2;
            const active = hover === i;
            return (
              <button
                type="button"
                key={i}
                aria-label={`${series.labels[i]}: ${h}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="relative flex h-full min-w-0 flex-1 cursor-pointer items-end outline-none"
              >
                <span
                  className={cn(
                    "block w-full rounded-[4px] transition-[height,background-color] ease-[cubic-bezier(.22,1,.36,1)]",
                    accent
                      ? active
                        ? "bg-[#b98c4f]"
                        : "bg-[#d1aa71]"
                      : active
                        ? "bg-[#d9d6d0]"
                        : "bg-[#eeedea]",
                  )}
                  style={{
                    height: shown ? h : 0,
                    transitionDuration: "700ms, 200ms",
                    transitionDelay: shown ? `${i * 55}ms, 0ms` : "0ms",
                  }}
                />
                {active && (
                  <span
                    className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1917] px-2 py-1 font-mono text-[10px] text-white shadow-lg"
                    style={{ bottom: h + 8 }}
                  >
                    {series.labels[i]} · {Math.round((h / max) * (falling ? 30 : 100))}
                    {falling ? " €" : ""}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Tile>
  );
}

/* ------------------------------------------------------------------ */
/* section                                                             */
/* ------------------------------------------------------------------ */

export default function TyloHQ() {
  const root = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<Range>(30);
  const [shown, setShown] = useState(false);
  const [rowsShown, setRowsShown] = useState(false);
  const [hl, setHl] = useState(1); // Meta is highlighted in Figma
  const [hoverCh, setHoverCh] = useState<number | null>(null);
  const [skinHover, setSkinHover] = useState<number | null>(null);

  useGSAP(
    () => {
      gsap.from(".hq-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".hq-head", start: "top 82%", toggleActions: "play none none none" },
      });
      gsap.from(".hq-tile", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".hq-grid", start: "top 80%", toggleActions: "play none none none" },
      });
      ScrollTrigger.create({
        trigger: ".hq-grid",
        start: "top 75%",
        end: "max",
        once: true,
        onToggle: (self) => self.isActive && setShown(true),
      });
      ScrollTrigger.create({
        trigger: ".hq-row2",
        start: "top 78%",
        end: "max",
        once: true,
        onToggle: (self) => self.isActive && setRowsShown(true),
      });
      gsap.from(".hq-marquee", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".hq-row2", start: "top 78%", toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  // the highlight wanders from channel to channel while nobody hovers
  useEffect(() => {
    if (hoverCh !== null || !rowsShown) return;
    const id = setInterval(() => setHl((h) => (h + 1) % CHANNELS.length), 1600);
    return () => clearInterval(id);
  }, [hoverCh, rowsShown]);

  const activeCh = hoverCh ?? hl;

  return (
    <section id="tylohq" ref={root} className="border-t border-line bg-[#f6f5f3] py-14 text-ink sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="hq-head max-w-[780px]">
            <p className="mb-[18px] inline-flex w-fit items-center gap-[7px] rounded-full border border-[rgba(8,34,44,0.08)] bg-white/70 py-[7px] pl-2.5 pr-3.5 font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#5c5954] shadow-[0_8px_24px_rgba(8,34,44,0.08)] backdrop-blur-md sm:text-[12px]">
              <LayoutDashboard className="size-3.5 text-[#c79a53]" strokeWidth={1.8} />
              Alles sichtbar · TyloTech HQ
            </p>
            <h2 className="font-display text-[clamp(2rem,3.4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-1.3px] text-[#1a1917]">
              Bei uns läufst du{" "}
              <span className="font-[family-name:var(--font-instrument)] text-[1.05em] font-normal italic tracking-[-0.5px] text-[#94713f]">
                nicht im Blindflug.
              </span>
            </h2>
            <p className="mt-[18px] max-w-[640px] text-[clamp(16px,1.4vw,18px)] leading-[28px] tracking-[-0.18px] text-[#5c5954]">
              Dein eigenes Portal zeigt dir jederzeit, was läuft — Zahlen, Fortschritt, nächste Schritte. Keine
              Reportings per Mail, keine Blackbox.
            </p>
          </div>

          {/* range switch drives the three KPI tiles */}
          <div
            role="tablist"
            aria-label="Zeitraum"
            className="hq-head inline-flex w-fit items-center gap-1 rounded-full border border-[#e2e0dc] bg-white p-1 shadow-[0_1px_2px_rgba(8,34,44,0.04)]"
          >
            {RANGES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2.5 font-mono text-[11.5px] sm:py-1.5 font-medium tracking-[0.3px] transition-colors duration-200",
                  range === r ? "bg-[#1a1917] text-white" : "text-[#5c5954] hover:bg-[#f6f5f3] hover:text-ink",
                )}
              >
                {r} Tage
              </button>
            ))}
          </div>
        </div>

        <div className="hq-grid mt-10 grid grid-cols-1 gap-5 sm:mt-14 md:grid-cols-2 xl:grid-cols-3">
          {/* row 1 — KPIs */}
            <BarsTile
              title={`Website-Traffic · ${range} Tage`}
              desc="Echtzeit, jederzeit einsehbar"
              label="Website-Traffic"
              series={TRAFFIC[range]}
              shown={shown}
            />
            <BarsTile
              title="Neue Anfragen"
              desc="Automatisch erfasst und zugeordnet"
              label="Neue Anfragen"
              series={ANFRAGEN[range]}
              shown={shown}
            />
            <BarsTile
              title="Cost per Lead"
              desc="Transparent, kein geschöntes Reporting"
              label="Cost per Lead"
              series={CPL[range]}
              shown={shown}
              falling
            />

            {/* 04 · channels */}
            <Tile title="Marketing aus einer Hand" desc="Ads, SEO, Content, Funnels" className="hq-row2">
              <div className="pb-2" onMouseLeave={() => setHoverCh(null)}>
                {/* two rows of logos running continuously left → right */}
                <div className="flex flex-col gap-3">
                  {[CHANNELS.slice(0, 4), CHANNELS.slice(4)].map((row, r) => {
                    // one copy (row ×2) is wider than the tile; the track holds two copies
                    // and slides by 50 %, so the loop is seamless
                    const track = [...row, ...row, ...row, ...row];
                    return (
                      <div
                        key={r}
                        className="hq-marquee group/mq relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
                      >
                        <div
                          className="flex w-max gap-3 py-1.5 animate-[marqueeRight_26s_linear_infinite] group-hover/mq:[animation-play-state:paused] motion-reduce:animate-none"
                          style={{ animationDelay: r ? "-9s" : "0s" }}
                        >
                          {track.map((c, i) => {
                            const idx = CHANNELS.indexOf(c);
                            const on = activeCh === idx;
                            return (
                              <button
                                type="button"
                                key={i}
                                aria-label={c.name}
                                tabIndex={i < row.length ? 0 : -1}
                                onMouseEnter={() => setHoverCh(idx)}
                                onFocus={() => setHoverCh(idx)}
                                className={cn(
                                  "grid size-[74px] shrink-0 place-items-center rounded-[14px] border transition-[background-color,border-color,box-shadow,translate] duration-300 hover:-translate-y-1",
                                  on
                                    ? "border-[1.5px] border-[#d1aa71] bg-[#fbf6ee] shadow-[0_10px_24px_-14px_rgba(148,113,63,0.6)]"
                                    : "border-[#eeedea] bg-[#f6f5f3]",
                                )}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={c.src} alt="" className="size-[30px] object-contain" draggable={false} />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 flex h-5 items-center gap-2 px-6 text-[13px] text-[#5c5954]">
                  <span className="size-1.5 rounded-full bg-[#d1aa71]" />
                  <span key={activeCh} className="animate-[hqfade_.35s_ease]">
                    <span className="font-medium text-[#1a1917]">{CHANNELS[activeCh].name}</span>
                    {" · "}
                    {CHANNELS[activeCh].note}
                  </span>
                </p>
              </div>
            </Tile>

            {/* 05 · rankings */}
            <Tile title="Anfragen auf Autopilot" desc="über Google, Social und KI-Suche">
              <div className="mx-0 rounded-[14px] border border-[#eeedea] bg-white px-5 py-[18px]">
                <div className="flex items-center gap-2.5 pb-2.5 font-mono text-[9.5px] font-medium uppercase leading-[13px] tracking-[0.7px] text-[#7d7973]">
                  <span className="flex-1">Suchbegriff</span>
                  <span className="w-[34px]">Pos.</span>
                  <span className="w-[52px]">Trend</span>
                </div>
                {RANKINGS.map((r, i) => (
                  <RankRow key={r.term} row={r} index={i} shown={rowsShown} />
                ))}
              </div>
            </Tile>

            {/* 06 · skin in the game */}
            <article className="hq-tile group relative flex flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[rgba(209,170,113,0.55)] bg-[#fbf6ee] shadow-[0_14px_34px_rgba(8,34,44,0.08),0_0_44px_rgba(209,170,113,0.22)] transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_-18px_rgba(8,34,44,0.22),0_0_60px_rgba(209,170,113,0.35)] ">
              <header className="flex items-start gap-4 pb-2 pl-6 pr-5 pt-6 sm:pl-7 sm:pt-[26px]">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[19px] font-medium leading-[26px] tracking-[-0.4px] text-[#1a1917] sm:text-[20px]">
                    Skin in the Game
                  </h3>
                  <p className="mt-[3px] text-[14px] leading-[22px] tracking-[-0.1px] text-[#7d7973]">
                    wir steigen mit ein
                  </p>
                </div>
                <OpenButton />
              </header>
              <div className="flex h-[300px] flex-col gap-[18px] p-[22px]">
                <div className="flex items-center gap-5 font-mono text-[10px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#7d7973]">
                  <span className="inline-flex items-center gap-[7px]">
                    <span className="size-2 rounded-full bg-[#12313d]" />
                    Dein Wachstum
                  </span>
                  <span className="inline-flex items-center gap-[7px]">
                    <span className="size-2 rounded-full bg-[#d1aa71]" />
                    Unser Anteil
                  </span>
                </div>
                <div
                  className="relative flex min-h-0 flex-1 items-end justify-center gap-[14px]"
                  onMouseLeave={() => setSkinHover(null)}
                >
                  {SKIN.map(([du, wir], i) => {
                    const on = skinHover === i;
                    const dim = skinHover !== null && !on;
                    return (
                      <button
                        type="button"
                        key={i}
                        aria-label={`Monat ${i + 1}`}
                        onMouseEnter={() => setSkinHover(i)}
                        onFocus={() => setSkinHover(i)}
                        className={cn(
                          "relative flex h-full items-end gap-1 outline-none transition-opacity duration-200",
                          dim && "opacity-45",
                        )}
                      >
                        <span
                          className={cn(
                            "block w-[15px] rounded-[4px] transition-[height,background-color] ease-[cubic-bezier(.22,1,.36,1)]",
                            on ? "bg-[rgba(18,49,61,0.32)]" : "bg-[rgba(18,49,61,0.14)]",
                          )}
                          style={{
                            height: rowsShown ? du : 0,
                            transitionDuration: "800ms, 200ms",
                            transitionDelay: rowsShown ? `${i * 80}ms, 0ms` : "0ms",
                          }}
                        />
                        <span
                          className="block w-[15px] rounded-[4px] bg-gradient-to-b from-[#efdcbc] to-[#b4894d] transition-[height] ease-[cubic-bezier(.22,1,.36,1)]"
                          style={{
                            height: rowsShown ? wir : 0,
                            transitionDuration: "800ms",
                            transitionDelay: rowsShown ? `${i * 80 + 120}ms` : "0ms",
                          }}
                        />
                        {on && (
                          <span
                            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1a1917] px-2 py-1 text-left font-mono text-[10px] leading-[14px] text-white shadow-lg"
                            style={{ bottom: du + 8 }}
                          >
                            Monat {i + 1}
                            <br />
                            <span className="text-white/60">Umsatz</span> +{Math.round((du / 38) * 100 - 100)} %
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-[14px] leading-[22px] tracking-[-0.1px] text-[#5c5954]">
                  Wir verdienen, wenn du wächst.
                </p>
              </div>
            </article>
        </div>
      </Container>
    </section>
  );
}

function RankRow({
  row,
  index,
  shown,
}: {
  row: (typeof RANKINGS)[number];
  index: number;
  shown: boolean;
}) {
  // position counts down from where we started to where we are now
  const [pos, setPos] = useState(row.from);
  useEffect(() => {
    if (!shown) return;
    let p = row.from;
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => {
        p -= 1;
        setPos(p);
        if (p <= row.pos) clearInterval(id);
      }, 90);
    }, 250 + index * 140);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, [shown, row.from, row.pos, index]);

  const top = pos === 1;
  return (
    <div
      className="group/row -mx-2 flex items-center gap-2.5 rounded-lg border-t border-[#eeedea] px-2 py-[9px] transition-[background-color,translate,opacity] duration-500 ease-out hover:bg-[#fbf6ee]"
      style={{
        opacity: shown ? 1 : 0,
        translate: shown ? "0 0" : "0 14px",
        transitionDelay: shown ? `${index * 120}ms` : "0ms",
      }}
    >
      <p className="min-w-0 flex-1 truncate text-[12px] leading-[17px] text-[#1a1917]">{row.term}</p>
      <span
        className={cn(
          "grid h-6 w-[26px] place-items-center rounded-[7px] font-mono text-[12px] font-medium leading-4 tabular-nums transition-colors",
          top ? "bg-[#fbf6ee] text-[#94713f] group-hover/row:bg-[#f3e6cf]" : "bg-[#f6f5f3] text-[#5c5954]",
        )}
      >
        {pos}
      </span>
      <span className="relative h-1.5 w-[52px] overflow-hidden rounded-[3px] bg-[#eeedea]">
        <span
          className="absolute inset-y-0 left-0 rounded-[3px] bg-[#d1aa71] transition-[width] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ width: shown ? `${row.trend * 100}%` : "0%", transitionDelay: shown ? `${300 + index * 140}ms` : "0ms" }}
        />
      </span>
    </div>
  );
}
