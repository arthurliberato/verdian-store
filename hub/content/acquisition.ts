// Acquisition model: the bottom-up half of the marketing plan.
//
// Sessions per channel come out of written assumptions (budget, CPM, CTR,
// creator reach, list size, open and click rates) instead of being typed in.
// The finance plan was built top-down from the revenue target; comparing the
// two is the reconciliation Daniel asks for in DR-0008.
//
// Every number here is an assumption made in July 2026, before launch.

export type Month = {
  key: string; // YYYY-MM
  label: string;
  days: number;
  metaBudget: number;
  /** Cost per 1,000 Meta impressions — rises in Q4 when every retailer bids. */
  cpm: number;
  /** Link clicks ÷ impressions. Expected to improve after creative round 1. */
  ctr: number;
  creatorsSeeded: number;
  /** Seasonal effect on conversion (holiday gifting up, January down). */
  seasonality: number;
  /** Sessions a day the finance plan needs (top-down from $340k). */
  financeSessionsPerDay: number;
};

export const months: Month[] = [
  { key: "2026-10", label: "Oct", days: 31, metaBudget: 8000, cpm: 12, ctr: 0.01, creatorsSeeded: 15, seasonality: 1, financeSessionsPerDay: 150 },
  { key: "2026-11", label: "Nov", days: 30, metaBudget: 7000, cpm: 14, ctr: 0.011, creatorsSeeded: 12, seasonality: 1.2, financeSessionsPerDay: 280 },
  { key: "2026-12", label: "Dec", days: 31, metaBudget: 8000, cpm: 17, ctr: 0.011, creatorsSeeded: 10, seasonality: 1.25, financeSessionsPerDay: 450 },
  { key: "2027-01", label: "Jan", days: 31, metaBudget: 3500, cpm: 9, ctr: 0.012, creatorsSeeded: 6, seasonality: 0.9, financeSessionsPerDay: 240 },
  { key: "2027-02", label: "Feb", days: 28, metaBudget: 3500, cpm: 9, ctr: 0.012, creatorsSeeded: 6, seasonality: 0.95, financeSessionsPerDay: 240 },
  { key: "2027-03", label: "Mar", days: 31, metaBudget: 5000, cpm: 10, ctr: 0.012, creatorsSeeded: 10, seasonality: 1, financeSessionsPerDay: 300 },
  { key: "2027-04", label: "Apr", days: 30, metaBudget: 5000, cpm: 10, ctr: 0.012, creatorsSeeded: 6, seasonality: 1, financeSessionsPerDay: 280 },
  { key: "2027-05", label: "May", days: 31, metaBudget: 5000, cpm: 10, ctr: 0.012, creatorsSeeded: 6, seasonality: 1, financeSessionsPerDay: 280 },
  { key: "2027-06", label: "Jun", days: 30, metaBudget: 4000, cpm: 10, ctr: 0.012, creatorsSeeded: 10, seasonality: 1, financeSessionsPerDay: 310 },
  { key: "2027-07", label: "Jul", days: 31, metaBudget: 4000, cpm: 10, ctr: 0.012, creatorsSeeded: 6, seasonality: 0.95, financeSessionsPerDay: 280 },
  { key: "2027-08", label: "Aug", days: 31, metaBudget: 5000, cpm: 11, ctr: 0.012, creatorsSeeded: 6, seasonality: 1, financeSessionsPerDay: 300 },
  { key: "2027-09", label: "Sep", days: 30, metaBudget: 6000, cpm: 12, ctr: 0.012, creatorsSeeded: 8, seasonality: 1.05, financeSessionsPerDay: 360 },
];

export const assumptions = {
  meta: {
    landingRate: 0.75, // clicks that become a GA4 session (in-app browser, slow load, back button)
  },
  instagram: {
    postRate: 0.6, // seeded creators who actually post
    clicksPerPost: 60,
    landingRate: 0.8,
    brandAccountStart: 150, // sessions a month from Verdian's own account in October
    brandAccountGrowth: 0.15, // per month
  },
  email: {
    startingSubscribers: 600, // pre-launch waitlist
    signupRate: 0.01, // of all sessions — assumes the on-site form is live at launch (it isn't yet)
    sendsPerMonth: 4.3, // The Weekly Edit
    clickRate: 0.03, // clicks ÷ delivered
    flowClicksPerNewSubscriber: 0.25, // welcome flow
    landingRate: 0.9,
  },
  search: {
    brandedPerImpression: 0.0005, // branded searches a month per Meta impression
    nonBrandStartMonth: "2027-04", // SEO content programme — assumed, not yet staffed
    nonBrandSessions: [150, 250, 350, 450, 550, 650], // Apr → Sep
  },
  direct: {
    shareOfOther: 0.12, // word of mouth and typed-in returns, relative to all other sessions
  },
  conversion: { meta: 0.011, instagram: 0.014, newsletter: 0.03, search: 0.024, direct: 0.028 },
  aov: 170,
  newCustomerShare: 0.9,
  fixedMarketingPerMonth: (14000 + 12000 + 3000 + 3000) / 12, // creators, content, email platform, tools
};

