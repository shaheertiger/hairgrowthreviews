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
