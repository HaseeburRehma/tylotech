"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, CircleAlert, LoaderCircle, Mail, Phone, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRANCHE_OPTIONS, CONTACT, LIMITS, TOPICS, topicLabel, validate, type FieldErrors } from "@/lib/contact";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";

type Status = "idle" | "sending" | "sent" | "fallback" | "rate-limited";

/* Figma "Input Field" (Large · 56): white, border/default, radius 12, 18px inset */
const field =
  "w-full rounded-[12px] border bg-white px-[18px] text-[16px] leading-[24px] text-[#1a1917] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#a6a29b] hover:border-[#cbc8c2] focus:border-[#d1aa71] focus:shadow-[0_0_0_4px_rgba(209,170,113,0.18)]";
const fieldBorder = (err?: string) => (err ? "border-[#e5a29b]" : "border-[#e2e0dc]");

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-medium leading-[20px] text-[#1a1917]">
      {children}
    </label>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-[12.5px] leading-[18px] text-[#b42318]">
      <CircleAlert className="size-3.5 shrink-0" strokeWidth={2} />
      {msg}
    </p>
  );
}

export default function KontaktForm({ initialBranche = "" }: { initialBranche?: string }) {
  const locale = useLocale();
  const t = useT();
  const lp = useLocalePath();
  const opened = useRef(0);
  // `branche` is not a visible field: it carries the industry page the visitor came from (?branche=…)
  const [v, setV] = useState({ name: "", company: "", email: "", phone: "", topic: "", branche: initialBranche, message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");

  // when the form became usable — bots submit within milliseconds
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const fields = (next = v, c = consent) => {
    const { topic, ...rest } = next;
    return { ...rest, topics: topic ? [topic] : [], consent: c };
  };
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched[k]) setErrors(validate(fields(next), locale));
  };
  // Only check a field on blur once something was typed — an error appearing for an empty
  // field would shift the layout under the pointer and swallow the click that caused the blur.
  const blur = (k: keyof typeof v) => () => {
    if (!v[k].trim()) return;
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields(), locale));
  };
  const show = (k: keyof FieldErrors) => (touched[k] ? errors[k] : undefined);

  const mailto = () => {
    const branche = BRANCHE_OPTIONS.find((o) => o.value === v.branche);
    const body = [
      `Name: ${v.name}`,
      v.company && `${t("Unternehmen", "Company")}: ${v.company}`,
      v.phone && `${t("Telefon", "Phone")}: ${v.phone}`,
      v.branche && `${t("Branche", "Industry")}: ${t(branche?.label, branche?.labelEn)}`,
      v.topic && `${t("Anliegen", "Topic")}: ${topicLabel(v.topic, locale)}`,
    ]
      .filter(Boolean)
      .concat("", v.message)
      .join("\n");
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(t(`Anfrage von ${v.name}`, `Enquiry from ${v.name}`))}&body=${encodeURIComponent(body)}`;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = { ...fields(), elapsed: Date.now() - opened.current, locale };
    const errs = validate(p, locale);
    setErrors(errs);
    setTouched({ name: true, email: true, phone: true, message: true, consent: true });
    if (Object.keys(errs).length) {
      document.getElementById(`kf-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      const data: { ok: boolean; reason?: string; errors?: FieldErrors } = await res.json().catch(() => ({ ok: false }));
      if (data.ok) {
        // GA4 recommended lead event for GTM (no personal data)
        const w = window as Window & { dataLayer?: unknown[] };
        (w.dataLayer ??= []).push({ event: "generate_lead", lead_source: "contact_form", language: locale, branche: p.branche || "none" });
        return setStatus("sent");
      }
      if (data.reason === "invalid" && data.errors) {
        // the server answers in German; show the messages in the page's language
        const local = validate(p, locale);
        const serverErrors: FieldErrors = data.errors;
        setErrors(Object.fromEntries(Object.entries(serverErrors).map(([k, m]) => [k, local[k as keyof FieldErrors] ?? m])));
        return setStatus("idle");
      }
      setStatus(data.reason === "rate-limited" ? "rate-limited" : "fallback");
    } catch {
      setStatus("fallback");
    }
  }

  const reset = () => {
    setV({ name: "", company: "", email: "", phone: "", topic: "", branche: "", message: "", website: "" });
    setConsent(false);
    setErrors({});
    setTouched({});
    opened.current = Date.now();
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-[560px] flex-col items-center justify-center gap-5 px-2 py-10 text-center" role="status" aria-live="polite">
        <svg viewBox="0 0 88 88" className="size-[88px]" aria-hidden>
          <circle cx="44" cy="44" r="40" fill="#fbf6ee" stroke="#d1aa71" strokeWidth="2" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.8s_ease-out_both]" />
          <path d="M28 45.5 39.5 57 61 33" fill="none" stroke="#94713f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="animate-[ktDraw_0.5s_0.55s_ease-out_both]" />
        </svg>
        <h3 className="t-h3 text-[#1a1917]">
          {t("Danke", "Thank you")}, {v.name.trim().split(/\s+/)[0]}!
        </h3>
        <p className="t-body-m max-w-[400px] text-[#5c5954]">
          {t("Deine Nachricht ist bei uns angekommen. Wir melden uns persönlich bei dir unter ", "Your message has reached us. We'll get back to you personally at ")}
          <span className="font-medium text-[#1a1917]">{v.email}</span>.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white px-5 text-[14px] font-medium text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07)] transition-colors hover:bg-[#fbfaf9]"
        >
          <RotateCcw className="size-4" strokeWidth={1.8} />
          {t("Weitere Nachricht senden", "Send another message")}
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-busy={sending}>
      {/* honeypot — invisible to people, tempting for bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="kf-website">Website</label>
        <input id="kf-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
      </div>

      <div className="kf-row grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
        <div>
          <Label htmlFor="kf-name">Name</Label>
          <input
            id="kf-name"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={v.name}
            onChange={set("name")}
            onBlur={blur("name")}
            aria-invalid={!!show("name")}
            aria-describedby={show("name") ? "kf-name-err" : undefined}
            placeholder={t("Vor- und Nachname", "First and last name")}
            className={cn(field, "h-14", fieldBorder(show("name")))}
          />
          <Err id="kf-name-err" msg={show("name")} />
        </div>
        <div>
          <Label htmlFor="kf-company">{t("Unternehmen", "Company")}</Label>
          <input
            id="kf-company"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={v.company}
            onChange={set("company")}
            placeholder={t("Firma oder Betrieb", "Company or business")}
            className={cn(field, "h-14", fieldBorder())}
          />
        </div>
      </div>

      <div className="kf-row grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
        <div>
          <Label htmlFor="kf-email">{t("E-Mail", "Email")}</Label>
          <div className="relative">
            <Mail aria-hidden className="pointer-events-none absolute left-[18px] top-1/2 size-5 -translate-y-1/2 text-[#5c5954]" strokeWidth={1.6} />
            <input
              id="kf-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              value={v.email}
              onChange={set("email")}
              onBlur={blur("email")}
              aria-invalid={!!show("email")}
              aria-describedby={show("email") ? "kf-email-err" : undefined}
              placeholder={t("name@unternehmen.de", "name@company.com")}
              className={cn(field, "h-14 pl-12", fieldBorder(show("email")))}
            />
          </div>
          <Err id="kf-email-err" msg={show("email")} />
        </div>
        <div>
          <Label htmlFor="kf-phone">{t("Telefon (optional)", "Phone (optional)")}</Label>
          <div className="relative">
            <Phone aria-hidden className="pointer-events-none absolute left-[18px] top-1/2 size-5 -translate-y-1/2 text-[#5c5954]" strokeWidth={1.6} />
            <input
              id="kf-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LIMITS.phone}
              value={v.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              aria-invalid={!!show("phone")}
              aria-describedby={show("phone") ? "kf-phone-err" : undefined}
              placeholder={t("0211 1234567", "+49 211 1234567")}
              className={cn(field, "h-14 pl-12", fieldBorder(show("phone")))}
            />
          </div>
          <Err id="kf-phone-err" msg={show("phone")} />
        </div>
      </div>

      <div className="kf-row">
        <Label htmlFor="kf-topic">{t("Worum geht es?", "What's it about?")}</Label>
        <div className="relative">
          <select
            id="kf-topic"
            value={v.topic}
            onChange={set("topic")}
            className={cn(field, "h-14 cursor-pointer appearance-none pr-12", fieldBorder(), !v.topic && "text-[#a6a29b]")}
          >
            <option value="">{t("Auswählen", "Select")}</option>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic} className="text-[#1a1917]">
                {topicLabel(topic, locale)}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-[18px] top-1/2 size-5 -translate-y-1/2 text-[#5c5954]" strokeWidth={1.6} />
        </div>
      </div>

      <div className="kf-row">
        <Label htmlFor="kf-message">{t("Deine Nachricht", "Your message")}</Label>
        <textarea
          id="kf-message"
          rows={4}
          maxLength={LIMITS.message}
          value={v.message}
          onChange={set("message")}
          onBlur={blur("message")}
          aria-invalid={!!show("message")}
          aria-describedby={show("message") ? "kf-message-err" : undefined}
          placeholder={t("Erzähl uns kurz, wo du stehst und was du erreichen willst.", "Tell us briefly where you stand and what you want to achieve.")}
          className={cn(field, "block h-[148px] resize-none py-4", fieldBorder(show("message")))}
        />
        <Err id="kf-message-err" msg={show("message")} />
      </div>

      <div className="kf-row">
        <label htmlFor="kf-consent" className="group flex cursor-pointer items-start gap-2.5">
          <input
            id="kf-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setTouched((t) => ({ ...t, consent: true }));
              setErrors(validate(fields(v, e.target.checked), locale));
            }}
            aria-invalid={!!show("consent")}
            aria-describedby={show("consent") ? "kf-consent-err" : undefined}
            className="peer sr-only"
          />
          <span
            className={cn(
              "mt-px grid size-5 shrink-0 place-items-center rounded-[5px] border transition-colors duration-200 peer-focus-visible:shadow-[0_0_0_4px_rgba(209,170,113,0.25)]",
              consent ? "border-[#b4894d] bg-[#d1aa71] text-white" : show("consent") ? "border-[#e5a29b] bg-white" : "border-[#cbc8c2] bg-white group-hover:border-[#b4894d]",
            )}
          >
            <Check className={cn("size-3.5 transition-transform duration-200", consent ? "scale-100" : "scale-0")} strokeWidth={3} />
          </span>
          <span className="t-body-s text-[#5c5954]">
            {t("Ich habe die ", "I have read the ")}
            <Link href={lp("/datenschutz")} target="_blank" className="underline decoration-[#cbc8c2] underline-offset-2 transition-colors hover:text-[#1a1917] hover:decoration-[#d1aa71]">
              {t("Datenschutzerklärung", "privacy policy")}
            </Link>
            {t(" gelesen und bin einverstanden.", " and agree.")}
          </span>
        </label>
        <Err id="kf-consent-err" msg={show("consent")} />
      </div>

      {status === "fallback" && (
        <div role="alert" className="flex flex-col gap-3 rounded-[16px] border border-[#ecd8b6] bg-[#fbf6ee] p-4 sm:flex-row sm:items-center">
          <p className="flex-1 text-[14px] leading-[21px] text-[#5c4524]">
            {t(
              "Das Senden hat gerade nicht geklappt. Deine Nachricht ist schon vorbereitet: öffne sie einfach in deinem E-Mail-Programm.",
              "Sending didn't work just now. Your message is ready to go: simply open it in your email app.",
            )}
          </p>
          <a
            href={mailto()}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#002e3d] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#013a4d]"
          >
            <Mail className="size-4" strokeWidth={1.8} />
            {t("E-Mail öffnen", "Open email")}
          </a>
        </div>
      )}
      {status === "rate-limited" && (
        <p role="alert" className="rounded-[16px] border border-[#ecd8b6] bg-[#fbf6ee] p-4 text-[14px] leading-[21px] text-[#5c4524]">
          {t(
            "Gerade kamen sehr viele Anfragen von deinem Anschluss. Bitte versuch es in ein paar Minuten erneut oder ruf uns direkt an:",
            "We've just received a lot of requests from your connection. Please try again in a few minutes or call us directly:",
          )}{" "}
          <a href={CONTACT.phoneHref} className="font-medium underline underline-offset-2">
            {t(CONTACT.phone, CONTACT.phoneIntl)}
          </a>
          .
        </p>
      )}

      <div className="kf-row flex flex-col gap-5">
        {/* Figma "Button" Primary · Large (dark petrol, Bevel/Dark CTA) */}
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,#17485b_0%,#04161d_100%)] px-7 t-button text-white shadow-[0_6px_18px_rgba(4,22,29,0.22),inset_0_1.5px_1.5px_rgba(255,255,255,0.16),inset_0_-1.5px_1.5px_rgba(0,0,0,0.3)] transition-[filter,translate,opacity] duration-200 hover:brightness-125 active:translate-y-px disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-5 animate-spin" strokeWidth={2} />
              {t("Wird gesendet …", "Sending …")}
            </>
          ) : (
            <>
              {t("Nachricht senden", "Send message")}
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.8} />
            </>
          )}
        </button>
        <p className="t-body-xs text-center text-[#7d7973]">{t("Kein Newsletter, keine Weitergabe deiner Daten.", "No newsletter, your data is never passed on.")}</p>
      </div>
    </form>
  );
}
