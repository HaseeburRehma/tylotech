/* Language preference shared by the proxy (server) and the language switch (browser). */

export const LANG_COOKIE = "tt-lang";
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

/** Search engines and link previews must always get the URL they asked for. */
const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|vkshare|w3c_validator|whatsapp|telegram|discord|slack|lighthouse|headless|preview/i;
export const isBot = (ua: string | null) => !ua || BOT.test(ua);

/** "de" | "en" from an Accept-Language header, or null when the browser sent none.
 *  German wins only if the visitor ranks German at least as high as English;
 *  everyone without German (English, French, Polish …) gets the English site. */
export function preferredLocale(acceptLanguage: string | null): "de" | "en" | null {
  if (!acceptLanguage) return null;
  let de = -1;
  let en = -1;
  let named = 0;
  for (const part of acceptLanguage.split(",")) {
    const [tag, ...params] = part.trim().toLowerCase().split(";");
    const lang = tag?.split("-")[0];
    if (!lang || lang === "*") continue;
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
    if (!Number.isFinite(q) || q <= 0) continue;
    named++;
    if (lang === "de") de = Math.max(de, q);
    else if (lang === "en") en = Math.max(en, q);
  }
  if (!named) return null;
  if (de < 0) return "en";
  return de >= en ? "de" : "en";
}
