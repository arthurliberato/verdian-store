import Link from "next/link";
import { lines } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold tracking-[0.18em]">VERDIAN</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Considered footwear and apparel, made in small runs from leather, suede, and recycled materials.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.slug}>
                <Link href={`/shop/${l.slug}`} className="hover:text-brand">{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Help</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Free shipping and returns</li>
            <li>Size guide</li>
            <li>Care instructions</li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-5 py-6 text-center text-xs text-muted">
        © Verdian. A fictional brand — no real orders are placed.
      </p>
    </footer>
  );
}
