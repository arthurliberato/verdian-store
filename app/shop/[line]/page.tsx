import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabels, getLine, lines, products, type Category } from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductCard";

export function generateStaticParams() {
  return lines.map((l) => ({ line: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[line]">): Promise<Metadata> {
  const line = getLine((await params).line);
  return { title: line?.name ?? "Not found" };
}

const categoryOrder: Category[] = ["footwear", "apparel", "accessories"];

export default async function LinePage({ params, searchParams }: PageProps<"/shop/[line]">) {
  const line = getLine((await params).line);
  if (!line) notFound();
  const raw = (await searchParams).type;
  const active = Array.isArray(raw) ? raw[0] : raw;

  const inLine = products.filter((p) => p.line === line.name);
  // Subcategories grouped by category, in a stable order.
  const groups = categoryOrder
    .map((category) => ({
      category,
      subcategories: [...new Set(inLine.filter((p) => p.category === category).map((p) => p.subcategory))],
    }))
    .filter((g) => g.subcategories.length > 0);

  const list = active ? inLine.filter((p) => p.subcategory === active) : inLine;
  const base = `/shop/${line.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">{line.tagline}</p>
      <h1 className="mt-3 font-display text-5xl font-medium tracking-tight">{line.name}</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">{line.description}</p>

      <nav className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line py-4 text-sm" aria-label="Filter by type">
        <FilterLink href={base} active={!active}>
          All
        </FilterLink>
        {groups.map((g) => (
          <div key={g.category} className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-[0.14em] text-muted">{categoryLabels[g.category]}</span>
            {g.subcategories.map((s) => (
              <FilterLink key={s} href={`${base}?type=${encodeURIComponent(s)}`} active={active === s}>
                {s}
              </FilterLink>
            ))}
          </div>
        ))}
      </nav>

      <p className="mt-6 text-sm text-muted">
        {list.length} {list.length === 1 ? "product" : "products"}
      </p>
      <div className="mt-6">
        {list.length > 0 ? (
          <ProductGrid products={list} />
        ) : (
          <p className="py-20 text-center text-muted">
            Nothing here yet. <Link href={base} className="underline">See all {line.name}</Link>
          </p>
        )}
      </div>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-3.5 py-1.5 transition-colors ${
        active ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
      }`}
    >
      {children}
    </Link>
  );
}
