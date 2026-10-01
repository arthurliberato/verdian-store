import Link from "next/link";

// data-page-type tells the data layer this is a 404, whatever the URL looks like
// (see pageTypeFor in lib/datalayer.ts).
export default function NotFound() {
  return (
    <div data-page-type="not_found" className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-muted">It may have moved, or the product is no longer available.</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-brand-fg">
        Back to Verdian
      </Link>
    </div>
  );
}
