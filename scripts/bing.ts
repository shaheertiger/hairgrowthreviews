/**
 * Bing Webmaster performance report: which pages and queries earn clicks, which
 * are close and which Bing never shows. This is the data source the daily runs
 * use to decide what to double down on (see SEO-RULES.md). Google data is
 * deliberately not used.
 *
 *   npm run bing                 # last 90 days, prints the report, saves a snapshot
 *   npm run bing -- --days 28    # shorter window
 *   npm run bing -- --json       # machine-readable report on stdout
 *   npm run bing -- --page /best-batana-oil   # the queries one page ranks for
 *
 * Needs BING_WEBMASTER_API_KEY (Bing Webmaster Tools → Settings → API access).
 * The key goes in the URL as `apikey=`, so it has to be an environment
 * variable; a header-injected network secret does not work for this API.
 * Snapshots are written to data/bing/<date>.json so runs can compare trends.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sitemap from "@/app/sitemap";
import { site } from "@/lib/site";

const KEY = process.env.BING_WEBMASTER_API_KEY ?? process.env.BING_API_KEY;
const API = "https://ssl.bing.com/webmaster/api.svc/json";
const SITE_URLS = [`${site.url}/`, site.url, site.url.replace("://www.", "://") + "/"];

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const DAYS = Number(opt("days") ?? 90);

interface Row {
  Query: string;
  Clicks: number;
  Impressions: number;
  AvgImpressionPosition: number;
  AvgClickPosition: number;
  Date: string;
}

async function call(method: string, params: Record<string, string>): Promise<Row[]> {
  const qs = new URLSearchParams({ ...params, apikey: KEY! });
  const res = await fetch(`${API}/${method}?${qs}`);
  const text = await res.text();
  let body: { d?: Row[]; ErrorCode?: number; Message?: string };
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`${method}: HTTP ${res.status} ${text.slice(0, 200)}`);
  }
  if (body.ErrorCode) throw new Error(`${method}: ${body.Message} (code ${body.ErrorCode})`);
  return body.d ?? [];
}

const dateOf = (d: string) => new Date(Number(/\d+/.exec(d)?.[0] ?? 0));
const pathOf = (u: string) => {
  try {
    return new URL(u).pathname.replace(/\/$/, "") || "/";
  } catch {
    return u;
  }
};

interface Agg {
  key: string;
  clicks: number;
  impressions: number;
  position: number; // impression-weighted average position
  ctr: number;
}

function aggregate(rows: Row[], keyOf: (r: Row) => string): Agg[] {
  const since = Date.now() - DAYS * 86_400_000;
  const m = new Map<string, { clicks: number; impressions: number; posSum: number; posW: number }>();
  for (const r of rows) {
    if (dateOf(r.Date).getTime() < since) continue;
    const k = keyOf(r);
    const a = m.get(k) ?? { clicks: 0, impressions: 0, posSum: 0, posW: 0 };
    a.clicks += r.Clicks;
    a.impressions += r.Impressions;
    if (r.AvgImpressionPosition > 0 && r.Impressions > 0) {
      a.posSum += r.AvgImpressionPosition * r.Impressions;
      a.posW += r.Impressions;
    }
    m.set(k, a);
  }
  return [...m.entries()]
    .map(([key, a]) => ({
      key,
      clicks: a.clicks,
      impressions: a.impressions,
      position: a.posW ? Math.round((a.posSum / a.posW) * 10) / 10 : 0,
      ctr: a.impressions ? Math.round((a.clicks / a.impressions) * 1000) / 10 : 0,
    }))
    .sort((x, y) => y.clicks - x.clicks || y.impressions - x.impressions);
}

/** Topic clusters, so a run can see which subjects earn, not just which URLs. */
const CLUSTERS: [string, RegExp][] = [
  ["batana", /batana/],
  ["pumpkin seed oil", /pumpkin/],
  ["rosemary", /rosemary/],
  ["castor", /castor/],
  ["other oils", /\boil|argan|jojoba|coconut|amla|grapeseed|black seed|tea tree/],
  ["minoxidil", /minoxidil|rogaine|kirkland/],
  ["ketoconazole / dandruff", /ketoconazole|nizoral|dandruff|head (?:and|&) shoulders/],
  ["dht / saw palmetto", /dht|saw palmetto|finasteride/],
  ["supplements", /biotin|vitamin|collagen|iron|nutrafol|viviscal|supplement|prenatal/],
  ["brand reviews", /review|invati|aveda|ultrax|revivogen|pura d|basis|clofina|tangl|vegamour|divi/],
  ["laser / devices", /laser|red light|derma ?roll|microneedl|massager/],
  ["styling & tools", /dryer|flat iron|curling|straighten|clipper|trimmer|shaver|brush|airwrap|supersonic|roller/],
  ["hair care", /shampoo|conditioner|curl|frizz|gel|mousse|porosity|dye|color|gray|grey|purple/],
];
const clusterOf = (s: string) => CLUSTERS.find(([, re]) => re.test(s.toLowerCase()))?.[0] ?? "other";

