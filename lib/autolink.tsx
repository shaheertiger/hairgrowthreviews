/**
 * Contextual in-text links.
 *
 * Article copy is plain strings, so instead of hand-editing hundreds of
 * paragraphs we match topic phrases ("saw palmetto", "Norwood scale") and link
 * the first mention on each page to the page that covers that topic.
 *
 * Rules per page: never link a page to itself, link each target at most once,
 * each phrase at most once, no more than 2 links per paragraph and
 * MAX_LINKS_PER_PAGE in total. A phrase can list fallback targets, used when
 * the first one is the current page or is already linked.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { reviewHref } from "@/lib/links";

interface Rule {
  /** Regex source, matched case-insensitively on word boundaries. */
  pattern: string;
  targets: string[];
}

const A = "['’]"; // straight or curly apostrophe

const rules: Rule[] = [
  // Treatments & ingredients
  { pattern: "minoxidil shedding|dread shed", targets: ["/minoxidil-shedding-how-long-does-it-last"] },
  { pattern: "minoxidil for women|women" + A + "s minoxidil", targets: ["/best-minoxidil-for-women", "/can-women-use-mens-minoxidil"] },
  { pattern: "men" + A + "s minoxidil|minoxidil for men", targets: ["/best-minoxidil-for-men", "/can-women-use-mens-minoxidil"] },
  { pattern: "minoxidil|rogaine", targets: ["/find-a-treatment/minoxidil-rogaine", "/best-minoxidil-for-men", "/how-long-does-minoxidil-take-to-work"] },
  { pattern: "finasteride|dutasteride", targets: ["/best-dht-blocker", "/find-a-treatment/minoxidil-rogaine"] },
  { pattern: "dht[- ]block(?:ing|er) shampoos?", targets: ["/best-dht-blocker-shampoo"] },
  { pattern: "dht blockers?", targets: ["/best-dht-blocker", "/does-saw-palmetto-block-dht"] },
  { pattern: "nizoral(?: a-d)?", targets: [reviewHref("nizoral-d-anti-dandruff-shampoo"), "/best-ketoconazole-shampoo"] },
  { pattern: "ketoconazole(?: shampoos?)?", targets: ["/best-ketoconazole-shampoo", "/can-you-use-minoxidil-and-ketoconazole-together"] },
  { pattern: "saw palmetto", targets: ["/best-saw-palmetto-for-hair-loss", "/does-saw-palmetto-block-dht"] },
  { pattern: "biotin", targets: ["/best-biotin-for-hair-growth", "/does-biotin-really-help-hair-growth"] },
  { pattern: "rosemary oil", targets: ["/best-rosemary-oil-for-hair-growth", "/does-rosemary-oil-really-grow-hair"] },
  { pattern: "pumpkin seed oil", targets: ["/best-pumpkin-seed-oil-for-hair-loss"] },
  { pattern: "castor oil", targets: ["/best-castor-oil-for-hair-growth"] },
  { pattern: "batana oil", targets: ["/best-batana-oil"] },
  { pattern: "collagen", targets: ["/best-collagen-for-hair-growth"] },
  { pattern: "ferritin|iron deficiency|low iron", targets: ["/can-low-iron-cause-hair-loss", "/best-iron-supplement-for-hair-loss"] },
  { pattern: "vitamin d deficiency|low vitamin d", targets: ["/can-vitamin-d-deficiency-cause-hair-loss", "/best-vitamin-d-supplement-for-hair-loss"] },
  { pattern: "vitamin d3?", targets: ["/best-vitamin-d-supplement-for-hair-loss", "/can-vitamin-d-deficiency-cause-hair-loss"] },
  { pattern: "hair (?:growth )?(?:vitamins|supplements?)", targets: ["/best-hair-growth-vitamins", "/find-a-treatment/supplements"] },
  { pattern: "laser caps?|laser helmets?|low-level laser(?: therapy)?|lllt|red light therapy", targets: ["/best-laser-cap-for-hair-growth", "/do-laser-caps-actually-work"] },
  { pattern: "derma ?roll(?:er|ers|ing)?|microneedling", targets: ["/best-derma-roller-for-hair-growth", "/how-often-should-you-derma-roll-your-scalp"] },
  { pattern: "scalp reduction", targets: ["/find-a-treatment/scalp-reduction"] },
  { pattern: "hgr regimen", targets: ["/the-hgr-regimen"] },

  // Causes & biology
  { pattern: "telogen effluvium|stress(?:-related)? hair loss", targets: ["/can-stress-cause-hair-loss", "/about-hair-growth/hair-loss-cycle"] },
  { pattern: "hair growth cycle|hair loss cycle|anagen", targets: ["/about-hair-growth/hair-loss-cycle"] },
  { pattern: "norwood(?: scale)?|ludwig(?: scale)?|stages of hair loss", targets: ["/about-hair-growth/stages-hair-loss"] },
  { pattern: "androgenetic alopecia|male[- ]pattern baldness|female[- ]pattern hair loss", targets: ["/about-hair-growth/stages-hair-loss", "/about-hair-growth/hair-growth-encyclopedia"] },
  { pattern: "postpartum (?:hair loss|shedding)", targets: ["/how-long-does-postpartum-hair-loss-last", "/best-postpartum-hair-loss-products"] },
  { pattern: "seborrheic dermatitis", targets: ["/does-dandruff-cause-hair-loss", "/best-dandruff-shampoo"] },
  { pattern: "(?:anti-)?dandruff shampoos?", targets: ["/best-dandruff-shampoo", "/does-dandruff-cause-hair-loss"] },
  { pattern: "dandruff", targets: ["/does-dandruff-cause-hair-loss", "/best-dandruff-shampoo"] },
  { pattern: "hard water", targets: ["/does-hard-water-cause-hair-loss", "/best-shower-filter-for-hair"] },
  { pattern: "heat styling", targets: ["/does-heat-styling-cause-hair-loss", "/best-heat-protectant-spray"] },
  { pattern: "(?:normal|daily) shedding|hairs (?:a|per) day", targets: ["/how-much-hair-loss-is-normal-per-day"] },

  // Hair care
  { pattern: "hair growth products", targets: ["/best-hair-growth-products"] },
  { pattern: "hair growth serums?", targets: ["/best-hair-growth-serum"] },
  { pattern: "hair growth shampoos?", targets: ["/best-hair-growth-shampoo"] },
  { pattern: "hair growth oils?", targets: ["/best-hair-growth-oil"] },
  { pattern: "shampoos? for thinning hair", targets: ["/best-shampoo-for-thinning-hair"] },
  { pattern: "conditioners? for thinning hair", targets: ["/best-conditioner-for-thinning-hair"] },
  { pattern: "thickening (?:shampoos?|sprays?|products?)", targets: ["/best-hair-thickening-products"] },
  { pattern: "caffeine shampoos?", targets: [reviewHref("ultrax-labs-hair-surge-caffeine-hair-loss-hair-growth-stimulating-shampoo"), "/best-hair-growth-shampoo"] },
  { pattern: "hair (?:building )?fibers", targets: ["/best-hair-fibers-for-thinning-hair", "/do-hair-fibers-cause-hair-loss"] },
  { pattern: "hair toppers?", targets: ["/best-hair-topper-for-thinning-hair"] },
  { pattern: "wigs?", targets: ["/best-wig-for-women-with-hair-loss"] },
  { pattern: "dry shampoos?", targets: ["/best-dry-shampoo", "/does-dry-shampoo-cause-hair-loss"] },
  { pattern: "clarifying shampoos?", targets: ["/best-clarifying-shampoo"] },
  { pattern: "purple shampoos?", targets: ["/best-purple-shampoo"] },
  { pattern: "sulfate-free shampoos?", targets: ["/best-sulfate-free-shampoo"] },
  { pattern: "leave-in conditioners?", targets: ["/best-leave-in-conditioner"] },
  { pattern: "heat protectants?(?: sprays?)?", targets: ["/best-heat-protectant-spray", "/does-heat-styling-cause-hair-loss"] },
  { pattern: "anti-frizz serums?|frizz serums?", targets: ["/best-anti-frizz-serum"] },
  { pattern: "hair ?sprays?", targets: ["/best-hair-spray"] },
  { pattern: "silk pillowcases?", targets: ["/best-silk-pillowcase-for-hair"] },
  { pattern: "scalp massagers?|scalp massage", targets: ["/best-scalp-massager"] },
  { pattern: "scalp scrubs?", targets: ["/best-scalp-scrub"] },
  { pattern: "shower filters?", targets: ["/best-shower-filter-for-hair"] },
  { pattern: "curly hair", targets: ["/best-hair-products-for-curly-hair"] },
  { pattern: "colou?r-treated hair", targets: ["/best-shampoo-for-color-treated-hair"] },
  { pattern: "oily (?:hair|scalps?)", targets: ["/best-shampoo-for-oily-hair"] },
  { pattern: "itchy scalps?", targets: ["/best-shampoo-for-itchy-scalp"] },
  { pattern: "damaged hair", targets: ["/best-hair-treatment-for-damaged-hair"] },
  { pattern: "at-home (?:hair )?colou?r|box dye", targets: ["/best-at-home-hair-color"] },

  // Tools & grooming
  { pattern: "dyson airwrap|airwrap", targets: ["/best-dyson-airwrap-alternative"] },
  { pattern: "dyson supersonic|supersonic", targets: ["/best-dyson-supersonic-alternative"] },
  { pattern: "(?:hair )?dryer brush(?:es)?|blowout brush(?:es)?", targets: ["/best-hair-dryer-brush"] },
  { pattern: "hair dryers?|blow[- ]?dryers?", targets: ["/best-hair-dryer"] },
  { pattern: "flat irons?", targets: ["/best-flat-iron"] },
  { pattern: "curling irons?|curling wands?", targets: ["/best-curling-iron"] },
  { pattern: "straightening brush(?:es)?", targets: ["/best-hair-straightening-brush"] },
  { pattern: "heated rollers", targets: ["/best-heated-rollers"] },
  { pattern: "beard (?:growth )?oils?", targets: ["/best-beard-growth-oil", "/best-beard-growth-products"] },
  { pattern: "beard trimmers?", targets: ["/best-beard-trimmer"] },
  { pattern: "hair clippers", targets: ["/best-hair-clippers"] },
  { pattern: "head shavers?", targets: ["/best-head-shaver"] },
  { pattern: "electric shavers?|foil shavers?", targets: ["/best-electric-shaver-for-men"] },
  { pattern: "nose hair trimmers?", targets: ["/best-nose-hair-trimmer"] },
  { pattern: "body groomers?", targets: ["/best-body-groomer-for-men"] },
  { pattern: "beard dye|hair dye for men|just for men", targets: ["/best-hair-dye-for-men"] },
  { pattern: "(?:eye)?lash (?:growth )?serums?", targets: ["/best-eyelash-growth-serum"] },
  { pattern: "(?:eye)?brow (?:growth )?serums?", targets: ["/best-eyebrow-growth-serum"] },

  // Products we've reviewed
  { pattern: "viviscal", targets: [reviewHref("viviscal-extra-strength-hair-nutrient-tablets")] },
  { pattern: "revivogen", targets: [reviewHref("revivogen-scalp-therapy-formula")] },
  { pattern: "biotopic", targets: [reviewHref("biotopic-premium-hair-regrowth-serum")] },
  { pattern: "amplixin", targets: [reviewHref("amplixin-intensive-hair-growth-serum")] },
  { pattern: "crinagen", targets: [reviewHref("crinagen")] },
  { pattern: "nunutrients", targets: [reviewHref("nunutrients-advanced-hair-regrowth-treatment")] },
  { pattern: "pura d" + A + "or", targets: [reviewHref("pura-dor-hair-loss-prevention-therapy-premium-organic-argan-oil-shampoo")] },
  { pattern: "aveda invati|invati", targets: [reviewHref("aveda-invati-scalp-revitalizer")] },
  { pattern: "mane " + A + "?n" + A + "? tail", targets: [reviewHref("mane-n-tail-shampoo")] },
  { pattern: "(?:ultrax(?: labs)? )?hair surge", targets: [reviewHref("ultrax-labs-hair-surge-caffeine-hair-loss-hair-growth-stimulating-shampoo")] },
  { pattern: "(?:ultrax(?: labs)? )?hair lush", targets: [reviewHref("ultrax-labs-hair-lush")] },
  { pattern: "hydrobrush", targets: [reviewHref("hydrobrush")] },
  { pattern: "murad", targets: [reviewHref("murad-hair-growth-scalp-serum")] },
];

