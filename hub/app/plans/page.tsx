import type { Metadata } from "next";
import Link from "next/link";
import { calendar, getPlan, pillars, planYear, plans } from "@/content/plans";
import { getPerson } from "@/content/people";
import { Avatar } from "@/components/Badges";
import { TargetsTable, dateRange } from "@/components/PlanBits";

export const metadata: Metadata = { title: "Plans" };

export default function PlansPage() {
  const company = getPlan("valeria")!;
  const departments = plans.filter((p) => p.shapedBy);
  const events = calendar();

  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Plans · {planYear.label}</h1>
      <p className="mt-2 max-w-3xl text-muted">
        What every team committed to for October 2026 – September 2027. Approved on {dateRange(planYear.approved)}, two
        months before the store went live. Every data request should trace back to something here. Many of these
        drivers (costs, returns, budgets, reorder deadlines) never show up in GA4.
      </p>

      <section className="mt-10 rounded-lg border-2 border-brand bg-surface p-6">
        <header className="flex items-center gap-3">
          <Avatar id="valeria" size={40} />
          <div>
            <h2 className="font-display text-xl font-medium">{company.title}</h2>
            <p className="text-sm text-muted">{getPerson("valeria")?.name} · {getPerson("valeria")?.title}</p>
          </div>
        </header>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed">{company.summary}</p>
        <h3 className="mt-6 text-xs uppercase tracking-[0.1em] text-muted">Five pillars</h3>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed">
          {company.goals.map((g, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-display text-brand">{i + 1}</span>
              <span>{g}</span>
            </li>
          ))}
        </ol>
        <Link href="/plans/valeria" className="mt-5 inline-block text-sm underline underline-offset-4">
          Full company plan: targets, calendar, tensions →
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">How the pillars shape each team</h2>
        <p className="mt-1 text-sm text-muted">Read down a column to see one pillar work its way through the company.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="w-44 px-4 py-3 font-medium">Team</th>
                {pillars.map((p) => (
                  <th key={p.id} className="px-4 py-3 font-medium">{p.short}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              {departments.map((plan) => (
                <tr key={plan.owner}>
                  <td className="px-4 py-3">
                    <Link href={`/plans/${plan.owner}`} className="flex items-center gap-2 font-medium hover:underline">
                      <Avatar id={plan.owner} size={24} />
                      {plan.title.replace(" plan", "")}
                    </Link>
                  </td>
                  {pillars.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-xs leading-relaxed text-muted">{plan.shapedBy![p.id]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Company targets</h2>
        <p className="mt-1 text-sm text-muted">
          The badge says where each number can actually be measured today, which is the gap the analytics stack is closing.
        </p>
        <div className="mt-4"><TargetsTable targets={company.targets} /></div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Team plans</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {departments.map((plan) => {
            const owner = getPerson(plan.owner)!;
            return (
              <Link key={plan.owner} href={`/plans/${plan.owner}`} className="rounded-lg border border-line bg-surface p-5 hover:border-fg">
                <header className="flex items-center gap-3">
                  <Avatar id={plan.owner} size={36} />
                  <div>
                    <p className="font-medium">{plan.title}</p>
                    <p className="text-xs text-muted">{owner.name} · {owner.title}</p>
                  </div>
                </header>
                <p className="mt-3 text-sm leading-relaxed text-muted">{plan.summary}</p>
              </Link>
            );
          })}
          <Link href="/plans/economics" className="rounded-lg border border-line bg-surface p-5 hover:border-fg">
            <p className="font-medium">Unit economics</p>
            <p className="text-xs text-muted">Finance · Merchandising</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Landed cost and gross margin for every model, plus shipping, fees and returns: the numbers behind the Arco push.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Year 1 calendar</h2>
        <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
          {events.map((e) => (
            <li key={`${e.owner}-${e.name}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
              <span className="w-56 shrink-0 text-muted">{dateRange(e.start, e.end)}</span>
              <span className="flex items-center gap-2">
                <Avatar id={e.owner} size={22} />
                <span className="font-medium">{e.name}</span>
              </span>
              <span className="basis-full text-xs text-muted sm:basis-auto">{e.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
