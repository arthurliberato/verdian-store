import type { Metadata } from "next";
import { people, type Person } from "@/content/people";
import { Avatar } from "@/components/Badges";

export const metadata: Metadata = { title: "People" };

function OrgNode({ person }: { person: Person }) {
  const reports = people.filter((p) => p.reportsTo === person.id);
  return (
    <li>
      <div className={`inline-flex items-center gap-3 rounded-lg border bg-surface px-3 py-2 ${person.id === "arthur" ? "border-brand" : "border-line"}`}>
        <Avatar id={person.id} />
        <div>
          <p className="text-sm font-medium">{person.name}</p>
          <p className="text-xs text-muted">{person.title}</p>
        </div>
        {person.agent && (
          <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">Sends requests</span>
        )}
      </div>
      {reports.length > 0 && (
        <ul className="ml-5 mt-2 space-y-2 border-l border-line pl-5">
          {reports.map((r) => (
            <OrgNode key={r.id} person={r} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function PeoplePage() {
  const root = people.find((p) => p.reportsTo === null)!;
  const stakeholders = people.filter((p) => p.agent);
  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">People</h1>
      <p className="mt-2 text-muted">Who works at Verdian, and who sends data requests.</p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-medium">Organization</h2>
        <ul className="mt-4 space-y-2">
          <OrgNode person={root} />
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Stakeholder profiles</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {stakeholders.map((p) => (
            <article key={p.id} className="rounded-lg border border-line bg-surface p-5">
              <header className="flex items-center gap-3">
                <Avatar id={p.id} size={40} />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted">{p.title}</p>
                </div>
              </header>
              <p className="mt-4 text-sm leading-relaxed">{p.bio}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">Cares about</dt>
                  <dd className="mt-1">{p.priorities?.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">Looks at</dt>
                  <dd className="mt-1">{p.dataTheyTouch?.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.1em] text-muted">Working style</dt>
                  <dd className="mt-1 text-muted">{p.style}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
