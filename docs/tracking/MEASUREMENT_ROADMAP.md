# Measurement roadmap: from launch setup to a state-of-the-art GA4 + GTM stack

The launch setup (Stage 0) was built fast on purpose: five events, one
eCommerce tag, GA4 defaults. This document is the path from there to the kind
of setup a mature eCommerce analytics team runs: a written tracking plan,
the full GA4 eCommerce spec, a staging environment, consent, automated QA and,
optionally, server-side tagging.

**Who does what:** 🧑 Arthur (GA4, GTM and Google Cloud consoles) ·
🤖 Claude Code (store code, tests, docs). Every stage ends with a GTM
version, a line in `docs/tracking/CHANGELOG.md` and a GA4 annotation on the
date it went live, so the data always explains its own history.

**Order matters:** hygiene first (settings that aren't retroactive), then the
spec, then a staging environment *before* touching the live container.

---

## Stage 0 — Launch baseline ✅

- Data layer: `page_view`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
- GTM `GTM-MTT2JZP7` v1: Google tag (`send_page_view: false`), `page_view` tag
  with clean `page_location`, one catch-all eCommerce tag, `currency: USD`
  hard-coded in GTM
- GA4 `G-5JNZXNTD6R`: 14-month retention, history page views and form
  interactions off, daily BigQuery export
- Known gaps: items carry only id, name, category and price; no lists, no
  cart edits, no checkout steps; no filters; no staging; no consent; QA is
  manual

## Stage 1 — Hygiene and governance 🧑

GA4 admin:
- [x] Internal traffic rule + filter **Active**; developer traffic filter **Active**
- [x] Key events: only `purchase` (check it's marked)
- [x] Session timeout: keep 30 min; engaged session threshold: keep 10 s (document it)
- [ ] Reporting identity: **Device-based** until the store has logins
      (no `user_id`), so reports aren't subject to modelling surprises
- [ ] Google signals: **off** (no ads to power; avoids data thresholding)
- [ ] Custom channel group "Verdian channels": Meta paid (`paid_social`),
      Instagram organic, Newsletter, Organic search, Direct, Referral
- [ ] Attribution settings reviewed and written down (model + lookback windows)
- [x] Cross-domain: not needed (single domain); Google's suggested
      deployment-URL domain dismissed
- [x] Tracking limited to the production host: GTM triggers require
      Page Hostname = `verdian-store.vercel.app` (v2); `NEXT_PUBLIC_GTM_ID`
      scoped to Vercel Production
- [ ] Unwanted referrals: none needed yet (no payment provider redirect) — noted

GTM governance:
- [ ] Naming convention: `GA4 - event - {name}`, `CE - {event}` triggers,
      `DLV - {key}` variables, `CJS - {name}`, `LT - {name}` lookup tables
- [ ] Folders: `GA4 config`, `GA4 ecommerce`, `GA4 engagement`, `Utilities`
- [ ] Every published version has a name and a description of what changed
- [ ] Rename existing items to the convention (publish as v3 — no behaviour change)

Repo:
- [x] 🤖 `docs/tracking/CHANGELOG.md`: dated log of every tracking change

## Stage 2 — Tracking plan and data layer v2 🤖 (then 🧑 review)

The tracking plan becomes the single source of truth: every event, when it
fires, its parameters and types, which GA4 report it feeds. Code, GTM and
GA4 are built from it, never the other way round.

- [ ] `docs/tracking/TRACKING_PLAN.md`: event table + item parameter table
- [ ] Richer items on every eCommerce event: `item_brand` (Verdian),
      `item_category` (line), `item_category2` (footwear/apparel/accessories),
      `item_category3` (subcategory), `item_variant` (colorway), `price`,
      `quantity`, `index`, `item_list_id` / `item_list_name`, plus `item_size`
      (custom item parameter) where a size is known
- [ ] `currency` and `value` sent from the data layer (not constants in GTM)
- [ ] Full recommended eCommerce funnel:

| Event | Fires when |
|---|---|
| `view_item_list` | a product grid is shown (home, line pages, "other colorways") |
| `select_item` | a product card in a list is clicked |
| `view_item` | product page |
| `add_to_cart` / `remove_from_cart` | cart changes, including quantity +/− in the cart |
| `view_cart` | cart page |
| `begin_checkout` | checkout page, now with items and value |
| `add_shipping_info` | shipping fields completed (`shipping_tier`) |
| `add_payment_info` | order placed — demo store, `payment_type: "demo"` |
| `purchase` | confirmation (+ `shipping`, `tax`, `coupon` when relevant) |

- [ ] Custom events: `select_size` (item + size), `newsletter_signup`
      (new footer form — gives Stage 4 and CRM something real to measure)
- [ ] `page_view` gains `page_type` (home / line / product / cart / checkout /
      confirmation), used as GA4's content group
- [ ] Data layer typed in TypeScript; in development, pushes are validated
      against the plan and warn in the console
- [ ] **Automated data layer tests** (Playwright, run in CI on every PR): each
      journey asserts the exact sequence and shape of pushes
- [ ] Traffic generator updated so synthetic visitors use the new
      interactions (lists, sizes, cart edits, newsletter) and log them as
      ground truth

## Stage 3 — Staging environment, then the GTM rebuild 🧑 + 🤖

Never test on the live container again.

- [ ] 🧑 GA4 property **"Verdian Store – Staging"** (separate measurement ID)
- [ ] 🧑 GTM environment **Staging**; 🤖 Vercel *Preview* deployments load it
      (environment `gtm_auth` / `gtm_preview` values set only for Preview)
- [ ] 🧑 Replace the v2 hostname condition with a lookup table on hostname →
      measurement ID, so preview traffic goes to
      the staging property and production to the real one
- [ ] 🧑 Rebuild tags on the v2 spec: one tag per eCommerce event (or a
      small set), `Send ecommerce data` on, event parameters from DLVs
- [ ] 🧑 GA4 custom definitions: `page_type` (content group), `item_size`
      (item-scoped), `size` (event-scoped, for `select_size`),
      `newsletter_location`
- [ ] 🧑 QA each event in Tag Assistant + GA4 DebugView on a preview URL,
      against a written checklist → publish to Staging → then Live
- [ ] 🧑 GA4 annotation on the go-live date ("tracking v2")

## Stage 4 — Consent and privacy 🤖 + 🧑

- [ ] 🤖 Consent banner in the store (accept / reject / preferences),
      choice stored in a first-party cookie
- [ ] 🤖 Consent Mode v2 defaults before GTM loads (`analytics_storage`,
      `ad_storage`, `ad_user_data`, `ad_personalization`), region-specific:
      denied by default in the EEA/UK, granted elsewhere; `update` on choice
- [ ] 🧑 GTM consent settings per tag; GA4 consent check in Admin
- [ ] 🤖 Synthetic visitors accept or reject at realistic rates and log it,
      so the gap between ground truth and GA4 includes consent — like real life
- [ ] PII review: no emails, names or addresses in URLs or event parameters

## Stage 5 — Monitoring and data quality 🧑 + 🤖

- [ ] 🧑 GA4 custom insights (alerts): purchases = 0 in a day, revenue or
      sessions ±50% vs typical, spike in `(not set)` landing pages
- [ ] 🤖 Nightly Playwright check against production: intercept the real
      GA4 requests (`/g/collect`) and assert the parameters GTM actually sends
- [ ] 🤖 Ground truth vs GA4 reconciliation query (BigQuery), run daily
- [ ] 🧑 GTM container diagnostics and GA4 "data quality" notices reviewed weekly

## Stage 6 — Server-side and first-party (advanced, optional) 🧑 + 🤖

Worth doing as a learning exercise; costs are discussed before anything is
turned on.

- [ ] Server-side GTM container on Cloud Run (min instances 0 while practising)
- [ ] GA4 routed web container → server container → GA4
- [ ] Measurement Protocol for server-confirmed events: `refund` (and later
      order status) — the API secret lives only in server environment
      settings, never in `NEXT_PUBLIC_` variables
- [ ] Optional, needs a custom domain (~$10/yr): first-party serving
      (server container on a subdomain, or Google tag gateway via a CDN)

## Stage 7 — Integrations

- [ ] Search Console verified (meta tag) and linked to GA4
- [ ] Looker Studio moves from the GA4 connector to BigQuery marts (see ROADMAP Phase 2)
- [ ] Later, if paid media is simulated end to end: Google Ads / Meta
      conversions API concepts documented against the synthetic creatives
