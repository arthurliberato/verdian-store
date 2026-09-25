import type { Metadata } from "next";
import { searchProducts } from "@/lib/catalog";
import { ProductList } from "@/components/ProductList";
import { SearchTracker } from "@/components/SearchTracker";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = searchProducts(q);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Search</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="search-page-input" className="sr-only">Search products</label>
        <input
          id="search-page-input"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Try “runner”, “hoodie”, or “black”"
          className="flex-1 rounded-full bg-stone-100 px-5 py-3 outline-none focus:ring-2 focus:ring-forest"
        />
        <button type="submit" className="rounded-full bg-black px-6 font-semibold text-white hover:bg-forest">Search</button>
      </form>
      {q && (
        <>
          <SearchTracker term={q} resultCount={results.length} />
          <p className="mt-8 text-stone-500">
            {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
          </p>
          <div className="mt-6">
            {results.length > 0 ? (
              <ProductList products={results} listId="search_results" listName="Search results" />
            ) : (
              <p className="text-lg">No products match. Try a category name like “classic” or “street”.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
