"use client";

import { useRef } from "react";
import { CircleCheck, FolderOpen } from "lucide-react";
import Container from "../ui/Container";
import { gsap, useGSAP } from "@/lib/gsap";

type Theme = {
  panel: string;
  ink: string;
  dim: string;
  accent: string;
  card: string;
  outline?: string;
};

type Bullet = { label: string; desc: string };

type Project = {
  lead: string;
  accent: string;
  bullets: Bullet[];
  url: string;
  theme: Theme;
};

const PROJECTS: Project[] = [
  {
    lead: "Von der ersten Filiale zur",
    accent: "Marke, die man kennt.",
    bullets: [
      { label: "Auftritt und Bestellstrecke", desc: "Eine Seite, die den Slice verkauft, statt ihn nur zu zeigen." },
      { label: "Kampagnen mit Standortbezug", desc: "Anzeigen, die den Laden auch unter der Woche füllen." },
      { label: "Wiederkehrbar offline", desc: "Speisekarte, Verpackung und Social aus einem Baukasten." },
    ],
    url: "crusty-slices.com",
    theme: {
      panel: "#c0392b",
      ink: "#f7ead9",
      dim: "rgba(255,255,255,0.5)",
      accent: "#e8a24d",
      card: "rgba(255,255,255,0.14)",
      outline: "rgba(255,255,255,0.55)",
    },
  },
  {
    lead: "Eine Fahrschule, die aussieht",
    accent: "wie eine Marke.",
    bullets: [
      { label: "Theorieplan, den Fahrschüler benutzen", desc: "monatlich aktuell, ohne Nachfragen im Büro." },
      { label: "Anmeldung ohne Umweg", desc: "vom Instagram-Profil bis zum Vertrag in einem Fluss." },
      { label: "Ein Auftritt, den man weiterempfiehlt", desc: "Farbe, Ton und Bildsprache konsequent durchgezogen." },
    ],
    url: "abgefahrn.de",
    theme: {
      panel: "#111e1b",
      ink: "#e9fff3",
      dim: "rgba(255,255,255,0.42)",
      accent: "#33df78",
      card: "rgba(255,255,255,0.08)",
      outline: "rgba(255,255,255,0.3)",
    },
  },
  {
    lead: "Aus unregelmäßigen Anrufen wurden",
    accent: "planbare Anfragen.",
    bullets: [
      { label: "Local SEO für jeden Einsatzort", desc: "gefunden werden, wo der Auftrag tatsächlich entsteht." },
      { label: "Ads auf Anfragen optimiert", desc: "nicht auf Klicks und nicht auf Reichweite." },
      { label: "5 bis 7 Leads am Tag", desc: "täglich planbar statt nur nach Wochenanfang." },
    ],
    url: "cleanpany.de",
    theme: {
      panel: "#1f6fd0",
      ink: "#eef5ff",
      dim: "rgba(255,255,255,0.6)",
      accent: "#ffffff",
      card: "rgba(255,255,255,0.18)",
      outline: "rgba(255,255,255,0.7)",
    },
  },
];

/* Stylised browser window mocking each project's site. */
function BrowserMock({ url, theme }: { url: string; theme: Theme }) {
  return (
    <div className="w-full overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_34px_70px_-34px_rgba(15,14,13,0.45)]">
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f3f3f2] px-3.5 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink/40">
          {url}
        </span>
      </div>
      <div className="relative aspect-[16/10] p-6 sm:p-7" style={{ background: theme.panel }}>
        <div className="h-4 w-[56%] rounded-full" style={{ background: theme.ink }} />
        <div className="mt-3 h-2.5 w-[74%] rounded-full" style={{ background: theme.dim }} />
        <div className="mt-2 h-2.5 w-[50%] rounded-full" style={{ background: theme.dim }} />
        <div className="mt-6 flex gap-3">
          <div className="h-9 w-[36%] rounded-lg" style={{ background: theme.accent }} />
          <div
            className="h-9 w-[26%] rounded-lg border"
            style={{ borderColor: theme.outline, background: "transparent" }}
          />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg p-2.5" style={{ background: theme.card }}>
              <div className="h-1.5 w-[70%] rounded-full" style={{ background: theme.dim }} />
              <div className="mt-1.5 h-1.5 w-[45%] rounded-full" style={{ background: theme.dim }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Referenzen() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".ref-head > *", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".ref-head", start: "top 82%" },
      });
      // Each card scales up as it rises into the stack.
      gsap.utils.toArray<HTMLElement>(".ref-card").forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.94, autoAlpha: 0.55 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 94%",
              end: "top 62%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="referenzen" ref={root} className="bg-[#f3f5f6] py-20 sm:py-24">
      <Container>
        <div className="ref-head max-w-[720px]">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
            <FolderOpen className="size-3.5 text-accent" />
            Ausgewählte Projekte
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,2.85rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Arbeiten, die{" "}
            <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
              weiterlaufen
            </span>
            , wenn wir nicht mehr im Raum sind.
          </h2>
          <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,18px)] leading-[1.6] text-[#5c5954]">
            Drei Projekte aus der Zusammenarbeit mit Unternehmen, die Sie im
            Zweifel selbst anrufen können.
          </p>
        </div>

        {/* stacking cards */}
        <div className="mt-10 sm:mt-14">
          {PROJECTS.map((p, i) => (
            <div
              key={p.url}
              className="ref-sticky mb-6 lg:sticky lg:mb-10"
              style={{ top: `${96 + i * 22}px` }}
            >
              <article className="ref-card grid h-auto overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_36px_80px_-46px_rgba(15,14,13,0.35)] lg:h-[clamp(440px,70vh,600px)] lg:grid-cols-[1fr_1.05fr]">
                {/* text */}
                <div className="order-2 flex flex-col justify-center p-7 sm:p-10 lg:order-1 lg:p-12">
                  <h3 className="font-display text-[clamp(1.45rem,2.3vw,2.1rem)] font-bold leading-[1.16] tracking-[-0.02em] text-ink">
                    {p.lead}{" "}
                    <span className="font-[family-name:var(--font-instrument)] font-normal italic text-[#a07d45]">
                      {p.accent}
                    </span>
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {p.bullets.map((b) => (
                      <li key={b.label} className="flex gap-3">
                        <CircleCheck
                          className="mt-0.5 size-[19px] shrink-0 text-[#c79a53]"
                          strokeWidth={2}
                        />
                        <p className="text-[14px] leading-[1.55] text-[#5c5954]">
                          <span className="font-semibold text-ink">
                            {b.label}:
                          </span>{" "}
                          {b.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* browser mock */}
                <div className="order-1 flex items-center overflow-hidden bg-[#eef1f3] p-6 sm:p-9 lg:order-2 lg:p-10">
                  <div className="w-full lg:w-[116%]">
                    <BrowserMock url={p.url} theme={p.theme} />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
