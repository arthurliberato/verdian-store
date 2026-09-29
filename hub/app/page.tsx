import Link from "next/link";
import { allTickets, type TicketStatus } from "@/lib/tickets";
import { agents } from "@/content/people";
import { dashboards } from "@/content/dashboards";
import { Avatar, PriorityBadge, StatusBadge } from "@/components/Badges";
import { getPerson } from "@/content/people";

export default function Home() {
  const tickets = allTickets();
  const open = tickets.filter((t) => t.status !== "done" && t.status !== "declined");
  const count = (s: TicketStatus) => tickets.filter((t) => t.status === s).length;

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Good to see you.</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Verdian&apos;s internal hub for data requests, the team, and every dashboard in one place.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Open requests", open.length],
          ["New", count("new")],
          ["Waiting on requester", count("waiting")],
          ["Done", count("done")],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-2 font-display text-3xl">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-medium">Latest requests</h2>
          <Link href="/requests" className="text-sm text-muted underline underline-offset-4 hover:text-fg">
            All requests
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
          {tickets.slice(0, 5).map((t) => (
            <li key={t.id}>
              <Link href={`/requests/${t.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-sunken">
                <Avatar id={t.requester} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted">
                    {t.id} · {getPerson(t.requester)?.name}
                  </p>
                </div>
                <PriorityBadge priority={t.priority} />
                <StatusBadge status={t.status} />
              </Link>
            </li>
          ))}
          {tickets.length === 0 && <li className="px-4 py-6 text-sm text-muted">No requests yet.</li>}
        </ul>
      </section>

      <section className="mt-10 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl font-medium">About this hub</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
          <p>
            Verdian is a fictional athletic and lifestyle brand with a real, live store and a real analytics stack:
            Google Tag Manager, GA4, BigQuery, and Looker Studio, with synthetic shoppers generating the traffic.
          </p>
          <p>
            The {agents.length} stakeholders who send data requests here are simulated, each with their own role,
            priorities and way of asking. Their requests range from quick questions to things the data can&apos;t
            answer yet, and every thread shows how each one was scoped, clarified and resolved.
          </p>
          <p>
            {dashboards.length} dashboards are catalogued in the <Link href="/dashboards" className="underline underline-offset-4">dashboard hub</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
