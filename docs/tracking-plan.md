# Verdian Tracking Plan

This is the contract between the store and the analytics stack. The site pushes
these events to `window.dataLayer`; GTM turns them into GA4 (and later Meta /
Google Ads) hits. If you change an event, change this document too.

```
Next.js store ──push──▶ window.dataLayer ──▶ GTM ──▶ GA4 ──▶ BigQuery export ──▶ dbt ──▶ Looker Studio
```

All pushes go through `track()` in [`lib/analytics.ts`](../lib/analytics.ts).
Every eCommerce push is preceded by `{ ecommerce: null }` to clear GTM's data
model (otherwise items from one event can leak into the next).

---

## 1. Events

### Navigation & identity

| Event | Fires when | Key parameters | Source |
|---|---|---|---|
| `page_view` | Every route change, including the first load and query-only changes (`?sort=`, `?q=`). Always the first event for a page. | `page_location`, `page_path`, `page_title`, `page_referrer`, `user_id`, `login_status` (`guest` / `logged_in`) | `components/PageViewTracker.tsx` |
| `login` | Sign-in on `/account`, or "create account" ticked at checkout | `method` (`email` / `checkout`), `user_id` | `lib/store.tsx` |
| `logout` | Sign out on `/account` | `user_id: null` | `lib/store.tsx` |
| `newsletter_signup` *(custom)* | Newsletter form submitted | `form_location` (`home` / `footer`), `interest` | `components/NewsletterForm.tsx` |
| `search` | Search results page shown with a term | `search_term`, `search_results` *(custom — count, find zero-result searches)* | `components/SearchTracker.tsx` |

### Promotions & lists

| Event | Fires when | Key parameters |
|---|---|---|
| `view_promotion` | A homepage banner is shown | `promotion_id`, `promotion_name`, `creative_name`, `creative_slot` |
| `select_promotion` | A banner is clicked | same as above |
| `view_item_list` | A product grid is shown (and again when its sort changes) | `item_list_id`, `item_list_name`, `items[]` with `index` |
| `select_item` | A product in a grid is clicked | `item_list_id`, `item_list_name`, `items[1]` |

Lists in use:

| `item_list_id` | `item_list_name` |
|---|---|
| `home_limited_drops` | Home - Limited drops |
| `home_classics` | Home - Classics |
| `shop_all_<sort>` | Shop all - `<sort>` |
| `category_<slug>` | Category - Classic / Performance / Street |
| `search_results` | Search results |
| `pdp_related` | Product page - You may also like |
| `wishlist` | Wishlist |

### Product page

| Event | Fires when | Key parameters |
|---|---|---|
| `view_item` | Product page opens | `value`, `items[1]` (+ list id/name if arrived from a list) |
| `select_color` *(custom)* | A colorway swatch is clicked | `item_id`, `item_name`, `color` |
| `select_size` *(custom)* | A size is clicked (including sold-out sizes) | `item_id`, `item_name`, `size`, `size_available`, `low_stock` |
| `add_to_cart_error` *(custom)* | "Add to bag" clicked with no size | `item_id`, `error_type` |
| `add_to_wishlist` | Heart clicked (add only) | `value`, `items[1]` |

`select_size` with `size_available: false` is **lost demand** — shoppers who
wanted a size you did not have. Great for merchandising analysis.

### Cart & checkout (the funnel)

| Step | Event | Fires when | Key parameters |
|---|---|---|---|
| — | `add_to_cart` | Item added, or quantity increased (quantity = the increase) | `value`, `items[]` |
| — | `remove_from_cart` | Item removed, or quantity decreased | `value`, `items[]` |
| — | `view_cart` | `/cart` opens | `value`, `items[]` |
| — | `apply_coupon` *(custom)* | Promo code submitted | `coupon`, `coupon_valid` |
| 1 | `begin_checkout` | `/checkout` opens with items | `value`, `coupon`, `items[]`, `checkout_type` (`guest` / `member`) |
| 2 | `add_shipping_info` | Shipping step submitted | `shipping_tier` (`standard` / `express` / `next-day`) |
| 3 | `add_payment_info` | Payment step submitted | `payment_type` (`card` / `paypal` / `apple_pay`) |
| 4 | `purchase` | Confirmation page loads — **once per `transaction_id`** | `transaction_id`, `value`, `tax`, `shipping`, `coupon`, `shipping_tier`, `payment_type`, `items[]`, `user_id` |

**Money conventions**

- `value` = merchandise revenue **after** discount, **excluding** tax and shipping.
- `tax` = 8% of discounted subtotal. `shipping` = tier price (standard is free over $100).
- Currency is always `USD`.

