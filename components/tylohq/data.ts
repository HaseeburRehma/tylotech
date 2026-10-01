/* Demo data for the interactive TyloHQ mock. Nothing here is live client data. */

export type ViewId =
  | "dashboard"
  | "leistung"
  | "integrationen"
  | "ki"
  | "austausch"
  | "dokumente"
  | "hub"
  | "kunden"
  | "team"
  | "projekte"
  | "prompts";

export const CLIENTS = [
  { id: "fixdone", name: "Fixdone", init: "FD", paket: "Growth", status: "aktiv" },
  { id: "fahrschule", name: "Fahrschule Abgefahrn", init: "FA", paket: "Growth", status: "aktiv" },
  { id: "priya", name: "Priya's Reinigungsservice", init: "PR", paket: "Scale", status: "aktiv" },
  { id: "rohr", name: "Rohr Cleaner", init: "RC", paket: "Growth", status: "aktiv" },
  { id: "lokshift", name: "LokShift", init: "LS", paket: "Start", status: "Onboarding" },
  { id: "nouh", name: "Nouh-Wehres", init: "NW", paket: "Start", status: "aktiv" },
] as const;
export type ClientId = (typeof CLIENTS)[number]["id"];

/* ---- dashboard (Figma "HQ · Dashboard") -------------------------------- */

export type Month = "September 2026" | "August 2026" | "Juli 2026";
export const MONTHS: Month[] = ["September 2026", "August 2026", "Juli 2026"];

type Kpi = { value: string; delta: string; down?: boolean };
export const DASH: Record<
  Month,
  {
    labels: string[];
    budget: number[]; // € per 3-day bucket
    leads: number[]; // leads per 3-day bucket
    kpi: { budget: Kpi; leads: Kpi; cpl: Kpi; kunden: Kpi };
    kunden: number[];
  }
