"use client";

import { useRef } from "react";
import { Calendar, Clock, FileText, Smartphone, Users } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Eyebrow, H2, Serif } from "./ui";
import s from "./software.module.css";

export default function SoftwareLoesung() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const modules = [
    { icon: Calendar, text: t("Einsatzplanung", "Scheduling") },
    { icon: Users, text: t("Kundendaten", "Customer data") },
    { icon: FileText, text: t("Abrechnung", "Invoicing") },
    { icon: Clock, text: t("Zeiterfassung", "Time tracking") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".swl-text > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, scrollTrigger: st(".swl-text") });
      gsap.from(".swl-mod", { y: 12, scale: 0.92, opacity: 0, duration: 0.5, ease: "back.out(1.8)", stagger: 0.07, delay: 0.25, scrollTrigger: st(".swl-text") });
      gsap.from(".swl-stage", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st(".swl-stage") });
      gsap.from(".swl-phone", { y: 90, rotate: 4, duration: 1.2, ease: "power3.out", scrollTrigger: st(".swl-stage") });
      gsap.from(".swl-note", { x: -16, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.4, scrollTrigger: st(".swl-stage") });
      // slow parallax drift of the phone while the stage scrolls through
      gsap.to(".swl-phone-wrap", { y: -36, ease: "none", scrollTrigger: { trigger: ".swl-stage", start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white py-16 sm:py-[112px]">
      <Container className="max-sm:px-5 grid grid-cols-1 items-center gap-7 lg:grid-cols-[minmax(0,600px)_minmax(0,600px)] lg:justify-between lg:gap-20">
        <div className="swl-text flex flex-col items-start gap-7 sm:gap-8">
          <div className="flex flex-col items-start gap-[18px]">
            <Eyebrow icon={Smartphone}>{t("Die Lösung", "The solution")}</Eyebrow>
            <h2 className={H2}>
              {t("Deine eigene Software. Gebaut um deinen Betrieb,", "Your own software. Built around your business,")}{" "}
              <Serif>{t("nicht umgekehrt.", "not the other way round.")}</Serif>
            </h2>
            <p className="t-body-l text-[#5c5954]">
              {t(
                "Wir bauen dir ein System, das genau deine Abläufe abbildet. Einsatzplanung, Kundendaten, Abrechnung, Zeiterfassung, alles an einem Ort. Einmal gebaut, gehört es dir.",
                "We build you a system that mirrors exactly how you work. Scheduling, customer data, invoicing, time tracking, all in one place. Built once, it’s yours.",
              )}
            </p>
          </div>
          <ul className="flex w-full flex-wrap gap-2.5 sm:gap-3">
            {modules.map(({ icon: I, text }) => (
              <li
                key={text}
                className="swl-mod flex items-center gap-2 rounded-full border border-[#eeedea] bg-[#f6f5f3] py-2.5 pl-3 pr-3.5 t-label-m text-[#1a1917] transition-colors duration-200 hover:border-[#e3c79e] hover:bg-[#fbf6ee] sm:gap-2.5 sm:py-3 sm:pl-3.5 sm:pr-[18px]"
              >
                <I className="size-4 shrink-0 text-[#c79a53] sm:size-[18px]" strokeWidth={1.7} aria-hidden />
                {text}
              </li>
            ))}
          </ul>
          <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="max-lg:hidden" />
        </div>

        {/* Figma "Bühne": 600 × 600 stage, iPhone mockup 264 × 546 starting 60 px from the top */}
        <div className="swl-stage relative mx-auto h-[380px] w-full max-w-[600px] overflow-hidden rounded-[20px] bg-[#f6f5f3] sm:aspect-square sm:h-auto sm:rounded-[28px]">
          <div className="swl-phone-wrap absolute left-1/2 top-14 w-[213px] -translate-x-1/2 sm:top-[10%] sm:w-[44%]">
            <div className="swl-phone">
              <div className={s.float}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/software/phone-einsatzplan.webp"
                  width={529}
                  height={1080}
                  alt={t(
                    "Einsatzplan-App von Priya Reinigungsservice: Kalender, Objekte und Status der Einsätze",
                    "Priya cleaning service scheduling app: calendar, sites and job status",
                  )}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full drop-shadow-[0_30px_40px_rgba(8,34,44,0.18)]"
                />
              </div>
            </div>
          </div>
          <p className="swl-note absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white/[0.72] py-[7px] pl-2.5 pr-3 eyebrow text-[#1a1917] shadow-[0_8px_24px_rgba(8,34,44,0.08)] backdrop-blur-md sm:left-6 sm:top-6 sm:py-2 sm:pl-3 sm:pr-3.5">
            <Smartphone className="size-3.5 shrink-0 text-[#c79a53]" strokeWidth={1.8} aria-hidden />
            <span className="sm:hidden">{t("Beispiel: Priya", "Example: Priya")}</span>
            <span className="hidden sm:inline">{t("Beispiel: Priya Reinigungsservice", "Example: Priya cleaning service")}</span>
          </p>
        </div>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="w-full max-sm:h-[58px] sm:w-auto sm:justify-self-start lg:hidden" />
      </Container>
    </section>
  );
}
