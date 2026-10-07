"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocalePath, useT } from "./i18n/LocaleProvider";
import { CONSENT_VERSION, OPEN_SETTINGS_EVENT, readConsent, writeConsent } from "@/lib/consent";

function Toggle({
  on,
  disabled,
  onChange,
  label,
}: {
  on: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!on)}
        className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
          on ? "bg-accent" : "bg-[#d8d4cd]"
        } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1/2 size-[16px] -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200 ${
            on ? "left-[19px]" : "left-[3px]"
          }`}
        />
      </button>
      <span className="text-[13px] font-medium text-ink">{label}</span>
    </span>
  );
}

export default function CookieBanner() {
  const t = useT();
  const lp = useLocalePath();
  const [visible, setVisible] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const prefill = () => {
      const c = readConsent();
      setFunctional(!!c?.functional);
      setStatistics(!!c?.statistics);
      setMarketing(!!c?.marketing);
    };
    // footer "Cookie settings": reopen with the current choice
    const open = () => {
      prefill();
      setVisible(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);

    // no choice yet, or one made before the "statistics" category existed
    const c = readConsent();
    let timer: number | undefined;
    if (!c || c.v < CONSENT_VERSION) {
      timer = window.setTimeout(open, 700);
    }
    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, open);
      window.clearTimeout(timer);
    };
  }, []);

  const persist = (c: { functional: boolean; statistics: boolean; marketing: boolean }) => {
    writeConsent(c);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("Cookie-Einstellungen", "Cookie settings")}
      className="fixed inset-x-4 bottom-24 z-[70] sm:inset-x-auto sm:bottom-[96px] sm:right-6 sm:w-[400px]"
    >
      <div className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_60px_-20px_rgba(15,14,13,0.28)]">
        <p className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
          {t("Wir verwenden Cookies", "We use cookies")}
        </p>
        <p className="mt-2 text-[13.5px] leading-[20px] text-[#5c5954]">
          {t(
            "Wir verwenden Cookies, um die Seite zu betreiben, zu verstehen, wie sie genutzt wird, und sie zu verbessern. Sie entscheiden, was an ist. Mehr in unserer",
            "We use cookies to run this site, understand how it’s used and improve it. You decide what’s switched on. More in our",
          )}{" "}
          <Link href={lp("/datenschutz")} className="text-ink underline underline-offset-2 hover:text-accent">
            {t("Datenschutzerklärung", "privacy policy")}
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Toggle on disabled label={t("Notwendig", "Necessary")} />
          <Toggle on={functional} onChange={setFunctional} label={t("Funktional", "Functional")} />
          <Toggle on={statistics} onChange={setStatistics} label={t("Statistik", "Statistics")} />
          <Toggle on={marketing} onChange={setMarketing} label={t("Marketing", "Marketing")} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => persist({ functional: true, statistics: true, marketing: true })}
            className="h-10 rounded-[10px] bg-[#002e3d] px-4 text-[14px] font-medium text-inverse transition-colors hover:bg-[#013a4d]"
          >
            {t("Alle erlauben", "Allow all")}
          </button>
          <button
            type="button"
            onClick={() => persist({ functional, statistics, marketing })}
            className="h-10 rounded-[10px] border border-[#cbc8c2] px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page"
          >
            {t("Auswahl erlauben", "Allow selection")}
          </button>
          <button
            type="button"
            onClick={() => persist({ functional: false, statistics: false, marketing: false })}
            className="h-10 rounded-[10px] border border-[#cbc8c2] px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page"
          >
            {t("Ablehnen", "Reject")}
          </button>
        </div>
      </div>
    </div>
  );
}
