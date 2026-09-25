"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// GA4 recommended `search` event. search_term is a built-in GA4 dimension.
// search_results is custom — useful for finding zero-result searches.
export function SearchTracker({ term, resultCount }: { term: string; resultCount: number }) {
  useEffect(() => {
    track("search", { search_term: term, search_results: resultCount });
  }, [term, resultCount]);
  return null;
}
