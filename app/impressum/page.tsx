import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";
import { IMPRESSUM } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum — TyloTech",
  description: "Impressum von TyloTech, Behrenstraße 4, 40233 Düsseldorf.",
  alternates: { canonical: "/impressum" },
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
