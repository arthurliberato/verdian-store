"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatPrice, siblingColorways, type Product } from "@/lib/catalog";
import { pushSelectItem, pushViewItemList, type ProductList } from "@/lib/datalayer";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, list, index }: { product: Product; list: ProductList; index: number }) {
  const colorCount = siblingColorways(product).length;
  return (
    <Link href={`/products/${product.slug}`} onClick={() => pushSelectItem(list, product, index)} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-surface">
        <ProductImage
          product={product}
          className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-bg/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]">
            {product.tag}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-sm">
        <div>
          <h3 className="font-medium">{product.model}</h3>
          <p className="text-muted">
            {product.colorway}
            {colorCount > 1 && <span> · {colorCount} colors</span>}
          </p>
        </div>
        <p className="shrink-0">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

// A grid is a product list (docs/tracking/TRACKING_PLAN.md): view_item_list once per list and filter
// shown, select_item when a card is clicked. The ref also stops React's development-only double
// effect run from pushing it twice.
export function ProductGrid({ products, list, listFilter }: { products: Product[]; list: ProductList; listFilter?: string }) {
  const shown = useRef<string | null>(null);

  useEffect(() => {
    const key = `${list.item_list_id}|${listFilter ?? ""}`;
    if (shown.current === key || products.length === 0) return;
    shown.current = key;
    pushViewItemList(list, products, listFilter);
  }, [list, products, listFilter]);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} list={list} index={i + 1} />
      ))}
    </div>
  );
}
