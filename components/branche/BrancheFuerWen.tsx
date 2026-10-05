"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import type { Branche } from "@/lib/branchen";
import { SectionHead } from "./ui";

/* Tailwind needs literal class names for each row width */
const COLS: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4" };

export default function BrancheFuerWen({ b }: { b: Branche }) {
  const root = useRef<HTMLElement>(null);
  const f = b.fuerWen;

  useGSAP(
    () => {
      const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });
      gsap.from(".bh-head > *", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".bh-head") });
      gsap.from(".bhf-tile", { y: 36, opacity: 0, scale: 0.97, duration: 0.8, ease: "power3.out", stagger: 0.08, clearProps: "transform,opacity", scrollTrigger: st(".bhf-grid") });
    },
    { scope: root },
  );

  // split tiles into Figma's rows
  const rows: typeof f.tiles[] = [];
  let k = 0;
  for (const n of f.rows) {
    rows.push(f.tiles.slice(k, k + n));
    k += n;
  }

  return (
    <section ref={root} className="bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container className="flex flex-col gap-12 lg:gap-14">
        <SectionHead icon={f.icon} eyebrow="Für wen genau" title={f.title} sub={f.sub} />
        <div className="bhf-grid flex flex-col gap-5">
          {rows.map((row, ri) => (
            <div key={ri} className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2", COLS[row.length])}>
              {row.map((t) => (
                <a
                  key={t.label}
                  href="#kontakt"
                  className="bhf-tile group relative flex h-[220px] flex-col justify-end overflow-hidden rounded-[18px] bg-[#1a1917] px-[22px] pb-5 sm:h-[268px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,13,10,0)_0%,rgba(15,13,10,0.35)_50%,rgba(15,13,10,0.88)_100%)] transition-opacity duration-500 group-hover:opacity-90" />
                  <span className="relative flex items-center gap-3">
                    <span className="flex-1 font-display text-[18px] font-semibold leading-[25px] tracking-[-0.02em] text-[#faf8f5]">{t.label}</span>
                    <span className="grid size-[34px] shrink-0 translate-y-1 place-items-center rounded-full bg-white/[0.14] text-white opacity-0 backdrop-blur transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-4" strokeWidth={2} />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
