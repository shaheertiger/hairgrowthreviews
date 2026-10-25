/**
 * The Markdown renderer registry: one renderer per route pattern in
 * ./routes. Each renderer lists the concrete paths it serves (for the
 * catalog, llms.txt and the static build) and renders one of them from the
 * same data the HTML page uses.
 *
 * Adding a page: add its pattern to MD_ROUTE_PATTERNS and a renderer here.
 * TypeScript refuses a pattern without a renderer, and
 * `npm run check:markdown` refuses a page in app/ without a pattern.
 */
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import { roundups } from "@/data/roundups";
import { questions } from "@/data/questions";
import type { GuideData } from "@/lib/types";
import { guideHref, questionHref, reviewHref, roundupHref } from "@/lib/links";
import { staticPages } from "@/lib/pages";
import { MD_ROUTE_PATTERNS, matchRoute, type MdRoutePattern } from "./routes";
import { mdPath, renderDoc, type MdDoc } from "./format";
import { reviewDoc } from "./renderers/review";
import { roundupDoc } from "./renderers/roundup";
import { questionDoc } from "./renderers/question";
import { guideDoc, guideHubDoc } from "./renderers/guide";
import { aboutDoc, answersDoc, bestDoc, contactDoc, homeDoc, privacyDoc, reviewsDoc, termsDoc } from "./renderers/static";

/** Sections of llms.txt / llms-full.txt, in reading order. */
export type MdGroup = "core" | "guides" | "roundups" | "reviews" | "answers" | "legal";

export interface MdRouteInfo {
  path: string;
  title: string;
  description: string;
  group: MdGroup;
  updated?: string;
}

export type MdResult = { doc: MdDoc } | { redirect: string } | null;

interface RouteRenderer {
  list(): MdRouteInfo[];
  render(params: Record<string, string>): MdResult;
}

const info = (doc: MdDoc, group: MdGroup): MdRouteInfo => ({
  path: doc.path,
  title: doc.title,
  description: doc.summary,
  group,
  updated: doc.updated,
});

/** A page with one fixed URL. */
const fixed = (group: MdGroup, make: () => MdDoc): RouteRenderer => ({
  list: () => [info(make(), group)],
  render: () => ({ doc: make() }),
});

/** Guides in one section, at /<section>/<slug>. */
const guideSection = (section: GuideData["section"]): RouteRenderer => {
  const inSection = guides.filter((g) => g.section === section);
  return {
    list: () => inSection.map((g) => ({ path: guideHref(g), title: g.h1, description: g.metaDescription, group: "guides", updated: g.updatedDate })),
    render: ({ slug }) => {
      const g = inSection.find((x) => x.slug === slug);
      return g ? { doc: guideDoc(g) } : null;
    },
  };
};

const guide = (section: GuideData["section"], slug: string): RouteRenderer => {
  const g = () => guides.find((x) => x.section === section && x.slug === slug);
  return {
    list: () => {
      const found = g();
      return found ? [info(guideDoc(found), "guides")] : [];
    },
    render: () => {
      const found = g();
      return found ? { doc: guideDoc(found) } : null;
    },
  };
};

/** Reviews whose canonical page is /reviews/<slug> (Mane 'n Tail lives at its own URL). */
const canonicalReviews = () => reviews.filter((r) => reviewHref(r.slug) === `/reviews/${r.slug}`);

export const registry: Record<MdRoutePattern, RouteRenderer> = {
  "/": fixed("core", homeDoc),
  "/best": fixed("core", bestDoc),
  "/answers": fixed("core", answersDoc),
  "/reviews": fixed("core", reviewsDoc),
  "/reviews/:slug": {
    list: () =>
      canonicalReviews().map((r) => ({ path: reviewHref(r.slug), title: r.h1, description: r.metaDescription, group: "reviews", updated: r.updatedDate })),
    render: ({ slug }) => {
      const r = reviews.find((x) => x.slug === slug);
      if (!r) return null;
      const href = reviewHref(r.slug);
      return href === `/reviews/${slug}` ? { doc: reviewDoc(r) } : { redirect: mdPath(href) };
    },
  },
  "/find-a-treatment": fixed("core", () => guideHubDoc("find-a-treatment", staticPages.findATreatment)),
  "/find-a-treatment/:slug": guideSection("find-a-treatment"),
  "/about-hair-growth": fixed("core", () => guideHubDoc("about-hair-growth", staticPages.aboutHairGrowth)),
  "/about-hair-growth/:slug": guideSection("about-hair-growth"),
  "/the-hgr-regimen": guide("the-hgr-regimen", "the-hgr-regimen"),
  "/the-hgr-regimen/help": guide("the-hgr-regimen", "help"),
  "/mane-n-tail-shampoo-read-first": {
    list: () =>
      reviews
        .filter((r) => reviewHref(r.slug) === "/mane-n-tail-shampoo-read-first")
        .map((r) => ({ path: reviewHref(r.slug), title: r.h1, description: r.metaDescription, group: "reviews", updated: r.updatedDate })),
    render: () => {
      const r = reviews.find((x) => reviewHref(x.slug) === "/mane-n-tail-shampoo-read-first");
      return r ? { doc: reviewDoc(r) } : null;
    },
  },
  "/about": fixed("core", aboutDoc),
  "/contact": fixed("core", contactDoc),
  "/privacy": fixed("legal", privacyDoc),
  "/terms": fixed("legal", termsDoc),
  "/:slug": {
    list: () => [
      ...roundups.map((r) => ({ path: roundupHref(r.slug), title: r.h1, description: r.metaDescription, group: "roundups" as const, updated: r.updatedDate })),
      ...questions.map((q) => ({ path: questionHref(q.slug), title: q.h1, description: q.metaDescription, group: "answers" as const, updated: q.updatedDate })),
    ],
    render: ({ slug }) => {
      const r = roundups.find((x) => x.slug === slug);
      if (r) return { doc: roundupDoc(r) };
      const q = questions.find((x) => x.slug === slug);
      return q ? { doc: questionDoc(q) } : null;
    },
  },
};

/** Every page with a Markdown copy, in registry order. */
export function listMarkdownRoutes(): MdRouteInfo[] {
  return MD_ROUTE_PATTERNS.flatMap((p) => registry[p].list());
}

/** Renders the page at `path` ("/", "/reviews/crinagen"), a redirect (site path) to its canonical copy, or null. */
export function resolveMarkdown(path: string): MdResult {
  const match = matchRoute(path);
  return match ? registry[match.pattern].render(match.params) : null;
}

export function renderMarkdown(path: string): { body: string; doc: MdDoc } | null {
  const result = resolveMarkdown(path);
  return result && "doc" in result ? { body: renderDoc(result.doc), doc: result.doc } : null;
}
