/**
 * Fails when a public page has no Markdown copy.
 *
 * 1. Every page.tsx in app/ maps to a pattern in lib/md/routes (or is on
 *    SKIP_PATTERNS with a reason), and every pattern still has a page.
 * 2. Every concrete URL those pages generate (generateStaticParams) renders
 *    as Markdown, unless it's on SKIP_PATHS with a reason.
 * 3. The Markdown route list (llms.txt, the catalog) and sitemap.xml list
 *    exactly the same pages.
 *
 * Run with: npm run check:markdown
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { MD_ROUTE_PATTERNS } from "../lib/md/routes";
import { listMarkdownRoutes, resolveMarkdown } from "../lib/md/registry";
import { site } from "../lib/site";
import sitemap from "../app/sitemap";

/** Page routes with no Markdown copy, and why. */
const SKIP_PATTERNS: Record<string, string> = {};

/** Concrete URLs with no Markdown copy of their own, and why. */
const SKIP_PATHS: Record<string, string> = {
  "/reviews/mane-n-tail-shampoo":
    "redirects to /mane-n-tail-shampoo-read-first (next.config.ts); its .md redirects to that page's copy",
};

const APP = join(__dirname, "..", "app");
let failures = 0;
const fail = (msg: string) => {
  console.error(`✗ ${msg}`);
  failures++;
};

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name.startsWith("_") ? [] : pageFiles(full);
    return /^page\.(tsx|ts|jsx|js|mdx)$/.test(name) ? [full] : [];
  });
}

/** app/reviews/[slug]/page.tsx -> /reviews/:slug (route groups dropped). */
function toPattern(file: string): string {
  const segs = relative(APP, file)
    .split(sep)
    .slice(0, -1)
    .filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith("@"))
    .map((s) => s.replace(/^\[\[?\.\.\.(\w+)\]?\]$/, ":$1*").replace(/^\[(\w+)\]$/, ":$1"));
  return `/${segs.join("/")}`;
}

async function main() {
  const known = new Set<string>(MD_ROUTE_PATTERNS);
  const pages = pageFiles(APP).map((file) => ({ file, pattern: toPattern(file) }));
  const concrete: string[] = [];

  for (const { file, pattern } of pages) {
    if (SKIP_PATTERNS[pattern]) continue;
    if (!known.has(pattern)) {
      fail(`${relative(process.cwd(), file)} (${pattern}) has no Markdown renderer: add it to lib/md/routes.ts and lib/md/registry.ts, or to SKIP_PATTERNS with a reason`);
      continue;
    }
    if (!pattern.includes(":")) {
      concrete.push(pattern);
      continue;
    }
    const mod = await import(pathToFileURL(file).href);
    if (typeof mod.generateStaticParams !== "function") {
      fail(`${pattern} is dynamic but has no generateStaticParams, so its URLs can't be checked`);
      continue;
    }
    for (const params of (await mod.generateStaticParams()) as Record<string, string>[])
      concrete.push(pattern.replace(/:(\w+)/g, (_, k: string) => params[k]));
  }

  for (const pattern of MD_ROUTE_PATTERNS)
    if (!pages.some((p) => p.pattern === pattern)) fail(`lib/md/routes.ts lists ${pattern}, but no page in app/ serves it`);

  for (const path of concrete) {
    if (SKIP_PATHS[path]) continue;
    const result = resolveMarkdown(path);
    if (!result) fail(`${path} renders no Markdown`);
    else if ("redirect" in result) fail(`${path} redirects (${result.redirect}); add it to SKIP_PATHS with a reason if that's intended`);
  }

  const listed = new Set(listMarkdownRoutes().map((r) => r.path));
  const inSitemap = new Set(sitemap().map((e) => e.url.replace(site.url, "") || "/"));
  for (const path of inSitemap) if (!listed.has(path)) fail(`${path} is in sitemap.xml but not in listMarkdownRoutes()`);
  for (const path of listed) if (!inSitemap.has(path)) fail(`${path} is in listMarkdownRoutes() but not in sitemap.xml`);
  for (const path of concrete) if (!SKIP_PATHS[path] && !listed.has(path)) fail(`${path} is a page but not in listMarkdownRoutes()`);

  console.log(
    `${pages.length} page files, ${concrete.length} URLs, ${listed.size} Markdown routes, ${inSitemap.size} sitemap URLs, ${Object.keys(SKIP_PATHS).length + Object.keys(SKIP_PATTERNS).length} skipped`,
  );
  if (failures) {
    console.error(`${failures} problem(s)`);
    process.exit(1);
  }
  console.log("✓ every public page has a Markdown copy");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
