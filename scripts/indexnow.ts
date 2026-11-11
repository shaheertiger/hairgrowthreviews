/**
 * Pushes every sitemap URL to IndexNow (Bing, Yandex, Seznam, Naver …), so
 * Bing — and the Copilot / ChatGPT search answers grounded on Bing's index —
 * picks up new and changed pages the day they ship instead of in batches.
 *
 *   npm run indexnow             # submit every URL in the sitemap
 *   npm run indexnow -- /a /b    # submit only these paths
 *
 * Run it after a deploy is live. The key file is public/<key>.txt.
 */
import sitemap from "@/app/sitemap";
import { site } from "@/lib/site";

const KEY = "196e484b5a7d41808b14f167c7b01c2e";

async function main() {
  const paths = process.argv.slice(2);
  const urls = paths.length ? paths.map((p) => new URL(p, site.url).toString()) : sitemap().map((e) => e.url);
  const host = new URL(site.url).host;

  for (let i = 0; i < urls.length; i += 10_000) {
    const urlList = urls.slice(i, i + 10_000);
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: KEY, keyLocation: `${site.url}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} ${res.statusText}`);
    if (!res.ok && res.status !== 202) process.exitCode = 1;
  }
}

main();
