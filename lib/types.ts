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

/** One ranked product inside a buying guide. */
export interface ProductPick {
  /** Stable anchor id for the product card, e.g. "nioxin-system-2". */
  id: string;
  /** Short award label, e.g. "Best Overall", "Best Budget". */
  award: string;
  name: string;
  brand: string;
  /** Editorial score out of 5, based on our evidence + value rubric (not Amazon stars). */
  score: number;
  /** Approximate price at time of writing, e.g. "~$25". */
  price: string;
  /** Size / count the price refers to, e.g. "10.1 fl oz" or "60 capsules". */
  size?: string;
  /** Who this pick suits, in a few words. */
  bestFor: string;
  /** Headline active ingredients or specs. */
  keyIngredients: string[];
  /** 2-3 paragraphs explaining why it made the list. */
  summary: string[];
  pros: string[];
  cons: string[];
  /** Amazon ASIN. When set, links go straight to the product page; otherwise to a search. */
  asin?: string;
  /** Amazon search query used when no ASIN is set. */
  amazonQuery: string;
}

/** A "best X" affiliate buying guide, rendered at /best/[slug]. */
export interface BuyingGuideData {
  slug: string;
  /** Primary target keyword, e.g. "best shampoo for thinning hair". */
  keyword: string;
  /** Short label for hub cards and nav, e.g. "Shampoos for Thinning Hair". */
  shortTitle: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  dek: string;
  intro: string[];
  keyTakeaways: string[];
  /** One sentence explaining how picks were chosen for this specific category. */
  methodology: string;
  products: ProductPick[];
  /** Buying advice, ingredient explainers, how-to-use, etc. Rendered after the product cards. */
  sections: ContentSection[];
  faq: FaqItem[];
  bottomLine: string;
  relatedGuideSlugs: string[];
  relatedReviewSlugs?: string[];
  updatedDate: string;
}
