/**
 * Machine-readable half of SEO-RULES.md. scripts/verify-content.ts enforces it,
 * so a daily run cannot quietly break what is already earning clicks.
 *
 * WINNERS are the pages Bing shows earning clicks (`npm run bing`, data/bing/). Their titles are
 * frozen here: a run may extend their content and build their cluster, but it
 * must not retitle them. Update this list only from fresh `npm run bing` data
 * (a page joins after 2+ weeks with clicks; it leaves only if Bing shows 0
 * clicks for 4+ weeks), and record the change in SEO-RULES.md's log.
 */
export const WINNERS: Record<string, { title: string; why: string }> = {
  "/best-batana-oil": {
    title: "Best Batana Oil for Hair Growth (2026): 6 Brands Reviewed",
    why: "Bing, 90 days to 2026-11-27: 60 clicks, 1,933 impressions, position 5.4. Queries: best batana oil (for hair growth), batana oil hair growth reviews.",
  },
  "/best-pumpkin-seed-oil-for-hair-loss": {
    title: "Best Pumpkin Seed Oil for Hair (2026): 6 Softgels & Oils Ranked",
    why: "Bing: 27 clicks, 485 impressions, position 4.7, CTR 5.6%. Low-competition single-ingredient topic with one real trial.",
  },
  "/best-hair-growth-products": {
    title: "Best Hair Growth Products (2026): 10 Reviewed & Ranked on Evidence",
    why: "Bing: 13 clicks, 600 impressions, position 5.9 for review-intent 'hair growth products' queries.",
  },
  "/reviews/aveda-invati-scalp-revitalizer": {
    title: "Aveda Invati Review: A Premium Ayurvedic Scalp Serum, Rated 3.6/5",
    why: "Bing: 27 clicks, 408 impressions, position 4.2, CTR 6.6% ('aveda invati reviews'). The brand-review format works.",
  },
  "/reviews/viviscal-extra-strength-hair-nutrient-tablets": {
    title: "Viviscal Extra Strength Review: 3.4/5 Marine Hair Supplement",
    why: "Bing: 6 clicks, 150 impressions, position 4.1 (also 'aminomar marine complex'). Another branded review that earns.",
  },
  "/find-a-treatment/minoxidil-rogaine": {
    title: "Rogaine vs Minoxidil: Same Drug, Generic ~$8/Month vs $25-$50",
    why: "Bing: 5 clicks, 334 impressions, position 5.7 for 'rogaine vs minoxidil' difference and cost queries.",
  },
};

/** Clusters the winners belong to. New pages go here first (see SEO-RULES.md). */
export const DOUBLE_DOWN_CLUSTERS = ["batana oil", "pumpkin seed oil", "rosemary oil", "castor oil", "hair growth oils", "brand reviews"];

/** Max title length Bing shows without truncating, in characters. */
export const MAX_TITLE = 65;
