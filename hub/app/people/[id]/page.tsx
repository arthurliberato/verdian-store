import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson, people } from "@/content/people";
import { getPlan } from "@/content/plans";
import { roleCards } from "@/content/roles";
import { Avatar } from "@/components/Badges";
import { dateRange } from "@/components/PlanBits";

export const dynamicParams = false;

export function generateStaticParams() {
  return people.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/people/[id]">): Promise<Metadata> {
  const person = getPerson((await params).id);
  return { title: person ? person.name : "Not found" };
}

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <h2 className="text-xs uppercase tracking-[0.1em] text-muted">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

export default async function PersonPage({ params }: PageProps<"/people/[id]">) {
  const person = getPerson((await params).id);
  if (!person) notFound();
  const card = roleCards[person.id];
  const plan = getPlan(person.id);
  const manager = person.reportsTo ? getPerson(person.reportsTo) : undefined;
  const dotted = person.dottedTo ? getPerson(person.dottedTo) : undefined;
  const reports = people.filter((p) => p.reportsTo === person.id);

  return (
    <div className="max-w-5xl">
      <Link href="/people" className="text-sm text-muted hover:text-fg">← People</Link>
      <header className="mt-3 flex items-center gap-4">
        <Avatar id={person.id} size={56} />
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">{person.name}</h1>
          <p className="text-muted">{person.title} · {person.employment}{person.starts ? ` · starts ${dateRange(person.starts)}` : ""}</p>
        </div>
      </header>
      <p className="mt-6 max-w-3xl leading-relaxed">{person.bio}</p>
      <p className="mt-3 text-sm text-muted">
        {manager ? <>Reports to <Link href={`/people/${manager.id}`} className="underline underline-offset-4">{manager.name}</Link></> : "Reports to the board"}
        {dotted && <> · dotted line to <Link href={`/people/${dotted.id}`} className="underline underline-offset-4">{dotted.name}</Link></>}
        {reports.length > 0 && <> · manages {reports.map((r, i) => <span key={r.id}>{i > 0 && ", "}<Link href={`/people/${r.id}`} className="underline underline-offset-4">{r.name}</Link></span>)}</>}
        {person.agent && <> · sends data requests</>}
        {plan && <> · <Link href={`/plans/${person.id}`} className="underline underline-offset-4">{plan.title}</Link></>}
      </p>

      {card && (
        <>
          <section className="mt-8 rounded-lg border-2 border-brand bg-surface p-5">
            <h2 className="text-xs uppercase tracking-[0.1em] text-muted">Responsible for</h2>
            <p className="mt-2 leading-relaxed">{card.responsibilities}</p>
          </section>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <List title="Measured on" items={card.kpis} />
            <List title="Meetings" items={card.rituals} />
            <List title="Tools" items={card.tools} />
            <List title="Needs from analytics" items={card.needsFromAnalytics} />
            <List title="How they ask" items={card.typicalRequests.map((r) => `“${r}”`)} />
            {card.risks && <List title="What could go wrong" items={card.risks} />}
          </div>
        </>
      )}
      {person.style && <p className="mt-6 text-sm text-muted">Working style: {person.style}</p>}
    </div>
  );
}
