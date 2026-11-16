/* Case studies: one entry per project, rendered by components/pages/CaseStudyPage.
 * Copy and images from Figma "Case Study · Crusty Slices" (4970:16) and
 * "Case Study · Fahrschule Abgefahrn" (4972:441) and "Case Study · Selmir Suljkanovic" (5316:8954), "Case Study · LokShift" (5353:9463) and
 * "Case Study · Priya's Cleaning Service" (5353:9721). Figma placeholders ("[Zeitraum]",
 * "[Erkenntnis 1]", "[Learning 1]", empty story slots …) are left out on purpose;
 * the optional fields below exist so real content can be added later.
 *
 * Text fields use `_…_` for the Instrument Serif accent (see branche/ui Accent). */

import type { Locale } from "./i18n";

export type L<T = string> = { de: T; en: T };

/** A website screenshot shown in a browser frame. */
/** `pos`: crop anchor in fixed-ratio frames (screenshots stay top-aligned, photos centred) */
export type Shot = { src: string; w: number; h: number; alt: L; pos?: "top" | "center" };

/** "app" / "web" = software figures (smartphone / monitor icon) */
export type Channel = "organic" | "tiktok" | "meta" | "app" | "web";

export type Metric = {
  channel: Channel;
  label: L;
  /** headline number, counted up on scroll */
  value: number;
  /** "/ Monat" etc. */
  suffix?: L;
  chip: L;
};

export type Testimonial = {
  category: L;
  /** left out until the client has given a real quote */
  quote?: L;
  name: string;
  place: L;
  /** still photo; without it the card shows the dark gradient */
  image?: string;
  /** partner logo name from lib/partners */
  logo?: string;
};

export type Card = { title: L; text: L; number?: string };

export type MobileSection =
  | { kind: "devices"; eyebrow: L; title: L; text: L; phones: string[] }
  | { kind: "stories"; eyebrow: L; title: L; text: L; items: { type: "story" | "phone"; src: string; alt: L }[] };

export type CaseStudy = {
  slug: string;
  client: string;
  /** shown in the browser frames */
  domain: string;
  /** live website; without it the hero button asks for a similar project (software cases) */
  url?: string;
  seo: { title: L; description: L };
  hero: {
    title: L;
    intro: L;
    meta: { label: L; value: L }[];
    /** first slide is the LCP image (served with a smaller variant for phones) */
    slides: Shot[];
    slideSmall: string;
  };
  /** summary used by the overview page and "Weitere Case Studies" */
  card: {
    image: string;
    /** auto-sliding images on the "Weitere Case Studies" card: web, print, campaign */
    gallery: Shot[];
    tags: L<string[]>;
    text: L;
    metrics: { value: L; label: L }[];
  };
  /** only real figures: without `wide` the section shows the compact card(s) next to the testimonial */
  results: { wide?: Metric; compact: Metric[]; testimonial: Testimonial };
  overview: { situation: L; tasks: L<string[]> };
  challenges: { intro: L; items: Card[] };
  /** "Was wir herausgefunden haben" — only with real research findings */
  insights?: { intro: L; items: Card[] };
  approach: { intro: L; steps: Card[] };
  brand: {
    intro: L;
    /** `bg`: logo tile colour (default near-black) */
    logo: { src: string; w: number; h: number; bg?: string };
    type: { sample: string; font: "anton" | "tomorrow" | "prata" | "inter"; label: string };
    colors: { name: L; hex: string }[];
  };
  website: {
    /** software projects: "Die Web-App." instead of "Die Website." */
    title?: L;
    intro: L;
    feature: { title: L; text: L; shot: Shot };
    wide: { title: L; text: L; shot: Shot; height: number };
    pair: { caption: L; shot: Shot }[];
  };
  mobile: MobileSection;
  /** `eyebrow` overrides the default section label ("Social Media", "Print & Außenwerbung") */
  /** `phones`: the posts are app screens, shown in phone frames */
  social: { eyebrow?: L; title: L; intro: L; phones?: boolean; posts: { src: string; alt: L }[] };
  /** `browser`: the main image is a screen, shown in a browser frame */
  offline: { eyebrow?: L; title: L; intro: L; browser?: boolean; main: { src: string; alt: L; w?: number; h?: number }; extra?: { src: string; alt: L }[] };
  /** "Was wir mitnehmen" — only with real learnings */
  learnings?: { intro: L; items: Card[] };
};

const shot = (src: string, w: number, h: number, de: string, en: string): Shot => ({ src, w, h, alt: { de, en } });

