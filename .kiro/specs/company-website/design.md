# Design – Company website (marketing landing page)

## Overview

A single static marketing page, `docs/index.html`, served by GitHub Pages at the repository root. It tells the GroundLoop story to two audiences (residents; cities/haulers/companies) and routes each to the right place in the existing demo at `docs/prototype/`. A companion `docs/privacy.html` carries the plain-language privacy page.

Design goals, in priority order:
1. **Opens instantly, $0, no build** — one HTML file (plus `privacy.html`), inline CSS + JS, no bundler, no network calls beyond the page itself.
2. **Looks like the app** — reuse the exact colour/type tokens from `docs/prototype/styles.css` and the inline-SVG mascots from `docs/prototype/mascots.js`.
3. **Two clear paths** — "Try the app" → `prototype/`; "See the partner dashboard" → `prototype/#partner`.
4. **Keeps every GroundLoop promise** — the privacy section and privacy page restate `privacy.md` verbatim-in-spirit; copy follows `product.md` voice; no console errors.

This page does not reuse the prototype's ES modules at runtime (keeping it self-contained and dependency-free). Instead it **copies the small, stable pieces it needs** — the `:root` design tokens and the three mascot SVG builders — inline. These are small and change rarely; the risk of drift is low and the benefit (one portable file, no module graph, works from `file://`) is high.

## File layout

```
docs/
  index.html      NEW — marketing landing page (inline <style> + <script type="module">)
  privacy.html    NEW — plain-language privacy page (same tokens)
  prototype/      UNCHANGED except app.js gains a #partner hash reader
    app.js        + read location.hash on boot → start in partner view when #partner
    …             (all other prototype files untouched)
```

Why root `index.html` + `prototype/` side by side: GitHub Pages serves `docs/` at the site root, so `docs/index.html` is the landing page and `docs/prototype/` is reachable at `/prototype/`. The marketing page links to the demo with the relative path `prototype/` (and `prototype/#partner`), which works identically on Pages and from a local static server.

## Page structure (sections, in order)

