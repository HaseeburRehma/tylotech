/* TyloHQ live insights for the floating bar.
 *
 * If NEXT_PUBLIC_TYLOHQ_FEED_URL is set, the bar polls that endpoint for JSON
 * in the shape `LiveEvent[]` (newest first). Without it, the sample events below
 * are shown — replace them with real numbers once TyloHQ exposes a feed. */

export type LiveKind = "query" | "visitors" | "leads" | "ranking" | "booking" | "review";

export type LiveEvent = {
  kind: LiveKind;
  /** main line, e.g. "Neue Anfrage über Google" */
  title: string;
  /** small second line, e.g. "Fahrschule · Düsseldorf" */
  detail?: string;
  /** minutes ago — rendered as "vor 10 Min."; omit for "gerade" */
  minutesAgo?: number;
  /** for `visitors`: the live count to show (the bar lets it drift slightly) */
  count?: number;
};

export const FEED_URL = process.env.NEXT_PUBLIC_TYLOHQ_FEED_URL;

export const SAMPLE_EVENTS: LiveEvent[] = [
  { kind: "query", title: "Neue Anfrage über Google", detail: "Fahrschule · Düsseldorf", minutesAgo: 10 },
  { kind: "visitors", title: "Besucher gerade live", detail: "auf Kunden-Websites", count: 20 },
  { kind: "leads", title: "2 neue Leads im Anmarsch", detail: "Meta Ads · Gebäudereinigung", minutesAgo: 6 },
  { kind: "ranking", title: "Ranking verbessert auf Platz 1", detail: "„rohrreinigung nrw“", minutesAgo: 34 },
  { kind: "booking", title: "Erstgespräch gebucht", detail: "Handwerk · Köln", minutesAgo: 4 },
  { kind: "review", title: "Neue 5★-Bewertung", detail: "Google · Reinigungsservice", minutesAgo: 25 },
];

export function agoLabel(min?: number) {
  if (min === undefined || min < 1) return "gerade";
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  return `vor ${h} Std.`;
}
