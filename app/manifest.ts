import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vouch Starter Kit 2.0",
    short_name: "Vouch Starter",
    description: "Open-source, local-first business decision intelligence.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#081221",
  };
}
