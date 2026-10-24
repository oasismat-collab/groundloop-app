# Store listing & privacy metadata

This folder holds the copy and the privacy answers to enter in **App Store
Connect** and the **Google Play Console** when publishing GroundLoop. Filling
those consoles needs the Apple and Google developer accounts, so it can't be
automated from this repo — use the values here as the source of truth.

The iOS privacy manifest in `app.config.ts` (`ios.privacyManifests`) is the
machine-readable mirror of the Apple answers below; keep the two in sync.

## Files
- `listing.md` — name, subtitle, description, keywords, categories.
- `privacy-labels.md` — the data-collection answers for both stores.
