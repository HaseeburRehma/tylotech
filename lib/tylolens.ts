/* TyloLens — scroll-triggered lead tool (dev brief: "TyloLens_Dev_Brief.pdf").
   Shared by the modal (client) and /api/tylolens (server). Keep exactly these six fields. */

export const TL_BRANCHEN = [
  "Handwerk",
  "Lokaler Dienstleister",
  "E-Commerce",
  "B2B-Dienstleistung",
  "Finanz & Investment",
  "Gesundheit / Praxis",
  "Immobilien",
  "Sonstiges",
] as const;

export const TL_ZIELE = ["Mehr Anfragen / Leads", "Bessere Google-Rankings", "Mehr Umsatz", "Personal finden", "Marke aufbauen"] as const;

/** English display labels for the English site. The submitted values stay German (canonical) —
 *  the server validates against TL_BRANCHEN / TL_ZIELE. */
export const TL_BRANCHEN_EN: Record<(typeof TL_BRANCHEN)[number], string> = {
  Handwerk: "Trades",
  "Lokaler Dienstleister": "Local services",
  "E-Commerce": "E-commerce",
  "B2B-Dienstleistung": "B2B services",
  "Finanz & Investment": "Finance & investment",
  "Gesundheit / Praxis": "Healthcare / practice",
  Immobilien: "Real estate",
  Sonstiges: "Other",
};
export const TL_ZIELE_EN: Record<(typeof TL_ZIELE)[number], string> = {
  "Mehr Anfragen / Leads": "More enquiries / leads",
  "Bessere Google-Rankings": "Better Google rankings",
  "Mehr Umsatz": "More revenue",
  "Personal finden": "Find staff",
  "Marke aufbauen": "Build the brand",
};

/** Budget is the lead-qualification filter — values stay low / mid / high / top as in the brief. */
export const TL_BUDGETS = [
  { value: "low", label: "Unter 1.000 €", labelEn: "Under €1,000" },
  { value: "mid", label: "1.000 – 5.000 €", labelEn: "€1,000 – 5,000" },
  { value: "high", label: "5.000 – 15.000 €", labelEn: "€5,000 – 15,000" },
  { value: "top", label: "Über 15.000 €", labelEn: "Over €15,000" },
] as const;
export type TlBudget = (typeof TL_BUDGETS)[number]["value"];

export const TL_PRIORITY: Record<TlBudget, { label: string; rank: number }> = {
  top: { label: "Höchste Priorität", rank: 1 },
  high: { label: "Hohe Priorität", rank: 2 },
  mid: { label: "Mittlere Priorität", rank: 3 },
  low: { label: "Niedrige Priorität", rank: 4 },
};

export type TlPayload = {
  website: string;
  branche: string;
  ziel: string;
  budget: string;
  name: string;
  email: string;
  /** honeypot — must stay empty */
  company: string;
  /** ms the modal was open before submit */
  elapsed: number;
  /** site language the form was sent from — the confirmation email follows it (default "de") */
  locale?: "de" | "en";
};

export type TlErrors = Partial<Record<"website" | "branche" | "ziel" | "budget" | "name" | "email", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "deine-firma.de" → "https://deine-firma.de"; returns null when it isn't a plausible public URL. */
export function normalizeWebsite(raw: string): string | null {
  const v = raw.trim();
  if (!v || v.length > 200) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!/^https?:$/.test(u.protocol)) return null;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i.test(u.hostname)) return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Validation messages per language (German is the default, used by the server). */
const MSG = {
  de: {
    website: "Bitte gib eine gültige Website an, z. B. deine-firma.de.",
    branche: "Bitte wähle deine Branche.",
    ziel: "Bitte wähle dein Ziel.",
    budget: "Bitte wähle dein Budget.",
    name: "Bitte gib deinen Namen an.",
    email: "Bitte gib eine gültige E-Mail-Adresse an.",
  },
  en: {
    website: "Please enter a valid website, e.g. your-company.com.",
    branche: "Please choose your industry.",
    ziel: "Please choose your goal.",
    budget: "Please choose your budget.",
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
  },
} satisfies Record<"de" | "en", Required<TlErrors>>;

export function validateLens(p: Partial<TlPayload>, locale: "de" | "en" = "de"): TlErrors {
  const m = MSG[locale] ?? MSG.de;
  const e: TlErrors = {};
  if (!normalizeWebsite(p.website ?? "")) e.website = m.website;
  if (!TL_BRANCHEN.includes((p.branche ?? "") as never)) e.branche = m.branche;
  if (!TL_ZIELE.includes((p.ziel ?? "") as never)) e.ziel = m.ziel;
  if (!TL_BUDGETS.some((b) => b.value === p.budget)) e.budget = m.budget;
  const name = (p.name ?? "").trim();
  if (name.length < 2 || name.length > 100) e.name = m.name;
  const email = (p.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 160) e.email = m.email;
  return e;
}

/** analytics: tylolens_shown / tylolens_dismissed / tylolens_submitted (GTM dataLayer, gtag, Plausible if present) */
export function trackLens(event: "tylolens_shown" | "tylolens_dismissed" | "tylolens_submitted", props: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
    plausible?: (e: string, o?: { props: Record<string, string> }) => void;
  };
  (w.dataLayer ??= []).push({ event, ...props });
  w.gtag?.("event", event, props);
  w.plausible?.(event, { props });
  window.dispatchEvent(new CustomEvent("tylolens:track", { detail: { event, ...props } }));
}
