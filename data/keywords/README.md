# Keyword research exports

Raw keyword lists for picking new pages. Nothing in the build reads these files.

| File | Source | Rows | Columns |
|---|---|---|---|
| `semrush-hair-broad-match-us-2026-11-24.csv` | Semrush, "hair" broad match, US database, exported 24 Nov 2026 | 30,003 | Keyword, Intent, Volume, Keyword Difficulty, CPC (USD), SERP Features |
| `semrush-hair-oil-broad-match-us-2026-11-24.csv` | Semrush, "hair oil" broad match, US database, exported 24 Nov 2026 | 30,003 | same |

How to use them: filter for low difficulty (KD under 30) and commercial or informational intent, check that no page in
`data/roundups`, `data/questions`, `data/reviews` or `data/guides` already covers the keyword, and weigh it
against what Bing Webmaster data shows is already ranking (the oil cluster: batana, pumpkin seed, rosemary).

Example: low-difficulty keywords by volume:

```bash
python3 -c "import csv;r=[x for x in csv.DictReader(open('data/keywords/semrush-hair-broad-match-us-2026-11-24.csv')) if x['Keyword Difficulty'] and int(x['Keyword Difficulty'])<30];r.sort(key=lambda x:-int(x['Volume']));[print(x['Volume'],x['Keyword Difficulty'],x['Keyword']) for x in r[:50]]"
```
