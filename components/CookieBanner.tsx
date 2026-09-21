"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "tt-cookie-consent";

type Consent = {
  necessary: true;
  functional: boolean;
  marketing: boolean;
};

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
  const [visible, setVisible] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (!stored) {
      const t = window.setTimeout(() => setVisible(true), 700);
      return () => window.clearTimeout(t);
    }
  }, []);

  const persist = (consent: Consent) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...consent, ts: Date.now() }),
      );
    } catch {
      /* storage unavailable — choice simply won't persist */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-4 bottom-24 z-[70] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
    >
      <div className="rounded-[18px] border border-line bg-white p-6 shadow-[0_24px_60px_-20px_rgba(15,14,13,0.28)]">
        <p className="text-[17px] font-semibold tracking-[-0.01em] text-ink">
          Wir verwenden Cookies
        </p>
        <p className="mt-2 text-[13.5px] leading-[20px] text-[#5c5954]">
          Wir verwenden Cookies, um die Seite zu betreiben, zu verstehen, wie sie
          genutzt wird, und sie zu verbessern. Sie entscheiden, was an ist. Mehr
          in unserer{" "}
          <Link href="#datenschutz" className="text-ink underline underline-offset-2 hover:text-accent">
            Datenschutzerklärung
          </Link>
          .
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Toggle on disabled label="Notwendig" />
          <Toggle on={functional} onChange={setFunctional} label="Funktional" />
          <Toggle on={marketing} onChange={setMarketing} label="Marketing" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => persist({ necessary: true, functional: true, marketing: true })}
            className="h-10 rounded-[10px] bg-[#002e3d] px-4 text-[14px] font-medium text-inverse transition-colors hover:bg-[#013a4d]"
          >
            Alle erlauben
          </button>
          <button
            type="button"
            onClick={() => persist({ necessary: true, functional, marketing })}
            className="h-10 rounded-[10px] border border-[#cbc8c2] px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page"
          >
            Auswahl erlauben
          </button>
          <button
            type="button"
            onClick={() => persist({ necessary: true, functional: false, marketing: false })}
            className="h-10 rounded-[10px] border border-[#cbc8c2] px-4 text-[14px] font-medium text-ink transition-colors hover:bg-page"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}
