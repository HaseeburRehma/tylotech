import nodemailer, { type Transporter } from "nodemailer";

/* Outgoing mail. Uses the site's own SMTP server when configured, otherwise Resend.
 *
 *   SMTP_HOST     e.g. smtp.office365.com (tylotech.de mail runs on Microsoft 365)
 *   SMTP_PORT     587 (STARTTLS, default) or 465 (implicit TLS)
 *   SMTP_USER     mailbox that logs in, e.g. info@tylotech.de
 *   SMTP_PASS     its password / app password — server-side only
 *   CONTACT_FROM  optional sender, e.g. "TyloTech Website <info@tylotech.de>";
 *                 defaults to SMTP_USER (Microsoft 365 only sends as the logged-in mailbox
 *                 or one it has "Send As" rights for)
 *   CONTACT_TO    recipient of enquiries, default info@tylotech.de
 *
 *   RESEND_API_KEY  fallback transport when no SMTP_HOST is set */

export type OutgoingMail = { to: string; subject: string; html: string; text: string; replyTo?: string };
export type Transport = "smtp" | "resend" | null;

export class MailError extends Error {
  /** short, non-secret code for diagnosis, e.g. "EAUTH 535" or "resend 403 validation_error" */
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

const unquote = (v?: string) => v?.trim().replace(/^["']|["']$/g, "") || undefined;

export function transport(): Transport {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

export function sender() {
  const custom = unquote(process.env.CONTACT_FROM);
  if (custom) return custom;
  if (transport() === "smtp") return `TyloTech Website <${process.env.SMTP_USER}>`;
  return "TyloTech Website <onboarding@resend.dev>";
}

let smtp: Transporter | null = null;
function smtpTransport() {
  if (smtp) return smtp;
  const port = Number(process.env.SMTP_PORT || 587);
  smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    requireTLS: port !== 465, // never send credentials unencrypted
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return smtp;
}

export async function sendMail(m: OutgoingMail) {
  const via = transport();
  if (!via) throw new MailError("no transport configured", "not-configured");

  if (via === "smtp") {
    try {
      await smtpTransport().sendMail({ from: sender(), to: m.to, replyTo: m.replyTo, subject: m.subject, html: m.html, text: m.text });
    } catch (err) {
      const e = err as { code?: string; responseCode?: number; message?: string };
      throw new MailError(e.message ?? "smtp error", [e.code ?? "SMTP", e.responseCode].filter(Boolean).join(" "));
    }
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: sender(), to: [m.to], reply_to: m.replyTo, subject: m.subject, html: m.html, text: m.text }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    let name = "";
    try {
      name = (JSON.parse(detail) as { name?: string }).name ?? "";
    } catch {}
    throw new MailError(`resend ${res.status}: ${detail}`, `resend ${res.status} ${name}`.trim());
  }
}
