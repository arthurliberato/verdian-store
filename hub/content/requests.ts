// Request bank for stakeholder tickets.
//
// Each request is tagged with the data maturity it needs. "Anything goes":
// stakeholders ask for whatever their role would, whether or not the data
// exists yet — deciding what's possible, and pushing back, is part of the job.

export const maturityLevels = {
  1: { name: "GA4 + Looker", description: "Answerable today in GA4 reports or the GA4-based Looker Studio dashboard." },
  2: { name: "BigQuery export", description: "Needs SQL on the raw GA4 export (UNNEST, sessions, users)." },
  3: { name: "Modelled data", description: "Needs dbt models: clean sessions, orders, catalog joins." },
  4: { name: "Ground truth", description: "Needs the synthetic visitors' logs to compare with what GA4 recorded." },
  5: { name: "Inventory & margin", description: "Needs cost and stock data Verdian doesn't collect yet." },
  6: { name: "New tracking", description: "Needs events or data not tracked today — requires a tracking change first." },
} as const;

export type MaturityLevel = keyof typeof maturityLevels;

export type RequestCategory = "question" | "dashboard" | "investigation" | "tracking" | "data export";

export type RequestTemplate = {
  id: string;
  from: string[]; // people ids who might send it
  level: MaturityLevel;
  category: RequestCategory;
  title: string;
  body: string;
};

