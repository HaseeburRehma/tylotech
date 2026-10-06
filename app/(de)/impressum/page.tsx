import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";
import { languageAlternates } from "@/lib/i18n";
import { IMPRESSUM } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum — TyloTech",
  description: "Impressum von TyloTech, Behrenstraße 4, 40233 Düsseldorf.",
  alternates: { canonical: "/impressum", languages: languageAlternates("/impressum") },
};

export default function ImpressumPage() {
  return (
    <>
      <Nav />
      <main>
        <LegalPage doc={IMPRESSUM} icon="file-text" />
      </main>
      <Footer />
    </>
  );
}
