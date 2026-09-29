"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Hammer,
  MapPin,
  ShoppingCart,
  Building2,
  TrendingUp,
} from "lucide-react";
import Container from "./ui/Container";

const INDUSTRIES = [
  { label: "Handwerk", icon: Hammer },
  { label: "Lokale Dienstleister", icon: MapPin },
  { label: "E-Commerce", icon: ShoppingCart },
  { label: "B2B-Dienstleistung", icon: Building2 },
  { label: "Finanz & Investment", icon: TrendingUp },
];

const LINKS = [
  { label: "Was wir machen", href: "#branchen", dropdown: true },
  { label: "Portfolio", href: "#referenzen" },
  { label: "TyloHQ", href: "#tylohq" },
  { label: "Über uns", href: "#team" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-page transition-[box-shadow,border-color] duration-300 ${
        scrolled || open
          ? "border-line shadow-[0_1px_20px_-10px_rgba(15,14,13,0.3)]"
          : "border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="#top" className="flex items-center" onClick={() => setOpen(false)}>
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
          {LINKS.map((l) =>
            l.dropdown ? (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href={l.href}
                  className="flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] font-medium tracking-[-0.1px] text-[#5c5954] transition-colors hover:bg-ink/[0.04] hover:text-ink"
                >
                  {l.label}
                  <ChevronDown
                    className={`size-[15px] text-ink/45 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </Link>

                <div
                  className={`absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-[opacity,transform] duration-200 ${
                    dropdownOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="w-[240px] rounded-[16px] border border-line bg-white p-2 shadow-[0_12px_40px_-12px_rgba(15,14,13,0.2)]">
                    <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink/35">
                      Online-Dienstleistung
                    </p>
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      return (
                        <Link
                          key={ind.label}
                          href="#branchen"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[14px] font-medium text-[#5c5954] transition-colors hover:bg-ink/[0.04] hover:text-ink"
                        >
                          <Icon className="size-4 text-accent" strokeWidth={1.8} />
                          {ind.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] font-medium tracking-[-0.1px] text-[#5c5954] transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                {l.label}
              </Link>
            ),
          )}
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
            className="group hidden h-12 items-center gap-2 rounded-xl bg-[#002e3d] px-[22px] text-[16px] font-medium tracking-[-0.1px] text-inverse transition-colors hover:bg-[#013a4d] sm:inline-flex"
          >
            Jetzt anfragen
            <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-xl border border-line text-ink transition-colors hover:bg-ink/[0.04] lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-t border-line bg-page transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="flex flex-col gap-1 py-4">
          {LINKS.map((l) =>
            l.dropdown ? (
              <div key={l.label}>
                <button
                  type="button"
                  onClick={() => setMobileDropdownOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-[16px] font-medium tracking-[-0.1px] text-[#43413d] transition-colors hover:bg-ink/[0.04] hover:text-ink"
                >
                  {l.label}
                  <ChevronDown
                    className={`size-[16px] text-ink/40 transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    mobileDropdownOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden pb-2 pl-4">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      return (
                        <Link
                          key={ind.label}
                          href="#branchen"
                          onClick={() => { setOpen(false); setMobileDropdownOpen(false); }}
                          className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#5c5954] transition-colors hover:bg-ink/[0.04]"
                        >
                          <Icon className="size-4 text-accent" strokeWidth={1.8} />
                          {ind.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[16px] font-medium tracking-[-0.1px] text-[#43413d] transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                {l.label}
              </Link>
            ),
          )}
          <div className="mt-2 flex flex-col gap-2.5 border-t border-line pt-4">
            <Link
              href="#login"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center rounded-xl border border-line text-[16px] font-medium text-[#43413d] transition-colors hover:bg-ink/[0.04]"
            >
              Kunden-Login
            </Link>
            <Link
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#002e3d] text-[16px] font-medium text-inverse transition-colors hover:bg-[#013a4d]"
            >
              Jetzt anfragen
              <ArrowRight className="size-[18px]" />
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
