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

/** Budget is the lead-qualification filter — values stay low / mid / high / top as in the brief. */
export const TL_BUDGETS = [
  { value: "low", label: "Unter 1.000 €" },
  { value: "mid", label: "1.000 – 5.000 €" },
  { value: "high", label: "5.000 – 15.000 €" },
  { value: "top", label: "Über 15.000 €" },
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

export function validateLens(p: Partial<TlPayload>): TlErrors {
  const e: TlErrors = {};
  if (!normalizeWebsite(p.website ?? "")) e.website = "Bitte gib eine gültige Website an, z. B. deine-firma.de.";
  if (!TL_BRANCHEN.includes((p.branche ?? "") as never)) e.branche = "Bitte wähle deine Branche.";
  if (!TL_ZIELE.includes((p.ziel ?? "") as never)) e.ziel = "Bitte wähle dein Ziel.";
  if (!TL_BUDGETS.some((b) => b.value === p.budget)) e.budget = "Bitte wähle dein Budget.";
  const name = (p.name ?? "").trim();
  if (name.length < 2 || name.length > 100) e.name = "Bitte gib deinen Namen an.";
  const email = (p.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 160) e.email = "Bitte gib eine gültige E-Mail-Adresse an.";
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
