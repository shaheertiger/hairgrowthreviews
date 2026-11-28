/**
 * Content integrity checks for article data.
 *
 * 1. Every `pullQuote` must trace back to prose that already exists in its own
 *    section body — pull quotes are lifted, never newly authored.
 * 2. Every comparison table row must supply exactly one value per column.
 * 3. Roundups meet the buyer's-guide format: enough prose, 5 mistakes, 6+ FAQs,
 *    5+ products with well-formed ASINs, and related links that resolve.
 * 4. Every internal link the data declares (related reviews, guides, guide
 *    hrefs, in-text link targets) points at a page that exists.
 * 5. Every roundup, review and question is the target of an in-text link rule.
 * 6. Every "best" roundup opens with a one-sentence definition ("The best X is …").
 * 7-10. The click rules in SEO-RULES.md / lib/seo-rules.ts: winners' titles are
 *    frozen, "best" titles follow the winning pattern, descriptions name brands,
 *    reviews and guides have a quick answer.
 *
 * Run with: npx tsx scripts/verify-content.ts
 */
import { reviews } from "../data/reviews";
import { guides } from "../data/guides";
import { roundups } from "../data/roundups";
import { questions } from "../data/questions";
import { ContentSection, ComparisonTableData } from "../lib/types";
import { guideHref, guideSectionHref, questionHref, reviewHref, roundupHref } from "../lib/links";
import { autolinkTargets } from "../lib/autolink";
import { MAX_TITLE, WINNERS } from "../lib/seo-rules";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

let failures = 0;
let quotesChecked = 0;
let tablesChecked = 0;

function checkTable(where: string, table: ComparisonTableData) {
  tablesChecked++;
  for (const row of table.rows) {
    if (row.values.length !== table.columns.length) {
      console.error(
        `TABLE MISMATCH ${where} row "${row.label}": ${row.values.length} values vs ${table.columns.length} columns`
      );
      failures++;
    }
  }
}

function checkSections(where: string, sections: ContentSection[]) {
  for (const section of sections) {
    if (section.pullQuote) {
      quotesChecked++;
      const haystack = normalize(
        [...section.body, ...(section.subsections?.flatMap((s) => s.body) ?? [])].join(" ")
      );
      if (!haystack.includes(normalize(section.pullQuote))) {
        console.error(`UNSOURCED QUOTE ${where} #${section.id}:\n   "${section.pullQuote}"`);
        failures++;
      }
    }
    if (section.table) checkTable(`${where} #${section.id}`, section.table);
  }
}

for (const r of reviews) {
  checkSections(`review:${r.slug}`, r.sections);
  if (r.comparisonTable) checkTable(`review:${r.slug} (top-level)`, r.comparisonTable);
}
for (const g of guides) {
  checkSections(`guide:${g.slug}`, g.sections);
  if (g.comparisonTable) checkTable(`guide:${g.slug} (top-level)`, g.comparisonTable);
}

// Roundup format gates. Prose counted: intro, sections, product write-ups,
// mistakes, FAQ answers and the bottom line — not specs, pros/cons or tables.
const MIN_ROUNDUP_WORDS = 3000;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const roundupSlugs = new Set<string>();
const reservedSlugs = new Set(["best", "reviews", "about", "contact", "privacy", "terms", "the-hgr-regimen", "find-a-treatment", "about-hair-growth", "mane-n-tail-shampoo-read-first"]);
const productIds = new Map<string, string>();

function fail(msg: string) {
  console.error(msg);
  failures++;
}

