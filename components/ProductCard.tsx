import Link from "next/link";
import { formatPrice, siblingColorways, type Product } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const colorCount = siblingColorways(product).length;
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-surface">
        <ProductImage
          product={product}
          className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-bg/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]">
            {product.tag}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-sm">
        <div>
          <h3 className="font-medium">{product.model}</h3>
          <p className="text-muted">
            {product.colorway}
            {colorCount > 1 && <span> · {colorCount} colors</span>}
          </p>
        </div>
        <p className="shrink-0">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
