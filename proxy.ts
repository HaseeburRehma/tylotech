import { NextResponse, type NextRequest } from "next/server";
import { localizePath } from "@/lib/i18n";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, isBot, preferredLocale } from "@/lib/langPref";

/* Automatic language detection — German pages only.
 *
 * A first-time visitor whose browser prefers English (or any language other
 * than German) is sent to the English version of the same page. The choice is
 * then remembered in a cookie; the DE | EN switch overwrites it, so whoever
 * picks German stays on German. English URLs are never redirected, search
 * engines and link previews are never redirected (both language versions
 * stay indexable), and nothing but page routes passes through here. */
export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  // client-side navigation/prefetch requests: the switch and in-site links decide
  if (request.headers.get("next-router-prefetch") || request.headers.get("rsc")) return;
  if (request.nextUrl.searchParams.has("lang")) return;

  const saved = request.cookies.get(LANG_COOKIE)?.value;
  if (saved === "de") return;

  if (saved !== "en") {
    if (isBot(request.headers.get("user-agent"))) return;
    if (preferredLocale(request.headers.get("accept-language")) !== "en") return;
  }

  const url = request.nextUrl.clone();
  url.pathname = localizePath(request.nextUrl.pathname, "en");
  const res = NextResponse.redirect(url, 307);
  res.cookies.set(LANG_COOKIE, "en", { path: "/", maxAge: LANG_COOKIE_MAX_AGE, sameSite: "lax" });
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export const config = {
  // the German page routes only (no assets, API, English pages, sitemap …)
  matcher: ["/", "/kontakt", "/impressum", "/datenschutz", "/branchen/:slug"],
};
