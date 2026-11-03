"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CircleCheck, Loader2, Phone } from "lucide-react";
import Select from "@/components/ui/Select";
import { GEWERKE, AN_LIMITS, validateAnalyse, type Analyse } from "@/lib/analyse";
import { formAttribution } from "@/lib/attribution";
import { trackMetaLead } from "@/lib/metaPixel";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/cn";

/* "Kostenlose Konkurrenz-Analyse" card in the hero (Figma 01 · Hero, right column).
 * Sends to /api/analyse (team e-mail + TyloHQ lead) and fires generate_lead + Meta Lead. */

const EMPTY: Analyse = { gewerk: "", stadt: "", site: "", name: "", phone: "", consent: false };
const OPTIONS = GEWERKE.map((g) => ({ value: g, label: g }));

const field =
  "h-14 w-full rounded-[12px] border bg-white px-[17px] text-[16px] leading-6 tracking-[-0.16px] text-[#1a1917] outline-none transition-[border-color,box-shadow] placeholder:text-[#8f8a82] focus:border-[#b98f53] focus:shadow-[0_0_0_4px_rgba(209,170,113,0.18)]";
const ok = "border-[#e2e0dc] hover:border-[#cbc8c2]";
const bad = "border-[#c0392b] focus:border-[#c0392b] focus:shadow-[0_0_0_4px_rgba(192,57,43,0.12)]";

