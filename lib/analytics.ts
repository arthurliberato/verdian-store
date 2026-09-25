// Verdian analytics layer.
//
// The store NEVER calls GA4, Meta, or Google Ads directly. It only pushes
// structured events into `window.dataLayer`. Google Tag Manager (GTM) reads
// that array and decides which tags to fire (GA4 event tag, Meta Pixel, etc.).
//
//   Store  ──push──▶  window.dataLayer  ──▶  GTM triggers  ──▶  GA4 / Meta / Ads
//
// Every eCommerce event follows Google's recommended GA4 schema:
// https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
//
// The full list of events and their parameters is documented in
// docs/tracking-plan.md.

import type { Product } from "./catalog";

export const CURRENCY = "USD";

/** One entry of the GA4 `items` array. In BigQuery this becomes the nested `items` column you UNNEST(). */
export type GA4Item = {
  item_id: string;
  item_name: string;
  item_brand: string;
  item_category: string;
  item_category2: string;
  item_category3: string;
  item_variant?: string;
  item_list_id?: string;
  item_list_name?: string;
  index?: number;
  price: number;
  discount?: number;
  quantity: number;
  coupon?: string;
  // Custom item-scoped parameter. Register it in GA4 as an item-scoped
  // custom dimension to report on it.
  item_size?: string;
};

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/** Listeners power the on-screen debug panel (components/DataLayerDebug.tsx). */
type Listener = (entry: Record<string, unknown>) => void;
const listeners = new Set<Listener>();

export function subscribeToDataLayer(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function dataLayerPush(entry: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(entry);
  listeners.forEach((l) => l(entry));
}

/**
 * Push an event to the dataLayer.
 *
 * For eCommerce events we first push `{ ecommerce: null }`. GTM merges every
 * push into one data model, so without this reset the `items` of a previous
 * event could leak into the next one. Google recommends this in its docs.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if ("ecommerce" in params) dataLayerPush({ ecommerce: null });
  const payload: DataLayerEvent = { event, ...params };
  dataLayerPush(payload);
}

/** Convert a catalog product into a GA4 item. */
export function toGA4Item(
  product: Product,
  options: {
    quantity?: number;
    color?: string;
    size?: string;
    listId?: string;
    listName?: string;
    index?: number;
    coupon?: string;
  } = {},
): GA4Item {
  const item: GA4Item = {
    item_id: product.id,
    item_name: product.name,
    item_brand: "Verdian",
    item_category: capitalize(product.category), // Classic / Performance / Street
    item_category2: product.type, // court / runner / hoodie ...
    item_category3: product.audience, // heritage / performance / hype
    price: product.price,
    quantity: options.quantity ?? 1,
  };
  if (product.compareAtPrice) item.discount = round(product.compareAtPrice - product.price);
  if (options.color) item.item_variant = options.color;
  if (options.size) item.item_size = options.size;
  if (options.listId) item.item_list_id = options.listId;
  if (options.listName) item.item_list_name = options.listName;
  if (options.index !== undefined) item.index = options.index;
  if (options.coupon) item.coupon = options.coupon;
  return item;
}

export function itemsValue(items: GA4Item[]): number {
  return round(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
}

export function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
