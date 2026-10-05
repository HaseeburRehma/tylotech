// Partner logos: the first set exported 1:1 from Figma "Partner Marquee" (node 4031:346),
// later client logos taken from tylotech.de/portfolio and the clients' own brand files.
// Each PNG is an alpha mask — tint it via CSS mask + background-color.
// Sizes are display sizes: wordmarks ~26–32px tall, lockups with a mark 40–44px.
export type Partner = { name: string; src: string; w: number; h: number };

export const PARTNERS: Partner[] = [
  { name: "Fahrschule Abgefahrn", src: "/partners/fahrschule-abgefahrn.png", w: 158, h: 32 },
  { name: "Rhein Maas Rail", src: "/partners/rheinmaasrail.png", w: 162, h: 40 },
  { name: "Priya's Reinigungsservice", src: "/partners/priyas.png", w: 99, h: 40 },
  { name: "Expo Network", src: "/partners/expo-network.png", w: 131, h: 34 },
  { name: "LokShift", src: "/partners/lokshift.png", w: 142, h: 30 },
  { name: "Hidaya Nutrition", src: "/partners/hidaya.png", w: 100, h: 30 },
  { name: "Light of Hope", src: "/partners/light-of-hope.png", w: 178, h: 44 },
  { name: "Lightvolt Elektrotechnik", src: "/partners/lightvolt.png", w: 190, h: 40 },
  { name: "Rohrcleaner", src: "/partners/rohrcleaner-wide.png", w: 199, h: 40 },
  { name: "Startup Stage", src: "/partners/startup-stage.png", w: 81, h: 34 },
  { name: "SAHIH", src: "/partners/sahih.png", w: 106, h: 26 },
  { name: "Wohlfühlfahrten", src: "/partners/wohlfuehlfahrten.png", w: 185, h: 38 },
  { name: "Nouh-Wehres", src: "/partners/nouh-wehres.png", w: 185, h: 38 },
  { name: "Experts & Partner", src: "/partners/experts-partner.png", w: 170, h: 26 },
  { name: "FairPflegeBox", src: "/partners/fairpflegebox.png", w: 193, h: 40 },
  { name: "Sanierungslotse", src: "/partners/sanierungslotse.png", w: 141, h: 40 },
  { name: "Crusty Slices", src: "/partners/crusty-slices.png", w: 157, h: 26 },
  { name: "FixDone", src: "/partners/fixdone.png", w: 112, h: 28 },
];
