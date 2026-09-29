# Verdian Year 1 Operating Plan (Oct 2026 – Sep 2027): Org, Roles, Rhythms, Risks and the Analytics Workstream

Verdian's July plan cannot hit $340k with a $96k marketing budget. What the evidence supports is a base case of about $195k net revenue (range $140k–$270k), a blended CAC of about $80–85, and a small company that adds three flexible contractors rather than full-time staff. The first job for the Marketing Analytics Lead is to turn the $179k-vs-$340k gap into a board-ready reforecast before 19 November.

## TL;DR
- **The target is the problem, not the team.** Take the brief's own funnel (Meta CPM $9–17, CTR 1.0–1.2%, 75% click-to-session) and check it against Triple Whale's 2025–26 apparel medians (CPM $13.25, CVR 1.47%, CPA $36.98, ROAS 2.24). Both point to roughly 190–240 sessions/day, not 290. The $340k plan also implies a blended CAC of ≤$55, which is below what published fashion CAC benchmarks suggest ($66 average per First Page Sage, from 80+ clients over 2020–2025). Take a $195k base / $140k low / $270k high range to the board on 19 November, with explicit triggers for spending more or less.
- **Keep all 12 people. Fix the missing roles with contractors.** Add three part-time or fractional people: a social & community contractor, a freelance performance-creative editor, and an outsourced bookkeeper. From February add a drop-PR freelancer, and keep a dev-overflow agency on call. Every flow (creative, tracking, drop, close, reorder) gets one owner, one approver and a RACI.
- **Analytics is the company's referee.** Arthur makes the order system → BigQuery the revenue source of truth. He reframes "GA4 within ±5% of orders" as a 90%+ transaction-ID match rate, because 10–20% GA4 undercount is normal for browser-side tracking.\[1\] He publishes the metrics dictionary by 30 October and runs a ticketed request queue with SLAs. That queue is where every cross-team conflict in this document will show up.

---

## 0. How to read this document (legend)
- **[S]**: supported by a named external source (benchmark, platform documentation, industry report). The source is named in the sentence.
- **[J]**: judgement call. It is based on stage, budget and operating experience, not a published benchmark. Treat as a default you can change.
- **[B]**: taken directly from the Verdian company brief.
- **[C]**: calculated from brief inputs (the arithmetic is shown).
- Owner initials: VO Valeria Ortiz, DP Daniel Park, BA Ben Adeyemi, SL Sofia Lindqvist, AO Amara Okafor, LM Lucas Moreau, TR Tomás Reyes, NH Noor Haddad, AL Arthur Liberato, PN Priya Nair, KT Kai Tanaka, HB Hannah Brooks. Proposed people: MS Mila Santos, JW Jonah Whitfield, RK Rhea Kapoor (outsourced).
- Dates assume "today" is 29 September 2026, two days after launch.

---

## 1. Key Findings

1. **The plan-vs-model gap is mostly a traffic gap, not a conversion gap. [C]** Plan: 290 sessions/day × 365 = ~105,900 sessions; 2,000 orders implies ~1.9% average conversion. Model: 194/day ≈ 70,800 sessions; $179k ÷ $170 AOV ≈ 1,050 orders, implying ~1.5% conversion. The session shortfall (−33%) explains about two-thirds of the revenue gap. The rest comes from conversion.
2. **Verdian's Meta assumptions are reasonable, but they cannot buy the planned traffic. [S]+[C]** Triple Whale's Meta benchmark (Aug 2025–Jul 2026, 40,000+ brands) gives Apparel & Accessories a median CPM of $13.25 and CTR of 2.44%. The all-industry medians are CPM $15.06 and CPA $38.99.\[2\] At $64k and ~$13 CPM, Verdian buys ~4.9M impressions. At 1.1% link CTR and 75% click-to-session, that is ~40,600 Meta sessions/year, about 111 a day. To reach 290 sessions/day, Meta alone would need roughly 2.5× the budget, or the other channels would need to grow far faster than the model says.
3. **A blended CAC of ≤$55 is ambitious in Year 1. [S]** First Page Sage's "Average CAC for eCommerce Companies: 2026 Edition" draws on proprietary data from 80+ clients across 13 industries between 2020 and 2025, and lists average CAC of $66 for Fashion/Apparel and $67 for Sporting Goods. Lifetimely reports blended new-customer CAC of $25–30 for Shopify apparel stores,\[3\] but those are mostly established stores with repeat-driven organic demand. A brand in its first 12 months with no search demand should plan for $75–105. [J]
4. **The ±5% GA4-to-orders target is set against the wrong thing. [S]** Practitioner guidance (Analytics Agent, Branvas and others) treats a 10–20% (up to 30%) browser-side undercount in GA4 versus the order system as normal, because of ad blockers, consent and redirects.\[1\]\[4\] Finance should reconcile *order-system revenue* in BigQuery to the P&L within ±1%. GA4 should be held to a *coverage* standard (≥90% of order IDs present as GA4 purchase events). [J]
5. **Launch conversion of 1.6% is realistic, and 2.2% by Q4 is a stretch. [S]** Littledata's benchmark of 2,800 stores puts average Shopify conversion at 1.4% (style & fashion 1.9%; top 20% above 3.2%). The mobile/desktop split is 1.2% vs 1.9%,\[5\] which is ~63% of desktop. Priya's "mobile ≥70% of desktop" target is therefore above average but achievable.
6. **"Checkout completion ≥55%" is between average and top quintile. [S]** Littledata puts average checkout completion at 45% (mobile 44%, desktop 49%), with 59% needed to enter the top 20%.\[6\]
7. **Returns assumptions are sensible. [S]** NRF/Happy Returns (2025 Retail Returns Landscape) estimates 19.3% of online sales are returned and 9% of returns are fraudulent.\[7\] Statista (Jan 2024, via Taggstar) puts footwear eCommerce returns at 18%.\[8\] Verdian's 16% footwear unit return rate is plausible for a DTC brand with a good size guide, but not guaranteed.
8. **The creator-seeding assumption (60% of creators post) is optimistic. [S]** Published post rates for unpaid seeding range widely. GRIN is cited (via CreatorDB) at 20–40%;\[9\] Influee says rates are "rarely above 30%" even in well-run campaigns.\[10\] Traackr's State of Influencer Product Seeding survey (March 2023, 305 marketers in the US, UK, France and Germany) found 65% of marketers at least somewhat agree their brand will send product to a creator who did not post after a previous gift. Plan on 30–35%. [J]
9. **Creative volume must rise, but "five creatives" is roughly right for the spend tier. [S]** Motion's Creative Benchmarks 2026 (578,750 creatives, 6,015 accounts, $1.29B spend, 1 Sep 2025 – 1 Jan 2026) shows the micro spend tier (under $10k/month) launching 2.80 new creatives/week (top 25% of accounts: 4.83), with a winner share of about 3.7%. Motion notes these are statistical associations, not causal claims. A "winner" is defined as ≥10× the account-median spend and ≥$500. At Verdian's budget, expect 1–3 true winners in Year 1. Keep refreshing even if nothing looks like a winner.
10. **Meta's current delivery system rewards fewer ad sets and more creative variety. [S]** Meta's engineering post on Andromeda (2 December 2024) describes a retrieval model with "a 10,000x increase in the complexity" that narrows "tens of millions of ads to the few thousand", reporting +6% recall and +8% ads quality on selected segments. dentsu's analysis warns that "excessive segmentation limits the model's ability to learn" and that a simplified structure "populated with diverse, high-quality creatives" outperforms complex setups. For Verdian that means one always-on prospecting campaign, one small retargeting campaign, and dated bursts for drops. It does not mean a campaign per product.
11. **The $64k Meta phasing has a known always-on gap. [C]** February–September holds $37.5k by the monthly phasing (January–September is $41.0k; the brief quotes $41.5k). No campaign is designed for that spend. Arthur should flag the $0.5–4k difference to Daniel as a definitional item.
12. **Twelve full-time people is heavy for a $2M seed. [C]+[S]** A 20-month runway implies ~$100k/month burn. At a fully loaded $8k/person/month, 12 FTE alone would be ~$96k/month before inventory and marketing. So either several people are part-time or the runway is shorter than stated (open question M1). eCommerce Placement's staffing playbook says brands under ~$3M revenue are usually better served by fractional leadership or agency support.\[11\] The DTC Playbook describes $1–10M brands running 3–8 people with many roles overlapping or outsourced.\[12\]

---

## 2. (A) Recommended Org Chart

### 2.1 Structure (reporting lines)

```
Valeria Ortiz — Founder & CEO
├── Daniel Park — CFO (part-time/fractional recommended)
│   ├── Rhea Kapoor — Outsourced bookkeeper/accountant [ADD – outsource]
│   └── Ben Adeyemi — Head of Operations
│       ├── Sofia Lindqvist — Customer Care Lead
│       └── 3PL account manager [external]
├── Amara Okafor — CMO
│   ├── Lucas Moreau — Performance Marketing Manager
│   │   └── Jonah Whitfield — Freelance Performance Creative Editor [ADD – freelance] (dotted to Noor)
│   ├── Tomás Reyes — CRM & Retention Manager (also owns creator-seeding logistics)
│   ├── Noor Haddad — Creative Director
│   │   └── Mila Santos — Social & Community Coordinator [ADD – contract 0.6 FTE]
│   ├── Drop-PR freelancer [OUTSOURCE from Feb 2027]
│   └── Arthur Liberato — Marketing Analytics Lead (dotted line → Daniel)
├── Priya Nair — Head of E-commerce
│   ├── Kai Tanaka — Web Developer
│   └── Dev-overflow agency [OUTSOURCE, on-call retainer]
└── Hannah Brooks — Head of Merchandising
```

### 2.2 Change log

| # | Change | Type | One-line reason | Tag |
|---|---|---|---|---|
| 1 | Daniel Park: move to fractional (2–3 days/week) until Series A prep in Jun 2027 | Outsource-style conversion | Finance workload at <$0.5M revenue does not justify a full-time CFO; staff-placement firms advise against moving straight to a full-time CFO before the scale requires it | [S] Constant Hire / [J] |
| 2 | Add outsourced bookkeeper (Rhea Kapoor, firm) | Add – outsource | Daniel's 5-day close needs someone doing transaction categorisation, 3PL invoice matching and payment-processor reconciliation | [J] |
| 3 | Add Social & Community Coordinator (Mila Santos, 0.6 FTE contract) | Add | Nobody currently owns Instagram (10% of modelled traffic), comments, DMs or the creator relationships that drops depend on | [J] |
| 4 | Add Freelance Performance Creative Editor (Jonah Whitfield, ~40 hrs/month) | Add – freelance | Noor makes campaign/brand work; Meta needs 8–12 cut-downs, iterations and UGC edits per month (Motion volume data) | [S]+[J] |
| 5 | Creator seeding logistics → Tomás (strategy stays with Amara/Noor) | Merge | Seeding is a list-management and follow-up job; Tomás owns the customer list and the gifting codes/links | [J] |
| 6 | Drop-PR freelancer, Feb–Jun 2027 | Outsource | Street drops (pillar 4) need earned media; a retainer before the product is proven is wasted money | [J] |
| 7 | Dev-overflow agency (Next.js), pre-paid 20 hrs/quarter | Outsource | Kai is a single point of failure on drop days and has only one store sprint a month | [J] |
| 8 | Sofia Lindqvist: formal "Voice of Customer" owner (tagging, monthly VoC report) | Scope change | Covers the missing "customer insights" role at no cost; she hears about problems first | [J] |
| 9 | No paid-search agency, no SEO hire in Year 1 | Keep excluded | The brief deliberately says no paid search before brand demand exists; revisit in April if branded search volume passes the trigger in §7 | [B]+[J] |
| 10 | No removals of named staff | — | Brief requires keeping existing people; fix cost via part-time hours (open question M1) | [B] |

