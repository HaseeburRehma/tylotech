"use client";

import { useRef } from "react";
import {
  BarChart3,
  MapPin,
  ShieldCheck,
  Building2,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatNumber, type Locale } from "@/lib/i18n";
import { useLocale, useT } from "../i18n/LocaleProvider";

const STATS = [
  { value: 100, decimals: 0, suffix: "+", label: "Projekte umgesetzt", labelEn: "Projects delivered" },
  { value: 5, decimals: 1, suffix: "", label: "Durchschnittsbewertung", labelEn: "Average rating" },
  { value: 3, decimals: 0, suffix: "-in-1", label: "Marketing · Software · Vertrieb", labelEn: "Marketing · Software · Sales" },
];

const TAGS: { de: string; en: string; icon: LucideIcon }[] = [
  { de: "Made in Germany", en: "Made in Germany", icon: MapPin },
  { de: "DSGVO-konform", en: "GDPR-compliant", icon: ShieldCheck },
  { de: "Sitz in Düsseldorf", en: "Based in Düsseldorf", icon: Building2 },
];

function fmt(locale: Locale, n: number, decimals: number) {
  return formatNumber(locale, n, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function Zahlen() {
  const root = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useT();

  useGSAP(
    () => {
      gsap.from(".zahlen-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".zahlen-head", start: "top 82%" , toggleActions: "play none none none" },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".zahlen-card");
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".zahlen-grid", start: "top 82%" , toggleActions: "play none none none" },
      });

      gsap.from(".zahlen-tag", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.6)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".zahlen-tags", start: "top 90%" , toggleActions: "play none none none" },
      });

      // Count-up
      cards.forEach((card, i) => {
        const el = card.querySelector<HTMLElement>(".zahlen-num");
        if (!el) return;
        const { value, decimals, suffix } = STATS[i];
        const obj = { n: 0 };
        gsap.to(obj, {
          n: value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".zahlen-grid", start: "top 78%" , toggleActions: "play none none none" },
          onUpdate: () => {
            el.textContent = fmt(locale, obj.n, decimals) + suffix;
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="zahlen"
      ref={root}
      className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-14 sm:py-24"
    >
      {/* faint warm glow, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_92%_-10%,rgba(209,170,113,0.10),transparent_60%)]"
      />

      <Container className="relative">
        <div className="zahlen-head mx-auto max-w-[640px] text-center">
          <p className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <BarChart3 className="size-3.5 text-accent" />
            {t("Zahlen, die bleiben", "Numbers that hold up")}
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            {t(
              <>
                Was{" "}
                <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                  nachprüfbar
                </span>{" "}
                ist.
              </>,
              <>
                What you can{" "}
                <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                  verify
                </span>
                .
              </>,
            )}
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            {t(
              "Hier steht nur, was du selbst überprüfen kannst, auf Google, bei unseren Partnern oder in einem Gespräch.",
              "Only what you can check for yourself — on Google, with our partners or in a conversation.",
            )}
          </p>
        </div>

        <div className="zahlen-grid mx-auto mt-12 grid max-w-[1040px] grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="zahlen-card rounded-[20px] border border-line bg-white px-7 py-8 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(15,14,13,0.28)] sm:px-8 sm:py-9"
            >
              <p className="zahlen-num font-display text-[clamp(2.6rem,4vw,3.25rem)] font-bold leading-none tracking-[-0.03em] text-ink">
                {fmt(locale, 0, s.decimals) + s.suffix}
              </p>
              <p className="mt-4 text-[15px] leading-snug text-[#5c5954]">
                {t(s.label, s.labelEn)}
              </p>
            </div>
          ))}
        </div>

        <div className="zahlen-tags mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[14px] text-[#5c5954] sm:mt-10">
          {TAGS.map(({ de, en, icon: Icon }) => (
            <span key={de} className="zahlen-tag flex items-center gap-2">
              <Icon className="size-[17px] text-accent" strokeWidth={2} />
              {t(de, en)}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