export type Channel = "Meta Paid" | "Instagram Organic" | "Newsletter" | "Organic Search" | "Direct";
export const channels: Channel[] = ["Meta Paid", "Instagram Organic", "Newsletter", "Organic Search", "Direct"];

export type ModelRow = {
  month: Month;
  impressions: number;
  sessions: Record<Channel, number>;
  total: number;
  perDay: number;
  subscribers: number;
  orders: number;
  revenue: number;
  spend: number;
  cac: number;
};

const convKey: Record<Channel, keyof typeof assumptions.conversion> = {
  "Meta Paid": "meta",
  "Instagram Organic": "instagram",
  Newsletter: "newsletter",
  "Organic Search": "search",
  Direct: "direct",
};

export function runModel(): ModelRow[] {
  const a = assumptions;
  let subscribers = a.email.startingSubscribers;
  let brandAccount = a.instagram.brandAccountStart;
  const nonBrandStart = months.findIndex((m) => m.key === a.search.nonBrandStartMonth);

  return months.map((m, i) => {
    const impressions = (m.metaBudget / m.cpm) * 1000;
    const meta = impressions * m.ctr * a.meta.landingRate;
    const instagram = m.creatorsSeeded * a.instagram.postRate * a.instagram.clicksPerPost * a.instagram.landingRate + brandAccount;
    const search = impressions * a.search.brandedPerImpression + (i >= nonBrandStart ? a.search.nonBrandSessions[i - nonBrandStart] : 0);
    // Newsletter clicks depend on this month's list; sign-ups depend on this month's sessions.
    const preEmail = meta + instagram + search;
    const newSubsEstimate = preEmail * 1.2 * a.email.signupRate;
    const newsletter =
      (subscribers * a.email.clickRate * a.email.sendsPerMonth + newSubsEstimate * a.email.flowClicksPerNewSubscriber) * a.email.landingRate;
    const direct = (preEmail + newsletter) * a.direct.shareOfOther;

    const sessions: Record<Channel, number> = {
      "Meta Paid": meta,
      "Instagram Organic": instagram,
      Newsletter: newsletter,
      "Organic Search": search,
      Direct: direct,
    };
    const total = channels.reduce((s, c) => s + sessions[c], 0);
    const orders = channels.reduce((s, c) => s + sessions[c] * a.conversion[convKey[c]], 0) * m.seasonality;
    const spend = m.metaBudget + a.fixedMarketingPerMonth;
    const row: ModelRow = {
      month: m,
      impressions,
      sessions,
      total,
      perDay: total / m.days,
      subscribers,
      orders,
      revenue: orders * a.aov,
      spend,
      cac: spend / (orders * a.newCustomerShare),
    };
    subscribers += total * a.email.signupRate;
    brandAccount *= 1 + a.instagram.brandAccountGrowth;
    return row;
  });
}

export function modelTotals(rows = runModel()) {
  const sum = (f: (r: ModelRow) => number) => rows.reduce((s, r) => s + f(r), 0);
  const days = sum((r) => r.month.days);
  const byChannel = Object.fromEntries(channels.map((c) => [c, sum((r) => r.sessions[c])])) as Record<Channel, number>;
  const sessions = sum((r) => r.total);
  const orders = sum((r) => r.orders);
  const spend = sum((r) => r.spend);
  return {
    sessions,
    perDay: sessions / days,
    byChannel,
    orders,
    revenue: orders * assumptions.aov,
    spend,
    cac: spend / (orders * assumptions.newCustomerShare),
    endSubscribers: rows[rows.length - 1].subscribers + rows[rows.length - 1].total * assumptions.email.signupRate,
    financeSessions: months.reduce((s, m) => s + m.financeSessionsPerDay * m.days, 0),
  };
}