### 2.3 New people

**Mila Santos — Social & Community Coordinator (contract, 0.6 FTE). Reports to Noor Haddad; dotted line to Tomás for creator relationships.**
*Bio:* Mila spent three years running community for a skate-shoe label in Los Angeles. She grew its Instagram through reposted customer content, drop-day stories and a small "crew" of local creators. She is fluent in the sneaker-culture vocabulary Street drops need and comfortable in Canva, CapCut and Later. She has never worked with an analytics team and will need coaching on UTMs.
*Priorities:* (1) Daily posting and community management on Instagram/TikTok. (2) Drop-week content calendar and live coverage. (3) Creator shortlist and outreach with Tomás. (4) Weekly social-listening notes for Amara.
*Looks at:* Instagram Insights (reach, saves, shares, profile visits, link clicks), DMs, comment sentiment, creator post tracker.
*Working style:* Fast, visual, community-first. Pushes back on "brand-y" copy. Needs clear no-go rules (no discount language).
*When needed:* Start 12 October 2026 so she is in place before the 13 November Fosco drop. [J]

**Jonah Whitfield — Freelance Performance Creative Editor (~40 hrs/month). Reports to Lucas for briefs and volume; dotted line to Noor for brand approval.**
*Bio:* Jonah is a video editor who cut paid-social ads for DTC footwear and outdoor brands through an agency before going freelance. He works from a hook library, delivers 9:16/4:5/1:1 variants by default, and names files by the UTM convention without being asked.
*Priorities:* Iterations on winners (new hooks, first-3-second swaps), UGC and creator-content edits for Partnership Ads, drop teasers.
*Looks at:* Hook rate (3-second views ÷ impressions), hold rate, CTR by creative, the weekly creative report from Arthur.
*Working style:* Throughput-oriented; wants briefs by Monday and approval within 24 hours.
*When needed:* From 26 October 2026, right after creative round 1 ends. [J]

**Rhea Kapoor — Outsourced Bookkeeper (accounting firm; ~15 hrs/month). Reports to Daniel Park.**
*Bio:* Rhea is a senior bookkeeper at an eCommerce-specialist accounting firm. She has closed books for a dozen DTC brands using Stripe/Shopify Payments, 3PL invoices and ad-platform invoices.
*Priorities:* Transaction categorisation, payment-processor payout reconciliation, 3PL invoice checks, accruals for ad spend, closing by business day 3 so Daniel reviews on days 4–5.
*Looks at:* Bank, payment processor, ad invoices, 3PL invoices, Arthur's monthly order extract.
*Working style:* Checklist-driven; escalates any unexplained variance above $250.
*When needed:* Before the October close (start 1 October 2026). [J]

### 2.4 Specialist and outsourcing timeline

| When | Specialist / vendor | Why then | Cost guide | Tag |
|---|---|---|---|---|
| Oct 2026 | Outsourced bookkeeper | First close (Oct) must be 5 days | ~$800–1,500/month | [J] |
| Oct 2026 | Social & community contractor | Before Nov 13 drop | ~$2.5–3.5k/month (see open question M4 on budget line) | [J] |
| Late Oct 2026 | Freelance creative editor | Creative round 2 onwards | ~$2–3k/month from "content & photography" $12k + tools | [J] |
| Oct 2026 | Dev-overflow agency (on call) | Drop 2 is 13 Nov; Kai is the only developer | Pre-paid block | [J] |
| Nov 2026 | Server-side tagging / CAPI implementation (Kai + AL; optional GTM specialist freelancer, ~10 hrs) | Q4 CPMs are highest; weak signal wastes budget | Small | [J] |
| Jan 2027 | Legal/privacy review (fractional counsel, 2–4 hrs) | Before SMS or accounts; US state privacy laws | Small | [J] |
| Feb 2027 | A/B testing tool (or custom flags in Next.js) | Priya's testing starts Feb | From tools $3k | [B]+[J] |
| Feb–Jun 2027 | Drop-PR freelancer | Mar 12 and Jun 11 drops | Project fee per drop | [J] |
| Apr 2027 | SEO freelancer (audit + content briefs) | Brief says SEO only from April, not staffed | Project fee | [B]+[J] |
| Jun 2027 | Fractional FP&A / Series A data-room support | Series A prep autumn 2027 | Project | [J] |
| Jul 2027 | Customer-accounts build: agency sprint | Accounts in summer 2027 exceed Kai's capacity | Project | [J] |

A fractional CMO is *not* recommended because Amara is in seat. MarketerHire's guide prices fractional CMOs at $5,000–30,000/month for 10–25 hours/week, which is useful only as a replacement cost if Amara leaves (risk R14). [S]

---

## 3. (B) Role Cards

Each card includes responsibilities, KPIs, tools, rituals, what the person needs from analytics, typical requests, a task table and a risk table. Marketing, analytics, e-commerce, CRM, creative and merchandising are the deepest.

### 3.1 Amara Okafor — CMO

**Responsibilities:** Owns the $96k marketing budget, the channel mix, brand vs performance balance, and final approval on campaigns and creative. Accountable for blended CAC and marketing's share of the reforecast.
**KPIs:** Blended CAC (target reset to ≤$85 base, stretch $70) [J]; new customers/month; MER (net revenue ÷ total marketing spend); email list size; share of revenue from Street; creative pipeline health (ads live, refresh rate).
**Tools:** Meta Ads Manager (view), Looker Studio "Marketing Weekly", email platform, social listening, budget tracker (Google Sheet owned by DP).
**Rituals:** Chairs the Monday Growth Stand-up and Monthly Marketing Review; attends the Weekly Leadership Meeting, Board prep and the Drop Go/No-Go.
**Needs from analytics:** A single weekly marketing scorecard; budget-vs-actual by channel; incrementality reads (geo or holdout) when she has to defend Meta spend; a clear definition of "new customer".
**Typical requests:** "I need to defend keeping Meta at $8k in December. What happens to new customers if we cut to $5k? One slide." / "Is brand content doing anything, or should it all go to performance?"

| # | Task | Timing | Inputs | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|---|
| A1 | Approve creative ownership model (§6.2) | By Oct 9 | This doc | Signed RACI | Each creative step has one A; Noor and Lucas both sign | — |
| A2 | Marketing section of reforecast | Oct 26 – Nov 6 | AL funnel model, LM data | 3-scenario channel plan | Reconciles to DP's model within $1k; every assumption sourced or tagged [J] | F1 (AL) |
| A3 | Always-on plan Feb–Sep | By Jan 15 | Phasing, E-section | Campaign calendar with evergreen themes | Every month has a live campaign ID; spend plan = phasing ±5% | LM, NH |
| A4 | Creator programme reset (post-rate reality) | Dec 15 | Seeding tracker | Revised roster + budget | Uses actual post rate from Oct–Nov; cost/post calculated | TR, MS |
| A5 | Brand-health baseline | Nov 30 | Social listening, survey | Baseline (branded search, IG followers, "how did you hear" mix) | Baseline numbers stored in BigQuery | AL, SL |
| A6 | Series A marketing narrative | Jul–Sep 2027 | 10 months data | Cohort, CAC, LTV pack | Every number traceable to dictionary | AL, DP |

**What could go wrong**

| Risk | Early warning | Trigger | Playbook | Escalation |
|---|---|---|---|---|
| Budget cut after board | DP flags cash in Dec close | Runway <15 months | Pre-agreed cut order: brand content → creator fees → retargeting → prospecting last | VO |
| Channel narrative collapses (Meta "not working") | Platform ROAS up while order-system new customers flat | nCAC >$110 for 3 weeks | Run 2-week holdout/geo test; move 20% to creators | VO, DP |
| Conflict with VO over discounting | CEO asks for "a quick 20% off" | Any sitewide promo request | Offer alternatives: early access, bundles with care kit, gift-with-purchase (full price kept) | Board pillar 2 |

### 3.2 Lucas Moreau — Performance Marketing Manager

**Responsibilities:** Builds and runs the Meta account; creative testing; scaling winners; retargeting from November; the UTM builder; ad-spend pacing; working with Jonah on iterations.
**KPIs:** Platform cost per purchase ≤$45; platform ROAS ≥3.0; GA4 last-click ROAS ≥1.8 [B]; new-customer share of purchases ≥75% [J]; spend pacing ±5% of phasing [J]; creative refresh (≥2 new ads/week in Q4) [S Motion tier median 2.8/week].
**Benchmark context:** Triple Whale's apparel median ROAS is 2.24 and CPA $36.98. So "platform ROAS ≥3.0" is top-quartile, not median. Keep it as a stretch; manage to CPA. [S]
**Tools:** Meta Ads Manager, Events Manager, UTM builder sheet, Looker Studio "Paid Social Daily", Motion or Meta's creative reporting.
**Rituals:** Daily 15-min spend check; Monday Growth Stand-up; Wednesday Creative Review; monthly budget reallocation.
**Needs from analytics:** A daily table joining Meta spend with BigQuery orders by campaign/ad (UTM-matched); new vs returning split; an alert when pixel purchase events drop; a fatigue flag per ad.
**Typical requests:** "Need CPP by ad for last 7d vs GA4 LC today pls, Made to last looks cooked" / "Can you pull nCAC by ad set, AM?"

| # | Task | Timing | Inputs | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|---|
| L1 | Creative round 1 read-out | Oct 25–27 | 5 ads, AL report | Keep/kill/iterate list | Each ad ≥$300 spend or ≥2× target CPA before a kill; decision logged | AL daily table |
| L2 | Pixel + CAPI with dedup | By Nov 6 | KT data layer | Events Manager shows browser+server purchase dedup | ≥90% of order IDs visible to Meta; duplicate rate <2% | KT, AL |
| L3 | Launch rt_cart | Nov 1 | Audiences | Retargeting campaign | ≤15% of monthly spend; frequency cap review weekly | L2 |
| L4 | drop2_fosco burst | Nov 10–19 | Brief, assets | Burst campaign | Launch QA checklist passed 48h before | NH, HB, AL |
| L5 | Holiday scaling rules | Nov 20 – Dec 22 | Daily CPA | Scale +20%/48h if CPA ≤ target | No budget change >20%/day [J] | — |
| L6 | January reset + running_resolutions | Jan 2–31 | Winners from Q4 | Evergreen prospecting on $3.5k | CPA ≤$50 at lower spend | JW |
| L7 | Always-on Feb–Sep | From Feb 1 | A3 | Evergreen + drop bursts | Monthly spend = phasing ±5% | A3 |
| L8 | Quarterly incrementality test | Mar, Jun, Sep | Geo split | Lift readout | Pre-registered design signed by AL | AL |

**What could go wrong**

