import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import CaseHero from "@/components/case-study/CaseHero";
import CaseResults from "@/components/case-study/CaseResults";
import { CaseApproach, CaseBrand, CaseChallenges, CaseInsights, CaseOverview } from "@/components/case-study/CaseStory";
import { CaseLearnings, CaseMobile, CaseOffline, CaseSocial, CaseWebsite } from "@/components/case-study/CaseShowcase";
import CaseNext from "@/components/case-study/CaseNext";
import CaseCTA from "@/components/case-study/CaseCTA";
import type { CaseStudy } from "@/lib/caseStudies";

/* Figma "Case Study · …" template, section order 01–14. */
export default function CaseStudyPage({ c }: { c: CaseStudy }) {
  return (
    <>
      <Nav />
      <main>
        <CaseHero c={c} />
        <CaseResults c={c} />
        <CaseOverview c={c} />
        <CaseChallenges c={c} />
        <CaseInsights c={c} />
        <CaseApproach c={c} />
        <CaseBrand c={c} />
        <CaseWebsite c={c} />
        <CaseMobile c={c} />
        <CaseSocial c={c} />
        <CaseOffline c={c} />
        <CaseLearnings c={c} />
        <CaseNext current={c} />
        <CaseCTA />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
