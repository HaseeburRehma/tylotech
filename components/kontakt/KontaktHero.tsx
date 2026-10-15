"use client";

import { useRef } from "react";
import { ArrowRight, Mail, MapPin, Phone, Star } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, mapsRouteUrl } from "@/lib/contact";
import { Accent, Eyebrow } from "../branche/ui";
import KontaktForm from "./KontaktForm";
import { useLocale, useT } from "../i18n/LocaleProvider";

/* Figma "Kontaktzeile": icon tile, mono label, value */
const CHANNELS = [
  { id: "phone", icon: Phone, label: { de: "Telefon", en: "Phone" }, value: { de: CONTACT.phone, en: CONTACT.phoneIntl }, href: CONTACT.phoneHref, external: false },
  { id: "mail", icon: Mail, label: { de: "E-Mail", en: "Email" }, value: { de: CONTACT.email, en: CONTACT.email }, href: `mailto:${CONTACT.email}`, external: false },
  {
    id: "address",
    icon: MapPin,
    label: { de: "Adresse", en: "Address" },
    value: { de: `${CONTACT.street}, ${CONTACT.city}`, en: `${CONTACT.street}, ${CONTACT.city}` },
    href: mapsRouteUrl,
    external: true,
  },
];

export default function KontaktHero({
  initialBranche,
  rating,
}: {
  initialBranche?: string;
  rating: { value: number; count: number; url: string };
}) {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const locale = useLocale();

  useGSAP(
    () => {
      // heading copy and the form card enter via CSS (intro-stagger / intro-up)
      // so the page's first content never waits on JS (FCP/LCP)
      gsap.from(".kh-direct > *", { y: 18, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.3, clearProps: "transform,opacity" });
    },
    { scope: root },
  );

  const value = rating.value.toLocaleString(locale === "en" ? "en-GB" : "de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-page">
      {/* Figma "Warmes Licht" */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[32%] top-[-260px] h-[760px] w-[1180px] max-w-none rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.3),rgba(209,170,113,0.12)_45%,rgba(209,170,113,0)_100%)] max-md:left-[-20%] max-md:top-[-200px] max-md:h-[480px] max-md:w-[700px]"
      />
      <Container className="relative flex flex-col gap-7 pb-14 pt-10 sm:pb-20 sm:pt-14 lg:gap-14 lg:pb-28 lg:pt-24">
        <div className="intro-stagger flex max-w-[720px] flex-col items-start gap-[18px]">
          <Eyebrow icon="message-circle">{t("Kontakt", "Contact")}</Eyebrow>
          <h1 className="t-h1 text-[#1a1917]">
            <Accent text={t("Sag uns, wo es _klemmt._", "Tell us where it's _stuck._")} />
          </h1>
          <p className="t-body-l text-[#5c5954]">
            {t(
              "Kein Formular ins Leere. Was du hier schreibst, lesen wir selbst und melden uns persönlich bei dir.",
              "No form into the void. We read what you write here ourselves and get back to you personally.",
            )}
          </p>
        </div>

        {/* phones: call card → form → channels; desktop: form left, direct contact right */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <div
            id="formular"
            className="intro-up order-2 min-w-0 flex-1 scroll-mt-28 rounded-[24px] border border-[#eeedea] bg-white p-6 shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] [animation-delay:150ms] sm:p-8 lg:order-1 lg:p-10"
          >
            <KontaktForm initialBranche={initialBranche} />
          </div>

          <div className="kh-direct contents lg:order-2 lg:flex lg:w-[400px] lg:shrink-0 lg:flex-col lg:gap-8 xl:w-[464px]">
            <div className="order-1 flex flex-col items-start gap-4 rounded-[20px] border border-[#d1aa71] bg-[#fbf6ee] p-6 sm:rounded-[24px] sm:p-8">
              {/* Figma Mobile/Heading/H4 (19/25 medium) → Heading/H4 (24/30 semibold) */}
              <p className="font-display text-[19px] font-medium leading-[25px] tracking-[-0.4px] text-[#1a1917] sm:text-[24px] sm:font-semibold sm:leading-[30px] sm:tracking-[-0.6px]">{t("Lieber direkt sprechen?", "Rather talk directly?")}</p>
              <p className="text-[14px] leading-[22px] tracking-[-0.1px] text-[#5c5954] sm:text-[16px] sm:leading-[26px] sm:tracking-[-0.16px]">
                {t(
                  "Im kostenlosen Erstgespräch schauen wir gemeinsam, wo dein größter Hebel liegt und ob wir zueinander passen.",
                  "In a free intro call we look together at where your biggest lever lies and whether we're a good fit.",
                )}
              </p>
              <a
                href={CONTACT.phoneHref}
                className="group mt-[6px] inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] px-[22px] t-button text-[#0f0e0d] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px sm:w-auto"
              >
                {t("Erstgespräch sichern", "Book your intro call")}
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.8} />
              </a>
            </div>

            <div className="order-3 flex flex-col gap-8">
              <ul className="flex flex-col lg:pl-2">
                {CHANNELS.map(({ id, icon: I, label, value, href, external }, i) => (
                  <li key={id} className={i ? "border-t border-[#eeedea]" : ""}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 py-4 sm:py-[18px]"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#fbf6ee] text-[#1a1917] transition-colors duration-300 group-hover:bg-[#d1aa71] group-hover:text-white">
                        <I className="size-5" strokeWidth={1.6} />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="eyebrow text-[#7d7973]">{t(label.de, label.en)}</span>
                        <span className="t-label-l text-[#1a1917] transition-colors group-hover:text-[#94713f]">{t(value.de, value.en)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <a href={rating.url} target="_blank" rel="noopener noreferrer" className="flex flex-wrap items-center gap-3 lg:pl-2" aria-label={t(`${value} von 5 Sternen aus ${rating.count} Google-Bewertungen`, `${value} out of 5 stars from ${rating.count} Google reviews`)}>
                <span className="flex gap-[3px]" aria-hidden>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-[17px] fill-[#d1aa71] text-[#d1aa71]" strokeWidth={1} />
                  ))}
                </span>
                <span className="t-label-l text-[#1a1917]">{value}</span>
                <span className="t-body-s text-[#5c5954]">{t(`aus ${rating.count} Google-Bewertungen`, `from ${rating.count} Google reviews`)}</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
