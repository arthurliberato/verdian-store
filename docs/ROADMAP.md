# Verdian Roadmap

Verdian is an analytics practice environment: a fictional store whose data
flows through the same stack a real eCommerce analytics team uses.

```
Store (Next.js, Vercel) → GTM → GA4 → BigQuery → dbt → Looker Studio
                                   ↑
             Catalog / inventory / CRM copies loaded into BigQuery
```

## Decisions so far

- **GCP project:** `verdian-analytics` (under the `ingsliberato.com` organization).
  Analytics only — operational systems (a future CRM, live inventory) live
  elsewhere; only *copies* of their data are loaded here.
- **BigQuery location:** `US` multi-region, for every dataset. Datasets in
  different locations can't be queried together.
- **Dataset naming:** `raw_*` for data loaded as-is from a source system,
  `staging` and `marts` for dbt layers. GA4 creates `analytics_<property_id>`
  itself.
- **Same Google account** (`@ingsliberato.com`) for Google Cloud, GA4 and GTM,
  so linking works without permission issues.
- **Data layer:** exactly five events (`page_view`, `view_item`, `add_to_cart`,
  `begin_checkout`, `purchase`). See README.md.
- **Join key:** `item_id` in GA4 = `id` in `raw_catalog.products`.

## Phase 1 — Clean pipeline

