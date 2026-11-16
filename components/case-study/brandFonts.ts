import { Anton, Prata, Tomorrow } from "next/font/google";

/* Client brand typefaces for the "Marke & Design" type specimen. Loaded only
   by case-study pages; subset to the specimen's characters. */
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", preload: false });
const tomorrow = Tomorrow({ subsets: ["latin"], weight: "700", display: "swap", preload: false });
const prata = Prata({ subsets: ["latin"], weight: "400", display: "swap", preload: false });

export const BRAND_FONTS = { anton: anton.className, tomorrow: tomorrow.className, prata: prata.className } as const;
