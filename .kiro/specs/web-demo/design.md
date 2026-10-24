# Design – Web demo (browser prototype)

## Overview

A single static page, `docs/prototype/index.html`, that runs the whole GroundLoop story in a browser with no login, no server and no Firebase. It contains the resident app at phone width and a partner dashboard, switchable from a top bar. All trusted values (proof level, seeds, streak, ripeness, distances) are computed with the same pure logic as the app, ported to a small inline ES-module so the demo's answers match production.

Design goals, in priority order:
1. **Opens instantly for a judge** — one file, GitHub Pages, sample mode.
2. **Faithful to the app** — reuse `src/lib` + `src/data` logic/data; don't reinvent verdicts, streak maths or geofencing.
3. **Shows the business model** — free resident side + aggregated partner side, with the privacy guarantees made literal (10-user minimum, opt-in gate, no personal data).
4. **$0 and offline-capable** — Leaflet + OSM tiles are the only external calls; everything else is inline.

## Architecture

```
docs/prototype/
  index.html        markup shell: top bar (Resident / Partner), phone frame, dashboard panel
  app.js            demo app: state, screen rendering, event wiring (ES module)
  logic.js          PORTED pure logic from src/lib + src/data (verdict, items, streak, ripeness, geo, badges, regions subset)
  i18n.js           dictionary { locale: { key } } + t(key) with English fallback
  styles.css        tokens mirrored from src/theme.ts; phone-frame + dashboard layout
  data.sample.js    sample residents, posts, site requests, streak weeks, recap figures
data/
  drop_off_sites.csv  public dataset (municipal food-scrap drop-off locations)
  SOURCES.md          source + licence credit
```

Why split files under `docs/prototype/` rather than one literal file: the requirement is "self-contained" in the sense of **no build and no server** — a static folder served by GitHub Pages satisfies that and keeps the code reviewable (judging criterion: Quality). All files are plain static assets loaded with relative paths and `<script type="module">`; there is no bundler. If a strict single-file artefact is later wanted, the modules concatenate trivially.

### Sample mode

There is a single `DEMO` flag (always true here). No code path touches `firebase`, `fetch` to an API, or auth. The only network egress is OSM tile requests from Leaflet; the UI degrades to a styled placeholder if tiles fail, so it still "runs" fully offline.

## Reusing app logic (`logic.js`)

`logic.js` is a faithful port of the pure modules. Because they are already dependency-free TypeScript, the port is a near-mechanical transcription to ES-module JS:

| App source | Ported export | Used by |
|---|---|---|
| `src/lib/streak.ts` | `weekKey`, `streakInfo`, `ripeness`, `freezesAfter` | Home streak strip, Peel, recap |
| `src/lib/verdict.ts` | `verdictFor`, `searchItems` | Check screen |
| `src/data/items.ts` | `ITEMS` | Check screen |
| `src/data/regions.ts` | `REGIONS` (full object) | Onboarding, Map, Check, recap, dashboard |
| `src/lib/geo.ts` | `distanceM`, `nearestSite`, `withinGeofence`, `coarse`, `GEOFENCE_M`, `MAX_ACCURACY_M` | Log proof, Map suggest-a-bin, dashboard gaps |
| `src/lib/badges.ts` | `badgesFor` | Log result screen |

**Fidelity rule:** these ported functions must stay behaviourally identical to the source. A short task verifies a handful of outputs against the app's unit-test expectations (e.g. a known verdict, a known streak count, a geofence true/false) so drift is caught. The port does not re-run the TS tests; it spot-checks equivalence.

## Resident app

Rendered inside a phone frame (max-width ~420px, rounded, bottom tab bar). Screens, matching the mobile app's tabs:

- **Onboarding** (Req 3): city `<select>` from `REGIONS`; on pick, a greeting overlay "Hi, {sampleName}!" with the rotating mascot (Peel/Bram/Cora by session index). Chosen `regionId` is the session's city.
- **Home** (Req 4): `WeekStrip`-style 16-week row from `streakInfo(sample.weeks, sample.paused)`; Peel SVG at `ripeness(sample.lastDropAt)`. A "skip a day" demo control advances a sample clock so judges can watch Peel rot; "log a drop-off" revives it. No weight anywhere.
- **Check** (Req 5): search/list `ITEMS`; per item call `verdictFor(item, regionId, option?)`; render verdict chip (Yes/No/Share/It depends) + reason; unverified basic-rule path links the official `source`.
- **Log** (Req 6): site picker for the city; two toggles (photo, location) + careful checkbox. Proof level derived locally: `verified` if photo AND `withinGeofence(simFix, site)` with a simulated accurate fix; else `photo` if photo; else `self`. Seeds 5/10/15 + 5 careful. Show `badgesFor(...)`, revive Peel, mark week done.
- **Map** (Req 7): Leaflet + OSM centred on the city (mean of its site coords, or a city centroid when sites are empty). Site markers with popups. "Suggest a bin" enters a pick-a-point mode; click adds a request at `coarse(lat)/coarse(lng)`, pushed into shared sample state so the dashboard sees it. Curbside/none cities show an explanation card instead of markers.
- **Community** (Req 8): sample posts with type tag, city filter (Everyone / current city), cheer button (one per post, not own). No times/locations, no quantity ranking.
- **Recap** (Req 9): tap-through story cards — count, longest streak, photo-proof share, top items, cities, processor from `REGIONS[regionId].processor`, a personality line. Never weight.
- **You** (Req 10): opt-in toggle (default off) with the exact wording from `privacy.md`; language picker (6 locales); a short privacy statement ("Partners see totals for your area, never you — and only if you opt in"). Toggling opt-in adds/removes this sample user from the dashboard's opted-in count.

