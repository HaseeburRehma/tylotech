import type { Branche } from "./branchen";

/* English industry pages — same structure, order and slugs (German keys) as lib/branchen.ts.
 * Only the copy is translated. `_…_` marks the serif-italic gold accent inside
 * headlines; `\n` is a deliberate line break (applied from sm up). */

const img = (slug: string, f: string) => `/branchen/${slug}/${f}.webp`;

export const BRANCHEN_EN: Branche[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "handwerk",
    ctaEyebrow: "Free potential analysis",
    name: "Trades & Crafts",
    metaTitle: "Marketing, Lead Generation & Recruiting for Trade Businesses | TyloTech",
    metaDescription:
      "More jobs and skilled workers for your trade business: visible on Google and in AI search, exclusive enquiries and applications. One system, one point of contact.",
    hero: {
      icon: "hammer",
      eyebrow: "Marketing, lead generation & recruiting for trade businesses",
      title: "More jobs and skilled workers\nfor your trade business,\n_predictable, not left\nto chance._",
      sub: "We get you to the top of Google and AI search, deliver exclusive enquiries from customers with real budgets, and find you the skilled workers you need to grow. One system, one point of contact.",
      cta: "Free potential analysis",
      image: img("handwerk", "hero"),
      cards: [
        { brand: "google", label: "New enquiry", value: "Full bathroom, €45,000" },
        { brand: "meta", label: "New application", value: "Plumbing & heating engineer" },
      ],
      chip: "#1 on Google and in AI search",
    },
    kennst: {
      intro:
        "Your workmanship is spot on. Yet your order book is a constant rollercoaster, and finding good people feels like a second full-time job.",
      points: [
        { icon: "chart-line", text: "Your workload is down to luck: too much one month, radio silence the next, and nothing you can plan around." },
        { icon: "git-branch", text: "You pay lead portals a fortune for poor enquiries that are shared with several other firms." },
        { icon: "search", text: "Search “[trade] + your city” and your competitors come out on top, while hardly anyone finds you on Google." },
        { icon: "users", text: "You’re desperate for fitters and skilled workers, but job ads bring in nobody." },
        { icon: "message-circle", text: "Word of mouth no longer carries you like it used to; the younger generation googles and asks AI." },
        { icon: "clock", text: "You’re so deep in day-to-day work that there’s simply no time left for marketing and visibility." },
      ],
      grund:
        "The reason is _rarely your work_. It’s that customers now search Google first, and increasingly AI, and that the best skilled workers stopped responding to job ads long ago.",
      grundImage: img("handwerk", "grund"),
    },
    loesung: {
      text: "That’s exactly where we come in: we make you visible where your customers and future employees are really looking, and turn that into a system that delivers enquiries and applications you can plan on.",
      kanaele: [
        { label: "Google Search", brand: "google" },
        { label: "AI search", icon: "sparkles" },
        { label: "Meta Ads", brand: "meta" },
        { label: "Social recruiting", brand: "instagram" },
      ],
      ergebnisse: [
        { label: "New enquiry", value: "Full bathroom, €45,000" },
        { label: "New application", value: "Plumbing & heating engineer" },
        { label: "New enquiry", value: "Heat pump, €36,000" },
      ],
      pillars: [
        { icon: "trending-up", title: "Jobs", text: "Your own channels that bring exclusive enquiries that belong to you alone. No sharing, no undercutting." },
        { icon: "users", title: "Skilled workers", text: "Applications land straight in your portal, pre-qualified by experience, so all that’s left for you is the decision." },
        { icon: "award", title: "Brand building", text: "Become the name people in your region mention first. Out of the comparison game, into pricing power." },
      ],
    },
    pains: [
      {
        visual: { kind: "rankings" },
        title: "Customers can’t find us on Google or in AI search.",
        text: "Most customers now search Google for “[trade] + city”, and more and more of them ask an AI like ChatGPT or Perplexity for advice. If you don’t show up there, you don’t exist for those customers. We build up your local SEO systematically and also optimise you for AI search (GEO), so you rank at the top of Google AND get recommended by AI when customers ask for a business like yours. That’s exactly what we achieved for Rohr Cleaner: #1 today. The result: predictable enquiries, without paying for every single click.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-2") },
        title: "We can’t find skilled workers.",
        text: "The best fitters and technicians aren’t actively looking; they already have a job. A classic job ad never reaches them. We reach exactly these open-to-move professionals where they spend time every day (social media), with ads that spark curiosity. At the same time, we build you into a real employer brand, a business people want to work for. Applications land straight in your portal, pre-qualified by experience, so all that’s left for you is the decision.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-3") },
        title: "We’re stuck with expensive, shared lead portals.",
        text: "With lead portals, you pay for enquiries that go to three other firms at the same time, and end up in a price war nobody wins. We build you your own channels that bring exclusive enquiries that belong to you alone. No sharing, no undercutting, no dependence on a platform that can raise its prices whenever it likes.",
      },
      {
        visual: { kind: "image", src: img("handwerk", "pain-4") },
        title: "We only get compared on price.",
        text: "Without a visible brand, you’re interchangeable to the customer, so they go for the cheapest. We build your visibility and trust: a strong Google profile, a steady flow of new reviews and professional content that shows your expertise. That way you become the name people in your region mention first, out of the comparison game and into pricing power.",
      },
    ],
    steps: [
      { title: "High-converting website & landing pages", text: "The foundation that filters out bargain hunters and gets quality customers to enquire." },
      { title: "Local SEO & GEO", text: "So customers find you on Google AND in AI search, predictably and without click costs." },
      { title: "Customer acquisition", text: "Targeted campaigns on Meta and Google bring exclusive enquiries from customers with real budgets." },
      { title: "Regional visibility", text: "Google profile, reviews and local presence make you the best-known name in your region." },
      { title: "Recruiting skilled workers", text: "Social recruiting + employer branding deliver the applications you need to grow." },
      { title: "Transparency with TyloHQ", text: "All enquiries, applications and figures live in your own portal." },
    ],
    fuerWen: {
      icon: "hammer",
      title: "The trades our system _pays off_ for.",
      sub: "From one-person operations to firms with 20+ employees.",
      rows: [4, 3],
      tiles: [
        { label: "Plumbing, heating & HVAC", image: img("handwerk", "tile-1") },
        { label: "Electricians", image: img("handwerk", "tile-2") },
        { label: "Roofers", image: img("handwerk", "tile-3") },
        { label: "Painters & floor fitters", image: img("handwerk", "tile-4") },
        { label: "Landscaping", image: img("handwerk", "tile-5") },
        { label: "Drain cleaning & locksmiths", image: img("handwerk", "tile-6") },
        { label: "Solar & energy technology", image: img("handwerk", "tile-7") },
      ],
    },
    case: {
      logo: "rohrcleaner",
      title: "Rohr Cleaner: _#1_ on Google AND in AI search",
      before: ["Barely visible online", "Enquiries only through referrals"],
      after: [
        "Now #1 on Google and in AI search (GEO) for the key search terms",
        "Predictable enquiries through their own website instead of expensive portals",
      ],
      placeholder: "Add concrete figures & a client quote.",
      extraPlaceholder: "Akmir recruiting case to follow once live.",
      image: img("handwerk", "case"),
      imageFit: "top",
    },
    faq: [
      { q: "How do I know this will work for my business?", a: "We’ll answer that honestly in the free initial call. We look at your trade, your region and your order book and tell you plainly whether and how our system works for you." },
      { q: "I’ve already had an agency, with no success. What do you do differently?", a: "We’re not an agency, we’re your growth partner: one joined-up system instead of piecemeal services, full transparency through your own portal, and the GEO head start nobody else offers." },
      { q: "How quickly will I see results?", a: "Paid enquiries can come in within the first few weeks; local SEO and GEO build predictable, lasting visibility over the first few months." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "lokale-dienstleister",
    ctaEyebrow: "Free visibility analysis for your region",
    name: "Local Services",
    metaTitle: "Marketing & Local Visibility for Service Businesses | TyloTech",
    metaDescription:
      "Get found in your city: at the top of Google, on Google Maps and in AI search. More reviews, predictable enquiries.",
    hero: {
      icon: "map-pin",
      eyebrow: "Marketing & local visibility for service businesses",
      title: "Get found in your city,\n_before your competitor\ndoes._",
      sub: "Cleaning, caretaking, removals, care or hospitality: we make sure customers in your region find you first, on Google, on the map and in AI search.",
      cta: "Free visibility analysis",
      image: img("lokale-dienstleister", "hero"),
      cards: [
        { brand: "google", label: "New enquiry", value: "Office cleaning, weekly" },
        { brand: "google", label: "New review", value: "5 stars on Google" },
      ],
      chip: "Top of Google and the map",
    },
    kennst: {
      intro:
        "As a local service business, you live off customers nearby. But these days, it’s not the best sign on the street that wins, it’s whoever ranks at the top of Google and Google Maps.",
      points: [
        { icon: "map-pin", text: "Customers nearby can’t find you online, even though you’re just around the corner." },
        { icon: "search", text: "On Google Maps your competitors are at the top, and you don’t appear until page 2." },
        { icon: "star", text: "You have too few or outdated reviews, so others seem more trustworthy." },
        { icon: "message-circle", text: "Enquiries come in irregularly and almost only through referrals." },
        { icon: "clock", text: "You simply don’t have time to deal with online marketing." },
        { icon: "monitor", text: "Your website exists, but it doesn’t bring in a single enquiry." },
      ],
      grund: "If you don’t show up there, you lose customers to your competitor, _even if they’re worse_.",
      grundImage: img("lokale-dienstleister", "grund"),
    },
    loesung: {
      text: "We make sure you’re visible across your city and its neighbourhoods, that your reviews convince, and that visitors turn into enquiries.",
      kanaele: [
        { label: "Google Search", brand: "google" },
        { label: "Google Maps", icon: "map-pin" },
        { label: "AI search", icon: "sparkles" },
        { label: "Local radius ads", icon: "megaphone" },
      ],
      ergebnisse: [
        { label: "New enquiry", value: "Office cleaning" },
        { label: "New review", value: "5 stars on Google" },
        { label: "New enquiry", value: "House move, 3 rooms" },
      ],
      pillars: [
        { icon: "map-pin", title: "Visibility", text: "We get you to the very top for “[service] + your city” and across your neighbourhoods." },
        { icon: "star", title: "Reviews", text: "A simple process that makes it effortless for happy customers to leave a review after every job." },
        { icon: "trending-up", title: "Enquiries", text: "A system of local visibility and targeted radius ads that brings you a steady, predictable flow of enquiries." },
      ],
    },
    pains: [
      {
        visual: { kind: "rankings" },
        title: "We don’t get found locally.",
        text: "80% of local enquiries come through Google and Google Maps. We get you to the very top for “[service] + your city” and across your neighbourhoods, and also optimise you for AI search, so ChatGPT and Perplexity recommend you too. That way customers find you at exactly the moment they’re searching.",
      },
      {
        visual: { kind: "image", src: img("lokale-dienstleister", "pain-2") },
        title: "We don’t have enough reviews.",
        text: "Reviews are the strongest local ranking factor, and the first thing customers look at. We build you a simple process that makes it effortless for happy customers to leave a review after every job. New ones keep coming in, your profile grows and you climb the rankings.",
      },
      {
        visual: { kind: "kpi", label: "New enquiries", value: "548" },
        title: "Our enquiries are pure luck.",
        text: "Instead of hoping for referrals, we build a system of local visibility and targeted radius ads that brings you a steady, predictable flow of enquiries, regardless of season or chance.",
      },
      {
        visual: { kind: "image", src: img("lokale-dienstleister", "pain-4") },
        title: "Our website does nothing for us.",
        text: "A nice website isn’t enough; it has to turn visitors into enquiries. We build a high-converting site with clear services, genuine trust signals and an easy way to get in touch.",
      },
    ],
    steps: [
      { title: "High-converting local website", text: "Clear services, trust, easy contact: built to bring in enquiries." },
      { title: "Local SEO & GEO", text: "Visibility on Google and in AI search for your city and neighbourhoods." },
      { title: "Google profile & Google Maps", text: "Fully optimised so you rank at the top of the “Local Pack”." },
      { title: "Review system", text: "A simple process for a steady stream of new reviews, the strongest local lever." },
      { title: "Local radius ads", text: "Targeted advertising in your region that brings predictable enquiries." },
      { title: "Transparency with TyloHQ", text: "All enquiries and figures visible live." },
    ],
    fuerWen: {
      icon: "store",
      title: "The businesses our system _pays off_ for.",
      sub: "Wherever your customers come from the local area.",
      rows: [3, 3],
      tiles: [
        { label: "Building cleaning & caretaking", image: img("lokale-dienstleister", "tile-1") },
        { label: "Removal companies", image: img("lokale-dienstleister", "tile-2") },
        { label: "Care & support services", image: img("lokale-dienstleister", "tile-3") },
        { label: "Gardening & landscaping", image: img("lokale-dienstleister", "tile-4") },
        { label: "Local restaurants & shops", image: img("lokale-dienstleister", "tile-5") },
        { label: "Driving schools", image: img("lokale-dienstleister", "tile-6") },
      ],
    },
    case: {
      title: "SRS Hausmeisterservice & local businesses in _Düsseldorf/NRW_",
      before: ["Limited local visibility", "Enquiries through referrals"],
      after: ["Local presence established", "Stronger visibility across the region", "More consistent enquiries through their own channels"],
      placeholder: "Add concrete figures.",
      image: img("lokale-dienstleister", "case"),
    },
    faq: [
      { q: "Is this worth it for a small business?", a: "For local businesses especially, visibility is the biggest lever there is. One extra customer a week makes a big difference over a year." },
      { q: "How do you get new reviews?", a: "Through a simple process (a QR code or link after every job) that lets happy customers leave a review in seconds. All you have to do is ask; we build the rest." },
      { q: "How quickly will I see results?", a: "The first effects often show within a few weeks; your local visibility builds steadily over the first few months." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "online-dienstleistungen",
    ctaEyebrow: "Free initial call",
    name: "Online Services",
    metaTitle: "Marketing for Online Service Providers, Coaches & Digital Businesses | TyloTech",
    metaDescription:
      "More qualified enquiries without getting lost in a crowded market: clear positioning, digital authority and a system that brings in clients predictably.",
    hero: {
      icon: "globe",
      eyebrow: "Marketing for online service providers, coaches & digital businesses",
      title: "More qualified enquiries,\n_without getting lost in\na crowded market._",
      sub: "Coaches, consultants, software and online providers: we sharpen your positioning, build your authority and turn visitors into paying clients, with a system that doesn’t depend on you alone.",
      cta: "Book your initial call",
      image: img("online-dienstleistungen", "hero"),
      cards: [
        { brand: "linkedin", label: "New enquiry", value: "Business coaching, 1:1" },
        { brand: "meta", label: "Initial call booked", value: "Tuesday, 10:00" },
      ],
      chip: "Predictable, qualified enquiries",
    },
    kennst: {
      intro:
        "The market for online services is crowded, and from the outside almost everyone looks the same. Your offer may be excellent, but if a stranger can’t see within five seconds why it should be you, they click away.",
      points: [
        { icon: "layers", text: "You’re getting lost in a crowded market where every provider looks the same." },
        { icon: "shield-check", text: "Strangers don’t trust you, because you have no physical location and little visibility." },
        { icon: "eye", text: "Your offer is strong, but nobody can tell in 5 seconds what makes you special." },
        { icon: "chart-line", text: "You get traffic, but hardly anyone becomes a client." },
        { icon: "user", text: "Your reach depends entirely on you: no system, nothing you can plan on." },
        { icon: "circle-help", text: "You don’t know which channel really brings clients and which one just costs money." },
      ],
      grund:
        "Without a physical location, you have to build trust _entirely online_. And if your reach depends on you alone, nothing is predictable.",
      grundImage: img("online-dienstleistungen", "grund"),
    },
    loesung: {
      text: "That’s exactly what we solve: clear positioning, digital trust and a system that brings in enquiries predictably.",
      kanaele: [
        { label: "Personal brand", brand: "linkedin" },
        { label: "Performance ads", brand: "meta" },
        { label: "Google Search", brand: "google" },
        { label: "AI search", icon: "sparkles" },
      ],
      ergebnisse: [
        { label: "New enquiry", value: "Business coaching" },
        { label: "Initial call booked", value: "Tuesday, 10:00" },
        { label: "New enquiry", value: "SaaS demo requested" },
      ],
      pillars: [
        { icon: "target", title: "Positioning", text: "We work out what truly makes you unique." },
        { icon: "shield-check", title: "Trust", text: "Genuinely valuable content, visible results, reviews and a compelling story." },
        { icon: "trending-up", title: "Predictable enquiries", text: "Landing pages that convert, clear offers and automated follow-up that takes prospects all the way to the close." },
      ],
    },
    pains: [
      {
        visual: { kind: "image", src: img("online-dienstleistungen", "pain-1") },
        title: "We’re getting lost in the market.",
        text: "Without clear positioning, you’re one of many. We work out what truly makes you unique and build your visibility as an authority in your niche, through your personal brand and targeted content, so clients choose you and not just the next best option.",
      },
      {
        visual: { kind: "image", src: img("online-dienstleistungen", "pain-2") },
        title: "Strangers don’t trust us.",
        text: "Online, trust is the biggest hurdle. We build it systematically: through genuinely valuable content, visible results, reviews and a compelling story, so prospects believe in you before you’ve even spoken.",
      },
      {
        visual: { kind: "kpi", label: "New enquiries", value: "572" },
        title: "Traffic doesn’t turn into clients.",
        text: "Visitors alone don’t pay the bills. We build the path from visitor to client: landing pages that convert, clear offers and automated follow-up that takes prospects all the way to the close.",
      },
      {
        visual: { kind: "channels" },
        title: "We don’t know what works.",
        text: "We work data-driven: in your own portal, you see live which channel brings which enquiries at what cost. Full transparency instead of gut feeling, so you can put your budget where it actually works.",
      },
    ],
    steps: [
      { title: "Positioning", text: "We sharpen what makes you unique, the foundation for everything." },
      { title: "Personal brand & content", text: "Build visibility and authority in your niche." },
      { title: "Funnels & landing pages", text: "The path from visitor to client, built for conversion." },
      { title: "Performance ads", text: "Targeted campaigns that bring qualified enquiries." },
      { title: "SEO & GEO", text: "Get found on Google and in AI search." },
      { title: "Transparency with TyloHQ", text: "See live which channel really brings clients." },
    ],
    fuerWen: {
      icon: "globe",
      title: "The providers our system _pays off_ for.",
      rows: [3, 2],
      tiles: [
        { label: "Coaches & consultants", image: img("online-dienstleistungen", "tile-1") },
        { label: "Agencies & freelancers", image: img("online-dienstleistungen", "tile-2") },
        { label: "SaaS & software providers", image: img("online-dienstleistungen", "tile-3") },
        { label: "Online courses & digital products", image: img("online-dienstleistungen", "tile-4") },
        { label: "Info products & experts", image: img("online-dienstleistungen", "tile-5") },
      ],
    },
    case: {
      title: "Our own brands _as proof_",
      text: "We build our own brands (TyloTech, Marokko Investment) with exactly these methods: digital visibility, authority and lead generation.",
      placeholder: "As soon as an external online-services case with figures is available, it will be added here.",
      image: img("online-dienstleistungen", "case"),
      tyloLogo: true,
    },
    faq: [
      { q: "Does this work without a big following?", a: "Yes. We build reach and authority deliberately; you don’t need to be well known already. What matters is a clear offer and a willingness to be visible." },
      { q: "Do I have to be on camera / produce content myself?", a: "It helps a lot for a strong personal brand, but we take care of the concept, production and distribution, so your effort stays minimal." },
      { q: "How do you measure success?", a: "By qualified enquiries and closed deals, not likes. All transparent in your portal." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "e-commerce",
    ctaEyebrow: "Free shop analysis",
    name: "E-Commerce",
    metaTitle: "Performance Marketing & SEO for Online Shops | TyloTech",
    metaDescription:
      "Scale profitably, even as ad costs rise: ads optimised for return, not clicks, e-commerce SEO and GEO, and retention flows for repeat customers.",
    hero: {
      icon: "store",
      eyebrow: "Performance marketing & SEO for online shops",
      title: "Scale profitably,\n_even as ad costs\nkeep rising._",
      sub: "We bring your shop profitable new customers through Meta and Google, win you free traffic through SEO and AI search, and turn first-time buyers into loyal repeat customers.",
      cta: "Free shop analysis",
      image: img("e-commerce", "hero"),
      cards: [
        { brand: "meta", label: "New order", value: "First-time buyer via Meta" },
        { brand: "shopify", label: "Repeat customer", value: "Reorder via email" },
      ],
      chip: "Optimised for return, not clicks",
    },
    kennst: {
      intro:
        "Running an online shop today means fighting rising ad costs. New customers keep getting more expensive, and if they only buy once, there’s too little left at the end.",
      points: [
        { icon: "megaphone", text: "Your ad costs keep rising, but revenue isn’t keeping up." },
        { icon: "refresh-cw", text: "You win new customers, but they never buy again." },
        { icon: "search", text: "You barely show up on Google or in product search, so you pay for every visitor." },
        { icon: "chart-column", text: "You don’t know exactly which campaign is really profitable." },
        { icon: "gauge", text: "Your shop gets visitors, but the conversion rate is too low." },
        { icon: "git-branch", text: "You depend too heavily on a single channel. If it goes, so does your revenue." },
      ],
      grund:
        "At the same time, most shops give away _free traffic_, because they barely show up on Google and in product search.",
      grundImage: img("e-commerce", "grund"),
    },
    loesung: {
      text: "We work on all three levers: profitable ads, free organic traffic and more revenue per customer.",
      kanaele: [
        { label: "Meta Ads", brand: "meta" },
        { label: "Google Shopping", brand: "google-ads" },
        { label: "SEO & AI search", icon: "sparkles" },
        { label: "Email flows", icon: "mail" },
      ],
      ergebnisse: [
        { label: "New order", value: "First-time buyer via Meta" },
        { label: "Repeat customer", value: "Reorder via email" },
        { label: "New order", value: "Organic via Google" },
      ],
      pillars: [
        { icon: "megaphone", title: "Profitable ads", text: "Campaigns optimised for real return (ROAS): the right audiences, strong creatives, clean tracking." },
        { icon: "search", title: "Organic traffic", text: "E-commerce SEO and GEO, so your products and categories rank on Google and in AI search." },
        { icon: "refresh-cw", title: "More revenue per customer", text: "Automated email and retention flows that turn first-time buyers into repeat customers." },
      ],
    },
    pains: [
      {
        visual: { kind: "channels" },
        title: "Our ads are getting too expensive.",
        text: "Many shops optimise for clicks instead of profit. We steer your campaigns towards real return (ROAS): the right audiences, strong creatives, clean tracking, so every euro you spend on ads brings in more revenue and you can scale profitably instead of just spending more.",
      },
      {
        visual: { kind: "image", src: img("e-commerce", "pain-2") },
        title: "Customers only buy once.",
        text: "The cheapest revenue comes from existing customers. We build automated email and retention flows (welcome, abandoned cart, reorder, win-back) that turn first-time buyers into repeat customers: predictable revenue without extra ad spend.",
      },
      {
        visual: { kind: "rankings" },
        title: "We don’t get found organically.",
        text: "Every visitor from Google or AI search costs you nothing extra. We build e-commerce SEO and GEO so your products and categories rank on Google and in AI search: free, lasting traffic that reduces your dependence on paid ads.",
      },
      {
        visual: { kind: "image", src: img("e-commerce", "pain-4") },
        title: "Our shop converts poorly.",
        text: "Traffic is expensive, so it has to pay off. We optimise product pages, checkout and trust signals so the same traffic brings in more revenue. This is often the fastest lever of all.",
      },
    ],
    steps: [
      { title: "Analysis & tracking", text: "A clean foundation, so we know what’s really profitable." },
      { title: "Performance ads", text: "Meta & Google Shopping, optimised for return, not clicks." },
      { title: "E-commerce SEO & GEO", text: "Free traffic through Google and AI search." },
      { title: "Email flows & retention", text: "Turn first-time buyers into repeat customers." },
      { title: "Conversion optimisation", text: "More revenue from the same traffic." },
      { title: "Transparency with TyloHQ", text: "All campaigns and figures live in your portal." },
    ],
    fuerWen: {
      icon: "store",
      title: "The shops our system _pays off_ for.",
      sub: "From Shopify to TikTok Shop.",
      rows: [3, 2],
      tiles: [
        { label: "Fashion & lifestyle", image: img("e-commerce", "tile-1") },
        { label: "Food & supplements", image: img("e-commerce", "tile-2") },
        { label: "Beauty & cosmetics", image: img("e-commerce", "tile-3") },
        { label: "Home & living", image: img("e-commerce", "tile-4") },
        { label: "Niche & brand shops", image: img("e-commerce", "tile-5") },
      ],
    },
    case: {
      title: "Hidaya Nutrition: _e-commerce infrastructure_",
      text: "We’re building Hidaya Nutrition’s complete e-commerce infrastructure (TikTok Shop → Shopify).",
      placeholder: "As soon as solid revenue and ROAS figures are available, they’ll be added here as a case study.",
      image: img("e-commerce", "case"),
    },
    faq: [
      { q: "At what revenue does this become worthwhile?", a: "As soon as you sell regularly and want to grow. In the initial call, we’ll tell you honestly where your biggest lever is (often it’s retention or conversion, not more ad budget)." },
      { q: "Do you work with Shopify / my platform?", a: "Yes, we work with all the common shop platforms (Shopify and others) and connect tracking and flows cleanly." },
      { q: "How quickly will I see results?", a: "With ads and conversion, often within the first few weeks; SEO and retention build steadily over the months." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "b2b-dienstleistung",
    ctaEyebrow: "Free initial call",
    name: "B2B Services",
    metaTitle: "Lead Generation for B2B Service Providers | TyloTech",
    metaDescription:
      "Qualified B2B enquiries, predictable instead of left to chance: LinkedIn, Google, authority content and lead nurturing all the way to the close.",
    hero: {
      icon: "briefcase",
      eyebrow: "Lead generation for B2B service providers",
      title: "Qualified B2B enquiries,\n_predictable instead of\nleft to chance._",
      sub: "We build you a lead generation system that consistently delivers qualified enquiries from decision-makers, via LinkedIn, Google and targeted campaigns, with nurturing all the way to the close.",
      cta: "Book your initial call",
      image: img("b2b-dienstleistung", "hero"),
      cards: [
        { brand: "linkedin", label: "New enquiry", value: "Managing director, IT services" },
        { brand: "google", label: "Meeting booked", value: "Thursday, 14:00" },
      ],
      chip: "Qualified decision-maker enquiries",
    },
    kennst: {
      intro:
        "In B2B, a lot depends on relationships and referrals, and that’s exactly what makes growth so unpredictable. One good month, then radio silence.",
      points: [
        { icon: "chart-line", text: "Your pipeline is empty or completely unpredictable." },
        { icon: "users", text: "You get enquiries, but rarely from the right decision-makers." },
        { icon: "clock", text: "Your sales cycle is long, and prospects drop off along the way." },
        { icon: "message-circle", text: "You rely on referrals and can’t scale in a targeted way." },
        { icon: "layers", text: "Your positioning makes you interchangeable to clients." },
        { icon: "circle-help", text: "You don’t know what a qualified lead really costs you." },
      ],
      grund:
        "The enquiries that do come in are often _not from the right decision-makers_, and the long sales cycle means prospects drop off along the way.",
      grundImage: img("b2b-dienstleistung", "grund"),
    },
    loesung: {
      text: "We turn that into a system: targeted outreach to the right decision-makers, building authority, and nurturing that turns prospects into clients, predictably and measurably.",
      kanaele: [
        { label: "LinkedIn", brand: "linkedin" },
        { label: "Google Search", brand: "google" },
        { label: "Authority content", icon: "file-text" },
        { label: "Lead nurturing", icon: "mail" },
      ],
      ergebnisse: [
        { label: "New enquiry", value: "MD, IT service provider" },
        { label: "Meeting booked", value: "Thursday, 14:00" },
        { label: "New enquiry", value: "Procurement, manufacturing" },
      ],
      pillars: [
        { icon: "target", title: "The right decision-makers", text: "We precisely target the relevant decision-makers (industry, role, company size)." },
        { icon: "award", title: "Authority", text: "Content that ensures they know and trust you before you’ve even spoken." },
        { icon: "mail", title: "Nurturing", text: "Email sequences, retargeting and valuable content that keep prospects warm for weeks until they’re ready to buy." },
      ],
    },
    pains: [
      {
        visual: { kind: "kpi", label: "New enquiries", value: "536" },
        title: "Our pipeline is unpredictable.",
        text: "Referrals are nice, but you can’t control them. We build a predictable lead generation system via LinkedIn and Google that consistently delivers qualified enquiries, so you fill your pipeline actively instead of waiting for the next lucky break.",
      },
      {
        visual: { kind: "image", src: img("b2b-dienstleistung", "pain-2") },
        title: "We don’t reach the right decision-makers.",
        text: "In B2B, who you reach is what counts. We precisely target the relevant decision-makers (industry, role, company size) and, in parallel, build your authority through content, so they know and trust you before you’ve even spoken.",
      },
      {
        visual: { kind: "image", src: img("b2b-dienstleistung", "pain-3") },
        title: "Leads drop off during the long sales cycle.",
        text: "B2B decisions take time. We build lead nurturing (email sequences, retargeting, valuable content) that keeps prospects warm for weeks until they’re ready to buy, so no qualified contact gets lost.",
      },
      {
        visual: { kind: "kpi", label: "Cost per lead", value: "€18", falling: true },
        title: "We can’t scale.",
        text: "No numbers, no growth. We make your sales measurable: you see what a lead costs, how many become clients and which levers you can pull. A repeatable system instead of gut feeling.",
      },
    ],
    steps: [
      { title: "Positioning & messaging", text: "Make it clear why it should be you, the basis of every B2B campaign." },
      { title: "LinkedIn & Google campaigns", text: "Targeted outreach to the right decision-makers." },
      { title: "Authority content", text: "Build trust before the first conversation takes place." },
      { title: "Lead generation funnels", text: "The path from contact to qualified enquiry." },
      { title: "Lead nurturing", text: "Keep prospects warm throughout the long cycle." },
      { title: "Transparency with TyloHQ", text: "Cost per lead and pipeline live in your portal." },
    ],
    fuerWen: {
      icon: "briefcase",
      title: "The service providers our system _pays off_ for.",
      rows: [3, 2],
      tiles: [
        { label: "Consultancies & law firms", image: img("b2b-dienstleistung", "tile-1") },
        { label: "IT & software service providers", image: img("b2b-dienstleistung", "tile-2") },
        { label: "Industrial & manufacturing suppliers", image: img("b2b-dienstleistung", "tile-3") },
        { label: "Recruitment & staffing agencies", image: img("b2b-dienstleistung", "tile-4") },
        { label: "Specialised B2B services with high contract values", image: img("b2b-dienstleistung", "tile-5") },
      ],
    },
    case: {
      title: "SCC Sales: _website & lead generation consulting_",
      text: "For SCC Sales, we built the website and advised on lead generation and marketing.",
      placeholder: "As soon as solid lead generation figures are available, they’ll be added here as a case study.",
      image: img("b2b-dienstleistung", "case"),
    },
    faq: [
      { q: "Does this work in my niche?", a: "In specialised B2B niches especially, targeted lead generation is extremely effective, because the audience is clearly definable. We’ll work that out in the initial call." },
      { q: "We have a long sales cycle. Is it still worth it?", a: "All the more so: our nurturing makes sure no lead gets lost along the way, and that it stays warm until it’s ready to buy." },
      { q: "How do you measure success?", a: "By qualified enquiries and cost per lead, transparently in your portal, not by vanity metrics." },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "finanz-investment",
    ctaEyebrow: "Confidential analysis",
    name: "Finance & Investment",
    metaTitle: "Marketing & Lead Generation for Finance & Investment Providers | TyloTech",
    metaDescription:
      "High-quality investor leads: reputable, trustworthy, predictable. Authority, a premium presence and compliance-aware lead generation.",
    hero: {
      icon: "shield-check",
      eyebrow: "Marketing & lead generation for finance & investment providers",
      title: "High-quality\ninvestor leads:\n_reputable, trustworthy,\npredictable._",
      sub: "For financial advisers, brokers and investment providers: we build trust and authority and generate qualified, serious enquiries, compliance-aware and discreet.",
      cta: "Confidential analysis",
      image: img("finanz-investment", "hero"),
      cards: [
        { brand: "linkedin", label: "New enquiry", value: "Investor, pre-qualified" },
        { brand: "google", label: "Memorandum requested", value: "Confidential documents" },
      ],
      chip: "Reputable, discreet, predictable",
    },
    kennst: {
      intro:
        "In finance and investment, trust is everything, and at the same time the biggest hurdle. Your audience is rightly sceptical, the market is regulated on top of that, and many providers come across online as far less reputable than they really are.",
      points: [
        { icon: "shield-check", text: "Your audience is sceptical, and trust is the biggest hurdle." },
        { icon: "briefcase", text: "You get enquiries, but rarely with real capital behind them." },
        { icon: "circle-alert", text: "Advertising in finance is a regulatory minefield; one wrong sentence can be costly." },
        { icon: "eye", text: "Online, you don’t come across as reputable and high-end as you really are." },
        { icon: "chart-column", text: "Your leads are expensive and still unqualified." },
        { icon: "workflow", text: "You have no system that reliably brings in high-quality contacts." },
      ],
      grund: "The result: expensive, unqualified leads _with no real capital behind them_.",
      grundImage: img("finanz-investment", "grund"),
    },
    loesung: {
      text: "We solve this through authority, a premium presence and lead generation that filters for quality right in the funnel, reputable and legally aware.",
      kanaele: [
        { label: "Personal brand", brand: "linkedin" },
        { label: "Authority content", icon: "file-text" },
        { label: "Google Search", brand: "google" },
        { label: "Campaigns", icon: "megaphone" },
      ],
      ergebnisse: [
        { label: "New enquiry", value: "Investor, pre-qualified" },
        { label: "Memorandum requested", value: "Confidential documents" },
        { label: "Initial call booked", value: "Family office" },
      ],
      pillars: [
        { icon: "award", title: "Authority", text: "High-quality content, a personal brand and a reputable presence, so potential investors trust you." },
        { icon: "briefcase", title: "Premium presence", text: "Website, materials, memoranda and content at the level your offer deserves." },
        { icon: "shield-check", title: "Qualified leads", text: "We filter for what matters right in the funnel (e.g. investment range): quality over quantity." },
      ],
    },
    pains: [
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-1") },
        title: "Our audience is sceptical.",
        text: "In finance, nobody buys from a stranger. We build your reputation and authority systematically, through high-quality content, a personal brand and a reputable presence, so potential investors trust you before they’ve even spoken to you.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-2") },
        title: "Our leads have no capital.",
        text: "Many enquiries eat up time without ever becoming clients. We filter for what matters right in the funnel (e.g. investment range), so you get fewer but serious, well-matched enquiries: quality over quantity.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-3") },
        title: "Advertising is a regulatory minefield.",
        text: "We advertise reputably and with legal awareness: no inflated return promises, just demonstrable strength and transparency. That’s how you win trust without leaving yourself exposed, which is crucial in a regulated environment.",
      },
      {
        visual: { kind: "image", src: img("finanz-investment", "pain-4") },
        title: "We don’t look reputable enough online.",
        text: "First impressions decide trust. We build a premium presence: website, materials, memoranda and content at the level your offer deserves, so you’re immediately perceived the way you actually work.",
      },
    ],
    steps: [
      { title: "Positioning & trust building", text: "The foundation in a trust-driven financial market." },
      { title: "Authority content & personal brand", text: "Build your reputation before the conversation starts." },
      { title: "Qualified lead generation with pre-filtering", text: "Fewer but serious enquiries with real capital." },
      { title: "Premium website & materials", text: "A presence that matches the level of your offer." },
      { title: "Compliance-aware campaigns", text: "Advertise reputably and on solid legal ground." },
      { title: "Transparency with TyloHQ", text: "Lead quality and costs live in your portal." },
    ],
    fuerWen: {
      icon: "briefcase",
      title: "The providers our system _pays off_ for.",
      rows: [2, 2],
      tiles: [
        { label: "Financial advisers & wealth managers", image: img("finanz-investment", "tile-1") },
        { label: "Insurance & property brokers", image: img("finanz-investment", "tile-2") },
        { label: "Investment & equity providers", image: img("finanz-investment", "tile-3") },
        { label: "Private equity & family offices", image: img("finanz-investment", "tile-4") },
      ],
    },
    case: {
      title: "Marokko Investment: _a complete investor funnel_",
      text: "For Marokko Investment, we’re building a complete, reputable investor funnel: landing pages, a confidential investor memorandum, several lead magnets and compliance-aware outreach to qualified investors. Living proof that we build high-quality lead generation in the sensitive world of finance.",
      placeholder: "Add figures once live.",
      image: img("finanz-investment", "case"),
    },
    faq: [
      { q: "Is your financial advertising legally compliant?", a: "We work in a compliance-aware way and without inflated promises. For regulated offerings, we coordinate with your legal counsel." },
      { q: "Will I really get qualified leads?", a: "Yes, we filter for quality right in the funnel (e.g. investment range), so you get serious enquiries instead of sheer volume." },
      { q: "How discreet are you?", a: "Discretion is a must in finance. We treat your business and your data with the corresponding confidentiality." },
    ],
  },
];
