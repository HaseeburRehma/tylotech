// Partner logos exported 1:1 from Figma "Partner Marquee" (node 4031:346).
// Each PNG is an alpha mask — tint it via CSS mask + background-color.
// Sizes are the Figma display sizes (wordmarks 26px tall, image marks 40px).
export type Partner = { name: string; src: string; w: number; h: number };

export const PARTNERS: Partner[] = [
  { name: "SAHIH", src: "/partners/sahih.png", w: 106, h: 26 },
  { name: "Cleanpany", src: "/partners/cleanpany.png", w: 74, h: 26 },
  { name: "Experts & Partner", src: "/partners/experts-partner.png", w: 170, h: 26 },
  { name: "Fahrschule Abgefahrn", src: "/partners/fahrschule-abgefahrn.png", w: 128, h: 26 },
  { name: "Delinquente", src: "/partners/delinquente.png", w: 119, h: 26 },
  { name: "Crusty Slices", src: "/partners/crusty-slices.png", w: 157, h: 26 },
  { name: "Sanierungslotse", src: "/partners/sanierungslotse.png", w: 60, h: 40 },
  { name: "Rohrcleaner", src: "/partners/rohrcleaner.png", w: 48, h: 40 },
  { name: "Düsselglanz", src: "/partners/duesselglanz.png", w: 44, h: 40 },
  { name: "Zackjob", src: "/partners/zackjob.png", w: 39, h: 40 },
];

// Subset used in the floating action bar's mini marquee.
export const FLOATING_PARTNERS: Partner[] = PARTNERS.filter((p) =>
  ["Crusty Slices", "Cleanpany", "Fahrschule Abgefahrn", "Delinquente", "SAHIH"].includes(
    p.name,
  ),
);