export const requestBank: RequestTemplate[] = [
  // ─── Leadership ───────────────────────────────────────────────────────
  { id: "ceo-weekly", from: ["valeria"], level: 1, category: "dashboard", title: "One-page weekly business snapshot", body: "I want one page I can open every Monday: visitors, orders, revenue, and whether we're up or down vs last week." },
  { id: "ceo-drop", from: ["valeria"], level: 2, category: "question", title: "How did the last drop actually do?", body: "Tell me how the last Street drop performed in its first 48 hours compared with a normal week. Traffic, orders, revenue." },
  { id: "ceo-line-mix", from: ["valeria", "hannah"], level: 3, category: "question", title: "Revenue split by line", body: "What share of revenue comes from Classic vs Performance vs Street, and is that mix shifting?" },
  { id: "ceo-returning", from: ["valeria", "tomas"], level: 2, category: "question", title: "Are people coming back?", body: "Of the people who bought from us, how many have come back to the site since? Do returning visitors buy more?" },
  { id: "ceo-arco-share", from: ["valeria", "hannah"], level: 3, category: "question", title: "Is Arco becoming the hero?", body: "The plan says the Arco franchise (Arco + Arco Muta) should be 35% of footwear pairs. Where are we? And is it selling because people want it, or just because we advertise it most?" },
  { id: "ceo-board", from: ["valeria"], level: 3, category: "dashboard", title: "Board metrics we can trust", body: "The board wants a monthly view of growth, conversion and repeat rate. It has to be numbers we won't have to walk back later." },

  // ─── Finance ──────────────────────────────────────────────────────────
  { id: "cfo-recon", from: ["daniel"], level: 2, category: "investigation", title: "GA4 revenue doesn't match orders", body: "GA4 shows a different revenue total than our order records for the same period. How big is the gap, and why does it exist?" },
  { id: "cfo-definitions", from: ["daniel"], level: 1, category: "question", title: "Define 'conversion rate' for me", body: "Three people have shown me three different conversion rates. I need one written definition we all use, and the current number under it." },
  { id: "cfo-margin", from: ["daniel", "hannah"], level: 5, category: "question", title: "Gross margin by model", body: "Which models make us the most money after cost of goods, not just the most revenue?" },
  { id: "cfo-cac", from: ["daniel", "amara"], level: 6, category: "question", title: "Customer acquisition cost by channel", body: "What does it cost us to acquire a customer on Meta vs Google vs email? I want CAC and payback period." },
  { id: "cfo-plan-reconcile", from: ["daniel"], level: 1, category: "investigation", title: "The marketing plan doesn't reconcile with the company plan", body: "Amara's acquisition model and the company plan disagree on sessions, revenue and CAC. Which assumptions drive the gap, and what does real data say so far?" },
  { id: "cfo-contribution", from: ["daniel"], level: 5, category: "question", title: "Contribution margin by order", body: "For last month's orders, what was left after product cost, shipping, packaging, payment fees and expected returns? Use the unit economics sheet, and show me the worst orders." },
  { id: "cfo-aov", from: ["daniel"], level: 1, category: "question", title: "Average order value trend", body: "What's our average order value, and is it moving? Break it out by device if that's easy." },
  { id: "cfo-dupes", from: ["daniel"], level: 2, category: "investigation", title: "Are we double counting purchases?", body: "I've heard analytics tools can count the same order twice. Can you check whether any transaction appears more than once?" },

  // ─── Marketing leadership ─────────────────────────────────────────────
  { id: "cmo-channel-mix", from: ["amara"], level: 1, category: "question", title: "Which channels bring buyers, not just visitors?", body: "Rank our channels by purchases and revenue, not traffic. I suspect some of our biggest traffic sources convert terribly." },
  { id: "cmo-budget", from: ["amara"], level: 6, category: "question", title: "Where should the next $10k go?", body: "If I had another $10k next month, which channel should get it? I need the reasoning, not just a ranking." },
  { id: "cmo-brand", from: ["amara"], level: 2, category: "question", title: "Is direct traffic growing?", body: "Direct and branded traffic is my proxy for brand strength. Is it growing week over week?" },
  { id: "cmo-early-access", from: ["amara", "tomas"], level: 6, category: "tracking", title: "Measure early access without a discount code", body: "Black Friday is subscriber early access, not a discount, so there's no code to count. How do we measure who used early access and whether it sold more than a discount would have?" },
  { id: "cmo-attribution", from: ["amara", "lucas"], level: 3, category: "investigation", title: "Last click is lying to us", body: "Meta gets little credit in last-click, but I think it starts most journeys. Can you show first-touch vs last-touch by channel?" },

  // ─── Performance marketing ────────────────────────────────────────────
  { id: "perf-creatives", from: ["lucas"], level: 1, category: "question", title: "Which Meta creative wins?", body: "Compare our 5 Meta creatives (utm_content creative_1..5) on sessions, purchases and revenue." },
  { id: "perf-creative-quality", from: ["lucas", "amara"], level: 3, category: "investigation", title: "Do creative 3 and 4 bring different people?", body: "Forget CTR — do visitors from creative_3 and creative_4 behave differently once on site? Lines browsed, pages per visit, buying on a later visit?" },
  { id: "perf-platform-gap", from: ["lucas"], level: 6, category: "investigation", title: "Meta says 40 purchases, GA4 says 12", body: "Ads Manager reports way more purchases than GA4 for the same campaign. Which one is right and how do I explain it to Amara?" },
  { id: "perf-arco-creative", from: ["lucas", "amara"], level: 2, category: "question", title: "Does the Arco creative sell Arcos?", body: "Valeria wants Arco in at least half the rotation. When people click an Arco creative, do they buy Arco, or something else? Break purchases down by utm_content and model." },
  { id: "perf-landing", from: ["lucas", "priya"], level: 1, category: "question", title: "Best landing page for paid traffic", body: "Paid traffic lands on product pages and on line pages. Which converts better?" },
  { id: "perf-roas", from: ["lucas"], level: 6, category: "dashboard", title: "Daily ROAS dashboard", body: "I want ROAS by campaign and creative, every morning, in one place." },
  { id: "perf-utm-audit", from: ["lucas"], level: 1, category: "investigation", title: "Are our UTMs clean?", body: "Can you check that all our campaign traffic is tagged properly and nothing shows up as unassigned or weird source names?" },

  // ─── E-commerce ───────────────────────────────────────────────────────
  { id: "ecom-funnel", from: ["priya"], level: 1, category: "dashboard", title: "Funnel by device", body: "Show the view item → add to cart → checkout → purchase funnel split by mobile and desktop. I think mobile checkout is leaking." },
  { id: "ecom-size", from: ["priya", "hannah"], level: 6, category: "tracking", title: "Track size selection", body: "I want to know which sizes people click, including sold-out ones. Can we start tracking that?" },
  { id: "ecom-checkout-drop", from: ["priya"], level: 2, category: "investigation", title: "Where exactly do people abandon checkout?", body: "Of the sessions that begin checkout, how many never purchase? Is it worse for first-time visitors?" },
  { id: "ecom-pdp", from: ["priya"], level: 3, category: "question", title: "Which product pages underperform?", body: "Find product pages with lots of views but few add-to-carts. That's my redesign shortlist." },
  { id: "ecom-colorway-switch", from: ["priya", "hannah"], level: 2, category: "question", title: "Do people switch colorways before buying?", body: "How often does someone view two colorways of the same model before adding to cart? Does it make buying more likely?" },
  { id: "ecom-size-baseline", from: ["priya"], level: 5, category: "investigation", title: "Baseline before the size guide ships", body: "Kai ships the size guide in November. I need a before/after: footwear return rate for size reasons by model, plus add-to-cart rate on footwear pages. Returns data is with Ben." },
  { id: "ecom-test", from: ["priya"], level: 6, category: "tracking", title: "Set up an A/B test on the product page", body: "I want to test a bigger 'Add to cart' button. What do we need in place to measure it properly?" },

  // ─── CRM ──────────────────────────────────────────────────────────────
  { id: "crm-newsletter", from: ["tomas"], level: 1, category: "question", title: "Newsletter revenue last month", body: "How much revenue came from newsletter traffic (utm_source=newsletter) last month, and how many orders?" },
  { id: "crm-repeat", from: ["tomas"], level: 3, category: "question", title: "Repeat purchase rate", body: "What share of customers buy a second time, and how many days after the first order?" },
  { id: "crm-segment", from: ["tomas"], level: 3, category: "data export", title: "List of cart abandoners to email", body: "Can you give me the people who added to cart in the last 7 days but didn't buy? I want to send a reminder." },
  { id: "crm-ltv", from: ["tomas", "daniel"], level: 3, category: "question", title: "Customer lifetime value by first channel", body: "Do customers acquired through email end up more valuable over time than those from Meta?" },
  { id: "crm-care-kit", from: ["tomas"], level: 3, category: "question", title: "Care kit attach rate", body: "The plan targets a 15% care kit attach rate on footwear orders. Where are we, and do orders that include the kit come from email more than other channels?" },
  { id: "crm-signups", from: ["tomas"], level: 6, category: "tracking", title: "Track newsletter sign-ups", body: "We have no idea how many people sign up to the newsletter on site. Can we measure it?" },

  // ─── Merchandising ────────────────────────────────────────────────────
  { id: "merch-bestsellers", from: ["hannah"], level: 1, category: "question", title: "Top 10 models this month", body: "Top 10 products by units sold and by revenue this month, with the colorway." },
  { id: "merch-view-to-buy", from: ["hannah"], level: 2, category: "question", title: "Most viewed but least bought", body: "Which colorways get looked at a lot but rarely bought? Those are my candidates to discount or drop." },
  { id: "merch-reorder-signal", from: ["hannah"], level: 5, category: "question", title: "Which models are running ahead of the buy?", body: "Reorder commits are due Dec 8 with a 12-week lead time. Which models and sizes are selling faster than the buy plan assumed? I'll take demand signals (views, add-to-carts) where sales are too thin." },
  { id: "merch-sell-through", from: ["hannah"], level: 5, category: "dashboard", title: "Sell-through by model and size", body: "For the reorder meeting I need sell-through by model, colorway and size." },
  { id: "merch-line-audience", from: ["hannah", "amara"], level: 3, category: "question", title: "Who buys Street vs Classic?", body: "Are Street buyers really younger, mobile, evening shoppers, and Classic buyers the opposite? Show me what the data says." },
  { id: "merch-apparel-attach", from: ["hannah"], level: 3, category: "question", title: "Do sneaker buyers add apparel?", body: "How often does an order with footwear also include apparel or accessories? Which combinations are most common?" },

  // ─── Tensions between teams (docs/research/operating-plan-research.md §8) ──
  { id: "t-real-revenue", from: ["daniel"], level: 2, category: "investigation", title: "Meta says $22k, the P&L says $19k", body: "Lucas's deck says Meta drove $22k in October. Our P&L says total net revenue was $19k. Explain in writing, with a definition for each number." },
  { id: "t-black-friday", from: ["valeria"], level: 1, category: "question", title: "What would a Black Friday discount get us?", body: "Competitors are doing 25% off for Black Friday. What would we gain? Quick number." },
  { id: "t-overstock-vs-winners", from: ["hannah", "lucas"], level: 3, category: "question", title: "Should ads push slow sellers or winners?", body: "Street Originals is at 20% sell-through and I want it in the ads. Lucas says it converts at half the rate. We both need the data before Thursday's trade meeting." },
  { id: "t-arco-vs-street", from: ["amara"], level: 3, category: "question", title: "Are we starving Street by over-indexing on Arco?", body: "Three of five creatives are Arco, but Street is supposed to reach 30% of revenue. Is the Arco rule costing us Street sales?" },
  { id: "t-popup", from: ["priya", "tomas"], level: 2, category: "investigation", title: "Does the popup hurt mobile conversion?", body: "The sign-up popup brings most of our new subscribers, but I think it hurts mobile conversion. Which is it, and what's the trade-off in dollars?" },
  { id: "t-sprint", from: ["priya"], level: 1, category: "question", title: "Three urgent tickets, one sprint", body: "Kai has one sprint. Tracking, the size guide and the CRM form are all marked urgent. Estimate the business impact of each so I can rank them." },
  { id: "t-returns-cost", from: ["daniel", "hannah"], level: 5, category: "question", title: "What do size returns cost us, by model?", body: "Ben says size returns are expensive. Before anyone suggests charging for return shipping, I want the cost of returns by model, including the resale loss." },
  { id: "t-email-claims", from: ["daniel"], level: 3, category: "investigation", title: "Email claims 25% of revenue. Is that real?", body: "The email platform says it drove 25% of revenue. That seems high. How much of it would have happened anyway?" },
  { id: "t-stockout-cost", from: ["hannah", "daniel"], level: 5, category: "question", title: "What does an Arco stockout cost?", body: "We'll run out of Arco 9–10.5 in January. Daniel says cash. I need the cost of the stockout in lost contribution to argue the reorder." },
  { id: "t-board-metric", from: ["valeria"], level: 1, category: "question", title: "Can the board deck lead with sessions?", body: "Orders look small. Can we show sessions instead? They look better." },
  { id: "t-sim-traffic", from: ["priya"], level: 2, category: "investigation", title: "Conversion dropped to 0.9% overnight", body: "Conversion fell to 0.9% overnight and nothing changed on the site. What happened?" },
];

