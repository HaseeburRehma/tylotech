/* Demo data for the interactive TyloHQ mock. Nothing here is live client data.
 * German strings double as ids/state keys; English copy sits alongside in `en`. */

import { formatNumber, type Locale } from "@/lib/i18n";

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
export const MONTH_EN: Record<Month, string> = {
  "September 2026": "September 2026",
  "August 2026": "August 2026",
  "Juli 2026": "July 2026",
};

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
    budget: [442, 564, 505, 682, 770, 697, 903, 1006, 932, 1153, 1256, 1436],
    leads: [42, 44, 45, 47, 46, 48, 49, 50, 48, 51, 53, 55],
    kpi: {
      budget: { value: "10.346 €", delta: "+2,8 %" },
      leads: { value: "578", delta: "+6,8 %" },
      cpl: { value: "17,90 €", delta: "−3,8 %", down: true },
      kunden: { value: "10", delta: "+1" },
    },
    kunden: [9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10],
  },
  "August 2026": {
    labels: ["27.7", "30.7", "2.8", "5.8", "8.8", "11.8", "14.8", "17.8", "20.8", "23.8", "26.8", "29.8"],
    budget: [674, 751, 819, 770, 886, 847, 915, 867, 924, 886, 847, 877],
    leads: [42, 44, 43, 45, 44, 46, 45, 46, 45, 47, 46, 48],
    kpi: {
      budget: { value: "10.063 €", delta: "+1,3 %" },
      leads: { value: "541", delta: "+5,7 %" },
      cpl: { value: "18,60 €", delta: "−4,1 %", down: true },
      kunden: { value: "9", delta: "+2" },
    },
    kunden: [7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
  },
  "Juli 2026": {
    labels: ["27.6", "30.6", "3.7", "6.7", "9.7", "12.7", "15.7", "18.7", "21.7", "24.7", "27.7", "30.7"],
    budget: [769, 801, 748, 833, 854, 812, 876, 844, 790, 865, 854, 887],
    leads: [40, 42, 41, 43, 42, 43, 42, 44, 43, 44, 43, 45],
    kpi: {
      budget: { value: "9.933 €", delta: "+3,0 %" },
      leads: { value: "512", delta: "+4,1 %" },
      cpl: { value: "19,40 €", delta: "−2,5 %", down: true },
      kunden: { value: "7", delta: "+1" },
    },
    kunden: [6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7],
  },
};

export const INTEGRATIONS = [
  { id: "meta", name: "Meta Ads", logo: "/icons/brands/meta.svg", hint: "Ohne Meta fehlen Werbebudget, Leads und ROAS im Portal.", en: "Without Meta, ad spend, leads and ROAS are missing from the portal." },
  { id: "gads", name: "Google Ads", logo: "/icons/brands/google-ads.svg", hint: "Such- und Displaykampagnen laufen an der Auswertung vorbei.", en: "Search and display campaigns aren't showing up in your reporting." },
  { id: "ga4", name: "GA4", logo: "/icons/brands/google-analytics.svg", hint: "Sitzungen lassen sich noch keiner Kampagne zuordnen.", en: "Sessions can't be attributed to a campaign yet." },
  { id: "sc", name: "Search Console", logo: "/icons/brands/google.svg", hint: "Rankings, Klicks und Impressionen aus der Google-Suche.", en: "Rankings, clicks and impressions from Google Search." },
  { id: "tiktok", name: "TikTok Ads", logo: "/icons/brands/tiktok.svg", hint: "Reichweite und Recruiting-Kampagnen.", en: "Reach and recruiting campaigns." },
  { id: "linkedin", name: "LinkedIn Ads", logo: "/icons/brands/linkedin.svg", hint: "B2B-Leads und Lead-Gen-Formulare.", en: "B2B leads and lead gen forms." },
] as const;
export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

type TaskText = { title: string; meta: string; due: string };
export type Task = TaskText & { id: number; en: TaskText; blocker?: boolean; done?: boolean };
export const TASKS: Task[] = [
  { id: 1, title: "Meta Ads für Fixdone verbinden", meta: "Einrichtung · Growth", due: "Heute", blocker: true, en: { title: "Connect Meta Ads for Fixdone", meta: "Setup · Growth", due: "Today" } },
  { id: 2, title: "Projektplan für LokShift anlegen", meta: "Projekte · seit Sep 2026", due: "Fr, 26.9.", en: { title: "Create project plan for LokShift", meta: "Projects · since Sep 2026", due: "Fri, 26 Sep" } },
  { id: 3, title: "Monatsbericht September vorbereiten", meta: "Berichte · 10 Kunden", due: "Mo, 29.9.", en: { title: "Prepare September monthly report", meta: "Reports · 10 clients", due: "Mon, 29 Sep" } },
  { id: 4, title: "Search Console für Nouh-Wehres prüfen", meta: "SEO · Abdul", due: "erledigt", done: true, en: { title: "Check Search Console for Nouh-Wehres", meta: "SEO · Abdul", due: "done" } },
];

/* ---- performance ("Leistung") ------------------------------------------- */