for (const r of roundups) {
  const where = `roundup:${r.slug}`;
  if (roundupSlugs.has(r.slug)) fail(`DUPLICATE SLUG ${where}`);
  if (reservedSlugs.has(r.slug)) fail(`RESERVED SLUG ${where}`);
  roundupSlugs.add(r.slug);

  checkSections(where, r.sections);
  if (r.comparisonTable) checkTable(`${where} (top-level)`, r.comparisonTable);

  const prose = [
    ...r.intro,
    ...r.sections.flatMap((s) => [...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])]),
    ...r.products.flatMap((p) => p.description),
    ...r.mistakes.map((m) => m.body),
    ...r.faq.map((f) => f.a),
    r.bottomLine,
  ].join(" ");
  const count = words(prose);
  if (count < MIN_ROUNDUP_WORDS) fail(`TOO SHORT ${where}: ${count} words (min ${MIN_ROUNDUP_WORDS})`);

  if (r.products.length < 5) fail(`TOO FEW PRODUCTS ${where}: ${r.products.length}`);
  if (r.mistakes.length !== 5) fail(`MISTAKES ${where}: ${r.mistakes.length} (need exactly 5)`);
  if (r.faq.length < 6) fail(`FAQ ${where}: ${r.faq.length} (need 6+)`);
  if (r.picksAfter < 1 || r.picksAfter >= r.sections.length) fail(`PICKS POSITION ${where}: picksAfter=${r.picksAfter}`);
  if (r.metaDescription.length > 165) fail(`META TOO LONG ${where}: ${r.metaDescription.length} chars`);

  const sectionIds = new Set<string>();
  for (const s of r.sections) {
    if (sectionIds.has(s.id) || ["overview", "top-picks", "comparison", "mistakes", "faq", "bottom-line"].includes(s.id))
      fail(`SECTION ID CLASH ${where} #${s.id}`);
    sectionIds.add(s.id);
  }
  for (const p of r.products) {
    if (sectionIds.has(p.id)) fail(`PRODUCT ID CLASHES WITH SECTION ${where} #${p.id}`);
    if (p.asin && !/^B0[0-9A-Z]{8}$|^[0-9]{9}[0-9X]$/.test(p.asin)) fail(`BAD ASIN ${where} #${p.id}: ${p.asin}`);
    if (p.score < 1 || p.score > 5) fail(`BAD SCORE ${where} #${p.id}: ${p.score}`);
    const key = `${r.slug}#${p.id}`;
    if (productIds.has(key)) fail(`DUPLICATE PRODUCT ID ${key}`);
    productIds.set(key, p.name);
  }
}

for (const r of roundups) {
  for (const slug of r.relatedRoundups) {
    if (!roundupSlugs.has(slug)) fail(`BROKEN RELATED ROUNDUP roundup:${r.slug} -> ${slug}`);
  }
  for (const slug of r.relatedReviewSlugs ?? []) {
    if (!reviews.some((x) => x.slug === slug)) fail(`BROKEN RELATED REVIEW roundup:${r.slug} -> ${slug}`);
  }
}

// Question-post gates: a snippet-length short answer, enough prose to rank,
// and links that resolve — above all the buyer's guide the post feeds.
const MIN_QUESTION_WORDS = 2000;
for (const q of questions) {
  const where = `question:${q.slug}`;
  if (roundupSlugs.has(q.slug) || reservedSlugs.has(q.slug)) fail(`SLUG CLASH ${where}`);
  if (questions.filter((x) => x.slug === q.slug).length > 1) fail(`DUPLICATE SLUG ${where}`);
  checkSections(where, q.sections);
  const prose = [
    q.shortAnswer,
    ...q.intro,
    ...q.sections.flatMap((s) => [...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])]),
    ...q.faq.map((f) => f.a),
    q.bottomLine,
  ].join(" ");
  const count = words(prose);
  if (count < MIN_QUESTION_WORDS) fail(`TOO SHORT ${where}: ${count} words (min ${MIN_QUESTION_WORDS})`);
  const sa = words(q.shortAnswer);
  if (sa < 30 || sa > 75) fail(`SHORT ANSWER ${where}: ${sa} words (30-75)`);
  if (q.faq.length < 5) fail(`FAQ ${where}: ${q.faq.length} (need 5+)`);
  if (q.metaDescription.length > 165) fail(`META TOO LONG ${where}`);
  if (!roundupSlugs.has(q.pillarSlug)) fail(`BROKEN PILLAR ${where} -> ${q.pillarSlug}`);
  for (const s of q.relatedRoundups) if (!roundupSlugs.has(s)) fail(`BROKEN RELATED ROUNDUP ${where} -> ${s}`);
  for (const s of q.relatedQuestions)
    if (!questions.some((x) => x.slug === s) || s === q.slug) fail(`BROKEN RELATED QUESTION ${where} -> ${s}`);
  for (const s of q.sections)
    if (["short-answer", "faq", "bottom-line"].includes(s.id)) fail(`SECTION ID CLASH ${where} #${s.id}`);
}

