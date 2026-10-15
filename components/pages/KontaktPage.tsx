import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import KontaktHero from "@/components/kontakt/KontaktHero";
import KontaktStandort from "@/components/kontakt/KontaktStandort";
import KontaktWege from "@/components/kontakt/KontaktWege";
import TrustStrip from "@/components/sections/TrustStrip";
import FAQ from "@/components/sections/FAQ";
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
        {/* Figma "TyloTech - Kontakt": Kontakt · Partner · Wege · Standort · FAQ */}
        <KontaktHero initialBranche={initialBranche} rating={{ value: reviews.rating, count: reviews.count, url: reviews.url }} />
        <TrustStrip tone="branche" />
        <KontaktWege />
        <KontaktStandort />
        <FAQ tone="branche" />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
