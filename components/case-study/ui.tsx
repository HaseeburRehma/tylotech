"use client";

import type { ComponentType, RefObject } from "react";
import { cn } from "@/lib/cn";
import { gsap, ScrollTrigger, useLazyGSAP } from "@/lib/gsap";
import type { Card, Shot } from "@/lib/caseStudies";
import { Accent } from "../branche/ui";
import { useLocale } from "../i18n/LocaleProvider";

/* ---- reveal-on-scroll ----------------------------------------------------- */

/**
 * Shared scroll animation for case-study sections:
 *  [data-rv]        fades/slides in when it enters the viewport
 *  [data-rv-group]  its children do the same, staggered
 *  [data-parallax]  drifts gently while the section scrolls by (value = strength in %)
 * Reduced motion: everything simply stays in its final state.
 */
export function useCaseReveal(scope: RefObject<HTMLElement | null>, extra?: () => void) {
  useLazyGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = scope.current;
      if (!el) return;
      const st = (trigger: Element, start = "top 85%") => ({ trigger, start, toggleActions: "play none none none" as const });
      el.querySelectorAll<HTMLElement>("[data-rv]").forEach((n) => {
        gsap.from(n, { y: 28, opacity: 0, duration: 0.85, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: st(n) });
      });
      el.querySelectorAll<HTMLElement>("[data-rv-group]").forEach((g) => {
        gsap.from(g.children, { y: 30, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity", scrollTrigger: st(g) });
      });
      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((n) => {
        const amt = Number(n.dataset.parallax) || 5;
        gsap.fromTo(n, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: n.parentElement ?? n, start: "top bottom", end: "bottom top", scrub: true } });
      });
      extra?.();
      ScrollTrigger.refresh();
    },
    { scope },
  );
}

/* ---- eyebrow + section head ------------------------------------------------ */

type IconType = ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>;

