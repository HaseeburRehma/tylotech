"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { formatNumber, type Locale } from "@/lib/i18n";

/* ---- auto-sliding image stack -------------------------------------------- */

export type SlideImage = { src: string; alt: string; w: number; h: number; srcSet?: string; pos?: "top" | "center" };

/**
 * Crossfading image stack for case-study cards. It only runs while it is on screen
 * and the tab is visible, pauses while the card is hovered or focused, and stays on
 * the first image with reduced motion. Images after the first load just before they
 * are shown. The progress bars are decorative: the whole card is a link.
 */
export function AutoSlider({
  slides,
  interval = 3800,
  sizes,
  priority = false,
  className,
  imgClassName = "object-cover",
  zoomClassName,
}: {
  slides: SlideImage[];
  interval?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** hover zoom for the whole stack (kept off the images so it never fights the crossfade) */
  zoomClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(1); // how many slides are mounted (lazy)
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = el.closest("a, article") ?? el;
    let visible = false;
    let hovered = false;
    let focused = false;
    const update = () => setRunning(visible && !hovered && !focused && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) setLoaded((n) => Math.max(n, 2)); // warm up the next image
      update();
    }, { threshold: 0.35 });
    io.observe(el);
    const on = (fn: (v: boolean) => void, v: boolean) => () => {
      fn(v);
      update();
    };
    const enter = on((v) => (hovered = v), true);
    const leave = on((v) => (hovered = v), false);
    const fin = on((v) => (focused = v), true);
    const fout = on((v) => (focused = v), false);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", fin);
    card.addEventListener("focusout", fout);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", fin);
      card.removeEventListener("focusout", fout);
      document.removeEventListener("visibilitychange", update);
    };
  }, [slides.length]);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      const next = (index + 1) % slides.length;
      setIndex(next);
      setLoaded((n) => Math.min(slides.length, Math.max(n, next + 2))); // the one after, too
    }, interval);
    return () => window.clearTimeout(id);
  }, [running, index, interval, slides.length]);

  return (
    <div ref={root} className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", zoomClassName)}>
        {slides.slice(0, loaded).map((s, i) => {
          const on = i === index;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={s.src}
              src={s.src}
              srcSet={s.srcSet}
              sizes={sizes}
              width={s.w}
              height={s.h}
              alt={on ? s.alt : ""}
              aria-hidden={!on}
              loading={i === 0 && priority ? "eager" : "lazy"}
              fetchPriority={i === 0 && priority ? "high" : "auto"}
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full transition-[opacity,scale] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                imgClassName,
                s.pos === "center" ? "object-center" : "object-top",
                on ? "z-[1] scale-100 opacity-100 duration-[1100ms]" : "z-0 scale-[1.06] opacity-0 duration-[900ms]",
              )}
            />
          );
        })}
      </div>

      {slides.length > 1 && (
        <div aria-hidden className="pointer-events-none absolute inset-x-3 bottom-3 z-[2] flex gap-1.5 sm:inset-x-4 sm:bottom-4">
          {slides.map((s, i) => (
            <span key={s.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/45 shadow-[0_1px_2px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <span
                key={i === index ? `run-${index}` : "idle"}
                className={cn(
                  "block h-full origin-left rounded-full bg-white",
                  i < index && "scale-x-100",
                  i > index && "scale-x-0",
                  i === index && (running ? "animate-[csBar_linear_forwards]" : "scale-x-100"),
                )}
                style={i === index && running ? { animationDuration: `${interval}ms` } : undefined}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- count-up number ------------------------------------------------------- */

/**
 * Counts a metric like "18.721", "26 Mio." or "26M" up from zero the first time it
 * scrolls into view. The server renders the final value (no layout shift, readable
 * without JS); reduced motion keeps it static.
 */
export function CountUp({ value, locale, duration = 1600, className }: { value: string; locale: Locale; duration?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    const m = value.match(/^([\d.,]+)(.*)$/);
    if (!node || !m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const digits = m[1].replace(locale === "en" ? /,/g : /\./g, "").replace(",", ".");
    const target = Number(digits);
    if (!Number.isFinite(target) || target === 0) return;
    const decimals = (digits.split(".")[1] ?? "").length;
    const suffix = m[2];
    const fmt = (n: number) => formatNumber(locale, n, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = fmt(p < 1 ? Math.round(target * eased * 10 ** decimals) / 10 ** decimals : target);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      node.textContent = fmt(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, locale, duration]);

  return (
    <span ref={el} className={cn("tabular-nums", className)}>
      {value}
    </span>
  );
}
