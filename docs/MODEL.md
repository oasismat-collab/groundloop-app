# Calculation and extension notes

Parsing (`lib/parser.ts`), food composition/default portions (`lib/catalogue.ts`), process parameters (`lib/process.ts`), calculation (`lib/calculate.ts`) and UI/explanations (`app/page.tsx`) are separate modules. No LLM or runtime composition inference is used.

## Units and accounting

`freshGrams` converts g/100g or mg/100g concentrations to grams per gram fresh input. For dry-basis composition it multiplies by (1 − moisture); unknown moisture leaves the concentration unknown. Protein-derived N divides normalized protein by the material's nitrogen factor (6.25 is labelled rough fallback).

Each returned nutrient = fresh mass × fresh concentration × its retention × applied fraction. P and K remain elemental. Organic carbon and organic matter each have independent composition and retention fields. Null anywhere leaves the output unknown. A component sum is only reported if all selected components are known. Component weights sum to the selected fresh mass; no component is counted twice. Carbon is included within organic matter, and there is intentionally no aggregate “impact mass”. Food input credit excludes all bulking-agent material. No compost-yield multiplier is applied after retention.

Portion defaults are convenience assumptions. An explicit whole-fruit gram mass is split by component defaults; explicit peel/flesh grams apply only to that part. Selecting another part resets the portion to one default unit and updates the interpretation. Invalid adjustments leave the last valid calculation in place and show an error. Unsupported/mixed inputs leave the previous result in place with a parsing error.

## Add a material

1. Select a precise food, part and preparation. Verify source table and portion. Do not use an edible food record for an excluded peel/core.
2. Check reuse rights before copying any data. Preserve URL, source record ID, publication and dataset versions. Do not place permission-required records in the active catalogue.
3. Add a stable material ID, aliases, fresh portion and moisture. For each value specify unit, fresh/dry basis, measured/derived/assumed/proxy type, source, confidence and reuse. Use null for unavailable data, including sulfur or trace nutrients.
4. Add reviewed data independently for each component and extend the food/parser catalogue. Keep model tests for whole-mass conservation and part matching.
5. To enable a quantitative return, introduce a separately versioned process with evidence for that material, route and element. Validate mass-balance boundaries, bulking inputs, leachate/gas losses and application fraction. Do not transfer a factor to every food by default.
6. Update methodology and the source register, and test fraction scaling, units, unknown propagation and licensing exclusions.

The current process is deliberately conservative. A production catalogue spanning different routes will need a material-to-process applicability table and evidence provenance per retention factor; do not broaden `evidence-v1` with a universal factor.

## Verification coverage

`tests/model.test.ts` covers fractions/counts/grams, scaling, fresh/dry conversion, mg/g conversion, whole-fruit mass conservation, unknown propagation, peel/flesh matching, retention once, independent carbon/organic matter, no water/restoration/bulking totals, visible demo metadata, unsupported inputs and mocked USDA success/fallback/error behavior. Review UI copy for new unsupported claims whenever it changes.
