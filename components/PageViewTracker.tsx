"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushPageView } from "@/lib/datalayer";

// Pushes `page_view` on every route change. Next.js navigates client-side, so
// the browser never reloads between pages — this is what tells the data layer
// a new page was shown.
//
// Ordering: page_view must be the first push for a page (before view_item).
// React runs effects for earlier components first, so this tracker renders
// before the page content in app/layout.tsx. useSearchParams() would delay a
// component until after hydration, so query-only changes (?type=…) are caught
// by a separate <QueryChangeTracker>. `lastPath` keeps each URL to one push.

let lastPath: string | null = null;

// Query parameters added by debugging tools, not by the site. GTM's Preview
// mode appends ?gtm_debug=<timestamp>; left in, every test session would show
// up in reports as a different page. Real parameters (e.g. ?type=Running) stay.
const DEBUG_PARAMS = ["gtm_debug"];

function currentPath() {
  const params = new URLSearchParams(window.location.search);
  DEBUG_PARAMS.forEach((p) => params.delete(p));
  const query = params.toString();
  return window.location.pathname + (query ? `?${query}` : "");
}

function track() {
  const path = currentPath();
  if (path === lastPath) return;
  lastPath = path;
  pushPageView(path);
}

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(track, [pathname]);
  return null;
}

/** Must be wrapped in <Suspense>. */
export function QueryChangeTracker() {
  const searchParams = useSearchParams();
  useEffect(track, [searchParams]);
  return null;
}
