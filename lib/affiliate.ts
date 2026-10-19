import type { ProductPick } from "./types";

/**
 * Amazon Associates tracking ID. Set NEXT_PUBLIC_AMAZON_TAG in Vercel to your
 * real tag (it ends in "-20" for amazon.com). Every buying-guide link uses it.
 */
export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "hairgrowthrev-20";

/** Product page link when an ASIN is known, otherwise a tagged Amazon search. */
export function amazonUrl(product: Pick<ProductPick, "asin" | "amazonQuery">): string {
  if (product.asin) {
    return `https://www.amazon.com/dp/${product.asin}?tag=${AMAZON_TAG}`;
  }
  const q = encodeURIComponent(product.amazonQuery).replace(/%20/g, "+");
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG}`;
}

/** Adds our Amazon tag to any amazon.com link; leaves other retailers' links unchanged. */
export function withAffiliateTag(url: string): string {
  try {
    const u = new URL(url);
    if (!/(^|\.)amazon\.com$/.test(u.hostname)) return url;
    u.searchParams.set("tag", AMAZON_TAG);
    return u.toString();
  } catch {
    return url;
  }
}
