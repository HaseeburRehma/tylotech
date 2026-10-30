/* Every form submission → TyloHQ (www.tylohq.de), as a lead of the TyloTech partner.
 *
 *   TYLOHQ_LEADS_URL  the "Website / API" lead source URL from TyloHQ (Leads → Lead
 *                     sources). It carries the source's key, so it lives in the
 *                     environment only, never in the code.
 *
 * Sent next to the team e-mail; a submission counts as delivered if either arrived.
 * Never throws: TyloHQ being slow or down must not cost a visitor their enquiry. */

export interface Field {
  label: string;
  value: string;
}

/** What the browser sends with a form: where it was filled in, ad parameters from that page. */
export interface Attribution {
  page: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  fbclid: string;
}

const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;
const one = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, n) : "");

/** Accept only what we asked for, short and printable (it comes from the visitor's browser). */
export function cleanAttribution(input: unknown): Attribution {
  const a = (input && typeof input === "object" && !Array.isArray(input) ? input : {}) as Record<string, unknown>;
  const page = one(a.page, 300);
  const referrer = one(a.referrer, 120);
  const out = { page: page.startsWith("/") ? page : "", referrer: /^[a-z0-9.-]+$/i.test(referrer) ? referrer.toLowerCase() : "" } as Attribution;
  for (const k of ATTR_KEYS) out[k] = one(a[k], k === "gclid" || k === "fbclid" ? 300 : 150);
  return out;
}

/** The TyloHQ webhook body: answers as label/value pairs, form name, ad attribution. */
export function tylohqPayload(form: string, fields: Field[], attribution: Attribution, id: string, now = new Date()) {
  const answers = fields.filter((f) => f.label && f.value).map((f) => ({ label: f.label.slice(0, 120), value: f.value.slice(0, 4000) }));
  const extra: Field[] = [
    { label: "Seite", value: attribution.page },
    { label: "Herkunft", value: attribution.referrer },
    { label: "Google Klick-ID", value: attribution.gclid },
    { label: "Meta Klick-ID", value: attribution.fbclid },
    { label: "UTM Medium", value: attribution.utm_medium },
    { label: "UTM Content", value: attribution.utm_content },
    { label: "UTM Term", value: attribution.utm_term },
  ].filter((f) => f.value);
  return {
    form_name: form,
    submission_id: id,
    submitted_at: now.toISOString(),
    ...(attribution.utm_campaign ? { utm_campaign: attribution.utm_campaign } : {}),
    // Without UTM tags the lead's platform is simply "website".
    ...(attribution.utm_source ? { utm_source: attribution.utm_source } : {}),
    fields: [...answers, ...extra],
  };
}

export const tylohqConfigured = () => /^https:\/\//.test(process.env.TYLOHQ_LEADS_URL ?? "");

/** POST the submission to TyloHQ. true when TyloHQ stored it (or already had it). */
export async function sendToTyloHQ(form: string, fields: Field[], attribution: Attribution): Promise<boolean> {
  const url = process.env.TYLOHQ_LEADS_URL;
  if (!url || !/^https:\/\//.test(url)) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tylohqPayload(form, fields, attribution, crypto.randomUUID())),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("tylohq: lead not stored", res.status);
    return res.ok;
  } catch (err) {
    console.error("tylohq: lead not sent", err instanceof Error ? err.name : "error");
    return false;
  }
}
