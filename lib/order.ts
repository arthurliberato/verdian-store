import type { DataLayerItem } from "./datalayer";

export type Order = {
  id: string;
  placedAt: string;
  name: string;
  email: string;
  address: { street: string; city: string; postalCode: string; country: string };
  total: number;
  items: (DataLayerItem & { quantity: number; colorway: string; size: string })[];
};

export const ORDER_KEY = "verdian_last_order";
export const SENT_PURCHASES_KEY = "verdian_sent_purchases";

export function newOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VRD-${time}-${rand}`;
}
