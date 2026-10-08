import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tylotech.de"),
  title: "TyloTech | Marketing × Digitalisation",
  description:
    "Marketing, software, digitalisation and company building from a single source. Clear, direct, no compromises.",
  alternates: { canonical: "/en", languages: { de: "/", en: "/en", "x-default": "/" } },
  openGraph: { locale: "en_GB", siteName: "TyloTech" },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
