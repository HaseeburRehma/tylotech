"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { openCookieSettings } from "@/lib/consent";
import { useLocalePath, useT } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";
import { ArrowRight } from "lucide-react";
import { APPLY, BTN, BTN_BASE } from "./ui";

/* Header and footer for the ads URL (/software/app-bauplan): no links to other
   pages, so the only way forward is the application. The header stays on screen
   with the apply button; the footer keeps only the legal links (they open in a
   new tab so the visitor doesn't lose the form). */

export function LandingHeader() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-page/95 backdrop-blur-md transition-[border-color,box-shadow] duration-500",
        scrolled ? "border-line shadow-[0_1px_20px_-10px_rgba(15,14,13,0.3)]" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-3 sm:h-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/tylotech-logo.svg" alt="TyloTech" width={138} height={35} className="h-7 w-auto shrink-0 sm:h-[35px]" />
        <div className="flex items-center gap-4">
          <p className="hidden items-center gap-2 text-[14px] font-medium leading-5 text-[#5c5954] md:flex">
            <span aria-hidden className="size-2 rounded-full bg-[#2fb36b] shadow-[0_0_0_3px_rgba(47,179,107,0.18)]" />
            {t("Nur 5 Plätze pro Monat", "Only 5 spots a month")}
          </p>
          <a href={APPLY} className={cn(BTN_BASE, BTN.gold, "h-10 gap-1.5 px-4 sm:h-12 sm:gap-2 sm:px-[22px]")}>
            {t("Jetzt bewerben", "Apply now")}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 sm:size-[18px]" strokeWidth={2} aria-hidden />
          </a>
        </div>
      </Container>
    </header>
  );
}

export function LandingFooter() {
  const t = useT();
  const lp = useLocalePath();
  const link = "transition-colors hover:text-white";
  return (
    <footer className="border-t border-white/10 bg-[#001620] py-8 text-white">
      <Container className="flex flex-col gap-4 text-[13px] leading-5 text-white/60 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 TyloTech</p>
        <nav aria-label={t("Rechtliches", "Legal")} className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href={lp("/impressum")} target="_blank" rel="noopener" className={link}>
            {t("Impressum", "Imprint")}
          </Link>
          <Link href={lp("/datenschutz")} target="_blank" rel="noopener" className={link}>
            {t("Datenschutz", "Privacy policy")}
          </Link>
          <button type="button" onClick={openCookieSettings} className={cn("text-left", link)}>
            {t("Cookie-Einstellungen", "Cookie settings")}
          </button>
        </nav>
      </Container>
    </footer>
  );
}
