# Verdian marketing analytics dataset

A simulated first year of Verdian (1 Oct 2026 – 30 Sep 2027, USD): ad spend,
clicks, sessions, orders, returns and customers. It is built on the same
numbers as the rest of this repo (catalog, unit costs, Meta budget, CPM, CTR,
seasonality and campaign calendar from the hub), so it tells the same story.

It was generated, not collected. The dates run past the day it was made.
Regenerate with `npm run dataset` (add `-- --scale 3` for 3x traffic and
budget, `-- --seed 7` for a different random world). Same seed, same files.

**Try the analysis first. `SPOILERS.md` lists every planted effect and
data-quality problem, with the measured numbers.**

## Tables

| File | Rows | Grain | Key |
|---|---|---|---|
| `ad_performance_daily.csv` | 7,239 | day × campaign × ad set × creative (Meta, Google) | `date, campaign_id, ad_set, creative_id` |
| `sessions.csv` | 73,912 | one GA4-style session | `session_id` |
| `orders.csv` | 1,156 | one paid order (the system of record) | `order_id` |
| `order_items.csv` | 1,441 | one line in an order, with cost and return | `order_id, line_no` |
| `customers.csv` | 963 | one customer (matched by email in the order system) | `customer_id` |
| `dim_products.csv` | 104 | one SKU, with list price and landed unit cost | `item_id` |
| `dim_campaigns.csv` | 15 | one campaign | `campaign_id` |
| `dim_creatives.csv` | 21 | one creative | `creative_id` |
| `marketing_costs_other_monthly.csv` | 48 | month × cost category (creators, content, email platform, tools) | `month, category` |
| `plan_monthly.csv` | 12 | the July 2026 plan, by month | `month` |

## How the tables join

```
ad_performance_daily ──(campaign_id, creative_id = utm_campaign, utm_content; ad_set = utm_term)── sessions
sessions.transaction_id ───────────────────────────── orders.order_id
orders.customer_id ──── customers.customer_id        orders.order_id ──── order_items.order_id
order_items.item_id ─── dim_products.item_id         ad / sessions ─── dim_campaigns, dim_creatives
```

- **Ad platform ↔ site.** `ad_performance_daily` has the platform's view
  (impressions, clicks, spend, platform-reported conversions). `sessions` has
  the site's view. Join on `date`, `campaign`, `term` (ad set) and `content`
  (creative).
- **Orders ↔ sessions.** The order system has no session ID. Join on
  `sessions.transaction_id = orders.order_id`, as you would with the GA4
  BigQuery export. `orders.user_pseudo_id` (the GA4 client ID captured at
  checkout) is a second route.

## Column notes

- **`sessions`**: `source`, `medium`, `campaign`, `content`, `term` are the UTM
  values as GA4 recorded them. `channel_group` follows the "Verdian channels"
  rules in `docs/tracking/CHANGELOG.md`. `view_item … begin_checkout` are 0/1
  flags for the session. `purchase_events` is the count of GA4 `purchase`
  events (0, 1 or 2). `purchase_revenue` is the GA4 value for that event.
- **`orders`**: `merchandise_revenue = gross_sales − discount_amount`.
  Shipping is free to the customer (`shipping_charged = 0`) and costs Verdian
  `shipping_cost`. `net_revenue = merchandise_revenue − refund_amount`.
  `cogs_after_returns` adds back the cost of restocked (resellable) returns.
  `contribution_margin = net_revenue − cogs_after_returns − shipping_cost −
  packaging_cost − payment_fee − return_shipping_cost`. It is before marketing.
- **`order_items`**: `restocked` is 1 when a returned item went back on the
  shelf, 0 when it was written off.
- **`ad_performance_daily`**: `platform_conversions` and
  `platform_conversion_value` are what Meta or Google report, not what the
  store saw. `reach` is blank for Google.
- **`plan_monthly`**: what the July plan expected. Compare it with actuals.

## Definitions this dataset assumes

Use these, or write your own and defend them. The job description asks for
consistent definitions.

- **Revenue** for ROAS: `merchandise_revenue` from `orders` (the system of
  record), unless the question is about what GA4 saw.
- **ROAS** = revenue ÷ ad spend. State whether it is platform, GA4 or order-system revenue.
- **CAC** = marketing cost ÷ new customers. Say whether "marketing cost" is ad
  spend only (paid CAC) or ad spend plus `marketing_costs_other_monthly` (blended CAC).
- **LTV** = cumulative `contribution_margin` per customer from first order.
  Year 1 gives at most 12 months of history, so LTV here is observed, not predicted.

## Questions this data can answer

Mapped to the job description:

1. **Tracking gaps.** How well does GA4 reconcile with orders? Where do
   sessions lose their campaign tags?
2. **Channel and campaign performance.** Spend efficiency, CPM, CTR, CPC,
   funnel conversion, ROAS and CAC by channel, campaign, ad set and creative.
3. **Platform vs reality.** How far do Meta's and Google's numbers sit from
   GA4 and from the order system?
4. **LTV and payback.** LTV and payback by first-order channel and by cohort
   month. Do paid customers repay their acquisition cost?
5. **Budget allocation.** Which channel should get the next $10k?
6. **Diagnosis.** Why did a campaign's ROAS change? Is it creative fatigue,
   seasonality, audience or conversion?
7. **Forecasting.** Use the first 6 months to forecast the next 6, then
   compare with the held-out months and with `plan_monthly`.
8. **Experiments.** Read the creative test in fall launch round 1. Is the
   result significant?
9. **Incrementality.** Which paid channel is credited with sales it did not cause?
10. **The "so what".** Is Year 1 profitable once marketing cost is counted?
    What should leadership do?

## Loading it

```bash
bq load --autodetect --source_format=CSV --skip_leading_rows=1 raw_marketing.sessions data/analysis/sessions.csv
```

Or use DuckDB (`SELECT * FROM 'data/analysis/orders.csv'`), Tableau, or any
spreadsheet for the smaller tables.
