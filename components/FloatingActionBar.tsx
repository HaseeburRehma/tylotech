"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  ChartNoAxesColumnIncreasing,
  MessageSquareText,
  Star,
  ShoppingBag,
  TrendingUp,
  UserRoundPlus,
  UsersRound,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { agoLabel, liveTitleEn, type LiveEvent, type LiveFeedResponse, type LiveKind } from "@/lib/liveFeed";
import { TICKER_MESSAGES, shuffledOrder, type TickerIcon } from "@/lib/tickerMessages";
import { useLocale, useLocalePath, useT } from "@/components/i18n/LocaleProvider";

const AVATARS = [
  { src: "/avatars/tt.png", alt: "Team TT" },
  { src: "/avatars/mk.png", alt: "Team MK" },
  { src: "/avatars/sa.png", alt: "Team SA" },
];

const ICONS: Record<LiveKind, LucideIcon> = {
  query: MessageSquareText,
  visitors: UsersRound,
  leads: UserRoundPlus,
  ranking: ChartNoAxesColumnIncreasing,
  booking: CalendarCheck2,
  review: Star,
};

// progress ring around the icon (r = 19 → circumference ≈ 119.4)
const RING_R = 19;
const RING_C = 2 * Math.PI * RING_R;


/* ---- live ticker -----------------------------------------------------------
 * Real TyloHQ events (authenticated feed) always win: each is shown exactly once,
 * with its true time. In between, the curated partner results from the Live Ticker
 * brief rotate — labelled as results, never with an invented "vor X Minuten". */
const POLL_MS = 30_000;
const SEEN_KEY = "tylohq-live-seen";
const RESULT_MS = 5000; // brief: next message every ~5 s

function loadSeen(): Set<string> {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}
function saveSeen(seen: Set<string>) {
  try {
    // keep the most recent 300 ids
    window.localStorage.setItem(SEEN_KEY, JSON.stringify([...seen].slice(-300)));
  } catch {}
}

const RESULT_ICONS: Record<TickerIcon, LucideIcon> = {
  leads: UserRoundPlus,
  query: MessageSquareText,
  growth: TrendingUp,
  ranking: ChartNoAxesColumnIncreasing,
  people: UsersRound,
  software: Code2,
  sale: ShoppingBag,
};

type Slide = { key: string; type: "event"; e: LiveEvent } | { key: string; type: "result"; i: number };