| Risk | Early warning | Trigger | Playbook | Escalation |
|---|---|---|---|---|
| Ad account disabled / ads rejected | Rejection emails, "restricted" banner | Any spend paused >4h | Appeal; backup admin on Business Manager (AO); switch to email/IG organic; keep second verified admin | AO within 2h |
| Creative fatigue | Frequency 7d >2.5, CTR −20% vs own baseline | 2 of 3 fatigue signals (§6.6) | Swap hook; promote next iteration from Jonah's queue | NH for new concept |
| CPM spike (BFCM) | CPM > $17 (top of assumption) | CPA >$55 for 3 days | Hold budget flat; shift to email/early access; avoid raising bids | AO |
| Signal loss (iOS/consent) | Meta purchases ÷ orders ratio falls | <60% for 7 days | Check CAPI health; rely on order-system nCAC for decisions | AL |
| Discount ad angle creep | "Deal" copy in drafts | Any | Reject at brief stage; offer "free shipping & 30-day returns" framing | NH |

### 3.3 Tomás Reyes — CRM & Retention Manager

**Responsibilities:** Email platform, list growth, The Weekly Edit (Wednesdays), flows (welcome, abandoned cart/browse, post-purchase care-kit cross-sell, win-back, loyalty), subscriber early access for bf_early_access, creator-seeding logistics (new scope).
**KPIs:** List 600 → target reset to 2,000–2,500 base [J] (model 1,300; plan 4,000); popup submit rate ≥2.5% of popup views [S: Omnisend 2.1% average across 1.24B displays; Klaviyo median 2.3%]; flow revenue share; campaign click rate ≥1.7% [S: Klaviyo 2026 campaign click 1.69%]; care-kit attach 15% [B]; repeat purchase within 12 months 18% [B]; email ≥12% of revenue [B].
**Benchmark context:** Klaviyo's 2026 benchmarks say flows produce ~41% of email revenue from 5.3% of sends. The abandoned-cart flow has the highest revenue per recipient ($3.65 average; apparel placed-order rate 3.42%). So build flows before adding campaign volume. [S]
**Tools:** Email platform (Klaviyo assumed, see M5), customer list export, newsletter calendar, seeding tracker.
**Rituals:** Wednesday send; Monday Growth Stand-up; monthly Retention Review with AL.
**Needs from analytics:** New vs returning split, cohort repeat curves, flow attribution cross-checked to orders, list-growth source (popup, checkout, drop waitlist, creator), suppression of fake/bot sign-ups from the traffic generator.
**Typical requests:** "Hey! Could we see new vs returning for the Fosco drop, and did the waitlist people actually buy?" / "What's the care-kit attach rate for Arco buyers vs everyone?"

| # | Task | Timing | Inputs | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|---|
| T1 | Signup form + popup live (no discount; value = early access/drop alerts) | By Oct 10 | KT sprint | Popup + footer + checkout opt-in | Consent captured with timestamp; source property on every profile | KT, AL |
| T2 | Welcome (3 emails) + abandoned cart + browse flows | By Oct 20 | Creative | Live flows | UTM on all links; flow IDs in dictionary | NH |
| T3 | Post-purchase care-kit flow | By Nov 1 | HB kit stock | Flow day 3/14/28 | Attach rate measured at 30 and 60 days | HB |
| T4 | Drop waitlist for Fosco | Oct 20 – Nov 12 | Landing page | Waitlist segment | Waitlist → purchase rate reported Nov 20 | PN, KT |
| T5 | bf_early_access | Nov 24–27 | Segment | 24h early access send | No discount code exists in platform | AO |
| T6 | Win-back (90/150 days) | By Jan 15 | Cohorts | Flow | Measured against 10% holdout | AL |
| T7 | Seeding tracker + follow-ups | Ongoing from Oct | Creator list | Sheet → BigQuery | Each creator: ship date, post date, link, code | MS, AL |
| T8 | Loyalty design (non-discount: early access, repairs, care kit) | Spec by Apr; live Jul | Accounts build | Loyalty spec | Aligned with accounts launch | PN, KT |

**What could go wrong**

| Risk | Early warning | Trigger | Playbook | Escalation |
|---|---|---|---|---|
| List growth far below plan | Weekly net adds | <40/week for 4 weeks | Add drop waitlists, creator giveaway entry, checkout opt-in default review (legal) | AO |
| Bot/simulated sign-ups | Sign-ups with no session, same domain | >5% of week's adds | Double opt-in; filter traffic generator by user-agent/IP | AL |
| Deliverability hit | Spam complaints >0.1%, bounce >2% [J] | Either | Pause campaign; clean list; warm-up | AO |
| Flow over-attribution | Email-attributed revenue > orders with email touch | >12% share without holdout support | Report holdout-based incremental revenue | AL |

### 3.4 Noor Haddad — Creative Director

**Responsibilities:** Brand identity, photography, campaign concepts, the five-creative testing framework, final brand approval of all paid and owned creative, briefs for shoots, style guide including "no discount language".
**KPIs:** On-time delivery vs creative calendar (≥90%) [J]; ads delivered per month (Q4: 10–12; low season: 6–8) [J, informed by Motion]; share of spend on concepts <60 days old [J]; brand-consistency sign-off turnaround ≤24h [J].
**Tools:** Figma, Adobe CC, shared asset library (naming = UTM content), creative calendar.
**Rituals:** Wednesday Creative Review (chair); monthly shoot planning; Drop Go/No-Go.
**Needs from analytics:** A creative scorecard by *concept* and *angle* (craft, energy, value, comfort, performance), not just by ad; hook/hold rate; which products appear in winning ads vs the sales mix.
**Typical requests:** "Which angle is winning for Street buyers specifically, craft or energy?" / "Can you show if lifestyle shots beat studio shots?"

| # | Task | Timing | Inputs | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|---|
| N1 | Brief template adopted (§6.1) | Oct 9 | This doc | Template in shared drive | Used for 100% of new ads from Oct 12 | AO |
| N2 | Round 2 concepts (non-Arco heavy) | Oct 20 – Nov 3 | Round 1 read-out | 3 new concepts × 3 hooks | ≥1 concept each for Street and Performance | LM |
| N3 | Fosco drop kit | Oct 15 – Nov 6 | HB product | Teasers, launch, sell-out, PDP imagery | Delivered 7 days before drop | HB, MS |
| N4 | Holiday gifting assets | By Nov 17 | Gift guide | Ads + email modules | Care kit and accessories represented | TR |
| N5 | Evergreen library for Feb–Sep | Shoot Jan 20–30 | A3 plan | 20+ assets | Covers every line and all five angles | A3 |
| N6 | Drop 3 (Mar 12) and 4 (Jun 11) kits | Jan–Feb; Apr–May | HB | Kits | Same QA as N3 | HB |

**What could go wrong**

| Risk | Early warning | Trigger | Playbook | Escalation |
|---|---|---|---|---|
| Bottleneck (Noor approves everything) | Approval queue >48h | 3 ads waiting >48h | Delegate approval of iterations on an approved concept to Lucas (brand guard-rails checklist) | AO |
| Brand vs performance fight | Lucas wants UGC-style; Noor rejects | Two rejected rounds | Test both in a pre-agreed split; data decides at Wednesday review | AO |
| Photo shoot slips | Samples late from factory | Samples not in hand 3 weeks pre-drop | Use 3D/flat-lay; creator content | HB, VO |

### 3.5 Arthur Liberato — Marketing Analytics Lead (summary card; full workstream in §11)

**Responsibilities:** Tracking plan, GTM, GA4, BigQuery, dbt, Looker Studio, metrics dictionary, campaign tagging QA, reconciliation, request intake, forecasting model with Finance.
**KPIs:** Order-ID match rate GA4 ≥90% and Meta ≥85% [J]; BigQuery orders = P&L revenue ±1% [J]; SLA hit rate ≥90%; dashboards refreshed by 08:00 ET daily; zero untagged paid spend.
**Rituals:** Runs Monday Numbers (async report by 09:00), Weekly Data Quality check, Monthly Close support, Forecast Review.
**Typical inbound (who asks what):** see §10 tensions and §11.6.

### 3.6 Valeria Ortiz — Founder & CEO

**Responsibilities:** Company plan, board, fundraising, final say on pillars (full price, drops), hiring.
**KPIs:** Net revenue vs reforecast; runway months; Street share; brand health; Series A readiness.
**Tools:** Weekly sales email, Instagram insights, board deck.
**Rituals:** Weekly Leadership Meeting (chair), Monthly Business Review, Board meetings (Nov 19, then quarterly).
**Needs from analytics:** One-line answer, then one chart, then "so what". A weekly email with five numbers and a trend.
**Typical requests:** "Was the Fosco drop a success? Yes/no and what do we do next." / "Why is Instagram saying 40k reach but sales are flat?"

| # | Task | Timing | Deliverable | Acceptance criteria |
|---|---|---|---|---|
| V1 | Approve operating rhythm (§5) | Oct 9 | Calendar invites | All recurring meetings scheduled |
| V2 | Decide reforecast stance for board | Nov 12 | Chosen scenario + ask | Board deck states base/low/high and triggers |
| V3 | Board meeting | Nov 19 | Deck | Numbers match dictionary; DP signs off |
| V4 | Pillar review (Arco %, Street %) | Feb 2027 | Decision memo | Uses 4 months data |
| V5 | Series A go/no-go on timing | Jun 2027 | Plan | Based on trailing-6-month metrics |

**What could go wrong:** CEO pushes discounts (R16); impatience drives changes before tests read (require minimum run time); she reads Instagram reach as sales (educate with a "reach → sessions → orders" chart). Escalation is to the board.

### 3.7 Daniel Park — CFO (fractional)

**Responsibilities:** P&L, cash, close, budgets and approvals, reorder cash plan (Dec 8), board financials, definitions sign-off.
**KPIs:** Close in 5 business days; runway; gross margin ≥64%; contribution margin per order; CAC payback (contribution basis).
**Tools:** Accounting system, order exports, ad invoices, bank.
**Rituals:** Monthly Close, Monthly Business Review, Forecast Review, Reorder Meeting.
**Needs from analytics:** Order-system extracts that tie to the bank; written definitions; a reconciliation bridge from Meta → GA4 → orders.
**Typical requests:** "Please send October net revenue from the order system with refunds by the date processed, not the order date, and a written definition." / "Your CAC uses 'new customers' — new by email or by card?"

| # | Task | Timing | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|
| D1 | Metrics dictionary sign-off | Oct 30 | Signed v1.0 | Covers every KPI in this doc | AL |
| D2 | October close | Nov 1–7 | P&L | 5 business days; BQ orders tie ±1% | RK, AL |
| D3 | Reconciliation memo $179k vs $340k | Nov 12 | Memo + model | Bridge explains 100% of gap | AL, AO |
| D4 | Spring reorder cash plan | Dec 8 | Cash plan | Runway ≥15 months after reorder commitment | HB, BA |
| D5 | Budget reallocation rules | Oct 31 | Policy | Thresholds in §4.7 approved | AO |
| D6 | Series A data room finance pack | Jun–Sep 2027 | Pack | Audited-ready monthly P&L | RK |

**What could go wrong:** Distrusts analytics (solve with order-system source of truth); runway squeeze before Series A (R15); ad invoices vs platform spend differ (accrue by platform spend and reconcile to invoice monthly). Escalation is to VO and the board.

### 3.8 Priya Nair — Head of E-commerce

**Responsibilities:** Storefront, conversion, funnel, checkout, drop-day stability, size guide, mobile PDP redesign, A/B testing from February, accounts in summer 2027, Kai's sprint priorities.
**KPIs:** CVR 1.6% → 2.2% [B] (realistic Q4 exit 1.9–2.0% [J]); mobile CVR ≥70% of desktop [B]; checkout completion ≥55% [B]; add-to-cart rate ≥5.4% [S: Littledata fashion average]; uptime on drop day 100%; LCP <2.5s mobile [J].
**Tools:** GA4 funnels, store admin, support tickets, Vercel analytics, error monitoring.
**Rituals:** Monday Growth Stand-up; monthly sprint planning with Kai; Drop Go/No-Go; Testing Council (from Feb).
**Needs from analytics:** Funnel by device and source; PDP → size-guide interaction → return rate; A/B test design and readout (power calculations); a drop-day live dashboard.
**Typical requests:** "Hypothesis: size guide exposure reduces size returns. Can we measure exposure → return link at order level?" / "What's the MDE for a checkout test at our traffic?"

