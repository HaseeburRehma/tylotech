"use client";

import { useRef } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, ShieldCheck, Server, Quote } from "lucide-react";
import Container from "./ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const CONTACT = [
  { icon: MapPin, text: "Behrenstraße 4, 40233 Düsseldorf" },
  { icon: Mail, text: "info@tylotech.de", href: "mailto:info@tylotech.de" },
  { icon: Phone, text: "0211 15847097", href: "tel:+4921115847697" },
];

const TRUST = [
  { icon: MapPin, text: "Made in Germany" },
  { icon: ShieldCheck, text: "DSGVO-konform" },
  { icon: Server, text: "Hosting in Deutschland" },
];

const NAV = ["Konzept", "Leistungen", "Ergebnisse", "Über uns", "Kontakt"];
const MEHR = [
  "TyloTech HQ Login",
  "Impressum",
  "Datenschutz",
  "Cookie-Einstellungen",
  "Karriere",
];

const PARTNERS = [
  "/partners/cleanpany.png",
  "/partners/crusty-slices.png",
  "/partners/sanierungslotse.png",
  "/partners/rohrcleaner.png",
];

const SOCIALS: { label: string; path: string }[] = [
  {
    label: "LinkedIn",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0z",
  },
  {
    label: "Instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    label: "YouTube",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  {
    label: "Facebook",
    path: "M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z",
  },
  {
    label: "X",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23zm-1.16 17.52h1.83L7.01 4.13H5.03l12.05 15.64z",
  },
];

function Social({ label, path }: { label: string; path: string }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    </Link>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".footer-reveal", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 92%" },
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="border-t border-white/10 bg-[#04161d] pb-8 pt-16 text-white sm:pt-20"
    >
      <Container>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="footer-reveal">
            <Link href="#top" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tylotech-logo-dark.svg"
                alt="TyloTech"
                width={150}
                height={38}
                className="h-[36px] w-auto"
              />
            </Link>
            <p className="mt-5 font-display text-[18px] font-semibold tracking-[-0.01em] text-white">
              Wir bauen. Du wächst.
            </p>

            <ul className="mt-6 space-y-2.5">
              {CONTACT.map((c) => (
                <li key={c.text} className="flex items-center gap-2.5 text-[14px] text-white/70">
                  <c.icon className="size-4 shrink-0 text-[#7fbacd]" strokeWidth={1.7} />
                  {c.href ? (
                    <a href={c.href} className="transition-colors hover:text-white">
                      {c.text}
                    </a>
                  ) : (
                    <span>{c.text}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-white/50">
              {TRUST.map((t) => (
                <span key={t.text} className="flex items-center gap-1.5">
                  <t.icon className="size-3.5 text-accent" strokeWidth={1.8} />
                  {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* Quote + partners */}
          <div className="footer-reveal">
            <Quote className="size-7 fill-[#d8b682] text-[#d8b682]" strokeWidth={0} />
            <p className="mt-4 max-w-[340px] font-[family-name:var(--font-instrument)] text-[20px] italic leading-[1.4] text-white/90">
              „Building unique brands with unique people.“
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PARTNERS.map((src) => (
                <span
                  key={src}
                  className="grid h-11 w-[92px] place-items-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="max-h-6 w-auto max-w-full object-contain opacity-80"
                  />
                </span>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-white/45">
              Über 100 Projekte umgesetzt
            </p>
          </div>

          {/* Navigation */}
          <div className="footer-reveal">
            <p className="font-[family-name:var(--font-instrument)] text-[18px] italic text-[#d8b682]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-[14px] text-white/65 transition-colors hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mehr */}
          <div className="footer-reveal">
            <p className="font-[family-name:var(--font-instrument)] text-[18px] italic text-[#d8b682]">
              Mehr
            </p>
            <ul className="mt-4 space-y-2.5">
              {MEHR.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-[14px] text-white/65 transition-colors hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row">
          <div className="flex gap-2.5">
            {SOCIALS.map((s) => (
              <Social key={s.label} label={s.label} path={s.path} />
            ))}
          </div>
          <p className="text-center text-[13px] text-white/45 sm:text-right">
            © 2026 TyloTech. Building unique brands with unique people.
          </p>
        </div>
      </Container>
    </footer>
  );
}
