import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import KontaktHero from "@/components/kontakt/KontaktHero";
import KontaktStandort from "@/components/kontakt/KontaktStandort";
import KontaktBewertungen from "@/components/kontakt/KontaktBewertungen";
import { getGoogleReviews } from "@/lib/reviews";
import { BRANCHE_OPTIONS } from "@/lib/contact";

/** `branche` (?branche=handwerk) preselects the industry the visitor came from. */
export default async function KontaktPage({ branche }: { branche?: string | string[] }) {
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
