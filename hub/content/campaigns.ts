// Campaigns and creative: what marketing actually runs, how it's tagged,
// and what each creative says. Owned by Amara (strategy), Lucas (Meta),
// Noor (creative) and Tomás (email). The UTM convention is what makes all of
// this readable in GA4 — anything not tagged this way lands in the wrong
// channel or in "(not set)".

export type UtmRule = { param: string; rule: string; examples: string[] };

export const utmConvention: UtmRule[] = [
  { param: "utm_source", rule: "The platform, lowercase.", examples: ["meta", "newsletter", "instagram"] },
  { param: "utm_medium", rule: "The type of traffic. Must match the channel group rules.", examples: ["paid_social", "email", "creator"] },
  { param: "utm_campaign", rule: "Campaign ID from the list below, snake_case, never reused.", examples: ["fall_launch", "holiday_gifting", "weekly_edit"] },
  { param: "utm_content", rule: "The creative (Meta) or the block that was clicked (email).", examples: ["creative_1", "hero", "product_grid"] },
  { param: "utm_term", rule: "The audience / ad set (Meta only).", examples: ["broad_us", "int_sneakers", "rt_cart_7d"] },
];

export type Creative = {
  id: string; // utm_content
  name: string;
  product: string;
  framing: string;
  tone: string;
  visual: string;
  headline: string;
  /** Who it's expected to pull, in the traffic generator's archetypes. */
  expectedAudience: string;
};

/**
 * The five fall launch creatives. Same offer and same core message on all
 * five ("Heritage quality without the heritage markup", free shipping and
 * 30-day returns); only framing, tone and visual style change, so a creative
 * comparison measures the creative and nothing else. Three of five feature
 * the Arco franchise (company pillar: Arco first).
 */
export const launchCreatives: Creative[] = [
  {
    id: "creative_1",
    name: "Made to last",
    product: "Arco (Classic)",
    framing: "Durability and craft",
    tone: "Calm, understated",
    visual: "Slow close-ups of stitching and the cupsole in natural light",
    headline: "Built like they used to. Priced like they should be.",
    expectedAudience: "Heritage buyers",
  },
  {
    id: "creative_2",
    name: "Move",
    product: "Arco Muta Acid (Street)",
    framing: "Energy and self-expression",
    tone: "Bold, fast",
    visual: "Handheld night video, city streets, flash photography",
    headline: "The classic, remixed. Go.",
    expectedAudience: "Hype buyers, some runners",
  },
  {
    id: "creative_3",
    name: "Fair price",
    product: "Arco (Classic)",
    framing: "Value and price honesty",
    tone: "Direct, a little provocative",
    visual: "Clean graphic: \"$140. Not $240.\" beside the shoe",
    headline: "Heritage quality without the heritage markup.",
    expectedAudience: "Window shoppers, price-sensitive hype buyers",
  },
  {
    id: "creative_4",
    name: "All-day comfort",
    product: "Senda (Classic)",
    framing: "Comfort in everyday life",
    tone: "Warm, casual",
    visual: "Creator-style phone video: one pair, one long day",
    headline: "The pair you forget you're wearing.",
    expectedAudience: "Window shoppers",
  },
  {
    id: "creative_5",
    name: "First mile",
    product: "Pulso (Performance)",
    framing: "Performance and specs",
    tone: "Technical, precise",
    visual: "Dawn running footage with spec call-outs (drop, weight, foam)",
    headline: "Engineered for the first mile and the last.",
    expectedAudience: "Runners, some hype buyers",
  },
];

export type Campaign = {
  id: string; // utm_campaign
  name: string;
  channel: string;
  owner: string; // people id
  /** Always-on runs all year; bursts are dated; owned = email and social. */
  layer: "Always-on" | "Burst" | "Owned";
  start: string;
  end?: string;
  objective: string;
  audience: string;
  creative: string;
  budget?: string;
  kpi: string;
  /** What GA4 will and won't see — the measurement angle. */
  measurement: string;
};

