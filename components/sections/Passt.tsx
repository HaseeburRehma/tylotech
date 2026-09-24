"use client";

import { useRef } from "react";
import Link from "next/link";
import { Target, CircleCheck, ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const ITEMS: { normal: string; bold: string }[] = [
  { normal: "Du hast ein gutes Geschäft, ", bold: "aber kein System, das mitwächst" },
  { normal: "Du willst einen Partner, ", bold: "der umsetzt statt nur redet" },
  { normal: "Du willst Transparenz ", bold: "statt Blackbox" },
  { normal: "Du bist offen dafür, ", bold: "dass wir bei echtem Potenzial mit einsteigen" },
];

export default function Passt() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".passt-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".passt-head", start: "top 82%" },
      });
      gsap.from(".passt-panel", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".passt-panel", start: "top 86%" },
      });
      gsap.from(".passt-item", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: ".passt-panel", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="passt"
      ref={root}
      className="relative overflow-hidden border-t border-line bg-[#f6f7f7] py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_460px_at_50%_78%,rgba(209,170,113,0.22),transparent_62%)]"
      />

      <Container className="relative">
        <div className="passt-head max-w-[720px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <Target className="size-3.5 text-accent" />
            Wir arbeiten nicht mit jedem
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Woran du merkst,{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              dass es passt.
            </span>
          </h2>
          <p className="mt-4 max-w-[600px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Wir arbeiten mit Unternehmen, die wirklich wachsen wollen und bereit
            sind, mitzuziehen. Wenn du Folgendes erkennst, passen wir zusammen:
          </p>
        </div>

        {/* cream panel */}
        <div className="passt-panel mx-auto mt-10 max-w-[920px] rounded-[26px] border border-[#e6d1a4] bg-gradient-to-b from-[#f8eed9] via-[#f2e4c9] to-[#ecd9b4] p-4 shadow-[0_50px_110px_-50px_rgba(209,170,113,0.65)] sm:mt-12 sm:p-8 lg:p-10">
          <ul className="space-y-3">
            {ITEMS.map((it) => (
              <li
                key={it.bold}
                className="passt-item flex items-center gap-3 rounded-[14px] border border-[#ecdcbb] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,14,13,0.03)] sm:px-5 sm:py-4"
              >
                <CircleCheck
                  className="size-5 shrink-0 text-[#c79a53]"
                  strokeWidth={2}
                />
                <p className="text-[clamp(14px,1.4vw,16px)] leading-snug text-ink/70">
                  {it.normal}
                  <span className="font-semibold text-ink">{it.bold}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center sm:mt-8">
            <Link
              href="#kontakt"
              className="group inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ecd3a4] to-[#cfa268] px-7 text-[15px] font-medium text-ink shadow-[0_16px_36px_-14px_rgba(209,170,113,0.95)] transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04]"
            >
              Erstgespräch sichern
              <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
