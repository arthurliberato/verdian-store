# Verdian: company brief for research

> **How to use this document.** Verdian is a fictional company used as a realistic practice environment for eCommerce and marketing analytics. Everything below describes the company *as currently designed*. Please research how **real** direct-to-consumer (DTC) brands of this size and stage actually work, and tell us what to change, add or remove so Verdian behaves like a real company. The findings will be implemented directly, so please follow the **output format** at the end.

---

## 1. The company

- **What it is:** Verdian, a premium athletic and lifestyle brand. Sneakers first, plus apparel and accessories. Sells only through its own online store (DTC). US market, prices in USD.
- **Positioning:** "Heritage quality without the heritage markup." Full-price brand: no sitewide discounts.
- **Stage:** Founded by Valeria Ortiz. Raised a **$2.0M seed round in March 2026**. Runway about 20 months. Plans to raise a **Series A in autumn 2027**.
- **Launch:** Online store went live on **27 September 2026**. Year 1 runs **October 2026 – September 2027**. All plans were written and approved on **15 July 2026**, before launch.
- **Product range (41 models, 104 SKUs):**
  - 15 footwear models across three lines: **Classic** (heritage sneakers, slip-ons, court, boots), **Performance** (running, trail, training, racing, court sport) and **Street** (reinterpretations of Classic models, originals, an eco capsule).
  - 17 apparel models (tees, hoodies, pants, jackets).
  - 9 accessories (socks, caps, bags, sneaker care kit, blanket).
  - Prices: footwear $110–240, apparel $60–260, accessories $60–140.
- **Operations:** one web developer, a third-party logistics warehouse (3PL), free shipping (costs Verdian about $8.50 per order), 30-day returns. Factories: Portugal (leather Classic and Street), Vietnam (Performance). Reorder lead time 12 weeks.
- **Analytics stack:** Next.js store on Vercel → Google Tag Manager → GA4 → BigQuery → (dbt planned) → Looker Studio. A simulated traffic generator produces visitors; AI shopper agents are planned.

## 2. Organisation (12 people)

```
Valeria Ortiz — Founder & CEO
├── Daniel Park — CFO
│   └── Ben Adeyemi — Head of Operations
│       └── Sofia Lindqvist — Customer Care Lead
├── Amara Okafor — CMO
│   ├── Lucas Moreau — Performance Marketing Manager
│   ├── Tomás Reyes — CRM & Retention Manager
│   ├── Noor Haddad — Creative Director
│   └── Arthur Liberato — Marketing Analytics Lead (dotted line to Finance)
├── Priya Nair — Head of E-commerce
│   └── Kai Tanaka — Web Developer
└── Hannah Brooks — Head of Merchandising
```

"Stakeholder agents" send data requests to the analytics lead and answer his questions in character. The others don't send requests yet.

| Person | Role | Stakeholder agent | Cares about | Looks at | Working style |
|---|---|---|---|---|---|
| **Valeria Ortiz** | Founder & CEO | Yes | Growth story for the board, brand health, success of each drop | Weekly sales email, Instagram insights, board deck | Big-picture, impatient; one-line answer then the chart; "so what do we do about it?" |
| **Daniel Park** | CFO | Yes | Revenue accuracy, gross margin, CAC payback, cash | Order exports, ad invoices, monthly P&L | Precise and sceptical; trusts the order system over analytics; wants written definitions |
| **Amara Okafor** | CMO | Yes | Budget allocation across channels, brand vs performance, creative strategy | Agency reports, GA4 overview, social listening | Strategic, narrative; every ask tied to a decision she must defend |
| **Lucas Moreau** | Performance Marketing Manager | Yes | ROAS, cost per purchase, creative testing, scaling winners | Meta Ads Manager, Google Ads, UTM builder | Fast, tactical, acronyms; wants numbers today |
| **Priya Nair** | Head of E-commerce | Yes | Conversion rate, funnel drop-off, checkout friction, drop-day stability | GA4 funnels, store admin, support tickets | Hypothesis-driven; thinks in A/B tests |
| **Tomás Reyes** | CRM & Retention Manager | Yes | Newsletter revenue, repeat purchase rate, lifetime value, win-back | Email platform reports, customer list, newsletter calendar | Segment-minded, friendly; "new vs returning?" |
| **Hannah Brooks** | Head of Merchandising | Yes | Sell-through by model and colorway, size curves, drop performance, reorders | Catalog, buy plan spreadsheet, inventory reports | Product-obsessed, spreadsheet-fluent |
| **Arthur Liberato** | Marketing Analytics Lead | No (the analyst) | Owns tracking plan, GTM, GA4, BigQuery, dbt, dashboards | — | — |
| **Noor Haddad** | Creative Director | No | Photography, campaigns, the five-creative testing framework on Meta | — | — |
| **Ben Adeyemi** | Head of Operations | No | Warehouse, shipping, returns; will own inventory data | — | — |
| **Sofia Lindqvist** | Customer Care Lead | No | Support; hears about checkout problems first | — | — |
| **Kai Tanaka** | Web Developer | No | Builds the storefront and the data layer | — | — |

