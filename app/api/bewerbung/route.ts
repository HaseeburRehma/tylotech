import { CONTACT } from "@/lib/contact";
import {
  BUDGETS,
  BW_LIMITS,
  MITARBEITER,
  STARTS,
  TOOLS,
  isBudget,
  isMitarbeiter,
  isStart,
  isTool,
  optionLabel,
  validateBewerbung,
  type Bewerbung,
  type BewerbungPayload,
} from "@/lib/bewerbung";
import { MailError, sendMail, sender, transport } from "@/lib/mail/send";
import { applicationConfirmation, applicationTeamNotification } from "@/lib/mail/templates";
import { cleanAttribution, sendToTyloHQ, tylohqConfigured } from "@/lib/tylohq";

/* App-Bauplan application (software landing page) → team e-mail (+ confirmation to the applicant).
 * Transport and credentials: see lib/mail/send.ts. Extra switches:
 *
 *   BEWERBUNG_TO         recipient, defaults to CONTACT_TO / info@tylotech.de
 *   CONTACT_AUTOREPLY    "false" turns off the confirmation e-mail
 *   SITE_URL             public origin for logo/links in e-mails (defaults to the request origin)
 *
 * Every application also goes to TyloHQ as a lead (lib/tylohq.ts, TYLOHQ_LEADS_URL); it
 * counts as delivered if the e-mail or TyloHQ got it. With neither, the route answers 503
 * { reason: "not-configured" } and the form offers a pre-filled mailto link instead, so no
 * application is lost. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY = 16_000; // bytes; the largest legit payload is ~3 KB
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
const line = (v: unknown, n: number) => clip(typeof v === "string" ? v.replace(/\s+/g, " ") : v, n);

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY) return Response.json({ ok: false, reason: "too-large" }, { status: 413 });

  let body: Partial<BewerbungPayload>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // bots: filled honeypot or instant submit → pretend success, send nothing
  if (clip(body.website, 200) || typeof body.elapsed !== "number" || body.elapsed < 4000) {
    return Response.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  const locale = body.locale === "en" ? "en" : "de";

  const p: Bewerbung = {
    branche: line(body.branche, BW_LIMITS.branche),
    mitarbeiter: isMitarbeiter(body.mitarbeiter) ? body.mitarbeiter : "",
    problem: clip(body.problem, BW_LIMITS.problem),
    // unknown values make the list invalid rather than being silently dropped
    tools: Array.isArray(body.tools) && body.tools.length <= TOOLS.length && body.tools.every(isTool) ? [...new Set(body.tools)] : [],
    budget: isBudget(body.budget) ? body.budget : "",
    start: isStart(body.start) ? body.start : "",
    name: line(body.name, BW_LIMITS.name),
    company: line(body.company, BW_LIMITS.company),
    email: line(body.email, BW_LIMITS.email),
    phone: line(body.phone, BW_LIMITS.phone),
    consent: body.consent === true,
  };
  const errors = validateBewerbung(p, locale);
  if (Object.keys(errors).length) return Response.json({ ok: false, reason: "invalid", errors }, { status: 422 });

  if (!transport() && !tylohqConfigured()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  const origin = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const source = `${new URL(origin).host}${locale === "en" ? "/en/software" : "/software"}`;
  // e-mails always carry German labels for the team, the applicant's language for the confirmation
  const labels = (l: "de" | "en") => ({
    branche: p.branche,
    mitarbeiter: optionLabel(MITARBEITER, p.mitarbeiter, l),
    problem: p.problem,
    tools: p.tools.map((t) => optionLabel(TOOLS, t, l)),
    budget: optionLabel(BUDGETS, p.budget, l),
    start: optionLabel(STARTS, p.start, l),
    name: p.name,
    company: p.company,
    email: p.email,
    phone: p.phone,
  });
  const to = process.env.BEWERBUNG_TO || process.env.CONTACT_TO || CONTACT.email;

  // Team e-mail and TyloHQ lead at the same time.
  const de = labels("de");
  let code: string | undefined;
  const [mailed, stored] = await Promise.all([
    transport()
      ? sendMail({ to, replyTo: p.email, ...applicationTeamNotification(de, origin, source, locale) }).then(
          () => true,
          (err) => {
            code = err instanceof MailError ? err.code : "unknown";
            console.error("bewerbung: send failed", code, err instanceof Error ? err.message : err, "from:", sender());
            return false;
          },
        )
      : Promise.resolve(false),
    sendToTyloHQ(
      "App-Bauplan Bewerbung",
      [
        { label: "Name", value: de.name },
        { label: "Firma", value: de.company },
        { label: "E-Mail", value: de.email },
        { label: "Telefon", value: de.phone },
        { label: "Branche", value: de.branche },
        { label: "Mitarbeiter", value: de.mitarbeiter },
        { label: "Problem", value: de.problem },
        { label: "Tools heute", value: de.tools.join(", ") },
        { label: "Budget", value: de.budget },
        { label: "Start", value: de.start },
        { label: "Sprache", value: locale === "en" ? "Englisch" : "Deutsch" },
      ],
      cleanAttribution((body as { attribution?: unknown }).attribution),
    ),
  ]);
  // only a short code (e.g. "EAUTH 535") — no message text, nothing secret
  if (!mailed && !stored) return Response.json({ ok: false, reason: "send-failed", code }, { status: 502 });

  // confirmation to the applicant — best effort, never fails the request
  if (transport() && process.env.CONTACT_AUTOREPLY !== "false") {
    try {
      const mail = applicationConfirmation(labels(locale), origin, locale);
      await sendMail({ to: p.email, replyTo: to, ...mail });
    } catch (err) {
      console.error("bewerbung: confirmation failed", err instanceof MailError ? err.code : err);
    }
  }

  return Response.json({ ok: true });
}
