"use client";

import { useRef, useState } from "react";
import { UserRound, Quote } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const YT_ID = "vSIs3xcjzG4";

export default function Gruender() {
  const root = useRef<HTMLDivElement>(null);
  const [poster, setPoster] = useState(
    `https://i.ytimg.com/vi/${YT_ID}/maxresdefault.jpg`,
  );

  useGSAP(
    () => {
      gsap.from(".gr-card", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".gr-card", start: "top 85%" },
      });
      gsap.from(".gr-photo", {
        y: 30,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".gr-card", start: "top 85%" },
      });
      gsap.from(".gr-body > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".gr-body", start: "top 88%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="gruender"
      ref={root}
      className="border-t border-line bg-[#f3f5f6] py-20 sm:py-24"
    >
      <Container>
        <div className="gr-card relative mx-auto max-w-[1080px] overflow-visible rounded-[28px] border border-line bg-white px-6 py-10 shadow-[0_40px_90px_-50px_rgba(15,14,13,0.3)] sm:px-10 sm:py-14 lg:px-14">
          <div className="grid items-center gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
            {/* portrait */}
            <div className="gr-photo relative mx-auto w-full max-w-[300px] lg:mx-0 lg:-ml-20">
              <span
                aria-hidden
                className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[20px] bg-[#e7eaec]"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-ink shadow-[0_44px_80px_-30px_rgba(15,14,13,0.6)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster}
                  alt="Gründer und Geschäftsführer von TyloTech"
                  onError={() =>
                    setPoster(`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`)
                  }
                  className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
                />
              </div>
            </div>

            {/* letter */}
            <div className="gr-body">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
                <UserRound className="size-3.5 text-accent" />
                Vom Gründer
              </p>

              <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-bold leading-[1.12] tracking-[-0.03em] text-ink">
                Warum es{" "}
                <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                  TyloTech
                </span>{" "}
                gibt.
              </h2>

              <p className="mt-5 text-[clamp(16px,1.5vw,18px)] font-semibold leading-[1.55] tracking-[-0.01em] text-ink">
                Ich habe zu oft gesehen, wie gute Betriebe an schlechter
                Organisation scheitern.
              </p>

              <div className="mt-4 space-y-4 text-[15px] leading-[1.65] text-[#5c5954]">
                <p>
                  Drei Dienstleister, drei Rechnungen, und am Ende koordiniert
                  der Unternehmer selbst. Die Website kennt die Kampagne nicht,
                  die Kampagne kennt die Zahlen nicht, und niemand fühlt sich
                  zuständig, wenn etwas stehen bleibt.
                </p>
                <p>
                  Deshalb haben wir TyloTech so aufgebaut, wie wir es selbst
                  gebraucht hätten. Marketing, Software und Unternehmensaufbau
                  unter einem Dach, ein fester Ansprechpartner und Zahlen, die
                  jeder im Haus sehen kann.
                </p>
                <p>
                  Wir nehmen nicht jedes Projekt an. Wenn wir nicht die Richtigen
                  sind, sagen wir das im ersten Gespräch. Was wir zusagen, halten
                  wir.
                </p>
              </div>

              {/* quote callout */}
              <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-[rgba(209,170,113,0.35)] bg-[rgba(209,170,113,0.10)] px-5 py-4">
                <Quote
                  className="mt-0.5 size-5 shrink-0 fill-[#c79a53] text-[#c79a53]"
                  strokeWidth={0}
                />
                <p className="text-[15px] leading-[1.55] text-ink">
                  <span className="font-[family-name:var(--font-instrument)] italic text-[#8a6a37]">
                    Ein Partner, der bleibt.
                  </span>{" "}
                  Nicht drei, die aufeinander zeigen.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-px w-9 bg-ink/25" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink/45">
                  Gründer und Geschäftsführer
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
