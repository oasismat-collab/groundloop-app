# Requirements – Company website (marketing landing page)

## Introduction

GroundLoop needs a public-facing marketing page that explains the product to two audiences — residents, and cities/haulers/companies — and sends each to the right place in the working demo. It is a single self-contained static page at `docs/index.html`, published with GitHub Pages at the repository root (`https://<owner>.github.io/<repo>/`), with the existing browser demo living beside it at `docs/prototype/`.

The site must look and feel like the app: it reuses the colour and type tokens from `docs/prototype/styles.css` and the inline-SVG mascots (Peel the banana, Bram the broccoli, Cora the carrot) from the prototype. Like the app and demo, all user-facing copy is rendered through a small i18n dictionary `t(key)` with English fallback.

This spec covers only the marketing page and its companion privacy page. It does not change the mobile app, the backend, or the behaviour of the demo, except to add a URL-hash entry point (`#partner`) so a link can open the demo directly on the partner dashboard.

Honour the steering files: `product.md` (business model, voice, mascots), `privacy.md` (aggregation, opt-in default off, 10-user minimum, never sell personal data) and `tech.md` ($0 budget, no build step, i18n dictionary).

## Requirements

### Requirement 1 – Single self-contained static page, $0, no build

**User story:** As a visitor, I want to open one link and immediately understand GroundLoop, so that I can decide to try the app or contact the team without any install or sign-in.

#### Acceptance criteria
1. The site SHALL be a static page at `docs/index.html` that opens directly in a browser with no build step and no server.
2. The page SHALL be self-contained: its markup, styles and script SHALL live in `docs/index.html` (plus the companion `docs/privacy.html`), with no bundler and no package install.
3. The page SHALL be publishable via GitHub Pages at the repository root so the canonical URL is `https://<owner>.github.io/<repo>/`.
4. The page SHALL use only free resources and SHALL NOT make any authenticated or key-gated network call.
5. The page SHALL produce no console errors or unhandled exceptions on load or interaction.
6. The existing demo under `docs/prototype/` SHALL remain unchanged in behaviour, except for the additive hash entry point in Requirement 10.

### Requirement 2 – Looks like the app

**User story:** As a visitor, I want the site to feel like the product, so that it reads as one coherent brand.

#### Acceptance criteria
1. The page SHALL reuse the colour tokens defined in `docs/prototype/styles.css` (forest/banana/no/share/sky palette, soft/line/ink/muted neutrals, card and pill radii).
2. The page SHALL use the same font stack as the prototype (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, …`).
3. The page SHALL render the mascots Peel, Bram and Cora as inline SVG matching the prototype's `mascots.js` (Peel with its ripeness states; Bram and Cora as themselves).
4. The page SHALL be mobile-first and responsive, usable from ~320px wide up to desktop, with no horizontal scroll.

### Requirement 3 – Hero

**User story:** As a visitor, I want a clear headline and an obvious way in, so that I can start using the app or jump to the partner story.

#### Acceptance criteria
1. The hero SHALL show the headline "Follow your food scraps back to the soil." (via i18n, matching `app.tagline`).
2. The hero SHALL show a primary button "Try the app" that links to `prototype/` (the resident demo).
3. The hero SHALL show a secondary button "For cities & companies" that smooth-scrolls to the "For cities, haulers & companies" section (Requirement 7).
4. The hero SHALL show a phone mockup previewing the app, styled consistently with the prototype's phone frame, using a mascot.

### Requirement 4 – The problem

**User story:** As a visitor, I want to understand the problem GroundLoop solves, so that the product's purpose is clear.

#### Acceptance criteria
1. The page SHALL include a "problem" section covering: food scraps going to landfill; people being unsure what is compostable; and cities not knowing where drop-off sites are needed.
2. Each problem point SHALL be presented plainly (short sentences, resident-facing language per `product.md` voice).

### Requirement 5 – How it works for residents

**User story:** As a resident, I want to see how the app fits my week, so that joining feels easy.

#### Acceptance criteria
1. The page SHALL include a "how it works" section describing the resident loop: sort it, drop it, keep your weekly streak, see your season recap.
2. The section SHALL show Peel the banana, and SHALL state that Peel rots if you stop composting (mood, not guilt — per `product.md` principle 8).

### Requirement 6 – Built for everyone

**User story:** As any visitor, I want to see GroundLoop is inclusive and free, so that I trust it serves me.

#### Acceptance criteria
1. The page SHALL include a "built for everyone" section stating: available in 6 languages; works across 13 cities in 5 countries; free forever for residents; accessible design.
2. The city/country counts SHALL match the app's data (`regions.data.js`: 13 cities, 5 countries) and the six launch locales SHALL match `i18n.js` (en, es, pt, ht, zh, vi).

### Requirement 7 – For cities, haulers & companies

**User story:** As a city or hauler, I want to see what GroundLoop offers partners, so that I can justify engaging.

#### Acceptance criteria
1. The page SHALL include a "for cities, haulers & companies" section with an `id` the hero's secondary button scrolls to.
2. The section SHALL describe: anonymized neighbourhood-level insights; where to add drop-off sites; and participation trends.
3. The section SHALL show a button "See the partner dashboard" that links to the demo opened directly on the partner view, using the hash entry point `prototype/#partner` (Requirement 10).

### Requirement 8 – Privacy promise

**User story:** As a privacy-conscious visitor, I want a clear promise about my data, so that I trust opting in.

#### Acceptance criteria
1. The page SHALL include a "privacy promise" section stating, in plain language and consistent with `privacy.md`: we never sell personal data; partners only ever see aggregates; areas with fewer than 10 opted-in users are hidden; sharing is opt-in only (default off).
2. The section SHALL link to `docs/privacy.html`.
3. `docs/privacy.html` SHALL exist as a plain-language privacy page consistent with `privacy.md`, styled with the same tokens, and SHALL link back to the home page.

### Requirement 9 – QR code and footer

**User story:** As a visitor on a laptop, I want to open the app on my phone, and as anyone I want to find the team and source.

#### Acceptance criteria
1. The page SHALL include a QR code that encodes the live app URL (the published `prototype/` URL) so a phone camera can open it.
2. The QR code SHALL be generated without a key-gated or paid service (an offline/inline generator or a free static image), consistent with the $0 and no-console-error rules.
3. The footer SHALL include the text "Built with Kiro", a link to the GitHub repository, and the team member names.

### Requirement 10 – Demo partner entry point (`#partner`)

**User story:** As a visitor who clicks "See the partner dashboard", I want the demo to open already on the partner view, so that I land on the right screen.

#### Acceptance criteria
1. The demo (`docs/prototype/app.js`) SHALL read the URL hash on load and, WHEN it is `#partner`, SHALL start in the partner dashboard view instead of the resident app.
2. The hash entry point SHALL be purely additive: with no hash, or any other hash, the demo SHALL behave exactly as before (resident app first).
3. The change SHALL not introduce console errors and SHALL not alter any existing demo flow.

### Requirement 11 – Internationalisation

**User story:** As a visitor who doesn't read English, I want the page in my language, so that the message reaches me.

#### Acceptance criteria
1. All user-facing marketing copy SHALL be rendered through a small i18n dictionary `t(key)` defined in `docs/index.html`, in the same spirit as the app's `i18n.js` — not hard-coded unreachable strings.
2. The dictionary SHALL include at least English, and SHALL fall back to English when a key is missing for the selected locale.
3. WHERE a language switcher is provided, choosing a language SHALL re-render visible copy without a page reload.
4. Data-sourced or brand-fixed strings (the product name "GroundLoop", mascot names, team names) MAY remain untranslated, consistent with `tech.md`.
