import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";
import { languageAlternates } from "@/lib/i18n";
import { DATENSCHUTZ } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | TyloTech",
  description: "Wie TyloTech personenbezogene Daten auf tylotech.de verarbeitet und welche Rechte du hast.",
  alternates: { canonical: "/datenschutz", languages: languageAlternates("/datenschutz") },
};

export default function DatenschutzPage() {
  return (
    <>
      <Nav />
      <main>
        <LegalPage doc={DATENSCHUTZ} icon="shield-check" />
      </main>
      <Footer />
    </>
  );
}
