import type { MetadataRoute } from "next";
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import { roundups } from "@/data/roundups";
import { questions } from "@/data/questions";
import { site } from "@/lib/site";
import { toIsoDate } from "@/lib/dates";

/** Each page's own updated date, so lastmod only moves when the page really changed. */
const lastMod = (date?: string) => new Date(toIsoDate(date) ?? site.staticLastModified);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/best", "/answers", "/reviews", "/find-a-treatment", "/about-hair-growth", "/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(site.staticLastModified),
  }));

  const reviewRoutes = reviews
    .filter((r) => r.slug !== "mane-n-tail-shampoo")
    .map((r) => ({
      url: `${site.url}/reviews/${r.slug}`,
      lastModified: lastMod(r.updatedDate),
    }));

  const maneNTailRoute = [
    { url: `${site.url}/mane-n-tail-shampoo-read-first`, lastModified: new Date(site.staticLastModified) },
  ];

  const guideRoutes = guides.map((g) => ({
    url:
      g.section === "the-hgr-regimen"
        ? g.slug === "the-hgr-regimen"
          ? `${site.url}/the-hgr-regimen`
          : `${site.url}/the-hgr-regimen/${g.slug}`
        : `${site.url}/${g.section}/${g.slug}`,
    lastModified: lastMod(g.updatedDate),
  }));

  const roundupRoutes = roundups.map((r) => ({
    url: `${site.url}/${r.slug}`,
    lastModified: lastMod(r.updatedDate),
  }));

  const questionRoutes = questions.map((q) => ({
    url: `${site.url}/${q.slug}`,
    lastModified: lastMod(q.updatedDate),
  }));

  return [...staticRoutes, ...roundupRoutes, ...questionRoutes, ...reviewRoutes, ...maneNTailRoute, ...guideRoutes];
}
