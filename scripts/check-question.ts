/**
 * Checks one question post against the gates before it is registered in
 * data/questions/index.ts (verify:content runs the full set).
 *
 *   npx tsx scripts/check-question.ts data/questions/how-long-does-minoxidil-take-to-work.ts
 */
import { resolve } from "path";
import { pathToFileURL } from "url";
import type { QuestionData } from "../lib/types";
import { roundups } from "../data/roundups";

const norm = (s: string) =>
  s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-").replace(/[^a-z0-9]+/g, " ").trim();
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Usage: npx tsx scripts/check-question.ts <file>");
  const mod = await import(pathToFileURL(resolve(file)).href);
  const q = Object.values(mod)[0] as QuestionData;
  const problems: string[] = [];
  const roundupSlugs = new Set(roundups.map((r) => r.slug));

  const prose = [
    q.shortAnswer,
    ...q.intro,
    ...q.sections.flatMap((s) => [...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])]),
    ...q.faq.map((f) => f.a),
    q.bottomLine,
  ].join(" ");
  const count = words(prose);
  if (count < 2000) problems.push(`too short: ${count} words (min 2000)`);
  const sa = words(q.shortAnswer);
  if (sa < 30 || sa > 75) problems.push(`shortAnswer is ${sa} words (30-75)`);
  if (q.faq.length < 5) problems.push(`${q.faq.length} FAQs (need 5+)`);
  if (q.metaDescription.length > 160) problems.push(`metaDescription ${q.metaDescription.length} chars (max 160)`);
  if (q.metaTitle.length > 65) problems.push(`metaTitle ${q.metaTitle.length} chars (max 65)`);
  if (roundupSlugs.has(q.slug)) problems.push(`slug clashes with a roundup`);
  if (!roundupSlugs.has(q.pillarSlug)) problems.push(`pillarSlug ${q.pillarSlug} is not a roundup`);
  for (const s of q.relatedRoundups) if (!roundupSlugs.has(s)) problems.push(`relatedRoundups: ${s} is not a roundup`);
  const ids = new Set<string>();
  for (const s of q.sections) {
    if (ids.has(s.id) || ["short-answer", "faq", "bottom-line"].includes(s.id)) problems.push(`section id clash #${s.id}`);
    ids.add(s.id);
    if (s.pullQuote) {
      const hay = norm([...s.body, ...(s.subsections?.flatMap((x) => x.body) ?? [])].join(" "));
      if (!hay.includes(norm(s.pullQuote))) problems.push(`pullQuote in #${s.id} is not verbatim from its body`);
    }
    for (const row of s.table?.rows ?? [])
      if (row.values.length !== s.table!.columns.length) problems.push(`table row "${row.label}" in #${s.id} has wrong column count`);
  }

  console.log(`${q.slug}: ${count} words, short answer ${sa} words, ${q.faq.length} FAQs, pillar ${q.pillarSlug}`);
  if (problems.length) {
    console.log("PROBLEMS:\n  " + problems.join("\n  "));
    process.exit(1);
  }
  console.log("OK");
}
main();
