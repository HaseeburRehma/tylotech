"use client";

import { useRef } from "react";
import { ArrowRight, LayoutDashboard, Rocket, Users } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT } from "@/lib/contact";
import { TYLOHQ_URL } from "@/lib/site";
import { SectionHead } from "../branche/ui";
import { useT } from "../i18n/LocaleProvider";

/* Figma "03 · Wege": three Kontakt-Karten (pillar card with a secondary button) */
const WEGE = [
  {
    id: "projekt",
    icon: Rocket,
    title: { de: "Neues Projekt", en: "New project" },
    text: {
      de: "Du willst wachsen und suchst einen Partner, der umsetzt statt nur berät.",
      en: "You want to grow and are looking for a partner who delivers instead of just advising.",
    },
    cta: { de: "Erstgespräch sichern", en: "Book your intro call" },
    href: "#formular",
  },
  {
    id: "kunden",
    icon: LayoutDashboard,
    title: { de: "Bestehende Kunden", en: "Existing clients" },
    text: {
      de: "Du arbeitest schon mit uns? Anfragen, Freigaben und Zahlen findest du in TyloTech HQ.",
      en: "Already working with us? Requests, approvals and numbers are waiting for you in TyloTech HQ.",
    },
    cta: { de: "TyloTech HQ Login", en: "TyloTech HQ login" },
    href: TYLOHQ_URL,
  },
  {
    id: "karriere",
    icon: Users,
    title: { de: "Karriere", en: "Careers" },
    text: {
      de: "Du willst mitbauen? Wir suchen Menschen, die Verantwortung übernehmen.",
      en: "Want to help build? We're looking for people who take ownership.",
    },
    cta: { de: "Zur Karriereseite", en: "Go to careers" },
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent("Bewerbung bei TyloTech")}`,
  },
];

export default function KontaktWege() {
  const root = useRef<HTMLElement>(null);
  const t = useT();

  useGSAP(
    () => {
      gsap.from(".bh-head > *", { y: 22, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".bh-head", start: "top 85%", toggleActions: "play none none none" } });
      gsap.from(".kw-card", { y: 28, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: { trigger: ".kw-grid", start: "top 85%", toggleActions: "play none none none" } });
    },
    { scope: root },
  );

  return (
    <section id="wege" ref={root} className="bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 sm:gap-14">
        <SectionHead
          center
          icon="send"
          eyebrow={t("So erreichst du uns", "How to reach us")}
          title={t("Drei Wege _zu uns._", "Three ways _to reach us._")}
          sub={t("Je nachdem, wo du gerade stehst.", "Depending on where you are right now.")}
          className="max-sm:w-full max-sm:items-start max-sm:text-left"
        />

        <div className="kw-grid grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          {WEGE.map(({ id, icon: I, title, text, cta, href }) => {
            const external = href.startsWith("http");
            return (
              <article
                key={id}
                className="kw-card group flex flex-col overflow-hidden rounded-[20px] border border-[#e2e0dc] bg-white transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_4px_10px_rgba(8,34,44,0.05),0_16px_32px_rgba(8,34,44,0.08)]"
              >
                <span aria-hidden className="h-1 w-full bg-[#d1aa71]" />
                <div className="flex flex-1 flex-col justify-between gap-8 p-6 sm:p-8 md:min-h-[338px]">
                  <div className="flex flex-col gap-4">
                    <span className="grid size-[50px] place-items-center rounded-[13px] bg-[#fbf6ee] text-[#b98f53]">
                      <I className="size-[23px]" strokeWidth={1.6} />
                    </span>
                    <h3 className="t-h4 text-[#1a1917]">{t(title.de, title.en)}</h3>
                    <p className="t-body-m text-[#5c5954]">{t(text.de, text.en)}</p>
                  </div>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    className="group/btn inline-flex h-12 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[rgba(8,34,44,0.06)] bg-white px-[22px] t-button text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.08)] transition-[background-color,box-shadow] duration-200 hover:bg-[#fbfaf9] hover:shadow-[0_2px_4px_rgba(8,34,44,0.06),0_8px_18px_rgba(8,34,44,0.1)]"
                  >
                    {t(cta.de, cta.en)}
                    <ArrowRight className="size-[18px] transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={1.8} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
