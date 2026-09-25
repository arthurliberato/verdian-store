import type { Metadata } from "next";
import { products } from "@/lib/catalog";
import { ProductList } from "@/components/ProductList";
import { SortBar, parseSort, sortProducts } from "@/components/SortBar";

export const metadata: Metadata = { title: "Shop all" };

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sort = parseSort((await searchParams).sort);
  const list = sortProducts(products, sort);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Shop all</h1>
      <p className="mt-2 text-stone-500">Classic, Performance, and Street — everything we make.</p>
      <div className="mt-8">
        <SortBar basePath="/shop" current={sort} count={list.length} />
      </div>
      <div className="mt-8">
        <ProductList products={list} listId={`shop_all_${sort}`} listName={`Shop all - ${sort}`} />
      </div>
    </div>
  );
}
