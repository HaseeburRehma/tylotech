/* Where a form was filled in, for the lead in TyloHQ: the page, the referring site
 * (host only) and the ad parameters in that page's address. Read at submit time from
 * the address bar; nothing is stored in the visitor's browser. */

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export function formAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const out: Record<string, string> = { page: window.location.pathname };
  for (const k of KEYS) {
    const v = q.get(k);
    if (v) out[k] = v;
  }
  try {
    const ref = document.referrer ? new URL(document.referrer).hostname : "";
    if (ref && ref !== window.location.hostname) out.referrer = ref;
  } catch {
    /* no referrer */
  }
  return out;
}
