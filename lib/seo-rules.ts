/**
 * Machine-readable half of SEO-RULES.md. scripts/verify-content.ts enforces it,
 * so a daily run cannot quietly break what is already earning clicks.
 *
 * WINNERS are the pages Bing and Vercel show earning clicks. Their titles are
 * frozen here: a run may extend their content and build their cluster, but it
 * must not retitle them. Update this list only from fresh `npm run bing` data
 * (a page joins after 2+ weeks with clicks; it leaves only if Bing shows 0
 * clicks for 4+ weeks), and record the change in SEO-RULES.md's log.
 */
export const WINNERS: Record<string, { title: string; why: string }> = {
  "/best-batana-oil": {
    title: "Best Batana Oil for Hair Growth (2026): 6 Brands Reviewed",
    why: "Top Bing page. Queries: best batana oil for hair growth, batana oil reviews, trustworthy batana brands on Amazon.",
  },
  "/best-pumpkin-seed-oil-for-hair-loss": {
    title: "Best Pumpkin Seed Oil for Hair (2026): 6 Softgels & Oils Ranked",
    why: "Second click earner on Bing and Vercel. Low-competition single-ingredient topic with one real trial behind it.",
  },
  "/best-hair-growth-products": {
    title: "Best Hair Growth Products (2026): 10 Reviewed & Ranked on Evidence",
    why: "Earns clicks on Bing and Vercel for review-intent 'hair growth products' queries.",
  },
  "/reviews/aveda-invati-scalp-revitalizer": {
    title: "Aveda Invati Review: A Premium Ayurvedic Scalp Serum, Rated 3.6/5",
    why: "Branded review query with demand and weak competition: the brand-review format works.",
  },
};

/** Clusters the winners belong to. New pages go here first (see SEO-RULES.md). */
export const DOUBLE_DOWN_CLUSTERS = ["batana oil", "pumpkin seed oil", "rosemary oil", "castor oil", "hair growth oils", "brand reviews"];

/** Max title length Bing shows without truncating, in characters. */
export const MAX_TITLE = 65;
