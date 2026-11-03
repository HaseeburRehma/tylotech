import Footer from "@/components/Footer";
import TrustStrip from "@/components/sections/TrustStrip";
import FAQ from "@/components/sections/FAQ";
import { LandingHeader } from "@/components/software/LandingChrome";
import Hero from "@/components/lp/handwerk/Hero";
import { CaseNouh, CaseRohr } from "@/components/lp/handwerk/Cases";
import Methode from "@/components/lp/handwerk/Methode";
import { Abschluss, Gewerke, Gruender, Stimmen, Vergleich } from "@/components/lp/handwerk/Sections";
import { FORM } from "@/components/lp/handwerk/ui";

/* Handwerk campaign page (/handwerk-anfragen), section order as in Figma. */

const FAQ_ITEMS = [
  {
    q: "Wie läuft die kostenlose Konkurrenz-Analyse ab?",
    a: "Du trägst Gewerk und Stadt ein. Wir schauen uns an, welche Betriebe in deiner Stadt aktuell die Anfragen gewinnen und was dich das jeden Monat kostet. Innerhalb von 24 Stunden bekommst du einen Anruf mit den Ergebnissen. Kostenlos und ohne Verpflichtung.",
  },
  {
    q: "Was kostet mich das?",
    a: "Die Analyse ist kostenlos. Für die Zusammenarbeit gilt: Wir partizipieren an deinem Erfolg und verdienen erst richtig, wenn du verdienst. Die Details besprechen wir am Telefon, passend zu deinem Betrieb.",
  },
  {
    q: "Warum nur ein Betrieb pro Gewerk und Stadt?",
    a: "Weil wir an deinem Erfolg beteiligt sind, können wir nicht gleichzeitig für deinen Mitbewerber arbeiten. Ein Platz pro Gewerk und Stadt. Ist er vergeben, ist die Stadt für dieses Gewerk geschlossen.",
  },
  {
    q: "Woher kommen die Anfragen?",
    a: "Aus unserer bewährten Methode, einem Mix aus Online-Marketing, und unserer eigenen Software TyloHQ, die jede Anfrage erfasst und in Echtzeit in deine App liefert. Keine gekauften Leads, keine geteilten Nummern.",
  },
  {
    q: "Wie schnell geht es los?",
    a: "Nach dem Gespräch richten wir dein System in der Regel innerhalb weniger Wochen ein. Die ersten Anfragen kommen, sobald das System in deiner Stadt läuft.",
  },
];

export default function HandwerkLandingPage() {
  return (
    <>
      <LandingHeader cta={{ href: FORM, label: "Kostenlose Analyse" }} note="Nur ein Betrieb pro Gewerk und Stadt" />
      <main>
        <Hero />
        <CaseRohr />
        <CaseNouh />
        <Methode />
        <Vergleich />
        <Gruender />
        <Gewerke />
        <Stimmen />
        <TrustStrip tone="branche" />
        <FAQ
          items={FAQ_ITEMS}
          tone="branche"
          title={{ lead: "Noch Fragen?", accent: "Kurz beantwortet." }}
          hint={{
            text: "Dann lass uns deine Stadt einfach kostenlos prüfen. Die Analyse verpflichtet dich zu nichts, und du weißt danach genau, wo du stehst.",
            cta: "Stadt kostenlos prüfen",
            href: FORM,
          }}
          className="scroll-mt-20 bg-white py-14 sm:py-24 lg:py-28"
        />
        <Abschluss />
      </main>
      <Footer />
    </>
  );
}
