import { CONTACT } from "@/lib/contact";
import { MailError, sendMail, transport } from "@/lib/mail/send";
import { lensConfirmation, lensTeamNotification, type LensLead } from "@/lib/mail/templates";
import { TL_BUDGETS, TL_PRIORITY, normalizeWebsite, validateLens, type TlBudget, type TlPayload } from "@/lib/tylolens";
import { cleanAttribution, sendToTyloHQ, tylohqConfigured } from "@/lib/tylohq";

/* TyloLens lead → team notification (+ confirmation to the lead).
 *
 *   Mail transport: see lib/mail/send.ts (own SMTP, Resend fallback)
 *   TYLOLENS_TO           recipient, defaults to CONTACT_TO / info@tylotech.de
 *   TYLOLENS_WEBHOOK_URL  optional: every lead is also POSTed as JSON here (CRM, Zapier,
 *                         Make, Slack incoming webhook — `text` is Slack-ready)
 *   TYLOLENS_AUTOREPLY    "false" turns off the confirmation e-mail
 *
 *   TYLOHQ_LEADS_URL      every lead also goes to TyloHQ (lib/tylohq.ts)
 *
 * A lead counts as delivered if the e-mail, the webhook or TyloHQ got it. */

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

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, n) : "");

export async function POST(request: Request) {
  let body: Partial<TlPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  // bots: filled honeypot or instant submit → pretend success, send nothing
  if (clip(body.company, 200) || typeof body.elapsed !== "number" || body.elapsed < 2500) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, reason: "rate-limited" }, { status: 429 });

  // language of the page the modal was opened on — only the lead's confirmation changes
  const locale = (body as { locale?: unknown }).locale === "en" ? "en" : "de";

  const p = {
    website: clip(body.website, 200),
    branche: clip(body.branche, 60),
    ziel: clip(body.ziel, 60),
    budget: clip(body.budget, 10),
    name: clip(body.name, 100),
    email: clip(body.email, 160),
  };
  const errors = validateLens(p);
  if (Object.keys(errors).length) return Response.json({ ok: false, reason: "invalid", errors }, { status: 422 });

  const budget = p.budget as TlBudget;
  const lead: LensLead = {
    ...p,
    website: normalizeWebsite(p.website)!,
    budgetLabel: TL_BUDGETS.find((b) => b.value === budget)!.label,
    priority: TL_PRIORITY[budget].label,
  };
  const origin = (process.env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");

  const webhook = process.env.TYLOLENS_WEBHOOK_URL;
  if (!transport() && !webhook && !tylohqConfigured()) return Response.json({ ok: false, reason: "not-configured" }, { status: 503 });

  let delivered = false;
  let code: string | undefined;

  // TyloHQ in parallel with the e-mail and webhook below.
  const stored = sendToTyloHQ(
    "TyloLens Analyse",
    [
      { label: "Name", value: lead.name },
      { label: "E-Mail", value: lead.email },
      { label: "Website", value: lead.website },
      { label: "Branche", value: lead.branche },
      { label: "Ziel", value: lead.ziel },
      { label: "Budget", value: lead.budgetLabel },
      { label: "Priorität", value: lead.priority },
      { label: "Sprache", value: locale === "en" ? "Englisch" : "Deutsch" },
    ],
    cleanAttribution((body as { attribution?: unknown }).attribution),
  );

  if (transport()) {
    try {
      const mail = lensTeamNotification(lead, origin, locale);
      await sendMail({ to: process.env.TYLOLENS_TO || process.env.CONTACT_TO || CONTACT.email, replyTo: lead.email, ...mail });
      delivered = true;
    } catch (err) {
      code = err instanceof MailError ? err.code : "unknown";
      console.error("tylolens: team mail failed", code, err instanceof Error ? err.message : err);
    }
  }

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `TyloLens · ${lead.priority} (${lead.budgetLabel}) · ${lead.website} · ${lead.name} <${lead.email}> · ${lead.branche} · ${lead.ziel}`,
          lead: { ...lead, source: "tylolens", receivedAt: new Date().toISOString() },
        }),
        signal: AbortSignal.timeout(6000),
      });
      if (res.ok) delivered = true;
      else console.error("tylolens: webhook", res.status);
    } catch (err) {
      console.error("tylolens: webhook failed", err);
    }
  }

  if (await stored) delivered = true;
  if (!delivered) return Response.json({ ok: false, reason: "send-failed", code }, { status: 502 });

  // confirmation to the lead — best effort, never fails the request
  if (transport() && process.env.TYLOLENS_AUTOREPLY !== "false") {
    try {
      const mail = lensConfirmation(lead, origin, locale);
      await sendMail({ to: lead.email, replyTo: process.env.TYLOLENS_TO || process.env.CONTACT_TO || CONTACT.email, ...mail });
    } catch (err) {
      console.error("tylolens: confirmation failed", err instanceof MailError ? err.code : err);
    }
  }

  return Response.json({ ok: true });
}
