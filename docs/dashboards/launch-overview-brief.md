# Design brief — Verdian Launch Overview dashboard (Looker Studio, GA4)

## 1. What this is

Design a **one-page Looker Studio dashboard** for **Verdian**, a fictional
premium athletic and lifestyle brand (think Veja meets Adidas Originals). The
online store is live at https://verdian-store.vercel.app and tracked with
Google Tag Manager → Google Analytics 4.

This is a **temporary launch dashboard**: the business launched before the
measurement layer was finished, and leadership wants to see that the store is
working. It connects **directly to the GA4 property** (Looker Studio's native
Google Analytics connector). A permanent dashboard will later be rebuilt on
BigQuery tables modelled with dbt, so keep this one simple and robust.

**Your deliverable:** a dashboard design (layout, chart choices, labels,
styling) that can be built **exactly as designed in Looker Studio** using only
the GA4 fields listed below. Include the spec for each chart (type, dimension,
metrics, sort, formatting) so it can be implemented without guessing.

## 2. Audience and the questions it must answer

Primary readers: CEO and CFO. Secondary: the marketing analyst who maintains it.
They open it once a day for under a minute. It must answer, top to bottom:

1. **Is the store getting traffic and sales?** (headline numbers)
2. **Is it growing day by day?** (trend)
3. **Which channels bring visitors and buyers?** (acquisition)
4. **How far do visitors get through the purchase funnel?** (funnel)
5. **Which products and product lines sell?** (merchandise)
6. **What device are people on, and which pages do they see?** (context)

## 3. Data source and available fields

**Connector:** Google Analytics → account `Verdian` → property `Verdian Store`.
The Looker Studio UI is in **Spanish**; Spanish field names are given where
they are needed to find fields.

**Events collected** (nothing else is tracked yet):

| Event | Meaning |
|---|---|
| `page_view` | Every page shown |
| `view_item` | Product page opened |
| `add_to_cart` | "Add to cart" clicked |
| `begin_checkout` | Checkout page reached |
| `purchase` | Order placed (revenue in USD) |

Also `scroll`, `session_start`, `first_visit`, `user_engagement` (automatic).

**Session / user scope** (use together freely):

| Field (EN) | Field (ES) | Type |
|---|---|---|
| Date | Fecha | Dimension |
| Session source / medium | Fuente / medio de la sesión | Dimension |
| Session default channel group | Grupo de canales predeterminado de la sesión | Dimension |
| Device category | Categoría del dispositivo | Dimension |
| Page title | Título de la página | Dimension |
| Page path | Ruta de la página | Dimension |
| Event name | Nombre del evento | Dimension |
| New / returning | Nuevo / recurrente | Dimension |
| Active users | Usuarios activos | Metric |
| Total users | Usuarios totales | Metric — use for the funnel (people per step) |
| New users | Usuarios nuevos | Metric |
| Sessions | Sesiones | Metric |
| Engaged sessions | Sesiones con interacción | Metric |
| Views | Vistas | Metric |
| Event count | Número de eventos | Metric |
| Ecommerce purchases | Compras de comercio electrónico | Metric |
| Purchase revenue | Ingresos por compras | Metric |
| Average purchase revenue | Ingresos medios por compra | Metric |
| Session key event rate | Tasa de eventos clave de la sesión | Metric (purchase is a key event) |

**Item scope** (from the purchase/cart items; **never mix with session-scope
metrics in the same chart** — results are empty or misleading):

| Field (EN) | Field (ES) | Type |
|---|---|---|
| Item name | Nombre del artículo | Dimension — model + colorway, e.g. "Pulso Forest Mint" |
| Item category | Categoría del artículo | Dimension — `footwear` / `apparel` / `accessories` |
| Items viewed | Artículos vistos | Metric |
| Items added to cart | Artículos añadidos al carrito | Metric |
| Items purchased | Artículos comprados | Metric |
| Item revenue | Ingresos por artículos | Metric |

**Calculated field — Product line** (GA4 does not receive the line; derive it
from Item name. Verified against all 104 products):

```
CASE
  WHEN REGEXP_MATCH(Item name, "^(Arco Muta|Senda Low|Bruma|Fosco|Eco|Muta Cargo Pant) .*") THEN "Street"
  WHEN REGEXP_MATCH(Item name, "^(Pulso|Cima|Impulso|Viento|Campo|Training Short|Half-Zip Midlayer) .*") THEN "Performance"
  ELSE "Classic"
END
```

