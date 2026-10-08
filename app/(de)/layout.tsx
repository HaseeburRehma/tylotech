import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tylotech.de"),
  title: "TyloTech | Marketing × Digitalisierung",
  description:
    "Marketing, Software, Digitalisierung und Unternehmensaufbau aus einer Hand. Klar, direkt, ohne Kompromisse.",
  alternates: { canonical: "/", languages: { de: "/", en: "/en", "x-default": "/" } },
  openGraph: { locale: "de_DE", siteName: "TyloTech" },
};

export default function GermanRootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="de">{children}</RootDocument>;
}
