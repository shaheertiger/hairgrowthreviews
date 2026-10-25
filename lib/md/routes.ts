/**
 * Every content route shape that has a Markdown copy. proxy.ts uses this list
 * as the allowlist for `Accept: text/markdown` negotiation, the registry maps
 * each pattern to one renderer, and scripts/check-markdown-routes.ts checks it
 * against the pages in app/.
 *
 * proxy.ts imports this file, so keep it free of data imports.
 */
export const MD_ROUTE_PATTERNS = [
  "/",
  "/best",
  "/answers",
  "/reviews",
  "/reviews/:slug",
  "/find-a-treatment",
  "/find-a-treatment/:slug",
  "/about-hair-growth",
  "/about-hair-growth/:slug",
  "/the-hgr-regimen",
  "/the-hgr-regimen/help",
  "/mane-n-tail-shampoo-read-first",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  // Buyer's guides and question posts share the root; keep this last so the
  // fixed paths above win.
  "/:slug",
] as const;

export type MdRoutePattern = (typeof MD_ROUTE_PATTERNS)[number];

export interface RouteMatch {
  pattern: MdRoutePattern;
  params: Record<string, string>;
}

/** The first pattern that matches `path` (e.g. "/reviews/crinagen"), with its params. */
export function matchRoute(path: string): RouteMatch | null {
  const parts = path.split("/").filter(Boolean);
  for (const pattern of MD_ROUTE_PATTERNS) {
    const want = pattern.split("/").filter(Boolean);
    if (want.length !== parts.length) continue;
    const params: Record<string, string> = {};
    const ok = want.every((seg, i) => {
      if (seg.startsWith(":")) {
        if (!/^[a-z0-9-]+$/.test(parts[i])) return false;
        params[seg.slice(1)] = parts[i];
        return true;
      }
      return seg === parts[i];
    });
    if (ok) return { pattern, params };
  }
  return null;
}

/**
 * True when the Accept header ranks text/markdown above text/html. Each type
 * takes the q of its most specific matching range (type/subtype, then type/*,
 * then *\/*), so `*\/*` or no header at all always means HTML.
 */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const ranges = accept.split(",").map((part) => {
    const [range, ...params] = part.trim().toLowerCase().split(";");
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const value = q ? Number(q.slice(2)) : 1;
    return { range: range.trim(), q: Number.isFinite(value) ? value : 0 };
  });
  const quality = (type: string) => {
    const [main] = type.split("/");
    for (const candidate of [type, `${main}/*`, "*/*"]) {
      const hits = ranges.filter((r) => r.range === candidate);
      if (hits.length) return Math.max(...hits.map((r) => r.q));
    }
    return 0;
  };
  const md = quality("text/markdown");
  return md > 0 && md > quality("text/html");
}