async function main() {
  if (!KEY) {
    console.error(
      "BING_WEBMASTER_API_KEY is not set.\n" +
        "Get a key in Bing Webmaster Tools (Settings → API access → API key) and add it as an\n" +
        "environment variable named BING_WEBMASTER_API_KEY in the cloud environment's settings,\n" +
        "then start a new session. Until then, follow SEO-RULES.md using the recorded winners.",
    );
    process.exit(2);
  }

  let siteUrl = "";
  let lastErr: unknown;
  for (const s of SITE_URLS) {
    try {
      await call("GetRankAndTrafficStats", { siteUrl: s });
      siteUrl = s;
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!siteUrl) throw lastErr;

  const one = opt("page");
  if (one) {
    const rows = await call("GetPageQueryStats", { siteUrl, page: new URL(one, site.url).toString() });
    const q = aggregate(rows, (r) => r.Query.toLowerCase());
    console.log(`Queries for ${one} (last ${DAYS} days):`);
    for (const r of q.slice(0, 50))
      console.log(`  ${String(r.clicks).padStart(4)} clk ${String(r.impressions).padStart(6)} imp  pos ${String(r.position).padStart(5)}  ${r.key}`);
    return;
  }

  const [queryRows, pageRows] = await Promise.all([
    call("GetQueryStats", { siteUrl }),
    call("GetPageStats", { siteUrl }),
  ]);
  const queries = aggregate(queryRows, (r) => r.Query.toLowerCase());
  const pages = aggregate(pageRows, (r) => pathOf(r.Query));

  const sitemapPaths = sitemap().map((e) => pathOf(e.url));
  const seen = new Set(pages.map((p) => p.key));
  const winners = pages.filter((p) => p.clicks > 0);
  const nearMiss = pages.filter((p) => p.clicks === 0 && p.impressions >= 10 && p.position > 0 && p.position <= 20);
  const lowCtr = pages.filter((p) => p.clicks > 0 && p.position <= 10 && p.impressions >= 50 && p.ctr < 2);
  const invisible = sitemapPaths.filter((p) => !seen.has(p));
  const zeroClick = pages.filter((p) => p.clicks === 0);

  // Top queries for the near-miss pages tell a run what to retitle them to.
  const nearMissQueries: Record<string, Agg[]> = {};
  for (const p of nearMiss.slice(0, 15)) {
    try {
      const rows = await call("GetPageQueryStats", { siteUrl, page: new URL(p.key, site.url).toString() });
      nearMissQueries[p.key] = aggregate(rows, (r) => r.Query.toLowerCase()).slice(0, 5);
    } catch {
      /* page-level queries are best-effort */
    }
  }

  const clusterTotals = new Map<string, { clicks: number; impressions: number; pages: number }>();
  for (const p of pages) {
    const c = clusterOf(p.key);
    const t = clusterTotals.get(c) ?? { clicks: 0, impressions: 0, pages: 0 };
    t.clicks += p.clicks;
    t.impressions += p.impressions;
    t.pages++;
    clusterTotals.set(c, t);
  }
  const clusters = [...clusterTotals.entries()]
    .map(([cluster, t]) => ({ cluster, ...t, clicksPerPage: Math.round((t.clicks / t.pages) * 10) / 10 }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  const report = {
    generated: new Date().toISOString().slice(0, 10),
    siteUrl,
    days: DAYS,
    totals: {
      clicks: pages.reduce((s, p) => s + p.clicks, 0),
      impressions: pages.reduce((s, p) => s + p.impressions, 0),
      pagesWithImpressions: pages.length,
      sitemapPages: sitemapPaths.length,
    },
    clusters,
    winners,
    nearMiss: nearMiss.map((p) => ({ ...p, topQueries: nearMissQueries[p.key] ?? [] })),
    lowCtr,
    zeroClick: zeroClick.map((p) => p.key),
    invisible,
    queries: queries.slice(0, 300),
  };

  mkdirSync("data/bing", { recursive: true });
  writeFileSync(`data/bing/${report.generated}.json`, JSON.stringify(report, null, 1) + "\n");
  writeFileSync("data/bing/latest.json", JSON.stringify(report, null, 1) + "\n");

  if (flag("json")) {
    console.log(JSON.stringify(report, null, 1));
    return;
  }

  const row = (a: Agg) =>
    `${String(a.clicks).padStart(4)} clk ${String(a.impressions).padStart(6)} imp  pos ${String(a.position).padStart(5)}  ctr ${String(a.ctr).padStart(4)}%  ${a.key}`;
  console.log(`Bing, last ${DAYS} days (${siteUrl}): ${report.totals.clicks} clicks, ${report.totals.impressions} impressions, ${pages.length}/${sitemapPaths.length} sitemap pages seen\n`);
  console.log("CLUSTERS (double down on the top rows; stop adding pages to rows with 0 clicks)");
  for (const c of clusters)
    console.log(`  ${String(c.clicks).padStart(4)} clk ${String(c.impressions).padStart(6)} imp  ${String(c.pages).padStart(3)} pages  ${c.cluster}`);
  console.log(`\nWINNERS: ${winners.length} pages with clicks (never rewrite their title/intro; build their cluster)`);
  winners.slice(0, 40).forEach((p) => console.log("  " + row(p)));
  console.log(`\nNEAR MISSES: ${nearMiss.length} pages on page 1-2 with 0 clicks (retitle to the top query)`);
  for (const p of nearMiss.slice(0, 30)) {
    console.log("  " + row(p));
    for (const q of nearMissQueries[p.key] ?? []) console.log(`        ↳ ${q.impressions} imp pos ${q.position}  "${q.key}"`);
  }
  console.log(`\nLOW CTR: ${lowCtr.length} top-10 pages under 2% CTR (title/description don't match the query)`);
  lowCtr.forEach((p) => console.log("  " + row(p)));
  console.log(`\nINVISIBLE: ${invisible.length} sitemap pages Bing never showed (IndexNow them; don't make more like them)`);
  invisible.slice(0, 60).forEach((p) => console.log("  " + p));
  console.log(`\nTOP QUERIES`);
  queries.slice(0, 40).forEach((q) => console.log("  " + row(q)));
  console.log(`\nSaved data/bing/${report.generated}.json and data/bing/latest.json`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
