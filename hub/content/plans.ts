// Year 1 plans: what each stakeholder committed to before the store existed.
//
// Written and approved in July 2026, two months before launch. Requests
// should trace back to something in here: a target someone is behind on, an
// initiative coming up, a tension between two plans. Many of the drivers
// (unit costs, returns, budgets, reorder deadlines) never show up in GA4.
//
// Year 1 runs October 2026 – September 2027 (launch was 27 Sep 2026).

export type MeasuredIn =
  | "GA4"
  | "BigQuery"
  | "Order system"
  | "Finance"
  | "Ad platforms"
  | "Email platform"
  | "Inventory"
  | "Not measured yet";

export type Target = {
  metric: string;
  target: string;
  measuredIn: MeasuredIn;
  note?: string;
};

export type Initiative = {
  name: string;
  /** ISO dates. `start` only = a single day. */
  start: string;
  end?: string;
  detail: string;
  /** How the owner mentions it in a request while it's close or running. */
  twist?: string;
};

export type PillarId = "arco" | "full-price" | "own-customer" | "street" | "efficient";

/** The five company pillars. Every department plan says how each one shapes it. */
export const pillars: { id: PillarId; name: string; short: string }[] = [
  { id: "arco", name: "Build the Arco franchise", short: "Arco franchise" },
  { id: "full-price", name: "Stay a full-price brand", short: "Full price" },
  { id: "own-customer", name: "Own the customer relationship", short: "Own the customer" },
  { id: "street", name: "Prove Street through drops", short: "Street drops" },
  { id: "efficient", name: "Grow efficiently (CAC ≤ $55, 20% contribution)", short: "Efficient growth" },
];

export type Plan = {
  owner: string; // people id
  /** How each company pillar shapes this department (department plans only). */
  shapedBy?: Record<PillarId, string>;
  title: string;
  summary: string;
  goals: string[];
  targets: Target[];
  initiatives: Initiative[];
  budget?: { item: string; amount: number; note?: string }[];
  /** Rules they won't bend, and where they pull against someone else. */
  constraints?: string[];
  /** What they want to learn this year — where requests come from. */
  openQuestions?: string[];
  /** Supporting documents inside the hub. */
  links?: { label: string; href: string; description: string }[];
};

export const planYear = { label: "Year 1", start: "2026-10-01", end: "2027-09-30", approved: "2026-07-15" };

/** The Arco platform: Arco and Arco Muta share one cupsole and last. */
export const arcoFranchise = ["ARC", "AMU"];

