"use client";

import { useRef, useState } from "react";
import { Monitor } from "lucide-react";
import Container from "../ui/Container";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Item = { t: string; b: string; img: string; tint: string };

const ITEMS: Item[] = [
  {
    t: "Ein Ansprechpartner statt drei Dienstleister",
    b: "Eine Person, die Ihr Projekt kennt — statt drei Verträge, die aufeinander zeigen.",
    img: "/wechsel/01.jpg",
    tint: "from-[#e8ddcb] to-[#d6c3a3]",
  },
  {
    t: "Ein Plan, bevor irgendetwas gebaut wird",
    b: "Erst Klarheit über Ziel, Zielgruppe und Weg — dann Umsetzung. Nicht umgekehrt.",
    img: "/wechsel/02.jpg",
    tint: "from-[#dde3e6] to-[#c4cfd4]",
  },
  {
    t: "Auftritt und Kampagne entstehen zusammen",
    b: "Website, Anzeigen und Prozesse entstehen im selben Team und im selben Zeitraum. Keine Übergabe, bei der die Hälfte verloren geht.",
    img: "/wechsel/03.jpg",
    tint: "from-[#e6dcc7] to-[#cdb78a]",
  },
  {
    t: "Zahlen in Echtzeit statt im Quartalsbericht",
    b: "Sie sehen jederzeit, was läuft — nicht erst, wenn das Quartal vorbei ist.",
    img: "/wechsel/04.jpg",
    tint: "from-[#dfe1dc] to-[#c6cabf]",
  },
  {
    t: "Änderungen in Tagen statt in Quartalen",
    b: "Was angepasst werden muss, wird angepasst — ohne Ticket-Warteschlange.",
    img: "/wechsel/05.jpg",
    tint: "from-[#e9dfce] to-[#d3c1a1]",
  },
  {
    t: "Derselbe Ansprechpartner nach dem Launch",
    b: "Nach dem Go-live bleibt, wer Sie kennt. Kein Wechsel in ein anonymes Support-Team.",
    img: "/wechsel/06.jpg",
    tint: "from-[#dde4e4] to-[#c3d0cf]",
  },
  {
    t: "Alle Zugänge gehören Ihnen, von Anfang an",
    b: "Konten, Daten und Code laufen auf Ihren Namen. Sie sind nie abhängig von uns.",
    img: "/wechsel/07.jpg",
    tint: "from-[#e7ddc9] to-[#d0be9c]",
  },
];

const STEPS = ITEMS.length;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Wechsel() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lastIdx = useRef(0);
  const lockUntil = useRef(0);

  const setFromProgress = (p: number) => {
    if (performance.now() < lockUntil.current) return;
    const idx = Math.min(STEPS - 1, Math.max(0, Math.floor(p * STEPS)));
    if (idx !== lastIdx.current) {
      lastIdx.current = idx;
      setActive(idx);
    }
  };

  const pick = (i: number) => {
    lastIdx.current = i;
    lockUntil.current = performance.now() + 800; // hold selection briefly
    setActive(i);
  };

  useGSAP(
    () => {
      gsap.from(".wx-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".wx-head", start: "top 82%" },
      });

      // Scroll drives the active step. Desktop pins (tall section + sticky
      // panel); mobile maps the section's own scroll-through to the steps.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (s) => setFromProgress(s.progress),
        });
        return () => st.kill();
      });
      mm.add("(max-width: 1023.98px)", () => {
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top 78%",
          end: "bottom 30%",
          onUpdate: (s) => setFromProgress(s.progress),
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  const pct = (active / (STEPS - 1)) * 100;

  return (
    <section
      id="wechsel"
      ref={root}
      className="relative bg-page lg:h-[350vh]"
    >
      <div className="py-16 sm:py-20 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <Container className="w-full">
          {/* heading */}
          <div className="wx-head max-w-[760px]">
            <p className="eyebrow mb-4 flex items-center gap-2.5 text-[#94713f]">
              <span className="size-[7px] rounded-[2px] bg-accent" />
              Der Wechsel
            </p>
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink">
              Zwei Zustände.{" "}
              <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                Dazwischen liegt die Arbeit.
              </span>
            </h2>
          </div>

          <div className="mt-9 grid gap-9 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
            {/* list + progress */}
            <div className="order-2 lg:order-1">
              <ul className="relative">
                {ITEMS.map((it, i) => {
                  const on = active === i;
                  return (
                    <li key={i} className="relative">
                      <span
                        className={`pointer-events-none absolute left-0 top-0 h-full w-[2px] origin-top bg-accent transition-transform duration-300 ${
                          on ? "scale-y-100" : "scale-y-0"
                        }`}
                      />
                      <button
                        type="button"
                        aria-current={on}
                        onClick={() => pick(i)}
                        className="flex w-full items-start gap-4 border-t border-line py-3.5 pl-4 pr-2 text-left lg:py-4"
                      >
                        <span
                          className={`mt-1 font-mono text-[12px] transition-colors ${
                            on ? "text-[#a07d45]" : "text-ink/35"
                          }`}
                        >
                          {pad(i + 1)}
                        </span>
                        <span className="flex-1">
                          <span
                            className={`block text-[clamp(15px,1.15vw,17px)] tracking-[-0.1px] transition-colors ${
                              on ? "font-semibold text-ink" : "text-ink/65"
                            }`}
                          >
                            {it.t}
                          </span>
                          <span
                            className={`grid transition-[grid-template-rows,opacity,margin] duration-[400ms] ease-out ${
                              on
                                ? "mt-1.5 grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <span className="overflow-hidden">
                              <span className="block max-w-[460px] text-[13.5px] leading-[1.55] text-ink/55">
                                {it.b}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                <li className="border-t border-line" />
              </ul>

              {/* progress */}
              <div className="mt-7 flex items-center gap-4">
                <span className="font-mono text-[13px] tracking-[0.08em] text-ink/55">
                  {pad(active + 1)}
                  <span className="text-ink/30"> / {pad(STEPS)}</span>
                </span>
                <div className="relative h-[3px] w-[200px] max-w-[50%] rounded-full bg-line">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-300 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                  <span
                    className="absolute top-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-page shadow-[0_1px_4px_rgba(160,125,69,0.5)] transition-[left] duration-300 ease-out"
                    style={{ left: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* image */}
            <div className="order-1 lg:order-2">
              <div className="rounded-[24px] bg-white/60 p-4 shadow-[0_30px_70px_-40px_rgba(15,14,13,0.28)] ring-1 ring-line/70 sm:p-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-line">
                  {ITEMS.map((it, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 transition-opacity duration-500 ease-out"
                      style={{ opacity: active === i ? 1 : 0 }}
                      aria-hidden={active !== i}
                    >
                      <div
                        className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${it.tint}`}
                      >
                        <Monitor
                          className="size-20 text-white/40"
                          strokeWidth={1}
                        />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={it.img}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
