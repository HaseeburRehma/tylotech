"use client";

import { useRef } from "react";
import { Layers, CircleCheck, CircleHelp } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";
import { useT } from "../i18n/LocaleProvider";

/* ---- mini flow visuals (light theme) ----------------------------- */

function SystemMock() {
  const t = useT();
  const pills = [
    { t: "Website", en: "Website", gold: true },
    { t: "Werbekonten", en: "Ad accounts", gold: false },
    { t: "CRM", en: "CRM", gold: false },
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
            <stop offset="0%" stopColor="#c9c2b4" />
            <stop offset="100%" stopColor="#d1aa71" />
          </linearGradient>
        </defs>
        {[63, 105, 147].map((py) => (
          <path
            key={py}
            d={`M150 ${py} C 205 ${py}, 210 105, 262 105`}
            fill="none"
            stroke="url(#awconn)"
            strokeWidth="1.5"
            opacity="0.7"
          />
        ))}
        {/* gold pulses continuously flowing into the hub */}
        {[63, 105, 147].map((py, i) => (
          <path
            key={`p${py}`}
            className="aw-flow"
            d={`M150 ${py} C 205 ${py}, 210 105, 262 105`}
            fill="none"
            stroke="#c79a53"
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.2 0.8"
            strokeDashoffset={1}
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col gap-2.5">
        {pills.map((p, i) => (
          <span
            key={p.t}
            className="sys-pill flex items-center gap-2 rounded-[10px] border border-line bg-white px-3 py-1.5 shadow-[0_1px_3px_rgba(15,14,13,0.04)]"
            style={{ transform: `rotate(${(2 - i) * 1.1}deg)` }}
          >
            <span
              className="size-[6px] rounded-[3px]"
              style={{ background: p.gold ? "#d1aa71" : "#b3aea6" }}
            />
            <span className="text-[12px] font-medium text-ink">{t(p.t, p.en)}</span>
          </span>
        ))}
      </div>

      <span className="sys-hub relative z-10 ml-auto flex flex-col items-center gap-1 rounded-[14px] border-[1.5px] border-accent bg-[rgba(209,170,113,0.12)] px-4 py-3.5">
        <Layers
          className="size-[22px] text-[#c79a53] transition-transform duration-300 group-hover:scale-110"
          strokeWidth={1.7}
        />
        <span className="text-[11.5px] font-medium text-[#94713f]">
          {t("Eine Ebene", "One layer")}
        </span>
      </span>
    </div>
  );
}

function FlowMock() {
  const t = useT();
  const rows = [
    { label: "Auslöser", text: "Neue Anfrage über das Formular", hot: false, en: { label: "Trigger", text: "New enquiry via the form" } },
    { label: "Prozess", text: "Zuordnen, qualifizieren, Termin vorschlagen", hot: false, en: { label: "Process", text: "Assign, qualify, suggest a meeting" } },
    { label: "Aktion", text: "Angebot und Erinnerung raus", hot: true, en: { label: "Action", text: "Quote and reminder sent" } },
  ];
  return (
    <div className="flex h-[210px] w-full max-w-[300px] flex-col items-stretch justify-center">
      {rows.map((r, i) => (
        <div key={r.label} className="flex flex-col items-center">
          <div
            className={`flow-row w-full rounded-[11px] border px-3.5 pb-3 pt-2.5 transition-shadow duration-300 ${
              r.hot
                ? "border-[1.5px] border-accent bg-[rgba(209,170,113,0.12)] group-hover:shadow-[0_0_26px_-8px_rgba(209,170,113,0.5)]"
                : "border-line bg-white"
            }`}
          >
            <p
              className={`text-[9px] font-medium uppercase tracking-[0.08em] ${
                r.hot ? "text-[#94713f]" : "text-ink/45"
              }`}
            >
              {t(r.label, r.en.label)}
            </p>
            <p className="mt-0.5 text-[12.5px] font-medium text-ink">{t(r.text, r.en.text)}</p>
          </div>
          {i < rows.length - 1 && <span className="my-1 h-3 w-px bg-line" />}
        </div>
      ))}
      <div className="mt-3 flex w-fit items-center gap-2 rounded-full bg-[rgba(22,163,74,0.1)] px-2.5 py-1">
        <span className="relative flex size-1.5 items-center justify-center">
          <span className="absolute inline-flex size-full rounded-full bg-[#16a34a] opacity-70 group-hover:animate-ping" />
          <span className="relative size-1.5 rounded-full bg-[#16a34a]" />
        </span>
        <span className="text-[11px] font-medium text-[#15803d]">
          {t("läuft automatisch", "runs automatically")}
        </span>
      </div>
    </div>
  );
}

function ApprovalMock() {
  const t = useT();
  const rows = [
    { text: "Anzeigentexte September", en: "Ad copy September", done: true },
    { text: "Landingpage Rohrreinigung", en: "Landing page drain cleaning", done: true },
    { text: "Budget Q4", en: "Budget Q4", done: false },
    { text: "Social-Plan KW 38", en: "Social plan week 38", done: false },
  ];
  return (
    <div className="flex h-[210px] w-full max-w-[340px] flex-col justify-center gap-2 rounded-[14px] border border-line bg-white p-[18px] shadow-[0_1px_3px_rgba(15,14,13,0.04)]">
      {rows.map((r) => (
        <div
          key={r.text}
          className={`appr-row flex h-[46px] items-center gap-2.5 rounded-[10px] px-3 transition-colors duration-300 ${
            r.done
              ? "bg-[rgba(209,170,113,0.12)] group-hover:bg-[rgba(209,170,113,0.2)]"
              : "bg-black/[0.03]"
          }`}
        >
          {r.done ? (
            <CircleCheck
              className="size-[18px] shrink-0 text-[#c79a53] transition-transform duration-300 group-hover:scale-110"
              strokeWidth={2}
            />
          ) : (
            <CircleHelp className="size-[18px] shrink-0 text-ink/30" strokeWidth={2} />
          )}
          <span className="flex-1 truncate text-[12.5px] font-medium text-ink">
            {t(r.text, r.en)}
          </span>
          {r.done ? (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-medium text-ink">
              {t("freigegeben", "approved")}
            </span>
          ) : (
            <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[10.5px] font-medium text-ink/50">
              {t("offen", "open")}
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
    body: "Website, Werbekonten und CRM hängen zusammen. Eine Anfrage landet nicht in drei Postfächern, sondern an einer Stelle.",
    en: {
      title: "One system, not a patchwork",
      body: "Website, ad accounts and CRM are connected. An enquiry doesn't land in three inboxes — it lands in one place.",
    },
  },
  {
    Mock: FlowMock,
    title: "Abläufe, die von selbst laufen",
    body: "Auslöser, Verarbeitung, Aktion. Einmal sauber gebaut, übernimmt das System das Nachfassen — nicht deine Assistenz.",
    en: {
      title: "Workflows that run themselves",
      body: "Trigger, process, action. Built properly once, the system handles the follow-up — not your assistant.",
    },
  },
  {
    Mock: ApprovalMock,
    title: "Freigaben ohne Rückfragen",
    body: "Was ansteht, siehst du auf einen Blick. Ein Klick genügt, und niemand muss den passenden Betreff suchen.",
    en: {
      title: "Approvals without the back-and-forth",
      body: "See what's pending at a glance. One click is enough — and nobody has to dig for the right email thread.",
    },
  },
];

export default function Arbeitsweise() {
  const root = useRef<HTMLDivElement>(null);
  const t = useT();

  useGSAP(
    () => {
      gsap.from(".aw-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".aw-head", start: "top 82%" , toggleActions: "play none none none" },
      });
      gsap.from(".aw-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".aw-grid", start: "top 82%" , toggleActions: "play none none none" },
      });
      const st = { trigger: ".aw-grid", start: "top 74%", toggleActions: "play none none none" as const };
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
      className="relative overflow-hidden border-t border-line bg-[#f3f5f6] py-14 sm:py-24"
    >
      <Container className="relative">
        <div className="aw-head max-w-[680px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)] mb-[18px]">
            <Layers className="size-3.5 text-accent" />
            {t("Unsere Arbeitsweise", "How we work")}
          </p>
          <h2 className="display-m text-ink">
            {t("Drei Dinge, die wir anders machen.", "Three things we do differently.")}
          </h2>
          <p className="mt-[18px] text-[clamp(16px,1.6vw,18px)] leading-[1.6] tracking-[-0.1px] text-[#5c5954]">
            {t(
              <>
                Kein Geheimwissen — einfach das, was nach über hundert Projekten
                übrig geblieben ist.
              </>,
              "No secret sauce — just what's left after more than a hundred projects.",
            )}
          </p>
        </div>

        <div className="aw-grid mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:mt-14 lg:grid-cols-3">
          {CARDS.map(({ Mock, title, body, en }) => (
            <article
              key={title}
              className="aw-card group flex flex-col bg-white transition-colors duration-300 hover:bg-[#fbfaf9]"
            >
              <div className="flex h-[258px] items-center justify-center overflow-hidden px-6">
                <Mock />
              </div>
              <div className="px-8 pb-[34px] pt-2">
                <h3 className="font-display text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink">
                  {t(title, en.title)}
                </h3>
                <p className="mt-3 text-[16px] leading-[26px] text-[#5c5954]">
                  {t(body, en.body)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
