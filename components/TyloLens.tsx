"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeEuro,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  Ellipsis,
  Globe,
  Hammer,
  House,
  LoaderCircle,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ScanSearch,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  UserPlus,
  UserRound,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/contact";
import { TL_BRANCHEN, TL_BRANCHEN_EN, TL_BUDGETS, TL_ZIELE, TL_ZIELE_EN, normalizeWebsite, trackLens, validateLens, type TlErrors } from "@/lib/tylolens";
import { useLocale, useLocalePath, useT } from "@/components/i18n/LocaleProvider";

/* TyloLens (dev brief + TyloLens_Tool.html): scroll-triggered lead modal, two steps.
   - opens automatically at ~55 % scroll depth, once per session, never after a manual close
   - also opens from the gold "TyloLens" menu item (event "tylolens:open") and the floating button
   - step 1: website, Branche, Ziel, Budget · step 2: Name, E-Mail — the same six fields as the brief */

const SS_AUTO = "tylolens-auto-shown";
const SS_DISMISSED = "tylolens-dismissed";
const LS_SENT = "tylolens-submitted";
const LS_NEVER = "tylolens-never"; // "Nicht mehr anzeigen"
const NO_AUTO = ["/kontakt", "/impressum", "/datenschutz", "/en/contact", "/en/imprint", "/en/privacy"];

const store = {
  get: (s: Storage | undefined, k: string) => {
    try {
      return s?.getItem(k) ?? null;
    } catch {
      return null;
    }
  },
  set: (s: Storage | undefined, k: string, v: string) => {
    try {
      s?.setItem(k, v);
    } catch {
      /* storage blocked — flags just won't persist */
    }
  },
};
const ss = () => (typeof window === "undefined" ? undefined : window.sessionStorage);
const ls = () => (typeof window === "undefined" ? undefined : window.localStorage);

type Lenisish = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: Lenisish }).__lenis;

const field =
  "h-11 w-full rounded-[12px] border-[1.5px] bg-white px-3.5 text-[15px] text-[#17252B] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-[#9aa7ab] hover:border-[#c9d3d5] focus:border-[#D4A863] focus:shadow-[0_0_0_4px_rgba(212,168,99,0.18)]";
const GOLD_BTN =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)]";
const HEAD_BG =
  "radial-gradient(70% 90% at 100% 0%, rgba(209,170,113,0.30), rgba(209,170,113,0.06) 55%, transparent 75%), radial-gradient(60% 70% at 0% 100%, rgba(29,115,145,0.30), transparent 70%), linear-gradient(155deg, #0a4157 0%, #002e3d 48%, #001b26 100%)";

const EMPTY = { website: "", branche: "", ziel: "", budget: "", name: "", email: "", company: "" };
const STEP1 = ["website", "branche", "ziel", "budget"] as const;
const STEP2 = ["name", "email"] as const;

const BRANCHE_ICON: Record<string, LucideIcon> = {
  Handwerk: Hammer,
  "Lokaler Dienstleister": MapPin,
  "E-Commerce": ShoppingCart,
  "B2B-Dienstleistung": Building2,
  "Finanz & Investment": TrendingUp,
  "Gesundheit / Praxis": Stethoscope,
  Immobilien: House,
  Sonstiges: Ellipsis,
};
const ZIEL_ICON: Record<string, LucideIcon> = {
  "Mehr Anfragen / Leads": MessageCircle,
  "Bessere Google-Rankings": Search,
  "Mehr Umsatz": BadgeEuro,
  "Personal finden": UserPlus,
  "Marke aufbauen": Sparkles,
};

