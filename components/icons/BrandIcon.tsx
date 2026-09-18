import {
  siGoogleads,
  siMeta,
  siTiktok,
  siYoutube,
  siInstagram,
  siGoogleanalytics,
  siGoogle,
  siWordpress,
  siNotion,
  siStripe,
  siHubspot,
  siZapier,
  siMailchimp,
  siShopify,
  siFigma,
  siTrello,
  siAsana,
  siWhatsapp,
  siWix,
} from "simple-icons";

type SimpleIcon = { path: string; hex: string; title: string };

// Custom marks for brands simple-icons no longer ships (branding policy).
const LINKEDIN: SimpleIcon = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
};
const SLACK: SimpleIcon = {
  title: "Slack",
  hex: "611f69",
  path: "M5.04 15.17a2.53 2.53 0 0 1-2.52 2.52A2.53 2.53 0 0 1 0 15.17a2.53 2.53 0 0 1 2.52-2.52h2.52v2.52zm1.27 0a2.53 2.53 0 0 1 2.52-2.52 2.53 2.53 0 0 1 2.52 2.52v6.31A2.53 2.53 0 0 1 8.83 24a2.53 2.53 0 0 1-2.52-2.52v-6.31zM8.83 5.04a2.53 2.53 0 0 1-2.52-2.52A2.53 2.53 0 0 1 8.83 0a2.53 2.53 0 0 1 2.52 2.52v2.52H8.83zm0 1.27a2.53 2.53 0 0 1 2.52 2.52 2.53 2.53 0 0 1-2.52 2.52H2.52A2.53 2.53 0 0 1 0 8.83a2.53 2.53 0 0 1 2.52-2.52h6.31zM18.96 8.83a2.53 2.53 0 0 1 2.52-2.52A2.53 2.53 0 0 1 24 8.83a2.53 2.53 0 0 1-2.52 2.52h-2.52V8.83zm-1.27 0a2.53 2.53 0 0 1-2.52 2.52 2.53 2.53 0 0 1-2.52-2.52V2.52A2.53 2.53 0 0 1 15.17 0a2.53 2.53 0 0 1 2.52 2.52v6.31zM15.17 18.96a2.53 2.53 0 0 1 2.52 2.52A2.53 2.53 0 0 1 15.17 24a2.53 2.53 0 0 1-2.52-2.52v-2.52h2.52zm0-1.27a2.53 2.53 0 0 1-2.52-2.52 2.53 2.53 0 0 1 2.52-2.52h6.31A2.53 2.53 0 0 1 24 15.17a2.53 2.53 0 0 1-2.52 2.52h-6.31z",
};

const ICONS: Record<string, SimpleIcon> = {
  googleads: siGoogleads,
  meta: siMeta,
  tiktok: siTiktok,
  youtube: siYoutube,
  instagram: siInstagram,
  googleanalytics: siGoogleanalytics,
  google: siGoogle,
  wordpress: siWordpress,
  notion: siNotion,
  stripe: siStripe,
  hubspot: siHubspot,
  zapier: siZapier,
  mailchimp: siMailchimp,
  shopify: siShopify,
  figma: siFigma,
  trello: siTrello,
  asana: siAsana,
  whatsapp: siWhatsapp,
  wix: siWix,
  linkedin: LINKEDIN,
  slack: SLACK,
};

export default function BrandIcon({
  slug,
  size = 22,
  color,
  className,
}: {
  slug: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const icon = ICONS[slug];
  if (!icon) return null;
  return (
    <svg
      role="img"
      aria-label={icon.title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color ?? `#${icon.hex}`}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
