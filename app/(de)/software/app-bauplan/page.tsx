import type { Metadata } from "next";
import SoftwarePage from "@/components/pages/SoftwarePage";
import { languageAlternates } from "@/lib/i18n";

/* Ads URL for the software landing page (Meta campaigns). Same page as /software;
   the canonical points there so search engines keep one version. */
const title = "Kostenloser App-Bauplan für deine Firmen-Software | TyloTech";
const description =
  "Hol dir deinen App-Bauplan (Wert 1.000 €) kostenlos: wir planen deine eigene Firmen-Software, bauen sie zum Festpreis und bringen die erste Version in 6 Wochen live. Nur 5 Plätze pro Monat.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/software", languages: languageAlternates("/software") },
  openGraph: { title, description, images: ["/software/vsl.webp"] },
};

export default function Page() {
  return <SoftwarePage />;
}
