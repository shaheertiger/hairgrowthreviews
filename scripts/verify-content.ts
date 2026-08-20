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

console.log(
  `Checked ${quotesChecked} pull quotes and ${tablesChecked} tables across ` +
    `${reviews.length} reviews + ${guides.length} guides.`
);
if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log("All content integrity checks passed.");
