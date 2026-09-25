// Minimal data layer. The store pushes exactly five events to window.dataLayer:
//
//   page_view       { page_title, page_path }
//   view_item       { ecommerce: { items: [{ item_id, item_name, item_category, price }] } }
//   add_to_cart     { ecommerce: { items: [{ item_id, item_name, item_category, price, quantity }] } }
//   begin_checkout  {}
//   purchase        { ecommerce: { transaction_id, value, items: [...] } }
//
// Nothing else is pushed and no tracking scripts are loaded — the measurement
// layer (GTM, GA4, etc.) is built separately on top of these events.

import type { Product } from "./catalog";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export type DataLayerItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity?: number;
};

// While a page_view is waiting for the page title (see pushPageView), other
// pushes are held here so page_view is always the first event for a page.
let pageViewPending = false;
const held: Record<string, unknown>[] = [];

function push(entry: Record<string, unknown>) {
  if (pageViewPending) {
    held.push(entry);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(entry);
}

/**
 * Tag managers merge every push into one data model, so an `ecommerce` object
 * from an earlier push would otherwise carry over into the next event.
 * Clearing it first is Google's documented practice; it is not an event.
 */
function pushEcommerceEvent(entry: Record<string, unknown>) {
  push({ ecommerce: null });
  push(entry);
}

export function toItem(product: Product, quantity?: number): DataLayerItem {
  const item: DataLayerItem = {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
  };
  if (quantity !== undefined) item.quantity = quantity;
  return item;
}

/**
 * On client-side navigations Next.js can set document.title slightly after the
 * route changes. If the title is still empty, wait for it (max 2s) before
 * pushing page_view, holding any other pushes until then.
 */
export function pushPageView(pagePath: string) {
  if (document.title) {
    push({ event: "page_view", page_title: document.title, page_path: pagePath });
    return;
  }
  pageViewPending = true;
  const release = () => {
    observer.disconnect();
    clearTimeout(timer);
    pageViewPending = false;
    push({ event: "page_view", page_title: document.title, page_path: pagePath });
    held.splice(0).forEach(push);
  };
  const observer = new MutationObserver(() => {
    if (document.title) release();
  });
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  const timer = setTimeout(release, 2000);
}

export function pushViewItem(product: Product) {
  pushEcommerceEvent({ event: "view_item", ecommerce: { items: [toItem(product)] } });
}

export function pushAddToCart(product: Product, quantity: number) {
  pushEcommerceEvent({ event: "add_to_cart", ecommerce: { items: [toItem(product, quantity)] } });
}

export function pushBeginCheckout() {
  pushEcommerceEvent({ event: "begin_checkout" });
}

export function pushPurchase(transactionId: string, value: number, items: DataLayerItem[]) {
  pushEcommerceEvent({ event: "purchase", ecommerce: { transaction_id: transactionId, value, items } });
}
