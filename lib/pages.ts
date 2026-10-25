/**
 * Titles, descriptions and AI summaries for the hand-written pages, plus the
 * home page's featured lists. The pages in app/ and their Markdown copies
 * (lib/md) both read from here, so the two can't drift apart.
 */
import { reviews } from "@/data/reviews";
import { roundups, roundupHubs } from "@/data/roundups";
import { questions } from "@/data/questions";
import { site } from "@/lib/site";
import { scientificReviewer } from "@/lib/reviewer";

const hubsWithGuides = roundupHubs.filter((hub) => roundups.some((r) => r.hub === hub));

export const staticPages = {
  home: {
    path: "/",
    title: `${site.name} — Independent Hair Loss & Regrowth Product Reviews`,
    description: site.description,
    aiSummary: `${site.name} is an independent, reader-supported publisher of ${reviews.length} hair growth product reviews, ${roundups.length} buyer's guides and ${questions.length} evidence-based answers on hair loss and hair care. Verdicts are based on ingredient research, published clinical evidence and verified customer feedback, and every article is reviewed by ${scientificReviewer.name}, ${scientificReviewer.title}.`,
  },
  best: {
    path: "/best",
    title: "Best Hair Growth & Hair Care Products: Every Buyer's Guide",
    description:
      "Every HairGrowthReviews buyer's guide in one place — the best minoxidil, hair growth shampoos, serums, vitamins, laser caps, hair tools and hair care products, ranked on evidence.",
    aiSummary: `Index of all ${roundups.length} ${site.name} buyer's guides, grouped into ${hubsWithGuides.length} categories (${hubsWithGuides.join(", ")}). Each guide ranks products on ingredient evidence, clinical data, value and user reports, and this page names each guide's #1 pick.`,
  },
  answers: {
    path: "/answers",
    title: "Hair Answers: Straight Answers to Hair Loss & Hair Care Questions",
    description:
      "Evidence-based answers to the hair loss and hair care questions people actually search — minoxidil timelines, shedding, supplements, oils, scalp care and more.",
    aiSummary: `${questions.length} evidence-based answers to common hair loss and hair care questions, grouped by topic. Each answer opens with a short direct answer, then the detail and the matching buyer's guide.`,
  },
  reviews: {
    path: "/reviews",
    title: "Hair Growth Product Reviews",
    description:
      "Independent, research-backed reviews of hair regrowth serums, shampoos, and supplements — real ingredients, real evidence, honest verdicts.",
    aiSummary: `${reviews.length} in-depth reviews of hair growth serums, shampoos, supplements, oils and devices, listed from highest to lowest rating. Each review gives a rating out of 5, the price, pros and cons, key ingredients and a verdict.`,
  },
  findATreatment: {
    path: "/find-a-treatment",
    title: "Find a Hair Loss Treatment: Minoxidil, Supplements & Surgery",
    description:
      "Evidence-based guides to the main hair loss treatments — minoxidil (Rogaine), hair growth supplements and scalp reduction surgery — and who each one suits.",
    intro:
      "What each major hair loss treatment does, what the evidence says, and who it suits — from topical minoxidil to supplements and surgery.",
  },
  aboutHairGrowth: {
    path: "/about-hair-growth",
    title: "About Hair Growth: The Hair Cycle, Stages of Hair Loss & More",
    description:
      "How hair grows and why it falls out — the hair growth cycle, the stages of male and female pattern hair loss, and an A–Z encyclopedia of hair growth terms.",
    intro: "The science behind hair growth and hair loss, explained plainly — start here before you buy a treatment.",
  },
  about: {
    path: "/about",
    title: "About Us & Editorial Process",
    description: "How HairGrowthReviews researches, rates, and reviews hair loss and hair growth products.",
  },
  contact: {
    path: "/contact",
    title: "Contact Us",
    description: `Get in touch with the ${site.name} editorial team.`,
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: `Privacy policy for ${site.name}.`,
  },
  terms: {
    path: "/terms",
    title: "Terms of Use",
    description: `Terms of use for ${site.name}.`,
  },
};

/** Home page: featured reviews, in display order. */
export const homeFeaturedReviews = [
  "biotopic-premium-hair-regrowth-serum",
  "amplixin-intensive-hair-growth-serum",
  "crinagen",
  "ultrax-labs-hair-lush",
  "revivogen-scalp-therapy-formula",
  "nizoral-d-anti-dandruff-shampoo",
];

/** Home page: featured buyer's guides, in display order. */
export const homeFeaturedRoundups = [
  "best-minoxidil-for-men",
  "best-hair-growth-shampoo",
  "best-laser-cap-for-hair-growth",
  "best-minoxidil-for-women",
  "best-hair-growth-vitamins",
  "best-hair-growth-serum",
];

/** Home page: the "Find a Treatment" cards. */
export const homeTreatments = [
  { href: "/find-a-treatment/minoxidil-rogaine", label: "Minoxidil & Rogaine", note: "The most clinically proven OTC option, explained" },
  { href: "/find-a-treatment/supplements", label: "Supplements", note: "What actually works vs. what's marketing hype" },
  { href: "/find-a-treatment/scalp-reduction", label: "Scalp Reduction Surgery", note: "Why it's largely been replaced by FUE/FUT" },
];
