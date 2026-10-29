"use client";

import { useRef } from "react";
import { ArrowDown, ArrowRight, BadgeCheck, Quote } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Head, Serif } from "./ui";

type Case = { logo: string; logoW: number; logoAlt: string; tag: string; name: string; before: string; after: string };

export default function SoftwareReferenzen() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const cases: Case[] = [
    {
      logo: "/software/logo-priya.svg",
      logoW: 131,
      logoAlt: "Priya's",
      tag: t("Gebäudedienste", "Facility services"),
      name: t("Priya Reinigungsservice", "Priya cleaning service"),
      before: t("Zettel, Excel, WhatsApp", "Paper, Excel, WhatsApp"),
      after: t("Eine App", "One app"),
    },
    {
      logo: "/software/logo-lokshift.svg",
      logoW: 151,
      logoAlt: "LokShift",
      tag: t("Logistik", "Logistics"),
      name: "LokShift",
      before: t("Schichten, Zeiterfassung, Disposition", "Shifts, time tracking, dispatching"),
      after: t("Alles in einer App", "Everything in one app"),
    },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".sw-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".sw-head") });
      gsap.from(".swr-card", { y: 40, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.14, clearProps: "transform,opacity", scrollTrigger: st(".swr-cards") });
      // before → after: the "Nachher" box lights up after the card lands
      gsap.from(".swr-after", { scale: 0.94, opacity: 0, duration: 0.6, ease: "back.out(1.7)", stagger: 0.14, delay: 0.45, scrollTrigger: st(".swr-cards") });
      gsap.from(".swr-arrow", { x: -8, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.14, delay: 0.35, scrollTrigger: st(".swr-cards") });
      gsap.from(".swr-quote", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: st(".swr-quote", "top 88%") });
      gsap.from(".swr-cta", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st(".swr-cta", "top 92%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-[104px]">
      <Container className="max-sm:px-5 flex flex-col items-center gap-8 sm:gap-12">
        <Head
          icon={BadgeCheck}
          eyebrow={t("Echte Projekte", "Real projects")}
          title={
            <>
              {t("Das haben wir", "We’ve")} <Serif>{t("schon gebaut.", "already built this.")}</Serif>
            </>
          }
          className="max-w-[720px]"
        />

        <div className="swr-cards grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
          {cases.map((c) => (
            <article
              key={c.name}
              className="swr-card flex flex-col gap-6 rounded-[24px] border border-[#eeedea] bg-white p-6 shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgba(8,34,44,0.35)] sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logo} alt={c.logoAlt} width={c.logoW} height={32} loading="lazy" className="h-8 w-auto" style={{ maxWidth: c.logoW }} />
                <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#eeedea] px-2.5 text-[12px] font-medium leading-[17px] text-[#5c5954]">{c.tag}</span>
              </div>
              <h3 className="t-h4 text-[#1a1917]">{c.name}</h3>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-1 flex-col gap-2 rounded-[16px] bg-[#f6f5f3] p-[18px] sm:min-h-[86px]">
                  <p className="eyebrow text-[#7d7973]">{t("Vorher", "Before")}</p>
                  <p className="t-body-m text-[#5c5954]">{c.before}</p>
                </div>
                <span className="swr-arrow grid shrink-0 place-items-center text-[#c79a53] max-sm:justify-start max-sm:pl-[3px]">
                  <ArrowRight className="hidden size-5 sm:block" strokeWidth={1.7} aria-hidden />
                  <ArrowDown className="size-[18px] sm:hidden" strokeWidth={1.7} aria-hidden />
                </span>
                <div className="swr-after flex flex-1 flex-col gap-2 rounded-[16px] border border-[#d1aa71] bg-[#fbf6ee] p-[18px] sm:min-h-[86px]">
                  <p className="eyebrow text-[#94713f]">{t("Nachher", "After")}</p>
                  <p className="t-body-m text-[#1a1917]">{c.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <figure className="swr-quote flex w-full flex-col items-start gap-5 rounded-[24px] border border-[#eeedea] bg-white p-6 shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] sm:flex-row sm:items-center sm:gap-10 sm:px-12 sm:py-10">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#fbf6ee] text-[#c79a53]">
            <Quote className="size-6 fill-current" strokeWidth={0} aria-hidden />
          </span>
          <figcaption className="flex flex-col gap-2.5">
            <blockquote className="font-[family-name:var(--font-instrument)] text-[26px] italic leading-[32px] tracking-[-0.5px] text-[#1a1917] sm:text-[34px] sm:leading-[38px] sm:tracking-[-0.6px]">
              {t("„Endlich eine Software, die wirklich zu uns passt.“", "“Finally, software that actually fits the way we work.”")}
            </blockquote>
          </figcaption>
        </figure>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="swr-cta w-full max-sm:h-[58px] sm:w-auto" />
      </Container>
    </section>
  );
}