## 3. Company plan (CEO): five pillars

1. **Build the Arco franchise.** Arco and Arco Muta share one sole and last, so tooling is paid once; they have the best margins (74% and 78%). Target: 35% of footwear pairs.
2. **Stay a full-price brand.** No sitewide discounts; one end-of-season archive sale.
3. **Own the customer relationship.** Grow the email list and repeat purchases.
4. **Prove the Street line through drops.** Four drops a year; Street at 30% of revenue.
5. **Grow efficiently.** Blended CAC ≤ $55; contribution margin after marketing 20% by Q4.

**Year 1 company targets (top-down):** net revenue $340,000; 2,000 orders; AOV $170; ~290 sessions a day on average (150 at launch → 450 at holiday); conversion 1.6% → 2.2%; revenue mix Classic 45% / Performance 25% / Street 30%; product gross margin ≥ 64%; 18% of customers buy again within 12 months.

## 4. Team plans (summary)

Each team plan says how every pillar shapes it (for example, "full price" means no discount ad angles for paid social and no coupon field in checkout).

- **Finance (Daniel):** 5-day monthly close; GA4 reconciled to orders within ±5%; metrics dictionary in October; contribution margin per order; spring reorder cash plan by Dec 8. Budget: marketing $96k, initial inventory $142k, fulfilment ~$21k, payment fees ~$10.5k, software $9k.
- **Marketing (Amara):** Meta-led Year 1; creators instead of paid influencers; no paid search until brand demand exists. Budget $96k: Meta $64k (monthly: Oct 8k, Nov 7k, Dec 8k, Jan–Feb 3.5k, Mar–May 5k, Jun–Jul 4k, Aug 5k, Sep 6k), creator seeding $14k, content and photography $12k, email platform $3k, tools $3k.
- **Paid social (Lucas):** cost per purchase ≤ $45 (platform), ROAS ≥ 3.0 (platform) and ≥ 1.8 (GA4 last click); creative test round 1 (5 creatives, ends Oct 25); cart retargeting from November; holiday scaling.
- **E-commerce (Priya):** conversion 1.6% → 2.2%; mobile ≥ 70% of desktop; checkout completion ≥ 55%; size guide (to cut size-related returns, 60% of footwear returns); mobile product page redesign; A/B testing from February; customer accounts in summer 2027. Kai has one sprint a month for store work.
- **CRM (Tomás):** list 600 → 4,000; The Weekly Edit every Wednesday; welcome, post-purchase (care kit cross-sell), win-back and loyalty flows; care kit attach rate 15%; newsletter ≥ 12% of revenue.
- **Merchandising (Hannah):** 70% full-price sell-through in 6 months; four Street drops (Sep 27, Nov 13, Mar 12, Jun 11); first reorder meeting Dec 8; Classic colorway review in January; archive sale Jan 20–31.

## 5. Unit economics (business drivers GA4 never sees)

- Landed cost per model; gross margins range from about 55% (Viento racing shoe, carbon plate) to 85% (sneaker care kit).
- Arco 74%, Arco Muta 78% (shared platform).
- Per order: shipping $8.50, packaging $1.20, payment fees 2.9% + $0.30.
- Returns: footwear 16%, apparel 9%, accessories 4% of units; return shipping $9; 85% of returns resellable.

## 6. Acquisition model (bottom-up) vs the company plan

Built from assumptions: Meta CPM $9–17 (highest in Nov–Dec), click rate 1.0–1.2%, 75% of clicks become sessions; about 100 creators seeded per year (60% post, 60 clicks per post); newsletter 3% click rate; branded search grows with Meta reach; SEO only from April (not staffed).

| Year 1 | Model | Plans promise |
|---|---|---|
| Sessions a day | ~194 | ~290 |
| Revenue | ~$179k | $340k |
| Blended CAC | ~$102 | ≤ $55 |
| Email subscribers | ~1,300 | 4,000 |
| Channel mix | Meta 70%, Direct 11%, Instagram 10%, Search 7%, Newsletter 2% | — |

The CFO has formally asked for this gap to be reconciled before the Nov 19 board meeting.

## 7. Campaigns and creative (as designed)

