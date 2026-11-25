/**
 * Contextual in-text links.
 *
 * Article copy is plain strings, so instead of hand-editing hundreds of
 * paragraphs we match topic phrases ("saw palmetto", "Norwood scale") and link
 * the first mention on each page to the page that covers that topic.
 *
 * Rules per page: never link a page to itself, link each target at most once,
 * each phrase at most once, no more than 2 links per paragraph (3 in long
 * paragraphs) and MAX_LINKS_PER_PAGE in total. A phrase can list fallback targets, used when
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
  { pattern: "minoxidil foam (?:vs\\.?|versus) (?:liquid|solution)|foam (?:vs\\.?|versus) liquid", targets: ["/minoxidil-foam-vs-liquid"] },
  { pattern: "(?:5% )?minoxidil foams?|rogaine foams?", targets: ["/best-minoxidil-foam", "/minoxidil-foam-vs-liquid"] },
  { pattern: "minoxidil shedding|dread shed", targets: ["/minoxidil-shedding-how-long-does-it-last"] },
  { pattern: "oral minoxidil|minoxidil (?:pills?|tablets?)|low[- ]dose (?:oral )?minoxidil", targets: ["/does-oral-minoxidil-work"] },
  { pattern: "stop(?:ping|s)? (?:using )?minoxidil|quit(?:ting)? minoxidil|come off minoxidil", targets: ["/what-happens-if-you-stop-using-minoxidil"] },
  { pattern: "minoxidil (?:for|on) (?:the |your )?beard|beard minoxidil|minoxidil beard", targets: ["/does-minoxidil-work-for-beard-growth"] },
  { pattern: "minoxidil for women|women" + A + "s minoxidil", targets: ["/best-minoxidil-for-women", "/can-women-use-mens-minoxidil"] },
  { pattern: "men" + A + "s minoxidil|minoxidil for men", targets: ["/best-minoxidil-for-men", "/can-women-use-mens-minoxidil"] },
  { pattern: "generic minoxidil|kirkland(?: signature)? minoxidil|rogaine vs\\.? minoxidil|rogaine (?:is )?the same as minoxidil", targets: ["/is-rogaine-the-same-as-minoxidil"] },
  { pattern: "minoxidil costs?|cost of minoxidil|price of minoxidil", targets: ["/how-much-does-minoxidil-cost"] },
  { pattern: "rosemary oil (?:vs\\.?|versus) minoxidil|minoxidil (?:vs\\.?|versus) rosemary(?: oil)?", targets: ["/rosemary-oil-vs-minoxidil"] },
  { pattern: "how minoxidil works|minoxidil sulfate", targets: ["/how-does-minoxidil-work"] },
  { pattern: "minoxidil|rogaine", targets: ["/find-a-treatment/minoxidil-rogaine", "/best-minoxidil-for-men", "/how-long-does-minoxidil-take-to-work"] },
  { pattern: "finasteride|dutasteride", targets: ["/best-dht-blocker", "/find-a-treatment/minoxidil-rogaine"] },
  { pattern: "dht[- ]block(?:ing|er) shampoos?", targets: ["/best-dht-blocker-shampoo", "/do-dht-blocker-shampoos-work"] },
  { pattern: "dht blockers?", targets: ["/best-dht-blocker", "/does-saw-palmetto-block-dht"] },
  { pattern: "nizoral(?: a-d)?", targets: [reviewHref("nizoral-d-anti-dandruff-shampoo"), "/best-ketoconazole-shampoo"] },
  { pattern: "ketoconazole(?: shampoos?)?", targets: ["/best-ketoconazole-shampoo", "/does-ketoconazole-shampoo-help-hair-loss", "/can-you-use-minoxidil-and-ketoconazole-together"] },
  { pattern: "saw palmetto (?:shampoos?|sprays?)", targets: ["/best-saw-palmetto-shampoo"] },
  { pattern: "saw palmetto", targets: ["/best-saw-palmetto-for-hair-loss", "/does-saw-palmetto-block-dht"] },
  { pattern: "how much biotin", targets: ["/how-much-biotin-should-i-take-for-hair-growth"] },
  { pattern: "biotin", targets: ["/best-biotin-for-hair-growth", "/does-biotin-really-help-hair-growth", "/how-much-biotin-should-i-take-for-hair-growth"] },
  { pattern: "how to use rosemary oil|rosemary water|infused rosemary oil", targets: ["/how-to-use-rosemary-oil-for-hair-growth"] },
  { pattern: "rosemary oil", targets: ["/best-rosemary-oil-for-hair-growth", "/does-rosemary-oil-really-grow-hair", "/how-to-use-rosemary-oil-for-hair-growth", "/rosemary-oil-vs-minoxidil"] },
  { pattern: "pumpkin seed oil (?:vs\\.?|versus|or) saw palmetto|saw palmetto (?:vs\\.?|versus|or) pumpkin seed oil", targets: ["/pumpkin-seed-oil-vs-saw-palmetto"] },
  { pattern: "pumpkin seed oil (?:vs\\.?|versus|or) rosemary oil|rosemary oil (?:vs\\.?|versus|or) pumpkin seed oil", targets: ["/pumpkin-seed-oil-vs-rosemary-oil"] },
  { pattern: "how much pumpkin seed oil|pumpkin seed oil (?:dose|dosage)", targets: ["/how-much-pumpkin-seed-oil-should-i-take-for-hair-loss"] },
  { pattern: "pumpkin seed oil (?:capsules|softgels)", targets: ["/best-pumpkin-seed-oil-capsules-for-hair-loss"] },
  { pattern: "how to use pumpkin seed oil", targets: ["/how-to-use-pumpkin-seed-oil-for-hair"] },
  { pattern: "pumpkin seed oil", targets: ["/best-pumpkin-seed-oil-for-hair-loss", "/does-pumpkin-seed-oil-help-hair-loss", "/how-to-use-pumpkin-seed-oil-for-hair", "/how-much-pumpkin-seed-oil-should-i-take-for-hair-loss"] },
  { pattern: "how to use castor oil", targets: ["/how-to-use-castor-oil-for-hair-growth"] },
  { pattern: "castor oil", targets: ["/best-castor-oil-for-hair-growth", "/does-castor-oil-grow-hair", "/how-to-use-castor-oil-for-hair-growth"] },
  { pattern: "batana oil (?:vs\\.?|versus|or) castor oil|castor oil (?:vs\\.?|versus|or) batana(?: oil)?", targets: ["/batana-oil-vs-castor-oil"] },
  { pattern: "batana oil (?:vs\\.?|versus|or) rosemary oil|rosemary oil (?:vs\\.?|versus|or) batana(?: oil)?", targets: ["/batana-oil-vs-rosemary-oil"] },
  { pattern: "batana oil darken(?:s|ing)?(?: hair)?|darken(?:s|ing)? (?:your |gray )?hair", targets: ["/does-batana-oil-darken-hair"] },
  { pattern: "batana (?:oil )?(?:shampoos?|conditioners?)|batana hair products", targets: ["/best-batana-oil-shampoo-and-conditioner"] },
  { pattern: "batana oil reviews|batana (?:oil )?brands", targets: ["/batana-oil-reviews", "/how-to-tell-if-batana-oil-is-real"] },
  { pattern: "how long (?:does )?batana oil (?:takes?|to work)|batana oil timeline", targets: ["/how-long-does-batana-oil-take-to-work"] },
  { pattern: "batana oil side effects|side effects of batana oil", targets: ["/batana-oil-side-effects"] },
  { pattern: "how to use batana oil", targets: ["/how-to-use-batana-oil-for-hair-growth"] },
  { pattern: "does batana oil (?:really )?(?:grow hair|work)", targets: ["/does-batana-oil-grow-hair"] },
  { pattern: "(?:pure|raw|real|authentic) batana(?: oil)?|fake batana(?: oil)?|(?:how to tell )?if batana oil is real", targets: ["/how-to-tell-if-batana-oil-is-real"] },
  { pattern: "batana oil", targets: ["/best-batana-oil", "/does-batana-oil-grow-hair", "/what-is-batana-oil", "/how-to-use-batana-oil-for-hair-growth", "/batana-oil-reviews", "/how-long-does-batana-oil-take-to-work", "/batana-oil-side-effects"] },
  { pattern: "rosemary(?: mint)? shampoos?", targets: ["/best-rosemary-shampoo-for-hair-growth"] },
  { pattern: "essential oils", targets: ["/best-essential-oils-for-hair-growth"] },
  { pattern: "argan oil", targets: ["/best-argan-oil-for-hair", "/how-to-use-argan-oil-for-hair"] },
  { pattern: "coconut oil", targets: ["/best-coconut-oil-for-hair", "/is-coconut-oil-good-for-your-hair"] },
  { pattern: "(?:extra virgin )?olive oil", targets: ["/is-olive-oil-good-for-your-hair"] },
  { pattern: "tea tree(?: oil)?", targets: ["/does-tea-tree-oil-help-hair-growth"] },
  { pattern: "jojoba oil", targets: ["/best-jojoba-oil-for-hair"] },
  { pattern: "collagen", targets: ["/best-collagen-for-hair-growth", "/does-collagen-help-hair-growth"] },
  { pattern: "ferritin|iron deficiency|low iron", targets: ["/can-low-iron-cause-hair-loss", "/best-iron-supplement-for-hair-loss"] },
  { pattern: "vitamin d deficiency|low vitamin d", targets: ["/can-vitamin-d-deficiency-cause-hair-loss", "/best-vitamin-d-supplement-for-hair-loss"] },
  { pattern: "vitamin d3?", targets: ["/best-vitamin-d-supplement-for-hair-loss", "/can-vitamin-d-deficiency-cause-hair-loss", "/how-much-vitamin-d-should-i-take-for-hair-loss"] },
  { pattern: "hair (?:growth )?(?:vitamins|supplements?)", targets: ["/best-hair-growth-vitamins", "/find-a-treatment/supplements"] },
  { pattern: "red light therapy|red light (?:caps?|devices?|helmets?)|led caps?", targets: ["/best-red-light-therapy-for-hair-growth", "/best-laser-cap-for-hair-growth"] },
  { pattern: "laser caps?|laser helmets?|low-level laser(?: therapy)?|lllt", targets: ["/best-laser-cap-for-hair-growth", "/do-laser-caps-actually-work"] },
  { pattern: "prenatal vitamins?|prenatals", targets: ["/best-prenatal-vitamins-for-hair-growth", "/do-prenatal-vitamins-help-hair-growth"] },
  { pattern: "(?:vitamin|nutrient|nutritional) deficienc(?:y|ies)", targets: ["/which-vitamin-deficiency-causes-hair-loss"] },
  { pattern: "creatine", targets: ["/does-creatine-cause-hair-loss"] },
  { pattern: "masturbation|ejaculation", targets: ["/can-masturbation-cause-hair-loss"] },
  { pattern: "shaving (?:makes?|making) (?:hair|it) (?:grow )?(?:back )?thicker|hair grows? back thicker|regrows? thicker", targets: ["/does-shaving-make-hair-grow-back-thicker"] },
  { pattern: "(?:hair (?:to )?)?grow(?:s|ing)? back (?:after|once|in)|regrowth timeline|hair to grow back", targets: ["/how-long-does-it-take-for-hair-to-grow-back"] },
  { pattern: "glp-1s?(?: (?:drugs?|medications?|agonists?))?|ozempic|wegovy|mounjaro|zepbound|semaglutide|tirzepatide", targets: ["/does-glp-1-cause-hair-loss"] },
  { pattern: "breastfeeding|while nursing|nursing mothers?", targets: ["/hair-loss-treatments-safe-while-breastfeeding"] },
  { pattern: "(?:after|over) (?:age )?60|in your (?:60s|sixties)|age-related (?:hair loss|thinning)", targets: ["/can-you-regrow-hair-after-60"] },
  { pattern: "wearing (?:a )?(?:hats?|caps?|helmets?)", targets: ["/does-wearing-a-hat-cause-hair-loss"] },
  { pattern: "testosterone replacement(?: therapy)?|trt|high testosterone|low testosterone", targets: ["/does-testosterone-cause-hair-loss"] },
  { pattern: "prevent(?:ing)? hair loss", targets: ["/how-to-prevent-hair-loss"] },
  { pattern: "head (?:&|and) shoulders", targets: ["/nizoral-vs-head-and-shoulders", "/does-head-and-shoulders-cause-hair-loss"] },
  { pattern: "hair,? skin,? (?:and|&) nails", targets: ["/best-hair-skin-and-nails-supplement"] },
  { pattern: "derma ?roll(?:er|ers|ing)?|microneedling", targets: ["/best-derma-roller-for-hair-growth", "/how-often-should-you-derma-roll-your-scalp"] },
  { pattern: "scalp reduction", targets: ["/find-a-treatment/scalp-reduction"] },
  { pattern: "(?:make|help) (?:your )?hair grow faster|grow (?:your )?hair faster", targets: ["/how-to-make-your-hair-grow-faster"] },
  { pattern: "hair oiling|oil(?:ing)? your hair", targets: ["/how-often-should-you-oil-your-hair"] },
  { pattern: "brushing (?:your )?hair", targets: ["/does-brushing-your-hair-cause-hair-loss"] },
  { pattern: "hgr regimen", targets: ["/the-hgr-regimen"] },

  // Causes & biology
  { pattern: "telogen effluvium|stress(?:-related)? hair loss", targets: ["/can-stress-cause-hair-loss", "/about-hair-growth/hair-loss-cycle"] },
  { pattern: "hair growth cycle|hair loss cycle|anagen", targets: ["/about-hair-growth/hair-loss-cycle"] },
  { pattern: "norwood(?: scale)?|ludwig(?: scale)?|stages of hair loss", targets: ["/about-hair-growth/stages-hair-loss"] },
  { pattern: "androgenetic alopecia|male[- ]pattern baldness|female[- ]pattern hair loss", targets: ["/about-hair-growth/stages-hair-loss", "/about-hair-growth/hair-growth-encyclopedia"] },
  { pattern: "postpartum (?:hair loss|shedding)", targets: ["/how-long-does-postpartum-hair-loss-last", "/best-postpartum-hair-loss-products"] },
  { pattern: "seborrheic dermatitis", targets: ["/does-dandruff-cause-hair-loss", "/best-dandruff-shampoo"] },
  { pattern: "dandruff shampoos? for colou?r[- ]treated hair", targets: ["/best-dandruff-shampoo-for-color-treated-hair"] },
  { pattern: "(?:anti-)?dandruff shampoos?", targets: ["/best-dandruff-shampoo", "/does-dandruff-cause-hair-loss"] },
  { pattern: "dandruff", targets: ["/does-dandruff-cause-hair-loss", "/best-dandruff-shampoo"] },
  { pattern: "hard water", targets: ["/does-hard-water-cause-hair-loss", "/best-shower-filter-for-hair"] },
  { pattern: "heat styling", targets: ["/does-heat-styling-cause-hair-loss", "/best-heat-protectant-spray"] },
  { pattern: "(?:normal|daily) shedding|hairs (?:a|per) day", targets: ["/how-much-hair-loss-is-normal-per-day"] },

  // Hair care
  { pattern: "hair (?:growth|loss) products for men|men" + A + "s hair (?:growth|loss) products", targets: ["/best-hair-growth-products-for-men"] },
  { pattern: "hair (?:growth|loss) products for women|women" + A + "s hair (?:growth|loss) products|women" + A + "s hair loss|hair loss in women", targets: ["/best-hair-growth-products-for-women"] },
  { pattern: "hair growth products", targets: ["/best-hair-growth-products"] },
  { pattern: "hair products for men|men" + A + "s (?:hair|styling) products", targets: ["/best-hair-products-for-men"] },
  { pattern: "shampoos? for men|men" + A + "s shampoos?", targets: ["/best-shampoo-for-men"] },
  { pattern: "hair ?care products for women|women" + A + "s hair ?care(?: products| routines?)?", targets: ["/best-hair-care-products-for-women"] },
  { pattern: "black hair care(?: products)?|natural hair care|textured hair care|protective styl(?:es?|ing)", targets: ["/best-black-hair-care-products"] },
  { pattern: "(?:hair ?)?brush(?:es)? for (?:fine,? )?thinning hair|soft[- ]bristle(?:d)? brush(?:es)?|gentle (?:hair ?)?brush(?:es)?", targets: ["/best-hair-brush-for-thinning-hair"] },
  { pattern: "(?:shampoos?|conditioners?|shampoo and conditioner) for (?:thin|fine) hair|volumi[sz]ing (?:shampoos?|conditioners?)", targets: ["/best-shampoo-and-conditioner-for-thin-hair"] },
  { pattern: "boar[- ]bristle brush(?:es)?", targets: ["/best-boar-bristle-hair-brush"] },
  { pattern: "curly[- ]hair shampoos?|shampoos? for curly hair|curl shampoos?", targets: ["/best-shampoo-for-curly-hair"] },
  { pattern: "conditioners? for curly hair|curl conditioners?", targets: ["/best-conditioner-for-curly-hair"] },
  { pattern: "curl creams?|curling creams?", targets: ["/best-curl-cream-for-curly-hair"] },
  { pattern: "curl(?: defining)? mousses?|mousses? for curly hair|curl foams?", targets: ["/best-mousse-for-curly-hair"] },
  { pattern: "(?:flat irons?|straighteners?) for thick hair|thick, coarse hair", targets: ["/best-hair-straightener-for-thick-hair"] },
  { pattern: "texture sprays?|texturizing sprays?|root lifters?", targets: ["/best-texture-spray-for-fine-hair"] },
  { pattern: "low[- ]porosity shampoos?", targets: ["/best-shampoo-for-low-porosity-hair"] },
  { pattern: "halo (?:hair )?extensions?|clip-in extensions?|tape-in extensions?", targets: ["/best-halo-hair-extensions"] },
  { pattern: "hair (?:cutting )?shears|haircutting shears|thinning shears", targets: ["/best-hair-cutting-shears"] },
  { pattern: "edge control", targets: ["/best-edge-control-for-4c-hair"] },
  { pattern: "(?:curl|curly hair) oils?|hair oils? for curly hair", targets: ["/best-hair-oil-for-curly-hair"] },
  { pattern: "hot oil (?:hair )?treatments?", targets: ["/best-hot-oil-treatment-for-hair"] },
  { pattern: "(?:hair )?oils? for dry(?:,? and frizzy|,? frizzy)? hair|dry hair oils?", targets: ["/best-hair-oil-for-dry-hair"] },
  { pattern: "(?:hair )?oils? for frizz(?:y hair)?|anti-frizz (?:hair )?oils?", targets: ["/best-hair-oil-for-frizzy-hair"] },
  { pattern: "(?:hair )?oils? for fine hair|lightweight hair oils?", targets: ["/best-hair-oil-for-fine-hair"] },
  { pattern: "detangl(?:e|ing) (?:your )?hair with oils?|(?:olive |coconut )?oil to detangle(?: hair)?|detangling oils?|oils? for detangling(?: hair)?|(?:hair )?oils? for matted hair|matted hair", targets: ["/how-to-detangle-hair-with-oil"] },
  { pattern: "hair breakage|prevent(?:ing)? breakage", targets: ["/how-to-prevent-hair-breakage"] },
  { pattern: "zepbound|tirzepatide", targets: ["/does-zepbound-cause-hair-loss"] },
  { pattern: "low porosity hair", targets: ["/what-is-low-porosity-hair"] },
  { pattern: "high porosity hair", targets: ["/what-is-high-porosity-hair"] },
  { pattern: "hair grafts?|FUE|follicular unit extraction", targets: ["/how-do-hair-grafts-work"] },
  { pattern: "hair transplant(?:s|ation)? (?:costs?|prices?)|cost of a hair transplant", targets: ["/how-much-does-a-hair-transplant-cost"] },
  { pattern: "hair transplants?", targets: ["/is-a-hair-transplant-permanent"] },
  { pattern: "(?:make|get) (?:your )?hair thicker|thicker hair", targets: ["/how-to-make-hair-thicker"] },
  { pattern: "how often (?:to|should you) wash(?: your)? hair|wash(?:ing)? (?:your )?hair (?:every ?day|daily)", targets: ["/how-often-should-you-wash-your-hair"] },
  { pattern: "sleep(?:ing)? (?:on|with) wet hair", targets: ["/is-it-bad-to-sleep-with-wet-hair"] },
  { pattern: "oily hair|greasy hair", targets: ["/why-is-my-hair-so-oily"] },
  { pattern: "frizzy hair", targets: ["/why-is-my-hair-so-frizzy"] },
  { pattern: "grow(?:ing)? (?:out )?curly hair", targets: ["/how-to-grow-curly-hair"] },
  { pattern: "hair types?|curl patterns?", targets: ["/what-hair-type-do-i-have"] },
  { pattern: "grapeseed oil", targets: ["/is-grapeseed-oil-good-for-hair"] },
  { pattern: "black seed oil|nigella sativa", targets: ["/is-black-seed-oil-good-for-hair"] },
  { pattern: "amla(?: hair)? oil|amla", targets: ["/how-to-use-amla-oil-for-hair"] },
  { pattern: "shampoos? for thick hair", targets: ["/best-shampoo-for-thick-hair"] },
  { pattern: "curl gels?|(?:hair )?gels? for curly hair|styling gels?", targets: ["/best-hair-gel-for-curly-hair"] },
  { pattern: "round brush(?:es)?", targets: ["/best-round-brush-for-fine-hair"] },
  { pattern: "(?:satin |silk )?bonnets?|sleep caps?", targets: ["/best-hair-bonnet-for-sleeping"] },
  { pattern: "keratin[- ]treated hair|keratin (?:treatments?|blowouts?)", targets: ["/best-shampoo-for-keratin-treated-hair"] },
  { pattern: "hair growth serums?", targets: ["/best-hair-growth-serum"] },
  { pattern: "hair growth shampoos?", targets: ["/best-hair-growth-shampoo"] },
  { pattern: "hair (?:growth )?oils? for men|men" + A + "s hair (?:growth )?oils?", targets: ["/best-hair-growth-oil-for-men"] },
  { pattern: "(?:hair |scalp )?oils? for thinning hair", targets: ["/best-hair-oil-for-thinning-hair"] },
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
  { pattern: "how to use a scalp massager|using a scalp massager", targets: ["/how-to-use-a-scalp-massager-for-hair-growth"] },
  { pattern: "scalp massagers?|scalp massage", targets: ["/best-scalp-massager", "/does-scalp-massage-help-hair-growth", "/how-to-use-a-scalp-massager-for-hair-growth"] },
  { pattern: "scalp scrubs?", targets: ["/best-scalp-scrub"] },
  { pattern: "shower filters?", targets: ["/best-shower-filter-for-hair"] },
  { pattern: "curly hair", targets: ["/best-hair-products-for-curly-hair"] },
  { pattern: "colou?r-treated hair", targets: ["/best-shampoo-for-color-treated-hair"] },
  { pattern: "oily (?:hair|scalps?)", targets: ["/best-shampoo-for-oily-hair"] },
  { pattern: "itchy scalps?", targets: ["/best-shampoo-for-itchy-scalp", "/can-an-itchy-scalp-cause-hair-loss"] },
  { pattern: "damaged hair", targets: ["/best-hair-treatment-for-damaged-hair"] },
  { pattern: "at-home (?:hair )?colou?r|box dye", targets: ["/best-at-home-hair-color"] },
  { pattern: "peptide (?:scalp )?serums?|copper peptides?|hair peptides?", targets: ["/best-peptide-serum-for-hair-growth"] },
  { pattern: "traction alopecia|ccca|central centrifugal cicatricial alopecia", targets: ["/best-hair-growth-products-for-black-hair"] },
  { pattern: "chemotherapy|chemo(?: curls)?", targets: ["/best-shampoo-for-chemo-hair"] },
  { pattern: "wavy hair|2[abc] waves?", targets: ["/best-products-for-wavy-hair"] },
  { pattern: "fine curly hair|fine curls", targets: ["/best-hair-products-for-fine-curly-hair"] },
  { pattern: "4c hair|type 4c", targets: ["/best-hair-products-for-4c-hair"] },
  { pattern: "detanglers?|detangling sprays?", targets: ["/best-hair-detangler"] },
  { pattern: "detangling brush(?:es)?|wide[- ]tooth combs?", targets: ["/best-brush-for-curly-hair"] },
  { pattern: "low[- ]porosity(?: hair)?", targets: ["/best-oil-for-low-porosity-hair"] },
  { pattern: "high[- ]porosity(?: hair)?|dry(?:,| and)? damaged hair|brittle hair", targets: ["/best-shampoo-for-dry-damaged-hair"] },
  { pattern: "frizzy hair", targets: ["/best-conditioner-for-dry-frizzy-hair"] },
  { pattern: "cover(?:ing)? gr[ae]ys?|gr[ae]y coverage", targets: ["/best-hair-dye-to-cover-gray"] },
  { pattern: "gr[ae]y hair|silver hair", targets: ["/best-shampoo-for-gray-hair", "/best-hair-dye-to-cover-gray"] },
  { pattern: "hair extensions?|tape[- ]ins?", targets: ["/best-products-for-hair-extensions"] },
  { pattern: "pomades?|hair clays?|styling clays?", targets: ["/best-pomade-for-thin-hair"] },

  // Tools & grooming
  { pattern: "black friday|cyber monday", targets: ["/black-friday-hair-tool-deals"] },
  { pattern: "dyson airwrap|airwrap", targets: ["/best-dyson-airwrap-alternative"] },
  { pattern: "dyson supersonic|supersonic", targets: ["/best-dyson-supersonic-alternative"] },
  { pattern: "(?:hair )?dryer brush(?:es)?|blowout brush(?:es)?", targets: ["/best-hair-dryer-brush"] },
  { pattern: "(?:hair dryers?|blow[- ]?dryers?) for men", targets: ["/best-blow-dryer-for-men"] },
  { pattern: "hair dryers?|blow[- ]?dryers?", targets: ["/best-hair-dryer"] },
  { pattern: "flat irons? for (?:thin|fine) hair", targets: ["/best-flat-iron-for-thin-hair"] },
  { pattern: "flat irons?", targets: ["/best-flat-iron"] },
  { pattern: "curling (?:irons?|wands?) for short hair", targets: ["/best-curling-iron-for-short-hair"] },
  { pattern: "curling irons?|curling wands?", targets: ["/best-curling-iron"] },
  { pattern: "straightening brush(?:es)?", targets: ["/best-hair-straightening-brush"] },
  { pattern: "heated rollers", targets: ["/best-heated-rollers"] },
  { pattern: "beard (?:growth )?oils?", targets: ["/best-beard-growth-oil", "/best-beard-growth-products"] },
  { pattern: "beard trimmers?", targets: ["/best-beard-trimmer"] },
  { pattern: "beard (?:grooming |care )?kits?|grooming kits?|beard balms?", targets: ["/best-beard-grooming-kit"] },
  { pattern: "hair clippers", targets: ["/best-hair-clippers"] },
  { pattern: "head shavers?", targets: ["/best-head-shaver"] },
  { pattern: "electric shavers?|foil shavers?", targets: ["/best-electric-shaver-for-men"] },
  { pattern: "nose hair trimmers?", targets: ["/best-nose-hair-trimmer"] },
  { pattern: "body groomers?", targets: ["/best-body-groomer-for-men"] },
  { pattern: "beard dye|hair dye for men|just for men", targets: ["/best-hair-dye-for-men"] },
  { pattern: "eyelashes (?:to )?grow back|(?:eye)?lash growth cycle", targets: ["/how-long-do-eyelashes-take-to-grow-back"] },
  { pattern: "(?:eye)?lash (?:growth )?serums?", targets: ["/best-eyelash-growth-serum", "/do-eyelash-growth-serums-work"] },
  { pattern: "(?:eye)?brow (?:growth )?serums?", targets: ["/best-eyebrow-growth-serum"] },

  // Products we've reviewed
  { pattern: "viviscal (?:vs\\.?|versus|or) nutrafol|nutrafol (?:vs\\.?|versus|or) viviscal", targets: ["/viviscal-vs-nutrafol"] },
  { pattern: "viviscal", targets: [reviewHref("viviscal-extra-strength-hair-nutrient-tablets"), "/viviscal-vs-nutrafol"] },
  { pattern: "nutrafol", targets: [reviewHref("nutrafol"), "/viviscal-vs-nutrafol"] },
  { pattern: "vegamour(?: gro)?", targets: [reviewHref("vegamour-gro-hair-serum")] },
  { pattern: "divi(?: scalp serum)?", targets: [reviewHref("divi-scalp-serum")] },
  { pattern: "tangl", targets: [reviewHref("tangl-hair-loss-treatment")] },
  { pattern: "clofina", targets: [reviewHref("clofina-hair-revival-ampoule")] },
  { pattern: "basis hair(?: regrowth system)?|s[øo]ren hair", targets: [reviewHref("basis-hair-regrowth-system")] },
  { pattern: "hair bloom", targets: [reviewHref("bloom")] },
  { pattern: "just natural(?: hair growth treatment)?", targets: [reviewHref("just-natural-hair-growth-treatment")] },
  { pattern: "spark (?:hair (?:growth )?)?serum", targets: [reviewHref("spark-new")] },
  { pattern: "burst (?:hair )?serum|burst by nourish|nourish beaut[eé]", targets: [reviewHref("burst-by-nourish-beaute")] },
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

export const MAX_LINKS_PER_PAGE = 14;
/** Two links per paragraph; long paragraphs (the routing paragraphs top pages
 *  use to point readers at their cluster) may carry a third. */
