/**
 * One place that knows every content URL and how pages relate.
 *
 * Data files declare a few hand-picked relations (relatedRoundups,
 * relatedReviewSlugs, relatedGuides…). The helpers here also follow those
 * relations backwards, so when guide A links to page B, page B links back to A
 * without anyone editing B's data file. That way new pages pick up inbound
 * links as soon as anything points at them.
 */
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import { roundups } from "@/data/roundups";
import { questions } from "@/data/questions";
import type { GuideData, QuestionData, ReviewData, RoundupData } from "@/lib/types";

/* ---------- URLs ---------- */

/** Mane 'n Tail's review lives at a custom canonical URL. */
const reviewPathOverrides: Record<string, string> = {
  "mane-n-tail-shampoo": "/mane-n-tail-shampoo-read-first",
};

export const reviewHref = (slug: string) => reviewPathOverrides[slug] ?? `/reviews/${slug}`;
export const roundupHref = (slug: string) => `/${slug}`;
export const questionHref = (slug: string) => `/${slug}`;
export function guideHref(g: Pick<GuideData, "section" | "slug">) {
  if (g.section === "the-hgr-regimen") return g.slug === "the-hgr-regimen" ? "/the-hgr-regimen" : `/the-hgr-regimen/${g.slug}`;
  return `/${g.section}/${g.slug}`;
}

export const guideSectionLabels: Record<GuideData["section"], string> = {
  "find-a-treatment": "Find a Treatment",
  "about-hair-growth": "About Hair Growth",
  "the-hgr-regimen": "The HGR Regimen",
};
/** Index page for each guide section. */
export const guideSectionHref: Record<GuideData["section"], string> = {
  "find-a-treatment": "/find-a-treatment",
  "about-hair-growth": "/about-hair-growth",
  "the-hgr-regimen": "/the-hgr-regimen",
};

/* ---------- lookups ---------- */

const bySlug = <T extends { slug: string }>(list: T[], slugs: string[]) =>
  slugs.map((s) => list.find((x) => x.slug === s)).filter((x): x is T => !!x);

const findGuideByHref = (href: string) => guides.find((g) => guideHref(g) === href.split("#")[0]);