export default function TyloLens() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useT();
  const lp = useLocalePath();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<TlErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "limited">("idle");
  const [fab, setFab] = useState(false);
  const openedAt = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const show = useCallback((source: "scroll" | "menu" | "fab") => {
    if (openRef.current) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    openRef.current = true;
    openedAt.current = Date.now();
    setOpen(true);
    trackLens("tylolens_shown", { source });
  }, []);

  const close = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    if (statusRef.current !== "sent") {
      store.set(ss(), SS_DISMISSED, "1");
      trackLens("tylolens_dismissed");
    }
    lastFocus.current?.focus?.();
  }, []);

  /* menu item / any other trigger */
  useEffect(() => {
    const h = (e: Event) => show(((e as CustomEvent).detail?.source as "menu") ?? "menu");
    window.addEventListener("tylolens:open", h);
    return () => window.removeEventListener("tylolens:open", h);
  }, [show]);

  /* scroll trigger at ~55 % depth (behaviour-based, not time-based), once per session */
  useEffect(() => {
    if (NO_AUTO.includes(pathname)) return;
    const blocked = () => !!(store.get(ss(), SS_AUTO) || store.get(ss(), SS_DISMISSED) || store.get(ls(), LS_SENT) || store.get(ls(), LS_NEVER));
    if (blocked()) return;
    // Never interrupt a jump: a click on an in-page link (menu, CTA) scrolls
    // smoothly past 55 %, so those scrolls don't count, and the check only
    // runs once scrolling has paused.
    let jumpUntil = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href*="#"]')) jumpUntil = Date.now() + 3000;
    };
    const onHash = () => {
      jumpUntil = Date.now() + 3000;
    };
    const check = () => {
      if (openRef.current || blocked() || Date.now() < jumpUntil) return;
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct >= 0.55) {
        store.set(ss(), SS_AUTO, "1");
        show("scroll");
      }
    };
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(check, 450);
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(settle);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, show]);

  /* floating button: visible once the hero is passed, hidden over the footer and while the cookie notice is up */
  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const overFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
      const cookieDecided = !!store.get(ls(), "tt-cookie-consent");
      setFab(window.scrollY > window.innerHeight * 0.6 && !overFooter && cookieDecided);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* while open: pause page scroll, focus first field, ESC + focus trap */
  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      if (statusRef.current === "sent") dialog.current?.querySelector<HTMLElement>("button")?.focus();
      else firstField.current?.focus({ preventScroll: true });
    }, 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return; // e.g. an open dropdown consumed Escape
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const f = [...dialog.current.querySelectorAll<HTMLElement>("button, input, a[href]")].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null && el.tabIndex !== -1);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      lenis()?.start();
    };
  }, [open, close]);

  const setValue = (k: keyof typeof EMPTY, value: string) => {
    const next = { ...v, [k]: value };
    setV(next);
    const picked = k === "branche" || k === "ziel" || k === "budget";
    if (picked) setTouched((t) => ({ ...t, [k]: true }));
    if (touched[k] || picked) setErrors(validateLens(next, locale));
  };
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setValue(k, e.target.value);
  // Only check a typed field on blur once something was entered — an error appearing for an
  // empty field would shift the layout under the pointer and swallow the click that caused the blur.
  const blur = (k: keyof typeof EMPTY) => () => {
    if (!v[k].trim()) return;
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateLens(v, locale));
  };
  const err = (k: keyof TlErrors) => (touched[k] ? errors[k] : undefined);

  function next(e?: React.FormEvent) {
    e?.preventDefault();
    const errs = validateLens(v, locale);
    setErrors(errs);
    setTouched((t) => ({ ...t, website: true, branche: true, ziel: true, budget: true }));
    const bad = STEP1.find((k) => errs[k]);
    if (bad) {
      document.getElementById(`tl-${bad}`)?.focus();
      return;
    }
    setStep(2);
    window.setTimeout(() => nameField.current?.focus({ preventScroll: true }), 80);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLens(v, locale);
    setErrors(errs);
    setTouched({ website: true, branche: true, ziel: true, budget: true, name: true, email: true });
    if (STEP1.some((k) => errs[k])) {
      setStep(1);
      return;
    }
    const bad = STEP2.find((k) => errs[k]);
    if (bad) {
      document.getElementById(`tl-${bad}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/tylolens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, elapsed: Date.now() - openedAt.current, locale }),
      });
      const data: { ok?: boolean; reason?: string; errors?: TlErrors } = await res.json().catch(() => ({}));
      if (data.ok) {
        setStatus("sent");
        store.set(ls(), LS_SENT, "1");
        trackLens("tylolens_submitted", { budget: v.budget, branche: v.branche, ziel: v.ziel });
        window.setTimeout(() => dialog.current?.querySelector<HTMLElement>("button")?.focus(), 50);
        return;
      }
      if (data.reason === "invalid" && data.errors) {
        // the server answers in German — show our own message for each flagged field on /en
        const local = validateLens(v, locale);
        const srv = data.errors;
        setErrors(locale === "de" ? srv : Object.fromEntries(Object.entries(srv).map(([k, m]) => [k, local[k as keyof TlErrors] ?? m])));
        if (STEP1.some((k) => data.errors?.[k])) setStep(1);
        return setStatus("idle");
      }
      setStatus(data.reason === "rate-limited" ? "limited" : "error");
    } catch {
      setStatus("error");
    }
  }

  const brancheLabel = (b: string) => (locale === "en" ? (TL_BRANCHEN_EN[b as keyof typeof TL_BRANCHEN_EN] ?? b) : b);
  const zielLabel = (z: string) => (locale === "en" ? (TL_ZIELE_EN[z as keyof typeof TL_ZIELE_EN] ?? z) : z);
  const budgetOf = (value: string) => {
    const b = TL_BUDGETS.find((x) => x.value === value);
    return b ? t(b.label, b.labelEn) : "";
  };

  const mailto = () =>
    locale === "en"
      ? `mailto:${CONTACT.email}?subject=${encodeURIComponent("TyloLens analysis")}&body=${encodeURIComponent(
          [`Website: ${v.website}`, `Industry: ${brancheLabel(v.branche)}`, `Goal: ${zielLabel(v.ziel)}`, `Budget: ${budgetOf(v.budget)}`, `Name: ${v.name}`, `Email: ${v.email}`].join("\n"),
        )}`
      : `mailto:${CONTACT.email}?subject=${encodeURIComponent("TyloLens-Analyse")}&body=${encodeURIComponent(
          [`Website: ${v.website}`, `Branche: ${v.branche}`, `Ziel: ${v.ziel}`, `Budget: ${TL_BUDGETS.find((b) => b.value === v.budget)?.label ?? ""}`, `Name: ${v.name}`, `E-Mail: ${v.email}`].join("\n"),
        )}`;

  const first = v.name.trim().split(/\s+/)[0];
  const site = (normalizeWebsite(v.website) ?? v.website).replace(/^https?:\/\//, "");
  const budgetLabel = budgetOf(v.budget);

  const never = () => {
    store.set(ls(), LS_NEVER, "1");
    close();
  };

  const headTitle = "mt-4 font-display text-[clamp(1.45rem,4.6vw,1.9rem)] font-semibold leading-[1.13] tracking-[-0.03em] text-white";
  const accent = "font-[family-name:var(--font-instrument)] text-[1.08em] font-normal italic tracking-[-0.01em] text-[#D4A863]";
  const stepIn = "animate-[tlStepIn_.35s_cubic-bezier(.2,.8,.2,1)_both]";

  return (
    <>
      {/* floating trigger — pill on xl+, compact lens button above the live bar on smaller screens */}
      <button
        type="button"
        onClick={() => show("fab")}
        aria-label={t("TyloLens: Was würden wir anders machen?", "TyloLens: What would we do differently?")}
        className={cn(
          "group fixed z-[60] flex items-center rounded-full border border-[#D4A863]/45 bg-[#002E3D] text-left shadow-[0_24px_60px_-20px_rgba(0,20,28,0.55)] transition-[opacity,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#D4A863] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863]",
          "bottom-[92px] right-4 p-1.5 xl:bottom-[22px] xl:right-[22px] xl:gap-3 xl:py-2 xl:pl-2 xl:pr-5",
          fab && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-[#D4A863] text-[#002E3D]">
          <span className="absolute inset-0 rounded-full bg-[#D4A863]/50 motion-safe:animate-[bhlPulse_2.6s_ease-out_infinite]" />
          <ScanSearch className="relative size-[19px]" strokeWidth={2} />
        </span>
        <span className="hidden flex-col xl:flex">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.6px] text-[#D4A863]">{t("TyloLens · gratis", "TyloLens · free")}</span>
          <span className="font-display text-[14.5px] font-semibold leading-5 tracking-[-0.01em] text-white">{t("Was würden wir anders machen?", "What would we do differently?")}</span>
        </span>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-end justify-center bg-[rgba(0,20,28,0.55)] backdrop-blur-[3px] transition-opacity duration-[240ms] motion-reduce:transition-none sm:items-center sm:p-5",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-hidden={!open}
      >
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tl-title"
          data-lenis-prevent
          className={cn(
            "max-h-[96dvh] w-full overflow-y-auto overscroll-contain rounded-t-[24px] bg-white shadow-[0_12px_32px_rgba(8,34,44,0.1),0_40px_60px_rgba(8,34,44,0.06),0_80px_90px_rgba(8,34,44,0.04)] transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none sm:max-w-[560px] sm:rounded-[24px]",
            open ? "translate-y-0 scale-100 opacity-100" : "translate-y-full opacity-100 sm:translate-y-3 sm:scale-[0.96] sm:opacity-0",
          )}
        >
          {status !== "sent" ? (
            <>
              {/* header */}
              <div className="relative overflow-hidden px-5 pb-5 pt-3 sm:px-8 sm:pb-6 sm:pt-6" style={{ backgroundImage: HEAD_BG }}>
                <span aria-hidden className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-[7px] rounded-full border border-white/[0.18] bg-white/10 py-[6px] pl-2.5 pr-3 font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#cbc8c2] backdrop-blur-md sm:text-[11.5px]">
                    <ScanSearch className="size-3.5 text-[#D4A863]" strokeWidth={2} />
                    TyloLens
                    <span className="ml-1 rounded-full bg-[#D4A863] px-1.5 py-px text-[9.5px] font-semibold tracking-[0.3px] text-[#002E3D]">{t("Gratis", "Free")}</span>
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label={t("Schließen", "Close")}
                    className="-mr-1 -mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-white/[0.22] bg-[rgba(0,22,32,0.62)] text-white/80 transition-colors hover:bg-[rgba(0,22,32,0.85)] hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4A863] sm:size-10"
                  >
                    <X className="size-[18px]" strokeWidth={2} />
                  </button>
                </div>

                {step === 1 ? (
                  <div key="h1" className={stepIn}>
                    <h3 id="tl-title" className={headTitle}>
                      {t(
                        <>
                          Was würden wir bei dir <span className={accent}>anders machen?</span>
                        </>,
                        <>
                          What would we do <span className={accent}>differently?</span>
                        </>,
                      )}
                    </h3>
                    <p className="mt-2 hidden text-[14.5px] leading-[22px] tracking-[-0.1px] text-[#cbc8c2] sm:block">
                      {t(
                        "Unser Team schaut sich dein Marketing persönlich an und zeigt dir 3 konkrete Hebel.",
                        "Our team personally reviews your marketing and shows you 3 concrete levers.",
                      )}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-white/85 sm:hidden">
                      <Video className="size-3.5 text-[#D4A863]" strokeWidth={2} />
                      {t("3 Hebel als persönliches Video · in 48 h", "3 levers in a personal video · within 48 h")}
                    </p>
                    <ul className="mt-4 hidden flex-wrap gap-2 sm:flex">
                      {[
                        { I: Target, label: t("3 konkrete Hebel", "3 concrete levers") },
                        { I: Video, label: t("Persönliches Video", "Personal video") },
                        { I: Clock, label: t("In 48 Stunden", "Within 48 hours") },
                      ].map(({ I, label }) => (
                        <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[12.5px] font-medium text-white/90">
                          <I className="size-3.5 text-[#D4A863]" strokeWidth={2} />
                          {label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div key="h2" className={stepIn}>
                    <h3 id="tl-title" className={headTitle}>
                      {t(
                        <>
                          Wohin dürfen wir dein <span className={accent}>Video</span> schicken?
                        </>,
                        <>
                          Where should we send your <span className={accent}>video?</span>
                        </>,
                      )}
                    </h3>
                    <div className="mt-3 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async" src="/team/ilias-el-aradi.jpg" alt="" className="size-9 shrink-0 rounded-full object-cover object-top ring-2 ring-[#D4A863]/60" />
                      <p className="text-[13px] leading-[18px] text-white/80">
                        <span className="font-semibold text-white">Ilias El Aradi</span>{" "}
                        {t("& Team schauen persönlich drauf — kein Bot, keine Automatik.", "& team take a personal look — no bot, no automation.")}
                      </p>
                    </div>
                  </div>
                )}

                {/* progress */}
                <div className="mt-4 flex items-center gap-3 sm:mt-5" aria-label={t(`Schritt ${step} von 2`, `Step ${step} of 2`)}>
                  <div className="grid flex-1 grid-cols-2 gap-1.5">
                    {[1, 2].map((n) => (
                      <span key={n} className="h-1 overflow-hidden rounded-full bg-white/15">
                        <span className={cn("block h-full rounded-full bg-[#D4A863] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]", step >= n ? "translate-x-0" : "-translate-x-full")} />
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.4px] text-white/60">{t("Schritt", "Step")} {step} / 2</span>
                </div>
              </div>

              {/* honeypot */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="tl-company">{t("Firma", "Company")}</label>
                <input id="tl-company" tabIndex={-1} autoComplete="off" value={v.company} onChange={set("company")} />
              </div>

              {step === 1 ? (
                <form key="s1" onSubmit={next} noValidate className={cn(stepIn, "px-5 pb-4 pt-4 sm:px-8 sm:pb-6 sm:pt-5")}>
                  <Field id="website" label={t("Deine Website", "Your website")} error={err("website")}>
                    <Iconed icon={Globe}>
                      <input
                        ref={firstField}
                        id="tl-website"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        placeholder={t("deine-firma.de", "your-company.com")}
                        value={v.website}
                        onChange={set("website")}
                        onBlur={blur("website")}
                        aria-invalid={!!err("website")}
                        aria-describedby={err("website") ? "tl-website-err" : undefined}
                        className={cn(field, "pl-10", err("website") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                      />
                    </Iconed>
                  </Field>

                  <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-3">
                    <Field id="branche" label={t("Branche", "Industry")} error={err("branche")}>
                      <LensSelect id="branche" value={v.branche} onChange={(x) => setValue("branche", x)} invalid={!!err("branche")} icon={Building2} placeholder={t("Auswählen…", "Select…")} options={TL_BRANCHEN.map((b) => ({ value: b, label: brancheLabel(b), icon: BRANCHE_ICON[b] }))} />
                    </Field>
                    <Field id="ziel" label={t("Größtes Ziel", "Main goal")} error={err("ziel")}>
                      <LensSelect id="ziel" value={v.ziel} onChange={(x) => setValue("ziel", x)} invalid={!!err("ziel")} icon={Target} placeholder={t("Auswählen…", "Select…")} options={TL_ZIELE.map((z) => ({ value: z, label: zielLabel(z), icon: ZIEL_ICON[z] }))} />
                    </Field>
                  </div>

                  {/* budget — the lead qualifier, as selectable cards (radio group) */}
                  <fieldset className="mb-3.5 sm:mb-4">
                    <legend className="mb-1.5 flex w-full items-baseline justify-between gap-3 text-[13px] font-semibold text-[#17252B]">
                      {t("Marketing-Budget / Monat", "Marketing budget / month")}
                      <span className="hidden text-[11.5px] font-normal text-[#6C7A7E] sm:inline">{t("zeigt uns deinen größten Hebel", "shows us your biggest lever")}</span>
                    </legend>
                    <div id="tl-budget" tabIndex={-1} role="radiogroup" aria-invalid={!!err("budget")} aria-describedby={err("budget") ? "tl-budget-err" : undefined} className="grid grid-cols-2 gap-2 outline-none">
                      {TL_BUDGETS.map((b) => {
                        const on = v.budget === b.value;
                        return (
                          <label
                            key={b.value}
                            className={cn(
                              "relative flex h-11 cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-[12px] border-[1.5px] px-3 text-[13px] font-semibold tracking-[-0.1px] transition-[border-color,background-color,color,box-shadow] duration-150 has-[:focus-visible]:shadow-[0_0_0_4px_rgba(212,168,99,0.25)] sm:px-3.5 sm:text-[14px]",
                              on
                                ? "border-[#D4A863] bg-[#fbf6ee] text-[#7a5b30] shadow-[0_6px_16px_-10px_rgba(168,127,69,0.6)]"
                                : err("budget")
                                  ? "border-[#e5a29b] bg-white text-[#17252B]"
                                  : "border-[#DDE4E5] bg-white text-[#17252B] hover:border-[#c9d3d5]",
                            )}
                          >
                            <input type="radio" name="tl-budget" value={b.value} checked={on} onChange={() => setValue("budget", b.value)} className="sr-only" />
                            {t(b.label, b.labelEn)}
                            <span className={cn("grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors", on ? "border-[#D4A863] bg-[#D4A863] text-white" : "border-[#cfd8da]")}>
                              {on && <Check className="size-3" strokeWidth={3} />}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {err("budget") && <ErrLine id="tl-budget-err" msg={err("budget")!} />}
                  </fieldset>

                  <button
                    type="submit"
                    className={cn(
                      "group flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold tracking-[-0.1px] text-[#002E3D] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002E3D]",
                      GOLD_BTN,
                    )}
                  >
                    {t("Weiter", "Next")}
                    <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                  </button>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[12px] leading-[18px] text-[#6C7A7E]">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3 shrink-0" strokeWidth={2} />
                      {t("Dauert 30 Sekunden", "Takes 30 seconds")}
                    </span>
                    <span aria-hidden className="text-[#cfd8da]">·</span>
                    <button type="button" onClick={never} className="text-[#9aa7ab] underline-offset-2 hover:text-[#6C7A7E] hover:underline">
                      {t("Nicht mehr anzeigen", "Don't show again")}
                    </button>
                  </div>
                </form>
              ) : (
                <form key="s2" onSubmit={submit} noValidate className={cn(stepIn, "px-5 pb-5 pt-5 sm:px-8 sm:pb-6")}>
                  {/* what we'll analyse */}
                  <div className="mb-4 flex items-center gap-3 rounded-[14px] border border-[#DDE4E5] bg-[#EEF3F4]/70 p-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-white text-[#A8863A] shadow-[0_1px_2px_rgba(8,34,44,0.06)]">
                      <ScanSearch className="size-[18px]" strokeWidth={2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14.5px] font-semibold text-[#17252B]">{site}</p>
                      <p className="mt-0.5 truncate text-[12.5px] text-[#6C7A7E]">
                        {brancheLabel(v.branche)} · {zielLabel(v.ziel)} · {budgetLabel}
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="shrink-0 text-[12.5px] font-semibold text-[#A8863A] underline-offset-2 hover:underline">
                      {t("Ändern", "Change")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-x-3 min-[521px]:grid-cols-2">
                    <Field id="name" label={t("Name", "Name")} error={err("name")}>
                      <Iconed icon={UserRound}>
                        <input
                          ref={nameField}
                          id="tl-name"
                          type="text"
                          autoComplete="name"
                          maxLength={100}
                          placeholder={t("Vor- und Nachname", "First and last name")}
                          value={v.name}
                          onChange={set("name")}
                          onBlur={blur("name")}
                          aria-invalid={!!err("name")}
                          aria-describedby={err("name") ? "tl-name-err" : undefined}
                          className={cn(field, "pl-10", err("name") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                        />
                      </Iconed>
                    </Field>
                    <Field id="email" label={t("E-Mail", "Email")} error={err("email")}>
                      <Iconed icon={Mail}>
                        <input
                          id="tl-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={160}
                          placeholder={t("name@firma.de", "name@company.com")}
                          value={v.email}
                          onChange={set("email")}
                          onBlur={blur("email")}
                          aria-invalid={!!err("email")}
                          aria-describedby={err("email") ? "tl-email-err" : undefined}
                          className={cn(field, "pl-10", err("email") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                        />
                      </Iconed>
                    </Field>
                  </div>

                  {(status === "error" || status === "limited") && (
                    <div role="alert" className="mb-3 rounded-[12px] border border-[#ecd8b6] bg-[#fbf6ee] p-3 text-[13.5px] leading-[20px] text-[#5c4524]">
                      {status === "limited" ? (
                        <>
                          {t(
                            "Gerade kamen viele Anfragen von deinem Anschluss. Bitte versuch es in ein paar Minuten erneut.",
                            "We've just had a lot of requests from your connection. Please try again in a few minutes.",
                          )}
                        </>
                      ) : (
                        <>
                          {t("Das Senden hat gerade nicht geklappt.", "Sending didn't work just now.")}{" "}
                          <a href={mailto()} className="inline-flex items-center gap-1 font-semibold text-[#002E3D] underline underline-offset-2">
                            <Mail className="size-3.5" /> {t("Per E-Mail senden", "Send by email")}
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-1 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      aria-label={t("Zurück zu Schritt 1", "Back to step 1")}
                      className="grid size-[52px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#DDE4E5] bg-white text-[#17252B] transition-colors hover:border-[#c9d3d5] hover:bg-[#f6f8f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863]"
                    >
                      <ArrowLeft className="size-[18px]" strokeWidth={2} />
                    </button>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={cn(
                        "group flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full text-[15.5px] font-semibold tracking-[-0.1px] text-[#002E3D] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002E3D] sm:text-[16px]",
                        GOLD_BTN,
                      )}
                    >
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="size-[18px] animate-spin" strokeWidth={2.2} /> {t("Wird gesendet …", "Sending …")}
                        </>
                      ) : (
                        <>
                          {t("Meine Analyse anfordern", "Request my analysis")}
                          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[12px] leading-[18px] text-[#6C7A7E]">
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="size-3 shrink-0" strokeWidth={2} />
                      {t("Kein Newsletter, kein Spam.", "No newsletter, no spam.")}
                    </span>
                    <Link href={lp("/datenschutz")} target="_blank" className="underline underline-offset-2 hover:text-[#17252B]">
                      {t("Datenschutz", "Privacy")}
                    </Link>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div role="status" aria-live="polite">
              <div className="relative overflow-hidden px-6 pb-7 pt-4 text-center sm:px-8 sm:pt-8" style={{ backgroundImage: HEAD_BG }}>
                <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("Schließen", "Close")}
                  className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/[0.22] bg-[rgba(0,22,32,0.62)] text-white/80 transition-colors hover:bg-[rgba(0,22,32,0.85)] hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4A863] sm:right-5 sm:top-5"
                >
                  <X className="size-[18px]" strokeWidth={2} />
                </button>
                <svg viewBox="0 0 72 72" className="mx-auto size-[72px]" aria-hidden>
                  <circle cx="36" cy="36" r="33" fill="rgba(212,168,99,0.12)" stroke="#D4A863" strokeWidth="2" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.7s_ease-out_both]" />
                  <path d="M23 37.5 32 46.5 50 27" fill="none" stroke="#D4A863" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.45s_0.5s_ease-out_both]" />
                </svg>
                <h3 id="tl-title" className="mt-4 font-display text-[clamp(1.5rem,4.4vw,1.8rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
                  {t("Danke", "Thank you")}
                  {first ? (
                    <>
                      , <span className={accent}>{first}</span>
                    </>
                  ) : null}
                  !
                </h3>
                <p className="mx-auto mt-2.5 max-w-[36ch] text-[15px] leading-[24px] text-[#cbc8c2]">
                  {t(
                    <>
                      Unser Team schaut sich <span className="font-semibold text-white">{site || "deine Website"}</span> jetzt persönlich an.
                    </>,
                    <>
                      Our team is now taking a personal look at <span className="font-semibold text-white">{site || "your website"}</span>.
                    </>,
                  )}
                </p>
              </div>
              <div className="px-6 pb-7 pt-6 sm:px-8">
                <p className="mb-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.4px] text-[#6C7A7E]">{t("So geht es weiter", "What happens next")}</p>
                <ol className="relative flex flex-col gap-5">
                  <span aria-hidden className="absolute bottom-4 left-[17px] top-4 w-px bg-[linear-gradient(180deg,#D4A863,rgba(212,168,99,0.15))]" />
                  {[
                    {
                      I: ScanSearch,
                      when: t("Jetzt", "Now"),
                      text: t(`Wir analysieren ${site || "deine Website"}`, `We're analysing ${site || "your website"}`),
                      live: true,
                    },
                    {
                      I: Video,
                      when: t("Innerhalb von 48 Stunden", "Within 48 hours"),
                      text: t(
                        `Dein persönliches Video mit 3 konkreten Hebeln — per E-Mail an ${v.email || "dich"}`,
                        `Your personal video with 3 concrete levers — by email to ${v.email || "you"}`,
                      ),
                    },
                    { I: MessageCircle, when: t("Danach", "Then"), text: t("Wenn du willst, ein kurzes Gespräch. Du entscheidest.", "If you like, a short call — entirely up to you.") },
                  ].map(({ I, when, text, live }) => (
                    <li key={when} className="relative flex gap-3.5">
                      <span className={cn("relative grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] bg-white", live ? "border-[#D4A863] text-[#A8863A]" : "border-[#DDE4E5] text-[#6C7A7E]")}>
                        <I className="size-4" strokeWidth={2} />
                        {live && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-[#1E7A52] motion-safe:animate-pulse" />}
                      </span>
                      <span className="flex min-w-0 flex-col pt-0.5">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.3px] text-[#A8863A]">{when}</span>
                        <span className="break-words text-[14.5px] leading-[21px] text-[#17252B]">{text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={close}
                  className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#002E3D] text-[15px] font-semibold text-white transition-colors hover:bg-[#013a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863]"
                >
                  {t("Alles klar", "Got it")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---- pieces ---------------------------------------------------------------- */

function Iconed({ icon: I, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="relative">
      <I className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9aa7ab]" strokeWidth={1.9} />
      {children}
    </div>
  );
}

function ErrLine({ id, msg }: { id: string; msg: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-4 text-[#b42318]">
      <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={2} />
      {msg}
    </p>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 sm:mb-3.5">
      <label htmlFor={`tl-${id}`} className="mb-1.5 block text-[13px] font-semibold text-[#17252B]">
        {label}
      </label>
      {children}
      {error && <ErrLine id={`tl-${id}-err`} msg={error} />}
    </div>
  );
}

/**
 * Select-only combobox (WAI-ARIA pattern): focus stays on the trigger, the listbox is
 * rendered in a portal so the dialog never clips it, options are announced via
 * aria-activedescendant. Keys: ↑ ↓ Home End Enter Space Esc Tab, type-ahead by first letter.
 */
function LensSelect({
  id,
  value,
  onChange,
  invalid,
  icon: TriggerIcon,
  placeholder,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  icon: LucideIcon;
  placeholder: string;
  options: { value: string; label: string; icon: LucideIcon }[];
}) {
  const uid = useId().replace(/:/g, "");
  const listId = `tl-${id}-list-${uid}`;
  const optId = (i: number) => `tl-${id}-opt-${uid}-${i}`;
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean; maxH: number } | null>(null);
  const selected = options.findIndex((o) => o.value === value);
  const current = selected >= 0 ? options[selected] : null;
  const CurIcon = current?.icon ?? TriggerIcon;

  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const width = Math.max(r.width, 248);
    const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
    const full = Math.min(options.length * 42 + 12, 340);
    const below = window.innerHeight - r.bottom - 14;
    const above = r.top - 14;
    // open downwards whenever a comfortable list fits there; flip up only if below is tight
    const up = below < Math.min(full, 220) && above > below;
    const maxH = Math.max(140, Math.min(full, up ? above : below));
    setPos({ left, top: up ? r.top - maxH - 6 : r.bottom + 6, width, up, maxH });
  }, [options.length]);

  const openList = (at = selected >= 0 ? selected : 0) => {
    place();
    setActive(at);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  };

  useLayoutEffect(() => {
    if (!open || !list.current) return;
    list.current.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!trigger.current?.contains(e.target as Node) && !list.current?.contains(e.target as Node)) setOpen(false);
    };
    const reflow = () => place();
    document.addEventListener("mousedown", away);
    window.addEventListener("resize", reflow);
    const scroller = trigger.current?.closest("[role=dialog]");
    scroller?.addEventListener("scroll", reflow, { passive: true });
    return () => {
      document.removeEventListener("mousedown", away);
      window.removeEventListener("resize", reflow);
      scroller?.removeEventListener("scroll", reflow);
    };
  }, [open, place]);

  const onKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openList();
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        break;
      case "Escape":
        if (open) {
          e.preventDefault(); // keeps the modal open
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const i = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
          if (i >= 0) {
            if (!open) openList(i);
            else setActive(i);
          }
        }
    }
  };

  return (
    <>
      <button
        ref={trigger}
        id={`tl-${id}`}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optId(active) : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? `tl-${id}-err` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={cn(
          field,
          "relative flex items-center gap-2.5 pl-3 pr-9 text-left",
          open && "border-[#D4A863] shadow-[0_0_0_4px_rgba(212,168,99,0.18)]",
          invalid ? "border-[#e5a29b]" : !open && "border-[#DDE4E5]",
        )}
      >
        <CurIcon className={cn("size-4 shrink-0", current ? "text-[#A8863A]" : "text-[#9aa7ab]")} strokeWidth={1.9} />
        <span className={cn("min-w-0 flex-1 truncate text-[14px] sm:text-[15px]", !current && "text-[#9aa7ab]")}>{current?.label ?? placeholder}</span>
        <ChevronDown className={cn("pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6C7A7E] transition-transform duration-200", open && "rotate-180")} strokeWidth={1.8} />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-labelledby={`tl-${id}`}
            data-lenis-prevent
            style={{ left: pos.left, top: pos.top, width: pos.width, maxHeight: pos.maxH }}
            className={cn(
              "fixed z-[120] overflow-y-auto overscroll-contain rounded-[14px] border border-[#DDE4E5] bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(0,20,28,0.35),0_4px_12px_rgba(0,20,28,0.08)] animate-[tlDrop_.16s_cubic-bezier(.2,.8,.2,1)_both]",
              pos.up ? "origin-bottom" : "origin-top",
            )}
          >
            {options.map((o, i) => {
              const Ico = o.icon;
              const isSel = i === selected;
              return (
                <li
                  key={o.value}
                  id={optId(i)}
                  role="option"
                  aria-selected={isSel}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] transition-colors",
                    i === active && "bg-[#f4f1ea]",
                    isSel ? "font-semibold text-[#7a5b30]" : "text-[#17252B]",
                  )}
                >
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-[8px]", isSel ? "bg-[#D4A863] text-white" : "bg-[#EEF3F4] text-[#5b6b70]")}>
                    <Ico className="size-[15px]" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {isSel && <Check className="size-4 shrink-0 text-[#A8863A]" strokeWidth={2.4} />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}
