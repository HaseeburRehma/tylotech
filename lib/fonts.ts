import { Instrument_Sans, Inter, Geist_Mono, Instrument_Serif } from "next/font/google";

// Figma type system: Instrument Sans for headings and labels
export const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const fontVariables = `${instrumentSans.variable} ${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`;