export type Range = "7 T" | "30 T" | "90 T" | "Jahr";
export const RANGES: Range[] = ["7 T", "30 T", "90 T", "Jahr"];
export const RANGE_EN: Record<Range, string> = { "7 T": "7 D", "30 T": "30 D", "90 T": "90 D", Jahr: "Year" };

export type Source = "all" | "meta" | "gads" | "ga4" | "sc";
export const SOURCES: { id: Source; label: string; en: string }[] = [
  { id: "all", label: "Alle Quellen", en: "All sources" },
  { id: "meta", label: "Meta Ads", en: "Meta Ads" },
  { id: "gads", label: "Google Ads", en: "Google Ads" },
  { id: "ga4", label: "GA4", en: "GA4" },
  { id: "sc", label: "Search Console", en: "Search Console" },
];

type MetricDef = { key: string; label: string; en: string; base: number; unit?: "€" | "%"; chart?: boolean; avg?: boolean };
export const METRICS: Record<Source, MetricDef[]> = {
  all: [
    { key: "leads", label: "Leads", en: "Leads", base: 15.5, chart: true },
    { key: "klicks", label: "Klicks", en: "Clicks", base: 260, chart: true },
    { key: "impr", label: "Impressionen", en: "Impressions", base: 11800, chart: true },
  ],
  meta: [
    { key: "reach", label: "Reichweite", en: "Reach", base: 4200, chart: true },
    { key: "klicks", label: "Klicks", en: "Clicks", base: 96, chart: true },
    { key: "leads", label: "Leads", en: "Leads", base: 9.2, chart: true },
  ],
  gads: [
    { key: "klicks", label: "Klicks", en: "Clicks", base: 64, chart: true },
    { key: "conv", label: "Conversions", en: "Conversions", base: 1.4, chart: true },
    { key: "kosten", label: "Kosten", en: "Cost", base: 38, unit: "€", chart: true },
  ],
  ga4: [
    { key: "sessions", label: "Sitzungen", en: "Sessions", base: 230, chart: true },
    { key: "users", label: "Nutzer", en: "Users", base: 184, chart: true },
    { key: "cr", label: "Conversion-Rate", en: "Conversion rate", base: 2.7, unit: "%", avg: true },
  ],
  sc: [
    { key: "klicks", label: "Klicks", en: "Clicks", base: 150, chart: true },
    { key: "impr", label: "Impressionen", en: "Impressions", base: 7290, chart: true },
    { key: "pos", label: "Ø Position", en: "Avg. position", base: 8, avg: true },
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

const MONTHS_SHORT = {
  de: ["Okt", "Nov", "Dez", "Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep"],
  en: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
};

/** Chart axis day label: "26.8" in German, "26/8" in English. */
export const axisLabel = (locale: Locale, l: string) => (locale === "en" ? l.replace(".", "/") : l);

export function rangeLabels(range: Range, locale: Locale = "de") {
  if (range === "Jahr") return MONTHS_SHORT[locale];
  const n = range === "7 T" ? 7 : range === "30 T" ? 30 : 45;
  const step = range === "90 T" ? 2 : 1;
  const end = new Date(2026, 8, 24);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(end);
    d.setDate(end.getDate() - (n - 1 - i) * step);
    return axisLabel(locale, `${d.getDate()}.${d.getMonth() + 1}`);
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

export const num = (locale: Locale, v: number, digits = 0) =>
  formatNumber(locale, v, { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Euro amount: "1.234 €" (de) / "€1,234" (en). */
export const eur = (locale: Locale, v: number, digits = 0) =>
  locale === "en" ? `€${num(locale, v, digits)}` : `${num(locale, v, digits)} €`;

/** Re-spell a German-formatted figure for English: "10.346 €" → "€10,346", "−3,8 %" → "−3.8%", "2,4 MB" → "2.4 MB". */
export function figure(locale: Locale, s: string) {
  if (locale === "de") return s;
  return s
    .replace(/(\d)([.,])(?=\d)/g, (_, d: string, sep: string) => d + (sep === "." ? "," : "."))
    .replace(/^([+−-]?)(.+?) €$/, "$1€$2")
    .replace(/ %$/, "%");
}

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
    en: {
      title: "Ad copy",
      desc: "Meta & Google Ads",
      out: (c: string) =>
        `Headline: Slots still free this week.\nText: ${c} – fast, reliable and with fixed prices. Enquire in 60 seconds, hear back the same day.\nCTA: Book your slot now`,
    },
  },
  {
    id: "seo",
    title: "SEO-Meta",
    desc: "Title & Description",
    out: (c: string) =>
      `Title: ${c} | Termin in 60 Sekunden anfragen\nDescription: Ehrliche Beratung, feste Preise und schnelle Rückmeldung. Über 120 Bewertungen mit 4,9 ★ – jetzt unverbindlich anfragen.`,
    en: {
      title: "SEO meta",
      desc: "Title & description",
      out: (c: string) =>
        `Title: ${c} | Book an appointment in 60 seconds\nDescription: Honest advice, fixed prices and a fast response. Over 120 reviews at 4.9 ★ – enquire now, no strings attached.`,
    },
  },
  {
    id: "social",
    title: "Social-Post",
    desc: "Instagram & LinkedIn",
    out: (c: string) =>
      `Hinter jedem Termin steckt ein Team, das es ernst meint. 👋\nBei ${c} bekommst du keine Warteschleife, sondern eine Antwort – am selben Tag.\n#lokal #qualität #team`,
    en: {
      title: "Social post",
      desc: "Instagram & LinkedIn",
      out: (c: string) =>
        `Behind every appointment is a team that means it. 👋\nAt ${c} you don't get put on hold – you get an answer, the same day.\n#local #quality #team`,
    },
  },
  {
    id: "mail",
    title: "E-Mail-Betreff",
    desc: "Newsletter & Follow-up",
    out: (c: string) =>
      `1. Kurze Frage zu deiner Anfrage bei ${c}\n2. Dein Termin wartet noch auf dich\n3. Nur noch 3 freie Plätze im Oktober`,
    en: {
      title: "Email subject",
      desc: "Newsletter & follow-up",
      out: (c: string) =>
        `1. Quick question about your enquiry with ${c}\n2. Your appointment is still waiting for you\n3. Only 3 spots left in October`,
    },
  },
];

/* ---- Dokumente ------------------------------------------------------------ */

/** Document filter / type keys (German) with their English labels. */
export const DOC_TYPES = [
  { id: "Alle", en: "All" },
  { id: "Berichte", en: "Reports" },
  { id: "Verträge", en: "Contracts" },
  { id: "Assets", en: "Assets" },
];

export const DOCS = [
  { name: "Monatsbericht August 2026.pdf", type: "Berichte", size: "2,4 MB", date: "02.09.2026", en: { name: "Monthly report August 2026.pdf", date: "2 Sep 2026" } },
  { name: "Rahmenvertrag TyloTech.pdf", type: "Verträge", size: "380 KB", date: "14.06.2026", en: { name: "Master agreement TyloTech.pdf", date: "14 Jun 2026" } },
  { name: "Kampagnen-Assets Herbst.zip", type: "Assets", size: "48 MB", date: "18.09.2026", en: { name: "Campaign assets autumn.zip", date: "18 Sep 2026" } },
  { name: "Keyword-Recherche Q4.xlsx", type: "Berichte", size: "1,1 MB", date: "11.09.2026", en: { name: "Keyword research Q4.xlsx", date: "11 Sep 2026" } },
  { name: "Logo-Paket & Farben.zip", type: "Assets", size: "12 MB", date: "03.07.2026", en: { name: "Logo pack & colours.zip", date: "3 Jul 2026" } },
  { name: "Auftragsverarbeitung (AVV).pdf", type: "Verträge", size: "210 KB", date: "14.06.2026", en: { name: "Data processing agreement (DPA).pdf", date: "14 Jun 2026" } },
  { name: "Monatsbericht Juli 2026.pdf", type: "Berichte", size: "2,1 MB", date: "04.08.2026", en: { name: "Monthly report July 2026.pdf", date: "4 Aug 2026" } },
];

export const TEAM = [
  { name: "Ilias El Aradi", role: "Gründer · Strategie", en: "Founder · Strategy", img: "/team/ilias-el-aradi.jpg", online: true },
  { name: "Lena Brandt", role: "Performance Marketing", en: "Performance marketing", img: "/team/lena-brandt.png", online: true },
  { name: "Marc Hoffmann", role: "Webentwicklung", en: "Web development", img: "/team/marc-hoffmann.png", online: false },
  { name: "Aylin Demir", role: "Content & Social", en: "Content & social", img: "/team/aylin-demir.png", online: true },
  { name: "Jonas Reiter", role: "SEO", en: "SEO", img: "/team/jonas-reiter.png", online: false },
  { name: "Sabine Kraus", role: "Projektleitung", en: "Project management", img: "/team/sabine-kraus.png", online: true },
];

export const PROJECTS = [
  { name: "Website-Relaunch Fixdone", phase: "Umsetzung", progress: 72, due: "15.10.", en: { name: "Website relaunch Fixdone", phase: "Build", due: "15 Oct" } },
  { name: "Meta-Kampagne Herbst · Fahrschule Abgefahrn", phase: "Live", progress: 100, due: "läuft", en: { name: "Meta autumn campaign · Fahrschule Abgefahrn", phase: "Live", due: "running" } },
  { name: "Local SEO · Priya's Reinigungsservice", phase: "Optimierung", progress: 58, due: "laufend", en: { name: "Local SEO · Priya's Reinigungsservice", phase: "Optimisation", due: "ongoing" } },
  { name: "Onboarding LokShift", phase: "Kick-off", progress: 18, due: "03.10.", en: { name: "Onboarding LokShift", phase: "Kick-off", due: "3 Oct" } },
  { name: "Recruiting-Funnel Rohr Cleaner", phase: "Konzept", progress: 34, due: "22.10.", en: { name: "Recruiting funnel Rohr Cleaner", phase: "Concept", due: "22 Oct" } },
];
