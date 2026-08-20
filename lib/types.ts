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
