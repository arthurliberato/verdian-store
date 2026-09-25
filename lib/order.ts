// Order math shared by checkout and the confirmation page.

import { FREE_SHIPPING_THRESHOLD, coupons, shippingOptions, type ShippingTier } from "./catalog";
import { round, type GA4Item } from "./analytics";

export const TAX_RATE = 0.08;

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  /** GA4 `value`: merchandise revenue after discount, excluding tax and shipping. */
  value: number;
};

export function computeTotals(subtotal: number, shippingTier: ShippingTier, coupon: string | null): OrderTotals {
  const rate = coupon ? (coupons[coupon] ?? 0) : 0;
  const discount = round(subtotal * rate);
  const option = shippingOptions.find((o) => o.id === shippingTier) ?? shippingOptions[0];
  const shipping = option.id === "standard" && subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : option.price;
  const tax = round((subtotal - discount) * TAX_RATE);
  const value = round(subtotal - discount);
  return { subtotal, discount, shipping, tax, total: round(value + shipping + tax), value };
}

export type PlacedOrder = {
  transactionId: string;
  placedAt: string;
  email: string;
  firstName: string;
  userId: string | null;
  shippingTier: ShippingTier;
  paymentType: string;
  coupon: string | null;
  totals: OrderTotals;
  items: GA4Item[];
};

export const LAST_ORDER_KEY = "verdian_last_order";
export const TRACKED_ORDERS_KEY = "verdian_tracked_orders";

export function newTransactionId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VRD-${Date.now().toString(36).toUpperCase()}-${rand}`;
}
