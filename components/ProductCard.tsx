import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product, onSelect }: { product: Product; onSelect?: () => void }) {
  const allSoldOut = product.soldOutSizes.length === product.sizes.length;
  const fewLeft = product.soldOutSizes.length >= 3 || (product.limited && product.lowStockSizes.length > 0);
  return (
    <Link href={`/products/${product.slug}`} onClick={onSelect} className="group block" data-item-id={product.id}>
      <div className="relative overflow-hidden rounded-xl bg-stone-100">
        <ProductArt
          type={product.type}
          color={product.colors[0]}
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.limited && <Badge className="bg-black text-white">Limited drop</Badge>}
          {product.isNew && !product.limited && <Badge className="bg-white text-black">New</Badge>}
          {product.compareAtPrice && <Badge className="bg-red-600 text-white">Sale</Badge>}
        </div>
        {allSoldOut ? (
          <Badge className="absolute bottom-3 left-3 bg-white text-black">Sold out</Badge>
        ) : fewLeft ? (
          <Badge className="absolute bottom-3 left-3 bg-amber-300 text-black">Few sizes left</Badge>
        ) : null}
      </div>
      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium leading-tight">{product.name}</h3>
          <p className="text-sm text-stone-500 capitalize">
            {product.category} · {product.colors.length} {product.colors.length === 1 ? "color" : "colors"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-medium">{formatPrice(product.price)}</p>
          {product.compareAtPrice && (
            <p className="text-sm text-stone-400 line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}>{children}</span>;
}
