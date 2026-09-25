"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";

// Next.js is a single-page app: after the first load, clicking a link swaps the
// page content without a full browser reload. GA4's built-in page_view only
// fires on real reloads, so most navigations would be missed.
//
// Fix: push a `page_view` event on every route change, and in GTM:
//   1. In the Google tag (GA4 config), set send_page_view = false
//   2. Create a GA4 Event tag "page_view" fired by Custom Event = page_view
//
// We also include user_id / login state on every page_view so GA4 always
// knows who the visitor is (for identity stitching).
//
// ORDER MATTERS: page_view must be the first event pushed for each page, so
// page-level events (view_item_list, view_item…) are attributed to the right
// page and the landing page is correct. Two details make that work:
//   • This component is rendered BEFORE the page content in app/layout.tsx —
//     React runs effects for earlier components first.
//   • useSearchParams() would delay this component until after the page has
//     hydrated on a full load, so the main tracker only watches the pathname
//     and a separate <QueryChangeTracker> catches query-only changes
//     (e.g. /shop?sort=price-asc). `lastUrl` makes sure each URL fires once.

let lastUrl: string | null = null;

function readUserId(): string | undefined {
  try {
    const raw = localStorage.getItem("verdian_user");
    return raw ? JSON.parse(raw).userId : undefined;
  } catch {
    return undefined;
  }
}

function trackPageView() {
  const url = window.location.pathname + window.location.search;
  if (url === lastUrl) return;
  const referrer = lastUrl ? window.location.origin + lastUrl : document.referrer || undefined;
  lastUrl = url;
  const userId = readUserId();
  track("page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    page_referrer: referrer,
    user_id: userId,
    login_status: userId ? "logged_in" : "guest",
  });
}

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}

/** Must be wrapped in <Suspense> (useSearchParams requirement). */
export function QueryChangeTracker() {
  const searchParams = useSearchParams();
  useEffect(() => {
    trackPageView();
  }, [searchParams]);
  return null;
}
