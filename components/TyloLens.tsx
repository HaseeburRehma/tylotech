"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, CircleAlert, Clock, LoaderCircle, Mail, Video, X } from "lucide-react";
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
  "w-full rounded-[10px] border-[1.5px] bg-white px-3.5 py-3 text-[15px] text-[#17252B] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#9aa7ab] focus:border-[#D4A863] focus:shadow-[0_0_0_3px_rgba(212,168,99,0.18)]";

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
    const blocked = () => !!(store.get(ss(), SS_AUTO) || store.get(ss(), SS_DISMISSED) || store.get(ls(), LS_SENT));
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
  const blur = (k: string) => () => {
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

  return (
    <>
      {/* floating trigger (manual open) — xl+, where it can't collide with the live bar */}
      <button
        type="button"
        onClick={() => show("fab")}
        aria-label="TyloLens: Was würden wir anders machen?"
        className={cn(
          "fixed bottom-[22px] right-[22px] z-[60] hidden items-center gap-[9px] rounded-full border border-[#D4A863] bg-[#002E3D] px-5 py-[13px] text-[14.5px] font-bold text-white shadow-[0_24px_60px_-20px_rgba(0,20,28,0.45)] transition-[opacity,translate] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A863] xl:flex",
          fab && !open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <span className="size-2 rounded-full bg-[#D4A863] motion-safe:animate-pulse" />
        Was würden wir anders machen?
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,20,28,0.55)] p-4 backdrop-blur-[3px] transition-opacity duration-300 motion-reduce:transition-none sm:p-5",
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
            "max-h-[92vh] w-full max-w-[480px] overflow-y-auto overscroll-contain rounded-[14px] bg-white shadow-[0_24px_60px_-20px_rgba(0,20,28,0.45)] transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
            open ? "translate-y-0 scale-100" : "translate-y-3.5 scale-[0.99]",
          )}
        >
          {status !== "sent" ? (
            <>
              <div className="relative bg-[#002E3D] px-6 pb-6 pt-[26px] sm:px-7">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Schließen"
                  className="absolute right-4 top-4 grid size-[30px] place-items-center rounded-lg bg-white/10 text-[#AEBEC2] transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D4A863]"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
                <p className="mb-3 text-[14px] font-extrabold tracking-[0.02em] text-[#D4A863]">TyloLens</p>
                <h3 id="tl-title" className="pr-8 font-display text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[25px]">
                  Was würden wir bei dir anders machen?
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.5] text-[#AEBEC2]">
                  Unser Team schaut sich dein Marketing persönlich an und zeigt dir 3 konkrete Hebel — als kurzes Video, kostenlos, in 48 Stunden.
                </p>
              </div>

              <form onSubmit={submit} noValidate className="px-6 pb-7 pt-6 sm:px-7">
                {/* honeypot */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="tl-company">Firma</label>
                  <input id="tl-company" tabIndex={-1} autoComplete="off" value={v.company} onChange={set("company")} />
                </div>

                <Field id="website" label="Deine Website" error={err("website")}>
                  <input
                    ref={firstField}
                    id="tl-website"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://deine-firma.de"
                    value={v.website}
                    onChange={set("website")}
                    onBlur={blur("website")}
                    aria-invalid={!!err("website")}
                    aria-describedby={err("website") ? "tl-website-err" : undefined}
                    className={cn(field, err("website") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-x-3 min-[521px]:grid-cols-2">
                  <Field id="branche" label="Branche" error={err("branche")}>
                    <Select id="branche" value={v.branche} onChange={set("branche")} onBlur={blur("branche")} invalid={!!err("branche")} options={TL_BRANCHEN.map((b) => ({ value: b, label: b }))} />
                  </Field>
                  <Field id="ziel" label="Dein größtes Ziel" error={err("ziel")}>
                    <Select id="ziel" value={v.ziel} onChange={set("ziel")} onBlur={blur("ziel")} invalid={!!err("ziel")} options={TL_ZIELE.map((z) => ({ value: z, label: z }))} />
                  </Field>
                </div>

                <Field id="budget" label="Aktuelles Marketing-Budget / Monat" error={err("budget")} hint="Damit wir einschätzen, wo dein größter Hebel liegt.">
                  <Select id="budget" value={v.budget} onChange={set("budget")} onBlur={blur("budget")} invalid={!!err("budget")} options={TL_BUDGETS.map((b) => ({ value: b.value, label: b.label }))} />
                </Field>

                <div className="grid grid-cols-1 gap-x-3 min-[521px]:grid-cols-2">
                  <Field id="name" label="Name" error={err("name")}>
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
                      className={cn(field, err("name") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                    />
                  </Field>
                  <Field id="email" label="E-Mail" error={err("email")}>
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
                      className={cn(field, err("email") ? "border-[#e5a29b]" : "border-[#DDE4E5]")}
                    />
                  </Field>
                </div>

                {(status === "error" || status === "limited") && (
                  <div role="alert" className="mb-3 rounded-[10px] border border-[#ecd8b6] bg-[#fbf6ee] p-3 text-[13.5px] leading-[20px] text-[#5c4524]">
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
                  className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-[11px] bg-[#D4A863] px-4 py-[15px] text-[16px] font-extrabold tracking-[-0.01em] text-[#002E3D] transition-[background-color,translate] duration-150 hover:bg-[#c99d57] active:translate-y-px disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002E3D]"
                >
                  {status === "sending" ? (
                    <>
                      <LoaderCircle className="size-[18px] animate-spin" strokeWidth={2.2} /> Wird gesendet …
                    </>
                  ) : (
                    "Meine Analyse anfordern"
                  )}
                </button>
                <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-[12px] text-[#6C7A7E]">
                  <span className="flex items-center gap-1.5">
                    <Video className="size-3.5 text-[#A8863A]" strokeWidth={2} /> <b className="font-semibold text-[#A8863A]">Persönliches Video</b>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-[#A8863A]" strokeWidth={2} /> <b className="font-semibold text-[#A8863A]">In 48 Stunden</b>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#A8863A]" strokeWidth={2.4} /> Kostenlos
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="relative px-7 py-10 text-center" role="status" aria-live="polite">
              <button
                type="button"
                onClick={close}
                aria-label="Schließen"
                className="absolute right-4 top-4 grid size-[30px] place-items-center rounded-lg bg-[#EEF3F4] text-[#6C7A7E] transition-colors hover:bg-[#DDE4E5] hover:text-[#17252B] focus-visible:outline-2 focus-visible:outline-[#D4A863]"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
              <span className="mx-auto mb-[18px] grid size-[60px] place-items-center rounded-full bg-[rgba(30,122,82,0.12)] text-[#1E7A52] motion-safe:animate-[tlPop_.45s_cubic-bezier(.2,.8,.2,1)_both]">
                <Check className="size-[30px]" strokeWidth={2.6} />
              </span>
              <h3 id="tl-title" className="mb-3 font-display text-[24px] font-extrabold tracking-[-0.02em] text-[#002E3D]">
                Danke, {first || "wir sind dran"}!
              </h3>
              <p className="mx-auto mb-2 max-w-[34ch] text-[15.5px] leading-[1.6] text-[#6C7A7E]">
                Unser Team schaut sich <span className="font-bold text-[#A8863A]">{site || "deine Website"}</span> jetzt persönlich an.
              </p>
              <p className="mx-auto max-w-[34ch] text-[15.5px] leading-[1.6] text-[#6C7A7E]">
                Du bekommst deine individuelle Analyse als <span className="font-bold text-[#A8863A]">kurzes Video</span> innerhalb von{" "}
                <span className="font-bold text-[#A8863A]">48 Stunden</span> per E-Mail — mit 3 konkreten Hebeln, die wir bei dir anders machen würden.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
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
