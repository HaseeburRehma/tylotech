import type { Metadata } from "next";
import KontaktPage from "@/components/pages/KontaktPage";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact | TyloTech",
  description: "Book an initial consultation, call us or drop by: TyloTech, Behrenstraße 4, 40233 Düsseldorf, Germany. Phone +49 211 15847097, info@tylotech.de.",
  alternates: { canonical: "/en/contact", languages: languageAlternates("/kontakt") },
};

export default async function Page(props: PageProps<"/en/contact">) {
  const { branche } = await props.searchParams;
  return <KontaktPage branche={branche} />;
}