**Testing reality check [C]:** At ~200 sessions/day and a 1.7% conversion rate, detecting a 20% relative lift at 80% power takes roughly 25,000+ sessions per arm, i.e. 8+ months. Priya's February A/B programme should therefore test *upstream* metrics (add-to-cart, size-guide open, checkout start) or accept only very large effects. It should not run conversion-rate tests.

| # | Task | Timing | Deliverable | Acceptance criteria | Dependencies |
|---|---|---|---|---|---|
| P1 | Post-launch funnel audit | Oct 1–14 | Funnel report | Every step event validated in GA4 DebugView | AL, KT |
| P2 | Drop-day readiness (Fosco) | Nov 1–12 | Load test + runbook | Load test at 10× normal peak; rollback tested | KT, agency |
| P3 | Size guide v1 (with fit notes per model) | Sprint Nov; live Dec 1 | Size guide on all footwear PDPs | Interaction event tracked; linked to returns | HB, BA, KT |
| P4 | Mobile PDP redesign | Spec Dec; sprints Jan–Feb | Live PDP | Mobile ATC rate +15% vs baseline (pre/post) | NH, KT |
| P5 | Testing programme | From Feb | Test backlog + council | Each test pre-registered with primary metric and MDE | AL |
| P6 | Customer accounts | Spec Apr; build Jun–Jul (agency) | Accounts live | Identity stitching to orders in BQ | KT, agency, AL |

**What could go wrong:** Drop-day outage (R1); a checkout bug nobody sees until Sofia hears about it (R2); testing on too little traffic produces false winners (enforce pre-registration); Kai's sprint over-allocated (R17).

### 3.9 Kai Tanaka — Web Developer

**Responsibilities:** Storefront (Next.js on Vercel), data layer, integrations (email, payments, 3PL, Meta CAPI), performance, drop-day engineering.
**KPIs:** Sprint delivery ≥80%; P1 incidents fixed in <2h; data-layer spec compliance 100% on release; Core Web Vitals pass.
**Rituals:** Monthly sprint planning; Tracking Change review (with AL); drop war room.
**Needs from analytics:** A versioned data-layer spec; QA checklists; alerts on event drops.
**Typical requests (to AL):** "Is it OK if I rename `item_variant` in the release Thursday?" (the answer is always: through the tracking change process).

| # | Task | Timing | Acceptance criteria |
|---|---|---|---|
| K1 | Data layer v1.1 fixes from launch QA | Oct 1–10 | All ecommerce events pass AL's QA sheet |
| K2 | Server-side purchase to GA4 (Measurement Protocol) + Meta CAPI with event_id dedup | By Nov 6 | GA4 order-ID coverage ≥90% |
| K3 | Drop queue/stock lock + load test | By Nov 10 | No oversells in test; 10× load |
| K4 | Size guide component | Nov sprint | Event `size_guide_open` fires with SKU |
| K5 | Mobile PDP | Jan–Feb sprints | Passes CWV on mobile |
| K6 | Consent banner/CMP + Consent Mode | By Dec 15 | Consent state in data layer; GA4 respects it |

**What could go wrong:** Key-person loss or illness on drop day (R17: agency on call, runbook, second deploy key held by PN); an unannounced release breaks tracking (R3: release notes → AL, automated event checks).

### 3.10 Hannah Brooks — Head of Merchandising (full depth in §12)

