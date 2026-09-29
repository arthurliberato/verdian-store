// Operating model: how Verdian runs week to week. Meetings, who decides
// what (RACI), escalation rules, the data request queue and the risk
// register. Source: docs/research/operating-plan-research.md.

export type Meeting = {
  name: string;
  cadence: string;
  owner: string; // people id
  attendees: string[]; // people ids
  inputs: string;
  decides: string;
};

export const meetings: Meeting[] = [
  { name: "Monday Numbers", cadence: "Weekly, Monday 09:00 (async)", owner: "arthur", attendees: ["valeria", "daniel", "amara", "priya", "hannah", "lucas", "tomas", "noor", "ben"], inputs: "BigQuery dashboards", decides: "Nothing. It's the one weekly truth: revenue, orders, sessions, conversion, nCAC, list adds, top 5 SKUs." },
  { name: "Weekly Leadership", cadence: "Monday 11:00, 45 min", owner: "valeria", attendees: ["daniel", "amara", "priya", "hannah", "ben"], inputs: "Monday Numbers", decides: "Priorities, escalations, hiring" },
  { name: "Growth Stand-up", cadence: "Monday 14:00, 30 min", owner: "amara", attendees: ["lucas", "tomas", "noor", "mila", "arthur", "priya"], inputs: "Paid, CRM and social dashboards", decides: "This week's spend moves, email plan, content" },
  { name: "Creative Review", cadence: "Wednesday 10:00, 45 min", owner: "noor", attendees: ["lucas", "jonah", "mila", "arthur"], inputs: "Creative scorecard", decides: "Keep, kill or iterate each ad; next briefs" },
  { name: "Weekly Trade Meeting", cadence: "Thursday 10:00, 30 min", owner: "hannah", attendees: ["ben", "amara", "lucas", "arthur", "priya"], inputs: "Sell-through, weeks of cover", decides: "What to push or hold in ads and email; low-stock suppressions" },
  { name: "Data Quality Check", cadence: "Weekly, Tuesday", owner: "arthur", attendees: ["priya", "lucas", "daniel"], inputs: "Monitoring queries", decides: "Open data incidents" },
  { name: "Monthly Close", cadence: "Business days 1–5", owner: "daniel", attendees: ["rhea", "arthur", "ben"], inputs: "Ledger, BigQuery orders", decides: "The month's P&L" },
  { name: "Monthly Marketing Review", cadence: "Business day 6", owner: "amara", attendees: ["lucas", "tomas", "noor", "mila", "arthur", "daniel"], inputs: "Channel pack", decides: "Next month's budget split" },
  { name: "Monthly Business Review", cadence: "Business day 7, 90 min", owner: "valeria", attendees: ["daniel", "amara", "priya", "hannah", "ben", "arthur"], inputs: "P&L, KPIs, Voice of Customer report", decides: "Reforecast triggers, budget moves" },
  { name: "Forecast Review", cadence: "Monthly (business day 8) and when a trigger fires", owner: "daniel", attendees: ["arthur", "amara", "hannah"], inputs: "Actuals vs scenarios", decides: "Update the rolling 12-month forecast" },
  { name: "Drop Go/No-Go", cadence: "2 days before each drop", owner: "valeria", attendees: ["hannah", "amara", "priya", "kai", "ben", "arthur"], inputs: "Readiness checklist", decides: "Go or no-go" },
  { name: "Drop Retro", cadence: "14 days after each drop", owner: "hannah", attendees: ["amara", "noor", "lucas", "tomas", "priya", "arthur"], inputs: "Drop read-out", decides: "Lessons, reorder signal" },
  { name: "Testing Council", cadence: "Every two weeks from February", owner: "priya", attendees: ["arthur", "kai", "noor"], inputs: "Test backlog", decides: "Next tests; readouts" },
  { name: "Quarterly Planning", cadence: "January, April, July", owner: "valeria", attendees: ["daniel", "amara", "priya", "hannah", "ben"], inputs: "Quarterly review packs", decides: "Targets, budgets, hires" },
  { name: "Board meeting", cadence: "Nov 19, then quarterly", owner: "valeria", attendees: ["daniel"], inputs: "Board deck", decides: "Plan approval" },
];

/** R = Responsible, A = Accountable (one per step), C = Consulted, I = Informed. */
export type Raci = { name: string; people: string[]; steps: { step: string; roles: string[] }[]; note?: string };

