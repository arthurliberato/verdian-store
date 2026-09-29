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
    start: "2026-09-27",
    end: "2026-11-15",
    objective: "Sales (prospecting)",
    audience: "Three ad sets: broad_us (18–44), int_sneakers (sneakers and streetwear interests), int_running",
    creative: "The five launch creatives, equal budget until round 1 ends (Oct 25)",
    budget: "$8,000 in October, $3,500 in November",
    kpi: "Cost per purchase ≤ $45 (platform); GA4 purchases by utm_content",
    measurement: "Fully tagged. GA4 sees sessions and purchases by creative; Meta will report more purchases (view-through, modelled conversions).",
  },
  {
    id: "weekly_edit",
    name: "The Weekly Edit",
    channel: "Newsletter",
    owner: "tomas",
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
    start: "2026-11-01",
    objective: "Recover abandoned carts",
    audience: "rt_cart_7d: added to cart in the last 7 days, no purchase",
    creative: "Dynamic product ads showing the product left in the cart",
    budget: "15% of monthly Meta budget",
    kpi: "Cost per purchase ≤ $25",
    measurement: "Needs a Meta pixel or Conversions API to build the audience. Verdian doesn't have one; this is a tracking request waiting to happen.",
  },
  {
    id: "drop2_fosco",
    name: "Drop 2: Fosco winter",
    channel: "Meta Paid + Newsletter + creators",
    owner: "amara",
    start: "2026-11-13",
    end: "2026-11-19",
    objective: "Sell through the drop in two weeks",
    audience: "Subscribers first (early access), then broad Meta burst",
    creative: "Two drop creatives (drop_fosco_a, drop_fosco_b)",
    budget: "$1,500 Meta burst inside the November budget",
    kpi: "60% of drop units sold in 2 weeks",
    measurement: "Traffic spike on one day. GA4's intraday data and thresholds become visible.",
  },
  {
    id: "holiday_gifting",
    name: "Holiday gifting",
    channel: "Meta Paid",
    owner: "lucas",
    start: "2026-11-20",
    end: "2026-12-22",
    objective: "Sales, with a higher AOV",
    audience: "broad_us plus gift buyers (interest: gifts for him or her)",
    creative: "Gift guide carousel, care kit as a stocking filler, tee and sock bundles",
    budget: "$3,500 in November, $8,000 in December",
    kpi: "AOV ≥ $185; cost per purchase ≤ $55",
    measurement: "Q4 CPMs rise; watch cost per session, not just cost per purchase.",
  },
  {
    id: "bf_early_access",
    name: "Black Friday early access",
    channel: "Newsletter",
    owner: "tomas",
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
    start: "2027-01-02",
    end: "2027-01-31",
    objective: "Sell the Performance line in the January fitness peak",
    audience: "int_running, int_gym",
    creative: "creative_5 (First mile) plus two new Impulso training creatives",
    budget: "$3,500",
    kpi: "Performance line ≥ 40% of January revenue",
    measurement: "Line-level revenue needs the item category, which the data layer already sends.",
  },
];
