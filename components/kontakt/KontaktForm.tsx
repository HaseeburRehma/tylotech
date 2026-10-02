"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, CircleAlert, LoaderCircle, Lock, Mail, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { BRANCHE_OPTIONS, CONTACT, LIMITS, TOPICS, validate, type FieldErrors } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "fallback" | "rate-limited";

const field =
  "w-full rounded-[14px] border bg-[#fbfaf9] px-4 text-[15px] leading-[22px] tracking-[-0.1px] text-[#1a1917] outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-[#a8a49d] hover:border-[#d6d3ce] focus:border-[#d1aa71] focus:bg-white focus:shadow-[0_0_0_4px_rgba(209,170,113,0.18)]";

function Label({ htmlFor, children, optional }: { htmlFor: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[13.5px] font-medium tracking-[-0.1px] text-[#1a1917]">
      <span>
        {children}
        {!optional && <span className="text-[#b4894d]"> *</span>}
      </span>
      {optional && <span className="text-[12px] font-normal text-[#a8a49d]">optional</span>}
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
  const opened = useRef(0);
  const [v, setV] = useState({ name: "", company: "", email: "", phone: "", branche: initialBranche, message: "", website: "" });
  const [topics, setTopics] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");

  // when the form became usable — bots submit within milliseconds
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const fields = () => ({ ...v, topics, consent });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched[k]) setErrors(validate({ ...next, topics, consent }));
  };
  const blur = (k: string) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(fields()));
  };
  const toggleTopic = (t: string) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const show = (k: keyof FieldErrors) => (touched[k] ? errors[k] : undefined);

  const mailto = () => {
    const body = [
      `Name: ${v.name}`,
      v.company && `Unternehmen: ${v.company}`,
      v.phone && `Telefon: ${v.phone}`,
      v.branche && `Branche: ${BRANCHE_OPTIONS.find((o) => o.value === v.branche)?.label}`,
      topics.length > 0 && `Anliegen: ${topics.join(", ")}`,
    ]
      .filter(Boolean)
      .concat("", v.message)
      .join("\n");
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Anfrage von ${v.name}`)}&body=${encodeURIComponent(body)}`;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = { ...fields(), elapsed: Date.now() - opened.current };
    const errs = validate(p);
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
      if (data.ok) return setStatus("sent");
      if (data.reason === "invalid" && data.errors) {
        setErrors(data.errors);
        return setStatus("idle");
      }
      setStatus(data.reason === "rate-limited" ? "rate-limited" : "fallback");
    } catch {
      setStatus("fallback");
    }
  }

  const reset = () => {
    setV({ name: "", company: "", email: "", phone: "", branche: "", message: "", website: "" });
    setTopics([]);
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
        <h3 className="font-display text-[clamp(1.6rem,2.6vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#1a1917]">
          Danke, {v.name.trim().split(/\s+/)[0]}!
        </h3>
        <p className="max-w-[400px] text-[16px] leading-[26px] tracking-[-0.16px] text-[#5c5954]">
          Deine Anfrage ist bei uns angekommen. Wir melden uns persönlich bei dir unter <span className="font-medium text-[#1a1917]">{v.email}</span>.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white px-5 text-[14px] font-medium text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07)] transition-colors hover:bg-[#fbfaf9]"
        >
          <RotateCcw className="size-4" strokeWidth={1.8} />
          Weitere Anfrage senden
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6" aria-busy={sending}>
      {/* honeypot — invisible to people, tempting for bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="kf-website">Website</label>
        <input id="kf-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set("website")} />
      </div>

      <fieldset className="kf-row">
        <legend className="mb-3 text-[13.5px] font-medium tracking-[-0.1px] text-[#1a1917]">
          Worum geht es? <span className="font-normal text-[#a8a49d]">Mehrfachauswahl möglich</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const on = topics.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTopic(t)}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13.5px] font-medium tracking-[-0.1px] transition-[background-color,border-color,color,box-shadow] duration-200 active:scale-[0.98]",
                  on
                    ? "border-[#d1aa71] bg-[#fbf6ee] text-[#7a5b30] shadow-[0_4px_14px_-6px_rgba(168,127,69,0.45)]"
                    : "border-[#e2e0dc] bg-white text-[#5c5954] hover:border-[#d6d3ce] hover:text-[#1a1917]",
                )}
              >
                <span className={cn("grid place-items-center overflow-hidden transition-[width,opacity] duration-200", on ? "w-3.5 opacity-100" : "w-0 opacity-0")}>
                  <Check className="size-3.5 shrink-0" strokeWidth={2.4} />
                </span>
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="kf-row grid grid-cols-1 gap-5 sm:grid-cols-2">
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
            placeholder="Vor- und Nachname"
            className={cn(field, "h-[52px]", show("name") ? "border-[#e5a29b]" : "border-[#e2e0dc]")}
          />
          <Err id="kf-name-err" msg={show("name")} />
        </div>
        <div>
          <Label htmlFor="kf-company" optional>
            Unternehmen
          </Label>
          <input
            id="kf-company"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={v.company}
            onChange={set("company")}
            placeholder="Firmenname"
            className={cn(field, "h-[52px] border-[#e2e0dc]")}
          />
        </div>
        <div>
          <Label htmlFor="kf-email">E-Mail</Label>
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
            placeholder="du@firma.de"
            className={cn(field, "h-[52px]", show("email") ? "border-[#e5a29b]" : "border-[#e2e0dc]")}
          />
          <Err id="kf-email-err" msg={show("email")} />
        </div>
        <div>
          <Label htmlFor="kf-phone" optional>
            Telefon
          </Label>
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
            placeholder="Für einen schnellen Rückruf"
            className={cn(field, "h-[52px]", show("phone") ? "border-[#e5a29b]" : "border-[#e2e0dc]")}
          />
          <Err id="kf-phone-err" msg={show("phone")} />
        </div>
      </div>

      <div className="kf-row">
        <Label htmlFor="kf-branche" optional>
          Branche
        </Label>
        <div className="relative">
          <select
            id="kf-branche"
            value={v.branche}
            onChange={set("branche")}
            className={cn(field, "h-[52px] cursor-pointer appearance-none border-[#e2e0dc] pr-11", !v.branche && "text-[#a8a49d]")}
          >
            <option value="">Bitte auswählen</option>
            {BRANCHE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="text-[#1a1917]">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-[#7d7973]" strokeWidth={1.8} />
        </div>
      </div>

      <div className="kf-row">
        <Label htmlFor="kf-message">Nachricht</Label>
        <textarea
          id="kf-message"
          rows={5}
          maxLength={LIMITS.message}
          value={v.message}
          onChange={set("message")}
          onBlur={blur("message")}
          aria-invalid={!!show("message")}
          aria-describedby={show("message") ? "kf-message-err" : "kf-message-hint"}
          placeholder="Wo stehst du gerade, und was soll sich ändern?"
          className={cn(field, "min-h-[140px] resize-y py-3.5", show("message") ? "border-[#e5a29b]" : "border-[#e2e0dc]")}
        />
        <div className="flex items-start justify-between gap-3">
          <Err id="kf-message-err" msg={show("message")} />
          <span id="kf-message-hint" className="ml-auto mt-1.5 shrink-0 font-mono text-[11px] tabular-nums text-[#a8a49d]">
            {v.message.length}/{LIMITS.message}
          </span>
        </div>
      </div>

      <div className="kf-row">
        <label htmlFor="kf-consent" className="group flex cursor-pointer items-start gap-3">
          <input
            id="kf-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setTouched((t) => ({ ...t, consent: true }));
              setErrors(validate({ ...fields(), consent: e.target.checked }));
            }}
            aria-invalid={!!show("consent")}
            aria-describedby={show("consent") ? "kf-consent-err" : undefined}
            className="peer sr-only"
          />
          <span
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border transition-colors duration-200 peer-focus-visible:shadow-[0_0_0_4px_rgba(209,170,113,0.25)]",
              consent ? "border-[#b4894d] bg-[#d1aa71] text-white" : show("consent") ? "border-[#e5a29b] bg-white" : "border-[#d6d3ce] bg-white group-hover:border-[#b4894d]",
            )}
          >
            <Check className={cn("size-3.5 transition-transform duration-200", consent ? "scale-100" : "scale-0")} strokeWidth={3} />
          </span>
          <span className="text-[13.5px] leading-[21px] text-[#5c5954]">
            Ich bin einverstanden, dass TyloTech meine Angaben zur Bearbeitung meiner Anfrage verarbeitet. Die Einwilligung kann ich jederzeit per
            E-Mail an {CONTACT.email} widerrufen.<span className="text-[#b4894d]"> *</span>
          </span>
        </label>
        <Err id="kf-consent-err" msg={show("consent")} />
      </div>

      {status === "fallback" && (
        <div role="alert" className="flex flex-col gap-3 rounded-[16px] border border-[#ecd8b6] bg-[#fbf6ee] p-4 sm:flex-row sm:items-center">
          <p className="flex-1 text-[14px] leading-[21px] text-[#5c4524]">
            Das Senden hat gerade nicht geklappt. Deine Nachricht ist schon vorbereitet: öffne sie einfach in deinem E-Mail-Programm.
          </p>
          <a
            href={mailto()}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#002e3d] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#013a4d]"
          >
            <Mail className="size-4" strokeWidth={1.8} />
            E-Mail öffnen
          </a>
        </div>
      )}
      {status === "rate-limited" && (
        <p role="alert" className="rounded-[16px] border border-[#ecd8b6] bg-[#fbf6ee] p-4 text-[14px] leading-[21px] text-[#5c4524]">
          Gerade kamen sehr viele Anfragen von deinem Anschluss. Bitte versuch es in ein paar Minuten erneut oder ruf uns direkt an:{" "}
          <a href={CONTACT.phoneHref} className="font-medium underline underline-offset-2">
            {CONTACT.phone}
          </a>
          .
        </p>
      )}

      <div className="kf-row flex flex-col gap-3">
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] text-[16px] font-medium tracking-[-0.1px] text-[#0f0e0d] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate,opacity] duration-200 hover:brightness-105 active:translate-y-px disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <>
              <LoaderCircle className="size-[18px] animate-spin" strokeWidth={2} />
              Wird gesendet …
            </>
          ) : (
            <>
              Anfrage senden
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </>
          )}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[12.5px] text-[#7d7973]">
          <Lock className="size-3.5" strokeWidth={1.8} />
          Verschlüsselte Übertragung · kein Newsletter, kein Spam
        </p>
      </div>
    </form>
  );
}
