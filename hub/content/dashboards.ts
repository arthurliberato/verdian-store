// Dashboard hub: every dashboard in one place, with owner, audience and
// source — so people find the right one instead of passing links around.
// Set `url` when a dashboard is shared ("anyone with the link can view").

export type Dashboard = {
  name: string;
  status: "live" | "temporary" | "planned" | "retired";
  owner: string; // people id
  audience: string;
  source: string;
  refresh: string;
  description: string;
  url?: string;
};

export const dashboards: Dashboard[] = [
  {
    name: "Launch overview",
    status: "temporary",
    owner: "arthur",
    audience: "CEO, CFO, leadership",
    source: "GA4 (Looker Studio native connector)",
    refresh: "GA4 processing, 24–48 h delay",
    description: "Headline KPIs, daily trend, channels, purchase funnel and top products since launch. Replaced by the modelled dashboard once dbt marts exist.",
  },
  {
    name: "Marketing performance",
    status: "planned",
    owner: "arthur",
    audience: "CMO, Performance Marketing",
    source: "BigQuery → dbt marts",
    refresh: "Daily",
    description: "Channel and creative performance with first- vs last-touch views, built on modelled sessions.",
  },
  {
    name: "Merchandise & lines",
    status: "planned",
    owner: "arthur",
    audience: "Merchandising, CEO",
    source: "BigQuery → dbt marts + catalog",
    refresh: "Daily",
    description: "Sales by line, model and colorway, view-to-buy rates, and later sell-through once inventory data exists.",
  },
];
