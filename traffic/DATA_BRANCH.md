# traffic-data

Written by the **Synthetic traffic** GitHub Action (`traffic/run.ts` on the
main branch). Not website code — don't merge this branch.

- `logs/YYYY-MM-DD.jsonl` — ground truth: one line per session (visitor,
  archetype, source, device, every action, GA4 `client_id`, purchase).
  Load into BigQuery to compare with the GA4 export.
- `visitors.json` — the persistent visitor pool.
- `profiles/` — each visitor's browser state (cookies, cart), so they return
  as the same GA4 user.
