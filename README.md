# Verdian

A fictional athletic & lifestyle footwear store built as a **real analytics
practice environment**: a Next.js eCommerce site with a full GA4 eCommerce
dataLayer, designed to be browsed by synthetic user agents and analysed in
GA4 → BigQuery → dbt → Looker Studio.

```
Next.js store (Vercel) → GTM → GA4 (+ Meta Pixel / Google Ads) → BigQuery → dbt → Looker Studio
```

## Run it

```bash
npm install
cp .env.example .env.local   # optionally add your GTM container ID
npm run dev                  # http://localhost:3000
```

In development a **dataLayer** button appears bottom-right showing every event
as it fires. On a deployed site, add `?debug=1` to any URL to show it.

## What's in the store

| Page | Path |
|---|---|
| Home (promotions, limited drops, classics, newsletter) | `/` |
| Shop all / by category, with sorting | `/shop`, `/shop/classic`, `/shop/performance`, `/shop/street` |
| Product (color, size, add to bag, wishlist) | `/products/[slug]` |
| Search | `/search?q=` |
| Cart, Wishlist, Account (fake sign-in → `user_id`) | `/cart`, `/wishlist`, `/account` |
| Checkout (shipping → payment → review) and confirmation | `/checkout`, `/checkout/confirmation` |

**Catalog:** 24 products, 8 per category — Classic (heritage audience),
Performance, and Street (hype audience: limited drops, sold-out sizes).
Promo codes: `WELCOME10` (10%), `DROP20` (20%).

## Where things live

| File | What it does |
|---|---|
| `lib/catalog.ts` | Products, categories, shipping tiers, coupons (+ cost of goods, never sent to GA4) |
| `lib/analytics.ts` | `track()` — the only way the site pushes to the dataLayer; `toGA4Item()` |
| `lib/store.tsx` | Cart / wishlist / user state; fires cart and login events |
| `lib/order.ts` | Order totals (value, tax, shipping) |
| `components/PageViewTracker.tsx` | SPA page views |
| `components/GoogleTagManager.tsx` | GTM container snippet |
| `components/DataLayerDebug.tsx` | On-screen event inspector |
| `docs/tracking-plan.md` | **Every event and parameter + GTM setup steps** |

## Deploy

Push to GitHub, import the repo in Vercel, set `NEXT_PUBLIC_GTM_ID`, deploy.
