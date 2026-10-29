import "@/app/globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import CookieBanner from "@/components/CookieBanner";
import Clarity from "@/components/Clarity";
import GoogleTagManager from "@/components/GoogleTagManager";
import MetaPixel from "@/components/MetaPixel";
import TyloLensLazy from "@/components/TyloLensLazy";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";
import { CONSENT_KEY, CONSENT_VERSION } from "@/lib/consent";

/* Runs before the first paint: a visitor who already made a (current) cookie
   choice gets data-consent on <html>, which hides the server-rendered banner
   (see CookieBanner). Without it the banner would only appear after hydration
   and become the page's largest late paint (LCP) for first-time visitors. */
const CONSENT_BOOT = `try{var c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)}));if(c&&c.v>=${CONSENT_VERSION})document.documentElement.setAttribute("data-consent","")}catch(e){}`;

/** <html>/<body> shared by the German and the English root layout. */
export default function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOT }} />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <ScrollProgress />
          <SmoothScroll>{children}</SmoothScroll>
          <TyloLensLazy />
          <CookieBanner />
          <Clarity />
          <GoogleTagManager />
          <MetaPixel />
        </LocaleProvider>
      </body>
    </html>
  );
}
