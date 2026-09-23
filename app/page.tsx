import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import Praxis from "@/components/sections/Praxis";
import Diagnose from "@/components/sections/Diagnose";
import Wechsel from "@/components/sections/Wechsel";
import Warum from "@/components/sections/Warum";
import Leistungen from "@/components/sections/Leistungen";
import Zahlen from "@/components/sections/Zahlen";
import Wachstum from "@/components/sections/Wachstum";
import Globe from "@/components/sections/Globe";
import Ablauf from "@/components/sections/Ablauf";
import Arbeitsweise from "@/components/sections/Arbeitsweise";
import TyloHQ from "@/components/sections/TyloHQ";
import Team from "@/components/sections/Team";
import Gruender from "@/components/sections/Gruender";
import Podcast from "@/components/sections/Podcast";
import Branchen from "@/components/sections/Branchen";
import Referenzen from "@/components/sections/Referenzen";
import OToene from "@/components/sections/OToene";
import Stimmen from "@/components/sections/Stimmen";
import Vergleich from "@/components/sections/Vergleich";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <Praxis />
        <Diagnose />
        <Wechsel />
        <Warum />
        <Leistungen />
        <Zahlen />
        <Wachstum />
        <Globe />
        <Ablauf />
        <Arbeitsweise />
        <TyloHQ />
        <Team />
        <Gruender />
        <Podcast />
        <Branchen />
        <Referenzen />
        <OToene />
        <Stimmen />
        <Vergleich />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
