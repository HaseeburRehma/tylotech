"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import Container from "./ui/Container";

const LINKS = [
  { label: "Was wir machen", href: "#leistungen", caret: true },
  { label: "Portfolio", href: "#portfolio" },
  { label: "TyloHQ", href: "#tylohq" },
  { label: "Über uns", href: "#team" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-page transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-line shadow-[0_1px_20px_-10px_rgba(15,14,13,0.3)]"
          : "border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="#top" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/tylotech-logo.svg"
            alt="TyloTech"
            width={138}
            height={35}
            className="h-[35px] w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] font-medium tracking-[-0.1px] text-[#5c5954] transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              {l.label}
              {l.caret && <ChevronDown className="size-[15px] text-ink/45" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="#login"
            className="hidden h-12 items-center rounded-xl px-[18px] text-[16px] font-medium tracking-[-0.1px] text-[#43413d] transition-colors hover:bg-ink/[0.04] md:flex"
          >
            Kunden-Login
          </Link>
          <Link
            href="#kontakt"
            className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#002e3d] px-[22px] text-[16px] font-medium tracking-[-0.1px] text-inverse transition-colors hover:bg-[#013a4d]"
          >
            Jetzt anfragen
            <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </header>
  );
}
