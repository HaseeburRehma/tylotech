"use client";

import { useRef } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { APPLY } from "./ui";

export default function SoftwareCTA() {
  const root = useRef<HTMLElement>(null);
  const t = useT();

  useLazyGSAP(
    () => {
      gsap.from(".swc-panel", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".swc-panel", start: "top 88%", toggleActions: "play none none none" } });
      gsap.from(".swc-in > *", { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".swc-in", start: "top 90%", toggleActions: "play none none none" } });
      gsap.to(".swc-glow", { opacity: 0.5, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white py-16 sm:py-[100px]">
      <Container className="max-sm:px-5">
        <div className="swc-panel relative overflow-hidden rounded-[24px] border border-[rgba(209,170,113,0.28)] bg-[linear-gradient(154deg,#0a4157_12%,#012e3e_43%,#00151e_80%)] px-5 py-12 shadow-[0_28px_70px_rgba(4,22,29,0.3),inset_0_1.5px_2px_rgba(255,255,255,0.14)] sm:rounded-[36px] sm:px-20 sm:py-[76px]">
          {/* Figma: teal glow top-left, gold glow under the button */}
          <div aria-hidden className="pointer-events-none absolute left-[-10%] top-[-30%] h-[90%] w-[70%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(29,115,145,0.28)_0%,rgba(29,115,145,0.05)_60%,rgba(29,115,145,0)_100%)]" />
          <div aria-hidden className="swc-glow pointer-events-none absolute left-[30%] top-[35%] h-[80%] w-[60%] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(209,170,113,0.42)_0%,rgba(209,170,113,0.1)_50%,rgba(209,170,113,0)_100%)] opacity-90" />

          <div className="swc-in relative flex flex-col items-center gap-[26px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.22] bg-white/[0.12] py-2 pl-2.5 pr-4 font-display text-[14px] font-medium uppercase leading-[18px] tracking-[-0.2px] text-white/[0.92] shadow-[inset_0_0_0_0.6px_rgba(255,255,255,0.22)] backdrop-blur-xl">
              <Calendar className="size-[15px] text-[#d8b682]" strokeWidth={1.8} aria-hidden />
              {t("Bewerbung erforderlich", "Application required")}
            </p>
            <h2 className="t-h1-l max-w-[860px] text-white">
              {t("Nur 5 Plätze", "Only 5 spots")} <span className="t-serif tracking-[-0.02em]">{t("diesen Monat.", "this month.")}</span>
            </h2>
            <p className="t-body-l max-w-[720px] text-white/[0.94]">
              {t("Bewirb dich für deinen kostenlosen App-Bauplan. Wir melden uns innerhalb von 24 Stunden.", "Apply for your free app blueprint. We’ll get back to you within 24 hours.")}
            </p>
            <a
              href={APPLY}
              className="group relative inline-flex items-center gap-3.5 rounded-full bg-gradient-to-r from-[#efdcbc] via-[#d8b681] to-[#b4894d] py-2 pl-2 pr-[30px] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d1aa71]/50"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#17485b] to-[#04161d] text-white">
                <ArrowRight className="size-[19px] transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="whitespace-nowrap font-display text-[19px] font-semibold leading-6 tracking-[-0.3px] text-[#04161d]">
                {t("Jetzt", "Apply")} <span className="t-serif tracking-[inherit]">{t("bewerben", "now")}</span>
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
