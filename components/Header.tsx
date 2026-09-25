"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function Header() {
  const { cartCount, wishlist, user } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // The `search` event is fired by the search results page, so it also
    // covers people who land on /search?q=… directly.
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="bg-forest text-center text-xs font-medium text-white py-2 px-4">
        Free standard shipping on orders over $100 · Use code <span className="font-bold">WELCOME10</span> for 10% off your first order
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="text-2xl font-black tracking-tight">
          VERDIAN
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="hover:text-forest">
              {c.name}
            </Link>
          ))}
          <Link href="/shop" className="hover:text-forest">
            Shop all
          </Link>
        </nav>
        <form onSubmit={submit} role="search" className="ml-auto hidden sm:block">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-48 lg:w-64 rounded-full bg-stone-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-forest"
          />
        </form>
        <div className="ml-auto sm:ml-0 flex items-center gap-4 text-sm font-medium">
          <Link href="/account" className="hover:text-forest">
            {user ? `Hi, ${user.firstName}` : "Sign in"}
          </Link>
          <Link href="/wishlist" className="hover:text-forest" aria-label={`Wishlist, ${wishlist.length} items`}>
            Wishlist{wishlist.length > 0 && ` (${wishlist.length})`}
          </Link>
          <Link
            href="/cart"
            className="rounded-full bg-black px-4 py-2 text-white hover:bg-forest"
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart ({cartCount})
          </Link>
        </div>
      </div>
      <nav className="md:hidden flex gap-5 overflow-x-auto px-4 pb-3 text-sm font-medium" aria-label="Categories">
        {categories.map((c) => (
          <Link key={c.slug} href={`/shop/${c.slug}`}>
            {c.name}
          </Link>
        ))}
        <Link href="/shop">Shop all</Link>
        <Link href="/search">Search</Link>
      </nav>
    </header>
  );
}