export const racis: Raci[] = [
  {
    name: "Launching a campaign",
    people: ["amara", "lucas", "noor", "jonah", "tomas", "arthur", "priya", "hannah", "daniel"],
    steps: [
      { step: "Objective and budget", roles: ["A", "R", "C", "–", "C", "C", "–", "C", "C"] },
      { step: "Creative brief", roles: ["C", "R", "A", "C", "C", "C", "–", "C", "–"] },
      { step: "Asset production", roles: ["I", "C", "A", "R", "–", "–", "–", "–", "–"] },
      { step: "UTMs and naming", roles: ["I", "R", "–", "I", "R", "A", "–", "–", "–"] },
      { step: "Landing page ready", roles: ["I", "C", "C", "–", "–", "C", "A/R", "C", "–"] },
      { step: "Stock check", roles: ["I", "C", "–", "–", "–", "–", "–", "A/R", "–"] },
      { step: "Launch QA (links, pixel, UTMs)", roles: ["I", "R", "–", "–", "–", "A", "C", "–", "–"] },
      { step: "Go live", roles: ["A", "R", "I", "–", "I", "I", "I", "I", "I"] },
      { step: "72-hour read, keep or kill", roles: ["C", "A/R", "C", "I", "–", "R", "–", "I", "–"] },
    ],
  },
  {
    name: "Product drop",
    people: ["valeria", "hannah", "amara", "noor", "lucas", "tomas", "priya", "kai", "ben", "arthur"],
    steps: [
      { step: "Drop plan: units, sizes, price (T−10 weeks)", roles: ["C", "A/R", "C", "C", "–", "–", "C", "–", "C", "C"] },
      { step: "Marketing plan (T−6 weeks)", roles: ["I", "C", "A", "R", "R", "R", "C", "–", "–", "C"] },
      { step: "Tracking and landing page (T−3 weeks)", roles: ["–", "C", "–", "–", "C", "C", "A", "R", "–", "R"] },
      { step: "Load test and runbook (T−10 days)", roles: ["–", "–", "–", "–", "–", "–", "A", "R", "C", "C"] },
      { step: "Go/No-Go (T−2 days)", roles: ["A", "R", "R", "C", "C", "C", "R", "R", "R", "R"] },
      { step: "Drop-day war room", roles: ["I", "R", "C", "–", "R", "R", "A", "R", "R", "R"] },
      { step: "Read-out at T+7 and T+14", roles: ["I", "A", "C", "C", "C", "C", "C", "–", "–", "R"] },
    ],
  },
  {
    name: "Tracking change",
    people: ["valeria", "arthur", "kai", "priya", "lucas", "daniel"],
    steps: [
      { step: "Ticket with the business question", roles: ["R (requester)", "A", "I", "I", "I", "–"] },
      { step: "Spec: event, parameters, dictionary impact", roles: ["C", "A/R", "C", "C", "C", "C"] },
      { step: "Implementation on staging", roles: ["–", "C", "A/R", "I", "–", "–"] },
      { step: "QA: DebugView, BigQuery, Meta test events", roles: ["–", "A/R", "C", "–", "C", "–"] },
      { step: "Release and changelog entry", roles: ["I", "A", "R", "I", "I", "I"] },
      { step: "7-day post-release check", roles: ["–", "A/R", "C", "–", "–", "–"] },
    ],
    note: "The first column is whoever asked. Anything touching revenue, order IDs or consent needs Daniel's sign-off, and nothing ships within 72 hours of a drop or campaign launch.",
  },
  {
    name: "Monthly close",
    people: ["rhea", "daniel", "arthur", "ben", "amara", "valeria"],
    steps: [
      { step: "BD1: bank, payment processor, 3PL invoices", roles: ["R", "A", "–", "C", "–", "–"] },
      { step: "BD1: order extract (gross, refunds, net)", roles: ["–", "A", "R", "–", "–", "–"] },
      { step: "BD2: ad-spend accrual by platform", roles: ["R", "A", "C", "–", "C", "–"] },
      { step: "BD2: inventory valuation", roles: ["R", "A", "–", "R", "–", "–"] },
      { step: "BD3: BigQuery ↔ ledger reconciliation (±1%)", roles: ["R", "A", "R", "–", "–", "–"] },
      { step: "BD4: contribution margin per order, CAC", roles: ["C", "A", "R", "–", "C", "–"] },
      { step: "BD5: P&L issued with variance commentary", roles: ["C", "A/R", "C", "C", "C", "I"] },
    ],
  },
  {
    name: "Reorder decision",
    people: ["hannah", "ben", "daniel", "arthur", "amara", "valeria"],
    steps: [
      { step: "Sell-through and size curve pack", roles: ["C", "C", "I", "A/R", "–", "–"] },
      { step: "Demand forecast (base, low, high)", roles: ["A/R", "C", "C", "R", "C", "–"] },
      { step: "Supplier minimums, lead time, landed cost", roles: ["R", "A", "C", "–", "–", "–"] },
      { step: "Cash impact and runway", roles: ["C", "C", "A/R", "–", "–", "I"] },
      { step: "Decision", roles: ["R", "C", "C", "C", "C", "A"] },
    ],
  },
  {
    name: "Creative testing round",
    people: ["lucas", "noor", "jonah", "arthur", "amara"],
    steps: [
      { step: "Hypothesis and test design", roles: ["A/R", "C", "–", "C", "I"] },
      { step: "Assets", roles: ["C", "A", "R", "–", "–"] },
      { step: "Readout (testing rules)", roles: ["R", "C", "I", "R", "I"] },
      { step: "Kill or scale", roles: ["A", "C", "I", "C", "I"] },
      { step: "New concept or iteration", roles: ["C", "A", "C", "C", "I"] },
    ],
  },
];

