import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import KontaktHero from "@/components/kontakt/KontaktHero";
import KontaktStandort from "@/components/kontakt/KontaktStandort";
import KontaktBewertungen from "@/components/kontakt/KontaktBewertungen";
import { getGoogleReviews } from "@/lib/reviews";
import { BRANCHE_OPTIONS } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Kontakt — TyloTech",
  description: "Erstgespräch anfragen, anrufen oder vorbeikommen: TyloTech, Behrenstraße 4, 40233 Düsseldorf. Tel. 0211 15847097, info@tylotech.de.",
  alternates: { canonical: "/kontakt" },
};

export default async function KontaktPage(props: PageProps<"/kontakt">) {
  // /kontakt?branche=handwerk preselects the industry the visitor came from
  const { branche } = await props.searchParams;
  const initialBranche = BRANCHE_OPTIONS.some((o) => o.value === branche) ? (branche as string) : "";
  const reviews = await getGoogleReviews();
  return (
    <>
      <Nav />
      <main>
        <KontaktHero initialBranche={initialBranche} />
        <KontaktStandort />
        <KontaktBewertungen data={reviews} />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
