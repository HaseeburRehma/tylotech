"use client";

import { useRef } from "react";
import { Workflow } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";
import { ApplyButton, Head } from "./ui";

export default function SoftwareAblauf() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const steps = [
    { title: t("Bewerben", "Apply"), text: t("Du bewirbst dich (2 Minuten).", "You apply (2 minutes).") },
    { title: t("Bauplan", "Blueprint"), text: t("Wir melden uns in 24 Std. und bauen deinen kostenlosen Bauplan.", "We get back to you within 24 hours and build your free blueprint.") },
    { title: t("Bauen", "Build"), text: t("Passt's, bauen wir. Festpreis, erste Version in 6 Wochen.", "If it’s a fit, we build. Fixed price, first version in 6 weeks.") },
  ];

  useLazyGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".sw-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".sw-head") });
      const tl = gsap.timeline({ scrollTrigger: st(".swab-steps") });
      // numbers pop in one after another, the connector draws towards the next step
      tl.from(".swab-num", { scale: 0.4, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.35 }, 0)
        .from(".swab-line", { scaleX: 0, duration: 0.6, ease: "power2.inOut", stagger: 0.35 }, 0.2)
        .from(".swab-copy", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.35 }, 0.1);
      gsap.from(".swab-cta", { y: 16, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: st(".swab-cta", "top 92%") });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-white py-16 sm:py-[112px]">
      <Container className="max-sm:px-5 flex flex-col items-center gap-8 sm:gap-14">
        <Head icon={Workflow} eyebrow={t("Drei Schritte", "Three steps")} title={t("So läuft's.", "How it works.")} className="max-w-[720px]" />

        <ol className="swab-steps grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-5">
              <div className="flex items-center gap-3.5">
                <span className="swab-num grid size-12 shrink-0 place-items-center rounded-full border border-[#cbc8c2] bg-white font-mono text-[14px] font-medium leading-[18px] tracking-[0.4px] text-[#94713f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < steps.length - 1 && <span aria-hidden className="swab-line hidden h-px flex-1 origin-left bg-[#e2e0dc] md:block" />}
              </div>
              <div className="swab-copy flex flex-col gap-5">
                <h3 className="t-h5 text-[#1a1917]">{s.title}</h3>
                <p className="t-body-s -mt-2 text-[#5c5954] md:mt-0">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <ApplyButton label={t("Jetzt bewerben", "Apply now")} className="swab-cta w-full max-sm:h-[58px] sm:w-auto" />
      </Container>
    </section>
  );
}
