"use client";

import { useRef } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { gsap, useGSAP } from "@/lib/gsap";

function Stars({ size = 17 }: { size?: number }) {
  return (
    <span className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="fill-accent text-accent" style={{ width: size, height: size }} strokeWidth={0} />
      ))}
    </span>
  );
}

function GoogleMark({ size = 22 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-[#0a4a5f] font-display font-bold text-white/70"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-label="Google"
    >
      G
    </span>
  );
}

export default function Stimmen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".stimmen-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".stimmen-head", start: "top 82%" },
      });
      gsap.from(".stimmen-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".stimmen-grid", start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="stimmen" ref={root} className="bg-[#001620] py-24 text-white">
      <Container>
        <SectionHeading
          dark
          className="stimmen-head"
          eyebrow="Stimmen"
          title="Was Kunden über die Zusammenarbeit sagen."
          subtitle="Nachlesbar bei Google — wir verlinken die Bewertungen direkt, statt sie hier nur aufzuschreiben."
        />

        <div className="stimmen-grid mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Google panel */}
          <div className="stimmen-card flex flex-col gap-[18px] rounded-[20px] border border-[#0a4a5f] bg-[#04283a]/60 p-8">
            <div className="flex items-center gap-2.5">
              <GoogleMark />
              <span className="text-[14px] font-medium text-[#b3d6e2]">
                Google-Bewertungen
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="font-display text-[52px] font-bold leading-[56px] tracking-[-1.8px] text-white">
                5,0
              </span>
              <span className="flex flex-col gap-1">
                <Stars />
                <span className="text-[13px] text-[#7fbacd]">aus 31 Bewertungen</span>
              </span>
            </div>
            <p className="text-[14px] leading-[22px] text-[#b3d6e2]">
              Wir bitten nach jedem abgeschlossenen Projekt um eine ehrliche
              Bewertung — auch dann, wenn nicht alles glattgelaufen ist.
            </p>
            <a
              href="#"
              className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#0a4a5f] px-[22px] text-[16px] font-medium tracking-[-0.1px] text-white transition-colors hover:bg-white/[0.06]"
            >
              Alle Bewertungen ansehen
              <ArrowRight className="size-[18px]" />
            </a>
          </div>

          {/* Testimonial */}
          <div className="stimmen-card flex flex-col gap-[22px] rounded-[20px] border border-[#0a4a5f] bg-[#04283a]/60 px-8 py-[30px]">
            <Quote className="size-[26px] fill-accent text-accent" strokeWidth={0} />
            <p className="text-[18px] leading-[30px] tracking-[-0.1px] text-white">
              TyloTech ist das Gegenteil der trägen Servicewüste Deutschland —
              Innovation, Tempo und Next-Level-Denken machen sie für mich zur
              absoluten Nummer 1!
            </p>
            <div className="mt-auto h-px w-full bg-white/10" />
            <div className="flex items-center gap-3.5">
              <span className="grid size-12 place-items-center rounded-full border border-[#0a4a5f] bg-[rgba(209,170,113,0.14)] text-[14px] font-medium text-[#d8b682]">
                ES
              </span>
              <span>
                <span className="block text-[16px] font-medium tracking-[-0.1px] text-white">
                  Enes Seker
                </span>
                <span className="block text-[14px] text-[#7fbacd]">
                  Crusty Slices · Multi-Unternehmer
                </span>
              </span>
            </div>
          </div>

          {/* Google review */}
          <div className="stimmen-card flex flex-col gap-4 rounded-[18px] border border-[#0a4a5f] bg-[#04283a]/60 px-7 py-[26px]">
            <div className="flex items-center justify-between">
              <Stars />
              <GoogleMark size={20} />
            </div>
            <p className="text-[16px] leading-[26px] text-[#b3d6e2]">
              Ich bin persönlich immer sehr skeptisch, wenn es um die ersten
              Kontakte im Business geht! Aber bei Ilias war es von Anfang an
              einfach seriös, ehrlich und transparent!
            </p>
            <div className="mt-auto flex items-center gap-3">
              <span className="grid size-[38px] place-items-center rounded-full border border-[#0a4a5f] bg-[rgba(209,170,113,0.14)] text-[13px] font-medium text-[#d8b682]">
                G
              </span>
              <span>
                <span className="block text-[14px] font-medium text-white">
                  Google-Rezension
                </span>
                <span className="block text-[13px] text-[#7fbacd]">
                  verifiziert · 5 von 5
                </span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
