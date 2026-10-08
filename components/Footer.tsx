"use client";

import { useRef } from "react";
import Link from "next/link";
import { TYLOHQ_URL } from "@/lib/site";
import { openCookieSettings } from "@/lib/consent";
import { MapPin, Mail, Phone, ShieldCheck, Server, Quote } from "lucide-react";
import Container from "./ui/Container";
import PartnerLogo from "./PartnerLogo";
import { PARTNERS } from "@/lib/partners";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLocalePath, useT } from "./i18n/LocaleProvider";
import LanguageSwitch from "./i18n/LanguageSwitch";

const CONTACT = [
  { icon: MapPin, text: "Behrenstraße 4, 40233 Düsseldorf", en: "Behrenstraße 4, 40233 Düsseldorf, Germany" },
  { icon: Mail, text: "info@tylotech.de", href: "mailto:info@tylotech.de" },
  { icon: Phone, text: "0211 15847097", en: "+49 211 15847097", href: "tel:+4921115847097" },
];

const TRUST = [
  { icon: MapPin, text: "Made in Germany" },
  { icon: ShieldCheck, text: "DSGVO-konform", en: "GDPR-compliant" },
  { icon: Server, text: "Hosting in Deutschland", en: "Hosted in Germany" },
];

/** English labels for the link columns (the German label stays the key). */
const LABEL_EN: Record<string, string> = {
  Navigation: "Navigation",
  Mehr: "More",
  Konzept: "Concept",
  Leistungen: "Services",
  Ergebnisse: "Results",
  "Über uns": "About us",
  Kontakt: "Contact",
  "TyloTech HQ Login": "TyloTech HQ Login",
  Impressum: "Imprint",
  Datenschutz: "Privacy policy",
  "Cookie-Einstellungen": "Cookie settings",
  Karriere: "Careers",
};

const NAV = ["Konzept", "Leistungen", "Ergebnisse", "Über uns", "Kontakt"];
const MEHR = [
  "TyloTech HQ Login",
  "Impressum",
  "Datenschutz",
  "Cookie-Einstellungen",
  "Karriere",
];

const LEGAL: Record<string, string> = { "TyloTech HQ Login": TYLOHQ_URL, Impressum: "/impressum", Datenschutz: "/datenschutz" };

// footer row: the four partners chosen for the footer, rendered like the logo strip (alpha masks)
const FOOTER_PARTNERS = ["Priya's Reinigungsservice", "LokShift", "Crusty Slices", "Rohrcleaner"]
  .map((n) => PARTNERS.find((p) => p.name === n))
  .filter((p): p is (typeof PARTNERS)[number] => !!p)
  .map((p) => (p.name === "Rohrcleaner" ? { ...p, src: "/partners/rohrcleaner.webp", w: 48, h: 40 } : p));

const SOCIALS: { label: string; path: string }[] = [
  {
    label: "LinkedIn",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z",
  },
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    label: "YouTube",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  {
    label: "Facebook",
    path: "M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z",
  },
  {
    label: "X",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23zm-1.16 17.52h1.83L7.01 4.13H5.03l12.05 15.64z",
  },
];

function Social({ label, path }: { label: string; path: string }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="grid size-8 place-items-center rounded-full border border-white/[0.14] bg-white/[0.09] text-white/[0.92] transition-colors hover:border-white/30 hover:bg-white/[0.16]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    </Link>
  );
}