// Internal links: everything the data points at must be a real page.
const pagePaths = new Set<string>([
  "/", "/best", "/answers", "/reviews", ...Object.values(guideSectionHref),
  ...reviews.map((r) => reviewHref(r.slug)),
  ...guides.map(guideHref),
  ...roundups.map((r) => roundupHref(r.slug)),
  ...questions.map((q) => questionHref(q.slug)),
]);
const checkHref = (where: string, href: string) => {
  if (!pagePaths.has(href.split("#")[0])) fail(`BROKEN LINK ${where} -> ${href}`);
};
for (const r of reviews)
  for (const s of r.relatedSlugs)
    if (!reviews.some((x) => x.slug === s) || s === r.slug) fail(`BROKEN RELATED REVIEW review:${r.slug} -> ${s}`);
for (const g of guides) {
  for (const s of g.relatedSlugs)
    if (!guides.some((x) => x.slug === s) || s === g.slug) fail(`BROKEN RELATED GUIDE guide:${g.slug} -> ${s}`);
  for (const s of g.relatedReviewSlugs ?? [])
    if (!reviews.some((x) => x.slug === s)) fail(`BROKEN RELATED REVIEW guide:${g.slug} -> ${s}`);
}
for (const r of roundups) for (const g of r.relatedGuides ?? []) checkHref(`roundup:${r.slug}`, g.href);
for (const q of questions) for (const g of q.relatedGuides ?? []) checkHref(`question:${q.slug}`, g.href);
for (const t of autolinkTargets) checkHref("autolink rule", t);

// 5. Every article can earn in-text links. Pages that earn clicks (best-batana-oil,
//    best-pumpkin-seed-oil-for-hair-loss) are linked from 15+ other articles' prose;
//    a page no autolink rule targets can only ever get card links.
const linkable = new Set(autolinkTargets);
for (const r of roundups) if (!linkable.has(roundupHref(r.slug))) fail(`NO IN-TEXT LINK RULE roundup:${r.slug} (add a phrase in lib/autolink.tsx)`);
for (const r of reviews) if (!linkable.has(reviewHref(r.slug))) fail(`NO IN-TEXT LINK RULE review:${r.slug} (add a phrase in lib/autolink.tsx)`);
for (const q of questions) if (!linkable.has(questionHref(q.slug))) fail(`NO IN-TEXT LINK RULE question:${q.slug} (add a phrase in lib/autolink.tsx)`);
// 6. "Best X" roundups open answer-first with a one-sentence definition of the
//    best pick ("The best pumpkin seed oil for hair loss is a plain, cold-pressed
//    softgel…"), the snippet-style opener every click-earning roundup uses.
for (const r of roundups)
  if (r.slug.startsWith("best-") && !/^The best /.test(r.intro[0]))
    fail(`NOT ANSWER-FIRST roundup:${r.slug}: intro should open "The best … is …"`);

