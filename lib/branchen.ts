/* Industry landing pages (Figma page "✅ Branchenseiten").
 *
 * Copy is transcribed 1:1 from Figma. `_…_` marks the Instrument-Serif italic
 * accent (gold) inside headlines; `\n` is a Figma line break (applied from sm up). Images live in /public/branchen/<slug>/. */

export type IconName =
  | "hammer" | "map-pin" | "globe" | "store" | "briefcase" | "shield-check"
  | "chart-line" | "git-branch" | "search" | "users" | "message-circle" | "clock"
  | "star" | "monitor" | "layers" | "eye" | "user" | "circle-help" | "megaphone"
  | "refresh-cw" | "chart-column" | "gauge" | "circle-alert" | "workflow"
  | "trending-up" | "award" | "target" | "mail" | "file-text" | "sparkles";

export type Brand =
  | "google" | "google-ads" | "google-analytics" | "meta" | "linkedin"
  | "instagram" | "tiktok" | "youtube" | "shopify";

export type Kanal = { label: string; brand?: Brand; icon?: IconName };

export type PainVisual =
  | { kind: "image"; src: string }
  | { kind: "rankings" }
  | { kind: "kpi"; label: string; value: string; falling?: boolean }
  | { kind: "channels" };

export type Branche = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  /** eyebrow of the closing CTA (Figma "10 · CTA") */
  ctaEyebrow: string;
  hero: {
    icon: IconName;
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    image: string;
    cards: [
      { brand: Brand; label: string; value: string },
      { brand: Brand; label: string; value: string },
    ];
    chip: string;
  };
  kennst: {
    intro: string;
    points: { icon: IconName; text: string }[];
    grund: string;
    grundImage: string;
  };
  loesung: {
    text: string;
    kanaele: Kanal[];
    ergebnisse: { label: string; value: string }[];
    pillars: { icon: IconName; title: string; text: string }[];
  };
  pains: { visual: PainVisual; title: string; text: string }[];
  steps: { title: string; text: string }[];
  fuerWen: {
    icon: IconName;
    title: string;
    sub?: string;
    rows: number[]; // tiles per row, e.g. [4, 3]
    tiles: { label: string; image: string }[];
  };
  case: {
    title: string;
    logo?: "rohrcleaner";
    text?: string;
    before?: string[];
    after?: string[];
    placeholder: string;
    extraPlaceholder?: string;
    image?: string;
    imageFit?: "top";
    /** TyloTech logo badge over the case image (our own brand as the case) */
    tyloLogo?: boolean;
  };
  faq: { q: string; a: string }[];
};

const img = (slug: string, f: string) => `/branchen/${slug}/${f}.webp`;

