"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Loader2, Mail, Phone } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { CONTACT } from "@/lib/contact";
import {
  BUDGETS,
  BW_LIMITS,
  MITARBEITER,
  STARTS,
  STEP_FIELDS,
  TOOLS,
  optionLabel,
  validateBewerbung,
  type Bewerbung,
  type BwErrors,
  type BwField,
  type Tool,
} from "@/lib/bewerbung";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";
import { BTN, BTN_BASE, BTN_SIZE, Eyebrow } from "./ui";
import s from "./software.module.css";

const STEPS = 6;
const EMPTY: Bewerbung = { branche: "", mitarbeiter: "", problem: "", tools: [], budget: "", start: "", name: "", company: "", email: "", phone: "", consent: false };

type Status = "idle" | "sending" | "fallback" | "error";

/* ---- field primitives (Figma Input Field / Dropdown / Checkbox / Radio Option) ---- */

const FIELD =
  "flex h-14 w-full items-center gap-2.5 rounded-[12px] border bg-white px-[18px] transition-[border-color,box-shadow] duration-150 focus-within:border-[#d1aa71] focus-within:shadow-[0_0_0_4px_rgba(209,170,113,0.25)]";
const fieldBorder = (err?: string) => (err ? "border-[#e5a29b]" : "border-[#e2e0dc] hover:border-[#cbc8c2]");
const INPUT = "min-w-0 flex-1 bg-transparent text-[16px] leading-6 text-[#1a1917] outline-none placeholder:text-[#7d7973]";

function ErrLine({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] leading-[18px] text-[#b4473b]">
      {msg}
    </p>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
      {children}
    </label>
  );
}

/* ---- the form ------------------------------------------------------------------ */

