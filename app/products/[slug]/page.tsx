import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, lines, products, siblingColorways } from "@/lib/catalog";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGrid } from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: `${product.model} ${product.colorway}`, description: product.description } : { title: "Not found" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const line = lines.find((l) => l.name === product.line)!;
  const colorways = siblingColorways(product);
  const related = products
    .filter((p) => p.line === product.line && p.model !== product.model && p.category === product.category)
    .filter((p, i, arr) => arr.findIndex((q) => q.model === p.model) === i) // one colorway per model
    .slice(0, 4);

  return (
    <>
      <nav className="mx-auto max-w-7xl px-5 pt-8 text-sm text-muted sm:px-8" aria-label="Breadcrumb">
        <Link href={`/shop/${line.slug}`} className="hover:text-fg">{line.name}</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${line.slug}?type=${encodeURIComponent(product.subcategory)}`} className="hover:text-fg">
          {product.subcategory}
        </Link>
      </nav>
      {/* key: remount per SKU so view_item fires for every colorway viewed */}
      <ProductDetail key={product.id} product={product} colorways={colorways} />
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
          <h2 className="font-display text-2xl font-medium tracking-tight">More from {product.line}</h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </>
  );
}