**Responsibilities:** Assortment, buy plan, drops, sell-through, size curves, reorders, colorway review, archive sale, product data for marketing.
**KPIs:** Full-price sell-through 70% within 6 months [B] (Nul's fashion guidance: ~70% at full price before first markdown is healthy [S]); weeks of cover per model; stockout rate on core sizes <5% [J]; Arco + Arco Muta share of footwear pairs 35% [B]; drop sell-through at 14 days [J].
**Tools:** Catalog, buy-plan spreadsheet, inventory reports (from Ben/3PL).
**Rituals:** Weekly Trade Meeting (new, chair), Reorder Meeting (Dec 8 and quarterly), Drop Go/No-Go, Colorway Review (Jan).
**Needs from analytics:** Sell-through by model/colorway/size daily; demand signals from out-of-stock sessions (PDP views of OOS sizes); return reasons by size; product views vs sales.
**Typical requests:** "Can I get sell-through by size for Arco in 'Bone' vs 'Black', and how many people viewed the 10.5 while it was out?"

### 3.11 Ben Adeyemi — Head of Operations

**Responsibilities:** 3PL, shipping, returns, inventory data (owner), factory follow-up with Hannah, packaging.
**KPIs:** Ship within 1 business day ≥98% [J]; pick accuracy ≥99.5% [J]; return processing ≤5 days; 3PL cost per order ≤$8.50 shipping + $1.20 packaging [B]; inventory accuracy (cycle count) ≥99% [J].
**Tools:** 3PL portal, carrier dashboards, inventory reports.
**Rituals:** Weekly Trade Meeting; 3PL weekly call; Reorder Meeting; drop war room.
**Needs from analytics:** Daily inventory snapshot in BigQuery; return-reason dashboard; order volume forecast for 3PL staffing (drops, BFCM).
**Typical requests:** "Need a daily order forecast for Nov 13–19 so the 3PL can staff."

| # | Task | Timing | Acceptance criteria |
|---|---|---|---|
| B1 | Daily inventory feed 3PL → BigQuery | By Oct 31 | Snapshot by SKU at 06:00 ET; variance vs store stock <1% |
| B2 | Return-reason codes standardised (size small/large, fit width, quality, changed mind, damaged) | By Oct 15 | 100% of returns coded |
| B3 | Drop and BFCM staffing plan with 3PL | Nov 1 | Forecast shared; SLA agreed |
| B4 | Factory tracking (PO milestones) | From Dec 8 | Each PO has ex-factory, ship, arrival dates |

**What could go wrong:** 3PL mis-picks (R18); inbound delay from Portugal/Vietnam (R9); carrier surcharges raising shipping above $8.50 (monthly cost-per-order check with DP).

### 3.12 Sofia Lindqvist — Customer Care Lead

**Responsibilities:** Support (email/chat), returns authorisation, VoC tagging and a monthly report, first-alert for checkout and site issues.
**KPIs:** First response <4 business hours [J]; CSAT ≥90% [J]; tickets per 100 orders; % tickets tagged 100%.
**Rituals:** Daily incident channel; monthly VoC report into the Monthly Business Review; drop war room.
**Needs from analytics:** Tickets joined to orders; contact rate trend; alert when ticket tags such as "checkout" or "payment" spike.
**Typical requests:** "Three people today said the payment button did nothing on iPhone. Is it just them?"

| # | Task | Timing | Acceptance criteria |
|---|---|---|---|
| S1 | Tag taxonomy (size, delivery, checkout, payment, product quality, discount request) | Oct 7 | Agreed with AL; exported weekly |
| S2 | Incident alert rule: ≥3 tickets with same checkout/payment tag in 2h → incident channel | Oct 7 | Tested once |
| S3 | Monthly VoC report | From Nov 5 | Top 5 themes + quotes + counts |
| S4 | Size-exchange script (offer exchange before refund) | Oct 15 | Exchange share tracked |

**What could go wrong:** "Can I get a discount code?" becomes a volume theme (have a scripted full-price answer; log it for VO); holiday volume overload (pre-written macros; Mila covers social DMs).

### 3.13 Mila Santos, Jonah Whitfield, Rhea Kapoor — task summaries

| Person | Task | Timing | Acceptance criteria |
|---|---|---|---|
| MS | Social calendar + drop-week live plan | Start Oct 12; Fosco plan by Oct 30 | 5 posts/week; every link in bio UTM-tagged |
| MS | Creator shortlist (30 per quarter) with TR | Monthly | Each creator: handle, tier, fit score, address, status |
| MS | Weekly social-listening note | Fridays | 5 bullets + 3 screenshots to AO |
| JW | 2–4 iterations/week on live winners | From Oct 26 | Delivered in 3 sizes; named per convention; within 48h of brief |
| JW | Partnership Ads edits from creator posts | Ongoing | Usage rights confirmed in tracker before editing |
| RK | Close checklist days 1–3 | Monthly | Payment payouts reconcile to bank ±$0; unexplained variance >$250 escalated |

**Risks for the three:** Contractor churn (keep all source files in the company drive; no personal accounts); creator content used without rights (rights checkbox is a gate); bookkeeping errors on refunds (refunds booked by processed date per dictionary).

---

## 4. (C) RACI Tables

R = Responsible, A = Accountable (one per row), C = Consulted, I = Informed.

### 4.1 Launching a campaign

| Step | AO | LM | NH | JW | TR | AL | PN/KT | HB | DP |
|---|---|---|---|---|---|---|---|---|---|
| Campaign objective + budget | A | R | C | – | C | C | – | C | C |
| Creative brief | C | R | A | C | C | C | – | C | – |
| Asset production | I | C | A | R | – | – | – | – | – |
| UTM + naming | I | R | – | I | R (email) | A (QA) | – | – | – |
| Landing page / PDP ready | I | C | C | – | – | C | A/R | C | – |
| Stock check | I | C | – | – | – | – | – | A/R | – |
| Launch QA (links, pixel, UTMs) | I | R | – | – | – | A | C | – | – |
| Go-live | A | R | I | – | I | I | I | I | I |
| 72h read + keep/kill | C | A/R | C | I | – | R (data) | – | I | – |

### 4.2 Product drop (e.g. drop2_fosco, Nov 13)

| Step | VO | HB | AO | NH | LM | TR | MS | PN | KT | BA | SL | AL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Drop plan (units, sizes, price) T−10 wks | C | A/R | C | C | – | – | – | C | – | C | – | C |
| Marketing plan T−6 wks | I | C | A | R | R | R | R | C | – | – | – | C |
| Tracking/landing page T−3 wks | – | C | – | – | C | C | – | A | R | – | – | R |
| Load test + runbook T−10 days | – | – | – | – | – | – | – | A | R | C | C | C |
| Go/No-Go T−2 days | A | R | R | C | C | C | – | R | R | R | C | R |
| Drop-day war room | I | R | C | – | R | R | R | A | R | R | R | R |
| T+7 and T+14 read-out | I | A | C | C | C | C | – | C | – | – | – | R |

### 4.3 Tracking change

| Step | Requester (any) | AL | KT | PN | LM/TR | DP |
|---|---|---|---|---|---|---|
| Ticket with business question | R | A | I | I | I | – |
| Spec (event, params, dictionary impact) | C | A/R | C | C | C | C (if revenue metric) |
| Implementation on staging | – | C | R/A... | I | – | – |
| QA (DebugView, BQ raw, Meta test events) | – | A/R | C | – | C | – |
| Release + change log entry | I | A | R | I | I | I |
| 7-day post-release check | – | A/R | C | – | – | – |

Note: implementation on staging is owned by KT (A/R); AL is consulted. Any change touching revenue, order ID or consent needs DP sign-off (C) and cannot ship within 72h of a drop or campaign launch (freeze). [J]

### 4.4 Monthly close

| Step (business day) | RK | DP | AL | BA | AO | VO |
|---|---|---|---|---|---|---|
| BD1: bank, processor, 3PL invoices | R | A | – | C | – | – |
| BD1: order-system extract (gross, discounts=0, refunds, net) | – | A | R | – | – | – |
| BD2: ad-spend accrual by platform | R | A | C | – | C | – |
| BD2: inventory valuation | R | A | – | R | – | – |
| BD3: reconciliation BQ ↔ ledger (±1%) | R | A | R | – | – | – |
| BD4: contribution margin per order, CAC | C | A | R | – | C | – |
| BD5: P&L issued + variance commentary | C | A/R | C | C | C | I |

### 4.5 Reorder decision

| Step | HB | BA | DP | AL | AO | VO |
|---|---|---|---|---|---|---|
| Sell-through + size curve pack | C | C | I | A/R | – | – |
| Demand forecast (base/low/high) | A/R | C | C | R | C (marketing plan) | – |
| Supplier MOQ, lead time, landed cost | R | A | C | – | – | – |
| Cash impact + runway | C | C | A/R | – | – | I |
| Decision | R | C | C | C | C | A |

### 4.6 Creative testing round

| Step | LM | NH | JW | AL | AO |
|---|---|---|---|---|---|
| Hypothesis + test design | A/R | C | – | C | I |
| Assets | C | A | R | – | – |
| Readout (per §6.7 rules) | R | C | I | R | I |
| Kill/scale decision | A | C | I | C | I |
| New concept vs iteration choice | C | A | C | C | I |

### 4.7 Budget reallocation

| Size of move | Who decides (A) | Consulted | Informed |
|---|---|---|---|
| Within Meta, ≤20% between campaigns in a month | LM | AL | AO |
| Between channels ≤$2k/month, within total | AO | DP, AL | VO |
| Moving spend across months (pull-forward/defer) ≤$3k | DP | AO | VO |
| Any increase in total marketing budget or cut >15% | VO | DP, AO | Board if >$10k |

### 4.8 Drop-day incident response

| Severity | Definition | Responder (R) | Accountable (A) | Response time | Comms |
|---|---|---|---|---|---|
| P1 | Site/checkout down or payments failing | KT (+ agency) | PN | 15 min | SL posts status; LM pauses ads; TR delays emails |
| P2 | Stock/oversell, wrong prices, broken size | KT, HB | PN | 1h | SL macro |
| P3 | Tracking broken, reports wrong | AL | AL | 4h | AL posts note in #data |

### 4.9 Returns / size-guide loop

| Step | SL | BA | HB | PN | AL | NH |
|---|---|---|---|---|---|---|
| Reason coding | R | A | – | – | C | – |
| Monthly size-return analysis by model | – | C | C | C | A/R | – |
| Fit-note updates on PDP | C | – | A | R | I | C |
| Size curve change in next buy | – | C | A/R | – | C | – |

---

## 5. (D) Operating Calendar

### 5.1 Recurring meetings and reports

| Name | Cadence | Owner | Attendees | Inputs | Decisions |
|---|---|---|---|---|---|
| Monday Numbers (async) | Weekly, Mon 09:00 | AL | All | BQ dashboards | None. It is the single weekly truth: revenue, orders, sessions, CVR, nCAC, list adds, top 5 SKUs |
| Weekly Leadership | Mon 11:00, 45 min | VO | DP, AO, PN, HB, BA | Monday Numbers | Priorities, escalations, hiring |
| Growth Stand-up | Mon 14:00, 30 min | AO | LM, TR, NH, MS, AL, PN | Paid/CRM/social dashboards | Weekly spend moves, email plan, content |
| Creative Review | Wed 10:00, 45 min | NH | LM, JW, MS, AL | Creative scorecard | Keep/kill/iterate; next briefs |
| Weekly Trade Meeting | Thu 10:00, 30 min | HB | BA, AO, LM, AL, PN | Sell-through, stock cover | What to push/hold in ads & email; low-stock suppressions |
| Data Quality Check | Weekly, Tue | AL | (report to PN, LM, DP) | Monitoring queries | Open incidents |
| Monthly Close | BD1–5 | DP | RK, AL, BA | Ledger, BQ | P&L |
| Monthly Business Review | BD7, 90 min | VO | Leadership + AL | P&L, KPIs, VoC | Reforecast triggers, budget moves |
| Monthly Marketing Review | BD6 | AO | Marketing team, AL, DP | Channel pack | Next month's budget split |
| Forecast Review | Monthly (BD8) + event-triggered | DP | AL, AO, HB | Actuals vs scenarios | Update rolling 12-month forecast |
| Drop Go/No-Go | T−2 days per drop | VO | Drop RACI | Checklist | Go/No-Go |
| Drop Retro | T+14 | HB | Drop team | Read-out | Lessons, reorder signal |
| Quarterly Planning | Jan, Apr, Jul | VO | Leadership | QBR packs | Targets, budgets, hires |
| Board meeting | Nov 19 then quarterly | VO | DP, board | Deck | Plan approval |
| Testing Council | Bi-weekly from Feb | PN | AL, KT, NH | Test backlog | Next tests; readouts |

### 5.2 Year 1 master calendar

| Month | Dated events [B] | Key deliverables (owner) |
|---|---|---|
| **Oct 2026** | Store live Sep 27; creative round 1 ends Oct 25; metrics dictionary due | Tracking fixes (KT/AL, by Oct 10); popup + flows (TR, Oct 10–20); rhythm launched (VO, Oct 9); bookkeeper + Mila start; dictionary v1.0 signed Oct 30 (DP/AL); round 1 read-out Oct 27 (LM); reforecast model build starts Oct 26 (AL) |
| **Nov 2026** | rt_cart from Nov; drop2_fosco Nov 13–19; **board Nov 19**; holiday_gifting Nov 20 – Dec 22; bf_early_access | Oct close by Nov 7; CAPI/server-side by Nov 6; load test Nov 10; reconciliation memo Nov 12; board deck final Nov 16; Fosco read-out Nov 27 |
| **Dec 2026** | **Reorder meeting Dec 8**; holiday ends Dec 22 | Reorder pack Dec 3 (AL/HB); cash plan Dec 8 (DP); size guide live Dec 1; consent/CMP Dec 15; Nov close; holiday cut-off messaging (BA) |
| **Jan 2027** | running_resolutions; Classic colorway review; **archive sale Jan 20–31** | Q4 retro + Q1 planning (Jan 8); returns wave analysis; evergreen shoot; archive sale tracking (separate campaign ID, markdown flag); always-on plan (Jan 15) |
| **Feb 2027** | A/B testing starts | Testing Council live; mobile PDP launch; drop-PR freelancer onboard; drop 3 marketing plan (T−6 wks ≈ Jan 29) |
| **Mar 2027** | **Drop 3: Mar 12** | Go/No-Go Mar 10; incrementality test #1; Q1 close + QBR |
| **Apr 2027** | SEO starts | SEO audit; quarterly planning; spring reorder arrivals (if placed Dec 8 + 12 wks ≈ early Mar ex-factory, arriving Mar–Apr) |
| **May 2027** | — | Drop 4 plan (T−6 wks ≈ Apr 30); accounts spec; cohort LTV v1 (6-month cohorts) |
| **Jun 2027** | **Drop 4: Jun 11** | Go/No-Go Jun 9; incrementality test #2; Series A prep starts (data room structure) |
| **Jul 2027** | Customer accounts (summer) | Accounts build (agency); loyalty launch; H1 review; FY2 planning kick-off |
| **Aug 2027** | — | Autumn buy (for FY2 Q1) must be committed by ~Jul 15 for Oct arrival (12 weeks); Series A metrics pack v1 |
| **Sep 2027** | Year-1 close; 1-year anniversary | FY2 plan (bottom-up first); incrementality #3; Series A deck (autumn 2027) |

---

## 6. (E) Creative and Paid Media Operating Model

### 6.1 Brief template (one page) [J]
1. Campaign ID (snake_case) and dates
2. Business objective (one of: new customers, drop sell-through, list growth, retargeting)
3. Product(s) and stock check (HB sign-off: units, sizes available ≥4 weeks)
4. Audience insight (from VoC, reviews, social)
5. Angle (craft / energy / value / comfort / performance / drop-hype / gifting)
6. Offer (always: free shipping + 30-day returns; never a discount) [B]
7. Hook ideas (3), formats (9:16 video, 4:5 static, carousel), mandatory elements
8. Success metric and kill rule (§6.7)
9. UTM content names pre-assigned by AL
10. Approvals: concept (NH), performance fit (LM), claims/legal (AO)

### 6.2 Who does what in creative [J]
- **Writes brief:** Lucas for performance ads, Noor for campaign/brand, Tomás for email.
- **Concepts:** Noor. Jonah and Mila can propose.
- **Produces:** Noor (shoots), Jonah (paid edits), Mila (social/UGC).
- **Approves:** Noor approves brand fit for new concepts; Lucas can approve iterations of an approved concept against the brand checklist; Amara arbitrates.
- **Decides what is cut:** Lucas, using the §6.7 rules, logged in the Creative Review.

### 6.3 Account structure [S Andromeda guidance + J]
| Layer | Campaign | Setup | When |
|---|---|---|---|
| Always-on prospecting | `ao_prospecting` | One sales campaign (Advantage+ / broad), 1–2 ad sets, 6–12 active ads spanning ≥4 angles | Oct–Sep continuous |
| Always-on retargeting | `rt_cart` (+ `rt_view` later) | Site visitors 30d / add-to-cart 14d, exclude purchasers 30d | From Nov 1 |
| Bursts | `drop2_fosco`, `holiday_gifting`, `drop3_*`, `drop4_*`, `running_resolutions` | Separate campaign, fixed dates, own budget | Dated |
| Archive sale | `archive_sale_jan27` | Email/owned first; Meta only to existing audiences (no discount ads to prospects, protecting full-price positioning) [J] | Jan 20–31 |

`fall_launch` should be folded into `ao_prospecting` from November 16, so the always-on layer exists from day one of the gap.

### 6.4 Budget split by month ($64k Meta phasing) [B phasing; J split]

| Month | Total | Always-on prospecting | Retargeting | Bursts |
|---|---|---|---|---|
| Oct | 8,000 | 7,600 (fall_launch) | 0 | 400 (Fosco teasers) |
| Nov | 7,000 | 3,500 | 900 | 2,600 (Fosco 1,400; gifting 1,200) |
| Dec | 8,000 | 4,200 | 1,200 | 2,600 (holiday_gifting) |
| Jan | 3,500 | 2,200 | 400 | 900 (running_resolutions) |
| Feb | 3,500 | 2,800 | 400 | 300 (drop 3 teaser) |
| Mar | 5,000 | 2,900 | 500 | 1,600 (drop 3) |
| Apr | 5,000 | 4,300 | 500 | 200 |
| May | 5,000 | 4,000 | 500 | 500 (drop 4 teaser) |
| Jun | 4,000 | 2,200 | 400 | 1,400 (drop 4) |
| Jul | 4,000 | 3,500 | 500 | 0 |
| Aug | 5,000 | 4,400 | 600 | 0 |
| Sep | 6,000 | 4,500 | 600 | 900 (anniversary/fall 2) |
| **Total** | **64,000** | **46,100 (72%)** | **6,500 (10%)** | **11,400 (18%)** |

Retargeting is capped at ~10–15% because small audiences saturate fast and mostly capture buyers who would have purchased anyway. [J]

### 6.5 Refresh cadence [S Motion + J]
- Q4: 2–3 new ads/week (concepts + iterations), roughly in line with Motion's micro-tier median of 2.8/week.
- Jan–Sep: 1–2/week. One new *concept* per month; the rest are iterations (hook, first frame, copy).
- Every drop brings a full kit (teaser, launch, "last sizes").

### 6.6 Fatigue rules [S practitioner bands; J thresholds]
Flag an ad when **2 of 3** conditions are met over 7 days:
1. 7-day frequency >2.5 in prospecting (>6 in retargeting)
2. CTR down ≥20% versus the ad's own first-7-day baseline
3. Cost per purchase ≥1.5× target ($67+) with ≥$150 spend

Practitioner sources (e.g. Succession Media citing Superads, AdSights) put the fatigue watch-line at a 7-day frequency of 2.5–3.0 with a 20–30% CTR decline. Meta's own "Creative fatigue" status appears when cost per result reaches roughly twice that of past ads, which is late. Arthur's creative scorecard computes the flag daily.

### 6.7 Testing framework and decision rules [J]
- **Unit:** concept (angle) first, then hooks.
- **Minimum read:** ≥$300 spend *or* ≥7 days *and* ≥2× target CPA spend ($90) before any kill; purchases ≥5 before calling a winner.
- **Kill:** CPA >2× target with ≥$150 spend and hook rate below account median.
- **Scale:** CPA ≤ target for 7 days with ≥10 purchases → +20% budget per 48h.
- **Winner definition for reporting:** Motion's (≥10× median ad spend and ≥$500), so Verdian's hit rate can be compared with the ~3.7% micro-tier benchmark. [S]
- **Always validate with order-system nCAC weekly.** Platform ROAS is a delivery metric, not a finance metric.

---

## 7. (F) Planning Process and Reconciliation

### 7.1 How the plan should have been built [J]
1. Bottom-up first: budget → impressions → sessions → orders by channel (Arthur and Lucas own it).
2. Top-down ambition from the CEO/board.
3. Reconcile in a gap bridge; then either (a) raise budget, (b) accept a lower target, or (c) name specific initiatives with owners that close the gap.
4. One model, owned by Finance, with Arthur as model builder. Marketing owns the channel assumptions; Merchandising owns stock constraints.

### 7.2 The bridge from $340k to the model [C]
| Driver | Plan | Model | Revenue effect |
|---|---|---|---|
| Sessions/year | ~105,900 | ~70,800 | −$112k (at plan conversion × AOV) |
| Conversion | ~1.9% | ~1.5% | −$49k |
| AOV | $170 | $170 | 0 |
| **Result** | **$340k** | **~$179k** | **−$161k** |

(Net effects are approximate because the drivers interact. Arthur's model should compute the bridge sequentially: sessions first, then conversion.)

### 7.3 Scenarios for the board (net revenue after returns) [C]+[J]
| | Low | Base | High |
|---|---|---|---|
| Sessions/day (avg) | 170 | 210 | 240 |
| Conversion | 1.4% | 1.7% | 2.0% |
| AOV | $160 | $165 | $170 |
| Gross orders | ~870 | ~1,300 | ~1,750 |
| Net revenue (after ~10–12% returns) | ~$140k | ~$195k | ~$270k |
| Blended CAC ($96k ÷ new customers) | ~$120 | ~$82 | ~$62 |
| Email list at Sep 30 | 1,300 | 2,200 | 3,500 |

What the base case means: product gross margin ~64% minus shipping $8.50, packaging $1.20 and payment fees (~$5.23 on $170) leaves roughly $90 of contribution per order before marketing. At a base CAC of ~$82, Verdian roughly pays back acquisition on the *first* order. That is the investor story: "efficient but small". It is more honest than "on plan", and it only needs the budget to scale. [C]

### 7.4 Nov 19 reconciliation approach (timeline)
- **Oct 26–30:** Arthur builds a driver model in Sheets from BigQuery (a dbt model later). Inputs are 4 weeks of actuals and the benchmarks in §9.
- **Nov 2–6:** Channel owners confirm assumptions (LM Meta, TR email, MS/TR creators, PN conversion). Each assumption is tagged [S], [J] or actual.
- **Nov 9:** Draft bridge + scenarios to DP.
- **Nov 12:** DP memo; VO chooses a stance. Recommendation: present the base case, a "what $X more marketing buys" sensitivity, and triggers.
- **Nov 16:** Deck frozen.
- **After the board:** the approved scenario becomes the budget of record; everything else is tracked against it.

### 7.5 Forecast revision cadence and triggers [J]
- Monthly rolling reforecast at BD8.
- Immediate reforecast if any of these happen: 4-week trailing revenue ±20% vs base; nCAC >$110 for 3 weeks; a drop's 14-day sell-through <40% or >85%; a stockout of any Arco core size (8–11) >7 days; a Meta CPM >$20 for 2 weeks; cash runway <15 months.
- Quarterly re-plan in Jan, Apr and Jul.
- Triggers to add budget: nCAC ≤$65 for 4 weeks *and* stock cover ≥8 weeks → propose +$2k/month to DP.

---

## 8. (H) Top Tensions Between Teams (and how they reach the analyst)

| # | Tension | Realistic request form |
|---|---|---|
| 1 | Finance vs Marketing on "real" revenue (GA4/Meta vs orders) | DP: "Lucas's deck says $22k from Meta in October; our P&L says total net revenue was $19k. Explain in writing." |
| 2 | CEO vs full-price pillar | VO: "Competitors are doing 25% off for Black Friday. What would we gain? Quick number." |
| 3 | Brand vs performance creative | NH: "Show me that the UGC ads aren't just cheap clicks, with orders not CTR." |
| 4 | Merch wants to push overstock; marketing wants to push winners | HB: "Street Originals is at 20% sell-through. Can ads feature it?" LM: "It converts at half the rate." Both ask AL for "the data". |
| 5 | Arco concentration (3 of 5 creatives) vs Street 30% target | AO: "Are we starving Street by over-indexing on Arco ads?" |
| 6 | E-commerce vs CRM on popups (conversion vs list growth) | PN: "Does the popup hurt conversion on mobile?" TR: "Popup adds 60% of subscribers." |
| 7 | Kai's single sprint (store vs tracking vs CRM) | Three tickets marked "urgent" the same week; AL is asked to "estimate business impact" to rank them |
| 8 | Returns cost vs free-returns promise | BA: "Size returns cost $X; can we charge for return shipping?" AO: "Kills conversion." AL is asked for return cost by model |
| 9 | CRM over-attribution | DP: "Email claims 25% of revenue. Is that real?" |
| 10 | Drop hype vs site stability | PN wants throttled traffic; MS wants a "3pm ET all-channel blast" |
| 11 | Reorder cash vs growth | HB: "We'll stock out on Arco 9–10.5 in January." DP: "Cash." AL is asked for a stockout-cost estimate |
| 12 | Board-deck pressure | VO: "Can we show sessions instead of orders? It looks better." AL must hold to the dictionary |
| 13 | Simulated traffic contaminating data | PN: "Conversion dropped to 0.9% overnight." Cause: the traffic generator changed |

---

## 9. (G) Benchmarks Table

| Metric | Realistic range / figure | Source | Note for Verdian |
|---|---|---|---|
| Meta CPM, Apparel & Accessories (US-heavy) | $13.25 median (Aug 2025–Jul 2026); $12.27 (2025 full year, secondhand) | Triple Whale Facebook Ad Benchmarks, 40,000+ brands | Brief's $9–17 is fine |
| Meta CPM, DTC spread | median $13.52; middle 50% $11.04–$22.90 | Top Growth Marketing, 15 DTC brands, Jul 2025–Jun 2026 | Small sample |
| Meta CPM seasonality | global median $17.73 Jan 2025 → $25.22 Nov → $15.74 Jan 2026 | Superads tracker (via Sovran) |\[13\] Budget Nov–Dec at higher CPM |
| Meta CTR, apparel | 2.44% median (all-clicks basis likely) | Triple Whale | Link CTR is lower; brief's 1.0–1.2% link CTR is prudent |
| Facebook traffic-campaign CTR | 1.71% average; CPC $0.70 | WordStream 2025 |\[14\] Cross-industry |
| Meta CVR / CPA / ROAS, apparel | 1.47% / $36.98 / 2.24 | Triple Whale | Lucas's $45 CPP target is achievable; 3.0 ROAS is a stretch |
| Meta MER, apparel | 0.42 | Triple Whale | Definition differs from Verdian MER; do not compare directly |
| Shopify store conversion | 1.4% average; top 20% >3.2%; top 10% >4.7%; style & fashion 1.9% | Littledata (2,800 stores) | Verdian is not on Shopify; use as proxy |
| Mobile vs desktop conversion | 1.2% vs 1.9% | Littledata | Mobile ≈63% of desktop |
| Checkout completion | 45% avg; mobile 44%, desktop 49%; top 20% 59% | Littledata | 55% target is above average |
| Add-to-cart rate | 4.6% average; fashion 5.4% | Littledata | — |
| Cart abandonment | 70.22% average (50 studies) | Baymard Institute |\[15\] — |
| Abandonment due to extra costs | 48% of US shoppers | Baymard survey (Feb 2024, via eMarketer) | Free shipping helps Verdian |
| Email campaign / flow click | 1.69% / 5.58% | Klaviyo 2026 benchmarks | Newsletter 3% click assumption is optimistic |
| Flow share of email revenue | ~41% from 5.3% of sends | Klaviyo 2026 | Build flows first |
| Abandoned-cart flow | RPR $3.65; placed-order rate 3.33% (apparel 3.42%) | Klaviyo abandoned cart report | — |
| Campaign placed-order rate | 0.16% all; 0.12% clothing & accessories | Klaviyo | — |
| Popup signup rate | 2.1% avg (1.24B displays); Klaviyo median 2.3%; Wisepops 4.82% | Omnisend; Klaviyo via Crazy Egg; Wisepops | Without a discount, expect the low end |
| Creator seeding post rate | 20–40% typical; "rarely above 30%" | GRIN (via CreatorDB); Influee | Brief's 60% is optimistic |
| Online return rate (all) | 19.3% of online sales; 9% of returns fraudulent | NRF/Happy Returns 2025 | — |
| Footwear eCommerce return rate | 18% | Statista Jan 2024 (via Taggstar) |\[8\] Verdian 16% plausible |
| Size/fit share of returns | 53% (apparel & footwear) | Coresight (via Eightx) | Verdian 60% for footwear consistent |
| Repeat purchase rate (12 mo) | fashion 12–17%; portfolio 18.8% (156k customers) | BS&Co | Verdian 18% is ambitious; other sources show apparel 27–35% (Eightx), so the range is disputed |
| CAC, fashion/apparel | $66 average; sporting goods $67 | First Page Sage 2026 edition (80+ clients, 13 industries, 2020–2025) | Agency client data |
| Blended new-customer CAC, apparel | $25–30 | Lifetimely by AMP | Mature Shopify stores |
| GA4 vs order-system gap | 10–20% normal client-side | Analytics Agent; Branvas (10–30%) | Reframe ±5% target |
| Creative volume, micro spend tier | 2.80 new ads/week median; top 25% 4.83; winner share ~3.7% | Motion Creative Benchmarks 2026 (Sep 2025 – Jan 2026) | — |
| Full-price sell-through | ~70% before first markdown healthy | Nūl | Matches Hannah's 70% in 6 months |
| Premium sell-through | 50–70% within a season (12–16 wks) | Oui Speak Fashion glossary | — |
| Team size | $1–10M brands: 3–8 people, many roles outsourced | The DTC Playbook | Verdian's 12 is heavy |
| Fractional CMO cost | $5–30k/month, 10–25 hrs/week | MarketerHire | Replacement cost only |

---

## 10. (I) Risk Register and Shock Playbook

Probability (P) and impact (I) are rated H/M/L. [J] unless noted.

| ID | Risk | P | I | Leading indicators | Threshold | Playbook | Owner → escalation |
|---|---|---|---|---|---|---|---|
| R1 | Drop-day outage | M | H | Load test failures, error rate, p95 latency | Error rate >2% or checkout down >5 min | P1 runbook: static waitlist page, pause ads (LM), hold emails (TR), status post (SL), agency on call | KT → PN → VO |
| R2 | Silent checkout bug | M | H | Checkout-start → purchase ratio, payment-tag tickets | Completion −25% vs 7-day avg for 4h, or 3 tickets/2h | Roll back last release; test on iOS Safari | PN → VO |
| R3 | Tracking break | H | M | GA4 order-ID coverage, event volume | Coverage <85% for a day; any event −50% day over day | Freeze decisions on GA4; use BQ orders; fix via change process | AL → PN |
| R4 | GA4 vs orders beyond tolerance | H | M | Weekly match report | Match <90% for 2 weeks | Audit consent, ad blockers, redirects; server-side backfill | AL → DP |
| R5 | Meta account disabled / ad rejections | M | H | Policy emails | Spend paused >4h | Appeal; backup admin; shift to email/organic/creators | LM → AO |
| R6 | iOS/consent attribution loss | H | M | Meta-reported purchases ÷ orders | <60% | CAPI health; nCAC from orders; incrementality tests | AL → AO |
| R7 | Creative fatigue | H | M | §6.6 flags | 50% of spend on flagged ads | Emergency iterations (JW 48h) | LM → NH |
| R8 | Arco stockout / size-curve miss | M | H | Weeks of cover by size | Core size <4 weeks of cover | Waitlist + back-in-stock flow; shift ads to Arco Muta/others; air-freight quote | HB → DP |
| R9 | Factory delay (Portugal/Vietnam) | M | H | Missed PO milestones | Ex-factory slip >2 weeks | Re-sequence drops; pre-sell/waitlist; marketing plan shift | BA → HB → VO |
| R10 | Returns above plan | M | M | Rolling 30-day footwear unit returns | >20% | Size guide fit notes; exchange-first; model-level review | BA → HB |
| R11 | CAC blowout | M | H | Weekly nCAC | >$110 for 3 weeks | Cut to evergreen winners; shift to creators/email; reforecast | AO → DP |
| R12 | Low list growth | H | M | Weekly adds | <40/week for 4 weeks | Waitlists, giveaways, checkout opt-in | TR → AO |
| R13 | Seeding under-delivers | H | L | Post rate | <25% after 60 days | Fewer, better-fit creators; small fees or affiliate links | TR → AO |
| R14 | Key-person loss (Amara, Kai, Arthur) | L | H | Workload, morale | Resignation | Runbooks; docs in shared drive; agency/fractional backfill | VO |
| R15 | Cash runway pressure pre-Series A | M | H | Monthly burn vs plan | Runway <15 months | Cut order (§3.1); defer accounts build; smaller reorder | DP → VO → board |
| R16 | Founder pushes discounts | M | M | "Quick promo" asks | Any sitewide promo | Non-discount alternatives; model the margin cost; board pillar | AO → VO |
| R17 | Single web developer bottleneck | H | H | Sprint overrun, ticket backlog | >2 P1/P2 queued | Agency block; freeze non-critical work | PN → VO |
| R18 | 3PL errors | M | M | Mis-pick tickets, ship-time SLA | >0.5% mis-picks or <95% on-time | 3PL escalation; SLA credits | BA → DP |
| R19 | Payment fee / chargeback spike | L | M | Dispute rate | >0.5% of orders [J] | Fraud rules; 3-D Secure; review drops for resellers | DP → BA |
| R20 | Negative PR / social backlash | L | H | Sentiment, DMs | Viral negative post | Holding statement in 2h; VO voice; no deletion | MS → AO → VO |
| R21 | Data privacy / consent issue | M | H | CMP config, complaints | Any complaint or missing consent on email | Pause affected flows; legal review; fix CMP | AL/TR → DP |
| R22 | Simulated traffic / AI agents contaminate data | H | M | Sessions with no engagement, UA patterns | >10% of sessions | Flag in data layer; filter in dbt; separate "sim" views | AL → PN |

---

## 11. (J) Analytics Workstream — Arthur Liberato

### 11.1 Principles [J]
1. The order system is the source of truth for revenue, orders and customers. GA4 is for behaviour and funnels. Meta is for delivery.
2. Every KPI has one definition (§13) and one owner.
3. No decision may use a number that isn't in the dictionary.

### 11.2 Build sequence

| # | Task | Timing | Deliverable | Acceptance criteria | Failure mode |
|---|---|---|---|---|---|
| J1 | Tracking plan v1.1 (events: view_item_list, view_item, select_item, size_select, size_guide_open, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase, refund, sign_up, waitlist_join) | Oct 1–7 | Spec sheet | Every event has params, trigger, owner, dictionary link | Kai ships without spec |
| J2 | Launch QA | Oct 1–10 | QA sheet | 100% events pass in DebugView and BQ export | Staging ≠ prod |
| J3 | GA4 ↔ BigQuery daily export verified | Oct 3 | Dataset | Tables land daily; row counts monitored | Export quota/billing issue |
| J4 | Order-system → BigQuery pipeline | By Oct 17 | `raw_orders`, `raw_refunds`, `raw_customers` | Daily; order count = admin count exactly | API pagination bugs |
| J5 | Meta spend → BigQuery | By Oct 24 | `raw_meta_ads` | Spend = Ads Manager ±$1/day | Timezone mismatch (set account and BQ to ET) |
| J6 | Email platform → BigQuery | By Nov 14 | Campaign/flow tables | — | — |
| J7 | Inventory feed (with BA) | By Oct 31 | `raw_inventory_daily` | SKU snapshot | 3PL file format changes |
| J8 | dbt project v1 (staging → marts: orders, customers, sessions, marketing_spend, inventory) | Nov–Dec | dbt repo + tests | Unique/not-null tests on order_id; source freshness <24h | Scope creep |
| J9 | Looker Studio dashboards (§11.5) | Oct (v0) → Dec (dbt-backed) | 7 dashboards | Each tile links to a definition | Too many dashboards |
| J10 | Metrics dictionary v1.0 | Oct 30 | Doc signed by DP | All §13 terms | Disputes stall sign-off |
| J11 | Server-side purchase + CAPI | By Nov 6 | Coverage report | ≥90% GA4, ≥85% Meta | Duplicate purchases |
| J12 | Consent Mode + CMP | By Dec 15 | Consent state tracked | Consent rate reported | Legal ambiguity |
| J13 | Forecast model (driver-based) | Oct 26 – Nov 9 | Model + bridge | Ties to DP ±$1k | Hidden assumptions |
| J14 | Cohort/LTV model | From Jan; v1 May | Cohort tables | Monthly cohorts; 30/60/90/180-day repeat | Small samples, so report counts too |
| J15 | Incrementality test designs | Mar, Jun, Sep | Test memos | Pre-registered | Underpowered, so state the MDE |

### 11.3 Campaign tagging QA [J]
- UTM builder sheet with dropdowns (source: meta, newsletter, instagram, creator; medium: paid_social, email, creator, social; campaign: an approved ID only).
- Meta URL parameters set at account level, using dynamic `{{ad.name}}` for content and `{{adset.name}}` for term.
- Daily query: sessions with `utm_source` not on the allow-list, or paid spend with no matching sessions → Slack alert.
- Acceptance: zero untagged paid spend; less than 2% of sessions with unknown campaign IDs.

### 11.4 Reconciliation hierarchy [S+J]
1. **Order system (BQ)** vs ledger: ±1%, monthly (DP).
2. **GA4 purchases** vs orders: match on transaction_id; coverage ≥90%. A 10–20% client-side gap is normal per practitioner sources, and the server-side feed closes most of it.
3. **Meta-reported purchases** vs UTM-matched orders: expect Meta to be higher on 7-day-click/1-day-view (view-through, cross-device). Report both, and decide budgets on order-based nCAC.
4. The standard reply to "conflicting numbers" is a three-row table (Meta / GA4 / Orders) with the definition behind each and why they differ.

### 11.5 Dashboards per stakeholder
| Dashboard | For | Refresh | Core tiles |
|---|---|---|---|
| CEO Weekly | VO | Weekly email | Net revenue vs base, orders, nCAC, Street share, list size — one line each + chart |
| Finance | DP | Daily + close | Orders/net revenue by processed date, refunds, CM/order, CAC payback |
| Marketing Weekly | AO | Weekly | Spend vs phasing, MER, nCAC, channel mix, list growth |
| Paid Social Daily | LM | Daily 08:00 | Spend, CPM, CTR, CPP (platform), UTM-matched orders, fatigue flags |
| Funnel & Site | PN | Daily | Funnel by device/source, checkout completion, errors, size guide use |
| Retention | TR | Weekly | List adds by source, flow revenue (order-matched), repeat rate, attach rate |
| Trade | HB/BA | Daily | Sell-through by model/colour/size, weeks of cover, OOS views, returns by reason |

### 11.6 Request intake and SLA [J]
- A single intake form, with the Slack `/data-request` routing into it. Fields: requester, decision it supports, deadline, metric (from dictionary), format.
- **P0** (incident, board): same day. **P1** (decision this week): 2 business days. **P2** (analysis): 5 business days. **P3** (nice to have): backlog, reviewed Mondays.
- Maximum 2 open P1s per requester. Amara ranks marketing conflicts; Valeria ranks cross-functional ones.
- Every answer starts with a one-line conclusion, then a chart, then "what to do". This covers Valeria's style for everyone.

### 11.7 Data-quality monitoring [J]
Daily checks: order count BQ vs admin (exact); GA4 coverage; event volume anomalies (±50% d/d); untagged traffic; sim-traffic share; Meta spend freshness; inventory freshness. Weekly: dictionary drift and dashboard usage.

### 11.8 Arthur's own risks
| Risk | Signal | Playbook |
|---|---|---|
| Overloaded by ad-hoc asks | SLA hit <80% | Enforce the queue; self-serve dashboards; say no to P3 during drops |
| Becomes the "numbers police" | Stakeholders bypass him | Weekly office hours; publish the change log |
| Model owned by marketing, not finance | DP rejects the forecast | Build it together with DP; DP owns sign-off |
| BigQuery cost creep | Bill >$50/month [J] | Partitioned tables; scheduled queries only |

---

## 12. (K) Product and Merchandising Depth

### 12.1 Drop planning (T-minus) [J]
- **T−16 weeks:** product locked, POs placed (12-week lead time + 4 weeks for photography and QC).
- **T−10 weeks:** units and size curve set; price; drop format (timed release vs open).
- **T−6 weeks:** marketing plan; waitlist page live.
- **T−3 weeks:** assets final, tracking and landing page QA.
- **T−2 days:** Go/No-Go.
- **T+7 / T+14:** sell-through read; reorder or not.
- The Nov 13 Fosco drop is already inside T−7 weeks, so only the marketing, tracking and readiness steps remain.

### 12.2 Sell-through
- Definition: units sold (net of returns) ÷ units received, by model/colour/size, at full price only (§13).
- Targets [J, informed by Nūl and OSF]: Street drops ≥50% at 14 days and ≥75% at 8 weeks; Classic core ≥70% in 6 months [B].
- Actions: <30% at 4 weeks → shift ads and email to the model, review PDP imagery; >85% at 14 days → reorder review and waitlist.

### 12.3 Size curves
- Start with the buy curve; update it monthly from sales plus *unfulfilled demand*: PDP views where the selected size was out of stock (the `size_select` event with `in_stock=false`) and back-in-stock sign-ups.
- Adjust the size curve for return reasons ("too small" pushes demand half a size up).

### 12.4 Reorder decisions (Dec 8 and quarterly) [J]
- Weeks of cover = on-hand ÷ trailing 4-week unit sales (by size).
- **Reorder point = (12-week lead time + 4-week safety) × forecast weekly sales.** In other words, anything with less than 16 weeks of cover must be decided *now*.
- Cash: a PO needs the deposit (ask Ben for terms) and the balance before shipment. Daniel's test is runway ≥15 months after commitment.
- Decision pack (§4.5) includes base/low/high demand and the cost of a stockout (lost contribution ≈ $90/order × forecast lost orders).
- Worked example for Arco: if Arco sells 12 pairs/week in Nov–Dec, it needs ~190 pairs on hand or incoming at all times (16 × 12). Any size under its share of that triggers a reorder. [C]

### 12.5 Classic colorway review (January)
Inputs: sell-through by colour, return rate by colour, creative performance by colour, VoC. Output: keep/cut/extend per colourway, feeding the autumn 2027 buy (commit by mid-July for October arrival).

### 12.6 Archive sale mechanics (Jan 20–31) [J]
- Scope: only discontinued colourways and aged stock (>120 days, sell-through <50%). Never current core.
- Access: subscribers first (24h), then site. There is no coupon field; prices are marked down at SKU level with an `is_markdown` flag.
- Measurement: separate campaign ID; report archive revenue separately from full-price revenue so pillar 2 KPIs stay clean.
- Guardrail: archive revenue ≤10% of Q1 revenue. Watch for full-price cannibalisation in the week before (people waiting).

### 12.7 How product data feeds marketing and analytics
Product master (SKU, model, line, colour, size, cost, price, launch date, drop ID, markdown flag, stock) → BigQuery `dim_product` → the Meta catalog, email product blocks and every dashboard. Hannah owns the master; Arthur owns its BigQuery copy and tests; Kai owns the storefront sync.

---

## 13. (L) Glossary / Metrics Dictionary (v1.0 draft)

| Term | Definition | Source system |
|---|---|---|
| Gross merchandise sales | Sum of item prices on paid orders, excl. tax and shipping | Orders (BQ) |
| Net revenue | Gross merchandise sales − refunds (booked by refund-processed date) | Orders (BQ) → ledger |
| Order | A paid order with a unique order_id; test and sim orders excluded | Orders |
| AOV | Gross merchandise sales ÷ orders | Orders |
| Conversion rate | Orders ÷ sessions (GA4 sessions, sim traffic excluded). Order-based numerator matched via transaction_id where possible | GA4 + Orders |
| Checkout completion | Purchases ÷ begin_checkout sessions | GA4 |
| New customer | First paid order ever by normalised email | Orders |
| nCAC | Total marketing spend in period ÷ new customers in period | Ledger + Orders |
| Blended CAC | Total marketing spend ÷ all new customers (same as nCAC at Verdian unless defined otherwise; DP to confirm) | — |
| MER | Net revenue ÷ total marketing spend | — |
| Platform ROAS | Meta-reported purchase value ÷ Meta spend (7-day click/1-day view) | Meta |
| GA4 last-click ROAS | GA4 purchase revenue with last non-direct source = meta ÷ Meta spend | GA4 |
| Contribution margin/order | Net revenue − COGS − shipping − packaging − payment fees − return costs, per order | Ledger |
| CM after marketing | Contribution margin − marketing spend | Ledger |
| CAC payback | nCAC ÷ contribution margin per first order (in orders; months once cohorts exist) | — |
| Repeat purchase rate (12 mo) | Customers with ≥2 orders within 365 days of first order ÷ cohort customers | Orders |
| Care-kit attach rate | Orders (or customers within 60 days) including a care kit ÷ footwear orders | Orders |
| Return rate | Units returned ÷ units shipped, by category | 3PL/Orders |
| Full-price sell-through | Units sold at full price net of returns ÷ units received | Orders + Inventory |
| Weeks of cover | On-hand units ÷ trailing 4-week average weekly unit sales | Inventory |
| Hook rate | 3-second video plays ÷ impressions | Meta |
| Frequency (7d) | Impressions ÷ reach, 7 days | Meta |
| Seeding post rate | Creators who posted within 45 days ÷ creators shipped | Seeding tracker |
| List size | Subscribed, consented, non-bot profiles | Email platform |
| GA4 coverage | Order IDs with a GA4 purchase event ÷ orders | GA4 + Orders |

---

## 14. (M) Assumptions and Open Questions

1. **M1:** Are all 12 people full-time? The runway arithmetic suggests some are part-time. This affects §2.
2. **M2:** Monthly Meta phasing sums to $37.5k for Feb–Sep and $41.0k for Jan–Sep, but the brief says $41.5k. Which is correct?
3. **M3:** Does "net revenue" in the plan include shipping (free) or exclude returns? The dictionary assumes it excludes returns.
4. **M4:** Where do contractor costs come from? Mila and Jonah are not in the $96k; they would come from content ($12k) and tools ($3k) or from a new line.
5. **M5:** Which email platform? Klaviyo assumed.
6. **M6:** Payment processor and whether 3-D Secure/fraud tools are active.
7. **M7:** Supplier payment terms (deposit %) for reorder cash.
8. **M8:** Is the simulated traffic generator flagged in the data layer? If not, all conversion benchmarks are distorted.
9. **M9:** Does the $340k assume any archive-sale revenue?
10. **M10:** Legal basis for email consent at checkout (default opt-in or not).
11. **M11:** Board's appetite for a lower target versus more spend.
12. **M12:** Are Arco's 74%/78% margins before or after duties and freight?

---

## 15. (N) Recommendation Legend (summary)

| Recommendation | Status | Basis |
|---|---|---|
| Base case $195k, range $140–270k | JUDGEMENT CALL built on sourced inputs | Triple Whale, Littledata, brief |
| CAC target reset to ~$80–85 | WELL-SUPPORTED (direction) | First Page Sage $66 average; stage adjustment is [J] |
| GA4 coverage standard instead of ±5% | WELL-SUPPORTED | Practitioner consensus 10–20% gap (Analytics Agent, Branvas) |
| Conversion 1.6% launch realistic | WELL-SUPPORTED | Littledata 1.4% / fashion 1.9% |
| Checkout completion 55% is ambitious | WELL-SUPPORTED | Littledata 45% avg, 59% top 20% |
| Plan seeding post rate at 30–35% | WELL-SUPPORTED | GRIN/Influee ranges |
| Build flows before campaigns | WELL-SUPPORTED | Klaviyo 2026 flow share |
| Simplified Meta structure + creative variety | WELL-SUPPORTED | Meta Andromeda post; dentsu |
| 2–3 new ads/week in Q4 | WELL-SUPPORTED | Motion micro-tier median 2.8/week |
| Fatigue rule (2 of 3) | Thresholds WELL-SUPPORTED as practitioner bands; combination is JUDGEMENT | Superads/AdSights bands |
| Three contractors instead of hires | JUDGEMENT CALL | eCommerce Placement / DTC Playbook stage guidance supports direction |
| Budget split 72/10/18 | JUDGEMENT CALL | — |
| RACIs, meetings, SLAs | JUDGEMENT CALL | — |
| Reorder point = 16 weeks of cover | JUDGEMENT CALL (formula standard; safety buffer judgement) | — |

---

## Caveats
- Most benchmarks come from vendor datasets (Triple Whale, Littledata, Klaviyo, Motion), which skew toward Shopify brands using those tools. Verdian runs a custom Next.js store, so treat these as ranges, not targets.
- The Triple Whale 2025 full-year figures were verified only through secondary copies; the Aug 2025–Jul 2026 figures were read from the live report (CPM and AOV from charts).
- Repeat-purchase benchmarks conflict: BS&Co shows 12–17% for fashion, while Eightx shows 27–35% for apparel.\[16\]\[17\] The definitions and portfolios differ, so Verdian's 18% should be read as plausible but unproven.
- Creator-seeding post-rate figures come from platform vendors with a commercial interest. The range is wide, and some vendor claims (60–90%) were excluded as promotional.
- No benchmark was found for footwear-specific blended CAC; apparel and sporting-goods figures are used as proxies.
- Scenario figures are arithmetic from brief inputs plus judgement. They should be replaced with actuals as soon as four weeks of clean data exist.

## Fuentes

1. [Shopify vs GA4: Why Your Numbers Don't Match | Analytics Agent](https://analytics-agent.app/resources/shopify-vs-ga4-data-dont-match/)
2. [Facebook Ad Benchmarks by Industry (Updated 2026 Data) | Triple Whale](https://www.triplewhale.com/blog/facebook-ads-benchmarks)
3. [Apparel eCommerce Benchmarks, compare data to stores like yours](https://useamp.com/benchmarks/apparel)
4. [Shopify vs GA4: Why Your Revenue Numbers Never Match](https://branvas.com/blogs/news/shopify-ga4-revenue-discrepancy)
5. [Average Ecommerce Conversion Rate | Littledata](https://www.littledata.io/ecommerce-conversion-rate)
6. [Average Website Performance Benchmarks | Littledata](https://www.littledata.io/average-website-performance)
7. [2025 Retail Returns Landscape | NRF](https://nrf.com/research/2025-retail-returns-landscape)
8. [How to reduce footwear returns in eCommerce with social proof](https://taggstar.com/us/blog/how-to-reduce-footwear-returns-in-ecommerce-with-social-proof/)
9. [Influencer Product Seeding: Generate Authentic Interest — CreatorDB Blog](https://creatordb.app/blog/influencer-product-seeding/)
10. [Influencer Gifting and Product Seeding: A Brand's Guide](https://influee.co/blog/influencer-gifting)
11. [Building an eCommerce Team From Scratch: A Stage-by-Stage Playbook | eCommerce Placement](https://www.ecommerceplacement.com/resources/building-an-ecommerce-team-from-scratch/)
12. [Building a DTC Team & Culture - The DTC Playbook](https://thedtcplaybook.com/team-culture/)
13. [Meta Ads CPM by Industry 2026 — Facebook & Instagram Benchmarks | Sovran](https://sovran.ai/benchmarks/meta-ads-cpm-by-industry)
14. [Facebook Ads Benchmarks by Industry (2026 Data)](https://hawky.ai/blog/facebook-ads-benchmarks)
15. [50 Cart Abandonment Rate Statistics 2026 – Cart & Checkout – Baymard](https://baymard.com/lists/cart-abandonment-rate)
16. [Average Repeat Purchase Rate by Vertical (2026) | Eightx](https://eightx.co/blog/average-repeat-purchase-rate-by-vertical)
17. [Repeat Purchase Rate Benchmarks: 18.8% Across 156K Customers | BS&Co](https://bsandco.us/blog-post/repeat-purchase-rate-benchmarks)