export default function SoftwareBewerbung() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const question = useRef<HTMLHeadingElement>(null);
  const locale = useLocale();
  const lp = useLocalePath();
  const t = useT();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [v, setV] = useState<Bewerbung>(EMPTY);
  const [errors, setErrors] = useState<BwErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const opened = useRef<number>(0);
  const moved = useRef(false);

  useEffect(() => {
    opened.current = Date.now();
  }, []);

  useLazyGSAP(
    () => {
      gsap.from(".swb-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".swb-card", start: "top 88%", toggleActions: "play none none none" },
      });
    },
    { scope: root },
  );

  // after a step change: move focus to the new question (screen readers announce it),
  // and bring the card top back into view on small screens
  useEffect(() => {
    if (!moved.current) return;
    question.current?.focus({ preventScroll: true });
    const top = card.current?.getBoundingClientRect().top ?? 0;
    if (top < 72) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (el: Element, o: object) => void } }).__lenis;
      if (lenis && card.current) lenis.scrollTo(card.current, { offset: -96, duration: 0.6 });
      else card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step, done]);

  const set = <K extends keyof Bewerbung>(k: K, val: Bewerbung[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggleTool = (tool: Tool) => set("tools", v.tools.includes(tool) ? v.tools.filter((x) => x !== tool) : [...v.tools, tool]);

  const focusFirst = (errs: BwErrors) => {
    const first = (Object.keys(errs) as BwField[])[0];
    if (!first) return;
    requestAnimationFrame(() => document.getElementById(id(first))?.focus());
  };

  const go = (to: number) => {
    moved.current = true;
    setDir(to > step ? "fwd" : "back");
    setStep(to);
  };

  const mailtoHref = () => {
    const L = (list: Parameters<typeof optionLabel>[0], val: string) => optionLabel(list, val, locale);
    const lines = [
      `${t("Branche", "Industry")}: ${v.branche}`,
      `${t("Mitarbeiter", "Employees")}: ${L(MITARBEITER, v.mitarbeiter)}`,
      `${t("Problem", "Problem")}: ${v.problem}`,
      `${t("Aktuell im Einsatz", "Currently using")}: ${v.tools.map((x) => L(TOOLS, x)).join(", ")}`,
      `${t("Budget", "Budget")}: ${L(BUDGETS, v.budget)}`,
      `${t("Start", "Start")}: ${L(STARTS, v.start)}`,
      "",
      `${v.name} · ${v.company}`,
      v.email,
      v.phone,
    ];
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(t("Bewerbung App-Bauplan", "App blueprint application"))}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const submit = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/bewerbung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, website: honeypot, elapsed: Date.now() - opened.current, locale }),
      });
      const data: { ok?: boolean; reason?: string; errors?: BwErrors } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        moved.current = true;
        setStatus("idle");
        setDone(true);
        return;
      }
      if (res.status === 422 && data.errors) {
        // jump back to the first step that has a problem
        const errs = data.errors;
        const target = STEP_FIELDS.findIndex((fs) => fs.some((f) => errs[f]));
        setErrors(errs);
        setStatus("idle");
        if (target >= 0 && target !== step) go(target);
        focusFirst(errs);
        return;
      }
      setStatus(res.status === 503 ? "fallback" : "error");
    } catch {
      setStatus("error");
    }
  };

  const onNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validateBewerbung(v, locale, step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake((n) => n + 1);
      focusFirst(errs);
      return;
    }
    if (step < STEPS - 1) go(step + 1);
    else void submit();
  };

  const err = (f: BwField) => errors[f];
  const described = (f: BwField) => (errors[f] ? { "aria-invalid": true, "aria-describedby": id(`${f}-err`) } : {});

  /* -- per-step content -- */

  const radioCards = <K extends "budget" | "start">(k: K, list: typeof BUDGETS | typeof STARTS, legend: string) => (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div id={id(k)} tabIndex={-1} role="radiogroup" aria-label={legend} {...described(k)} className="grid grid-cols-1 gap-3 outline-none min-[400px]:grid-cols-2 sm:gap-4">
        {list.map((o) => {
          const on = v[k] === o.value;
          return (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-[12px] border px-4 py-[13px] t-label-m text-[#1a1917] transition-[border-color,background-color,box-shadow] duration-150 has-[:focus-visible]:shadow-[0_0_0_4px_rgba(209,170,113,0.25)]",
                on ? "border-[#d1aa71] bg-[#fbf6ee]" : err(k) ? "border-[#e5a29b] bg-white" : "border-[#e2e0dc] bg-white hover:border-[#cbc8c2]",
              )}
            >
              <input type="radio" name={id(k)} value={o.value} checked={on} onChange={() => set(k, o.value as Bewerbung[K])} className="sr-only" />
              <span className={cn("grid size-[18px] shrink-0 place-items-center rounded-full transition-colors", on ? "bg-[#d1aa71]" : "border-[1.5px] border-[#cbc8c2] bg-white")}>
                {on && <span className="size-[7px] rounded-full bg-[#0f0e0d]" />}
              </span>
              {locale === "en" ? o.en : o.de}
            </label>
          );
        })}
      </div>
      <ErrLine id={id(`${k}-err`)} msg={err(k)} />
    </fieldset>
  );

  const steps: { q: string; hint?: string; body: React.ReactNode }[] = [
    {
      q: t("In welcher Branche bist du & wie viele Mitarbeiter?", "Which industry are you in & how many employees?"),
      body: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={id("branche")}>{t("Branche", "Industry")}</Label>
            <div className={cn(FIELD, fieldBorder(err("branche")))}>
              <input
                id={id("branche")}
                value={v.branche}
                onChange={(e) => set("branche", e.target.value)}
                placeholder={t("z. B. Gebäudereinigung", "e.g. commercial cleaning")}
                maxLength={BW_LIMITS.branche}
                autoComplete="off"
                className={INPUT}
                {...described("branche")}
              />
            </div>
            <ErrLine id={id("branche-err")} msg={err("branche")} />
          </div>
          <div>
            <Label htmlFor={id("mitarbeiter")}>{t("Mitarbeiter", "Employees")}</Label>
            <div className={cn(FIELD, fieldBorder(err("mitarbeiter")), "relative")}>
              <select
                id={id("mitarbeiter")}
                value={v.mitarbeiter}
                onChange={(e) => set("mitarbeiter", e.target.value as Bewerbung["mitarbeiter"])}
                className={cn(INPUT, "h-full cursor-pointer appearance-none pr-8", !v.mitarbeiter && "text-[#7d7973]")}
                {...described("mitarbeiter")}
              >
                <option value="" disabled>
                  {t("Bitte wählen", "Please choose")}
                </option>
                {MITARBEITER.map((o) => (
                  <option key={o.value} value={o.value} className="text-[#1a1917]">
                    {locale === "en" ? o.en : o.de}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-[18px] size-5 text-[#7d7973]" strokeWidth={1.7} aria-hidden />
            </div>
            <ErrLine id={id("mitarbeiter-err")} msg={err("mitarbeiter")} />
          </div>
        </div>
      ),
    },
    {
      q: t("Welches Problem soll deine Software lösen?", "What problem should your software solve?"),
      body: (
        <div>
          <Label htmlFor={id("problem")}>{t("Deine Antwort", "Your answer")}</Label>
          <textarea
            id={id("problem")}
            value={v.problem}
            onChange={(e) => set("problem", e.target.value)}
            placeholder={t("Beschreib kurz, was heute nicht rund läuft.", "Briefly describe what isn’t running smoothly today.")}
            maxLength={BW_LIMITS.problem}
            rows={4}
            className={cn(
              "block min-h-[120px] w-full resize-y rounded-[12px] border bg-white px-[18px] py-[15px] text-[16px] leading-6 text-[#1a1917] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[#7d7973] focus:border-[#d1aa71] focus:shadow-[0_0_0_4px_rgba(209,170,113,0.25)]",
              fieldBorder(err("problem")),
            )}
            {...described("problem")}
          />
          <ErrLine id={id("problem-err")} msg={err("problem")} />
        </div>
      ),
    },
    {
      q: t("Womit arbeitet ihr aktuell?", "What are you working with right now?"),
      hint: t("Mehrfachauswahl möglich", "Select all that apply"),
      body: (
        <fieldset>
          <legend className="sr-only">{t("Womit arbeitet ihr aktuell?", "What are you working with right now?")}</legend>
          <div id={id("tools")} tabIndex={-1} {...described("tools")} className="grid grid-cols-2 gap-x-4 gap-y-4 outline-none">
            {TOOLS.map((o) => {
              const on = v.tools.includes(o.value);
              return (
                <label key={o.value} className="group flex cursor-pointer items-start gap-2.5">
                  <input type="checkbox" checked={on} onChange={() => toggleTool(o.value)} className="peer sr-only" />
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-[5px] border transition-colors duration-150 peer-focus-visible:shadow-[0_0_0_4px_rgba(209,170,113,0.3)]",
                      on ? "border-[#d1aa71] bg-[#d1aa71]" : err("tools") ? "border-[#e5a29b] bg-white" : "border-[#cbc8c2] bg-white group-hover:border-[#a6a29b]",
                    )}
                  >
                    {on && <Check className="size-3.5 text-[#0f0e0d]" strokeWidth={2.2} aria-hidden />}
                  </span>
                  <span className="t-body-s text-[#5c5954]">{locale === "en" ? o.en : o.de}</span>
                </label>
              );
            })}
          </div>
          <ErrLine id={id("tools-err")} msg={err("tools")} />
        </fieldset>
      ),
    },
    { q: t("Welches Budget habt ihr für die Umsetzung?", "What budget do you have for the build?"), body: radioCards("budget", BUDGETS, t("Budget", "Budget")) },
    { q: t("Wann wollt ihr starten?", "When would you like to start?"), body: radioCards("start", STARTS, t("Start", "Start")) },
    {
      q: t("Fast geschafft. Wie erreichen wir dich?", "Almost done. How can we reach you?"),
      body: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                ["name", t("Name", "Name"), t("Vor- und Nachname", "First and last name"), "name", null, "text"],
                ["company", t("Firma", "Company"), t("Dein Betrieb", "Your business"), "organization", null, "text"],
                ["email", t("E-Mail", "Email"), t("name@betrieb.de", "name@company.com"), "email", Mail, "email"],
                ["phone", t("Telefon/WhatsApp", "Phone/WhatsApp"), "+49", "tel", Phone, "tel"],
              ] as const
            ).map(([f, label, ph, ac, Ico, type]) => (
              <div key={f}>
                <Label htmlFor={id(f)}>{label}</Label>
                <div className={cn(FIELD, fieldBorder(err(f)))}>
                  {Ico && <Ico className="size-5 shrink-0 text-[#1a1917]" strokeWidth={1.7} aria-hidden />}
                  <input
                    id={id(f)}
                    type={type}
                    inputMode={f === "phone" ? "tel" : f === "email" ? "email" : undefined}
                    value={v[f]}
                    onChange={(e) => set(f, e.target.value)}
                    placeholder={ph}
                    autoComplete={ac}
                    maxLength={BW_LIMITS[f]}
                    className={INPUT}
                    {...described(f)}
                  />
                </div>
                <ErrLine id={id(`${f}-err`)} msg={err(f)} />
              </div>
            ))}
          </div>
          <div>
            <label className="group flex cursor-pointer items-start gap-2.5">
              <input id={id("consent")} type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="peer sr-only" {...described("consent")} />
              <span
                className={cn(
                  "mt-px grid size-5 shrink-0 place-items-center rounded-[5px] border transition-colors duration-150 peer-focus-visible:shadow-[0_0_0_4px_rgba(209,170,113,0.3)]",
                  v.consent ? "border-[#d1aa71] bg-[#d1aa71]" : err("consent") ? "border-[#e5a29b] bg-white" : "border-[#cbc8c2] bg-white group-hover:border-[#a6a29b]",
                )}
              >
                {v.consent && <Check className="size-3.5 text-[#0f0e0d]" strokeWidth={2.2} aria-hidden />}
              </span>
              <span className="t-body-s text-[#5c5954]">
                {t("Ich habe die ", "I have read the ")}
                <Link href={lp("/datenschutz")} target="_blank" className="underline decoration-[#cbc8c2] underline-offset-2 hover:text-[#1a1917]">
                  {t("Datenschutzerklärung", "privacy policy")}
                </Link>
                {t(" gelesen und bin mit der Kontaktaufnahme einverstanden.", " and agree to be contacted.")}
              </span>
            </label>
            <ErrLine id={id("consent-err")} msg={err("consent")} />
          </div>
        </div>
      ),
    },
  ];

  const cur = steps[step];
  const last = step === STEPS - 1;

  return (
    <section ref={root} id="bewerbung" className="relative overflow-hidden bg-white py-16 sm:py-[112px]">
      {/* Figma "Warmes Licht" behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 h-[560px] w-[860px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(209,170,113,0.22)_0%,rgba(209,170,113,0.08)_45%,rgba(209,170,113,0)_100%)] sm:h-[760px] sm:w-[1180px]"
      />
      <Container className="max-sm:px-5 relative flex justify-center">
        <div
          ref={card}
          className="swb-card w-full max-w-[640px] rounded-[20px] border border-[#eeedea] bg-white p-5 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:rounded-[28px] sm:p-10"
        >
          {done ? (
            <div className={cn(s.step, "flex flex-col items-start gap-6")} aria-live="polite">
              <div className={cn(s.seal, "relative grid size-[100px] place-items-center rounded-full border-[1.5px] border-[#d1aa71] bg-[#fbf6ee]")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/software/siegel-ring.webp" alt="" width={84} height={84} className="absolute left-[6.5px] top-[6.5px] size-[84px]" />
                <svg className={cn(s.tick, "relative size-[38px]")} viewBox="0 0 38 38" fill="none" aria-hidden>
                  <path d="M31.6667 9.5L14.25 26.9167L6.33333 19" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" stroke="#B98F53" />
                </svg>
              </div>
              <div className="flex flex-col items-start gap-3">
                <Eyebrow icon={Check}>{t("Bewerbung eingegangen", "Application received")}</Eyebrow>
                <h3 ref={question} tabIndex={-1} className="t-h3 text-[#1a1917] outline-none">
                  {t("Danke!", "Thank you!")}
                </h3>
                <p className="t-body-m text-[#5c5954]">{t("Wir prüfen deine Bewerbung und melden uns innerhalb von 24 Stunden.", "We’ll review your application and get back to you within 24 hours.")}</p>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onNext} className="flex flex-col gap-6" aria-label={t("Bewerbung für den App-Bauplan", "App blueprint application")}>
              <div className="flex flex-col items-start gap-3">
                <Eyebrow icon={FileText}>{t("Bewerbung", "Application")}</Eyebrow>
                <h2 className="t-h3 text-[#1a1917]">
                  {t("Bewirb dich für deinen kostenlosen", "Apply for your free")}{" "}
                  <span className="t-serif whitespace-nowrap tracking-[-0.02em] text-[#94713f]">{t("App-Bauplan", "app blueprint")}</span>
                </h2>
                <p className="t-body-m text-[#5c5954] max-sm:text-[14px] max-sm:leading-[22px]">
                  {t("5 kurze Fragen, dann deine Kontaktdaten. Dauert 2 Minuten.", "5 short questions, then your contact details. Takes 2 minutes.")}
                </p>
              </div>

              {/* Figma "Schritt-Anzeige" */}
              <div className="flex items-center gap-3.5">
                <div
                  className="relative h-[3px] flex-1 overflow-hidden rounded-[2px] bg-[#eeedea]"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={STEPS}
                  aria-valuenow={step + 1}
                  aria-label={t("Fortschritt", "Progress")}
                >
                  <div className="absolute inset-y-0 left-0 rounded-[2px] bg-[#d1aa71] transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
                </div>
                <p className="shrink-0 font-mono text-[13px] leading-4 text-[#7d7973]" aria-live="polite">
                  {t("SCHRITT", "STEP")} {step + 1} / {STEPS}
                </p>
              </div>

              {/* honeypot — hidden from people, tempting for bots */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
                </label>
              </div>

              <div key={step} data-dir={dir} className={cn(s.step, "flex flex-col gap-4")}>
                <div className="flex flex-col gap-1">
                  <h3 ref={question} tabIndex={-1} className="t-h5 text-[#1a1917] outline-none">
                    {cur.q}
                  </h3>
                  {cur.hint && <p className="t-body-s text-[#7d7973]">{cur.hint}</p>}
                </div>
                <div key={shake} className={shake ? s.shake : undefined}>
                  {cur.body}
                </div>
              </div>

              {status === "fallback" && (
                <div role="alert" className="rounded-[14px] border border-[#ecd8b6] bg-[#fbf6ee] p-4 t-body-s text-[#5c5954]">
                  {t(
                    "Unser Formular ist gerade nicht erreichbar. Schick uns deine Bewerbung einfach per E-Mail, alle Angaben sind schon eingetragen:",
                    "Our form is unavailable right now. Just send your application by email, all your answers are already filled in:",
                  )}{" "}
                  <a href={mailtoHref()} className="font-medium text-[#1a1917] underline underline-offset-2">
                    {t("E-Mail öffnen", "Open email")}
                  </a>
                </div>
              )}
              {status === "error" && (
                <div role="alert" className="rounded-[14px] border border-[#f0c9c4] bg-[#fdf3f2] p-4 t-body-s text-[#5c5954]">
                  {t("Das hat leider nicht geklappt. Versuch es gleich noch einmal oder ", "That didn’t work. Please try again in a moment or ")}
                  <a href={mailtoHref()} className="font-medium text-[#1a1917] underline underline-offset-2">
                    {t("schick uns eine E-Mail", "send us an email")}
                  </a>
                  .
                </div>
              )}

              {/* < 380 px: stacked (submit on top) · phones: icon-only "Zurück" · sm+: Figma row */}
              <div className="flex gap-3 max-[379px]:flex-col-reverse">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className={cn(BTN_BASE, BTN_SIZE.lg, BTN.outline, "shrink-0 min-[380px]:max-sm:w-[58px] min-[380px]:max-sm:px-0")}
                  >
                    <ArrowLeft className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2} aria-hidden />
                    <span className="min-[380px]:max-sm:sr-only">{t("Zurück", "Back")}</span>
                  </button>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(BTN_BASE, BTN_SIZE.lg, last ? BTN.gold : BTN.dark, "min-w-0 flex-1 disabled:cursor-wait disabled:opacity-80 max-sm:px-5 max-[379px]:flex-none")}
                >
                  {status === "sending" ? (
                    <Loader2 className="size-5 animate-spin" aria-label={t("Wird gesendet", "Sending")} />
                  ) : (
                    <>
                      <span className="truncate">{last ? t("Bewerbung absenden", "Send application") : t("Weiter", "Next")}</span>
                      <ArrowRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center t-body-s text-[#7d7973]">
                {last ? t("Kein Newsletter, keine Weitergabe deiner Daten.", "No newsletter, no sharing of your data.") : t("Wir melden uns innerhalb von 24 Stunden.", "We’ll get back to you within 24 hours.")}
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
