"use client";

import Link from "next/link";
import { Star, ArrowRight, Megaphone } from "lucide-react";
import Container from "../ui/Container";
import HeroVideoCard from "./HeroVideoCard";
import { useT } from "../i18n/LocaleProvider";

const YT_ID = "vSIs3xcjzG4";

export default function Hero() {
  const t = useT();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-page"
    >
      {/* soft warm backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_88%_-8%,rgba(209,170,113,0.16),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_0%_115%,rgba(209,170,113,0.07),transparent_60%)]" />
      </div>

      <Container className="grid grid-cols-1 items-center gap-10 pb-16 pt-12 sm:pb-20 sm:pt-16 min-[1180px]:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] min-[1180px]:gap-14 min-[1180px]:pb-28 min-[1180px]:pt-[72px]">
        {/* Left — copy */}
        <div className="hero-content flex max-w-[600px] flex-col gap-6 sm:gap-7">
          <p className="hero-eyebrow intro-up inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-60 backdrop-blur-sm">
            <Megaphone className="size-3.5 text-accent" />
            {t("Dein Wachstumspartner", "Your growth partner")}
          </p>

          <h1 className="font-display text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.06] tracking-[-0.03em] text-ink">
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line intro-line block [animation-delay:300ms]">{t("Wir bauen, was dein", "We build what")}</span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line intro-line block [animation-delay:390ms]">
                {t(
                  <>
                    Unternehmen{" "}
                    <span className="font-[family-name:var(--font-instrument)] font-normal italic text-accent">
                      wirklich
                    </span>
                  </>,
                  <>
                    <span className="font-[family-name:var(--font-instrument)] font-normal italic text-accent">
                      truly
                    </span>{" "}
                    moves your
                  </>,
                )}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="hero-line intro-line block [animation-delay:480ms]">{t("nach vorne bringt.", "business forward.")}</span>
            </span>
          </h1>

          <p className="hero-copy intro-up max-w-[520px] [animation-delay:650ms] text-[clamp(15px,1.6vw,19px)] leading-[1.6] text-ink-60">
            {t(
              "Marketing, Software und Vertrieb aus einer Hand — mit einem Team, das nicht nur berät, sondern umsetzt. Und bei den richtigen Partnern steigen wir sogar mit ein.",
              "Marketing, software and sales from one team — a team that doesn’t just advise, it delivers. And with the right partners, we even invest.",
            )}
          </p>

          {/* CTAs — stacked on mobile, row on sm+ */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="#kontakt"
              className="hero-cta intro-up group inline-flex [animation-delay:750ms] h-14 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-transparent px-7 text-[16px] font-medium leading-none tracking-[-0.006em] text-[#0f0e0d] shadow-[0_4px_14px_rgba(168,127,69,0.2),0_10px_28px_rgba(168,127,69,0.32),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate] duration-200 hover:-translate-y-0.5 hover:brightness-[1.04] sm:w-[260px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,rgba(255,255,255,0.42) 0%,rgba(255,255,255,0.02) 55%,rgba(255,255,255,0) 100%),linear-gradient(90deg,#EFDCBC 0%,#D8B681 45%,#B4894D 100%)",
              }}
            >
              {t("Erstgespräch sichern", "Book your intro call")}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#ablauf"
              className="hero-cta intro-up inline-flex [animation-delay:850ms] h-14 w-full items-center justify-center whitespace-nowrap rounded-full border border-[#e8e6e1] bg-white px-7 text-[16px] font-medium leading-none tracking-[-0.006em] text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07)] transition-colors duration-200 hover:bg-[#fafaf9] sm:w-[260px]"
            >
              {t("So arbeiten wir", "How we work")}
            </Link>
          </div>

          {/* Proof */}
          <div className="hero-proof intro-up [animation-delay:950ms]">
            <div className="h-px w-full max-w-[520px] bg-line" />
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-60 sm:text-[14px]">
              <span>{t("100+ Projekte", "100+ projects")}</span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span className="flex items-center gap-2.5">
                <span className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-[16px] fill-accent text-accent"
                      strokeWidth={0}
                    />
                  ))}
                </span>
                <span className="text-[15px] font-semibold text-ink">{t("5,0", "5.0")}</span>
                <span>{t("Bewertung", "rating")}</span>
              </span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>{t("vom Handwerk bis zum Mittelstand", "from trades to established SMEs")}</span>
            </div>
          </div>
        </div>

        {/* Right — video */}
        <div className="w-full max-w-[560px] min-[1180px]:max-w-none">
          <HeroVideoCard videoId={YT_ID} />
        </div>
      </Container>
    </section>
  );
}
