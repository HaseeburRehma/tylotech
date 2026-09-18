import type { Partner } from "@/lib/partners";

/**
 * Renders a partner logo alpha-mask tinted with `tint` (matches the Figma
 * "monochrom, über text/tertiary umfärbbar" approach).
 */
export default function PartnerLogo({
  partner,
  tint = "#7d7973",
  scale = 1,
  className,
}: {
  partner: Partner;
  tint?: string;
  scale?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={partner.name}
      className={className}
      style={{
        display: "block",
        flex: "none",
        width: partner.w * scale,
        height: partner.h * scale,
        backgroundColor: tint,
        WebkitMaskImage: `url(${partner.src})`,
        maskImage: `url(${partner.src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
