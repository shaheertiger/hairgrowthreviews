# SEO rules: double down on what earns clicks

Every session and every daily run on this repo follows these rules. The data is
**Bing Webmaster (`npm run bing`) and Vercel Analytics. Ignore Google.** The
machine-checked parts live in `lib/seo-rules.ts` and are enforced by
`npm run verify:content`, so breaking a rule fails the build checks.

## 1. What is working (the winners)

Recorded from Bing and Vercel, Nov 2026 (`lib/seo-rules.ts` → `WINNERS`):

| Page | What it does right |
|---|---|
| `/best-batana-oil` | Single-ingredient oil topic with weak competition. Title = query + year + count + **"Reviewed"** ("Best Batana Oil for Hair Growth (2026): 6 Brands Reviewed"). Description opens with the query ("Batana oil reviews: …") and names brands. A full cluster: brand-check page (`/batana-oil-reviews`), shampoo spin-off, and question posts for every follow-up (what is it, how to use, how long, side effects, real vs fake, darkens hair?, vs castor, vs rosemary). 15+ in-text links from other articles. |
| `/best-pumpkin-seed-oil-for-hair-loss` | Same shape: one oil, one real trial, capsules spin-off, dosage / how-to / vs posts. |
| `/best-hair-growth-products` | Review-intent title ("10 Reviewed & Ranked"), one pick per category, linked from everywhere. |
| `/reviews/aveda-invati-scalp-revitalizer` | Branded "<product> review" query with demand and weak competition, answered with a rating, price and quick answer. |

The pattern behind all four, now applied sitewide:

1. **Niche topics with weak competition**: single ingredients (batana, pumpkin seed, rosemary, castor) and named-brand reviews. Not head terms.
2. **Review-intent title**: `Best X (YEAR): N <Brands|Picks|noun> Reviewed`, ≤ 65 characters, keyword first.
3. **Description names brands** people type ("Handcraft Blends, Majestic Pure, Sky Organics and more"), keyword first.
4. **Answer-first**: roundups open "The best X is …"; reviews and guides have a `quickAnswer`; questions have a 30-75 word `shortAnswer`.
5. **A cluster around every winner**: pillar roundup + brand-check "X reviews" page + question posts (how long, side effects, how to use, dose, vs) + spin-offs, all cross-linked.
6. **In-text links**: every page has an autolink rule in `lib/autolink.tsx`; winners get linked from 15+ articles and from the nav and home page.

## 2. What is not working: rules so we don't repeat it

| Problem we had | Rule |
|---|---|
| ~60 generic hair-care and styling-tool guides (dryers, flat irons, clippers, shavers, hair spray, purple shampoo, dye, curl products) earn no clicks: off-topic for a hair growth site, and big publishers own those results. | **No new pages outside hair growth / hair loss / growth oils / scalp care / brand reviews**, unless `npm run bing` shows the site already gets impressions for that topic. Improve the existing ones; don't add more. |
| Head terms (best minoxidil for men, best hair growth shampoo, best serum) have strong pages and no clicks. | **Target long-tail and branded queries**: Semrush KD under 30, or a "<brand> review(s)" query. Don't write another head-term roundup. |
| Titles ended in filler ("Ranked on Comfort & Value") and had no review modifier; 3 of 131 roundups said "review". | Titles follow the winning pattern (enforced). |
| Descriptions listed categories instead of brands. | Descriptions name 2+ ranked brands (enforced). |
| Pages shipped with no in-text inbound links (32 orphans in Nov). | Every new page gets an autolink rule and links from 1-3 pages in its cluster, ideally a winner (enforced). |
| Isolated one-off pages with no pillar. | Every new page attaches to a cluster: `pillarSlug`, `relatedRoundups`, `relatedQuestions`. |
| Risk of "fixing" a page that already works. | **Never retitle, re-intro, delete or move a winner.** Their titles are frozen in `lib/seo-rules.ts` (enforced). Extend them with new sections, FAQs and cluster links only. |
| Overlapping pages compete with each other. | Before writing, grep `data/` for the keyword; if a page nearly answers it, extend that page instead. |
| Unverifiable claims. | No invented studies, stats, ratings, quotes or hands-on testing; every Amazon product has a verified ASIN (`npm run amazon:search`). |

## 3. Daily run procedure

1. `git checkout main && git pull origin main && npm ci`.
2. **Read the data**: `npm run bing` (writes `data/bing/<date>.json`). The key is read from `apikey` or `BING_WEBMASTER_API_KEY`. If it exits with "No Bing API key", say so in the report and work from `WINNERS`, the newest `data/bing/` snapshot and the queue below.
3. **Update the winners**: a page with clicks in 2+ weekly buckets joins `WINNERS` (freeze its current title); a winner with 0 Bing clicks for 4+ weeks leaves. Log it below.
4. **Fix pages that aren't getting clicks** (up to 5 a day, never a winner):
   - *Near misses* (Bing position ≤ 20, impressions, 0 clicks): rewrite the title and description around the page's top Bing query, and make sure the first sentence answers it.
   - *Low CTR* (top 10, CTR < 2%): the title doesn't match the query wording. Rewrite it to.
   - *Invisible* (in sitemap, no Bing impressions): submit with `npm run indexnow -- <paths>` and add links to it from a winner in the same cluster.
5. **Double down** (new pages): take them from the clusters with the most Bing clicks per page, in this order:
   - a missing piece of a winner's cluster (the batana template: brand-check "X reviews" page, how long, side effects, how to use, dose, vs, shampoo/product spin-off);
   - a "<brand> <product> review" in the oil and hair growth niche (the Aveda pattern);
   - a low-KD long-tail question in a clicking cluster.
6. Build every page to the rules in section 1 and the gates in `README.md`. Link it from its pillar and from a winner.
7. `npm run verify:content && npm run build && npm run audit:links && npm run check:markdown`. All must pass; never weaken a check to pass it.
8. Commit with the data behind each pick, push to `main` (merge any branch you worked on), then after Vercel deploys run `npm run indexnow -- <new and changed paths>`.
9. Add a line to the log below and report: Bing totals, winners, pages fixed and why, pages added and their queries, check results, IndexNow status.

## 4. Queue

Cluster pieces still missing (check `data/` first; someone may have shipped one):

- Rosemary oil: `rosemary-oil-reviews` brand-check page (Mielle, Botanic Hearth, Kitsch, Plant Therapy…).
- Pumpkin seed oil: `pumpkin-seed-oil-reviews` brand-check page.
- Castor oil: how long castor oil takes to work, castor oil side effects, castor oil vs rosemary oil, `castor-oil-reviews`.
- Brand reviews in the oil niche (Semrush US, KD < 35, monthly volume across variants): Mielle Rosemary Mint Scalp & Hair Strengthening Oil (~1,700), Wild Growth Hair Oil (~1,900), OUAI Hair Oil (~700), Gisou Honey Infused Hair Oil (~260, KD 12), Fable & Mane HoliRoots (~420), Bask & Lather (~170), Difeel (~280).

## 5. Log

- 2026-11-27: Rules created. No Bing API key in the environment yet, so this pass used the winners recorded from Bing and Vercel in Nov 2026. Applied to non-winners: 126 roundup titles moved to the "N … Reviewed" pattern; 17 roundup descriptions rewritten to name brands; 4 over-long review titles shortened; quick answers added to the Mane 'n Tail review and 3 guides; winners moved to the top of the nav and home page; 4 cluster posts added (rosemary oil timeline and side effects, pumpkin seed oil timeline and side effects). Re-check these pages in Bing after 2-4 weeks: keep the change where clicks or CTR rose, revert where they fell.