export const plans: Plan[] = [
  // ─── Company ──────────────────────────────────────────────────────────
  {
    owner: "valeria",
    title: "Company plan",
    summary:
      "Verdian raised a $2.0M seed round in March 2026 to prove one thing in Year 1: that a full-price, direct-to-consumer sneaker brand can grow efficiently enough to raise a Series A in autumn 2027. Everything else in these plans serves that story.",
    goals: [
      "Build the Arco franchise. Arco and Arco Muta share one cupsole and last, so tooling is paid once and they carry the best margins in the range (74% and 78%). One silhouette people recognise is also the fastest way to become a brand. Target: 35% of footwear pairs.",
      "Stay a full-price brand. No sitewide discounts, ever. Markdowns only in one end-of-season archive sale.",
      "Own the customer relationship: grow the email list and bring buyers back, because paid acquisition alone won't make the unit economics work.",
      "Prove the Street line through drops: four drops a year, Street at 30% of revenue.",
      "Grow efficiently: blended CAC at or below $55 and contribution margin after marketing of 20% by Q4, the two numbers the Series A investors will ask about first.",
    ],
    targets: [
      { metric: "Net revenue", target: "$340,000 in Year 1", measuredIn: "Order system", note: "GA4 revenue must reconcile within ±5%" },
      { metric: "Orders", target: "2,000", measuredIn: "Order system" },
      { metric: "Average order value", target: "$170", measuredIn: "Order system" },
      { metric: "Sessions", target: "~290 a day on average (150 at launch → 450 in holiday)", measuredIn: "GA4" },
      { metric: "Conversion rate (orders ÷ sessions)", target: "1.6% at launch → 2.2% by Q4", measuredIn: "GA4" },
      { metric: "Revenue by line", target: "Classic 45% · Performance 25% · Street 30%", measuredIn: "BigQuery" },
      { metric: "Arco franchise share of footwear pairs", target: "35%", measuredIn: "BigQuery", note: "Needs the catalog join" },
      { metric: "Product gross margin", target: "≥ 64%", measuredIn: "Finance", note: "Unit costs aren't in GA4" },
      { metric: "Customers who buy again within 12 months", target: "18%", measuredIn: "Not measured yet", note: "No customer IDs until accounts exist" },
    ],
    initiatives: [
      { name: "Launch week", start: "2026-09-27", end: "2026-10-04", detail: "Store live, Drop 1 (Arco Muta Acid), fall campaign starts.", twist: "We're in launch week and I want to know if the story is landing." },
      { name: "Operating rhythm starts", start: "2026-10-09", detail: "Weekly Leadership, Growth Stand-up, Creative Review, Trade Meeting and Monday Numbers begin.", twist: "We're starting proper weekly meetings and I want the numbers to be the same in all of them." },
      { name: "Board deck frozen", start: "2026-11-16", detail: "Numbers must match the metrics dictionary; Daniel signs off.", twist: "The board deck freezes on Nov 16." },
      { name: "Q1 board meeting", start: "2026-11-19", detail: "First board meeting with real sales data.", twist: "The board meets on Nov 19 and I want this in the deck." },
      { name: "Strategy offsite and reforecast", start: "2027-01-14", detail: "Keep, change or drop each pillar based on the first quarter.", twist: "We're re-planning the year at the January offsite." },
      { name: "Series A preparation", start: "2027-07-01", end: "2027-09-30", detail: "Data room: growth, retention, unit economics, cohort charts.", twist: "Investors will be in the data room soon and every number has to hold up." },
    ],
    constraints: [
      "Full-price policy. Amara wants a Black Friday moment; the compromise is early access for subscribers, not a discount.",
      "Arco first. Paid social should favour the Arco franchise even when another model gets a cheaper click, because the margin is better.",
      "Runway is 20 months. Nothing gets built that doesn't serve Year 1 targets.",
    ],
    openQuestions: [
      "Is the Arco franchise actually becoming the hero, or is it just what we advertise most?",
      "Do Street drops bring new customers or the same fans every time?",
      "Can we show investors a repeat-purchase curve by the end of Year 1?",
    ],
  },

  // ─── Finance ──────────────────────────────────────────────────────────
  {
    owner: "daniel",
    shapedBy: {
      arco: "Tracks margin by model, so the Arco push can be proven in dollars, not just pairs.",
      "full-price": "Budgets assume ≤ 10% of units at markdown; a discount would break the margin plan.",
      "own-customer": "Wants repeat rate and lifetime value in the investor story, so needs customer-level data.",
      street: "Has to fund four drops' inventory up front, before any of it sells.",
      efficient: "Owns the CAC and contribution targets and the monthly reconciliation behind them.",
    },
    title: "Finance plan",
    summary:
      "Keep the numbers trustworthy and the cash safe. The order system is the source of truth for revenue; analytics numbers are estimates that must be reconciled and explained.",
    goals: [
      "Close every month within 5 working days, with GA4 reconciled to the order system.",
      "Write one metrics dictionary so that everyone uses the same definitions.",
      "Know the contribution margin of every order: product cost, shipping, packaging, payment fees and returns.",
      "Make the first reorder decision without running out of cash before the spring drop.",
    ],
    targets: [
      { metric: "Product gross margin", target: "≥ 64%", measuredIn: "Finance" },
      { metric: "Contribution margin after fulfilment and fees", target: "≥ 45% of net revenue", measuredIn: "Finance" },
      { metric: "Contribution margin after marketing", target: "≥ 17% for the year, 20% in Q4", measuredIn: "Finance" },
      { metric: "Blended CAC (marketing spend ÷ new customers)", target: "≤ $55", measuredIn: "Not measured yet", note: "Needs spend data joined to new customers" },
      { metric: "GA4 revenue vs order system", target: "within ±5% every month", measuredIn: "BigQuery" },
      { metric: "Month-end close", target: "≤ 5 working days", measuredIn: "Finance" },
    ],
    initiatives: [
      { name: "Metrics dictionary", start: "2026-10-01", end: "2026-10-30", detail: "One written definition for revenue, orders, conversion rate, CAC, AOV and repeat rate.", twist: "I'm writing Verdian's metrics dictionary this month and need definitions nailed down." },
      { name: "Plan reconciliation memo", start: "2026-10-26", end: "2026-11-12", detail: "Bridge from the $340k plan to the acquisition model, with base, low and high scenarios for the board.", twist: "I need the reconciliation memo before Valeria picks her board stance on Nov 12." },
      { name: "October close", start: "2026-11-02", end: "2026-11-06", detail: "First full month after launch.", twist: "I'm closing October and the numbers need to reconcile." },
      { name: "Reorder cash plan", start: "2026-11-16", end: "2026-12-08", detail: "How much stock can be bought for spring without breaking runway.", twist: "I have to approve the spring reorder budget before Dec 8." },
      { name: "Q2 reforecast", start: "2027-01-05", end: "2027-01-20", detail: "Rebuild the year's forecast from real run-rates.", twist: "I'm rebuilding the forecast from actual run-rates." },
    ],
    budget: [
      { item: "Marketing (see Marketing plan)", amount: 96000 },
      { item: "Initial inventory buy", amount: 142000, note: "Plus reorders, approved case by case" },
      { item: "Fulfilment (3PL, shipping, packaging)", amount: 21400, note: "~$10.70 per order" },
      { item: "Payment fees", amount: 10500, note: "2.9% + $0.30 per order" },
      { item: "Software and hosting", amount: 9000 },
    ],
    constraints: [
      "Revenue is recognised from the order system, never from GA4.",
      "Free shipping costs Verdian $8.50 per order on average; packaging costs $1.20.",
      "Returns: footwear 16%, apparel 9%, accessories 4% of units; 85% of returned items can be resold.",
      "Every figure sent to him has a written definition, or it comes back.",
    ],
    openQuestions: [
      "What does a customer really cost on Meta once returns are taken out?",
      "Which models make money after returns, not just after cost of goods?",
      "How big is the GA4 vs orders gap, and is it stable?",
    ],
  },

  // ─── Marketing ────────────────────────────────────────────────────────
  {
    owner: "amara",
    shapedBy: {
      arco: "At least half of paid creative features the Arco franchise, even when another model gets cheaper clicks.",
      "full-price": "No discount-led campaigns; Black Friday becomes subscriber early access.",
      "own-customer": "Every paid campaign is also judged on email sign-ups, not only sales.",
      street: "Drop weeks get short Meta bursts and creator seeding.",
      efficient: "Holds the $96k budget and the ≤ $55 CAC line.",
    },
    title: "Marketing plan",
    summary:
      "Year 1 is Meta-led: paid social for reach, creators for credibility, email to keep the people we pay for. No paid search until there's brand demand to capture.",
    goals: [
      "Launch the brand with a five-creative framework on Meta, then scale what works.",
      "Build organic social through a creator seeding programme instead of paid influencers.",
      "Keep blended CAC at or below $55 while hitting the session targets.",
      "Hold the full-price line through holiday: early access, not discounts.",
    ],
    targets: [
      { metric: "Sessions by channel", target: "Meta Paid 70% · Direct 11% · Instagram Organic 10% · Organic Search 7% · Newsletter 2%", measuredIn: "GA4", note: "From the acquisition model; Verdian channels group" },
      { metric: "Sessions a day", target: "~194 on average (model)", measuredIn: "GA4", note: "The company plan needs ~290. See DR-0008" },
      { metric: "Direct + organic search sessions", target: "+10% month over month", measuredIn: "GA4", note: "Her proxy for brand demand" },
      { metric: "Blended CAC", target: "≤ $55", measuredIn: "Not measured yet" },
      { metric: "Meta spend vs plan", target: "within ±10% each month", measuredIn: "Ad platforms" },
    ],
    initiatives: [
      { name: "Fall launch campaign", start: "2026-09-27", end: "2026-11-15", detail: "Five creatives, same offer, different framing (campaign `fall_launch`).", twist: "We're in the middle of the fall launch campaign and I need to know what's working before I move budget." },
      { name: "Always-on plan for February–September", start: "2026-12-15", end: "2027-01-15", detail: "Every month gets a live campaign; evergreen shoot in late January.", twist: "I'm planning always-on for February to September and need to know which angles to keep." },
      { name: "Holiday gifting", start: "2026-11-20", end: "2026-12-22", detail: "Gift guides, accessories and apparel bundles, care kit as stocking filler.", twist: "Holiday gifting starts Nov 20 and I have to lock the channel plan." },
      { name: "Black Friday early access", start: "2026-11-24", end: "2026-11-30", detail: "Subscribers get 48 h early access to Drop 2 restock. No discount.", twist: "We're doing early access instead of a Black Friday discount and I have to prove it works." },
      { name: "Running resolutions", start: "2027-01-02", end: "2027-01-31", detail: "January push for the Performance line (Pulso, Impulso).", twist: "January is our Performance push and I need a baseline for it." },
      { name: "Paid search test", start: "2027-04-01", end: "2027-06-30", detail: "Only if branded search demand justifies it.", twist: "I'm deciding whether we're ready to test paid search." },
    ],
    budget: [
      { item: "Meta paid social", amount: 64000, note: "Oct 8k · Nov 7k · Dec 8k · Jan 3.5k · Feb 3.5k · Mar 5k · Apr 5k · May 5k · Jun 4k · Jul 4k · Aug 5k · Sep 6k" },
      { item: "Creator seeding (product + shipping)", amount: 14000 },
      { item: "Content and photography", amount: 12000 },
      { item: "Email platform", amount: 3000 },
      { item: "Tools", amount: 3000 },
    ],
    constraints: [
      "The CEO's full-price policy, even though the agency keeps pitching Black Friday discounts.",
      "Arco franchise first in paid creative; Street gets drop-week bursts only.",
    ],
    openQuestions: [
      "Does Meta start journeys that other channels get credit for?",
      "Which creative brings buyers, not just clicks?",
      "Is brand demand (direct and organic search) growing?",
    ],
    links: [
      { label: "Acquisition model", href: "/plans/acquisition", description: "Sessions per channel and month from written assumptions, compared with what the company plan needs." },
      { label: "Campaigns and creative", href: "/plans/campaigns", description: "Campaign calendar, the five launch creatives, and the UTM convention." },
    ],
  },

  // ─── Performance marketing ────────────────────────────────────────────
  {
    owner: "lucas",
    shapedBy: {
      arco: "Arco creatives stay in rotation even when a Street creative wins on cost per purchase.",
      "full-price": "No discount angles in ad copy, which makes CPA targets harder.",
      "own-customer": "Retargeting and lookalikes are built from site behaviour and buyers.",
      street: "Drop bursts break normal pacing; they're planned separately.",
      efficient: "Cost per purchase ≤ $45 and spend within ±10% of plan.",
    },
    title: "Paid social plan",
    summary: "Run Meta to a cost-per-purchase target, test creatives on a fixed rhythm, and pace spend to the monthly budget.",
    goals: [
      "Find the two best of the five launch creatives by the end of October.",
      "Add retargeting for cart abandoners from November.",
      "Keep the Arco franchise at least half of the paid creative rotation.",
    ],
    targets: [
      { metric: "Meta cost per purchase (platform)", target: "≤ $45", measuredIn: "Ad platforms" },
      { metric: "Meta ROAS (platform)", target: "≥ 3.0", measuredIn: "Ad platforms" },
      { metric: "Meta ROAS (GA4, last click)", target: "≥ 1.8", measuredIn: "GA4", note: "Expected to be well below the platform number" },
      { metric: "Spend pacing", target: "within ±10% of the monthly plan", measuredIn: "Ad platforms" },
      { metric: "Creative rotation", target: "Replace the weakest creative every 4 weeks", measuredIn: "Ad platforms" },
    ],
    initiatives: [
      { name: "Creative test, round 1", start: "2026-09-27", end: "2026-10-25", detail: "Five creatives, equal budget; keep the best two.", twist: "Round 1 of the creative test ends Oct 25 and I have to cut creatives." },
      { name: "Pixel and Conversions API", start: "2026-10-12", end: "2026-11-06", detail: "Browser and server purchase events, deduplicated; needed before retargeting can work.", twist: "Retargeting can't start until the pixel and Conversions API are live, and Kai needs a spec." },
      { name: "Always-on prospecting", start: "2026-11-16", end: "2027-09-30", detail: "fall_launch folds into one evergreen campaign with the round 1 winners." },
      { name: "Cart retargeting", start: "2026-11-01", end: "2026-11-30", detail: "7-day cart abandoners, separate budget line.", twist: "I'm setting up cart retargeting for November." },
      { name: "Holiday scaling", start: "2026-11-20", end: "2026-12-20", detail: "Scale winners into holiday, cap CPA at $55.", twist: "I want to scale the winners into holiday without blowing CPA." },
    ],
    links: [
      { label: "Campaigns and creative", href: "/plans/campaigns", description: "Ad sets, the five launch creatives and the UTM convention he tags with." },
    ],
    constraints: ["Budget is fixed by month; underspend is lost, overspend needs Amara's approval."],
    openQuestions: ["Why does Meta report so many more purchases than GA4?", "Does the Arco creative actually sell Arcos?"],
  },

  // ─── E-commerce ───────────────────────────────────────────────────────
  {
    owner: "priya",
    shapedBy: {
      arco: "Arco products get homepage placement and the first slots on line pages.",
      "full-price": "No sale banners or coupon fields; conversion has to come from the experience itself.",
      "own-customer": "Newsletter sign-up form on site; customer accounts in summer 2027.",
      street: "Drop days must survive traffic spikes and show sold-out sizes honestly.",
      efficient: "Every conversion point gained lowers CAC without spending more.",
    },
    title: "E-commerce plan",
    summary:
      "Turn traffic into orders: fix what leaks, make drops safe, and cut size-related returns. One developer (Kai), one sprint a month for store work.",
    goals: [
      "Raise conversion from 1.6% to 2.2% by Q4, mostly on mobile.",
      "Cut footwear returns with a size guide and fit notes. 60% of footwear returns are size-related, according to Operations.",
      "No downtime on drop days.",
      "Start a proper A/B testing programme in Q2.",
    ],
    targets: [
      { metric: "Conversion rate", target: "1.6% → 2.2%", measuredIn: "GA4" },
      { metric: "Mobile conversion vs desktop", target: "≥ 70% of desktop", measuredIn: "GA4" },
      { metric: "Add-to-cart rate (sessions with add_to_cart)", target: "≥ 7%", measuredIn: "GA4" },
      { metric: "Checkout completion (begin_checkout → purchase)", target: "≥ 55%", measuredIn: "GA4" },
      { metric: "Footwear return rate", target: "16% → 12% after the size guide", measuredIn: "Not measured yet", note: "Returns live with Operations" },
    ],
    initiatives: [
      { name: "Size guide and fit notes", start: "2026-10-19", end: "2026-12-01", detail: "Kai builds it; needs a before/after baseline.", twist: "Kai is building the size guide and I want a baseline before it ships." },
      { name: "Drop 2 readiness", start: "2026-11-13", detail: "Load, stock display, sold-out sizes.", twist: "Drop 2 goes live on Nov 13 and the site has to hold." },
      { name: "Mobile product page redesign", start: "2027-01-11", end: "2027-03-05", detail: "Size selector and Add to cart above the fold on mobile.", twist: "I'm scoping the mobile product page redesign." },
      { name: "A/B testing programme", start: "2027-02-01", detail: "First test: the redesigned mobile product page.", twist: "We're about to start A/B testing and I want to pick the first test well." },
      { name: "Customer accounts", start: "2027-06-01", end: "2027-08-31", detail: "Log in, order history, faster checkout for returning buyers.", twist: "Accounts are coming this summer and I want to know what to measure." },
    ],
    constraints: ["Kai has one sprint a month for store work; tracking changes compete with features for it."],
    openQuestions: ["Where exactly does mobile leak?", "Which product pages get looked at but don't sell?"],
  },

  // ─── CRM ──────────────────────────────────────────────────────────────
  {
    owner: "tomas",
    shapedBy: {
      arco: "Arco features in the welcome flow; new Arco colorways go to subscribers first.",
      "full-price": "Email rewards are early access and perks, never codes.",
      "own-customer": "Owns the list, the flows and the repeat-purchase target.",
      street: "Subscribers get drop early access, which is his main list-growth hook.",
      efficient: "Email revenue costs no media, so every email sale improves blended CAC.",
    },
    title: "CRM and retention plan",
    summary:
      "Turn the 600-person pre-launch waitlist into a 4,000-subscriber list, and make email the channel that brings buyers back at no media cost.",
    goals: [
      "Send The Weekly Edit every Wednesday (campaign `weekly_edit`).",
      "Launch welcome, post-purchase and win-back flows.",
      "Grow the list through an on-site sign-up form (which isn't tracked yet).",
      "Push the Sneaker Care Kit after every footwear order. It costs $9 to make and sells for $60.",
    ],
    targets: [
      { metric: "Email subscribers", target: "600 → 4,000 by Sep 2027", measuredIn: "Email platform" },
      { metric: "Newsletter share of revenue", target: "≥ 12%", measuredIn: "GA4", note: "Last click, utm_source=newsletter" },
      { metric: "Open rate / click rate", target: "40% / 3%", measuredIn: "Email platform" },
      { metric: "Care kit attach rate on footwear orders", target: "15%", measuredIn: "BigQuery" },
      { metric: "Repeat purchase within 12 months", target: "18%", measuredIn: "Not measured yet" },
    ],
    initiatives: [
      { name: "Sign-up form and popup", start: "2026-09-29", end: "2026-10-10", detail: "No discount: the reason to sign up is early access and drop alerts. Consent and source captured on every profile.", twist: "The sign-up form and popup go live by Oct 10 and I want to know how many people see them." },
      { name: "Welcome flow", start: "2026-09-27", end: "2026-10-31", detail: "Three emails over 10 days for new subscribers.", twist: "The welcome flow just went live and I want to know if it brings people back." },
      { name: "Post-purchase flow with care kit", start: "2026-11-02", end: "2026-12-15", detail: "Care tips plus a care kit offer 7 days after a footwear order.", twist: "I'm launching the post-purchase flow with the care kit cross-sell." },
      { name: "Win-back flow", start: "2027-02-01", detail: "For buyers with no order in 120 days.", twist: "I'm designing the win-back flow for lapsed buyers." },
      { name: "Loyalty perk", start: "2027-05-01", detail: "Early access to every drop for repeat buyers.", twist: "We're about to launch a loyalty perk for repeat buyers." },
    ],
    constraints: ["Priya doesn't want cross-sell clutter in checkout, so the care kit has to be sold by email."],
    openQuestions: ["How many newsletter clicks turn into orders, and are they new or returning buyers?", "Do care kit buyers come back sooner?"],
  },

  // ─── Merchandising ────────────────────────────────────────────────────
  {
    owner: "hannah",
    shapedBy: {
      arco: "Deepest buy and first reorder priority go to Arco and Arco Muta.",
      "full-price": "Only one markdown event (the January archive sale); the buy has to be right.",
      "own-customer": "Watches which colorways returning buyers pick, to plan the next range.",
      street: "Plans four drops with small, sell-out-sized quantities.",
      efficient: "Every unit left over is cash tied up; weeks of cover stay within 12–20.",
    },
    title: "Merchandising plan",
    summary:
      "Sell the initial buy at full price, make the first reorder on evidence, and run four Street drops. Factory lead time is 12 weeks, so every reorder is a bet placed three months early.",
    goals: [
      "Sell 70% of the initial buy at full price within six months.",
      "Make the Arco franchise 35% of footwear pairs sold.",
      "Run four Street drops, each selling at least 60% of its units in the first two weeks.",
      "Decide which Classic colorways to drop after the first season.",
    ],
    targets: [
      { metric: "Full-price sell-through of initial buy (6 months)", target: "70%", measuredIn: "Inventory" },
      { metric: "Arco franchise share of footwear pairs", target: "35%", measuredIn: "BigQuery" },
      { metric: "Drop sell-through (first 2 weeks)", target: "≥ 60%", measuredIn: "Inventory" },
      { metric: "Units sold at markdown", target: "≤ 10%", measuredIn: "Order system" },
      { metric: "Weeks of cover", target: "12–20 weeks per model", measuredIn: "Inventory" },
    ],
    initiatives: [
      { name: "Drop 1: Arco Muta Acid", start: "2026-09-27", detail: "Launch drop.", twist: "Arco Muta Acid was our launch drop and it sold suspiciously fast." },
      { name: "Drop 2: Fosco winter", start: "2026-11-13", detail: "Street drop timed for holiday.", twist: "Drop 2 lands Nov 13 and I need to size the allocation." },
      { name: "Reorder meeting #1", start: "2026-11-10", end: "2026-12-08", detail: "Commit spring stock by Dec 8; 12-week lead time.", twist: "The first reorder meeting is Dec 8, and with a 12-week lead time it decides spring stock." },
      { name: "Classic colorway review", start: "2027-01-18", detail: "Keep, reorder or discontinue each Classic colorway.", twist: "We're deciding which Classic colorways to discontinue." },
      { name: "Archive sale", start: "2027-01-20", end: "2027-01-31", detail: "The only markdown event of the year.", twist: "The archive sale is our only markdown and I need to pick what goes in." },
      { name: "Drop 3", start: "2027-03-12", detail: "Spring Street drop.", twist: "I'm planning Drop 3 for March." },
      { name: "Drop 4", start: "2027-06-11", detail: "Summer Street drop.", twist: "I'm planning Drop 4 for June." },
    ],
    budget: [{ item: "Initial inventory buy (landed cost)", amount: 142000, note: "Footwear 72% · Apparel 22% · Accessories 6%" }],
    constraints: ["Reorders need 10+ weeks of sell-through to be trusted, but the factory needs orders 12 weeks ahead."],
    openQuestions: ["Which colorways get looked at but don't sell?", "Are some sizes selling out while others sit?"],
  },
];

export function getPlan(owner: string) {
  return plans.find((p) => p.owner === owner);
}

/** Every initiative across all plans, in date order. */
export function calendar() {
  return plans
    .flatMap((p) => p.initiatives.map((i) => ({ ...i, owner: p.owner })))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Initiatives that are running now or start within `days` — used by the ticket generator. */
export function activeInitiatives(owner: string, now = new Date(), days = 21) {
  const today = now.toISOString().slice(0, 10);
  const soon = new Date(now.getTime() + days * 86_400_000).toISOString().slice(0, 10);
  return (getPlan(owner)?.initiatives ?? []).filter((i) => i.twist && i.start <= soon && (i.end ?? i.start) >= today);
}
