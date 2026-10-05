"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, ChevronDown, CircleAlert, Clock, Globe, LoaderCircle, Lock, Mail, MessageCircle, ScanSearch, Target, UserRound, Video, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { CONTACT } from "@/lib/contact";
import { TL_BRANCHEN, TL_BUDGETS, TL_ZIELE, normalizeWebsite, trackLens, validateLens, type TlErrors } from "@/lib/tylolens";

/* TyloLens (dev brief + TyloLens_Tool.html): scroll-triggered lead modal.
   - opens automatically at ~55 % scroll depth, once per session, never after a manual close
   - also opens from the gold "TyloLens" menu item (event "tylolens:open") and the floating button
   - six fields, budget is the lead qualifier; success state without redirect */

const SS_AUTO = "tylolens-auto-shown";
const SS_DISMISSED = "tylolens-dismissed";
const LS_SENT = "tylolens-submitted";
const LS_NEVER = "tylolens-never"; // "Nicht mehr anzeigen"
const NO_AUTO = ["/kontakt", "/impressum", "/datenschutz"];

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

export default function TyloLens() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<TlErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "limited">("idle");
  const [fab, setFab] = useState(false);
  const openedAt = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
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
    const onScroll = () => {
      if (openRef.current || blocked()) return;
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct >= 0.55) {
        store.set(ss(), SS_AUTO, "1");
        show("scroll");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, show]);

  /* floating button: visible once the hero is passed, hidden over the footer */
  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      const overFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
      setFab(window.scrollY > window.innerHeight * 0.6 && !overFooter);
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
    const t = window.setTimeout(() => (statusRef.current === "sent" ? dialog.current?.querySelector<HTMLElement>("button") : firstField.current)?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialog.current) return;
      const f = [...dialog.current.querySelectorAll<HTMLElement>("button, input, select, a[href]")].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
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

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched[k]) setErrors(validateLens(next));
  };
  // Only check a field on blur once something was typed — an error appearing for an empty
  // field would shift the layout under the pointer and swallow the click that caused the blur.
  const blur = (k: keyof typeof EMPTY) => () => {
    if (!v[k].trim()) return;
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validateLens(v));
  };
  const err = (k: keyof TlErrors) => (touched[k] ? errors[k] : undefined);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateLens(v);
    setErrors(errs);
    setTouched({ website: true, branche: true, ziel: true, budget: true, name: true, email: true });
    const firstBad = Object.keys(errs)[0];
    if (firstBad) {
      document.getElementById(`tl-${firstBad}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/tylolens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, elapsed: Date.now() - openedAt.current }),
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
        setErrors(data.errors);
        return setStatus("idle");
      }
      setStatus(data.reason === "rate-limited" ? "limited" : "error");
    } catch {
      setStatus("error");
    }
  }

  const mailto = () =>
    `mailto:${CONTACT.email}?subject=${encodeURIComponent("TyloLens-Analyse")}&body=${encodeURIComponent(
      [`Website: ${v.website}`, `Branche: ${v.branche}`, `Ziel: ${v.ziel}`, `Budget: ${TL_BUDGETS.find((b) => b.value === v.budget)?.label ?? ""}`, `Name: ${v.name}`, `E-Mail: ${v.email}`].join("\n"),
    )}`;

  const first = v.name.trim().split(/\s+/)[0];
  const site = (normalizeWebsite(v.website) ?? v.website).replace(/^https?:\/\//, "");

  const never = () => {
    store.set(ls(), LS_NEVER, "1");
    close();
  };

  return (
    <>
      {/* floating trigger (manual open) — xl+, where it can't collide with the live bar */}
      <button
        type="button"
        onClick={() => show("fab")}
        aria-label="TyloLens: Was würden wir anders machen?"
        className={cn(
          "group fixed bottom-[22px] right-[22px] z-[60] hidden items-center gap-3 rounded-full border border-[#D4A863]/45 bg-[#002E3D] py-2 pl-2 pr-5 text-left shadow-[0_24px_60px_-20px_rgba(0,20,28,0.55)] transition-[opacity,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#D4A863] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863] xl:flex",
          fab && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <span className="relative grid size-10 place-items-center rounded-full bg-[#D4A863] text-[#002E3D]">
          <span className="absolute inset-0 rounded-full bg-[#D4A863]/50 motion-safe:animate-[bhlPulse_2.6s_ease-out_infinite]" />
          <ScanSearch className="relative size-[19px]" strokeWidth={2} />
        </span>
        <span className="flex flex-col">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.6px] text-[#D4A863]">TyloLens · gratis</span>
          <span className="font-display text-[14.5px] font-semibold leading-5 tracking-[-0.01em] text-white">Was würden wir anders machen?</span>
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
            "max-h-[94vh] w-full overflow-y-auto overscroll-contain rounded-t-[24px] bg-white shadow-[0_12px_32px_rgba(8,34,44,0.1),0_40px_60px_rgba(8,34,44,0.06),0_80px_90px_rgba(8,34,44,0.04)] transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none sm:max-w-[560px] sm:rounded-[24px]",
            open ? "translate-y-0 scale-100 opacity-100" : "translate-y-full opacity-100 sm:translate-y-3 sm:scale-[0.96] sm:opacity-0",
          )}
        >
          {status !== "sent" ? (
            <>
              {/* header */}
              <div className="relative overflow-hidden px-6 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-6" style={{ backgroundImage: HEAD_BG }}>
                <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-[7px] rounded-full border border-white/[0.18] bg-white/10 py-[7px] pl-2.5 pr-3.5 font-mono text-[11.5px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#cbc8c2] backdrop-blur-md">
                    <ScanSearch className="size-3.5 text-[#D4A863]" strokeWidth={2} />
                    TyloLens
                    <span className="ml-1 rounded-full bg-[#D4A863] px-1.5 py-px text-[9.5px] font-semibold tracking-[0.3px] text-[#002E3D]">Gratis</span>
                  </span>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Schließen"
                    className="-mr-1 -mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-white/[0.22] bg-[rgba(0,22,32,0.62)] text-white/80 transition-colors hover:bg-[rgba(0,22,32,0.85)] hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4A863]"
                  >
                    <X className="size-[18px]" strokeWidth={2} />
                  </button>
                </div>
                <h3 id="tl-title" className="mt-4 font-display text-[clamp(1.55rem,4.6vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
                  Was würden wir bei dir{" "}
                  <span className="font-[family-name:var(--font-instrument)] text-[1.08em] font-normal italic tracking-[-0.01em] text-[#D4A863]">anders machen?</span>
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[23px] tracking-[-0.1px] text-[#cbc8c2]">
                  Unser Team schaut sich dein Marketing persönlich an und zeigt dir 3 konkrete Hebel — als kurzes Video, kostenlos, in 48 Stunden.
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {[
                    { I: Target, t: "3 konkrete Hebel" },
                    { I: Video, t: "Persönliches Video" },
                    { I: Clock, t: "In 48 Stunden" },
                  ].map(({ I, t }) => (
                    <li key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[12.5px] font-medium text-white/90">
                      <I className="size-3.5 text-[#D4A863]" strokeWidth={2} />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-3.5 flex items-center gap-3 border-t border-white/10 pt-3 [@media(min-width:640px)_and_(max-height:900px)]:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/team/ilias-el-aradi.jpg" alt="" className="size-9 shrink-0 rounded-full object-cover object-top ring-2 ring-[#D4A863]/60" />
                  <p className="text-[13px] leading-[18px] text-white/80">
                    Persönlich von <span className="font-semibold text-white">Ilias El Aradi</span> & Team —<br className="hidden sm:inline" /> kein Bot, keine Automatik.
                  </p>
                </div>
              </div>

              {/* form */}
              <form onSubmit={submit} noValidate className="px-6 pb-5 pt-5 sm:px-8">
                {/* honeypot */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="tl-company">Firma</label>
                  <input id="tl-company" tabIndex={-1} autoComplete="off" value={v.company} onChange={set("company")} />
                </div>

                <Field id="website" label="Deine Website" error={err("website")}>
                  <Iconed icon={Globe}>
                    <input
                      ref={firstField}
                      id="tl-website"
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="deine-firma.de"
                      value={v.website}
                      onChange={set("website")}
                      onBlur={blur("website")}
                      aria-invalid={!!err("website")}
                      aria-describedby={err("website") ? "tl-website-err" : undefined}
                      className={cn(field, "pl-10", err("website") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                    />
                  </Iconed>
                </Field>

                <div className="grid grid-cols-1 gap-x-3 min-[521px]:grid-cols-2">
                  <Field id="branche" label="Branche" error={err("branche")}>
                    <Select id="branche" value={v.branche} onChange={set("branche")} onBlur={blur("branche")} invalid={!!err("branche")} options={TL_BRANCHEN.map((b) => ({ value: b, label: b }))} />
                  </Field>
                  <Field id="ziel" label="Dein größtes Ziel" error={err("ziel")}>
                    <Select id="ziel" value={v.ziel} onChange={set("ziel")} onBlur={blur("ziel")} invalid={!!err("ziel")} options={TL_ZIELE.map((z) => ({ value: z, label: z }))} />
                  </Field>
                </div>

                {/* budget — the lead qualifier, as selectable cards (radio group) */}
                <fieldset className="mb-3.5">
                  <legend className="mb-1.5 flex w-full items-baseline justify-between gap-3 text-[13px] font-semibold text-[#17252B]">
                    Marketing-Budget / Monat
                    <span className="hidden text-[11.5px] font-normal text-[#6C7A7E] sm:inline">zeigt uns deinen größten Hebel</span>
                  </legend>
                  <div id="tl-budget" tabIndex={-1} role="radiogroup" aria-invalid={!!err("budget")} aria-describedby={err("budget") ? "tl-budget-err" : undefined} className="grid grid-cols-2 gap-2 outline-none">
                    {TL_BUDGETS.map((b) => {
                      const on = v.budget === b.value;
                      return (
                        <label
                          key={b.value}
                          className={cn(
                            "relative flex h-11 cursor-pointer items-center justify-between gap-2 whitespace-nowrap rounded-[12px] border-[1.5px] px-3 text-[13px] font-semibold tracking-[-0.1px] sm:px-3.5 sm:text-[14px] transition-[border-color,background-color,color,box-shadow] duration-150 has-[:focus-visible]:shadow-[0_0_0_4px_rgba(212,168,99,0.25)]",
                            on
                              ? "border-[#D4A863] bg-[#fbf6ee] text-[#7a5b30] shadow-[0_6px_16px_-10px_rgba(168,127,69,0.6)]"
                              : err("budget")
                                ? "border-[#e5a29b] bg-white text-[#17252B]"
                                : "border-[#DDE4E5] bg-white text-[#17252B] hover:border-[#c9d3d5]",
                          )}
                        >
                          <input
                            type="radio"
                            name="tl-budget"
                            value={b.value}
                            checked={on}
                            onChange={() => {
                              const next = { ...v, budget: b.value };
                              setV(next);
                              setTouched((t) => ({ ...t, budget: true }));
                              setErrors(validateLens(next));
                            }}
                            className="sr-only"
                          />
                          {b.label}
                          <span className={cn("grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors", on ? "border-[#D4A863] bg-[#D4A863] text-white" : "border-[#cfd8da]")}>
                            {on && <Check className="size-3" strokeWidth={3} />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {err("budget") && (
                    <p id="tl-budget-err" className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-4 text-[#b42318]">
                      <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
                      {err("budget")}
                    </p>
                  )}
                </fieldset>

                <div className="grid grid-cols-1 gap-x-3 min-[521px]:grid-cols-2">
                  <Field id="name" label="Name" error={err("name")}>
                    <Iconed icon={UserRound}>
                      <input
                        id="tl-name"
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        placeholder="Vor- und Nachname"
                        value={v.name}
                        onChange={set("name")}
                        onBlur={blur("name")}
                        aria-invalid={!!err("name")}
                        aria-describedby={err("name") ? "tl-name-err" : undefined}
                        className={cn(field, "pl-10", err("name") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                      />
                    </Iconed>
                  </Field>
                  <Field id="email" label="E-Mail" error={err("email")}>
                    <Iconed icon={Mail}>
                      <input
                        id="tl-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        maxLength={160}
                        placeholder="name@firma.de"
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
                      <>Gerade kamen viele Anfragen von deinem Anschluss. Bitte versuch es in ein paar Minuten erneut.</>
                    ) : (
                      <>
                        Das Senden hat gerade nicht geklappt.{" "}
                        <a href={mailto()} className="inline-flex items-center gap-1 font-semibold text-[#002E3D] underline underline-offset-2">
                          <Mail className="size-3.5" /> Per E-Mail senden
                        </a>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "group mt-2 flex h-[54px] w-full items-center justify-center gap-2.5 rounded-full text-[16px] font-semibold tracking-[-0.1px] text-[#002E3D] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002E3D]",
                    GOLD_BTN,
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle className="size-[18px] animate-spin" strokeWidth={2.2} /> Wird gesendet …
                    </>
                  ) : (
                    <>
                      Meine Analyse anfordern
                      <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
                    </>
                  )}
                </button>
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[12px] leading-[18px] text-[#6C7A7E]">
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="size-3 shrink-0" strokeWidth={2} />
                    Kein Newsletter, kein Spam.
                  </span>
                  <Link href="/datenschutz" target="_blank" className="underline underline-offset-2 hover:text-[#17252B]">
                    Datenschutz
                  </Link>
                  <span aria-hidden className="text-[#cfd8da]">·</span>
                  <button type="button" onClick={never} className="text-[#9aa7ab] underline-offset-2 hover:text-[#6C7A7E] hover:underline">
                    Nicht mehr anzeigen
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div role="status" aria-live="polite">
              <div className="relative overflow-hidden px-6 pb-7 pt-4 text-center sm:px-8 sm:pt-8" style={{ backgroundImage: HEAD_BG }}>
                <span aria-hidden className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Schließen"
                  className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/[0.22] bg-[rgba(0,22,32,0.62)] text-white/80 transition-colors hover:bg-[rgba(0,22,32,0.85)] hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4A863] sm:right-5 sm:top-5"
                >
                  <X className="size-[18px]" strokeWidth={2} />
                </button>
                <svg viewBox="0 0 72 72" className="mx-auto size-[72px]" aria-hidden>
                  <circle cx="36" cy="36" r="33" fill="rgba(212,168,99,0.12)" stroke="#D4A863" strokeWidth="2" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.7s_ease-out_both]" />
                  <path d="M23 37.5 32 46.5 50 27" fill="none" stroke="#D4A863" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.45s_0.5s_ease-out_both]" />
                </svg>
                <h3 id="tl-title" className="mt-4 font-display text-[clamp(1.5rem,4.4vw,1.8rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
                  Danke
                  {first ? (
                    <>
                      , <span className="font-[family-name:var(--font-instrument)] text-[1.08em] font-normal italic text-[#D4A863]">{first}</span>
                    </>
                  ) : null}
                  !
                </h3>
                <p className="mx-auto mt-2.5 max-w-[36ch] text-[15px] leading-[24px] text-[#cbc8c2]">
                  Unser Team schaut sich <span className="font-semibold text-white">{site || "deine Website"}</span> jetzt persönlich an.
                </p>
              </div>
              <div className="px-6 pb-7 pt-6 sm:px-8">
                <p className="mb-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.4px] text-[#6C7A7E]">So geht es weiter</p>
                <ol className="relative flex flex-col gap-5">
                  <span aria-hidden className="absolute bottom-4 left-[17px] top-4 w-px bg-[linear-gradient(180deg,#D4A863,rgba(212,168,99,0.15))]" />
                  {[
                    { I: ScanSearch, when: "Jetzt", t: `Wir analysieren ${site || "deine Website"}`, live: true },
                    { I: Video, when: "Innerhalb von 48 Stunden", t: `Dein persönliches Video mit 3 konkreten Hebeln — per E-Mail an ${v.email || "dich"}` },
                    { I: MessageCircle, when: "Danach", t: "Wenn du willst, ein kurzes Gespräch. Du entscheidest." },
                  ].map(({ I, when, t, live }) => (
                    <li key={when} className="relative flex gap-3.5">
                      <span className={cn("relative grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] bg-white", live ? "border-[#D4A863] text-[#A8863A]" : "border-[#DDE4E5] text-[#6C7A7E]")}>
                        <I className="size-4" strokeWidth={2} />
                        {live && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-[#1E7A52] motion-safe:animate-pulse" />}
                      </span>
                      <span className="flex min-w-0 flex-col pt-0.5">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.3px] text-[#A8863A]">{when}</span>
                        <span className="break-words text-[14.5px] leading-[21px] text-[#17252B]">{t}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={close}
                  className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-[#002E3D] text-[15px] font-semibold text-white transition-colors hover:bg-[#013a4d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863]"
                >
                  Alles klar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Iconed({ icon: I, children }: { icon: typeof Globe; children: React.ReactNode }) {
  return (
    <div className="relative">
      <I className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9aa7ab]" strokeWidth={1.9} />
      {children}
    </div>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label htmlFor={`tl-${id}`} className="mb-1.5 block text-[13px] font-semibold text-[#17252B]">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`tl-${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-4 text-[#b42318]">
          <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12px] text-[#6C7A7E]">{hint}</p>
      )}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  options,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  invalid: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        id={`tl-${id}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={invalid ? `tl-${id}-err` : undefined}
        className={cn(field, "cursor-pointer appearance-none pr-10", invalid ? "border-[#e5a29b]" : "border-[#DDE4E5]", !value && "text-[#9aa7ab]")}
      >
        <option value="" disabled>
          Auswählen…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-[#17252B]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6C7A7E]" strokeWidth={1.8} />
    </div>
  );
}