> = {
  "September 2026": {
    labels: ["26.8", "29.8", "1.9", "4.9", "6.9", "9.9", "12.9", "15.9", "18.9", "20.9", "22.9", "24.9"],
    budget: [90, 115, 103, 139, 157, 142, 184, 205, 190, 235, 256, 293],
    leads: [4.4, 4.6, 4.2, 3.9, 4.1, 3.5, 3.7, 3.2, 3.4, 2.9, 2.6, 2.4],
    kpi: {
      budget: { value: "2.109 €", delta: "+101,8 %" },
      leads: { value: "39", delta: "+100 %" },
      cpl: { value: "54,08 €", delta: "−24,6 %", down: true },
      kunden: { value: "10", delta: "+1" },
    },
    kunden: [9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10],
  },
  "August 2026": {
    labels: ["27.7", "30.7", "2.8", "5.8", "8.8", "11.8", "14.8", "17.8", "20.8", "23.8", "26.8", "29.8"],
    budget: [70, 78, 85, 80, 92, 88, 95, 90, 96, 92, 88, 91],
    leads: [1.4, 1.8, 1.5, 1.9, 1.6, 1.4, 1.7, 1.5, 1.8, 1.6, 1.4, 1.4],
    kpi: {
      budget: { value: "1.045 €", delta: "+12,4 %" },
      leads: { value: "19", delta: "+5,6 %" },
      cpl: { value: "55,00 €", delta: "+6,4 %" },
      kunden: { value: "9", delta: "+2" },
    },
    kunden: [7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
  },
  "Juli 2026": {
    labels: ["27.6", "30.6", "3.7", "6.7", "9.7", "12.7", "15.7", "18.7", "21.7", "24.7", "27.7", "30.7"],
    budget: [72, 75, 70, 78, 80, 76, 82, 79, 74, 81, 80, 83],
    leads: [1.2, 1.6, 1.4, 1.5, 1.8, 1.3, 1.6, 1.5, 1.4, 1.6, 1.7, 1.4],
    kpi: {
      budget: { value: "930 €", delta: "+8,1 %" },
      leads: { value: "18", delta: "+12,5 %" },
      cpl: { value: "51,67 €", delta: "−3,9 %", down: true },
      kunden: { value: "7", delta: "+1" },
    },
    kunden: [6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7],
  },
};

export const INTEGRATIONS = [
  { id: "meta", name: "Meta Ads", logo: "/icons/brands/meta.svg", hint: "Ohne Meta fehlen Werbebudget, Leads und ROAS im Portal." },
  { id: "gads", name: "Google Ads", logo: "/icons/brands/google-ads.svg", hint: "Such- und Displaykampagnen laufen an der Auswertung vorbei." },
  { id: "ga4", name: "GA4", logo: "/icons/brands/google-analytics.svg", hint: "Sitzungen lassen sich noch keiner Kampagne zuordnen." },
  { id: "sc", name: "Search Console", logo: "/icons/brands/google.svg", hint: "Rankings, Klicks und Impressionen aus der Google-Suche." },
  { id: "tiktok", name: "TikTok Ads", logo: "/icons/brands/tiktok.svg", hint: "Reichweite und Recruiting-Kampagnen." },
  { id: "linkedin", name: "LinkedIn Ads", logo: "/icons/brands/linkedin.svg", hint: "B2B-Leads und Lead-Gen-Formulare." },
] as const;
export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export type Task = { id: number; title: string; meta: string; due: string; blocker?: boolean; done?: boolean };
export const TASKS: Task[] = [
  { id: 1, title: "Meta Ads für Fixdone verbinden", meta: "Einrichtung · Growth", due: "Heute", blocker: true },
  { id: 2, title: "Projektplan für LokShift anlegen", meta: "Projekte · seit Sep 2026", due: "Fr, 26.9." },
  { id: 3, title: "Monatsbericht September vorbereiten", meta: "Berichte · 10 Kunden", due: "Mo, 29.9." },
  { id: 4, title: "Search Console für Nouh-Wehres prüfen", meta: "SEO · Abdul", due: "erledigt", done: true },
];

/* ---- performance ("Leistung") ------------------------------------------- */

export type Range = "7 T" | "30 T" | "90 T" | "Jahr";
export const RANGES: Range[] = ["7 T", "30 T", "90 T", "Jahr"];

export type Source = "all" | "meta" | "gads" | "ga4" | "sc";
export const SOURCES: { id: Source; label: string }[] = [
  { id: "all", label: "Alle Quellen" },
  { id: "meta", label: "Meta Ads" },
  { id: "gads", label: "Google Ads" },
  { id: "ga4", label: "GA4" },
  { id: "sc", label: "Search Console" },
];

type MetricDef = { key: string; label: string; base: number; unit?: "€" | "%"; chart?: boolean; avg?: boolean };
export const METRICS: Record<Source, MetricDef[]> = {
  all: [
    { key: "leads", label: "Leads", base: 3.2, chart: true },
    { key: "klicks", label: "Klicks", base: 260, chart: true },
    { key: "impr", label: "Impressionen", base: 11800, chart: true },
  ],
  meta: [
    { key: "reach", label: "Reichweite", base: 4200, chart: true },
    { key: "klicks", label: "Klicks", base: 96, chart: true },
    { key: "leads", label: "Leads", base: 1.9, chart: true },
  ],
  gads: [
    { key: "klicks", label: "Klicks", base: 64, chart: true },
    { key: "conv", label: "Conversions", base: 1.4, chart: true },
    { key: "kosten", label: "Kosten", base: 38, unit: "€", chart: true },
  ],
  ga4: [
    { key: "sessions", label: "Sitzungen", base: 230, chart: true },
    { key: "users", label: "Nutzer", base: 184, chart: true },
    { key: "cr", label: "Conversion-Rate", base: 2.7, unit: "%", avg: true },
  ],
  sc: [
    { key: "klicks", label: "Klicks", base: 150, chart: true },
    { key: "impr", label: "Impressionen", base: 7290, chart: true },
    { key: "pos", label: "Ø Position", base: 8, avg: true },
  ],
};

/** Small deterministic PRNG so every view is stable between renders. */
export function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

const MONTHS_SHORT = ["Okt", "Nov", "Dez", "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep"];

export function rangeLabels(range: Range) {
  if (range === "Jahr") return MONTHS_SHORT;
  const n = range === "7 T" ? 7 : range === "30 T" ? 30 : 45;
  const step = range === "90 T" ? 2 : 1;
  const end = new Date(2026, 8, 24);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - i) * step);
    return `${d.getDate()}.${d.getMonth() + 1}`;
  });
}

export function series(seed: string, n: number, base: number, growth = 0.35) {
  const r = rng(seed);
  const phase = r() * 6;
  const freq = 0.45 + r() * 0.5;
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 1 : i / (n - 1);
    const wave = 0.26 * Math.sin(i * freq + phase) + 0.12 * Math.sin(i * freq * 2.3 + phase * 1.7);
    const noise = (r() - 0.5) * 0.22;
    return Math.max(base * 0.12, base * (1 + growth * t) * (1 + wave + noise));
  });
}

