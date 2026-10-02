# Behaviour reference: how real shoppers behave

Evidence for tuning the synthetic visitors (`traffic/`), for writing the
personas of future agent shoppers, and for judging whether Verdian's Clarity
recordings look human. Every number has a source; where sources are blogs or
vendor reports rather than research, that is said.

Compiled 2026-10-02. Benchmarks drift year to year; re-check before relying
on a number in a write-up.

## 1. Funnel benchmarks (fashion / apparel e-commerce)

| Metric | Benchmark | Source and quality |
|---|---|---|
| Add-to-cart rate (sessions with an add) | ~6.8% overall; **6.3–7.1% apparel** | Industry benchmark compilations ([Mida](https://mida-app.io/blog/ecommerce-conversion-funnel-benchmark/), [7 Sea](https://7seamarketing.com/blogs/guides/ecommerce-conversion-rate-benchmarks-2026)); vendor blogs, directionally reliable |
| Cart abandonment | **70.19%** (average of 49 studies) → ~30% of carts become orders | [Baymard](https://baymard.com/lists/cart-abandonment-rate); research aggregate, the standard reference |
| Checkout completion (started checkout → order) | ~79% (21.3% checkout abandonment) | [Mida checkout benchmarks](https://mida-app.io/blog/checkout-conversion-rate-benchmarks-for-ecommerce/); vendor blog |
| Conversion rate, fashion | ~4% of sessions | [OptiMonk](https://www.optimonk.com/industry-conversion-rate-benchmarks), [Blend](https://blendcommerce.com/blogs/shopify/ecommerce-conversion-rate-benchmarks-2026); vendor blogs |
| Conversion by device | **Mobile 1.8–2.5%**, desktop 3.5–4.0%; mobile converts at ~60–65% of the desktop rate | [Foundry CRO](https://foundrycro.com/blog/ecommerce-conversion-rate-benchmarks-2026/), [DTC Pages](https://www.dtcpages.com/blog/ecommerce-conversion-rate-benchmarks-2026); Shopify-store samples |
| Mobile share of traffic | 70–78% on most stores | Same |
| Cart abandonment by device | Mobile ~86%, desktop ~73% | [Mida](https://mida-app.io/blog/ecommerce-conversion-funnel-benchmark/) |
| Single-page sessions | "Almost half" of visitors leave after one page | [Contentsquare benchmark](https://contentsquare.com/guides/digital-experience-benchmark/) (99 billion sessions, 6,500+ sites) |

### Verdian's synthetic visitors vs the benchmarks

Ground-truth logs, 2026-09-30 and 10-01 (391 sessions, before the v2 interactions):

| Metric | Verdian synthetic | Benchmark | Verdict |
|---|---|---|---|
| Single-page (bounce) sessions | 57.8% | ~45–50% | A little high |
| Add-to-cart rate | **10.5%** | 6.3–7.1% | **Too high (~1.5×)** |
| Cart → purchase | **46%** | ~30% | **Too high** |
| Checkout → purchase | 76% | ~79% | OK |
| Conversion rate | **4.9%** | ~4% fashion | High |
| Mobile conversion | 3.3% | 1.8–2.5% | **Too high** |
| Desktop conversion | 5.8% | 3.5–4.0% | **Too high** |
| Mobile share | 71% | 70–78% | OK |
| Median session length | **8 s** | (no single benchmark; see §2) | Very short: bouncers dominate, and pages are dwelt on only seconds |

**Calibration to do:** lower `pAddToCart` by roughly a third and the
cart → purchase path (more carts left behind, more returning visitors who
don't convert), keep checkout completion, widen the mobile/desktop gap, and
lengthen dwell times on product pages. Verdian is a premium, full-price
brand with mostly cold Meta traffic, so landing at or slightly below the
fashion averages is the realistic target.

### Pages and products viewed

| Metric | Benchmark | Verdian synthetic (Sep 30–Oct 1) | Verdict |
|---|---|---|---|
| Pages per session, all industries | 3.5–5 ([Contentsquare](https://support.contentsquare.com/hc/article_attachments/5744694885276) ~5 in 2021; [Focus Digital](https://focus-digital.co/average-pages-per-session-industry-benchmarks/) 3.8; [Store Growers](https://www.storegrowers.com/ecommerce-metrics-benchmarks/) 4.1) | 3.0 | |
| Pages per session, apparel & footwear | 8–10, highest of all industries (category browsing, comparison) ([Focus Digital](https://focus-digital.co/average-pages-per-session-industry-benchmarks/), [BigDelta](https://bigdelta.com/blog/pages-per-session-benchmarks); aggregator blogs) | 3.0 overall, 5.7 without bounces, 8.4 for buyers | **Too low for non-buyers**; target ~5–7 overall |
| Mobile vs desktop pages | ~2.5 vs ~3.5 (Google Shopping traffic) | 2.5 vs 4.0 | OK |
| Products viewed before purchase | No reliable published figure found | Median 4 (range 1–6) before first add | Measure on the GA4 public dataset |

What apparel shoppers check before buying ([PowerReviews survey](https://www.powerreviews.com/apparel-footwear-shopping-survey-2022/)):
price 84%, ratings and reviews 78% (most read 1–25 reviews), customer photos 56%;
plus size information 84% (Baymard, §3). Verdian has no reviews and no size
guide: realistic reasons to hesitate, and future A/B test candidates.

## 2. How people look at and move through pages

| Pattern | Evidence | Source |
|---|---|---|
| People scan, they don't read | On average users have time to read **at most 28%** of the words on a page; ~20% is more likely. Time on page ≈ 25 s fixed + 4.4 s per 100 words | [NN/g, How Little Do Users Read?](https://www.nngroup.com/articles/how-little-do-users-read/) |
| F-shaped scanning on text pages | Two horizontal sweeps near the top, then down the left edge | [NN/g eye-tracking](https://www.nngroup.com/articles/scrolling-and-attention/) |
| Attention concentrates at the top | **57%** of viewing time above the fold; **74%** in the first two screenfuls; >42% in the top 20% of the page | [NN/g, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/) |
| About half a page gets seen | Average scroll rate ~50% and falling | [Contentsquare benchmark](https://contentsquare.com/guides/digital-experience-benchmark/) |
| Engagement is falling | Fewer pages, less time and less scroll per visit year on year | [Contentsquare, time on site](https://contentsquare.com/blog/average-time-spent-on-websites-is-dropping/) |

## 3. What makes shoppers hesitate or leave

### Checkout (US adults who abandoned during checkout; multiple answers)

| Reason | Share | Applies to Verdian? |
|---|---|---|
| Extra costs too high (shipping, tax, fees) | 47% | Mostly no: free shipping, no fees. Price itself still deters |
| Had to create an account | 25% | No (guest checkout only) |
| Delivery too slow | 24% | Possibly: delivery time isn't shown |
| Didn't trust the site with card details | 19% | Yes for a new brand (demo: no payment step, but trust signals still matter) |
| Checkout too long or complicated | 18% | Partly: 6 fields, below average |
| Couldn't see the total cost up front | 17% | No: total shown in cart |
| Returns policy unsatisfactory | 16% | Low: free 30-day returns, but is it visible at checkout? |
| Website errors or crashes | 14% | Yes when validation errors happen (see `checkout_error`) |

Source: [Baymard, 2023 survey of 2,219 US adults](https://baymard.com/lists/cart-abandonment-rate). Baymard also stresses that many abandonments are natural (window shopping, comparing, saving for later) and can't be prevented.

### Form length

The average checkout in 2024 had **11.3 form fields** over 5.1 steps; most
sites need only **6–8**. Verdian's checkout has 6, so length isn't the
issue; errors and trust are. ([Baymard](https://baymard.com/blog/checkout-flow-average-form-fields))

### Sizing (apparel-specific)

- **84%** of test participants used sizing information to choose a size;
  some couldn't find the size guide and guessed or abandoned.
- Sizing uncertainty was a common reason to abandon a product.
- 83% of desktop and 87% of mobile apparel sites give insufficient size information.

Source: [Baymard apparel research](https://baymard.com/research-articles/apparel-size-information) (18 sites, 1,765 hours of testing). Verdian has no size guide yet, which makes `size_guide_open` (planned) and size hesitation realistic behaviours to simulate.

## 4. Frustration signals Clarity flags

Clarity's own definitions ([Microsoft Learn, semantic metrics](https://learn.microsoft.com/da-dk/clarity/semantic-metrics)):

| Signal | Definition | What would produce it on Verdian |
|---|---|---|
| **Rage click** | Several rapid clicks in the same small area | Tapping a size that's sold out (once inventory exists); tapping the product image expecting zoom |
| **Dead click** | A click with no response in reasonable time | Clicking the "Size guide" text in the footer (not a link); clicking the price |
| **Excessive scrolling** | More vertical scrolling than the site's average | Hunting for something on long line pages |
| **Quick back** | Leaving to another page and returning almost immediately | Opening a product from a grid, then straight back to the list |

Contentsquare reports that reducing rage clicks by 1.5 percentage points
goes with about one more page view per visit ([benchmark](https://contentsquare.com/guides/digital-experience-benchmark/)).

## 5. Real behaviour data available for calibration

- **BigQuery public dataset** `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`:
  three months (2020-11-01 → 2021-01-31) of the Google Merchandise Store's raw
  GA4 export, the same schema as Verdian's. Obfuscated and not comparable
  with the demo account. Free to query in BigQuery. ([Google](https://developers.google.com/analytics/bigquery/web-ecommerce-demo-dataset))
- **Google Analytics demo account** (Google Merchandise Store): the same
  store's live GA4 interface; readable by anyone with a Google account.

First use: compute the real store's funnel, page sequence and time between
steps in SQL, and compare with §1.

## 6. Persona guidance for agent shoppers

Rules every agent persona follows, from the evidence above:

1. **Scan, don't read.** Look at the hero image, headline, price and the
   first lines of a description; read at most a quarter of the text.
2. **Stay near the top.** Most attention in the first screen; scroll about
   half of a long page; only go further when hunting for something.
3. **Most visits end quickly.** About half leave after one page, especially
   cold traffic from ads on mobile.
4. **Check size before adding** clothing or shoes; hesitate if no size
   guidance is found; sometimes abandon because of it.
5. **Carts are often parked, not abandoned.** Add, leave, come back days later
   (returning-visitor boost), or never.
6. **Stop at checkout for real reasons:** delivery time not stated, low
   trust in a new brand, a form error, or just comparing.
7. **Mobile is more impatient** than desktop: shorter visits, fewer pages,
   lower conversion.
8. **Mistakes happen:** mistyped fields, tapping non-links, going back.

Per-archetype detail (heritage buyer, hype, runner, window shopper, bouncer)
goes in the agent prompts, built from `traffic/archetypes.ts` plus these rules.
