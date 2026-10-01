# GTM conventions (container GTM-MTT2JZP7)

Anyone opening the container should be able to tell what every item does
from its name alone, find it in a folder, and see why it changed in the
version history.

## Names

`Type - Scope - Detail`, with the prefix telling you what kind of item it is.

| Item | Pattern | Examples |
|---|---|---|
| Tags | `GA4 - Config - {name}` / `GA4 - Event - {event}` | `GA4 - Config - Google Tag`, `GA4 - Event - page_view`, `GA4 - Event - ecommerce` |
| Triggers | `CE - {event}` (custom event), `Init - {condition}`, `PV - {condition}`, `Click - {what}` | `CE - page_view`, `CE - ecommerce events`, `Init - production host` |
| Variables | `DLV - {key}` (data layer), `CJS - {name}` (custom JavaScript), `Const - {name}`, `LT - {name}` (lookup table), `RT - {name}` (regex table), `URL - {part}` | `DLV - page_path`, `Const - GA4 measurement ID`, `LT - measurement ID by hostname` |

Rules:
- Event names in tag and trigger names are written exactly as they're sent (`page_view`, not "Page View").
- No personal names, dates or "test" in names; that belongs in version notes.
- The GA4 measurement ID lives in one constant variable, never typed into tags.
  In Stage 3 it becomes a lookup table by hostname without touching any tag.

## Folders

| Folder | Holds |
|---|---|
| `GA4 config` | Google tag, page_view tag, their triggers, measurement ID |
| `GA4 ecommerce` | eCommerce tags and triggers |
| `GA4 engagement` | Custom events added in Stage 2 (size selection, newsletter sign-up…) |
| `Utilities` | Data layer variables and helpers shared by several tags |

## Workspaces and versions

- One workspace per change, named after it (for example `v3 naming and folders`).
- Test every change in Preview (Tag Assistant) and GA4 DebugView before publishing.
- Every published version has a name `vN - {what changed}` and a description:
  what changed, why, how it was tested, and the expected effect on data.
- Anything that changes the numbers also gets a line in `CHANGELOG.md` and a GA4 annotation.
- No publishing within 72 hours of a drop or campaign launch (see the tracking change RACI in the Hub).
