import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import TrustStrip from "@/components/sections/TrustStrip";
import { CasesHero, CasesList } from "@/components/case-study/CaseOverviewList";
import CaseCTA from "@/components/case-study/CaseCTA";

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <main>
        <CasesHero />
        <CasesList />
        <TrustStrip tone="branche" />
        <CaseCTA />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
