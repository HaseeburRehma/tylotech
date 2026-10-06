/* Two languages: German on the existing URLs, English under /en with English
 * page names. Every internal link goes through localizePath so it stays in
 * the visitor's language; the language switcher uses alternatePath. */

export type Locale = "de" | "en";
export const LOCALES: Locale[] = ["de", "en"];

/** German industry slug → English slug (the data stays keyed by the German one). */
export const BRANCHE_SLUG_EN: Record<string, string> = {
  handwerk: "trades",
  "lokale-dienstleister": "local-services",
  "online-dienstleistungen": "online-services",
  "e-commerce": "e-commerce",
  "b2b-dienstleistung": "b2b-services",
  "finanz-investment": "finance-investment",
};
const BRANCHE_SLUG_DE: Record<string, string> = Object.fromEntries(Object.entries(BRANCHE_SLUG_EN).map(([de, en]) => [en, de]));

const PAGE_EN: Record<string, string> = {
  "/": "/en",
  "/kontakt": "/en/contact",
  "/impressum": "/en/imprint",
  "/datenschutz": "/en/privacy",
};
const PAGE_DE: Record<string, string> = Object.fromEntries(Object.entries(PAGE_EN).map(([de, en]) => [en, de]));

function split(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

/** Turn a German site path into the one for `locale` ("/kontakt?x#y" → "/en/contact?x#y").
 *  Hash-only, external, mailto: and tel: links are returned unchanged. */
export function localizePath(href: string, locale: Locale): string {
  if (locale === "de" || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/")) return href;
  if (href === "/en" || href.startsWith("/en/") || href.startsWith("/en#") || href.startsWith("/en?")) return href;
  const [path, rest] = split(href);
  if (PAGE_EN[path]) return PAGE_EN[path] + rest;
  const m = path.match(/^\/branchen\/([^/]+)\/?$/);
  if (m) return `/en/industries/${BRANCHE_SLUG_EN[m[1]] ?? m[1]}${rest}`;
  return `/en${path}${rest}`;
}

/** German path for an English one ("/en/industries/trades" → "/branchen/handwerk"). */
export function delocalizePath(href: string): string {
  const [path, rest] = split(href);
  if (PAGE_DE[path]) return PAGE_DE[path] + rest;
  const m = path.match(/^\/en\/industries\/([^/]+)\/?$/);
  if (m) return `/branchen/${BRANCHE_SLUG_DE[m[1]] ?? m[1]}${rest}`;
  if (path.startsWith("/en/")) return path.slice(3) + rest;
  return href;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de";
}

/** The same page in the other language (for the switcher and hreflang). */
export function alternatePath(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname);
  if (current === target) return pathname;
  return target === "en" ? localizePath(pathname, "en") : delocalizePath(pathname);
}

/** hreflang alternates for a German path, for page metadata. */
export function languageAlternates(dePath: string) {
  return { de: dePath, en: localizePath(dePath, "en"), "x-default": dePath };
}

/** Pick the value for a locale from a { de, en } pair. */
export function pick<T>(locale: Locale, v: { de: T; en: T }): T {
  return locale === "en" ? v.en : v.de;
}

/** Number formatting per locale (1.234 vs 1,234). */
export function formatNumber(locale: Locale, n: number, opts?: Intl.NumberFormatOptions) {
  return n.toLocaleString(locale === "en" ? "en-GB" : "de-DE", opts);
}
