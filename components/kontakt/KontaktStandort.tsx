"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, mapsRouteUrl } from "@/lib/contact";
import { SectionHead } from "../branche/ui";
import { useT } from "../i18n/LocaleProvider";

/* Figma "04 · Standort". The map is a static image (Figma "Karte"), so nothing is sent to
   Google until someone clicks "Route planen" — no consent needed to show it. */

/** Figma "Karten-Pin": gold marker with pulse rings; its centre is the office (49.8% / 47.9% of the map) */
function Pin() {
  return (
    <span aria-hidden className="absolute left-[49.8%] top-[47.9%] grid size-[124px] -translate-x-1/2 -translate-y-1/2 place-items-center max-sm:size-[72px]">
      <span className="absolute inset-0 rounded-full bg-[#d1aa71]/50" />
      <span className="absolute inset-[16.7%] rounded-full bg-[#d1aa71]/50" />
      <span className="absolute inset-[16.7%] rounded-full bg-[#d1aa71]/40 motion-safe:animate-[ktPin_2.8s_ease-out_infinite]" />
      <span className="relative grid size-[52px] place-items-center rounded-full border-[2px] border-[#d1aa71] bg-[#d1aa71] text-white shadow-[0_4px_10px_rgba(8,34,44,0.25),0_10px_24px_rgba(8,34,44,0.2)] max-sm:size-[30px]">
        <MapPin className="size-[18px] fill-[#d1aa71] max-sm:size-[13px]" strokeWidth={2} />
      </span>
    </span>
  );
}

const ROWS = [
  { id: "adresse", icon: MapPin, label: { de: "Adresse", en: "Address" }, value: { de: `${CONTACT.street}, ${CONTACT.city}`, en: `${CONTACT.street}, ${CONTACT.city}` } },
  { id: "termine", icon: CalendarDays, label: { de: "Termine", en: "Meetings" }, value: { de: "Vor Ort nach Absprache", en: "On site by appointment" } },
];

export default function KontaktStandort() {
  const root = useRef<HTMLElement>(null);
  const t = useT();

  useGSAP(
    () => {
      gsap.from(".bh-head > *", { y: 22, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".bh-head", start: "top 85%", toggleActions: "play none none none" } });
      gsap.from(".ks-card", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15, clearProps: "transform,opacity", scrollTrigger: { trigger: ".ks-map", start: "top 80%", toggleActions: "play none none none" } });
    },
    { scope: root },
  );

  return (
    <section id="standort" ref={root} className="scroll-mt-20 bg-page py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-10 sm:gap-14">
        <SectionHead
          icon="map-pin"
          eyebrow={t("Standort", "Location")}
          title={t("Mitten in _Düsseldorf._", "Right in _Düsseldorf._")}
          sub={t(
            "Unser Büro in Flingern. Vor-Ort-Termine nach Absprache, die meisten Gespräche starten online.",
            "Our office in Flingern. On-site meetings by appointment; most conversations start online.",
          )}
        />

        <div className="ks-map relative flex flex-col gap-6 md:block">
          <div className="relative h-[260px] overflow-hidden rounded-[24px] border border-[#eeedea] bg-[#1d1d1d] sm:h-[400px] md:h-[520px]">
            <Image
              src="/kontakt/karte-duesseldorf-dunkel.webp"
              alt={t(`Karte: TyloTech, ${CONTACT.street}, ${CONTACT.city}`, `Map: TyloTech, ${CONTACT.street}, ${CONTACT.city}`)}
              fill
              unoptimized // already a compressed 1280px WebP; skips the image optimiser
              sizes="(min-width: 1440px) 1280px, 100vw"
              className="object-cover"
            />
            <Pin />
          </div>

          <div className="ks-card flex flex-col items-start gap-5 rounded-[20px] border border-[#eeedea] bg-white p-6 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:p-8 md:absolute md:left-[39px] md:top-[39px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tylotech-logo.svg" alt="TyloTech" width={142} height={36} className="h-9 w-auto" />
            <ul className="flex flex-col gap-3">
              {ROWS.map(({ id, icon: I, label, value }) => (
                <li key={id} className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#fbf6ee] text-[#1a1917]">
                    <I className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="eyebrow text-[#7d7973]">{t(label.de, label.en)}</span>
                    <span className="t-label-l text-[#1a1917]">{t(value.de, value.en)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[rgba(8,34,44,0.06)] bg-white px-[22px] t-button text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.08)] transition-[background-color,box-shadow] duration-200 hover:bg-[#fbfaf9] hover:shadow-[0_2px_4px_rgba(8,34,44,0.06),0_8px_18px_rgba(8,34,44,0.1)] md:w-fit"
            >
              {t("Route planen", "Plan your route")}
              <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