- **Campaigns (all dated):** fall_launch (Meta, Sep 27–Nov 15), weekly_edit (email), welcome_flow, creator_seeding, rt_cart (Meta retargeting from Nov), drop2_fosco (Nov 13–19), holiday_gifting (Nov 20–Dec 22), bf_early_access (subscriber early access, no discount), running_resolutions (January).
- **Five launch creatives** (same offer: free shipping and 30-day returns; same message; different framing): Made to last (Arco, craft), Move (Arco Muta, energy), Fair price (Arco, value), All-day comfort (Senda, comfort), First mile (Pulso, performance). Three of five feature the Arco franchise.
- **UTM convention:** source (meta, newsletter, instagram), medium (paid_social, email, creator), campaign (snake_case ID), content (creative or email block), term (ad set).

## 8. Known gaps (why we're asking)

- **No always-on layer:** every campaign has an end date; Feb–Sep has $41.5k of Meta budget and no campaign to spend it.
- **Unclear ownership of creative:** who writes the brief, who makes the ads, who decides what gets cut, who approves.
- **Missing roles?** No social media/community manager, no PR, no customer insights, no product/design team, no dedicated performance creative, no agency relationships described.
- **No operating rhythm:** no weekly, monthly or quarterly meetings, no reporting cadence, no decision forums.
- **Hand-offs are undefined:** marketing ↔ analytics (tracking requests, campaign tagging QA), merchandising ↔ marketing (what to push), e-commerce ↔ CRM (sign-up form, flows), finance ↔ everyone (budgets, approvals).
- **Plans were written top-down** and don't reconcile with marketing's bottom-up model.

---

## 9. Research questions

Please research how real DTC fashion, footwear and apparel brands at **seed to Series A stage (roughly $0.3M–5M annual revenue, 8–25 people)** operate, and answer for Verdian:

1. **Team structure.** Which roles do brands like this actually have, and which are outsourced (agency, freelancer, fractional)? Is 12 people right for $340k Year 1 revenue and a $2M seed? Which roles are missing or unrealistic? Who reports to whom?
2. **Responsibilities per role.** For each role: core responsibilities, KPIs they're measured on, tools they use daily, and what they need from analytics.
3. **Creative process.** Who writes the creative brief, who concepts, who produces, who approves, who decides what gets cut? How are paid social creatives tested and refreshed? What's a realistic creative output per month for a brand this size?
4. **Paid media structure.** How is a Meta account usually structured for a DTC launch (always-on prospecting, always-on retargeting, bursts for launches and drops)? Typical budget split between layers? How often are creatives refreshed and how is fatigue detected?
5. **Planning.** How are annual plans made (top-down vs bottom-up, reconciliation)? Who owns the model? How often are forecasts revised?
6. **Operating rhythm.** Typical weekly, monthly and quarterly meetings, reports and dashboards at a brand this size. Who attends, what's decided.
7. **Hand-offs and RACI.** For the key workflows (launching a campaign, a product drop, a tracking change, a monthly close, a reorder decision), who is Responsible, Accountable, Consulted and Informed?
8. **Analytics in the org.** Where does a marketing analytics lead usually sit, how do requests reach them, and what do stakeholders at this stage typically ask for?
9. **Realistic benchmarks.** Meta CPMs and click rates for fashion/footwear in the US, DTC conversion rates at launch, email list growth for new brands, creator seeding response rates, return rates for footwear. Please cite sources.
10. **Anything else** a real company of this type would have that Verdian is missing (tools, agencies, rituals, constraints, typical conflicts between teams).

## 10. Output format (for implementation)

Please return:

- **A. Recommended org chart:** keep the existing people and names; mark each proposed change as *add*, *remove*, *merge* or *outsource*, with a one-line reason. New people need name, title, reports to, one-paragraph bio, priorities, what they look at, working style.
- **B. Role cards:** one per role: responsibilities, KPIs, tools, rituals, what they need from analytics, typical requests they'd send.
- **C. RACI tables** for the workflows in question 7.
- **D. Operating calendar:** recurring meetings and reports (name, cadence, owner, attendees, inputs, decisions).
- **E. Creative and paid media operating model:** brief template, approval flow, account structure (always-on vs bursts), budget split, refresh cadence, fatigue rules.
- **F. Planning process:** how Verdian's plan should have been built and reconciled, with a realistic Year 1 target range given the budget.
- **G. Benchmarks table:** metric, realistic range, source.
- **H. Top 10 realistic tensions/conflicts** between teams at this stage, which will become stakeholder requests.

Please mark clearly which recommendations are well-supported by sources and which are judgement calls.
