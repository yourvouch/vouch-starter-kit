import type { MetadataRoute } from "next";

const routes = [
  "",
  "/review",
  "/local-data",
  "/examples/interiors",
  "/examples/agency",
  "/examples/saas",
  "/examples/general-sales",
  "/examples/recruitment",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `https://vouchstarterkit.netlify.app${route || "/"}`,
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route.startsWith("/examples/") ? 0.8 : 0.7,
  }));
}
