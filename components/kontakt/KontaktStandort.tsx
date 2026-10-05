"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT, mapsEmbedUrl, mapsRouteUrl, mapsSearchUrl } from "@/lib/contact";
import { SectionHead } from "../branche/ui";

/* Google Maps only loads after consent ("Funktional" in the cookie banner) or an
   explicit click — until then an illustrated map stands in, so nothing is sent to Google. */
function hasMapConsent() {
  try {
    const c = JSON.parse(localStorage.getItem("tt-cookie-consent") || "null");
    return c?.functional === true;
  } catch {
    return false;
  }
}

const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};

/* deterministic street grid for the placeholder */
const STREETS = [
  "M-20 120 C 180 100, 320 150, 520 118 S 860 80, 1020 110",
  "M-20 300 C 200 280, 380 330, 560 300 S 880 260, 1020 290",
  "M-20 420 C 220 440, 420 400, 620 430 S 900 460, 1020 440",
  "M140 -20 C 160 120, 120 260, 150 380 S 180 520, 170 600",
  "M380 -20 C 400 140, 360 240, 400 360 S 430 500, 420 600",
  "M640 -20 C 620 120, 670 240, 640 380 S 610 520, 630 600",
  "M860 -20 C 880 140, 840 280, 870 400 S 900 520, 890 600",
];
const MINOR = [
  "M-20 200 L 1020 215",
  "M-20 360 L 1020 372",
  "M-20 520 L 1020 505",
  "M260 -20 L 275 600",
  "M520 -20 L 505 600",
  "M760 -20 L 772 600",
  "M60 40 L 980 560",
];

function MapPlaceholder({ onLoad }: { onLoad: () => void }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#efece6]">
      <svg viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* Rhine */}
        <path d="M-40 520 C 120 470, 180 380, 120 260 S 60 60, 160 -40" fill="none" stroke="#d7e4e8" strokeWidth="64" strokeLinecap="round" />
        {/* parks */}
        <rect x="690" y="140" width="150" height="110" rx="18" fill="#e3e8da" />
        <rect x="290" y="440" width="170" height="90" rx="18" fill="#e3e8da" />
        <circle cx="560" cy="60" r="46" fill="#e3e8da" />
        {MINOR.map((d, i) => (
          <path key={`m${i}`} d={d} fill="none" stroke="#f8f6f2" strokeWidth="7" />
        ))}
        {STREETS.map((d, i) => (
          <path key={`s${i}`} d={d} fill="none" stroke="#ffffff" strokeWidth="14" strokeLinecap="round" />
        ))}
      </svg>
      {/* pin */}
      <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-full">
        <span className="absolute bottom-0 left-1/2 size-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#d1aa71]/50 animate-[ktPin_2.4s_ease-out_infinite]" />
        <span className="absolute bottom-0 left-1/2 size-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#d1aa71]/50 animate-[ktPin_2.4s_1.2s_ease-out_infinite]" />
        <div className="relative flex flex-col items-center">
          <span className="mb-2 whitespace-nowrap rounded-full bg-[#0f0e0d] px-3.5 py-1.5 font-display text-[13px] font-medium tracking-[-0.02em] text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)]">
            TyloTech · {CONTACT.street}
          </span>
          <span className="grid size-11 place-items-center rounded-full border-[3px] border-white bg-[linear-gradient(180deg,#e2c08c,#b4894d)] text-white shadow-[0_10px_24px_-8px_rgba(148,113,63,0.8)]">
            <MapPin className="size-5" strokeWidth={2} />
          </span>
        </div>
      </div>
      {/* load */}
      <div className="absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-[18px] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_-18px_rgba(8,34,44,0.4)] backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <p className="flex-1 text-[13px] leading-[20px] text-[#5c5954]">
          Die interaktive Karte wird von Google Maps geladen. Dabei werden Daten an Google übertragen.
        </p>
        <button
          type="button"
          onClick={onLoad}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#002e3d] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#013a4d]"
        >
          <MapPin className="size-4" strokeWidth={1.8} />
          Karte laden
        </button>
      </div>
    </div>
  );
}

