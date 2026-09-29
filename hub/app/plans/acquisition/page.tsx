import type { Metadata } from "next";
import Link from "next/link";
import { assumptions, channels, modelTotals, runModel } from "@/content/acquisition";
import { getPlan } from "@/content/plans";
import { usd } from "@/components/PlanBits";

export const metadata: Metadata = { title: "Acquisition model" };

const n = (x: number) => Math.round(x).toLocaleString("en-US");
const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`;

export default function AcquisitionPage() {
  const rows = runModel();
  const t = modelTotals(rows);
  const company = getPlan("valeria")!;
  const a = assumptions;

  const reconciliation = [
    { metric: "Sessions a day (average)", model: n(t.perDay), plan: n(t.financeSessions / 365), source: "Company plan" },
    { metric: "Orders", model: n(t.orders), plan: "2,000", source: "Company plan" },
    { metric: "Net revenue", model: usd(t.revenue), plan: "$340,000", source: "Company plan" },
    { metric: "Blended CAC", model: usd(t.cac), plan: "≤ $55", source: "Finance plan" },
    { metric: "Email subscribers by Sep 2027", model: n(t.endSubscribers), plan: "4,000", source: "CRM plan" },
  ];

  return (
    <div className="max-w-6xl">
      <Link href="/plans/amara" className="text-sm text-muted hover:text-fg">← Marketing plan</Link>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Acquisition model</h1>
      <p className="mt-2 max-w-3xl text-muted">
        The bottom-up half of the marketing plan: sessions per channel come out of written assumptions (budget, ad
        prices, click rates, creator reach, list size) instead of being typed in. The company plan was built top-down
        from the revenue target. They don&apos;t agree.
      </p>

      <section className="mt-10 rounded-lg border-2 border-amber-400 bg-surface p-6 dark:border-amber-700">
        <h2 className="font-display text-xl font-medium">Model vs plan</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Year 1</th>
                <th className="py-2 pr-4 text-right font-medium">What the marketing plan buys</th>
                <th className="py-2 pr-4 text-right font-medium">What the plans promise</th>
                <th className="py-2 font-medium">Promised in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reconciliation.map((r) => (
                <tr key={r.metric}>
                  <td className="py-2 pr-4 font-medium">{r.metric}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{r.model}</td>
                  <td className="py-2 pr-4 text-right tabular-nums">{r.plan}</td>
                  <td className="py-2 text-muted">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          October beats the plan; the holiday months fall far short, because Q4 ad prices rise just when the plan
          expects traffic to triple. Daniel has asked for this to be reconciled:{" "}
          <Link href="/requests/DR-0008" className="underline underline-offset-4">DR-0008</Link>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Sessions a day by channel</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[900px] text-right text-sm tabular-nums">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Channel</th>
                {rows.map((r) => <th key={r.month.key} className="px-3 py-3 font-medium">{r.month.label}</th>)}
                <th className="px-3 py-3 font-medium">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {channels.map((c) => (
                <tr key={c}>
                  <td className="px-3 py-2 text-left">{c}</td>
                  {rows.map((r) => <td key={r.month.key} className="px-3 py-2">{n(r.sessions[c] / r.month.days)}</td>)}
                  <td className="px-3 py-2 font-medium">{pct(t.byChannel[c] / t.sessions)}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="px-3 py-2 text-left">Total (model)</td>
                {rows.map((r) => <td key={r.month.key} className="px-3 py-2">{n(r.perDay)}</td>)}
                <td />
              </tr>
              <tr className="text-muted">
                <td className="px-3 py-2 text-left">Needed (company plan)</td>
                {rows.map((r) => <td key={r.month.key} className="px-3 py-2">{n(r.month.financeSessionsPerDay)}</td>)}
                <td />
              </tr>
              <tr>
                <td className="px-3 py-2 text-left">Orders</td>
                {rows.map((r) => <td key={r.month.key} className="px-3 py-2">{n(r.orders)}</td>)}
                <td />
              </tr>
              <tr>
                <td className="px-3 py-2 text-left">Blended CAC</td>
                {rows.map((r) => <td key={r.month.key} className="px-3 py-2">{usd(r.cac)}</td>)}
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-medium">Assumptions</h2>
        <p className="mt-1 text-sm text-muted">Made in July 2026, before any real data existed. Each one is a question the data can answer later.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["Meta Paid", [
              `Monthly budget from the marketing plan (${usd(rows.reduce((s, r) => s + r.month.metaBudget, 0))} a year)`,
              `CPM $9–17: highest in November and December, when every retailer bids`,
              `Click rate 1.0% in October, 1.1–1.2% after creative round 1`,
              `${pct(a.meta.landingRate)} of clicks become a GA4 session (in-app browser, slow loads, back button)`,
            ]],
            ["Instagram Organic", [
              `~100 creators seeded across the year; ${pct(a.instagram.postRate)} actually post`,
              `${a.instagram.clicksPerPost} clicks per post, ${pct(a.instagram.landingRate)} land`,
              `Verdian's own account: ${a.instagram.brandAccountStart} sessions in October, +${pct(a.instagram.brandAccountGrowth)} a month`,
            ]],
            ["Newsletter", [
              `${n(a.email.startingSubscribers)} subscribers from the pre-launch waitlist`,
              `${pct(a.email.signupRate)} of sessions sign up. This assumes an on-site form that doesn't exist yet`,
              `Weekly send; ${pct(a.email.clickRate)} of recipients click`,
            ]],
            ["Organic Search and Direct", [
              "Branded search grows with Meta reach (5 searches per 10,000 impressions)",
              "Non-branded search only from April, if the SEO content programme is staffed (it isn't yet)",
              `Direct is ${pct(a.direct.shareOfOther)} on top of all other traffic (word of mouth, typed-in returns)`,
            ]],
            ["Conversion", [
              `Meta ${pct(a.conversion.meta, 1)} · Instagram ${pct(a.conversion.instagram, 1)} · Newsletter ${pct(a.conversion.newsletter, 1)} · Search ${pct(a.conversion.search, 1)} · Direct ${pct(a.conversion.direct, 1)}`,
              "Holiday months ×1.2–1.25, January ×0.9",
              `AOV ${usd(a.aov)}; ${pct(a.newCustomerShare)} of orders from new customers`,
            ]],
            ["Spend", [
              `Meta budget plus ${usd(a.fixedMarketingPerMonth)} a month for creators, content, email and tools`,
              `Total ${usd(t.spend)}, matching the $96,000 marketing budget`,
            ]],
          ].map(([title, items]) => (
            <div key={title as string} className="rounded-lg border border-line bg-surface p-5">
              <h3 className="font-medium">{title as string}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {(items as string[]).map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Company plan targets: {company.targets.slice(0, 4).map((x) => `${x.metric} ${x.target}`).join(" · ")}</p>
      </section>
    </div>
  );
}
