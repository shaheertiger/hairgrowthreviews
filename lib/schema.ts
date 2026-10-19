import { ReviewData, GuideData, BuyingGuideData } from "./types";
import { site } from "./site";
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
          { "@type": "ListItem", position: 3, name: data.productName, item: `${site.url}/reviews/${data.slug}` },
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
          { "@type": "ListItem", position: 2, name: data.h1, item: `${site.url}${path}` },
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

export function buyingGuideJsonLd(data: BuyingGuideData) {
  const url = `${site.url}/best/${data.slug}`;
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
        "@type": "ItemList",
        name: data.h1,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: data.products.length,
        itemListElement: data.products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${url}#${p.id}`,
          item: {
            "@type": "Product",
            name: p.name,
            brand: { "@type": "Brand", name: p.brand },
            review: {
              "@type": "Review",
              reviewRating: { "@type": "Rating", ratingValue: p.score, bestRating: 5, worstRating: 1 },
              author: { "@type": "Organization", name: `${site.name} Editorial Team` },
            },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Buying Guides", item: `${site.url}/best` },
          { "@type": "ListItem", position: 3, name: data.h1, item: url },
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
