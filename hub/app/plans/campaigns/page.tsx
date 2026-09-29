import type { Metadata } from "next";
import Link from "next/link";
import {
  briefTemplate,
  campaigns,
  creativeRoles,
  fatigueRules,
  launchCreatives,
  metaSplit,
  refreshCadence,
  testingRules,
  utmConvention,
} from "@/content/campaigns";
import { getPerson } from "@/content/people";
import { Avatar } from "@/components/Badges";
import { dateRange, usd } from "@/components/PlanBits";

export const metadata: Metadata = { title: "Campaigns and creative" };

export default function CampaignsPage() {
  return (
    <div className="max-w-6xl">
      <Link href="/plans/amara" className="text-sm text-muted hover:text-fg">← Marketing plan</Link>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Campaigns and creative</h1>
      <p className="mt-2 max-w-3xl text-muted">
        What marketing runs in Year 1, how every link is tagged, and what each launch creative says. Owned by Amara,
        Lucas, Noor and Tomás. Each campaign notes what GA4 will and won&apos;t be able to see.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-medium">Fall launch creatives</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Same offer on all five: free shipping and 30-day returns. Same core message: heritage quality without the
          heritage markup. Only framing, tone and visual style change, so comparing them measures the creative and
          nothing else. Three of five feature the Arco franchise.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {launchCreatives.map((c) => (
            <article key={c.id} className="rounded-lg border border-line bg-surface p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-muted">{c.id}</p>
              <h3 className="mt-1 font-display text-lg font-medium">{c.name}</h3>
              <p className="mt-2 text-sm italic">&ldquo;{c.headline}&rdquo;</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-xs text-muted">Product</dt><dd>{c.product}</dd></div>
                <div><dt className="text-xs text-muted">Framing · tone</dt><dd>{c.framing} · {c.tone}</dd></div>
                <div><dt className="text-xs text-muted">Visual</dt><dd>{c.visual}</dd></div>
                <div><dt className="text-xs text-muted">Expected to pull</dt><dd>{c.expectedAudience}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">How creative gets made and cut</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <tbody className="divide-y divide-line">
              {creativeRoles.map((r) => (
                <tr key={r.step}><td className="w-56 px-4 py-3 font-medium">{r.step}</td><td className="px-4 py-3 text-muted">{r.who}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["The brief (one page)", briefTemplate],
            ["Refresh cadence", refreshCadence],
            ["Fatigue: flag an ad when 2 of 3 are true over 7 days", fatigueRules],
            ["Testing rules", testingRules],
          ].map(([title, items]) => (
            <div key={title as string} className="rounded-lg border border-line bg-surface p-5">
              <h3 className="font-medium">{title as string}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
                {(items as string[]).map((i) => <li key={i}>{i}</li>)}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Meta budget by layer</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Always-on runs all year; retargeting is capped at about 10% because small audiences saturate fast and mostly
          reach people who&apos;d buy anyway; bursts sit on top for drops and seasons.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[720px] text-right text-sm tabular-nums">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Month</th>
                <th className="px-3 py-3 font-medium">Always-on</th>
                <th className="px-3 py-3 font-medium">Retargeting</th>
                <th className="px-3 py-3 font-medium">Bursts</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 text-left font-medium">Bursts for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {metaSplit.map((m) => (
                <tr key={m.month}>
                  <td className="px-3 py-2 text-left">{m.month}</td>
                  <td className="px-3 py-2">{usd(m.alwaysOn)}</td>
                  <td className="px-3 py-2">{usd(m.retargeting)}</td>
                  <td className="px-3 py-2">{usd(m.bursts)}</td>
                  <td className="px-3 py-2 font-medium">{usd(m.total)}</td>
                  <td className="px-3 py-2 text-left text-muted">{m.burstNote}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="px-3 py-2 text-left">Year</td>
                {(["alwaysOn", "retargeting", "bursts", "total"] as const).map((k) => (
                  <td key={k} className="px-3 py-2">{usd(metaSplit.reduce((s, m) => s + m[k], 0))}</td>
                ))}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {(["Always-on", "Burst", "Owned"] as const).map((layer) => (
      <section key={layer} className="mt-12">
        <h2 className="font-display text-xl font-medium">{layer === "Owned" ? "Owned channels (email and social)" : layer === "Burst" ? "Bursts" : "Always-on"}</h2>
        <div className="mt-4 space-y-4">
          {campaigns.filter((c) => c.layer === layer).map((c) => (
            <article key={c.id} className="rounded-lg border border-line bg-surface p-5">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar id={c.owner} size={30} />
                  <div>
                    <h3 className="font-medium">{c.name} <span className="font-mono text-xs text-muted">{c.id}</span></h3>
                    <p className="text-xs text-muted">{c.channel} · {getPerson(c.owner)?.name}</p>
                  </div>
                </div>
                <span className="text-sm text-muted">{dateRange(c.start, c.end)}</span>
              </header>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><dt className="text-xs text-muted">Objective</dt><dd>{c.objective}</dd></div>
                <div><dt className="text-xs text-muted">KPI</dt><dd>{c.kpi}</dd></div>
                <div><dt className="text-xs text-muted">Audience</dt><dd>{c.audience}</dd></div>
                <div><dt className="text-xs text-muted">Creative</dt><dd>{c.creative}</dd></div>
                {c.budget && <div><dt className="text-xs text-muted">Budget</dt><dd>{c.budget}</dd></div>}
                <div className="md:col-span-2 rounded-md bg-sunken p-3"><dt className="text-xs text-muted">Measurement</dt><dd className="mt-1">{c.measurement}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>
      ))}

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">UTM convention</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Every link marketing controls is tagged like this. The values feed the &ldquo;Verdian channels&rdquo; group in GA4,
          so a typo moves traffic into the wrong channel.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Parameter</th>
                <th className="px-4 py-3 font-medium">Rule</th>
                <th className="px-4 py-3 font-medium">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {utmConvention.map((u) => (
                <tr key={u.param}>
                  <td className="px-4 py-3 font-mono text-xs">{u.param}</td>
                  <td className="px-4 py-3">{u.rule}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{u.examples.join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
