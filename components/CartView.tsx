"use client";

import Link from "next/link";
import { formatPrice, getProductById } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

export function CartView() {
  const { ready, lines, subtotal, setQuantity, remove } = useCart();

  if (!ready) return <div className="mx-auto min-h-[50vh] max-w-6xl px-5 py-12 sm:px-8" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl font-medium tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-muted">Find something you&apos;ll wear for years.</p>
        <Link href="/shop/classic" className="mt-8 inline-block rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-fg">
          Shop Classic
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">Cart</h1>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {lines.map((line) => {
            const p = getProductById(line.productId);
            if (!p) return null;
            return (
              <li key={`${line.productId}-${line.size}`} className="flex gap-5 py-6">
                <Link href={`/products/${p.slug}`} className="w-24 shrink-0 overflow-hidden rounded-sm bg-surface sm:w-32">
                  <ProductImage product={p} sizes="128px" className="aspect-square w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/products/${p.slug}`} className="font-medium hover:underline">{p.model}</Link>
                      <p className="text-sm text-muted">{p.colorway}</p>
                      <p className="text-sm text-muted">Size {line.size}</p>
                    </div>
                    <p>{formatPrice(p.price * line.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-5 pt-4 text-sm">
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" className="px-3 py-1.5" onClick={() => setQuantity(line.productId, line.size, line.quantity - 1)} aria-label={`Decrease quantity of ${p.name}`}>−</button>
                      <span className="w-6 text-center">{line.quantity}</span>
                      <button type="button" className="px-3 py-1.5" onClick={() => setQuantity(line.productId, line.size, line.quantity + 1)} aria-label={`Increase quantity of ${p.name}`}>+</button>
                    </div>
                    <button type="button" onClick={() => remove(line.productId, line.size)} className="text-muted underline underline-offset-4 hover:text-fg">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="h-fit rounded-sm bg-surface p-7">
        <h2 className="font-display text-lg font-medium">Summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>Free</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
        </dl>
        <Link href="/checkout" className="mt-7 block rounded-full bg-brand py-4 text-center text-sm font-medium text-brand-fg transition-opacity hover:opacity-90">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
