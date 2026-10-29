import type { Metadata } from "next";
import CaseStudiesPage from "@/components/pages/CaseStudiesPage";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Case Studies | TyloTech",
  description: "Echte Projekte, echte Zahlen: wie TyloTech für Crusty Slices und Fahrschule Abgefahrn Marke, Website, Social Media und Kampagnen aufgebaut hat.",
  alternates: { canonical: "/case-studies", languages: languageAlternates("/case-studies") },
  openGraph: { title: "Case Studies | TyloTech", images: ["/case-studies/crusty-slices/hero.webp"] },
};

export default function Page() {
  return <CaseStudiesPage />;
}
