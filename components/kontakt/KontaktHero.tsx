"use client";

import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, mapsRouteUrl } from "@/lib/contact";
import { Accent, Eyebrow } from "../branche/ui";
import KontaktForm from "./KontaktForm";
import { useT } from "../i18n/LocaleProvider";

/* `id` keeps React keys stable across languages */
const CHANNELS = [
  { id: "call", icon: Phone, label: { de: "Anrufen", en: "Call" }, value: { de: CONTACT.phone, en: CONTACT.phoneIntl }, href: CONTACT.phoneHref, external: false },
  { id: "write", icon: Mail, label: { de: "Schreiben", en: "Write" }, value: { de: CONTACT.email, en: CONTACT.email }, href: `mailto:${CONTACT.email}`, external: false },
  {
    id: "visit",
    icon: MapPin,
    label: { de: "Besuchen", en: "Visit" },
    value: { de: `${CONTACT.street}, ${CONTACT.city}`, en: `${CONTACT.street}, ${CONTACT.city}, Germany` },
    href: mapsRouteUrl,
    external: true,
  },
];

const STEPS = [
  {
    id: "send",
    t: { de: "Anfrage senden", en: "Send your enquiry" },
    d: { de: "Ein paar Sätze reichen. Wo stehst du, wo willst du hin?", en: "A few sentences are enough. Where are you now, and where do you want to go?" },
  },
  {
    id: "reply",
    t: { de: "Wir melden uns persönlich", en: "We get back to you personally" },
    d: { de: "Kein Callcenter und kein Bot: du sprichst mit jemandem, der antworten kann.", en: "No call centre and no bot: you talk to someone who can actually answer." },
  },
  {
    id: "call",
    t: { de: "Kostenloses Erstgespräch", en: "Free initial consultation" },
    d: { de: "Eine ehrliche Einschätzung, wo dein größter Hebel liegt.", en: "An honest assessment of where your biggest lever lies." },
  },
];

export default function KontaktHero({ initialBranche }: { initialBranche?: string }) {
  const root = useRef<HTMLElement>(null);
  const t = useT();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".kh-copy > *", { y: 26, opacity: 0, duration: 0.8, stagger: 0.08 })
        .from(".kh-card", { y: 40, opacity: 0, duration: 1 }, 0.15)
        .from(".kh-card .kf-row", { y: 16, opacity: 0, duration: 0.6, stagger: 0.06, clearProps: "transform,opacity" }, 0.45)
        .from(".kh-channel", { x: -18, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: "transform,opacity" }, 0.5)
        .from(".kh-step", { y: 14, opacity: 0, duration: 0.6, stagger: 0.1, clearProps: "transform,opacity" }, 0.8);
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-page">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[38%] h-[760px] w-[1180px] rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.2),rgba(209,170,113,0.05)_60%,transparent)]"
      />
      {/* phones: headline → form → channels; desktop: copy + channels left, form right */}
      <Container className="relative grid grid-cols-1 items-start gap-10 pb-14 pt-8 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,600px)] xl:grid-rows-[auto_1fr] xl:gap-x-16 xl:gap-y-10 xl:pt-[88px] 2xl:gap-x-20">
        <div className="kh-copy flex min-w-0 flex-col items-start gap-6 sm:gap-7">
          <Eyebrow icon="message-circle">{t("Kontakt", "Contact")}</Eyebrow>
          <h1 className="font-display text-[clamp(2.3rem,4.6vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-[#1a1917]">
            <Accent text={t("Lass uns über dein\n_Wachstum_ sprechen.", "Let's talk about\nyour _growth_.")} />
          </h1>
          <p className="max-w-[560px] text-[clamp(17px,1.5vw,19px)] leading-[1.55] tracking-[-0.01em] text-[#5c5954]">
            {t(
              "Erzähl uns kurz, wo du stehst. Wir melden uns persönlich bei dir: ehrlich, direkt und ohne Verkaufsdruck.",
              "Tell us briefly where you stand. We'll get back to you personally: honest, direct and with no sales pressure.",
            )}
          </p>
        </div>

        <div className="order-3 flex min-w-0 flex-col gap-10 xl:order-none xl:col-start-1 xl:row-start-2">
          <ul className="flex w-full max-w-[560px] flex-col gap-3">
            {CHANNELS.map(({ id, icon: I, label, value, href, external }) => (
              <li key={id} className="kh-channel">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-[18px] border border-[#eeedea] bg-white/80 p-3.5 pr-5 shadow-[0_1px_2px_rgba(8,34,44,0.04)] backdrop-blur transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-[#e2d2b4] hover:shadow-[0_18px_36px_-24px_rgba(8,34,44,0.35)]"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-[#fbf6ee] text-[#b4894d] transition-colors duration-300 group-hover:bg-[#d1aa71] group-hover:text-white">
                    <I className="size-[21px]" strokeWidth={1.7} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-mono text-[11px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#94713f]">{t(label.de, label.en)}</span>
                    <span className="font-display text-[16px] font-medium leading-[22px] tracking-[-0.02em] text-[#1a1917] sm:text-[17px]">{t(value.de, value.en)}</span>
                  </span>
                  <ArrowUpRight className="size-[18px] shrink-0 text-[#a8a49d] transition-[color,translate] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#94713f]" strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>

          <div className="w-full max-w-[560px]">
            <p className="mb-4 font-mono text-[12px] font-medium uppercase leading-[14px] tracking-[0.4px] text-[#7d7973]">{t("So geht es weiter", "What happens next")}</p>
            <ol className="relative flex flex-col gap-5">
              <span aria-hidden className="absolute bottom-3 left-[15px] top-3 w-px bg-[linear-gradient(180deg,#d1aa71,rgba(209,170,113,0.15))]" />
              {STEPS.map((s, i) => (
                <li key={s.id} className="kh-step relative flex gap-4">
                  <span className="relative grid size-8 shrink-0 place-items-center rounded-full border border-[#d1aa71] bg-white font-mono text-[12px] font-medium text-[#94713f]">
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-0.5 pt-1">
                    <span className="font-display text-[16px] font-medium leading-[22px] tracking-[-0.02em] text-[#1a1917]">{t(s.t.de, s.t.en)}</span>
                    <span className="text-[14px] leading-[22px] text-[#7d7973]">{t(s.d.de, s.d.en)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="kh-card relative rounded-[24px] w-full max-w-[760px] xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:max-w-none border border-[#eeedea] bg-white p-5 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:rounded-[28px] sm:p-8 lg:p-10">
          <div className="mb-7 flex flex-col gap-1.5 border-b border-[#eeedea] pb-6">
            <h2 className="font-display text-[clamp(1.4rem,2.2vw,1.625rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[#1a1917]">
              {t("Erstgespräch", "Request a")}{" "}
              <span className="font-[family-name:var(--font-instrument)] text-[1.08em] font-normal italic tracking-[-0.01em] text-[#94713f]">{t("anfragen", "consultation")}</span>
            </h2>
            <p className="text-[14px] leading-[22px] text-[#7d7973]">
              {t("Felder mit ", "Fields marked ")}
              <span className="text-[#b4894d]">*</span>
              {t(" sind Pflichtfelder.", " are required.")}
            </p>
          </div>
          <KontaktForm initialBranche={initialBranche} />
        </div>
      </Container>
    </section>
  );
}
