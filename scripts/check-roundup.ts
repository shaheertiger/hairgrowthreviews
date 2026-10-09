/**
 * Checks one roundup file against the buyer's-guide gates before it is
 * registered in data/roundups/index.ts (verify:content runs the full set).
 *
 *   npx tsx scripts/check-roundup.ts data/roundups/best-minoxidil-for-men.ts
 */
import { resolve } from "path";
import { pathToFileURL } from "url";
import type { RoundupData } from "../lib/types";

const norm = (s: string) =>
  s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npx tsx scripts/check-roundup.ts <file>");
  const mod = await import(pathToFileURL(resolve(file)).href);
  const r = Object.values(mod)[0] as RoundupData;
  const problems: string[] = [];

  const prose = [
    ...r.intro,
    ...r.sections.flatMap((s) => [...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])]),
    ...r.products.flatMap((p) => p.description),
    ...r.mistakes.map((m) => m.body),
    ...r.faq.map((f) => f.a),
    r.bottomLine,
  ].join(" ");
  const count = words(prose);
  if (count < 3000) problems.push(`too short: ${count} words (min 3000)`);
  if (r.products.length < 5) problems.push(`only ${r.products.length} products (min 5)`);
  if (r.mistakes.length !== 5) problems.push(`${r.mistakes.length} mistakes (need exactly 5)`);
  if (r.faq.length < 6) problems.push(`${r.faq.length} FAQs (need 6+)`);
  if (r.picksAfter < 1 || r.picksAfter >= r.sections.length) problems.push(`picksAfter=${r.picksAfter} out of range`);
  if (r.metaDescription.length > 165) problems.push(`metaDescription ${r.metaDescription.length} chars (max 165)`);
  if (r.metaTitle.length > 70) problems.push(`metaTitle ${r.metaTitle.length} chars (aim <= 65)`);
  for (const s of r.sections) {
    if (s.pullQuote) {
      const hay = norm([...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])].join(" "));
      if (!hay.includes(norm(s.pullQuote))) problems.push(`pullQuote in #${s.id} is not verbatim from its body`);
    }
    for (const row of s.table?.rows ?? [])
      if (row.values.length !== s.table!.columns.length) problems.push(`table row "${row.label}" in #${s.id} has wrong column count`);
  }
  for (const row of r.comparisonTable?.rows ?? [])
    if (row.values.length !== r.comparisonTable!.columns.length) problems.push(`comparison row "${row.label}" has wrong column count`);
  for (const p of r.products) {
    if (!p.asin) problems.push(`product ${p.id} has no asin`);
    else if (!/^B0[0-9A-Z]{8}$|^[0-9]{9}[0-9X]$/.test(p.asin)) problems.push(`product ${p.id} asin malformed: ${p.asin}`);
  }

  console.log(`${r.slug}: ${count} words, ${r.products.length} products, ${r.faq.length} FAQs`);
  if (problems.length) {
    console.log("PROBLEMS:\n  " + problems.join("\n  "));
    process.exit(1);
  }
  console.log("OK");
}
main();
