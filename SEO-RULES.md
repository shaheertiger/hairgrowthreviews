# SEO rules: double down on what earns clicks

Every session and every daily run on this repo follows these rules. The data is
**Bing Webmaster (`npm run bing`) and Vercel Analytics. Ignore Google.** The
machine-checked parts live in `lib/seo-rules.ts` and are enforced by
`npm run verify:content`, so breaking a rule fails the build checks.

## 0. The playbook: how every new page is chosen, built, linked and shipped

This is the format behind every page that earns Bing clicks (`/best-batana-oil`, the pumpkin seed
oil guide, the Aveda and Viviscal reviews and their "alternative" guides). Follow it step by step.
**(checked)** = `npm run verify:content` or `scripts/check-roundup.ts` fails the build if you skip it.

**It applies to every page on the site, not only new ones.** All 150 roundups, 98 question posts and 26 reviews meet
the checked rules as of 2026-11-28, so a regression on any existing page fails the build.
When you touch an old page, bring anything unchecked up to the playbook too: the honesty rules, the "how we compared"
line and the prose links. Sitewide checks:
- answer-first intro;
- title pattern and length;
- description names 2+ brands;
- an autolink rule;
- a link back from another roundup;
- 5+ related roundups;
- 1+ related guides;
- a section table and a comparison table;
- question posts list their pillar;
- reviews have a quick answer;
- winners' titles frozen.

### 0.1 What to write

- **Only Amazon buying guides**: `best-X` roundups with verified ASINs. Also allowed: "<brand> review" pages and
  "best <brand> alternative" roundups. **No new question/informational posts**: AI overviews answer those, and they
  earn almost nothing. Extend the existing question posts instead.
- **Pick from Bing data only.** Use `npm run bing` for site queries (Bing position ≤ 20, impressions, few clicks).
  Use Bing keyword research for demand: `GetKeyword` / `GetRelatedKeywords` at
  `https://ssl.bing.com/webmaster/api.svc/json/` with `q`, `country=us`, `language=en-US`, `startDate`, `endDate`
  and `apikey`. Only write a page whose query (or its brand/product variants) shows Bing impressions.
  Record the numbers in the commit message and the log below.
- **Shapes that work**:
  - a single ingredient or oil (batana, pumpkin seed, black seed, amla, emu…);
  - a product-type spin-off of a winner (batana shampoo, batana paste, batana serum);
  - a product-type spin-off of an ingredient (tea tree shampoo, caffeine shampoo, onion shampoo, rice water shampoo);
  - "<brand> alternative".
  - Not head terms ("best hair growth shampoo") and not generic hair care or styling tools.
- **No cannibalising.** Grep `data/` for the keyword first. If an existing page nearly answers it, extend that page.
  Example: Jamaican black castor oil was skipped because the castor oil guide ranks it.
  A spin-off must target a distinct product type, not the pillar's query.
- **Winners are frozen.** Never retitle, re-intro, delete or move them **(checked)**. Extend them only with a new
  section or FAQ that routes to the new spin-off.

### 0.2 How to build it (copy `data/roundups/best-batana-oil.ts` / `best-batana-oil-paste.ts`)

- **Title**: `Best X (2026): N <Brands|Oils|Shampoos|Picks> Reviewed`, keyword first, ≤ 65 characters **(checked)**.
- **Description**: ≤ 165 characters, opens with the keyword, names 2+ ranked brands by their exact `brand`
  string **(checked)**.
- **Intro**: `intro[0]` opens "The best X is …" and names the #1 pick in the first sentence **(checked)**.
  The intro then says how we compared: listing titles, bullets, labels, sellers, price and buyer feedback in
  <month year>. It also says no lab tests and no hands-on testing.
- **Body**:
  - ≥ 3,000 words of prose (aim 3,600-4,400) **(checked)**.
  - 5 key takeaways.
  - 4 sections, with the picks after section 1 (`picksAfter: 1`) **(checked range)**.
  - One section `table` and a `comparisonTable`; the row label is not a column **(checked)**.
  - Exactly 5 mistakes **(checked)** and 6-8 FAQs **(checked)**.
  - A `bottomLine` that recaps the ranking.
  - Every `pullQuote` copied verbatim from its own section's body **(checked)**.
- **Products**: 5-7 per page **(checked)**, each with an ASIN from `npm run amazon:search -- "<query>"`
  **(checked format)**.
  - Base every product claim on that listing's title, bullets, seller and price only.
  - Prices: "about $X when we checked".
  - Prefer brand-sold listings, and say when a listing is sold by a third-party storefront.
  - Then run `npm run amazon:sync`.
