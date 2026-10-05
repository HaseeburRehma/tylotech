/* Partner results for the floating bar (Live Ticker dev brief, curated by Ilias).
 * Strings and times exactly as in the brief (times are fixed by decision of TyloTech,
 * not live); the time is shown in the bar's second line so it never gets truncated.
 * Lead figure updated to 550 on request. Don't change numbers without checking with Ilias. */

export type TickerIcon = "leads" | "query" | "growth" | "ranking" | "people" | "software" | "sale";

export const TICKER_MESSAGES: { text: string; time?: string; icon: TickerIcon }[] = [
  { text: "Letzte 30 Tage: 550 Leads für unsere Partner", icon: "leads" },
  { text: "Anfrage für einen Dachdecker", time: "vor 8 Minuten", icon: "query" },
  { text: "Marge eines Partners um 14 % gesteigert", icon: "growth" },
  { text: "ROAS eines Shops von 1,8 auf 3,5 verbessert", icon: "growth" },
  { text: "Partner auf Platz 1 bei Google gebracht", time: "diese Woche", icon: "ranking" },
  { text: "CPL eines Partners um 31 % gesenkt", icon: "growth" },
  { text: "Lead für einen Elektriker in Düsseldorf", time: "vor 12 Minuten", icon: "leads" },
  { text: "CTR einer Kampagne um 47 % gesteigert", icon: "growth" },
  { text: "Mehrere neue Bewerbungen für einen Betrieb", time: "vor 41 Minuten", icon: "people" },
  { text: "Abschlussrate eines Partners um 23 % erhöht", icon: "growth" },
  { text: "Partner wird jetzt von der KI empfohlen", time: "diese Woche", icon: "ranking" },
  { text: "Werbekosten eines Shops um 28 % gesenkt, Umsatz gehalten", icon: "growth" },
  { text: "Fachkraft für einen Partner vermittelt", time: "vor 3 Stunden", icon: "people" },
  { text: "Ø CPL über alle Partner: 18 €", icon: "leads" },
  { text: "Conversion-Rate eines Shops um 19 % erhöht", icon: "growth" },
  { text: "Verkauf für einen Mode-Shop", time: "vor 6 Minuten", icon: "sale" },
  { text: "Lead für einen Sanitärbetrieb", time: "vor 23 Minuten", icon: "leads" },
  { text: "Eigene Software für einen Partner ausgeliefert", time: "diese Woche", icon: "software" },
  { text: "Anfrage für einen Finanzberater", time: "vor 52 Minuten", icon: "query" },
  { text: "Neues Top-3-Ranking für einen Partner", time: "vor 2 Stunden", icon: "ranking" },
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
