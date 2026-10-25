/**
 * Markdown for the building blocks the article templates share
 * (components/ui/*): sections, FAQs, tables, the byline and related cards.
 * Each mirrors what its component shows, in the same order.
 */
import type { ComparisonTableData, ContentSection, FaqItem, QuestionData, ReviewData, RoundupData } from "@/lib/types";
import type { GuideLink } from "@/lib/links";
import { questionHref, reviewHref, roundupHref } from "@/lib/links";
import type { LinkSegment } from "@/lib/autolink";
import { scientificReviewer } from "@/lib/reviewer";
import { site } from "@/lib/site";
import { bullets, esc, h, item, link, quote, segments, table } from "../format";

export type Segmenter = (text: string) => LinkSegment[];

/** components/AuthorBlock */
export function byline(updatedDate: string): string {
  return [
    `Written by ${site.name} Editorial Team. Reviewed by ${link(scientificReviewer.name, scientificReviewer.linkedin)}, ${esc(scientificReviewer.title)}.`,
    `Updated ${esc(updatedDate)} · Independently researched · ${link("How we review", "/about#editorial-process")}`,
  ].join("  \n");
}

/** The short affiliate note under roundup and question headers. */
export const commissionNote = (label: string) =>
  `*We may earn a commission when you buy through our links, at no cost to you. As an Amazon Associate we earn from qualifying purchases.* ${link(label, "/about#editorial-process")}`;

/** components/ui/KeyTakeaways */
export const takeaways = (items?: string[]) => (items?.length ? `${h(2, "The Short Version")}\n\n${bullets(items.map(esc))}` : "");

/** components/ui/ComparisonTable */
export const comparison = (data: ComparisonTableData, firstColLabel = "") =>
  table([firstColLabel, ...data.columns], data.rows.map((r) => [r.label, ...r.values]));

/** components/ui/ArticleSection: body, pull quote after the first paragraph, subsections, table, key point. */
export function section(s: ContentSection, seg: Segmenter): string {
  const quoteAfter = s.body.length > 2 ? 1 : 0;
  const out = [h(2, s.heading)];
  s.body.forEach((p, i) => {
    out.push(segments(seg(p)));
    if (s.pullQuote && i === quoteAfter) out.push(quote(esc(s.pullQuote)));
  });
  for (const sub of s.subsections ?? []) {
    out.push(h(3, sub.heading), ...sub.body.map((p) => segments(seg(p))));
  }
  if (s.table) out.push(comparison(s.table));
  if (s.keyPoint) out.push(quote(`**Key Point:** ${esc(s.keyPoint)}`));
  return out.join("\n\n");
}

/** components/ui/FAQAccordion */
export const faq = (items: FaqItem[]) =>
  [h(2, "Frequently Asked Questions"), ...items.map((f) => `${h(3, f.q)}\n\n${esc(f.a)}`)].join("\n\n");

/** components/ui/BottomLineBox */
export const bottomLine = (text: string) => `${h(2, "The Bottom Line")}\n\n${esc(text)}`;

/** components/ui/ProsConsBox */
export const prosCons = (pros: string[], cons: string[], level: 3 | 4 = 3) =>
  `${h(level, "What We Liked")}\n\n${bullets(pros.map(esc))}\n\n${h(level, "What We Didn't")}\n\n${bullets(cons.map(esc))}`;

/* Related cards (components/RelatedLinks, components/RelatedReviews) */
export const roundupItems = (items: RoundupData[]) => items.map((r) => item(r.crumb, roundupHref(r.slug), r.dek));
export const questionItems = (items: QuestionData[]) => items.map((q) => item(q.h1, questionHref(q.slug)));
export const guideItems = (items: GuideLink[]) => items.map((g) => item(g.label, g.href));
export const reviewItems = (items: ReviewData[]) =>
  items.map((r) => item(r.productName, reviewHref(r.slug), `${r.category}, rated ${r.rating.toFixed(1)}/5`));
