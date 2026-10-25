/** Markdown for components/templates/ReviewTemplate. */
import type { ReviewData } from "@/lib/types";
import { amazonProductLink, withAmazonTag } from "@/lib/affiliate";
import { createSegmenter } from "@/lib/autolink";
import { guidesForReview, relatedReviewsFor, reviewHref, roundupsForReview } from "@/lib/links";
import { esc, h, link, quote, segments, table, type MdDoc } from "../format";
import * as a from "./article";

/** Same choice as the template's buy button. */
function buyLink(data: ReviewData) {
  const exact = data.asin ? amazonProductLink(data.productName, data.asin) : "";
  return exact.includes("/dp/") ? exact : withAmazonTag(data.affiliateUrl);
}

export function reviewDoc(data: ReviewData): MdDoc {
  const path = reviewHref(data.slug);
  const seg = createSegmenter(path, ["/reviews"]);
  const facts = [
    ["Price", data.price],
    ["Best For", data.bestFor],
    ["Category", data.category],
    ["Verdict", data.verdictLabel],
    ...data.quickFacts.map((f) => [f.label, f.value]),
  ];

  return {
    title: data.h1,
    summary: data.metaDescription,
    path,
    updated: data.updatedDate,
    blocks: [
      `${esc(data.category)} · ${esc(data.verdictLabel)}`,
      esc(data.dek),
      `**Rating:** ${data.rating.toFixed(1)}/5 (${data.reviewCount.toLocaleString("en-US")} reviews)  \n${esc(data.ratingBasis)}`,
      a.byline(data.updatedDate),
      a.takeaways(data.keyTakeaways),
      `${h(2, "At a Glance")}\n\n${table(["Fact", "Detail"], facts)}\n\n${link(`Check Price for ${data.productName}`, buyLink(data))}`,
      `${h(2, "Quick Overview")}\n\n${data.intro.map((p) => segments(seg(p))).join("\n\n")}`,
      `${h(2, "Pros & Cons at a Glance")}\n\n${a.prosCons(data.pros, data.cons)}`,
      !!data.ingredients?.length &&
        `${h(2, "Key Ingredients, Decoded")}\n\n${table(["Ingredient", "What it does"], data.ingredients.map((i) => [i.name, i.note]))}`,
      ...data.sections.map((s) => a.section(s, seg)),
      data.safetyNote && quote(`**Safety Note:** ${esc(data.safetyNote)}`),
      data.comparisonTable && `${h(2, `How ${data.productName} Compares`)}\n\n${a.comparison(data.comparisonTable)}`,
      a.faq(data.faq),
      a.bottomLine(data.bottomLine),
      data.guarantee && `Guarantee: ${esc(data.guarantee)}`,
    ],
    related: [
      { heading: "Compare the Alternatives", items: a.roundupItems(roundupsForReview(data)) },
      { heading: "Related Reviews", items: a.reviewItems(relatedReviewsFor(data)) },
      { heading: "Learn More", items: a.guideItems(guidesForReview(data)) },
    ],
  };
}