- **Honesty**:
  - No invented studies, stats, ratings, quotes or testing.
  - Call out listing claims that overreach ("regrows hair", "eliminates dandruff") instead of repeating them.
  - Cite a study only if you can describe it exactly and conservatively (e.g. the 2015 rosemary vs 2% minoxidil
    trial, the 2002 5% tea tree dandruff trial, the 2014 peppermint mouse study). Otherwise say the evidence is
    limited.
  - Point thinning readers to minoxidil or a dermatologist.
- **Check one file**: `npx tsx scripts/check-roundup.ts data/roundups/<slug>.ts` until it prints OK, then register
  it in `data/roundups/index.ts`.

### 0.3 How to interlink it (this is what turns one page into a cluster)

The batana cluster earns clicks because every piece links to every other piece, both in cards and in prose.
Do all five for every new page:

1. **Autolink rule** in `lib/autolink.tsx` **(checked)**. Add a phrase that matches how other articles naturally
   mention the topic, e.g. `"tea tree (?:oil )?shampoos?"` or `"batana (?:oil )?(?:pastes?|butters?)"`.
   - Put it before broader rules for the same words.
   - When a question post already owns the generic phrase, give the buying guide the first mention and keep the
     question post as the fallback target. Example: `"black seed oil|nigella sativa"` →
     `["/is-black-seed-oil-good-for-hair", "/best-black-seed-oil-for-hair"]`.
2. **Out-links (cards)**: `relatedRoundups` lists the pillar, the sibling spin-offs and 5-8 related guides.
   `relatedGuides` lists the matching question posts. `relatedReviewSlugs` lists any reviewed product.
   All of them must resolve **(checked)**.
3. **Links back (cards)**: add the new slug to the `relatedRoundups` of its pillar and 1-2 related guides. Every
   roundup must be listed by at least one other roundup **(checked: "NO CLUSTER LINK BACK")**. Pillars so far:
   - oils → `best-hair-growth-oil`;
   - essential oils → `best-essential-oils-for-hair-growth`;
   - growth shampoos → `best-hair-growth-shampoo` and `best-shampoo-for-thinning-hair`;
   - scalp → `best-dandruff-shampoo` and `best-shampoo-for-itchy-scalp`;
   - textured hair → `best-black-hair-care-products` and `best-hair-products-for-4c-hair`;
   - batana → `best-batana-oil`.
4. **Question posts feed the guide**: point the matching question post's `pillarSlug` at the new buying guide, and
   add the guide to the post's `relatedRoundups`. That puts the guide's top picks on the question page.
5. **Prose links from the cluster**: link the new page in the text of the winner or pillar and 1-2 cluster pages.
   - Winners: a new section or FAQ only.
   - Other pages: an FAQ or sentence that names the topic so the autolink fires.
   - Confirm after `npm run build` with `grep -rl 'href="/<slug>"' .next/server/app --include=*.html`.
   - `npm run audit:links` must show 0 broken links and no new page with fewer than 3 in-body inbound links.

### 0.4 How to ship it

1. `npm run verify:content && npm run lint && npm run build && npm run audit:links && npm run check:markdown`.
   All must pass. Never weaken a check to pass.
2. Work on a branch, then merge into `main` and push. If the push is rejected, fetch and merge `origin/main`.
   Commit messages carry the Bing numbers behind each page.
3. After Vercel deploys, curl the new URLs until they return 200. Then submit the new and changed paths twice:
   - `npm run indexnow -- <paths>`;
   - Bing `SubmitUrlBatch` (`POST https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=…` with
     `{"siteUrl":"https://www.hairgrowthreviews.com","urlList":[…]}`). The quota is 80 URLs a day and 280 a month.
   - Only the `apikey` variable is authorized for this site. `BINGAPIKEY2` works for keyword research only.
     Never print key values.
4. Add a line to the log in section 5: the data used, pages added and changed, the checks and the submission
   status. Re-check the new pages on Bing about 2 weeks later.

## 1. What is working (the winners)

Bing Webmaster, 90 days to 2026-11-27 (`data/bing/2026-11-27.json`, `lib/seo-rules.ts` → `WINNERS`):
166 clicks and 5,177 impressions in total. Clicks by cluster: batana 62 (from 2 pages), brand reviews 28 (6 pages),
pumpkin seed oil 27 (1 page), supplements 9, minoxidil 6, hair care 5 (11 pages), styling & tools 4 (8 pages),
rosemary 0. Bing has shown only 63 of the 271 sitemap pages.

