/**
 * Content integrity checks for article data.
 *
 * 1. Every `pullQuote` must trace back to prose that already exists in its own
 *    section body — pull quotes are lifted, never newly authored.
 * 2. Every comparison table row must supply exactly one value per column.
 * 3. Roundups meet the buyer's-guide format: enough prose, 5 mistakes, 6+ FAQs,
 *    5+ products with well-formed ASINs, and related links that resolve.
 *
 * Run with: npx tsx scripts/verify-content.ts
 */
import { reviews } from "../data/reviews";
import { guides } from "../data/guides";
import { roundups } from "../data/roundups";
import { ContentSection, ComparisonTableData } from "../lib/types";

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

console.log(
  `Checked ${quotesChecked} pull quotes and ${tablesChecked} tables across ` +
    `${reviews.length} reviews + ${guides.length} guides + ${roundups.length} roundups.`
);
if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("All content integrity checks passed.");