// 7-10. SEO-RULES.md, from what Bing and Vercel show earning clicks.
//  7. Winners keep their titles (extend them, never retitle them).
const titleOf = new Map<string, string>([
  ...roundups.map((r) => [roundupHref(r.slug), r.metaTitle] as [string, string]),
  ...reviews.map((r) => [reviewHref(r.slug), r.metaTitle] as [string, string]),
  ...questions.map((q) => [questionHref(q.slug), q.metaTitle] as [string, string]),
  ...guides.map((g) => [guideHref(g), g.metaTitle] as [string, string]),
]);
for (const [path, w] of Object.entries(WINNERS)) {
  if (!titleOf.has(path)) fail(`WINNER MISSING ${path} (SEO-RULES.md: never delete or move a winner)`);
  else if (titleOf.get(path) !== w.title)
    fail(`WINNER RETITLED ${path}: "${titleOf.get(path)}" (frozen: "${w.title}"; see lib/seo-rules.ts)`);
}
//  8. "Best X" titles carry the year, a count and the review modifier, like the
//     batana winner ("Best Batana Oil for Hair Growth (2026): 6 Brands Reviewed").
for (const r of roundups) {
  if (!r.slug.startsWith("best-") || WINNERS[roundupHref(r.slug)]) continue;
  if (!/\(20\d\d\): \d+ .*Review/.test(r.metaTitle))
    fail(`TITLE PATTERN roundup:${r.slug}: "${r.metaTitle}" (want "Best X (YEAR): N … Reviewed")`);
}
for (const [path, t] of titleOf) if (!WINNERS[path] && t.length > MAX_TITLE) fail(`TITLE TOO LONG ${path}: ${t.length} chars (max ${MAX_TITLE})`);
//  9. Roundup descriptions name at least two of the brands they rank (brand
//     names are what review-intent searchers type).
for (const r of roundups) {
  if (WINNERS[roundupHref(r.slug)]) continue;
  const brands = [...new Set(r.products.map((p) => p.brand))];
  const named = brands.filter((b) => r.metaDescription.toLowerCase().includes(b.toLowerCase().split(/[ ']/)[0]));
  if (named.length < 2) fail(`DESCRIPTION NAMES ${named.length} BRANDS roundup:${r.slug} (name 2+ of: ${brands.slice(0, 4).join(", ")})`);
}
// 11. Two-way cluster links (SEO-RULES.md §0): every roundup is listed in at least one OTHER
//     roundup's relatedRoundups, so its pillar links back to it, the way best-batana-oil links
//     its brand-check page and spin-offs. A guide that only links out is a dead end.
for (const r of roundups)
  if (!roundups.some((x) => x.slug !== r.slug && x.relatedRoundups.includes(r.slug)))
    fail(`NO CLUSTER LINK BACK roundup:${r.slug} (add it to its pillar's relatedRoundups)`);
// 12. The rest of the playbook's structure (SEO-RULES.md §0.2-0.3), sitewide: every roundup links
//     out to 5+ sibling guides and to at least one question post or guide, carries a section
//     table and a comparison table; every question post lists the guide it feeds.
for (const r of roundups) {
  if (r.relatedRoundups.length < 5) fail(`FEW RELATED ROUNDUPS roundup:${r.slug}: ${r.relatedRoundups.length} (need 5+)`);
  if (!r.relatedGuides?.length) fail(`NO RELATED GUIDES roundup:${r.slug} (link its question posts / guides)`);
  if (!r.sections.some((s) => s.table)) fail(`NO SECTION TABLE roundup:${r.slug}`);
  if (!r.comparisonTable) fail(`NO COMPARISON TABLE roundup:${r.slug}`);
}
for (const q of questions)
  if (!q.relatedRoundups.includes(q.pillarSlug)) fail(`PILLAR NOT IN RELATED question:${q.slug} (add ${q.pillarSlug})`);
// 10. Every review and guide opens answer-first with a quick answer.
for (const r of reviews) if (!r.quickAnswer) fail(`NO QUICK ANSWER review:${r.slug}`);
for (const g of guides) if (!g.quickAnswer) fail(`NO QUICK ANSWER guide:${g.slug}`);

console.log(
  `Checked ${quotesChecked} pull quotes and ${tablesChecked} tables across ` +
    `${reviews.length} reviews + ${guides.length} guides + ${roundups.length} roundups + ${questions.length} questions.`
);
if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("All content integrity checks passed.");
