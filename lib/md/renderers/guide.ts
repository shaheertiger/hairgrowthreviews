/** Markdown for components/templates/GuideTemplate and components/GuideHub. */
import type { GuideData } from "@/lib/types";
import { guides } from "@/data/guides";
import { reviews } from "@/data/reviews";
import { createSegmenter } from "@/lib/autolink";
import {
  guideHref,
  guideSectionHref,
  guideSectionLabels,
  questionsForGuide,
  relatedGuidesForGuide,
  roundupsForGuide,
  roundupsForGuideSection,
} from "@/lib/links";
import { esc, h, item, segments, table, type MdDoc } from "../format";
import * as a from "./article";

export function guideDoc(data: GuideData): MdDoc {
  const path = guideHref(data);
  const seg = createSegmenter(path, [guideSectionHref[data.section]]);
  const relatedReviews = (data.relatedReviewSlugs ?? [])
    .map((s) => reviews.find((r) => r.slug === s))
    .filter((r): r is NonNullable<typeof r> => !!r);

  return {
    title: data.h1,
    summary: data.metaDescription,
    path,
    updated: data.updatedDate,
    blocks: [
      esc(guideSectionLabels[data.section]),
      esc(data.dek),
      a.byline(data.updatedDate),
      a.takeaways(data.keyTakeaways),
      !!data.quickFacts?.length && table(["Fact", "Value"], data.quickFacts.map((f) => [f.label, f.value])),
      `${h(2, "Overview")}\n\n${data.intro.map((p) => segments(seg(p))).join("\n\n")}`,
      ...data.sections.map((s) => a.section(s, seg)),
      data.comparisonTable &&
        `${h(2, data.comparisonTableTitle ?? "Compared Side by Side")}\n\n${a.comparison(data.comparisonTable)}`,
      a.faq(data.faq),
      a.bottomLine(data.bottomLine),
    ],
    related: [
      { heading: "Our Buyer's Guides on This Topic", items: a.roundupItems(roundupsForGuide(data)) },
      { heading: "Common Questions, Answered", items: a.questionItems(questionsForGuide(data)) },
      { heading: "Keep Reading", items: a.guideItems(relatedGuidesForGuide(data)) },
      { heading: "Related Reviews", items: a.reviewItems(relatedReviews) },
    ],
  };
}

/** components/GuideHub: the section index (/find-a-treatment, /about-hair-growth). */
export function guideHubDoc(
  section: GuideData["section"],
  { description, intro }: { description: string; intro: string },
): MdDoc {
  const items = guides.filter((g) => g.section === section);
  return {
    title: guideSectionLabels[section],
    summary: description,
    path: guideSectionHref[section],
    blocks: [esc(intro), `${h(2, "Guides")}\n\n${items.map((g) => item(g.h1, guideHref(g), g.dek)).join("\n")}`],
    related: [{ heading: "Related Buyer's Guides", items: a.roundupItems(roundupsForGuideSection(section)) }],
  };
}
