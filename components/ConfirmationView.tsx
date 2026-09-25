"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/catalog";
import { pushPurchase } from "@/lib/datalayer";
import { ORDER_KEY, SENT_PURCHASES_KEY, type Order } from "@/lib/order";

export function ConfirmationView() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    let placed: Order | null = null;
    try {
      const raw = sessionStorage.getItem(ORDER_KEY);
      placed = raw ? JSON.parse(raw) : null;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(placed);
    if (!placed) return;

    // purchase — once per order. Reloading this page must not send the same
    // order again, so order ids that were already pushed are remembered.
    let sent: string[] = [];
    try {
      sent = JSON.parse(localStorage.getItem(SENT_PURCHASES_KEY) || "[]");
    } catch {}
    if (sent.includes(placed.id)) return;
    try {
      localStorage.setItem(SENT_PURCHASES_KEY, JSON.stringify([...sent, placed.id].slice(-50)));
    } catch {}
    pushPurchase(
      placed.id,
      placed.total,
      placed.items.map(({ item_id, item_name, item_category, price, quantity }) => ({ item_id, item_name, item_category, price, quantity })),
    );
  }, []);

  if (order === undefined) return <div className="mx-auto min-h-[50vh] max-w-3xl px-5 py-16" />;

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center">
        <h1 className="font-display text-3xl font-medium tracking-tight">No recent order</h1>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">Back to Verdian</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">Order confirmed</p>
      <h1 className="mt-4 font-display text-5xl font-medium tracking-tight">Thank you, {order.name.split(" ")[0]}.</h1>
      <p className="mt-5 leading-relaxed text-muted">
        Your order <span className="font-medium text-fg">{order.id}</span> has been placed. A confirmation would be sent to{" "}
        {order.email}.
      </p>

      <div className="mt-12 grid gap-8 border-t border-line pt-8 text-sm sm:grid-cols-2">
        <div>
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Shipping to</h2>
          <p className="mt-3 leading-relaxed">
            {order.name}
            <br />
            {order.address.street}
            <br />
            {order.address.postalCode} {order.address.city}
            <br />
            {order.address.country}
          </p>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.16em] text-muted">Items</h2>
          <ul className="mt-3 space-y-2">
            {order.items.map((i) => (
              <li key={`${i.item_id}-${i.size}`} className="flex justify-between gap-4">
                <span>
                  {i.item_name} <span className="text-muted">· {i.size} × {i.quantity}</span>
                </span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-line pt-4 text-base">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </p>
        </div>
      </div>

      <Link href="/" className="mt-14 inline-block rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-fg">
        Continue shopping
      </Link>
    </div>
  );
}
