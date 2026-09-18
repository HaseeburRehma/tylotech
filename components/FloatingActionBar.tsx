"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import PartnerLogo from "./PartnerLogo";
import { FLOATING_PARTNERS } from "@/lib/partners";
import { gsap, useGSAP } from "@/lib/gsap";

const AVATARS = [
  { src: "/avatars/tt.png", alt: "Team TT" },
  { src: "/avatars/mk.png", alt: "Team MK" },
  { src: "/avatars/sa.png", alt: "Team SA" },
];

export default function FloatingActionBar() {
  const bar = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Endless logo strip.
      if (track.current) {
        gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          duration: 18,
          repeat: -1,
        });
      }
    },
    { scope: bar },
  );

  // Slide in from below once the hero has scrolled away — a scroll-position
  // listener is more robust than a ScrollTrigger crossing (survives the tab
  // being backgrounded / rAF being frozen).
  useEffect(() => {
    gsap.set(bar.current, { yPercent: 160, opacity: 0 });
    let shown = false;
    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.75;
      if (show === shown) return;
      shown = show;
      gsap.to(bar.current, {
        yPercent: show ? 0 : 160,
        opacity: show ? 1 : 0,
        duration: 0.6,
        ease: show ? "power3.out" : "power2.in",
        overwrite: true,
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div
        ref={bar}
        className="pointer-events-auto flex items-center gap-3.5 rounded-full border border-[#01475c] bg-[#002e3d] py-2 pl-5 pr-2 shadow-[0px_8px_16px_-4px_rgba(15,14,13,0.05),0px_32px_64px_-16px_rgba(15,14,13,0.10)]"
      >
        {/* Logo slider */}
        <div className="relative hidden h-[26px] w-[210px] overflow-hidden lg:block">
          <div ref={track} className="absolute left-0 top-0 flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-7 pr-7"
                aria-hidden={copy === 1}
              >
                {FLOATING_PARTNERS.map((p) => (
                  <PartnerLogo key={p.name} partner={p} tint="#7fbacd" scale={0.68} />
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#002e3d] to-transparent" />
        </div>

        {/* Divider */}
        <span className="hidden h-6 w-px bg-[#01475c] lg:block" />

        {/* CTA */}
        <Link
          href="#kontakt"
          className="flex h-11 items-center justify-center rounded-full bg-accent px-5 text-[14.5px] font-medium text-white transition-colors hover:bg-[#c79a5c]"
        >
          Jetzt anfragen
        </Link>

        {/* Termin pill */}
        <Link
          href="#termin"
          className="group flex h-11 items-center gap-3 rounded-full bg-white pl-2 pr-1.5"
        >
          <span className="flex items-center">
            {AVATARS.map((a, i) => (
              <span
                key={a.src}
                className="relative size-[30px] rounded-full border-2 border-white"
                style={{ marginRight: i < AVATARS.length - 1 ? -11 : 0, zIndex: 3 - i }}
              >
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  sizes="30px"
                  className="rounded-full object-cover"
                />
              </span>
            ))}
          </span>
          <span className="text-[14.5px] font-medium text-ink">
            Erstgespräch buchen
          </span>
          <span className="grid size-8 place-items-center rounded-full bg-accent">
            <ArrowUpRight className="size-4 text-[#001620] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </Link>
      </div>
    </div>
  );
}
