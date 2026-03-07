import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@store/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
