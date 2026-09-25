import Link from "next/link";
import { categories, products } from "@/lib/catalog";
import { ProductArt } from "@/components/ProductArt";
import { ProductList } from "@/components/ProductList";
import { PromoLink } from "@/components/PromoBanner";
import { NewsletterForm } from "@/components/NewsletterForm";

const drops = products.filter((p) => p.limited);
const classics = products.filter((p) => p.category === "classic").slice(0, 4);
const heroProduct = products.find((p) => p.id === "VRD-ST-001")!;

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-stone-100">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-forest">Drop 07 · Available now</p>
            <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Phantom Hi OG</h1>
            <p className="mt-5 max-w-md text-lg text-stone-600">
              Tumbled leather, a numbered insole, and a colorway we will never make again. Limited sizes remaining.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PromoLink
                promotion={{ id: "drop-07", name: "Drop 07 Phantom Hi OG", creative: "hero_phantom_bred", slot: "home_hero", href: `/products/${heroProduct.slug}` }}
                className="rounded-full bg-black px-7 py-3.5 font-semibold text-white hover:bg-forest"
              >
                Shop the drop
              </PromoLink>
              <PromoLink
                promotion={{ id: "street-all", name: "Street collection", creative: "hero_secondary_cta", slot: "home_hero_secondary", href: "/shop/street" }}
                className="rounded-full border border-black px-7 py-3.5 font-semibold hover:bg-black hover:text-white"
              >
                All Street
              </PromoLink>
            </div>
          </div>
          <ProductArt type={heroProduct.type} color={heroProduct.colors[0]} className="w-full rounded-2xl" />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Shop by category</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((c) => {
            const p = products.find((x) => x.category === c.slug)!;
            return (
              <Link key={c.slug} href={`/shop/${c.slug}`} className="group relative overflow-hidden rounded-2xl">
                <ProductArt type={p.type} color={p.colors[0]} className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
                  <p className="text-2xl font-bold">{c.name}</p>
                  <p className="text-sm opacity-90">{c.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Limited drops */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Limited drops</h2>
            <p className="text-stone-500">Numbered releases. No restocks.</p>
          </div>
          <Link href="/shop/street" className="text-sm font-semibold underline underline-offset-4">View all</Link>
        </div>
        <div className="mt-6">
          <ProductList products={drops} listId="home_limited_drops" listName="Home - Limited drops" />
        </div>
      </section>

      {/* Mid-page promotion */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <PromoLink
          promotion={{ id: "performance-fall", name: "Fall running season", creative: "banner_velocity_run", slot: "home_mid_banner", href: "/shop/performance" }}
          className="block rounded-2xl bg-forest px-8 py-14 text-white hover:opacity-95"
        >
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Performance</p>
          <p className="mt-2 text-4xl font-black tracking-tight">Run further this fall.</p>
          <p className="mt-2 max-w-lg opacity-90">The Velocity Run 3 and Endurance Max, built for training season.</p>
          <span className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-semibold text-black">Shop Performance</span>
        </PromoLink>
      </section>

      {/* Classics */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">The classics</h2>
            <p className="text-stone-500">Timeless silhouettes, made for comfort.</p>
          </div>
          <Link href="/shop/classic" className="text-sm font-semibold underline underline-offset-4">View all</Link>
        </div>
        <div className="mt-6">
          <ProductList products={classics} listId="home_classics" listName="Home - Classics" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight">Never miss a drop</h2>
        <p className="mt-2 text-stone-500">Sign up for early access to limited releases and member offers.</p>
        <div className="mt-6">
          <NewsletterForm location="home" />
        </div>
      </section>
    </>
  );
}
