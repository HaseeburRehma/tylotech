"use client";

import { enableSnap, useLazySnap } from "@/lib/useLazySnap";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Review, ReviewData } from "@/lib/reviews";
import { Accent, Eyebrow } from "../branche/ui";
import { useLocale, useT } from "../i18n/LocaleProvider";
import { formatNumber } from "@/lib/i18n";

const AUTOPLAY_MS = 5500;
const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/* Google mark stays in its original colours (Figma "Brand/Google") */
function GoogleG({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className="shrink-0" aria-label="Google" role="img">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Stars({ n = 5, size = 17 }: { n?: number; size?: number }) {
  const t = useT();
  return (
    <span className="flex items-center gap-[3px]" aria-label={t(`${n} von 5 Sternen`, `${n} out of 5 stars`)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} style={{ width: size, height: size }} className={i < n ? "fill-[#d1aa71] text-[#d1aa71]" : "fill-[#e2e0dc] text-[#e2e0dc]"} strokeWidth={0} />
      ))}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/* Google's relative dates come in German (languageCode=de): "vor 2 Monaten" → "2 months ago".
   Anything not recognised is shown as it is. */
const REL_UNITS: Record<string, string> = {
  Minute: "minute", Minuten: "minute",
  Stunde: "hour", Stunden: "hour",
  Tag: "day", Tagen: "day",
  Woche: "week", Wochen: "week",
  Monat: "month", Monaten: "month",
  Jahr: "year", Jahren: "year",
};
function relativeDateEn(when: string) {
  const m = when.trim().match(/^vor (einer|einem|\d+) (\p{L}+)$/u);
  const unit = m && REL_UNITS[m[2]];
  if (!m || !unit) return when;
  const n = /^\d+$/.test(m[1]) ? Number(m[1]) : 1;
  return n === 1 ? `${unit === "hour" ? "an" : "a"} ${unit} ago` : `${n} ${unit}s ago`;
}

/* Figma "Review Card" */
function ReviewCard({ r }: { r: Review }) {
  const t = useT();
  return (
    <article className="flex h-full flex-col gap-4 rounded-[18px] border border-[#e2e0dc] bg-white px-7 py-[26px] shadow-[0_1px_2px_rgba(8,34,44,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-[#e2d2b4] hover:shadow-[0_22px_44px_-28px_rgba(8,34,44,0.35)]">
      <div className="flex items-center justify-between">
        <Stars n={r.rating} />
        <GoogleG size={20} />
      </div>
      {/* reviews come from Google in German — marked so screen readers pronounce them right */}
      <p lang="de" className="line-clamp-7 flex-1 text-[16px] leading-[26px] tracking-[-0.16px] text-[#5c5954]">{r.text}</p>
      <div className="flex items-center gap-3">
        {/* initials instead of Google profile photos: no request to Google from the visitor's browser */}
        {r.author ? (
          <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-[#eeedea] bg-[#fbf6ee] text-[13px] font-semibold text-[#94713f]">
            {initials(r.author)}
          </span>
        ) : (
          <span className="grid size-[38px] shrink-0 place-items-center rounded-full border border-[#eeedea] bg-white">
            <GoogleG size={17} />
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-px">
          <p className="truncate font-display text-[14px] font-medium leading-[18px] tracking-[-0.28px] text-[#1a1917]">{r.author ?? t("Google-Rezension", "Google review")}</p>
          <p className="text-[13px] leading-5 tracking-[-0.05px] text-[#7d7973]">
            {r.when ? t(r.when, relativeDateEn(r.when)) : t("Bewertung auf Google", "Review on Google")}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function KontaktBewertungen({ data }: { data: ReviewData }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();
  const track = useRef<HTMLDivElement>(null);
  useLazySnap(track);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth;
    const perView = Math.max(1, Math.round((el.clientWidth + 20) / step));
    setPages(Math.max(1, data.reviews.length - perView + 1));
    setPage(Math.min(data.reviews.length - 1, Math.round(el.scrollLeft / step)));
  }, [data.reviews.length]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const n = ((i % pages) + pages) % pages;
      const card = el.children[n] as HTMLElement | undefined;
      enableSnap(el);
      el.scrollTo({ left: card ? card.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft : 0, behavior: "smooth" });
      setPage(n);
      setTick((t) => t + 1);
    },
    [pages],
  );

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  const auto = pages > 1 && visible && !paused && !reduced;

  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => go(page + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [auto, page, tick, go]);

  useGSAP(
    () => {
      const st = { trigger: ".kb-grid", start: "top 80%", toggleActions: "play none none none" };
      gsap.from(".kb-summary > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: st });
      gsap.from(".kb-card", { x: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: st });
    },
    { scope: root },
  );

  const rating = formatNumber(locale, data.rating, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section id="bewertungen" ref={root} className="scroll-mt-20 overflow-hidden bg-page py-14 sm:py-24 lg:py-28">
      <Container className="kb-grid grid grid-cols-1 gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14 xl:gap-16">
        <div className="kb-summary flex flex-col items-start gap-6">
          <Eyebrow icon="star">{t("Google-Bewertungen", "Google reviews")}</Eyebrow>
          <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.625rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1a1917]">
            <Accent text={t("Was Kunden über _uns_ sagen.", "What clients say about _us_.")} />
          </h2>
          <div className="flex w-full items-center gap-5 rounded-[20px] border border-[#eeedea] bg-white p-5 shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)]">
            <span className="grid size-14 shrink-0 place-items-center rounded-[16px] border border-[#eeedea] bg-[#fbfaf9]">
              <GoogleG size={28} />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.03em] text-[#1a1917]">{rating}</span>
                <Stars n={Math.round(data.rating)} size={18} />
              </div>
              <span className="text-[13.5px] text-[#7d7973]">
                {t(`aus ${data.count} Bewertungen auf Google`, `from ${formatNumber(locale, data.count)} reviews on Google`)}
              </span>
            </div>
          </div>
          {locale === "en" && <p className="-mt-2 text-[13px] leading-[1.5] text-[#7d7973]">Reviews are shown in their original language (German).</p>}
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white/[0.72] px-[22px] text-[15px] font-medium text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-colors hover:bg-white"
          >
            {t("Alle Bewertungen ansehen", "See all reviews")}
            <ArrowUpRight className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.9} />
          </a>
        </div>

        <div
          className="flex min-w-0 flex-col gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <div
            ref={track}
            data-lenis-prevent-wheel
            role="region"
            aria-roledescription={t("Karussell", "carousel")}
            aria-label={t("Google-Bewertungen", "Google reviews")}
            className="-mx-6 flex data-[snap=on]:snap-x data-[snap=on]:snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {data.reviews.map((r, i) => (
              <div
                key={i}
                className="kb-card w-[86%] shrink-0 snap-start sm:w-[calc(50%-10px)]"
                role="group"
                aria-roledescription={t("Bewertung", "review")}
                aria-label={t(`${i + 1} von ${data.reviews.length}`, `${i + 1} of ${data.reviews.length}`)}
              >
                <ReviewCard r={r} />
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center gap-5">
              <div className="flex gap-2.5">
                {[
                  { I: ArrowLeft, d: -1, label: t("Vorherige Bewertung", "Previous review") },
                  { I: ArrowRight, d: 1, label: t("Nächste Bewertung", "Next review") },
                ].map(({ I, d, label }) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => go(page + d)}
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-[#e2e0dc] bg-white text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05)] transition-[background-color,border-color,color] duration-200 hover:border-[#d1aa71] hover:bg-[#fbf6ee] hover:text-[#94713f]"
                  >
                    <I className="size-[18px]" strokeWidth={1.9} />
                  </button>
                ))}
              </div>
              <div className="flex flex-1 items-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={t(`Zu Bewertung ${i + 1}`, `Go to review ${i + 1}`)}
                    aria-current={i === page}
                    className={cn("relative h-1.5 overflow-hidden rounded-full transition-[width,background-color] duration-300", i === page ? "w-12 bg-[#eeedea]" : "w-6 bg-[#e2e0dc] hover:bg-[#d6d3ce]")}
                  >
                    {i === page && (
                      <span
                        key={tick}
                        className="absolute inset-0 origin-left rounded-full bg-[#d1aa71]"
                        style={{ animation: auto ? `ktProgress ${AUTOPLAY_MS}ms linear both` : undefined, transform: auto ? undefined : "scaleX(1)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {!data.live && <span className="hidden text-[12.5px] text-[#a8a49d] sm:block">{t("Auszug aus unseren Google-Bewertungen", "A selection of our Google reviews")}</span>}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
