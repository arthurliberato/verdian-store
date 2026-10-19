# Answer key: spoilers

Stop here if you want to find these yourself. Every effect below was planted by
`scripts/generate-marketing-dataset.ts`. Numbers are measured from the files
with seed 2026, scale 1.

## 1. Measurement and data quality

| Problem | What was planted | How to see it |
|---|---|---|
| **GA4 misses purchases** | GA4 captured 1,038 of 1,156 orders (89.8%). Capture is lower for mobile Meta traffic (84%) than desktop (94%). 16 sessions have 2 purchase events. | `orders` vs `sessions.transaction_id`; `purchase_events = 2` |
| **Lost UTMs, Facebook in-app browser** | 6% of Meta click sessions arrive as `l.facebook.com / referral`, so they land in the Referral channel. About 2,700 sessions. | `channel_group = 'Referral'` |
| **Missing campaign tags** | 3% of Meta sessions keep source and medium but have `campaign = '(not set)'` (1,344 sessions). | `campaign = '(not set)'` and `medium = 'paid_social'` |
| **Untagged creator traffic** | 60% of Instagram traffic arrives as untagged `instagram.com / referral`. Only 40% carries `creator_seeding`. | `campaign = '(referral)'` in Instagram Organic |
| **Click-to-session loss** | Meta clicks become sessions at 75% (80% for retargeting). Google at 92%. | clicks in `ad_performance_daily` vs sessions |
| **Cross-device repeat buyers** | 7% of repeat orders come from a new device, so GA4 sees a new user. 17 customers have 2+ `user_pseudo_id`s. | `orders.customer_id` vs `user_pseudo_id` |
| **Missing client ID on orders** | 44 orders (5%) have a blank `user_pseudo_id`. | blank `user_pseudo_id` |

## 2. Platform numbers are inflated

| Campaign | Spend | Platform ROAS | GA4 ROAS | Platform conv. | GA4 conv. |
|---|---|---|---|---|---|
| ao_prospecting | $38,617 | 1.69 | 0.82 | 385 | 187 |
| fall_launch | $9,483 | 1.13 | 0.73 | 60 | 36 |
| rt_cart (retargeting) | $5,600 | 6.83 | 3.16 | 217 | 103 |
| gads_shopping_nb | $6,552 | 3.46 | 2.89 | 121 | 99 |
| gads_brand_search | $433 | 11.63 | 11.76 | 33 | 31 |

Meta reports about 1.3x the store's own orders (1.7x for retargeting) plus
view-through. The GA4 figure is also low, because GA4 only sees 90% of orders.
The truth is in `orders`: join on `campaign`, `term`, `content` through
`transaction_id`, then add the orders GA4 missed as an uncertainty range.

## 3. The creative test (fall launch round 1) is a trap

Hidden truth (multipliers on a baseline):

| Creative | CTR | Conversion | Net |
|---|---|---|---|
| creative_1 Made to last | 0.90 | 1.25 | best on orders |
| creative_5 First mile | 1.00 | 1.10 | good |
| creative_3 Fair price | 1.20 | 0.90 | click-bait |
| creative_4 All-day comfort | 0.95 | 0.85 | weak |
| creative_2 Move | 1.35 | 0.65 | best CTR, worst conversion |

In round 1 (1–25 Oct, ~$6k spend) there are only 2–10 purchases per creative.
creative_2 looks like the winner (10 orders, CPA $126) and creative_1 looks
like a loser (3 orders, CPA $406). That is noise plus a CTR bias, not signal.
The right answer is "not enough data, extend the test or judge on a
conversion metric with a confidence interval". Over the full year the
conversion spread (0.63%–0.92% per session) is still mostly within noise.
Re-generate with `--scale 4` to make it detectable.

## 4. Ad fatigue

