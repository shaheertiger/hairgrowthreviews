/**
 * /robots.txt, /llms.txt, /llms-full.txt and /ai.txt. All four are built
 * here from lib/site and the Markdown registry, so the crawl policy, the
 * site's identity and the page list agree everywhere.
 */
import { site } from "@/lib/site";
import { scientificReviewer } from "@/lib/reviewer";
import { listMarkdownRoutes, renderMarkdown, type MdGroup, type MdRouteInfo } from "./registry";
import { abs, esc, isoDate, link, mdUrl } from "./format";

/** Bump when the ai.txt policy or crawl rules change. */
const POLICY_UPDATED = "2026-10-25";

const FILES = ["/robots.txt", "/llms.txt", "/ai.txt"];
const syncNote = (self: string) =>
  `Keep in sync with ${FILES.filter((f) => f !== self).join(" and ")} (all three are generated from lib/md/site-files.ts).`;

export const crawlPolicy = {
  /** AI search and user-triggered agents: explicitly welcome. */
  aiSearch: ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"],
  /** Model-training crawlers we allow. */
  trainingAllowed: ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
  /** Crawlers kept off the whole site. */
  blocked: ["CCBot", "Bytespider"],
  /** Public paths under a private prefix. */
  publicPaths: ["/api/md/"],
  /** Never crawled by anyone. */
  privatePaths: ["/api/"],
};

/* ---------- robots.txt ---------- */

export function robotsTxt(): string {
  const rules = ["Allow: /", ...crawlPolicy.publicPaths.map((p) => `Allow: ${p}`), ...crawlPolicy.privatePaths.map((p) => `Disallow: ${p}`)];
  const group = (agents: string[], lines: string[]) => [...agents.map((a) => `User-agent: ${a}`), ...lines].join("\n");
  return [
    `# robots.txt for ${site.name}`,
    `# ${syncNote("/robots.txt")}`,
    `# AI agents: site index at ${abs("/llms.txt")}, full text at ${abs("/llms-full.txt")}, usage policy at ${abs("/ai.txt")}.`,
    `# Every page has a Markdown copy at its URL + ".md" (home: /index.md).`,
    "",
    "# AI search and user-triggered agents",
    group(crawlPolicy.aiSearch, rules),
    "",
    "# Model-training crawlers we allow",
    group(crawlPolicy.trainingAllowed, rules),
    "",
    "# Crawlers we block",
    group(crawlPolicy.blocked, ["Disallow: /"]),
    "",
    "# Everyone else",
    group(["*"], rules),
    "",
    `Sitemap: ${abs("/sitemap.xml")}`,
    "",
  ].join("\n");
}

/* ---------- llms.txt ---------- */

/** Most buyer's guides listed in llms.txt; the rest are on /best. */
const LLMS_ROUNDUP_CAP = 50;

const byDateDesc = (a: MdRouteInfo, b: MdRouteInfo) => isoDate(b.updated).localeCompare(isoDate(a.updated));

const keyFacts = () =>
  `${site.name} is an independent, reader-supported publisher at ${site.url}. It reviews hair loss and hair growth products and ranks them in buyer's guides, using ingredient research, published clinical evidence where it exists, and verified customer feedback. Articles are written by the ${site.name} editorial team and reviewed by ${scientificReviewer.name}, ${scientificReviewer.title}. The site earns affiliate commissions, including as an Amazon Associate; this does not influence ratings. Content is educational, not medical advice. Contact: ${site.contactUrl} (${site.contactEmail}).`;

export function llmsTxt(): string {
  const routes = listMarkdownRoutes();
  const inGroup = (g: MdGroup) => routes.filter((r) => r.group === g);
  const line = (r: MdRouteInfo, title = r.title) => `- ${link(title, mdUrl(r.path))}: ${esc(r.description)}`;
  const roundups = inGroup("roundups").sort(byDateDesc);

  return [
    `# ${site.name}`,
    `> ${site.tagline}. ${site.description}`,
    keyFacts(),
    `## Core pages\n\n${inGroup("core")
      .map((r) => line(r, r.path === "/" ? "Home" : r.title))
      .join("\n")}`,
    `## Guides\n\n${inGroup("guides").map((r) => line(r)).join("\n")}`,
    `## Buyer's guides\n\n${roundups
      .slice(0, LLMS_ROUNDUP_CAP)
      .map((r) => line(r))
      .join("\n")}${
      roundups.length > LLMS_ROUNDUP_CAP
        ? `\n\nThe ${LLMS_ROUNDUP_CAP} most recently updated of ${roundups.length} buyer's guides. All of them: ${link("Best Picks", mdUrl("/best"))}.`
        : ""
    }`,
    `## Product reviews\n\n${inGroup("reviews").map((r) => line(r)).join("\n")}`,
    `## Hair answers\n\n${inGroup("answers").map((r) => line(r)).join("\n")}`,
    [
      "## Machine-readable",
      "",
      `- ${link("Full content", "/llms-full.txt")}: the pages above as one Markdown file`,
      `- ${link("Markdown catalog", "/api/md/_catalog")}: every page with its HTML and Markdown URL (JSON)`,
      `- ${link("Sitemap", "/sitemap.xml")}`,
      `- ${link("AI usage policy", "/ai.txt")}`,
      "- Any page as Markdown: add `.md` to its URL (home: /index.md) or send `Accept: text/markdown`",
    ].join("\n"),
    `## Optional\n\n${inGroup("legal").map((r) => line(r)).join("\n")}`,
    `<!-- ${syncNote("/llms.txt")} -->`,
  ].join("\n\n") + "\n";
}

