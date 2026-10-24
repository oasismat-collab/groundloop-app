# Groundwork

A mobile-friendly, accessible fruit-scrap explorer built with Next.js, React and TypeScript. No account or API key is required. The repository originally contained only a Word document; it has been preserved.

## Start locally

Requires Node.js 20.9+ and npm (tested tooling: Node 26.4 / npm 11).

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. For a production build:

```sh
npm run build
npm start
```

Checks:

```sh
npm test
npm run typecheck
```

`npm test` uses tsx and Node's test runner; some restricted environments block the tsx IPC socket. Run in a normal local terminal if needed. Type checking needs no service credentials. Tests use mocked USDA responses and never call a paid service.

## What works

- Deterministic parsing for banana, apple and orange; counts, plurals, half, quarter, one-third, 1/3, explicit grams, flesh, peel/skin, whole fruit and apple core.
- All four suggested phrases, graceful unsupported-food errors, editable fresh mass and component selection.
- Separate organic-matter, carbon and elemental nutrient cards. Unknown values remain unknown.
- Evidence-first view by default; optional labelled nutrient demonstration (50% N, 80% P/K retained, 100% applied).
- Separate whole-fruit component accounting, input composition details and expandable methodology.
- Versioned local seeds, source record metadata, reviewed composition and separate process assumptions.
- Server-only USDA integration with local fallback.

## Live demo (embedded)

The GroundLoop companion app (the web-demo prototype) ships as a static bundle under
[`public/prototype/`](public/prototype/) and is served at **`/prototype/`**. The home page
embeds it inline: scroll down from the hero and the **"See it for yourself"** section shows
the real app running in an `<iframe>` in sample mode — no login, no install, no server.
Links beside the embed open it full screen (`/prototype/`) and jump straight to the partner
dashboard (`/prototype/#partner`). The prototype is a single self-contained page (Leaflet +
OpenStreetMap, i18n, sample data) and makes no authenticated network calls.

## View it on GitHub Pages

The whole site is exported to static HTML so GitHub Pages can host it — no server needed.

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `feature/composting-tracker`. The [`deploy-pages`](.github/workflows/deploy-pages.yml)
   workflow builds the static export and publishes it.
3. The site goes live at **`https://<owner>.github.io/<repo>/`**
   (e.g. `https://oasismat-collab.github.io/groundloop-app/`), with the embedded demo on the
   home page and the standalone demo at `/<repo>/prototype/`.

Build it yourself the same way the workflow does:

```sh
NEXT_PUBLIC_BASE_PATH=/groundloop-app npm run build   # outputs static site to out/
```

`npm run build` uses Next's static export (`output: 'export'` in `next.config.mjs`). Because
Project Pages serve under `/<repo>`, the build sets `basePath`/`assetPrefix` from
`NEXT_PUBLIC_BASE_PATH`; locally (no env var) the site still builds at `/`. The former
`/api/usda` route was removed because API routes can't be statically hosted — the optional
source-inspection links now point to the public FoodData Central records instead, and all
displayed numbers already came from reviewed local seeds.

## USDA API

Get a key from https://fdc.nal.usda.gov/api-key-signup/ and set `USDA_API_KEY` in `.env.local`. Never prefix it with `NEXT_PUBLIC_`. Restart the development server after changing environment variables.

`GET /api/usda?material=banana-flesh` looks up the pinned FoodData Central record on the server. Supported material IDs are in `lib/catalogue.ts`. Without a key, an FDC cross-reference, or a successful upstream response, it returns the versioned local seed with an explicit reason. Invalid IDs return 400. Upstream requests time out after 8 seconds; errors and API keys are not exposed. Requests cannot choose arbitrary URLs or record IDs.

The endpoint is a source-inspection integration: live data is returned for comparison, while calculations deliberately use reviewed local records. It does not silently promote API responses into scientific estimates. The expandable methodology links to each component endpoint. Validate live-key behavior with your own key before launch. Production deployments should add rate limiting and quota monitoring to this public endpoint.

## Scientific scope

Read [data and evidence](docs/DATA.md) and [model design](docs/MODEL.md). USDA provides food composition, not compost output. We do not have a validated fruit-specific compost retention model, so **no numerical return is presented as evidence-backed** in this release. The demo is illustrative only. Neither carbon nor organic-matter return is invented. Nutrient returns can only be shown when every selected component has the necessary composition. A whole banana therefore remains unknown even though its flesh has composition data.

## Before a public launch

- Obtain qualified scientific review of composition, N conversion, portion assumptions and process applicability.
- Secure reusable banana-peel, apple-peel/core composition and validate component weights. Orange-peel USDA values are compiled estimates, with low confidence, not fresh measurements of the user's peel.
- Validate element-specific, input-to-output retention and food-only attribution for a defined composting route. Check moisture, ash/organic matter and organic carbon with suitable methods.
- Test with a real USDA key, assess quotas, add rate limiting, and review dependency updates.
- Run tests, production build, mobile/desktop browser QA, keyboard navigation and a screen-reader/accessibility audit in your deployment environment.

No food-specific water-saving, permanent sequestration, area-restoration or plant-growth equivalents are calculated.
