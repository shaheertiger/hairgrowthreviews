// Finds the exact Amazon listing for a product so a roundup can link to it.
//
//   npm run amazon:search -- "Kirkland minoxidil 5% foam" [count]
//
// Prints one JSON line per result: ASIN, title, brand, current price and image.
// Put the ASIN of the listing that IS the product (right brand, right variant)
// on the product's `asin` field — then `npm run amazon:sync` confirms it.
import { SearchItemsRequestContent } from "amazon-creators-api";
import { createClient } from "./client.mjs";

const [query, count = "6"] = process.argv.slice(2);
if (!query) {
  console.error('Usage: npm run amazon:search -- "product name" [count]');
  process.exit(1);
}

const { client, api, partnerTag } = createClient();
const req = new SearchItemsRequestContent();
req.partnerTag = partnerTag;
req.keywords = query;
req.itemCount = Math.min(Number(count), 10);
req.searchIndex = "All";
req.resources = ["itemInfo.title", "itemInfo.byLineInfo", "images.primary.medium", "offersV2.listings.price"];

try {
  const result = await api.searchItems(client.marketplace, req);
  const items = result?.searchResult?.items || [];
  if (items.length === 0) console.log("No results.");
  for (const it of items) {
    console.log(
      JSON.stringify({
        asin: it.asin,
        title: it.itemInfo?.title?.displayValue,
        brand: it.itemInfo?.byLineInfo?.brand?.displayValue,
        price: it.offersV2?.listings?.[0]?.price?.money?.displayAmount,
      }),
    );
  }
} catch (err) {
  console.error("Search failed:", err?.message || err);
  process.exit(1);
}
