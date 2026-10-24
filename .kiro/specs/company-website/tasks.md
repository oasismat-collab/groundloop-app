# Implementation plan – Company website (marketing landing page)

Build order: scaffold the self-contained page with tokens + mascots + i18n first, then the sections top to bottom, then the demo hash entry point and the privacy page, then verify. Kiro: start at the first unchecked task.

- [x] 1. Scaffold `docs/index.html` (self-contained shell)
  - `<!doctype html>`, viewport meta, title, description; inline `<style>` and `<script type="module">`
  - Copy the prototype's `:root` design tokens and font stack into the inline style; body gradient background
  - Reuse `.topbar` / `.btn` / `.card` / `.pill` recipes; sticky top bar with brand + language switcher + "Try the app"
  - Confirm it opens from `file://` and a static server with no build, no console error
  - _Requirements: 1.1, 1.2, 1.4, 1.5, 2.1, 2.2_

- [x] 2. Inline mascots + i18n helpers
  - [x] 2.1 Copy `peelSvg`, `bramSvg`, `coraSvg` (+ `mulberry32` and ripeness tables) from `docs/prototype/mascots.js` into the page module – _Req 2.3_
  - [x] 2.2 Add compact `DICT`, `setLocale`, `t(key, vars)` with English fallback + `{var}` interpolation; `applyI18n()` over `[data-i18n]`; wire the language switcher (re-render, no reload) – _Req 11.1, 11.2, 11.3, 11.4_

- [x] 3. Hero section
  - Headline `t('hero.title')` = "Follow your food scraps back to the soil."; subcopy
  - Primary "Try the app" → `prototype/`; secondary "For cities & companies" → smooth-scroll to `#partners` (reduced-motion aware)
  - Phone mockup: scaled `.phone`-style frame with app bar, fresh Peel SVG, sample streak strip (static)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 2.4_

- [x] 4. The problem section
  - Three points: scraps to landfill; unsure what's compostable; cities don't know where sites are needed
  - Short, resident-facing copy; mascot/emoji markers (Bram/Cora)
  - _Requirements: 4.1, 4.2_

- [x] 5. How it works for residents
  - Four steps: sort it → drop it → keep your weekly streak → see your season recap
  - Peel panel stating Peel rots if you stop (and revives after a drop-off)
  - _Requirements: 5.1, 5.2_

- [x] 6. Built for everyone
  - Four cards: 6 languages; 13 cities in 5 countries; free forever for residents; accessible design
  - Verify counts against `regions.data.js` (13/5) and `i18n.js` (6 locales)
  - _Requirements: 6.1, 6.2_

- [x] 7. For cities, haulers & companies (`#partners`)
  - Section with `id="partners"`; copy on anonymized neighbourhood insights, where to add sites, participation trends
  - Static faux-dashboard bars echoing the partner view
  - Button "See the partner dashboard" → `prototype/#partner`
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 8. Privacy promise section + `docs/privacy.html`
  - [x] 8.1 Promise lines (never sell personal data; aggregates only; <10 opted-in users hidden; opt-in only, default off); link to `privacy.html` – _Req 8.1, 8.2_
  - [x] 8.2 Create `docs/privacy.html`: plain-language privacy page consistent with `privacy.md`, same tokens/fonts, link back home – _Req 8.3_

- [x] 9. QR code block
  - Inline QR encoder (no network, no key) rendering the live `prototype/` URL to SVG/canvas; also a clickable link to the same URL
  - "Point your phone's camera" line; graceful fallback to the link if rendering fails
  - _Requirements: 9.1, 9.2_

- [x] 10. Footer
  - "Built with Kiro", GitHub repo link, team member names
  - _Requirements: 9.3_

- [x] 11. Demo `#partner` entry point
  - In `docs/prototype/app.js`, before the boot `render()`: `if (location.hash === '#partner') state.view = 'partner';`
  - Additive only: no hash / other hash → unchanged resident-first behaviour; no new console error
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 12. Responsive + accessibility pass
  - Mobile-first; two-column hero + multi-column grids at ≥820px; no horizontal scroll at 320px
  - Semantic landmarks, button-styled `<a>`s, QR `aria-label`, mascot `role="img"`, reduced-motion
  - _Requirements: 2.4, (a11y across) 1.5_

- [x] 13. Verify
  - Open via `file://` and a static server; both buttons navigate (`prototype/`, `prototype/#partner`); anchor scrolls; language switch re-renders; QR resolves to the live URL
  - Load with devtools: zero console errors on load and interaction
  - Demo regression: `prototype/` (resident first) and `prototype/#partner` (partner first) both correct
  - _Requirements: 1.5, 3.3, 7.3, 10.2, 11.3_
