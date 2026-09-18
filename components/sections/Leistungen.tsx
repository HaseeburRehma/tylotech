"use client";

import { useRef } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const SERVICES = [
  { img: "/illustrations/digital.png", title: "Digitale Lösungen", desc: "Web, Apps und Individualsoftware" },
  { img: "/illustrations/marketing.png", title: "Marketing & Performance", desc: "Ads, SEO und Social — an Umsatz gemessen" },
  { img: "/illustrations/aufbau.png", title: "Unternehmensaufbau", desc: "Gründung, Businessplan, Prozesse" },
  { img: "/illustrations/tech.png", title: "Neue Technologien", desc: "KI, Blockchain und XR, wo es sich rechnet" },
  { img: "/illustrations/cloud.png", title: "Cloud & Infrastruktur", desc: "Migration, DevOps und Sicherheit" },
  { img: "/illustrations/enterprise.png", title: "Enterprise Services", desc: "Datenanalyse, QA und IT-Staffing" },
];

export default function Leistungen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".leist-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".leist-head", start: "top 82%" },
      });
      gsap.from(".leist-cell", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".leist-grid", start: "top 82%" },
      });

      // Illustrations spring in, then settle into a slow idle float. The float
      // lives on the <img>; the hover tilt lives on its wrapper, so they never
      // fight over the same transform.
      const illus = gsap.utils.toArray<HTMLElement>(".leist-illu");
      gsap.from(illus, {
        scale: 0.72,
        rotate: -6,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.09,
        scrollTrigger: { trigger: ".leist-grid", start: "top 80%" },
      });
      illus.forEach((el, i) => {
        gsap.to(el, {
          y: -9,
          duration: 2.6 + (i % 3) * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 1 + i * 0.12,
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="leistungen" ref={root} className="bg-page py-24">
      <Container>
        <div className="leist-head mx-auto max-w-[760px] text-center">
          <p className="eyebrow mb-[18px] flex items-center justify-center gap-2.5 text-[#94713f]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Leistungen
          </p>
          <h2 className="display-l text-ink">
            Sechs Bereiche, die sonst auf sechs Verträge verteilt sind. Bei uns
            liegen sie auf einem Tisch.
          </h2>
        </div>

        <div className="leist-grid mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="leist-cell group flex min-h-[420px] flex-col justify-between bg-page px-10 pb-11 pt-12 transition-colors hover:bg-white"
            >
              <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.img}
                  alt={s.title}
                  width={200}
                  height={200}
                  className="leist-illu size-[200px] object-contain"
                />
              </div>
              <div>
                <h3 className="font-display text-[32px] font-semibold leading-[38px] tracking-[-0.8px] text-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-[16px] leading-[26px] text-[#7d7973]">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
