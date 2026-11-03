/* Free competitor analysis form (Handwerk landing page /handwerk-anfragen).
 * Shared by the form and app/api/analyse so both check the same rules. */

export const GEWERKE = [
  "Sanitär, Heizung & SHK",
  "Elektro",
  "Dachdecker",
  "Maler & Bodenleger",
  "Solar- & Energietechnik",
  "GaLaBau",
  "Rohrreinigung & Schlüsseldienst",
  "Wärmepumpe",
  "Maler und Lackierer",
  "Fliesenleger",
  "Fensterbau",
  "Klimatechnik",
  "Gerüstbau",
  "Trockenbau",
  "Schreiner und Tischler",
  "Anderes Gewerk",
] as const;

export const AN_LIMITS = { stadt: 80, site: 200, name: 100, phone: 40, message: 1000 };

export type Analyse = {
  gewerk: string;
  stadt: string;
  site: string;
  name: string;
  phone: string;
  /** optional free text */
  message: string;
  consent: boolean;
};

export type AnalysePayload = Analyse & {
  /** honeypot, must stay empty */
  fax?: string;
  /** ms between opening the page and sending */
  elapsed?: number;
  attribution?: unknown;
};

export const isGewerk = (v: unknown): v is (typeof GEWERKE)[number] => typeof v === "string" && (GEWERKE as readonly string[]).includes(v);

export function validateAnalyse(a: Analyse) {
  const e: Partial<Record<keyof Analyse, string>> = {};
  if (!isGewerk(a.gewerk)) e.gewerk = "Bitte wähle dein Gewerk.";
  if (a.stadt.trim().length < 2) e.stadt = "In welcher Stadt arbeitest du?";
  if (a.site && !/^(https?:\/\/)?[a-z0-9äöüß-]+(\.[a-z0-9äöüß-]+)+(\/\S*)?$/i.test(a.site.trim())) e.site = "Bitte prüfe die Adresse, z. B. www.dein-betrieb.de.";
  if (a.name.trim().length < 2) e.name = "Wie heißt du?";
  if (a.phone.replace(/\D/g, "").length < 6) e.phone = "Unter welcher Nummer erreichen wir dich?";
  if (!a.consent) e.consent = "Bitte bestätige, dass wir dich anrufen dürfen.";
  return e;
}
