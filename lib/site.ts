/** TyloHQ customer portal (login) */
export const TYLOHQ_URL = "https://www.tylohq.de/";

/** Microsoft Clarity project (public id). Loaded only with "statistics" consent. */
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "yty6vjpudg";

/** Google Tag Manager container (public id). GA4 (G-1DEQH4QLE4) is configured
 *  inside it. Loaded only with "statistics" or "marketing" consent. */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-THB66H9Q";

/** Meta dataset "TyloTech Website" (pixel id, public) in the TyloTech business,
 *  linked to the ad account "Ilias x Tylo". Loaded only with "marketing" consent. */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1080284108173171";
