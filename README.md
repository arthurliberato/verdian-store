# Verdian

A fictional premium athletic and lifestyle brand — Classic, Performance, and
Street — built with Next.js as the base layer of an analytics practice stack.
The store pushes a minimal, standard data layer; the measurement layer (GTM,
GA4, BigQuery…) is built separately on top of it.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Pages

| Page | Path |
|---|---|
| Home — hero, line navigation, featured products | `/` |
| Line listing with subcategory filter | `/shop/classic`, `/shop/performance`, `/shop/street` (`?type=Running`) |
| Product detail — model, colorway, color + size selectors, add to cart | `/products/[slug]` |
| Cart | `/cart` |
| Checkout — name, email, address (no payment) | `/checkout` |
| Order confirmation | `/checkout/confirmation` |

## Catalog

`lib/catalog.ts` is the static product file. Each record is one SKU — a model
in one colorway — with `id, name, model, line, category, subcategory,
colorway, price, sizes, description, image`.

- **Footwear:** 15 models (5 per line), 3–6 colorways each → 52 SKUs
- **Apparel:** 38 SKUs — basics, performance pieces, Street capsule
- **Accessories:** 14 SKUs — socks, caps, bags, lifestyle
- **Prices:** entry $60–90, mid $100–160, premium $180–260

`image` points to `/images/products/[id]`, a generated SVG placeholder
(`lib/placeholder.ts`). Replace the `image` values with real photos later.

## Data layer

`lib/datalayer.ts` is the only code that touches `window.dataLayer`. Exactly
five events are pushed — nothing else, and no tracking scripts are loaded.

| Event | When | Payload |
|---|---|---|
| `page_view` | Every route change (always the first push for a page) | `page_title`, `page_path` |
| `view_item` | Product page loads | `ecommerce.items[0]`: `item_id`, `item_name`, `item_category`, `price` |
| `add_to_cart` | "Add to cart" clicked | `ecommerce.items[0]`: `item_id`, `item_name`, `item_category`, `price`, `quantity` |
| `begin_checkout` | Checkout page reached with items in the cart | — |
| `purchase` | Confirmation page (once per order, reloads don't repeat it) | `ecommerce.transaction_id`, `ecommerce.value`, `ecommerce.items[]` (`item_id`, `item_name`, `item_category`, `price`, `quantity`) |

`item_category` is the product category (`footwear` / `apparel` /
`accessories`). Each ecommerce event is preceded by `{ ecommerce: null }` —
Google's standard reset so items from one event don't carry into the next in
the tag manager's data model.

Example:

```js
{ event: "add_to_cart", ecommerce: { items: [{ item_id: "VRD-PUL-FOREST-MINT", item_name: "Pulso Forest Mint", item_category: "footwear", price: 160, quantity: 2 }] } }
```

Type `dataLayer` in the browser console to inspect pushes.
