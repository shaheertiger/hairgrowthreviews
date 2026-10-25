import { NextResponse, type NextRequest } from "next/server";
import { matchRoute, prefersMarkdown } from "@/lib/md/routes";
import { preflight } from "@/lib/md/http";

/**
 * Serves each page's Markdown copy from the one handler at /api/md:
 *
 *   /best.md, /reviews/crinagen.md, /index.md (home)  -> /api/md/<path>
 *   GET /best with Accept ranking text/markdown above text/html -> same
 *
 * Only content routes (lib/md/routes) are negotiated; everything else, and
 * any Accept header that doesn't prefer Markdown, gets the normal HTML. HTML
 * responses also advertise the site-level files for AI agents.
 */
const DESCRIBED_BY = ["/llms.txt", "/llms-full.txt", "/ai.txt"]
  .map((href) => `<${href}>; rel="describedby"; type="text/plain"`)
  .join(", ");

const mdEndpoint = (path: string, request: NextRequest) =>
  new URL(`/api/md${path === "/" ? "/index" : path}`, request.url);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isMarkdownUrl = pathname.endsWith(".md") || pathname === "/api/md" || pathname.startsWith("/api/md/");

  // CORS preflight for the Markdown copies (the static handler can't export OPTIONS).
  if (request.method === "OPTIONS" && isMarkdownUrl) return preflight();
  if (pathname.startsWith("/api/")) return NextResponse.next();

  if (pathname.endsWith(".md")) return NextResponse.rewrite(mdEndpoint(pathname.slice(0, -3), request));

  // Files (images, the IndexNow key, metadata routes) pass straight through.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const isContent = matchRoute(pathname) !== null;
  const readable = request.method === "GET" || request.method === "HEAD";
  if (isContent && readable && prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(mdEndpoint(pathname, request));
  }

  // No `Vary: Accept` here: Next sets Vary on app pages itself and drops
  // ours. The Markdown responses carry it, so caches never serve them as HTML.
  const response = NextResponse.next();
  response.headers.set("Link", DESCRIBED_BY);
  return response;
}

export const config = {
  // Not build assets or the site-level text files. /api/md is matched only to
  // answer CORS preflights.
  matcher: ["/((?!_next/|\\.well-known/|llms\\.txt|llms-full\\.txt|ai\\.txt|robots\\.txt|sitemap\\.xml).*)"],
};
