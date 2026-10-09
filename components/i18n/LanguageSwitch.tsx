"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { alternatePath, type Locale } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE } from "@/lib/langPref";
import { cn } from "@/lib/cn";

const LANGS: Locale[] = ["de", "en"];
const LABEL: Record<Locale, { short: string; long: string }> = {
  de: { short: "DE", long: "Deutsch" },
  en: { short: "EN", long: "English" },
};

/** DE | EN segmented switch with a sliding thumb; links to the same page in the other language.
 *  The two languages have separate root layouts, so a plain <a> (one direct
 *  document load) is faster than a client-side <Link>, which would fetch the
 *  RSC payload first and then fall back to a full reload anyway. The thumb
 *  slides over on click, while the other language loads. */
export default function LanguageSwitch({ dark = false, size = "sm", onNavigate }: { dark?: boolean; size?: "sm" | "lg"; onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname() || "/";
  const [picked, setPicked] = useState<Locale | null>(null);
  const big = size === "lg";
  const shown = picked ?? locale;

  return (
    <div
      role="group"
      aria-label={locale === "en" ? "Language" : "Sprache"}
      className={cn(
        "relative grid grid-cols-2 items-center border p-1 transition-colors duration-500",
        big ? "h-11 rounded-[12px]" : "h-10 rounded-[12px]",
        dark ? "border-white/15 bg-white/[0.06]" : "border-line bg-[#f6f5f3] shadow-[inset_0_1px_2px_rgba(15,14,13,0.05)]",
      )}
    >
      {/* sliding thumb under the active language */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-[9px] transition-[translate,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          shown === "en" ? "translate-x-full" : "translate-x-0",
          dark
            ? "bg-accent shadow-[0_6px_14px_-8px_rgba(209,170,113,0.8)]"
            : "bg-white shadow-[0_1px_2px_rgba(15,14,13,0.08),0_6px_14px_-8px_rgba(15,14,13,0.25)] ring-1 ring-[#d1aa71]/25",
        )}
      />
      {LANGS.map((l) => {
        const on = l === shown;
        return (
          <a
            key={l}
            href={alternatePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            aria-label={LABEL[l].long}
            title={LABEL[l].long}
            onClick={() => {
              // remember the choice so automatic detection (proxy.ts) never overrides it
              document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
              setPicked(l);
              onNavigate?.();
            }}
            className={cn(
              "relative z-[1] grid h-full place-items-center rounded-[9px] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
              big ? "min-w-[78px] px-3 t-label-m" : "min-w-[40px] px-2.5 eyebrow",
              on
                ? dark
                  ? "text-[#001620]"
                  : "text-[#1a1917]"
                : dark
                  ? "text-white/55 hover:text-white"
                  : "text-[#7d7973] hover:text-[#1a1917]",
            )}
          >
            {big ? LABEL[l].long : LABEL[l].short}
          </a>
        );
      })}
    </div>
  );
}
