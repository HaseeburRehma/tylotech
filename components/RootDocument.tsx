import "@/app/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CookieBanner from "@/components/CookieBanner";
import TyloLensLazy from "@/components/TyloLensLazy";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";

/** <html>/<body> shared by the German and the English root layout. */
export default function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${fontVariables} antialiased`}>
      <body>
        <LocaleProvider locale={locale}>
          <ScrollProgress />
          <SmoothScroll>{children}</SmoothScroll>
          <TyloLensLazy />
          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
