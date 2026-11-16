import type { Metadata } from "next";
import CaseStudiesPage from "@/components/pages/CaseStudiesPage";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Case Studies | TyloTech",
  description: "Echte Projekte, echte Zahlen: wie TyloTech Marken, Websites, Kampagnen und Software gebaut hat, für Crusty Slices, Fahrschule Abgefahrn, Selmir Suljkanovic, LokShift und Priya's Cleaning Service.",
  alternates: { canonical: "/case-studies", languages: languageAlternates("/case-studies") },
  openGraph: { title: "Case Studies | TyloTech", images: ["/case-studies/crusty-slices/hero.webp"] },
};

export default function Page() {
  return <CaseStudiesPage />;
}
