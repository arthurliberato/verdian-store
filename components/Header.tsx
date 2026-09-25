"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lines } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-[0.18em]">
          VERDIAN
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm" aria-label="Lines">
          {lines.map((l) => {
            const active = pathname.startsWith(`/shop/${l.slug}`);
            return (
              <Link
                key={l.slug}
                href={`/shop/${l.slug}`}
                aria-current={active ? "page" : undefined}
                className={`transition-colors hover:text-fg ${active ? "text-fg" : "text-muted"}`}
              >
                {l.name}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/cart"
          className="ml-auto flex items-center gap-2 text-sm"
          aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <span>Cart</span>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-medium text-brand-fg">
            {count}
          </span>
        </Link>
      </div>
      <nav className="flex gap-6 px-5 pb-3 text-sm sm:hidden" aria-label="Lines">
        {lines.map((l) => (
          <Link key={l.slug} href={`/shop/${l.slug}`} className="text-muted">
            {l.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
