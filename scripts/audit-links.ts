/**
 * Internal-link report built from the real build output: crawls every
 * prerendered page in .next and reports broken links, orphans and weakly
 * linked pages. Run after `npm run build`:  npm run audit:links
 *
 * "Body" links exclude the header/footer, which link the same pages sitewide.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = ".next/server/app";
if (!existsSync(root)) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(1);
}

const files: string[] = [];
(function walk(dir: string) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) files.push(p);
  }
})(root);

const pathOf = (f: string) => {
  const p = f.slice(root.length).replace(/\.html$/, "");
  return p === "/index" ? "/" : p;
};
const pages = new Map<string, string>();
for (const f of files) {
  const p = pathOf(f);
  if (!p.startsWith("/_")) pages.set(p, readFileSync(f, "utf8"));
}

const redirects: Record<string, string> = { "/reviews/mane-n-tail-shampoo": "/mane-n-tail-shampoo-read-first" };
const hrefs = (html: string) =>
  [...html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)].map((m) => m[1].replace(/\/$/, "") || "/");
const body = (html: string) => {
  const main = html.replace(/<header[\s\S]*?<\/header>/, "").replace(/<footer[\s\S]*?<\/footer>/, "");
  return main;
};

const inbound = new Map<string, Set<string>>([...pages.keys()].map((p) => [p, new Set()]));
const broken: string[] = [];
const viaRedirect: string[] = [];
let inText = 0;
for (const [from, html] of pages) {
  for (const to of new Set(hrefs(body(html)))) {
    if (redirects[to]) viaRedirect.push(`${from} -> ${to}`);
    else if (!pages.has(to)) broken.push(`${from} -> ${to}`);
    else if (to !== from) inbound.get(to)!.add(from);
  }
  inText += [...html.matchAll(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?<a href="\//g)].length;
}

// Legal/contact pages are footer-only by design; redirected paths aren't live pages.
const skip = ["/", "/_not-found", "/404", "/500", "/contact", "/privacy", "/terms", ...Object.keys(redirects)];
const content = [...pages.keys()].filter((p) => !skip.includes(p));
const counts = content.map((p) => ({ p, n: inbound.get(p)!.size })).sort((a, b) => a.n - b.n);
console.log(`${pages.size} pages crawled, ${inText} paragraphs carry in-text links.`);
console.log(`Broken: ${broken.length}`);
broken.forEach((b) => console.log("  " + b));
console.log(`Links through a redirect: ${viaRedirect.length}`);
viaRedirect.slice(0, 10).forEach((b) => console.log("  " + b));
const weak = counts.filter((c) => c.n < 3);
console.log(`Pages with fewer than 3 in-body inbound links: ${weak.length}`);
weak.forEach((c) => console.log(`  ${c.n}  ${c.p}`));
const n = counts.map((c) => c.n);
console.log(`Inbound body links per page: min ${n[0]}, median ${n[Math.floor(n.length / 2)]}, max ${n[n.length - 1]}`);
process.exit(broken.length ? 1 : 0);
