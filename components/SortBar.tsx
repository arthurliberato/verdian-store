import Link from "next/link";
import type { Product } from "@/lib/catalog";

export const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export function parseSort(value: string | string[] | undefined): SortId {
  const v = Array.isArray(value) ? value[0] : value;
  return sortOptions.some((o) => o.id === v) ? (v as SortId) : "featured";
}

export function sortProducts(list: Product[], sort: SortId): Product[] {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  if (sort === "newest") copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return copy;
}

export function SortBar({ basePath, current, count }: { basePath: string; current: SortId; count: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
      <p className="text-sm text-stone-500">{count} products</p>
      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Sort products">
        {sortOptions.map((o) => (
          <Link
            key={o.id}
            href={o.id === "featured" ? basePath : `${basePath}?sort=${o.id}`}
            scroll={false}
            aria-current={o.id === current ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 ${o.id === current ? "bg-black text-white" : "bg-stone-100 hover:bg-stone-200"}`}
          >
            {o.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
