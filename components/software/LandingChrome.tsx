"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { openCookieSettings } from "@/lib/consent";
import { useLocale, useLocalePath, useT } from "@/components/i18n/LocaleProvider";
import { CONTACT } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { APPLY, BTN, BTN_BASE } from "./ui";

/* Header and footer for the ads URL (/software/app-bauplan): no links to other
   pages, so the only way forward is the application. The header stays on screen
   with the apply button; the footer has the logo, contact details and the legal
   links (they open in a new tab so the visitor doesn't lose the form). */

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
  const locale = useLocale();
  const link = "transition-colors hover:text-white";
  const contact = "flex items-center gap-3 text-[15px] leading-6 text-white/80 transition-colors hover:text-white";
  return (
    <footer className="border-t border-white/10 bg-[#001620] pb-8 pt-12 text-white sm:pt-14">
      <Container className="flex flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/tylotech-logo-dark.svg" alt="TyloTech" width={264} height={67} className="h-12 w-auto sm:h-14" />
          <blockquote className="max-w-[520px]">
            <p className="font-[family-name:var(--font-instrument)] text-[26px] italic leading-[32px] text-[#d8b681] sm:text-[30px] sm:leading-[36px]">
              {t("„Wir bauen. Du wächst.“", "“We build. You grow.”")}
            </p>
            <p className="t-body-s mt-2 text-white/[0.55]">
              {t("Eigene Firmen-Software zum Festpreis. Erste Version in 6 Wochen live.", "Your own company software at a fixed price. First version live in 6 weeks.")}
            </p>
          </blockquote>
        </div>

        <address className="flex flex-col items-center gap-3 not-italic sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
          <a href={CONTACT.phoneHref} className={contact}>
            <Phone className="size-[18px] shrink-0 text-[#d8b681]" strokeWidth={1.8} aria-hidden />
            {locale === "en" ? CONTACT.phoneIntl : CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`} className={contact}>
            <Mail className="size-[18px] shrink-0 text-[#d8b681]" strokeWidth={1.8} aria-hidden />
            {CONTACT.email}
          </a>
          <p className="flex items-center gap-3 text-[15px] leading-6 text-white/80">
            <MapPin className="size-[18px] shrink-0 text-[#d8b681]" strokeWidth={1.8} aria-hidden />
            {CONTACT.street}, {CONTACT.city}
          </p>
        </address>

        <div aria-hidden className="h-px w-full bg-[linear-gradient(90deg,rgba(209,170,113,0)_0%,rgba(209,170,113,0.35)_50%,rgba(209,170,113,0)_100%)]" />

        <div className="flex w-full flex-col items-center gap-3 text-[13px] leading-5 text-white/60">
          <p>© 2026 TyloTech</p>
          <nav aria-label={t("Rechtliches", "Legal")} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
        </div>
      </Container>
    </footer>
  );
}
