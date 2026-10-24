# Requirements – Web demo (browser prototype)

## Introduction

GroundLoop's judge-facing demo is a single, self-contained static page at `docs/prototype/index.html`, published with GitHub Pages and running in **sample mode**: no login, no network, no Firebase, no API keys. It must open on any browser and immediately show both sides of the product — the free **resident app** (phone-width) and the paid **partner dashboard** — so the business model is visible end to end.

The demo reflects the real app by reusing the pure logic and data from `src/lib` and `src/data` (`verdict.ts`, `items.ts`, `streak.ts` incl. `ripeness`, `geo.ts`, `badges.ts`, `regions.ts`). It honours the steering files `product.md` (business model), `privacy.md` (aggregation and the 10-user minimum) and `tech.md` ($0 budget, Leaflet + OpenStreetMap, i18n dictionary).

This spec covers only the browser demo. It does not change the mobile app or backend.

## Requirements

### Requirement 1 – Runs anywhere, in sample mode, $0

**User story:** As a judge, I want to open one link and use the whole product without installing anything or signing in, so that I can evaluate it in seconds.

#### Acceptance criteria
1. The demo SHALL be a single self-contained file at `docs/prototype/index.html` that opens directly in a browser with no build step and no server.
2. The demo SHALL run in sample mode with **no login** and SHALL NOT make any Firebase or authenticated network call.
3. The demo SHALL use only free resources: inline/CDN libraries, Leaflet with OpenStreetMap tiles, and no key-gated service.
4. The demo SHALL be publishable via GitHub Pages from `docs/`.
5. WHERE a value would normally come from a server (proof level, seeds, streak) the demo SHALL compute it with the same pure logic the app uses, clearly as sample data.

### Requirement 2 – Internationalisation

**User story:** As a resident who doesn't read English, I want the app in my language, so that I can sort and compost correctly.

#### Acceptance criteria
1. All user-facing chrome text SHALL be rendered through a simple i18n dictionary `t(key)`, not hard-coded in markup.
2. The dictionary SHALL include English, Spanish, Portuguese, Haitian Creole, Chinese and Vietnamese.
3. WHEN the user picks a language in the You tab THEN the system SHALL re-render visible chrome in that language without reload.
4. IF a key is missing for the chosen locale THEN the system SHALL fall back to English.

### Requirement 3 – Onboarding

**User story:** As a new resident, I want to pick my city and be greeted, so that the app feels local and personal.

#### Acceptance criteria
1. WHEN the demo first loads THEN the system SHALL show an onboarding step to pick a city from `src/data/regions.ts`.
2. WHEN a city is chosen THEN a mascot SHALL greet the user by a sample name (e.g. "Hi, Maya!") using the rotation Peel → Bram → Cora.
3. The chosen city SHALL drive the sorting rules, map sites and community filter for the rest of the session.

### Requirement 4 – Home: streak and Peel

**User story:** As a resident, I want to see my weekly streak and a mascot that reflects how recently I composted.

#### Acceptance criteria
1. The Home screen SHALL show a weekly streak strip computed with `streak.ts` (ISO week keys, consecutive done weeks).
2. The Home screen SHALL show Peel the banana at a ripeness computed by `ripeness()` from the sample "last drop-off" time: Fresh / Ripe / Spotty / Browning / Rotten.
3. WHEN sample time advances (a demo "skip days" control) THEN Peel SHALL rot accordingly, and SHALL return to Fresh after a logged drop-off.
4. The Home screen SHALL NOT display any measure of waste weight or volume.

### Requirement 5 – "Can it go in?" sorting check

**User story:** As a resident, I want a city-aware answer for whether something is compostable.

#### Acceptance criteria
1. The Check screen SHALL look up items from `src/data/items.ts` and answer using `verdict.ts` for the chosen city.
2. The answer SHALL be one of Yes / No / Share it / It depends, with the reason text from the data.
3. IF the city's rules are `basic` and the item is not core THEN the system SHALL say the rule isn't verified and link the official source, per `verdict.ts`.
4. For items with a follow-up question (e.g. takeaway box) THEN the system SHALL show the options and resolve the verdict from the chosen option.

### Requirement 6 – Log a drop-off (simulated proof)

**User story:** As a resident, I want to log a drop-off with proof so my streak is credible — simulated here, but honest about proof levels.

