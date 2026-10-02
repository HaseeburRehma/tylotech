import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the old WordPress URLs of tylotech.de working
  async redirects() {
    return [
      { source: "/datenschutzerklarung", destination: "/datenschutz", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
    ];
  },
};

export default nextConfig;
