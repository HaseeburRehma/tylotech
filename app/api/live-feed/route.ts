import { parseEvent, type LiveEvent, type LiveFeedResponse } from "@/lib/liveFeed";

/* Server-side proxy to the TyloHQ activity feed.
 *
 *   TYLOHQ_FEED_URL    endpoint in TyloHQ that returns recent activity as JSON
 *                      (an array, or `{ events: [...] }`)
 *   TYLOHQ_FEED_TOKEN  secret sent as `Authorization: Bearer …` — never exposed
 *                      to the browser
 *
 * Without both variables the route answers `{ configured: false, events: [] }`
 * and the floating bar shows its neutral waiting state. */

export async function GET() {
  const url = process.env.TYLOHQ_FEED_URL;
  const token = process.env.TYLOHQ_FEED_TOKEN;
  const headers = { "Cache-Control": "no-store" };

  if (!url || !token) {
    return Response.json({ configured: false, events: [] } satisfies LiveFeedResponse, { headers });
  }

  let upstream: number | undefined;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    upstream = res.status;
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const body: unknown = await res.json();
    const list = Array.isArray(body) ? body : (body as { events?: unknown })?.events;
    const now = Date.now();
    const seen = new Set<string>();
    const events: LiveEvent[] = [];
    for (const raw of Array.isArray(list) ? list : []) {
      const e = parseEvent(raw, now);
      if (e && !seen.has(e.id)) {
        seen.add(e.id);
        events.push(e);
      }
    }
    events.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt));
    return Response.json({ configured: true, ok: true, upstream, events: events.slice(0, 20) } satisfies LiveFeedResponse, { headers });
  } catch (err) {
    console.error("live-feed:", upstream ?? "", err instanceof Error ? err.message : err);
    return Response.json({ configured: true, ok: false, upstream, events: [] } satisfies LiveFeedResponse, { headers });
  }
}