/* Figma "Partner-Feld": 63×36 tile, logo as alpha mask tinted text/tertiary at 80 % */
function PartnerTile({ p }: { p: (typeof PARTNERS)[number] }) {
  const scale = Math.min(50 / p.w, 22 / p.h);
  return (
    <span className="grid h-9 w-[63px] place-items-center rounded-lg border border-white/[0.13] bg-white/[0.07]">
      <PartnerLogo partner={p} tint="#a6a29b" scale={scale} className="opacity-80" />
    </span>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const lp = useLocalePath();
  const label = (de: string) => t(de, LABEL_EN[de] ?? de);

  useGSAP(
    () => {
      gsap.from(".footer-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 92%" },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-white/10 bg-[#001620] pb-10 pt-12 text-white sm:pt-16 lg:pt-[88px]">
      {/* Figma "Warmes Licht": 900×520 gold radial glow behind the logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[140px] -top-[200px] h-[520px] w-[900px] max-w-[160vw] motion-safe:animate-[footGlow_9s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(ellipse closest-side, rgba(209,170,113,0.2), rgba(209,170,113,0.06) 55%, rgba(209,170,113,0))" }}
      />
      <Container className="relative flex flex-col gap-10 sm:gap-12 lg:gap-14">
        {/* Figma "Footer Oben": Marke 360 · Haltung 290 · Spalten */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:flex lg:gap-16">
          <div className="footer-reveal flex flex-col items-start gap-[26px] lg:w-[360px] lg:shrink-0">
            <Link href={lp("/")} className="inline-flex" aria-label={t("TyloTech Startseite", "TyloTech home")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/tylotech-logo-dark.svg" alt="TyloTech" width={264} height={67} className="h-12 w-auto sm:h-[56px] lg:h-[66.7px]" />
            </Link>
            <p className="font-display font-medium text-[clamp(18px,calc(18px_+_2_*_(100vw_-_390px)_/_1050),20px)] leading-[clamp(25px,calc(25px_+_3_*_(100vw_-_390px)_/_1050),28px)] tracking-[clamp(-0.4px,calc(-0.3px_-_0.1_*_(100vw_-_390px)_/_1050),-0.3px)] text-white/[0.92]">{t("Wir bauen. Du wächst.", "We build. You grow.")}</p>
            <ul className="flex flex-col gap-[9px]">
              {CONTACT.map((c) => (
                <li key={c.text} className="t-body-s flex items-center gap-2.5 text-white/[0.62]">
                  <c.icon className="size-[15px] shrink-0 text-[#d8b682]" strokeWidth={1.7} />
                  {c.href ? (
                    <a href={c.href} className="transition-colors hover:text-white">
                      {t(c.text, c.en ?? c.text)}
                    </a>
                  ) : (
                    <span>{t(c.text, c.en ?? c.text)}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-x-4 gap-y-2.5">
              {TRUST.map((tr_) => (
                <span key={tr_.text} className="t-body-xs flex items-center gap-[7px] whitespace-nowrap text-white/50">
                  <tr_.icon className="size-3.5 text-[#d8b682]" strokeWidth={1.8} />
                  {t(tr_.text, tr_.en ?? tr_.text)}
                </span>
              ))}
            </div>
          </div>

          <div className="footer-reveal flex flex-col items-start gap-7 lg:w-[290px] lg:shrink-0">
            <Quote className="size-[26px] fill-[#d8b682] text-[#d8b682]" strokeWidth={0} />
            <p className="font-[family-name:var(--font-instrument)] font-normal italic text-[clamp(20px,calc(20px_+_3_*_(100vw_-_390px)_/_1050),23px)] leading-[clamp(28px,calc(28px_+_4_*_(100vw_-_390px)_/_1050),32px)] tracking-[clamp(-0.3px,calc(0px_-_0.3_*_(100vw_-_390px)_/_1050),0px)] text-white/90">{t("„Building unique brands with unique people.“", "“Building unique brands with unique people.”")}</p>
            <div className="flex flex-col gap-3.5">
              <div className="flex gap-2">
                {FOOTER_PARTNERS.map((p) => (
                  <PartnerTile key={p.name} p={p} />
                ))}
              </div>
              <p className="t-body-s text-white/[0.62]">{t("Über 100 Projekte umgesetzt", "Over 100 projects delivered")}</p>
            </div>
          </div>

          <div className="footer-reveal grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-12 md:col-span-2 lg:flex-1">
            {[
              { title: "Navigation", items: NAV.map((l) => ({ l, href: l === "Kontakt" ? "/kontakt" : "#" })) },
              { title: "Mehr", items: MEHR.map((l) => ({ l, href: LEGAL[l] ?? "#" })) },
            ].map((col) => (
              <div key={col.title} className="flex flex-col gap-3.5">
                <p className="font-[family-name:var(--font-instrument)] font-normal italic text-[clamp(18px,calc(18px_+_1_*_(100vw_-_390px)_/_1050),19px)] leading-[clamp(23px,calc(23px_+_1_*_(100vw_-_390px)_/_1050),24px)] text-[#d8b681]">{label(col.title)}</p>
                {col.items.map(({ l, href }) =>
                  l === "Cookie-Einstellungen" ? (
                    // reopens the cookie banner (change or withdraw consent)
                    <button
                      key={l}
                      type="button"
                      onClick={openCookieSettings}
                      className="t-body-s w-fit text-left text-white/[0.66] transition-colors hover:text-white"
                    >
                      {label(l)}
                    </button>
                  ) : (
                  <Link
                    key={l}
                    href={lp(href)}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                    className="t-body-s w-fit text-white/[0.66] transition-colors hover:text-white"
                  >
                    {label(l)}
                  </Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Figma "Trennlinie": gold fading into white */}
        <div aria-hidden className="h-px w-full bg-[linear-gradient(90deg,rgba(209,170,113,0.35)_0%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.04)_100%)]" />

        {/* Figma "Footer Unten": socials + copyright, left-aligned */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-[26px]">
          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <Social key={s.label} label={s.label} path={s.path} />
            ))}
          </div>
          <p className="text-[clamp(13px,calc(13px_+_1_*_(100vw_-_390px)_/_1050),14px)] leading-[clamp(20px,calc(20px_+_2_*_(100vw_-_390px)_/_1050),22px)] tracking-[clamp(-0.1px,calc(-0.05px_-_0.05_*_(100vw_-_390px)_/_1050),-0.05px)] text-white/[0.56]">© 2026 TyloTech. Building unique brands with unique people.</p>
          <div className="sm:ml-auto">
            <LanguageSwitch dark />
          </div>
        </div>
      </Container>
    </footer>
  );
}
