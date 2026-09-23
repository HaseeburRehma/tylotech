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
  const paused = useRef(false);
  const lastInteract = useRef(0);

  // Center a card by scrolling only the strip — never the page.
  const scrollToCard = (i: number, smooth = true) => {
    const sc = scroller.current;
    const el = cards.current[i];
    if (!sc || !el) return;
    const scRect = sc.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const delta = elRect.left + elRect.width / 2 - (scRect.left + scRect.width / 2);
    sc.scrollTo({ left: sc.scrollLeft + delta, behavior: smooth ? "smooth" : "auto" });
  };

  const go = (i: number) => {
    lastInteract.current = Date.now();
    setActive(i);
    scrollToCard(i);
  };

  // center the featured card on mount, without animating the page
  useEffect(() => {
    scrollToCard(2, false);
  }, []);

  // Auto-advance the slider while the section is visible; pause on hover and
  // for a few seconds after any manual interaction. Honors reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0.25 },
    );
    const node = root.current;
    if (node) io.observe(node);

    const id = setInterval(() => {
      if (!visible || paused.current) return;
      if (Date.now() - lastInteract.current < 4500) return;
      setActive((prev) => {
        const next = (prev + 1) % MEMBERS.length;
        scrollToCard(next);
        return next;
      });
    }, 3400);

    return () => {
      clearInterval(id);
      io.disconnect();
    };
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

      // Avatar selector rises in as a unit (its buttons carry an opacity class,
      // so animating the row container keeps GSAP off that conflict).
      gsap.from(".team-avatars", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: ".team-avatars", start: "top 92%" },
      });

      // The whole card strip rises into view (animating the scroller, not the
      // cards, keeps the active-card scale transform untouched).
      gsap.from(".team-carousel", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".team-carousel", start: "top 88%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="team" ref={root} className="overflow-hidden bg-[#001620] py-24 text-white">
      <Container>
        <div className="team-head mx-auto max-w-[880px] text-center">
          <p className="eyebrow mb-6 flex items-center justify-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Team
          </p>
          <h2 className="display-l text-white">Die Menschen, mit denen Sie arbeiten.</h2>
          <p className="mx-auto mt-6 max-w-[620px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#b3d6e2]">
            Kein Account-Manager, der weiterleitet. Sie sprechen direkt mit den
            Leuten, die an Ihrem Projekt bauen.
          </p>
        </div>

        {/* Avatar selector */}
        <div className="team-avatars mt-10 flex justify-center gap-3.5">
          {MEMBERS.map((m, i) => (
            <button
              key={m.name}
              onClick={() => go(i)}
              aria-label={m.name}
              className={`team-avatar size-12 overflow-hidden rounded-full border-2 transition-[border-color,opacity] ${
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
        onPointerEnter={() => {
          paused.current = true;
        }}
        onPointerLeave={() => {
          paused.current = false;
        }}
        className="team-carousel no-scrollbar mt-8 flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[calc(50%-150px)] py-10"
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
                ? "z-10 scale-[1.15] ring-[1.5px] ring-accent shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)]"
                : "scale-[0.94] opacity-90"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.img} alt={m.name} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-[#001620]/0 to-[#001620]/[0.88]" />
            {active !== i && (
              <div className="absolute inset-0 bg-[#001620]/55 transition-opacity" />
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
