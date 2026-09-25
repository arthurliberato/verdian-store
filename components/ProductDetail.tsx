"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, type Product } from "@/lib/catalog";
import { CURRENCY, toGA4Item, track } from "@/lib/analytics";
import { useStore, type ListContext } from "@/lib/store";
import { ProductArt } from "./ProductArt";

// If the shopper clicked this product in a list (see ProductList), reuse that
// list's id/name so view_item and add_to_cart are attributed to it.
function readListContext(productId: string): ListContext {
  try {
    const raw = sessionStorage.getItem("verdian_last_list");
    if (!raw) return {};
    const ctx = JSON.parse(raw);
    return ctx.productId === productId ? { listId: ctx.listId, listName: ctx.listName, index: ctx.index } : {};
  } catch {
    return {};
  }
}

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [list, setList] = useState<ListContext>({});
  const color = product.colors[colorIndex];
  const inWishlist = wishlist.includes(product.id);

  useEffect(() => {
    const ctx = readListContext(product.id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setList(ctx);
    const items = [toGA4Item(product, { color: product.colors[0].name, ...ctx })];
    track("view_item", { ecommerce: { currency: CURRENCY, value: product.price, items } });
  }, [product]);

  function chooseColor(i: number) {
    setColorIndex(i);
    track("select_color", { item_id: product.id, item_name: product.name, color: product.colors[i].name });
  }

  function chooseSize(s: string) {
    const available = !product.soldOutSizes.includes(s);
    track("select_size", {
      item_id: product.id,
      item_name: product.name,
      size: s,
      size_available: available,
      low_stock: product.lowStockSizes.includes(s),
    });
    if (!available) {
      setError(`Size ${s} is sold out.`);
      return;
    }
    setSize(s);
    setError(null);
  }

  function add() {
    if (!size) {
      setError("Please select a size.");
      track("add_to_cart_error", { item_id: product.id, error_type: "no_size_selected" });
      return;
    }
    // add_to_cart is tracked inside the store; we pass the list context along.
    addToCart(product, color.name, size, 1, list);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const allSoldOut = product.soldOutSizes.length === product.sizes.length;

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-4">
        <ProductArt type={product.type} color={color} className="w-full rounded-2xl" />
      </div>

      <div>
        <nav className="text-sm text-stone-500" aria-label="Breadcrumb">
          <Link href="/shop" className="hover:underline">Shop</Link> /{" "}
          <Link href={`/shop/${product.category}`} className="capitalize hover:underline">{product.category}</Link>
        </nav>
        {product.limited && (
          <p className="mt-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Limited drop · no restocks
          </p>
        )}
        <h1 className="mt-3 text-4xl font-black tracking-tight">{product.name}</h1>
        <div className="mt-2 flex items-baseline gap-3">
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          {product.compareAtPrice && (
            <p className="text-lg text-stone-400 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
        <p className="mt-1 text-sm text-stone-500">
          ★ {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
        </p>

        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">Color: {color.name}</legend>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => chooseColor(i)}
                aria-label={c.name}
                aria-pressed={i === colorIndex}
                className={`h-10 w-10 rounded-full border-2 ${i === colorIndex ? "border-black" : "border-stone-200"}`}
                style={{ background: `linear-gradient(135deg, ${c.hex} 50%, ${c.accent} 50%)` }}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">
            Size {product.sizes[0].match(/\d/) ? "(US)" : ""}
          </legend>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.sizes.map((s) => {
              const soldOut = product.soldOutSizes.includes(s);
              const low = product.lowStockSizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => chooseSize(s)}
                  aria-pressed={size === s}
                  aria-label={`Size ${s}${soldOut ? ", sold out" : low ? ", low stock" : ""}`}
                  className={`relative rounded-lg border py-3 text-sm font-medium ${
                    size === s
                      ? "border-black bg-black text-white"
                      : soldOut
                        ? "border-stone-200 text-stone-300 line-through"
                        : "border-stone-300 hover:border-black"
                  }`}
                >
                  {s}
                  {low && !soldOut && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />}
                </button>
              );
            })}
          </div>
          {product.lowStockSizes.length > 0 && (
            <p className="mt-2 text-xs text-stone-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" /> Only a few left
            </p>
          )}
        </fieldset>

        {error && <p className="mt-4 text-sm font-medium text-red-600" role="alert">{error}</p>}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={add}
            disabled={allSoldOut}
            className="flex-1 rounded-full bg-black py-4 font-semibold text-white hover:bg-forest disabled:bg-stone-300"
          >
            {allSoldOut ? "Sold out" : added ? "Added to bag ✓" : "Add to bag"}
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product, list.listName)}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className="rounded-full border border-stone-300 px-5 text-xl hover:border-black"
          >
            {inWishlist ? "♥" : "♡"}
          </button>
        </div>
        {added && (
          <p className="mt-3 text-sm">
            <Link href="/cart" className="font-semibold underline underline-offset-4">View bag and check out</Link>
          </p>
        )}

        <div className="mt-10 border-t border-stone-200 pt-6">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-2 text-stone-600">{product.description}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-stone-600">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-stone-400">Style: {product.id}</p>
        </div>
      </div>
    </div>
  );
}
