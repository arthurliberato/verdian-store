"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/requests", label: "Data requests" },
  { href: "/people", label: "People" },
  { href: "/dashboards", label: "Dashboards" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-surface md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
      <div className="px-5 py-5">
        <Link href="/" className="font-display text-lg font-semibold tracking-[0.16em]">
          VERDIAN
        </Link>
        <p className="text-xs text-muted">Internal hub</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0" aria-label="Main">
        {links.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                active ? "bg-brand-soft font-medium text-fg" : "text-muted hover:bg-sunken hover:text-fg"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <p className="hidden px-5 pt-8 text-xs leading-relaxed text-muted md:block">
        Verdian is a fictional brand. Stakeholders are simulated; the analytics work is real.
      </p>
    </aside>
  );
}
