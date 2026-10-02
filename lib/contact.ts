import { BRANCHEN } from "./branchen";

/* Shared by the contact form (client) and /api/kontakt (server). */

export const CONTACT = {
  email: "info@tylotech.de",
  phone: "0211 15847097",
  phoneHref: "tel:+4921115847097",
  street: "Behrenstraße 4",
  city: "40233 Düsseldorf",
  mapsQuery: "TyloTech, Behrenstraße 4, 40233 Düsseldorf",
} as const;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&z=16&output=embed`;
export const mapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACT.mapsQuery)}`;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapsQuery)}`;

export const TOPICS = [
  "Marketing & Performance",
  "Website & Software",
  "SEO & KI-Sichtbarkeit",
  "Unternehmensaufbau",
  "Digitalisierung",
  "Etwas anderes",
] as const;

export const BRANCHE_OPTIONS = [...BRANCHEN.map((b) => ({ value: b.slug, label: b.name })), { value: "andere", label: "Andere Branche" }];

export const LIMITS = { name: 100, company: 120, email: 160, phone: 40, message: 4000 } as const;

export type ContactPayload = {
  name: string;
  company: string;
  email: string;
  phone: string;
  branche: string;
  topics: string[];
  message: string;
  consent: boolean;
  /** honeypot — must stay empty */
  website: string;
  /** ms the form was open before submit (bots submit instantly) */
  elapsed: number;
};

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(p: Partial<ContactPayload>): FieldErrors {
  const e: FieldErrors = {};
  const name = (p.name ?? "").trim();
  const email = (p.email ?? "").trim();
  const phone = (p.phone ?? "").trim();
  const message = (p.message ?? "").trim();
  if (name.length < 2) e.name = "Bitte gib deinen Namen an.";
  else if (name.length > LIMITS.name) e.name = "Der Name ist zu lang.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) e.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (phone && !/^[+\d][\d\s/()-]{4,}$/.test(phone)) e.phone = "Bitte prüfe die Telefonnummer.";
  if (message.length < 10) e.message = "Erzähl uns kurz, worum es geht (mind. 10 Zeichen).";
  else if (message.length > LIMITS.message) e.message = `Maximal ${LIMITS.message} Zeichen.`;
  if (!p.consent) e.consent = "Bitte stimme der Verarbeitung deiner Angaben zu.";
  return e;
}
