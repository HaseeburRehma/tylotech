import type { Metadata } from "next";
import SoftwarePage from "@/components/pages/SoftwarePage";
import { languageAlternates } from "@/lib/i18n";

const title = "Custom company software at a fixed price | TyloTech";
const description =
  "We build your own company software until everything’s right: fixed price, first version live in 6 weeks, app blueprint (worth €1,000) up front for free. Only 5 spots a month.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/en/software", languages: languageAlternates("/software") },
  openGraph: { title, description, images: ["/software/vsl.webp"], locale: "en_GB" },
};

export default function Page() {
  return <SoftwarePage landing />;
}
