"use client";

import { usePathname } from "next/navigation";
import { alternatePath, type Locale } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

const LABEL: Record<Locale, { short: string; long: string }> = {
  de: { short: "DE", long: "Deutsch" },
  en: { short: "EN", long: "English" },
};

/** DE | EN segmented switch; links to the same page in the other language.
 *  The two languages have separate root layouts, so a plain <a> (one direct
 *  document load) is faster than a client-side <Link>, which would fetch the
 *  RSC payload first and then fall back to a full reload anyway. */
export default function LanguageSwitch({ dark = false, size = "sm", onNavigate }: { dark?: boolean; size?: "sm" | "lg"; onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const big = size === "lg";
  return (
    <div
      role="group"
      aria-label={locale === "en" ? "Language" : "Sprache"}
      className={`inline-flex items-center rounded-full border p-0.5 transition-colors duration-500 ${
        dark ? "border-white/15 bg-white/[0.04]" : "border-line bg-white/70"
      }`}
    >
      {(["de", "en"] as Locale[]).map((l) => {
        const on = l === locale;
        return (
          <a
            key={l}
            href={alternatePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={on ? "true" : undefined}
            aria-label={LABEL[l].long}
            title={LABEL[l].long}
            onClick={onNavigate}
            className={`grid place-items-center rounded-full font-mono font-medium tracking-[0.08em] transition-colors duration-300 ${
              big ? "h-10 min-w-[64px] px-4 text-[13px]" : "h-8 min-w-[38px] px-2.5 text-[11.5px]"
            } ${
              on
                ? dark
                  ? "bg-accent text-[#001620]"
                  : "bg-[#002e3d] text-white"
                : dark
                  ? "text-white/60 hover:text-white"
                  : "text-[#5c5954] hover:text-ink"
            }`}
          >
            {big ? LABEL[l].long : LABEL[l].short}
          </a>
        );
      })}
    </div>
  );
}
