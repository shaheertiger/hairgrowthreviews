/**
 * Content integrity checks for article data.
 *
 * 1. Every `pullQuote` must trace back to prose that already exists in its own
 *    section body — pull quotes are lifted, never newly authored.
 * 2. Every comparison table row must supply exactly one value per column.
 *
 * Run with: npx tsx scripts/verify-content.ts
 */
import { reviews } from "../data/reviews";
import { guides } from "../data/guides";
import { buyingGuides } from "../data/buying-guides";
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

const seenSlugs = new Set<string>();
for (const b of buyingGuides) {
  if (seenSlugs.has(b.slug)) {
    console.error(`DUPLICATE buying guide slug ${b.slug}`);
    failures++;
  }
  seenSlugs.add(b.slug);
  checkSections(`buying:${b.slug}`, b.sections);
  const ids = new Set<string>();
  for (const p of b.products) {
    if (ids.has(p.id)) {
      console.error(`DUPLICATE product id ${b.slug}#${p.id}`);
      failures++;
    }
    ids.add(p.id);
    if (p.score < 1 || p.score > 5) {
      console.error(`BAD SCORE ${b.slug}#${p.id}: ${p.score}`);
      failures++;
    }
    if (!p.asin && !p.amazonQuery) {
      console.error(`NO AMAZON LINK ${b.slug}#${p.id}`);
      failures++;
    }
  }
  for (const rel of b.relatedGuideSlugs) {
    if (!buyingGuides.some((g) => g.slug === rel)) {
      console.error(`BROKEN related guide ${b.slug} -> ${rel}`);
      failures++;
    }
  }
  for (const rel of b.relatedReviewSlugs ?? []) {
    if (!reviews.some((r) => r.slug === rel)) {
      console.error(`BROKEN related review ${b.slug} -> ${rel}`);
      failures++;
    }
  }
}

console.log(
  `Checked ${quotesChecked} pull quotes and ${tablesChecked} tables across ` +
    `${reviews.length} reviews + ${guides.length} guides + ${buyingGuides.length} buying guides.`
);
if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("All content integrity checks passed.");
