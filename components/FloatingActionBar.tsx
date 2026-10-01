"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarCheck,
  Inbox,
  Search,
  Star,
  TrendingUp,
  Users,
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
  query: Search,
  visitors: Users,
  leads: Inbox,
  ranking: TrendingUp,
  booking: CalendarCheck,
  review: Star,
};

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

  const render = (e: LiveEvent) => {
    const Icon = ICONS[e.kind];
    const title = e.kind === "visitors" ? `${visitors} ${e.title}` : e.title;
    return (
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#01475c]/70 text-[#d8b682]">
          <Icon className="size-[15px]" strokeWidth={1.9} />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[12.5px] font-medium text-white sm:text-[13.5px]">{title}</span>
          <span className="block truncate text-[11px] text-[#7fbacd] sm:text-[11.5px]">
            {e.detail}
            {e.detail && " · "}
            {e.kind === "visitors" ? "jetzt" : agoLabel(e.minutesAgo)}
          </span>
        </span>
      </span>
    );
  };

  return (
    <div
      className="flex min-w-0 flex-1 items-center gap-3 sm:w-[360px] sm:flex-none lg:w-[410px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      {/* live badge */}
      <span className="hidden shrink-0 flex-col items-center gap-1 sm:flex">
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3ccf8e] opacity-70" />
          <span className="relative size-2.5 rounded-full bg-[#3ccf8e]" />
        </span>
        <span className="font-mono text-[8.5px] font-medium uppercase tracking-[0.14em] text-[#7fbacd]">Live</span>
      </span>
      <span className="relative flex size-2 shrink-0 sm:hidden">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#3ccf8e] opacity-70" />
        <span className="relative size-2 rounded-full bg-[#3ccf8e]" />
      </span>

      {/* message window */}
      <div className="relative h-[40px] min-w-0 flex-1 overflow-hidden">
        {prev !== null && events[prev] && (
          <div key={`out-${prev}-${i}`} className="absolute inset-0 flex items-center animate-[liveOut_.55s_cubic-bezier(.4,0,.2,1)_both]">
            {render(events[prev])}
          </div>
        )}
        <div key={`in-${i}`} className="absolute inset-0 flex items-center animate-[liveIn_.55s_cubic-bezier(.22,1,.36,1)_both]">
          {render(events[i % events.length])}
        </div>
      </div>

      {/* label + progress to next message */}
      <span className="hidden h-full shrink-0 flex-col justify-center gap-1.5 lg:flex">
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#d8b682]">TyloHQ</span>
        <span className="h-[2px] w-12 overflow-hidden rounded-full bg-[#01475c]">
          <span
            key={`p-${i}-${paused}`}
            className="block h-full origin-left rounded-full bg-[#d8b682]"
            style={{
              animation: paused ? "none" : `liveProgress ${STEP_MS}ms linear both`,
              transform: paused ? "scaleX(0.5)" : undefined,
            }}
          />
        </span>
      </span>
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
        className="pointer-events-auto flex w-full max-w-[560px] items-center gap-3 rounded-full sm:w-auto sm:max-w-none sm:gap-3.5 border border-[#01475c] bg-[#002e3d] py-2 pl-4 pr-2 shadow-[0px_8px_16px_-4px_rgba(15,14,13,0.05),0px_32px_64px_-16px_rgba(15,14,13,0.10)]"
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
