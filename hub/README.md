# Verdian Hub

Verdian's intranet-style hub: **data requests** from simulated stakeholders,
the **org chart**, and the **dashboard catalogue**. A separate Next.js app from
the store (so its visits never enter the store's GA4 data), deployed as its
own Vercel project with Root Directory `hub`.

```bash
cd hub
npm install
npm run dev        # http://localhost:3001
```

## Content

| File | What it holds |
|---|---|
| `content/people.ts` | The organization; `agent: true` people send requests (role, priorities, data they touch, style) |
| `content/requests.ts` | Request bank tagged by data-maturity level (L1–L6), plus each stakeholder's current "twists" |
| `content/dashboards.ts` | Dashboard catalogue: owner, audience, source, refresh, link |
| `content/tickets/DR-XXXX.json` | One file per ticket: request, thread, status, resolution |

## Tickets

```bash
npm run ticket                    # random stakeholder
npm run ticket -- --from lucas    # a specific stakeholder
npm run ticket -- --count 3       # several
```

The generator picks a request the stakeholder would plausibly send (not one
that's already open), crosses it with a twist from their current week, and
writes a ticket. It's template-based and free. In a Claude Code session,
Claude can rewrite a ticket in the stakeholder's voice and **answer your
clarifying questions in character** — reply by adding to the ticket's
`thread` (your messages use `"from": "arthur"`).

**Workflow:** `new` → `in_progress` → `waiting` (asked the requester
something) → `done` (fill `resolution`: summary, links, SQL) or `declined`
(explain why — e.g. the data doesn't exist yet and what it would take).

Every change is a commit; Vercel redeploys the hub.

## Maturity levels

| Level | Needs |
|---|---|
| L1 | GA4 reports / GA4-based Looker Studio |
| L2 | SQL on the GA4 BigQuery export |
| L3 | dbt models |
| L4 | Synthetic visitors' ground-truth logs |
| L5 | Inventory and cost data (not collected yet) |
| L6 | New tracking (not collected yet) |
