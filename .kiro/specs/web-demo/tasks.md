# Implementation plan – Web demo (browser prototype)

Build order favours a demo-able vertical slice early, then breadth. Kiro: start at the first unchecked task.

- [x] 1. Scaffold `docs/prototype/`
  - `index.html` shell: top bar (Resident / Partner switch), phone frame, dashboard panel, module script tags
  - `styles.css` from `src/theme.ts` tokens; phone-frame + dashboard layout
  - Confirm it opens with `file://` and via a static server, no build
  - _Requirements: 1.1, 1.2, 1.4, 11.1_

- [x] 2. Port pure logic into `logic.js`
  - [x] 2.1 Port `streak.ts` (`weekKey`, `streakInfo`, `ripeness`, `freezesAfter`) – _Req 4.1, 4.2_
  - [x] 2.2 Port `verdict.ts` + `items.ts` (`ITEMS`, `verdictFor`, `searchItems`) – _Req 5_
  - [x] 2.3 Port `regions.ts` (full `REGIONS`) – _Req 3.1, 7.2_
  - [x] 2.4 Port `geo.ts` (`distanceM`, `nearestSite`, `withinGeofence`, `coarse`) – _Req 6.3, 7.3, 11.3_
  - [x] 2.5 Port `badges.ts` (`badgesFor`) – _Req 6.4_
  - [x] 2.6 Fidelity spot-check: known verdict, streak count, geofence true/false match `__tests__` expectations – _Design: testing_

- [x] 3. i18n dictionary (`i18n.js`)
  - `DICT` for en, es, pt, ht, zh, vi; `t(key, locale)` with English fallback
  - All chrome strings keyed; re-render on locale change
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Sample data (`data.sample.js`)
  - Sample user (name, streak weeks, paused weeks, lastDropAt, proof mix), community posts, site requests, per-week participation, recap figures
  - Seed at least one area below 10 opted-in users so suppression is visible
  - _Requirements: 1.5, 4, 8, 9, 11, 12.2_

- [x] 5. Onboarding + mascots
  - [x] 5.1 City picker from `REGIONS`; set session city – _Req 3.1, 3.3_
  - [x] 5.2 Greeting "Hi, {name}!" with Peel→Bram→Cora rotation; reduced-motion aware – _Req 3.2_
  - [x] 5.3 Inline SVG mascots: Peel (5 ripeness states), Bram, Cora – _Req 4.2_

- [x] 6. Home screen
  - 16-week streak strip from `streakInfo`; Peel at `ripeness(lastDropAt)`
  - "Skip a day" control advances sample clock (Peel rots); no weight shown
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Check screen ("Can it go in?")
  - Search/list `ITEMS`; `verdictFor(item, city, option)`; verdict chip + reason
  - Unverified basic-rule path links official source; follow-up options for takeaway box
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Log flow (simulated proof)
  - Site picker (usual first); photo + location toggles + careful checkbox
  - Proof level via `withinGeofence`; seeds 5/10/15 + 5; show `badgesFor`; revive Peel; mark week done
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Map (Leaflet + OSM)
  - [x] 9.1 Leaflet map, OSM tiles, centre on city; site markers with popups – _Req 7.1, 7.2_
  - [x] 9.2 "Suggest a bin" pick-a-point → request at `coarse()`, shared with dashboard – _Req 7.3_
  - [x] 9.3 Curbside/none cities: explain collection model instead of markers – _Req 7.4_
  - [x] 9.4 Offline tile fallback (placeholder + hint) – _Design: error handling_

- [x] 10. Community feed
  - Sample posts with type tag; filter Everyone / current city; cheer (one per post, not own)
  - No times/locations; no quantity ranking
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 11. Season recap
  - Tap-through Wrapped-style cards: count, longest streak, photo-proof share, top items, cities, processor
  - Never show weight
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 12. You tab
  - Opt-in toggle (default off) with the `privacy.md` wording; feeds dashboard opted-in count
  - Language picker (6 locales); privacy statement ("partners see aggregates, never you")
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 13. Public dataset
  - `data/drop_off_sites.csv` (openly-licensed municipal drop-off locations) + `data/SOURCES.md` credit
  - Mirror as JS array in `data.sample.js` so the page needs no fetch/CSV parser
  - _Requirements: 13.1_

- [x] 14. Partner dashboard
  - [x] 14.1 Resident/Partner top-bar switch wiring – _Req 11.1_
  - [x] 14.2 Leaflet map: existing sites + suggested-bin requests – _Req 11.2_
  - [x] 14.3 Drop-offs per site, ranked underserved areas (cluster + `nearestSite`), weekly trend – _Req 11.2, 11.3_
  - [x] 14.4 Public-dataset layer toggle with on-map source credit – _Req 13.2, 13.3_

- [x] 15. 10-user minimum (privacy gate)
  - `aggregateByArea(records, { minUsers: 10 })`: merge < 10 into parent, suppress if still < 10
  - Suppression/merge note explaining the threshold; wire You-tab opt-in to the counter
  - _Requirements: 12.1, 12.2, 12.3_

- [ ] 16. Deploy to GitHub Pages
  - Enable Pages from `/docs` (or gh-pages); verify the public URL opens and works with no sign-in
  - Link the demo URL from `README.md` (link added; flip to [x] once Pages is enabled in repo Settings)
  - _Requirements: 1.1, 1.4_
```
