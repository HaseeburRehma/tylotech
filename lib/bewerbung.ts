import type { Locale } from "./i18n";

/* App-Bauplan application (software landing page): shared by the 6-step form
 * (client) and /api/bewerbung (server). Select/radio/checkbox values are fixed
 * keys; the server only accepts these, the labels are for display and e-mails. */

type Option<V extends string> = { value: V; de: string; en: string };

export const MITARBEITER = [
  { value: "1-5", de: "1–5", en: "1–5" },
  { value: "6-20", de: "6–20", en: "6–20" },
  { value: "21-50", de: "21–50", en: "21–50" },
  { value: "51-200", de: "51–200", en: "51–200" },
  { value: "200+", de: "über 200", en: "over 200" },
] as const satisfies readonly Option<string>[];

export const TOOLS = [
  { value: "excel", de: "Excel", en: "Excel" },
  { value: "whatsapp", de: "WhatsApp", en: "WhatsApp" },
  { value: "software", de: "Andere Software", en: "Other software" },
  { value: "zettel", de: "Zettel", en: "Paper" },
] as const satisfies readonly Option<string>[];

export const BUDGETS = [
  { value: "lt20", de: "unter 20.000 €", en: "under €20,000" },
  { value: "20-50", de: "20.000–50.000 €", en: "€20,000–50,000" },
  { value: "gt50", de: "50.000 €+", en: "€50,000+" },
  { value: "unklar", de: "noch unklar", en: "not sure yet" },
] as const satisfies readonly Option<string>[];

export const STARTS = [
  { value: "sofort", de: "sofort", en: "right away" },
  { value: "1-3", de: "1–3 Monate", en: "1–3 months" },
  { value: "3-6", de: "3–6 Monate", en: "3–6 months" },
  { value: "info", de: "nur informieren", en: "just looking" },
] as const satisfies readonly Option<string>[];

export type Mitarbeiter = (typeof MITARBEITER)[number]["value"];
export type Tool = (typeof TOOLS)[number]["value"];
export type Budget = (typeof BUDGETS)[number]["value"];
export type Start = (typeof STARTS)[number]["value"];

export const BW_LIMITS = { branche: 80, problem: 2000, name: 100, company: 120, email: 160, phone: 40 } as const;

export type Bewerbung = {
  branche: string;
  mitarbeiter: Mitarbeiter | "";
  problem: string;
  tools: Tool[];
  budget: Budget | "";
  start: Start | "";
  name: string;
  company: string;
  email: string;
  phone: string;
  consent: boolean;
};

export type BewerbungPayload = Bewerbung & {
  /** honeypot — must stay empty */
  website: string;
  /** ms the form was open before submit (bots submit instantly) */
  elapsed: number;
  locale?: Locale;
};

export type BwField = keyof Bewerbung;
export type BwErrors = Partial<Record<BwField, string>>;

/** which fields each of the 6 steps owns (validation runs per step) */
export const STEP_FIELDS: BwField[][] = [
  ["branche", "mitarbeiter"],
  ["problem"],
  ["tools"],
  ["budget"],
  ["start"],
  ["name", "company", "email", "phone", "consent"],
];

const has = <V extends string>(list: readonly Option<V>[], v: unknown): v is V => list.some((o) => o.value === v);
export const isMitarbeiter = (v: unknown): v is Mitarbeiter => has(MITARBEITER, v);
export const isTool = (v: unknown): v is Tool => has(TOOLS, v);
export const isBudget = (v: unknown): v is Budget => has(BUDGETS, v);
export const isStart = (v: unknown): v is Start => has(STARTS, v);

/** display label for an option key */
export function optionLabel<V extends string>(list: readonly Option<V>[], v: string, locale: Locale = "de") {
  const o = list.find((x) => x.value === v);
  return o ? (locale === "en" ? o.en : o.de) : v;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validate all fields, or only those of the given step (0-based). */
export function validateBewerbung(p: Partial<Bewerbung>, locale: Locale = "de", step?: number): BwErrors {
  const en = locale === "en";
  const only = step === undefined ? null : new Set(STEP_FIELDS[step]);
  const want = (f: BwField) => !only || only.has(f);
  const e: BwErrors = {};
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (want("branche")) {
    const v = s(p.branche);
    if (v.length < 2) e.branche = en ? "Please tell us your industry." : "Bitte gib deine Branche an.";
    else if (v.length > BW_LIMITS.branche) e.branche = en ? "That’s a bit long." : "Das ist etwas zu lang.";
  }
  if (want("mitarbeiter") && !isMitarbeiter(p.mitarbeiter)) e.mitarbeiter = en ? "Please choose your team size." : "Bitte wähle die Anzahl der Mitarbeiter.";
  if (want("problem")) {
    const v = s(p.problem);
    if (v.length < 10) e.problem = en ? "Tell us briefly what isn’t running smoothly (at least 10 characters)." : "Beschreib kurz, was nicht rund läuft (mind. 10 Zeichen).";
    else if (v.length > BW_LIMITS.problem) e.problem = en ? `${BW_LIMITS.problem} characters maximum.` : `Maximal ${BW_LIMITS.problem} Zeichen.`;
  }
  if (want("tools") && (!Array.isArray(p.tools) || p.tools.length === 0 || !p.tools.every(isTool)))
    e.tools = en ? "Choose at least one option." : "Wähle mindestens eine Option.";
  if (want("budget") && !isBudget(p.budget)) e.budget = en ? "Please choose a budget." : "Bitte wähle ein Budget.";
  if (want("start") && !isStart(p.start)) e.start = en ? "Please choose when you’d like to start." : "Bitte wähle einen Zeitraum.";
  if (want("name")) {
    const v = s(p.name);
    if (v.length < 2) e.name = en ? "Please enter your name." : "Bitte gib deinen Namen an.";
    else if (v.length > BW_LIMITS.name) e.name = en ? "That name is too long." : "Der Name ist zu lang.";
  }
  if (want("company")) {
    const v = s(p.company);
    if (v.length < 2) e.company = en ? "Please enter your company." : "Bitte gib deinen Betrieb an.";
    else if (v.length > BW_LIMITS.company) e.company = en ? "That’s a bit long." : "Das ist etwas zu lang.";
  }
  if (want("email")) {
    const v = s(p.email);
    if (!EMAIL_RE.test(v) || v.length > BW_LIMITS.email) e.email = en ? "Please enter a valid email address." : "Bitte gib eine gültige E-Mail-Adresse an.";
  }
  if (want("phone")) {
    const v = s(p.phone);
    if (v && (!/^[+\d][\d\s/()-]{4,}$/.test(v) || v.length > BW_LIMITS.phone)) e.phone = en ? "Please check the phone number." : "Bitte prüfe die Telefonnummer.";
  }
  if (want("consent") && p.consent !== true)
    e.consent = en ? "Please agree so we can get in touch." : "Bitte stimme zu, damit wir dich kontaktieren dürfen.";
  return e;
}