### Mascots

Lightweight inline SVG for Peel (5 ripeness states via color/spot params), Bram, Cora. Reduced-motion respected via `prefers-reduced-motion` (no entrance animation). This mirrors `components/Mascot.tsx` intent without importing RN SVG.

## Partner dashboard

A wider panel (not phone-framed), reached from the top-bar switch (Req 11).

- **Map**: Leaflet showing existing sites (one color) and suggested-bin requests (another), plus the public-dataset layer toggle (Req 13).
- **Drop-offs per site**: bar list from sample aggregates.
- **Ranked underserved areas** (Req 11.3): cluster sample requests, compute each cluster's distance to the `nearestSite` via `geo.ts`, rank by request count among clusters beyond a walk threshold. Mirrors the partner-dashboard spec's gap logic at demo scale.
- **Weekly participation trend**: sample sparkline/bar series of opted-in active users per week.

### The 10-user minimum (Req 12) — the privacy centrepiece

Aggregation passes through one gate, `aggregateByArea(records, { minUsers: 10 })`:

1. Group opted-in records by area (city, then sub-area where present).
2. For each area, count **distinct opted-in users**.
3. If `< 10`, the area is **merged** into its parent city bucket; if the city still has `< 10`, it is **suppressed** and not rendered.
4. Any suppressed/merged cell renders a note: "Hidden to protect privacy — areas need at least 10 people sharing before we show them."

The sample data is seeded so at least one area is naturally below 10, so the suppression note is visible by default — the guarantee is demonstrated, not just described. The resident You-tab opt-in toggle feeds the same counter, so a judge toggling it can watch an area cross or fall below the threshold.

### Public dataset layer (Req 13)

`data/drop_off_sites.csv` holds a public, openly-licensed set of municipal food-scrap drop-off locations (columns: `name,area,city,lat,lng,source`). For the demo the CSV is also mirrored as a JS array in `data.sample.js` (so the page needs no `fetch`/CSV parser and stays offline), with `data/SOURCES.md` crediting the origin and licence. The dashboard shows a toggle "City drop-off sites (public data)" that plots these points, with an on-map credit line. Candidate source: a city open-data portal's composting/drop-off dataset (e.g. Boston Project Oscar locations), recorded with its licence in `SOURCES.md`.

## i18n (`i18n.js`)

```js
const DICT = { en: {...}, es: {...}, pt: {...}, ht: {...}, zh: {...}, vi: {...} };
export function t(key, locale) { return DICT[locale]?.[key] ?? DICT.en[key] ?? key; }
```

- Every chrome string in `index.html`/`app.js` references a key, rendered on (re)draw.
- Launch locales: `en, es, pt, ht, zh, vi`. English is the fallback.
- Scope: chrome, labels, buttons, section titles, the privacy note, tab names. Data-sourced strings (city rules, item reasons from official programmes) stay in their source language per `tech.md`.

## Styling

`styles.css` mirrors `src/theme.ts` tokens (forest/banana/no/share palette, radii) so the demo looks like the app. Light theme for the demo; a `prefers-color-scheme` dark variant is a nice-to-have, not required.

## Error handling

- **No network at all** (offline judge): everything works except OSM tiles; Leaflet containers show a neutral background with markers still placed, and a small "map tiles need internet" hint appears. All logic, screens and the dashboard remain fully usable.
- **Missing i18n key**: falls back to English (Req 2.4).
- **City with no sites**: Map explains the collection model (Req 7.4); Log restricts to that city's model.

## GitHub Pages deployment

- Publish from the `docs/` folder on the default branch (repo Settings → Pages → Source: `main` / `/docs`), or a `gh-pages` deploy — either is free.
- The demo URL becomes `https://<owner>.github.io/<repo>/prototype/`.
- No secrets, no build; `.nojekyll` not required since there are no underscore-prefixed paths, but adding one is harmless.

## Testing / verification

- Manual: open `index.html` via a static server locally (`python -m http.server docs/prototype` or just `file://`), walk each requirement.
- Logic fidelity: a tiny `logic.spec` section (console asserts or a hidden self-check) confirms a known verdict, streak count and geofence result match the app's expected values from `__tests__`.
- No change to the app's Jest suite; this spec adds no CI requirement beyond the page loading.

## Out of scope

- Real auth, real Firebase, real photo upload, Cloud Functions (deferred per `tech.md` — needs Blaze).
- `react-native-web` / porting the RN component tree (explicitly rejected).
- Full translation of data-sourced programme text.
