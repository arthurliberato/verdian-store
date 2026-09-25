"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/catalog";
import { CURRENCY, toGA4Item, track } from "@/lib/analytics";
import { ProductCard } from "./ProductCard";

// A grid of products that reports itself to analytics:
//   view_item_list — once, when the list is shown (with every item + its position)
//   select_item    — when a product in the list is clicked
//
// `listId` / `listName` identify WHICH list (homepage drops, a category, search
// results…). GA4 carries them forward to later events for that item, so you can
// attribute add_to_cart / purchase back to the list that produced the click.
export function ProductList({
  products,
  listId,
  listName,
  columns = 4,
}: {
  products: Product[];
  listId: string;
  listName: string;
  columns?: 3 | 4;
}) {
  const key = products.map((p) => p.id).join(",");

  useEffect(() => {
    if (products.length === 0) return;
    track("view_item_list", {
      ecommerce: {
        item_list_id: listId,
        item_list_name: listName,
        items: products.map((p, index) => toGA4Item(p, { listId, listName, index })),
      },
    });
    // Re-fire only when the list or its contents change (e.g. new filter).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, listName, key]);

  function select(product: Product, index: number) {
    // Remember the list so the product page can attribute view_item / add_to_cart.
    try {
      sessionStorage.setItem("verdian_last_list", JSON.stringify({ productId: product.id, listId, listName, index }));
    } catch {}
    track("select_item", {
      ecommerce: {
        item_list_id: listId,
        item_list_name: listName,
        currency: CURRENCY,
        items: [toGA4Item(product, { listId, listName, index })],
      },
    });
  }

  if (products.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} md:grid-cols-3`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} onSelect={() => select(p, i)} />
      ))}
    </div>
  );
}
