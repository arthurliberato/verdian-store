import type { Metadata } from "next";
import Link from "next/link";
import { campaigns, launchCreatives, utmConvention } from "@/content/campaigns";
import { getPerson } from "@/content/people";
import { Avatar } from "@/components/Badges";
import { dateRange } from "@/components/PlanBits";

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
        <p className="mt-4 text-sm text-muted">
          Testing rule (Noor and Lucas): equal budget for four weeks, then cut the weakest two on cost per purchase
          and downstream behaviour, not click rate. One new creative enters every four weeks.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Campaigns</h2>
        <div className="mt-4 space-y-4">
          {campaigns.map((c) => (
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
