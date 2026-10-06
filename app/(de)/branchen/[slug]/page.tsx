import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BranchePage from "@/components/pages/BranchePage";
import { BRANCHEN, getBranche } from "@/lib/branchen";
import { languageAlternates } from "@/lib/i18n";

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
    alternates: { canonical: `/branchen/${b.slug}`, languages: languageAlternates(`/branchen/${b.slug}`) },
    openGraph: { title: b.metaTitle, description: b.metaDescription, images: [b.hero.image] },
  };
}

export default async function Page(props: PageProps<"/branchen/[slug]">) {
  const { slug } = await props.params;
  const b = getBranche(slug);
  if (!b) notFound();
  return <BranchePage b={b} />;
}
