import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";
import { languageAlternates } from "@/lib/i18n";
import { IMPRESSUM_EN } from "@/lib/legal.en";

export const metadata: Metadata = {
  title: "Legal Notice | TyloTech",
  description: "Legal notice (Impressum) of TyloTech, Behrenstraße 4, 40233 Düsseldorf, Germany.",
  alternates: { canonical: "/en/imprint", languages: languageAlternates("/impressum") },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <LegalPage doc={IMPRESSUM_EN} icon="file-text" />
      </main>
      <Footer />
    </>
  );
}
