"use client";

import { useRef, useState } from "react";
import {
  Hammer,
  MapPin,
  ShoppingCart,
  Building2,
  TrendingUp,
  Briefcase,
  Globe,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLocale, useLocalePath, useT } from "../i18n/LocaleProvider";

type IndustryText = {
  name: string;
  lead: string;
  accent: string;
  body: string;
};

type Industry = IndustryText & {
  icon: LucideIcon;
  img: string;
  tint: string;
  /** English copy; `name` (German) stays the key for slugs and React keys */
  en: IndustryText;
};

const SLUGS: Record<string, string> = {
  "Online-Dienstleistungen": "online-dienstleistungen",
  Handwerk: "handwerk",
  "Lokale Dienstleister": "lokale-dienstleister",
  "E-Commerce": "e-commerce",
  "B2B-Dienstleistung": "b2b-dienstleistung",
  "Finanz & Investment": "finanz-investment",
};

const INDUSTRIES: Industry[] = [
  {
    name: "Online-Dienstleistungen",
    lead: "Expertise sichtbar machen,",
    accent: "Kunden gewinnen.",
    body: "Coaches, Berater, Software- und Online-Anbieter: Wir schärfen deine Positionierung, bauen Autorität auf und verwandeln Besucher in zahlende Kunden. Mit einem System, das nicht nur an dir hängt.",
    icon: Globe,
    img: "/branchen/online.jpg",
    tint: "from-[#e9dccb] to-[#c9a774]",
    en: {
      name: "Online Services",
      lead: "Make your expertise visible,",
      accent: "win clients.",
      body: "Coaches, consultants, software and online providers: we sharpen your positioning, build authority and turn visitors into paying clients. With a system that doesn’t depend on you alone.",
    },
  },
  {
    name: "Handwerk",
    lead: "Sichtbarkeit, die",
    accent: "Aufträge bringt.",
    body: "Sanierung, Elektro, Rohrreinigung: Betriebe, die nicht mehr Klicks brauchen, sondern volle Kalender. Wir bauen Auftritt, Anfragestrecke und Kampagnen, die funktionieren.",
    icon: Hammer,
    img: "/branchen/handwerk.jpg",
    tint: "from-[#e7d8c2] to-[#cba46f]",
    en: {
      name: "Trades & Crafts",
      lead: "Visibility that",
      accent: "brings in jobs.",
      body: "Renovation, electrical, drain cleaning: businesses that don’t need more clicks, they need full calendars. We build the presence, the enquiry funnel and the campaigns that work.",
    },
  },
  {
    name: "Lokale Dienstleister",
    lead: "Gefunden werden,",
    accent: "wo es zählt.",
    body: "Reinigung, Pflege, Gastronomie, Fahrschulen: lokale Betriebe, die bei jeder Suche im Umkreis ganz oben stehen sollen. Wir sorgen für Sichtbarkeit und planbare Anfragen.",
    icon: MapPin,
    img: "/branchen/lokale-dienstleister.jpg",
    tint: "from-[#d7e2e6] to-[#a9c2ca]",
    en: {
      name: "Local Services",
      lead: "Get found",
      accent: "where it counts.",
      body: "Cleaning, care, restaurants, driving schools: local businesses that belong at the top of every nearby search. We deliver the visibility and a steady flow of enquiries.",
    },
  },
  {
    name: "E-Commerce",
    lead: "Mehr verkaufen,",
    accent: "nicht nur mehr Traffic.",
    body: "Onlineshops, Marktplätze, D2C-Brands: Wir optimieren Conversion, Bestellstrecke und Kampagnen so, dass aus Besuchern Käufer werden. Messbar, nicht nach Bauchgefühl.",
    icon: ShoppingCart,
    img: "/branchen/ecommerce.jpg",
    tint: "from-[#ebd9c0] to-[#d9a86a]",
    en: {
      name: "E-Commerce",
      lead: "Sell more,",
      accent: "not just get more traffic.",
      body: "Online shops, marketplaces, D2C brands: we optimise conversion, checkout and campaigns so visitors become buyers. Measurably, not by gut feeling.",
    },
  },
  {
    name: "B2B-Dienstleistung",
    lead: "Leads generieren,",
    accent: "die wirklich kaufen.",
    body: "Agenturen, Beratungen, IT-Dienstleister: Wir bauen Funnels und Systeme, die qualifizierte Anfragen liefern, statt nur Reichweite ohne Ergebnis.",
    icon: Building2,
    img: "/branchen/b2b.jpg",
    tint: "from-[#dbe0d9] to-[#b3c0ab]",
    en: {
      name: "B2B Services",
      lead: "Generate leads",
      accent: "that actually buy.",
      body: "Agencies, consultancies, IT service providers: we build funnels and systems that deliver qualified enquiries, not just reach without results.",
    },
  },
  {
    name: "Finanz & Investment",
    lead: "Vertrauen aufbauen,",
    accent: "digital skalieren.",
    body: "Finanzberater, Vermögensverwaltung, Investment: Wir schaffen den digitalen Auftritt, der Kompetenz zeigt und Vertrauen aufbaut, bevor das erste Gespräch stattfindet.",
    icon: TrendingUp,
    img: "/branchen/finanz.jpg",
    tint: "from-[#e6dcc9] to-[#c9b389]",
    en: {
      name: "Finance & Investment",
      lead: "Build trust,",
      accent: "scale digitally.",
      body: "Financial advisers, wealth management, investment: we create the digital presence that shows expertise and builds trust before the first conversation even happens.",
    },
  },
];

