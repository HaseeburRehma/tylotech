import { BRANCHE_OPTIONS, CONTACT, LIMITS, TOPICS, validate, type ContactPayload } from "@/lib/contact";

/* Contact form → e-mail to info@tylotech.de, sent through Resend's HTTP API.
 *
 *   RESEND_API_KEY  API key from resend.com (server-side only)
 *   CONTACT_FROM    sender, e.g. "TyloTech Website <website@tylotech.de>" — the domain
 *                   must be verified in Resend. Defaults to Resend's test sender, which
 *                   only delivers to the Resend account's own address.
 *   CONTACT_TO      recipient, defaults to info@tylotech.de
 *
 * Without RESEND_API_KEY the route answers 503 { reason: "not-configured" } and the
 * form offers a pre-filled mailto link instead, so no enquiry is lost. */

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

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

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

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  const rows: [string, string][] = [
    ["Name", p.name],
    ["Unternehmen", p.company || "—"],
    ["E-Mail", p.email],
    ["Telefon", p.phone || "—"],
    ["Branche", p.branche || "—"],
    ["Anliegen", p.topics.join(", ") || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nNachricht:\n${p.message}\n\n— gesendet über tylotech.de/kontakt`;
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#1a1917;max-width:560px">
<h2 style="font-size:20px;margin:0 0 16px">Neue Anfrage über tylotech.de</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#7d7973;padding-right:16px">${k}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="font-size:14px;color:#7d7973;margin:20px 0 6px">Nachricht</p>
<p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0">${esc(p.message)}</p>
<p style="font-size:12px;color:#a8a49d;margin-top:28px">Antworten geht direkt an ${esc(p.email)}.</p></div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "TyloTech Website <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO || CONTACT.email],
        reply_to: p.email,
        subject: `Neue Anfrage: ${p.name}${p.company ? ` (${p.company})` : ""}${p.topics[0] ? ` – ${p.topics[0]}` : ""}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("kontakt: resend", res.status, await res.text().catch(() => ""));
      return Response.json({ ok: false, reason: "send-failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("kontakt: send", err);
    return Response.json({ ok: false, reason: "send-failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
