# Tracking plan — data layer v2

**Status:** draft for review · **Owner:** Arthur (plan) · Kai (implementation) ·
**Replaces:** the five-event launch data layer (v1)

This is the single source of truth for what the Verdian store announces to
the data layer. Code (`lib/datalayer.ts`), GTM and GA4 are built from it —
never the other way round. A change to anything here goes through the
tracking change process (Hub → Operating model) and a line in `CHANGELOG.md`.

---

## 1. Principles

1. **GA4 recommended names first.** Use Google's recommended ecommerce events
   and parameters wherever one exists; custom events only for things GA4 has
   no name for.
2. **snake_case everywhere**, event names in the past-tense-free GA4 style
   (`add_to_cart`, not `addedToCart`).
3. **`page_view` is the first push on every page**, before any other event
   for that page (unchanged from v1).
4. **Every ecommerce push is preceded by `{ ecommerce: null }`** so values
   never leak from one event to the next (unchanged from v1).
5. **Every ecommerce event carries `currency` and `value`.** `value` is the
   sum of `price × quantity` for the items in the event, before shipping.
6. **No personal data, ever.** Names, emails and addresses typed at checkout
   are never pushed. `transaction_id` is a random order ID.
7. **Items always use the full item schema (§4)**, so any report can be cut
   by line, model, colorway or size.

## 2. The questions this plan answers

Every event exists because someone at Verdian needs it (Hub → Plans and
Data requests). If a row here has no question, the event shouldn't exist.

| Question (who) | Needs |
|---|---|
| Where does mobile leak in the funnel? (Priya) | `view_item_list` → `select_item` → `view_item` → `add_to_cart` → `view_cart` → `begin_checkout` → `add_shipping_info` → `add_payment_info` → `purchase`, all with device |
| Which product pages get views but no add-to-carts? (Priya, Hannah) | `view_item`, `add_to_cart` with full items |
| Which lists and positions sell? Home featured vs line pages vs "you may also like" (Priya, Lucas) | `view_item_list`, `select_item` with `item_list_id`, `item_list_name`, `index` |
| Do people switch colorways before buying? (Priya, Hannah) | `select_item` from the colorway swatches |
| Which sizes do people want, including ones we don't stock enough of? (Hannah) | `select_size` with `item_size` (and `in_stock` once inventory exists) |
| Is the Arco franchise 35% of pairs? What sells by line, model, colorway? (Valeria, Hannah) | `item_category2` (line), `item_category4` (model), `item_variant` (colorway) on every item |
| Do buyers add the care kit? (Tomás) | `purchase` items (model `Sneaker Care Kit`) |
| What do cart edits tell us? (Priya) | `remove_from_cart`, `add_to_cart` from the cart |
| Where exactly is checkout abandoned? (Priya) | `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase` |
| How fast is the list growing, and from where? (Tomás) | `newsletter_signup` with `signup_location` |
| Does GA4 see every order? (Daniel) | `purchase.transaction_id`, matched to orders in BigQuery |
| Does the size guide reduce returns? (Priya) | `size_guide_open` (when the size guide ships) |
| Do drop waitlists convert? (Hannah, Tomás) | `waitlist_join` (when drop pages ship) |

## 3. Events

