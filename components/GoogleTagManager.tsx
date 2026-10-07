"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";
import { GTM_ID } from "@/lib/site";

type W = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; __gtmLoaded?: boolean };

/* Google Tag Manager (GTM-THB66H9Q → GA4 G-1DEQH4QLE4 and the tags configured
 * in the container). Google Consent Mode v2 in "basic" form: everything is
 * denied by default and gtm.js is only requested once the visitor allows
 * "Statistik" (analytics) or "Marketing" (ads) — nothing goes to Google before.
 * Changes are passed on as consent updates; withdrawing all consent deletes the
 * Google cookies and reloads once so the loaded tags are gone. */

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- typed signature; gtag reads `arguments`
function gtag(...args: unknown[]) {
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  // gtag() must push the arguments object, not an array (Google's contract)
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

const state = (c: Consent | null) => ({
  analytics_storage: c?.statistics ? "granted" : "denied",
  ad_storage: c?.marketing ? "granted" : "denied",
  ad_user_data: c?.marketing ? "granted" : "denied",
  ad_personalization: c?.marketing ? "granted" : "denied",
});

function loadGtm() {
  const w = window as W;
  if (w.__gtmLoaded) return;
  w.__gtmLoaded = true;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

function clearGoogleCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_gcl_)/.test(n));
  for (const name of names) for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
}

export default function GoogleTagManager() {
  useEffect(() => {
    if (!GTM_ID) return;
    const w = window as W;
    w.gtag = w.gtag || gtag;

    const initial = readConsent();
    // defaults first — before any tag can run
    gtag("consent", "default", { ...state(null), functionality_storage: "granted", security_storage: "granted", wait_for_update: 500 });
    gtag("set", "ads_data_redaction", true);
    if (initial?.statistics || initial?.marketing) {
      gtag("consent", "update", state(initial));
      loadGtm();
    }

    const onChange = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail ?? readConsent();
      gtag("consent", "update", state(c));
      if (c?.statistics || c?.marketing) loadGtm();
      else if (w.__gtmLoaded) {
        clearGoogleCookies();
        window.setTimeout(() => location.reload(), 150);
      }
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);
  return null;
}
