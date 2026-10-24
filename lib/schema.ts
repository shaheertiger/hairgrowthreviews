import { ReviewData, GuideData, RoundupData, QuestionData } from "./types";
import { site } from "./site";
import { guideSectionHref, guideSectionLabels, reviewHref } from "./links";
import { scientificReviewer } from "./reviewer";

function reviewerPerson() {
  return {
    "@type": "Person",
    name: scientificReviewer.name,
    jobTitle: scientificReviewer.title,
    sameAs: [scientificReviewer.linkedin],
  };
}

export function reviewJsonLd(data: ReviewData) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: data.productName,
        brand: { "@type": "Brand", name: data.brand },
        category: data.category,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: data.rating,
          reviewCount: data.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: data.rating,
            bestRating: 5,
            worstRating: 1,
          },
          author: { "@type": "Organization", name: `${site.name} Editorial Team` },
          datePublished: data.updatedDate,
          reviewBody: data.bottomLine,
        },
      },
      reviewerPerson(),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Reviews", item: `${site.url}/reviews` },
          { "@type": "ListItem", position: 3, name: data.productName, item: `${site.url}${reviewHref(data.slug)}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function guideJsonLd(data: GuideData, path: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: data.h1,
        description: data.metaDescription,
        datePublished: data.updatedDate,
        author: { "@type": "Organization", name: `${site.name} Editorial Team` },
      },
      reviewerPerson(),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          ...(path === guideSectionHref[data.section]
            ? []
            : [{ "@type": "ListItem", position: 2, name: guideSectionLabels[data.section], item: `${site.url}${guideSectionHref[data.section]}` }]),
          { "@type": "ListItem", position: path === guideSectionHref[data.section] ? 2 : 3, name: data.h1, item: `${site.url}${path}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function roundupJsonLd(data: RoundupData) {
  const url = `${site.url}/${data.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: data.h1,
        description: data.metaDescription,
        datePublished: data.publishedDate,
        dateModified: data.updatedDate,
        author: { "@type": "Organization", name: `${site.name} Editorial Team` },
        publisher: { "@type": "Organization", name: site.name },
      },
      reviewerPerson(),
      {
        "@type": "ItemList",
        name: data.h1,
        numberOfItems: data.products.length,
        itemListElement: data.products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${url}#${p.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Best Picks", item: `${site.url}/best` },
          { "@type": "ListItem", position: 3, name: data.crumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function questionJsonLd(data: QuestionData) {
  const url = `${site.url}/${data.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: data.h1,
        description: data.metaDescription,
        datePublished: data.publishedDate,
        dateModified: data.updatedDate,
        author: { "@type": "Organization", name: `${site.name} Editorial Team` },
        publisher: { "@type": "Organization", name: site.name },
        mainEntityOfPage: url,
      },
      reviewerPerson(),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Hair Answers", item: `${site.url}/answers` },
          { "@type": "ListItem", position: 3, name: data.crumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: data.h1, acceptedAnswer: { "@type": "Answer", text: data.shortAnswer } },
          ...data.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        ],
      },
    ],
  };
}
