"use client";

import Link from "next/link";
import { getProductById, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { ProductList } from "./ProductList";

export function WishlistView() {
  const { ready, wishlist } = useStore();
  const items = wishlist.map(getProductById).filter((p): p is Product => Boolean(p));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Wishlist</h1>
      {ready && items.length === 0 && (
        <p className="mt-6 text-stone-500">
          Nothing saved yet. Tap the ♡ on any product to save it. <Link href="/shop" className="underline">Browse the shop</Link>
        </p>
      )}
      <div className="mt-8">
        <ProductList products={items} listId="wishlist" listName="Wishlist" />
      </div>
    </div>
  );
}
