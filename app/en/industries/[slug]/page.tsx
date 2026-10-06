import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BranchePage from "@/components/pages/BranchePage";
import { BRANCHEN } from "@/lib/branchen";
import { getBrancheFor } from "@/lib/branchenLocale";
import { BRANCHE_SLUG_EN, delocalizePath, languageAlternates } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANCHEN.map((b) => ({ slug: BRANCHE_SLUG_EN[b.slug] ?? b.slug }));
}

/** English slug → German data key */
const deSlug = (slug: string) => delocalizePath(`/en/industries/${slug}`).replace("/branchen/", "");

export async function generateMetadata(props: PageProps<"/en/industries/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const b = getBrancheFor(deSlug(slug), "en");
  if (!b) return {};
  return {
    title: b.metaTitle,
    description: b.metaDescription,
    alternates: { canonical: `/en/industries/${slug}`, languages: languageAlternates(`/branchen/${b.slug}`) },
    openGraph: { title: b.metaTitle, description: b.metaDescription, images: [b.hero.image], locale: "en_GB" },
  };
}

export default async function Page(props: PageProps<"/en/industries/[slug]">) {
  const { slug } = await props.params;
  const b = getBrancheFor(deSlug(slug), "en");
  if (!b) notFound();
  return <BranchePage b={b} />;
}