| Page | What it does right |
|---|---|
| `/best-batana-oil` (60 clicks, pos 5.4) | Single-ingredient oil topic with weak competition. Title = query + year + count + **"Reviewed"** ("Best Batana Oil for Hair Growth (2026): 6 Brands Reviewed"). Description opens with the query ("Batana oil reviews: …") and names brands. A full cluster: brand-check page (`/batana-oil-reviews`), shampoo spin-off, and question posts for every follow-up (what is it, how to use, how long, side effects, real vs fake, darkens hair?, vs castor, vs rosemary). 15+ in-text links from other articles. |
| `/best-pumpkin-seed-oil-for-hair-loss` (27 clicks, CTR 5.6%) | Same shape: one oil, one real trial, capsules spin-off, dosage / how-to / vs posts. |
| `/best-hair-growth-products` (13 clicks) | Review-intent title ("10 Reviewed & Ranked"), one pick per category, linked from everywhere. |
| `/reviews/aveda-invati-scalp-revitalizer` (27 clicks, CTR 6.6%) | Branded "<product> review" query with demand and weak competition, answered with a rating, price and quick answer. |
| `/reviews/viviscal-extra-strength-hair-nutrient-tablets` (6 clicks, pos 4.1) | Same brand-review pattern. |
| `/find-a-treatment/minoxidil-rogaine` (5 clicks) | Answers "Rogaine vs minoxidil" and cost in the title itself. |

The pattern behind them, now applied sitewide:

1. **Niche topics with weak competition**: single ingredients (batana, pumpkin seed, rosemary, castor) and named-brand reviews. Not head terms.
2. **Review-intent title**: `Best X (YEAR): N <Brands|Picks|noun> Reviewed`, ≤ 65 characters, keyword first.
3. **Description names brands** people type ("Handcraft Blends, Majestic Pure, Sky Organics and more"), keyword first.
4. **Answer-first**: roundups open "The best X is …"; reviews and guides have a `quickAnswer`; questions have a 30-75 word `shortAnswer`.
5. **A cluster around every winner**: pillar roundup + brand-check "X reviews" page + question posts (how long, side effects, how to use, dose, vs) + spin-offs, all cross-linked.
6. **In-text links**: every page has an autolink rule in `lib/autolink.tsx`; winners get linked from 15+ articles and from the nav and home page.

## 2. What is not working: rules so we don't repeat it

| Problem we had | Rule |
|---|---|
| ~60 generic hair-care and styling-tool guides (dryers, flat irons, clippers, shavers, hair spray, purple shampoo, dye, curl products) earn almost nothing: on Bing, styling & tools made 4 clicks from 8 visible pages and hair care 5 from 11, against batana's 62 from 2. Most of them Bing never shows at all. | **No new pages outside hair growth / hair loss / growth oils / scalp care / brand reviews**, unless `npm run bing` shows the site already gets impressions for that topic. Improve the existing ones; don't add more. |
| 209 of 271 pages had never appeared on Bing (Nov 2026). | Submit every new or changed page with `npm run indexnow` after deploy (all 209 were submitted 2026-11-27). Don't add pages to a cluster whose existing pages are still invisible; link them from a winner first. |
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
- Brand reviews in the oil niche (Semrush US, KD < 35, monthly volume across variants; Mielle and Wild Growth shipped 2026-11-28): OUAI Hair Oil (~700), Gisou Honey Infused Hair Oil (~260, KD 12), Fable & Mane HoliRoots (~420), Bask & Lather (~170), Difeel (~280).

## 5. Log