function LiveTicker() {
  const locale = useLocale();
  const t = useT();
  const [queue, setQueue] = useState<LiveEvent[]>([]);
  const [slide, setSlide] = useState<Slide | null>(null);
  const [outgoing, setOutgoing] = useState<Slide | null>(null);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [, setTick] = useState(0);
  const seen = useRef<Set<string>>(new Set());
  const order = useRef<number[]>([]);
  const lastResult = useRef(-1);
  const paused = hover || hidden;

  // pause the rotation while the tab is in the background (brief: save cycles)
  useEffect(() => {
    const onVis = () => setHidden(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // poll the authenticated server route; queue only events never shown before
  useEffect(() => {
    seen.current = loadSeen();
    let alive = true;
    const load = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const r = await fetch("/api/live-feed", { cache: "no-store" });
        if (!r.ok) return;
        const data = (await r.json()) as LiveFeedResponse;
        if (!alive || !Array.isArray(data.events)) return;
        setQueue((q) => {
          const queued = new Set(q.map((e) => e.id));
          const fresh = [...data.events].reverse().filter((e) => !seen.current.has(e.id) && !queued.has(e.id));
          return fresh.length ? [...q, ...fresh] : q;
        });
      } catch {}
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const nextResult = () => {
    if (!order.current.length) order.current = shuffledOrder(TICKER_MESSAGES.length, lastResult.current);
    const i = order.current.shift()!;
    lastResult.current = i;
    return i;
  };

  // advance every ~5 s: a waiting real event first, otherwise the next partner result
  useEffect(() => {
    if (paused) return;
    const advance = () => {
      let next: Slide;
      if (queue.length) {
        const [e, ...rest] = queue;
        seen.current.add(e.id);
        saveSeen(seen.current);
        setQueue(rest);
        next = { key: `e-${e.id}`, type: "event", e };
      } else {
        const i = nextResult();
        next = { key: `r-${i}-${Date.now()}`, type: "result", i };
      }
      setOutgoing(slide);
      setSlide(next);
    };
    const id = setTimeout(advance, slide ? RESULT_MS : 600);
    return () => clearTimeout(id);
  }, [slide, paused, queue]);

  // keep "vor X Min." of a real event honest while it stays on screen
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const isEvent = slide?.type === "event";
  const Icon = !slide ? Activity : slide.type === "event" ? ICONS[slide.e.kind] : RESULT_ICONS[TICKER_MESSAGES[slide.i].icon];

  const render = (sl: Slide | null) => {
    if (!sl)
      return (
        <span className="block min-w-0">
          <span className="block truncate font-display text-[13.5px] font-semibold leading-[18px] tracking-[-0.01em] text-white sm:text-[14.5px]">TyloTech</span>
          <span className="mt-0.5 block truncate text-[11.5px] leading-4 text-[#8cc0d1]">{t("Ergebnisse unserer Partner", "Results from our partners")}</span>
        </span>
      );
    if (sl.type === "result")
      return (
        <span className="block min-w-0">
          <span className="block truncate font-display text-[13.5px] font-semibold leading-[18px] tracking-[-0.01em] text-white sm:text-[14.5px]">
            {t(TICKER_MESSAGES[sl.i].text, TICKER_MESSAGES[sl.i].textEn)}
          </span>
          <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11.5px] leading-4 text-[#8cc0d1]">
            <span className="shrink-0 font-medium text-[#d8b682]">TyloTech</span>
            <span className="size-[3px] shrink-0 rounded-full bg-[#8cc0d1]/50" />
            <span className="truncate">
              {t(TICKER_MESSAGES[sl.i].time ?? "Ergebnis aus Partnerprojekten", TICKER_MESSAGES[sl.i].timeEn ?? "Result from partner projects")}
            </span>
          </span>
        </span>
      );
    const e = sl.e;
    return (
      <span className="block min-w-0">
        <span className="block truncate font-display text-[13.5px] font-semibold leading-[18px] tracking-[-0.01em] text-white sm:text-[14.5px]">{locale === "en" ? liveTitleEn(e) : e.title}</span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11.5px] leading-4 text-[#8cc0d1]">
          <span className="shrink-0 font-medium text-[#d8b682]">Live · TyloHQ</span>
          <span className="size-[3px] shrink-0 rounded-full bg-[#8cc0d1]/50" />
          {e.detail && (
            <>
              <span className="truncate">{e.detail}</span>
              <span className="size-[3px] shrink-0 rounded-full bg-[#8cc0d1]/50" />
            </>
          )}
          <span className="shrink-0 tabular-nums">{agoLabel(e.occurredAt, undefined, locale)}</span>
        </span>
      </span>
    );
  };

  const key = slide?.key ?? "idle";

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-3 sm:w-[350px] sm:flex-none lg:w-[390px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-live="polite"
    >
      {/* icon with progress ring + status dot (green pulse only for real live events) */}
      <span className="relative grid size-[44px] shrink-0 place-items-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="22" cy="22" r={RING_R} fill="none" stroke="rgba(127,186,205,0.18)" strokeWidth="1.5" />
          {slide && (
            <circle
              key={`ring-${key}-${paused}`}
              cx="22"
              cy="22"
              r={RING_R}
              fill="none"
              stroke="#d8b682"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              style={{
                strokeDashoffset: paused ? RING_C * 0.35 : undefined,
                animation: paused ? "none" : `liveRing ${RESULT_MS}ms linear both`,
              }}
            />
          )}
        </svg>
        <span className="grid size-[34px] place-items-center rounded-full bg-gradient-to-b from-[#0e5a70] to-[#023646] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon key={`ic-${key}`} className={`size-[16px] animate-[hqfade_.45s_ease_both] text-[#e3c79e] ${isEvent && slide.e.kind === "review" ? "fill-[#e3c79e]" : ""}`} strokeWidth={1.75} />
        </span>
        <span className="absolute right-[1px] top-[1px] flex size-[11px] items-center justify-center rounded-full bg-[#002e3d]">
          {isEvent ? (
            <>
              <span className="absolute size-[7px] animate-ping rounded-full bg-[#3ccf8e] opacity-60" />
              <span className="relative size-[7px] rounded-full bg-[#3ccf8e]" />
            </>
          ) : (
            <span className="relative size-[7px] rounded-full bg-[#d8b682]" />
          )}
        </span>
      </span>

      {/* message window — fade-out / fade-in, single line with ellipsis */}
      <div className="relative h-[38px] min-w-0 flex-1 overflow-hidden">
        {outgoing && (
          <div key={`out-${outgoing.key}-${key}`} className="absolute inset-0 flex items-center animate-[liveOut_.6s_cubic-bezier(.65,0,.35,1)_both]">
            {render(outgoing)}
          </div>
        )}
        <div key={`in-${key}`} className="absolute inset-0 flex items-center animate-[liveIn_.6s_cubic-bezier(.65,0,.35,1)_both]">
          {render(slide)}
        </div>
      </div>
    </div>
  );
}

export default function FloatingActionBar() {
  const bar = useRef<HTMLDivElement>(null);
  const t = useT();
  const lp = useLocalePath();

  // Slide in from below once the hero has scrolled away — a scroll-position
  // listener is more robust than a ScrollTrigger crossing (survives the tab
  // being backgrounded / rAF being frozen).
  useEffect(() => {
    gsap.set(bar.current, { yPercent: 160, opacity: 0 });
    let shown = false;
    const onScroll = () => {
      // visible after the hero, but step aside once the footer is on screen so
      // it never covers contact details, legal links or the copyright line
      const footerTop = document.querySelector("footer")?.getBoundingClientRect().top ?? Infinity;
      const show = window.scrollY > window.innerHeight * 0.75 && footerTop > window.innerHeight - 40;
      if (show === shown) return;
      shown = show;
      gsap.to(bar.current, {
        yPercent: show ? 0 : 160,
        opacity: show ? 1 : 0,
        duration: 0.6,
        ease: show ? "power3.out" : "power2.in",
        overwrite: true,
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div
        ref={bar}
        className="pointer-events-auto flex w-full max-w-[560px] items-center gap-3 rounded-full sm:w-auto sm:max-w-none sm:gap-3.5 border border-[#01475c] bg-[#002e3d] py-1.5 pl-2 pr-1.5 shadow-[0px_8px_16px_-4px_rgba(15,14,13,0.05),0px_32px_64px_-16px_rgba(15,14,13,0.10)]"
      >
        <LiveTicker />

        {/* Divider */}
        <span className="hidden h-7 w-px bg-[#01475c] sm:block" />

        {/* Termin pill */}
        <Link
          href={lp("/kontakt")}
          aria-label={t("Erstgespräch buchen", "Book an intro call")}
          className="group flex h-11 shrink-0 items-center gap-3 rounded-full bg-white pl-1.5 pr-1.5 sm:pl-2"
        >
          <span className="hidden items-center sm:flex">
            {AVATARS.map((a, i) => (
              <span
                key={a.src}
                className="relative size-[30px] rounded-full border-2 border-white"
                style={{ marginRight: i < AVATARS.length - 1 ? -11 : 0, zIndex: 3 - i }}
              >
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  sizes="30px"
                  className="rounded-full object-cover"
                />
              </span>
            ))}
          </span>
          <span className="hidden text-[14.5px] font-medium text-ink sm:inline">
            {t("Erstgespräch buchen", "Book an intro call")}
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-accent">
            <ArrowUpRight className="size-4 text-[#001620] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </div>
  );
}
