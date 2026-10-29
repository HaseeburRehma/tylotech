"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Award, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/lib/caseStudies";
import { Accent } from "../branche/ui";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { BrowserBar, CsEyebrow } from "./ui";

const AUTOPLAY_MS = 6000;

/* Figma "01 · Hero": title + "Website ansehen", project meta, and the website
   in a browser frame. The frame is a small carousel through the site's pages
   (arrows, dots, swipe, ←/→), autoplaying gently while it's on screen. */
export default function CaseHero({ c }: { c: CaseStudy }) {
  const locale = useLocale();
  const t = useT();
  const slides = c.hero.slides;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const frame = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), [slides.length]);

  // autoplay only while visible, not hovered/focused, and without reduced motion
  useEffect(() => {
    if (paused || !visible || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(i + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [i, paused, visible, go, slides.length]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    go(i + (e.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[88px]">
      {/* warm light, top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-60 left-[32%] h-[760px] w-[1180px] max-w-none"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(209,170,113,0.3) 0%, rgba(209,170,113,0.09) 45%, rgba(209,170,113,0) 100%)" }}
      />

      <Container className="relative flex flex-col gap-10 lg:gap-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <CsEyebrow icon={Award} className="intro-up">
              Case Study
            </CsEyebrow>
            <h1 className="t-h1 intro-up max-w-[760px] text-[#1a1917] [animation-delay:80ms]">
              <Accent text={c.hero.title[locale]} />
            </h1>
            <p className="t-body-xl intro-up max-w-[680px] text-[#5c5954] [animation-delay:160ms]">{c.hero.intro[locale]}</p>
          </div>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="intro-up group inline-flex h-12 w-fit shrink-0 items-center gap-2 rounded-full border-[1.5px] border-[#1a1917] bg-white px-[22px] t-button text-[#1a1917] transition-colors duration-200 [animation-delay:240ms] hover:bg-[#1a1917] hover:text-white lg:mb-1.5"
          >
            {t("Website ansehen", "Visit website")}
            <ArrowUpRight className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.8} />
          </a>
        </div>

        <dl className="intro-up grid grid-cols-1 gap-x-8 gap-y-5 border-t border-[#eeedea] pt-7 [animation-delay:300ms] sm:grid-cols-3">
          {c.hero.meta.map((m) => (
            <div key={m.label.de} className="flex min-w-0 flex-col gap-1.5">
              <dt className="eyebrow text-[#7d7973]">{m.label[locale]}</dt>
              <dd className="font-display text-[16px] font-medium leading-5 tracking-[-0.32px] text-[#1a1917]">{m.value[locale]}</dd>
            </div>
          ))}
        </dl>

        <div className="intro-slide [animation-delay:380ms]">
          <div
            ref={frame}
            role="region"
            aria-roledescription={t("Karussell", "carousel")}
            aria-label={t(`Website von ${c.client}`, `${c.client} website`)}
            tabIndex={0}
            onKeyDown={onKey}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="overflow-hidden rounded-2xl border border-[#e2e0dc] bg-white shadow-[0_8px_24px_rgba(26,23,20,0.06)] outline-none focus-visible:shadow-[0_0_0_3px_rgba(209,170,113,0.45)]"
          >
            <BrowserBar domain={c.domain} />
            <div
              className="relative aspect-[1280/762] touch-pan-y select-none overflow-hidden bg-[#f6f5f3]"
              onPointerDown={(e) => {
                drag.current = { x: e.clientX, y: e.clientY };
                e.currentTarget.setPointerCapture?.(e.pointerId);
              }}
              onPointerUp={(e) => {
                const d = drag.current;
                drag.current = null;
                if (!d) return;
                const dx = e.clientX - d.x;
                if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - d.y)) go(i + (dx < 0 ? 1 : -1));
              }}
              onPointerCancel={() => (drag.current = null)}
            >
              {slides.map((s, n) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.src}
                  src={s.src}
                  srcSet={n === 0 ? `${c.hero.slideSmall} 760w, ${s.src} ${s.w}w` : undefined}
                  sizes="(min-width: 1440px) 1280px, calc(100vw - 48px)"
                  width={s.w}
                  height={s.h}
                  alt={s.alt[locale]}
                  draggable={false}
                  fetchPriority={n === 0 ? "high" : undefined}
                  loading={n === 0 ? "eager" : "lazy"}
                  decoding="async"
                  aria-hidden={n !== i}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover object-top transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    n === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                  )}
                />
              ))}
            </div>
          </div>

          {slides.length > 1 && (
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="min-w-0 truncate t-body-s text-[#5c5954]" aria-live="polite">
                <span className="mr-2 font-mono text-[12px] text-[#94713f]">
                  {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                {slides[i].alt[locale]}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <div className="hidden items-center gap-1.5 sm:flex">
                  {slides.map((s, n) => (
                    <button
                      key={s.src}
                      type="button"
                      onClick={() => go(n)}
                      aria-label={t(`Bild ${n + 1} anzeigen`, `Show image ${n + 1}`)}
                      aria-current={n === i}
                      className="grid h-6 place-items-center px-0.5"
                    >
                      <span className={cn("block h-1.5 rounded-full transition-all duration-300", n === i ? "w-6 bg-[#c79a53]" : "w-1.5 bg-[#cbc8c2] hover:bg-[#a6a29b]")} />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  aria-label={t("Vorheriges Bild", "Previous image")}
                  className="grid size-11 place-items-center rounded-full border border-[#e2e0dc] bg-white text-[#1a1917] transition-colors hover:border-[#1a1917]"
                >
                  <ChevronLeft className="size-5" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => go(i + 1)}
                  aria-label={t("Nächstes Bild", "Next image")}
                  className="grid size-11 place-items-center rounded-full border border-[#e2e0dc] bg-white text-[#1a1917] transition-colors hover:border-[#1a1917]"
                >
                  <ChevronRight className="size-5" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

