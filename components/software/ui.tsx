"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/* Shared bits of the software landing page (Figma "Software · Landing Page").
   Every CTA on the page jumps to the application form; SmoothScroll handles
   `#…` anchors with Lenis (offset for the sticky header). */

export const APPLY = "#bewerbung";

/** Section headline: Figma Heading/H2 42/47 on desktop, Mobile/Display/L 34/38 on phones. */
export const H2 = "t-h2 [--fs-m:34] [--lh-m:38] [--ls-m:-1.2] text-[#1a1917]";

/** Instrument Serif italic accent inside a headline (Figma: 45 on 42, 36 on 34). */
export function Serif({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={cn("t-serif tracking-[-0.02em]", dark ? "text-[#d8b682]" : "text-[#94713f]")}>{children}</span>;
}

/** Glass eyebrow pill with a Lucide line icon (Figma "Eyebrow", neutral variant). */
export function Eyebrow({ icon: I, children, dark = false, className }: { icon: LucideIcon; children: React.ReactNode; dark?: boolean; className?: string }) {
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

/** Centered section header (eyebrow, H2, optional subtitle). */
export function Head({
  icon,
  eyebrow,
  title,
  sub,
  dark = false,
  center = true,
  className,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("sw-head flex flex-col gap-[18px]", center ? "mx-auto items-center text-center" : "items-start", className)}>
      <Eyebrow icon={icon} dark={dark}>
        {eyebrow}
      </Eyebrow>
      <h2 className={cn(H2, dark && "text-white")}>{title}</h2>
      {sub && <p className={cn("t-body-l", dark ? "text-[#cbc8c2]" : "text-[#5c5954]")}>{sub}</p>}
    </div>
  );
}

const GOLD =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] text-[#0f0e0d] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)]";
const DARK =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,#17485b_0%,#04161d_100%)] text-white shadow-[0_6px_18px_rgba(4,22,29,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.16),inset_0_-1.5px_1.5px_rgba(0,0,0,0.3)]";
const OUTLINE = "border-[1.5px] border-[#1a1917] bg-white text-[#1a1917] hover:bg-[#f6f5f3]";

export const BTN = { gold: GOLD, dark: DARK, outline: OUTLINE } as const;
/** Large 58 · Medium 48 (Figma Button sizes) */
export const BTN_SIZE = { lg: "h-[58px] px-7 gap-2.5", md: "h-12 px-[22px] gap-2" } as const;
export const BTN_BASE =
  "group relative inline-flex items-center justify-center whitespace-nowrap rounded-full t-button transition-[filter,translate,background-color] duration-200 hover:brightness-110 active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d1aa71]/40";

/** "Jetzt bewerben" — every CTA on the page scrolls to the application form. */
export function ApplyButton({
  label,
  variant = "dark",
  size = "md",
  className,
}: {
  label: string;
  variant?: keyof typeof BTN;
  size?: keyof typeof BTN_SIZE;
  className?: string;
}) {
  return (
    <a href={APPLY} className={cn(BTN_BASE, BTN_SIZE[size], BTN[variant], className)}>
      {label}
      <ArrowRight className={cn("transition-transform duration-200 group-hover:translate-x-0.5", size === "lg" ? "size-5" : "size-[18px]")} strokeWidth={2} aria-hidden />
    </a>
  );
}
