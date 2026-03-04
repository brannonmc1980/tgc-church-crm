import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tgc-headless.vercel.app",
      },
    ],
  },
  // Required for leaflet-draw which uses CSS imports
  transpilePackages: ["leaflet", "react-leaflet"],
};

export default nextConfig;