const STEPS = INDUSTRIES.length;
const pad = (n: number) => String(n).padStart(2, "0");

export default function Branchen() {
  const root = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useT();
  const lp = useLocalePath();
  /** visible copy for the current language */
  const tx = (ind: Industry): IndustryText => (locale === "en" ? ind.en : ind);
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
        scrollTrigger: { trigger: ".br-head", start: "top 82%" , toggleActions: "play none none none" },
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
    <section id="branchen" ref={root} className="bg-[#f3f5f6] lg:h-[336vh]">
      <div className="py-14 sm:py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0">
        <Container className="w-full">
          <div className="br-head max-w-[720px]">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 eyebrow text-[#94713f] shadow-[0_1px_0_rgba(15,14,13,0.02)]">
              <Briefcase className="size-3.5 text-accent" />
              {t("Erprobt, nicht theoretisch", "Proven, not theoretical")}
            </p>
            <h2 className="t-h2 mt-5 text-ink">
              {t("Wo wir uns", "Industries we")}{" "}
              <span className="t-serif tracking-[inherit] text-[#a07d45] max-sm:tracking-[-0.5px]">
                {t("auskennen", "know inside out")}
              </span>
              .
            </h2>
            <p className="t-body-l mt-4 max-w-[560px] text-[#5c5954]">
              {t(
                "Vom Handwerksbetrieb bis zum Mittelständer: Wir haben in vielen Branchen gebaut und wissen, was funktioniert. Handwerk, Dienstleistung, lokale Betriebe, E-Commerce, spezialisierte Nischen.",
                "From the local trades business to the established mid-sized company: we’ve built across many industries and know what works. Trades, services, local businesses, e-commerce, specialist niches.",
              )}
            </p>
          </div>

          {/* card */}
          <div className="mt-8 rounded-[28px] border border-line bg-white p-4 shadow-[0_40px_90px_-55px_rgba(15,14,13,0.3)] sm:mt-12 sm:p-6 lg:p-8">
            <div className="grid items-stretch gap-5 lg:grid-cols-[170px_minmax(0,1fr)_minmax(240px,300px)] lg:gap-7 xl:grid-cols-[220px_minmax(0,1fr)_minmax(300px,380px)] xl:gap-10">
              {/* list */}
              <ul className="order-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:order-1 lg:flex lg:flex-col lg:gap-1.5">
                {INDUSTRIES.map((ind, i) => {
                  const on = active === i;
                  return (
                    <li key={ind.name} className="min-w-0">
                      <button
                        type="button"
                        aria-current={on}
                        onClick={() => pick(i)}
                        className={`flex h-full w-full items-baseline gap-2 rounded-[14px] px-3 py-2.5 text-left transition-colors duration-300 sm:px-4 sm:py-3 lg:flex-col lg:items-start lg:gap-1 ${
                          on
                            ? "bg-[#0b2b39] shadow-[0_10px_24px_-14px_rgba(11,43,57,0.55)]"
                            : "bg-[#f6f5f3] hover:bg-black/[0.04] lg:bg-transparent"
                        }`}
                      >
                        <span
                          className={`eyebrow transition-colors ${
                            on ? "text-[#d1aa71]" : "text-ink/35"
                          }`}
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          className={`t-title-s min-w-0 transition-colors ${
                            on ? "text-white" : "text-ink/65"
                          }`}
                        >
                          {tx(ind).name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* content */}
              <div className="order-2 flex flex-col justify-center px-1 lg:px-2">
                <h3 className="font-display font-semibold text-[clamp(26px,calc(26px_+_8_*_(100vw_-_390px)_/_1050),34px)] leading-[clamp(32px,calc(32px_+_9_*_(100vw_-_390px)_/_1050),41px)] tracking-[clamp(-1px,calc(-0.8px_-_0.2_*_(100vw_-_390px)_/_1050),-0.8px)] text-ink">
                  {tx(it).lead}{" "}
                  <span className="t-serif text-[#a07d45]">
                    {tx(it).accent}
                  </span>
                </h3>
                <p className="t-body-m mt-4 max-w-[400px] text-[#5c5954]">
                  {tx(it).body}
                </p>
                <Link
                  href={lp(`/branchen/${SLUGS[it.name]}`)}
                  className="group mt-5 inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-[#d1aa71] decoration-2 underline-offset-[5px] transition-colors hover:text-[#94713f]"
                >
                  {t("Zur Branchenseite", "View industry page")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <p className="eyebrow mt-6 text-ink/40">
                  {pad(active + 1)} {t("von", "of")} {pad(STEPS)}
                </p>
              </div>

              {/* image */}
              <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-line lg:order-3 lg:aspect-auto lg:h-full lg:min-h-[320px]">
                {INDUSTRIES.map((ind, i) => {
                  const Icon = ind.icon;
                  return (
                    <div
                      key={ind.name}
                      className="absolute inset-0 transition-opacity duration-700 ease-out"
                      style={{ opacity: active === i ? 1 : 0 }}
                      aria-hidden={active !== i}
                    >
                      <div
                        className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${ind.tint}`}
                      >
                        <Icon className="size-16 text-white/45" strokeWidth={1} />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async"
                        src={ind.img}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {/* subtle vignette overlay */}
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
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