export default function KontaktStandort() {
  const root = useRef<HTMLElement>(null);
  const [clicked, setClicked] = useState(false);
  const [ready, setReady] = useState(false);
  const consented = useSyncExternalStore(subscribeStorage, hasMapConsent, () => false);
  const load = clicked || consented;

  useGSAP(
    () => {
      const st = { trigger: ".ks-grid", start: "top 82%", toggleActions: "play none none none" };
      gsap.from(".bh-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".bh-head", start: "top 85%", toggleActions: "play none none none" } });
      gsap.from(".ks-map", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st });
      gsap.from(".ks-info > *", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.15, clearProps: "transform,opacity", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section id="standort" ref={root} className="scroll-mt-20 bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <SectionHead icon="map-pin" eyebrow="Standort" title="Mitten in _Düsseldorf._" sub="Unser Büro in der Behrenstraße. Ruf an, schreib uns oder plan direkt deine Route." />
        <div className="ks-grid grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="ks-map relative h-[380px] overflow-hidden rounded-[24px] border border-[#e2e0dc] bg-[#efece6] shadow-[0_7px_20px_rgba(8,34,44,0.06),0_23px_36px_rgba(8,34,44,0.05)] sm:h-[460px] sm:rounded-[28px] lg:h-auto lg:min-h-[480px]">
            {load ? (
              <>
                <iframe
                  title="TyloTech auf Google Maps"
                  src={mapsEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setReady(true)}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.25] transition-opacity duration-700"
                  style={{ opacity: ready ? 1 : 0 }}
                />
                {!ready && <div className="absolute inset-0 animate-pulse bg-[#efece6]" />}
              </>
            ) : (
              <MapPlaceholder onLoad={() => setClicked(true)} />
            )}
          </div>

          <div className="ks-info flex flex-col gap-5">
            <div className="flex flex-col gap-5 rounded-[24px] border border-[#eeedea] bg-white p-7 shadow-[0_1px_2px_rgba(8,34,44,0.04),0_2px_6px_rgba(8,34,44,0.06)] sm:p-8">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/tylotech-mark.svg" alt="" className="h-9 w-[29px]" />
                <div>
                  <p className="font-display text-[19px] font-semibold leading-6 tracking-[-0.02em] text-[#1a1917]">TyloTech</p>
                  <p className="text-[13px] leading-5 text-[#7d7973]">Marketing × Digitalisierung</p>
                </div>
              </div>
              <div className="h-px bg-[#eeedea]" />
              <address className="flex flex-col gap-4 not-italic">
                <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-3.5">
                  <MapPin className="mt-0.5 size-[18px] shrink-0 text-[#b4894d]" strokeWidth={1.8} />
                  <span className="text-[15px] leading-[23px] text-[#1a1917] transition-colors group-hover:text-[#94713f]">
                    {CONTACT.street}
                    <br />
                    {CONTACT.city}
                  </span>
                </a>
                <a href={CONTACT.phoneHref} className="group flex items-center gap-3.5">
                  <Phone className="size-[18px] shrink-0 text-[#b4894d]" strokeWidth={1.8} />
                  <span className="text-[15px] text-[#1a1917] transition-colors group-hover:text-[#94713f]">{CONTACT.phone}</span>
                </a>
                <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-3.5">
                  <Mail className="size-[18px] shrink-0 text-[#b4894d]" strokeWidth={1.8} />
                  <span className="text-[15px] text-[#1a1917] transition-colors group-hover:text-[#94713f]">{CONTACT.email}</span>
                </a>
              </address>
            </div>

            <a
              href={mapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[58px] items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] text-[16px] font-medium tracking-[-0.1px] text-[#0f0e0d] shadow-[0_4px_14px_rgba(168,127,69,0.32),0_10px_28px_rgba(168,127,69,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate] duration-200 hover:brightness-105 active:translate-y-px"
            >
              <Navigation className="size-[18px]" strokeWidth={1.9} />
              Route planen
            </a>
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-[rgba(8,34,44,0.08)] bg-white/[0.72] text-[15px] font-medium text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05),0_4px_12px_rgba(8,34,44,0.07),inset_0_1px_1px_rgba(255,255,255,0.7)] transition-colors hover:bg-white"
            >
              In Google Maps öffnen
              <ExternalLink className="size-4 text-[#7d7973]" strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