Status: **existing** (v1, unchanged) · **changed** (v1 event, new parameters) · **new** (v2) · **planned** (needs a feature that doesn't exist yet).

| Event | Status | Fires when | Parameters (besides items, currency, value) |
|---|---|---|---|
| `page_view` | changed | Every page, on load and on every client-side route change | `page_title`, `page_path`, **`page_type`** |
| `view_item_list` | new | A product grid is shown (once per page view per list) | `item_list_id`, `item_list_name`, `list_filter` |
| `select_item` | new | A product card or colorway swatch is clicked | `item_list_id`, `item_list_name` (items carry `index`) |
| `view_item` | changed | Product page shown | — |
| `select_size` | new | A size button is clicked on the product page | items carry `item_size`; `in_stock` (always `true` until inventory exists) |
| `add_to_cart` | changed | "Add to cart" on the product page, or **+** in the cart | `cart_location` (`product_page` / `cart`) |
| `remove_from_cart` | new | **−** or **Remove** in the cart | — (items carry the quantity removed) |
| `view_cart` | new | Cart page shown with at least one item | — |
| `begin_checkout` | changed | Checkout page shown | — (now with items and value) |
| `add_shipping_info` | new | All shipping fields are valid for the first time in this checkout | `shipping_tier: "free_standard"` |
| `add_payment_info` | new | "Place order" clicked (demo store — no payment is collected) | `payment_type: "demo"` |
| `purchase` | changed | Confirmation page shown (once per order, de-duplicated as in v1) | `transaction_id`, `shipping: 0`, `tax: 0` |
| `newsletter_signup` | new | Newsletter form submitted successfully (new footer form) | `signup_location` (`footer`, later `popup`, `checkout`) |
| `size_guide_open` | planned | Size guide opened on a product page | items (the product) |
| `waitlist_join` | planned | Waitlist form submitted on a drop page | items (the drop product), `drop_id` |
| `refund` | planned | Server-side via Measurement Protocol (Stage 6) | `transaction_id`, items |

Not in the data layer (sent automatically by GA4 enhanced measurement):
`scroll`, outbound `click`. Form interactions stay **off**.

### `page_type` values

`home` · `line` · `product` · `cart` · `checkout` · `confirmation` · `other`

Sent to GA4 as `content_group` too (by GTM), so every GA4 report can be
grouped by type of page.

### Product lists

| `item_list_id` | `item_list_name` | Where |
|---|---|---|
| `home_featured` | Home — Featured | Home page grid |
| `line_{slug}` | {Line} line (e.g. "Street line") | Line pages; `list_filter` = the `?type=` value or `all` |
| `pdp_related` | You may also like | Product page, related grid |
| `pdp_colorways` | Other colorways | Colorway swatches (only `select_item`, no list view) |

`index` is the product's position in its list, starting at 1.

## 4. Item schema

Every item in every ecommerce event:

| Parameter | Example | Source | Note |
|---|---|---|---|
| `item_id` | `VRD-AMU-ACID` | catalog `id` | Join key to `raw_catalog.products` |
| `item_name` | `Arco Muta Acid` | catalog `name` | |
| `item_brand` | `Verdian` | constant | |
| `item_category` | `footwear` | catalog `category` | **Kept as in v1** so reports stay comparable over time |
| `item_category2` | `Street` | catalog `line` | |
| `item_category3` | `Reinterpretations` | catalog `subcategory` | |
| `item_category4` | `Arco Muta` | catalog `model` | Arco franchise = `Arco` + `Arco Muta` |
| `item_variant` | `Acid` | catalog `colorway` | |
| `price` | `220` | catalog `price` | Number, USD, no currency symbol |
| `quantity` | `1` | cart | Every event; `1` where there's no cart line |
| `index` | `3` | list position | Only in list events and events that follow a list click |
| `item_list_id` / `item_list_name` | `line_street` / `Street line` | list | Only in list events |
| `item_size` | `10.5` | size selected | Custom item parameter; from `select_size` on |

## 5. Examples

```js
// Product page: page_view first, then the ecommerce clear, then view_item
dataLayer.push({ event: "page_view", page_type: "product",
  page_title: "Arco Muta Acid — Verdian", page_path: "/products/arco-muta-acid?utm_source=meta" });
dataLayer.push({ ecommerce: null });
dataLayer.push({ event: "view_item", ecommerce: { currency: "USD", value: 220, items: [{
  item_id: "VRD-AMU-ACID", item_name: "Arco Muta Acid", item_brand: "Verdian",
  item_category: "footwear", item_category2: "Street", item_category3: "Reinterpretations",
  item_category4: "Arco Muta", item_variant: "Acid", price: 220, quantity: 1 }] } });

// Size chosen
dataLayer.push({ ecommerce: null });
dataLayer.push({ event: "select_size", in_stock: true, ecommerce: { currency: "USD", value: 220,
  items: [{ /* same item */ item_size: "10.5" }] } });

// Order placed
dataLayer.push({ ecommerce: null });
dataLayer.push({ event: "add_payment_info", ecommerce: { currency: "USD", value: 280,
  payment_type: "demo", items: [ /* cart items */ ] } });
```

## 6. What changes in GTM and GA4 (Stage 3)

- GTM: tags per event group; `currency` and `value` read from the data layer
  (no constants in tags); `page_type` → `content_group`.
- GA4 custom definitions: `page_type` (event), `list_filter` (event),
  `cart_location` (event), `signup_location` (event), `in_stock` (event),
  `item_size` (item-scoped). `shipping_tier` and `payment_type` are
  recommended parameters but still need registering to appear in reports.
- The launch key event stays: only `purchase`.

## 7. Acceptance and QA

A release passes when:

- [ ] Every event in §3 marked existing/changed/new fires exactly once per
      action, in the order of §1, on desktop and mobile
- [ ] Every ecommerce event has `currency: "USD"` and `value` = Σ price × quantity
- [ ] Every item has all required fields of §4
- [ ] No name, email or address appears in any push
- [ ] Automated data layer tests (Playwright, CI) cover: home → line → product
      → size → add → cart edits → checkout → purchase, and the newsletter form
- [ ] GTM Preview and GA4 DebugView show the same events with the same values

## 8. Knock-on work

- **Traffic generator:** visitors click list items (with positions), choose
  sizes, edit carts, fill checkout step by step (some abandon after shipping),
  and sometimes sign up to the newsletter — all logged in the ground truth.
- **BigQuery / dbt:** new events and item fields flow into the staging models.
- **Hub:** the tracking plan is linked from the Operating model page.

## 9. Open questions for review

1. **`item_category` stays `footwear/apparel/accessories`** (continuity with
   v1 data) and the line moves to `item_category2`. The alternative — line as
   `item_category` — reads more naturally in GA4 but breaks comparisons with
   launch data. Recommendation: keep continuity.
2. **`add_shipping_info` on "shipping fields valid"** rather than on submit, so
   the funnel shows people who filled shipping but never placed the order.
3. **Newsletter as a custom `newsletter_signup`** rather than GA4's
   `generate_lead`, because "lead" means something else at a DTC brand.
4. **Colorway swatches as `select_item`** from list `pdp_colorways`, so
   "switched colorway" is a normal list interaction in GA4.