export const campaigns: Campaign[] = [
  {
    id: "fall_launch",
    name: "Fall launch",
    channel: "Meta Paid",
    owner: "lucas",
    layer: "Always-on",
    start: "2026-09-27",
    end: "2026-11-15",
    objective: "Sales (prospecting)",
    audience: "Three ad sets: broad_us (18–44), int_sneakers (sneakers and streetwear interests), int_running",
    creative: "The five launch creatives, equal budget until round 1 ends (Oct 25)",
    budget: "$7,600 in October; folds into ao_prospecting on Nov 16",
    kpi: "Cost per purchase ≤ $45 (platform); GA4 purchases by utm_content",
    measurement: "Fully tagged. GA4 sees sessions and purchases by creative; Meta will report more purchases (view-through, modelled conversions). Three ad sets was the July design; Meta's delivery system now favours fewer ad sets and more creative variety, which is why ao_prospecting uses one or two.",
  },
  {
    id: "weekly_edit",
    name: "The Weekly Edit",
    channel: "Newsletter",
    owner: "tomas",
    layer: "Owned",
    start: "2026-09-30",
    end: "2027-09-29",
    objective: "Repeat visits and sales from subscribers",
    audience: "All subscribers, every Wednesday",
    creative: "One story, one product grid, one drop teaser",
    kpi: "Click rate 3%; newsletter revenue share ≥ 12%",
    measurement: "Tagged per block (utm_content=hero, product_grid). Opens only in the email platform, never in GA4.",
  },
  {
    id: "welcome_flow",
    name: "Welcome flow",
    channel: "Newsletter",
    owner: "tomas",
    layer: "Owned",
    start: "2026-09-27",
    objective: "First purchase from new subscribers",
    audience: "New subscribers, 3 emails over 10 days",
    creative: "Brand story → Arco franchise → best sellers",
    kpi: "20% of new subscribers visit within 10 days",
    measurement: "Tagged utm_campaign=welcome_flow. Needs the on-site sign-up form, which doesn't exist yet.",
  },
  {
    id: "creator_seeding",
    name: "Creator seeding",
    channel: "Instagram Organic",
    owner: "amara",
    layer: "Owned",
    start: "2026-10-01",
    end: "2027-09-30",
    objective: "Reach and credibility",
    audience: "~100 small creators (5k–50k followers) across the year",
    creative: "Creators make their own posts; free pair, no paid fee",
    budget: "$14,000 (product + shipping)",
    kpi: "60% of seeded creators post; ~60 clicks per post",
    measurement: "Creators get UTM links (utm_medium=creator) but most won't use them, so most of this arrives as an untagged Instagram referral.",
  },
  {
    id: "rt_cart",
    name: "Cart retargeting",
    channel: "Meta Paid",
    owner: "lucas",
    layer: "Always-on",
    start: "2026-11-01",
    objective: "Recover abandoned carts",
    audience: "rt_cart_7d: added to cart in the last 7 days, no purchase",
    creative: "Dynamic product ads showing the product left in the cart",
    budget: "About 10% of Meta ($6,500 for the year); capped because small audiences saturate fast",
    kpi: "Cost per purchase ≤ $25",
    measurement: "Needs a Meta pixel or Conversions API to build the audience. Verdian doesn't have one; this is a tracking request waiting to happen.",
  },
  {
    id: "drop2_fosco",
    name: "Drop 2: Fosco winter",
    channel: "Meta Paid + Newsletter + creators",
    owner: "amara",
    layer: "Burst",
    start: "2026-11-13",
    end: "2026-11-19",
    objective: "Sell through the drop in two weeks",
    audience: "Subscribers first (early access), then broad Meta burst",
    creative: "Two drop creatives (drop_fosco_a, drop_fosco_b)",
    budget: "$400 of teasers in October, $1,400 burst in November",
    kpi: "60% of drop units sold in 2 weeks",
    measurement: "Traffic spike on one day. GA4's intraday data and thresholds become visible.",
  },
  {
    id: "holiday_gifting",
    name: "Holiday gifting",
    channel: "Meta Paid",
    owner: "lucas",
    layer: "Burst",
    start: "2026-11-20",
    end: "2026-12-22",
    objective: "Sales, with a higher AOV",
    audience: "broad_us plus gift buyers (interest: gifts for him or her)",
    creative: "Gift guide carousel, care kit as a stocking filler, tee and sock bundles",
    budget: "$1,200 in November, $2,600 in December, on top of always-on",
    kpi: "AOV ≥ $185; cost per purchase ≤ $55",
    measurement: "Q4 CPMs rise; watch cost per session, not just cost per purchase.",
  },
  {
    id: "bf_early_access",
    name: "Black Friday early access",
    channel: "Newsletter",
    owner: "tomas",
    layer: "Owned",
    start: "2026-11-24",
    end: "2026-11-30",
    objective: "Reward subscribers without discounting",
    audience: "Subscribers get 48 h early access to the Drop 2 restock",
    creative: "Countdown email, reminder, last call",
    kpi: "Subscriber purchase rate vs a normal week",
    measurement: "No discount code, so GA4 can only see it through the utm_campaign. Anyone who comes back later untagged is lost.",
  },
  {
    id: "running_resolutions",
    name: "Running resolutions",
    channel: "Meta Paid",
    owner: "lucas",
    layer: "Burst",
    start: "2027-01-02",
    end: "2027-01-31",
    objective: "Sell the Performance line in the January fitness peak",
    audience: "int_running, int_gym",
    creative: "creative_5 (First mile) plus two new Impulso training creatives",
    budget: "$900 on top of always-on",
    kpi: "Performance line ≥ 40% of January revenue",
    measurement: "Line-level revenue needs the item category, which the data layer already sends.",
  },
  {
    id: "ao_prospecting",
    name: "Always-on prospecting",
    channel: "Meta Paid",
    owner: "lucas",
    layer: "Always-on",
    start: "2026-11-16",
    end: "2027-09-30",
    objective: "New customers, all year",
    audience: "One or two broad ad sets (broad_us); Meta finds the audience from the creative",
    creative: "6–12 live ads across at least four angles: the round 1 winners plus one new concept a month and weekly iterations from Jonah",
    budget: "Always-on is $46,100 of the $64,000 (72%), including fall_launch in October; month by month in the split below",
    kpi: "Cost per purchase ≤ $45; nCAC from orders checked weekly",
    measurement: "utm_content set at account level from the ad name, utm_term from the ad set name, so every new ad is tagged without anyone remembering to.",
  },
  {
    id: "archive_sale_jan27",
    name: "Archive sale",
    channel: "Newsletter + Meta (existing audiences only)",
    owner: "hannah",
    layer: "Burst",
    start: "2027-01-20",
    end: "2027-01-31",
    objective: "Clear discontinued colorways and aged stock",
    audience: "Subscribers first (24 h), then the site. No discount ads to new audiences",
    creative: "Email and site banners only; nothing in prospecting",
    kpi: "Archive revenue ≤ 10% of Q1 revenue",
    measurement: "Separate campaign ID and an is_markdown flag on items, so full-price KPIs stay clean. Watch for people waiting for the sale in the week before.",
  },
  {
    id: "drop3_spring",
    name: "Drop 3",
    channel: "Meta Paid + Newsletter + creators",
    owner: "amara",
    layer: "Burst",
    start: "2027-03-12",
    end: "2027-03-19",
    objective: "Sell through the drop in two weeks",
    audience: "Waitlist and subscribers first, then a broad Meta burst",
    creative: "Full drop kit: teaser, launch, last sizes",
    budget: "$300 of teasers in February, $1,600 burst in March",
    kpi: "≥ 50% sell-through at 14 days",
    measurement: "Waitlist sign-ups need their own event, or waitlist → purchase can't be measured.",
  },
  {
    id: "drop4_summer",
    name: "Drop 4",
    channel: "Meta Paid + Newsletter + creators",
    owner: "amara",
    layer: "Burst",
    start: "2027-06-11",
    end: "2027-06-18",
    objective: "Sell through the drop in two weeks",
    audience: "Waitlist and subscribers first, then a broad Meta burst",
    creative: "Full drop kit: teaser, launch, last sizes",
    budget: "$500 of teasers in May, $1,400 burst in June",
    kpi: "≥ 50% sell-through at 14 days",
    measurement: "Same as Drop 3.",
  },
];