- [x] Store built (104 SKUs, five-event data layer)
- [x] GCP project `verdian-analytics` created
- [x] Dataset `raw_catalog` created (US)
- [x] Catalog export script (`npm run export:catalog`)
- [x] Load `products.jsonl` into `raw_catalog.products`
- [x] Deploy the store to Vercel (https://verdian-store.vercel.app)
- [x] Create GTM container (`GTM-MTT2JZP7`)
- [x] Add the container to the site (`NEXT_PUBLIC_GTM_ID` in Vercel)
- [x] Strip `gtm_debug` from `page_path`
- [x] GA4 account + property `Verdian Store`, web stream (`G-5JNZXNTD6R`);
      history-based page views and form interactions turned off
- [x] GTM: `GA4 - Google Tag` (`send_page_view: false`, Initialization trigger)
- [x] GTM: `GA4 - page_view` tag (`page_location` rebuilt from the clean `page_path`)
- [x] GTM: one GA4 tag for all eCommerce events (`view_item`, `add_to_cart`,
      `begin_checkout`, `purchase`) with `currency: USD` — split per event later
- [x] Publish the container (`v1 - launch: pages + ecommerce`)
- [x] GA4 data retention set to 14 months
- [x] GA4 form interactions confirmed off (was still sending `form_start`)
- [x] Link GA4 to BigQuery (daily events + daily user data)
- [x] Synthetic traffic live (first manual run: 5 visitors in GA4 Realtime)
- [x] Enable BigQuery billing ($300 trial; upgrade to paid before it ends)
- [ ] Remove the sandbox 60-day expiry from existing datasets and tables
- [ ] First queries on the GA4 export (`UNNEST(items)`, join to catalog)

## Measurement maturity — GA4 + GTM

From the launch setup to a state-of-the-art stack (governance, full GA4
eCommerce spec, staging, consent, automated QA, server-side). Full plan in
[`docs/tracking/MEASUREMENT_ROADMAP.md`](tracking/MEASUREMENT_ROADMAP.md);
every change is logged in [`docs/tracking/CHANGELOG.md`](tracking/CHANGELOG.md).

- [x] Stage 0 — Launch baseline
- [ ] Stage 1 — Hygiene and governance
- [ ] Stage 2 — Tracking plan and data layer v2
- [ ] Stage 3 — Staging environment, then the GTM rebuild
- [ ] Stage 3b — Product analytics (Amplitude)
- [ ] Stage 4 — Consent and privacy
- [ ] Stage 5 — Monitoring and data quality
- [ ] Stage 6 — Server-side and first-party (optional)
- [ ] Stage 7 — Integrations
- [ ] Stage 8 — Customer accounts and `user_id`

## Phase 2 — Modeling and reporting

- [ ] dbt project: staging models for GA4 events and catalog
- [ ] Marts: funnel, revenue by line/model/colorway
- [ ] Looker Studio dashboard on the marts

## Phase 3 — Synthetic shoppers

Agents browse the live store in a real browser, so GTM and GA4 fire exactly
as they do for people. Each agent logs what it really did (the ground truth),
which is then compared with what GA4 recorded.

**Architecture**

- Claude API + Tool Runner with custom Playwright tools (`open_page`, `click`,
  `choose_size`, `add_to_cart`, `fill_checkout`, `leave_site`). Claude decides,
  code acts. (The Claude Agent SDK is built around file/terminal tools — more
  than a shopper needs.)
- Pages given to the agent as compact text built from accessibility labels,
  not screenshots.
- Guardrails: max steps per visit, timeouts, spending caps.
- Ground-truth log per action (time, persona, visit number, GA4 `client_id`
  read from the `_ga` cookie) → loaded into BigQuery `raw_agents` and joined
  to the GA4 export.
- Runs locally first, then on a schedule (e.g. GitHub Actions).

**Three layers per persona**

| Layer | Holds | Changes | Lives in |
|---|---|---|---|
| Profile | Demographics + psychographics (below), media habits | Almost never | Persona prompt |
| Life timeline | Life triggers with dates (marathon, gift, shoes worn out) | Advances daily | State file, advanced by the scheduler (code) |
| Visit context | Why they're here now (ad seen, placement, time), device, attention, mood | Every visit | Generated by the simulation |
| Memory | Summary of past visits | After each visit | Visit history |

**Persona attributes**

- Demographics: age, income, location, device
- Core motivation: durability/value, status, comfort, performance,
  sustainability, self-expression, belonging
- Aesthetic preference: minimal/earthy, technical, bold, retro
- Decision style: impulsive vs deliberate; maximizer vs satisficer
- Susceptibility to social proof and scarcity
- Brand familiarity: unaware, aware, loyal
- Risk aversion: needs reviews, free returns
- Price sensitivity
- Media habits: platforms, placements, time of day
- Life triggers (on the timeline, not in the prompt)

**Keeping it from feeling artificial**

- The simulation (code) decides the chaos — whether a visit happens, time
  and attention available, interruptions. Claude decides only what a person
  in that situation would do.
- Many sampled individuals per archetype, not one agent per persona.
- Cheap scripted background traffic: bounces, accidental clicks, window
  shoppers (the majority, as in real life).
- Limited attention: agents skim and see only part of each page.
- Agents never know they're being measured.
- Calibrate aggregates (bounce rate, pages/session, conversion, device split)
  against public eCommerce benchmarks.

**Ad exposure (Meta creatives)**

- Five creatives with the same offer and message; only wording and design
  differ. Each described by framing, tone and visual style.
- Before a visit, an agent is shown a creative and decides whether to click
  based on fit with its profile; clicks land with
  `utm_source=meta&utm_medium=paid_social&utm_content=creative_N`.
- Exercise 1: does the BigQuery analysis recover which creative attracts
  which kind of buyer (downstream behavior, not just CTR)?
- Exercise 2: simulate algorithmic delivery (each creative shown to the
  personas most likely to click it) and show how a naive creative comparison
  misleads, versus a randomized split test.

**Tasks**

- [x] Scripted visitor generator (`traffic/`): five archetypes, persistent
      returning visitors, sources with UTMs/referrers, devices, time of day,
      ground-truth JSONL log, GitHub Actions schedule (`TRAFFIC_ENABLED`)
- [ ] Persona schema + first archetypes (heritage buyer, hype teen,
      performance runner…) with sampled individuals
- [ ] Browser tools + page-to-text reader
- [ ] First agent, run locally, visually checked
- [ ] Ground-truth log → BigQuery `raw_agents`
- [ ] Scheduler, life timelines, visit context, background traffic
- [ ] Ad exposure step with five creatives
- [ ] Calibration against benchmarks
- [ ] Recovery analysis: does the stack recover each persona's known behavior?
- [x] Volume and channel mix follow the acquisition model
      (`traffic/volume.ts` reads `hub/content/acquisition.ts`): ~220
      sessions a day at launch, ~170 in December, Meta ~70%; each hourly run
      sends the sessions expected since the previous run, shaped by hour of
      day; newsletter clicks peak on Wednesdays
- [x] Campaigns follow `hub/content/campaigns.ts`: fall_launch (three ad
      sets in `utm_term`) → ao_prospecting from Nov 16, bursts on their
      dates, bf_early_access for email; each creative lands on its own
      product (creative_1 → Arco, creative_2 → Arco Muta Acid, creative_5 → Pulso…)
- [ ] Traffic spikes on drop days and after creator posts; retargeting
      traffic once a pixel exists
- [ ] Behaviour realism for CRO / behavioural analytics (Microsoft Clarity):
      scrolling with limited attention, hesitation, hovering, zoom taps on
      product images, rage clicks when something frustrates them, mis-taps on
      mobile — so heatmaps and recordings show something worth diagnosing
- [ ] Meta ads by placement: ads clicked in Instagram arrive as
      `utm_source=instagram&utm_medium=paid_social` (as in real life), so the
      channel group's rule order is actually tested
- [ ] CRO loop: find a leak in GA4 → diagnose it in Clarity → A/B test a fix
      → measure the result against ground truth

**Experimentation (A/B testing with GrowthBook)**

The concepts behind Optimizely, VWO and AB Tasty, practised for free.
GrowthBook is open source, has feature flags for Next.js and reads results
straight from BigQuery (warehouse-native). Synthetic visitors make one thing
possible that real companies never have: a *known* true effect to recover.

- [ ] GrowthBook (free cloud plan) connected to BigQuery; SDK in the store
      with an `experiment_viewed` event in the data layer → GTM → GA4
- [ ] Experiment brief template: hypothesis, primary metric, guardrail
      metrics, MDE, sample size and planned duration — written before launch
- [ ] Planted effect: agents in the variant really behave differently (e.g.
      +5% add-to-cart); does the test detect it, and how many days does it take?
- [ ] A/A test: no difference planted — how often does it show a "winner"?
- [ ] Peeking: stop at the first "significant" day vs the planned end; compare
- [ ] SRM: deliberately break the 50/50 split and catch it
- [ ] Segment traps: an effect only on mobile, hidden in the overall result
- [ ] Client-side vs server-side assignment: flicker and what it does to results

## Stakeholder requests — Verdian Hub (`hub/`)

A separate intranet-style site (own Vercel project, Root Directory `hub`)
where simulated stakeholders send data requests as tickets — public to read,
so recruiters can see how requests are scoped, clarified and resolved.

- [x] Org chart + 7 stakeholder agents (CEO, CFO, CMO, Performance Marketing,
      E-commerce, CRM, Merchandising) with priorities, data they touch, style
- [x] Request bank tagged by data maturity (L1 GA4 → L6 new tracking);
      "anything goes" — includes requests the data can't answer yet
- [x] Free ticket generator (`npm run ticket`), twists per stakeholder;
      Claude rewrites and answers in character in Claude Code sessions
- [x] Pages: home, requests (filterable), ticket threads with resolutions,
      people, dashboard catalogue
- [x] Deploy as a second Vercel project
- [x] Year 1 plans (written before launch): company plan with five pillars,
      a plan per team showing how each pillar shapes it, targets tagged by
      where they can be measured, budgets, a shared calendar, and unit
      economics (landed cost per model, shipping, fees, returns). The ticket
      generator pulls twists from initiatives running on the request date
- [ ] Work the first tickets end to end (clarify → resolve → document)
- [ ] Later, optionally: live generation/replies with an Anthropic API key;
      Slack notifications for new tickets

## Operating model (from research)

`docs/research/operating-plan-research.md` (sourced benchmarks) reshaped the
org and how it runs. Implemented in the Hub: three part-time specialists
(social, performance creative editor, bookkeeper), role cards for everyone,
meetings, RACI for six workflows, budget and incident rules, the request
queue with SLAs, a risk register, the metrics dictionary draft, and an
always-on + retargeting + bursts Meta structure with creative rules.

The July plan and acquisition model are deliberately left as they were:
reconciling them is DR-0008, and the research is the evidence for it.

Data it implies (all synthetic, generated to match the plans):
- [ ] **Order system:** the store has no backend, so `raw_orders` comes
      from the traffic generator's purchase records (the ground truth). That
      makes it the source of truth that GA4 is reconciled against,
      including the orders GA4 misses
- [ ] **Meta spend:** daily `raw_meta_ads` by campaign, ad set and ad,
      following the monthly layer split in `hub/content/campaigns.ts`, with
      CPM, CTR and frequency consistent with the traffic actually sent
- [ ] **Email, seeding tracker, returns with reason codes, inventory
      snapshots** as further raw tables, each owned by the person the RACI
      names
- [ ] GA4 order-ID coverage report (≥ 90% target) replaces "revenue within ±5%"

## Phase 4 — Inventory and margin

- [ ] Unit costs from the Hub's unit economics (`hub/content/economics.ts`)
      loaded to `raw_finance.unit_costs`; order costs and return rates alongside
- [ ] Synthetic inventory per SKU × size from the merchandising buy plan, loaded to `raw_inventory`
- [ ] Plan vs actual: Year 1 targets loaded to BigQuery and compared monthly
- [ ] Margin and stock-to-sales analysis
- [ ] Later, optionally: live stock in the store so sizes can sell out

## Phase 5 — "First week at a new job" audit

A deliberately messy version of the setup, to practise inheriting someone
else's analytics:

- Legacy version of the store with planted tracking problems
- A messy GTM container to import and audit
- Months of historical data in the GA4 export format, with an undocumented
  tracking change somewhere in it
- A stakeholder brief with questions to answer
- Deliverable: a written audit (what's broken, evidence, impact, prioritised fixes)

The list of planted problems is kept out of this repository until the audit
is done.

## Later — Site changes that break tracking

A redesign or a checkout rebuild is the most common way tracking breaks in
real companies: a renamed button, a new checkout step or a changed URL, and
events silently stop or change shape. That's why tracking QA belongs in
every release.

- [ ] A planned store redesign (for example the mobile product page, or a
      rebuilt checkout) shipped through the tracking change process
- [ ] Release QA checklist: every data layer event still fires with the
      same shape; GTM Preview and GA4 DebugView pass; purchase coverage
      unchanged
- [ ] Automated data layer tests in CI (Measurement roadmap, Stage 2) catch
      the break before release, and a deliberately unguarded change shows
      what happens when they don't
- [ ] Post-release check: compare event volumes and GA4 coverage for 7 days
      before vs after, against the ground truth

