"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import MosaicBackdrop from "../MosaicBackdrop";
import { gsap, useGSAP } from "@/lib/gsap";

const TAGS = [
  "Antwort in der Regel am selben Werktag",
  "Kein Abo, keine Mindestlaufzeit",
  "Made in Germany",
];

export default function FinalCTA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-in > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".cta-in", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="kontakt"
      ref={root}
      className="relative overflow-hidden bg-[#001620] py-28 text-white"
    >
      <MosaicBackdrop fade="radial-gradient(110% 95% at 50% 45%, #000 25%, transparent 74%)" />
      {/* gold glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(209,170,113,0.16), transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="cta-in mx-auto max-w-[640px] text-center">
          <p className="eyebrow mb-[18px] flex items-center justify-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Nächster Schritt
          </p>
          <h2 className="display-l text-white">Sagen Sie uns, wo es klemmt.</h2>
          <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#b3d6e2]">
            Dreißig Minuten, ehrliche Einschätzung, kein Verkaufsgespräch. Wenn
            wir nicht die Richtigen für Sie sind, sagen wir Ihnen das — und
            meistens auch, wer es ist.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Button href="#termin" variant="dark" withArrow className="bg-accent text-[#001620] hover:bg-[#c79a5c]">
              Erstgespräch buchen
            </Button>
            <a
              href="tel:+4921115847697"
              className="inline-flex items-center gap-2.5 rounded-[10px] border border-[#075c78] bg-[#002e3d] px-7 py-4 text-[16px] font-medium tracking-[-0.01em] text-white transition-colors hover:border-[#0a6a86] hover:bg-[#013a4d]"
            >
              <Phone className="size-[18px]" strokeWidth={1.8} />
              0211 15847697
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[13px] text-white/60">
            {TAGS.map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
