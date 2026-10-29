import type { Metadata } from "next";
import SoftwarePage from "@/components/pages/SoftwarePage";
import { languageAlternates } from "@/lib/i18n";

const title = "Eigene Firmen-Software zum Festpreis | TyloTech";
const description =
  "Wir bauen dir deine eigene Firmen-Software, bis alles stimmt: fester Preis, erste Version in 6 Wochen live, App-Bauplan (Wert 1.000 €) vorab kostenlos. Nur 5 Plätze pro Monat.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/software", languages: languageAlternates("/software") },
  openGraph: { title, description, images: ["/software/vsl.webp"] },
};

export default function Page() {
  return <SoftwarePage />;
}
