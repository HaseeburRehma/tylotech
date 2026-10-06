import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";
import { languageAlternates } from "@/lib/i18n";
import { DATENSCHUTZ_EN } from "@/lib/legal.en";

export const metadata: Metadata = {
  title: "Privacy Policy — TyloTech",
  description: "How TyloTech processes personal data on tylotech.de and what rights you have.",
  alternates: { canonical: "/en/privacy", languages: languageAlternates("/datenschutz") },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <LegalPage doc={DATENSCHUTZ_EN} icon="shield-check" />
      </main>
      <Footer />
    </>
  );
}
