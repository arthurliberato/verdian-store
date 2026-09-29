"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { statusLabels, type Ticket, type TicketStatus } from "@/lib/ticket-types";
import { getPerson } from "@/content/people";
import { Avatar, LevelBadge, PriorityBadge, StatusBadge } from "@/components/Badges";

const filters: (TicketStatus | "open" | "all")[] = ["open", "new", "in_progress", "waiting", "done", "declined", "all"];
const filterLabel = (f: (typeof filters)[number]) => (f === "open" ? "Open" : f === "all" ? "All" : statusLabels[f]);

export function RequestsTable({ tickets: all }: { tickets: Ticket[] }) {
  const active = useSearchParams().get("status") ?? "open";
  const tickets = all.filter((t) =>
    active === "all" ? true : active === "open" ? t.status !== "done" && t.status !== "declined" : t.status === active,
  );

  return (
    <>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Filter by status">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "open" ? "/requests" : `/requests?status=${f}`}
            aria-current={active === f ? "page" : undefined}
            className={`rounded-full border px-3 py-1 ${active === f ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}
          >
            {filterLabel(f)}
          </Link>
        ))}
      </nav>

      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Requester</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Data needed</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-sunken">
                <td className="px-4 py-3">
                  <Link href={`/requests/${t.id}`} className="font-medium hover:underline">
                    {t.title}
                  </Link>
                  <p className="text-xs text-muted">
                    {t.id} · {t.category}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <Avatar id={t.requester} size={26} />
                    {getPerson(t.requester)?.name}
                  </span>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                <td className="px-4 py-3"><LevelBadge level={t.level} /></td>
                <td className="px-4 py-3 text-muted">{t.due}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">Nothing here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
