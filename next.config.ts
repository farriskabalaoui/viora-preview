import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.viorahealthcare.com" },
    ],
  },
};

export default nextConfig;
