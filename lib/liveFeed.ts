/* TyloHQ live insights for the floating bar.
 *
 * Events come only from TyloHQ, through the server route `app/api/live-feed`,
 * which authenticates against the TyloHQ feed with a server-side token and
 * validates every event. Nothing is invented on the client: when there is no
 * new event, the bar shows a neutral waiting state instead. */

export const LIVE_KINDS = ["query", "visitors", "leads", "ranking", "booking", "review"] as const;
export type LiveKind = (typeof LIVE_KINDS)[number];

export type LiveEvent = {
  /** unique, stable id from TyloHQ — used to show every event only once */
  id: string;
  kind: LiveKind;
  /** main line, e.g. "Neue Anfrage über Google" */
  title: string;
  /** small second line, e.g. "Fahrschule · Düsseldorf" */
  detail?: string;
  /** ISO timestamp of when it happened in TyloHQ */
  occurredAt: string;
};

/** `ok` / `upstream` are non-secret diagnostics: did TyloHQ answer, and with which HTTP status. */
export type LiveFeedResponse = { configured: boolean; events: LiveEvent[]; ok?: boolean; upstream?: number };

/** Max age of an event that may still be shown. */
export const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function agoLabel(occurredAt: string, now = Date.now(), locale: "de" | "en" = "de") {
  const min = Math.floor((now - Date.parse(occurredAt)) / 60000);
  if (locale === "en") {
    if (!Number.isFinite(min) || min < 1) return "just now";
    if (min < 60) return `${min} min ago`;
    const h = Math.floor(min / 60);
    return `${h} ${h === 1 ? "hr" : "hrs"} ago`;
  }
  if (!Number.isFinite(min) || min < 1) return "gerade eben";
  if (min < 60) return `vor ${min} Min.`;
  return `vor ${Math.floor(min / 60)} Std.`;
}

/** English headline for an event — TyloHQ sends its titles in German only (e.g. "3 neue Leads",
 *  "23 Besucher gerade live", "Ranking verbessert auf Platz 1"), so the English site builds its own
 *  line from `kind`, keeping the count / position from the German title where there is one. `detail` stays as is. */
export function liveTitleEn(e: Pick<LiveEvent, "kind" | "title">): string {
  const n = Number(e.title.match(/^\s*(\d+)\b/)?.[1]); // leading count only ("3 neue Leads")
  const has = Number.isFinite(n) && n > 0;
  switch (e.kind) {
    case "query": {
      const via = e.title.match(/über\s+([A-Za-z][\w-]*)/)?.[1];
      return via ? `New enquiry via ${via}` : "New enquiry received";
    }
    case "visitors":
      return has ? `${n} visitors live right now` : "Visitors live right now";
    case "leads":
      return has ? `${n} new ${n === 1 ? "lead" : "leads"}` : "New leads for a partner";
    case "ranking": {
      const pos = Number(e.title.match(/Platz\s+(\d+)/)?.[1]);
      return Number.isFinite(pos) && pos > 0 ? `Ranking up to #${pos}` : "Google ranking improved";
    }
    case "booking":
      return "Initial consultation booked";
    case "review": {
      const stars = Number(e.title.match(/(\d)\s*★/)?.[1]);
      return stars >= 1 && stars <= 5 ? `New ${stars}★ review` : "New review";
    }
  }
}

/** Strict runtime check — anything that doesn't match is dropped. */
export function parseEvent(raw: unknown, now = Date.now()): LiveEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null);
  const id = str(r.id, 128);
  const title = str(r.title, 80);
  const occurredAt = str(r.occurredAt, 40);
  const kind = LIVE_KINDS.find((k) => k === r.kind);
  if (!id || !title || !occurredAt || !kind) return null;
  const t = Date.parse(occurredAt);
  if (!Number.isFinite(t) || t > now + 60_000 || now - t > MAX_AGE_MS) return null;
  const detail = r.detail === undefined ? undefined : (str(r.detail, 80) ?? undefined);
  return { id, kind, title, detail, occurredAt: new Date(t).toISOString() };
}
