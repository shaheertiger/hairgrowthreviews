import AMAZON_PRODUCTS from "@/data/amazon/products.json";

// Amazon Associates tracking ID. Public by design — it appears in every outbound
// product link and identifies the account a click is credited to.
export const AMAZON_TAG = "sktiger-20";

interface SyncedProduct {
  title: string;
  image?: string;
}

/** Listings confirmed live by `npm run amazon:sync`, keyed by ASIN. */
const SYNCED = AMAZON_PRODUCTS as Record<string, SyncedProduct>;

/**
 * Resolves a product's outbound Amazon link, best option first:
 *
 *   1. A direct /dp/<ASIN> link, when the product has an ASIN that the last
 *      `amazon:sync` confirmed is still live.
 *   2. A tagged Amazon search for the product name.
 *
 * Both carry the tag, so the click is credited either way. The search fallback
 * keeps a product whose listing was withdrawn (or never matched) pointing at
 * the right item rather than at a dead page.
 */
export function amazonProductLink(name: string, asin?: string): string {
  if (asin && SYNCED[asin]) return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}&linkCode=ll1`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(name)}&tag=${AMAZON_TAG}`;
}

/** Adds the Associates tag to an Amazon URL; leaves any other URL untouched. */
export function withAmazonTag(url: string): string {
  if (!/^https:\/\/(www\.)?amazon\.com\//.test(url) || url.includes("tag=")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}tag=${AMAZON_TAG}`;
}

/** The product image Amazon serves for this ASIN, if the last sync captured one. */
export function amazonImage(asin?: string): string | undefined {
  return asin ? SYNCED[asin]?.image : undefined;
}
