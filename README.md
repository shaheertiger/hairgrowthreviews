# HairGrowthReviews

Independent hair loss & regrowth product review site, built with Next.js (App Router) and Tailwind CSS, deployed on Vercel.

## Structure

- `app/reviews/[slug]` — individual product review pages
- `app/find-a-treatment/[slug]` — treatment category guides (minoxidil, supplements, scalp reduction)
- `app/about-hair-growth/[slug]` — educational content (hair cycle, hair loss stages, encyclopedia)
- `app/the-hgr-regimen` — the site's combined-treatment regimen framework
- `app/[slug]` + `data/roundups` — "best X" buyer's-guide roundups at the site root (e.g. `/best-minoxidil-for-men`), indexed at `/best`
- `data/reviews`, `data/guides` — structured content data, typed via `lib/types.ts`
- `components/templates` — `ReviewTemplate`, `GuideTemplate` and `RoundupTemplate` render all content pages from data, giving every page a consistent structure and SEO/schema footprint

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Amazon product links

Every roundup product carries the ASIN of its exact Amazon listing, and all outbound
links are tagged `sktiger-20` (see `lib/affiliate.ts`). Copy `.env.example` to `.env`
and add the Creators API credentials, then:

```bash
npm run amazon:search -- "kirkland minoxidil 5% foam"   # find a product's exact listing + ASIN
npm run amazon:sync                                      # confirm every ASIN is live, refresh titles/images
```

`amazon:sync` writes `data/amazon/products.json`, which the pages read at build time, so
the build never needs the API or the secret. Re-run it after adding products.

## Content checks

```bash
npm run verify:content                                   # all reviews, guides and roundups
npx tsx scripts/check-roundup.ts data/roundups/<file>.ts # one roundup before registering it
```

## Article pattern (from what earns clicks)

**Read `SEO-RULES.md` first.** It holds the click rules, the winners list, what not to
repeat and the daily-run procedure; `npm run bing` pulls the Bing Webmaster data it runs on
(needs `BING_WEBMASTER_API_KEY`).

Search Console (Nov 2026) shows the pages that earn clicks, `/best-batana-oil`,
`/best-pumpkin-seed-oil-for-hair-loss` and the Aveda Invati review, share one
shape. New articles should follow it; `verify:content` enforces the first two rules.

1. **Answer-first intro.** A "best X" roundup opens with a one-sentence
   definition: "The best pumpkin seed oil for hair loss is a plain, cold-pressed
   softgel…".
2. **Linkable from other articles' text.** Every roundup, review and question needs a
   phrase rule in `lib/autolink.tsx`, so other articles link to it in their text,
   not only in the card grids. The top pages get 15+ such links each.
3. **A cluster around it.** List the page's siblings in `relatedRoundups`, its
   reviewed products in `relatedReviewSlugs`, and give it supporting question
   posts (`pillarSlug`). The roundup template turns these into a routing paragraph
   at the end of the overview (`components/roundup/ClusterRouting.tsx`).

`npm run build && npm run audit:links` reports pages that are still weakly linked.
