import type { Metadata } from "next";
import { dashboards, type Dashboard } from "@/content/dashboards";
import { getPerson } from "@/content/people";

export const metadata: Metadata = { title: "Dashboards" };

const statusTone: Record<Dashboard["status"], string> = {
  live: "bg-brand text-brand-fg",
  temporary: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
  planned: "border border-line text-muted",
  retired: "bg-sunken text-muted line-through",
};

export default function DashboardsPage() {
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Dashboards</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Every dashboard at Verdian, with who owns it, who it&apos;s for and where its data comes from. If it isn&apos;t
        listed here, it isn&apos;t supported.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {dashboards.map((d) => (
          <article key={d.name} className="flex flex-col rounded-lg border border-line bg-surface p-5">
            <header className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-medium">{d.name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusTone[d.status]}`}>{d.status}</span>
            </header>
            <p className="mt-3 text-sm leading-relaxed text-muted">{d.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs uppercase tracking-[0.1em] text-muted">Owner</dt><dd className="mt-1">{getPerson(d.owner)?.name}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.1em] text-muted">Audience</dt><dd className="mt-1">{d.audience}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.1em] text-muted">Source</dt><dd className="mt-1">{d.source}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.1em] text-muted">Refresh</dt><dd className="mt-1">{d.refresh}</dd></div>
            </dl>
            <div className="mt-auto pt-5">
              {d.url ? (
                <a href={d.url} target="_blank" rel="noreferrer" className="inline-block rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-fg">
                  Open dashboard
                </a>
              ) : (
                <span className="text-sm text-muted">{d.status === "planned" ? "Not built yet" : "Link coming soon"}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
