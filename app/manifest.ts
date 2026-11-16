import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "RJS Foods",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FDFCFA",
    theme_color: "#4E423C",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
