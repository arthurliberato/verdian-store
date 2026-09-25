import Image from "next/image";
import type { Product } from "@/lib/catalog";

export function ProductImage({
  product,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 25vw, 50vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={product.image}
      alt={`${product.model} in ${product.colorway}`}
      width={800}
      height={800}
      sizes={sizes}
      priority={priority}
      unoptimized // SVG placeholders; remove once real photography is added
      className={className}
    />
  );
}
