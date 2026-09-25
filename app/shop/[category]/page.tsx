import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, productsInCategory } from "@/lib/catalog";
import { ProductList } from "@/components/ProductList";
import { SortBar, parseSort, sortProducts } from "@/components/SortBar";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  return { title: category?.name ?? "Not found" };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/shop/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const sort = parseSort((await searchParams).sort);
  const list = sortProducts(productsInCategory(category.slug), sort);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-forest">{category.tagline}</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-stone-500">{category.description}</p>
      <div className="mt-8">
        <SortBar basePath={`/shop/${category.slug}`} current={sort} count={list.length} />
      </div>
      <div className="mt-8">
        <ProductList products={list} listId={`category_${category.slug}`} listName={`Category - ${category.name}`} />
      </div>
    </div>
  );
}
