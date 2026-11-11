/**
 * JSON-LD for every page type. Each page emits ONE @graph: Organization +
 * WebSite + WebPage (with the scientific reviewer as `reviewedBy`) + the
 * page's main entity + BreadcrumbList + FAQPage, tied together by @id.
 *
 * Policy notes:
 * - Review pages carry our editorial `Review` only. They deliberately do NOT
 *   carry `aggregateRating`: the review counts on those pages are estimates of
 *   third-party retailer sentiment, and Google only allows aggregate ratings
 *   that summarise reviews collected on the page itself.
 * - Dates are ISO (lib/dates) — "August 2026" is not a valid schema.org Date.
 */
import { ReviewData, GuideData, RoundupData, QuestionData, FaqItem } from "./types";
import { site } from "./site";
import { guideSectionHref, guideSectionLabels, reviewHref } from "./links";
import { scientificReviewer } from "./reviewer";
import { toIsoDate } from "./dates";

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const REVIEWER_ID = `${site.url}/#scientific-reviewer`;

const iso = (date?: string) => toIsoDate(date) ?? site.staticLastModified;

/** Inline publisher/author reference (named, so parsers that don't resolve @id still see who it is). */
const orgRef = () => ({ "@type": "Organization", "@id": ORG_ID, name: site.name, url: site.url });

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    sameAs: site.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: site.contactUrl,
      email: site.contactEmail,
    },
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

function reviewerPerson() {
  return {
    "@type": "Person",
    "@id": REVIEWER_ID,
    name: scientificReviewer.name,
    jobTitle: scientificReviewer.title,
    sameAs: [scientificReviewer.linkedin],
    knowsAbout: ["Hair biology", "Hair loss", "Hair care product testing", "Cosmetic science"],
  };
}

function webPageNode(url: string, name: string, description: string, modified: string, mainEntityId?: string) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-US",
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    reviewedBy: { "@id": REVIEWER_ID },
    lastReviewed: modified,
    dateModified: modified,
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
  };
}

function breadcrumbNode(url: string, crumbs: { name: string; item: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };
}

function faqNode(url: string, items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function articleNode(url: string, headline: string, description: string, published: string, modified: string) {
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    datePublished: published,
    dateModified: modified,
    author: { ...orgRef(), name: `${site.name} Editorial Team` },
    publisher: orgRef(),
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": SITE_ID },
    inLanguage: "en-US",
  };
}

const graph = (...nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": [organizationNode(), websiteNode(), reviewerPerson(), ...nodes],
});

export function reviewJsonLd(data: ReviewData) {
  const url = `${site.url}${reviewHref(data.slug)}`;
  const modified = iso(data.updatedDate);
  return graph(
    webPageNode(url, data.metaTitle, data.metaDescription, modified, `${url}#product`),
    {
      "@type": "Product",
      "@id": `${url}#product`,
      name: data.productName,
      brand: { "@type": "Brand", name: data.brand },
      category: data.category,
      description: data.dek,
      review: {
        "@type": "Review",
        "@id": `${url}#review`,
        name: data.h1,
        reviewRating: {
          "@type": "Rating",
          ratingValue: data.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: { ...orgRef(), name: `${site.name} Editorial Team` },
        publisher: orgRef(),
        datePublished: modified,
        reviewBody: data.bottomLine,
        ...(data.pros.length ? { positiveNotes: listNode(data.pros) } : {}),
        ...(data.cons.length ? { negativeNotes: listNode(data.cons) } : {}),
      },
    },
    breadcrumbNode(url, [
      { name: "Home", item: site.url },
      { name: "Reviews", item: `${site.url}/reviews` },
      { name: data.productName, item: url },
    ]),
    faqNode(url, data.faq),
  );
}

/** Pros/cons as an ItemList — Google's pros-and-cons markup for editorial reviews. */
function listNode(items: string[]) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((name, i) => ({ "@type": "ListItem", position: i + 1, name })),
  };
}

export function guideJsonLd(data: GuideData, path: string) {
  const url = `${site.url}${path}`;
  const modified = iso(data.updatedDate);
  const isSectionRoot = path === guideSectionHref[data.section];
  return graph(
    webPageNode(url, data.metaTitle, data.metaDescription, modified, `${url}#article`),
    articleNode(url, data.h1, data.metaDescription, iso(data.publishedDate ?? data.updatedDate), modified),
    breadcrumbNode(url, [
      { name: "Home", item: site.url },
      ...(isSectionRoot ? [] : [{ name: guideSectionLabels[data.section], item: `${site.url}${guideSectionHref[data.section]}` }]),
      { name: data.h1, item: url },
    ]),
    faqNode(url, data.faq),
  );
}

export function roundupJsonLd(data: RoundupData) {
  const url = `${site.url}/${data.slug}`;
  const modified = iso(data.updatedDate);
  return graph(
    webPageNode(url, data.metaTitle, data.metaDescription, modified, `${url}#article`),
    articleNode(url, data.h1, data.metaDescription, iso(data.publishedDate), modified),
    {
      "@type": "ItemList",
      "@id": `${url}#list`,
      name: data.h1,
      numberOfItems: data.products.length,
      itemListElement: data.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${url}#${p.id}`,
      })),
    },
    breadcrumbNode(url, [
      { name: "Home", item: site.url },
      { name: "Best Picks", item: `${site.url}/best` },
      { name: data.crumb, item: url },
    ]),
    faqNode(url, data.faq),
  );
}

export function questionJsonLd(data: QuestionData) {
  const url = `${site.url}/${data.slug}`;
  const modified = iso(data.updatedDate);
  return graph(
    webPageNode(url, data.metaTitle, data.metaDescription, modified, `${url}#article`),
    articleNode(url, data.h1, data.metaDescription, iso(data.publishedDate), modified),
    breadcrumbNode(url, [
      { name: "Home", item: site.url },
      { name: "Hair Answers", item: `${site.url}/answers` },
      { name: data.crumb, item: url },
    ]),
    faqNode(url, [{ q: data.h1, a: data.shortAnswer }, ...data.faq]),
  );
}

/** Hub pages (/reviews, /best, …): a CollectionPage with a crawlable ItemList of its children. */
export function collectionJsonLd(path: string, name: string, description: string, items: { name: string; path: string }[]) {
  const url = `${site.url}${path}`;
  return graph(
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description,
      inLanguage: "en-US",
      isPartOf: { "@id": SITE_ID },
      publisher: { "@id": ORG_ID },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@id": `${url}#list` },
    },
    {
      "@type": "ItemList",
      "@id": `${url}#list`,
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: `${site.url}${it.path}` })),
    },
    breadcrumbNode(url, [
      { name: "Home", item: site.url },
      { name, item: url },
    ]),
  );
}

/** Home page: who publishes the site. Same facts as /llms.txt and /ai.txt (lib/md/site-files). */
export function organizationJsonLd() {
  return { "@context": "https://schema.org", ...organizationNode() };
}

export function websiteJsonLd() {
  return { "@context": "https://schema.org", ...websiteNode() };
}
