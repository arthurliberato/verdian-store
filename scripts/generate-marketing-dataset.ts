// Generates a marketing-analytics dataset for Verdian: ad spend, sessions,
// orders, customers and returns for Year 1 (Oct 2026 – Sep 2027).
//
//   npm run dataset                     # writes data/analysis/*.csv
//   npm run dataset -- --scale 3        # 3x the traffic and ad budget
//   npm run dataset -- --seed 7         # a different random world
//
// It is built on the numbers already in the repo, so it tells the same story
// as the hub: the real catalog (lib/catalog.ts), unit costs and return rates
// (hub/content/economics.ts), the Meta budget, CPM, CTR and seasonality by
// month (hub/content/acquisition.ts) and the campaign calendar
// (hub/content/campaigns.ts). Random draws are seeded, so the same seed always
// gives the same files.
//
// Causal chain (so the tables reconcile):
//   ad spend → impressions → clicks → GA4 sessions → funnel → orders → returns
// Platform-reported conversions are computed from the same orders, then
// inflated the way ad platforms really do it. Known data-quality problems are
// injected on purpose (see data/analysis/SPOILERS.md).

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { products, type Line, type Product } from "../lib/catalog";
import { unitCosts, orderCosts } from "../hub/content/economics";
import { months, runModel } from "../hub/content/acquisition";
import { campaigns as hubCampaigns, launchCreatives } from "../hub/content/campaigns";
import { hourlyTraffic } from "../traffic/archetypes";

// ─── Options ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const SEED = Number(opt("seed", "2026"));
const SCALE = Number(opt("scale", "1"));
const OUT = opt("out", "data/analysis");

// ─── Random helpers (seeded) ───────────────────────────────────────────

let state = SEED >>> 0;
function rnd() {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function normal() {
  let u = 0;
  while (u === 0) u = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}
const lognorm = (sd: number) => Math.exp(sd * normal() - (sd * sd) / 2); // mean 1
const randInt = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const chance = (p: number) => rnd() < p;
const pick = <T,>(items: readonly T[]): T => items[Math.floor(rnd() * items.length)];
const round2 = (n: number) => Math.round(n * 100) / 100;

function poisson(lambda: number): number {
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rnd();
    } while (p > L);
    return k - 1;
  }
  return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * normal()));
}

function binom(n: number, p: number): number {
  if (n <= 0 || p <= 0) return 0;
  if (p >= 1) return n;
  if (n <= 40) {
    let k = 0;
    for (let i = 0; i < n; i++) if (rnd() < p) k++;
    return k;
  }
  return Math.min(n, Math.max(0, Math.round(n * p + Math.sqrt(n * p * (1 - p)) * normal())));
}

