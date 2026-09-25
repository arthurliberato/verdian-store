import { getProductById, products } from "@/lib/catalog";
import { productSvg } from "@/lib/placeholder";

// Serves the placeholder image referenced by each product's `image` field.
// Pre-rendered at build time for every product.

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function GET(_request: Request, ctx: RouteContext<"/images/products/[id]">) {
  const { id } = await ctx.params;
  const product = getProductById(id);
  if (!product) return new Response("Not found", { status: 404 });
  return new Response(productSvg(product), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
