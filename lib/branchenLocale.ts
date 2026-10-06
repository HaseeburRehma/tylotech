import { BRANCHEN } from "./branchen";
import { BRANCHEN_EN } from "./branchen.en";
import type { Locale } from "./i18n";

export function getBrancheFor(slug: string, locale: Locale) {
  return (locale === "en" ? BRANCHEN_EN : BRANCHEN).find((b) => b.slug === slug);
}
