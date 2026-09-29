import type { Metadata } from "next";
import Link from "next/link";
import { budgetRules, forecastTriggers, incidentLevels, meetings, openQuestions, racis, requestQueue, risks } from "@/content/operations";
import { getPerson } from "@/content/people";
import { Avatar } from "@/components/Badges";

export const metadata: Metadata = { title: "Operating model" };

const first = (id: string) => getPerson(id)?.name.split(" ")[0] ?? id;

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-6">
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {intro && <p className="mt-1 max-w-3xl text-sm text-muted">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const tableBox = "overflow-x-auto rounded-lg border border-line bg-surface";
const th = "px-3 py-3 font-medium";
const td = "px-3 py-2";

export default function OperationsPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="font-display text-3xl font-medium tracking-tight">Operating model</h1>
      <p className="mt-2 max-w-3xl text-muted">
        How Verdian runs week to week: the meetings, who decides what, how data requests are handled, and what can go
        wrong. Built from research on how seed-stage DTC brands operate (
        <a href="https://github.com/arthurliberato/verdian-store/blob/master/docs/research/operating-plan-research.md" className="underline underline-offset-4">sources</a>).
      </p>
      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="On this page">
        {[["meetings", "Meetings"], ["raci", "Who decides"], ["requests", "Data requests"], ["rules", "Budget and incidents"], ["risks", "Risks"], ["open", "Open questions"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-line px-3 py-1 hover:border-fg">{label}</a>
        ))}
      </nav>

      <Section id="meetings" title="Meetings and reports" intro="Monday Numbers comes first: one set of numbers that every other meeting uses.">
        <div className={tableBox}>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr><th className={th}>Meeting</th><th className={th}>When</th><th className={th}>Owner</th><th className={th}>Who</th><th className={th}>Decides</th></tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              {meetings.map((m) => (
                <tr key={m.name}>
                  <td className={`${td} font-medium`}>{m.name}</td>
                  <td className={`${td} text-muted`}>{m.cadence}</td>
                  <td className={td}><span className="flex items-center gap-2"><Avatar id={m.owner} size={22} />{first(m.owner)}</span></td>
                  <td className={`${td} text-xs text-muted`}>{m.attendees.map(first).join(", ")}</td>
                  <td className={`${td} text-muted`}>{m.decides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="raci" title="Who decides what" intro="R = does the work · A = accountable, one per step · C = consulted · I = informed.">
        <div className="space-y-8">
          {racis.map((r) => (
            <div key={r.name}>
              <h3 className="font-medium">{r.name}</h3>
              <div className={`mt-2 ${tableBox}`}>
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-line text-xs text-muted">
                    <tr>
                      <th className={th}>Step</th>
                      {r.people.map((p, i) => <th key={p} className={`${th} text-center`}>{r.name === "Tracking change" && i === 0 ? "Requester" : first(p)}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {r.steps.map((s) => (
                      <tr key={s.step}>
                        <td className={td}>{s.step}</td>
                        {s.roles.map((role, i) => (
                          <td key={i} className={`${td} text-center ${role.startsWith("A") ? "font-semibold text-fg" : "text-muted"}`}>{role.replace(" (requester)", "")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {r.note && <p className="mt-2 text-xs text-muted">{r.note}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section id="requests" title="Data requests" intro={requestQueue.intake}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={tableBox}>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-line">
                {requestQueue.levels.map((l) => (
                  <tr key={l.level}><td className={`${td} font-medium`}>{l.level}</td><td className={td}>{l.meaning}</td><td className={`${td} text-muted`}>{l.sla}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {requestQueue.rules.map((r) => <li key={r}>{r}</li>)}
            <li>See the live queue in <Link href="/requests" className="underline underline-offset-4">Data requests</Link>.</li>
          </ul>
        </div>
      </Section>

      <Section id="rules" title="Budget moves, incidents and reforecasts">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-medium">Who can move budget</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {budgetRules.map((b) => (
                <li key={b.move} className="rounded-md border border-line bg-surface p-3">
                  <p>{b.move}</p>
                  <p className="mt-1 text-xs text-muted">Decides: {first(b.decides)} · Consulted: {b.consulted} · Informed: {b.informed}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Incident levels</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {incidentLevels.map((i) => (
                <li key={i.level} className="rounded-md border border-line bg-surface p-3">
                  <p><span className="font-semibold">{i.level}</span> · {i.definition}</p>
                  <p className="mt-1 text-xs text-muted">Responds: {i.responder} within {i.response} · Accountable: {first(i.accountable)} · {i.comms}</p>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-medium">Reforecast immediately if</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {forecastTriggers.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="risks" title="Risk register" intro="Likelihood and impact rated High, Medium or Low. Each risk has a signal to watch, a threshold, and a pre-agreed response.">
        <div className={tableBox}>
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr><th className={th}>Risk</th><th className={th}>L / I</th><th className={th}>Threshold</th><th className={th}>Response</th><th className={th}>Owner</th></tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              {risks.map((r) => (
                <tr key={r.id}>
                  <td className={td}><span className="text-xs text-muted">{r.id}</span> <span className="font-medium">{r.risk}</span><p className="text-xs text-muted">{r.indicator}</p></td>
                  <td className={`${td} whitespace-nowrap`}>{r.likelihood} / {r.impact}</td>
                  <td className={`${td} text-muted`}>{r.threshold}</td>
                  <td className={`${td} text-muted`}>{r.playbook}</td>
                  <td className={td}>{first(r.owner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="open" title="Open questions" intro="Things the plans don't answer yet, and the working assumption until someone decides.">
        <ul className="space-y-3">
          {openQuestions.map((q) => (
            <li key={q.id} className="rounded-lg border border-line bg-surface p-4 text-sm">
              <p><span className="text-xs text-muted">{q.id}</span> {q.question}</p>
              <p className="mt-1 text-muted">Working assumption: {q.workingDefault}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
