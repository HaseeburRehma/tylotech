"use client";

import { createContext, useCallback, useContext } from "react";
import { localizePath, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("de");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current site language ("de" | "en"). */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** t("Deutsch", "English") → the string (or any value) for the current language. */
export function useT() {
  const locale = useLocale();
  // two type params so t(<jsx />, "text") or t("a", 1) type-check without annotations
  return useCallback(<A, B = A>(de: A, en: B): A | B => (locale === "en" ? en : de), [locale]);
}

/** lp("/kontakt") → "/kontakt" on the German site, "/en/contact" on the English one. */
export function useLocalePath() {
  const locale = useLocale();
  return useCallback((href: string) => localizePath(href, locale), [locale]);
}