A sticky top bar (forest background, matching the prototype's `.topbar`) with the brand, a language switcher, and a "Try the app" link. Then eight sections:

1. **Hero** — headline `t('hero.title')` = "Follow your food scraps back to the soil."; subcopy; two buttons:
   - Primary "Try the app" → `prototype/` (`.btn` forest pill).
   - Secondary "For cities & companies" → anchor scroll to `#partners` (`.btn.secondary`), via `scroll-behavior: smooth` on the root and an in-page anchor; a tiny JS handler provides the smooth scroll and respects `prefers-reduced-motion`.
   - A **phone mockup**: a scaled-down `.phone`-style frame (reusing the prototype's border/radius/shadow recipe) showing an app bar, a Home-like card with a fresh **Peel** SVG and a sample weekly streak strip. Static markup — no app logic — so it is cheap and cannot error.
2. **The problem** — three cards: scraps to landfill; unsure what's compostable; cities blind to where sites are needed. Each uses a mascot or emoji marker and short copy.
3. **How it works for residents** — four steps (sort it → drop it → keep your weekly streak → see your season recap) as a numbered row/grid, plus a Peel panel with the line "Peel the banana rots if you stop" (and recovers after a drop-off), matching `product.md` principle 8.
4. **Built for everyone** — four stat/benefit cards: 6 languages; 13 cities in 5 countries; free forever for residents; accessible design. Counts are literals that match `regions.data.js` / `i18n.js`.
5. *(internal numbering)* folded into the flow above where natural.
6. **For cities, haulers & companies** — `id="partners"`. Copy on anonymized neighbourhood-level insights, where to add drop-off sites, participation trends; small faux-dashboard bars (static) echoing the partner view; button "See the partner dashboard" → `prototype/#partner` (`.btn.sky`).
7. **Privacy promise** — four promise lines (never sell personal data; partners see aggregates only; areas under 10 opted-in users hidden; opt-in only, default off) + a link to `privacy.html`. Mirrors `privacy.md`.
8. **Get the app (QR)** — a QR code encoding the live `prototype/` URL, with a short "point your phone's camera" line.
9. **Footer** — "Built with Kiro", GitHub repo link, team member names.

(The user's sections 1–8 map onto the above; "how it works" and "built for everyone" are kept as distinct sections, and the QR gets its own block before the footer.)

## Reusing the app's look

### Design tokens
Copy the prototype's `:root` custom properties (from `docs/prototype/styles.css`) into the page's inline `<style>`: `--bg, --card, --soft, --line, --ink, --muted, --forest, --forest2, --forestSoft, --banana, --bananaSoft, --no, --noSoft, --share, --sky, --skySoft, --onAccent, --radius-card, --radius-pill`. The page then styles its own marketing layout (hero grid, section rhythm, stat cards) on top of these tokens and reuses the prototype's `.topbar`, `.btn`, `.card`, `.pill` recipes so buttons and cards are visually identical.

### Font
Same stack as the prototype: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`.

### Mascots
Copy the three SVG builder functions from `docs/prototype/mascots.js` — `peelSvg(state,size)`, `bramSvg(size)`, `coraSvg(size)` (and the small `mulberry32` + ripeness tables Peel needs) — into the page's inline module. The marketing page uses: Peel (fresh) in the hero phone and a rotting-state Peel in "how it works"; Bram and Cora as friendly markers in the problem/everyone sections. These are pure string-returning functions with no DOM or framework dependency, so they inline cleanly.

## i18n

A compact dictionary in the page's inline module, same shape as `docs/prototype/i18n.js`:

```js
const DICT = { en: { 'hero.title': 'Follow your food scraps back to the soil.', … } };
function t(key, vars) { let s = DICT[current]?.[key] ?? DICT.en[key] ?? key; /* {var} interpolation */ return s; }
```

- Every marketing string is keyed; English is always present and is the fallback.
- Rendering: elements carry `data-i18n="key"`; an `applyI18n()` pass sets their text on load and on language change, mirroring the prototype's `applyStaticI18n()`.
- A small language switcher in the top bar calls `setLocale(code)` then `applyI18n()` — no reload. English ships complete; additional locales reuse the app's existing translations for shared strings (tagline, privacy wording) where available, and fall back to English otherwise. Brand-fixed strings (product name, mascot names, team names) stay literal per `tech.md`.

## QR code (Requirement 9)

Constraint: $0, no key-gated service, no console errors, ideally offline.

**Chosen approach:** generate the QR **inline in the browser** from a tiny self-contained QR encoder embedded in the page script, rendering into a `<canvas>` or inline SVG. This needs no network, no API key, and no external image, so it satisfies $0 + offline + no-console-error. The encoded payload is the canonical live URL `https://<owner>.github.io/<repo>/prototype/`; because the owner/repo are known for this repository, the URL is a literal constant in the page (with a code comment noting it must match the Pages URL).

Fallback consideration: if an inline encoder is deemed too heavy to hand-embed, a pre-generated static `.png`/`.svg` committed under `docs/` is an acceptable $0 alternative (no runtime dependency). The implementation picks the inline encoder for a crisp, resolution-independent SVG and zero extra files; the QR also doubles as a clickable link to the same URL so it works even if a camera isn't handy.

## Demo `#partner` entry point (Requirement 10)

The only change to the prototype. In `docs/prototype/app.js`, at boot (before the initial `render()`), read `location.hash`:

```js
if (location.hash === '#partner') state.view = 'partner';
```

placed immediately before the existing `setLocale(state.locale); render();` boot lines. This is additive: default state is already `view: 'resident'`, so no hash (or any other hash) preserves today's behaviour exactly. The top-bar Resident/Partner switch continues to work as before. No existing flow is altered and no new error path is introduced. (Optionally, a `hashchange` listener is out of scope — the requirement is the initial load.)

## Styling & layout

- Mobile-first: single-column stack by default; at `min-width: 820px` the hero becomes a two-column grid (copy | phone mockup) and the stat/benefit rows become multi-column grids, mirroring the prototype's `@media (max-width: 820px)` breakpoint.
- Section rhythm: generous vertical padding, `max-width` content column (~1100px, like the dashboard's `.dash`), cards reusing `--radius-card` and `--line` borders.
- The gradient background matches the prototype body (`linear-gradient(160deg, #E6EFE7 0%, #F3F6F2 60%)`).
- No horizontal scroll at 320px: buttons wrap, the phone mockup scales down with `max-width: 100%`.

## Accessibility

- Semantic landmarks: `<header>`, `<main>`, `<section>` with headings in order; the partners section target is an `id` on a section with an accessible heading.
- Buttons that navigate are `<a>` elements styled as buttons; the QR has descriptive `alt`/`aria-label` and is itself a link to the app URL.
- Colour contrast follows the app tokens (forest on white, white on forest) already used in the shipping UI.
- `prefers-reduced-motion`: smooth-scroll and any subtle transitions are disabled.
- Mascot SVGs keep the prototype's `role="img"` + `aria-label`.

## Error handling / no-console-errors

- The page performs no `fetch`, no Firebase, no auth, and loads no external script, so there is no network failure path.
- The inline module is wrapped so a thrown error in one helper cannot leave the page blank; i18n falls back to English for missing keys (so `t()` never throws).
- The QR encoder operates on a constant string and renders synchronously; if (defensively) rendering fails, the QR block still shows the clickable URL link, so the section degrades gracefully with no uncaught error.

## Testing / verification

- Manual: open `docs/index.html` via `file://` and via a static server (`python -m http.server` from `docs/`); verify both buttons navigate correctly (`prototype/` and `prototype/#partner`), the partners anchor scrolls, the language switcher re-renders, and the QR resolves to the live URL.
- Console check: load the page and interact (switch language, click each button/anchor) with devtools open; confirm zero console errors (Requirement 1.5).
- Demo regression: open `prototype/` with no hash (resident app first) and `prototype/#partner` (partner dashboard first); confirm existing flows are unchanged (Requirement 10.2).
- Responsive: check 320px, 768px and desktop widths for no horizontal scroll and a sensible layout.

## Out of scope

- Any change to the mobile app or backend.
- Any change to demo behaviour beyond the additive `#partner` hash reader.
- A full translation of every marketing string into all six locales (English is complete and is the guaranteed fallback; shared strings reuse existing app translations where available).
- A build pipeline, CSS framework, or JS bundler.