export const BRANCHEN: Branche[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "handwerk",
    ctaEyebrow: "Kostenlose Potenzialanalyse",
    name: "Handwerk",
    metaTitle: "Marketing, Leadgenerierung & Recruiting für Handwerksbetriebe | TyloTech",
    metaDescription:
      "Mehr Aufträge und Fachkräfte für dein Handwerk: sichtbar bei Google und in der KI-Suche, exklusive Anfragen und Bewerbungen. Ein System, ein Ansprechpartner.",
    hero: {
      icon: "hammer",
      eyebrow: "Marketing, Leadgenerierung & Recruiting für Handwerksbetriebe",
      title: "Mehr Aufträge und Fachkräfte\nfür dein Handwerk,\n_planbar, nicht dem\nZufall überlassen._",
      sub: "Wir bringen dich bei Google und in der KI-Suche nach oben, liefern exklusive Anfragen kaufkräftiger Kunden und finden dir die Fachkräfte, die du zum Wachsen brauchst. Ein System, ein Ansprechpartner.",
      cta: "Kostenlose Potenzialanalyse",
      image: img("handwerk", "hero"),
      cards: [
        { brand: "google", label: "Neue Anfrage", value: "Komplettbad, 45.000 €" },
        { brand: "meta", label: "Neue Bewerbung", value: "Anlagenmechaniker SHK" },
      ],
      chip: "Platz 1 bei Google und in der KI",
    },
    kennst: {
      intro:
        "Dein Handwerk stimmt. Trotzdem ist die Auftragslage ein ständiges Auf und Ab, und gute Leute zu finden fühlt sich an wie ein zweiter Vollzeitjob.",
      points: [
        { icon: "chart-line", text: "Deine Auftragslage ist Glückssache: mal zu viel, mal Funkstille, du kannst nichts planen." },
        { icon: "git-branch", text: "Du zahlst viel Geld an Leadportale und bekommst schlechte, an mehrere Betriebe geteilte Anfragen." },
        { icon: "search", text: "Bei „[Gewerk] + deine Stadt“ steht die Konkurrenz oben, dich findet bei Google kaum jemand." },
        { icon: "users", text: "Du suchst händeringend Monteure und Fachkräfte, aber Stellenanzeigen bringen niemanden." },
        { icon: "message-circle", text: "Empfehlungen tragen nicht mehr wie früher, die jüngere Generation googelt und fragt die KI." },
        { icon: "clock", text: "Du steckst so tief im Tagesgeschäft, dass für Marketing und Sichtbarkeit schlicht keine Zeit bleibt." },
      ],
      grund:
        "Der Grund liegt _selten an deiner Arbeit_, sondern daran, dass Kunden heute zuerst bei Google und immer häufiger in der KI suchen, und dass die besten Fachkräfte längst nicht mehr auf Stellenanzeigen reagieren.",
      grundImage: img("handwerk", "grund"),
    },
    loesung: {
      text: "Genau hier setzen wir an: Wir machen dich sichtbar, wo deine Kunden und deine künftigen Mitarbeiter wirklich hinschauen, und bauen daraus ein System, das planbar Anfragen und Bewerbungen liefert.",
      kanaele: [
        { label: "Google Suche", brand: "google" },
        { label: "KI-Suche", icon: "sparkles" },
        { label: "Meta Ads", brand: "meta" },
        { label: "Social Recruiting", brand: "instagram" },
      ],
      ergebnisse: [
        { label: "Neue Anfrage", value: "Komplettbad, 45.000 €" },
        { label: "Neue Bewerbung", value: "Anlagenmechaniker SHK" },
        { label: "Neue Anfrage", value: "Wärmepumpe, 36.000 €" },
      ],
      pillars: [
        { icon: "trending-up", title: "Aufträge", text: "Eigene Kanäle, die exklusive Anfragen bringen, die nur dir gehören. Kein Teilen, kein Unterbieten." },
        { icon: "users", title: "Fachkräfte", text: "Bewerbungen landen direkt in deinem Portal, vorqualifiziert nach Erfahrung, sodass du nur noch entscheiden musst." },
        { icon: "award", title: "Markenaufbau", text: "So wirst du der Name, den man in der Region zuerst nennt. Raus aus der Vergleichbarkeit, rein in die Preishoheit." },
      ],
    },
    pains: [
      {
        visual: { kind: "rankings" },
        title: "Kunden finden uns bei Google und in der KI nicht.",
        text: "Die meisten Kunden suchen heute bei Google nach „[Gewerk] + Stadt“, und immer öfter fragen sie direkt eine KI wie ChatGPT oder Perplexity um Rat. Wer dort nicht auftaucht, existiert für diese Kunden nicht. Wir bauen dein lokales SEO systematisch auf und optimieren dich zusätzlich für die KI-Suche (GEO), damit du bei Google ganz oben stehst UND von der KI empfohlen wirst, wenn Kunden nach einem Betrieb wie deinem fragen. Genau das haben wir für Rohr Cleaner erreicht: heute Platz 1. Das Ergebnis: planbar Anfragen, ohne für jeden einzelnen Klick zu bezahlen.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-2") },
        title: "Wir finden keine Fachkräfte.",
        text: "Die besten Monteure und Techniker suchen nicht aktiv, sie haben einen Job. Eine klassische Stellenanzeige erreicht sie nie. Wir sprechen genau diese wechselbereiten Fachkräfte dort an, wo sie täglich unterwegs sind (Social Media), mit Anzeigen, die neugierig machen. Parallel bauen wir dich zu einer echten Arbeitgebermarke auf, einem Betrieb, bei dem man arbeiten will. Bewerbungen landen direkt in deinem Portal, vorqualifiziert nach Erfahrung, sodass du nur noch entscheiden musst.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-3") },
        title: "Wir hängen an teuren, geteilten Leadportalen.",
        text: "Bei Leadportalen zahlst du für Anfragen, die gleichzeitig an drei andere Betriebe gehen, und landest im Preiskampf, den keiner gewinnt. Wir bauen dir eigene Kanäle, die exklusive Anfragen bringen, die nur dir gehören. Kein Teilen, kein Unterbieten, keine Abhängigkeit von einer Plattform, die jederzeit die Preise erhöhen kann.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-4") },
        title: "Wir werden nur über den Preis verglichen.",
        text: "Ohne sichtbare Marke bist du für den Kunden austauschbar, also nimmt er den Billigsten. Wir bauen deine Sichtbarkeit und dein Vertrauen auf: ein starkes Google-Profil, konstant neue Bewertungen und professioneller Content, der deinen Expertenstatus zeigt. So wirst du der Name, den man in der Region zuerst nennt, und raus aus der Vergleichbarkeit, rein in die Preishoheit.",
      },
    ],
    steps: [
      { title: "Konversionsstarke Website & Landingpages", text: "Das Fundament, das Billig-Anfrager filtert und Qualitätskunden anfragen lässt." },
      { title: "Lokales SEO & GEO", text: "Damit dich Kunden bei Google UND in der KI-Suche finden, planbar und ohne Klickkosten." },
      { title: "Neukunden-Gewinnung", text: "Gezielte Kampagnen auf Meta und Google bringen exklusive Anfragen kaufkräftiger Kunden." },
      { title: "Regionale Sichtbarkeit", text: "Google-Profil, Bewertungen und lokale Präsenz machen dich zum bekanntesten Namen deiner Region." },
      { title: "Fachkräfte-Gewinnung", text: "Social Recruiting + Arbeitgebermarke liefern die Bewerbungen, die du zum Wachsen brauchst." },
      { title: "Transparenz über TyloHQ", text: "Alle Anfragen, Bewerbungen und Zahlen live in deinem eigenen Portal." },
    ],
    fuerWen: {
      icon: "hammer",
      title: "Für diese Gewerke _lohnt sich_ unser System.",
      sub: "Vom Ein-Mann-Betrieb bis zum Betrieb mit 20+ Mitarbeitern.",
      rows: [4, 3],
      tiles: [
        { label: "Sanitär-, Heizungs- & SHK-Betriebe", image: img("handwerk", "tile-1") },
        { label: "Elektrobetriebe", image: img("handwerk", "tile-2") },
        { label: "Dachdecker", image: img("handwerk", "tile-3") },
        { label: "Maler & Bodenleger", image: img("handwerk", "tile-4") },
        { label: "GaLaBau", image: img("handwerk", "tile-5") },
        { label: "Rohrreinigung & Schlüsseldienst", image: img("handwerk", "tile-6") },
        { label: "Solar- & Energietechnik", image: img("handwerk", "tile-7") },
      ],
    },
    case: {
      logo: "rohrcleaner",
      title: "Rohr Cleaner: _Platz 1_ bei Google UND in der KI-Suche",
      before: ["Online kaum sichtbar", "Anfragen nur über Empfehlung"],
      after: [
        "Heute Platz 1 bei Google und in der KI-Suche (GEO) für die zentralen Suchbegriffe",
        "Planbar Anfragen über die eigene Website statt über teure Portale",
      ],
      placeholder: "Konkrete Zahlen & O-Ton ergänzen.",
      extraPlaceholder: "Recruiting-Case Akmir folgt, sobald live.",
      image: img("handwerk", "case"),
      imageFit: "top",
    },
    faq: [
      { q: "Woher weiß ich, dass das für meinen Betrieb funktioniert?", a: "Das klären wir ehrlich im kostenlosen Erstgespräch. Wir schauen uns dein Gewerk, deine Region und deine Auftragslage an und sagen dir klar, ob und wie unser System bei dir greift." },
      { q: "Ich hatte schon eine Agentur, ohne Erfolg. Was macht ihr anders?", a: "Wir sind keine Agentur, sondern dein Wachstumspartner: ein System aus einer Hand statt Einzelleistungen, volle Transparenz über dein eigenes Portal, und der GEO-Vorsprung, den kein anderer bietet." },
      { q: "Wie schnell sehe ich Ergebnisse?", a: "Bezahlte Anfragen können in den ersten Wochen kommen; lokales SEO und GEO bauen über die ersten Monate eine planbare, dauerhafte Sichtbarkeit auf." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "lokale-dienstleister",
    ctaEyebrow: "Kostenlose Sichtbarkeits-Analyse für deine Region",
    name: "Lokale Dienstleister",
    metaTitle: "Marketing & lokale Sichtbarkeit für Dienstleister | TyloTech",
    metaDescription:
      "Werde in deiner Stadt gefunden: ganz oben bei Google, auf Google Maps und in der KI-Suche. Mehr Bewertungen, planbare Anfragen.",
    hero: {
      icon: "map-pin",
      eyebrow: "Marketing & lokale Sichtbarkeit für Dienstleister",
      title: "Werde in deiner Stadt\ngefunden, _bevor es dein\nWettbewerber wird._",
      sub: "Ob Reinigung, Hausmeisterservice, Umzug, Pflege oder Gastronomie: Wir sorgen dafür, dass Kunden in deiner Region dich zuerst finden, bei Google, auf der Karte und in der KI-Suche.",
      cta: "Kostenlose Sichtbarkeits-Analyse",
      image: img("lokale-dienstleister", "hero"),
      cards: [
        { brand: "google", label: "Neue Anfrage", value: "Büroreinigung, wöchentlich" },
        { brand: "google", label: "Neue Bewertung", value: "5 Sterne auf Google" },
      ],
      chip: "Ganz oben bei Google und auf der Karte",
    },
    kennst: {
      intro:
        "Als lokaler Dienstleister lebst du von Kunden aus deiner Nähe. Doch heute entscheidet nicht mehr, wer das beste Schild an der Straße hat, sondern wer bei Google und auf Google Maps ganz oben steht.",
      points: [
        { icon: "map-pin", text: "Kunden aus deiner Nähe finden dich online nicht, obwohl du direkt um die Ecke bist." },
        { icon: "search", text: "Auf Google Maps steht die Konkurrenz oben, du tauchst erst auf Seite 2 auf." },
        { icon: "star", text: "Du hast zu wenige oder veraltete Bewertungen, andere wirken vertrauenswürdiger." },
        { icon: "message-circle", text: "Anfragen kommen unregelmäßig und fast nur über Empfehlung." },
        { icon: "clock", text: "Du hast schlicht keine Zeit, dich ums Online-Marketing zu kümmern." },
        { icon: "monitor", text: "Deine Website ist da, bringt aber keine einzige Anfrage." },
      ],
      grund: "Wer dort nicht auftaucht, verliert die Kunden an den Wettbewerber, _selbst wenn der schlechter ist_.",
      grundImage: img("lokale-dienstleister", "grund"),
    },
    loesung: {
      text: "Wir sorgen dafür, dass du in deiner Stadt und deinen Stadtteilen sichtbar bist, dass deine Bewertungen überzeugen und dass aus Besuchern Anfragen werden.",
      kanaele: [
        { label: "Google Suche", brand: "google" },
        { label: "Google Maps", icon: "map-pin" },
        { label: "KI-Suche", icon: "sparkles" },
        { label: "Umkreis-Ads", icon: "megaphone" },
      ],
      ergebnisse: [
        { label: "Neue Anfrage", value: "Büroreinigung" },
        { label: "Neue Bewertung", value: "5 Sterne auf Google" },
        { label: "Neue Anfrage", value: "Umzug, 3 Zimmer" },
      ],
      pillars: [
        { icon: "map-pin", title: "Sichtbarkeit", text: "Wir bringen dich bei „[Leistung] + deine Stadt“ und in deinen Stadtteilen ganz nach oben." },
        { icon: "star", title: "Bewertungen", text: "Ein einfacher Prozess, mit dem zufriedene Kunden nach jedem Auftrag ganz leicht eine Bewertung hinterlassen." },
        { icon: "trending-up", title: "Anfragen", text: "Ein System aus lokaler Sichtbarkeit und gezielten Umkreis-Ads, das dir konstant und planbar Anfragen bringt." },
      ],
    },
    pains: [
      {
        visual: { kind: "rankings" },
        title: "Wir werden lokal nicht gefunden.",
        text: "80 % der lokalen Anfragen entstehen über Google und Google Maps. Wir bringen dich bei „[Leistung] + deine Stadt“ und in deinen Stadtteilen ganz nach oben, und optimieren dich zusätzlich für die KI-Suche, damit dich auch ChatGPT und Perplexity empfehlen. So findet dich der Kunde genau in dem Moment, in dem er sucht.",
      },
      {
        visual: { kind: "image", src: img("lokale-dienstleister", "pain-2") },
        title: "Wir haben zu wenige Bewertungen.",
        text: "Bewertungen sind der stärkste lokale Ranking-Faktor, und das Erste, worauf Kunden schauen. Wir bauen dir einen einfachen Prozess, mit dem zufriedene Kunden nach jedem Auftrag ganz leicht eine Bewertung hinterlassen. So kommen konstant neue dazu, dein Profil wächst und du steigst in den Rankings.",
      },
      {
        visual: { kind: "kpi", label: "Neue Anfragen", value: "548" },
        title: "Unsere Anfragen sind reine Glückssache.",
        text: "Statt auf Empfehlungen zu hoffen, bauen wir ein System aus lokaler Sichtbarkeit und gezielten Umkreis-Ads, das dir konstant und planbar Anfragen bringt, unabhängig von Saison und Zufall.",
      },
      {
        visual: { kind: "image", src: img("lokale-dienstleister", "pain-4") },
        title: "Unsere Website bringt nichts.",
        text: "Eine schöne Website reicht nicht, sie muss Besucher in Anfragen verwandeln. Wir bauen eine konversionsstarke Seite mit klaren Leistungen, echten Vertrauens-Signalen und einem einfachen Weg zur Kontaktaufnahme.",
      },
    ],
    steps: [
      { title: "Konversionsstarke lokale Website", text: "Klare Leistungen, Vertrauen, einfacher Kontakt: gebaut, um Anfragen zu bringen." },
      { title: "Lokales SEO & GEO", text: "Sichtbarkeit bei Google und in der KI-Suche für deine Stadt und Stadtteile." },
      { title: "Google-Profil & Google Maps", text: "Vollständig optimiert, damit du im „Local Pack“ ganz oben stehst." },
      { title: "Bewertungs-System", text: "Ein einfacher Prozess für konstant neue Bewertungen, der stärkste lokale Hebel." },
      { title: "Umkreis-Ads", text: "Gezielte Werbung in deiner Region, die planbar Anfragen bringt." },
      { title: "Transparenz über TyloHQ", text: "Alle Anfragen und Zahlen live einsehbar." },
    ],
    fuerWen: {
      icon: "store",
      title: "Für diese Betriebe _lohnt sich_ unser System.",
      sub: "Überall dort, wo Kunden aus der Region kommen.",
      rows: [3, 3],
      tiles: [
        { label: "Gebäudereinigung & Hausmeisterservice", image: img("lokale-dienstleister", "tile-1") },
        { label: "Umzugsunternehmen", image: img("lokale-dienstleister", "tile-2") },
        { label: "Pflege- & Betreuungsdienste", image: img("lokale-dienstleister", "tile-3") },
        { label: "Garten- & Landschaftsbau", image: img("lokale-dienstleister", "tile-4") },
        { label: "Lokale Gastronomie & Läden", image: img("lokale-dienstleister", "tile-5") },
        { label: "Fahrschulen", image: img("lokale-dienstleister", "tile-6") },
      ],
    },
    case: {
      title: "SRS Hausmeisterservice & lokale Betriebe in _Düsseldorf/NRW_",
      before: ["Begrenzte lokale Sichtbarkeit", "Anfragen über Empfehlung"],
      after: ["Lokale Präsenz aufgebaut", "Stärkere Sichtbarkeit in der Region", "Konstantere Anfragen über eigene Kanäle"],
      placeholder: "Konkrete Zahlen ergänzen.",
      image: img("lokale-dienstleister", "case"),
    },
    faq: [
      { q: "Lohnt sich das für einen kleinen Betrieb?", a: "Gerade für lokale Betriebe ist Sichtbarkeit der größte Hebel überhaupt. Ein Kunde mehr pro Woche macht übers Jahr einen großen Unterschied." },
      { q: "Wie kommt ihr an neue Bewertungen?", a: "Über einen einfachen Prozess (QR-Code / Link nach jedem Auftrag), mit dem zufriedene Kunden in Sekunden eine Bewertung hinterlassen. Ihr müsst nur fragen, den Rest bauen wir." },
      { q: "Wie schnell sehe ich Ergebnisse?", a: "Erste Effekte oft in wenigen Wochen; die lokale Sichtbarkeit baut sich über die ersten Monate stabil auf." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "online-dienstleistungen",
    ctaEyebrow: "Kostenloses Erstgespräch",
    name: "Online-Dienstleistungen",
    metaTitle: "Marketing für Online-Dienstleister, Coaches & digitale Anbieter | TyloTech",
    metaDescription:
      "Mehr qualifizierte Anfragen ohne im überfüllten Markt unterzugehen: klare Positionierung, digitale Autorität und ein System, das planbar Kunden bringt.",
    hero: {
      icon: "globe",
      eyebrow: "Marketing für Online-Dienstleister, Coaches & digitale Anbieter",
      title: "Mehr qualifizierte Anfragen,\n_ohne im überfüllten Markt\nunterzugehen._",
      sub: "Coaches, Berater, Software- und Online-Anbieter: Wir schärfen deine Positionierung, bauen deine Autorität auf und verwandeln Besucher in zahlende Kunden, mit einem System, das nicht nur an dir hängt.",
      cta: "Erstgespräch sichern",
      image: img("online-dienstleistungen", "hero"),
      cards: [
        { brand: "linkedin", label: "Neue Anfrage", value: "Business-Coaching, 1:1" },
        { brand: "meta", label: "Erstgespräch gebucht", value: "Dienstag, 10:00 Uhr" },
      ],
      chip: "Planbar qualifizierte Anfragen",
    },
    kennst: {
      intro:
        "Der Markt für Online-Dienstleistungen ist voll, und von außen sehen fast alle gleich aus. Dein Angebot mag exzellent sein, aber wenn ein Fremder in fünf Sekunden nicht versteht, warum gerade du, klickt er weiter.",
      points: [
        { icon: "layers", text: "Du gehst im überfüllten Markt unter, alle Anbieter sehen gleich aus." },
        { icon: "shield-check", text: "Fremde vertrauen dir nicht, weil du keinen physischen Standort und wenig Sichtbarkeit hast." },
        { icon: "eye", text: "Dein Angebot ist stark, aber niemand versteht in 5 Sekunden, was dich besonders macht." },
        { icon: "chart-line", text: "Du bekommst Traffic, aber kaum jemand wird zum Kunden." },
        { icon: "user", text: "Deine Reichweite hängt komplett an dir: kein System, keine Planbarkeit." },
        { icon: "circle-help", text: "Du weißt nicht, welcher Kanal wirklich Kunden bringt und welcher nur Geld kostet." },
      ],
      grund:
        "Ohne physischen Standort musst du Vertrauen _komplett digital_ aufbauen. Und wenn deine Reichweite nur an dir selbst hängt, gibt es keine Planbarkeit.",
      grundImage: img("online-dienstleistungen", "grund"),
    },
    loesung: {
      text: "Wir lösen genau das: klare Positionierung, digitales Vertrauen und ein System, das planbar Anfragen bringt.",
      kanaele: [
        { label: "Personal Brand", brand: "linkedin" },
        { label: "Performance Ads", brand: "meta" },
        { label: "Google Suche", brand: "google" },
        { label: "KI-Suche", icon: "sparkles" },
      ],
      ergebnisse: [
        { label: "Neue Anfrage", value: "Business-Coaching" },
        { label: "Erstgespräch gebucht", value: "Dienstag, 10:00 Uhr" },
        { label: "Neue Anfrage", value: "SaaS-Demo angefragt" },
      ],
      pillars: [
        { icon: "target", title: "Positionierung", text: "Wir arbeiten heraus, was dich wirklich einzigartig macht." },
        { icon: "shield-check", title: "Vertrauen", text: "Echter Mehrwert-Content, sichtbare Ergebnisse, Bewertungen und eine überzeugende Story." },
        { icon: "trending-up", title: "Planbare Anfragen", text: "Landingpages, die konvertieren, klare Angebote und automatisiertes Follow-up, das Interessenten zum Abschluss führt." },
      ],
    },
    pains: [
      {
        visual: { kind: "image", src: img("online-dienstleistungen", "pain-1") },
        title: "Wir gehen im Markt unter.",
        text: "Ohne klare Positionierung bist du einer von vielen. Wir arbeiten heraus, was dich wirklich einzigartig macht, und bauen deine Sichtbarkeit als Autorität in deiner Nische auf, über Personal Brand und gezielten Content, damit Kunden dich wählen und nicht den Nächstbesten.",
      },
      {
        visual: { kind: "image", src: img("online-dienstleistungen", "pain-2") },
        title: "Fremde vertrauen uns nicht.",
        text: "Vertrauen ist im Digitalen die größte Hürde. Wir bauen es systematisch auf: über echten Mehrwert-Content, sichtbare Ergebnisse, Bewertungen und eine überzeugende Story, damit Interessenten dir glauben, noch bevor ihr das erste Mal sprecht.",
      },
      {
        visual: { kind: "kpi", label: "Neue Anfragen", value: "572" },
        title: "Traffic wird nicht zu Kunden.",
        text: "Besucher allein zahlen keine Rechnungen. Wir bauen den Weg vom Besucher zum Kunden: Landingpages, die konvertieren, klare Angebote und automatisiertes Follow-up, das Interessenten zum Abschluss führt.",
      },
      {
        visual: { kind: "channels" },
        title: "Wir wissen nicht, was funktioniert.",
        text: "Wir arbeiten datengetrieben: In deinem eigenen Portal siehst du live, welcher Kanal welche Anfragen zu welchen Kosten bringt. Volle Transparenz statt Bauchgefühl, damit du das Budget dorthin lenkst, wo es wirkt.",
      },
    ],
    steps: [
      { title: "Positionierung", text: "Wir schärfen, was dich einzigartig macht, die Basis für alles." },
      { title: "Personal Brand & Content", text: "Sichtbarkeit und Autorität in deiner Nische aufbauen." },
      { title: "Funnels & Landingpages", text: "Der Weg vom Besucher zum Kunden, gebaut auf Conversion." },
      { title: "Performance Ads", text: "Gezielte Kampagnen, die qualifizierte Anfragen bringen." },
      { title: "SEO & GEO", text: "Gefunden werden bei Google und in der KI-Suche." },
      { title: "Transparenz über TyloHQ", text: "Live sehen, welcher Kanal wirklich Kunden bringt." },
    ],
    fuerWen: {
      icon: "globe",
      title: "Für diese Anbieter _lohnt sich_ unser System.",
      rows: [3, 2],
      tiles: [
        { label: "Coaches & Berater", image: img("online-dienstleistungen", "tile-1") },
        { label: "Agenturen & Freelancer", image: img("online-dienstleistungen", "tile-2") },
        { label: "SaaS- & Software-Anbieter", image: img("online-dienstleistungen", "tile-3") },
        { label: "Online-Kurse & digitale Produkte", image: img("online-dienstleistungen", "tile-4") },
        { label: "Info-Produkte & Experten", image: img("online-dienstleistungen", "tile-5") },
      ],
    },
    case: {
      title: "Unsere eigenen Marken _als Beweis_",
      text: "Wir bauen unsere eigenen Marken (TyloTech, Marokko Investment) mit genau diesen Methoden auf: digitale Sichtbarkeit, Autorität und Leadgenerierung.",
      placeholder: "Sobald ein externer Online-Dienstleister-Case mit Zahlen vorliegt, wird er hier ergänzt.",
      image: img("online-dienstleistungen", "case"),
      tyloLogo: true,
    },
    faq: [
      { q: "Funktioniert das auch ohne große Reichweite?", a: "Ja, wir bauen Reichweite und Autorität gezielt auf, du musst nicht schon bekannt sein. Wichtig ist ein klares Angebot und die Bereitschaft, sichtbar zu werden." },
      { q: "Muss ich selbst vor die Kamera / Content liefern?", a: "Für eine starke Personal Brand hilft es sehr, aber wir nehmen dir Konzept, Produktion und Verteilung ab, sodass dein Aufwand minimal bleibt." },
      { q: "Wie messt ihr den Erfolg?", a: "An qualifizierten Anfragen und Abschlüssen, nicht an Likes. Alles transparent in deinem Portal." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "e-commerce",
    ctaEyebrow: "Kostenlose Shop-Analyse",
    name: "E-Commerce",
    metaTitle: "Performance-Marketing & SEO für Online-Shops | TyloTech",
    metaDescription:
      "Profitabel skalieren, auch wenn die Werbekosten steigen: Ads auf Return statt Klicks, E-Commerce-SEO und GEO, Retention-Strecken für Stammkunden.",
    hero: {
      icon: "store",
      eyebrow: "Performance-Marketing & SEO für Online-Shops",
      title: "Profitabel skalieren,\n_auch wenn die Werbekosten\nsteigen._",
      sub: "Wir bringen deinem Shop profitable Neukunden über Meta und Google, holen dir kostenlosen Traffic über SEO und die KI-Suche und machen aus Erstkäufern echte Stammkunden.",
      cta: "Kostenlose Shop-Analyse",
      image: img("e-commerce", "hero"),
      cards: [
        { brand: "meta", label: "Neue Bestellung", value: "Erstkäufer über Meta" },
        { brand: "shopify", label: "Stammkunde", value: "Nachkauf per E-Mail" },
      ],
      chip: "Gesteuert auf Return statt auf Klicks",
    },
    kennst: {
      intro:
        "Einen Online-Shop zu betreiben heißt heute, gegen steigende Werbekosten anzukämpfen. Neue Kunden werden teurer, und wenn sie nur einmal kaufen, bleibt am Ende zu wenig übrig.",
      points: [
        { icon: "megaphone", text: "Deine Werbekosten steigen, aber die Umsätze halten nicht mit." },
        { icon: "refresh-cw", text: "Du gewinnst Neukunden, aber sie kaufen nie wieder." },
        { icon: "search", text: "Bei Google und in der Produktsuche wirst du kaum gefunden, du zahlst für jeden Besucher." },
        { icon: "chart-column", text: "Du weißt nicht genau, welche Kampagne wirklich profitabel ist." },
        { icon: "gauge", text: "Dein Shop hat Besucher, aber die Conversion-Rate ist zu niedrig." },
        { icon: "git-branch", text: "Du bist zu abhängig von einem einzigen Kanal. Fällt der weg, fällt der Umsatz." },
      ],
      grund:
        "Gleichzeitig verschenken die meisten Shops _kostenlosen Traffic_, weil sie bei Google und in der Produktsuche kaum auftauchen.",
      grundImage: img("e-commerce", "grund"),
    },
    loesung: {
      text: "Wir setzen an allen drei Hebeln an: profitable Ads, kostenloser organischer Traffic und mehr Umsatz pro Kunde.",
      kanaele: [
        { label: "Meta Ads", brand: "meta" },
        { label: "Google Shopping", brand: "google-ads" },
        { label: "SEO & KI-Suche", icon: "sparkles" },
        { label: "E-Mail-Flows", icon: "mail" },
      ],
      ergebnisse: [
        { label: "Neue Bestellung", value: "Erstkäufer über Meta" },
        { label: "Stammkunde", value: "Nachkauf per E-Mail" },
        { label: "Neue Bestellung", value: "Organisch über Google" },
      ],
      pillars: [
        { icon: "megaphone", title: "Profitable Ads", text: "Kampagnen, gesteuert auf echten Return (ROAS): richtige Zielgruppen, starke Creatives, sauberes Tracking." },
        { icon: "search", title: "Organischer Traffic", text: "E-Commerce-SEO und GEO, damit deine Produkte und Kategorien bei Google und in der KI-Suche ranken." },
        { icon: "refresh-cw", title: "Mehr Umsatz pro Kunde", text: "Automatisierte E-Mail- und Retention-Strecken, die aus Erstkäufern Stammkunden machen." },
      ],
    },
    pains: [
      {
        visual: { kind: "channels" },
        title: "Unsere Ads werden zu teuer.",
        text: "Viele Shops optimieren auf Klicks statt auf Profit. Wir steuern deine Kampagnen auf echten Return (ROAS): richtige Zielgruppen, starke Creatives, sauberes Tracking, damit aus jedem Werbe-Euro mehr Umsatz wird und du profitabel skalieren kannst statt nur mehr auszugeben.",
      },
      {
        visual: { kind: "image", src: img("e-commerce", "pain-2") },
        title: "Kunden kaufen nur einmal.",
        text: "Der günstigste Umsatz ist der vom Bestandskunden. Wir bauen automatisierte E-Mail- und Retention-Strecken (Willkommen, Warenkorb-Abbrecher, Nachkauf, Reaktivierung), die aus Erstkäufern Stammkunden machen: planbarer Umsatz ohne zusätzliche Werbekosten.",
      },
      {
        visual: { kind: "rankings" },
        title: "Wir werden organisch nicht gefunden.",
        text: "Jeder Besucher über Google oder die KI-Suche kostet dich nichts extra. Wir bauen E-Commerce-SEO und GEO auf, damit deine Produkte und Kategorien bei Google und in der KI-Suche ranken: kostenloser, dauerhafter Traffic, der deine Abhängigkeit von bezahlten Ads senkt.",
      },
      {
        visual: { kind: "image", src: img("e-commerce", "pain-4") },
        title: "Unser Shop konvertiert schlecht.",
        text: "Traffic ist teuer, also muss er sich lohnen. Wir optimieren Produktseiten, Checkout und Vertrauens-Signale, damit aus demselben Traffic mehr Umsatz wird. Oft liegt hier der schnellste Hebel überhaupt.",
      },
    ],
    steps: [
      { title: "Analyse & Tracking", text: "Sauberes Fundament, damit wir wissen, was wirklich profitabel ist." },
      { title: "Performance Ads", text: "Meta & Google Shopping, gesteuert auf Return statt auf Klicks." },
      { title: "E-Commerce-SEO & GEO", text: "Kostenloser Traffic über Google und die KI-Suche." },
      { title: "E-Mail-Flows & Retention", text: "Aus Erstkäufern Stammkunden machen." },
      { title: "Conversion-Optimierung", text: "Mehr Umsatz aus demselben Traffic." },
      { title: "Transparenz über TyloHQ", text: "Alle Kampagnen und Zahlen live im Portal." },
    ],
    fuerWen: {
      icon: "store",
      title: "Für diese Shops _lohnt sich_ unser System.",
      sub: "Von Shopify bis TikTok Shop.",
      rows: [3, 2],
      tiles: [
        { label: "Mode & Lifestyle", image: img("e-commerce", "tile-1") },
        { label: "Food & Nahrungsergänzung", image: img("e-commerce", "tile-2") },
        { label: "Beauty & Kosmetik", image: img("e-commerce", "tile-3") },
        { label: "Home & Living", image: img("e-commerce", "tile-4") },
        { label: "Nischen- & Marken-Shops", image: img("e-commerce", "tile-5") },
      ],
    },
    case: {
      title: "Hidaya Nutrition: _E-Commerce-Infrastruktur_",
      text: "Wir bauen für Hidaya Nutrition die komplette E-Commerce-Infrastruktur auf (TikTok Shop → Shopify).",
      placeholder: "Sobald belastbare Umsatz- und ROAS-Zahlen vorliegen, werden sie hier als Case ergänzt.",
      image: img("e-commerce", "case"),
    },
    faq: [
      { q: "Ab welchem Umsatz lohnt sich das?", a: "Sobald du regelmäßig verkaufst und wachsen willst. Wir sagen dir im Erstgespräch ehrlich, wo dein größter Hebel liegt (oft ist es Retention oder Conversion, nicht mehr Ad-Budget)." },
      { q: "Arbeitet ihr mit Shopify / meinem System?", a: "Ja, wir arbeiten mit den gängigen Shop-Systemen (Shopify u. a.) und binden Tracking und Flows sauber an." },
      { q: "Wie schnell sehe ich Ergebnisse?", a: "Bei Ads und Conversion oft schon in den ersten Wochen; SEO und Retention bauen über die Monate stabil auf." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "b2b-dienstleistung",
    ctaEyebrow: "Kostenloses Erstgespräch",
    name: "B2B-Dienstleistung",
    metaTitle: "Leadgenerierung für B2B-Dienstleister | TyloTech",
    metaDescription:
      "Qualifizierte B2B-Anfragen, planbar statt vom Zufall abhängig: LinkedIn, Google, Autoritäts-Content und Lead-Nurturing bis zum Abschluss.",
    hero: {
      icon: "briefcase",
      eyebrow: "Leadgenerierung für B2B-Dienstleister",
      title: "Qualifizierte B2B-Anfragen,\n_planbar statt vom Zufall\nabhängig._",
      sub: "Wir bauen dir ein Leadgen-System, das konstant qualifizierte Entscheider-Anfragen bringt, über LinkedIn, Google und gezielte Kampagnen, inklusive Nurturing bis zum Abschluss.",
      cta: "Erstgespräch sichern",
      image: img("b2b-dienstleistung", "hero"),
      cards: [
        { brand: "linkedin", label: "Neue Anfrage", value: "Geschäftsführer, IT-Service" },
        { brand: "google", label: "Termin gebucht", value: "Donnerstag, 14:00 Uhr" },
      ],
      chip: "Qualifizierte Entscheider-Anfragen",
    },
    kennst: {
      intro:
        "Im B2B hängt vieles an Beziehungen und Empfehlungen, und genau das macht das Wachstum unberechenbar. Ein guter Monat, dann Funkstille.",
      points: [
        { icon: "chart-line", text: "Deine Pipeline ist leer oder völlig unberechenbar." },
        { icon: "users", text: "Du bekommst Anfragen, aber selten von den richtigen Entscheidern." },
        { icon: "clock", text: "Dein Sales-Cycle ist lang, Interessenten springen unterwegs ab." },
        { icon: "message-circle", text: "Du bist auf Empfehlungen angewiesen und kannst nicht gezielt skalieren." },
        { icon: "layers", text: "Deine Positionierung macht dich für Kunden austauschbar." },
        { icon: "circle-help", text: "Du weißt nicht, was dich ein qualifizierter Lead wirklich kostet." },
      ],
      grund:
        "Die Anfragen, die kommen, sind oft _nicht die richtigen Entscheider_, und der lange Sales-Cycle sorgt dafür, dass Interessenten unterwegs abspringen.",
      grundImage: img("b2b-dienstleistung", "grund"),
    },
    loesung: {
      text: "Wir bauen daraus ein System: gezielte Ansprache der richtigen Entscheider, Aufbau von Autorität und ein Nurturing, das aus Interessenten Kunden macht, planbar und messbar.",
      kanaele: [
        { label: "LinkedIn", brand: "linkedin" },
        { label: "Google Suche", brand: "google" },
        { label: "Autoritäts-Content", icon: "file-text" },
        { label: "Lead-Nurturing", icon: "mail" },
      ],
      ergebnisse: [
        { label: "Neue Anfrage", value: "GF, IT-Dienstleister" },
        { label: "Termin gebucht", value: "Donnerstag, 14:00 Uhr" },
        { label: "Neue Anfrage", value: "Einkauf, Industrie" },
      ],
      pillars: [
        { icon: "target", title: "Die richtigen Entscheider", text: "Wir targeten präzise die relevanten Entscheider (Branche, Rolle, Unternehmensgröße)." },
        { icon: "award", title: "Autorität", text: "Content, damit sie dich kennen und dir vertrauen, bevor ihr das erste Mal sprecht." },
        { icon: "mail", title: "Nurturing", text: "E-Mail-Strecken, Retargeting und wertvolle Inhalte, die Interessenten über Wochen warm halten, bis sie kaufbereit sind." },
      ],
    },
    pains: [
      {
        visual: { kind: "kpi", label: "Neue Anfragen", value: "536" },
        title: "Unsere Pipeline ist unberechenbar.",
        text: "Empfehlungen sind schön, aber nicht steuerbar. Wir bauen ein planbares Leadgen-System über LinkedIn und Google, das konstant qualifizierte Anfragen liefert, damit du deine Pipeline aktiv füllst, statt auf den nächsten Zufall zu warten.",
      },
      {
        visual: { kind: "image", src: img("b2b-dienstleistung", "pain-2") },
        title: "Wir erreichen nicht die richtigen Entscheider.",
        text: "Im B2B zählt, wen du erreichst. Wir targeten präzise die relevanten Entscheider (Branche, Rolle, Unternehmensgröße) und bauen parallel deine Autorität über Content auf, damit sie dich kennen und dir vertrauen, bevor ihr das erste Mal sprecht.",
      },
      {
        visual: { kind: "image", src: img("b2b-dienstleistung", "pain-3") },
        title: "Leads springen im langen Sales-Cycle ab.",
        text: "B2B-Entscheidungen brauchen Zeit. Wir bauen ein Lead-Nurturing (E-Mail-Strecken, Retargeting, wertvolle Inhalte), das Interessenten über Wochen warm hält, bis sie kaufbereit sind, sodass kein qualifizierter Kontakt verloren geht.",
      },
      {
        visual: { kind: "kpi", label: "Cost per Lead", value: "18 €", falling: true },
        title: "Wir können nicht skalieren.",
        text: "Ohne Zahlen kein Wachstum. Wir machen deinen Vertrieb messbar: Du siehst, was ein Lead kostet, wie viele zu Kunden werden und wo du drehen kannst. Ein wiederholbares System statt Bauchgefühl.",
      },
    ],
    steps: [
      { title: "Positionierung & Botschaft", text: "Klar machen, warum gerade du, die Basis jeder B2B-Kampagne." },
      { title: "LinkedIn- & Google-Kampagnen", text: "Gezielte Ansprache der richtigen Entscheider." },
      { title: "Autoritäts-Content", text: "Vertrauen aufbauen, bevor das erste Gespräch stattfindet." },
      { title: "Leadgen-Funnels", text: "Der Weg vom Kontakt zur qualifizierten Anfrage." },
      { title: "Lead-Nurturing", text: "Interessenten über den langen Cycle warm halten." },
      { title: "Transparenz über TyloHQ", text: "Cost-per-Lead und Pipeline live im Portal." },
    ],
    fuerWen: {
      icon: "briefcase",
      title: "Für diese Dienstleister _lohnt sich_ unser System.",
      rows: [3, 2],
      tiles: [
        { label: "Beratungen & Kanzleien", image: img("b2b-dienstleistung", "tile-1") },
        { label: "IT- & Software-Dienstleister", image: img("b2b-dienstleistung", "tile-2") },
        { label: "Industrie- & Produktionszulieferer", image: img("b2b-dienstleistung", "tile-3") },
        { label: "Personaldienstleister", image: img("b2b-dienstleistung", "tile-4") },
        { label: "Spezialisierte B2B-Services mit hohem Auftragswert", image: img("b2b-dienstleistung", "tile-5") },
      ],
    },
    case: {
      title: "SCC Sales: _Website & Leadgen-Beratung_",
      text: "Wir haben für SCC Sales den Website-Aufbau und die Beratung zu Leadgenerierung und Marketing übernommen.",
      placeholder: "Sobald belastbare Leadgen-Zahlen vorliegen, werden sie hier als Case ergänzt.",
      image: img("b2b-dienstleistung", "case"),
    },
    faq: [
      { q: "Funktioniert das in meiner Nische?", a: "Gerade in spezialisierten B2B-Nischen ist gezieltes Leadgen extrem effektiv, weil die Zielgruppe klar definierbar ist. Das klären wir im Erstgespräch." },
      { q: "Wir haben einen langen Sales-Cycle, lohnt sich das?", a: "Gerade dann: Unser Nurturing sorgt dafür, dass kein Lead unterwegs verloren geht, sondern warm bleibt, bis er kaufbereit ist." },
      { q: "Wie messt ihr Erfolg?", a: "An qualifizierten Anfragen und Cost-per-Lead, transparent in deinem Portal, nicht an Vanity-Kennzahlen." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "finanz-investment",
    ctaEyebrow: "Vertrauliche Analyse",
    name: "Finanz & Investment",
    metaTitle: "Marketing & Leadgenerierung für Finanz- & Investment-Anbieter | TyloTech",
    metaDescription:
      "Hochwertige Investoren-Leads: seriös, vertrauensvoll, planbar. Autorität, Premium-Auftritt und compliance-bewusste Leadgenerierung.",
    hero: {
      icon: "shield-check",
      eyebrow: "Marketing & Leadgenerierung für Finanz- & Investment-Anbieter",
      title: "Hochwertige\nInvestoren-Leads:\n_seriös, vertrauensvoll,\nplanbar._",
      sub: "Für Finanzberater, Makler und Investment-Anbieter: Wir bauen Vertrauen und Autorität auf und generieren qualifizierte, seriöse Anfragen, compliance-bewusst und diskret.",
      cta: "Vertrauliche Analyse",
      image: img("finanz-investment", "hero"),
      cards: [
        { brand: "linkedin", label: "Neue Anfrage", value: "Investor, vorqualifiziert" },
        { brand: "google", label: "Memorandum angefordert", value: "Vertrauliche Unterlagen" },
      ],
      chip: "Seriös, diskret, planbar",
    },
    kennst: {
      intro:
        "Im Finanz- und Investmentbereich ist Vertrauen alles, und gleichzeitig die größte Hürde. Deine Zielgruppe ist zu Recht skeptisch, reguliert ist der Markt obendrein, und viele Anbieter wirken online längst nicht so seriös, wie sie tatsächlich sind.",
      points: [
        { icon: "shield-check", text: "Deine Zielgruppe ist skeptisch, Vertrauen ist die größte Hürde." },
        { icon: "briefcase", text: "Du bekommst Anfragen, aber selten mit echtem Kapital dahinter." },
        { icon: "circle-alert", text: "Werbung im Finanzbereich ist regulatorisch heikel, ein falscher Satz kann teuer werden." },
        { icon: "eye", text: "Du wirkst online nicht so seriös und hochwertig, wie du tatsächlich bist." },
        { icon: "chart-column", text: "Deine Leads sind teuer und trotzdem unqualifiziert." },
        { icon: "workflow", text: "Du hast kein System, das planbar hochwertige Kontakte bringt." },
      ],
      grund: "Die Folge: teure, unqualifizierte Leads _ohne echtes Kapital dahinter_.",
      grundImage: img("finanz-investment", "grund"),
    },
    loesung: {
      text: "Wir lösen das über Autorität, einen Premium-Auftritt und eine Leadgen, die schon im Funnel nach Qualität filtert, seriös und rechtsbewusst.",
      kanaele: [
        { label: "Personal Brand", brand: "linkedin" },
        { label: "Autoritäts-Content", icon: "file-text" },
        { label: "Google Suche", brand: "google" },
        { label: "Kampagnen", icon: "megaphone" },
      ],
      ergebnisse: [
        { label: "Neue Anfrage", value: "Investor, vorqualifiziert" },
        { label: "Memorandum angefordert", value: "Vertrauliche Unterlagen" },
        { label: "Erstgespräch gebucht", value: "Family Office" },
      ],
      pillars: [
        { icon: "award", title: "Autorität", text: "Hochwertiger Content, Personal Brand und ein seriöser Auftritt, damit potenzielle Investoren dir vertrauen." },
        { icon: "briefcase", title: "Premium-Auftritt", text: "Website, Materialien, Memoranden und Content auf dem Niveau, das dein Angebot verdient." },
        { icon: "shield-check", title: "Qualifizierte Leads", text: "Wir filtern bereits im Funnel nach dem Wesentlichen (z. B. Investitionsrahmen): Qualität statt Masse." },
      ],
    },
    pains: [
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-1") },
        title: "Unsere Zielgruppe ist skeptisch.",
        text: "Im Finanzbereich kauft niemand von einem Fremden. Wir bauen deine Reputation und Autorität systematisch auf, über hochwertigen Content, Personal Brand und einen seriösen Auftritt, damit potenzielle Investoren dir vertrauen, bevor sie überhaupt mit dir sprechen.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-2") },
        title: "Unsere Leads haben kein Kapital.",
        text: "Viele Anfragen kosten Zeit, ohne je zu Kunden zu werden. Wir filtern bereits im Funnel nach dem Wesentlichen (z. B. Investitionsrahmen), sodass du weniger, dafür ernsthafte und passende Anfragen bekommst: Qualität statt Masse.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-3") },
        title: "Werbung ist regulatorisch heikel.",
        text: "Wir bewerben seriös und rechtsbewusst: keine überzogenen Rendite-Versprechen, sondern belegbare Stärke und Transparenz. So gewinnst du Vertrauen, ohne dich angreifbar zu machen, gerade im regulierten Umfeld entscheidend.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-4") },
        title: "Wir wirken online nicht seriös genug.",
        text: "Der erste Eindruck entscheidet über Vertrauen. Wir bauen einen Premium-Auftritt: Website, Materialien, Memoranden und Content auf dem Niveau, das dein Angebot verdient, damit du sofort so wahrgenommen wirst, wie du arbeitest.",
      },
    ],
    steps: [
      { title: "Positionierung & Vertrauensaufbau", text: "Die Basis im vertrauensgetriebenen Finanzmarkt." },
      { title: "Autoritäts-Content & Personal Brand", text: "Reputation aufbauen, bevor das Gespräch beginnt." },
      { title: "Qualifizierte Leadgen mit Vorfilterung", text: "Weniger, aber ernsthafte Anfragen mit echtem Kapital." },
      { title: "Premium-Website & Materialien", text: "Ein Auftritt auf dem Niveau deines Angebots." },
      { title: "Compliance-bewusste Kampagnen", text: "Seriös und rechtssicher werben." },
      { title: "Transparenz über TyloHQ", text: "Lead-Qualität und Kosten live im Portal." },
    ],
    fuerWen: {
      icon: "briefcase",
      title: "Für diese Anbieter _lohnt sich_ unser System.",
      rows: [2, 2],
      tiles: [
        { label: "Finanzberater & Vermögensverwalter", image: img("finanz-investment", "tile-1") },
        { label: "Versicherungs- & Immobilienmakler", image: img("finanz-investment", "tile-2") },
        { label: "Investment- & Beteiligungsanbieter", image: img("finanz-investment", "tile-3") },
        { label: "Private Equity & Family Offices", image: img("finanz-investment", "tile-4") },
      ],
    },
    case: {
      title: "Marokko Investment: _kompletter Investoren-Funnel_",
      text: "Wir bauen für Marokko Investment einen kompletten, seriösen Investoren-Funnel: Landingpages, ein vertrauliches Investoren-Memorandum, mehrere Lead-Magnete und eine compliance-bewusste Ansprache für qualifizierte Investoren. Ein lebender Beweis, dass wir im sensiblen Finanzumfeld hochwertige Leadgen aufbauen.",
      placeholder: "Zahlen ergänzen, sobald live.",
      image: img("finanz-investment", "case"),
    },
    faq: [
      { q: "Ist eure Werbung im Finanzbereich rechtssicher?", a: "Wir arbeiten compliance-bewusst und ohne überzogene Versprechen. Bei regulierten Angeboten stimmen wir uns mit deinem Rechtsbeistand ab." },
      { q: "Bekomme ich wirklich qualifizierte Leads?", a: "Ja, wir filtern schon im Funnel nach Qualität (z. B. Investitionsrahmen), damit du ernsthafte Anfragen statt Masse bekommst." },
      { q: "Wie diskret arbeitet ihr?", a: "Diskretion ist im Finanzbereich Pflicht. Wir behandeln dein Geschäft und deine Daten entsprechend vertraulich." },
    ],
  },
];

export const getBranche = (slug: string) => BRANCHEN.find((b) => b.slug === slug);
