---
inclusion: always
---

# GroundLoop – privacy

Privacy is a product promise, not a setting. These rules bind every feature, every spec and every partner view. If a feature cannot satisfy them, it does not ship.

## What partners can see

Partner views (the partner dashboard, exports, any insight we sell) show **aggregated data only**. A partner can see:

- Counts and trends per area: drop-offs per site, participation over time, proof-quality mix.
- Suggested-bin requests and ranked underserved areas.
- Coverage: how many people a set of sites serves, in aggregate.

A partner can **never** see:

- **Names, usernames, emails** or any direct identifier.
- **Photos** — proof photos are a resident-only, verification-only artefact. They never reach a partner view.
- **Exact locations** — no home locations, no precise points for an individual. Site coordinates are approximate; resident requests are coarsened (rounded to ~4 decimal places) before aggregation.
- **Individual histories** — no "this person composted on these dates". No per-resident row ever appears in a partner view.
- **Exact drop-off times** — only week- or period-level buckets.

## The 10-user minimum (k-anonymity)

- An area is shown to partners **only if at least 10 opted-in users** contribute to it.
- An area with **fewer than 10 opted-in users is hidden or merged** into a neighbouring area until the combined area clears 10.
- This threshold applies to every partner breakdown — map cells, site stats, trend points. No small-cell leak is acceptable, even indirectly (e.g. a trend that drops to a single contributor).
- The dashboard must **show a note explaining the threshold** wherever areas are hidden or merged, so the gap is understood as a privacy guarantee, not missing data.

## Opt-in is the gate

- Sharing anonymous activity to help a city is **opt-in, default off**. The toggle wording: "Share my anonymous activity to help my city add drop-off sites."
- **Only opted-in users count** toward any partner aggregate. Opted-out residents still get every resident feature; they simply never appear in partner data.
- Opting out removes a resident from all future aggregates.

## Relationship to the rest of the stack

This file refines principle 6 of `product.md` ("Privacy first") and sets the hard constraints the `partner-dashboard` spec and any public insight must meet. When in doubt, aggregate harder and suppress smaller cells — never the reverse.
