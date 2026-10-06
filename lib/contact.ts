import { BRANCHEN } from "./branchen";
import type { Locale } from "./i18n";

/* Shared by the contact form (client) and /api/kontakt (server). */

export const CONTACT = {
  email: "info@tylotech.de",
  phone: "0211 15847097",
  /** international format for English pages */
  phoneIntl: "+49 211 15847097",
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
export type Topic = (typeof TOPICS)[number];

/** English labels — the German strings above stay the canonical values the API validates. */
export const TOPIC_EN: Record<Topic, string> = {
  "Marketing & Performance": "Marketing & Performance",
  "Website & Software": "Website & Software",
  "SEO & KI-Sichtbarkeit": "SEO & AI Visibility",
  Unternehmensaufbau: "Business Building",
  Digitalisierung: "Digitalisation",
  "Etwas anderes": "Something else",
};

/** Topic label for a locale (unknown values are returned as they are). */
export const topicLabel = (t: string, locale: Locale) => (locale === "en" ? (TOPIC_EN[t as Topic] ?? t) : t);

const BRANCHE_EN: Record<string, string> = {
  handwerk: "Trades & Crafts",
  "lokale-dienstleister": "Local Services",
  "online-dienstleistungen": "Online Services",
  "e-commerce": "E-Commerce",
  "b2b-dienstleistung": "B2B Services",
  "finanz-investment": "Finance & Investment",
};

/** `value` is the German slug the API validates, `label` the German name used in e-mails, `labelEn` for the English site. */
export const BRANCHE_OPTIONS = [
  ...BRANCHEN.map((b) => ({ value: b.slug, label: b.name, labelEn: BRANCHE_EN[b.slug] ?? b.name })),
  { value: "andere", label: "Andere Branche", labelEn: "Other industry" },
];

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
  /** language of the page the form was sent from (customer confirmation e-mail) */
  locale?: Locale;
};

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(p: Partial<ContactPayload>, locale: Locale = "de"): FieldErrors {
  const en = locale === "en";
  const e: FieldErrors = {};
  const name = (p.name ?? "").trim();
  const email = (p.email ?? "").trim();
  const phone = (p.phone ?? "").trim();
  const message = (p.message ?? "").trim();
  if (name.length < 2) e.name = en ? "Please enter your name." : "Bitte gib deinen Namen an.";
  else if (name.length > LIMITS.name) e.name = en ? "That name is too long." : "Der Name ist zu lang.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) e.email = en ? "Please enter a valid email address." : "Bitte gib eine gültige E-Mail-Adresse an.";
  if (phone && !/^[+\d][\d\s/()-]{4,}$/.test(phone)) e.phone = en ? "Please check the phone number." : "Bitte prüfe die Telefonnummer.";
  if (message.length < 10) e.message = en ? "Tell us briefly what it's about (at least 10 characters)." : "Erzähl uns kurz, worum es geht (mind. 10 Zeichen).";
  else if (message.length > LIMITS.message) e.message = en ? `${LIMITS.message} characters maximum.` : `Maximal ${LIMITS.message} Zeichen.`;
  if (!p.consent) e.consent = en ? "Please agree to us processing your details." : "Bitte stimme der Verarbeitung deiner Angaben zu.";
  return e;
}
