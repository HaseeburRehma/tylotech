import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import KontaktHero from "@/components/kontakt/KontaktHero";
import KontaktStandort from "@/components/kontakt/KontaktStandort";
import KontaktBewertungen from "@/components/kontakt/KontaktBewertungen";
import { getGoogleReviews } from "@/lib/reviews";
import { BRANCHE_OPTIONS } from "@/lib/contact";
import { BRANCHE_SLUG_EN } from "@/lib/i18n";

const FROM_EN = Object.fromEntries(Object.entries(BRANCHE_SLUG_EN).map(([de, en]) => [en, de]));

/** `branche` (?branche=handwerk) preselects the industry the visitor came from. */
export default async function KontaktPage({ branche }: { branche?: string | string[] }) {
  // accepts the German slug (canonical) or its English counterpart (?branche=trades)
  const raw = typeof branche === "string" ? (FROM_EN[branche] ?? branche) : "";
  const initialBranche = BRANCHE_OPTIONS.some((o) => o.value === raw) ? raw : "";
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
