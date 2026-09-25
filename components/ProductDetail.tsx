"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { pushAddToCart, pushViewItem } from "@/lib/datalayer";
import { ProductImage } from "./ProductImage";

export function ProductDetail({ product, colorways }: { product: Product; colorways: Product[] }) {
  const { add } = useCart();
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const viewed = useRef(false);

  // view_item — once per product page load. The ref guard also stops React's
  // development-only double effect run from pushing it twice.
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    pushViewItem(product);
  }, [product]);

  function addToCart() {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size, quantity);
    pushAddToCart(product, quantity);
    setAdded(true);
    setQuantity(1);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-6 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="self-start overflow-hidden rounded-sm bg-surface lg:sticky lg:top-24">
        <ProductImage product={product} priority sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-square w-full object-cover" />
      </div>

      <div className="lg:pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
          {product.line} · {product.subcategory}
          {product.tag && <span className="ml-2 rounded-full border border-brand px-2 py-0.5">{product.tag}</span>}
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight">{product.model}</h1>
        <p className="mt-2 text-lg text-muted">{product.colorway}</p>
        <p className="mt-6 text-2xl">{formatPrice(product.price)}</p>

        {/* Color selector — each colorway is its own SKU and URL */}
        <div className="mt-10">
          <p className="text-sm">
            Color <span className="text-muted">— {product.colorway}</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-3" aria-label="Colorways">
            {colorways.map((c) => {
              const current = c.id === product.id;
              return (
                <li key={c.id}>
                <Link
                  href={`/products/${c.slug}`}
                  replace
                  scroll={false}
                  aria-label={`${c.colorway}${current ? " (selected)" : ""}`}
                  aria-current={current ? "true" : undefined}
                  title={c.colorway}
                  className={`grid h-11 w-11 place-items-center rounded-full border transition-colors ${
                    current ? "border-fg" : "border-transparent hover:border-line"
                  }`}
                >
                  <span
                    className="h-8 w-8 rounded-full ring-1 ring-black/10"
                    style={{ background: `linear-gradient(135deg, ${c.swatch.primary} 55%, ${c.swatch.secondary} 55%)` }}
                  />
                </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Size selector */}
        {!oneSize && (
          <fieldset className="mt-8">
            <div className="flex items-baseline justify-between">
              <legend className="text-sm">
                Size {product.category === "footwear" && <span className="text-muted">— US</span>}
              </legend>
            </div>
            <div className={`mt-3 grid gap-2 ${product.category === "footwear" ? "grid-cols-5" : "grid-cols-6"}`}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setError(false);
                    setAdded(false);
                  }}
                  aria-pressed={size === s}
                  className={`rounded-sm border py-3 text-sm transition-colors ${
                    size === s ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
                Please select a size.
              </p>
            )}
          </fieldset>
        )}

        {/* Quantity + add to cart */}
        <div className="mt-8 flex gap-3">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-full px-4 text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-sm" aria-live="polite" aria-label={`Quantity ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="h-full px-4 text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={addToCart}
            className="flex-1 rounded-full bg-brand py-4 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
          >
            Add to cart
          </button>
        </div>
        {added && (
          <p className="mt-4 text-sm" role="status">
            Added to your cart.{" "}
            <Link href="/cart" className="underline underline-offset-4">
              View cart
            </Link>
          </p>
        )}

        <div className="mt-12 border-t border-line pt-8">
          <h2 className="text-sm font-medium">Description</h2>
          <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
          <p className="mt-6 text-xs text-muted">Style {product.id}</p>
        </div>
      </div>
    </div>
  );
}
