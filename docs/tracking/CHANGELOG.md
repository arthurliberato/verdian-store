# Tracking changelog

Every change to what the store sends, GTM or GA4 settings, newest first.
Add a GA4 annotation on the same date for anything that changes the numbers.

| Date | Where | Change | Effect on data |
|---|---|---|---|
| 2026-09-29 | GA4 | Annotation added: traffic scaled to the acquisition model | — |
| 2026-09-29 | GA4 | Attribution settings not available without a Google Ads link; default (data-driven) stays. Reporting uses session-scoped and first-user dimensions, and BigQuery for attribution | — (documented) |
| 2026-09-29 | GitHub Actions | Synthetic traffic scaled to the acquisition model: hourly runs, ~220 sessions/day, Meta ~70%, campaign and creative landing by calendar, `utm_term` for ad sets | Sessions jump from ~15/day; channel mix shifts to Meta; new `utm_term` and `ao_prospecting` values later |
| 2026-09-29 | GA4 | Custom channel group "Verdian channels" (Meta Paid → Newsletter → Instagram Organic → defaults) | New channel dimension; applies to past data too |
| 2026-09-29 | GA4 | Reporting identity set to Device-based; Google signals and user-provided data confirmed off | Users = devices (`_ga` client_id), same as ground truth; no signals thresholding |
| 2026-09-29 | Vercel | `NEXT_PUBLIC_GTM_ID` scoped to Production only (recreated as Config) | Preview deployments load no tracking from their next build |
| 2026-09-29 | GTM | v2 `production hostname only`: custom event triggers require Page Hostname = `verdian-store.vercel.app`. The Google tag stayed on the built-in *Initialization - All Pages* trigger (built-in triggers can't take conditions); fixed in v3 | page_view and ecommerce events stop on deployment URLs; the Google tag itself still loaded there until v3 |
| 2026-09-29 | GA4 | Cross-domain suggestions dismissed (single-domain store; the extra domain was a Vercel deployment URL) | — |
| 2026-09-29 | GA4 | Session timeout 30 min and engaged-session timer 10 s reviewed, kept at defaults | — (documented) |
| 2026-09-29 | GA4 | Key events: only `purchase`, counted once per event | — (confirmed) |
| 2026-09-29 | GA4 | Internal traffic rule (home IPv6 /64 + public IPv4) and filter **Active**; developer traffic filter **Active** | Own visits and debug traffic excluded from reports from this date |
| 2026-09-28 | GitHub Actions | Scheduled synthetic traffic every 3 h | Steady volume from this date |
| ≤ 2026-09-28 (confirm) | GA4 | Form interactions turned off (was sending `form_start`) | `form_start` stops |
| ≤ 2026-09-28 (confirm) | GA4 | BigQuery daily export linked (events + user data) | Export tables from this date |
| ≤ 2026-09-28 (confirm) | GA4 | Data retention 14 months | — |
| ≤ 2026-09-28 (confirm) | GTM | v1 published: Google tag, `page_view`, catch-all eCommerce tag | Tracking starts |
