import type { Metadata } from "next";
import CaseStudiesPage from "@/components/pages/CaseStudiesPage";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Case Studies | TyloTech",
  description: "Real projects, real numbers: how TyloTech built brands, websites, campaigns and software for Crusty Slices, Fahrschule Abgefahrn, Selmir Suljkanovic, LokShift and Priya's Cleaning Service.",
  alternates: { canonical: "/en/case-studies", languages: languageAlternates("/case-studies") },
  openGraph: { title: "Case Studies | TyloTech", images: ["/case-studies/crusty-slices/hero.webp"], locale: "en_GB" },
};

export default function Page() {
  return <CaseStudiesPage />;
}
