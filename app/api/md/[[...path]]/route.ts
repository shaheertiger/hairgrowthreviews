import { listMarkdownRoutes, resolveMarkdown } from "@/lib/md/registry";
import { CACHE, CORS, markdownResponse, notFoundMarkdown, redirectMarkdown } from "@/lib/md/http";
import { abs, mdUrl, renderDoc } from "@/lib/md/format";
import { site } from "@/lib/site";

// The one Markdown endpoint. proxy.ts rewrites /<page>.md and
// `Accept: text/markdown` requests here; /api/md/<path> also works directly.
// Every page is rendered at build time and refreshed hourly, never per request.
// Only GET is exported: a HEAD or OPTIONS export would make the route dynamic.
// Next answers HEAD from the cached GET, and proxy.ts answers CORS preflights.
export const dynamic = "force-static";
export const revalidate = 3600;

const CATALOG = "_catalog";
/** Pages whose copy rarely changes get the longer cache. */
const STATIC_PATHS = new Set(["/about", "/contact", "/privacy", "/terms"]);

type Ctx = { params: Promise<{ path?: string[] }> };

export function generateStaticParams() {
  return [
    { path: ["index"] },
    { path: [CATALOG] },
    ...listMarkdownRoutes()
      .filter((r) => r.path !== "/")
      .map((r) => ({ path: r.path.slice(1).split("/") })),
  ];
}

function catalog(): Response {
  const routes = listMarkdownRoutes().map((r) => ({
    url: abs(r.path),
    markdown: mdUrl(r.path),
    title: r.title,
    description: r.description,
    section: r.group,
    updated: r.updated,
  }));
  return Response.json(
    { site: site.name, url: site.url, llms: abs("/llms.txt"), count: routes.length, routes },
    { headers: { "Cache-Control": CACHE.page, "X-Robots-Tag": "noindex, follow", ...CORS } },
  );
}

export async function GET(_request: Request, { params }: Ctx) {
  const { path: segments = [] } = await params;
  if (segments.length === 1 && segments[0] === CATALOG) return catalog();

  const joined = segments.join("/").replace(/\.md$/, "");
  const path = joined === "" || joined === "index" ? "/" : `/${joined}`;

  const resolved = resolveMarkdown(path);
  if (!resolved) return notFoundMarkdown(path);
  if ("redirect" in resolved) return redirectMarkdown(resolved.redirect);

  return markdownResponse(renderDoc(resolved.doc), {
    path: resolved.doc.path,
    updated: resolved.doc.updated,
    cache: STATIC_PATHS.has(path) ? CACHE.static : CACHE.page,
  });
}
