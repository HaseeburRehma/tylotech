"use client";

import { useRef, useState } from "react";
import {
  Hammer,
  Sparkles,
  Utensils,
  GraduationCap,
  Users,
  House,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import Container from "../ui/Container";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Industry = {
  name: string;
  lead: string;
  accent: string;
  body: string;
  icon: LucideIcon;
  img: string;
  tint: string;
};

const INDUSTRIES: Industry[] = [
  {
    name: "Handwerk & Sanierung",
    lead: "Handwerk sichtbar machen,",
    accent: "Aufträge gewinnen.",
    body: "Sanierung, Rohrreinigung, Elektro. Betriebe, die Aufträge brauchen, keine Klicks. Wir bauen Auftritt, Anfragestrecke und Kampagnen so, dass der Kalender voll wird und nicht nur das Postfach.",
    icon: Hammer,
    img: "/branchen/01.jpg",
    tint: "from-[#e7d8c2] to-[#cba46f]",
  },
  {
    name: "Gebäudeservice & Reinigung",
    lead: "Planbare Anfragen,",
    accent: "statt Zufall.",
    body: "Von der Unterhaltsreinigung bis zur Glasreinigung. Wir sorgen für einen Auftritt und Abläufe, die konstant Anfragen bringen — auch dann, wenn Sie gerade selbst mit anpacken.",
    icon: Sparkles,
    img: "/branchen/02.jpg",
    tint: "from-[#d7e2e6] to-[#a9c2ca]",
  },
  {
    name: "Gastronomie & Lieferdienste",
    lead: "Den Laden füllen,",
    accent: "auch unter der Woche.",
    body: "Filialen, Bestellstrecken und Kampagnen, die Gäste bringen. Vom lokalen Marketing bis zur eigenen Bestell-Landingpage — messbar, nicht nach Bauchgefühl.",
    icon: Utensils,
    img: "/branchen/03.jpg",
    tint: "from-[#ebd9c0] to-[#d9a86a]",
  },
  {
    name: "Fahrschulen & Bildung",
    lead: "Anmeldungen,",
    accent: "die von allein kommen.",
    body: "Anmeldungen, Theoriepläne und ein Auftritt, den Fahrschüler weiterempfehlen. Sichtbar bei jeder Suche im Umkreis, ohne dass Sie ständig posten müssen.",
    icon: GraduationCap,
    img: "/branchen/04.jpg",
    tint: "from-[#dbe0d9] to-[#b3c0ab]",
  },
  {
    name: "Personal & Recruiting",
    lead: "Stellen besetzen,",
    accent: "ohne Dauerschleife.",
    body: "Stellen, die tatsächlich besetzt werden — mit Anzeigen und Abläufen, die Bewerbungen bringen und die Richtigen davon auch halten.",
    icon: Users,
    img: "/branchen/05.jpg",
    tint: "from-[#e6dcc9] to-[#c9b389]",
  },
  {
    name: "Immobilien & Verwaltung",
    lead: "Anfragen sortiert,",
    accent: "statt verstreut.",
    body: "Objekte, Anfragen und Interessenten sauber sortiert statt verstreut im Posteingang. Ein System, das Vermarktung und Verwaltung an einer Stelle bündelt.",
    icon: House,
    img: "/branchen/06.jpg",
    tint: "from-[#dde1e4] to-[#b6c1c9]",
  },
];

const STEPS = INDUSTRIES.length;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Branchen() {
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
    lockUntil.current = performance.now() + 800;
    setActive(i);
  };

  useGSAP(
    () => {
      gsap.from(".br-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".br-head", start: "top 82%" },
      });

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

  const it = INDUSTRIES[active];

  return (
    <section id="branchen" ref={root} className="bg-[#f3f5f6] lg:h-[330vh]">
      <div className="py-20 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <Container className="w-full">
          <div className="br-head max-w-[720px]">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
              <Briefcase className="size-3.5 text-accent" />
              Branchen
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
              Wo wir uns{" "}
              <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                auskennen
              </span>
              .
            </h2>
            <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
              Wir arbeiten nicht für jeden. In diesen sechs Bereichen kennen wir
              die Abläufe so gut, dass wir vom ersten Tag an mitreden können.
            </p>
          </div>

          {/* card */}
          <div className="mt-8 rounded-[28px] border border-line bg-white p-4 shadow-[0_40px_90px_-55px_rgba(15,14,13,0.3)] sm:mt-12 sm:p-6 lg:p-7">
            <div className="grid items-stretch gap-5 lg:grid-cols-[210px_minmax(0,1fr)_minmax(300px,360px)] lg:gap-8">
              {/* list */}
              <ul className="no-scrollbar order-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:order-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
                {INDUSTRIES.map((ind, i) => {
                  const on = active === i;
                  return (
                    <li key={ind.name} className="shrink-0 lg:shrink">
                      <button
                        type="button"
                        aria-current={on}
                        onClick={() => pick(i)}
                        className={`flex items-center gap-2 rounded-[12px] px-3.5 py-2.5 text-left transition-colors duration-200 lg:w-full lg:flex-col lg:items-start lg:gap-1 ${
                          on ? "bg-[#0b2b39]" : "hover:bg-black/[0.04]"
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] tracking-[0.1em] ${
                            on ? "text-white/55" : "text-ink/35"
                          }`}
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          className={`whitespace-nowrap text-[13.5px] font-medium tracking-[-0.01em] lg:whitespace-normal ${
                            on ? "text-white" : "text-ink/65"
                          }`}
                        >
                          {ind.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* content */}
              <div className="order-2 flex flex-col justify-center px-1 lg:px-2">
                <h3 className="font-display text-[clamp(1.4rem,2.1vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
                  {it.lead}{" "}
                  <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                    {it.accent}
                  </span>
                </h3>
                <p className="mt-3 max-w-[400px] text-[14px] leading-[1.65] text-[#5c5954]">
                  {it.body}
                </p>
                <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink/40">
                  {pad(active + 1)} von {pad(STEPS)}
                </p>
              </div>

              {/* image */}
              <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-line lg:order-3 lg:aspect-auto lg:h-full lg:min-h-[300px]">
                {INDUSTRIES.map((ind, i) => {
                  const Icon = ind.icon;
                  return (
                    <div
                      key={ind.name}
                      className="absolute inset-0 transition-opacity duration-500 ease-out"
                      style={{ opacity: active === i ? 1 : 0 }}
                      aria-hidden={active !== i}
                    >
                      <div
                        className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${ind.tint}`}
                      >
                        <Icon className="size-16 text-white/45" strokeWidth={1} />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ind.img}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
