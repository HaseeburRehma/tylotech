// Partner logos exported 1:1 from Figma "Partner Marquee" (node 4031:346).
// Each PNG is an alpha mask — tint it via CSS mask + background-color.
// Sizes are display sizes: wordmarks ~26–32px tall, lockups with a mark 40–44px.
export type Partner = { name: string; src: string; w: number; h: number };

export const PARTNERS: Partner[] = [
  { name: "Fahrschule Abgefahrn", src: "/partners/fahrschule-abgefahrn.png", w: 158, h: 32 },
  { name: "Priya's Reinigungsservice", src: "/partners/priyas.png", w: 99, h: 40 },
  { name: "SAHIH", src: "/partners/sahih.png", w: 106, h: 26 },
  { name: "LokShift", src: "/partners/lokshift.png", w: 142, h: 30 },
  { name: "Light of Hope", src: "/partners/light-of-hope.png", w: 178, h: 44 },
  { name: "Experts & Partner", src: "/partners/experts-partner.png", w: 170, h: 26 },
  { name: "Rohrcleaner", src: "/partners/rohrcleaner-wide.png", w: 199, h: 40 },
  { name: "Delinquente", src: "/partners/delinquente.png", w: 119, h: 26 },
  { name: "Crusty Slices", src: "/partners/crusty-slices.png", w: 157, h: 26 },
];