/** Instagram mark (lucide has no brand icons) — the brand SVG as a mask, tinted with currentColor. */
export function InstagramIcon({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block bg-current [mask:url(/icons/brands/instagram.svg)_center/contain_no-repeat]", className)} />;
}

export function CsEyebrow({ icon: I, children, dark = false, className }: { icon: IconType; children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "eyebrow inline-flex w-fit max-w-full items-center gap-[7px] rounded-full border py-[7px] pl-2.5 pr-3.5 backdrop-blur-md",
        dark
          ? "border-white/[0.18] bg-white/10 text-[#cbc8c2]"
          : "border-[rgba(8,34,44,0.08)] bg-white/[0.72] text-[#5c5954] shadow-[0_8px_24px_rgba(8,34,44,0.08)]",
        className,
      )}
    >
      <I className={cn("size-3.5 shrink-0", dark ? "text-[#d8b682]" : "text-[#c79a53]")} strokeWidth={1.8} aria-hidden />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

export function CsHead({
  icon,
  eyebrow,
  title,
  sub,
  dark = false,
  className,
}: {
  icon: IconType;
  eyebrow: string;
  title: string;
  sub?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div data-rv-group className={cn("flex max-w-[720px] flex-col items-start gap-[18px]", className)}>
      <CsEyebrow icon={icon} dark={dark}>
        {eyebrow}
      </CsEyebrow>
      <h2 className={cn("t-h2", dark ? "text-white" : "text-[#1a1917]")}>
        <Accent text={title} dark={dark} />
      </h2>
      {sub && <p className={cn("t-body-l", dark ? "text-[#cbc8c2]" : "text-[#5c5954]")}>{sub}</p>}
    </div>
  );
}

/* ---- browser frame (Figma "Browserfenster") --------------------------------- */

export function BrowserDots() {
  return (
    <span aria-hidden className="flex shrink-0 gap-1.5">
      <span className="size-2 rounded-full bg-[#ff0000]" />
      <span className="size-2 rounded-full bg-[#ffe100]" />
      <span className="size-2 rounded-full bg-[#008000]" />
    </span>
  );
}

export function BrowserBar({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#eeedea] bg-[#f6f5f3] px-3.5 py-2.5">
      <BrowserDots />
      <span className="flex min-w-0 flex-1 justify-center rounded-md bg-white py-1">
        <span className="truncate font-mono text-[12px] leading-4 text-[#7d7973] sm:text-[13px]">{domain}</span>
      </span>
    </div>
  );
}

/** Screenshot in a browser frame. `ratio` is the image area (w/h); the frame adds the bar. */
export function BrowserFrame({
  domain,
  shot,
  ratio,
  sizes = "(min-width: 1280px) 1280px, 100vw",
  parallax = false,
  className,
}: {
  domain: string;
  shot: Shot;
  ratio: number;
  sizes?: string;
  parallax?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-[#e2e0dc] bg-white shadow-[0_8px_24px_rgba(26,23,20,0.06)]", className)}>
      <BrowserBar domain={domain} />
      <div className="relative overflow-hidden bg-[#f6f5f3]" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          width={shot.w}
          height={shot.h}
          alt={shot.alt[locale]}
          sizes={sizes}
          loading="lazy"
          decoding="async"
          data-parallax={parallax ? 3 : undefined}
          className={cn("absolute inset-0 h-full w-full object-cover object-top", parallax && "scale-[1.07]")}
        />
      </div>
    </figure>
  );
}

/* ---- iPhone frame (Figma "Gerät", 426×880) ---------------------------------- */

export function PhoneFrame({ src, alt, className, sizes = "300px" }: { src: string; alt: string; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative aspect-[426/880] shrink-0 [container-type:inline-size]", className)}>
      <div className="absolute inset-0 rounded-[17cqw] border border-white/70 shadow-[0_0_0_0.5px_rgba(255,255,255,0.35),0_24px_60px_-20px_rgba(0,0,0,0.6)]" />
      <div className="absolute inset-[4.2cqw] overflow-hidden rounded-[13.5cqw] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} sizes={sizes} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
      {/* dynamic island */}
      <span aria-hidden className="absolute left-1/2 top-[3.3%] h-[4.1%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      {/* side buttons */}
      <span aria-hidden className="absolute -left-[0.7cqw] top-[19.5%] h-[3.6%] w-[0.7cqw] rounded-l-sm bg-white/50" />
      <span aria-hidden className="absolute -left-[0.7cqw] top-[26.8%] h-[7.4%] w-[0.7cqw] rounded-l-sm bg-white/50" />
      <span aria-hidden className="absolute -left-[0.7cqw] top-[36.4%] h-[7.4%] w-[0.7cqw] rounded-l-sm bg-white/50" />
      <span aria-hidden className="absolute -right-[0.7cqw] top-[31.9%] h-[11.8%] w-[0.7cqw] rounded-r-sm bg-white/50" />
    </div>
  );
}

/* ---- numbered card (Figma "Erkenntnis-Karte") -------------------------------- */

export function NumberedCard({ card, index, dark = false }: { card: Card; index: number; dark?: boolean }) {
  const locale = useLocale();
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-[20px] border px-7 pb-8 pt-7 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1",
        dark
          ? "border-[#2b2a27] bg-[#002230] hover:border-[#d8b682]/40"
          : "border-[#eeedea] bg-white hover:border-[#e3c79e] hover:shadow-[0_18px_36px_-22px_rgba(8,34,44,0.3)]",
      )}
    >
      <span className={cn("eyebrow", dark ? "text-[#d8b682]" : "text-[#94713f]")}>{card.number ?? String(index + 1).padStart(2, "0")}</span>
      <h3 className={cn("t-h5 font-display font-medium", dark ? "text-white" : "text-[#1a1917]")}>{card.title[locale]}</h3>
      <p className={cn("t-body-s", dark ? "text-[#cbc8c2]" : "text-[#5c5954]")}>{card.text[locale]}</p>
    </article>
  );
}
