import type { Metadata } from "next";
import { dictionaryStatus, metrics } from "@/content/dictionary";
import { getPerson } from "@/content/people";
import { dateRange } from "@/components/PlanBits";

export const metadata: Metadata = { title: "Metrics dictionary" };

export default function DictionaryPage() {
  const groups = [...new Set(metrics.map((m) => m.group))];
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight">Metrics dictionary</h1>
        <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-950 dark:bg-amber-900 dark:text-amber-100">
          v{dictionaryStatus.version}
        </span>
      </div>
      <p className="mt-2 max-w-3xl text-muted">
        One definition per number. No decision uses a metric that isn&apos;t defined here. Owned by{" "}
        {dictionaryStatus.owners.map((o) => getPerson(o)?.name).join(" and ")}; sign-off due {dateRange(dictionaryStatus.signOffDue)}.
        The order system (in BigQuery) is the source of truth for revenue, orders and customers; GA4 is for behaviour
        and funnels; Meta is for ad delivery.
      </p>
      {groups.map((g) => (
        <section key={g} className="mt-10">
          <h2 className="font-display text-xl font-medium">{g}</h2>
          <dl className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
            {metrics.filter((m) => m.group === g).map((m) => (
              <div key={m.term} className="grid gap-1 px-4 py-3 text-sm md:grid-cols-[220px_1fr_160px] md:gap-4">
                <dt className="font-medium">{m.term}</dt>
                <dd>{m.definition}</dd>
                <dd className="text-xs text-muted md:text-right">{m.source}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
