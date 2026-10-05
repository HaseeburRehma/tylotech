/* Partner results for the floating bar (Live Ticker dev brief, curated by Ilias).
 *
 * The brief's strings carried fixed timestamps ("· vor 8 Minuten", "· diese Woche").
 * Shown on every visit, those would claim a recency that isn't true — misleading under
 * UWG and against our own rule that "live" items must be real. So the ticker shows the
 * results themselves, labelled as results, and only real TyloHQ events carry a time.
 * Numbers are unchanged — do not edit them without checking with Ilias. */

export type TickerIcon = "leads" | "query" | "growth" | "ranking" | "people" | "software" | "sale";

export const TICKER_MESSAGES: { text: string; icon: TickerIcon }[] = [
  { text: "Letzte 30 Tage: 432 Leads für unsere Partner", icon: "leads" },
  { text: "Anfrage für einen Dachdecker", icon: "query" },
  { text: "Marge eines Partners um 14 % gesteigert", icon: "growth" },
  { text: "ROAS eines Shops von 1,8 auf 3,5 verbessert", icon: "growth" },
  { text: "Partner auf Platz 1 bei Google gebracht", icon: "ranking" },
  { text: "CPL eines Partners um 31 % gesenkt", icon: "growth" },
  { text: "Lead für einen Elektriker in Düsseldorf", icon: "leads" },
  { text: "CTR einer Kampagne um 47 % gesteigert", icon: "growth" },
  { text: "Mehrere neue Bewerbungen für einen Betrieb", icon: "people" },
  { text: "Abschlussrate eines Partners um 23 % erhöht", icon: "growth" },
  { text: "Partner wird jetzt von der KI empfohlen", icon: "ranking" },
  { text: "Werbekosten eines Shops um 28 % gesenkt, Umsatz gehalten", icon: "growth" },
  { text: "Fachkraft für einen Partner vermittelt", icon: "people" },
  { text: "Ø CPL über alle Partner: 18 €", icon: "leads" },
  { text: "Conversion-Rate eines Shops um 19 % erhöht", icon: "growth" },
  { text: "Verkauf für einen Mode-Shop", icon: "sale" },
  { text: "Lead für einen Sanitärbetrieb", icon: "leads" },
  { text: "Eigene Software für einen Partner ausgeliefert", icon: "software" },
  { text: "Anfrage für einen Finanzberater", icon: "query" },
  { text: "Neues Top-3-Ranking für einen Partner", icon: "ranking" },
];

/** Shuffled order that never repeats the previous message at the seam between rounds. */
export function shuffledOrder(n: number, avoidFirst = -1): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (n > 1 && a[0] === avoidFirst) [a[0], a[1]] = [a[1], a[0]];
  return a;
}
