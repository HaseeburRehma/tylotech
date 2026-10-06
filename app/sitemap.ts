import type { MetadataRoute } from "next";
import { BRANCHEN } from "@/lib/branchen";
import { localizePath } from "@/lib/i18n";

const BASE = "https://www.tylotech.de";

/** Every page in both languages, each pointing at its counterpart (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const dePaths = ["/", "/kontakt", "/impressum", "/datenschutz", ...BRANCHEN.map((b) => `/branchen/${b.slug}`)];
  const now = new Date();
  return dePaths.flatMap((de) => {
    const en = localizePath(de, "en");
    const languages = { de: `${BASE}${de}`, en: `${BASE}${en}` };
    const priority = de === "/" ? 1 : de.startsWith("/branchen/") || de === "/kontakt" ? 0.8 : 0.3;
    return [
      { url: `${BASE}${de}`, lastModified: now, priority, alternates: { languages } },
      { url: `${BASE}${en}`, lastModified: now, priority, alternates: { languages } },
    ];
  });
}
