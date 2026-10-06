import { CONTACT, topicLabel } from "../contact";
import type { Locale } from "../i18n";
import { TL_BRANCHEN_EN, TL_ZIELE_EN } from "../tylolens";

/* Branded e-mails for the contact form. Table layout + inline styles so they render in
   Outlook, Gmail and Apple Mail alike; images are PNG (SVG is blocked by most clients). */

export type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  branche: string; // label, may be empty
  topics: string[];
  message: string;
};

type Mail = { subject: string; html: string; text: string };

const C = {
  page: "#f6f5f3",
  card: "#ffffff",
  dark: "#001620",
  teal: "#002e3d",
  gold: "#d1aa71",
  goldText: "#94713f",
  cream: "#fbf6ee",
  creamLine: "#ecd8b6",
  ink: "#1a1917",
  muted: "#5c5954",
  faint: "#7d7973",
  line: "#eeedea",
};
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,monospace";

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const when = () =>
  new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date()) + " Uhr";

/** first name only, letters/space/hyphen/apostrophe — keeps the auto-reply free of injected links */
export const firstName = (name: string) =>
  (name.trim().split(/\s+/)[0] ?? "").replace(/[^\p{L}'’-]/gu, "").slice(0, 40);

const chips = (items: string[]) =>
  items
    .map(
      (t) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:5px 12px;border:1px solid ${C.creamLine};border-radius:999px;background:${C.cream};color:#7a5b30;font:500 12px/16px ${SANS}">${esc(t)}</span>`,
    )
    .join("");

const button = (href: string, label: string, primary = true) =>
  `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 22px;border-radius:999px;${
    primary ? `background:${C.teal};color:#ffffff;border:1px solid ${C.teal}` : `background:#ffffff;color:${C.ink};border:1px solid #e2e0dc`
  };font:600 14px/18px ${SANS};text-decoration:none">${label}</a>`;

function layout({ preheader, badge, body, footer, origin, lang = "de" }: { preheader: string; badge: string; body: string; footer: string; origin: string; lang?: Locale }) {
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>TyloTech</title></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}">
<tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
  <tr><td style="background:${C.dark};background-image:radial-gradient(ellipse at 0% 0%,rgba(209,170,113,0.28),rgba(209,170,113,0) 60%);border-radius:20px 20px 0 0;padding:26px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><a href="${esc(origin)}" style="text-decoration:none"><img src="${esc(origin)}/brand/tylotech-logo-email-dark.png" width="143" height="36" alt="TyloTech" style="display:block;border:0;width:143px;height:36px"></a></td>
      <td align="right" style="font:600 11px/14px ${MONO};letter-spacing:1px;text-transform:uppercase;color:${C.gold}">${badge}</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:${C.card};border:1px solid ${C.line};border-top:0;border-radius:0 0 20px 20px;padding:36px 32px">${body}</td></tr>
  <tr><td style="padding:22px 16px 0;text-align:center;font:400 12px/19px ${SANS};color:${C.faint}">${footer}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

const h1 = (inner: string) => `<h1 style="margin:0 0 10px;font:600 26px/32px ${SANS};letter-spacing:-0.5px;color:${C.ink}">${inner}</h1>`;
const p = (inner: string, extra = "") => `<p style="margin:0 0 16px;font:400 15px/24px ${SANS};color:${C.muted};${extra}">${inner}</p>`;
const label = (t: string) => `<p style="margin:0 0 10px;font:600 11px/14px ${MONO};letter-spacing:0.8px;text-transform:uppercase;color:${C.faint}">${t}</p>`;
const accent = (t: string) => `<span style="font-family:${SERIF};font-style:italic;font-weight:400;color:${C.goldText}">${t}</span>`;

/* ---- 1 · notification to the team ---------------------------------------- */

/** extra line in team e-mails when the visitor wrote from the English site */
const LANG_EN = "Englisch (EN-Seite)";

export function teamNotification(e: Enquiry, origin: string, source: string, locale: Locale = "de"): Mail {
  const tel = e.phone ? `tel:${e.phone.replace(/[^\d+]/g, "")}` : "";
  const rows: [string, string][] = [
    ["Name", esc(e.name)],
    ["Unternehmen", esc(e.company) || "—"],
    ["E-Mail", `<a href="mailto:${esc(e.email)}" style="color:${C.goldText};text-decoration:underline">${esc(e.email)}</a>`],
    ["Telefon", e.phone ? `<a href="${esc(tel)}" style="color:${C.goldText};text-decoration:underline">${esc(e.phone)}</a>` : "—"],
    ["Branche", esc(e.branche) || "—"],
    ...(locale === "en" ? ([["Sprache", LANG_EN]] as [string, string][]) : []),
  ];
  const reply = `mailto:${e.email}?subject=${encodeURIComponent(locale === "en" ? "Your enquiry at TyloTech" : "Deine Anfrage bei TyloTech")}`;

  const body = `
    ${label("Neue Anfrage über die Website")}
    ${h1(`${esc(e.name)} möchte ein ${accent("Erstgespräch")}.`)}
    ${p([e.company, e.branche].filter(Boolean).map(esc).join(" · ") || "Privat / ohne Firmenangabe", "margin-bottom:20px")}
    ${e.topics.length ? `<div style="margin:0 0 22px">${chips(e.topics)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px;border-top:1px solid ${C.line}">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:11px 0;border-bottom:1px solid ${C.line};width:130px;font:500 13px/20px ${SANS};color:${C.faint};vertical-align:top">${k}</td><td style="padding:11px 0;border-bottom:1px solid ${C.line};font:400 15px/20px ${SANS};color:${C.ink}">${v}</td></tr>`,
        )
        .join("")}
    </table>
    ${label("Nachricht")}
    <div style="margin:0 0 28px;padding:16px 20px;background:${C.cream};border-left:3px solid ${C.gold};border-radius:4px 12px 12px 4px;font:400 15px/24px ${SANS};color:${C.ink};white-space:pre-wrap">${esc(e.message)}</div>
    <div>${button(reply, "Direkt antworten")}${e.phone ? button(tel, "Anrufen", false) : ""}</div>`;

  const footer = `Eingegangen am ${when()} über ${esc(source)}.<br>„Antworten“ geht direkt an ${esc(e.email)}.`;

  const text = [
    "Neue Anfrage über die Website",
    "",
    `Name: ${e.name}`,
    `Unternehmen: ${e.company || "—"}`,
    `E-Mail: ${e.email}`,
    `Telefon: ${e.phone || "—"}`,
    `Branche: ${e.branche || "—"}`,
    `Anliegen: ${e.topics.join(", ") || "—"}`,
    ...(locale === "en" ? [`Sprache: ${LANG_EN}`] : []),
    "",
    "Nachricht:",
    e.message,
    "",
    `Eingegangen am ${when()} über ${source}.`,
  ].join("\n");

  return {
    subject: `Neue Anfrage: ${e.name}${e.company ? ` (${e.company})` : ""}${e.topics[0] ? ` – ${e.topics[0]}` : ""}`,
    html: layout({ preheader: `${e.name}: ${e.message.slice(0, 90)}`, badge: "Neue Anfrage", body, footer, origin }),
    text,
  };
}

/* ---- 2 · confirmation to the person who wrote ----------------------------- */

const STEPS = [
  ["Wir lesen deine Anfrage", "Persönlich, nicht von einem Bot."],
  ["Wir melden uns bei dir", "Per E-Mail oder telefonisch, wie es dir lieber ist."],
  ["Kostenloses Erstgespräch", "Eine ehrliche Einschätzung, wo dein größter Hebel liegt."],
];

const STEPS_EN = [
  ["We read your enquiry", "Personally, not a bot."],
  ["We get back to you", "By email or phone, whichever you prefer."],
  ["Free initial consultation", "An honest assessment of where your biggest lever lies."],
];

export function customerConfirmation(e: Enquiry, origin: string, locale: Locale = "de"): Mail {
  if (locale === "en") return customerConfirmationEn(e, origin);
  const first = firstName(e.name);
  const hello = first ? `Danke, ${accent(esc(first))}!` : `Danke für deine ${accent("Anfrage")}!`;

  const body = `
    ${h1(hello)}
    ${p("deine Nachricht ist bei uns angekommen. Wir schauen sie uns genau an und melden uns persönlich bei dir: ehrlich, direkt und ohne Verkaufsdruck.")}
    ${e.topics.length ? `${label("Deine Themen")}<div style="margin:0 0 18px">${chips(e.topics)}</div>` : ""}
    ${label("So geht es weiter")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px">
      ${STEPS.map(
        ([t, d], i) => `<tr>
          <td style="width:44px;padding:0 0 14px;vertical-align:top"><div style="width:30px;height:30px;border:1px solid ${C.gold};border-radius:999px;text-align:center;font:600 12px/30px ${MONO};color:${C.goldText}">${i + 1}</div></td>
          <td style="padding:3px 0 14px;vertical-align:top"><div style="font:600 15px/21px ${SANS};color:${C.ink}">${t}</div><div style="font:400 14px/21px ${SANS};color:${C.faint}">${d}</div></td>
        </tr>`,
      ).join("")}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:${C.cream};border:1px solid ${C.creamLine};border-radius:14px">
      <tr><td style="padding:18px 20px">
        <div style="font:600 15px/21px ${SANS};color:${C.ink};margin:0 0 4px">Du willst nicht warten?</div>
        <div style="font:400 14px/22px ${SANS};color:${C.muted}">Ruf uns an unter <a href="${CONTACT.phoneHref}" style="color:${C.goldText};text-decoration:underline">${CONTACT.phone}</a> oder schreib an <a href="mailto:${CONTACT.email}" style="color:${C.goldText};text-decoration:underline">${CONTACT.email}</a>.</div>
      </td></tr>
    </table>
    <p style="margin:0;font:400 15px/24px ${SANS};color:${C.muted}">Herzliche Grüße<br><span style="font-family:${SERIF};font-style:italic;font-size:19px;color:${C.ink}">Dein TyloTech-Team</span></p>`;

  const footer = `TyloTech · ${CONTACT.street} · ${CONTACT.city}<br>
    <a href="${esc(origin)}/impressum" style="color:${C.faint}">Impressum</a> · <a href="${esc(origin)}/datenschutz" style="color:${C.faint}">Datenschutz</a><br>
    Du erhältst diese E-Mail, weil du über unsere Website eine Anfrage gestellt hast.`;

  const text = [
    first ? `Danke, ${first}!` : "Danke für deine Anfrage!",
    "",
    "deine Nachricht ist bei uns angekommen. Wir schauen sie uns genau an und melden uns persönlich bei dir: ehrlich, direkt und ohne Verkaufsdruck.",
    "",
    ...(e.topics.length ? [`Deine Themen: ${e.topics.join(", ")}`, ""] : []),
    "So geht es weiter:",
    ...STEPS.map(([t, d], i) => `${i + 1}. ${t}: ${d}`),
    "",
    `Du willst nicht warten? Ruf an unter ${CONTACT.phone} oder schreib an ${CONTACT.email}.`,
    "",
    "Herzliche Grüße",
    "Dein TyloTech-Team",
    "",
    `TyloTech · ${CONTACT.street} · ${CONTACT.city}`,
  ].join("\n");

  return {
    subject: "Danke für deine Anfrage bei TyloTech",
    html: layout({ preheader: "Wir haben deine Anfrage erhalten und melden uns persönlich bei dir.", badge: "Anfrage erhalten", body, footer, origin }),
    text,
  };
}

function customerConfirmationEn(e: Enquiry, origin: string): Mail {
  const first = firstName(e.name);
  const hello = first ? `Thank you, ${accent(esc(first))}!` : `Thank you for your ${accent("enquiry")}!`;
  const topics = e.topics.map((t) => topicLabel(t, "en"));
  const intro = "Your message has reached us. We’ll take a close look at it and get back to you personally: honest, direct and with no sales pressure.";

  const body = `
    ${h1(hello)}
    ${p(intro)}
    ${topics.length ? `${label("Your topics")}<div style="margin:0 0 18px">${chips(topics)}</div>` : ""}
    ${label("What happens next")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px">
      ${STEPS_EN.map(
        ([t, d], i) => `<tr>
          <td style="width:44px;padding:0 0 14px;vertical-align:top"><div style="width:30px;height:30px;border:1px solid ${C.gold};border-radius:999px;text-align:center;font:600 12px/30px ${MONO};color:${C.goldText}">${i + 1}</div></td>
          <td style="padding:3px 0 14px;vertical-align:top"><div style="font:600 15px/21px ${SANS};color:${C.ink}">${t}</div><div style="font:400 14px/21px ${SANS};color:${C.faint}">${d}</div></td>
        </tr>`,
      ).join("")}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:${C.cream};border:1px solid ${C.creamLine};border-radius:14px">
      <tr><td style="padding:18px 20px">
        <div style="font:600 15px/21px ${SANS};color:${C.ink};margin:0 0 4px">Don’t want to wait?</div>
        <div style="font:400 14px/22px ${SANS};color:${C.muted}">Call us on <a href="${CONTACT.phoneHref}" style="color:${C.goldText};text-decoration:underline">${CONTACT.phoneIntl}</a> or email <a href="mailto:${CONTACT.email}" style="color:${C.goldText};text-decoration:underline">${CONTACT.email}</a>.</div>
      </td></tr>
    </table>
    <p style="margin:0;font:400 15px/24px ${SANS};color:${C.muted}">Kind regards<br><span style="font-family:${SERIF};font-style:italic;font-size:19px;color:${C.ink}">The TyloTech team</span></p>`;

  const footer = `TyloTech · ${CONTACT.street} · ${CONTACT.city} · Germany<br>
    <a href="${esc(origin)}/en/imprint" style="color:${C.faint}">Legal notice</a> · <a href="${esc(origin)}/en/privacy" style="color:${C.faint}">Privacy policy</a><br>
    You’re receiving this email because you sent us an enquiry via our website.`;

  const text = [
    first ? `Thank you, ${first}!` : "Thank you for your enquiry!",
    "",
    intro,
    "",
    ...(topics.length ? [`Your topics: ${topics.join(", ")}`, ""] : []),
    "What happens next:",
    ...STEPS_EN.map(([t, d], i) => `${i + 1}. ${t}: ${d}`),
    "",
    `Don’t want to wait? Call us on ${CONTACT.phoneIntl} or email ${CONTACT.email}.`,
    "",
    "Kind regards",
    "The TyloTech team",
    "",
    `TyloTech · ${CONTACT.street} · ${CONTACT.city} · Germany`,
  ].join("\n");

  return {
    subject: "Thank you for your enquiry to TyloTech",
    html: layout({ preheader: "We’ve received your enquiry and will get back to you personally.", badge: "Enquiry received", body, footer, origin, lang: "en" }),
    text,
  };
}

/* ---- 3 · TyloLens: lead for a personal 48 h video analysis ------------------ */

export type LensLead = { website: string; branche: string; ziel: string; budget: string; budgetLabel: string; priority: string; name: string; email: string };

const PRIO_COLOR: Record<string, string> = { top: "#1e7a52", high: "#1e7a52", mid: "#94713f", low: "#7d7973" };

export function lensTeamNotification(l: LensLead, origin: string, locale: Locale = "de"): Mail {
  const host = l.website.replace(/^https?:\/\//, "");
  const reply = `mailto:${l.email}?subject=${encodeURIComponent(`Deine TyloLens-Analyse für ${host}`)}`;
  const rows: [string, string][] = [
    ["Website", `<a href="${esc(l.website)}" style="color:${C.goldText};text-decoration:underline">${esc(host)}</a>`],
    ["Branche", esc(l.branche)],
    ["Größtes Ziel", esc(l.ziel)],
    ["Budget / Monat", `<b>${esc(l.budgetLabel)}</b>`],
    ["Name", esc(l.name)],
    ["E-Mail", `<a href="mailto:${esc(l.email)}" style="color:${C.goldText};text-decoration:underline">${esc(l.email)}</a>`],
    ...(locale === "en" ? ([["Sprache", LANG_EN]] as [string, string][]) : []),
  ];
  const body = `
    ${label("TyloLens · neue Analyse-Anfrage")}
    ${h1(`${esc(l.name)} möchte wissen, was wir ${accent("anders machen")} würden.`)}
    <p style="margin:0 0 20px"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${PRIO_COLOR[l.budget] ?? C.faint};color:#fff;font:600 12px/16px ${SANS}">${esc(l.priority)} · Budget ${esc(l.budgetLabel)}</span></p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-top:1px solid ${C.line}">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:11px 0;border-bottom:1px solid ${C.line};width:140px;font:500 13px/20px ${SANS};color:${C.faint};vertical-align:top">${k}</td><td style="padding:11px 0;border-bottom:1px solid ${C.line};font:400 15px/20px ${SANS};color:${C.ink}">${v}</td></tr>`,
        )
        .join("")}
    </table>
    <div style="margin:0 0 26px;padding:14px 18px;background:${C.cream};border-left:3px solid ${C.gold};border-radius:4px 12px 12px 4px;font:400 14px/22px ${SANS};color:${C.ink}">
      Zugesagt: persönliches Loom-Video mit 3 konkreten Hebeln, <b>innerhalb von 48 Stunden</b>.
    </div>
    <div>${button(l.website, "Website öffnen")}${button(reply, "Analyse senden", false)}</div>`;
  const footer = `Eingegangen am ${when()} über TyloLens auf ${esc(new URL(origin).host)}.<br>„Antworten“ geht direkt an ${esc(l.email)}.`;
  const text = [
    "TyloLens · neue Analyse-Anfrage",
    `${l.priority} · Budget ${l.budgetLabel}`,
    "",
    `Website: ${l.website}`,
    `Branche: ${l.branche}`,
    `Größtes Ziel: ${l.ziel}`,
    `Budget / Monat: ${l.budgetLabel}`,
    `Name: ${l.name}`,
    `E-Mail: ${l.email}`,
    ...(locale === "en" ? [`Sprache: ${LANG_EN}`] : []),
    "",
    "Zugesagt: persönliches Video mit 3 Hebeln innerhalb von 48 Stunden.",
  ].join("\n");
  return {
    subject: `TyloLens [${l.budgetLabel}] ${host} · ${l.name}`,
    html: layout({ preheader: `${l.priority}: ${host} · ${l.ziel}`, badge: "TyloLens", body, footer, origin }),
    text,
  };
}

/* TyloLens options arrive as their canonical German values; English display labels live in lib/tylolens.ts */
const TL_EN: Record<string, string> = { ...TL_BRANCHEN_EN, ...TL_ZIELE_EN };
const tlEn = (v: string) => TL_EN[v] ?? v;

export function lensConfirmation(l: LensLead, origin: string, locale: Locale = "de"): Mail {
  if (locale === "en") return lensConfirmationEn(l, origin);
  const first = firstName(l.name);
  const host = l.website.replace(/^https?:\/\//, "");
  const body = `
    ${h1(first ? `Danke, ${accent(esc(first))}!` : `Danke für deine ${accent("Anfrage")}!`)}
    ${p(`Unser Team schaut sich <b style="color:${C.ink}">${esc(host)}</b> jetzt persönlich an.`)}
    ${p(`Du bekommst deine individuelle Analyse als <b style="color:${C.ink}">kurzes Video</b> innerhalb von <b style="color:${C.ink}">48 Stunden</b> per E-Mail — mit 3 konkreten Hebeln, die wir bei dir anders machen würden.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 28px;background:${C.cream};border:1px solid ${C.creamLine};border-radius:14px">
      <tr><td style="padding:16px 20px;font:400 14px/22px ${SANS};color:${C.muted}">
        <b style="color:${C.ink}">Dein Fokus:</b> ${esc(l.ziel)} · ${esc(l.branche)}
      </td></tr>
    </table>
    <p style="margin:0;font:400 15px/24px ${SANS};color:${C.muted}">Bis gleich<br><span style="font-family:${SERIF};font-style:italic;font-size:19px;color:${C.ink}">Dein TyloTech-Team</span></p>`;
  const footer = `TyloTech · ${CONTACT.street} · ${CONTACT.city}<br>
    <a href="${esc(origin)}/impressum" style="color:${C.faint}">Impressum</a> · <a href="${esc(origin)}/datenschutz" style="color:${C.faint}">Datenschutz</a><br>
    Du erhältst diese E-Mail, weil du über TyloLens eine Analyse angefordert hast.`;
  const text = [
    first ? `Danke, ${first}!` : "Danke für deine Anfrage!",
    "",
    `Unser Team schaut sich ${host} jetzt persönlich an.`,
    "Du bekommst deine individuelle Analyse als kurzes Video innerhalb von 48 Stunden per E-Mail — mit 3 konkreten Hebeln, die wir bei dir anders machen würden.",
    "",
    `Dein Fokus: ${l.ziel} · ${l.branche}`,
    "",
    "Bis gleich",
    "Dein TyloTech-Team",
  ].join("\n");
  return {
    subject: "Deine TyloLens-Analyse ist in Arbeit",
    html: layout({ preheader: "Dein persönliches Analyse-Video kommt innerhalb von 48 Stunden.", badge: "TyloLens", body, footer, origin }),
    text,
  };
}

function lensConfirmationEn(l: LensLead, origin: string): Mail {
  const first = firstName(l.name);
  const host = l.website.replace(/^https?:\/\//, "");
  const focus = `${tlEn(l.ziel)} · ${tlEn(l.branche)}`;
  const body = `
    ${h1(first ? `Thank you, ${accent(esc(first))}!` : `Thank you for your ${accent("request")}!`)}
    ${p(`Our team is now taking a personal look at <b style="color:${C.ink}">${esc(host)}</b>.`)}
    ${p(`You’ll receive your individual analysis as a <b style="color:${C.ink}">short video</b> by email within <b style="color:${C.ink}">48 hours</b> — with 3 concrete levers we would approach differently in your case.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 28px;background:${C.cream};border:1px solid ${C.creamLine};border-radius:14px">
      <tr><td style="padding:16px 20px;font:400 14px/22px ${SANS};color:${C.muted}">
        <b style="color:${C.ink}">Your focus:</b> ${esc(focus)}
      </td></tr>
    </table>
    <p style="margin:0;font:400 15px/24px ${SANS};color:${C.muted}">Speak soon<br><span style="font-family:${SERIF};font-style:italic;font-size:19px;color:${C.ink}">The TyloTech team</span></p>`;
  const footer = `TyloTech · ${CONTACT.street} · ${CONTACT.city} · Germany<br>
    <a href="${esc(origin)}/en/imprint" style="color:${C.faint}">Legal notice</a> · <a href="${esc(origin)}/en/privacy" style="color:${C.faint}">Privacy policy</a><br>
    You’re receiving this email because you requested an analysis via TyloLens.`;
  const text = [
    first ? `Thank you, ${first}!` : "Thank you for your request!",
    "",
    `Our team is now taking a personal look at ${host}.`,
    "You’ll receive your individual analysis as a short video by email within 48 hours — with 3 concrete levers we would approach differently in your case.",
    "",
    `Your focus: ${focus}`,
    "",
    "Speak soon",
    "The TyloTech team",
  ].join("\n");
  return {
    subject: "Your TyloLens analysis is under way",
    html: layout({ preheader: "Your personal analysis video will arrive within 48 hours.", badge: "TyloLens", body, footer, origin, lang: "en" }),
    text,
  };
}
