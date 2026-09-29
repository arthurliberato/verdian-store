import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlan, pillars, plans } from "@/content/plans";
import { getPerson } from "@/content/people";
import { Avatar } from "@/components/Badges";
import { TargetsTable, dateRange, usd } from "@/components/PlanBits";

export const dynamicParams = false;

export function generateStaticParams() {
  return plans.map((p) => ({ owner: p.owner }));
}

export async function generateMetadata({ params }: PageProps<"/plans/[owner]">): Promise<Metadata> {
  const plan = getPlan((await params).owner);
  return { title: plan ? plan.title : "Not found" };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function PlanPage({ params }: PageProps<"/plans/[owner]">) {
  const plan = getPlan((await params).owner);
  if (!plan) notFound();
  const owner = getPerson(plan.owner)!;
  const total = plan.budget?.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="max-w-5xl">
      <Link href="/plans" className="text-sm text-muted hover:text-fg">← Plans</Link>
      <header className="mt-3 flex items-center gap-4">
        <Avatar id={plan.owner} size={48} />
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">{plan.title}</h1>
          <p className="text-sm text-muted">{owner.name} · {owner.title}</p>
        </div>
      </header>
      <p className="mt-6 max-w-3xl leading-relaxed">{plan.summary}</p>

      {plan.links && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {plan.links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg border border-line bg-surface p-4 hover:border-fg">
              <p className="font-medium">{l.label} →</p>
              <p className="mt-1 text-sm text-muted">{l.description}</p>
            </Link>
          ))}
        </div>
      )}

      <Section title={plan.shapedBy ? "Goals" : "Pillars"}>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {plan.goals.map((g) => <li key={g}>{g}</li>)}
        </ul>
      </Section>

      {plan.shapedBy && (
        <Section title="How the company plan shapes this team">
          <dl className="grid gap-3 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.id} className="rounded-lg border border-line bg-surface p-4">
                <dt className="text-xs uppercase tracking-[0.1em] text-muted">{p.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed">{plan.shapedBy![p.id]}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section title="Targets">
        <TargetsTable targets={plan.targets} />
      </Section>

      <Section title="Calendar">
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {plan.initiatives.map((i) => (
            <li key={i.name} className="px-4 py-3 text-sm">
              <p className="flex flex-wrap justify-between gap-2">
                <span className="font-medium">{i.name}</span>
                <span className="text-muted">{dateRange(i.start, i.end)}</span>
              </p>
              <p className="mt-1 text-muted">{i.detail}</p>
            </li>
          ))}
        </ul>
      </Section>

      {plan.budget && (
        <Section title="Budget">
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[560px] text-left text-sm">
              <tbody className="divide-y divide-line">
                {plan.budget.map((b) => (
                  <tr key={b.item}>
                    <td className="px-4 py-3">
                      {b.item}
                      {b.note && <p className="text-xs text-muted">{b.note}</p>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{usd(b.amount)}</td>
                  </tr>
                ))}
                {plan.budget.length > 1 && (
                  <tr className="font-medium">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-right tabular-nums">{usd(total!)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {plan.constraints && (
        <Section title="Rules and tensions">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
            {plan.constraints.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </Section>
      )}

      {plan.openQuestions && (
        <Section title="What they want to learn this year">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {plan.openQuestions.map((q) => <li key={q}>{q}</li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
