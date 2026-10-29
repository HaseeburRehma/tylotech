import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingActionBar from "@/components/FloatingActionBar";
import SoftwareHero from "@/components/software/SoftwareHero";
import SoftwareProblem from "@/components/software/SoftwareProblem";
import SoftwareLoesung from "@/components/software/SoftwareLoesung";
import SoftwareReferenzen from "@/components/software/SoftwareReferenzen";
import SoftwareAngebot from "@/components/software/SoftwareAngebot";
import SoftwareAblauf from "@/components/software/SoftwareAblauf";
import SoftwareAuswahl from "@/components/software/SoftwareAuswahl";
import SoftwareBewerbung from "@/components/software/SoftwareBewerbung";
import SoftwareFAQ from "@/components/software/SoftwareFAQ";
import SoftwareCTA from "@/components/software/SoftwareCTA";

/* Figma "Software · Landing Page" (desktop 5014:2, mobile 5024:689). */
export default function SoftwarePage() {
  return (
    <>
      <Nav />
      <main>
        <SoftwareHero />
        <SoftwareProblem />
        <SoftwareLoesung />
        <SoftwareReferenzen />
        <SoftwareAngebot />
        <SoftwareAblauf />
        <SoftwareAuswahl />
        <SoftwareBewerbung />
        <SoftwareFAQ />
        <SoftwareCTA />
      </main>
      <Footer />
      <FloatingActionBar />
    </>
  );
}
