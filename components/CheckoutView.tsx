"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice, getProductById } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { pushBeginCheckout, toItem } from "@/lib/datalayer";
import { ORDER_KEY, newOrderId, type Order } from "@/lib/order";

const field = "mt-1.5 w-full rounded-sm border border-line bg-bg px-4 py-3 outline-none transition-colors focus:border-fg";

export function CheckoutView() {
  const router = useRouter();
  const { ready, lines, subtotal, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const started = useRef(false);

  // Load the confirmation page (and its title) ahead of time.
  useEffect(() => {
    router.prefetch("/checkout/confirmation");
  }, [router]);

  // begin_checkout — when the user reaches checkout with something in the cart.
  useEffect(() => {
    if (!ready || started.current || lines.length === 0) return;
    started.current = true;
    pushBeginCheckout();
  }, [ready, lines.length]);

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    const items = lines.flatMap((l) => {
      const p = getProductById(l.productId);
      return p ? [{ ...toItem(p, l.quantity), quantity: l.quantity, colorway: p.colorway, size: l.size }] : [];
    });
    const order: Order = {
      id: newOrderId(),
      placedAt: new Date().toISOString(),
      name: get("name"),
      email: get("email"),
      address: { street: get("street"), city: get("city"), postalCode: get("postalCode"), country: get("country") },
      total: subtotal,
      items,
    };
    setPlacing(true);
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {}
    clear();
    router.push("/checkout/confirmation");
  }

  if (!ready) return <div className="mx-auto min-h-[50vh] max-w-6xl px-5 py-12 sm:px-8" />;

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl font-medium tracking-tight">Your cart is empty</h1>
        <Link href="/shop/classic" className="mt-8 inline-block rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-fg">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={placeOrder} className="space-y-10" aria-label="Checkout">
        <h1 className="font-display text-4xl font-medium tracking-tight">Checkout</h1>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-medium">Contact</legend>
          <div>
            <label htmlFor="name" className="text-sm">Full name</label>
            <input id="name" name="name" required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-medium">Shipping address</legend>
          <div>
            <label htmlFor="street" className="text-sm">Street address</label>
            <input id="street" name="street" required autoComplete="street-address" className={field} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="text-sm">City</label>
              <input id="city" name="city" required autoComplete="address-level2" className={field} />
            </div>
            <div>
              <label htmlFor="postalCode" className="text-sm">Postal code</label>
              <input id="postalCode" name="postalCode" required autoComplete="postal-code" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="country" className="text-sm">Country</label>
            <select id="country" name="country" required autoComplete="country-name" defaultValue="United States" className={field}>
              {["United States", "Canada", "United Kingdom", "Portugal", "Spain", "France", "Germany", "Brazil", "Australia"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="rounded-sm border border-line p-5 text-sm text-muted">
          Payment: this is a demo store. No payment details are collected and nothing will be charged.
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full rounded-full bg-brand py-4 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {placing ? "Placing order…" : `Place order · ${formatPrice(subtotal)}`}
        </button>
      </form>

      <aside className="h-fit rounded-sm bg-surface p-7">
        <h2 className="font-display text-lg font-medium">Order summary</h2>
        <ul className="mt-5 space-y-4 text-sm">
          {lines.map((l) => {
            const p = getProductById(l.productId);
            if (!p) return null;
            return (
              <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-4">
                <span>
                  {p.model} <span className="text-muted">· {p.colorway} · {l.size} × {l.quantity}</span>
                </span>
                <span>{formatPrice(p.price * l.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>Free</dd></div>
          <div className="flex justify-between text-base"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
