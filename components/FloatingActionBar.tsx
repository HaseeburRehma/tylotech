"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarCheck2,
  ChartNoAxesColumnIncreasing,
  MessageSquareText,
  Star,
  UserRoundPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { FEED_URL, SAMPLE_EVENTS, agoLabel, type LiveEvent, type LiveKind } from "@/lib/liveFeed";

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

const STEP_MS = 4200;

/* ---- TyloHQ live ticker ------------------------------------------------- */
function LiveTicker() {
  const [events, setEvents] = useState<LiveEvent[]>(SAMPLE_EVENTS);
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [visitors, setVisitors] = useState(20);

  // optional real feed from TyloHQ
  useEffect(() => {
    const url = FEED_URL;
    if (!url) return;
    let alive = true;
    const load = () =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: LiveEvent[] | null) => {
          if (alive && Array.isArray(d) && d.length) setEvents(d);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // rotate messages
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setPrev(i);
      setI((n) => (n + 1) % events.length);
    }, STEP_MS);
    return () => clearTimeout(id);
  }, [i, paused, events.length]);

  // the live visitor count drifts a little so it feels live
  useEffect(() => {
    const base = events.find((e) => e.kind === "visitors")?.count ?? 20;
    const id = setInterval(() => {
      setVisitors((v) => Math.max(base - 6, Math.min(base + 6, v + Math.round((Math.random() - 0.45) * 3))));
    }, 2600);
    return () => clearInterval(id);
  }, [events]);

  const current = events[i % events.length];
  const Icon = ICONS[current.kind];

  const render = (e: LiveEvent) => {
    const title = e.kind === "visitors" ? `${visitors} ${e.title}` : e.title;
    const when = e.kind === "visitors" ? "jetzt" : agoLabel(e.minutesAgo);
    return (
      <span className="block min-w-0">
        <span className="block truncate font-display text-[13.5px] font-semibold leading-[18px] tracking-[-0.01em] text-white sm:text-[14.5px]">
          {title}
        </span>
        <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11.5px] leading-4 text-[#8cc0d1]">
          <span className="shrink-0 font-medium text-[#d8b682]">TyloHQ</span>
          <span className="size-[3px] shrink-0 rounded-full bg-[#8cc0d1]/50" />
          {e.detail && (
            <>
              <span className="truncate">{e.detail}</span>
              <span className="size-[3px] shrink-0 rounded-full bg-[#8cc0d1]/50" />
            </>
          )}
          <span className="shrink-0 tabular-nums">{when}</span>
        </span>
      </span>
    );
  };

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-3 sm:w-[350px] sm:flex-none lg:w-[390px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      {/* icon with progress ring + live dot */}
      <span className="relative grid size-[44px] shrink-0 place-items-center">
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="22" cy="22" r={RING_R} fill="none" stroke="rgba(127,186,205,0.18)" strokeWidth="1.5" />
          <circle
            key={`ring-${i}-${paused}`}
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
              animation: paused ? "none" : `liveRing ${STEP_MS}ms linear both`,
            }}
          />
        </svg>
        <span className="grid size-[34px] place-items-center rounded-full bg-gradient-to-b from-[#0e5a70] to-[#023646] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon
            key={`ic-${i}`}
            className={`size-[16px] animate-[hqfade_.45s_ease_both] text-[#e3c79e] ${current.kind === "review" ? "fill-[#e3c79e]" : ""}`}
            strokeWidth={1.75}
          />
        </span>
        {/* live dot */}
        <span className="absolute right-[1px] top-[1px] flex size-[11px] items-center justify-center rounded-full bg-[#002e3d]">
          <span className="absolute size-[7px] animate-ping rounded-full bg-[#3ccf8e] opacity-60" />
          <span className="relative size-[7px] rounded-full bg-[#3ccf8e]" />
        </span>
      </span>

      {/* message window */}
      <div className="relative h-[38px] min-w-0 flex-1 overflow-hidden">
        {prev !== null && events[prev] && (
          <div key={`out-${prev}-${i}`} className="absolute inset-0 flex items-center animate-[liveOut_.6s_cubic-bezier(.65,0,.35,1)_both]">
            {render(events[prev])}
          </div>
        )}
        <div key={`in-${i}`} className="absolute inset-0 flex items-center animate-[liveIn_.6s_cubic-bezier(.65,0,.35,1)_both]">
          {render(current)}
        </div>
      </div>
    </div>
  );
}

export default function FloatingActionBar() {
  const bar = useRef<HTMLDivElement>(null);

  // Slide in from below once the hero has scrolled away — a scroll-position
  // listener is more robust than a ScrollTrigger crossing (survives the tab
  // being backgrounded / rAF being frozen).
  useEffect(() => {
    gsap.set(bar.current, { yPercent: 160, opacity: 0 });
    let shown = false;
    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.75;
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
          href="#termin"
          aria-label="Erstgespräch buchen"
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
            Erstgespräch buchen
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-accent">
            <ArrowUpRight className="size-4 text-[#001620] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </div>
  );
}
