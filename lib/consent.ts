/* Cookie consent shared by the banner, the footer link and the trackers.
 * Stored in localStorage ("tt-cookie-consent"). Version 2 added the
 * "statistics" category (Microsoft Clarity); older choices are asked again. */

export const CONSENT_KEY = "tt-cookie-consent";
export const CONSENT_VERSION = 2;
/** fired on window after every change (detail: Consent) */
export const CONSENT_EVENT = "tt:consent";
/** fire on window to reopen the banner (footer "Cookie settings") */
export const OPEN_SETTINGS_EVENT = "tt:cookie-settings";

export type Consent = {
  necessary: true;
  functional: boolean;
  statistics: boolean;
  marketing: boolean;
  v: number;
  ts: number;
};

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<Consent>;
    return {
      necessary: true,
      functional: !!c.functional,
      statistics: !!c.statistics,
      marketing: !!c.marketing,
      v: typeof c.v === "number" ? c.v : 1,
      ts: typeof c.ts === "number" ? c.ts : 0,
    };
  } catch {
    return null;
  }
}

export function writeConsent(c: Omit<Consent, "v" | "ts" | "necessary">) {
  const full: Consent = { necessary: true, ...c, v: CONSENT_VERSION, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
  } catch {
    /* storage unavailable — the choice still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: full }));
  return full;
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
