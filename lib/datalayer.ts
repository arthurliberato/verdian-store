// Verdian data layer v2. Built from docs/tracking/TRACKING_PLAN.md: the plan wins any disagreement.
// Store code never writes to window.dataLayer directly: it calls the push functions in this file.

import type { Product } from "./catalog";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// The kind of page, sent with every page_view and used as GA4's content group.
export type PageType =
  | "home"
  | "line"
  | "product"
  | "cart"
  | "checkout"
  | "confirmation"
  | "not_found"
  | "other";

// Every event the store may push (§3), in funnel order. Planned events join when their feature ships.
export type EventName =
  | "page_view"
  | "view_promotion"
  | "select_promotion"
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "select_size"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "checkout_error"
  | "add_payment_info"
  | "purchase"
  | "newsletter_signup";

// One product inside an ecommerce event (§4). Every event sends every required field.
export type DataLayerItem = {
  item_id: string;
  item_name: string;
  item_brand: "Verdian";
  item_category: Product["category"]; // footwear | apparel | accessories
  item_category2: Product["line"]; // Classic | Performance | Street
  item_category3: string; // subcategory
  item_category4: string; // model
  item_variant: string; // colorway
  price: number; // what the customer pays per unit, USD
  quantity: number;
  is_markdown: boolean; // false for every item until the archive sale
  discount?: number; // full price minus price, per unit (archive sale)
  index?: number; // position in a list, from 1
  item_list_id?: string;
  item_list_name?: string;
  item_size?: string; // text: "10.5", "M", "OS"
};

// Turns a catalog product into a data layer item. The only place item fields are filled in.
export function toItem(product: Product, quantity = 1): DataLayerItem {
  return {
    item_id: product.id,
    item_name: product.name,
    item_brand: "Verdian",
    item_category: product.category,
    item_category2: product.line,
    item_category3: product.subcategory,
    item_category4: product.model,
    item_variant: product.colorway,
    price: product.price,
    quantity,
    is_markdown: false,
  };
}

// While a page_view waits for the page title, other pushes wait here, so page_view is always first (§1).
let pageViewPending = false;
const held: Record<string, unknown>[] = [];

// The one function that writes to window.dataLayer. Not exported: other files can't bypass it (line 2).
function push(entry: Record<string, unknown>) {
  warnIfOffPlan(entry);
  if (pageViewPending) {
    held.push(entry);
    return;
  }
  window.dataLayer ??= [];
  window.dataLayer.push(entry);
}

// Every ecommerce event goes through here (§1): clear the last ecommerce object, then push with
// currency and value worked out from the items, so no component can send a wrong total.
// GA4's own parameters (transaction_id, payment_type...) go inside ecommerce; ours (cart_location...) outside.
function pushEcommerceEvent(
  event: EventName,
  items: DataLayerItem[],
  ecommerceParams: Record<string, unknown> = {},
  eventParams: Record<string, unknown> = {},
) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = Math.round(total * 100) / 100;
  push({ ecommerce: null });
  push({ event, ...eventParams, ecommerce: { ...ecommerceParams, currency: "USD", value, items } });
}

// Which kind of page this is (§3), from the URL. A new route needs a line here or it reports as "other".
// A 404 can happen at any URL (/products/old-name), so the not-found page marks itself and is checked first.
function pageTypeFor(pathname: string): PageType {
  if (document.querySelector("[data-page-type='not_found']")) return "not_found";
  if (pathname === "/") return "home";
  if (pathname.startsWith("/shop/")) return "line";
  if (pathname.startsWith("/products/")) return "product";
  if (pathname === "/cart") return "cart";
  if (pathname === "/checkout") return "checkout";
  if (pathname === "/checkout/confirmation") return "confirmation";
  return "other";
}

// page_view, always the first push for a page (§1). On client-side navigation Next.js can set the
// title a moment after the URL changes: if it's still empty, wait for it (at most 2 s) and hold
// every other push until page_view has gone.
export function pushPageView(pagePath: string) {
  const send = () =>
    push({
      event: "page_view",
      page_type: pageTypeFor(pagePath.split("?")[0]),
      page_title: document.title,
      page_path: pagePath,
    });
  if (document.title) {
    send();
    return;
  }
  pageViewPending = true;
  const release = () => {
    observer.disconnect();
    clearTimeout(timer);
    pageViewPending = false;
    send();
    held.splice(0).forEach(push);
  };
  const observer = new MutationObserver(() => {
    if (document.title) release();
  });
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  const timer = setTimeout(release, 2000);
}

// Internal promotions (§3): home hero and line tiles. GA4 reports promotions per item, so each
// promotion names the product its creative shows. Parameters are GA4's own, so they go inside ecommerce.
export type Promotion = {
  promotion_id: string; // what is promoted, e.g. "arco_flagship"
  promotion_name: string; // readable, e.g. "Arco: Made to be worn in"
  creative_name: string; // the creative shown, e.g. "worn_in_hero", "line_tile"
  creative_slot: string; // where on the page, e.g. "home_hero", "home_lines_2"
};

export function pushViewPromotion(promotion: Promotion, product: Product) {
  pushEcommerceEvent("view_promotion", [toItem(product)], promotion);
}

// promotion_link (ours) says which link inside the creative was clicked, e.g. "image", "button".
// It stays out of creative_name so views and clicks of the same creative still match up.
export function pushSelectPromotion(promotion: Promotion, product: Product, link: string) {
  pushEcommerceEvent("select_promotion", [toItem(product)], promotion, { promotion_link: link });
}

