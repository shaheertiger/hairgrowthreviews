import type { MetadataRoute } from "next";
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import { roundups } from "@/data/roundups";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/best", "/reviews", "/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date("2026-08-20"),
  }));

  const reviewRoutes = reviews
    .filter((r) => r.slug !== "mane-n-tail-shampoo")
    .map((r) => ({
      url: `${site.url}/reviews/${r.slug}`,
      lastModified: new Date("2026-08-20"),
    }));

  const maneNTailRoute = [
    { url: `${site.url}/mane-n-tail-shampoo-read-first`, lastModified: new Date("2026-08-20") },
  ];

  const guideRoutes = guides.map((g) => ({
    url:
      g.section === "the-hgr-regimen"
        ? g.slug === "the-hgr-regimen"
          ? `${site.url}/the-hgr-regimen`
          : `${site.url}/the-hgr-regimen/${g.slug}`
        : `${site.url}/${g.section}/${g.slug}`,
    lastModified: new Date("2026-08-20"),
  }));

  const roundupRoutes = roundups.map((r) => ({
    url: `${site.url}/${r.slug}`,
    lastModified: new Date(r.updatedDate),
  }));

  return [...staticRoutes, ...roundupRoutes, ...reviewRoutes, ...maneNTailRoute, ...guideRoutes];
}
