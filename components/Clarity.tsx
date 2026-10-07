"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";
import { CLARITY_ID } from "@/lib/site";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
type W = Window & { clarity?: ClarityFn };

/* Microsoft Clarity (heatmaps, session recordings) — loaded ONLY after the
 * visitor allows "Statistik / Statistics" in the cookie banner, also when that
 * happens later on the same page. Withdrawing consent stops Clarity, deletes
 * its cookies and reloads the page once (so the loaded script is gone). Consent state is passed on via Clarity's consent API. */
function load(c: Consent) {
  const w = window as W;
  if (!w.clarity) {
    // Microsoft's snippet (queue + async tag)
    const q: ClarityFn = function (...args: unknown[]) {
      (q.q = q.q || []).push(args);
    } as ClarityFn;
    w.clarity = q;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
    const first = document.getElementsByTagName("script")[0];
    if (first?.parentNode) first.parentNode.insertBefore(s, first);
    else document.head.appendChild(s);
  }
  w.clarity!("consentv2", { ad_Storage: c.marketing ? "granted" : "denied", analytics_Storage: "granted" });
}

function stop() {
  const w = window as W;
  w.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
  w.clarity?.("consent", false);
  // remove Clarity's first-party cookies on this domain and its parent
  const host = location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of ["_clck", "_clsk", "CLID", "ANONCHK", "MR", "MUID", "SM"]) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
  // a loaded script can't be unloaded: reload once so nothing more is sent
  window.setTimeout(() => location.reload(), 150);
}

export default function Clarity() {
  useEffect(() => {
    if (!CLARITY_ID) return;
    const apply = (c: Consent | null) => {
      if (c?.statistics) load(c);
      else if ((window as W).clarity) stop();
    };
    apply(readConsent());
    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail ?? readConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);
  return null;
}
