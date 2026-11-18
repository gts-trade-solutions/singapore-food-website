import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Optional: build to another folder (e.g. while a dev server is using .next).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // rjsstore.com is the main address: send www visitors there so search engines see one site.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.rjsstore.com" }],
        destination: "https://rjsstore.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
