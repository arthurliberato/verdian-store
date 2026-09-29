# Tracking changelog

Every change to what the store sends, GTM or GA4 settings, newest first.
Add a GA4 annotation on the same date for anything that changes the numbers.

| Date | Where | Change | Effect on data |
|---|---|---|---|
| 2026-09-28 | GitHub Actions | Scheduled synthetic traffic every 3 h | Steady volume from this date |
| ≤ 2026-09-28 (confirm) | GA4 | Form interactions turned off (was sending `form_start`) | `form_start` stops |
| ≤ 2026-09-28 (confirm) | GA4 | BigQuery daily export linked (events + user data) | Export tables from this date |
| ≤ 2026-09-28 (confirm) | GA4 | Data retention 14 months | — |
| ≤ 2026-09-28 (confirm) | GTM | v1 published: Google tag, `page_view`, catch-all eCommerce tag | Tracking starts |