/* ---------- llms-full.txt ---------- */

/** Size budget for llms-full.txt, in characters. */
export const LLMS_FULL_BUDGET = 500_000;

export function llmsFullTxt(): string {
  const routes = listMarkdownRoutes();
  const inGroup = (...groups: MdGroup[]) => routes.filter((r) => groups.includes(r.group));
  const render = (r: MdRouteInfo) => `<!-- source: ${abs(r.path)} -->\n${renderMarkdown(r.path)?.body ?? ""}`;

  const head = inGroup("core", "guides").map(render);
  const tail = inGroup("legal").map(render);
  const content = inGroup("roundups", "reviews", "answers").sort(byDateDesc);

  // Newest buyer's guides, reviews and answers until the budget is spent
  // (leaving room for the header).
  let used = [...head, ...tail].reduce((n, s) => n + s.length + 5, 2_000);
  const body: string[] = [];
  for (const r of content) {
    const page = render(r);
    if (used + page.length + 5 > LLMS_FULL_BUDGET) break;
    body.push(page);
    used += page.length + 5;
  }

  const header = [
    `# ${site.name} - full content`,
    `> ${site.description}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    `Core pages, guides and legal pages in full, plus the ${body.length} most recently updated of ${content.length} buyer's guides, product reviews and answers, to stay under ${LLMS_FULL_BUDGET.toLocaleString("en-US")} characters. Every page is listed in ${abs("/llms.txt")} and ${abs("/api/md/_catalog")}, and each one has a Markdown copy at its URL + ".md".`,
  ].join("\n\n");

  const out = [header, ...head, ...body, ...tail].join("\n\n---\n\n");
  if (out.length > LLMS_FULL_BUDGET) console.warn(`llms-full.txt is ${out.length} characters, over the ${LLMS_FULL_BUDGET} budget`);
  return out;
}

/* ---------- ai.txt ---------- */

export function aiTxt(): string {
  const include = ["/", ...crawlPolicy.publicPaths];
  return [
    `# ai.txt for ${site.name}`,
    "# Format: ai.txt specification v1.1.1 (ai-visibility.org.uk)",
    `# ${syncNote("/ai.txt")}`,
    "spec-version: 1.1.1",
    "",
    "[identity]",
    `name: ${site.name}`,
    `url: ${site.url}`,
    `description: ${site.description}`,
    `contact: ${site.contactUrl}`,
    `email: ${site.contactEmail}`,
    "",
    "[permissions]",
    "summarise: allowed",
    "quote: allowed with attribution",
    "cite: allowed",
    "index: allowed (search and answer engines)",
    `train: allowed for ${crawlPolicy.trainingAllowed.join(", ")}; not allowed for ${crawlPolicy.blocked.join(", ")} (see robots.txt)`,
    "",
    "[restrictions]",
    "fabricated-quotes: not allowed; quote only text that appears on our pages",
    "fake-reviews: not allowed; do not invent reviews, ratings, scores, prices or verdicts, or attribute ones to us that we did not publish",
    "misattribution: not allowed; do not present our content as the model's own",
    "private-data: no training on user-generated or private data",
    "medical-advice: our content is educational and not medical advice; do not present it as a diagnosis or treatment plan",
    "",
    "[attribution]",
    `format: <page title> - ${site.name} (<canonical HTML URL>)`,
    "canonical: cite the HTML URL (the Canonical line of each Markdown copy), not the .md URL",
    "",
    "[scope]",
    ...include.map((p) => `include: ${p}`),
    ...crawlPolicy.privatePaths.map((p) => `exclude: ${p}`),
    `blocked-agents: ${crawlPolicy.blocked.join(", ")}`,
    `index: ${abs("/llms.txt")}`,
    `full-content: ${abs("/llms-full.txt")}`,
    `catalog: ${abs("/api/md/_catalog")}`,
    `sitemap: ${abs("/sitemap.xml")}`,
    "markdown: append .md to any page URL (home: /index.md) or send Accept: text/markdown",
    "",
    "[contact]",
    `url: ${site.contactUrl}`,
    `email: ${site.contactEmail}`,
    "",
    `Last updated: ${POLICY_UPDATED}`,
    "",
  ].join("\n");
}
