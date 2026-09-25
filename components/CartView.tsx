"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { FREE_SHIPPING_THRESHOLD, formatPrice, getProductById } from "@/lib/catalog";
import { CURRENCY, itemsValue, toGA4Item, track } from "@/lib/analytics";
import { useStore } from "@/lib/store";
import { ProductArt } from "./ProductArt";

export function cartItems(cart: ReturnType<typeof useStore>["cart"]) {
  return cart.flatMap((line) => {
    const p = getProductById(line.productId);
    return p ? [toGA4Item(p, { color: line.color, size: line.size, quantity: line.quantity })] : [];
  });
}

export function CartView() {
  const { ready, cart, cartSubtotal, updateQuantity, removeFromCart } = useStore();
  const tracked = useRef(false);

  useEffect(() => {
    if (!ready || tracked.current) return;
    tracked.current = true;
    const items = cartItems(cart);
    track("view_cart", { ecommerce: { currency: CURRENCY, value: itemsValue(items), items } });
  }, [ready, cart]);

  if (!ready) return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">Loading…</div>;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-black tracking-tight">Your bag is empty</h1>
        <p className="mt-3 text-stone-500">Find something you like and it will show up here.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-black px-7 py-3.5 font-semibold text-white hover:bg-forest">
          Start shopping
        </Link>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Your bag</h1>
        <ul className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          {cart.map((line) => {
            const p = getProductById(line.productId);
            if (!p) return null;
            const color = p.colors.find((c) => c.name === line.color) ?? p.colors[0];
            return (
              <li key={`${line.productId}-${line.color}-${line.size}`} className="flex gap-4 py-6">
                <Link href={`/products/${p.slug}`} className="w-28 shrink-0">
                  <ProductArt type={p.type} color={color} className="w-full rounded-lg" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/products/${p.slug}`} className="font-medium hover:underline">{p.name}</Link>
                      <p className="text-sm text-stone-500">{line.color} · Size {line.size}</p>
                    </div>
                    <p className="font-medium">{formatPrice(p.price * line.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-4 pt-4">
                    <div className="flex items-center rounded-full border border-stone-300">
                      <button type="button" className="px-3 py-1" onClick={() => updateQuantity(line, line.quantity - 1)} aria-label={`Decrease quantity of ${p.name}`}>−</button>
                      <span className="w-6 text-center text-sm" aria-label="Quantity">{line.quantity}</span>
                      <button type="button" className="px-3 py-1" onClick={() => updateQuantity(line, line.quantity + 1)} aria-label={`Increase quantity of ${p.name}`}>+</button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(line)} className="text-sm text-stone-500 underline underline-offset-4 hover:text-black">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl bg-stone-100 p-6">
        <h2 className="text-lg font-bold">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(cartSubtotal)}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>Calculated at checkout</dd></div>
        </dl>
        {remaining > 0 ? (
          <p className="mt-4 text-sm text-stone-600">Add {formatPrice(remaining)} more for free standard shipping.</p>
        ) : (
          <p className="mt-4 text-sm font-medium text-forest">You qualify for free standard shipping.</p>
        )}
        <Link href="/checkout" className="mt-6 block rounded-full bg-black py-4 text-center font-semibold text-white hover:bg-forest">
          Checkout
        </Link>
        <Link href="/shop" className="mt-3 block text-center text-sm underline underline-offset-4">Continue shopping</Link>
      </aside>
    </div>
  );
}
