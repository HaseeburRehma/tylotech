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
        <div className="gr-card relative mx-auto max-w-[1120px] rounded-[28px] border border-line bg-white p-6 shadow-[0_40px_90px_-50px_rgba(15,14,13,0.3)] sm:p-10 lg:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
            {/* portrait — stacked-photo look */}
            <div className="gr-photo relative mx-auto w-full max-w-[320px] lg:mx-0 lg:max-w-[340px]">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-2.5 translate-y-3.5 rounded-[22px] bg-[#e7eaec] shadow-[0_30px_55px_-30px_rgba(15,14,13,0.45)]"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink shadow-[0_30px_60px_-26px_rgba(15,14,13,0.55)] ring-1 ring-[#d1aa71]/35">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={poster}
                  alt="Ilias El Aradi, Gründer von TyloTech"
                  onError={() =>
                    setPoster(`https://i.ytimg.com/vi/${YT_ID}/hqdefault.jpg`)
                  }
                  className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                />
              </div>
            </div>

            {/* content */}
            <div className="gr-body">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
                <UserRound className="size-3.5 text-accent" />
                Der Gründer
              </p>

              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
                Warum es{" "}
                <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                  TyloTech
                </span>{" "}
                gibt.
              </h2>

              {/* quote */}
              <div className="mt-6 flex items-start gap-4 rounded-[16px] border border-[rgba(209,170,113,0.3)] bg-[rgba(209,170,113,0.08)] px-5 py-5 sm:px-6">
                <Quote
                  className="mt-1 size-5 shrink-0 fill-[#c79a53] text-[#c79a53]"
                  strokeWidth={0}
                />
                <p className="font-[family-name:var(--font-instrument)] text-[clamp(16px,1.6vw,19px)] italic leading-[1.5] text-ink/85">
                  „Ich habe jeden dieser Prozesse selbst durchlaufen — Marketing,
                  Code, Vertrieb, Aufbau. Deshalb sehen wir, was andere
                  übersehen. Und deshalb bauen wir mit, statt nur zu beraten.“
                </p>
              </div>

              {/* signature */}
              <div className="mt-8">
                <span className="mb-4 block h-px w-9 bg-ink/25" />
                <p className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
                  Ilias El Aradi
                </p>
                <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink/45">
                  Gründer von TyloTech · Dein Wachstumspartner
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
