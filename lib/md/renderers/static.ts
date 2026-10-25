/**
 * Markdown for the hand-written pages in app/. Their copy lives in JSX, so
 * the text here mirrors it; when you edit one of those pages, edit its
 * renderer too. Titles, descriptions and featured lists come from lib/pages.
 */
import { reviews } from "@/data/reviews";
import { guides } from "@/data/guides";
import { roundups, roundupHubs } from "@/data/roundups";
import { questions } from "@/data/questions";
import { amazonProductLink } from "@/lib/affiliate";
import { questionHref, reviewHref, roundupHref } from "@/lib/links";
import { homeFeaturedReviews, homeFeaturedRoundups, homeTreatments, staticPages } from "@/lib/pages";
import { scientificReviewer } from "@/lib/reviewer";
import { site } from "@/lib/site";
import { bullets, esc, h, item, link, type MdDoc } from "../format";

const bySlug = <T extends { slug: string }>(list: T[], slugs: string[]) =>
  slugs.map((s) => list.find((x) => x.slug === s)).filter((x): x is T => !!x);

const ratingText = (r: { rating: number; reviewCount: number }) =>
  `${r.rating.toFixed(1)}/5 (${r.reviewCount.toLocaleString("en-US")} reviews)`;

export function homeDoc(): MdDoc {
  const page = staticPages.home;
  return {
    title: page.title,
    summary: page.description,
    path: page.path,
    blocks: [
      [
        h(2, "Hair Regrowth Products, Reviewed Honestly"),
        "Independent, Research-Backed Reviews.",
        "We research real ingredients, clinical evidence, and verified customer sentiment for every hair growth serum, shampoo, and supplement we cover — not manufacturer marketing copy.",
        bullets([`${reviews.length}+ Products Reviewed`, "100% Independently Researched", "2026 Last Updated"]),
      ].join("\n\n"),
      [
        h(2, "Best Picks: Buyer's Guides"),
        bySlug(roundups, homeFeaturedRoundups)
          .map((r) => item(r.crumb, roundupHref(r.slug), `${r.products.length} picks ranked. ${r.dek} Our #1: ${r.products[0].name}`))
          .join("\n"),
        link(`All ${roundups.length} guides`, "/best"),
      ].join("\n\n"),
      [
        h(2, "Most-Read Reviews"),
        bySlug(reviews, homeFeaturedReviews)
          .map((r) => item(r.productName, reviewHref(r.slug), `${r.category}, ${ratingText(r)}. ${r.dek}`))
          .join("\n"),
        link("See all reviews", "/reviews"),
      ].join("\n\n"),
      questions.length > 0 &&
        [
          h(2, "Hair Answers"),
          questions.slice(0, 6).map((q) => item(q.h1, questionHref(q.slug))).join("\n"),
          link("All answers", "/answers"),
        ].join("\n\n"),
      [
        h(2, "Understand Hair Loss First"),
        "Before you buy anything, understand the biology — the hair growth cycle, DHT's role, and how to read a hair-loss stage.",
        guides
          .filter((g) => g.section === "about-hair-growth")
          .map((g) => item(g.h1, `/about-hair-growth/${g.slug}`, g.dek))
          .join("\n"),
      ].join("\n\n"),
      [h(2, "Find a Treatment"), homeTreatments.map((t) => item(t.label, t.href, t.note)).join("\n")].join("\n\n"),
      [
        h(2, "How We Review Products"),
        "Every review on this site is built from real ingredient research, published clinical evidence where it exists, and verified customer sentiment — with unverified manufacturer claims clearly labeled as such.",
        link("Read Our Editorial Process", "/about#editorial-process"),
      ].join("\n\n"),
    ],
  };
}

export function bestDoc(): MdDoc {
  const page = staticPages.best;
  const hubs = roundupHubs.filter((hub) => roundups.some((r) => r.hub === hub));
  return {
    title: "Best Picks: Every Buyer's Guide",
    summary: page.description,
    path: page.path,
    updated: roundups.map((r) => r.updatedDate).sort().at(-1),
    blocks: [
      `${roundups.length} guides ranked on ingredient evidence, clinical data where it exists, value, and what real users report — not on who pays the most.`,
      ...hubs.map((hub) => {
        const list = roundups.filter((r) => r.hub === hub);
        return `${h(2, `${hub} (${list.length})`)}\n\n${list
          .map((r) => {
            const top = r.products[0];
            return `${item(r.crumb, roundupHref(r.slug), `${r.products.length} picks ranked. ${r.dek} Our #1 pick: ${top.name}`)} (${link("check price", amazonProductLink(top.name, top.asin))})`;
          })
          .join("\n")}`;
      }),
    ],
  };
}

