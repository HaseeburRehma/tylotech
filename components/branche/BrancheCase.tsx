"use client";

import { useRef } from "react";
import { CircleCheck, Quote, X } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Branche, BrancheCaseData } from "@/lib/branchen";
import { Accent, Eyebrow } from "./ui";
import { useT } from "../i18n/LocaleProvider";
import VoiceNote from "../sections/VoiceNote";

const LOGOS = {
  rohrcleaner: { name: "Rohr Cleaner", src: "/partners/rohrcleaner.webp", className: "h-10 w-12" },
  "nouh-wehres": { name: "Nouh-Wehres", src: "/partners/nouh-wehres.webp", className: "h-7 w-[136px]" },
};

function CaseCard({ c, flip }: { c: BrancheCaseData; flip: boolean }) {
  const t = useT();
  return (
    <div className={cn("bhc-card flex flex-col items-center gap-10 overflow-hidden rounded-[28px] border border-[#eeedea] bg-white p-6 shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05),0_51px_49px_rgba(8,34,44,0.03)] sm:rounded-[32px] sm:p-10 lg:gap-16 lg:p-16", flip ? "lg:flex-row-reverse" : "lg:flex-row")}>
      <div className="bhc-content flex w-full min-w-0 flex-1 flex-col items-start gap-6">
        <div className="flex items-center gap-4">
          <Eyebrow icon="award">{t("Case / Beweis", "Case / Proof")}</Eyebrow>
          {c.logo && (
            <span
              aria-label={LOGOS[c.logo].name}
              role="img"
              className={cn("block bg-[#7d7973]", LOGOS[c.logo].className)}
              style={{ WebkitMaskImage: `url(${LOGOS[c.logo].src})`, maskImage: `url(${LOGOS[c.logo].src})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }}
            />
          )}
        </div>
        <h2 className="t-h2 hyphens-auto break-words text-[#1a1917]">
          <Accent text={c.title} />
        </h2>
        {c.text && <p className="t-body-l text-[#5c5954]">{c.text}</p>}

        {c.before && (
          <div className="flex w-full flex-col gap-3.5">
            <p className="eyebrow text-[#7d7973]">{t("Ausgangssituation", "Starting point")}</p>
            <ul className="flex flex-col gap-3">
              {c.before.map((t) => (
                <li key={t} className="t-body-l flex items-start gap-3 text-[#5c5954]">
                  <X className="mt-[3px] size-[22px] shrink-0 text-[#b4502f]" strokeWidth={1.8} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
        {c.before && c.after && <div className="h-px w-full bg-[#e2e0dc]" />}
        {c.after && (
          <div className="flex w-full flex-col gap-3.5">
            <p className="eyebrow text-[#94713f]">{t("Ergebnis mit TyloTech", "Results with TyloTech")}</p>
            <ul className="flex flex-col gap-3">
              {c.after.map((t) => (
                <li key={t} className="t-body-l flex items-start gap-3 text-[#1a1917]">
                  <CircleCheck className="mt-[3px] size-[22px] shrink-0 fill-[#c08f4b] text-white" strokeWidth={2} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
        {c.testimonial && (
          <figure className="flex w-full flex-col gap-4 rounded-[18px] border border-[#efe2cb] bg-[#fbf6ee] px-[22px] py-5">
            <Quote className="size-6 text-[#c08f4b]" fill="currentColor" strokeWidth={0} aria-hidden />
            <blockquote className="t-body-l font-medium text-[#1a1917]">{c.testimonial.quote}</blockquote>
            <figcaption className="eyebrow text-[#94713f]">{c.testimonial.author}</figcaption>
            {c.testimonial.voice && <VoiceNote voice={c.testimonial.voice} />}
          </figure>
        )}
      </div>

      <div
        className={cn(
          "bhc-visual group relative aspect-square w-full max-w-[520px] shrink-0 overflow-hidden rounded-[24px] shadow-[0_6px_20px_rgba(0,0,0,0.3),0_10px_30px_rgba(0,0,0,0.45)] lg:w-[min(520px,45%)]",
          c.image ? "bg-[#eeedea]" : "bg-[#fbf6ee]",
        )}
      >
        {c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.image}
            alt=""
            loading="lazy"
            className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]", c.imageFit === "top" && "object-top")}
          />
        ) : (
          c.tyloLogo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img loading="lazy" decoding="async" src="/brand/tylotech-logo.svg" alt="TyloTech" className="absolute left-1/2 top-1/2 w-[35%] -translate-x-1/2 -translate-y-1/2" />
          )
        )}
        {c.image && c.tyloLogo && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(3,21,28,0)_0%,rgba(3,21,28,0.55)_100%)]" />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[16px] border border-white/60 bg-white/90 py-3 pl-3.5 pr-4 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md sm:bottom-6 sm:left-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src="/brand/tylotech-logo.svg" alt="TyloTech" className="h-6 w-auto sm:h-7" />
              <span className="h-6 w-px bg-[#e2e0dc]" />
              <span className="font-mono text-[10.5px] font-medium uppercase leading-[13px] tracking-[0.4px] text-[#94713f] sm:text-[11px]">
                {t("Eigene", "Our own")}
                <br />
                {t("Marke", "brand")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BrancheCase({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);

  useLazyGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".bhc-card").forEach((card) => {
        const st = { trigger: card, start: "top 80%", toggleActions: "play none none none" };
        gsap.from(card, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
        gsap.from(card.querySelectorAll(".bhc-content > *"), { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.15, scrollTrigger: st });
        gsap.from(card.querySelector(".bhc-visual"), { y: 30, opacity: 0, scale: 0.96, duration: 1, ease: "power3.out", delay: 0.2, scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section id="case" ref={root} className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-8 lg:gap-10">
        {[b.case, ...(b.moreCases ?? [])].map((c, i) => (
          <CaseCard key={c.title} c={c} flip={i % 2 === 1} />
        ))}
      </Container>
    </section>
  );
}