- 2026-11-28 (sitewide): The playbook now applies to every page. Fixed the gaps: relatedGuides on 8 roundups, 5+ related roundups on `best-dht-blocker` and `best-beard-growth-products`, a section table on `best-viviscal-alternative`, and `/minoxidil-foam-vs-liquid` now feeds `/best-minoxidil-foam`. New sitewide checks in verify:content: FEW RELATED ROUNDUPS, NO RELATED GUIDES, NO SECTION TABLE, NO COMPARISON TABLE, PILLAR NOT IN RELATED.
- 2026-11-28 (playbook): Codified what works as section 0, the step-by-step playbook. Every session loads it via `CLAUDE.md` → `@SEO-RULES.md`. New enforced check in `verify:content`: every roundup must be listed in another roundup's `relatedRoundups` ("NO CLUSTER LINK BACK"). Fixed the 10 pages that had no links back, including `/best-aveda-invati-alternative` (now linked from the hair growth serum and peptide serum guides) and `/best-viviscal-alternative` (hair growth vitamins, hair skin & nails). Bing URL submission (SubmitUrlBatch) added to the ship step.
- 2026-11-28 (15 single-ingredient guides): Bing keyword research (GetKeyword, US, 90 days) on product queries in the winning batana format. Added 15 Amazon roundups: `/best-black-seed-oil-for-hair` (black seed oil 11,321 imp), `/best-peppermint-oil-for-hair-growth` (peppermint oil 5,855), `/best-tea-tree-shampoo` (2,071 + tea tree oil shampoo 505), `/best-emu-oil-for-hair` (1,053), `/best-biotin-shampoo` (742), `/best-caffeine-shampoo` (alpecin caffeine shampoo 449 + 167), `/best-onion-shampoo` (426 + 405), `/best-amla-oil-for-hair` (448 + 175), `/best-rice-water-shampoo` (291 + rice water for hair 282), `/best-olive-oil-for-hair` (135), `/best-bhringraj-oil` (100), `/best-chebe-powder` (95 + 73), `/best-ginger-shampoo` (88), `/best-tea-tree-oil-for-hair` (86), `/best-aloe-vera-gel-for-hair` (75). Skipped Jamaican black castor oil (486; already ranked in the castor oil guide). Autolinks route the first mention to the guide and later mentions to the existing question posts. No question posts. Re-check on Bing around 2026-12-12.
- 2026-11-28 (batana buying guides): `BINGAPIKEY2` returns NotAuthorized for site stats (`npm run bing`), but works for Bing keyword research (GetKeyword / GetRelatedKeywords, US, 90 days). Audience angles (batana for men, beard, edges, mask, butter, + rosemary) show 0 Bing impressions; demand sits in brand names: KONEO 1,995 (+ reviews 493, for hair growth 346), Azure 1,760 (+ reviews 610, website 393), UFNA 1,247 (+ hair oil 142), OLCG 1,070 + 528, Lebanta paste 187. KONEO, OLCG, Azure and Lebanta all sell batana as a paste; UFNA sells a serum and a spray. Added Amazon roundups `/best-batana-oil-paste` (7 pastes) and `/best-batana-oil-serum` (7 serums and sprays). Winner extended with a format section + 1 FAQ (title and intro untouched); Azure and UFNA FAQs added to `/batana-oil-reviews`, leave-in FAQ to the shampoo guide. No question posts. Re-check on Bing around 2026-12-12.
- 2026-11-28: Bing API data unchanged from 11-27 (lag); used the user's Bing Webmaster exports and Vercel exports (`data/bing/exports/`, `data/vercel/`). Bing daily clicks rising (10-12/day Nov 23-26 vs 2-7 earlier); Vercel Nov 27 search referrers: DuckDuckGo 14, Yahoo 5, Bing 4, Google 3. "batana oil reviews" 83 imp / 0 clicks lands on `/best-batana-oil` while `/batana-oil-reviews` is invisible: winner now routes KONEO/OLCG/Kuri Nuka questions to the brand-check page. Added brand reviews from the queue: `/reviews/wild-growth-hair-oil`, `/reviews/mielle-rosemary-mint-oil`. All IndexNowed.
- 2026-11-27 (evening): Expanded winners from Bing page-query data, titles and intros untouched: batana (organic / Honduras / brand-check section + 3 FAQs), pumpkin seed oil (trial numbers, men, "Advanced Hair Loss Complex" FAQs), Aveda Invati (Ultra Advanced vs Advanced, does it grow hair), Viviscal (AminoMar FAQs). New Amazon roundups on the brand-review winners, following the "alternative" pattern that earns Bing clicks: `/best-aveda-invati-alternative` and `/best-viviscal-alternative`. No new question posts. All IndexNowed. Re-check on Bing around 2026-12-11.
- 2026-11-27 (later): First real Bing pull (`apikey` is set; new sessions see it). Confirmed the 4 winners and added Viviscal and the minoxidil guide. All 209 invisible pages sent to IndexNow. Retitled near misses to their top Bing queries: scalp scrub ("for dandruff & itching"), minoxidil for women ("women's hair growth"), Dyson Airwrap alternative ("hair stylers"); rewrote descriptions for rosemary oil, silk pillowcase, sulfate-free shampoo. Low-CTR fixes: scalp massager ("for hair growth"), hair growth oil, hair spray, does batana oil grow hair ("hair growth reviews"), Nizoral A-D. Re-check these pages on Bing around 2026-12-11.
- 2026-11-27: Rules created. No Bing API key in the environment yet, so this pass used the winners recorded from Bing and Vercel in Nov 2026. Applied to non-winners: 126 roundup titles moved to the "N … Reviewed" pattern; 17 roundup descriptions rewritten to name brands; 4 over-long review titles shortened; quick answers added to the Mane 'n Tail review and 3 guides; winners moved to the top of the nav and home page; 4 cluster posts added (rosemary oil timeline and side effects, pumpkin seed oil timeline and side effects). Re-check these pages in Bing after 2-4 weeks: keep the change where clicks or CTR rose, revert where they fell.
