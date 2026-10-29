"use client";

import { useRef } from "react";
import { Users } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Head, Serif } from "./ui";

export default function SoftwareAuswahl() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  // n = number that counts up, rest = unit after it
  const stats = [
    { n: 5, unit: "", label: t("Baupläne pro Monat", "blueprints per month") },
    { n: 24, unit: t(" Std.", " hrs"), label: t("bis wir uns melden", "until we get back to you") },
    { n: 2, unit: t(" Min.", " min"), label: t("für deine Bewerbung", "for your application") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".sw-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".sw-head") });
      gsap.from(".swz-card", { y: 34, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, clearProps: "transform,opacity", scrollTrigger: st(".swz-grid") });
      // count the numbers up from 0 (the final value is server-rendered, so no CLS and no-JS safe)
      gsap.utils.toArray<HTMLElement>(".swz-n").forEach((el) => {
        const end = Number(el.dataset.n);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: st(".swz-grid"),
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
        });
        el.textContent = "0";
      });
      gsap.from(".swz-cta", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st(".swz-cta", "top 92%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-[104px]">
      <Container className="max-sm:px-5 flex flex-col items-center gap-8 sm:gap-12">
        <Head
          icon={Users}
          eyebrow={t("Bewerbung statt Anmeldung", "Apply, don’t sign up")}
          title={
            <>
              {t("Wir nehmen", "We don’t take")} <Serif>{t("nicht jeden.", "everyone.")}</Serif>
            </>
          }
          sub={t(
            "Jeder Bauplan ist echte Arbeit, deshalb nur 5 pro Monat. Wir bauen nur für Betriebe, bei denen eine eigene Software wirklich Sinn ergibt. Deshalb die kurze Bewerbung.",
            "Every blueprint is real work, so we only do 5 a month. We only build for businesses where custom software genuinely makes sense. Hence the short application.",
          )}
          className="max-w-[760px]"
        />

        <ul className="swz-grid grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
          {stats.map((s) => (
            <li
              key={s.label}
              className="swz-card flex flex-col gap-2 rounded-[20px] border border-[#eeedea] bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-24px_rgba(8,34,44,0.3)] sm:items-center sm:p-8 sm:text-center"
            >
              <p className="t-stat text-[#1a1917] tabular-nums">
                <span className="swz-n" data-n={s.n}>
                  {s.n}
                </span>
                {s.unit}
              </p>
              <p className="t-body-s text-[#5c5954]">{s.label}</p>
            </li>
          ))}
        </ul>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="swz-cta w-full max-sm:h-[58px] sm:w-auto" />
      </Container>
    </section>
  );
}
