"use client";

import { useRef } from "react";
import { ArrowUpRight, Eye, KeyRound, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---- Bar chart -------------------------------------------------- */
function BarChart({
  data,
  accentFrom,
  cap,
  className = "",
}: {
  data: number[];
  accentFrom?: number;
  cap: number;
  className?: string;
}) {
  return (
    <div className={`flex h-14 items-end gap-[3px] ${className}`}>
      {data.map((v, i) => {
        const isAccent = accentFrom !== undefined && i >= accentFrom;
        return (
          <div
            key={i}
            className={`flex-1 rounded-t-[2px] ${
              isAccent ? "bg-[#d1aa71]" : "bg-[#e4e2dd]"
            }`}
            style={{ height: `${(v / cap) * 100}%` }}
          />
        );
      })}
    </div>
  );
}

/* ---- Colored brand mark used inside the platforms tile ---------- */
function BrandMark({
  label,
  bg,
  fg,
  children,
}: {
  label: string;
  bg: string;
  fg: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      title={label}
      className="grid aspect-square place-items-center rounded-xl border border-black/5 text-[13px] font-bold"
      style={{ background: bg, color: fg }}
    >
      {children ?? label.charAt(0)}
    </div>
  );
}

/* ---- Simple 30-Tage pill --------------------------------------- */
function TrendPill({ label = "30 Tage" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(40,180,120,0.14)] px-2 py-[3px] text-[10.5px] font-semibold text-[#1a8a5a]">
      <TrendingUp className="size-[11px]" strokeWidth={2.5} />
      {label}
    </span>
  );
}

/* ---- Tile skeleton --------------------------------------------- */
function TileHeader({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-[14.5px] font-semibold tracking-[-0.005em] text-ink">
          {title}
        </h3>
        <p className="mt-0.5 text-[12.5px] leading-snug text-ink/50">{desc}</p>
      </div>
      <button
        type="button"
        aria-label="Öffnen"
        className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink/40 transition-colors hover:border-ink/25 hover:text-ink"
      >
        <ArrowUpRight className="size-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

/* ---- Section ---------------------------------------------------- */
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
        scrollTrigger: {
          trigger: ".hq-head",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
      gsap.from(".hq-tile", {
        y: 30,
        opacity: 0,
        scale: 0.97,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".hq-grid",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: root },
  );

  const traffic = [10, 14, 12, 18, 15, 20, 22, 26, 30, 34, 38, 46];
  const anfragen = [6, 10, 14, 12, 18, 22, 26, 24, 30, 34, 40, 46];
  const cpl = [24, 26, 23, 25, 22, 20, 21, 19, 17, 16, 15, 14];
  const skinYou = [18, 24, 28, 32, 26, 34, 40, 44, 50, 46, 56, 62];
  const skinUs = [8, 10, 12, 14, 12, 15, 18, 20, 22, 20, 24, 26];

  return (
    <section
      id="tylohq"
      ref={root}
      className="border-t border-line bg-[#f7f7f5] py-20 text-ink sm:py-24"
    >
      <Container>
        {/* header */}
        <div className="hq-head max-w-[720px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
              <Eye className="size-3.5 text-accent" />
              Alles sichtbar
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink/60 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
              <KeyRound className="size-3.5" />
              TyloHQ HQ
            </span>
          </div>
          <h2 className="mt-6 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
            Bei uns läufst du{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              nicht im Blindflug
            </span>
            .
          </h2>
          <p className="mt-5 max-w-[620px] text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-[#5c5954]">
            Dein eigenes Portal zeigt dir jederzeit, was läuft — Zahlen,
            Fortschritt, nächste Schritte. Keine Reportings per Mail, keine
            Blackbox.
          </p>
        </div>

        {/* dashboard grid */}
        <div className="hq-grid mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1 · Website-Traffic */}
          <div className="hq-tile rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Website-Traffic · 30 Tage"
              desc="Echtzeit, jederzeit einsehbar"
            />
            <div className="mt-5 flex items-center justify-between">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                Website-Traffic
              </p>
              <TrendPill />
            </div>
            <p className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.02em]">
              +42 %
            </p>
            <BarChart data={traffic} accentFrom={traffic.length - 2} cap={50} className="mt-4" />
          </div>

          {/* 2 · Neue Anfragen */}
          <div className="hq-tile rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Neue Anfragen"
              desc="Automatisiert erfasst und zugeordnet"
            />
            <div className="mt-5 flex items-center justify-between">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                Neue Anfragen
              </p>
              <TrendPill />
            </div>
            <p className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.02em]">
              128
            </p>
            <BarChart data={anfragen} accentFrom={anfragen.length - 2} cap={50} className="mt-4" />
          </div>

          {/* 3 · Cost per Lead */}
          <div className="hq-tile rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Cost per Lead"
              desc="Transparent, kein geschöntes Reporting"
            />
            <div className="mt-5 flex items-center justify-between">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                Cost per Lead
              </p>
              <TrendPill />
            </div>
            <p className="mt-1 font-display text-[30px] font-bold leading-none tracking-[-0.02em]">
              18 €
            </p>
            <BarChart data={cpl} accentFrom={cpl.length - 2} cap={30} className="mt-4" />
          </div>

          {/* 4 · Marketing aus einer Hand */}
          <div className="hq-tile rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Marketing aus einer Hand"
              desc="Ads, SEO, Content, Funnels"
            />
            <div className="mt-6 grid grid-cols-4 gap-2.5">
              <BrandMark label="Google Ads" bg="#fff" fg="#4285f4">
                <span className="text-[15px] font-bold" style={{ color: "#4285f4" }}>
                  G
                </span>
              </BrandMark>
              <BrandMark label="Meta" bg="#0866ff" fg="#fff">
                <span className="text-[15px] font-black">M</span>
              </BrandMark>
              <BrandMark label="TikTok" bg="#0f0f10" fg="#fff">
                <span className="text-[13px] font-black">TT</span>
              </BrandMark>
              <BrandMark label="YouTube" bg="#ff0033" fg="#fff">
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </BrandMark>
              <BrandMark label="LinkedIn" bg="#0a66c2" fg="#fff">
                <span className="text-[12px] font-black">in</span>
              </BrandMark>
              <BrandMark label="Instagram" bg="linear-gradient(135deg,#feda75,#fa7e1e 40%,#d62976 70%,#4f5bd5)" fg="#fff">
                <span className="text-[13px] font-black">IG</span>
              </BrandMark>
              <BrandMark label="Analytics" bg="#fef3c7" fg="#c07a00">
                <TrendingUp className="size-4" strokeWidth={2.5} />
              </BrandMark>
              <BrandMark label="Google" bg="#fff" fg="#4285f4">
                <span className="text-[15px] font-bold" style={{ color: "#4285f4" }}>
                  G
                </span>
              </BrandMark>
            </div>
          </div>

          {/* 5 · Anfragen auf Autopilot */}
          <div className="hq-tile rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Anfragen auf Autopilot"
              desc="über Google, Social und KI-Suche"
            />
            <div className="mt-5">
              <div className="flex items-center justify-between border-b border-line pb-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink/35">
                <span>Suchbegriff</span>
                <span className="flex items-center gap-4">
                  <span>Pos.</span>
                  <span>Trend</span>
                </span>
              </div>
              {[
                { term: "gebäudereinigung düsseldorf", pos: 1, up: true },
                { term: "fahrschule krefeld", pos: 3, up: true },
                { term: "pizza in bochum", pos: 1, up: true },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-center justify-between border-b border-line/70 py-2.5 text-[12.5px] text-ink/75 last:border-0"
                >
                  <span className="truncate pr-2">{row.term}</span>
                  <span className="flex items-center gap-5 font-semibold text-ink">
                    <span>{row.pos}</span>
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-[rgba(40,180,120,0.14)] text-[#1a8a5a]">
                      <TrendingUp className="size-[10px]" strokeWidth={3} />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 · Skin in the Game */}
          <div className="hq-tile rounded-2xl border border-[#e8dcc4] bg-[#f8f0e0] p-5 shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <TileHeader
              title="Skin in the Game"
              desc="wir steigen mit ein"
            />
            <div className="mt-5 flex items-center gap-4 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink/55">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-ink" />
                Dein Wachstum
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#d1aa71]" />
                Unser Anteil
              </span>
            </div>
            <div className="mt-4 flex h-14 items-end gap-[3px]">
              {skinYou.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-stretch justify-end gap-[2px]">
                  <div
                    className="rounded-t-[2px] bg-ink"
                    style={{ height: `${(v / 70) * 100}%` }}
                  />
                  <div
                    className="rounded-t-[2px] bg-[#d1aa71]"
                    style={{ height: `${(skinUs[i] / 70) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[12px] italic text-ink/55">
              Wir verdienen, wenn du wächst.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
