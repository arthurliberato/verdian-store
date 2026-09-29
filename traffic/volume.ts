// How much traffic to send, from which channels, under which campaign.
//
// Everything comes from the marketing plan's acquisition model in the hub
// (hub/content/acquisition.ts), so the store gets the traffic the plan buys:
// ~190 sessions a day, about 70% from Meta, more on newsletter days, and
// campaign names that change with the calendar. The generator reads the
// model; it never keeps its own copy of the numbers.

import { runModel, type Channel } from "../hub/content/acquisition";
import { hourlyTraffic, type SourceType } from "./archetypes";

const rows = runModel();

const channelToSource: Record<Channel, SourceType> = {
  "Meta Paid": "meta_paid",
  "Instagram Organic": "instagram",
  Newsletter: "email",
  "Organic Search": "organic_google",
  Direct: "direct",
};

/** The model row for a date (launch week uses October; after Year 1, September). */
function rowFor(date: Date) {
  const key = date.toISOString().slice(0, 7);
  return rows.find((r) => r.month.key === key) ?? (key < rows[0].month.key ? rows[0] : rows[rows.length - 1]);
}

/** Newsletter clicks cluster after the Wednesday send. Weights by weekday (Sun = 0). */
const emailByWeekday = [0.4, 0.4, 0.4, 3.0, 1.6, 0.6, 0.4];
const emailWeekdayMean = emailByWeekday.reduce((s, w) => s + w, 0) / 7;

/** Sessions the model expects per day for this date. */
export function sessionsPerDay(date: Date): number {
  return rowFor(date).perDay;
}

/**
 * Sessions to send for the time since the previous run, shaped by hour of day.
 * Gaps longer than `maxCatchUpHours` (GitHub skipping scheduled runs) are
 * capped rather than dumped all at once, which would create fake spikes.
 */
export function sessionsForWindow(from: Date, to: Date, localHourOf: (d: Date) => number, maxCatchUpHours = 3): number {
  const hourlyMean = hourlyTraffic.reduce((s, w) => s + w, 0) / 24;
  const start = new Date(Math.max(from.getTime(), to.getTime() - maxCatchUpHours * 3_600_000));
  let expected = 0;
  for (let t = start.getTime(); t < to.getTime(); t += 60_000) {
    const d = new Date(t);
    expected += (sessionsPerDay(d) / 1440) * (hourlyTraffic[localHourOf(d)] / hourlyMean);
  }
  // Day-to-day noise: ±30%.
  return Math.max(0, Math.round(expected * (0.7 + Math.random() * 0.6)));
}

/** Source weights for this date, from the model's channel mix. */
export function sourceWeights(date: Date, weekday: number): Record<SourceType, number> {
  const row = rowFor(date);
  const weights = {} as Record<SourceType, number>;
  for (const [channel, source] of Object.entries(channelToSource) as [Channel, SourceType][]) {
    weights[source] = row.sessions[channel];
  }
  weights.email *= emailByWeekday[weekday] / emailWeekdayMean;
  return weights;
}

// ─── Campaign calendar (hub/content/campaigns.ts) ──────────────────────

const inRange = (day: string, start: string, end: string) => day >= start && day <= end;

/** Meta campaign for a date: prospecting layer plus whichever burst is live. */
export function metaCampaign(date: Date): { campaign: string; term: (archetype: string) => string } {
  const day = date.toISOString().slice(0, 10);
  const bursts: [string, string, string][] = [
    ["drop2_fosco", "2026-11-13", "2026-11-19"],
    ["holiday_gifting", "2026-11-20", "2026-12-22"],
    ["running_resolutions", "2027-01-02", "2027-01-31"],
    ["drop3_spring", "2027-03-12", "2027-03-19"],
    ["drop4_summer", "2027-06-11", "2027-06-18"],
  ];
  // Share of Meta clicks that land on the burst rather than always-on.
  const live = bursts.find(([, s, e]) => inRange(day, s, e));
  if (live && Math.random() < 0.35) return { campaign: live[0], term: () => "broad_us" };

  if (day <= "2026-11-15") {
    // fall_launch: three ad sets, as designed in July.
    return {
      campaign: "fall_launch",
      term: (archetype) => (archetype === "runner" ? "int_running" : archetype === "hype" || archetype === "heritage" ? "int_sneakers" : "broad_us"),
    };
  }
  return { campaign: "ao_prospecting", term: () => "broad_us" };
}

/** Where each launch creative sends people (hub/content/campaigns.ts). */
export const creativeLanding: Record<number, { model: string; colorway?: string }> = {
  1: { model: "Arco" },
  2: { model: "Arco Muta", colorway: "Acid" },
  3: { model: "Arco" },
  4: { model: "Senda" },
  5: { model: "Pulso" },
};

/** The newsletter campaign for a date. */
export function emailCampaign(date: Date): string {
  const day = date.toISOString().slice(0, 10);
  if (inRange(day, "2026-11-24", "2026-11-30")) return "bf_early_access";
  return "weekly_edit";
}
