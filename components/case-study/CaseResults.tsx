"use client";

import { useRef } from "react";
import { ChartLine, Plus, TrendingUp } from "lucide-react";
import Container from "../ui/Container";
import PartnerLogo from "../PartnerLogo";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";
import { formatNumber, type Locale } from "@/lib/i18n";
import { PARTNERS } from "@/lib/partners";
import type { CaseStudy, Channel, Metric, Testimonial } from "@/lib/caseStudies";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { CsHead, useCaseReveal } from "./ui";

/* Curves exported from Figma "Verlaufs-Karte" (illustrative shape, the
   headline numbers are the real ones). Wide = with axes, compact = curve only. */
const CURVES = {
  wide: {
    vb: [711, 190] as const,
    d: "M1 187.2C17.881 174.534 68.524 117.534 102.286 111.2C136.048 104.867 169.81 154.9 203.572 149.2C237.333 143.5 271.095 84.284 304.857 77C338.619 69.717 372.381 101.7 406.143 105.5C439.905 109.3 473.667 109.3 507.429 99.8C541.191 90.3 574.952 64.967 608.714 48.5C642.476 32.034 693.119 8.917 710 1",
  },
  compact: {
    vb: [436, 190] as const,
    d: "M1 189C13.056 179 49.222 132.333 73.333 129C97.444 125.667 121.556 165.667 145.667 169C169.778 172.333 193.889 165.667 218 149C242.111 132.333 266.222 77.333 290.333 69C314.444 60.667 338.556 107.333 362.667 99C386.778 90.667 422.944 32.333 435 19",
  },
};

const MONTHS: Record<Locale, string[]> = {
  de: ["Okt", "Jan", "Apr", "Jul", "Okt", "Jan", "Apr", "Jul"],
  en: ["Oct", "Jan", "Apr", "Jul", "Oct", "Jan", "Apr", "Jul"],
};

/** 18721 → "18,7K" (de) / "18.7K" (en), 14040 → "14K" */
function tick(v: number, locale: Locale) {
  if (v === 0) return "0";
  const k = v / 1000;
  const s = String(k >= 100 ? Math.round(k) : Math.round(k * 10) / 10);
  return `${locale === "de" ? s.replace(".", ",") : s}K`;
}