export const budgetRules: { move: string; decides: string; consulted: string; informed: string }[] = [
  { move: "Within Meta, up to 20% between campaigns in a month", decides: "lucas", consulted: "Arthur", informed: "Amara" },
  { move: "Between channels, up to $2k a month within the total", decides: "amara", consulted: "Daniel, Arthur", informed: "Valeria" },
  { move: "Moving spend between months, up to $3k", decides: "daniel", consulted: "Amara", informed: "Valeria" },
  { move: "Any increase in total marketing, or a cut above 15%", decides: "valeria", consulted: "Daniel, Amara", informed: "Board if above $10k" },
];

export const incidentLevels: { level: string; definition: string; responder: string; accountable: string; response: string; comms: string }[] = [
  { level: "P1", definition: "Site or checkout down, payments failing", responder: "Kai (+ agency)", accountable: "priya", response: "15 min", comms: "Sofia posts status; Lucas pauses ads; Tomás holds emails" },
  { level: "P2", definition: "Oversell, wrong prices, broken sizes", responder: "Kai, Hannah", accountable: "priya", response: "1 h", comms: "Sofia uses a prepared reply" },
  { level: "P3", definition: "Tracking broken, reports wrong", responder: "Arthur", accountable: "arthur", response: "4 h", comms: "Arthur posts a note in #data" },
];

export const requestQueue = {
  intake: "One intake form (Slack /data-request routes into it): requester, the decision it supports, deadline, metric from the dictionary, format.",
  levels: [
    { level: "P0", meaning: "Incident or board", sla: "Same day" },
    { level: "P1", meaning: "Decision this week", sla: "2 business days" },
    { level: "P2", meaning: "Analysis", sla: "5 business days" },
    { level: "P3", meaning: "Nice to have", sla: "Backlog, reviewed Mondays" },
  ],
  rules: [
    "At most 2 open P1 requests per requester.",
    "Amara ranks conflicts between marketing requests; Valeria ranks cross-team ones.",
    "Every answer starts with a one-line conclusion, then a chart, then what to do.",
  ],
};

export const forecastTriggers = [
  "Trailing 4-week revenue ±20% vs the base case",
  "nCAC above $110 for 3 weeks",
  "A drop's 14-day sell-through below 40% or above 85%",
  "Any Arco core size (8–11) out of stock for more than 7 days",
  "Meta CPM above $20 for 2 weeks",
  "Cash runway below 15 months",
];

export type Risk = { id: string; risk: string; likelihood: "H" | "M" | "L"; impact: "H" | "M" | "L"; indicator: string; threshold: string; playbook: string; owner: string };