function wpick<T>(items: readonly T[], weight: (t: T) => number): T {
  let total = 0;
  for (const it of items) total += weight(it);
  let r = rnd() * total;
  for (const it of items) {
    r -= weight(it);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}
function wpickKey<K extends string>(weights: Record<K, number>): K {
  const keys = Object.keys(weights) as K[];
  return wpick(keys, (k) => weights[k]);
}

// ─── Calendar ──────────────────────────────────────────────────────────

const DAY = 86_400_000;
function daysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  for (let t = Date.parse(from); t <= Date.parse(to); t += DAY) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
const dowOf = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay();
const daysSince = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const addDays = (d: string, n: number) => new Date(Date.parse(d) + n * DAY).toISOString().slice(0, 10);
const inRange = (d: string, from: string, to: string) => d >= from && d <= to;

const FIRST_DAY = "2026-10-01";
const LAST_DAY = "2027-09-30";
const allDays = daysBetween(FIRST_DAY, LAST_DAY);

const dropWindows = [
  { id: "drop2_fosco", from: "2026-11-13", to: "2026-11-19" },
  { id: "drop3_spring", from: "2027-03-12", to: "2027-03-19" },
  { id: "drop4_summer", from: "2027-06-11", to: "2027-06-18" },
];
const dropOn = (d: string) => dropWindows.find((w) => inRange(d, w.from, w.to));

/** Google Ads is not in the Year 1 plan: assumed added from March 2027. */
const GADS_START = "2027-03-01";

const model = runModel();
const byMonth = new Map(model.map((r) => [r.month.key, r]));
const monthOf = (d: string) => byMonth.get(d.slice(0, 7))!;

// ─── Catalog and unit economics ────────────────────────────────────────

const codeOf = (p: Product) => p.id.split("-")[1];
const costByCode = new Map(unitCosts.map((u) => [u.code, u.cost]));
for (const p of products) if (!costByCode.has(codeOf(p))) throw new Error(`No unit cost for ${p.id}`);
const unitCostOf = (p: Product) => costByCode.get(codeOf(p))!;
const productById = new Map(products.map((p) => [p.id, p]));

// How popular each model is. The Arco franchise leads (company pillar).
const modelWeight: Record<string, number> = { ARC: 3, AMU: 2.5, PUL: 2, SND: 1.6, HOD: 1.5, TEE: 1.4, FSC: 1.3, SNL: 1.2 };
const popularity = (p: Product) => modelWeight[codeOf(p)] ?? 1;

function randProduct(line: Line | null, category?: Product["category"]): Product {
  let pool = products;
  if (category) pool = pool.filter((p) => p.category === category);
  if (line) {
    const inLine = pool.filter((p) => p.line === line);
    if (inLine.length) pool = inLine;
  }
  return wpick(pool, popularity);
}

function pickSize(p: Product): string {
  const n = p.sizes.length;
  if (n === 1) return p.sizes[0];
  const i = Math.max(0, Math.min(n - 1, Math.round(n * 0.5 + normal() * n * 0.18)));
  return p.sizes[i];
}

// ─── Creatives ─────────────────────────────────────────────────────────

type Creative = {
  id: string;
  name: string;
  theme: string;
  line: Line | null;
  landing: string; // product id, or a path starting with "/"
  /** Hidden truth: multiplier on click-through rate. */
  ctr: number;
  /** Hidden truth: multiplier on session-to-order conversion. */
  cvr: number;
  launch: string;
  retire?: string;
};

const hubCreative = Object.fromEntries(launchCreatives.map((c) => [c.id, c]));
const creatives: Creative[] = [
  { id: "creative_1", name: hubCreative.creative_1.name, theme: hubCreative.creative_1.framing, line: "Classic", landing: "VRD-ARC-CHALK", ctr: 0.9, cvr: 1.25, launch: "2026-09-27" },
  { id: "creative_2", name: hubCreative.creative_2.name, theme: hubCreative.creative_2.framing, line: "Street", landing: "VRD-AMU-ACID", ctr: 1.35, cvr: 0.65, launch: "2026-09-27" },
  { id: "creative_3", name: hubCreative.creative_3.name, theme: hubCreative.creative_3.framing, line: "Classic", landing: "VRD-ARC-CHALK", ctr: 1.2, cvr: 0.9, launch: "2026-09-27", retire: "2027-04-15" },
  { id: "creative_4", name: hubCreative.creative_4.name, theme: hubCreative.creative_4.framing, line: "Classic", landing: "VRD-SND-SAND", ctr: 0.95, cvr: 0.85, launch: "2026-09-27", retire: "2026-11-16" },
  { id: "creative_5", name: hubCreative.creative_5.name, theme: hubCreative.creative_5.framing, line: "Performance", landing: "VRD-PUL-GLACIER", ctr: 1.0, cvr: 1.1, launch: "2026-09-27" },
  { id: "creative_6", name: "Winter layers", theme: "Apparel and layering", line: "Classic", landing: "VRD-HOD-FOREST", ctr: 1.05, cvr: 1.0, launch: "2027-01-05" },
  { id: "creative_7", name: "Spring edit", theme: "Everyday sneakers, new colorways", line: "Classic", landing: "VRD-PLT-WHITE-FOREST", ctr: 1.1, cvr: 1.05, launch: "2027-03-01" },
  { id: "creative_8", name: "Summer run", theme: "Performance, light and breathable", line: "Performance", landing: "VRD-PUL-EMBER", ctr: 1.0, cvr: 1.1, launch: "2027-06-01" },
  { id: "dpa_cart", name: "Dynamic cart reminder", theme: "Shows the product left in the cart", line: null, landing: "/cart", ctr: 1, cvr: 1, launch: "2026-11-01" },
  { id: "drop_fosco_a", name: "Fosco winter A", theme: "Limited drop, product-first", line: "Street", landing: "VRD-FSC-FOREST-BONE", ctr: 1.4, cvr: 1.2, launch: "2026-10-20" },
  { id: "drop_fosco_b", name: "Fosco winter B", theme: "Limited drop, street photography", line: "Street", landing: "VRD-FSC-FOREST-BONE", ctr: 1.4, cvr: 1.2, launch: "2026-10-20" },
  { id: "holiday_gift_a", name: "Gift guide A", theme: "Gifting, under $100", line: null, landing: "/shop/classic", ctr: 1.15, cvr: 1.15, launch: "2026-11-20" },
  { id: "holiday_gift_b", name: "Gift guide B", theme: "Gifting, the Arco", line: "Classic", landing: "VRD-ARC-CHALK-FOREST", ctr: 1.15, cvr: 1.15, launch: "2026-11-20" },
  { id: "resolutions_a", name: "Running resolutions A", theme: "New year, first run", line: "Performance", landing: "/shop/performance", ctr: 1.0, cvr: 1.1, launch: "2027-01-02" },
  { id: "resolutions_b", name: "Running resolutions B", theme: "Specs and cushioning", line: "Performance", landing: "VRD-PUL-GLACIER", ctr: 1.0, cvr: 1.1, launch: "2027-01-02" },
  { id: "drop_spring_a", name: "Bruma spring A", theme: "Limited drop, product-first", line: "Street", landing: "VRD-BRU-ATELIER-SAND", ctr: 1.4, cvr: 1.2, launch: "2027-02-20" },
  { id: "drop_spring_b", name: "Bruma spring B", theme: "Limited drop, street photography", line: "Street", landing: "VRD-BRU-ATELIER-SAND", ctr: 1.4, cvr: 1.2, launch: "2027-02-20" },
  { id: "drop_summer_a", name: "Eco summer A", theme: "Limited drop, recycled materials", line: "Street", landing: "VRD-ECO-INDIGO", ctr: 1.4, cvr: 1.2, launch: "2027-05-20" },
  { id: "drop_summer_b", name: "Eco summer B", theme: "Limited drop, street photography", line: "Street", landing: "VRD-ECO-INDIGO", ctr: 1.4, cvr: 1.2, launch: "2027-05-20" },
  { id: "rsa_brand", name: "Brand search ad", theme: "Responsive search ad, exact brand terms", line: null, landing: "/", ctr: 1, cvr: 1, launch: GADS_START },
  { id: "shopping_feed", name: "Shopping feed", theme: "Product feed, all footwear", line: null, landing: "/shop/classic", ctr: 1, cvr: 1, launch: GADS_START },
];
const creativeById = new Map(creatives.map((c) => [c.id, c]));
for (const c of creatives) if (!c.landing.startsWith("/") && !productById.has(c.landing)) throw new Error(`Unknown landing product ${c.landing}`);

/** Creatives in the always-on prospecting rotation. */
const alwaysOn = ["creative_1", "creative_3", "creative_5", "creative_6", "creative_7", "creative_8"];

/** Click-through decays as a creative ages (ad fatigue) until it is replaced. */
function fatigue(c: Creative, date: string): number {
  const age = Math.max(0, daysSince(c.launch < FIRST_DAY ? "2026-10-01" : c.launch, date));
  return Math.max(0.65, 1 - 0.003 * Math.max(0, age - 21));
}

// Ad sets: relative CPM, CTR and conversion.
const adsets: Record<string, { cpm: number; ctr: number; cvr: number }> = {
  broad_us: { cpm: 1.0, ctr: 0.95, cvr: 1.0 },
  int_sneakers: { cpm: 1.05, ctr: 1.05, cvr: 1.1 },
  int_running: { cpm: 1.12, ctr: 1.0, cvr: 0.95 },
  lal_buyers_1pct: { cpm: 1.1, ctr: 1.1, cvr: 1.35 },
  rt_cart_7d: { cpm: 1.7, ctr: 3.2, cvr: 2.5 },
};

// ─── Ad calendar and spend ─────────────────────────────────────────────

type AdRow = {
  key: string;
  date: string;
  platform: "Meta" | "Google";
  campaign_id: string;
  ad_set: string;
  creative_id: string;
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  sessions: number;
  trueOrders: number;
  trueValue: number;
  platform_conversions: number;
  platform_conversion_value: number;
};

type Burst = { campaign: string; from: string; to: string; amount: number };
const bursts: Burst[] = [
  { campaign: "drop2_fosco", from: "2026-10-20", to: "2026-10-31", amount: 400 },
  { campaign: "drop2_fosco", from: "2026-11-13", to: "2026-11-19", amount: 1400 },
  { campaign: "holiday_gifting", from: "2026-11-20", to: "2026-11-30", amount: 1200 },
  { campaign: "holiday_gifting", from: "2026-12-01", to: "2026-12-22", amount: 2600 },
  { campaign: "running_resolutions", from: "2027-01-02", to: "2027-01-31", amount: 900 },
  { campaign: "drop3_spring", from: "2027-02-20", to: "2027-02-28", amount: 300 },
  { campaign: "drop3_spring", from: "2027-03-12", to: "2027-03-19", amount: 1600 },
  { campaign: "drop4_summer", from: "2027-05-20", to: "2027-05-31", amount: 500 },
  { campaign: "drop4_summer", from: "2027-06-11", to: "2027-06-18", amount: 1400 },
];

const spendWeekday = [1.1, 0.95, 0.95, 1.0, 1.0, 1.0, 1.05];

/** Splits a block's budget over its days with weekday pacing and daily noise. */
function pace(from: string, to: string, amount: number, sd = 0.12): Map<string, number> {
  const ds = daysBetween(from, to);
  const w = ds.map((d) => spendWeekday[dowOf(d)] * lognorm(sd));
  const total = w.reduce((s, x) => s + x, 0);
  return new Map(ds.map((d, i) => [d, (amount * w[i]) / total]));
}

/** Daily Meta spend per campaign. */
const metaSpend = new Map<string, Map<string, number>>(); // date → campaign → spend
function addSpend(date: string, campaign: string, amount: number) {
  if (!metaSpend.has(date)) metaSpend.set(date, new Map());
  const m = metaSpend.get(date)!;
  m.set(campaign, (m.get(campaign) ?? 0) + amount);
}
for (const m of months) {
  const first = `${m.key}-01`;
  const last = `${m.key}-${String(m.days).padStart(2, "0")}`;
  const monthBursts = bursts.filter((b) => b.from.slice(0, 7) === m.key);
  const burstTotal = monthBursts.reduce((s, b) => s + b.amount, 0);
  const retargeting = m.key >= "2026-11" ? Math.round(m.metaBudget * 0.1) : 0;
  for (const b of monthBursts) pace(b.from, b.to, b.amount).forEach((v, d) => addSpend(d, b.campaign, v));
  if (retargeting) pace(first, last, retargeting).forEach((v, d) => addSpend(d, "rt_cart", v));
  pace(first, last, m.metaBudget - burstTotal - retargeting).forEach((v, d) =>
    addSpend(d, d < "2026-11-16" ? "fall_launch" : "ao_prospecting", v),
  );
}

type Cell = { adset: string; creative: string; w: number };

function cellsFor(campaign: string, date: string): Cell[] {
  const cross = (adsetW: Record<string, number>, creativeW: Record<string, number>): Cell[] =>
    Object.entries(adsetW).flatMap(([adset, a]) => Object.entries(creativeW).map(([creative, c]) => ({ adset, creative, w: a * c })));
  switch (campaign) {
    case "fall_launch": {
      const sets = { broad_us: 0.4, int_sneakers: 0.35, int_running: 0.25 };
      // Round 1: equal budget per creative until Oct 25, then budget moves to the winners.
      if (date <= "2026-10-25") return cross(sets, { creative_1: 0.2, creative_2: 0.2, creative_3: 0.2, creative_4: 0.2, creative_5: 0.2 });
      return cross(sets, { creative_1: 0.3, creative_3: 0.28, creative_5: 0.2, creative_2: 0.12, creative_4: 0.1 });
    }
    case "ao_prospecting": {
      const sets: Record<string, number> =
        date < "2027-02-01"
          ? { broad_us: 0.5, int_sneakers: 0.3, int_running: 0.2 }
          : { broad_us: 0.35, int_sneakers: 0.25, int_running: 0.15, lal_buyers_1pct: 0.25 };
      const live = alwaysOn
        .map((id) => creativeById.get(id)!)
        .filter((c) => date >= (c.id === "creative_1" || c.id === "creative_3" || c.id === "creative_5" ? "2026-11-16" : c.launch) && (!c.retire || date < c.retire));
      // The delivery system leans toward what works, and gives new creatives an exploration boost.
      const w: Record<string, number> = {};
      for (const c of live) w[c.id] = c.ctr * fatigue(c, date) * Math.sqrt(c.cvr) * (daysSince(c.launch, date) < 14 ? 1.5 : 1);
      return cross(sets, w);
    }
    case "rt_cart":
      return [{ adset: "rt_cart_7d", creative: "dpa_cart", w: 1 }];
    case "holiday_gifting":
      return cross({ broad_us: 0.6, int_sneakers: 0.4 }, { holiday_gift_a: 0.5, holiday_gift_b: 0.5 });
    case "running_resolutions":
      return cross({ int_running: 0.6, broad_us: 0.4 }, { resolutions_a: 0.5, resolutions_b: 0.5 });
    case "drop2_fosco":
      return cross({ int_sneakers: 0.5, broad_us: 0.5 }, { drop_fosco_a: 0.5, drop_fosco_b: 0.5 });
    case "drop3_spring":
      return cross({ int_sneakers: 0.5, broad_us: 0.5 }, { drop_spring_a: 0.5, drop_spring_b: 0.5 });
    case "drop4_summer":
      return cross({ int_sneakers: 0.5, broad_us: 0.5 }, { drop_summer_a: 0.5, drop_summer_b: 0.5 });
  }
  throw new Error(`No cells for ${campaign}`);
}

const adRows: AdRow[] = [];
const adRowsByDate = new Map<string, AdRow[]>();
const adRowByKey = new Map<string, AdRow>();
function pushAdRow(r: Omit<AdRow, "key" | "sessions" | "trueOrders" | "trueValue" | "platform_conversions" | "platform_conversion_value">) {
  const row: AdRow = { ...r, key: `${r.date}|${r.campaign_id}|${r.ad_set}|${r.creative_id}`, sessions: 0, trueOrders: 0, trueValue: 0, platform_conversions: 0, platform_conversion_value: 0 };
  adRows.push(row);
  if (!adRowsByDate.has(r.date)) adRowsByDate.set(r.date, []);
  adRowsByDate.get(r.date)!.push(row);
  adRowByKey.set(row.key, row);
  return row;
}

for (const date of allDays) {
  const mrow = monthOf(date).month;
  for (const [campaign, daySpend] of metaSpend.get(date) ?? []) {
    const cells = cellsFor(campaign, date).map((c) => ({ ...c, w: c.w * lognorm(0.25) }));
    const total = cells.reduce((s, c) => s + c.w, 0);
    for (const cell of cells) {
      const spend = round2(((daySpend * SCALE) * cell.w) / total);
      if (spend < 0.5) continue;
      const cr = creativeById.get(cell.creative)!;
      const a = adsets[cell.adset];
      const cpm = mrow.cpm * a.cpm * lognorm(0.08);
      const impressions = Math.round((spend / cpm) * 1000);
      const ctr = mrow.ctr * a.ctr * cr.ctr * fatigue(cr, date) * lognorm(0.1);
      const clicks = binom(impressions, ctr);
      const frequency = cell.adset === "rt_cart_7d" ? 2.5 + rnd() * 1.5 : 1.2 + rnd() * 0.6;
      pushAdRow({ date, platform: "Meta", campaign_id: campaign, ad_set: cell.adset, creative_id: cell.creative, impressions, reach: Math.round(impressions / frequency), clicks, spend });
    }
  }
  // Google Shopping (not in the plan; assumed added in March 2027).
  if (date >= GADS_START) {
    const spend = round2(30 * SCALE * spendWeekday[dowOf(date)] * lognorm(0.12));
    const cpc = 0.85 * lognorm(0.1);
    const clicks = Math.round(spend / cpc);
    const impressions = Math.round(clicks / (0.012 * lognorm(0.1)));
    pushAdRow({ date, platform: "Google", campaign_id: "gads_shopping_nb", ad_set: "shopping_all", creative_id: "shopping_feed", impressions, reach: 0, clicks, spend });
  }
}

// ─── Non-paid traffic ──────────────────────────────────────────────────

const generalWeekday = [1.1, 0.95, 0.95, 1.0, 1.0, 0.95, 1.05];
const emailWeekday = [0.4, 0.4, 0.4, 3.0, 1.6, 0.6, 0.4]; // Sun = 0; the Weekly Edit goes out Wednesday

function boost(date: string, channel: "ig" | "email" | "search" | "direct"): number {
  let b = 1;
  if (dropOn(date)) b *= channel === "email" ? 2.5 : channel === "search" ? 1.2 : 1.8;
  if (inRange(date, "2026-11-24", "2026-11-30") && channel !== "ig") b *= 1.6; // Black Friday week
  if (inRange(date, "2026-12-01", "2026-12-22")) b *= 1.15;
  return b;
}

/** Day weights inside each month that average to 1, so monthly totals match the model. */
function monthFactors(fn: (d: string) => number): Map<string, number> {
  const out = new Map<string, number>();
  for (const m of months) {
    const ds = daysBetween(`${m.key}-01`, `${m.key}-${String(m.days).padStart(2, "0")}`);
    const f = ds.map(fn);
    const mean = f.reduce((s, x) => s + x, 0) / f.length;
    ds.forEach((d, i) => out.set(d, f[i] / mean));
  }
  return out;
}
const igF = monthFactors((d) => generalWeekday[dowOf(d)] * boost(d, "ig"));
const emailF = monthFactors((d) => emailWeekday[dowOf(d)] * boost(d, "email"));
const searchF = monthFactors((d) => generalWeekday[dowOf(d)] * boost(d, "search"));
const directF = monthFactors((d) => generalWeekday[dowOf(d)] * boost(d, "direct"));

// ─── Sessions ──────────────────────────────────────────────────────────

type Device = "mobile" | "desktop" | "tablet";

type Spec = {
  kind: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  landing: string; // path
  landingProduct?: Product;
  line: Line | null;
  conv: number; // base session-to-order conversion
  cvrMult: number;
  pv: number; // share of sessions that view a product
  returning: number; // chance the visitor has been here before
  buyerPick: number; // chance a returning visitor is an existing customer
  retarget?: boolean;
  devices: Record<Device, number>;
  discount: number;
  adKey?: string;
  hour?: number;
  second?: number;
};

const REGIONS: Record<string, number> = {
  CA: 12, TX: 9, NY: 9, FL: 7, IL: 4.5, WA: 4, MA: 3.5, PA: 3.5, NJ: 3.5, GA: 3, CO: 3, OH: 2.5, NC: 2.5, VA: 2.5, AZ: 2.5, MI: 2.5, OR: 2, MN: 2, TN: 2, MD: 2, IN: 1.5, MO: 1.5, WI: 1.5, CT: 1.5, UT: 1.2, other: 12,
};
const OTHER_STATES = ["AL", "AR", "IA", "KS", "KY", "LA", "ME", "MS", "MT", "NE", "NV", "NH", "NM", "OK", "SC", "SD", "WV", "DC", "DE", "ID", "RI", "HI", "AK", "ND", "VT", "WY"];

const dev = (m: number, d: number, t: number): Record<Device, number> => ({ mobile: m, desktop: d, tablet: t });
const DEV = {
  meta: dev(0.75, 0.2, 0.05),
  metaRt: dev(0.7, 0.25, 0.05),
  google: dev(0.55, 0.4, 0.05),
  brand: dev(0.45, 0.5, 0.05),
  ig: dev(0.85, 0.1, 0.05),
  email: dev(0.6, 0.3, 0.1),
  search: dev(0.5, 0.45, 0.05),
  direct: dev(0.45, 0.5, 0.05),
};

// Base behaviour per traffic type (conversion = share of sessions that order).
const BASE = {
  meta: { conv: 0.0085, pv: 0.5, returning: 0.08, buyerPick: 0.06, devices: DEV.meta },
  metaRt: { conv: 0.0085, pv: 0.6, returning: 1, buyerPick: 0, devices: DEV.metaRt },
  shopping: { conv: 0.014, pv: 0.55, returning: 0.15, buyerPick: 0.08, devices: DEV.google },
  gadsBrand: { conv: 0.025, pv: 0.8, returning: 0.4, buyerPick: 0.3, devices: DEV.brand },
  ig: { conv: 0.012, pv: 0.55, returning: 0.15, buyerPick: 0.08, devices: DEV.ig },
  email: { conv: 0.02, pv: 0.8, returning: 0.75, buyerPick: 0.6, devices: DEV.email },
  orgBrand: { conv: 0.02, pv: 0.7, returning: 0.35, buyerPick: 0.3, devices: DEV.search },
  orgNonBrand: { conv: 0.016, pv: 0.55, returning: 0.15, buyerPick: 0.05, devices: DEV.search },
  direct: { conv: 0.016, pv: 0.65, returning: 0.55, buyerPick: 0.45, devices: DEV.direct },
};

function metaSpec(row: AdRow): Spec {
  const cr = creativeById.get(row.creative_id)!;
  const a = adsets[row.ad_set];
  const rt = row.ad_set === "rt_cart_7d";
  let cvrMult = cr.cvr * a.cvr;
  if (row.ad_set === "int_running" && row.creative_id === "creative_5") cvrMult *= 1.4;
  if (row.ad_set === "int_sneakers" && row.creative_id === "creative_2") cvrMult *= 1.15;
  const base = rt ? BASE.metaRt : BASE.meta;
  const landingProduct = cr.landing.startsWith("/") ? undefined : productById.get(cr.landing);
  const spec: Spec = {
    kind: "meta", source: "meta", medium: "paid_social", campaign: row.campaign_id, content: row.creative_id, term: row.ad_set,
    landing: landingProduct ? `/products/${landingProduct.slug}` : cr.landing, landingProduct, line: cr.line,
    conv: base.conv, cvrMult, pv: base.pv, returning: base.returning, buyerPick: base.buyerPick, retarget: rt, devices: base.devices,
    discount: 0, adKey: row.key,
  };
  // Data-quality: tracking parameters are sometimes lost on the way from the ad to the site.
  const roll = rnd();
  if (roll < 0.06) {
    // Facebook's in-app browser strips UTMs: GA4 sees a plain referral.
    spec.kind = "meta_referral"; spec.source = "l.facebook.com"; spec.medium = "referral"; spec.campaign = "(referral)"; spec.content = "(not set)"; spec.term = "(not set)";
  } else if (roll < 0.09) {
    spec.campaign = "(not set)"; spec.content = "(not set)"; spec.term = "(not set)";
  }
  return spec;
}

function googleSpec(row: AdRow, brand: boolean): Spec {
  const base = brand ? BASE.gadsBrand : BASE.shopping;
  const landingProduct = brand ? undefined : randProduct(null, "footwear");
  return {
    kind: brand ? "gads_brand" : "gads_shopping", source: "google", medium: "cpc", campaign: row.campaign_id, content: row.creative_id,
    term: brand ? "brand_exact" : "shopping_all",
    landing: landingProduct ? `/products/${landingProduct.slug}` : "/", landingProduct, line: null,
    conv: base.conv, cvrMult: 1, pv: base.pv, returning: base.returning, buyerPick: base.buyerPick, devices: base.devices, discount: 0, adKey: row.key,
  };
}

const homeOrLine = (): { landing: string; line: Line | null } => {
  const roll = rnd();
  if (roll < 0.6) return { landing: "/", line: null };
  const l = pick(["classic", "performance", "street"] as const);
  return { landing: `/shop/${l}`, line: l === "classic" ? "Classic" : l === "performance" ? "Performance" : "Street" };
};

function productLanding(line: Line | null): { landing: string; landingProduct: Product } {
  const p = randProduct(line);
  return { landing: `/products/${p.slug}`, landingProduct: p };
}

function nonPaidSpecs(date: string): Spec[] {
  const specs: Spec[] = [];
  const r = byMonth.get(date.slice(0, 7))!;
  const days = r.month.days;
  const drop = dropOn(date);

  // Instagram organic: ~40% arrives through tagged creator links, the rest as an untagged referral.
  const ig = poisson((r.sessions["Instagram Organic"] / days) * igF.get(date)! * SCALE);
  for (let i = 0; i < ig; i++) {
    const tagged = chance(0.4);
    const land = chance(0.6) ? productLanding(null) : homeOrLine();
    specs.push({
      kind: tagged ? "ig_creator" : "ig_referral",
      source: tagged ? "instagram" : "instagram.com", medium: tagged ? "creator" : "referral",
      campaign: tagged ? "creator_seeding" : "(referral)", content: tagged ? `creator_${randInt(1, 40)}` : "(not set)", term: "(not set)",
      ...land, line: ("landingProduct" in land ? land.landingProduct.line : land.line) as Line | null,
      ...BASE.ig, cvrMult: 1, discount: 0,
    } as Spec);
  }

  // Newsletter: The Weekly Edit on Wednesdays, plus campaign sends.
  const email = poisson((r.sessions.Newsletter / days) * emailF.get(date)! * SCALE);
  for (let i = 0; i < email; i++) {
    let campaign = "weekly_edit";
    let discount = 0;
    if (inRange(date, "2026-11-24", "2026-11-30") && chance(0.55)) campaign = "bf_early_access";
    else if (inRange(date, "2027-01-20", "2027-01-31") && chance(0.6)) { campaign = "archive_sale_jan27"; discount = 0.25; }
    else if (drop && chance(0.5)) campaign = drop.id;
    else if (date >= "2026-11-01" && chance(0.12)) campaign = "welcome_flow";
    const land = chance(0.5) ? productLanding(null) : homeOrLine();
    specs.push({
      kind: "email", source: "newsletter", medium: "email", campaign,
      content: pick(["hero", "hero", "product_grid", "product_grid", "drop_teaser"]), term: "(not set)",
      ...land, line: ("landingProduct" in land ? land.landingProduct.line : land.line) as Line | null,
      ...BASE.email, cvrMult: campaign === "weekly_edit" ? 1 : 1.2, discount,
    } as Spec);
  }

  // Organic search: branded demand, minus what Google Ads brand search takes from March.
  const brandBase = poisson(((r.impressions * 0.0005) / days) * searchF.get(date)! * SCALE);
  let brandOrganic = brandBase;
  if (date >= GADS_START) {
    const adSessions = binom(brandBase, 0.65);
    brandOrganic = brandBase - Math.round(0.85 * adSessions); // 85% of ad clicks would have come anyway
    if (adSessions > 0) {
      const clicks = Math.round(adSessions / 0.92);
      const row = pushAdRow({ date, platform: "Google", campaign_id: "gads_brand_search", ad_set: "brand_exact", creative_id: "rsa_brand", impressions: Math.round(clicks / (0.3 * lognorm(0.1))), reach: 0, clicks, spend: round2(clicks * 0.38 * lognorm(0.1)) });
      for (let i = 0; i < adSessions; i++) specs.push(googleSpec(row, true));
    }
  }
  for (let i = 0; i < brandOrganic; i++) {
    const land = chance(0.65) ? { landing: "/", line: null as Line | null } : chance(0.5) ? homeOrLine() : productLanding(null);
    specs.push({
      kind: "organic_brand", source: "google", medium: "organic", campaign: "(organic)", content: "(not set)", term: "(not provided)",
      ...land, line: ("landingProduct" in land ? land.landingProduct.line : land.line) as Line | null,
      ...BASE.orgBrand, cvrMult: 1, discount: 0,
    } as Spec);
  }
  const nbIdx = r.month.key >= "2027-04" ? months.findIndex((m) => m.key === r.month.key) - months.findIndex((m) => m.key === "2027-04") : -1;
  const nonBrand = nbIdx >= 0 ? poisson(([150, 250, 350, 450, 550, 650][nbIdx] / days) * searchF.get(date)! * SCALE) : 0;
  for (let i = 0; i < nonBrand; i++) {
    const land = chance(0.6) ? productLanding(null) : homeOrLine();
    specs.push({
      kind: "organic_nonbrand", source: "google", medium: "organic", campaign: "(organic)", content: "(not set)", term: "(not provided)",
      ...land, line: ("landingProduct" in land ? land.landingProduct.line : land.line) as Line | null,
      ...BASE.orgNonBrand, cvrMult: 1, discount: 0,
    } as Spec);
  }

  // Direct: typed-in visits and word of mouth, about 12% of everything else.
  const direct = poisson((r.sessions.Direct / days) * directF.get(date)! * SCALE);
  for (let i = 0; i < direct; i++) {
    const land = chance(0.6) ? { landing: "/", line: null as Line | null } : chance(0.4) ? homeOrLine() : productLanding(null);
    specs.push({
      kind: "direct", source: "(direct)", medium: "(none)", campaign: "(direct)", content: "(not set)", term: "(not set)",
      ...land, line: ("landingProduct" in land ? land.landingProduct.line : land.line) as Line | null,
      ...BASE.direct, cvrMult: 1, discount: 0,
    } as Spec);
  }
  return specs;
}

// ─── Users, sessions, orders ───────────────────────────────────────────

type User = {
  id: string;
  device: Device;
  region: string;
  sessions: number;
  customerId?: string;
  lastOrderDate?: string;
};
type Customer = { id: string; firstOrderDate: string; firstOrderId: string; region: string; emailOptIn: boolean; orders: number };

const users: User[] = [];
const buyers: User[] = [];
const abandoners: { user: User; date: string }[] = [];
const customers = new Map<string, Customer>();
let customerSeq = 0;

function newUserId(date: string) {
  const ts = Math.floor(Date.parse(date) / 1000) + randInt(0, 86399);
  return `${randInt(100_000_000, 2_000_000_000)}.${ts}`;
}
function pickRegion() {
  const r = wpickKey(REGIONS);
  return r === "other" ? pick(OTHER_STATES) : r;
}

function pickReturning(spec: Spec, date: string): User | null {
  if (spec.retarget) {
    while (abandoners.length && daysSince(abandoners[0].date, date) > 7) abandoners.shift();
    if (!abandoners.length) return null;
    const i = randInt(0, abandoners.length - 1);
    const [a] = abandoners.splice(i, 1);
    return a.user;
  }
  if (buyers.length && chance(spec.buyerPick)) {
    for (let t = 0; t < 6; t++) {
      const b = buyers[randInt(0, buyers.length - 1)];
      if (!b.lastOrderDate || daysSince(b.lastOrderDate, date) >= 21) return b;
    }
  }
  return users.length ? users[randInt(0, users.length - 1)] : null;
}

function channelGroup(source: string, medium: string): string {
  if (source === "meta" && medium === "paid_social") return "Meta Paid";
  if (medium === "email") return "Newsletter";
  if (source.includes("instagram")) return "Instagram Organic";
  if (medium === "organic") return "Organic Search";
  if (medium === "cpc") return "Paid Search";
  if (source === "(direct)") return "Direct";
  return "Referral";
}

const sessionCsv: Record<string, unknown>[] = [];
const orderCsv: Record<string, unknown>[] = [];
const itemCsv: Record<string, unknown>[] = [];
const sessionChannel = new Map<string, string>();

const RETURN_REASONS: Record<Product["category"], Record<string, number>> = {
  footwear: { "Wrong size or fit": 55, "Not as expected": 20, "Changed mind": 20, Defective: 5 },
  apparel: { "Wrong size or fit": 45, "Not as expected": 25, "Changed mind": 27, Defective: 3 },
  accessories: { "Not as expected": 45, "Changed mind": 50, Defective: 5 },
};

let orderSeq = 0;
function buildOrder(spec: Spec, user: User, customer: Customer, placedAt: Date, isFirst: boolean, orderNumber: number, daysSincePrev: number | null) {
  // Items
  const count = wpickKey({ "1": 0.78, "2": 0.17, "3": 0.05 });
  const first: Product = (() => {
    if (spec.landingProduct && chance(0.6)) return chance(0.5) ? spec.landingProduct : pick(products.filter((p) => p.model === spec.landingProduct!.model));
    return randProduct(spec.line, wpickKey({ footwear: 0.5, apparel: 0.33, accessories: 0.17 }));
  })();
  const chosen: Product[] = [first];
  for (let i = 1; i < Number(count); i++) {
    const p = randProduct(chance(0.6) ? first.line : null, wpickKey({ footwear: 0.15, apparel: 0.4, accessories: 0.45 }));
    if (!chosen.some((c) => c.id === p.id)) chosen.push(p);
  }
  const orderId = `VRD-${placedAt.getTime().toString(36).toUpperCase()}-${(++orderSeq).toString(36).toUpperCase().padStart(3, "0")}`;
  const returnWindow = randInt(7, 30);
  let listTotal = 0, cogs = 0, refunds = 0, restockedCogs = 0, anyReturn = false, units = 0;
  const lines: Record<string, unknown>[] = [];
  chosen.forEach((p, idx) => {
    const qty = chance(0.06) ? 2 : 1;
    const price = p.price;
    const cost = unitCostOf(p);
    const returned = chance(orderCosts.returnRate[p.category]);
    const resellable = returned ? chance(orderCosts.resellableShare) : false;
    const lineList = price * qty;
    const lineNet = lineList * (1 - spec.discount);
    listTotal += lineList;
    cogs += cost * qty;
    units += qty;
    if (returned) {
      anyReturn = true;
      refunds += lineNet;
      if (resellable) restockedCogs += cost * qty;
    }
    lines.push({
      order_id: orderId, line_no: idx + 1, item_id: p.id, item_name: p.name, item_category: p.category, model: p.model, line: p.line, colorway: p.colorway,
      size: pickSize(p), quantity: qty, unit_price: price, unit_cost: cost, discount_pct: spec.discount, returned: returned ? 1 : 0,
      return_reason: returned ? wpickKey(RETURN_REASONS[p.category]) : "", restocked: returned ? (resellable ? 1 : 0) : "",
    });
  });
  const discount = round2(listTotal * spec.discount);
  const merch = round2(listTotal - discount);
  const paymentFee = round2(merch * orderCosts.paymentFeeRate + orderCosts.paymentFeeFixed);
  const returnShipping = anyReturn ? orderCosts.returnShipping : 0;
  const refundTotal = round2(refunds);
  const cogsNet = round2(cogs - restockedCogs);
  const net = round2(merch - refundTotal);
  const contribution = round2(net - cogsNet - orderCosts.shippingPerOrder - orderCosts.packagingPerOrder - paymentFee - returnShipping);
  const placedDate = placedAt.toISOString().slice(0, 10);
  const row = {
    order_id: orderId, customer_id: customer.id, user_pseudo_id: chance(0.95) ? user.id : "",
    order_timestamp: placedAt.toISOString().slice(0, 19).replace("T", " "), order_date: placedDate,
    is_first_order: isFirst ? 1 : 0, order_number: orderNumber, days_since_previous_order: daysSincePrev ?? "",
    items: lines.length, units, gross_sales: round2(listTotal), discount_amount: discount, discount_code: spec.discount > 0 ? "ARCHIVE25" : "",
    merchandise_revenue: merch, shipping_charged: 0, shipping_cost: orderCosts.shippingPerOrder, packaging_cost: orderCosts.packagingPerOrder,
    payment_fee: paymentFee, cogs: round2(cogs), refund_amount: refundTotal, return_date: anyReturn ? addDays(placedDate, returnWindow) : "",
    return_shipping_cost: returnShipping, cogs_after_returns: cogsNet, net_revenue: net, contribution_margin: contribution, status: "paid",
  };
  orderCsv.push(row);
  itemCsv.push(...lines);
  return { orderId, merch };
}

const stats = {
  sessions: {} as Record<string, number>,
  orders: {} as Record<string, number>,
  revenue: {} as Record<string, number>,
  ga4Captured: 0,
  orderCount: 0,
  repeatOrders: 0,
};
const bump = (m: Record<string, number>, k: string, v = 1) => (m[k] = (m[k] ?? 0) + v);

const CONV_CAL = Number(opt("cal", "1"));

function processSession(spec: Spec, date: string, sessionNo: number) {
  // Who is this visitor?
  let user: User | null = null;
  let isNew = true;
  let existingCustomerId: string | undefined;
  if (chance(spec.returning)) {
    const picked = pickReturning(spec, date);
    if (picked) {
      user = picked;
      isNew = false;
      // A returning customer on a new device looks like a brand-new visitor to GA4.
      if (picked.customerId && chance(0.07)) {
        existingCustomerId = picked.customerId;
        user = null;
        isNew = true;
      }
    }
  }
  const device = (isNew ? wpickKey(spec.devices) : user!.device) as Device;
  if (!user) {
    user = { id: newUserId(date), device, region: pickRegion(), sessions: 0 };
    if (existingCustomerId) user.customerId = existingCustomerId;
    users.push(user);
  }
  user.sessions++;

  // Funnel
  const returningBoost = spec.retarget ? 1 : user.customerId ? 3 : !isNew ? 1.5 : 1;
  const pConv = spec.conv * spec.cvrMult * monthOf(date).month.seasonality * returningBoost * CONV_CAL;
  const pc = device === "mobile" ? 0.46 : device === "desktop" ? 0.58 : 0.52;
  const pb = 0.55;
  const pa = Math.min(0.95, pConv / (spec.pv * pc * pb));
  const view = chance(spec.pv);
  const atc = view && chance(pa);
  const checkout = atc && chance(pc);
  const buy = checkout && chance(pb);

  // Time
  const hour = spec.hour!;
  const second = spec.second!;
  const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00:00Z`);
  start.setUTCSeconds(second);
  const duration = buy ? randInt(240, 900) : atc ? randInt(120, 500) : view ? randInt(40, 300) : randInt(3, 40);
  const pages = view ? randInt(3, 9) : chance(0.4) ? 1 : randInt(2, 4);
  const sessionId = `S${String(sessionNo).padStart(7, "0")}`;
  const group = channelGroup(spec.source, spec.medium);
  bump(stats.sessions, group);

  let purchaseEvents = 0;
  let txId = "";
  let value = 0;
  if (buy) {
    const placedAt = new Date(start.getTime() + duration * 1000);
    let customer = user.customerId ? customers.get(user.customerId) : undefined;
    const isFirst = !customer;
    if (!customer) {
      customer = { id: `C${String(++customerSeq).padStart(6, "0")}`, firstOrderDate: date, firstOrderId: "", region: user.region, emailOptIn: spec.kind === "email" || chance(0.35), orders: 0 };
      customers.set(customer.id, customer);
      user.customerId = customer.id;
      if (!buyers.includes(user)) buyers.push(user);
    }
    const daysSincePrev = !isFirst && user.lastOrderDate ? daysSince(user.lastOrderDate, date) : null;
    customer.orders++;
    const { orderId, merch } = buildOrder(spec, user, customer, placedAt, isFirst, customer.orders, daysSincePrev);
    if (isFirst) customer.firstOrderId = orderId;
    user.lastOrderDate = date;
    stats.orderCount++;
    if (!isFirst) stats.repeatOrders++;
    bump(stats.orders, group);
    bump(stats.revenue, group, merch);
    if (spec.adKey) {
      const row = adRowByKey.get(spec.adKey)!;
      row.trueOrders++;
      row.trueValue += merch;
    }
    // GA4 sometimes misses the purchase (closed tab, blocker, consent), occasionally fires twice.
    const capture = device === "mobile" && spec.source !== "(direct)" && spec.medium === "paid_social" ? 0.84 : device === "desktop" ? 0.94 : 0.9;
    if (chance(capture)) {
      purchaseEvents = chance(0.015) ? 2 : 1;
      txId = orderId;
      value = merch;
      stats.ga4Captured++;
    }
  } else if (atc) {
    abandoners.push({ user, date });
  }

  if (spec.adKey) adRowByKey.get(spec.adKey)!.sessions++;

  sessionCsv.push({
    session_id: sessionId, user_pseudo_id: user.id, session_start: start.toISOString().slice(0, 19).replace("T", " "), session_date: date,
    session_number: user.sessions, is_new_user: isNew ? 1 : 0, device_category: device, region: user.region, country: "US",
    source: spec.source, medium: spec.medium, campaign: spec.campaign, content: spec.content, term: spec.term, channel_group: group,
    landing_page: spec.landing, pages_viewed: pages, engagement_seconds: duration, engaged_session: duration >= 10 || pages >= 2 ? 1 : 0,
    view_item: view ? 1 : 0, add_to_cart: atc ? 1 : 0, begin_checkout: checkout ? 1 : 0, purchase_events: purchaseEvents,
    transaction_id: txId, purchase_revenue: value ? round2(value) : "",
  });
  sessionChannel.set(sessionId, group);
}

// Time of day for each session.
const hourWeights = hourlyTraffic;
function assignTime(spec: Spec) {
  spec.hour = spec.kind === "email" ? Math.max(6, Math.min(22, Math.round(11 + normal() * 3))) : wpick([...hourWeights.keys()], (h) => hourWeights[h]);
  spec.second = randInt(0, 3599);
}

let sessionNo = 0;
for (const date of allDays) {
  const specs: Spec[] = [];
  for (const row of adRowsByDate.get(date) ?? []) {
    if (row.platform === "Meta") {
      const n = binom(row.clicks, row.ad_set === "rt_cart_7d" ? 0.8 : 0.75);
      for (let i = 0; i < n; i++) specs.push(metaSpec(row));
    } else if (row.campaign_id === "gads_shopping_nb") {
      const n = binom(row.clicks, 0.92);
      for (let i = 0; i < n; i++) specs.push(googleSpec(row, false));
    }
  }
  specs.push(...nonPaidSpecs(date)); // also creates the Google brand-search ad row for the day
  specs.forEach(assignTime);
  specs.sort((a, b) => a.hour! * 3600 + a.second! - (b.hour! * 3600 + b.second!));
  for (const spec of specs) processSession(spec, date, ++sessionNo);
}

// ─── Platform-reported conversions ─────────────────────────────────────

for (const row of adRows) {
  if (row.platform === "Meta") {
    // Meta counts view-through and modelled conversions, so it reports more than the store saw.
    const factor = row.ad_set === "rt_cart_7d" ? 1.7 : 1.3;
    row.platform_conversions = poisson(row.trueOrders * factor + row.clicks * 0.0012);
  } else {
    row.platform_conversions = poisson(row.trueOrders * (row.campaign_id === "gads_brand_search" ? 1.1 : 1.08));
  }
  const aov = row.trueOrders > 0 ? row.trueValue / row.trueOrders : 170;
  row.platform_conversion_value = round2(row.platform_conversions * aov * lognorm(0.12));
}

// ─── Reference tables ──────────────────────────────────────────────────

const csvCell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function writeCsv(name: string, rows: Record<string, unknown>[], cols?: string[]) {
  const header = cols ?? Object.keys(rows[0]);
  const lines = [header.join(","), ...rows.map((r) => header.map((c) => csvCell(r[c])).join(","))];
  writeFileSync(path.join(OUT, name), lines.join("\n") + "\n");
  console.log(`  ${name.padEnd(28)} ${String(rows.length).padStart(7)} rows`);
}

mkdirSync(OUT, { recursive: true });
console.log(`Writing ${OUT}/  (seed ${SEED}, scale ${SCALE})`);

const dimProducts = products.map((p) => {
  const cost = unitCostOf(p);
  return {
    item_id: p.id, item_name: p.name, model: p.model, model_code: codeOf(p), line: p.line, category: p.category, subcategory: p.subcategory,
    colorway: p.colorway, list_price: p.price, unit_cost: cost, gross_margin_pct: round2(((p.price - cost) / p.price) * 100), tag: p.tag ?? "",
  };
});
writeCsv("dim_products.csv", dimProducts);

const platformOf = (channel: string) => (channel.includes("Meta") ? "Meta" : channel.includes("Newsletter") ? "Email" : "Instagram");
const dimCampaigns = [
  ...hubCampaigns.map((c) => ({
    campaign_id: c.id, campaign_name: c.name, platform: platformOf(c.channel), channel: c.channel, layer: c.layer, start_date: c.start, end_date: c.end ?? "",
    objective: c.objective, audience: c.audience, owner: c.owner,
  })),
  { campaign_id: "gads_shopping_nb", campaign_name: "Google Shopping, non-brand", platform: "Google", channel: "Paid Search", layer: "Always-on", start_date: GADS_START, end_date: "", objective: "Sales (feed-based)", audience: "All US", owner: "lucas" },
  { campaign_id: "gads_brand_search", campaign_name: "Google brand search", platform: "Google", channel: "Paid Search", layer: "Always-on", start_date: GADS_START, end_date: "", objective: "Defend brand terms", audience: "Searches for 'verdian'", owner: "lucas" },
];
writeCsv("dim_campaigns.csv", dimCampaigns);

writeCsv(
  "dim_creatives.csv",
  creatives.map((c) => ({
    creative_id: c.id, creative_name: c.name, theme: c.theme, line: c.line ?? "", landing: c.landing, launch_date: c.launch, retire_date: c.retire ?? "",
  })),
);

writeCsv(
  "ad_performance_daily.csv",
  adRows.map((r) => ({
    date: r.date, platform: r.platform, campaign_id: r.campaign_id, ad_set: r.ad_set, creative_id: r.creative_id, impressions: r.impressions, reach: r.reach || "",
    clicks: r.clicks, spend: r.spend, platform_conversions: r.platform_conversions, platform_conversion_value: r.platform_conversion_value, currency: "USD",
  })),
);

writeCsv("sessions.csv", sessionCsv);
writeCsv("orders.csv", orderCsv);
writeCsv("order_items.csv", itemCsv);

writeCsv(
  "customers.csv",
  [...customers.values()].map((c) => ({ customer_id: c.id, first_order_date: c.firstOrderDate, first_order_id: c.firstOrderId, region: c.region, email_opt_in: c.emailOptIn ? 1 : 0 })),
);

// Marketing costs that are not ad spend: creators, content, email platform, tools.
const otherSpend: Record<string, unknown>[] = [];
const totalCreators = months.reduce((s, m) => s + m.creatorsSeeded, 0);
for (const m of months) {
  otherSpend.push({ month: m.key, category: "Creator seeding (product and shipping)", amount: round2(((14000 * m.creatorsSeeded) / totalCreators) * SCALE) });
  otherSpend.push({ month: m.key, category: "Content production", amount: round2((12000 / 12) * SCALE) });
  otherSpend.push({ month: m.key, category: "Email platform", amount: round2(3000 / 12) });
  otherSpend.push({ month: m.key, category: "Analytics and tools", amount: round2(3000 / 12) });
}
writeCsv("marketing_costs_other_monthly.csv", otherSpend);

writeCsv(
  "plan_monthly.csv",
  model.map((r) => ({
    month: r.month.key, plan_meta_budget: r.month.metaBudget, plan_cpm: r.month.cpm, plan_ctr: r.month.ctr, plan_seasonality: r.month.seasonality,
    plan_sessions_meta: Math.round(r.sessions["Meta Paid"]), plan_sessions_instagram: Math.round(r.sessions["Instagram Organic"]),
    plan_sessions_newsletter: Math.round(r.sessions.Newsletter), plan_sessions_search: Math.round(r.sessions["Organic Search"]),
    plan_sessions_direct: Math.round(r.sessions.Direct), plan_sessions_total: Math.round(r.total), plan_orders: Math.round(r.orders),
    plan_revenue: Math.round(r.revenue), plan_spend: Math.round(r.spend), plan_cac: round2(r.cac), finance_sessions_per_day: r.month.financeSessionsPerDay,
  })),
);

// ─── Summary ───────────────────────────────────────────────────────────

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const metaSpendTotal = sum(adRows.filter((r) => r.platform === "Meta").map((r) => r.spend));
const googleSpendTotal = sum(adRows.filter((r) => r.platform === "Google").map((r) => r.spend));
const revenue = sum(orderCsv.map((o) => o.merchandise_revenue as number));
const net = sum(orderCsv.map((o) => o.net_revenue as number));
const contribution = sum(orderCsv.map((o) => o.contribution_margin as number));
console.log("\nSummary");
console.log(`  sessions ${sessionCsv.length}, orders ${orderCsv.length}, customers ${customers.size}, repeat-order share ${((stats.repeatOrders / stats.orderCount) * 100).toFixed(1)}%`);
console.log(`  revenue $${Math.round(revenue)}, net of returns $${Math.round(net)}, contribution $${Math.round(contribution)}, AOV $${(revenue / orderCsv.length).toFixed(0)}`);
console.log(`  ad spend: Meta $${Math.round(metaSpendTotal)}, Google $${Math.round(googleSpendTotal)}`);
console.log(`  GA4 purchase capture ${((stats.ga4Captured / stats.orderCount) * 100).toFixed(1)}%`);
console.log("  by channel group (sessions / orders / conv / revenue):");
for (const k of Object.keys(stats.sessions).sort()) {
  const o = stats.orders[k] ?? 0;
  console.log(`    ${k.padEnd(18)} ${String(stats.sessions[k]).padStart(6)} ${String(o).padStart(5)} ${((o / stats.sessions[k]) * 100).toFixed(2).padStart(6)}%  $${Math.round(stats.revenue[k] ?? 0)}`);
}
console.log(`  plan: ${Math.round(sum(model.map((r) => r.total)))} sessions, ${Math.round(sum(model.map((r) => r.orders)))} orders, $${Math.round(sum(model.map((r) => r.revenue)))} revenue`);
