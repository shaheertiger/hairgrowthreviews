/**
 * Responses for the Markdown endpoint and the site-level text files. Every
 * Markdown response carries the same headers, so agents can rely on them.
 */
import { abs, isoDate } from "./format";

/** CDN cache lifetimes, in seconds. */
export const CACHE = {
  /** Content pages: an hour fresh, a day stale-while-revalidate. */
  page: "public, s-maxage=3600, stale-while-revalidate=86400",
  /** Static pages and llms.txt / ai.txt: a day fresh, a week stale. */
  static: "public, s-maxage=86400, stale-while-revalidate=604800",
  /** Not-found bodies: short, so a page published later shows up quickly. */
  missing: "public, s-maxage=300",
} as const;

export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Access-Control-Expose-Headers": "Content-Location, Link, X-Markdown-Tokens, Last-Modified",
};

const tokens = (body: string) => String(Math.ceil(body.length / 4));
const httpDate = (date?: string) => new Date(`${isoDate(date)}T00:00:00Z`).toUTCString();

export function markdownResponse(
  body: string,
  { path, status = 200, updated, cache = CACHE.page }: { path?: string; status?: number; updated?: string; cache?: string },
): Response {
  const headers: Record<string, string> = {
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Markdown-Tokens": tokens(body),
    "X-Robots-Tag": "noindex, follow",
    "Cache-Control": cache,
    // The same URL can answer with HTML or Markdown depending on Accept.
    Vary: "Accept",
    ...CORS,
  };
  if (path !== undefined) {
    headers["Content-Location"] = abs(path);
    headers.Link = `<${abs(path)}>; rel="canonical"`;
    headers["Last-Modified"] = httpDate(updated);
  }
  return new Response(body, { status, headers });
}

export function notFoundMarkdown(path: string): Response {
  const body = `# Page not found\n\n> There is no page at ${abs(path)}.\n\nSee ${abs("/llms.txt")} for every page on this site, or ${abs("/api/md/_catalog")} for the full Markdown catalog.\n`;
  return markdownResponse(body, { status: 404, cache: CACHE.missing });
}

/** Permanent redirect to another page's Markdown copy; `location` is a site path, so it works on any host. */
export function redirectMarkdown(location: string): Response {
  return new Response(null, { status: 308, headers: { Location: location, Vary: "Accept", ...CORS } });
}

export function preflight(): Response {
  return new Response(null, { status: 204, headers: { ...CORS, "Access-Control-Max-Age": "86400" } });
}

/** text/plain for llms.txt, llms-full.txt, ai.txt and robots.txt. */
export function textResponse(body: string, cache: string = CACHE.static): Response {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": cache, ...CORS },
  });
}
