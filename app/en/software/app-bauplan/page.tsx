import type { Metadata } from "next";
import SoftwarePage from "@/components/pages/SoftwarePage";
import { languageAlternates } from "@/lib/i18n";

/* Ads URL for the software landing page (Meta campaigns), canonical → /en/software. */
const title = "Free app blueprint for your company software | TyloTech";
const description =
  "Get your app blueprint (worth €1,000) for free: we plan your own company software, build it at a fixed price and put the first version live in 6 weeks. Only 5 spots a month.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/en/software", languages: languageAlternates("/software") },
  openGraph: { title, description, images: ["/software/vsl.webp"], locale: "en_GB" },
};

export default function Page() {
  return <SoftwarePage />;
}
