import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { BRANCHEN, getBranche } from "@/lib/branchen";

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANCHEN.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/branchen/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const b = getBranche(slug);
  if (!b) return {};
  return {
    title: b.metaTitle,
    description: b.metaDescription,
    alternates: { canonical: `/branchen/${b.slug}` },
    openGraph: { title: b.metaTitle, description: b.metaDescription, images: [b.hero.image] },
  };
}

export default async function BranchePage(props: PageProps<"/branchen/[slug]">) {
  const { slug } = await props.params;
  const b = getBranche(slug);
  if (!b) notFound();

  return (
    <>
      <Nav />
      <main>
        <BrancheHero b={b} />
        <TrustStrip />
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
