import type { NextConfig } from "next";

/* Content-Security-Policy — what the site actually loads:
 * - Next.js inline bootstrap scripts (no nonces) → 'unsafe-inline'
 * - Google Tag Manager / GA4 (after consent); GTM tags may evaluate code → 'unsafe-eval'
 * - Meta Pixel (after marketing consent): connect.facebook.net script, beacons to www.facebook.com
 * - Microsoft Clarity (after consent): www.clarity.ms + scripts.clarity.ms, beacons to *.clarity.ms / c.bing.com
 * - YouTube embeds (youtube-nocookie), Google Maps embed (contact page); GTM/GA4 video tracking loads www.youtube.com/iframe_api
 * - fonts are self-hosted via next/font; Resend + Google Places are called server-side only
 * - vercel.live: the Vercel toolbar on preview deployments */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://connect.facebook.net https://www.youtube.com https://vercel.live",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://*.clarity.ms https://c.bing.com https://www.facebook.com https://connect.facebook.net https://vercel.live wss://ws-us3.pusher.com",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://*.googletagmanager.com https://tagassistant.google.com https://vercel.live",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  // keep the old WordPress URLs of tylotech.de working
  async redirects() {
    return [
      { source: "/datenschutzerklarung", destination: "/datenschutz", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // the API is only called by the site itself: no wildcard CORS
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.tylotech.de" },
          { key: "Vary", value: "Origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
