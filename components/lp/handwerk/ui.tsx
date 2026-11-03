"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Star, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/* Building blocks of the Handwerk landing page (Figma "Local Lead-Gen · Landing Page"). */

/** Every CTA on the page jumps to the analysis form in the hero. */
export const FORM = "#analyse";

/** Mono eyebrow on glass (Figma "Eyebrow"). */
export function Pill({ icon: I, children, dark = false, className }: { icon: LucideIcon; children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-[7px] rounded-full border py-[7px] pl-2.5 pr-3.5 eyebrow backdrop-blur-md",
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

/** Case line: starting point (red ×) or result (green ✓) — Figma "Beweis-Zeile". */
export function ProofRow({ kind, children }: { kind: "before" | "after"; children: React.ReactNode }) {
  const after = kind === "after";
  return (
    <li className={cn("t-body-m flex items-start gap-3", after ? "text-[#1a1917]" : "text-[#5c5954]")}>
      <span className={cn("mt-px grid size-6 shrink-0 place-items-center rounded-full", after ? "bg-[#e7f4ed]" : "bg-[#fceae8]")}>
        {after ? <Check className="size-[13px] text-[#1e7a52]" strokeWidth={2.4} aria-hidden /> : <X className="size-[13px] text-[#c0392b]" strokeWidth={2.4} aria-hidden />}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

export function Stars({ size = 17, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("flex gap-[3px]", className)} role="img" aria-label="5 von 5 Sternen">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="fill-[#d1aa71] text-[#d1aa71]" style={{ width: size, height: size }} strokeWidth={0} aria-hidden />
      ))}
    </span>
  );
}

/** Google "G" in its original colours (a tinted mark would undermine the proof). */
export function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Horizontal snap slider below lg (dots underneath, tap a dot to jump), a plain grid from lg up. */
export function SnapSlider({ children, className, label }: { children: React.ReactNode[]; className?: string; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const slides = Array.from(el.children) as HTMLElement[];
      const x = el.scrollLeft + el.clientWidth * 0.35;
      let i = 0;
      slides.forEach((s, n) => {
        if (s.offsetLeft <= x) i = n;
      });
      // at the very end the last card may never reach the left edge
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) i = slides.length - 1;
      setActive(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const s = el?.children[i] as HTMLElement | undefined;
    if (el && s) el.scrollTo({ left: s.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  };

  return (
    <div aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden",
          className,
        )}
      >
        {children.map((c, i) => (
          <div key={i} className="lp-slide flex w-[84%] max-w-[400px] shrink-0 snap-start sm:w-[58%] lg:w-auto lg:max-w-none [&>*]:w-full">
            {c}
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-1 lg:hidden">
        {children.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Karte ${i + 1} von ${children.length}`}
            aria-current={active === i}
            className="grid h-6 place-items-center px-1"
          >
            <span className={cn("block h-1.5 rounded-full transition-all duration-300", active === i ? "w-5 bg-[#b98f53]" : "w-1.5 bg-[#cbc8c2]")} />
          </button>
        ))}
      </div>
    </div>
  );
}