/**
 * Twists: what's going on in each stakeholder's world right now. Crossing a
 * request with a twist is what makes a ticket feel like it came from a real
 * week at Verdian.
 */
export const twists: Record<string, string[]> = {
  valeria: [
    "Board meeting is on Thursday and I want this in the deck.",
    "An investor asked me this on a call yesterday and I didn't have a good answer.",
    "I'm deciding whether we do a second Street drop this quarter.",
    "We just passed our first full month since launch.",
  ],
  daniel: [
    "I'm closing the month and the numbers need to reconcile.",
    "Our accountant asked where the analytics revenue figure comes from.",
    "I'm building next quarter's budget and need a baseline.",
    "The Meta invoice came in higher than expected this month.",
  ],
  amara: [
    "I'm presenting the marketing plan to Valeria next week.",
    "The agency is pitching a bigger Meta budget and I'm not convinced.",
    "We're planning the fall campaign and need to pick our hero channel.",
    "Noor wants to kill two of the five creatives.",
  ],
  lucas: [
    "Budget call is tomorrow at 10.",
    "creative_4 CPMs doubled this week.",
    "Meta's algorithm keeps pushing spend to one creative and I don't know why.",
    "I want to scale the winning ad set before the weekend.",
  ],
  priya: [
    "Support got three complaints about checkout this week.",
    "We have a drop on Friday and I need the site ready.",
    "Kai has a sprint free next week for fixes.",
    "Mobile traffic just overtook desktop.",
  ],
  tomas: [
    "The newsletter goes out on Wednesday.",
    "I'm designing a win-back flow for lapsed customers.",
    "Amara asked me to prove email is worth the platform cost.",
    "We're about to launch a loyalty perk for repeat buyers.",
  ],
  hannah: [
    "The reorder meeting with the factory is next Tuesday.",
    "We're deciding which Classic colorways to discontinue.",
    "The Arco Muta Acid drop sold out suspiciously fast.",
    "I'm planning next season's range and need last season's winners.",
  ],
};

export const priorities = ["Low", "Normal", "High", "Urgent"] as const;
export type Priority = (typeof priorities)[number];
