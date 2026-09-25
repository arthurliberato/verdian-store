import Link from "next/link";
import { categories } from "@/lib/catalog";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-24 bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black tracking-tight text-white">VERDIAN</p>
          <p className="mt-3 max-w-md text-sm">Get early access to limited drops, restocks, and member-only offers.</p>
          <div className="mt-5 max-w-xl">
            <NewsletterForm location="footer" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Shop</p>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop all
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Account</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/account" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-6 text-center text-xs text-stone-500">
        Verdian is a fictional store built for analytics practice. No real orders are placed.
      </p>
    </footer>
  );
}
