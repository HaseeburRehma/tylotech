import Link from "next/link";
import { MapPin, Mail, Phone, Camera, Play, X } from "lucide-react";
import Container from "./ui/Container";
import MosaicBackdrop from "./MosaicBackdrop";

const COLS = [
  {
    title: "Leistungen",
    links: [
      "Digitale Lösungen",
      "Marketing & Performance",
      "Unternehmensaufbau",
      "Neue Technologien",
      "Cloud & Infrastruktur",
      "Enterprise Services",
    ],
  },
  {
    title: "Unternehmen",
    links: ["Über uns", "Portfolio", "TyloHQ", "Karriere", "Kontakt"],
  },
  {
    title: "Rechtliches",
    links: ["Impressum", "Datenschutzerklärung", "AGB", "Cookie-Einstellungen"],
  },
];

const CONTACT = [
  { icon: MapPin, text: "Beispielstraße 4, 40233 Düsseldorf" },
  { icon: Mail, text: "info@tylotech.de", href: "mailto:info@tylotech.de" },
  { icon: Phone, text: "0211 15847697", href: "tel:+4921115847697" },
  { icon: Phone, text: "+49 173 6202766", href: "tel:+491736202766" },
];

const BOTTOM_TAGS = ["Made in Germany", "DSGVO-konform", "Hosting in Deutschland"];

function Social({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Link
      href="#"
      aria-label={label}
      className="grid size-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#001620] pb-8 pt-16 text-white">
      <MosaicBackdrop fade="radial-gradient(100% 120% at 50% 0%, #000 35%, transparent 82%)" />

      <Container className="relative">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="#top" className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tylotech-logo-dark.svg"
                alt="TyloTech"
                width={150}
                height={38}
                className="h-[38px] w-auto"
              />
            </Link>
            <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-[#7fbacd]">
              Marketing, Software &amp; Digitalisierung aus einer Hand. Klar,
              direkt, ohne Kompromisse.
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

            <div className="mt-6 flex gap-2.5">
              <Social label="LinkedIn">
                <span className="text-[12px] font-bold">in</span>
              </Social>
              <Social label="Instagram">
                <Camera className="size-4" strokeWidth={1.8} />
              </Social>
              <Social label="YouTube">
                <Play className="size-4" strokeWidth={1.8} />
              </Social>
              <Social label="Facebook">
                <span className="text-[13px] font-bold">f</span>
              </Social>
              <Social label="X">
                <X className="size-4" strokeWidth={2} />
              </Social>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4 text-white/45">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-white/50 md:flex-row">
          <p>© 2026 TyloTech · Alle Rechte vorbehalten</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {BOTTOM_TAGS.map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
