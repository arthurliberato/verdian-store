import type { MeasuredIn, Target } from "@/content/plans";

export const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const monthDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const dateRange = (start: string, end?: string) => (end ? `${monthDay(start)} – ${monthDay(end)}` : monthDay(start));

const inGa4: MeasuredIn[] = ["GA4", "BigQuery"];

export function MeasuredBadge({ where }: { where: MeasuredIn }) {
  const tone =
    where === "Not measured yet"
      ? "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100"
      : inGa4.includes(where)
        ? "bg-brand-soft text-fg"
        : "border border-line text-muted";
  return <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{where}</span>;
}

export function TargetsTable({ targets }: { targets: Target[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Metric</th>
            <th className="px-4 py-3 font-medium">Target</th>
            <th className="px-4 py-3 font-medium">Measured in</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {targets.map((t) => (
            <tr key={t.metric}>
              <td className="px-4 py-3 font-medium">{t.metric}</td>
              <td className="px-4 py-3">
                {t.target}
                {t.note && <p className="text-xs text-muted">{t.note}</p>}
              </td>
              <td className="px-4 py-3"><MeasuredBadge where={t.measuredIn} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
