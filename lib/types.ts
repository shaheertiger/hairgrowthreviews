export interface QuickFact {
  label: string;
  value: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  body: string[];
  subsections?: { heading: string; body: string[] }[];
  /** A short, verbatim-or-near-verbatim line lifted from this section's body,
   *  surfaced as a pull quote to break up long passages. */
  pullQuote?: string;
  /** The single most actionable takeaway from this section, shown as a callout. */
  keyPoint?: string;
  /** An optional comparison table rendered at the end of this section. */
  table?: ComparisonTableData;
}

export interface IngredientRow {
  name: string;
  note: string;
}

export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface ComparisonTableData {
  columns: string[];
  rows: ComparisonRow[];
}

export interface ReviewData {
  slug: string;
  productName: string;
  brand: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  rating: number;
  reviewCount: number;
  ratingBasis: string;
  price: string;
  priceNote?: string;
  verdictLabel: string;
  bestFor: string;
  quickFacts: QuickFact[];
  intro: string[];
  /** 3-5 scannable bullets summarising the whole article, shown near the top. */
  keyTakeaways?: string[];
  pros: string[];
  cons: string[];
  ingredients?: IngredientRow[];
  comparisonTable?: ComparisonTableData;
  sections: ContentSection[];
  faq: FaqItem[];
  bottomLine: string;
  guarantee?: string;
  safetyNote?: string;
  affiliateUrl: string;
  relatedSlugs: string[];
  updatedDate: string;
}

export interface GuideData {
  slug: string;
  section: "find-a-treatment" | "about-hair-growth" | "the-hgr-regimen";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  intro: string[];
  /** 3-5 scannable bullets summarising the whole article, shown near the top. */
  keyTakeaways?: string[];
  quickFacts?: QuickFact[];
  comparisonTable?: ComparisonTableData;
  comparisonTableTitle?: string;
  sections: ContentSection[];
  faq: FaqItem[];
  bottomLine: string;
  relatedSlugs: string[];
  relatedReviewSlugs?: string[];
  updatedDate: string;
}

/** One ranked product inside a "best of" roundup. */
export interface RoundupProduct {
  /** Stable kebab-case key; also the anchor id of the product card. */
  id: string;
  /** The product as Amazon lists it, brand first (e.g. "Kirkland Signature Minoxidil 5% Topical Solution"). */
  name: string;
  brand: string;
  /** The exact Amazon listing, found with `npm run amazon:search`. Drives the direct /dp/ link and the image. */
  asin?: string;
  /** Award line shown on the card and in the quick picks, e.g. "Best Overall". */
  badge: string;
  /** Short product type, e.g. "5% Minoxidil Liquid". */
  category: string;
  /** Editorial score out of 5 — our verdict, not an Amazon star rating. */
  score: number;
  bestFor: string;
  keySpecs: QuickFact[];
  /** 2-3 paragraphs on what it is, what the evidence says, and who should skip it. */
  description: string[];
  pros: string[];
  cons: string[];
  bottomLine: string;
}

export interface RoundupMistake {
  heading: string;
  body: string;
}

/** A commercial "best X" roundup — the format that earns on thehonestreviewers.com. */
export interface RoundupData {
  slug: string;
  /** Hub grouping on /best and in the nav. */
  hub: "Hair Growth & Hair Loss" | "Hair Care" | "Hair Tools" | "Men's Grooming" | "Brows, Lashes & Beard";
  /** Short breadcrumb / card label, e.g. "Best Minoxidil for Men". */
  crumb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  intro: string[];
  keyTakeaways: string[];
  products: RoundupProduct[];
  /** Number of body sections rendered before the product cards. */
  picksAfter: number;
  picksHeading: string;
  picksIntro: string;
  sections: ContentSection[];
  comparisonTable?: ComparisonTableData;
  mistakes: RoundupMistake[];
  faq: FaqItem[];
  bottomLine: string;
  relatedRoundups: string[];
  relatedReviewSlugs?: string[];
  /** Existing guide paths to link to, e.g. "/find-a-treatment/minoxidil-rogaine". */
  relatedGuides?: { href: string; label: string }[];
  publishedDate: string;
  updatedDate: string;
}