const compiled = rules.map((r) => ({ ...r, re: new RegExp(`(?<![\\w-])(?:${r.pattern})(?![\\w-])`, "i") }));

export const MAX_LINKS_PER_PAGE = 12;
const MAX_LINKS_PER_PARAGRAPH = 2;

export type Linkify = (text: string) => ReactNode;

/** Every link target the rules can produce, so a check can confirm each one exists. */
export const autolinkTargets = [...new Set(rules.flatMap((r) => r.targets))];

/**
 * Make a linker for one page. Call it on paragraphs in reading order: the
 * first mention of a topic gets the link. `skip` lists hrefs the page already
 * links prominently (its pillar guide, breadcrumb parents) that shouldn't
 * also be linked in the text.
 */
export function createLinker(self: string, skip: string[] = []): Linkify {
  const usedTargets = new Set<string>([self, ...skip]);
  const usedRules = new Set<number>();
  let total = 0;
  let key = 0;

  return function linkify(text: string): ReactNode {
    const out: ReactNode[] = [];
    let rest = text;
    let inParagraph = 0;

    while (total < MAX_LINKS_PER_PAGE && inParagraph < MAX_LINKS_PER_PARAGRAPH) {
      let best: { index: number; length: number; href: string; rule: number } | null = null;
      compiled.forEach((rule, i) => {
        if (usedRules.has(i)) return;
        const href = rule.targets.find((t) => !usedTargets.has(t));
        if (!href) return;
        const m = rule.re.exec(rest);
        if (!m) return;
        if (!best || m.index < best.index || (m.index === best.index && m[0].length > best.length))
          best = { index: m.index, length: m[0].length, href, rule: i };
      });
      if (!best) break;
      const { index, length, href, rule } = best;
      out.push(
        rest.slice(0, index),
        <Link key={`al${key++}`} href={href}>
          {rest.slice(index, index + length)}
        </Link>,
      );
      rest = rest.slice(index + length);
      usedRules.add(rule);
      usedTargets.add(href);
      total++;
      inParagraph++;
    }

    if (out.length === 0) return text;
    out.push(rest);
    return out;
  };
}
