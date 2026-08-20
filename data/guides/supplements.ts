import { GuideData } from "@/lib/types";

export const supplements: GuideData = {
  slug: "supplements",
  section: "find-a-treatment",
  metaTitle: "Hair Growth Supplements: What Actually Works (2026 Evidence Review)",
  metaDescription:
    "Biotin, saw palmetto, collagen, iron, zinc, vitamin D — which hair growth supplement ingredients have real evidence, and which are mostly marketing.",
  h1: "Hair Growth Supplements: What the Evidence Actually Shows",
  dek: "Not all supplement ingredients are created equal. Here's an honest breakdown of what's backed by research and what's mostly hype.",
  intro: [
    "Supplement marketing for hair growth is extensive, but the underlying evidence varies widely by ingredient. Before buying any capsule or tablet, it's worth knowing which actives actually have research behind them.",
  ],
  sections: [
    {
      id: "biotin",
      heading: "Biotin: The Most Marketed, Least Evidenced",
      body: [
        "Biotin is the most heavily marketed hair supplement ingredient, but true biotin deficiency is rare in people eating a normal diet, and standalone biotin supplementation has not been shown to improve hair growth in people who aren't deficient. Its popularity outpaces its evidence base for otherwise-healthy users, though it's sometimes included in post-transplant recovery formulas.",
      ],
    },
    {
      id: "saw-palmetto",
      heading: "Saw Palmetto: Modest but Real Evidence",
      body: [
        "Saw palmetto has more supportive evidence than biotin: several small randomized controlled trials and cohort studies, generally at doses of 100-320 mg/day, suggest it may modestly slow androgenetic alopecia in men, plausibly by weakly inhibiting the enzyme that converts testosterone to DHT. Evidence in women is much more limited, and effect sizes are smaller than for approved pharmaceutical treatments like finasteride.",
      ],
    },
    {
      id: "collagen",
      heading: "Collagen: Promising but Under-Studied",
      body: [
        "Collagen supplements show promising cell- and animal-model data plus a few small human trials reporting modest improvements in hair count or appearance, but robust, large-scale human RCTs specifically isolating collagen's effect on hair growth are lacking — much of the marketing outpaces the clinical proof.",
      ],
    },
    {
      id: "deficiency-nutrients",
      heading: "Vitamin D, Iron & Zinc: Where Deficiency Actually Matters",
      body: [
        "Unlike biotin, deficiencies in these three are genuinely and repeatedly linked to hair shedding in research literature. Iron deficiency (low ferritin) is the most well-documented nutritional cause of hair thinning, particularly in women. Zinc deficiency is strongly associated with alopecia areata and telogen effluvium. Vitamin D deficiency is common among people with pattern and autoimmune hair loss.",
        "Correcting a genuine deficiency in these nutrients can meaningfully improve hair shedding — but supplementing them when levels are already normal has not been shown to provide extra benefit. Bloodwork is the recommended way to know if supplementation is actually warranted, rather than assuming.",
      ],
    },
  ],
  faq: [
    {
      q: "Should I take a biotin supplement for hair loss?",
      a: "Only if you have a diagnosed biotin deficiency, which is rare in people eating a normal diet. For most people, standalone biotin supplementation hasn't been shown to improve hair growth.",
    },
    {
      q: "Does saw palmetto really help hair loss?",
      a: "There's modest supporting evidence, mainly in men at 100-320 mg/day doses, for a mild slowing effect on androgenetic alopecia. It's weaker than finasteride but has more research behind it than most other supplement ingredients.",
    },
    {
      q: "Should I get bloodwork before taking hair supplements?",
      a: "Yes — checking ferritin (iron), zinc, and vitamin D levels is the most reliable way to know whether supplementation will actually help you, since correcting a genuine deficiency in these nutrients has real evidence behind it, unlike supplementing when levels are already normal.",
    },
  ],
  bottomLine:
    "Most hair-growth supplement marketing outpaces the evidence — saw palmetto has modest real support, and iron/zinc/vitamin D matter only if you're actually deficient. Get bloodwork before assuming a bottle of vitamins will fix your hair loss.",
  relatedSlugs: ["minoxidil-rogaine", "scalp-reduction"],
  relatedReviewSlugs: ["viviscal-extra-strength-hair-nutrient-tablets", "bloom"],
  updatedDate: "August 2026",
};
