/**
 * Confirms every roundup product's ASIN against the live Amazon catalogue and
 * downloads its listing title and image into data/amazon/products.json.
 *
 *   npm run amazon:sync
 *
 * Pages read that JSON at build time, so the build never needs the API or the
 * secret. Re-run after adding products, and periodically to refresh images.
 * Any ASIN Amazon no longer returns is reported — fix it with amazon:search.
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { createClient, sleep } from "./client.mjs";
import { GetItemsRequestContent, type GetItemsResource } from "amazon-creators-api";
import { roundups } from "../../data/roundups";

const OUT = join(__dirname, "..", "..", "data", "amazon", "products.json");
const BATCH = 10; // GetItems accepts up to 10 ASINs per call

interface Synced {
  title: string;
  image?: string;
}

async function main() {
  const { client, api, partnerTag } = createClient();
  const wanted = new Map<string, string[]>(); // asin -> "slug#id" users
  const missingAsin: string[] = [];
  for (const r of roundups) {
    for (const p of r.products) {
      if (!p.asin) {
        missingAsin.push(`${r.slug}#${p.id}`);
        continue;
      }
      wanted.set(p.asin, [...(wanted.get(p.asin) ?? []), `${r.slug}#${p.id} (${p.name})`]);
    }
  }

  const asins = [...wanted.keys()];
  const out: Record<string, Synced> = {};
  for (let i = 0; i < asins.length; i += BATCH) {
    const batch = asins.slice(i, i + BATCH);
    const req = new GetItemsRequestContent(partnerTag as string, batch);
    req.resources = ["itemInfo.title", "images.primary.large"] as unknown as GetItemsResource[];
    try {
      const result = await api.getItems(client.marketplace, req);
      for (const item of result?.itemsResult?.items ?? []) {
        out[item.asin] = {
          title: item.itemInfo?.title?.displayValue ?? "",
          image: item.images?.primary?.large?.url,
        };
      }
    } catch (err) {
      console.error(`Batch at ${i} failed:`, (err as Error)?.message ?? err);
    }
    if (i + BATCH < asins.length) await sleep(1100);
  }

  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(OUT, JSON.stringify(sorted, null, 2) + "\n");

  const dead = asins.filter((a) => !out[a]);
  console.log(`Synced ${Object.keys(out).length}/${asins.length} ASINs -> data/amazon/products.json`);
  if (missingAsin.length) console.log(`\nNo ASIN (tagged search link used):\n  ${missingAsin.join("\n  ")}`);
  if (dead.length) {
    console.log(`\nNot returned by Amazon — fix with amazon:search:`);
    for (const a of dead) console.log(`  ${a}: ${wanted.get(a)!.join(", ")}`);
    process.exitCode = 1;
  }
}

main();
