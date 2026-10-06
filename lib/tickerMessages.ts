/* Partner results for the floating bar (Live Ticker dev brief, curated by Ilias).
 * Strings and times exactly as in the brief (times are fixed by decision of TyloTech,
 * not live); the time is shown in the bar's second line so it never gets truncated.
 * Lead figure updated to 550 on request. Don't change numbers without checking with Ilias. */

export type TickerIcon = "leads" | "query" | "growth" | "ranking" | "people" | "software" | "sale";

/** `textEn` / `timeEn` are the English versions for /en — same facts and numbers. */
export const TICKER_MESSAGES: { text: string; time?: string; textEn: string; timeEn?: string; icon: TickerIcon }[] = [
  { text: "Letzte 30 Tage: 550 Leads für unsere Partner", textEn: "Last 30 days: 550 leads for our partners", icon: "leads" },
  { text: "Anfrage für einen Dachdecker", time: "vor 8 Minuten", textEn: "Enquiry for a roofer", timeEn: "8 minutes ago", icon: "query" },
  { text: "Marge eines Partners um 14 % gesteigert", textEn: "Partner's margin up 14%", icon: "growth" },
  { text: "ROAS eines Shops von 1,8 auf 3,5 verbessert", textEn: "Shop's ROAS improved from 1.8 to 3.5", icon: "growth" },
  { text: "Partner auf Platz 1 bei Google gebracht", time: "diese Woche", textEn: "Partner taken to #1 on Google", timeEn: "this week", icon: "ranking" },
  { text: "CPL eines Partners um 31 % gesenkt", textEn: "Partner's CPL cut by 31%", icon: "growth" },
  { text: "Lead für einen Elektriker in Düsseldorf", time: "vor 12 Minuten", textEn: "Lead for an electrician in Düsseldorf", timeEn: "12 minutes ago", icon: "leads" },
  { text: "CTR einer Kampagne um 47 % gesteigert", textEn: "Campaign CTR up 47%", icon: "growth" },
  { text: "Mehrere neue Bewerbungen für einen Betrieb", time: "vor 41 Minuten", textEn: "Several new job applications for a business", timeEn: "41 minutes ago", icon: "people" },
  { text: "Abschlussrate eines Partners um 23 % erhöht", textEn: "Partner's close rate up 23%", icon: "growth" },
  { text: "Partner wird jetzt von der KI empfohlen", time: "diese Woche", textEn: "Partner now recommended by AI", timeEn: "this week", icon: "ranking" },
  { text: "Werbekosten eines Shops um 28 % gesenkt, Umsatz gehalten", textEn: "Shop's ad spend cut by 28%, revenue held", icon: "growth" },
  { text: "Fachkraft für einen Partner vermittelt", time: "vor 3 Stunden", textEn: "Skilled hire placed for a partner", timeEn: "3 hours ago", icon: "people" },
  { text: "Ø CPL über alle Partner: 18 €", textEn: "Avg. CPL across all partners: €18", icon: "leads" },
  { text: "Conversion-Rate eines Shops um 19 % erhöht", textEn: "Shop's conversion rate up 19%", icon: "growth" },
  { text: "Verkauf für einen Mode-Shop", time: "vor 6 Minuten", textEn: "Sale for a fashion shop", timeEn: "6 minutes ago", icon: "sale" },
  { text: "Lead für einen Sanitärbetrieb", time: "vor 23 Minuten", textEn: "Lead for a plumbing business", timeEn: "23 minutes ago", icon: "leads" },
  { text: "Eigene Software für einen Partner ausgeliefert", time: "diese Woche", textEn: "Custom software delivered for a partner", timeEn: "this week", icon: "software" },
  { text: "Anfrage für einen Finanzberater", time: "vor 52 Minuten", textEn: "Enquiry for a financial adviser", timeEn: "52 minutes ago", icon: "query" },
  { text: "Neues Top-3-Ranking für einen Partner", time: "vor 2 Stunden", textEn: "New top-3 ranking for a partner", timeEn: "2 hours ago", icon: "ranking" },
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