/** How the $64k Meta budget splits between layers each month. */
export const metaSplit: { month: string; total: number; alwaysOn: number; retargeting: number; bursts: number; burstNote: string }[] = [
  { month: "Oct", total: 8000, alwaysOn: 7600, retargeting: 0, bursts: 400, burstNote: "Fosco teasers" },
  { month: "Nov", total: 7000, alwaysOn: 3500, retargeting: 900, bursts: 2600, burstNote: "Fosco 1,400 · gifting 1,200" },
  { month: "Dec", total: 8000, alwaysOn: 4200, retargeting: 1200, bursts: 2600, burstNote: "Holiday gifting" },
  { month: "Jan", total: 3500, alwaysOn: 2200, retargeting: 400, bursts: 900, burstNote: "Running resolutions" },
  { month: "Feb", total: 3500, alwaysOn: 2800, retargeting: 400, bursts: 300, burstNote: "Drop 3 teasers" },
  { month: "Mar", total: 5000, alwaysOn: 2900, retargeting: 500, bursts: 1600, burstNote: "Drop 3" },
  { month: "Apr", total: 5000, alwaysOn: 4300, retargeting: 500, bursts: 200, burstNote: "—" },
  { month: "May", total: 5000, alwaysOn: 4000, retargeting: 500, bursts: 500, burstNote: "Drop 4 teasers" },
  { month: "Jun", total: 4000, alwaysOn: 2200, retargeting: 400, bursts: 1400, burstNote: "Drop 4" },
  { month: "Jul", total: 4000, alwaysOn: 3500, retargeting: 500, bursts: 0, burstNote: "—" },
  { month: "Aug", total: 5000, alwaysOn: 4400, retargeting: 600, bursts: 0, burstNote: "—" },
  { month: "Sep", total: 6000, alwaysOn: 4500, retargeting: 600, bursts: 900, burstNote: "Anniversary" },
];

