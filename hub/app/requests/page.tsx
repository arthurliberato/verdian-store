import type { Metadata } from "next";
import { Suspense } from "react";
import { allTickets } from "@/lib/tickets";
import { RequestsTable } from "@/components/RequestsTable";

export const metadata: Metadata = { title: "Data requests" };

export default function RequestsPage() {
  // Read at build time; filtering by status happens in the browser, so the
  // page stays fully static (no ticket files needed at runtime).
  const tickets = allTickets();
  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Data requests</h1>
      <p className="mt-2 text-muted">Requests from across Verdian to the analytics team.</p>
      <Suspense fallback={null}>
        <RequestsTable tickets={tickets} />
      </Suspense>
    </div>
  );
}
