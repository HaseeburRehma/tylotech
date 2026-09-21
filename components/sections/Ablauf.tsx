"use client";

import { useRef } from "react";
import { Send, Search, MessageCircle, Rocket } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    icon: Send,
    step: "Schritt 01",
    title: "Anfrage",
    body: "Sie schildern uns in zwei Minuten, wo es klemmt. Kein Formular mit zwanzig Feldern, kein Callcenter.",
  },
  {
    icon: Search,
    step: "Schritt 02",
    title: "Analyse und Planung",
    body: "Wir schauen uns Zahlen, Auftritt und Abläufe an, bevor wir irgendetwas versprechen — und sagen auch, wenn nichts zu tun ist.",
  },
  {
    icon: MessageCircle,
    step: "Schritt 03",
    title: "Anliegengespräch",
    body: "Dreißig Minuten, in denen wir ehrlich sagen, was sich lohnt und was Sie sich sparen können. Kein Verkaufsgespräch.",
  },
  {
    icon: Rocket,
    step: "Schritt 04",
    title: "Strategie und Start",
    body: "Fester Ansprechpartner, klarer Plan, feste Termine. Dann fangen wir an — und Sie sehen ab Woche eins, woran wir arbeiten.",
  },
];

const CELL_BORDERS = [
  "border-b md:border-r border-[#0a4a5f]",
  "border-b border-[#0a4a5f]",
  "border-b md:border-b-0 md:border-r border-[#0a4a5f]",
  "border-[#0a4a5f]",
];

export default function Ablauf() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".ablauf-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ablauf-head", start: "top 82%" },
      });
      gsap.from(".ablauf-step", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 80%" },
      });
      gsap.from(".ablauf-icon", {
        scale: 0.4,
        opacity: 0,
        duration: 0.55,
        ease: "back.out(1.9)",
        stagger: 0.12,
        clearProps: "transform",
        scrollTrigger: { trigger: ".ablauf-grid", start: "top 78%" },
      });
      gsap.from(".ablauf-cta", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ablauf-cta", start: "top 92%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="ablauf" ref={root} className="bg-[#001620] text-white py-24">
      <Container>
        <div className="ablauf-head mx-auto max-w-[640px] text-center">
          <p className="eyebrow mb-[18px] flex items-center justify-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            So läuft es ab
          </p>
          <h2 className="display-l text-white">
            Vier Schritte bis zur Zusammenarbeit.
          </h2>
          <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#b3d6e2]">
            Kein Vertrieb, der Sie durch einen Funnel schiebt. Nach dem dritten
            Schritt wissen Sie genau, was Sie bekommen und was es kostet.
          </p>
        </div>

        <div className="ablauf-grid mx-auto mt-14 grid max-w-[1040px] grid-cols-1 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, step, title, body }, i) => (
            <div
              key={title}
              className={cn(
                "ablauf-step py-9",
                i % 2 === 0 ? "md:pr-12" : "md:pl-12",
                CELL_BORDERS[i],
              )}
            >
              <Icon className="ablauf-icon size-6 text-accent" strokeWidth={1.6} />
              <p className="eyebrow mt-6 text-[#7fbacd]">{step}</p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.015em] text-white">
                {title}
              </h3>
              <p className="mt-2.5 max-w-[420px] text-[15px] leading-relaxed text-[#7fbacd]">
                {body}
              </p>
            </div>
          ))}
        </div>

        <div className="ablauf-cta mt-14 flex justify-center">
          <Button href="#termin" variant="dark" withArrow>
            Erstgespräch buchen
          </Button>
        </div>
      </Container>
    </section>
  );
}
