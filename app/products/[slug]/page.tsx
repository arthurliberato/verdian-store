import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/catalog";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductList } from "@/components/ProductList";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return { title: product?.name ?? "Not found" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return (
    <>
      {/* key forces a fresh component (and a fresh view_item) per product */}
      <ProductDetail key={product.id} product={product} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">You may also like</h2>
        <div className="mt-6">
          <ProductList products={related} listId="pdp_related" listName="Product page - You may also like" />
        </div>
      </section>
    </>
  );
}
