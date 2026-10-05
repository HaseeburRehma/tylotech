"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Hammer,
  MapPin,
  ShoppingCart,
  Building2,
  TrendingUp,
  Globe,
} from "lucide-react";
import Container from "./ui/Container";
import { TYLOHQ_URL } from "@/lib/site";

const INDUSTRIES = [
  { label: "Online-Dienstleistungen", icon: Globe, href: "/branchen/online-dienstleistungen" },
  { label: "Handwerk", icon: Hammer, href: "/branchen/handwerk" },
  { label: "Lokale Dienstleister", icon: MapPin, href: "/branchen/lokale-dienstleister" },
  { label: "E-Commerce", icon: ShoppingCart, href: "/branchen/e-commerce" },
  { label: "B2B-Dienstleistung", icon: Building2, href: "/branchen/b2b-dienstleistung" },
  { label: "Finanz & Investment", icon: TrendingUp, href: "/branchen/finanz-investment" },
];

const LINKS = [
  { label: "Branchen", href: "#branchen", dropdown: true },
  { label: "Portfolio", href: "#referenzen" },
  { label: "TyloHQ", href: "#tylohq-app" },
  { label: "TyloLens", href: "#tylolens", lens: true },
  { label: "Über uns", href: "#gruender", everywhere: true },
  { label: "Kontakt", href: "/kontakt", everywhere: true },
];

/** TyloLens modal lives in <TyloLens /> (root layout); the menu just asks it to open. */
const openLens = () => window.dispatchEvent(new CustomEvent("tylolens:open", { detail: { source: "menu" } }));

export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  // anchors that only exist on the home page need the "/" prefix elsewhere
  const to = (l: { href: string; everywhere?: boolean }) => (home || l.everywhere ? l.href : `/${l.href}`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
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
    const darkSections = document.querySelectorAll<HTMLElement>("[data-nav-dark]");
    if (!darkSections.length) return;
    const active = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        }
        setDark(active.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    darkSections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ease-in-out ${
        dark
          ? "bg-[#001620] border-white/10 shadow-[0_1px_20px_-10px_rgba(0,0,0,0.6)]"
          : `bg-page ${
              scrolled || open
                ? "border-line shadow-[0_1px_20px_-10px_rgba(15,14,13,0.3)]"
                : "border-transparent"
            }`
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href={home ? "#top" : "/"} className="flex items-center" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/tylotech-logo.svg"
            alt="TyloTech"
            width={138}
            height={35}
            className="h-[35px] w-auto"
            style={{
              filter: dark ? "brightness(0) invert(1)" : "none",
              transition: "filter 0.5s ease-in-out",
            }}
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {LINKS.map((l) => {
            const linkCls = `flex h-10 items-center gap-1.5 whitespace-nowrap rounded-[10px] px-2.5 text-[14px] font-medium tracking-[-0.1px] xl:px-3.5 xl:text-[15px] transition-colors duration-500 ${
              dark
                ? "text-white/70 hover:bg-white/[0.06] hover:text-white"
                : "text-[#5c5954] hover:bg-ink/[0.04] hover:text-ink"
            }`;
            return l.dropdown ? (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <Link href={to(l)} className={linkCls}>
                  {l.label}
                  <ChevronDown
                    className={`size-[15px] transition-transform duration-200 ${dark ? "text-white/40" : "text-ink/45"} ${dropdownOpen ? "rotate-180" : ""}`}
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
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      return (
                        <Link
                          key={ind.label}
                          href={ind.href}
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
            ) : "lens" in l ? (
              <button
                key={l.label}
                type="button"
                onClick={openLens}
                className={`flex h-10 items-center whitespace-nowrap rounded-[10px] px-2.5 text-[14px] font-extrabold tracking-[-0.2px] transition-colors duration-500 xl:px-3.5 xl:text-[15px] ${
                  dark ? "text-[#D4A863] hover:bg-white/[0.06] hover:text-[#e2bd80]" : "text-[#A8863A] hover:bg-[rgba(212,168,99,0.12)] hover:text-[#8f7130]"
                }`}
              >
                {l.label}
              </button>
            ) : (
              <Link key={l.label} href={to(l)} className={linkCls}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={TYLOHQ_URL}
            target="_blank"
            rel="noopener"
            title="Zum Kundenportal TyloHQ"
            className={`group hidden h-12 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-[15px] font-medium tracking-[-0.1px] transition-colors duration-500 md:flex xl:px-[18px] xl:text-[16px] ${
              dark
                ? "text-white/70 hover:bg-white/[0.06] hover:text-white"
                : "text-[#43413d] hover:bg-ink/[0.04]"
            }`}
          >
            Kunden-Login
            <ArrowUpRight className="size-4 opacity-50 transition-[opacity,translate] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" strokeWidth={1.9} />
          </a>
          <Link
            href="/kontakt"
            className={`group hidden h-12 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-[15px] font-medium tracking-[-0.1px] transition-colors duration-500 sm:inline-flex xl:px-[22px] xl:text-[16px] ${
              dark
                ? "bg-accent text-[#001620] hover:bg-[#ddb97e]"
                : "bg-[#002e3d] text-inverse hover:bg-[#013a4d]"
            }`}
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
            className={`grid size-11 place-items-center rounded-xl border transition-colors duration-500 lg:hidden ${
              dark
                ? "border-white/15 text-white hover:bg-white/[0.06]"
                : "border-line text-ink hover:bg-ink/[0.04]"
            }`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-t transition-[max-height,opacity,background-color,border-color] duration-300 lg:hidden ${
          dark ? "border-white/10 bg-[#001620]" : "border-line bg-page"
        } ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
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
                          href={ind.href}
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
            ) : "lens" in l ? (
              <button
                key={l.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  openLens();
                }}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-[16px] font-extrabold tracking-[-0.2px] text-[#A8863A] transition-colors hover:bg-[rgba(212,168,99,0.12)]"
              >
                {l.label}
                <span className="rounded-full bg-[rgba(212,168,99,0.16)] px-2.5 py-1 text-[11px] font-semibold text-[#8f7130]">Gratis-Analyse</span>
              </button>
            ) : (
              <Link
                key={l.label}
                href={to(l)}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[16px] font-medium tracking-[-0.1px] text-[#43413d] transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                {l.label}
              </Link>
            ),
          )}
          <div className="mt-2 flex flex-col gap-2.5 border-t border-line pt-4">
            <a
              href={TYLOHQ_URL}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-line text-[16px] font-medium text-[#43413d] transition-colors hover:bg-ink/[0.04]"
            >
              Kunden-Login
              <ArrowUpRight className="size-4 opacity-60" strokeWidth={1.9} />
            </a>
            <Link
              href="/kontakt"
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
