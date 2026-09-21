"use client";

import { useRef } from "react";
import { Layers, CircleCheck, CircleHelp } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import MosaicBackdrop from "../MosaicBackdrop";
import { gsap, useGSAP } from "@/lib/gsap";

/* ---- mini flow visuals ------------------------------------------- */

function SystemMock() {
  const pills = [
    { t: "Website", gold: true },
    { t: "Werbekonten", gold: false },
    { t: "CRM", gold: false },
    { t: "Buchhaltung", gold: false },
  ];
  return (
    <div className="relative flex h-[210px] w-full max-w-[360px] items-center">
      <svg
        viewBox="0 0 360 210"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="awconn" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a6b78" />
            <stop offset="100%" stopColor="#d1aa71" />
          </linearGradient>
        </defs>
        {[36, 78, 120, 162].map((py) => (
          <path
            key={py}
            d={`M150 ${py} C 205 ${py}, 210 105, 262 105`}
            fill="none"
            stroke="url(#awconn)"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}
        {/* gold pulses that flow into the hub on hover */}
        {[36, 78, 120, 162].map((py, i) => (
          <path
            key={`p${py}`}
            className="aw-flow"
            d={`M150 ${py} C 205 ${py}, 210 105, 262 105`}
            fill="none"
            stroke="#d1aa71"
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.2 0.8"
            strokeDashoffset={1}
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col gap-2.5">
        {pills.map((p, i) => (
          <span
            key={p.t}
            className="sys-pill flex items-center gap-2 rounded-[10px] border border-[#123f4f] bg-[#0a2c3a] px-3 py-1.5"
            style={{ transform: `rotate(${(3 - i) * 1.1}deg)` }}
          >
            <span
              className="size-[6px] rounded-[3px]"
              style={{ background: p.gold ? "#d1aa71" : "#4a6b78" }}
            />
            <span className="text-[12px] font-medium text-white">{p.t}</span>
          </span>
        ))}
      </div>

      <span className="sys-hub relative z-10 ml-auto flex flex-col items-center gap-1 rounded-[14px] border-[1.5px] border-accent bg-[rgba(209,170,113,0.1)] px-4 py-3.5 transition-[background-color,box-shadow] duration-300 group-hover:bg-[rgba(209,170,113,0.22)] group-hover:shadow-[0_0_34px_-6px_rgba(209,170,113,0.55)]">
        <Layers className="size-[22px] text-[#d1aa71] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.7} />
        <span className="text-[11.5px] font-medium text-[#d8b682]">Eine Ebene</span>
      </span>
    </div>
  );
}

function FlowMock() {
  const rows = [
    { label: "Auslöser", text: "Neue Anfrage über das Formular", hot: false },
    { label: "Prozess", text: "Zuordnen, qualifizieren, Termin vorschlagen", hot: false },
    { label: "Aktion", text: "Angebot und Erinnerung raus", hot: true },
  ];
  return (
    <div className="flex h-[210px] w-full max-w-[300px] flex-col items-stretch justify-center">
      {rows.map((r, i) => (
        <div key={r.label} className="flex flex-col items-center">
          <div
            className={`flow-row w-full rounded-[11px] border px-3.5 pb-3 pt-2.5 transition-shadow duration-300 ${
              r.hot
                ? "border-[1.5px] border-accent bg-[rgba(209,170,113,0.1)] group-hover:shadow-[0_0_26px_-8px_rgba(209,170,113,0.55)]"
                : "border-[#123f4f] bg-[#0a2c3a]"
            }`}
          >
            <p
              className={`text-[9px] font-medium uppercase tracking-[0.08em] ${
                r.hot ? "text-[#d8b682]" : "text-[#7fbacd]"
              }`}
            >
              {r.label}
            </p>
            <p className="mt-0.5 text-[12.5px] font-medium text-white">{r.text}</p>
          </div>
          {i < rows.length - 1 && (
            <span className="my-1 h-3 w-px bg-[#2a5566]" />
          )}
        </div>
      ))}
      <div className="mt-3 flex w-fit items-center gap-2 rounded-full bg-[rgba(30,120,80,0.2)] px-2.5 py-1">
        <span className="relative flex size-1.5 items-center justify-center">
          <span className="absolute inline-flex size-full rounded-full bg-[#34d399] opacity-70 group-hover:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-[#34d399]" />
        </span>
        <span className="text-[11px] font-medium text-[#6ee7b0]">
          läuft automatisch
        </span>
      </div>
    </div>
  );
}

function ApprovalMock() {
  const rows = [
    { text: "Anzeigentexte September", done: true },
    { text: "Landingpage Rohrreinigung", done: true },
    { text: "Budget Q4", done: false },
    { text: "Social-Plan KW 38", done: false },
  ];
  return (
    <div className="flex h-[210px] w-full max-w-[340px] flex-col justify-center gap-2 rounded-[14px] border border-[#0e3a4a] bg-[#031a26] p-[18px]">
      {rows.map((r) => (
        <div
          key={r.text}
          className={`appr-row flex h-[46px] items-center gap-2.5 rounded-[10px] px-3 transition-colors duration-300 ${
            r.done
              ? "bg-[rgba(209,170,113,0.1)] group-hover:bg-[rgba(209,170,113,0.18)]"
              : "bg-white/[0.04]"
          }`}
        >
          {r.done ? (
            <CircleCheck
              className="size-[18px] shrink-0 text-[#d1aa71] transition-transform duration-300 group-hover:scale-110"
              strokeWidth={2}
            />
          ) : (
            <CircleHelp className="size-[18px] shrink-0 text-[#7fbacd]/70" strokeWidth={2} />
          )}
          <span className="flex-1 truncate text-[12.5px] font-medium text-white">
            {r.text}
          </span>
          {r.done ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-medium text-[#001620]">
              freigegeben
            </span>
          ) : (
            <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10.5px] font-medium text-[#7fbacd]">
              offen
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const CARDS = [
  {
    Mock: SystemMock,
    title: "Ein System statt Insellösungen",
    body: "Website, Werbekonten, CRM und Buchhaltung hängen zusammen. Eine Anfrage landet nicht in vier Postfächern, sondern an einer Stelle.",
  },
  {
    Mock: FlowMock,
    title: "Abläufe, die von selbst laufen",
    body: "Auslöser, Verarbeitung, Aktion. Einmal sauber gebaut, übernimmt das System das Nachfassen — nicht Ihre Assistenz.",
  },
  {
    Mock: ApprovalMock,
    title: "Freigaben ohne Rückfragen",
    body: "Was ansteht, sehen Sie auf einen Blick. Ein Klick genügt, und niemand muss den passenden Betreff suchen.",
  },
];

export default function Arbeitsweise() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".aw-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".aw-head", start: "top 82%" },
      });
      gsap.from(".aw-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".aw-grid", start: "top 82%" },
      });
      const st = { trigger: ".aw-grid", start: "top 74%" };
      gsap.from(".sys-pill", { x: -18, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.1, scrollTrigger: st });
      gsap.from(".sys-hub", { scale: 0.7, opacity: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.4, scrollTrigger: st });
      gsap.from(".flow-row", { y: 16, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.14, scrollTrigger: st });
      gsap.from(".appr-row", { x: 16, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.1, scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section
      id="arbeitsweise"
      ref={root}
      className="relative overflow-hidden bg-[#001620] py-24 text-white"
    >
      <MosaicBackdrop />

      <Container className="relative">
        <div className="aw-head max-w-[640px]">
          <p className="eyebrow mb-[18px] flex items-center gap-2.5 text-[#d8b682]">
            <span className="size-[7px] rounded-[2px] bg-accent" />
            Arbeitsweise
          </p>
          <h2 className="display-m text-white">
            Drei Dinge, die wir anders machen.
          </h2>
          <p className="mt-[18px] text-[18px] leading-[30px] tracking-[-0.1px] text-[#b3d6e2]">
            Kein Geheimwissen — einfach das, was nach über hundert Projekten
            übrig geblieben ist.
          </p>
        </div>

        <div className="aw-grid mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-[#0e3a4a] bg-[#0e3a4a] lg:grid-cols-3">
          {CARDS.map(({ Mock, title, body }) => (
            <article key={title} className="aw-card group flex flex-col bg-[#02202c] transition-colors duration-300 hover:bg-[#02242f]">
              <div className="flex h-[258px] items-center justify-center overflow-hidden px-6">
                <Mock />
              </div>
              <div className="px-8 pb-[34px] pt-2">
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-white">
                  {title}
                </h3>
                <p className="mt-3 text-[16px] leading-[26px] text-[#b3d6e2]">
                  {body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