const CS = "/case-studies/crusty-slices";
const FA = "/case-studies/fahrschule-abgefahrn";
const SS = "/case-studies/selmir-suljkanovic";
const LS = "/case-studies/lokshift";
const PC = "/case-studies/priyas-cleaning-service";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "crusty-slices",
    client: "Crusty Slices",
    domain: "crusty-slices.com",
    url: "https://crusty-slices.com",
    seo: {
      title: { de: "Case Study Crusty Slices | TyloTech", en: "Case study Crusty Slices | TyloTech" },
      description: {
        de: "Website mit Bestellstrecke, Social Media und Kampagnen für das Pizza-Croissant-Konzept Crusty Slices aus Köln: 18.721 organische Besuche im Monat, 26 Mio. Reichweite auf TikTok.",
        en: "Website with online ordering, social media and campaigns for Cologne’s pizza-croissant concept Crusty Slices: 18,721 organic visits a month and 26 million reach on TikTok.",
      },
    },
    hero: {
      title: { de: "Von der ersten Filiale zur _Marke, die man kennt._", en: "From the first store to a _brand people know._" },
      intro: {
        de: "Website mit Bestellstrecke, Social Media und Kampagnen für das Pizza-Croissant-Konzept von Enes Seker: ein Auftritt, der den Slice verkauft, statt ihn nur zu zeigen.",
        en: "Website with online ordering, social media and campaigns for Enes Seker’s pizza-croissant concept: a presence that sells the slice instead of just showing it.",
      },
      meta: [
        { label: { de: "Kunde", en: "Client" }, value: { de: "Crusty Slices, Köln", en: "Crusty Slices, Cologne" } },
        { label: { de: "Branche", en: "Industry" }, value: { de: "Gastronomie, Franchise", en: "Food service, franchise" } },
        { label: { de: "Leistungen", en: "Services" }, value: { de: "Design, Entwicklung, Social Media, Ads", en: "Design, development, social media, ads" } },
      ],
      slides: [
        shot(`${CS}/hero.webp`, 1543, 909, "Startseite von crusty-slices.com mit dem Trüffel-Pastrami-Slice", "crusty-slices.com home page with the truffle pastrami slice"),
        shot(`${CS}/web-saeulen.webp`, 860, 534, "Konzeptseite: die sechs Säulen von Crusty Slices", "Concept page: the six pillars of Crusty Slices"),
        shot(`${CS}/web-menu.webp`, 862, 535, "Speisekarte mit Preisen", "Menu with prices"),
        shot(`${CS}/web-franchise.webp`, 862, 534, "Franchise-Seite für Partner", "Franchise page for partners"),
      ],
      slideSmall: `${CS}/hero-720.webp`,
    },
    card: {
      image: `${CS}/card.webp`,
      gallery: [
        shot(`${CS}/web-home.webp`, 860, 535, "Startseite von crusty-slices.com", "crusty-slices.com home page"),
        { ...shot(`${CS}/offline-card.webp`, 960, 640, "Großleinwand mit dem Dubai-Special", "Large screen with the Dubai special"), pos: "center" },
        shot(`${CS}/web-saeulen.webp`, 860, 534, "Die sechs Säulen des Konzepts", "The six pillars of the concept"),
        shot(`${CS}/web-menu.webp`, 862, 535, "Speisekarte mit Preisen", "Menu with prices"),
        shot(`${CS}/web-franchise.webp`, 862, 534, "Franchise-Seite für Partner", "Franchise page for partners"),
      ],
      tags: { de: ["Gastronomie", "Website", "Social Media"], en: ["Food service", "Website", "Social media"] },
      text: {
        de: "Crusty Slices, Köln: Website mit Bestellstrecke, Social Media und Kampagnen.",
        en: "Crusty Slices, Cologne: website with online ordering, social media and campaigns.",
      },
      metrics: [
        { value: { de: "18.721", en: "18,721" }, label: { de: "organische Besuche / Monat", en: "organic visits / month" } },
        { value: { de: "26 Mio.", en: "26M" }, label: { de: "Reichweite auf TikTok", en: "reach on TikTok" } },
      ],
    },
    results: {
      wide: { channel: "organic", label: { de: "Organische Besuche", en: "Organic visits" }, value: 18721, suffix: { de: " / Monat", en: " / month" }, chip: { de: "Letzte 12 Monate", en: "Last 12 months" } },
      compact: [
        { channel: "tiktok", label: { de: "TikTok Ads", en: "TikTok Ads" }, value: 26000000, chip: { de: "Reichweite", en: "Reach" } },
        { channel: "meta", label: { de: "Meta Ads", en: "Meta Ads" }, value: 1000500, chip: { de: "Reichweite", en: "Reach" } },
      ],
      testimonial: {
        category: { de: "Gastronomie", en: "Food service" },
        quote: { de: "„TyloTech ist das Gegenteil der trägen Servicewüste Deutschland.“", en: "“TyloTech is the opposite of Germany’s sluggish service desert.”" },
        name: "Enes Seker",
        place: { de: "Crusty Slices, Köln", en: "Crusty Slices, Cologne" },
        image: `${CS}/testimonial.webp`,
        logo: "Crusty Slices",
      },
    },
    overview: {
      situation: {
        de: "Enes Seker hat mit Royal Donuts über 250 Filialen in mehr als 8 Ländern aufgebaut. Mit Crusty Slices bringt er ein neues Konzept in die Fast-Food-Welt: buttriger Croissant-Teig mit kreativen Belägen, von Burrata Mediterana bis Cookie-Croissant.",
        en: "With Royal Donuts, Enes Seker built more than 250 stores in over 8 countries. With Crusty Slices he brings a new concept to fast food: buttery croissant dough with creative toppings, from Burrata Mediterana to the cookie croissant.",
      },
      tasks: {
        de: [
          "Eine Website, die den Slice verkauft, statt ihn nur zu zeigen",
          "Social-Media-Auftritt mit Wiedererkennung für Feed, Stories und Reels",
          "Kampagnen mit Standortbezug, die den Laden auch unter der Woche füllen",
          "Speisekarte, Verpackung und Social aus einem Baukasten",
        ],
        en: [
          "A website that sells the slice instead of just showing it",
          "A recognisable social presence for feed, stories and reels",
          "Location-based campaigns that fill the store on weekdays too",
          "Menu, packaging and social from one design kit",
        ],
      },
    },
    challenges: {
      intro: {
        de: "Drei Dinge mussten gleichzeitig stimmen, sonst wäre es ein schöner Auftritt ohne Bestellungen geworden.",
        en: "Three things had to work at once, or it would have been a nice-looking presence without orders.",
      },
      items: [
        {
          title: { de: "Eine neue Kategorie", en: "A new category" },
          text: {
            de: "Pizza-Croissant kennt niemand. Gäste müssen in Sekunden verstehen, was sie bekommen und warum es anders schmeckt.",
            en: "Nobody knows the pizza croissant yet. Guests have to understand in seconds what they get and why it tastes different.",
          },
        },
        {
          title: { de: "Filiale eins, Franchise im Blick", en: "Store one, franchise in mind" },
          text: {
            de: "Der Auftritt muss ab Tag eins wie eine Marke mit mehreren Standorten wirken, nicht wie ein einzelner Laden.",
            en: "From day one the brand has to feel like a chain with several locations, not a single shop.",
          },
        },
        {
          title: { de: "Bestellen ohne Umweg", en: "Ordering without detours" },
          text: {
            de: "Von Instagram bis zur Bestellung darf kein Klick zu viel liegen, sonst bleibt es beim Anschauen.",
            en: "From Instagram to the order there can’t be one click too many, or people just look and leave.",
          },
        },
      ],
    },
    approach: {
      intro: {
        de: "Vier Schritte, die ineinandergreifen, statt Einzelleistungen von fünf Dienstleistern.",
        en: "Four steps that interlock, instead of separate services from five different agencies.",
      },
      steps: [
        {
          title: { de: "Analyse & Positionierung", en: "Analysis & positioning" },
          text: {
            de: "Konzept, Zielgruppe und Wettbewerb verstehen. Was macht den Slice besonders, und wie sagt man das in einem Satz?",
            en: "Understand the concept, audience and competition. What makes the slice special, and how do you say it in one sentence?",
          },
        },
        {
          title: { de: "Marke & Design-System", en: "Brand & design system" },
          text: {
            de: "Farbwelt, Typografie und Bildsprache festlegen, die auf Website, Verpackung und Social gleich wirken.",
            en: "Define colours, typography and imagery that work the same on the website, packaging and social.",
          },
        },
        {
          title: { de: "Website & Bestellstrecke", en: "Website & ordering" },
          text: {
            de: "Konversionsstarke Seite mit Speisekarte, Standorten und Bestellung, gebaut für das Handy zuerst.",
            en: "A high-converting site with menu, locations and ordering, built mobile-first.",
          },
        },
        {
          title: { de: "Content, Kampagnen & Betrieb", en: "Content, campaigns & operations" },
          text: {
            de: "Feed, Stories und Reels aus einem Baukasten, dazu Meta- und TikTok-Kampagnen mit Standortbezug.",
            en: "Feed, stories and reels from one kit, plus location-based Meta and TikTok campaigns.",
          },
        },
      ],
    },
    brand: {
      intro: {
        de: "Eine Farbwelt und eine Typografie, die auf Website, Verpackung und Social gleich wirken.",
        en: "One colour palette and one typeface that look the same on the website, packaging and social.",
      },
      logo: { src: `${CS}/logo.png`, w: 280, h: 75 },
      type: { sample: "SAVOR EVERY BITE", font: "anton", label: "Anton & Poppins" },
      colors: [
        { name: { de: "Rosé", en: "Rosé" }, hex: "#C9A4A8" },
        { name: { de: "Puder", en: "Powder" }, hex: "#D8B0B4" },
        { name: { de: "Blush", en: "Blush" }, hex: "#F3D3D7" },
        { name: { de: "Creme", en: "Cream" }, hex: "#FFF1F3" },
        { name: { de: "Weiß", en: "White" }, hex: "#FFFFFF" },
        { name: { de: "Schwarz", en: "Black" }, hex: "#000000" },
      ],
    },
    website: {
      intro: {
        de: "Jede Seite hat einen Job: verstehen, Appetit bekommen, bestellen.",
        en: "Every page has one job: understand, get hungry, order.",
      },
      feature: {
        title: { de: "Eine Startseite, die Appetit macht.", en: "A home page that makes you hungry." },
        text: {
          de: "Der Slice steht im Zentrum, nicht die Erklärung. Große Produktbilder, der Gründer als Gesicht der Marke und ein Bestell-Button, der auf jeder Seite sichtbar bleibt.",
          en: "The slice takes centre stage, not the explanation. Big product shots, the founder as the face of the brand and an order button that stays visible on every page.",
        },
        shot: shot(`${CS}/web-home.webp`, 860, 535, "Startseite von crusty-slices.com", "crusty-slices.com home page"),
      },
      wide: {
        title: { de: "Das Konzept in sechs Säulen erklärt.", en: "The concept explained in six pillars." },
        text: {
          de: "Zutaten, Innovation, Service: Was Crusty Slices anders macht, wird auf einer Seite greifbar, ohne lange Texte.",
          en: "Ingredients, innovation, service: what makes Crusty Slices different comes across on one page, without long copy.",
        },
        shot: shot(`${CS}/web-saeulen.webp`, 860, 534, "Die sechs Säulen des Crusty-Slices-Konzepts", "The six pillars of the Crusty Slices concept"),
        height: 800,
      },
      pair: [
        { caption: { de: "Speisekarte mit Preisen", en: "Menu with prices" }, shot: shot(`${CS}/web-menu.webp`, 862, 535, "Speisekarte mit Preisen", "Menu with prices") },
        { caption: { de: "Franchise-Seite für Partner", en: "Franchise page for partners" }, shot: shot(`${CS}/web-franchise.webp`, 862, 534, "Franchise-Seite für Partner", "Franchise page for partners") },
      ],
    },
    mobile: {
      kind: "devices",
      eyebrow: { de: "Mobile & Stories", en: "Mobile & stories" },
      title: { de: "Auf dem Handy _zuerst._", en: "On the phone _first._" },
      text: {
        de: "Die meisten Gäste kommen über Instagram. Stories, Reels und die Website sind deshalb vom kleinen Bildschirm her gedacht: Bild, ein Satz, ein Button.",
        en: "Most guests arrive via Instagram. So stories, reels and the website are designed from the small screen up: an image, one sentence, one button.",
      },
      phones: [`${CS}/phone-1.webp`, `${CS}/phone-2.webp`, `${CS}/phone-3.webp`],
    },
    social: {
      title: { de: "Ein Feed mit _Wiedererkennung._", en: "A feed people _recognise._" },
      intro: {
        de: "Rosé, Schwarz und große Produktfotos: Jeder Post ist auch ohne Logo als Crusty Slices erkennbar.",
        en: "Rosé, black and big product shots: every post reads as Crusty Slices, even without the logo.",
      },
      posts: [
        { src: `${CS}/post-1.webp`, alt: { de: "Post: Parmesano Corn", en: "Post: Parmesano Corn" } },
        { src: `${CS}/post-2.webp`, alt: { de: "Post: The Cookie-Croissant", en: "Post: The Cookie-Croissant" } },
        { src: `${CS}/post-3.webp`, alt: { de: "Post: Savor every bite of flavor", en: "Post: Savor every bite of flavor" } },
        { src: `${CS}/post-4.webp`, alt: { de: "Post mit dem Pastrami-Slice", en: "Post with the pastrami slice" } },
        { src: `${CS}/post-5.webp`, alt: { de: "Aktionspost: Savor every bite, 25 % off", en: "Promo post: Savor every bite, 25% off" } },
        { src: `${CS}/post-6.webp`, alt: { de: "Post: Signature Pastrami", en: "Post: Signature Pastrami" } },
      ],
    },
    offline: {
      title: { de: "Wiedererkennbar _offline._", en: "Recognisable _offline._" },
      intro: {
        de: "Speisekarte, Verpackung und Außenwerbung kommen aus demselben Baukasten wie die Website.",
        en: "Menu, packaging and outdoor ads come from the same kit as the website.",
      },
      main: { src: `${CS}/offline.webp`, alt: { de: "Großleinwand mit dem Dubai-Special von Crusty Slices", en: "Large screen showing the Crusty Slices Dubai special" } },
    },
  },
  {
    slug: "fahrschule-abgefahrn",
    client: "Fahrschule Abgefahrn",
    domain: "fahrschule-abgefahrn.de",
    url: "https://www.fahrschule-abgefahrn.de",
    seo: {
      title: { de: "Case Study Fahrschule Abgefahrn | TyloTech", en: "Case study Fahrschule Abgefahrn | TyloTech" },
      description: {
        de: "Website, Theorieplan, Online-Anmeldung und Social Media für Fahrschule Abgefahrn in Düsseldorf: über 10.000 organische Besuche im Monat, 5 Mio. Reichweite auf TikTok.",
        en: "Website, theory schedule, online sign-up and social media for Fahrschule Abgefahrn in Düsseldorf: 10,000+ organic visits a month and 5 million reach on TikTok.",
      },
    },
    hero: {
      title: { de: "Eine Fahrschule, die aussieht _wie eine Marke._", en: "A driving school that looks _like a brand._" },
      intro: {
        de: "Website, Theorieplan, Online-Anmeldung und Social Media für Fahrschule Abgefahrn in Düsseldorf: ein Auftritt, den Fahrschüler weiterempfehlen.",
        en: "Website, theory schedule, online sign-up and social media for Fahrschule Abgefahrn in Düsseldorf: a presence learner drivers recommend to their friends.",
      },
      meta: [
        { label: { de: "Kunde", en: "Client" }, value: { de: "Fahrschule Abgefahrn, Düsseldorf", en: "Fahrschule Abgefahrn, Düsseldorf" } },
        { label: { de: "Branche", en: "Industry" }, value: { de: "Fahrschule, Bildung", en: "Driving school, education" } },
        { label: { de: "Leistungen", en: "Services" }, value: { de: "Design, Entwicklung, Social Media, Ads, Print", en: "Design, development, social media, ads, print" } },
      ],
      slides: [
        shot(`${FA}/hero.webp`, 1600, 900, "Startseite von fahrschule-abgefahrn.de", "fahrschule-abgefahrn.de home page"),
        shot(`${FA}/web-anmeldung.webp`, 1600, 805, "Online-Anmeldung", "Online sign-up"),
        shot(`${FA}/web-theorie.webp`, 1600, 805, "Theorie und Prüfung im Überblick", "Theory and exams at a glance"),
        shot(`${FA}/web-klassen.webp`, 1600, 805, "Führerscheinklassen auf einen Blick", "Licence classes at a glance"),
      ],
      slideSmall: `${FA}/hero-720.webp`,
    },
    card: {
      image: `${FA}/card.webp`,
      gallery: [
        shot(`${FA}/card.webp`, 1280, 644, "Startseite von fahrschule-abgefahrn.de", "fahrschule-abgefahrn.de home page"),
        { ...shot(`${FA}/offline-card.webp`, 960, 640, "Plakatwand mit der Winteraktion", "Billboard with the winter promotion"), pos: "center" },
        shot(`${FA}/web-anmeldung.webp`, 1600, 805, "Online-Anmeldung", "Online sign-up"),
        { ...shot(`${FA}/print-1.webp`, 1200, 900, "Give-away im Einkaufskorb", "Giveaway in a shopping basket"), pos: "center" },
        shot(`${FA}/web-klassen.webp`, 1600, 805, "Führerscheinklassen auf einen Blick", "Licence classes at a glance"),
      ],
      tags: { de: ["Fahrschule", "Website", "Social Media"], en: ["Driving school", "Website", "Social media"] },
      text: {
        de: "Fahrschule Abgefahrn, Düsseldorf: Website, Theorieplan, Anmeldung und Social Media.",
        en: "Fahrschule Abgefahrn, Düsseldorf: website, theory schedule, sign-up and social media.",
      },
      metrics: [
        { value: { de: "10.000+", en: "10,000+" }, label: { de: "organische Besuche / Monat", en: "organic visits / month" } },
        { value: { de: "5 Mio.", en: "5M" }, label: { de: "Reichweite auf TikTok", en: "reach on TikTok" } },
      ],
    },
    results: {
      wide: { channel: "organic", label: { de: "Organische Besuche", en: "Organic visits" }, value: 10000, suffix: { de: "+ / Monat", en: "+ / month" }, chip: { de: "Letzte 12 Monate", en: "Last 12 months" } },
      compact: [
        { channel: "tiktok", label: { de: "TikTok Ads", en: "TikTok Ads" }, value: 5000000, chip: { de: "Reichweite", en: "Reach" } },
        { channel: "meta", label: { de: "Meta Ads", en: "Meta Ads" }, value: 400000, suffix: { de: " / Monat", en: " / month" }, chip: { de: "Reichweite", en: "Reach" } },
      ],
      testimonial: {
        category: { de: "Fahrschule", en: "Driving school" },
        quote: {
          de: "„Ich empfehle jedem Unternehmen, das Struktur und Wachstum braucht, sich an TyloTech zu wenden.“",
          en: "“I recommend TyloTech to any business that needs structure and growth.”",
        },
        name: "Fahrschule Abgefahrn",
        place: { de: "Fahrschule, Düsseldorf", en: "Driving school, Düsseldorf" },
        logo: "Fahrschule Abgefahrn",
      },
    },
    overview: {
      situation: {
        de: "Fahrschule Abgefahrn sitzt zentral am Düsseldorfer Hauptbahnhof, bietet Theorie siebenmal pro Woche und gehört laut Google-Bewertungen zu den bestbewerteten Fahrschulen der Stadt. Die Marke ist laut, grün und jung, und genau so sollte sie online wirken.",
        en: "Fahrschule Abgefahrn is right by Düsseldorf central station, runs theory classes seven times a week and, going by its Google reviews, is one of the best-rated driving schools in the city. The brand is loud, green and young, and that’s exactly how it should feel online.",
      },
      tasks: {
        de: [
          "Theorieplan, den Fahrschüler benutzen: monatlich aktuell, ohne Nachfragen im Büro",
          "Anmeldung ohne Umweg: vom Instagram-Profil bis zum Vertrag in einem Fluss",
          "Ein Auftritt, den man weiterempfiehlt: Farbe, Ton und Bildsprache konsequent durchgezogen",
          "Kampagnen und Aktionen, die Anmeldungen bringen",
        ],
        en: [
          "A theory schedule learners actually use: updated monthly, no calls to the office",
          "Sign-up without detours: from the Instagram profile to the contract in one flow",
          "A presence people recommend: colour, tone and imagery applied consistently",
          "Campaigns and promotions that bring in sign-ups",
        ],
      },
    },
    challenges: {
      intro: {
        de: "Drei Dinge mussten gleichzeitig stimmen, sonst wäre es ein schöner Auftritt ohne Anmeldungen geworden.",
        en: "Three things had to work at once, or it would have been a nice-looking presence without sign-ups.",
      },
      items: [
        {
          title: { de: "Anmeldung mit Umwegen", en: "Sign-up with detours" },
          text: {
            de: "Wer sich anmelden wollte, musste anrufen oder vorbeikommen. Zwischen Interesse und Vertrag lagen zu viele Schritte.",
            en: "Anyone who wanted to sign up had to call or drop by. There were too many steps between interest and contract.",
          },
        },
        {
          title: { de: "Theorieplan auf Nachfrage", en: "Theory schedule on request" },
          text: {
            de: "Der monatliche Theorieplan lebte im Büro. Jede Frage dazu war ein Anruf, jede Änderung eine Rückfrage.",
            en: "The monthly theory schedule lived in the office. Every question was a phone call, every change a follow-up.",
          },
        },
        {
          title: { de: "Starke Marke, kein System", en: "Strong brand, no system" },
          text: {
            de: "Grün, Tiger, Tempo: Die Marke hatte Charakter, aber keine Regeln für Website, Posts und Plakate.",
            en: "Green, tiger, speed: the brand had character, but no rules for the website, posts and posters.",
          },
        },
      ],
    },
    approach: {
      intro: {
        de: "Vier Schritte, die ineinandergreifen, statt Einzelleistungen von fünf Dienstleistern.",
        en: "Four steps that interlock, instead of separate services from five different agencies.",
      },
      steps: [
        {
          title: { de: "Analyse & Positionierung", en: "Analysis & positioning" },
          text: {
            de: "Zielgruppe, Wettbewerb und Anmeldeprozess verstehen. Was bringt junge Menschen dazu, genau diese Fahrschule zu wählen?",
            en: "Understand the audience, competition and sign-up process. What makes young people choose this particular driving school?",
          },
        },
        {
          title: { de: "Marke & Design-System", en: "Brand & design system" },
          text: {
            de: "Das Grün, der Tiger und die Typografie bekommen Regeln, die auf Website, Social und Plakat gleich funktionieren.",
            en: "The green, the tiger and the typography get rules that work the same on the website, social and posters.",
          },
        },
        {
          title: { de: "Website & Anmeldung", en: "Website & sign-up" },
          text: {
            de: "Theorieplan, Führerscheinklassen und Online-Anmeldung in einem Fluss, gebaut für das Handy zuerst.",
            en: "Theory schedule, licence classes and online sign-up in one flow, built mobile-first.",
          },
        },
        {
          title: { de: "Content, Kampagnen & Betrieb", en: "Content, campaigns & operations" },
          text: {
            de: "Posts, Stories und Aktionen aus einem Baukasten, dazu Meta- und TikTok-Kampagnen und Außenwerbung.",
            en: "Posts, stories and promotions from one kit, plus Meta and TikTok campaigns and outdoor ads.",
          },
        },
      ],
    },
    brand: {
      intro: {
        de: "Eine Farbwelt und eine Typografie, die auf Website, Plakat und Social gleich wirken.",
        en: "One colour palette and one typeface that look the same on the website, posters and social.",
      },
      logo: { src: `${FA}/logo.svg`, w: 280, h: 57 },
      type: { sample: "ABGEFAHRN", font: "tomorrow", label: "Tomorrow" },
      colors: [
        { name: { de: "Neon", en: "Neon" }, hex: "#39FF38" },
        { name: { de: "Mint", en: "Mint" }, hex: "#98FF98" },
        { name: { de: "Hell", en: "Light" }, hex: "#C8FFC7" },
        { name: { de: "Nebel", en: "Mist" }, hex: "#EAFFE9" },
        { name: { de: "Weiß", en: "White" }, hex: "#FFFFFF" },
        { name: { de: "Schwarz", en: "Black" }, hex: "#000000" },
      ],
    },
    website: {
      intro: {
        de: "Jede Seite hat einen Job: verstehen, Vertrauen fassen, anmelden.",
        en: "Every page has one job: understand, build trust, sign up.",
      },
      feature: {
        title: { de: "Eine Startseite, die sofort Vertrauen schafft.", en: "A home page that builds trust instantly." },
        text: {
          de: "Bewertungen, Auszeichnung und Erfahrung stehen direkt neben dem Anmelde-Button. Wer landet, sieht in drei Sekunden, warum diese Fahrschule.",
          en: "Reviews, awards and experience sit right next to the sign-up button. Anyone who lands sees within three seconds why this driving school.",
        },
        shot: shot(`${FA}/web-home.webp`, 1600, 805, "Startseite von fahrschule-abgefahrn.de", "fahrschule-abgefahrn.de home page"),
      },
      wide: {
        title: { de: "Anmeldung in einem Fluss.", en: "Sign-up in one flow." },
        text: {
          de: "Das Formular fragt nur, was für den Vertrag nötig ist, zeigt Preise transparent und läuft auf dem Handy genauso wie am Rechner.",
          en: "The form only asks for what the contract needs, shows prices up front and works on the phone just like on a desktop.",
        },
        shot: shot(`${FA}/web-anmeldung.webp`, 1600, 805, "Online-Anmeldung der Fahrschule", "The driving school’s online sign-up"),
        height: 760,
      },
      pair: [
        { caption: { de: "Theorie und Prüfung im Überblick", en: "Theory and exams at a glance" }, shot: shot(`${FA}/web-theorie.webp`, 1600, 805, "Theorie und Prüfung im Überblick", "Theory and exams at a glance") },
        { caption: { de: "Führerscheinklassen auf einen Blick", en: "Licence classes at a glance" }, shot: shot(`${FA}/web-klassen.webp`, 1600, 805, "Führerscheinklassen auf einen Blick", "Licence classes at a glance") },
      ],
    },
    mobile: {
      kind: "stories",
      eyebrow: { de: "Stories & Aktionen", en: "Stories & promotions" },
      title: { de: "Stories, die man _nicht wegtippt._", en: "Stories nobody _taps past._" },
      text: {
        de: "Fahrschüler kommen über Instagram und TikTok. Teaser, Aktionen und saisonale Formate laufen als Stories und Reels, immer im selben Grün, immer mit Nummer und Website am Ende.",
        en: "Learner drivers come in via Instagram and TikTok. Teasers, promotions and seasonal formats run as stories and reels, always in the same green, always ending with the phone number and website.",
      },
      items: [
        { type: "story", src: `${FA}/story-legende.webp`, alt: { de: "Story: Die Legende ist real. Der Name ist #Abgefahrn", en: "Story: The legend is real. The name is #Abgefahrn" } },
        { type: "phone", src: `${FA}/phone-sommer.webp`, alt: { de: "Story: Sommer-Aktion mit 99 € Grundbetrag", en: "Story: summer promotion with a €99 base fee" } },
        { type: "story", src: `${FA}/story-halloween.webp`, alt: { de: "Halloween-Story", en: "Halloween story" } },
      ],
    },
    social: {
      title: { de: "Ein Feed, der _jung bleibt._", en: "A feed that _stays young._" },
      intro: {
        de: "Tipps zum ersten Auto, Prüfungsfragen, Aktionen: Inhalte, die Fahrschüler wirklich teilen, im immer gleichen Grün.",
        en: "First-car tips, exam questions, promotions: content learner drivers actually share, always in the same green.",
      },
      posts: [
        { src: `${FA}/post-1.webp`, alt: { de: "Post: Dein erstes Auto, unsere Top 6", en: "Post: Your first car, our top 6" } },
        { src: `${FA}/post-2.webp`, alt: { de: "Post: Neuer Blog online", en: "Post: New blog online" } },
        { src: `${FA}/post-3.webp`, alt: { de: "Post: VW Polo als erstes Auto", en: "Post: VW Polo as a first car" } },
        { src: `${FA}/post-4.webp`, alt: { de: "Post: Ford Fiesta als erstes Auto", en: "Post: Ford Fiesta as a first car" } },
        { src: `${FA}/post-5.webp`, alt: { de: "Post: Die Legende ist real", en: "Post: The legend is real" } },
        { src: `${FA}/post-6.webp`, alt: { de: "Post: VW Golf als erstes Auto", en: "Post: VW Golf as a first car" } },
      ],
    },
    offline: {
      title: { de: "Wiedererkennbar _in der Stadt._", en: "Recognisable _around town._" },
      intro: {
        de: "Winteraktion, Bahnhofsplakat und Give-aways kommen aus demselben Baukasten wie Website und Feed.",
        en: "Winter promotion, station poster and giveaways come from the same kit as the website and feed.",
      },
      main: { src: `${FA}/offline.webp`, alt: { de: "Plakatwand mit der Winteraktion der Fahrschule", en: "Billboard with the driving school’s winter promotion" } },
      extra: [
        { src: `${FA}/print-1.webp`, alt: { de: "Give-away im Einkaufskorb", en: "Giveaway in a shopping basket" } },
        { src: `${FA}/print-2.webp`, alt: { de: "Plakat an einer Bushaltestelle", en: "Poster at a bus stop" } },
      ],
    },
  },
  {
    slug: "selmir-suljkanovic",
    client: "Selmir Suljkanovic",
    domain: "selmir-suljkanovic.de",
    url: "https://www.selmir-suljkanovic.de",
    seo: {
      title: { de: "Case Study Selmir Suljkanovic | TyloTech", en: "Case study Selmir Suljkanovic | TyloTech" },
      description: {
        de: "Website, Landingpages, Lead-Magnet und 111 Ad-Creatives für Selmir Suljkanovic, Vertriebs- und Strukturberater für Handwerk, Agenturen und Immobilien.",
        en: "Website, landing pages, lead magnet and 111 ad creatives for Selmir Suljkanovic, sales and structure consultant for trades, agencies and real estate.",
      },
    },
    hero: {
      title: { de: "Aus Expertise wird ein _System, das verkauft._", en: "Expertise turned into _a system that sells._" },
      intro: {
        de: "Website, Landingpages, Lead-Magnet und Ad-Creatives für Selmir Suljkanovic, Vertriebs- und Strukturberater für Handwerk, Agenturen und Immobilien: ein Auftritt, der Ergebnisse zeigt und Erstgespräche bringt.",
        en: "Website, landing pages, lead magnet and ad creatives for Selmir Suljkanovic, sales and structure consultant for trades, agencies and real estate: a presence that shows results and books first calls.",
      },
      meta: [
        { label: { de: "Kunde", en: "Client" }, value: { de: "Selmir Suljkanovic", en: "Selmir Suljkanovic" } },
        { label: { de: "Branche", en: "Industry" }, value: { de: "Beratung, Vertriebstraining", en: "Consulting, sales training" } },
        { label: { de: "Leistungen", en: "Services" }, value: { de: "Design, Website, Lead-Magnet, Ads", en: "Design, website, lead magnet, ads" } },
      ],
      slides: [
        shot(`${SS}/hero.webp`, 1600, 900, "Startseite von selmir-suljkanovic.de", "selmir-suljkanovic.de home page"),
        shot(`${SS}/web-cases.webp`, 1600, 805, "Case Studies mit echten Umsatzkurven", "Case studies with real revenue curves"),
        shot(`${SS}/web-event.webp`, 1600, 805, "Event-Seite der Sales Mastery Days", "Sales Mastery Days event page"),
        shot(`${SS}/web-buch.webp`, 1600, 805, "Buchseite „Sein. Tun. Haben.“", "Book page “Sein. Tun. Haben.”"),
      ],
      slideSmall: `${SS}/hero-720.webp`,
    },
    card: {
      image: `${SS}/card.webp`,
      gallery: [
        shot(`${SS}/card.webp`, 1280, 644, "Startseite von selmir-suljkanovic.de", "selmir-suljkanovic.de home page"),
        shot(`${SS}/offline-card.webp`, 960, 540, "Landingpage für den Verkaufsleitfaden", "Landing page for the sales guide"),
        shot(`${SS}/web-event.webp`, 1600, 805, "Event-Seite der Sales Mastery Days", "Sales Mastery Days event page"),
        shot(`${SS}/web-landing.webp`, 1600, 805, "Landingpage Betriebs-Röntgen", "Business X-ray landing page"),
        shot(`${SS}/web-ueber.webp`, 1600, 805, "Über-Seite von Selmir", "Selmir’s about page"),
      ],
      tags: { de: ["Beratung", "Website", "Lead-Magnet"], en: ["Consulting", "Website", "Lead magnet"] },
      text: {
        de: "Selmir Suljkanovic, Vertriebs- und Strukturberater: Website, Landingpages, Lead-Magnet und Ads.",
        en: "Selmir Suljkanovic, sales and structure consultant: website, landing pages, lead magnet and ads.",
      },
      metrics: [
        { value: { de: "111", en: "111" }, label: { de: "Ad-Motive in 3 Formaten", en: "ad creatives in 3 formats" } },
        { value: { de: "8", en: "8" }, label: { de: "Landingpages für die Potenzialanalyse", en: "landing pages for the potential analysis" } },
      ],
    },
    results: {
      compact: [{ channel: "tiktok", label: { de: "Ad-Creatives", en: "Ad creatives" }, value: 111, suffix: { de: " Motive", en: " creatives" }, chip: { de: "in 3 Formaten", en: "in 3 formats" } }],
      testimonial: {
        category: { de: "Beratung", en: "Consulting" },
        name: "Selmir Suljkanovic",
        place: { de: "Vertriebs- und Strukturberater", en: "Sales and structure consultant" },
        image: `${SS}/testimonial.webp`,
      },
    },
    overview: {
      situation: {
        de: "Selmir Suljkanovic bringt Unternehmern aus Handwerk, Agenturen und Immobilien Vertrieb und Struktur bei, damit Wachstum nicht mehr am Inhaber hängt. Seine Kunden haben ihren Umsatz teils mehr als verdoppelt, Hörmann Haustechnik etwa von 4 auf 18 Millionen Euro.",
        en: "Selmir Suljkanovic teaches business owners in trades, agencies and real estate sales and structure, so growth no longer depends on the owner. Some of his clients have more than doubled their revenue, Hörmann Haustechnik for example from €4 million to €18 million.",
      },
      tasks: {
        de: [
          "Eine Website, die Selmir als Experten zeigt und Erstgespräche bringt",
          "Landingpages für die Potenzialanalyse und die Sales Mastery Days",
          "Ein Lead-Magnet, der aus YouTube-Zuschauern Kontakte macht",
          "Ad-Creatives, die Inhaber im Feed stoppen, statt zu nerven",
        ],
        en: [
          "A website that presents Selmir as the expert and books first calls",
          "Landing pages for the potential analysis and the Sales Mastery Days",
          "A lead magnet that turns YouTube viewers into contacts",
          "Ad creatives that stop business owners in the feed instead of annoying them",
        ],
      },
    },
    challenges: {
      intro: {
        de: "Drei Dinge mussten gleichzeitig stimmen, sonst wäre es ein schöner Auftritt ohne Anfragen geworden.",
        en: "Three things had to work at once, or it would have been a nice-looking presence without enquiries.",
      },
      items: [
        {
          title: { de: "Expertise greifbar machen", en: "Making expertise tangible" },
          text: {
            de: "Vertrieb und Struktur sind abstrakt. Die Ergebnisse von Kunden müssen in Sekunden sichtbar sein, in Zahlen statt in Versprechen.",
            en: "Sales and structure are abstract. Client results have to be visible within seconds, in numbers rather than promises.",
          },
        },
        {
          title: { de: "Eine Person als Marke", en: "One person as the brand" },
          text: {
            de: "Selmir ist das Angebot. Seine Geschichte muss Vertrauen schaffen, ohne nach Coaching-Klischee zu klingen.",
            en: "Selmir is the offer. His story has to build trust without sounding like a coaching cliché.",
          },
        },
        {
          title: { de: "Drei Branchen, eine Botschaft", en: "Three industries, one message" },
          text: {
            de: "Handwerk, Agenturen und Immobilien haben andere Probleme. Jede Zielgruppe muss sich wiederfinden, ohne dass die Marke zerfällt.",
            en: "Trades, agencies and real estate have different problems. Every audience has to recognise itself without the brand falling apart.",
          },
        },
      ],
    },
    approach: {
      intro: {
        de: "Vier Schritte, die ineinandergreifen, statt Einzelleistungen von fünf Dienstleistern.",
        en: "Four steps that interlock, instead of separate services from five different agencies.",
      },
      steps: [
        {
          title: { de: "Positionierung & Botschaft", en: "Positioning & message" },
          text: {
            de: "Zielgruppen, Engpässe und Einwände verstehen: Wo verlieren Betriebe ihre Aufträge, und wie sagt man das so, dass sich ein Inhaber wiedererkennt?",
            en: "Understand audiences, bottlenecks and objections: where do businesses lose their jobs, and how do you say it so an owner recognises himself?",
          },
        },
        {
          title: { de: "Marke & Design-System", en: "Brand & design system" },
          text: {
            de: "Dunkle Bühne, violetter Akzent, Prata für Haltung und Inter für Klarheit: ein System für Website, PDF und Ads.",
            en: "A dark stage, a violet accent, Prata for attitude and Inter for clarity: one system for website, PDF and ads.",
          },
        },
        {
          title: { de: "Website & Landingpages", en: "Website & landing pages" },
          text: {
            de: "Startseite, Über-Seite, Event-Seite für die Sales Mastery Days und acht Landingpage-Varianten für die Potenzialanalyse.",
            en: "Home page, about page, an event page for the Sales Mastery Days and eight landing page variants for the potential analysis.",
          },
        },
        {
          title: { de: "Lead-Magnet & Kampagnen", en: "Lead magnet & campaigns" },
          text: {
            de: "Ein zehnseitiger Verkaufsleitfaden als PDF und 111 Ad-Motive in neun Themenwelten für Meta.",
            en: "A ten-page sales guide as a PDF and 111 ad creatives across nine themes for Meta.",
          },
        },
      ],
    },
    brand: {
      intro: {
        de: "Eine dunkle Bühne, ein violetter Akzent und eine Typografie, die auf Website, PDF und Ads gleich wirken.",
        en: "A dark stage, a violet accent and a typeface that look the same on the website, PDF and ads.",
      },
      logo: { src: `${SS}/logo.svg`, w: 286, h: 92 },
      type: { sample: "Erfolg durch Klarheit.", font: "prata", label: "Prata, Days One & Inter" },
      colors: [
        { name: { de: "Violett", en: "Violet" }, hex: "#B089FF" },
        { name: { de: "Indigo", en: "Indigo" }, hex: "#6461FC" },
        { name: { de: "Nacht", en: "Night" }, hex: "#090711" },
        { name: { de: "Tiefe", en: "Depth" }, hex: "#0E0B19" },
        { name: { de: "Weiß", en: "White" }, hex: "#FFFFFF" },
        { name: { de: "Schwarz", en: "Black" }, hex: "#000000" },
      ],
    },
    website: {
      intro: {
        de: "Jede Seite hat einen Job: Vertrauen aufbauen, das Problem benennen, das Gespräch buchen.",
        en: "Every page has one job: build trust, name the problem, book the call.",
      },
      feature: {
        title: { de: "Eine Startseite, die zuerst Ergebnisse zeigt.", en: "A home page that shows results first." },
        text: {
          de: "Selmir im Zentrum, Kundenlogos direkt darunter und vier echte Fallstudien mit Umsatzkurven. Wer hier landet, sieht zuerst, was die Zusammenarbeit bringt.",
          en: "Selmir at the centre, client logos right below and four real case studies with revenue curves. Anyone who lands here first sees what working together delivers.",
        },
        shot: shot(`${SS}/web-home.webp`, 1600, 805, "Fallstudie mit Umsatzkurve auf der Startseite", "Case study with revenue curve on the home page"),
      },
      wide: {
        title: { de: "Die Geschichte hinter dem Berater.", en: "The story behind the consultant." },
        text: {
          de: "Vom Kriegsflüchtling zum Unternehmer und Investor: Die Über-Seite erzählt Selmirs Weg und macht seine Haltung greifbar.",
          en: "From war refugee to entrepreneur and investor: the about page tells Selmir’s journey and makes his attitude tangible.",
        },
        shot: shot(`${SS}/web-ueber.webp`, 1600, 805, "Über-Seite von Selmir Suljkanovic", "Selmir Suljkanovic’s about page"),
        height: 760,
      },
      pair: [
        { caption: { de: "Event-Seite für die Sales Mastery Days", en: "Event page for the Sales Mastery Days" }, shot: shot(`${SS}/web-event.webp`, 1600, 805, "Event-Seite der Sales Mastery Days", "Sales Mastery Days event page") },
        { caption: { de: "Acht Landingpages für die Potenzialanalyse", en: "Eight landing pages for the potential analysis" }, shot: shot(`${SS}/web-landing.webp`, 1600, 805, "Landingpage Betriebs-Röntgen", "Business X-ray landing page") },
      ],
    },
    mobile: {
      kind: "devices",
      eyebrow: { de: "Mobile & Stories", en: "Mobile & stories" },
      title: { de: "Auf dem Handy _zuerst._", en: "On the phone _first._" },
      text: {
        de: "Die meisten Unternehmer sehen Selmir zuerst auf Instagram oder YouTube. Website, Landingpages und Leitfaden sind deshalb vom kleinen Bildschirm her gedacht: ein Satz, ein Beweis, ein Button.",
        en: "Most business owners first see Selmir on Instagram or YouTube. That’s why the website, landing pages and guide are designed from the small screen up: one sentence, one proof, one button.",
      },
      phones: [`${SS}/phone-1.webp`, `${SS}/phone-2.webp`, `${SS}/phone-3.webp`],
    },
    social: {
      eyebrow: { de: "Ads & Social", en: "Ads & social" },
      title: { de: "Ads, die im Feed _stoppen._", en: "Ads that _stop the scroll._" },
      intro: {
        de: "111 Motive in neun Themenwelten, jeweils in 4:5, 1:1 und 9:16: von Umsatzkurven über WhatsApp-Mockups bis zu Kunden-Fallstudien als Karussell.",
        en: "111 creatives across nine themes, each in 4:5, 1:1 and 9:16: from revenue curves and WhatsApp mock-ups to client case studies as carousels.",
      },
      posts: [
        { src: `${SS}/post-1.webp`, alt: { de: "Ad: Inoffizielle Mitteilung", en: "Ad: Unofficial announcement" } },
        { src: `${SS}/post-2.webp`, alt: { de: "Ad: So hat Hörmann Haustechnik die Wärmepumpen-Verkäufe verzwanzigfacht", en: "Ad: How Hörmann Haustechnik multiplied heat pump sales twentyfold" } },
        { src: `${SS}/post-3.webp`, alt: { de: "Ad: Das Problem sind nicht die Anfragen", en: "Ad: The problem isn’t the enquiries" } },
        { src: `${SS}/post-4.webp`, alt: { de: "Ad: Mehr arbeiten ist keine Strategie. Struktur ist eine.", en: "Ad: Working more isn’t a strategy. Structure is." } },
        { src: `${SS}/post-5.webp`, alt: { de: "Ad: Wann genau soll dein Betrieb wachsen?", en: "Ad: When exactly is your business supposed to grow?" } },
        { src: `${SS}/post-6.webp`, alt: { de: "Ad: Planbarkeit ist kein Zufall", en: "Ad: Predictability is no accident" } },
      ],
    },
    offline: {
      eyebrow: { de: "Lead-Magnet", en: "Lead magnet" },
      title: { de: "Ein Leitfaden, der _Kontakte bringt._", en: "A guide that _brings in contacts._" },
      intro: {
        de: "Der Verkaufsleitfaden aus Selmirs YouTube-Rollenspiel als zehnseitiges PDF, mit eigener Landingpage zum Anfordern.",
        en: "The sales guide from Selmir’s YouTube role-play as a ten-page PDF, with its own landing page to request it.",
      },
      main: { src: `${SS}/offline.webp`, alt: { de: "Landingpage für den Rollenspiel-Leitfaden", en: "Landing page for the role-play guide" } },
    },
  },
  {
    slug: "lokshift",
    client: "LokShift",
    domain: "LokShift Web-App",
    seo: {
      title: { de: "Case Study LokShift | TyloTech", en: "Case study LokShift | TyloTech" },
      description: {
        de: "Web-App und Mobile App für LokShift: Einsatzplanung, Zeiterfassung, Zeitkonten und Spesen für Lokführer und Disposition im Schienengüterverkehr.",
        en: "Web app and mobile app for LokShift: shift planning, time tracking, time accounts and expenses for train drivers and dispatch in rail freight.",
      },
    },
    hero: {
      title: { de: "Dienstpläne, Zeiten und Spesen _in einer App._", en: "Rosters, hours and expenses _in one app._" },
      intro: {
        de: "Web-App und Mobile App für LokShift: Einsatzplanung, Zeiterfassung, Zeitkonten und Spesen für Lokführer und Disposition, im Büro und unterwegs auf dem Handy.",
        en: "Web app and mobile app for LokShift: shift planning, time tracking, time accounts and expenses for train drivers and dispatch, in the office and on the phone on the move.",
      },
      meta: [
        { label: { de: "Kunde", en: "Client" }, value: { de: "LokShift", en: "LokShift" } },
        { label: { de: "Branche", en: "Industry" }, value: { de: "Schienenverkehr", en: "Rail transport" } },
        { label: { de: "Leistungen", en: "Services" }, value: { de: "UX/UI-Design, Web-App, Mobile App", en: "UX/UI design, web app, mobile app" } },
      ],
      slides: [
        shot(`${LS}/hero.webp`, 1440, 900, "Dashboard der LokShift Web-App", "LokShift web app dashboard"),
        shot(`${LS}/web-plans.webp`, 1440, 900, "Dienstpläne in der LokShift Web-App", "Shift plans in the LokShift web app"),
        shot(`${LS}/web-times.webp`, 1440, 900, "Zeiterfassung mit Freigabe", "Time tracking with approval"),
        shot(`${LS}/web-reports.webp`, 1440, 900, "Berichte in der LokShift Web-App", "Reports in the LokShift web app"),
      ],
      slideSmall: `${LS}/hero-720.webp`,
    },
    card: {
      image: `${LS}/card.webp`,
      gallery: [
        shot(`${LS}/card.webp`, 1280, 800, "Dashboard der LokShift Web-App", "LokShift web app dashboard"),
        shot(`${LS}/web-plans.webp`, 1440, 900, "Dienstpläne in der LokShift Web-App", "Shift plans in the LokShift web app"),
        shot(`${LS}/web-accounts.webp`, 1440, 900, "Zeitkonten pro Mitarbeiter", "Time accounts per employee"),
        shot(`${LS}/web-perdiem.webp`, 1440, 900, "Spesen und Verpflegungspauschalen", "Expenses and meal allowances"),
      ],
      tags: { de: ["Software", "Web-App", "Mobile App"], en: ["Software", "Web app", "Mobile app"] },
      text: {
        de: "LokShift, Disposition im Schienengüterverkehr: Web-App und Mobile App für Dienstpläne, Zeiten und Spesen.",
        en: "LokShift, dispatch in rail freight: web app and mobile app for rosters, hours and expenses.",
      },
      metrics: [
        { value: { de: "56", en: "56" }, label: { de: "Screens in der Mobile App", en: "screens in the mobile app" } },
        { value: { de: "11", en: "11" }, label: { de: "Bereiche in der Web-App", en: "areas in the web app" } },
      ],
    },
    results: {
      compact: [
        { channel: "app", label: { de: "Mobile App", en: "Mobile app" }, value: 56, suffix: { de: " Screens", en: " screens" }, chip: { de: "für Lokführer", en: "for train drivers" } },
        { channel: "web", label: { de: "Web-App", en: "Web app" }, value: 11, suffix: { de: " Bereiche", en: " areas" }, chip: { de: "für die Disposition", en: "for dispatch" } },
      ],
      testimonial: {
        category: { de: "Software", en: "Software" },
        name: "LokShift",
        place: { de: "Schienenverkehr", en: "Rail transport" },
      },
    },
    overview: {
      situation: {
        de: "LokShift plant den Einsatz von Lokführern bei Kunden im Schienengüterverkehr. Dafür braucht es jeden Tag verlässliche Dienstpläne, korrekt erfasste Arbeitszeiten und eine saubere Abrechnung von Spesen und Zeitkonten.",
        en: "LokShift schedules train drivers for clients in rail freight. That takes reliable rosters every day, correctly recorded working hours and clean accounting for expenses and time accounts.",
      },
      tasks: {
        de: [
          "Eine Web-App, in der die Disposition alle Einsätze plant und freigibt",
          "Eine Mobile App, mit der Lokführer ihren Tagesplan sehen und Zeiten erfassen",
          "Zeitkonten, Spesen und Urlaubsgeld ohne Excel-Listen",
          "Berichte, die sich mit einem Klick exportieren lassen",
        ],
        en: [
          "A web app in which dispatch plans and approves every assignment",
          "A mobile app in which train drivers see their daily plan and log their hours",
          "Time accounts, expenses and holiday pay without Excel sheets",
          "Reports that export with one click",
        ],
      },
    },
    challenges: {
      intro: {
        de: "Drei Dinge mussten gleichzeitig stimmen, sonst wäre es eine weitere App geworden, die niemand öffnet.",
        en: "Three things had to work at once, or it would have become yet another app nobody opens.",
      },
      items: [
        {
          title: { de: "Zwei Rollen, ein System", en: "Two roles, one system" },
          text: {
            de: "Die Disposition plant am Schreibtisch, Lokführer arbeiten unterwegs. Beide brauchen dieselben Daten, aber eine andere Ansicht.",
            en: "Dispatch plans at the desk, train drivers work on the move. Both need the same data, but a different view of it.",
          },
        },
        {
          title: { de: "Regeln, die stimmen müssen", en: "Rules that have to be right" },
          text: {
            de: "Arbeitszeiten, Pausen, Spesen und Urlaubsgeld folgen festen Regeln. Ein falscher Wert kostet Geld und Vertrauen.",
            en: "Working hours, breaks, expenses and holiday pay follow fixed rules. One wrong value costs money and trust.",
          },
        },
        {
          title: { de: "Bedienung im Schichtalltag", en: "Built for shift work" },
          text: {
            de: "Zwischen zwei Fahrten bleibt kaum Zeit. Eine Zeit zu erfassen muss in wenigen Sekunden gehen.",
            en: "There is hardly any time between two runs. Logging hours has to take a few seconds.",
          },
        },
      ],
    },
    approach: {
      intro: { de: "Vier Schritte, von den Abläufen im Betrieb bis zur fertigen App.", en: "Four steps, from how the business runs to the finished app." },
      steps: [
        {
          title: { de: "Abläufe & Rollen", en: "Processes & roles" },
          text: {
            de: "Wie wird heute geplant, erfasst und abgerechnet? Wer braucht welche Information, und wann?",
            en: "How are planning, time tracking and accounting done today? Who needs which information, and when?",
          },
        },
        {
          title: { de: "Design-System", en: "Design system" },
          text: {
            de: "Farben, Typografie und Komponenten, die in Web-App und Mobile App gleich funktionieren.",
            en: "Colours, typography and components that work the same in the web app and the mobile app.",
          },
        },
        {
          title: { de: "Web-App für die Disposition", en: "Web app for dispatch" },
          text: {
            de: "Dashboard, Dienstpläne, Zeiterfassung, Zeitkonten, Spesen und Berichte an einem Ort.",
            en: "Dashboard, rosters, time tracking, time accounts, expenses and reports in one place.",
          },
        },
        {
          title: { de: "Mobile App für unterwegs", en: "Mobile app on the move" },
          text: {
            de: "Tagesplan, Kalender, Zeiten, Chat und Live-Ansicht für die Lokführer auf dem Handy.",
            en: "Daily plan, calendar, hours, chat and a live view for train drivers on their phones.",
          },
        },
      ],
    },
    brand: {
      intro: {
        de: "Ein klares Blau, viel Weiß und Inter: ruhig genug für lange Schichten, deutlich genug für Status und Warnungen.",
        en: "A clear blue, lots of white and Inter: calm enough for long shifts, clear enough for statuses and warnings.",
      },
      logo: { src: `${LS}/logo.svg`, w: 302, h: 64, bg: "#E6F2FF" },
      type: { sample: "Jede Schicht im Blick.", font: "inter", label: "Inter" },
      colors: [
        { name: { de: "Blau", en: "Blue" }, hex: "#0064E0" },
        { name: { de: "Hellblau", en: "Light blue" }, hex: "#E6F2FF" },
        { name: { de: "Tinte", en: "Ink" }, hex: "#191919" },
        { name: { de: "Grau", en: "Grey" }, hex: "#777777" },
        { name: { de: "Grün", en: "Green" }, hex: "#28A745" },
        { name: { de: "Weiß", en: "White" }, hex: "#FFFFFF" },
      ],
    },
    website: {
      title: { de: "Die _Web-App._", en: "The _web app._" },
      intro: { de: "Jede Ansicht hat einen Job: planen, erfassen, abrechnen.", en: "Every view has one job: plan, record, settle." },
      feature: {
        title: { de: "Dienstpläne in einer Liste.", en: "Rosters in one list." },
        text: {
          de: "Wer fährt wann, für welchen Kunden und wo: Pläne anlegen, zuweisen und bestätigen, gefiltert nach Status und Woche.",
          en: "Who drives when, for which client and where: create, assign and confirm plans, filtered by status and week.",
        },
        shot: shot(`${LS}/web-plans.webp`, 1440, 900, "Dienstpläne in der LokShift Web-App", "Shift plans in the LokShift web app"),
      },
      wide: {
        title: { de: "Zeiterfassung mit Freigabe.", en: "Time tracking with approval." },
        text: {
          de: "Beginn, Ende, Pause und Kunde pro Eintrag. Die Disposition gibt Stunden frei oder lehnt sie ab, bevor sie ins Zeitkonto laufen.",
          en: "Start, end, break and client per entry. Dispatch approves or rejects hours before they go into the time account.",
        },
        shot: shot(`${LS}/web-times.webp`, 1440, 900, "Zeiterfassung in der LokShift Web-App", "Time tracking in the LokShift web app"),
        height: 837,
      },
      pair: [
        { caption: { de: "Zeitkonten pro Mitarbeiter", en: "Time accounts per employee" }, shot: shot(`${LS}/web-accounts.webp`, 1440, 900, "Zeitkonten in der LokShift Web-App", "Time accounts in the LokShift web app") },
        { caption: { de: "Spesen und Verpflegungspauschalen", en: "Expenses and meal allowances" }, shot: shot(`${LS}/web-perdiem.webp`, 1440, 900, "Spesen in der LokShift Web-App", "Expenses in the LokShift web app") },
      ],
    },
    mobile: {
      kind: "devices",
      eyebrow: { de: "Mobile App", en: "Mobile app" },
      title: { de: "Für unterwegs _gebaut._", en: "Built for _the road._" },
      text: {
        de: "Lokführer sehen ihren Tagesplan, erfassen Zeiten und schreiben mit der Disposition, direkt auf dem Handy und ohne Umweg über das Büro.",
        en: "Train drivers see their daily plan, log their hours and message dispatch, right on their phone and without going through the office.",
      },
      phones: [`${LS}/phone-1.webp`, `${LS}/phone-2.webp`, `${LS}/phone-3.webp`],
    },
    social: {
      eyebrow: { de: "App-Screens", en: "App screens" },
      title: { de: "Jede Funktion _auf dem Handy._", en: "Every feature _on the phone._" },
      intro: {
        de: "Live-Ansicht, Zeitkonten, Berichte und Chat: dieselben Daten wie in der Web-App, gebaut für den kleinen Bildschirm.",
        en: "Live view, time accounts, reports and chat: the same data as in the web app, built for the small screen.",
      },
      phones: true,
      posts: [
        { src: `${LS}/screen-1.webp`, alt: { de: "Live-Ansicht ohne aktive Schicht", en: "Live view with no active shift" } },
        { src: `${LS}/screen-2.webp`, alt: { de: "Zeitkonto in der App", en: "Time account in the app" } },
        { src: `${LS}/screen-3.webp`, alt: { de: "Berichte in der App", en: "Reports in the app" } },
        { src: `${LS}/screen-4.webp`, alt: { de: "Chats mit der Disposition", en: "Chats with dispatch" } },
      ],
    },
    offline: {
      eyebrow: { de: "Berichte", en: "Reports" },
      title: { de: "Berichte auf _Knopfdruck._", en: "Reports at _the push of a button._" },
      intro: {
        de: "Arbeitszeitberichte für Mitarbeiter und Kunden, in der Vorschau prüfen und direkt exportieren.",
        en: "Working-time reports for employees and clients: check them in the preview and export them straight away.",
      },
      browser: true,
      main: { src: `${LS}/web-reports.webp`, w: 1440, h: 900, alt: { de: "Berichte in der LokShift Web-App", en: "Reports in the LokShift web app" } },
    },
  },
  {
    slug: "priyas-cleaning-service",
    client: "Priya's Cleaning Service",
    domain: "Priya's Web-App",
    seo: {
      title: { de: "Case Study Priya's Cleaning Service | TyloTech", en: "Case study Priya's Cleaning Service | TyloTech" },
      description: {
        de: "Web-App und Mobile App für Priya's Cleaning Service in Berlin: Einsätze planen, Check-ins des Teams, Kunden und Rechnungen und die Abrechnung der Alltagshilfe.",
        en: "Web app and mobile app for Priya's Cleaning Service in Berlin: scheduling, team check-ins, clients and invoices, and billing for home help.",
      },
    },
    hero: {
      title: { de: "Reinigung und Alltagshilfe _aus einer Hand geplant._", en: "Cleaning and home help, _planned in one place._" },
      intro: {
        de: "Web-App und Mobile App für Priya's Cleaning Service: Einsätze planen, Check-ins des Teams sehen, Kunden und Rechnungen verwalten und die Alltagshilfe sauber abrechnen.",
        en: "Web app and mobile app for Priya's Cleaning Service: plan assignments, see team check-ins, manage clients and invoices, and bill home help cleanly.",
      },
      meta: [
        { label: { de: "Kunde", en: "Client" }, value: { de: "Priya's Cleaning Service", en: "Priya's Cleaning Service" } },
        { label: { de: "Branche", en: "Industry" }, value: { de: "Reinigung, Alltagshilfe", en: "Cleaning, home help" } },
        { label: { de: "Leistungen", en: "Services" }, value: { de: "UX/UI-Design, Web-App, Mobile App", en: "UX/UI design, web app, mobile app" } },
      ],
      slides: [
        shot(`${PC}/hero.webp`, 1440, 900, "Dashboard der Priya's Web-App", "Priya's web app dashboard"),
        shot(`${PC}/web-schedule.webp`, 1440, 900, "Einsatzplan für alle Teams", "Schedule for every team"),
        shot(`${PC}/web-clients.webp`, 1440, 900, "Kunden und Objekte", "Clients and properties"),
        shot(`${PC}/web-report.webp`, 1440, 900, "Monatsbericht für die Alltagshilfe", "Monthly home-help report"),
      ],
      slideSmall: `${PC}/hero-720.webp`,
    },
    card: {
      image: `${PC}/card.webp`,
      gallery: [
        shot(`${PC}/card.webp`, 1280, 800, "Dashboard der Priya's Web-App", "Priya's web app dashboard"),
        shot(`${PC}/web-schedule.webp`, 1440, 900, "Einsatzplan für alle Teams", "Schedule for every team"),
        shot(`${PC}/web-clients.webp`, 1440, 900, "Kunden und Objekte", "Clients and properties"),
        shot(`${PC}/web-invoices.webp`, 1440, 900, "Rechnungen mit Status", "Invoices with status"),
      ],
      tags: { de: ["Software", "Web-App", "Mobile App"], en: ["Software", "Web app", "Mobile app"] },
      text: {
        de: "Priya's Cleaning Service, Reinigung und Alltagshilfe in Berlin: Web-App und Mobile App für Einsätze, Kunden und Abrechnung.",
        en: "Priya's Cleaning Service, cleaning and home help in Berlin: web app and mobile app for assignments, clients and billing.",
      },
      metrics: [
        { value: { de: "26", en: "26" }, label: { de: "Screens in der Mobile App", en: "screens in the mobile app" } },
        { value: { de: "17", en: "17" }, label: { de: "Ansichten in der Web-App", en: "views in the web app" } },
      ],
    },
    results: {
      compact: [
        { channel: "app", label: { de: "Mobile App", en: "Mobile app" }, value: 26, suffix: { de: " Screens", en: " screens" }, chip: { de: "für das Team", en: "for the team" } },
        { channel: "web", label: { de: "Web-App", en: "Web app" }, value: 17, suffix: { de: " Ansichten", en: " views" }, chip: { de: "für die Leitung", en: "for management" } },
      ],
      testimonial: {
        category: { de: "Software", en: "Software" },
        name: "Priya's Cleaning Service",
        place: { de: "Reinigung und Alltagshilfe, Berlin", en: "Cleaning and home help, Berlin" },
      },
    },
    overview: {
      situation: {
        de: "Priya's Cleaning Service betreut in Berlin zwei Geschäftsbereiche: Reinigung für Firmen und Objekte sowie Alltagshilfe für Menschen mit Pflegegrad, abgerechnet mit den Pflegekassen.",
        en: "Priya's Cleaning Service runs two lines of business in Berlin: cleaning for companies and properties, and home help for people with a care grade, billed to the care insurers.",
      },
      tasks: {
        de: [
          "Ein Einsatzplan für beide Bereiche, mit Teams, Objekten und Zeiten",
          "Check-in und Check-out des Teams direkt am Einsatzort",
          "Kunden, Objekte und Rechnungen an einem Ort",
          "Monatsberichte für die Alltagshilfe ohne Papierkram",
        ],
        en: [
          "One schedule for both lines of business, with teams, properties and times",
          "Team check-in and check-out right at the job site",
          "Clients, properties and invoices in one place",
          "Monthly home-help reports without paperwork",
        ],
      },
    },
    challenges: {
      intro: {
        de: "Drei Dinge mussten gleichzeitig stimmen, sonst wäre es eine weitere App geworden, die niemand öffnet.",
        en: "Three things had to work at once, or it would have become yet another app nobody opens.",
      },
      items: [
        {
          title: { de: "Zwei Geschäftsbereiche, eine App", en: "Two lines of business, one app" },
          text: {
            de: "Reinigung und Alltagshilfe folgen anderen Regeln. Die App muss beide trennen, ohne zwei Systeme daraus zu machen.",
            en: "Cleaning and home help follow different rules. The app has to keep them apart without turning them into two systems.",
          },
        },
        {
          title: { de: "Nachweise, die halten müssen", en: "Records that have to hold up" },
          text: {
            de: "In der Alltagshilfe zählen Leistungsnachweis und Pflegegrad. Jeder Einsatz muss für die Abrechnung mit der Pflegekasse belegbar sein.",
            en: "In home help, service records and care grades are what count. Every visit has to be provable when billing the care insurer.",
          },
        },
        {
          title: { de: "Ein Team, das unterwegs ist", en: "A team on the move" },
          text: {
            de: "Die Mitarbeitenden sind bei Kunden vor Ort. Plan, Adresse und Check-in müssen auf dem Handy sofort da sein.",
            en: "Staff work on site at clients. Plan, address and check-in have to be on the phone instantly.",
          },
        },
      ],
    },
    approach: {
      intro: { de: "Vier Schritte, von den Abläufen im Betrieb bis zur fertigen App.", en: "Four steps, from how the business runs to the finished app." },
      steps: [
        {
          title: { de: "Abläufe & Rollen", en: "Processes & roles" },
          text: {
            de: "Wie werden Einsätze heute geplant, belegt und abgerechnet? Was braucht die Leitung, was das Team vor Ort?",
            en: "How are visits planned, documented and billed today? What does management need, and what does the team on site need?",
          },
        },
        {
          title: { de: "Design-System", en: "Design system" },
          text: {
            de: "Priya-Grün, klare Typografie und Komponenten, die in Web-App und Mobile App gleich funktionieren.",
            en: "Priya green, clear typography and components that work the same in the web app and the mobile app.",
          },
        },
        {
          title: { de: "Web-App für die Leitung", en: "Web app for management" },
          text: {
            de: "Dashboard, Einsatzplan, Kunden, Mitarbeitende, Rechnungen und Berichte an einem Ort.",
            en: "Dashboard, schedule, clients, staff, invoices and reports in one place.",
          },
        },
        {
          title: { de: "Mobile App für das Team", en: "Mobile app for the team" },
          text: {
            de: "Tagesplan, Check-in am Einsatzort, Kundendetails, Team-Chat und Meldungen auf dem Handy.",
            en: "Daily plan, on-site check-in, client details, team chat and reports on the phone.",
          },
        },
      ],
    },
    brand: {
      intro: {
        de: "Das Grün aus dem Priya-Logo, viel Weißraum und Inter: freundlich für das Team, klar für die Abrechnung.",
        en: "The green from the Priya logo, lots of white space and Inter: friendly for the team, clear for billing.",
      },
      logo: { src: `${PC}/logo.svg`, w: 179, h: 72, bg: "#EEF5E8" },
      type: { sample: "Leistung mit Herz.", font: "inter", label: "Inter" },
      colors: [
        { name: { de: "Grün", en: "Green" }, hex: "#5D8E3F" },
        { name: { de: "Hellgrün", en: "Light green" }, hex: "#72A94F" },
        { name: { de: "Salbei", en: "Sage" }, hex: "#EEF5E8" },
        { name: { de: "Petrol", en: "Petrol" }, hex: "#16587C" },
        { name: { de: "Tiefgrün", en: "Deep green" }, hex: "#2A322A" },
        { name: { de: "Weiß", en: "White" }, hex: "#FFFFFF" },
      ],
    },
    website: {
      title: { de: "Die _Web-App._", en: "The _web app._" },
      intro: { de: "Jede Ansicht hat einen Job: planen, einsetzen, abrechnen.", en: "Every view has one job: plan, assign, bill." },
      feature: {
        title: { de: "Der Einsatzplan für alle Teams.", en: "One schedule for every team." },
        text: {
          de: "Reinigung und Alltagshilfe in einer Ansicht, gefiltert nach Team, Kunde und Status. Neue Einsätze sind mit wenigen Klicks verteilt.",
          en: "Cleaning and home help in one view, filtered by team, client and status. New visits are assigned in a few clicks.",
        },
        shot: shot(`${PC}/web-schedule.webp`, 1440, 900, "Einsatzplan in der Priya's Web-App", "Schedule in the Priya's web app"),
      },
      wide: {
        title: { de: "Kunden und Objekte an einem Ort.", en: "Clients and properties in one place." },
        text: {
          de: "Ansprechpartner, Objekte, Leistungen und offene Rechnungen pro Kunde, ohne zwischen Tabellen zu springen.",
          en: "Contacts, properties, services and open invoices per client, without jumping between spreadsheets.",
        },
        shot: shot(`${PC}/web-clients.webp`, 1440, 900, "Kundenliste in der Priya's Web-App", "Client list in the Priya's web app"),
        height: 837,
      },
      pair: [
        { caption: { de: "Mitarbeitende und Auslastung", en: "Staff and workload" }, shot: shot(`${PC}/web-employees.webp`, 1440, 900, "Mitarbeitende in der Priya's Web-App", "Staff in the Priya's web app") },
        { caption: { de: "Rechnungen mit Status", en: "Invoices with status" }, shot: shot(`${PC}/web-invoices.webp`, 1440, 900, "Rechnungen in der Priya's Web-App", "Invoices in the Priya's web app") },
      ],
    },
    mobile: {
      kind: "devices",
      eyebrow: { de: "Mobile App", en: "Mobile app" },
      title: { de: "Für das Team _vor Ort._", en: "For the team _on site._" },
      text: {
        de: "Die Mitarbeitenden sehen ihren Plan, checken am Einsatzort ein und melden Schäden oder fehlende Reinigungsmittel direkt aus der App.",
        en: "Staff see their plan, check in at the job site and report damage or missing cleaning supplies straight from the app.",
      },
      phones: [`${PC}/phone-1.webp`, `${PC}/phone-2.webp`, `${PC}/phone-3.webp`],
    },
    social: {
      eyebrow: { de: "App-Screens", en: "App screens" },
      title: { de: "Jede Rolle hat _ihre Ansicht._", en: "Every role has _its own view._" },
      intro: {
        de: "Anmeldung, Kundendetails, Team-Chat, Alarme und der Monatsbericht für die Alltagshilfe, alles in derselben App.",
        en: "Sign-in, client details, team chat, alerts and the monthly home-help report, all in the same app.",
      },
      phones: true,
      posts: [
        { src: `${PC}/screen-1.webp`, alt: { de: "Anmeldung in der App", en: "App sign-in" } },
        { src: `${PC}/screen-2.webp`, alt: { de: "Kundendetails", en: "Client details" } },
        { src: `${PC}/screen-3.webp`, alt: { de: "Team-Chat", en: "Team chat" } },
        { src: `${PC}/screen-4.webp`, alt: { de: "Alarme", en: "Alerts" } },
        { src: `${PC}/screen-5.webp`, alt: { de: "Monatsbericht für die Alltagshilfe", en: "Monthly home-help report" } },
      ],
    },
    offline: {
      eyebrow: { de: "Alltagshilfe", en: "Home help" },
      title: { de: "Monatsberichte für die _Pflegekasse._", en: "Monthly reports for _the care insurer._" },
      intro: {
        de: "Alle Einsätze eines Monats mit Leistungsnachweis, geprüft und bereit für die Abrechnung.",
        en: "Every visit of the month with its service record, checked and ready for billing.",
      },
      browser: true,
      main: { src: `${PC}/web-report.webp`, w: 1440, h: 900, alt: { de: "Monatsbericht in der Priya's Web-App", en: "Monthly report in the Priya's web app" } },
    },
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);

/** Plain title without the `_accent_` markers (metadata, card headings). */
export const plainTitle = (c: CaseStudy, locale: Locale) => c.hero.title[locale].replace(/_/g, "");