export const risks: Risk[] = [
  { id: "R1", risk: "Drop-day outage", likelihood: "M", impact: "H", indicator: "Load test failures, error rate, latency", threshold: "Error rate > 2% or checkout down > 5 min", playbook: "Static waitlist page, pause ads, hold emails, status post, agency on call", owner: "kai" },
  { id: "R2", risk: "Silent checkout bug", likelihood: "M", impact: "H", indicator: "Checkout start → purchase ratio, payment tickets", threshold: "Completion −25% vs 7-day average for 4 h, or 3 tickets in 2 h", playbook: "Roll back the last release; test on iOS Safari", owner: "priya" },
  { id: "R3", risk: "Tracking break", likelihood: "H", impact: "M", indicator: "GA4 order-ID coverage, event volume", threshold: "Coverage < 85% for a day; any event −50% day over day", playbook: "Freeze decisions on GA4, use BigQuery orders, fix through the change process", owner: "arthur" },
  { id: "R5", risk: "Meta account disabled", likelihood: "M", impact: "H", indicator: "Policy emails", threshold: "Spend paused > 4 h", playbook: "Appeal; backup admin; shift to email, organic and creators", owner: "lucas" },
  { id: "R6", risk: "iOS and consent attribution loss", likelihood: "H", impact: "M", indicator: "Meta-reported purchases ÷ orders", threshold: "< 60%", playbook: "Check Conversions API health; decide on order-based nCAC; incrementality tests", owner: "arthur" },
  { id: "R7", risk: "Creative fatigue", likelihood: "H", impact: "M", indicator: "Fatigue flags", threshold: "50% of spend on flagged ads", playbook: "Emergency iterations from Jonah within 48 h", owner: "lucas" },
  { id: "R8", risk: "Arco stockout or size-curve miss", likelihood: "M", impact: "H", indicator: "Weeks of cover by size", threshold: "Core size < 4 weeks of cover", playbook: "Waitlist and back-in-stock flow; shift ads; air-freight quote", owner: "hannah" },
  { id: "R11", risk: "CAC blowout", likelihood: "M", impact: "H", indicator: "Weekly nCAC", threshold: "> $110 for 3 weeks", playbook: "Cut to evergreen winners; shift to creators and email; reforecast", owner: "amara" },
  { id: "R12", risk: "Low list growth", likelihood: "H", impact: "M", indicator: "Weekly new subscribers", threshold: "< 40 a week for 4 weeks", playbook: "Waitlists, giveaways, checkout opt-in", owner: "tomas" },
  { id: "R13", risk: "Creator seeding under-delivers", likelihood: "H", impact: "L", indicator: "Post rate", threshold: "< 25% after 60 days", playbook: "Fewer, better-fit creators; small fees or affiliate links", owner: "tomas" },
  { id: "R15", risk: "Runway pressure before Series A", likelihood: "M", impact: "H", indicator: "Monthly burn vs plan", threshold: "Runway < 15 months", playbook: "Pre-agreed cut order; defer accounts build; smaller reorder", owner: "daniel" },
  { id: "R16", risk: "Founder pushes discounts", likelihood: "M", impact: "M", indicator: "'Quick promo' asks", threshold: "Any sitewide promo", playbook: "Non-discount alternatives; model the margin cost", owner: "amara" },
  { id: "R17", risk: "Single web developer bottleneck", likelihood: "H", impact: "H", indicator: "Sprint overrun, ticket backlog", threshold: "> 2 P1/P2 queued", playbook: "Agency block; freeze non-critical work", owner: "priya" },
  { id: "R22", risk: "Simulated traffic contaminates data", likelihood: "H", impact: "M", indicator: "Sessions without engagement, user-agent patterns", threshold: "> 10% of sessions", playbook: "Flag in the data layer; filter in dbt; separate 'sim' views", owner: "arthur" },
];

/** Questions the research couldn't answer from the brief, with the working default. */
export const openQuestions: { id: string; question: string; workingDefault: string }[] = [
  { id: "M1", question: "Are all 12 original staff full-time? 12 FTE at ~$8k a month would burn most of the $100k monthly runway.", workingDefault: "Daniel is fractional; everyone else is full-time on founder-stage salaries. Revisit at the January offsite." },
  { id: "M3", question: "Does 'net revenue' include shipping and exclude returns?", workingDefault: "Excludes returns (refunds by processed date); shipping is free so there's none to include." },
  { id: "M4", question: "Where do contractor costs come from?", workingDefault: "Jonah from the $12k content budget; Mila from a new $3k/month line Daniel must approve; Rhea from finance software and services." },
  { id: "M5", question: "Which email platform?", workingDefault: "Klaviyo." },
  { id: "M8", question: "Is simulated traffic flagged in the data layer?", workingDefault: "Not yet. It must be before any benchmark comparison means anything." },
  { id: "M11", question: "Will the board accept a lower target, or fund more spend?", workingDefault: "Unknown until Nov 19. This is what DR-0008 prepares." },
];
