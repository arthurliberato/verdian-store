import Link from "next/link";
import { getProductById, lines, products, formatPrice } from "@/lib/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";

const hero = getProductById("VRD-ARC-CHALK-FOREST")!;
const featured = ["VRD-PUL-GLACIER", "VRD-AMU-ACID", "VRD-SND-FOREST", "VRD-BRU-ATELIER-SAND", "VRD-PLT-WHITE-FOREST", "VRD-ECO-INDIGO", "VRD-HOD-FOREST", "VRD-CIM-MOSS-RUST"]
  .map((id) => getProductById(id)!)
  .filter(Boolean);
const lineCovers: Record<string, string> = { classic: "VRD-SND-SAND", performance: "VRD-PUL-EMBER", street: "VRD-FSC-FOREST-BONE" };
const eco = products.filter((p) => p.model === "Eco");

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:pt-16">
        <div className="order-2 md:order-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">The Classic line</p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Made to be <br className="hidden sm:block" />worn in.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            The Arco is our flagship: full-grain leather, a stitched cupsole, and a shape we haven&apos;t needed to change.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={`/products/${hero.slug}`}
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-fg transition-opacity hover:opacity-90"
            >
              Shop Arco — {formatPrice(hero.price)}
            </Link>
            <Link href="/shop/classic" className="text-sm underline decoration-line underline-offset-8 hover:decoration-fg">
              Explore Classic
            </Link>
          </div>
        </div>
        <Link href={`/products/${hero.slug}`} className="order-1 block overflow-hidden rounded-sm bg-surface md:order-2">
          <ProductImage product={hero} priority sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[5/4] w-full object-cover" />
        </Link>
      </section>

      {/* Line navigation */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8" aria-labelledby="lines-heading">
        <h2 id="lines-heading" className="sr-only">Shop by line</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {lines.map((l) => {
            const cover = getProductById(lineCovers[l.slug])!;
            return (
              <Link key={l.slug} href={`/shop/${l.slug}`} className="group relative block overflow-hidden rounded-sm bg-surface">
                <ProductImage
                  product={cover}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 pt-20 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">{l.tagline}</p>
                  <p className="mt-1 font-display text-3xl font-medium">{l.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">This season</p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">Featured</h2>
          </div>
        </div>
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Editorial: Eco capsule */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="grid overflow-hidden rounded-sm bg-forest text-[#f1eee7] md:grid-cols-2">
          <div className="flex flex-col justify-center p-10 sm:p-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-70">Street · Eco capsule</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight">
              Recycled uppers. <br />Natural rubber. <br />Plant-based dye.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed opacity-80">
              The Eco is our lowest-impact sneaker yet, offered in undyed and plant-dyed colorways that change as you wear them.
            </p>
            <Link
              href="/shop/street?type=Eco+Capsule"
              className="mt-8 w-fit rounded-full bg-[#f1eee7] px-7 py-3.5 text-sm font-medium text-forest transition-opacity hover:opacity-90"
            >
              Shop the capsule
            </Link>
          </div>
          <div className="grid grid-cols-2">
            {eco.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} aria-label={`${p.model} ${p.colorway}`}>
                <ProductImage product={p} sizes="25vw" className="aspect-square w-full object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="mx-auto mt-28 grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3">
        {[
          ["Built to last", "Full-grain leathers, stitched soles, and a resoling program for our Classic line."],
          ["Made responsibly", "Recycled polyester, natural rubber, and leather from certified tanneries."],
          ["Free returns", "Free shipping and 30-day returns on every order, no questions asked."],
        ].map(([title, body]) => (
          <div key={title} className="border-t border-line pt-6">
            <h3 className="font-display text-lg font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