Order matters: "Arco Muta" and "Senda Low" must be matched before the Classic
fallback, because "Arco" and "Senda" are Classic models.

**Calculated field — Funnel step** (fixes the step order; Looker would
otherwise sort event names alphabetically):

```
CASE Event name
  WHEN "view_item" THEN "1 · View item"
  WHEN "add_to_cart" THEN "2 · Add to cart"
  WHEN "begin_checkout" THEN "3 · Begin checkout"
  WHEN "purchase" THEN "4 · Purchase"
  ELSE NULL
END
```

**Expected values** (so labels and colors can be planned):
- Session source / medium: `google / organic`, `meta / paid_social`,
  `newsletter / email`, `l.instagram.com / referral`, `(direct) / (none)`
- Device category: `mobile` (majority), `desktop`, `tablet`
- Product lines: Classic, Performance, Street
- Currency: USD

## 4. Page content (top to bottom)

1. **Header bar:** title "Verdian — Launch overview", subtitle
   "GA4 · temporary · data 24–48 h delayed", date range control (default:
   last 28 days), and a small label "Traffic includes synthetic visitors".
2. **KPI row (scorecards, with comparison to previous period):**
   Active users · Sessions · Ecommerce purchases · Purchase revenue ·
   Session key event rate (as %).
3. **Trend:** time series by Date — Sessions (line) and Ecommerce purchases
   (bars or second axis).
4. **Acquisition table:** Session source / medium — Sessions, Engaged sessions,
   Ecommerce purchases, Purchase revenue; sorted by Sessions desc; heatmap or
   bars on revenue.
5. **Funnel:** dimension `Funnel step` (calculated field above), metric
   **Total users** (people who reached each step, not Event count — a visitor
   who clicks "Add to cart" twice is one person), sorted by `Funnel step`
   ascending, filtered to exclude null steps. Preferred chart: Looker Studio
   **funnel chart**, horizontal, with step-to-step drop-off labels. Fallback:
   horizontal bar chart — note it cannot calculate drop-off between steps.
   Step labels render beside the bars (axis), not above them.
6. **Merchandise (item scope, separate charts):**
   - Product line (calculated) — Item revenue and Items purchased (bar).
   - Top 10 items table: Item name — Items viewed, Items added to cart, Items
     purchased, Item revenue; sorted by Item revenue desc.
7. **Context row:** Device category — Sessions (donut); Top pages table:
   Page title — Views (top 10).

## 5. Styling

Match the Verdian store's brand:

- Background `#f6f4ef` (warm off-white), cards `#ffffff` with subtle border
  `#dcd8cf`, text `#151816`, muted text `#676d69`.
- Primary / brand color: deep forest green `#1f4d3a`. Use it for the main
  series and headline numbers.
- Supporting palette for categories (lines, channels): forest `#1f4d3a`,
  sage `#8cc4a6`, clay `#c0643a`, slate `#6f7780`, sand `#d6c3a0`.
  Keep Classic / Performance / Street colors consistent across charts.
- Typography: geometric sans for headings (Outfit if available in Looker
  Studio, otherwise Montserrat or Poppins), clean sans for body (Inter,
  otherwise Roboto).
- Clean, premium, minimal: generous spacing, no 3D, no gradients, few gridlines.
- Canvas: desktop, 1200–1400 px wide, readable without scrolling past the KPI
  row on a laptop.

## 6. Constraints and pitfalls to respect

- **Looker Studio only** — use its standard chart types and theme settings; no
  custom visualizations or community connectors.
- **GA4 connector only** — no BigQuery, no blended data sources.
- **Do not mix scopes:** item-scope fields (Item name, Item category, Items
  purchased, Item revenue, Product line) go in their own charts, never with
  Sessions/Users.
- **No geography chart:** synthetic visitors run from cloud servers, so every
  visit appears to come from Des Moines, Iowa. Location is not meaningful.
- **Quota-friendly:** GA4's API has hourly quotas in Looker Studio; keep the
  page to roughly 10–12 charts.
- **Empty states:** data is processed with a 24–48 h delay; design must still
  look intentional when some charts are near zero.
