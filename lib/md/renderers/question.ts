/** Markdown for components/templates/QuestionTemplate. */
import type { QuestionData } from "@/lib/types";
import { roundups } from "@/data/roundups";
import { amazonProductLink } from "@/lib/affiliate";
import { createSegmenter } from "@/lib/autolink";
import { questionHref, relatedQuestionsFor, relatedRoundupsForQuestion, roundupHref } from "@/lib/links";
import { esc, h, link, numbered, segments, type MdDoc } from "../format";
import * as a from "./article";

export function questionDoc(data: QuestionData): MdDoc {
  const path = questionHref(data.slug);
  const pillar = roundups.find((r) => r.slug === data.pillarSlug);
  if (!pillar) throw new Error(`Question ${data.slug} has no pillar roundup ${data.pillarSlug}`);
  const top = pillar.products[0];
  const seg = createSegmenter(path, ["/answers"]);
  const mid = Math.ceil(data.sections.length / 2);

  // components/roundup/PillarPicks
  const pillarPicks = [
    h(2, `Top Picks: ${pillar.crumb}`),
    numbered(
      pillar.products
        .slice(0, 3)
        .map((p) => `**${esc(p.badge)}:** ${esc(p.name)}, ${p.score.toFixed(1)}/5 (${link("check price", amazonProductLink(p.name, p.asin))})`),
    ),
    link(`See all ${pillar.products.length} picks in our ${pillar.crumb} guide`, roundupHref(pillar.slug)),
  ].join("\n\n");

  return {
    title: data.h1,
    summary: data.metaDescription,
    path,
    updated: data.updatedDate,
    blocks: [
      esc(data.hub),
      esc(data.dek),
      `${h(2, "The Short Answer")}\n\n${esc(data.shortAnswer)}`,
      pillarPicks,
      a.byline(data.updatedDate),
      a.commissionNote("How we research"),
      a.takeaways(data.keyTakeaways),
      data.intro.map((p) => segments(seg(p))).join("\n\n"),
      ...data.sections.slice(0, mid).map((s) => a.section(s, seg)),
      `**Our #1 pick for ${esc(pillar.crumb.replace(/^Best /, "").toLowerCase())}:** ${esc(top.name)}. ${esc(top.bottomLine)} (${link("check price", amazonProductLink(top.name, top.asin))})`,
      ...data.sections.slice(mid).map((s) => a.section(s, seg)),
      a.faq(data.faq),
      `${a.bottomLine(data.bottomLine)}\n\n${link(`See Our ${pillar.crumb} Picks`, roundupHref(pillar.slug))}`,
    ],
    related: [
      { heading: "Related Questions", items: a.questionItems(relatedQuestionsFor(data)) },
      { heading: "Buyer's Guides", items: a.roundupItems(relatedRoundupsForQuestion(data)) },
      { heading: "Learn More", items: a.guideItems(data.relatedGuides ?? []) },
    ],
  };
}
