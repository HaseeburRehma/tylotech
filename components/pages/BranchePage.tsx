import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import TrustStrip from "@/components/sections/TrustStrip";
import FAQ from "@/components/sections/FAQ";
import BrancheHero from "@/components/branche/BrancheHero";
import BrancheKennst from "@/components/branche/BrancheKennst";
import BrancheLoesung from "@/components/branche/BrancheLoesung";
import BranchePains from "@/components/branche/BranchePains";
import BrancheSystem from "@/components/branche/BrancheSystem";
import BrancheGeo from "@/components/branche/BrancheGeo";
import BrancheFuerWen from "@/components/branche/BrancheFuerWen";
import BrancheCase from "@/components/branche/BrancheCase";
import BrancheUeberUns from "@/components/branche/BrancheUeberUns";
import BrancheCTA from "@/components/branche/BrancheCTA";
import type { Branche } from "@/lib/branchen";

export default function BranchePage({ b }: { b: Branche }) {
  return (
    <>
      <Nav />
      <main>
        <BrancheHero b={b} />
        <TrustStrip tone="branche" />
        <BrancheKennst b={b} />
        <BrancheLoesung b={b} />
        <BranchePains b={b} />
        <BrancheSystem b={b} />
        <BrancheGeo />
        <BrancheFuerWen b={b} />
        <BrancheCase b={b} />
        <BrancheUeberUns />
        <FAQ items={b.faq} tone="branche" />
        <BrancheCTA b={b} />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
