/**
 * Small Markdown builders shared by every renderer: escaping, absolute links,
 * lists, tables and the page frame (title, summary, canonical URL, date).
 */
import { site } from "@/lib/site";
import type { LinkSegment } from "@/lib/autolink";

/** Absolute HTML URL for a site path. */
export const abs = (path: string) => (path.startsWith("/") ? `${site.url}${path}` : path);

/** Site path of a page's Markdown copy (the home page is /index.md). */
export const mdPath = (path: string) => `${path === "/" ? "/index" : path.replace(/\/$/, "")}.md`;

/** Absolute URL of a page's Markdown copy. */
export const mdUrl = (path: string) => `${site.url}${mdPath(path)}`;

/** Escapes inline Markdown syntax in plain text. */
export function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/([*_`[\]<])/g, "\\$1")
    .replace(/^(\s*)([#>+-]|\d+\.)(\s)/, "$1\\$2$3");
}

/** An inline link; site paths become absolute HTML URLs. */
export function link(text: string, href: string): string {
  const url = abs(href).replace(/[()\s]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`);
  return `[${esc(text)}](${url})`;
}

/** A paragraph of linked runs from lib/autolink's segmenter. */
export const segments = (parts: LinkSegment[]) => parts.map((p) => (p.href ? link(p.text, p.href) : esc(p.text))).join("");

export const h = (level: 2 | 3 | 4, text: string) => `${"#".repeat(level)} ${esc(text)}`;

export const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");

export const numbered = (items: string[]) => items.map((item, i) => `${i + 1}. ${item}`).join("\n");

export const quote = (text: string) => `> ${text}`;

/** A GFM table. Cells are escaped plain text. */
export function table(columns: string[], rows: string[][]): string {
  const cell = (s: string) => esc(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${columns.map(cell).join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
  ].join("\n");
}

/** A "- [Title](url) - description" listing line. */
export const item = (title: string, href: string, description?: string) =>
  `- ${link(title, href)}${description ? ` - ${esc(description)}` : ""}`;

/** YYYY-MM-DD for ISO dates; month-only dates ("August 2026") fall back to the site-wide date the sitemap uses. */
export const isoDate = (date?: string) => (date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : site.staticLastModified);

export interface RelatedGroup {
  heading: string;
  items: string[];
}

export interface MdDoc {
  title: string;
  /** One-sentence summary; the page's meta description. */
  summary: string;
  /** Canonical site path of the HTML page. */
  path: string;
  updated?: string;
  /** Main content blocks in reading order, each a Markdown chunk. */
  blocks: (string | false | undefined | null)[];
  related?: RelatedGroup[];
}

/** Assembles one page: title, summary, canonical URL, date, content, related links. */
export function renderDoc(doc: MdDoc): string {
  const related = (doc.related ?? []).filter((g) => g.items.length > 0);
  const out = [
    `# ${esc(doc.title)}`,
    quote(esc(doc.summary)),
    `Canonical: ${abs(doc.path)}\nLast updated: ${isoDate(doc.updated)}`,
    ...doc.blocks.filter((b): b is string => !!b && b.trim().length > 0),
  ];
  if (related.length) {
    out.push("## Related");
    for (const g of related) out.push(`${h(3, g.heading)}\n\n${g.items.join("\n")}`);
  }
  return `${out.join("\n\n")}\n`;
}
