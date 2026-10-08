import type { Metadata } from "next";
import KontaktPage from "@/components/pages/KontaktPage";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Kontakt | TyloTech",
  description: "Erstgespräch anfragen, anrufen oder vorbeikommen: TyloTech, Behrenstraße 4, 40233 Düsseldorf. Tel. 0211 15847097, info@tylotech.de.",
  alternates: { canonical: "/kontakt", languages: languageAlternates("/kontakt") },
};

export default async function Page(props: PageProps<"/kontakt">) {
  const { branche } = await props.searchParams;
  return <KontaktPage branche={branche} />;
}
