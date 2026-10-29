import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "@/lib/site";

/* Meta Conversions API relay. The browser posts here right after it fires the
 * pixel; the same event (same event_id) goes to Meta from the server, so Meta
 * deduplicates. Needs META_CAPI_TOKEN (Events Manager → dataset → Settings →
 * Conversions API → Generate access token); without it the route does nothing.
 * Optional META_TEST_EVENT_CODE sends to "Test events" while checking the setup. */

export const runtime = "nodejs";

const ALLOWED = new Set(["PageView", "ViewContent", "Lead", "Contact"]);
const MAX_BODY = 8_000;
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>(); // best-effort per instance

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

const sha = (v: string) => createHash("sha256").update(v).digest("hex");
const str = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : undefined);

/** custom_data: flat strings/numbers/booleans only, a handful of short keys */
function cleanParams(p: unknown) {
  const out: Record<string, string | number | boolean> = {};
  if (!p || typeof p !== "object") return out;
  for (const [k, v] of Object.entries(p as Record<string, unknown>).slice(0, 12)) {
    if (!/^[a-z_]{1,40}$/.test(k)) continue;
    if (typeof v === "string") out[k] = v.slice(0, 120);
    else if ((typeof v === "number" && Number.isFinite(v)) || typeof v === "boolean") out[k] = v;
  }
  return out;
}

export async function POST(request: Request) {
  const token = process.env.META_CAPI_TOKEN;
  if (!META_PIXEL_ID || !token) return Response.json({ ok: true, skipped: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  if (rateLimited(ip || "unknown")) return Response.json({ ok: false }, { status: 429 });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return Response.json({ ok: false }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const event = str(body.event, 40);
  const eventId = str(body.eventId, 64);
  if (!event || !ALLOWED.has(event) || !eventId) return Response.json({ ok: false }, { status: 400 });

  // only report pages of this site
  const url = str(body.url, 500);
  let sourceUrl: string | undefined;
  try {
    if (url && new URL(url).host === new URL(request.url).host) sourceUrl = url;
  } catch {}

  const user = (body.user && typeof body.user === "object" ? body.user : {}) as Record<string, unknown>;
  const user_data: Record<string, unknown> = {
    client_ip_address: ip || undefined,
    client_user_agent: request.headers.get("user-agent")?.slice(0, 400) || undefined,
    fbp: str(body.fbp, 200),
    fbc: str(body.fbc, 400),
  };
  const email = str(user.email, 200)?.toLowerCase();
  if (email) {
    user_data.em = [sha(email)];
    user_data.external_id = [sha(email)];
  }
  const phone = str(user.phone, 40)?.replace(/\D/g, "").replace(/^00/, "").replace(/^0/, "49");
  if (phone) user_data.ph = [sha(phone)];
  const [fn, ...ln] = (str(user.name, 120) ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  if (fn) user_data.fn = [sha(fn)];
  if (ln.length) user_data.ln = [sha(ln.join(" "))];

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sourceUrl,
        action_source: "website",
        user_data,
        custom_data: cleanParams(body.params),
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(`https://graph.facebook.com/v25.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Meta CAPI error:", res.status, (await res.text()).slice(0, 300));
      return Response.json({ ok: false }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Meta CAPI fetch failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false }, { status: 502 });
  }
}

export function GET() {
  return Response.json({ ok: false }, { status: 405 });
}