function uniq<T>(items: T[], key: (t: T) => string, exclude: string[] = []) {
  const seen = new Set(exclude);
  return items.filter((t) => {
    const k = key(t);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export interface GuideLink {
  href: string;
  label: string;
}

const guideLink = (g: GuideData): GuideLink => ({ href: guideHref(g), label: g.h1 });

/* ---------- roundups ---------- */

/**
 * Hand-picked roundups first, then up to 3 roundups that link here (so links
 * run both ways), then same-hub fill. Sized to whole rows of the 3-card grid.
 */
export function relatedRoundupsFor(r: RoundupData): RoundupData[] {
  const explicit = bySlug(roundups, r.relatedRoundups);
  const backlinks = uniq(
    roundups.filter((x) => x.relatedRoundups.includes(r.slug)),
    (x) => x.slug,
    [r.slug, ...r.relatedRoundups],
  ).slice(0, 3);
  const sameHub = roundups.filter((x) => x.hub === r.hub);
  const size = Math.max(6, Math.ceil((explicit.length + backlinks.length) / 3) * 3);
  return uniq([...explicit, ...backlinks, ...sameHub], (x) => x.slug, [r.slug]).slice(0, size);
}

/** Guides a roundup should send readers to: hand-picked, plus the hub's default reading. */
const hubGuides: Record<RoundupData["hub"], string[]> = {
  "Hair Growth & Hair Loss": ["/find-a-treatment/minoxidil-rogaine", "/about-hair-growth/hair-loss-cycle", "/the-hgr-regimen"],
  "Hair Care": ["/about-hair-growth/hair-loss-cycle", "/about-hair-growth/hair-growth-encyclopedia"],
  "Hair Tools": ["/about-hair-growth/hair-growth-encyclopedia"],
  "Men's Grooming": ["/about-hair-growth/stages-hair-loss", "/find-a-treatment/minoxidil-rogaine"],
  "Brows, Lashes & Beard": ["/about-hair-growth/hair-loss-cycle", "/find-a-treatment/minoxidil-rogaine"],
};

export function relatedGuidesForRoundup(r: RoundupData, max = 4): GuideLink[] {
  const explicit = r.relatedGuides ?? [];
  const fill = hubGuides[r.hub].map(findGuideByHref).filter((g): g is GuideData => !!g).map(guideLink);
  return uniq([...explicit, ...fill], (g) => g.href.split("#")[0]).slice(0, Math.max(max, explicit.length));
}

export function reviewsForRoundup(r: RoundupData): ReviewData[] {
  const explicit = bySlug(reviews, r.relatedReviewSlugs ?? []);
  const fromGuides = guides
    .filter((g) => relatedGuidesForRoundup(r).some((l) => l.href === guideHref(g)))
    .flatMap((g) => bySlug(reviews, g.relatedReviewSlugs ?? []));
  // Only hair-growth pages share the reviewed products' topic.
  const pool = r.hub === "Hair Growth & Hair Loss" ? [...explicit, ...fromGuides] : explicit;
  return uniq(pool, (x) => x.slug).slice(0, Math.max(3, explicit.length));
}

/* ---------- reviews ---------- */

/** Default buyer's guide by review category, for reviews no roundup lists yet. */
function categoryRoundups(r: ReviewData): string[] {
  const c = `${r.category} ${r.productName}`.toLowerCase();
  if (c.includes("supplement") || c.includes("capsule") || c.includes("tablet"))
    return ["best-hair-growth-vitamins", "best-biotin-for-hair-growth", "best-hair-growth-products"];
  if (c.includes("shampoo")) return ["best-hair-growth-shampoo", "best-shampoo-for-thinning-hair", "best-hair-growth-products"];
  if (c.includes("oil")) return ["best-hair-growth-oil", "best-rosemary-oil-for-hair-growth", "best-hair-growth-products"];
  if (c.includes("device") || c.includes("applicator")) return ["best-hair-growth-serum", "best-scalp-massager", "best-hair-growth-products"];
  return ["best-hair-growth-serum", "best-hair-growth-products", "best-dht-blocker"];
}

export function roundupsForReview(r: ReviewData, max = 4): RoundupData[] {
  const listing = roundups.filter((x) => x.relatedReviewSlugs?.includes(r.slug));
  return uniq([...listing, ...bySlug(roundups, categoryRoundups(r))], (x) => x.slug).slice(0, max);
}

export function guidesForReview(r: ReviewData): GuideLink[] {
  const listing = guides.filter((g) => g.relatedReviewSlugs?.includes(r.slug));
  const fallback = bySlug(guides, ["minoxidil-rogaine", "the-hgr-regimen"]);
  return uniq([...listing, ...fallback], (g) => g.slug).slice(0, 3).map(guideLink);
}

/** Hand-picked related reviews, plus reviews that list this one, skipping slugs that aren't reviews. */
export function relatedReviewsFor(r: ReviewData): ReviewData[] {
  const explicit = bySlug(reviews, r.relatedSlugs);
  const backlinks = uniq(
    reviews.filter((x) => x.relatedSlugs.includes(r.slug)),
    (x) => x.slug,
    [r.slug, ...r.relatedSlugs],
  ).slice(0, 3);
  const sameCategory = reviews.filter((x) => x.category === r.category);
  const size = Math.max(3, Math.ceil((explicit.length + backlinks.length) / 3) * 3);
  return uniq([...explicit, ...backlinks, ...sameCategory], (x) => x.slug, [r.slug]).slice(0, size);
}

/* ---------- guides ---------- */

export function relatedGuidesForGuide(g: GuideData): GuideLink[] {
  const explicit = bySlug(guides, g.relatedSlugs);
  const backlinks = guides.filter((x) => x.relatedSlugs.includes(g.slug));
  return uniq([...explicit, ...backlinks], (x) => x.slug, [g.slug]).map(guideLink);
}

/** Buyer's guides that send readers to this guide, best-linked hubs first. */
export function roundupsForGuide(g: GuideData, max = 6): RoundupData[] {
  const href = guideHref(g);
  return roundups.filter((r) => r.relatedGuides?.some((l) => l.href.split("#")[0] === href)).slice(0, max);
}

/** Buyer's guides that cite any guide in a section, most-cited first (for the section index). */
export function roundupsForGuideSection(section: GuideData["section"], max = 6): RoundupData[] {
  const counts = new Map<string, { r: RoundupData; n: number }>();
  for (const g of guides.filter((x) => x.section === section))
    for (const r of roundupsForGuide(g, Infinity)) counts.set(r.slug, { r, n: (counts.get(r.slug)?.n ?? 0) + 1 });
  return [...counts.values()].sort((a, b) => b.n - a.n).slice(0, max).map((x) => x.r);
}

export function questionsForGuide(g: GuideData, max = 6): QuestionData[] {
  const href = guideHref(g);
  return questions.filter((q) => q.relatedGuides?.some((l) => l.href.split("#")[0] === href)).slice(0, max);
}

/* ---------- questions ---------- */

export function relatedQuestionsFor(q: QuestionData): QuestionData[] {
  const explicit = bySlug(questions, q.relatedQuestions);
  const backlinks = uniq(
    questions.filter((x) => x.relatedQuestions.includes(q.slug)),
    (x) => x.slug,
    [q.slug, ...q.relatedQuestions],
  ).slice(0, 2);
  const samePillar = questions.filter((x) => x.pillarSlug === q.pillarSlug);
  return uniq([...explicit, ...backlinks, ...samePillar], (x) => x.slug, [q.slug]).slice(0, Math.max(5, explicit.length + backlinks.length));
}

/** Other questions that mention this question's buyer's guide, so roundups list them too. */
export function questionsForRoundup(r: RoundupData, max = 6): QuestionData[] {
  const pillar = questions.filter((q) => q.pillarSlug === r.slug);
  const mentions = questions.filter((q) => q.relatedRoundups.includes(r.slug));
  return uniq([...pillar, ...mentions], (q) => q.slug).slice(0, Math.max(max, pillar.length));
}

export function relatedRoundupsForQuestion(q: QuestionData): RoundupData[] {
  return bySlug(roundups, q.relatedRoundups.filter((s) => s !== q.pillarSlug));
}