const MAX_LINKS_PER_PARAGRAPH = 2;
const MAX_LINKS_PER_LONG_PARAGRAPH = 3;
const LONG_PARAGRAPH_CHARS = 450;

export type Linkify = (text: string) => ReactNode;

/** A run of paragraph text, linked to `href` when set. */
export interface LinkSegment {
  text: string;
  href?: string;
}

/** Every link target the rules can produce, so a check can confirm each one exists. */
export const autolinkTargets = [...new Set(rules.flatMap((r) => r.targets))];

/**
 * The linking rules without the rendering: splits each paragraph into plain and
 * linked runs. The HTML linker below and the Markdown renderers (lib/md) both
 * use it, so a page's Markdown copy links the same phrases as the page.
 */
export function createSegmenter(self: string, skip: string[] = []): (text: string) => LinkSegment[] {
  const usedTargets = new Set<string>([self, ...skip]);
  const usedRules = new Set<number>();
  let total = 0;

  return function segment(text: string): LinkSegment[] {
    const out: LinkSegment[] = [];
    let rest = text;
    let inParagraph = 0;
    const perParagraph = text.length >= LONG_PARAGRAPH_CHARS ? MAX_LINKS_PER_LONG_PARAGRAPH : MAX_LINKS_PER_PARAGRAPH;

    while (total < MAX_LINKS_PER_PAGE && inParagraph < perParagraph) {
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
      out.push({ text: rest.slice(0, index) }, { text: rest.slice(index, index + length), href });
      rest = rest.slice(index + length);
      usedRules.add(rule);
      usedTargets.add(href);
      total++;
      inParagraph++;
    }

    out.push({ text: rest });
    return out;
  };
}

/**
 * Make a linker for one page. Call it on paragraphs in reading order: the
 * first mention of a topic gets the link. `skip` lists hrefs the page already
 * links prominently (its pillar guide, breadcrumb parents) that shouldn't
 * also be linked in the text.
 */
export function createLinker(self: string, skip: string[] = []): Linkify {
  const segment = createSegmenter(self, skip);
  let key = 0;

  return function linkify(text: string): ReactNode {
    const parts = segment(text);
    if (parts.length === 1) return text;
    return parts.map((p) =>
      p.href ? (
        <Link key={`al${key++}`} href={p.href}>
          {p.text}
        </Link>
      ) : (
        p.text
      ),
    );
  };
}
