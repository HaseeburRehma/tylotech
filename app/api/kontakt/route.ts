import { BRANCHE_OPTIONS, CONTACT, LIMITS, TOPICS, validate, type ContactPayload } from "@/lib/contact";
import { MailError, sendMail, sender, transport } from "@/lib/mail/send";
import { customerConfirmation, teamNotification } from "@/lib/mail/templates";

/* Contact form → branded e-mail to info@tylotech.de (+ confirmation to the sender).
 * Transport and credentials: see lib/mail/send.ts. Extra switches:
 *
 *   CONTACT_AUTOREPLY  "false" turns off the confirmation e-mail to the sender
 *   SITE_URL           public origin for logo/links in e-mails (defaults to the request origin)
 *
 * Without a transport the route answers 503 { reason: "not-configured" } and the form
 * offers a pre-filled mailto link instead, so no enquiry is lost. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>(); // best-effort per instance

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Status check without sending anything: which transport, which kind of sender? */
export async function GET() {
  const via = transport();
  return Response.json(
    {
      configured: via !== null,
      transport: via,
      sender: process.env.CONTACT_FROM ? "custom" : via === "smtp" ? "smtp-user" : "resend-test",
      autoreply: process.env.CONTACT_AUTOREPLY !== "false",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // bots: filled honeypot or instant submit → pretend success, send nothing
  if (clip(body.website, 200) || typeof body.elapsed !== "number" || body.elapsed < 2500) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  const p = {
    name: clip(body.name, LIMITS.name),
    company: clip(body.company, LIMITS.company),
    email: clip(body.email, LIMITS.email),
    phone: clip(body.phone, LIMITS.phone),
    branche: BRANCHE_OPTIONS.find((o) => o.value === body.branche)?.label ?? "",
    topics: Array.isArray(body.topics) ? body.topics.filter((t): t is (typeof TOPICS)[number] => TOPICS.includes(t as never)) : [],
    message: clip(body.message, LIMITS.message),
    consent: body.consent === true,
  };
  const errors = validate(p);
  if (Object.keys(errors).length) return Response.json({ ok: false, reason: "invalid", errors }, { status: 422 });

  if (!transport()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  const origin = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const source = `${new URL(origin).host}/kontakt${p.branche ? ` (Branche: ${p.branche})` : ""}`;

  try {
    const team = teamNotification(p, origin, source);
    await sendMail({ to: process.env.CONTACT_TO || CONTACT.email, replyTo: p.email, ...team });
  } catch (err) {
    const code = err instanceof MailError ? err.code : "unknown";
    console.error("kontakt: send failed", code, err instanceof Error ? err.message : err, "from:", sender());
    // only a short code (e.g. "EAUTH 535") — no message text, nothing secret
    return Response.json({ ok: false, reason: "send-failed", code }, { status: 502 });
  }

  // confirmation to the sender — best effort, never fails the request
  if (process.env.CONTACT_AUTOREPLY !== "false") {
    try {
      const mail = customerConfirmation(p, origin);
      await sendMail({ to: p.email, replyTo: process.env.CONTACT_TO || CONTACT.email, ...mail });
    } catch (err) {
      console.error("kontakt: confirmation failed", err instanceof MailError ? err.code : err);
    }
  }

  return Response.json({ ok: true });
}