export function answersDoc(): MdDoc {
  const page = staticPages.answers;
  const hubs = roundupHubs.filter((hub) => questions.some((q) => q.hub === hub));
  return {
    title: "Hair Answers",
    summary: page.description,
    path: page.path,
    updated: questions.map((q) => q.updatedDate).sort().at(-1),
    blocks: [
      "Short, evidence-based answers to the questions people actually ask about hair loss and hair care — then the detail, if you want it.",
      ...hubs.map(
        (hub) =>
          `${h(2, hub)}\n\n${questions
            .filter((q) => q.hub === hub)
            .map((q) => item(q.h1, questionHref(q.slug), q.shortAnswer))
            .join("\n")}`,
      ),
    ],
  };
}

export function reviewsDoc(): MdDoc {
  const page = staticPages.reviews;
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  return {
    title: "Hair Growth Product Reviews",
    summary: page.description,
    path: page.path,
    blocks: [
      "Every product below was researched for real ingredients, clinical evidence, pricing, and verified customer sentiment — not manufacturer marketing copy.",
      sorted.map((r) => item(r.productName, reviewHref(r.slug), `${r.category}. ${r.verdictLabel}. ${ratingText(r)}`)).join("\n"),
    ],
  };
}

export function aboutDoc(): MdDoc {
  const page = staticPages.about;
  return {
    title: `About ${site.name}`,
    summary: page.description,
    path: page.path,
    blocks: [
      `${site.name} is an independent publisher of hair loss and hair regrowth product reviews. We started this site because most product pages in this category are written by the brands themselves — we wanted a place that researches ingredients, evidence, and real customer sentiment before publishing a verdict.`,
      `${h(2, "Our Scientific Reviewer")}\n\nEvery article on this site is written by our editorial team and reviewed by ${link(scientificReviewer.name, scientificReviewer.linkedin)}, ${esc(scientificReviewer.title)}. ${esc(scientificReviewer.shortBio)}`,
      `${h(2, "Our Editorial Process")}\n\nFor every product we review, our editorial team:\n\n${bullets([
        "Researches the manufacturer's stated ingredients, claims, and pricing directly from official sources",
        "Checks whether any clinical evidence exists for the ingredients and, separately, for the finished product itself — and we label the difference clearly",
        "Reviews publicly available customer sentiment across retailers and independent review platforms",
        "Flags manufacturer claims we could not independently verify, rather than repeating them as fact",
        "Updates reviews periodically as products, pricing, and evidence change",
      ])}`,
      `${h(2, "Affiliate Disclosure")}\n\n${esc(site.disclosure)}`,
      `${h(2, "Medical Disclaimer")}\n\nNothing on this site is medical advice. Information about hair loss causes, treatments, and products is for educational purposes only. Consult a licensed dermatologist or physician before starting any new treatment, especially if you have an underlying medical condition or take other medications.`,
    ],
  };
}

export function contactDoc(): MdDoc {
  const page = staticPages.contact;
  return {
    title: "Contact Us",
    summary: page.description,
    path: page.path,
    blocks: [
      "Have a correction, a product suggestion, or a question about one of our reviews? We want to hear from you — accuracy matters more to us than any single review staying unchanged.",
      `Email us at ${link(site.contactEmail, `mailto:${site.contactEmail}`)} and we'll follow up as soon as we can.`,
    ],
  };
}

export function privacyDoc(): MdDoc {
  const page = staticPages.privacy;
  return {
    title: "Privacy Policy",
    summary: page.description,
    path: page.path,
    blocks: [
      `This Privacy Policy explains how ${site.name} ("we", "us") collects and uses information when you visit ${site.domain}.`,
      `${h(2, "Information We Collect")}\n\nWe may collect standard analytics data (pages visited, general location, device/browser type) to understand how our site is used. We do not knowingly collect sensitive personal or health information through normal site browsing.`,
      `${h(2, "Cookies & Affiliate Links")}\n\nWe use cookies for basic site analytics and to support affiliate tracking when you click a link to a retailer. Third-party retailers and ad networks may set their own cookies subject to their own privacy policies.`,
      `${h(2, "Contact")}\n\nQuestions about this policy can be sent to ${link(site.contactEmail, `mailto:${site.contactEmail}`)}.`,
    ],
  };
}

export function termsDoc(): MdDoc {
  const page = staticPages.terms;
  return {
    title: "Terms of Use",
    summary: page.description,
    path: page.path,
    blocks: [
      `By using ${site.domain}, you agree to the following terms. Content on this site is provided for general informational purposes only and does not constitute medical advice.`,
      `${h(2, "No Medical Advice")}\n\nReviews, guides, and other content on this site are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a licensed physician or dermatologist before starting any hair loss treatment.`,
      `${h(2, "Affiliate Relationships")}\n\n${esc(site.disclosure)}`,
      `${h(2, "Accuracy")}\n\nWe make a good-faith effort to keep product information, pricing, and claims accurate and current, but prices, formulas, and availability can change without notice. Verify current details directly with the retailer or manufacturer before purchasing.`,
    ],
  };
}