// Product lists (§3). The list goes on each item and on the event: GA4 uses the item's when both exist.
// index is the position in the list, from 1. list_filter (ours) is the ?type= filter on line pages.
export type ProductList = {
  item_list_id: string; // "home_featured", "line_street", "pdp_related", "pdp_colorways"
  item_list_name: string; // "Home — Featured", "Street line", "You may also like", "Other colorways"
};

export function pushViewItemList(list: ProductList, products: Product[], listFilter?: string) {
  const items = products.map((product, i) => ({ ...toItem(product), ...list, index: i + 1 }));
  pushEcommerceEvent("view_item_list", items, list, listFilter ? { list_filter: listFilter } : {});
}

export function pushSelectItem(list: ProductList, product: Product, index: number) {
  pushEcommerceEvent("select_item", [{ ...toItem(product), ...list, index }], list);
}

// Product page shown (§3).
export function pushViewItem(product: Product) {
  pushEcommerceEvent("view_item", [toItem(product)]);
}

// A size button clicked (§3, ours). A plain event, not ecommerce: GA4 only reliably reads items on its own
// ecommerce events. product_ names avoid clashing with GA4's built-in item fields. Size also rides on cart items.
export function pushSelectSize(product: Product, size: string, inStock = true) {
  push({
    event: "select_size",
    product_id: product.id,
    product_model: product.model,
    product_size: size,
    in_stock: inStock, // true until the store has inventory
  });
}

// Where an add happened: the product page button, or + in the cart (§3).
export type CartLocation = "product_page" | "cart";

export function pushAddToCart(product: Product, quantity: number, size: string, cartLocation: CartLocation) {
  const item = { ...toItem(product, quantity), item_size: size };
  pushEcommerceEvent("add_to_cart", [item], {}, { cart_location: cartLocation });
}

// A cart line as the data layer needs it. Every event from the cart to the purchase uses this.
export type CartLineInput = { product: Product; size: string; quantity: number };

function cartItems(lines: CartLineInput[]): DataLayerItem[] {
  return lines.map((line) => ({ ...toItem(line.product, line.quantity), item_size: line.size }));
}

// − or Remove in the cart (§3). quantity is how many were removed, not how many are left.
export function pushRemoveFromCart(product: Product, quantity: number, size: string) {
  pushEcommerceEvent("remove_from_cart", [{ ...toItem(product, quantity), item_size: size }]);
}

// Cart page shown with at least one item (§3): the whole cart, so value is the subtotal.
export function pushViewCart(lines: CartLineInput[]) {
  if (lines.length === 0) return;
  pushEcommerceEvent("view_cart", cartItems(lines));
}

// Checkout opened (§3): the whole cart, now with value (v1 sent no items).
export function pushBeginCheckout(lines: CartLineInput[]) {
  pushEcommerceEvent("begin_checkout", cartItems(lines));
}

// Every shipping field valid for the first time in this checkout (§3). Verdian ships free.
export function pushAddShippingInfo(lines: CartLineInput[]) {
  pushEcommerceEvent("add_shipping_info", cartItems(lines), { shipping_tier: "free_standard" });
}

// A checkout field failed validation (ours). Only the field's name and why, never what was typed (§1).
export type CheckoutField = "name" | "email" | "street" | "city" | "postal_code" | "country";
export type CheckoutErrorReason = "missing" | "invalid";

export function pushCheckoutError(field: CheckoutField, reason: CheckoutErrorReason) {
  push({ event: "checkout_error", checkout_field: field, error_reason: reason });
}

// "Place order" clicked (§3). Demo store: no payment is collected.
export function pushAddPaymentInfo(lines: CartLineInput[]) {
  pushEcommerceEvent("add_payment_info", cartItems(lines), { payment_type: "demo" });
}

// Confirmation page (§3), once per order (the page de-duplicates). The items are the order's own,
// saved when it was placed, so the prices are what was charged. No shipping or tax at Verdian.
export function pushPurchase(transactionId: string, items: DataLayerItem[]) {
  pushEcommerceEvent("purchase", items, { transaction_id: transactionId, shipping: 0, tax: 0 });
}

// Newsletter form submitted successfully (§3, ours). Never the email address.
export type SignupLocation = "footer" | "popup" | "checkout";

export function pushNewsletterSignup(location: SignupLocation) {
  push({ event: "newsletter_signup", signup_location: location });
}

// Development only: warn in the console when a push breaks a rule types can't check. Next.js
// removes this from the production build, so visitors never run it.
function warnIfOffPlan(entry: Record<string, unknown>) {
  if (process.env.NODE_ENV === "production") return;
  const warn = (problem: string) => console.warn(`[dataLayer] ${problem}`, entry);
  if (JSON.stringify(entry).includes("@")) warn("looks like it contains an email address");
  const ecommerce = entry.ecommerce as { items?: DataLayerItem[] } | null | undefined;
  if (!ecommerce) return;
  if (!ecommerce.items?.length) warn("ecommerce event without items");
  for (const item of ecommerce.items ?? []) {
    if (!Number.isFinite(item.price) || item.price < 0) warn(`bad price on ${item.item_id}`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1) warn(`bad quantity on ${item.item_id}`);
  }
}
