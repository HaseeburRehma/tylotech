"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";
import { loadPixel, trackMeta } from "@/lib/metaPixel";
import { META_PIXEL_ID } from "@/lib/site";

/* Meta Pixel (dataset "TyloTech Website") — loaded ONLY after the visitor allows
 * "Marketing" in the cookie banner, also when that happens later on the page.
 * PageView on every route, ViewContent on the software landing page.
 * Withdrawing consent deletes the Meta cookies and reloads the page once. */
const SOFTWARE = /^\/(en\/)?software(\/app-bauplan)?$/;

function clearMetaCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of ["_fbp", "_fbc"]) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const apply = (c: Consent | null) => {
      if (c?.marketing) {
        loadPixel();
        setAllowed(true);
      } else if ((window as Window & { fbq?: unknown }).fbq) {
        setAllowed(false);
        clearMetaCookies();
        window.setTimeout(() => location.reload(), 150);
      }
    };
    apply(readConsent());
    const onChange = (e: Event) => apply((e as CustomEvent<Consent>).detail ?? readConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    trackMeta("PageView");
    if (SOFTWARE.test(pathname)) trackMeta("ViewContent", { content_name: "Software App-Bauplan", content_type: "landing_page" });
  }, [allowed, pathname]);

  return null;
}
