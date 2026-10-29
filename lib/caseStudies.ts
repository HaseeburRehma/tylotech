/* Case studies: one entry per project, rendered by components/pages/CaseStudyPage.
 * Copy and images from Figma "Case Study · Crusty Slices" (4970:16) and
 * "Case Study · Fahrschule Abgefahrn" (4972:441). Figma placeholders ("[Zeitraum]",
 * "[Erkenntnis 1]", "[Learning 1]", empty story slots …) are left out on purpose;
 * the optional fields below exist so real content can be added later.
 *
 * Text fields use `_…_` for the Instrument Serif accent (see branche/ui Accent). */

import type { Locale } from "./i18n";

export type L<T = string> = { de: T; en: T };

/** A website screenshot shown in a browser frame. */
export type Shot = { src: string; w: number; h: number; alt: L };

export type Channel = "organic" | "tiktok" | "meta";

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
  quote: L;
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
  url: string;
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
  card: { image: string; tags: L<string[]>; text: L; metrics: { value: L; label: L }[] };
  results: { wide: Metric; compact: [Metric, Metric]; testimonial: Testimonial };
  overview: { situation: L; tasks: L<string[]> };
  challenges: { intro: L; items: Card[] };
  /** "Was wir herausgefunden haben" — only with real research findings */
  insights?: { intro: L; items: Card[] };
  approach: { intro: L; steps: Card[] };
  brand: {
    intro: L;
    logo: { src: string; w: number; h: number };
    type: { sample: string; font: "anton" | "tomorrow"; label: string };
    colors: { name: L; hex: string }[];
  };
  website: {
    intro: L;
    feature: { title: L; text: L; shot: Shot };
    wide: { title: L; text: L; shot: Shot; height: number };
    pair: { caption: L; shot: Shot }[];
  };
  mobile: MobileSection;
  social: { title: L; intro: L; posts: { src: string; alt: L }[] };
  offline: { title: L; intro: L; main: { src: string; alt: L }; extra?: { src: string; alt: L }[] };
  /** "Was wir mitnehmen" — only with real learnings */
  learnings?: { intro: L; items: Card[] };
};

const shot = (src: string, w: number, h: number, de: string, en: string): Shot => ({ src, w, h, alt: { de, en } });

const CS = "/case-studies/crusty-slices";
const FA = "/case-studies/fahrschule-abgefahrn";

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
        de: "Website, Theorieplan, Online-Anmeldung und Social Media für Fahrschule Abgefahrn in Düsseldorf: 4.500 organische Besuche im Monat, 5 Mio. Reichweite auf TikTok.",
        en: "Website, theory schedule, online sign-up and social media for Fahrschule Abgefahrn in Düsseldorf: 4,500 organic visits a month and 5 million reach on TikTok.",
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
      tags: { de: ["Fahrschule", "Website", "Social Media"], en: ["Driving school", "Website", "Social media"] },
      text: {
        de: "Fahrschule Abgefahrn, Düsseldorf: Website, Theorieplan, Anmeldung und Social Media.",
        en: "Fahrschule Abgefahrn, Düsseldorf: website, theory schedule, sign-up and social media.",
      },
      metrics: [
        { value: { de: "4.500", en: "4,500" }, label: { de: "organische Besuche / Monat", en: "organic visits / month" } },
        { value: { de: "5 Mio.", en: "5M" }, label: { de: "Reichweite auf TikTok", en: "reach on TikTok" } },
      ],
    },
    results: {
      wide: { channel: "organic", label: { de: "Organische Besuche", en: "Organic visits" }, value: 4500, suffix: { de: " / Monat", en: " / month" }, chip: { de: "Letzte 12 Monate", en: "Last 12 months" } },
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
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);

/** Plain title without the `_accent_` markers (metadata, card headings). */
export const plainTitle = (c: CaseStudy, locale: Locale) => c.hero.title[locale].replace(/_/g, "");
