// Metrics dictionary, v1.0 draft. Owned by Daniel (sign-off) and Arthur
// (definitions and implementation). Due for sign-off on 30 October 2026.
// Rule: no decision may use a number that isn't defined here.

export type Metric = { term: string; definition: string; source: string; group: string };

export const dictionaryStatus = { version: "1.0 draft", signOffDue: "2026-10-30", owners: ["daniel", "arthur"] };

export const metrics: Metric[] = [
  // Revenue and orders
  { group: "Revenue and orders", term: "Gross merchandise sales", definition: "Sum of item prices on paid orders, excluding tax and shipping.", source: "Orders (BigQuery)" },
  { group: "Revenue and orders", term: "Net revenue", definition: "Gross merchandise sales minus refunds, with refunds booked on the date they're processed.", source: "Orders (BigQuery) → ledger" },
  { group: "Revenue and orders", term: "Order", definition: "A paid order with a unique order_id. Test orders and simulated orders are excluded.", source: "Orders" },
  { group: "Revenue and orders", term: "AOV", definition: "Gross merchandise sales ÷ orders.", source: "Orders" },
  // Site
  { group: "Site", term: "Conversion rate", definition: "Orders ÷ sessions (GA4 sessions, simulated traffic excluded). Orders matched on transaction_id where possible.", source: "GA4 + Orders" },
  { group: "Site", term: "Checkout completion", definition: "Sessions with a purchase ÷ sessions with begin_checkout.", source: "GA4" },
  { group: "Site", term: "GA4 coverage", definition: "Order IDs with a GA4 purchase event ÷ orders. Replaces 'GA4 revenue within ±5% of orders': a 10–20% browser-side gap is normal.", source: "GA4 + Orders" },
  // Customers
  { group: "Customers", term: "New customer", definition: "A customer placing their first paid order ever, identified by normalised email.", source: "Orders" },
  { group: "Customers", term: "Repeat purchase rate (12 months)", definition: "Customers with 2+ orders within 365 days of their first order ÷ customers in that cohort.", source: "Orders" },
  { group: "Customers", term: "List size", definition: "Subscribed, consented, non-bot email profiles.", source: "Email platform" },
  // Marketing
  { group: "Marketing", term: "nCAC", definition: "Total marketing spend in the period ÷ new customers in the period.", source: "Ledger + Orders" },
  { group: "Marketing", term: "Blended CAC", definition: "Same as nCAC at Verdian unless Daniel defines otherwise.", source: "Ledger + Orders" },
  { group: "Marketing", term: "MER", definition: "Net revenue ÷ total marketing spend.", source: "Ledger + Orders" },
  { group: "Marketing", term: "Platform ROAS", definition: "Meta-reported purchase value ÷ Meta spend (7-day click, 1-day view). A delivery metric, not a finance metric.", source: "Meta" },
  { group: "Marketing", term: "GA4 last-click ROAS", definition: "GA4 purchase revenue where the last non-direct source is meta ÷ Meta spend.", source: "GA4" },
  { group: "Marketing", term: "Hook rate", definition: "3-second video plays ÷ impressions.", source: "Meta" },
  { group: "Marketing", term: "Frequency (7 days)", definition: "Impressions ÷ reach over 7 days.", source: "Meta" },
  { group: "Marketing", term: "Seeding post rate", definition: "Creators who posted within 45 days ÷ creators shipped.", source: "Seeding tracker" },
  // Profitability
  { group: "Profitability", term: "Contribution margin per order", definition: "Net revenue − product cost − shipping − packaging − payment fees − return costs, per order.", source: "Ledger" },
  { group: "Profitability", term: "Contribution margin after marketing", definition: "Contribution margin − marketing spend.", source: "Ledger" },
  { group: "Profitability", term: "CAC payback", definition: "nCAC ÷ contribution margin of the first order (in orders; in months once cohorts exist).", source: "Ledger + Orders" },
  { group: "Profitability", term: "Care kit attach rate", definition: "Footwear orders that include a care kit, or whose customer buys one within 60 days ÷ footwear orders.", source: "Orders" },
  // Product and stock
  { group: "Product and stock", term: "Return rate", definition: "Units returned ÷ units shipped, by category.", source: "3PL + Orders" },
  { group: "Product and stock", term: "Full-price sell-through", definition: "Units sold at full price, net of returns ÷ units received.", source: "Orders + Inventory" },
  { group: "Product and stock", term: "Weeks of cover", definition: "Units on hand ÷ average weekly units sold over the last 4 weeks.", source: "Inventory" },
];
