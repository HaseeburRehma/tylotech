import { mapsSearchUrl } from "./contact";

/* Google reviews for the contact page.
 *
 *   GOOGLE_PLACES_API_KEY  Places API (New) key, server-side only
 *   GOOGLE_PLACE_ID        TyloTech's place id (find it with Google's Place ID Finder)
 *
 * With both set, rating, review count and the latest reviews come live from Google
 * (refreshed every 6 h). Without them the page shows the Google reviews already
 * published on the homepage, and no names or dates are made up. */

export type Review = { author: string | null; rating: number; text: string; when: string | null };
export type ReviewData = { rating: number; count: number; url: string; reviews: Review[]; live: boolean };

const FALLBACK: ReviewData = {
  rating: 5,
  count: 31,
  url: mapsSearchUrl,
  live: false,
  reviews: [
    {
      author: null,
      rating: 5,
      when: null,
      text: "Ich bin persönlich immer sehr skeptisch, aber hier wurde ich positiv überrascht. Er reagiert auf Nachrichten und Anliegen zeitnah.",
    },
    {
      author: null,
      rating: 5,
      when: null,
      text: "Endlich eine Agentur, die Ergebnisse liefert statt Ausreden. Klare Kommunikation, schnelle Umsetzung, alles nachvollziehbar.",
    },
    {
      author: null,
      rating: 5,
      when: null,
      text: "Top Betreuung von Anfang an. Man merkt, dass hier mitgedacht wird und nicht nur abgerechnet.",
    },
  ],
};

type PlacesReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string };
};

export async function getGoogleReviews(): Promise<ReviewData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const id = process.env.GOOGLE_PLACE_ID;
  if (!key || !id) return FALLBACK;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=de`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`places ${res.status}`);
    const d: { rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: PlacesReview[] } = await res.json();
    const reviews = (d.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? null,
        rating: Math.round(r.rating ?? 0),
        text: (r.originalText?.text || r.text?.text || "").trim(),
        when: r.relativePublishTimeDescription ?? null,
      }))
      .filter((r) => r.text.length > 0);
    if (!d.rating || !reviews.length) return FALLBACK;
    return { rating: d.rating, count: d.userRatingCount ?? reviews.length, url: d.googleMapsUri || mapsSearchUrl, reviews, live: true };
  } catch (err) {
    console.error("reviews:", err);
    return FALLBACK;
  }
}