/** Who does what in creative. */
export const creativeRoles: { step: string; who: string }[] = [
  { step: "Writes the brief", who: "Lucas for performance ads, Noor for brand campaigns, Tomás for email" },
  { step: "Concepts", who: "Noor (Jonah and Mila can propose)" },
  { step: "Produces", who: "Noor (shoots), Jonah (paid edits and iterations), Mila (social and creator content)" },
  { step: "Approves", who: "Noor approves brand fit of new concepts; Lucas can approve iterations of an approved concept against the brand checklist; Amara arbitrates" },
  { step: "Decides what gets cut", who: "Lucas, using the testing rules, logged at Creative Review" },
  { step: "Judges on downstream behaviour", who: "Arthur: creative scorecard by concept and angle, with orders, not clicks" },
];

export const briefTemplate = [
  "Campaign ID (snake_case) and dates",
  "Business objective: new customers, drop sell-through, list growth or retargeting",
  "Product(s) and stock check: Hannah signs off that sizes are available for 4+ weeks",
  "Audience insight (from customer care, reviews, social)",
  "Angle: craft, energy, value, comfort, performance, drop hype or gifting",
  "Offer: always free shipping and 30-day returns; never a discount",
  "Three hook ideas, formats (9:16 video, 4:5 static, carousel), mandatory elements",
  "Success metric and kill rule",
  "utm_content names, pre-assigned by Arthur",
  "Approvals: concept (Noor), performance fit (Lucas), claims (Amara)",
];

export const refreshCadence = [
  "Q4: 2–3 new ads a week (the median for accounts spending under $10k a month is 2.8).",
  "January–September: 1–2 a week. One new concept a month; the rest are iterations (hook, first frame, copy).",
  "Every drop brings a full kit: teaser, launch, last sizes.",
];

/** An ad is flagged as fatigued when 2 of 3 are true over 7 days. */
export const fatigueRules = [
  "7-day frequency above 2.5 in prospecting (above 6 in retargeting)",
  "Click rate down 20% or more vs the ad's own first 7 days",
  "Cost per purchase at 1.5× target ($67+) with at least $150 spent",
];

export const testingRules = [
  "Test the concept (angle) first, then hooks.",
  "No kill before $300 spent, or 7 days and $90 spent (2× target CPA). No winner before 5 purchases.",
  "Kill: cost per purchase above 2× target with $150+ spent and hook rate below the account median.",
  "Scale: cost per purchase at or under target for 7 days with 10+ purchases → +20% budget every 48 h.",
  "Winner, for reporting: 10× the account's median ad spend and at least $500, so Verdian's hit rate compares with the ~3.7% benchmark.",
  "Check weekly against order-based nCAC. Platform ROAS is a delivery metric, not a finance metric.",
];
