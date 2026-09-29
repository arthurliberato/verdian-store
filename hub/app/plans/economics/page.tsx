import type { Metadata } from "next";
import Link from "next/link";
import { arcoFranchise } from "@/content/plans";
import { grossMargin, orderCosts, unitCosts } from "@/content/economics";
import { usd } from "@/components/PlanBits";

export const metadata: Metadata = { title: "Unit economics" };

const pct = (n: number) => `${Math.round(n * 100)}%`;
const categories = ["footwear", "apparel", "accessories"] as const;

export default function EconomicsPage() {
  return (
    <div className="max-w-5xl">
      <Link href="/plans" className="text-sm text-muted hover:text-fg">← Plans</Link>
      <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Unit economics</h1>
      <p className="mt-2 max-w-3xl text-muted">
        What each model costs Verdian to make and land in the warehouse. Owned by Finance and Merchandising. None of
        this reaches GA4. It explains decisions that look odd from traffic data alone, like pushing the Arco franchise
        (highlighted) over models with cheaper clicks.
      </p>

      {categories.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="font-display text-xl font-medium capitalize">{cat}</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Line</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Landed cost</th>
                  <th className="px-4 py-3 text-right font-medium">Gross margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {unitCosts
                  .filter((u) => u.category === cat)
                  .sort((a, b) => grossMargin(b) - grossMargin(a))
                  .map((u) => (
                    <tr key={u.code} className={arcoFranchise.includes(u.code) ? "bg-brand-soft" : undefined}>
                      <td className="px-4 py-3">
                        <span className="font-medium">{u.model}</span> <span className="text-xs text-muted">{u.code}</span>
                        {u.note && <p className="text-xs text-muted">{u.note}</p>}
                      </td>
                      <td className="px-4 py-3 text-muted">{u.line}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{usd(u.price)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{usd(u.cost)}</td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums">{pct(grossMargin(u))}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mt-10 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl font-medium">Costs per order and per return</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Free shipping (paid by Verdian)</dt><dd className="mt-1 font-medium">{usd(orderCosts.shippingPerOrder)} per order on average</dd></div>
          <div><dt className="text-muted">Packaging</dt><dd className="mt-1 font-medium">${orderCosts.packagingPerOrder.toFixed(2)} per order</dd></div>
          <div><dt className="text-muted">Payment fees</dt><dd className="mt-1 font-medium">{(orderCosts.paymentFeeRate * 100).toFixed(1)}% + ${orderCosts.paymentFeeFixed.toFixed(2)} per order</dd></div>
          <div><dt className="text-muted">Return shipping</dt><dd className="mt-1 font-medium">{usd(orderCosts.returnShipping)} per return</dd></div>
          <div>
            <dt className="text-muted">Return rate (units)</dt>
            <dd className="mt-1 font-medium">
              Footwear {pct(orderCosts.returnRate.footwear)} · Apparel {pct(orderCosts.returnRate.apparel)} · Accessories {pct(orderCosts.returnRate.accessories)}
            </dd>
          </div>
          <div><dt className="text-muted">Returned items that can be resold</dt><dd className="mt-1 font-medium">{pct(orderCosts.resellableShare)}</dd></div>
        </dl>
      </section>
    </div>
  );
}
