"use client";

// Fires the `purchase` event — the most important event on the site.
//
// Duplicate protection: if the customer reloads this page, or comes back to it
// later, we must NOT send the same purchase again (a very common real-world
// GA4 data quality bug that inflates revenue). We keep a list of transaction
// IDs that were already tracked and skip any we've seen.

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { CURRENCY, track } from "@/lib/analytics";
import { LAST_ORDER_KEY, TRACKED_ORDERS_KEY, type PlacedOrder } from "@/lib/order";

export function ConfirmationView() {
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined);

  useEffect(() => {
    let placed: PlacedOrder | null = null;
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      placed = raw ? (JSON.parse(raw) as PlacedOrder) : null;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(placed);
    if (!placed) return;

    let tracked: string[] = [];
    try {
      tracked = JSON.parse(localStorage.getItem(TRACKED_ORDERS_KEY) || "[]");
    } catch {}
    if (tracked.includes(placed.transactionId)) return; // already sent — don't double count

    track("purchase", {
      user_id: placed.userId ?? undefined,
      ecommerce: {
        transaction_id: placed.transactionId,
        currency: CURRENCY,
        value: placed.totals.value,
        tax: placed.totals.tax,
        shipping: placed.totals.shipping,
        ...(placed.coupon ? { coupon: placed.coupon } : {}),
        shipping_tier: placed.shippingTier,
        payment_type: placed.paymentType,
        items: placed.items,
      },
    });
    try {
      localStorage.setItem(TRACKED_ORDERS_KEY, JSON.stringify([...tracked, placed.transactionId].slice(-50)));
    } catch {}
  }, []);

  if (order === undefined) return <div className="mx-auto max-w-3xl px-4 py-16">Loading…</div>;

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black tracking-tight">No recent order found</h1>
        <Link href="/shop" className="mt-6 inline-block underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-forest">Order confirmed</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Thanks, {order.firstName}!</h1>
      <p className="mt-3 text-stone-600">
        Your order <span className="font-mono font-semibold text-black">{order.transactionId}</span> is confirmed. A receipt would be sent to {order.email} (this is a demo store — nothing ships).
      </p>
      <ul className="mt-8 divide-y divide-stone-200 border-y border-stone-200 text-sm">
        {order.items.map((i) => (
          <li key={`${i.item_id}-${i.item_variant}-${i.item_size}`} className="flex justify-between py-3">
            <span>{i.item_name} <span className="text-stone-500">· {i.item_variant} · {i.item_size} × {i.quantity}</span></span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
        {order.totals.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{formatPrice(order.totals.discount)}</dd></div>}
        <div className="flex justify-between"><dt>Shipping</dt><dd>{order.totals.shipping === 0 ? "Free" : formatPrice(order.totals.shipping)}</dd></div>
        <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(order.totals.tax)}</dd></div>
        <div className="flex justify-between font-bold"><dt>Total</dt><dd>{formatPrice(order.totals.total)}</dd></div>
      </dl>
      <Link href="/shop" className="mt-10 inline-block rounded-full bg-black px-7 py-3.5 font-semibold text-white hover:bg-forest">
        Keep shopping
      </Link>
    </div>
  );
}
