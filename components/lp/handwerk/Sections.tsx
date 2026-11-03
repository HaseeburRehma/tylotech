"use client";

import { useRef } from "react";
import {
  ArrowRight,
  Check,
  CircleDot,
  Fan,
  Frame,
  Grid2x2,
  Hammer,
  Layers,
  LayoutPanelTop,
  Lock,
  MapPin,
  Minus,
  Palette,
  Quote,
  Search,
  Star,
  Thermometer,
  User,
  Wrench,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { GoldButton } from "@/components/branche/ui";
import { CONTACT } from "@/lib/contact";
import { gsap, useLazyGSAP } from "@/lib/gsap";
import { FORM, GoogleG, Pill, SnapSlider, Stars } from "./ui";

const head = (st: (t: string, s?: string) => object) => gsap.from(".lp-head > *", { y: 26, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.1, scrollTrigger: st(".lp-head") });
const st = (trigger: string, start = "top 82%") => ({ trigger, start, toggleActions: "play none none none" });

/* ---------- 05 · Vergleich ---------- */

const WAYS = [
  {
    tag: "Leadportale",
    title: "Geteilte Anfragen, Preiskampf.",
    points: ["Dieselbe Anfrage geht an fünf Betriebe gleichzeitig", "Wer am schnellsten den Preis senkt, bekommt den Zuschlag", "Keine Bindung, kein Interesse am Abschluss", "Du zahlst pro Lead, egal ob er etwas wird", "Kein eigenes System, keine eigenen Daten"],
    end: "Du kaufst Kontakte, keine Kunden.",
  },
  {
    tag: "Agenturen",
    title: "Du zahlst monatlich und hoffst.",
    points: ["Feste Monatsgebühr, egal was dabei herauskommt", "Reichweite und Reports als Ziel, nicht der Abschluss", "Gemietete Reichweite statt eigenem System", "Wechselnde Ansprechpartner im Ticket-Team", "Der Vertrag läuft, auch wenn nichts läuft"],
    end: "Du zahlst für Aktivität, nicht für Aufträge.",
  },
];
const OURS = ["Eigene Methode plus eigene Software TyloHQ", "Anfragen landen in Echtzeit in deiner App", "Nur ein Betrieb pro Gewerk und Stadt", "Wir partizipieren an deinem Erfolg", "Ein fester Ansprechpartner, der den Abschluss will"];

export function Vergleich() {
  const root = useRef<HTMLElement>(null);
  useLazyGSAP(
    () => {
      head(st);
      gsap.from(".lpv-card", { y: 44, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, scrollTrigger: st(".lpv-grid") });
      gsap.from(".lpv-ours li", { x: 18, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.5, scrollTrigger: st(".lpv-grid") });
    },
    { scope: root },
  );

  return (
    <section id="vergleich" ref={root} className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28">
      <Container>
        <div className="lp-head flex max-w-[770px] flex-col items-start gap-[18px]">
          <Pill icon={CircleDot}>Drei Wege zu neuen Aufträgen</Pill>
          <h2 className="t-h2 text-[#1a1917]">
            Leadportale, Agenturen oder ein Partner, <span className="t-serif text-[#94713f]">der mitverdient.</span>
          </h2>
          <p className="t-body-l text-[#5c5954]">Nur einer der drei Wege hat ein eigenes Interesse daran, dass du wirklich abschließt. Deshalb nehmen wir nur einen Betrieb pro Gewerk und Stadt.</p>
        </div>

        <div className="lpv-grid mt-10 sm:mt-14">
          <SnapSlider label="Drei Wege zu neuen Aufträgen" className="lg:grid-cols-3 lg:items-stretch lg:gap-6">
            {[
              ...WAYS.map((w) => (
                <div key={w.tag} className="lpv-card flex h-full flex-col rounded-[24px] border border-[#eeedea] bg-[#f6f5f3] p-6 sm:p-[30px]">
                  <p className="eyebrow text-[#7d7973]">{w.tag}</p>
                  <h3 className="mt-2.5 t-h5 text-[#1a1917] sm:text-[22px] sm:leading-[28px]">{w.title}</h3>
                  <ul className="mt-6 flex flex-col gap-3.5">
                    {w.points.map((p) => (
                      <li key={p} className="t-body-s flex items-start gap-3 text-[#5c5954]">
                        <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-[#eae8e4]">
                          <Minus className="size-3 text-[#7d7973]" strokeWidth={2.2} aria-hidden />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="t-body-s mt-6 text-[#7d7973]">{w.end}</p>
                </div>
              )),
              <div
                key="tylo"
                className="lpv-card lpv-ours relative flex h-full flex-col rounded-[24px] border border-[#d1aa71] bg-[linear-gradient(180deg,#fbf6ee_0%,#f6e9d3_100%)] p-6 shadow-[0_24px_60px_-24px_rgba(168,127,69,0.45)] sm:p-[30px]"
              >
                <p className="eyebrow text-[#94713f]">TyloTech</p>
                <h3 className="mt-2.5 t-h5 text-[#1a1917] sm:text-[22px] sm:leading-[28px]">Ein eigenes System, das mitverdient.</h3>
                <ul className="mt-6 flex flex-col gap-2.5">
                  {OURS.map((p) => (
                    <li key={p} className="t-body-s flex items-start gap-3 rounded-[12px] bg-white px-4 py-3.5 text-[#1a1917] shadow-[0_1px_2px_rgba(8,34,44,0.05)]">
                      <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-[#fbf6ee]">
                        <Check className="size-3 text-[#b98f53]" strokeWidth={2.6} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-[family-name:var(--font-instrument)] text-[20px] italic leading-[26px] text-[#94713f]">Wir gewinnen nur, wenn du gewinnst.</p>
              </div>,
            ]}
          </SnapSlider>
        </div>
      </Container>
    </section>
  );
}

/* ---------- 06 · Gründer ---------- */

export function Gruender() {
  const root = useRef<HTMLElement>(null);
  useLazyGSAP(
    () => {
      gsap.from(".lpg-photo", { y: 40, opacity: 0, scale: 0.97, duration: 1, ease: "power3.out", scrollTrigger: st(".lpg-photo", "top 85%") });
      gsap.from(".lpg-photo img", { scale: 1.12, duration: 1.6, ease: "power2.out", scrollTrigger: st(".lpg-photo", "top 85%") });
      gsap.from(".lpg-name", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.6, scrollTrigger: st(".lpg-photo", "top 85%") });
      gsap.from(".lpg-text > *", { y: 22, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.08, scrollTrigger: st(".lpg-text") });
    },
    { scope: root },
  );

  return (
    <section id="gruender" ref={root} className="scroll-mt-20 bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[520px_1fr] lg:gap-24">
        <div className="lpg-photo relative mx-auto aspect-[520/600] w-full max-w-[520px] overflow-hidden rounded-[28px] bg-[#eeedea] shadow-[0_6px_20px_rgba(0,0,0,0.18),0_20px_40px_rgba(0,0,0,0.12)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/team/ilias-el-aradi-gruender.webp" alt="Ilias El Aradi, Gründer von TyloTech" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="lpg-name absolute bottom-6 left-6 rounded-[14px] bg-white/95 px-5 py-3.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur">
            <p className="t-label-l text-[#1a1917]">Ilias El Aradi</p>
            <p className="t-body-s text-[#5c5954]">Gründer, TyloTech</p>
          </div>
        </div>

        <div className="lpg-text flex flex-col items-start gap-6">
          <Pill icon={User}>Der Gründer</Pill>
          <h2 className="t-h2 text-[#1a1917]">
            Ich bin Ilias. Und ich stehe hinter jedem System, <span className="t-serif text-[#94713f]">das wir bauen.</span>
          </h2>
          <p className="t-body-l text-[#5c5954]">
            Kein Callcenter, kein Vertriebsteam dazwischen. Ich habe TyloTech gegründet, um Handwerksbetrieben in NRW ein System zu geben, das Anfragen planbar macht: eine Methode, die wir selbst entwickelt haben, und eine Software, die uns gehört. Weil wir am Erfolg beteiligt sind, arbeite ich nur mit Betrieben, bei denen ich sicher bin, dass es trägt.
          </p>
          <ul className="flex flex-col gap-3">
            {["Gründer von TyloTech, Entwickler der Methode und von TyloHQ", "Am Erfolg beteiligt: wir verdienen nur, wenn du Aufträge gewinnst", "Ein Betrieb pro Gewerk und Stadt, persönlich betreut"].map((t) => (
              <li key={t} className="t-body-m flex items-start gap-3 text-[#1a1917]">
                <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full bg-[#e7f4ed]">
                  <Check className="size-[13px] text-[#1e7a52]" strokeWidth={2.4} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <GoldButton href={FORM} className="mt-2 w-full sm:w-auto">
            Kostenlose Konkurrenz-Analyse sichern
          </GoldButton>
        </div>
      </Container>
    </section>
  );
}

/* ---------- 07 · Gewerke ---------- */

const GEWERKE = [
  { label: "Sanitär-, Heizungs- & SHK-Betriebe", src: "/branchen/handwerk/tile-1.webp", text: "Badsanierung, Heizungstausch, Wärmepumpe. Anfragen von Hausbesitzern, die wirklich bauen wollen, nicht nur vergleichen." },
  { label: "Elektrobetriebe", src: "/branchen/handwerk/tile-2.webp", text: "Zählerschrank, Wallbox, PV-Anschluss. Planbare Projektanfragen statt Notdienst-Zufall." },
  { label: "Dachdecker", src: "/branchen/handwerk/tile-3.webp", text: "Neueindeckung, Dämmung, Reparatur. Projekte mit Volumen aus deinem Einzugsgebiet." },
  { label: "Solar- & Energietechnik", src: "/branchen/handwerk/tile-7.webp", text: "PV-Anlagen und Speicher für Eigenheimbesitzer, auf Wunsch kombiniert mit Wärmepumpe." },
  { label: "GaLaBau", src: "/branchen/handwerk/tile-5.webp", text: "Gartenneuanlage, Pflaster, Terrasse. Anfragen aus deiner Stadt, exklusiv für deinen Betrieb." },
  { label: "Rohrreinigung & Schlüsseldienst", src: "/branchen/handwerk/tile-6.webp", text: "Verstopfung, Kanal-TV, Notdienst. Wer zuerst gefunden wird, bekommt den Auftrag." },
];
const MORE = [
  { icon: Thermometer, label: "Wärmepumpe" },
  { icon: Palette, label: "Maler und Lackierer" },
  { icon: Grid2x2, label: "Fliesenleger" },
  { icon: Frame, label: "Fensterbau" },
  { icon: Fan, label: "Klimatechnik" },
  { icon: Layers, label: "Gerüstbau" },
  { icon: LayoutPanelTop, label: "Trockenbau" },
  { icon: Hammer, label: "Schreiner und Tischler" },
];
const CITIES = ["Düsseldorf", "Köln", "Essen", "Dortmund", "Duisburg", "Bochum", "Wuppertal", "Mönchengladbach", "Neuss", "Krefeld", "Oberhausen", "Solingen", "Leverkusen"];

export function Gewerke() {
  const root = useRef<HTMLElement>(null);
  useLazyGSAP(
    () => {
      head(st);
      gsap.from(".lpw-card", { y: 40, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.08, scrollTrigger: st(".lpw-grid") });
      gsap.from(".lpw-card img", { scale: 1.12, duration: 1.5, ease: "power2.out", stagger: 0.08, scrollTrigger: st(".lpw-grid") });
      gsap.from(".lpw-chip", { y: 14, opacity: 0, scale: 0.94, duration: 0.5, ease: "back.out(1.6)", stagger: 0.05, scrollTrigger: st(".lpw-more", "top 88%") });
      gsap.from(".lpw-exclusive", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: st(".lpw-more", "top 88%") });
    },
    { scope: root },
  );

  return (
    <section id="gewerke" ref={root} className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28">
      <Container>
        <div className="lp-head flex max-w-[640px] flex-col items-start gap-[18px]">
          <Pill icon={Wrench}>Für welche Betriebe</Pill>
          <h2 className="t-h2 text-[#1a1917]">
            Für diese Gewerke <span className="t-serif text-[#94713f]">bauen wir</span> das System.
          </h2>
          <p className="t-body-l text-[#5c5954]">Sechs Gewerke, in denen unser System bereits läuft. Dazu weitere Betriebe, für die wir es gerade aufbauen.</p>
        </div>

        <div className="lpw-grid mt-10 sm:mt-14">
          <SnapSlider label="Gewerke" className="lg:grid-cols-3 lg:gap-8">
            {GEWERKE.map((g) => (
              <article key={g.label} className="lpw-card group h-full overflow-hidden rounded-[22px] border border-[#eeedea] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.04)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(8,34,44,0.35)]">
                <div className="relative h-[210px] overflow-hidden rounded-[18px] sm:h-[258px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,14,13,0)_45%,rgba(15,14,13,0.75)_100%)]" />
                  <h3 className="absolute inset-x-5 bottom-[18px] font-display text-[17px] font-medium leading-[23px] tracking-[-0.3px] text-white">{g.label}</h3>
                </div>
                <p className="t-body-s px-5 pb-6 pt-5 text-[#5c5954]">{g.text}</p>
              </article>
            ))}
          </SnapSlider>
        </div>

        <div className="lpw-more mt-12 grid grid-cols-1 gap-10 sm:mt-14 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div>
            <p className="eyebrow text-[#7d7973]">Außerdem für</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {MORE.map((m) => (
                <li key={m.label} className="lpw-chip flex items-center gap-2.5 rounded-full border border-[#e2e0dc] bg-white py-2 pl-2 pr-5 shadow-[0_1px_2px_rgba(8,34,44,0.04)]">
                  <span className="grid size-[34px] place-items-center rounded-full bg-[#fbf6ee]">
                    <m.icon className="size-4 text-[#b98f53]" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="t-label-m text-[#1a1917]">{m.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lpw-exclusive rounded-[22px] border border-[#d1aa71] bg-[#fbf6ee] p-6 sm:p-7">
            <span className="grid size-11 place-items-center rounded-[12px] bg-white shadow-[0_1px_2px_rgba(8,34,44,0.06)]">
              <MapPin className="size-5 text-[#b98f53]" strokeWidth={1.8} aria-hidden />
            </span>
            <h3 className="mt-6 t-h5 text-[#1a1917] sm:text-[22px] sm:leading-[28px]">Ein Betrieb pro Gewerk und Stadt.</h3>
            <p className="t-body-s mt-3 text-[#5c5954]">
              Weil wir an deinem Erfolg beteiligt sind, arbeiten wir nie für zwei Betriebe desselben Gewerks in einer Stadt. Ist dein Platz vergeben, ist er vergeben.
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase leading-[16px] tracking-[0.4px] text-[#7d7973]">NRW: {CITIES.join(" · ")}</p>
            <p className="mt-5 flex items-start gap-2 text-[13px] font-medium leading-[18px] text-[#8a2a1e]">
              <Lock className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              Rohrreinigung in Düsseldorf und Neuss ist bereits vergeben.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- 08 · Stimmen ---------- */

export function Stimmen() {
  const root = useRef<HTMLElement>(null);
  useLazyGSAP(
    () => {
      head(st);
      gsap.from(".lps-card", { y: 40, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.12, scrollTrigger: st(".lps-grid") });
    },
    { scope: root },
  );
  const reviews = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapsQuery)}`;

  return (
    <section id="stimmen" ref={root} className="scroll-mt-20 bg-[#f6f5f3] py-14 sm:py-24 lg:py-28">
      <Container>
        <div className="lp-head flex max-w-[770px] flex-col items-start gap-[18px]">
          <Pill icon={Star}>Was Kunden sagen</Pill>
          <h2 className="t-h2 text-[#1a1917]">
            Was Kunden <span className="t-serif text-[#94713f]">sagen.</span>
          </h2>
          <p className="t-body-l text-[#5c5954]">Was Betriebe über uns sagen.</p>
        </div>

        <div className="lps-grid mt-10 sm:mt-14">
          <SnapSlider label="Kundenstimmen" className="lg:grid-cols-3 lg:gap-6">
            {[
              <div key="g" className="lps-card flex h-full flex-col items-start gap-[18px] rounded-[20px] border border-[#e2e0dc] bg-white p-7 sm:p-8">
                <div className="flex items-center gap-2.5">
                  <GoogleG />
                  <span className="text-[14px] font-medium leading-5 text-[#5c5954]">Google-Bewertungen</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="font-display text-[52px] font-semibold leading-[56px] tracking-[-1.8px] text-[#1a1917]">5,0</span>
                  <span className="flex flex-col gap-1">
                    <Stars />
                    <span className="text-[13px] leading-[18px] text-[#7d7973]">aus 31 Bewertungen</span>
                  </span>
                </div>
                <p className="t-body-s text-[#5c5954]">Wir bitten nach jedem abgeschlossenen Projekt um eine ehrliche Bewertung, auch dann, wenn nicht alles glattgelaufen ist.</p>
                <a
                  href={reviews}
                  target="_blank"
                  rel="noopener"
                  className="group mt-auto inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-[#1a1917] bg-white px-5 t-button sm:px-[22px] text-[#1a1917] transition-colors hover:bg-[#f6f5f3]"
                >
                  Alle Bewertungen ansehen
                  <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </a>
              </div>,
              <figure key="e" className="lps-card flex h-full flex-col gap-[22px] rounded-[20px] border border-[#e2e0dc] bg-white px-7 py-[30px] sm:px-8">
                <Quote className="size-[26px] text-[#c79a53]" fill="currentColor" strokeWidth={0} aria-hidden />
                <blockquote className="t-body-l text-[#1a1917]">TyloTech ist das Gegenteil der trägen Servicewüste Deutschland.</blockquote>
                <div className="h-px bg-[#eeedea]" />
                <figcaption className="flex items-center gap-3.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/lp/handwerk/avatar-enes.webp" alt="" loading="lazy" className="size-12 rounded-full border border-[#eeedea] object-cover object-top" />
                  <span>
                    <span className="block t-label-l text-[#1a1917]">Enes Seker</span>
                    <span className="block t-body-s text-[#7d7973]">Crusty Slices, Köln</span>
                  </span>
                </figcaption>
              </figure>,
              <figure key="r" className="lps-card flex h-full flex-col gap-4 rounded-[18px] border border-[#e2e0dc] bg-white px-7 py-[26px]">
                <div className="flex items-center justify-between">
                  <Stars />
                  <GoogleG size={20} />
                </div>
                <blockquote className="t-body-m text-[#5c5954]">Ich bin persönlich immer sehr skeptisch, aber hier wurde ich positiv überrascht. Er reagiert auf Nachrichten und Anliegen zeitnah.</blockquote>
                <figcaption className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/lp/handwerk/avatar-google.webp" alt="" loading="lazy" className="size-[38px] rounded-full border border-[#eeedea] object-cover" />
                  <span>
                    <span className="block t-label-m text-[#1a1917]">Google-Rezension</span>
                    <span className="block t-body-xs text-[#7d7973]">verifiziert, 5 von 5</span>
                  </span>
                </figcaption>
              </figure>,
            ]}
          </SnapSlider>
        </div>
      </Container>
    </section>
  );
}

/* ---------- 10 · Abschluss-CTA ---------- */

export function Abschluss() {
  const root = useRef<HTMLElement>(null);
  useLazyGSAP(
    () => {
      gsap.from(".lpa-panel", { y: 50, opacity: 0, scale: 0.97, duration: 1, ease: "power3.out", scrollTrigger: st(".lpa-panel", "top 88%") });
      gsap.from(".lpa-in > *", { y: 22, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.1, delay: 0.2, scrollTrigger: st(".lpa-panel", "top 85%") });
      gsap.to(".lpa-glow", { x: 60, y: -30, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root },
  );

  return (
    <section id="kontakt" ref={root} className="bg-white py-14 sm:py-24">
      <Container>
        <div className="lpa-panel relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0d4b61_0%,#03303f_45%,#01161f_100%)] px-6 py-14 shadow-[0_30px_70px_-30px_rgba(0,22,32,0.6)] sm:rounded-[32px] sm:px-12 sm:py-[76px]">
          <div aria-hidden className="lpa-glow pointer-events-none absolute left-[52%] top-[48%] h-[360px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(209,170,113,0.28),transparent)]" />
          <div className="lpa-in relative mx-auto flex max-w-[780px] flex-col items-center gap-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[14px] leading-5 text-white/90 backdrop-blur">
              <Search className="size-4 text-[#d8b682]" strokeWidth={1.8} aria-hidden />
              Kostenlose Konkurrenz-Analyse
            </p>
            <h2 className="t-h1 [--fs-d:50] [--lh-d:58] text-white">
              Wer gewinnt gerade <span className="t-serif text-white">die Aufträge</span> in deiner Stadt?
            </h2>
            <p className="t-body-l max-w-[680px] text-white/85">Finde es kostenlos heraus. Wir zeigen dir, welche Betriebe in deiner Stadt vorne liegen, was dich das jeden Monat kostet und ob dein Platz noch frei ist.</p>
            <a
              href={FORM}
              className="group mt-2 inline-flex h-[58px] items-center gap-3.5 rounded-full py-1.5 pl-1.5 pr-7 t-button text-[#0f0e0d] shadow-[0_0_40px_rgba(209,170,113,0.35),0_4px_14px_rgba(168,127,69,0.32),inset_0_1.5px_1.5px_rgba(255,255,255,0.45),inset_0_-1.5px_1.5px_rgba(109,83,48,0.25)] transition-[filter,translate] duration-200 [background:linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(255,255,255,0.02)_55%,rgba(255,255,255,0)_100%),linear-gradient(90deg,#efdcbc_0%,#d8b681_45%,#b4894d_100%)] hover:brightness-105 active:translate-y-px"
            >
              <span className="grid size-[46px] place-items-center rounded-full bg-[#03303f] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-[18px]" strokeWidth={2} aria-hidden />
              </span>
              <span>
                Jetzt <span className="font-[family-name:var(--font-instrument)] text-[18px] italic">kostenlos</span> prüfen
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

