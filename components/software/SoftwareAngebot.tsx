"use client";

import { useRef } from "react";
import { Calendar, Check, FileText, Lock, ShieldCheck, type LucideIcon } from "lucide-react";
import Container from "../ui/Container";
import { cn } from "@/lib/cn";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Head, Serif } from "./ui";

type Card = { icon: LucideIcon; title: string; text: string; featured?: boolean };

export default function SoftwareAngebot() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const cards: Card[] = [
    {
      icon: FileText,
      title: t("App-Bauplan (Wert 1.000 €), kostenlos", "App blueprint (worth €1,000), free"),
      text: t("Klick-Prototyp, Feature-Liste, Festpreis, Zeitplan. Gehört dir.", "Click prototype, feature list, fixed price, timeline. Yours to keep."),
      featured: true,
    },
    { icon: Check, title: t("Fertig-Garantie", "Completion guarantee"), text: t("Wir bauen deine Software, bis alles stimmt.", "We keep building your software until everything’s right.") },
    { icon: Lock, title: t("Festpreis-Garantie", "Fixed-price guarantee"), text: t("Fester Preis, fester Liefertermin. Keine bösen Überraschungen.", "Fixed price, fixed delivery date. No nasty surprises.") },
    { icon: Calendar, title: t("6-Wochen-Garantie", "6-week guarantee"), text: t("Erste nutzbare Version in 6 Wochen live.", "First usable version live in 6 weeks.") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".sw-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".sw-head") });
      gsap.from(".swa-card", { y: 44, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.11, clearProps: "transform,opacity", scrollTrigger: st(".swa-grid") });
      gsap.fromTo(".swa-seal", { scale: 0.5, rotate: -30 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.2)", stagger: 0.11, delay: 0.25, clearProps: "transform", scrollTrigger: st(".swa-grid") });
      gsap.from(".swa-notes > *, .swa-cta", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, scrollTrigger: st(".swa-notes", "top 92%") });
      gsap.to(".swa-glow", { opacity: 0.55, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav-dark className="relative overflow-hidden bg-[#001620] py-16 sm:py-[120px]">
      {/* Figma "Warmes Licht" top-right */}
      <div
        aria-hidden
        className="swa-glow pointer-events-none absolute right-[-40%] top-[-200px] h-[560px] w-[900px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(209,170,113,0.3)_0%,rgba(209,170,113,0.12)_45%,rgba(209,170,113,0)_100%)] sm:right-[-240px] sm:top-[-300px] sm:h-[760px] sm:w-[1180px]"
      />
      <Container className="max-sm:px-5 relative flex flex-col items-center gap-8 sm:gap-14">
        <Head
          dark
          icon={ShieldCheck}
          eyebrow={t("App-Bauplan und 3 Garantien", "App blueprint and 3 guarantees")}
          title={
            <>
              {t("Was du", "What you")} <Serif dark>{t("bekommst.", "get.")}</Serif>
            </>
          }
          sub={t("Der Bauplan ist kostenlos, und drei Garantien nehmen dir das Risiko.", "The blueprint is free, and three guarantees take the risk off your shoulders.")}
          className="max-w-[760px]"
        />

        <ul className="swa-grid grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {cards.map(({ icon: I, title, text, featured }, i) => (
            <li
              key={title}
              className={cn(
                "swa-card group flex flex-col gap-5 rounded-[24px] p-7 shadow-[0_1px_2px_rgba(8,34,44,0.06)] transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-1",
                featured
                  ? "border-[1.5px] border-[#d1aa71] bg-[#46351e] hover:shadow-[0_24px_50px_-26px_rgba(209,170,113,0.55)]"
                  : "border border-[#2b2a27] bg-[#002230] hover:border-[#d1aa71]/50 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)]",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "swa-seal grid size-[52px] place-items-center rounded-full border-[1.5px] border-[#d1aa71] transition-[scale] duration-300 group-hover:scale-105",
                    featured ? "bg-[#d1aa71] text-[#46351e]" : "bg-[#46351e] text-[#d8b682]",
                  )}
                >
                  <I className="size-6" strokeWidth={1.6} aria-hidden />
                </span>
                <span className="eyebrow text-[#a6a29b]">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="t-h5 text-white">{title}</h3>
              <p className="t-body-m text-[#cbc8c2]">{text}</p>
            </li>
          ))}
        </ul>

        <div className="swa-notes flex flex-col items-center gap-1.5 text-center t-body-s text-[#a6a29b]">
          <p>{t("Normalerweise berechnen wir für diesen Bauplan 1.000 €.", "We normally charge €1,000 for this blueprint.")}</p>
          <p>{t("6 Wochen beziehen sich auf den im Bauplan festgelegten Umfang der ersten Version.", "The 6 weeks refer to the first-version scope defined in the blueprint.")}</p>
        </div>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} variant="gold" className="swa-cta w-full max-sm:h-[58px] sm:w-auto" />
      </Container>
    </section>
  );
}