#### Acceptance criteria
1. The Log flow SHALL let the user pick a site for the chosen city (usual site first where applicable).
2. The Log flow SHALL offer simulated toggles for "add photo" and "share location", and SHALL derive the proof level and seeds the same way the app does: self (5) / photo (10) / verified (15), plus 5 for careful sorting.
3. WHEN location is simulated THEN the demo SHALL use `geo.ts` (`withinGeofence`, 75 m / 50 m) against the chosen site's coordinates to decide whether it reaches `verified`.
4. WHEN a drop-off is logged THEN the system SHALL show the awarded badges via `badges.ts`, revive Peel to Fresh, and mark the current week done in the streak.
5. The proof level SHALL be shown honestly (self < photo < verified) and SHALL NOT be user-editable.

### Requirement 7 – Map

**User story:** As a resident, I want a map of drop-off sites and a way to suggest a new bin.

#### Acceptance criteria
1. The Map screen SHALL render a Leaflet map with OpenStreetMap tiles centred on the chosen city.
2. The map SHALL show a marker for each drop-off site in `regions.ts` for that city, with its label and note.
3. WHEN the user clicks "Suggest a bin" and picks a point THEN the system SHALL add a sample site request at that point (coordinates coarsened per `geo.ts` `coarse()`), visible on the map and counted in the partner dashboard.
4. IF the chosen city has no drop-off sites (curbside/none) THEN the map SHALL explain the collection model instead of showing site markers.

### Requirement 8 – Community

**User story:** As a resident, I want to see and cheer community posts, so composting feels social.

#### Acceptance criteria
1. The Community screen SHALL show a feed of sample posts (reflection / tip / milestone), filterable by Everyone and the current city.
2. WHEN the user cheers a post THEN the cheer count SHALL increment by one, once per post, and the user SHALL NOT cheer their own post.
3. The feed SHALL NOT show exact drop-off times or locations, and SHALL NOT rank by waste quantity.

### Requirement 9 – Season recap

**User story:** As a resident, I want a story-style recap of my season.

#### Acceptance criteria
1. The recap SHALL be a sequence of Wrapped-style story cards advanced by tap/click.
2. The recap SHALL include drop-off count, longest streak, share with photo proof, most-checked items, cities composted in, and the local processor from `regions.ts`.
3. The recap SHALL NEVER show waste weight or volume.

### Requirement 10 – You tab: opt-in and language

**User story:** As a resident, I want to control whether my anonymous activity helps my city, and pick my language.

#### Acceptance criteria
1. The You tab SHALL show a toggle "Share my anonymous activity to help my city add drop-off sites", **default off**.
2. The You tab SHALL show a language picker for the six launch locales (Req 2).
3. WHEN the opt-in toggle is off THEN the user's activity SHALL NOT be counted in the partner dashboard aggregates; WHEN on, it SHALL be counted.
4. The You tab SHALL state plainly that partners see aggregates only and never personal data (per `privacy.md`).

### Requirement 11 – Partner dashboard view

**User story:** As a city or hauler, I want an aggregated view of where to add capacity, so I can justify paying for GroundLoop.

#### Acceptance criteria
1. The demo SHALL provide a top-level switch between the Resident app and the Partner dashboard.
2. The Partner dashboard SHALL show a Leaflet map of suggested bins and existing sites, drop-offs per site, a ranked list of underserved areas, and a weekly participation trend.
3. The ranked underserved areas SHALL be derived from sample site requests and the gap to existing sites (reusing `geo.ts` distances).

### Requirement 12 – Enforce the 10-user minimum

**User story:** As a privacy-conscious team, I want the dashboard to prove it can't expose individuals.

#### Acceptance criteria
1. The Partner dashboard SHALL display an area breakdown only WHERE at least 10 opted-in users contribute to that area.
2. WHERE an area has fewer than 10 opted-in users THEN the system SHALL hide or merge it and SHALL show a note explaining the 10-user minimum as a privacy guarantee.
3. The dashboard SHALL NOT render any breakdown that would reveal an individual, even indirectly.

### Requirement 13 – Public dataset layer

**User story:** As a partner, I want the demo grounded in a real public dataset, so the insight feels credible.

#### Acceptance criteria
1. The repository SHALL include a public dataset as a CSV under `data/` with a `SOURCES.md` crediting the source and licence.
2. The Partner dashboard SHALL offer a toggleable layer visualising that dataset on the map (e.g. municipal drop-off locations or participation reference).
3. The dataset layer SHALL be clearly credited in the UI with its source.
