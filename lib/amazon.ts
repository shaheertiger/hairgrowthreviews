/**
 * Amazon Associates link helpers.
 *
 * The partner tag comes from the AMAZON_CREATORS_PARTNER_TAG env var (set it in
 * Vercel too). The fallback keeps links earning commission if the var is
 * missing at build time — the tag is public in every link anyway.
 */
export const AMAZON_PARTNER_TAG = process.env.AMAZON_CREATORS_PARTNER_TAG || "sktiger-20";

/** Direct product page link for a known ASIN. */
export function amazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_PARTNER_TAG}`;
}

/** Search results link, for products without a single Amazon listing. */
export function amazonSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query, tag: AMAZON_PARTNER_TAG });
  return `https://www.amazon.com/s?${params.toString()}`;
}
