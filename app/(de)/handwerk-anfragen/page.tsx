import type { Metadata } from "next";
import HandwerkLandingPage from "@/components/pages/HandwerkLandingPage";

/* Campaign landing page for trades in NRW (Figma "Local Lead-Gen · Landing Page").
   German only; kept out of search results so it doesn't compete with /branchen/handwerk. */
const title = "Mehr Aufträge für dein Handwerk | Kostenlose Konkurrenz-Analyse | TyloTech";
const description =
  "Keine gekauften Leads, keine geteilten Nummern: unsere Methode und unsere Software TyloHQ liefern Anfragen aus deiner Stadt direkt in deine App. Nur ein Betrieb pro Gewerk und Stadt. Jetzt kostenlos prüfen.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/handwerk-anfragen" },
  robots: { index: false, follow: true },
  openGraph: { title, description, images: ["/branchen/handwerk/tile-1.webp"] },
};

export default function Page() {
  return <HandwerkLandingPage />;
}
