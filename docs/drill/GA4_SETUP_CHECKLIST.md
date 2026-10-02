# GA4 property setup drill

A new GA4 property from scratch, from memory, then checked against this list.
About 20 minutes, followed by 10–15 minutes of reports on Verdian production.

**Practice site:** `https://verdian-store-drill.vercel.app/?ga=G-XXXXXXX&debug=1`
loads GA4 directly (gtag.js, no GTM) with today's measurement ID. `?ga=none` forgets it.
The form sends `generate_lead` with `form_name: early_access`; never the email.

**Reset:** move yesterday's property to the trash (Admin → Property details →
Move to trash; GA4 keeps it 35 days), then create `Drill YYYY-MM-DD`.

## Before opening GA4 (2 minutes)

Write the objective, the KPI and the event:
waitlist before launch · sign-ups per week and sign-ups ÷ sessions · `generate_lead` (`form_name`).

## Checklist

| # | Setting | Expected | Know why |
|---|---|---|---|
| 1 | Property: name, **time zone**, **currency**, business details, objectives | Same time zone as Verdian; USD; objective "Generate leads" | Time zone decides where a "day" ends; can't be applied retroactively |
| 2 | Web stream: URL, name | `verdian-store-drill.vercel.app`, `Drill web` | One stream per site (and per app) |
| 3 | "Set up a Google tag" screen | **Install manually**, close without copying | "Use the tag found on your site" merges this property into an existing tag |
| 4 | Enhanced measurement | Decide each toggle | History page views off when the site pushes its own page_view; form interactions off when they're noisy |
| 5 | Data retention | 14 months | Limits Explorations, not standard reports or BigQuery |
| 6 | Google signals | Off | Demographics and cross-device in exchange for thresholds; needs consent |
| 7 | Reporting identity | Device-based (or know the trade-off) | Blended/Observed add user_id and modelling |
| 8 | Internal traffic | IP rule in **tag settings**, then the filter **Testing → Active** | Rules mark (`traffic_type`), filters exclude; Testing shows the effect first |
| 9 | Developer traffic filter | Active | Excludes `debug_mode` hits from reports (DebugView still shows them) |
| 10 | Session timeout / engaged-session timer | 30 min / 10 s (defaults) | Where they are and what each changes |
| 11 | Unwanted referrals, cross-domain | Know where (tag settings); not needed here | Payment providers; multiple domains |
| 12 | Key event | `generate_lead` | Marks it as the outcome that matters |
| 13 | Custom dimension | `Form name`, event scope, parameter `form_name` | Unregistered parameters are invisible in reports (but in BigQuery) |
| 14 | Test | Site with `?ga=<ID>&debug=1` → DebugView shows `page_view`, `generate_lead` with `form_name` | Debug hits skip the developer filter in DebugView |
| 15 | Annotation | "Property created" | Every change to the data gets a date |

## Log

| Date | Minutes | Looked up | Mistakes | Report question answered (Verdian) |
|---|---|---|---|---|
| | | | | |