function ChannelIcon({ channel }: { channel: Channel }) {
  if (channel === "organic") return <ChartLine className="size-[22px] text-[#5c5954]" strokeWidth={1.6} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/brands/${channel}.svg`} alt="" width={22} height={22} className="size-[22px] object-contain" />;
}

function Curve({ variant }: { variant: "wide" | "compact" }) {
  const { vb, d } = CURVES[variant];
  const id = `cs-grad-${variant}`;
  return (
    <svg viewBox={`0 0 ${vb[0]} ${vb[1]}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D1AA71" stopOpacity="0.42" />
          <stop offset="1" stopColor="#D1AA71" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="cs-area" d={`${d}V${vb[1]}H1Z`} fill={`url(#${id})`} />
      <path className="cs-line" d={d} fill="none" stroke="#D1AA71" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Value({ m }: { m: Metric }) {
  const locale = useLocale();
  return (
    <p className="font-display text-[26px] font-semibold leading-8 tracking-[-0.8px] text-[#1a1917] tabular-nums sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.9px]">
      <span className="cs-count" data-value={m.value}>
        {formatNumber(locale, m.value)}
      </span>
      {m.suffix?.[locale]}
    </p>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-[#eeedea] px-2.5 text-[12px] font-medium leading-[17px] text-[#5c5954]">
      <ChartLine className="size-[13px]" strokeWidth={2} aria-hidden />
      {text}
    </span>
  );
}

function Head({ m }: { m: Metric }) {
  const locale = useLocale();
  return (
    <>
      <div className="flex items-center gap-2.5">
        <ChannelIcon channel={m.channel} />
        <p className="t-body-m text-[#5c5954]">{m.label[locale]}</p>
      </div>
      <Value m={m} />
      <Chip text={m.chip[locale]} />
    </>
  );
}

const card = "cs-chart relative flex flex-col overflow-hidden rounded-[24px] border border-[#eeedea] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.06)]";

function WideCard({ m }: { m: Metric }) {
  const locale = useLocale();
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => tick(m.value * f, locale));
  return (
    <div className={cn(card, "h-[380px] gap-4 px-5 pt-6 sm:h-[420px] sm:px-7 sm:pt-7")}>
      <Head m={m} />
      <div className="flex min-h-0 flex-1 items-end gap-3.5">
        <div className="flex h-full shrink-0 flex-col justify-between pb-[26px] text-right font-mono text-[12px] leading-4 text-[#7d7973] sm:text-[13px]">
          {ticks.map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
        <div className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
          <div className="relative h-[150px] w-full sm:h-[190px]">
            <Curve variant="wide" />
            <span className="cs-dot absolute right-[2.5%] top-[4%] size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-[#d1aa71] shadow-[0_0_0_3px_rgba(209,170,113,0.45)]" />
          </div>
          <div className="flex justify-between pb-5 font-mono text-[12px] leading-4 text-[#7d7973] sm:text-[13px]">
            {MONTHS[locale].map((mo, i) => (
              <span key={i} className={cn(i % 2 === 1 && "max-sm:hidden")}>
                {mo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactCard({ m, tall = false }: { m: Metric; tall?: boolean }) {
  return (
    <div className={cn(card, "h-[340px] pt-6 sm:pt-7", tall ? "lg:h-[524px]" : "sm:h-[420px]")}>
      <div className="flex flex-col gap-4 px-5 sm:px-7">
        <Head m={m} />
      </div>
      <div className="relative mt-auto h-[150px] w-full sm:h-[190px]">
        <Curve variant="compact" />
        <span className="cs-dot absolute right-[2.5%] top-[14%] size-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-[#d1aa71] shadow-[0_0_0_3px_rgba(209,170,113,0.45)]" />
      </div>
    </div>
  );
}

function Voice({ v }: { v: Testimonial }) {
  const locale = useLocale();
  const partner = PARTNERS.find((p) => p.name === v.logo);
  return (
    <figure
      className="cs-voice relative min-h-[460px] overflow-hidden rounded-[18px] border border-white/10 shadow-[0_16px_44px_rgba(0,0,0,0.35)] sm:min-h-[420px] lg:h-[524px]"
      style={v.image ? undefined : { backgroundImage: "linear-gradient(121deg, #0c3245 11%, #04212d 50%, #010e14 82%)" }}
    >
      {v.image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.image} alt="" loading="lazy" decoding="async" data-parallax="4" className="absolute inset-0 h-full w-full scale-110 object-cover object-center" />
          <span aria-hidden className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[rgba(3,21,28,0.88)] via-[rgba(3,21,28,0.42)] via-55% to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent via-[rgba(3,21,28,0.45)] to-[rgba(3,21,28,0.92)]" />
        </>
      ) : (
        <span aria-hidden className="absolute -right-24 -top-24 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.18),transparent)]" />
      )}

      <div className="absolute left-4 top-4 flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md">
          <Plus className="size-[13px]" strokeWidth={2} aria-hidden />
        </span>
        <span className="rounded-full bg-[rgba(251,246,238,0.94)] px-[13px] py-1.5 font-display text-[13px] font-medium leading-4 tracking-[-0.2px] text-[#12313d] shadow-[0_8px_24px_rgba(8,34,44,0.08)]">
          {v.category[locale]}
        </span>
      </div>

      <blockquote
        className={cn(
          "absolute inset-x-4 t-serif text-white",
          v.image ? "top-[65px] text-[22px] leading-[30px] tracking-[-0.3px] sm:text-[24px] sm:leading-8" : "top-1/2 -translate-y-1/2 text-[26px] leading-[34px] sm:inset-x-10 sm:text-[34px] sm:leading-[42px] lg:inset-x-14",
        )}
      >
        {v.quote[locale]}
      </blockquote>

      <figcaption className="absolute inset-x-4 bottom-4 flex h-[68px] items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 px-4 backdrop-blur-md">
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate font-display text-[16px] font-medium leading-[21px] tracking-[-0.3px] text-white">{v.name}</span>
          <span className="truncate text-[13px] leading-5 text-white/[0.62]">{v.place[locale]}</span>
        </span>
        {partner && <PartnerLogo partner={partner} tint="rgba(255,255,255,0.7)" scale={0.5} className="shrink-0" />}
      </figcaption>
    </figure>
  );
}

/* Figma "02 · Ergebnisse" */
export default function CaseResults({ c }: { c: CaseStudy }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  const r = c.results;

  useCaseReveal(root, () => {
    const scope = root.current!;
    scope.querySelectorAll<HTMLElement>(".cs-chart").forEach((cardEl) => {
      const line = cardEl.querySelector<SVGPathElement>(".cs-line");
      const area = cardEl.querySelector(".cs-area");
      const dot = cardEl.querySelector(".cs-dot");
      const count = cardEl.querySelector<HTMLElement>(".cs-count");
      const tl = gsap.timeline({ scrollTrigger: { trigger: cardEl, start: "top 80%", toggleActions: "play none none none" } });
      tl.from(cardEl, { y: 32, opacity: 0, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" });
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(line, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.2);
      }
      if (area) tl.from(area, { opacity: 0, duration: 1.2, ease: "power1.out" }, 0.6);
      if (dot) tl.from(dot, { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2.5)" }, 1.6);
      if (count) {
        const target = Number(count.dataset.value);
        const o = { v: 0 };
        count.textContent = formatNumber(locale, 0);
        tl.to(o, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => (count.textContent = formatNumber(locale, Math.round(o.v))) }, 0.2);
      }
    });
    gsap.from(".cs-voice", { y: 32, opacity: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: ".cs-voice", start: "top 85%", toggleActions: "play none none none" } });
  });

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 lg:gap-14">
        <CsHead icon={TrendingUp} eyebrow={t("Ergebnisse", "Results")} title={t("Was sich _verändert_ hat.", "What _changed._")} />

        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[820fr_436fr] lg:gap-6">
            <div className="sm:col-span-2 lg:col-span-1">
              <WideCard m={r.wide} />
            </div>
            <CompactCard m={r.compact[0]} />
            <div className="lg:hidden">
              <CompactCard m={r.compact[1]} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[436fr_820fr] lg:gap-6">
            <div className="max-lg:hidden">
              <CompactCard m={r.compact[1]} tall />
            </div>
            <Voice v={r.testimonial} />
          </div>
        </div>

        <p className="t-body-s max-w-[720px] text-[#7d7973]">
          {t(
            "Kennzahlen aus dem Projekt. Die Kurven zeigen den Verlauf schematisch.",
            "Figures from the project. The curves show the trend schematically.",
          )}
        </p>
      </Container>
    </section>
  );
}