export default function AnalyseForm() {
  const [v, setV] = useState<Analyse>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Analyse, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [fax, setFax] = useState("");
  const opened = useRef(0);
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const set = <K extends keyof Analyse>(k: K, val: Analyse[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateAnalyse(v);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`an-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, fax, elapsed: Date.now() - opened.current, attribution: formAttribution() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      const w = window as Window & { dataLayer?: unknown[] };
      (w.dataLayer ??= []).push({ event: "generate_lead", lead_source: "handwerk_analyse", language: "de", gewerk: v.gewerk });
      trackMetaLead("handwerk_analyse", { phone: v.phone, name: v.name }, { gewerk: v.gewerk });
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center gap-4" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-[#e7f4ed]">
          <CircleCheck className="size-7 text-[#1e7a52]" strokeWidth={1.8} aria-hidden />
        </span>
        <h3 className="t-h4 text-[#1a1917]">Danke, {v.name.split(" ")[0]}. Wir prüfen {v.stadt}.</h3>
        <p className="t-body-m text-[#5c5954]">
          Wir schauen uns an, welche Betriebe im Bereich {v.gewerk} in {v.stadt} gerade vorne liegen, und rufen dich innerhalb von 24 Stunden unter {v.phone} an.
        </p>
      </div>
    );
  }

  const err = (k: keyof Analyse) =>
    errors[k] ? (
      <p id={`an-${k}-err`} className="mt-1.5 text-[13px] leading-5 text-[#c0392b]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        <div>
          <label htmlFor="an-gewerk" className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
            Gewerk
          </label>
          <Select
            id="an-gewerk"
            value={v.gewerk}
            onChange={(g) => set("gewerk", g)}
            options={OPTIONS}
            placeholder="Bitte wählen"
            invalid={!!errors.gewerk}
            describedBy={errors.gewerk ? "an-gewerk-err" : undefined}
            className={cn(field, "flex items-center justify-between text-left", errors.gewerk ? bad : ok)}
            placeholderClassName="text-[#8f8a82]"
          />
          {err("gewerk")}
        </div>
        <div>
          <label htmlFor="an-stadt" className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
            Stadt
          </label>
          <input
            id="an-stadt"
            value={v.stadt}
            onChange={(e) => set("stadt", e.target.value)}
            maxLength={AN_LIMITS.stadt}
            autoComplete="address-level2"
            placeholder="z. B. Düsseldorf"
            aria-invalid={!!errors.stadt}
            aria-describedby={errors.stadt ? "an-stadt-err" : undefined}
            className={cn(field, errors.stadt ? bad : ok)}
          />
          {err("stadt")}
        </div>
        <div>
          <label htmlFor="an-site" className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
            Website (optional)
          </label>
          <input
            id="an-site"
            value={v.site}
            onChange={(e) => set("site", e.target.value)}
            maxLength={AN_LIMITS.site}
            inputMode="url"
            autoComplete="url"
            placeholder="www.dein-betrieb.de"
            aria-invalid={!!errors.site}
            aria-describedby={errors.site ? "an-site-err" : undefined}
            className={cn(field, errors.site ? bad : ok)}
          />
          {err("site")}
        </div>
        <div>
          <label htmlFor="an-name" className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
            Name
          </label>
          <input
            id="an-name"
            value={v.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={AN_LIMITS.name}
            autoComplete="name"
            placeholder="Vor- und Nachname"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "an-name-err" : undefined}
            className={cn(field, errors.name ? bad : ok)}
          />
          {err("name")}
        </div>
      </div>

      <div>
        <label htmlFor="an-phone" className="mb-2 block text-[14px] font-medium leading-5 text-[#1a1917]">
          Telefon
        </label>
        <div className="relative">
          <Phone className="pointer-events-none absolute left-[17px] top-1/2 size-5 -translate-y-1/2 text-[#1a1917]" strokeWidth={1.7} aria-hidden />
          <input
            id="an-phone"
            type="tel"
            value={v.phone}
            onChange={(e) => set("phone", e.target.value)}
            maxLength={AN_LIMITS.phone}
            autoComplete="tel"
            placeholder="0211 1234567"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "an-phone-err" : undefined}
            className={cn(field, "pl-[48px]", errors.phone ? bad : ok)}
          />
        </div>
        {err("phone")}
      </div>

      {/* honeypot: hidden from people, bots fill it */}
      <input type="text" name="fax" value={fax} onChange={(e) => setFax(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[22px] text-[#5c5954]">
          <input
            id="an-consent"
            type="checkbox"
            checked={v.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "an-consent-err" : undefined}
            className={cn("mt-0.5 size-5 shrink-0 cursor-pointer rounded-[5px] accent-[#002e3d]", errors.consent && "outline outline-2 outline-[#c0392b]")}
          />
          <span>Ich bin einverstanden, dass TyloTech mich zur Analyse kontaktiert.</span>
        </label>
        {err("consent")}
      </div>

      <button
        type="submit"
        disabled={state === "sending"}
        className="group relative inline-flex h-[58px] w-full items-center justify-center gap-2.5 rounded-full px-6 t-button text-white shadow-[0_10px_24px_-8px_rgba(0,46,61,0.55),inset_0_1.5px_1.5px_rgba(255,255,255,0.18),inset_0_-1.5px_1.5px_rgba(0,0,0,0.25)] transition-[filter,translate] duration-200 [background:linear-gradient(180deg,#2d5261_0%,#0f3442_55%,#06222c_100%)] hover:brightness-110 active:translate-y-px disabled:cursor-wait disabled:opacity-80"
      >
        {state === "sending" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : null}
        {state === "sending" ? "Wird gesendet …" : "Kostenlose Konkurrenz-Analyse sichern"}
        {state !== "sending" && <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />}
      </button>

      {state === "failed" ? (
        <p className="text-center text-[13px] leading-5 text-[#c0392b]" role="alert">
          Das hat gerade nicht geklappt. Ruf uns direkt an:{" "}
          <a href={CONTACT.phoneHref} className="font-medium underline">
            {CONTACT.phone}
          </a>
        </p>
      ) : (
        <p className="text-center text-[13px] leading-5 text-[#7d7973]">
          Kostenlos und unverbindlich.{" "}
          <a href="/datenschutz" target="_blank" rel="noopener" className="underline-offset-2 hover:text-[#1a1917] hover:underline">
            Keine Weitergabe deiner Daten.
          </a>
        </p>
      )}
    </form>
  );
}