export const de = (v: number, digits = 0) =>
  v.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function niceMax(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nf = f <= 1.2 ? 1.2 : f <= 1.6 ? 1.6 : f <= 2 ? 2 : f <= 2.4 ? 2.4 : f <= 3 ? 3 : f <= 4 ? 4 : f <= 6 ? 6 : f <= 8 ? 8 : 10;
  return nf * exp;
}

/* ---- KI-Tools ------------------------------------------------------------- */

export const KI_TOOLS = [
  {
    id: "ad",
    title: "Anzeigentext",
    desc: "Meta & Google Ads",
    out: (c: string) =>
      `Headline: Diese Woche noch Termine frei.\nText: ${c} – schnell, zuverlässig und mit festen Preisen. In 60 Sekunden anfragen, Rückmeldung am selben Tag.\nCTA: Jetzt Termin sichern`,
  },
  {
    id: "seo",
    title: "SEO-Meta",
    desc: "Title & Description",
    out: (c: string) =>
      `Title: ${c} | Termin in 60 Sekunden anfragen\nDescription: Ehrliche Beratung, feste Preise und schnelle Rückmeldung. Über 120 Bewertungen mit 4,9 ★ – jetzt unverbindlich anfragen.`,
  },
  {
    id: "social",
    title: "Social-Post",
    desc: "Instagram & LinkedIn",
    out: (c: string) =>
      `Hinter jedem Termin steckt ein Team, das es ernst meint. 👋\nBei ${c} bekommst du keine Warteschleife, sondern eine Antwort – am selben Tag.\n#lokal #qualität #team`,
  },
  {
    id: "mail",
    title: "E-Mail-Betreff",
    desc: "Newsletter & Follow-up",
    out: (c: string) =>
      `1. Kurze Frage zu deiner Anfrage bei ${c}\n2. Dein Termin wartet noch auf dich\n3. Nur noch 3 freie Plätze im Oktober`,
  },
];

/* ---- Dokumente ------------------------------------------------------------ */

export const DOCS = [
  { name: "Monatsbericht August 2026.pdf", type: "Berichte", size: "2,4 MB", date: "02.09.2026" },
  { name: "Rahmenvertrag TyloTech.pdf", type: "Verträge", size: "380 KB", date: "14.06.2026" },
  { name: "Kampagnen-Assets Herbst.zip", type: "Assets", size: "48 MB", date: "18.09.2026" },
  { name: "Keyword-Recherche Q4.xlsx", type: "Berichte", size: "1,1 MB", date: "11.09.2026" },
  { name: "Logo-Paket & Farben.zip", type: "Assets", size: "12 MB", date: "03.07.2026" },
  { name: "Auftragsverarbeitung (AVV).pdf", type: "Verträge", size: "210 KB", date: "14.06.2026" },
  { name: "Monatsbericht Juli 2026.pdf", type: "Berichte", size: "2,1 MB", date: "04.08.2026" },
];

export const TEAM = [
  { name: "Ilias El Aradi", role: "Gründer · Strategie", img: "/team/ilias-el-aradi.jpg", online: true },
  { name: "Lena Brandt", role: "Performance Marketing", img: "/team/lena-brandt.png", online: true },
  { name: "Marc Hoffmann", role: "Webentwicklung", img: "/team/marc-hoffmann.png", online: false },
  { name: "Aylin Demir", role: "Content & Social", img: "/team/aylin-demir.png", online: true },
  { name: "Jonas Reiter", role: "SEO", img: "/team/jonas-reiter.png", online: false },
  { name: "Sabine Kraus", role: "Projektleitung", img: "/team/sabine-kraus.png", online: true },
];

export const PROJECTS = [
  { name: "Website-Relaunch Fixdone", phase: "Umsetzung", progress: 72, due: "15.10." },
  { name: "Meta-Kampagne Herbst · Fahrschule Abgefahrn", phase: "Live", progress: 100, due: "läuft" },
  { name: "Local SEO · Priya's Reinigungsservice", phase: "Optimierung", progress: 58, due: "laufend" },
  { name: "Onboarding LokShift", phase: "Kick-off", progress: 18, due: "03.10." },
  { name: "Recruiting-Funnel Rohr Cleaner", phase: "Konzept", progress: 34, due: "22.10." },
];