**Duplicate purchase guard:** transaction IDs already sent are remembered in
localStorage (`verdian_tracked_orders`), so reloading the confirmation page does
not send a second `purchase`.

---

## 2. The `items[]` array

Built by `toGA4Item()` in `lib/analytics.ts`. In the BigQuery export this is the
repeated `items` column you `UNNEST()`.

| Parameter | Example | Notes |
|---|---|---|
| `item_id` | `VRD-ST-001` | SKU — the join key for cost-of-goods data |
| `item_name` | `Phantom Hi OG` | |
| `item_brand` | `Verdian` | |
| `item_category` | `Street` | Classic / Performance / Street |
| `item_category2` | `high-top` | court, runner, high-top, hoodie, tee, jacket, pant |
| `item_category3` | `hype` | Audience: heritage / performance / hype |
| `item_variant` | `Bred` | Colorway |
| `item_size` | `10` | **Custom** — register as an item-scoped custom dimension in GA4 |
| `price` | `190` | Unit price actually charged |
| `discount` | `20` | Unit discount vs. compare-at price (sale items only) |
| `quantity` | `1` | |
| `coupon` | `WELCOME10` | Checkout events only, when a code is applied |
| `item_list_id` / `item_list_name` / `index` | | When the item came from a list |

Product cost (`cost` in `lib/catalog.ts`) is **never** sent to GA4. Export it
separately to BigQuery and join on `item_id` to calculate margin.

---

## 3. GTM setup (step by step)

1. **Create the container.** tagmanager.google.com → Create account "Verdian" →
   container "verdian-store", target **Web**. Copy the ID (`GTM-XXXXXXX`).
2. **Connect it to the site.** Put the ID in `.env.local` as `NEXT_PUBLIC_GTM_ID`
   and in Vercel → Project → Settings → Environment Variables. Redeploy.
3. **Create a GA4 property** (analytics.google.com) with a Web data stream for
   your Vercel URL. Copy the Measurement ID (`G-XXXXXXXXXX`). In the stream's
   *Enhanced measurement* settings, turn **off** "Page changes based on browser
   history events" (we send page views ourselves).
4. **Variables** (GTM → Variables → New → *Data Layer Variable*):
   `dlv - user_id` → `user_id`, `dlv - login_status` → `login_status`,
   `dlv - page_location` → `page_location`, `dlv - page_title` → `page_title`,
   `dlv - page_referrer` → `page_referrer`.
5. **Google tag** (Tags → New → *Google Tag*): Tag ID = your `G-` ID. Under
   *Configuration settings* add `send_page_view` = `false` and
   `user_id` = `{{dlv - user_id}}`. Trigger: **Initialization – All Pages**.
6. **page_view tag** (Tags → New → *Google Analytics: GA4 Event*): Event name
   `page_view`; parameters `page_location`, `page_title`, `page_referrer`,
   `login_status` from the variables above. Trigger: *Custom Event* `page_view`.
7. **eCommerce tag** (GA4 Event): Event name `{{Event}}` (built-in variable),
   tick **Send eCommerce data** → Data source *Data Layer*. Trigger: *Custom
   Event*, event name (regex) =
   `view_item_list|select_item|view_item|add_to_cart|remove_from_cart|view_cart|add_to_wishlist|begin_checkout|add_shipping_info|add_payment_info|purchase|view_promotion|select_promotion`
8. **Custom events tag** (GA4 Event): Event name `{{Event}}`; add the event
   parameters you care about (`search_term`, `search_results`, `size`,
   `size_available`, `color`, `coupon_valid`, `form_location`, `method`…).
   Trigger: *Custom Event* regex =
   `search|login|logout|newsletter_signup|select_size|select_color|add_to_cart_error|apply_coupon`
9. **Preview** (top right in GTM) → open your site → click through the funnel and
   confirm each tag fires. Then **Submit / Publish**.
10. **In GA4:** Admin → Custom definitions → register `item_size` (item scope),
    `login_status`, `search_results`, `size_available`, `checkout_type`
    (event scope). Admin → Events → mark `purchase` (already default),
    `newsletter_signup` and `begin_checkout` as **Key events**. Admin →
    BigQuery links → link project `verdian-analytics` (daily + streaming export).

---

## 4. Debugging

- **On-screen panel:** shown automatically in `npm run dev`. On the live site,
  add `?debug=1` to any URL (remembered; `?debug=0` turns it off).
- **Browser console:** type `dataLayer` to see every push.
- **GTM Preview / Tag Assistant:** shows which tags fired for each event.
- **GA4 DebugView:** Admin → DebugView, while GTM Preview is active.
