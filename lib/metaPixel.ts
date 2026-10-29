import { readConsent } from "@/lib/consent";
import { META_PIXEL_ID } from "@/lib/site";

/* Meta Pixel + Conversions API. Every event goes to the browser pixel and to
 * /api/meta (server → Meta) with one shared event_id, so Meta deduplicates and
 * keeps whichever arrives; ad blockers and iOS then lose fewer conversions.
 * Nothing is sent without "marketing" consent. */

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; push?: unknown; loaded?: boolean; version?: string };
type W = Window & { fbq?: Fbq; _fbq?: Fbq };

export type MetaUser = { email?: string; phone?: string; name?: string };

export const metaAllowed = () => !!META_PIXEL_ID && !!readConsent()?.marketing;

/** Meta's standard bootstrap (queue + async fbevents.js), run once. */
export function loadPixel() {
  const w = window as W;
  if (w.fbq || !META_PIXEL_ID) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue!.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = n;
  if (!w._fbq) w._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", META_PIXEL_ID);
}

const eventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];

export function trackMeta(event: string, params: Record<string, unknown> = {}, user: MetaUser = {}) {
  if (!metaAllowed()) return;
  loadPixel();
  const id = eventId();
  const w = window as W;
  // advanced matching: Meta hashes these in the browser before sending
  const [fn, ...rest] = (user.name ?? "").trim().toLowerCase().split(/\s+/);
  const am: Record<string, string> = {};
  if (user.email) am.em = user.email.trim().toLowerCase();
  if (user.phone) am.ph = user.phone.replace(/\D/g, "");
  if (fn) am.fn = fn;
  if (rest.length) am.ln = rest.join(" ");
  if (Object.keys(am).length) w.fbq?.("init", META_PIXEL_ID, am);
  w.fbq?.("track", event, params, { eventID: id });

  fetch("/api/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ event, eventId: id, url: location.href, params, user, fbp: cookie("_fbp"), fbc: cookie("_fbc") }),
  }).catch(() => {});
}

/** A sent form: Lead on Meta (pixel + Conversions API). */
export function trackMetaLead(source: string, user: MetaUser, params: Record<string, unknown> = {}) {
  trackMeta("Lead", { content_name: source, content_category: "TyloTech", currency: "EUR", value: 0, ...params }, user);
}
