// Role cards: what each person is responsible for, how they're measured,
// the tools and meetings they live in, and what they need from analytics.
// Source: docs/research/operating-plan-research.md (benchmarks cited there).

export type RoleCard = {
  responsibilities: string;
  kpis: string[];
  tools: string[];
  rituals: string[];
  needsFromAnalytics: string[];
  typicalRequests: string[];
  /** Things that can go wrong in this role: early warning → playbook. */
  risks?: string[];
};

export const roleCards: Record<string, RoleCard> = {
  valeria: {
    responsibilities: "Company plan, board and fundraising, final say on the pillars (full price, drops), hiring.",
    kpis: ["Net revenue vs the board-approved forecast", "Runway in months", "Street share of revenue", "Brand health", "Series A readiness"],
    tools: ["Weekly sales email", "Instagram insights", "Board deck"],
    rituals: ["Weekly Leadership (chair)", "Monthly Business Review (chair)", "Board meetings (Nov 19, then quarterly)", "Drop Go/No-Go"],
    needsFromAnalytics: ["One-line answer, one chart, then 'so what'", "A weekly email with five numbers and their trend"],
    typicalRequests: ["Was the Fosco drop a success? Yes or no, and what do we do next.", "Why does Instagram say 40k reach when sales are flat?"],
    risks: ["Pushes for a quick discount → model the margin cost, offer early access or bundles", "Changes things before tests finish → minimum run times", "Reads reach as sales → a reach → sessions → orders chart"],
  },
  daniel: {
    responsibilities: "P&L, cash, the monthly close, budgets and approvals, the reorder cash plan, board financials, sign-off on every definition. Fractional (2–3 days a week) until Series A prep.",
    kpis: ["Close in 5 business days", "Runway", "Gross margin ≥ 64%", "Contribution margin per order", "CAC payback on a contribution basis"],
    tools: ["Accounting system", "Order exports", "Ad invoices", "Bank"],
    rituals: ["Monthly Close (owner)", "Forecast Review (owner)", "Monthly Business Review", "Reorder Meeting"],
    needsFromAnalytics: ["Order-system extracts that tie to the bank", "Written definitions", "A bridge from Meta → GA4 → orders"],
    typicalRequests: ["October net revenue from the order system, refunds by processed date, with a written definition.", "Your CAC uses 'new customers': new by email or by card?"],
    risks: ["Distrusts analytics → order system in BigQuery is the revenue source of truth", "Runway squeeze before Series A → pre-agreed cut order"],
  },
  amara: {
    responsibilities: "The $96k marketing budget, channel mix, brand vs performance balance, final approval of campaigns and creative. Accountable for blended CAC.",
    kpis: ["Blended CAC (reset to ≤ $85 base, $70 stretch)", "New customers a month", "MER (net revenue ÷ marketing spend)", "Email list size", "Street share of revenue", "Creative pipeline health"],
    tools: ["Meta Ads Manager (view)", "Looker Studio: Marketing Weekly", "Email platform", "Social listening", "Budget tracker"],
    rituals: ["Growth Stand-up (chair)", "Monthly Marketing Review (chair)", "Weekly Leadership", "Drop Go/No-Go"],
    needsFromAnalytics: ["One weekly marketing scorecard", "Budget vs actual by channel", "Incrementality reads when she has to defend Meta", "A clear definition of 'new customer'"],
    typicalRequests: ["I need to defend keeping Meta at $8k in December. What happens to new customers if we cut to $5k? One slide.", "Is brand content doing anything, or should it all go to performance?"],
    risks: ["Budget cut after the board → cut order: brand content → creator fees → retargeting → prospecting last", "nCAC > $110 for 3 weeks → 2-week holdout test, move 20% to creators"],
  },
  lucas: {
    responsibilities: "Builds and runs the Meta account: always-on, retargeting and bursts; creative testing and scaling; UTM builder; spend pacing; briefs Jonah on iterations.",
    kpis: ["Platform cost per purchase ≤ $45", "Platform ROAS ≥ 3.0 (stretch; apparel median is 2.24)", "GA4 last-click ROAS ≥ 1.8", "New-customer share of purchases ≥ 75%", "Spend within ±5% of phasing", "≥ 2 new ads a week in Q4"],
    tools: ["Meta Ads Manager", "Events Manager", "UTM builder sheet", "Looker Studio: Paid Social Daily"],
    rituals: ["Daily 15-min spend check", "Growth Stand-up", "Creative Review (Wednesday)", "Monthly budget reallocation"],
    needsFromAnalytics: ["Daily Meta spend joined to BigQuery orders by campaign and ad", "New vs returning split", "Alert when pixel purchases drop", "A fatigue flag per ad"],
    typicalRequests: ["Need CPP by ad for last 7d vs GA4 last click today pls, Made to last looks cooked", "Can you pull nCAC by ad set, AM?"],
    risks: ["Ad account disabled → backup admin, shift to email and organic", "CPM spike in November → hold budget flat, lean on email", "Signal loss (Meta purchases ÷ orders < 60%) → decide on order-based nCAC"],
  },
  priya: {
    responsibilities: "Storefront, conversion, funnel and checkout, drop-day stability, size guide, mobile product page redesign, A/B testing from February, customer accounts in summer 2027, Kai's sprint priorities.",
    kpis: ["Conversion 1.6% → 2.2% (realistic Q4 exit 1.9–2.0%)", "Mobile conversion ≥ 70% of desktop", "Checkout completion ≥ 55% (average is 45%)", "Add-to-cart rate ≥ 5.4%", "100% uptime on drop days", "Mobile LCP < 2.5 s"],
    tools: ["GA4 funnels", "Store admin", "Support tickets", "Vercel analytics", "Error monitoring"],
    rituals: ["Growth Stand-up", "Monthly sprint planning with Kai", "Drop Go/No-Go", "Testing Council (from February)"],
    needsFromAnalytics: ["Funnel by device and source", "Size guide use → return rate", "A/B test design and readouts with power calculations", "A live drop-day dashboard"],
    typicalRequests: ["Hypothesis: seeing the size guide reduces size returns. Can we link exposure to returns at order level?", "What's the minimum detectable effect for a checkout test at our traffic?"],
    risks: ["At ~200 sessions a day, a conversion test needs 8+ months → test upstream metrics (add to cart, checkout start)", "Silent checkout bug → alert on completion rate and payment tickets"],
  },
  tomas: {
    responsibilities: "Email platform, list growth, The Weekly Edit, flows (welcome, abandoned cart and browse, post-purchase care kit, win-back, loyalty), subscriber early access, and creator-seeding logistics.",
    kpis: ["List 600 → 2,000–2,500 (reset from 4,000)", "Popup sign-up ≥ 2.5% of views", "Campaign click rate ≥ 1.7%", "Care kit attach rate 15%", "12-month repeat rate 18%", "Email ≥ 12% of revenue"],
    tools: ["Email platform (Klaviyo)", "Customer list export", "Newsletter calendar", "Seeding tracker"],
    rituals: ["Wednesday send", "Growth Stand-up", "Monthly Retention Review with Arthur"],
    needsFromAnalytics: ["New vs returning split", "Cohort repeat curves", "Flow revenue checked against orders", "List growth by source", "Bot sign-ups from the traffic generator filtered out"],
    typicalRequests: ["Hey! Could we see new vs returning for the Fosco drop, and did the waitlist people actually buy?", "What's the care kit attach rate for Arco buyers vs everyone?"],
    risks: ["< 40 new subscribers a week for 4 weeks → drop waitlists, giveaways, checkout opt-in", "Email claims more revenue than orders support → report holdout-based incremental revenue"],
  },
  noor: {
    responsibilities: "Brand identity, photography, campaign concepts, final brand approval of all paid and owned creative, shoot briefs, the style guide (including 'no discount language').",
    kpis: ["≥ 90% on-time delivery vs the creative calendar", "Ads delivered a month (Q4 10–12, low season 6–8)", "Share of spend on concepts < 60 days old", "Brand approval within 24 h"],
    tools: ["Figma", "Adobe CC", "Shared asset library (names = utm_content)", "Creative calendar"],
    rituals: ["Creative Review (chair, Wednesday)", "Monthly shoot planning", "Drop Go/No-Go"],
    needsFromAnalytics: ["A creative scorecard by concept and angle (craft, energy, value, comfort, performance), not just by ad", "Hook and hold rate", "Which products appear in winning ads vs the sales mix"],
    typicalRequests: ["Which angle wins for Street buyers specifically, craft or energy?", "Do lifestyle shots beat studio shots?"],
    risks: ["Becomes the approval bottleneck → Lucas approves iterations of an approved concept against a brand checklist"],
  },
  hannah: {
    responsibilities: "Assortment, buy plan, drops, sell-through, size curves, reorders, the colorway review, the archive sale, and the product master that feeds marketing and analytics.",
    kpis: ["Full-price sell-through 70% within 6 months", "Weeks of cover per model", "Stockouts on core sizes < 5%", "Arco franchise 35% of footwear pairs", "Drop sell-through at 14 days"],
    tools: ["Catalog / product master", "Buy plan spreadsheet", "Inventory reports"],
    rituals: ["Weekly Trade Meeting (chair)", "Reorder Meeting (Dec 8, then quarterly)", "Drop Go/No-Go", "Drop Retro", "Colorway Review (January)"],
    needsFromAnalytics: ["Sell-through by model, colorway and size, daily", "Demand for out-of-stock sizes (views of sold-out sizes)", "Return reasons by size", "Product views vs sales"],
    typicalRequests: ["Sell-through by size for Arco in Bone vs Black, and how many people viewed the 10.5 while it was out?"],
    risks: ["Arco core size under 4 weeks of cover → waitlist, shift ads to Arco Muta, air-freight quote", "Factory slip > 2 weeks → re-sequence drops"],
  },
  arthur: {
    responsibilities: "Tracking plan, GTM, GA4, BigQuery, dbt, Looker Studio, the metrics dictionary, campaign tagging QA, reconciliation, the request queue, and the forecasting model with Finance.",
    kpis: ["GA4 order-ID coverage ≥ 90%, Meta ≥ 85%", "BigQuery orders = P&L revenue ±1%", "Request SLA hit rate ≥ 90%", "Dashboards refreshed by 08:00 ET", "Zero untagged paid spend"],
    tools: ["GTM", "GA4", "BigQuery", "dbt", "Looker Studio", "Request queue"],
    rituals: ["Monday Numbers (owner, async)", "Weekly Data Quality check", "Monthly Close support", "Forecast Review", "Office hours"],
    needsFromAnalytics: [],
    typicalRequests: [],
    risks: ["Overloaded by ad-hoc asks → enforce the queue, self-serve dashboards", "Seen as the 'numbers police' → weekly office hours, public change log", "BigQuery cost creep → partitioned tables, scheduled queries only"],
  },
  ben: {
    responsibilities: "3PL, shipping, returns, inventory data (owner), factory follow-up with Hannah, packaging.",
    kpis: ["≥ 98% shipped within 1 business day", "Pick accuracy ≥ 99.5%", "Returns processed ≤ 5 days", "Shipping ≤ $8.50 and packaging ≤ $1.20 per order", "Inventory accuracy ≥ 99%"],
    tools: ["3PL portal", "Carrier dashboards", "Inventory reports"],
    rituals: ["Weekly Trade Meeting", "Weekly 3PL call", "Reorder Meeting", "Drop war room"],
    needsFromAnalytics: ["Daily inventory snapshot in BigQuery", "Return-reason dashboard", "Order forecast for 3PL staffing (drops, Black Friday)"],
    typicalRequests: ["Need a daily order forecast for Nov 13–19 so the 3PL can staff."],
  },
  sofia: {
    responsibilities: "Support (email and chat), return authorisation, Voice of Customer tagging and a monthly report, first alert for checkout and site issues.",
    kpis: ["First response < 4 business hours", "CSAT ≥ 90%", "Tickets per 100 orders", "100% of tickets tagged"],
    tools: ["Help desk", "Order lookup"],
    rituals: ["Incident channel (daily)", "Monthly VoC report into the Business Review", "Drop war room"],
    needsFromAnalytics: ["Tickets joined to orders", "Contact-rate trend", "Alert when checkout or payment tags spike"],
    typicalRequests: ["Three people said today the payment button did nothing on iPhone. Is it just them?"],
  },
  kai: {
    responsibilities: "The Next.js storefront on Vercel, the data layer, integrations (email, payments, 3PL, Meta Conversions API), performance, drop-day engineering.",
    kpis: ["≥ 80% of sprint delivered", "P1 incidents fixed in < 2 h", "100% data-layer spec compliance on release", "Core Web Vitals pass"],
    tools: ["Next.js", "Vercel", "GitHub"],
    rituals: ["Monthly sprint planning", "Tracking change review with Arthur", "Drop war room"],
    needsFromAnalytics: ["A versioned data-layer spec", "QA checklists", "Alerts when events drop"],
    typicalRequests: ["Is it OK if I rename item_variant in Thursday's release? (Answer: only through the tracking change process.)"],
    risks: ["Single point of failure on drop days → agency on call, runbook, second deploy key with Priya"],
  },
  mila: {
    responsibilities: "Daily Instagram and TikTok posting, community management, drop-week content and live coverage, creator shortlist and outreach with Tomás, weekly social-listening note for Amara.",
    kpis: ["5 posts a week", "Every link in bio UTM-tagged", "30 creators shortlisted a quarter", "Weekly listening note every Friday"],
    tools: ["Instagram Insights", "Canva", "CapCut", "Later", "Creator tracker"],
    rituals: ["Growth Stand-up", "Creative Review", "Drop war room"],
    needsFromAnalytics: ["Which posts and creators drive sessions and orders, not just reach", "Link-in-bio tagging checks"],
    typicalRequests: ["Did the drop-day stories actually send people to the site, or just get views?"],
  },
  jonah: {
    responsibilities: "2–4 iterations a week on live winning ads, creator content edits for Partnership Ads, drop teasers, all in three sizes and named by the UTM convention.",
    kpis: ["Delivered within 48 h of brief", "Every ad in 9:16, 4:5 and 1:1", "Usage rights confirmed before editing creator content"],
    tools: ["Premiere / CapCut", "Hook library", "Shared asset library"],
    rituals: ["Creative Review"],
    needsFromAnalytics: ["Hook rate, hold rate and CTR by creative", "The weekly creative scorecard"],
    typicalRequests: ["Which first-3-second hooks are holding people best this month?"],
  },
  rhea: {
    responsibilities: "Close checklist days 1–3: transaction categorisation, payment payout reconciliation, 3PL invoice checks, ad-spend accruals.",
    kpis: ["Payment payouts reconcile to bank ±$0", "Close ready by business day 3", "Any unexplained variance > $250 escalated"],
    tools: ["Accounting system", "Bank", "Payment processor", "Invoices"],
    rituals: ["Monthly Close"],
    needsFromAnalytics: ["Arthur's monthly order extract (gross, refunds, net) by processed date"],
    typicalRequests: ["The order extract and the payment payouts differ by $312 for October. Which orders?"],
  },
};
