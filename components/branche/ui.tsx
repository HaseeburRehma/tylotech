"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  ChartColumn,
  ChartLine,
  CircleAlert,
  CircleHelp,
  Clock,
  Eye,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Hammer,
  Layers,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Target,
  TrendingUp,
  User,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Brand, IconName } from "@/lib/branchen";

/* ---- icons ---------------------------------------------------------------- */

const ICONS: Record<IconName, LucideIcon> = {
  hammer: Hammer,
  "map-pin": MapPin,
  globe: Globe,
  store: Store,
  briefcase: Briefcase,
  "shield-check": ShieldCheck,
  "chart-line": ChartLine,
  "git-branch": GitBranch,
  search: Search,
  users: Users,
  "message-circle": MessageCircle,
  clock: Clock,
  star: Star,
  monitor: Monitor,
  layers: Layers,
  eye: Eye,
  user: User,
  "circle-help": CircleHelp,
  megaphone: Megaphone,
  "refresh-cw": RefreshCw,
  "chart-column": ChartColumn,
  gauge: Gauge,
  "circle-alert": CircleAlert,
  workflow: Workflow,
  "trending-up": TrendingUp,
  award: Award,
  target: Target,
  mail: Mail,
  "file-text": FileText,
  sparkles: Sparkles,
};

export function Icon({ name, className, strokeWidth = 1.7 }: { name: IconName; className?: string; strokeWidth?: number }) {
  const I = ICONS[name];
  return <I className={className} strokeWidth={strokeWidth} aria-hidden />;
}

/* ---- brand logos (monochrome ones flip to white on dark surfaces) --------- */

const MONO: Brand[] = ["linkedin", "instagram", "youtube"];

export function BrandLogo({ brand, size = 28, dark = false, className }: { brand: Brand; size?: number; dark?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/brands/${brand}.svg`}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", dark && MONO.includes(brand) && "brightness-0 invert", className)}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}

/* ---- rich text: `_…_` → Instrument Serif italic accent -------------------- */

/** Figma line breaks: a real break from sm up, a normal space on phones. */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((l, i) => (
        <span key={i}>
          {l}
          {i < lines.length - 1 && (
            <>
              {" "}
              <br className="hidden sm:inline" />
            </>
          )}
        </span>
      ))}
    </>
  );
}

export function Accent({ text, dark = false }: { text: string; dark?: boolean }) {
  const parts = text.split(/(_[^_]+_)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("_") && p.endsWith("_") ? (
          <span
            key={i}
            className={cn(
              "t-serif md:tracking-[-0.02em]",
              dark ? "text-[#d8b682]" : "text-[#94713f]",
            )}
          >
            <Lines text={p.slice(1, -1)} />
          </span>
        ) : (
          <Lines key={i} text={p} />
        ),
      )}
    </>
  );
}

/* ---- eyebrow pill (glass) -------------------------------------------------- */

export function Eyebrow({ icon, children, dark = false, className }: { icon: IconName; children: React.ReactNode; dark?: boolean; className?: string }) {
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
      <Icon name={icon} className={cn("size-3.5 shrink-0", dark ? "text-[#d8b682]" : "text-[#c79a53]")} strokeWidth={1.8} />
      <span className="min-w-0">{children}</span>
    </p>
  );
}

/* ---- buttons --------------------------------------------------------------- */

export function GoldButton({ href, children, size = "lg", className }: { href: string; children: React.ReactNode; size?: "lg" | "md"; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full t-button text-[#0f0e0d] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px",
        size === "lg" ? "h-[58px] px-7" : "h-12 px-[22px]",
        "shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)]",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)]",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
    </Link>
  );
}

export function GlassButton({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-[58px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-[rgba(8,34,44,0.08)] bg-white/[0.72] px-7 t-button text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-colors duration-200 hover:bg-white",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
    </Link>
  );
}

/* ---- section heading ------------------------------------------------------- */

export function SectionHead({
  icon,
  eyebrow,
  title,
  sub,
  center = false,
  className,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  sub?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("bh-head flex flex-col gap-[18px]", center ? "mx-auto max-w-[780px] items-center text-center" : "max-w-[720px] items-start", className)}>
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <h2 className="t-h2 text-[#1a1917]">
        <Accent text={title} />
      </h2>
      {sub && <p className="t-body-l text-[#5c5954]">{sub}</p>}
    </div>
  );
}

/* ---- in-view hook (fires once) -------------------------------------------- */

export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView] as const;
}
