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
  quickFacts?: QuickFact[];
  sections: ContentSection[];
  faq: FaqItem[];
  bottomLine: string;
  relatedSlugs: string[];
  relatedReviewSlugs?: string[];
  updatedDate: string;
}
