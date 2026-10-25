import type { Metadata } from "next";
import { mdUrl } from "./format";

/**
 * Head tags that point agents at a page's Markdown copy: the canonical URL,
 * `<link rel="alternate" type="text/markdown">` and `<meta name="ai-summary">`
 * (the meta description unless the page has a summary of its own).
 */
export function markdownMeta(path: string, aiSummary: string): Pick<Metadata, "alternates" | "other"> {
  return {
    alternates: { canonical: path, types: { "text/markdown": mdUrl(path) } },
    other: { "ai-summary": aiSummary },
  };
}
