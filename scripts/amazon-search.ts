/**
 * Look up Amazon products (ASIN + tagged link) via the Amazon Creators API.
 * Use the ASIN with `amazonProductUrl()` in a review's `affiliateUrl`.
 *
 * Needs AMAZON_CREATORS_CLIENT_ID, AMAZON_CREATORS_CLIENT_SECRET and
 * AMAZON_CREATORS_PARTNER_TAG in the environment.
 *
 * Run with: npm run amazon:search -- "viviscal extra strength"
 */
const { AMAZON_CREATORS_CLIENT_ID, AMAZON_CREATORS_CLIENT_SECRET, AMAZON_CREATORS_PARTNER_TAG } = process.env;
const keywords = process.argv.slice(2).join(" ");

async function main() {
  if (!AMAZON_CREATORS_CLIENT_ID || !AMAZON_CREATORS_CLIENT_SECRET || !AMAZON_CREATORS_PARTNER_TAG) {
    throw new Error("Missing AMAZON_CREATORS_* env vars");
  }
  if (!keywords) throw new Error('Usage: npm run amazon:search -- "product name"');

  const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: AMAZON_CREATORS_CLIENT_ID,
      client_secret: AMAZON_CREATORS_CLIENT_SECRET,
      scope: "creatorsapi::default",
    }),
  });
  const token = await tokenRes.json();
  if (!token.access_token) throw new Error(`Token request failed: ${JSON.stringify(token)}`);

  const res = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "x-marketplace": "www.amazon.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      partnerTag: AMAZON_CREATORS_PARTNER_TAG,
      marketplace: "www.amazon.com",
      itemCount: 10,
      resources: ["itemInfo.title", "itemInfo.byLineInfo"],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Search failed (${res.status}): ${JSON.stringify(data)}`);

  for (const item of data.searchResult?.items ?? []) {
    const brand = item.itemInfo?.byLineInfo?.brand?.displayValue ?? "?";
    console.log(`${item.asin}  [${brand}]  ${item.itemInfo?.title?.displayValue}`);
    console.log(`  ${item.detailPageURL}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
