"use client";

import { useEffect, useRef, useState } from "react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

const MEMBERS = [
  { name: "Lena Brandt", role: "Geschäftsführung", img: "/team/lena-brandt.png" },
  { name: "Marc Hoffmann", role: "Performance Marketing", img: "/team/marc-hoffmann.png" },
  { name: "Aylin Demir", role: "UI/UX Design", img: "/team/aylin-demir.png" },
  { name: "Jonas Reiter", role: "Entwicklung", img: "/team/jonas-reiter.png" },
  { name: "Sabine Kraus", role: "Projektleitung", img: "/team/sabine-kraus.png" },
  { name: "David Ortmann", role: "SEO & Content", img: "/team/david-ortmann.png" },
];

export default function Team() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(2);

  const go = (i: number, smooth = true) => {
    setActive(i);
    cards.current[i]?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  };

  useEffect(() => {
    // center the featured card without animating the page
    cards.current[2]?.scrollIntoView({ inline: "center", block: "nearest" });
  }, []);

  useGSAP(
    () => {
      gsap.from(".team-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".team-head", start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="team" ref={root} className="overflow-hidden bg-page py-24">
      <Container>
        <div className="team-head mx-auto max-w-[880px] text-center">
          <p className="eyebrow mb-6 flex items-center justify-center gap-2.5 text-[#94713f]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Team
          </p>
          <h2 className="display-l text-ink">Die Menschen, mit denen Sie arbeiten.</h2>
          <p className="mx-auto mt-6 max-w-[620px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#5c5954]">
            Kein Account-Manager, der weiterleitet. Sie sprechen direkt mit den
            Leuten, die an Ihrem Projekt bauen.
          </p>
        </div>

        {/* Avatar selector */}
        <div className="mt-10 flex justify-center gap-3.5">
          {MEMBERS.map((m, i) => (
            <button
              key={m.name}
              onClick={() => go(i)}
              aria-label={m.name}
              className={`size-12 overflow-hidden rounded-full border-2 transition-all ${
                active === i
                  ? "border-accent"
                  : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.name} className="size-full object-cover" />
            </button>
          ))}
        </div>
      </Container>

      {/* Carousel */}
      <div
        ref={scroller}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50%-150px)] pb-4"
      >
        {MEMBERS.map((m, i) => (
          <div
            key={m.name}
            ref={(el) => {
              cards.current[i] = el;
            }}
            onClick={() => go(i)}
            className={`relative aspect-[300/420] w-[300px] shrink-0 cursor-pointer snap-center overflow-hidden rounded-[22px] transition-all duration-500 ${
              active === i
                ? "scale-[1.06] ring-[1.5px] ring-accent shadow-[0_32px_64px_-16px_rgba(15,14,13,0.18)]"
                : "scale-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.name} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-[#001620]/0 to-[#001620]/[0.88]" />
            {active !== i && (
              <div className="absolute inset-0 bg-page/50 transition-opacity" />
            )}
            <div className="absolute inset-x-6 bottom-9">
              <p className="font-display text-[20px] font-semibold leading-[26px] tracking-[-0.2px] text-white">
                {m.name}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[1.2px] text-[#d8b682]">
                {m.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
