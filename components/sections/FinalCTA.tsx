"use client";

import { useRef } from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-panel", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".cta-panel", start: "top 88%" },
      });
      gsap.from(".cta-in > *", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".cta-in", start: "top 90%" },
      });
      gsap.to(".cta-glow", {
        opacity: 0.5,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root },
  );

  return (
    <section
      id="kontakt"
      ref={root}
      className="border-t border-line bg-[#f3f5f6] py-16 sm:py-20"
    >
      <Container>
        <div className="cta-panel relative mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b3a4d] via-[#062430] to-[#031a24] px-6 py-16 shadow-[0_50px_110px_-50px_rgba(3,26,36,0.7)] sm:px-10 sm:py-20">
          {/* warm glow */}
          <div
            aria-hidden
            className="cta-glow pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
            style={{
              background:
                "radial-gradient(closest-side, rgba(209,170,113,0.20), transparent 72%)",
            }}
          />

          <div className="cta-in relative mx-auto max-w-[720px] text-center">
            <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-white/80 backdrop-blur">
              <CalendarDays className="size-4 text-accent" />
              Kostenloses Erstgespräch
            </p>

            <h2 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
              Bereit, dein Wachstum{" "}
              <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#e5c48a]">
                planbar
              </span>{" "}
              zu machen?
            </h2>

            <p className="mx-auto mt-5 max-w-[600px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#b3d6e2]">
              Kein Verkaufsgespräch. Eine ehrliche Einschätzung, wo dein größter
              Hebel liegt — und ob wir zueinander passen.
            </p>

            <div className="mt-9 flex justify-center">
              <Link
                href="#termin"
                className="group inline-flex items-center gap-3.5 rounded-full bg-gradient-to-b from-[#e7c179] to-[#c99f5c] py-2 pl-2 pr-7 shadow-[0_0_44px_-6px_rgba(209,170,113,0.7)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#03202c] text-white">
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="text-[16px] text-[#1c1305]">
                  <span className="font-[family-name:var(--font-instrument)] italic">
                    Erstgespräch
                  </span>{" "}
                  <span className="font-semibold">sichern</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
