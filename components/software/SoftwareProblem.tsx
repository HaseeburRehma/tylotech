"use client";

import { useRef } from "react";
import { CircleAlert, Layers, Lock, Users } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Head } from "./ui";

export default function SoftwareProblem() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const rows = [
    { icon: Layers, text: t("6 Tools, 3 Excel-Listen, 1 WhatsApp-Gruppe, und trotzdem Chaos.", "6 tools, 3 Excel sheets, 1 WhatsApp group, and still chaos.") },
    { icon: CircleAlert, text: t("Standard-Software, die nie ganz zu deinem Betrieb passt.", "Off-the-shelf software that never quite fits your business.") },
    { icon: Lock, text: t("Jahrelang Lizenzen zahlen, und am Ende gehört dir nichts.", "Paying licence fees for years, and in the end you own nothing.") },
    { icon: Users, text: t("Jeder Mitarbeiter macht's anders, weil es kein System gibt.", "Everyone on the team does it differently, because there’s no system.") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 84%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".sw-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".sw-head") });
      gsap.from(".swp-row", { y: 26, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity", scrollTrigger: st(".swp-grid") });
      gsap.from(".swp-row svg", { scale: 0.4, rotate: -25, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.08, delay: 0.2, scrollTrigger: st(".swp-grid") });
      gsap.from(".swp-cta", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st(".swp-cta", "top 92%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-[#f6f5f3] py-16 sm:py-[104px]">
      <Container className="max-sm:px-5 flex flex-col items-center gap-8 sm:gap-12">
        <Head icon={CircleAlert} eyebrow={t("Der Alltag im Betrieb", "Everyday business")} title={t("Kennst du das?", "Sound familiar?")} className="max-w-[720px]" />

        <ul className="swp-grid grid w-full grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {rows.map(({ icon: I, text }) => (
            <li
              key={text}
              className="swp-row group flex items-center gap-4 rounded-[16px] border border-[#eeedea] bg-white py-[18px] pl-[18px] pr-[22px] transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#e3c79e] hover:shadow-[0_14px_30px_-20px_rgba(8,34,44,0.3)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#f6f5f3] text-[#c79a53] transition-colors duration-300 group-hover:bg-[#fbf6ee]">
                <I className="size-5" strokeWidth={1.7} aria-hidden />
              </span>
              <p className="t-body-l flex-1 text-[#1a1917]">{text}</p>
            </li>
          ))}
        </ul>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="swp-cta w-full max-sm:h-[58px] sm:w-auto" />
      </Container>
    </section>
  );
}
