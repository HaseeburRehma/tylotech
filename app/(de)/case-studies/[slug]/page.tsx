import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/pages/CaseStudyPage";
import { CASE_STUDIES, getCaseStudy } from "@/lib/caseStudies";
import { languageAlternates } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCaseStudy(slug);
  if (!c) return {};
  return {
    title: c.seo.title.de,
    description: c.seo.description.de,
    alternates: { canonical: `/case-studies/${c.slug}`, languages: languageAlternates(`/case-studies/${c.slug}`) },
    openGraph: { title: c.seo.title.de, description: c.seo.description.de, images: [c.hero.slides[0].src] },
  };
}

export default async function Page(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const c = getCaseStudy(slug);
  if (!c) notFound();
  return <CaseStudyPage c={c} />;
}
