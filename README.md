# HairGrowthReviews

Independent hair loss & regrowth product review site, built with Next.js (App Router) and Tailwind CSS, deployed on Vercel.

## Structure

- `app/reviews/[slug]` — individual product review pages
- `app/find-a-treatment/[slug]` — treatment category guides (minoxidil, supplements, scalp reduction)
- `app/about-hair-growth/[slug]` — educational content (hair cycle, hair loss stages, encyclopedia)
- `app/the-hgr-regimen` — the site's combined-treatment regimen framework
- `data/reviews`, `data/guides` — structured content data, typed via `lib/types.ts`
- `components/templates` — `ReviewTemplate` and `GuideTemplate` render all content pages from data, giving every page a consistent structure and SEO/schema footprint

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

## Amazon affiliate links

Review `affiliateUrl`s are built with `amazonProductUrl(asin)` / `amazonSearchUrl(query)` from `lib/amazon.ts`, which add the `AMAZON_CREATORS_PARTNER_TAG` env var as the Associates tag. Set that var in Vercel.

To find the ASIN for a new product (needs the `AMAZON_CREATORS_*` env vars):

```bash
npm run amazon:search -- "product name"
```