Click-through decays 0.3% a day after day 21, to a floor of 65%. creative_1's
CTR falls from 0.93% in October to 0.63–0.75% by spring. Refreshes
(creative_6 on 5 Jan, creative_7 on 1 Mar, creative_8 on 1 Jun) lift CTR again,
and the delivery system gives each new creative a 14-day boost.

## 5. Ad sets and interactions

Meta ad sets (GA4 conversion per session): `rt_cart_7d` 1.78%,
`lal_buyers_1pct` 1.19% (added 1 Feb, best prospecting audience), `int_sneakers`
0.90%, `int_running` 0.83%, `broad_us` 0.74%. Planted interactions:
`int_running` × creative_5 converts 1.4x, and `int_sneakers` × creative_2 1.15x.
Retargeting is cheap per click ($0.70 CPC) but its audience is small and
mostly people who would have bought anyway.

## 6. Incrementality: Google brand search

From 1 Mar, `gads_brand_search` captures 65% of brand queries at a CPC of
about $0.38. 85% of those clicks would have arrived through organic search
anyway; only 15% are incremental. Its platform ROAS of 11.6 is mostly credit
taken from organic. Organic sessions landing on `/` drop from 124 (Feb) to
80 (Mar). That is the visible cannibalization, partly hidden by the new
non-brand SEO traffic that starts in April.

## 7. Customers, repeat and LTV

- 16.7% of customers order again. The median gap is 76 days. 83.3% of orders are first orders.
- Repeat orders arrive through Direct, Newsletter and brand search. Last-click
  therefore credits cheap channels with sales that paid acquisition caused.
  Compare first-touch and last-touch by `user_pseudo_id`.
- Cumulative contribution per customer to date (first order plus repeats,
  before marketing) is about $104 for customers whose first order came from
  Meta, $98 from Paid Search, $112 from Organic Search. Meta's CAC on new
  customers is $131–159, depending on how the orders GA4 missed (102 first
  orders, 10%) and the lost-UTM referrals (33) are treated. LTV is below CAC,
  so Meta does not pay back inside Year 1.

## 8. Returns

Item return rates match the hub's economics: footwear 16.6%, apparel 10.4%,
accessories 3.8%. Wrong size or fit is the largest reason (55% of footwear
returns). 86% of returned items are restocked. 15.7% of orders include a
return, so net revenue is about 86% of merchandise revenue.

## 9. Funnel, devices and timing

- Sessions → view_item → add_to_cart → begin_checkout → purchase:
  73,912 → 40,749 → 4,275 → 2,118 → 1,038 (GA4, with the undercount).
- Mobile converts at 1.35%, desktop 1.60%, tablet 1.22%.
- Newsletter traffic peaks on Wednesdays (589 sessions) and Thursdays (369).
- Spikes: Black Friday week (24–30 Nov), the three drops (13–19 Nov,
  12–19 Mar, 11–18 Jun), the January archive sale (a 25% discount, `ARCHIVE25`;
  only 5 orders).

## 10. Plan vs actual

| | Plan | Actual |
|---|---|---|
| Sessions | 70,819 | 73,912 (Google Ads adds ~8,100) |
| Orders | 1,051 | 1,156 |
| Revenue (merchandise) | $178,593 | $203,071 |
| Meta spend | $64,000 | $64,000 |
| Google Ads spend | not planned | $6,985 (from March) |

Google Ads is the one thing added to the story. It is not in the July plan.
Excluding it, the traffic and order numbers sit close to the plan.

## 11. The "so what"

Year 1 contribution margin (after COGS, shipping, payment fees and returns) is
**$100,158**. Marketing cost is **$102,985**: $70,985 of ads plus $32,000 of
creators, content, email platform and tools. Year 1 is roughly break-even
before any salaries or overhead. The business only works if repeat rate and
LTV improve, or if spend moves to the channels with better incremental return
(lookalikes, the best creatives, newsletter and retargeting for lapsed
customers). That is the recommendation an analyst should be able to defend
from this data.
