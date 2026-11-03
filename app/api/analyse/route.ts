import { CONTACT } from "@/lib/contact";
import { AN_LIMITS, isGewerk, validateAnalyse, type Analyse, type AnalysePayload } from "@/lib/analyse";
import { MailError, sendMail, sender, transport } from "@/lib/mail/send";
import { analyseTeamNotification } from "@/lib/mail/templates";
import { cleanAttribution, sendToTyloHQ, tylohqConfigured } from "@/lib/tylohq";

/* Free competitor analysis (Handwerk landing page) → team e-mail + TyloHQ lead.
 * No confirmation e-mail: the form asks for a phone number only, we call back.
 *
 *   ANALYSE_TO   recipient, defaults to CONTACT_TO / info@tylotech.de
 *   SITE_URL     public origin for logo/links in e-mails (defaults to the request origin)
 *
 * Delivered if the e-mail or TyloHQ got it; with neither configured the route answers
 * 503 { reason: "not-configured" } and the form offers the phone number instead. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY = 8_000;
const hits = new Map<string, number[]>(); // best-effort per instance

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

const line = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY) return Response.json({ ok: false, reason: "too-large" }, { status: 413 });

  let body: Partial<AnalysePayload>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // bots: filled honeypot or instant submit → pretend success, send nothing
  if (line(body.fax, 200) || typeof body.elapsed !== "number" || body.elapsed < 3000) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  const a: Analyse = {
    gewerk: isGewerk(body.gewerk) ? body.gewerk : "",
    stadt: line(body.stadt, AN_LIMITS.stadt),
    site: line(body.site, AN_LIMITS.site),
    name: line(body.name, AN_LIMITS.name),
    phone: line(body.phone, AN_LIMITS.phone),
    // keep line breaks, only trim and cap
    message: typeof body.message === "string" ? body.message.trim().slice(0, AN_LIMITS.message) : "",
    consent: body.consent === true,
  };
  const errors = validateAnalyse(a);
  if (Object.keys(errors).length) return Response.json({ ok: false, reason: "invalid", errors }, { status: 422 });

  if (!transport() && !tylohqConfigured()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  const origin = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const source = `${new URL(origin).host}/handwerk-anfragen`;
  const to = process.env.ANALYSE_TO || process.env.CONTACT_TO || CONTACT.email;

  let code: string | undefined;
  const [mailed, stored] = await Promise.all([
    transport()
      ? sendMail({ to, ...analyseTeamNotification(a, origin, source) }).then(
          () => true,
          (err) => {
            code = err instanceof MailError ? err.code : "unknown";
            console.error("analyse: send failed", code, err instanceof Error ? err.message : err, "from:", sender());
            return false;
          },
        )
      : Promise.resolve(false),
    sendToTyloHQ(
      "Konkurrenz-Analyse Handwerk",
      [
        { label: "Name", value: a.name },
        { label: "Telefon", value: a.phone },
        { label: "Gewerk", value: a.gewerk },
        { label: "Stadt", value: a.stadt },
        { label: "Website", value: a.site },
        { label: "Nachricht", value: a.message },
      ],
      cleanAttribution(body.attribution),
    ),
  ]);
  // only a short code (e.g. "EAUTH 535") — no message text, nothing secret
  if (!mailed && !stored) return Response.json({ ok: false, reason: "send-failed", code }, { status: 502 });

  return Response.json({ ok: true });
}

export function GET() {
  return Response.json({ ok: false }, { status: 405 });
}
