/** Markdown for components/templates/RoundupTemplate. */
import type { RoundupData, RoundupProduct } from "@/lib/types";
import { amazonProductLink } from "@/lib/affiliate";
import { createSegmenter } from "@/lib/autolink";
import { questionsForRoundup, relatedGuidesForRoundup, relatedRoundupsFor, reviewsForRoundup, roundupHref } from "@/lib/links";
import { esc, h, link, numbered, segments, table, type MdDoc } from "../format";
import * as a from "./article";

function monthYear(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** components/roundup/QuickPicks */
const quickPicks = (data: RoundupData) =>
  `${h(2, "Our Picks at a Glance")}\n\n${numbered(
    data.products.map(
      (p) => `**${esc(p.badge)}:** ${link(p.name, `${roundupHref(data.slug)}#${p.id}`)} (${link("check price", amazonProductLink(p.name, p.asin))})`,
    ),
  )}`;

/** components/roundup/ProductCard */
function productCard(p: RoundupProduct, rank: number): string {
  return [
    h(3, `${rank}. ${p.name}`),
    `**${esc(p.badge)}** · ${esc(p.category)}  \n**Our score:** ${p.score.toFixed(1)}/5  \n**Best for:** ${esc(p.bestFor)}`,
    table(["Spec", "Value"], p.keySpecs.map((s) => [s.label, s.value])),
    link("Check Price on Amazon", amazonProductLink(p.name, p.asin)),
    ...p.description.map(esc),
    a.prosCons(p.pros, p.cons, 4),
    `**The Bottom Line:** ${esc(p.bottomLine)}`,
  ].join("\n\n");
}

export function roundupDoc(data: RoundupData): MdDoc {
  const path = roundupHref(data.slug);
  const seg = createSegmenter(path, ["/best"]);
  const before = data.sections.slice(0, data.picksAfter);
  const after = data.sections.slice(data.picksAfter);

  return {
    title: data.h1,
    summary: data.metaDescription,
    path,
    updated: data.updatedDate,
    blocks: [
      `Buyer's Guide · Updated ${monthYear(data.updatedDate)}`,
      esc(data.dek),
      a.byline(data.updatedDate),
      a.commissionNote("How we rank"),
      quickPicks(data),
      a.takeaways(data.keyTakeaways),
      `${h(2, "Overview")}\n\n${data.intro.map((p) => segments(seg(p))).join("\n\n")}`,
      ...before.map((s) => a.section(s, seg)),
      [h(2, data.picksHeading), esc(data.picksIntro), ...data.products.map((p, i) => productCard(p, i + 1))].join("\n\n"),
      ...after.map((s) => a.section(s, seg)),
      data.comparisonTable && `${h(2, "Compared Side by Side")}\n\n${a.comparison(data.comparisonTable, "Product")}`,
      [h(2, "Common Mistakes to Avoid"), ...data.mistakes.map((m) => `${h(3, m.heading)}\n\n${esc(m.body)}`)].join("\n\n"),
      a.faq(data.faq),
      a.bottomLine(data.bottomLine),
    ],
    related: [
      { heading: "Common Questions, Answered", items: a.questionItems(questionsForRoundup(data)) },
      { heading: "More Buyer's Guides", items: a.roundupItems(relatedRoundupsFor(data)) },
      { heading: "Learn More First", items: a.guideItems(relatedGuidesForRoundup(data)) },
      { heading: "In-Depth Product Reviews", items: a.reviewItems(reviewsForRoundup(data)) },
    ],
  };
}
