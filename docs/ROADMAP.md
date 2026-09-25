# Verdian Roadmap

Verdian is an analytics practice environment: a fictional store whose data
flows through the same stack a real eCommerce analytics team uses.

```
Store (Next.js, Vercel) → GTM → GA4 → BigQuery → dbt → Looker Studio
                                   ↑
             Catalog / inventory / CRM copies loaded into BigQuery
```

## Decisions so far

- **GCP project:** `verdian-analytics` (under the `ingsliberato.com` organization).
  Analytics only — operational systems (a future CRM, live inventory) live
  elsewhere; only *copies* of their data are loaded here.
- **BigQuery location:** `US` multi-region, for every dataset. Datasets in
  different locations can't be queried together.
- **Dataset naming:** `raw_*` for data loaded as-is from a source system,
  `staging` and `marts` for dbt layers. GA4 creates `analytics_<property_id>`
  itself.
- **Same Google account** (`@ingsliberato.com`) for Google Cloud, GA4 and GTM,
  so linking works without permission issues.
- **Data layer:** exactly five events (`page_view`, `view_item`, `add_to_cart`,
  `begin_checkout`, `purchase`). See README.md.
- **Join key:** `item_id` in GA4 = `id` in `raw_catalog.products`.

## Phase 1 — Clean pipeline

- [x] Store built (104 SKUs, five-event data layer)
- [x] GCP project `verdian-analytics` created
- [x] Dataset `raw_catalog` created (US)
- [x] Catalog export script (`npm run export:catalog`)
- [ ] Load `products.jsonl` into `raw_catalog.products`
- [ ] Deploy the store to Vercel
- [ ] Create GTM container, add it to the site
- [ ] Create GA4 property, configure tags in GTM (add `currency` in GTM)
- [ ] Link GA4 to BigQuery (daily export)
- [ ] First queries on the GA4 export (`UNNEST(items)`, join to catalog)

## Phase 2 — Modeling and reporting

- [ ] dbt project: staging models for GA4 events and catalog
- [ ] Marts: funnel, revenue by line/model/colorway
- [ ] Looker Studio dashboard on the marts

## Phase 3 — Synthetic shoppers

- [ ] Persona profiles (heritage 60s buyer, hype teen, performance runner…)
- [ ] Claude Agent SDK agents browsing the live store
- [ ] Check whether the analytics stack recovers each persona's known behavior

## Phase 4 — Inventory and margin

- [ ] Synthetic inventory + unit cost per SKU × size, loaded to `raw_inventory`
- [ ] Margin and stock-to-sales analysis
- [ ] Later, optionally: live stock in the store so sizes can sell out

## Phase 5 — "First week at a new job" audit

A deliberately messy version of the setup, to practise inheriting someone
else's analytics:

- Legacy version of the store with planted tracking problems
- A messy GTM container to import and audit
- Months of historical data in the GA4 export format, with an undocumented
  tracking change somewhere in it
- A stakeholder brief with questions to answer
- Deliverable: a written audit (what's broken, evidence, impact, prioritised fixes)

The list of planted problems is kept out of this repository until the audit
is done.
