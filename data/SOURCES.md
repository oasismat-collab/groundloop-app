# Public dataset sources

## `drop_off_sites.csv` — Boston municipal food-scrap drop-off locations

- **What:** Public neighbourhood food-scrap drop-off bin locations run by the City of Boston under the **Project Oscar** programme (name, neighbourhood/area, approximate coordinates).
- **Source:** City of Boston — Project Oscar, Public Works Department.
  <https://www.boston.gov/departments/public-works/project-oscar>
- **Nature of the data:** Programme facts published by a government body for public use. Coordinates are **approximate**, kept at ~4 decimal places so no listing pinpoints a private address (consistent with `.kiro/steering/privacy.md`).
- **Licence / terms:** Government open-information published for residents to use. Attribution to the City of Boston is given here and shown in the demo UI's map credit. Re-verify the live programme page before any production use; municipal programmes change.

The web demo mirrors this CSV as a JS array in `docs/prototype/data.sample.js` so the static page needs no network fetch or CSV parser and works fully offline. The CSV here is the canonical, human-readable copy and the credited source of record.

> Programme facts come from official sources (see `.kiro/steering/product.md`, principle 7). If a rule or location hasn't been re-verified, treat it as approximate and link the official guide.
